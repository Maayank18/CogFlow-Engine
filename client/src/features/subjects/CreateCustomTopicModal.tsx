import React, { useState } from 'react';
import { Sparkles, X, BookOpen, Layers, ArrowRight, CheckCircle2, Zap, Brain, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../services/api';
import { addCustomTopicOrSubject, getMergedCurriculumCatalog } from './catalogData';
import { useToast } from '../../components/ui/Toast';

export interface CreateCustomTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopicCreated: (topicId: string, initialTier: 'B' | 'A' | 'S') => void;
}

const INSPIRATION_PRESETS = [
  { title: 'Rust Memory Safety & Lifetimes', subject: 'Systems Programming', category: 'Computer Science', tier: 'A' as const },
  { title: 'Quantum Computing & Qubits', subject: 'Quantum Physics', category: 'Physics', tier: 'B' as const },
  { title: 'Graph Neural Networks (GNN)', subject: 'Artificial Intelligence', category: 'Computer Science', tier: 'S' as const },
  { title: 'PostgreSQL B-Tree Internals', subject: 'Database Systems', category: 'Computer Science', tier: 'A' as const },
  { title: 'Calculus: Backpropagation Proof', subject: 'Machine Learning Mathematics', category: 'Mathematics', tier: 'S' as const },
  { title: 'CRISPR-Cas9 Gene Editing', subject: 'Molecular Biology', category: 'Engineering', tier: 'B' as const },
  { title: 'Kafka Distributed Commit Log', subject: 'Distributed Systems', category: 'Computer Science', tier: 'A' as const },
  { title: 'Linux Cgroups & Namespaces', subject: 'Operating Systems', category: 'Computer Science', tier: 'A' as const },
];

const CATEGORIES = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Engineering',
  'Biology',
  'Chemistry',
  'General Science',
];

