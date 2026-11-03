import React, { useState } from 'react';
import { AssessmentQuestion, PedagogicalTier } from '@cogflow/shared';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useToast } from '../../../components/ui/Toast';
import { api } from '../../../services/api';
import {
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Send,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';

export interface PracticeStudioProps {
  topicId: string;
  tier: PedagogicalTier;
  questions: AssessmentQuestion[];
  onCompleted?: () => void;
}

export const PracticeStudio: React.FC<PracticeStudioProps> = ({
  topicId,
  tier,
  questions = [],
  onCompleted,
}) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [conceptualAnswers, setConceptualAnswers] = useState<Record<string, string>>({});
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const currentQ = questions[activeQuestionIndex] || questions[0];
  const totalQuestions = questions.length;
  const answeredCount =
    Object.keys(selectedAnswers).length +
    Object.keys(conceptualAnswers).filter((k) => conceptualAnswers[k]?.trim().length > 0).length;

  const handleSelectMCQ = (questionId: string, optionIndex: number) => {
    if (submittedResult) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleConceptualChange = (questionId: string, text: string) => {
    if (submittedResult) return;
    setConceptualAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);

    try {
      const payloadAnswers = questions.map((q) => ({
        questionId: q.id,
        type: q.type,
        selectedOptionIndex: selectedAnswers[q.id],
        conceptualAnswerText: conceptualAnswers[q.id] || '',
      }));

      const result = await api.assessments.submitAttempt(topicId, tier, payloadAnswers);
      setSubmittedResult(result);
      success('Assessment Evaluated', `You scored ${result.percentage}% at Tier ${tier}!`);
      if (onCompleted) {
        onCompleted();
      }
    } catch (err) {
      error('Evaluation Failed', (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setConceptualAnswers({});
    setSubmittedResult(null);
    setActiveQuestionIndex(0);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="p-12 text-center text-zinc-500">
        <p className="text-sm font-mono">No practice questions available for this module.</p>
      </div>
    );
  }

  const evalAnswer = submittedResult?.answers?.find((a: any) => a.questionId === currentQ?.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 font-sans">
      {/* Assessment Header Banner - Pure Monochrome Minimalist */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
              Tier {tier}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              {answeredCount}/{totalQuestions} Answered
            </span>
          </div>
          <h3 className="text-base font-extrabold text-zinc-950 dark:text-white font-display">
            Interactive Conceptual Practice & Verification
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl leading-relaxed">
            Rigorous evaluative challenges calibrated to solidify invariants, diagnose edge-case logic, and test boundary conditions.
          </p>
        </div>

        {submittedResult ? (
          <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shrink-0">
            <Award
              className={`w-7 h-7 ${
                submittedResult.passed ? 'text-emerald-500' : 'text-amber-500'
              }`}
            />
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">Final Score</span>
              <span className="text-lg font-black text-zinc-950 dark:text-white font-display">
                {submittedResult.percentage}%{' '}
                <span className="text-xs text-zinc-500 font-mono font-normal">
                  ({submittedResult.score}/{submittedResult.maximumScore} pts)
                </span>
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => handleSubmit()}
              isLoading={isSubmitting}
              icon={<Send className="w-3.5 h-3.5" />}
              className="bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 font-bold"
            >
              Submit ({answeredCount}/{totalQuestions})
            </Button>
          </div>
        )}
      </div>

      {/* Semantic Rubric Scorecard (Shown after submission) */}
      {submittedResult && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#09090b] border border-emerald-500/40 dark:border-emerald-500/30 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white font-display">
                Semantic Evaluation & Invariant Diagnosis
              </h4>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
              className="border-zinc-300 dark:border-zinc-700 text-xs"
            >
              Retake Assessment
            </Button>
          </div>

          <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
            {submittedResult.overallFeedback}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Strengths */}
            {submittedResult.strengths?.length > 0 && (
              <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block mb-2 font-mono">
                  Conceptual Strengths:
                </span>
                <ul className="space-y-1">
                  {submittedResult.strengths.map((str: string, i: number) => (
                    <li key={i} className="text-xs text-zinc-800 dark:text-zinc-200 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing or Revision */}
            {submittedResult.missingConcepts?.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 block mb-2 font-mono">
                  Recommended Revision Points:
                </span>
                <ul className="space-y-1">
                  {submittedResult.missingConcepts.map((miss: string, i: number) => (
                    <li key={i} className="text-xs text-zinc-800 dark:text-zinc-200 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                      <span>{miss}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Question Stepper / Navigator Bar */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
        <div className="flex items-center gap-1.5">
          {questions.map((q, idx) => {
            const isCurrent = idx === activeQuestionIndex;
            const isAnswered =
              q.type === 'mcq'
                ? selectedAnswers[q.id] !== undefined
                : Boolean(conceptualAnswers[q.id]?.trim());

            return (
              <button
                key={q.id || idx}
                onClick={() => setActiveQuestionIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center relative ${
                  isCurrent
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs ring-1 ring-zinc-400 dark:ring-zinc-600'
                    : isAnswered
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                    : 'bg-transparent text-zinc-500 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60'
                }`}
                title={`Question ${idx + 1}`}
              >
                <span>{idx + 1}</span>
                {isAnswered && !isCurrent && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={activeQuestionIndex === 0}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-30 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-semibold text-zinc-500 px-1">
            {activeQuestionIndex + 1} / {totalQuestions}
          </span>
          <button
            onClick={() => setActiveQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
            disabled={activeQuestionIndex === totalQuestions - 1}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-30 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Question Focus Card */}
      {currentQ && (
        <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-xs font-mono font-bold flex items-center justify-center text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800">
                {activeQuestionIndex + 1}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                {currentQ.type === 'concept' ? 'Conceptual Rubric Challenge' : 'Multiple Choice Invariant'}
              </span>
            </div>
            <span className="text-xs text-zinc-400 font-mono font-medium">
              Max: {currentQ.maxScore} pts
            </span>
          </div>

          <h4 className="text-base font-bold text-zinc-950 dark:text-zinc-100 leading-relaxed font-sans">
            {currentQ.prompt}
          </h4>

          {/* Multiple Choice Options */}
          {currentQ.type === 'mcq' && currentQ.options && (
            <div className="space-y-2.5 pt-1">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === optIdx;
                const isCorrectAnswer = optIdx === currentQ.correctAnswerIndex;
                const showFeedback = Boolean(submittedResult);

                let optionStyle =
                  'bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600';

                if (showFeedback) {
                  if (isCorrectAnswer) {
                    optionStyle =
                      'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-semibold';
                  } else if (isSelected && !isCorrectAnswer) {
                    optionStyle =
                      'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-100';
                  }
                } else if (isSelected) {
                  optionStyle =
                    'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-xs font-semibold';
                }

                return (
                  <button
                    type="button"
                    key={optIdx}
                    disabled={Boolean(submittedResult)}
                    onClick={() => handleSelectMCQ(currentQ.id, optIdx)}
                    className={`w-full text-left p-4 rounded-xl border text-xs leading-relaxed transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-md border text-[11px] font-mono font-bold flex items-center justify-center shrink-0 ${
                          isSelected && !showFeedback
                            ? 'bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white border-transparent'
                            : 'border-zinc-300 dark:border-zinc-700'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {showFeedback && isCorrectAnswer && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                    {showFeedback && isSelected && !isCorrectAnswer && (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Open-Ended Conceptual Answer Textarea */}
          {currentQ.type === 'concept' && (
            <div className="space-y-3 pt-1">
              <textarea
                rows={5}
                disabled={Boolean(submittedResult)}
                placeholder="Articulate the core mechanism, boundary conditions, failure modes, and trade-offs in your own words..."
                value={conceptualAnswers[currentQ.id] || ''}
                onChange={(e) => handleConceptualChange(currentQ.id, e.target.value)}
                className="w-full text-xs p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 leading-relaxed disabled:opacity-75 font-sans"
              />
              {currentQ.rubricCriteria && currentQ.rubricCriteria.length > 0 && (
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                  <strong className="text-zinc-700 dark:text-zinc-300">Rubric Criteria:</strong>{' '}
                  {currentQ.rubricCriteria.join(' • ')}
                </div>
              )}
            </div>
          )}

          {/* Explanation Callout (Shown upon submission or selection review) */}
          {(submittedResult || evalAnswer) && currentQ.explanation && (
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 space-y-1">
              <span className="font-mono font-bold text-zinc-950 dark:text-white block">
                Technical Explanation:
              </span>
              <p className="leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Stepper Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeQuestionIndex === 0}
              className="px-3.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold disabled:opacity-30 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition flex items-center gap-1.5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {activeQuestionIndex < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={() => setActiveQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="px-4 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Next Challenge</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : !submittedResult ? (
              <Button
                size="sm"
                onClick={() => handleSubmit()}
                isLoading={isSubmitting}
                icon={<Send className="w-3.5 h-3.5" />}
                className="bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 font-bold"
              >
                Submit All Questions
              </Button>
            ) : (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Practice</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
