import React, { useState } from 'react';
import { CodeExampleData } from '@cogflow/shared';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
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
    <div className="space-y-6 max-w-4xl mx-auto pb-16 font-sans">
      {/* Code Viewer Card */}
      <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xs">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-950 text-zinc-300 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-bold text-white font-mono">{codeExample.title}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-800 text-zinc-300 border border-zinc-700">
              {codeExample.language}
            </span>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-8 text-xs font-mono"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-emerald-400">Copied</span>
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
        <div className="bg-black text-zinc-200 p-4 font-mono text-xs overflow-x-auto leading-relaxed">
          <table className="border-collapse w-full">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/60">
                  <td className="pr-4 select-none text-zinc-600 text-right w-8">{idx + 1}</td>
                  <td className="whitespace-pre">{line}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Code Explanation Prose */}
        {codeExample.explanation && (
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
            <strong className="font-bold block mb-1 text-zinc-950 dark:text-white uppercase font-mono text-[10px] tracking-wider text-zinc-500">
              Implementation Overview:
            </strong>
            {codeExample.explanation}
          </div>
        )}
      </div>

      {/* Complexity & Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time Complexity */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-zinc-950 dark:text-white" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
              Time Complexity
            </h4>
          </div>
          <p className="text-base font-black font-mono text-zinc-950 dark:text-white">
            {codeExample.complexity.time}
          </p>
          {codeExample.complexity.explanation && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              {codeExample.complexity.explanation}
            </p>
          )}
        </div>

        {/* Space Complexity */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-zinc-950 dark:text-white" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
              Space Complexity
            </h4>
          </div>
          <p className="text-base font-black font-mono text-zinc-950 dark:text-white">
            {codeExample.complexity.space}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Memory footprint on execution stack and heap.
          </p>
        </div>
      </div>

      {/* Edge Cases Checklist */}
      {codeExample.edgeCases && codeExample.edgeCases.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold text-zinc-950 dark:text-white font-display">
              Critical Edge Cases & Boundary Conditions
            </h4>
          </div>
          <ul className="space-y-2">
            {codeExample.edgeCases.map((edge, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 dark:bg-white mt-1.5 shrink-0" />
                <span>{edge}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Input / Output Demo */}
      {codeExample.inputOutputDemo && (
        <div className="p-6 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <h4 className="text-sm font-bold text-zinc-950 dark:text-white mb-3 font-display">
            Execution Demonstration
          </h4>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 font-mono text-xs border border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">Input</span>
              <span className="text-zinc-950 dark:text-white font-semibold">
                {codeExample.inputOutputDemo.input}
              </span>
            </div>

            <ArrowRight className="w-4 h-4 text-zinc-400 shrink-0 hidden sm:block" />

            <div className="flex-1 w-full p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-xs">
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">Output</span>
              <span className="text-zinc-950 dark:text-white font-bold">
                {codeExample.inputOutputDemo.output}
              </span>
            </div>
          </div>
          {codeExample.inputOutputDemo.explanation && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-mono">
              {codeExample.inputOutputDemo.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
