import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { VisualDiagramData } from '@cogflow/shared';
import { Card } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { ChevronLeft, ChevronRight, Layers, Eye } from 'lucide-react';
import { useTheme } from '../../../design-system/theme.js';

export interface VisualStudioProps {
  diagram: VisualDiagramData;
}

export const VisualStudio: React.FC<VisualStudioProps> = ({ diagram }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [renderError, setRenderError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: resolvedTheme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif',
    });

    const renderDiagram = async () => {
      if (!containerRef.current) return;
      setRenderError(null);

      try {
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, diagram.mermaidCode);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.warn('[VisualStudio] Mermaid render error, showing styled fallback:', err);
        setRenderError((err as Error).message);
      }
    };

    renderDiagram();
  }, [diagram.mermaidCode, resolvedTheme]);

  const stages = diagram.stages || [];
  const currentStage = stages[activeStageIndex];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Diagram Canvas Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {diagram.title}
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
            {diagram.type} Visualization
          </span>
        </div>

        {/* Render container */}
        <div className="min-h-[280px] flex items-center justify-center p-6 bg-slate-50/60 dark:bg-slate-900/30 rounded-xl overflow-x-auto">
          {renderError ? (
            <div className="text-center p-6 space-y-2">
              <p className="text-xs text-amber-500 font-medium">Mermaid Visual Syntax Spec:</p>
              <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-4 rounded-lg font-mono text-left max-w-lg overflow-x-auto">
                {diagram.mermaidCode}
              </pre>
            </div>
          ) : (
            <div
              ref={containerRef}
              className="w-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:h-auto"
            />
          )}
        </div>

        {diagram.caption && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed text-center">
            {diagram.caption}
          </p>
        )}
      </Card>

      {/* Interactive Phase & Stage Inspector */}
      {stages.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-500" />
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Phase Inspector (Stage {activeStageIndex + 1} of {stages.length})
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={activeStageIndex === 0}
                onClick={() => setActiveStageIndex((prev) => Math.max(0, prev - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={activeStageIndex === stages.length - 1}
                onClick={() => setActiveStageIndex((prev) => Math.min(stages.length - 1, prev + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stepper Dots / Stage Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {stages.map((stage, idx) => (
              <button
                key={stage.step || idx}
                onClick={() => setActiveStageIndex(idx)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  idx === activeStageIndex
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {stage.step}. {stage.label}
              </button>
            ))}
          </div>

          {/* Active Stage Detail */}
          {currentStage && (
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
              <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                {currentStage.label}
              </h5>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentStage.description}
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
