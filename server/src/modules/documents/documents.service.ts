import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { UploadedDocumentModel } from '../../infrastructure/database/models/index.js';
import { inMemoryStore } from '../../infrastructure/database/inMemoryStore.js';
import { getDatabaseStatus } from '../../infrastructure/database/index.js';
import { LLMOrchestrator } from '../../infrastructure/llm/LLMOrchestrator.js';

export class DocumentsService {
  private llmOrchestrator = LLMOrchestrator.getInstance();

  async processUploadedFile(params: {
    userId: string;
    filePath: string;
    originalName: string;
    mimeType: string;
    fileSizeBytes: number;
  }) {
    const { userId, filePath, originalName, mimeType, fileSizeBytes } = params;
    const { isInMemoryMode } = getDatabaseStatus();

    try {
      let extractedText = '';
      let pageCount = 1;
      const chunks: Array<{ pageNumber: number; text: string }> = [];

      if (mimeType === 'application/pdf' || originalName.toLowerCase().endsWith('.pdf')) {
        const fileBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(fileBuffer);
        extractedText = pdfData.text || '';
        pageCount = pdfData.numpages || 1;

        // Split text roughly by pages
        const rawPages = extractedText.split(/\f|\n\s*\n\s*\n/);
        rawPages.forEach((pageText, idx) => {
          if (pageText.trim()) {
            chunks.push({ pageNumber: idx + 1, text: pageText.trim() });
          }
        });
      } else {
        // Plain text / markdown
        extractedText = fs.readFileSync(filePath, 'utf-8');
        chunks.push({ pageNumber: 1, text: extractedText });
      }

      // Extract syllabus topics via LLM or Heuristics
      const extractionResult = await this.llmOrchestrator.extractSyllabusTopics(extractedText);

      const docRecord = {
        userId,
        fileName: path.basename(filePath),
        originalName,
        mimeType,
        fileSizeBytes,
        extractedHeadingCount: extractionResult.topics.length,
        detectedTopics: extractionResult.topics,
        chunks,
        status: 'ready' as const,
      };

      if (isInMemoryMode) {
        return inMemoryStore.uploadedDocuments.create(docRecord);
      } else {
        return UploadedDocumentModel.create(docRecord);
      }
    } catch (error) {
      console.error('[DocumentsService] Failed to process document:', error);
      const failedRecord = {
        userId,
        fileName: path.basename(filePath),
        originalName,
        mimeType,
        fileSizeBytes,
        extractedHeadingCount: 0,
        detectedTopics: [],
        chunks: [],
        status: 'failed' as const,
        errorMessage: (error as Error).message,
      };

      if (isInMemoryMode) {
        return inMemoryStore.uploadedDocuments.create(failedRecord);
      } else {
        return UploadedDocumentModel.create(failedRecord);
      }
    }
  }

  async listDocuments(userId: string) {
    const { isInMemoryMode } = getDatabaseStatus();
    if (isInMemoryMode) {
      return inMemoryStore.uploadedDocuments.find((d) => d.userId === userId);
    }
    return UploadedDocumentModel.find({ userId }).sort({ createdAt: -1 });
  }

  async getDocument(docId: string, userId: string) {
    const { isInMemoryMode } = getDatabaseStatus();
    if (isInMemoryMode) {
      const doc = inMemoryStore.uploadedDocuments.findById(docId);
      if (!doc || doc.userId !== userId) return null;
      return doc;
    }
    return UploadedDocumentModel.findOne({ _id: docId, userId });
  }

  async deleteDocument(docId: string, userId: string) {
    const { isInMemoryMode } = getDatabaseStatus();
    if (isInMemoryMode) {
      return inMemoryStore.uploadedDocuments.deleteOne(docId);
    }
    const result = await UploadedDocumentModel.deleteOne({ _id: docId, userId });
    return result.deletedCount > 0;
  }
}

export const documentsService = new DocumentsService();
