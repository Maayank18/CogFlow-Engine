import React, { useState } from 'react';
import { ConceptSection } from '@cogflow/shared';
import { ChevronDown, ChevronRight, HelpCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { Card } from '../../../components/ui/Card.js';
import { Badge } from '../../../components/ui/Badge.js';

export interface LearnStudioProps {
  sections: ConceptSection[];
  topicTitle: string;
}

export const LearnStudio: React.FC<LearnStudioProps> = ({ sections, topicTitle }) => {
  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>({});
  const [revealedCheckAnswers, setRevealedCheckAnswers] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string) => {
    setCollapsedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCheckAnswer = (id: string) => {
    setRevealedCheckAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {sections.map((section, idx) => {
        const isCollapsed = Boolean(collapsedMap[section.id]);
        const isAnswerRevealed = Boolean(revealedCheckAnswers[section.id]);

        return (
          <Card key={section.id || idx} className="overflow-hidden">
            {/* Section Header */}
            <div
              className={`p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 ${
                section.collapsible ? 'cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30' : ''
              }`}
              onClick={() => section.collapsible && toggleCollapse(section.id)}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center justify-center shrink-0">
                  {section.order || idx + 1}
                </span>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {section.title}
                </h3>
              </div>

              {section.collapsible && (
                <button
                  type="button"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Section Body */}
            {!isCollapsed && (
              <div className="p-6 space-y-5">
                {/* Content prose with formatted linebreaks */}
                <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                  {section.content}
                </div>

                {/* Key Takeaway Callout */}
                {section.takeaway && (
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/40 text-blue-900 dark:text-blue-200 text-xs leading-relaxed">
                    <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold block mb-0.5">Key Takeaway</strong>
                      <span>{section.takeaway}</span>
                    </div>
                  </div>
                )}

                {/* Check Yourself comprehension checkpoint */}
                {section.checkQuestion && (
                  <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/30 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <HelpCircle className="w-4 h-4 text-amber-500" />
                      <span>Comprehension Check:</span>
                    </div>
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {section.checkQuestion.question}
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={() => toggleCheckAnswer(section.id)}
                        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                      >
                        {isAnswerRevealed ? 'Hide Answer' : 'Reveal Answer'}
                      </button>

                      {isAnswerRevealed && (
                        <div className="mt-2 p-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                          <span>{section.checkQuestion.answer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

