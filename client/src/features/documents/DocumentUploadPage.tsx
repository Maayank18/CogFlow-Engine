import React, { useState, useEffect } from 'react';
import { UploadedDocumentData } from '@cogflow/shared';
import { api } from '../../services/api.js';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Badge } from '../../components/ui/Badge.js';
import { useToast } from '../../components/ui/Toast.js';
import {
  UploadCloud,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
} from 'lucide-react';

export interface DocumentUploadPageProps {
  onLaunchTopic: (topicId: string, initialTier?: 'B' | 'A' | 'S') => void;
}

export const DocumentUploadPage: React.FC<DocumentUploadPageProps> = ({ onLaunchTopic }) => {
  const [documents, setDocuments] = useState<UploadedDocumentData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const { success, error } = useToast();

  const fetchDocuments = async () => {
    try {
      const data = await api.documents.list();
      setDocuments(data || []);
      if (data && data.length > 0 && !selectedDocId) {
        setSelectedDocId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate size limit (25MB)
    if (file.size > 25 * 1024 * 1024) {
      error('File Too Large', 'Maximum file size is 25MB.');
      return;
    }

    setIsUploading(true);
    try {
      const newDoc = await api.documents.upload(file);
      setDocuments((prev) => [newDoc, ...prev]);
      setSelectedDocId(newDoc.id);
      success('Document Ingested', `Successfully extracted ${newDoc.detectedTopics?.length || 0} candidate syllabus topics.`);
    } catch (err) {
      error('Ingestion Failed', (err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await api.documents.delete(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      if (selectedDocId === docId) {
        setSelectedDocId(null);
      }
      success('Document Removed', 'File and extracted chunks deleted.');
    } catch (err) {
      error('Failed to delete', (err as Error).message);
    }
  };

  const selectedDoc = documents.find((d) => d.id === selectedDocId);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Syllabus & Document Ingestion
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Upload PDF lecture notes, university syllabi, or textbook chapters to extract learning modules with source references.
        </p>
      </div>

      {/* Drag & Drop Upload Zone */}
      <Card
        className={`p-8 border-2 border-dashed text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/20 hover:border-blue-400'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.pdf,.txt,.md';
          input.onchange = (e: any) => {
            if (e.target.files?.[0]) {
              handleFileUpload(e.target.files[0]);
            }
          };
          input.click();
        }}
      >
        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {isUploading ? 'Parsing syllabus & extracting headings...' : 'Drag & drop syllabus PDF or click to browse'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Supports PDF, TXT, and Markdown up to 25MB. Page-aware reconstruction maps extracted concepts directly to source chapters.
        </p>

        {isUploading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            <span>Analyzing document structure...</span>
          </div>
        )}
      </Card>

      {/* Ingested Documents & Extracted Topics */}
      {documents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Document list */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Ingested Documents ({documents.length})
            </span>

            {documents.map((doc) => {
              const isSelected = doc.id === selectedDocId;

              return (
                <Card
                  key={doc.id}
                  variant="interactive"
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-4 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2.5">
                      <FileText className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[140px]">
                          {doc.originalName}
                        </h4>
                        <span className="text-[10px] text-slate-400 block">
                          {Math.round(doc.fileSizeBytes / 1024)} KB · {doc.detectedTopics?.length || 0} topics
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc.id);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Extracted Syllabus Topics from Selected Document */}
          <div className="md:col-span-2 space-y-4">
            {selectedDoc ? (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {selectedDoc.originalName}
                    </h3>
                    <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                      Status: {selectedDoc.status.toUpperCase()} · {selectedDoc.detectedTopics?.length || 0} Detected Modules
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedDoc.detectedTopics?.map((topic, idx) => (
                    <Card key={idx} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {topic.title}
                          </h4>
                          <Badge size="sm" variant={topic.estimatedTier === 'S' ? 'tierS' : topic.estimatedTier === 'B' ? 'tierB' : 'tierA'}>
                            Tier {topic.estimatedTier}
                          </Badge>
                        </div>
                        {topic.pageReference && (
                          <span className="text-[11px] text-slate-400 font-mono">
                            Page {topic.pageReference}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {topic.description}
                      </p>

                      <div className="pt-2 flex justify-end">
                        <Button
                          size="sm"
                          onClick={() => onLaunchTopic(`syllabus-${idx}`, topic.estimatedTier)}
                          icon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          Launch in Studio
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Select an uploaded document to view detected syllabus modules.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