export const CreateCustomTopicModal: React.FC<CreateCustomTopicModalProps> = ({
  isOpen,
  onClose,
  onTopicCreated,
}) => {
  const { success, error, info } = useToast();
  const [topicTitle, setTopicTitle] = useState('');
  const [subjectTitle, setSubjectTitle] = useState('Computer Science & Distributed Systems');
  const [isNewSubject, setIsNewSubject] = useState(false);
  const [newSubjectTitle, setNewSubjectTitle] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [summary, setSummary] = useState('');
  const [tier, setTier] = useState<'B' | 'A' | 'S'>('A');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  if (!isOpen) return null;

  const catalog = getMergedCurriculumCatalog();
  const existingSubjectTitles = catalog.map((s) => s.title);

  const handleApplyPreset = (preset: typeof INSPIRATION_PRESETS[0]) => {
    setTopicTitle(preset.title);
    setSubjectTitle(preset.subject);
    setIsNewSubject(!existingSubjectTitles.includes(preset.subject));
    if (!existingSubjectTitles.includes(preset.subject)) {
      setNewSubjectTitle(preset.subject);
    }
    setCategory(preset.category);
    setTier(preset.tier);
    setSummary(`In-depth study of ${preset.title} covering foundational mental models, architecture, code, and practice.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim()) {
      error('Please enter a topic title to study.');
      return;
    }

    const effectiveSubjectTitle = isNewSubject
      ? (newSubjectTitle.trim() || 'Custom Studies')
      : subjectTitle;

    setIsGenerating(true);
    setGenerationStep('Configuring curriculum catalog...');

    try {
      // 1. Persist to local catalog cache first (ensures instant availability)
      const { topic, subject } = addCustomTopicOrSubject({
        subjectTitle: effectiveSubjectTitle,
        category,
        topicTitle: topicTitle.trim(),
        summary: summary.trim() || `Comprehensive curriculum for ${topicTitle.trim()} synthesized by CogFlow AI.`,
        difficultyBaseline: tier,
      });

      setGenerationStep('Syncing with CogFlow engine backend...');

      // 2. Try creating topic on backend API
      try {
        await api.subjects.createTopic({
          title: topic.title,
          subjectIdOrSlug: subject.slug || subject.id,
          category,
          summary: topic.summary,
          difficultyBaseline: tier,
          estimatedMinutes: 30,
        });
      } catch (backendErr) {
        console.warn('[CreateTopicModal] Backend sync deferred (using client cache):', backendErr);
      }

      setGenerationStep('Synthesizing 5 interactive learning studios with AI...');

      // Brief transition delay for visual feedback of generation
      await new Promise((r) => setTimeout(r, 600));

      success(`Curriculum generated for "${topic.title}"! Launching learning cockpit...`);
      onClose();
      onTopicCreated(topic.slug || topic.id, tier);
    } catch (err: any) {
      console.error('[CreateTopicModal] Creation error:', err);
      error(err.message || 'Failed to create custom topic. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in font-sans">
      <div
        className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 md:p-7 border-b border-zinc-100 dark:border-zinc-800/80 flex items-start justify-between relative bg-zinc-50/50 dark:bg-zinc-900/20">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-400 dark:text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-zinc-950 dark:text-white font-display flex items-center gap-2">
                Study Any Topic with AI
                <Badge size="sm" variant="flow" className="font-mono text-[10px]">
                  On-Demand
                </Badge>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Enter any scientific subject, software engineering framework, paper, or theorem. CogFlow will synthesize an interactive 5-studio curriculum.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 md:p-7 overflow-y-auto space-y-6 flex-1">
          {/* Quick Inspiration Pills */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
              Quick Inspiration (1-Click Fill)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {INSPIRATION_PRESETS.map((p) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="text-[11px] px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Topic Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                Topic Title <span className="text-rose-500">*</span>
              </label>
              <Input
                placeholder="e.g. Rust Borrow Checker & Lifetimes, Raft Consensus, Quantum Entanglement"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                autoFocus
                required
                className="text-sm font-medium"
              />
            </div>

            {/* Subject Association */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                    Parent Subject
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsNewSubject(!isNewSubject)}
                    className="text-[11px] text-zinc-500 hover:text-zinc-900 dark:hover:text-white underline font-medium"
                  >
                    {isNewSubject ? 'Select existing' : '+ New subject'}
                  </button>
                </div>

                {isNewSubject ? (
                  <Input
                    placeholder="e.g. Distributed Systems, Quantum Physics"
                    value={newSubjectTitle}
                    onChange={(e) => setNewSubjectTitle(e.target.value)}
                    className="text-xs"
                  />
                ) : (
                  <select
                    value={subjectTitle}
                    onChange={(e) => setSubjectTitle(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                  >
                    {existingSubjectTitles.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                  Discipline Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Pedagogical Tier */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                Target Difficulty Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setTier('B')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    tier === 'B'
                      ? 'border-zinc-950 dark:border-white bg-zinc-950/5 dark:bg-white/5 ring-1 ring-zinc-950 dark:ring-white'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                  }`}
                >
                  <span className="text-xs font-bold text-zinc-950 dark:text-white block">
                    Tier B • Foundations
                  </span>
                  <span className="text-[11px] text-zinc-500 leading-tight block mt-1">
                    Analogy-first intuition, mental models, zero jargon.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTier('A')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    tier === 'A'
                      ? 'border-zinc-950 dark:border-white bg-zinc-950/5 dark:bg-white/5 ring-1 ring-zinc-950 dark:ring-white'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                  }`}
                >
                  <span className="text-xs font-bold text-zinc-950 dark:text-white block">
                    Tier A • Core Standard
                  </span>
                  <span className="text-[11px] text-zinc-500 leading-tight block mt-1">
                    Production architecture, diagrams, idiomatic code.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTier('S')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    tier === 'S'
                      ? 'border-zinc-950 dark:border-white bg-zinc-950/5 dark:bg-white/5 ring-1 ring-zinc-950 dark:ring-white'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                  }`}
                >
                  <span className="text-xs font-bold text-zinc-950 dark:text-white block">
                    Tier S • Advanced Rigor
                  </span>
                  <span className="text-[11px] text-zinc-500 leading-tight block mt-1">
                    Mathematical limits, failure modes, invariant proofs.
                  </span>
                </button>
              </div>
            </div>

            {/* Custom Focus / Summary Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                Custom Focus / Specific Questions (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Focus on memory ownership benchmarks, compare with C++ smart pointers, and include 10 comprehensive MCQs."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white resize-none"
              />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-5 md:p-6 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/20 flex items-center justify-between">
          <div className="text-xs text-zinc-500 font-mono">
            {isGenerating ? (
              <span className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-950 dark:text-white" />
                <span>{generationStep}</span>
              </span>
            ) : (
              <span>5 Studios • 10 MCQ Practice Exams</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isGenerating}
              className="text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={isGenerating || !topicTitle.trim()}
              className="text-xs rounded-xl inline-flex items-center gap-1.5 font-bold shadow-xs px-5"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate & Study Now</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
