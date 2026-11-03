import React, { useState } from 'react';
import { CodeExampleData } from '@cogflow/shared';
import { Card } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { Badge } from '../../../components/ui/Badge.js';
import { Copy, Check, Terminal, Clock, Database, AlertTriangle, ArrowRight } from 'lucide-react';

export interface CodeStudioProps {
  codeExample: CodeExampleData;
}

export const CodeStudio: React.FC<CodeStudioProps> = ({ codeExample }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = codeExample.code.split('\n');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Code Viewer Card */}
      <Card className="overflow-hidden">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-slate-300 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-slate-100">{codeExample.title}</span>
            <Badge size="sm" variant="neutral" className="bg-slate-800 text-slate-400 border-slate-700">
              {codeExample.language}
            </Badge>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="text-slate-300 hover:text-white hover:bg-slate-800 h-8"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-xs text-teal-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-xs">Copy Code</span>
              </>
            )}
          </Button>
        </div>

        {/* Code Editor Body */}
        <div className="bg-[#0b0f17] text-slate-200 p-4 font-mono text-xs overflow-x-auto leading-relaxed">
          <table className="border-collapse w-full">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="pr-4 select-none text-slate-600 text-right w-8">{idx + 1}</td>
                  <td className="whitespace-pre">{line}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Code Explanation Prose */}
        {codeExample.explanation && (
          <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="font-semibold block mb-1 text-slate-900 dark:text-slate-100">
              Implementation Overview:
            </strong>
            {codeExample.explanation}
          </div>
        )}
      </Card>

      {/* Complexity & Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time Complexity */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Time Complexity
            </h4>
          </div>
          <p className="text-base font-bold font-mono text-slate-900 dark:text-slate-100">
            {codeExample.complexity.time}
          </p>
          {codeExample.complexity.explanation && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {codeExample.complexity.explanation}
            </p>
          )}
        </Card>

        {/* Space Complexity */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-purple-500" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Space Complexity
            </h4>
          </div>
          <p className="text-base font-bold font-mono text-slate-900 dark:text-slate-100">
            {codeExample.complexity.space}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Memory footprint on execution stack and heap.
          </p>
        </Card>
      </div>

      {/* Edge Cases Checklist */}
      {codeExample.edgeCases && codeExample.edgeCases.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Critical Edge Cases & Boundary Conditions
            </h4>
          </div>
          <ul className="space-y-2">
            {codeExample.edgeCases.map((edge, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{edge}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Input / Output Demo */}
      {codeExample.inputOutputDemo && (
        <Card className="p-5">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Execution Demonstration
          </h4>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs">
              <span className="text-slate-400 block text-[10px] uppercase">Input</span>
              <span className="text-slate-900 dark:text-slate-100">
                {codeExample.inputOutputDemo.input}
              </span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />

            <div className="flex-1 w-full p-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 font-mono text-xs">
              <span className="text-teal-600 dark:text-teal-400 block text-[10px] uppercase">Output</span>
              <span className="text-teal-900 dark:text-teal-200 font-semibold">
                {codeExample.inputOutputDemo.output}
              </span>
            </div>
          </div>
          {codeExample.inputOutputDemo.explanation && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {codeExample.inputOutputDemo.explanation}
            </p>
          )}
        </Card>
      )}
    </div>
  );
};
