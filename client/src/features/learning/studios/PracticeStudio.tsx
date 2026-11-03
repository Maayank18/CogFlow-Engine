import React, { useState } from 'react';
import { AssessmentQuestion, PedagogicalTier } from '@cogflow/shared';
import { Card } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { Badge } from '../../../components/ui/Badge.js';
import { useToast } from '../../../components/ui/Toast.js';
import { api } from '../../../services/api.js';
import { CheckCircle2, XCircle, Award, Sparkles, AlertCircle, RefreshCw, Send } from 'lucide-react';

export interface PracticeStudioProps {
  topicId: string;
  tier: PedagogicalTier;
  questions: AssessmentQuestion[];
  onCompleted?: () => void;
}

export const PracticeStudio: React.FC<PracticeStudioProps> = ({
  topicId,
  tier,
  questions,
  onCompleted,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [conceptualAnswers, setConceptualAnswers] = useState<Record<string, string>>({});
  const [submittedResult, setSubmittedResult] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleSelectMCQ = (questionId: string, optionIndex: number) => {
    if (submittedResult) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleConceptualChange = (questionId: string, text: string) => {
    if (submittedResult) return;
    setConceptualAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Assessment Header Banner */}
      <Card className="p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/60 dark:border-blue-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={tier === 'S' ? 'tierS' : tier === 'B' ? 'tierB' : 'tierA'}>
                Tier {tier} Assessment
              </Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {questions.length} Evaluative Challenges
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Interactive Conceptual Verification
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
              Demonstrate conceptual mastery across multiple-choice logic and open-ended pedagogical reasoning evaluated against semantic rubrics.
            </p>
          </div>

          {submittedResult && (
            <div className="flex items-center gap-3 bg-white dark:bg-[#121824] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
              <Award
                className={`w-8 h-8 ${
                  submittedResult.passed ? 'text-teal-500' : 'text-amber-500'
                }`}
              />
              <div>
                <span className="text-xs text-slate-400 block font-medium">Result</span>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {submittedResult.percentage}% ({submittedResult.score}/{submittedResult.maximumScore})
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Semantic Rubric Scorecard (Shown after submission) */}
      {submittedResult && (
        <Card className="p-6 space-y-4 border-teal-500/40 dark:border-teal-500/30">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-500" />
              <span>Semantic Rubric Feedback & Diagnosis</span>
            </h4>
            <Button size="sm" variant="outline" onClick={handleReset} icon={<RefreshCw className="w-3.5 h-3.5" />}>
              Retake Assessment
            </Button>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            {submittedResult.overallFeedback}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Strengths */}
            {submittedResult.strengths?.length > 0 && (
              <div className="p-3.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40">
                <span className="text-xs font-semibold text-teal-800 dark:text-teal-300 block mb-2">
                  Conceptual Strengths:
                </span>
                <ul className="space-y-1">
                  {submittedResult.strengths.map((str: string, i: number) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing or Revision */}
            {submittedResult.missingConcepts?.length > 0 && (
              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 block mb-2">
                  Recommended Revision Points:
                </span>
                <ul className="space-y-1">
                  {submittedResult.missingConcepts.map((miss: string, i: number) => (
                    <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                      <span>{miss}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, idx) => {
          const evalAnswer = submittedResult?.answers?.find((a: any) => a.questionId === q.id);

          return (
            <Card key={q.id || idx} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center justify-center text-slate-700 dark:text-slate-300">
                    {idx + 1}
                  </span>
                  <Badge size="sm" variant={q.type === 'concept' ? 'tierS' : 'primary'}>
                    {q.type === 'concept' ? 'Semantic Concept' : 'Multiple Choice'}
                  </Badge>
                </div>
                <span className="text-xs text-slate-400 font-medium">Max: {q.maxScore} pts</span>
              </div>

              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                {q.prompt}
              </p>

              {/* Multiple Choice Options */}
              {q.type === 'mcq' && q.options && (
                <div className="space-y-2 pt-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx;
                    const isCorrectAnswer = optIdx === q.correctAnswerIndex;
                    const showFeedback = Boolean(submittedResult);

                    let optionStyle =
                      'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-blue-400';

                    if (showFeedback) {
                      if (isCorrectAnswer) {
                        optionStyle = 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-teal-100';
                      } else if (isSelected && !isCorrectAnswer) {
                        optionStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-500 text-blue-900 dark:text-blue-100';
                    }

                    return (
                      <button
                        type="button"
                        key={optIdx}
                        disabled={Boolean(submittedResult)}
                        onClick={() => handleSelectMCQ(q.id, optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-md border text-[11px] font-bold flex items-center justify-center">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {showFeedback && isCorrectAnswer && (
                          <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
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
              {q.type === 'concept' && (
                <div className="space-y-2 pt-2">
                  <textarea
                    rows={4}
                    disabled={Boolean(submittedResult)}
                    placeholder="Articulate the core mechanism, boundary conditions, and causal logic in your own words..."
                    value={conceptualAnswers[q.id] || ''}
                    onChange={(e) => handleConceptualChange(q.id, e.target.value)}
                    className="w-full text-xs p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-relaxed disabled:opacity-75"
                  />
                  {q.rubricCriteria && q.rubricCriteria.length > 0 && (
                    <div className="text-[11px] text-slate-400">
                      <strong>Evaluation Rubric:</strong> {q.rubricCriteria.join(' • ')}
                    </div>
                  )}
                </div>
              )}

              {/* Question Feedback Explanation */}
              {evalAnswer && evalAnswer.feedback && (
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300 mt-2">
                  <strong className="block mb-0.5">Evaluation Feedback:</strong>
                  {evalAnswer.feedback}
                </div>
              )}
            </Card>
          );
        })}

        {!submittedResult && (
          <div className="flex justify-end pt-2">
            <Button
              size="lg"
              type="submit"
              isLoading={isSubmitting}
              icon={<Send className="w-4 h-4" />}
            >
              Submit for Semantic Evaluation
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

