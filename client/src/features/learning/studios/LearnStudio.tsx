import React, { useState } from 'react';
import { ConceptSection } from '@cogflow/shared';
import { ChevronDown, ChevronRight, HelpCircle, CheckCircle2, Lightbulb } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { FormattedProse } from '../../../components/ui/FormattedProse';

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
          <Card key={section.id || idx} className="overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#0c0c0e] shadow-xs">
            {/* Section Header */}
            <div
              className={`p-5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 ${
                section.collapsible ? 'cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/40' : ''
              }`}
              onClick={() => section.collapsible && toggleCollapse(section.id)}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold flex items-center justify-center shrink-0 font-mono shadow-2xs">
                  {section.order || idx + 1}
                </span>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight">
                  {section.title}
                </h3>
              </div>

              {section.collapsible && (
                <button
                  type="button"
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Section Body */}
            {!isCollapsed && (
              <div className="p-6 sm:p-7 space-y-6">
                {/* Formatted Markdown & Math Content */}
                <FormattedProse content={section.content} />

                {/* Key Takeaway Callout */}
                {section.takeaway && (
                  <div className="flex items-start gap-3.5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs leading-relaxed shadow-2xs">
                    <Lightbulb className="w-4 h-4 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block mb-1 uppercase tracking-wider text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                        Key Takeaway
                      </strong>
                      <span className="text-zinc-800 dark:text-zinc-200 text-xs">{section.takeaway}</span>
                    </div>
                  </div>
                )}

                {/* Check Yourself comprehension checkpoint */}
                {section.checkQuestion && (
                  <div className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/30 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                      <HelpCircle className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                      <span>Comprehension Check</span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                      {section.checkQuestion.question}
                    </p>

                    <div className="pt-1">
                      <button
                        onClick={() => toggleCheckAnswer(section.id)}
                        className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{isAnswerRevealed ? 'Hide Answer' : 'Reveal Answer'}</span>
                      </button>

                      {isAnswerRevealed && (
                        <div className="mt-3 p-3.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200 flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{section.checkQuestion.answer}</span>
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

