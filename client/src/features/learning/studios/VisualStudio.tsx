import React, { useEffect, useRef, useState, useMemo } from 'react';
import { VisualDiagramData } from '@cogflow/shared';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ChevronLeft, ChevronRight, Layers, Eye, RefreshCw, Code } from 'lucide-react';
import { useTheme } from '../../../design-system/theme';

export interface VisualStudioProps {
  diagram: VisualDiagramData;
}

// Parses simple mermaid flowcharts into structured nodes and edges for pure SVG rendering
function parseMermaidFallback(code: string) {
  const lines = code.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('%%') && !l.startsWith('graph') && !l.startsWith('flowchart'));
  const nodesMap = new Map<string, string>();
  const edges: Array<{ from: string; to: string; label?: string }> = [];

  for (const line of lines) {
    // Match patterns like A["Node Label"] -->|label| B["Another Node"] or A[Node] --> B[Node]
    const arrowMatch = line.split(/-->|->/);
    if (arrowMatch.length >= 2) {
      const leftPart = arrowMatch[0].trim();
      const rightPart = arrowMatch[1].trim();

      // Extract left node ID and label
      const leftNodeMatch = leftPart.match(/^([a-zA-Z0-9_\-]+)(?:\[["']?(.*?)["']?\])?/);
      const leftId = leftNodeMatch ? leftNodeMatch[1] : leftPart;
      const leftLabel = leftNodeMatch && leftNodeMatch[2] ? leftNodeMatch[2] : leftId;
      nodesMap.set(leftId, leftLabel);

      // Extract right node label and optional edge text
      let edgeLabel: string | undefined;
      let cleanRight = rightPart;
      const edgeLabelMatch = cleanRight.match(/^\|([^|]+)\|\s*(.*)/);
      if (edgeLabelMatch) {
        edgeLabel = edgeLabelMatch[1];
        cleanRight = edgeLabelMatch[2];
      }

      const rightNodeMatch = cleanRight.match(/^([a-zA-Z0-9_\-]+)(?:\[["']?(.*?)["']?\])?/);
      const rightId = rightNodeMatch ? rightNodeMatch[1] : cleanRight;
      const rightLabel = rightNodeMatch && rightNodeMatch[2] ? rightNodeMatch[2] : rightId;
      nodesMap.set(rightId, rightLabel);

      edges.push({ from: leftId, to: rightId, label: edgeLabel });
    }
  }

  const nodes = Array.from(nodesMap.entries()).map(([id, label], index) => ({
    id,
    label,
    index,
  }));

  return { nodes, edges };
}

export const VisualStudio: React.FC<VisualStudioProps> = ({ diagram }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [renderMode, setRenderMode] = useState<'mermaid' | 'flow' | 'raw'>('flow');
  const [isMermaidLoading, setIsMermaidLoading] = useState<boolean>(false);
  const [mermaidSvg, setMermaidSvg] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  // Parse structured graph for Calm Precision SVG fallback
  const parsedGraph = useMemo(() => {
    return parseMermaidFallback(diagram.mermaidCode);
  }, [diagram.mermaidCode]);

  // Attempt dynamic Mermaid rendering without crashing on initial mount
  useEffect(() => {
    let isCancelled = false;

    const tryLoadMermaid = async () => {
      // Check if global mermaid is already injected
      const win = typeof window !== 'undefined' ? (window as any) : null;
      if (!win) return;

      try {
        setIsMermaidLoading(true);

        // Load Mermaid via safe dynamic script injection if not already present
        if (!win.mermaid) {
          await new Promise<void>((resolve, reject) => {
            const existingScript = document.getElementById('mermaid-cdn-script');
            if (existingScript) {
              existingScript.addEventListener('load', () => resolve());
              existingScript.addEventListener('error', () => reject(new Error('CDN load failed')));
              return;
            }

            const script = document.createElement('script');
            script.id = 'mermaid-cdn-script';
            script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Mermaid CDN unreachable'));
            document.head.appendChild(script);
          });
        }

        if (win.mermaid && !isCancelled) {
          win.mermaid.initialize({
            startOnLoad: false,
            theme: resolvedTheme === 'dark' ? 'dark' : 'default',
            securityLevel: 'loose',
            fontFamily: 'Inter, sans-serif',
          });

          const uniqueId = `mermaid-${Date.now()}`;
          const { svg } = await win.mermaid.render(uniqueId, diagram.mermaidCode);
          if (!isCancelled) {
            setMermaidSvg(svg);
            setRenderMode('mermaid');
          }
        }
      } catch (err) {
        // Fall back gracefully to the built-in SVG flow visualizer
        console.info('[VisualStudio] Using built-in Calm Precision SVG diagram renderer:', (err as Error).message);
        if (!isCancelled) {
          setRenderMode('flow');
        }
      } finally {
        if (!isCancelled) {
          setIsMermaidLoading(false);
        }
      }
    };

    tryLoadMermaid();

    return () => {
      isCancelled = true;
    };
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
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {diagram.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {diagram.type} Visualization • Calm Precision System Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRenderMode((m) => (m === 'flow' ? 'raw' : 'flow'))}
              className="text-xs flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              title="Toggle syntax spec"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{renderMode === 'raw' ? 'Show Graph' : 'View Spec'}</span>
            </button>
          </div>
        </div>

        {/* Diagram Display Area */}
        <div className="min-h-[280px] flex items-center justify-center p-6 bg-slate-50/60 dark:bg-slate-900/40 rounded-xl overflow-x-auto border border-slate-100 dark:border-slate-800/80">
          {renderMode === 'raw' ? (
            <div className="w-full">
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">Mermaid Source Definition:</div>
              <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-4 rounded-lg font-mono text-slate-800 dark:text-slate-200 overflow-x-auto max-h-64">
                {diagram.mermaidCode}
              </pre>
            </div>
          ) : renderMode === 'mermaid' && mermaidSvg ? (
            <div
              ref={containerRef}
              dangerouslySetInnerHTML={{ __html: mermaidSvg }}
              className="w-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:h-auto"
            />
          ) : (
            /* Calm Precision Pure SVG Flowchart Renderer */
            <div className="w-full py-4">
              <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl mx-auto">
                {parsedGraph.nodes.length > 0 ? (
                  parsedGraph.nodes.map((node, i) => (
                    <React.Fragment key={node.id}>
                      <div className="flex flex-col items-center group">
                        <div className="px-4 py-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-white dark:bg-slate-800 shadow-sm transition hover:shadow-md hover:border-blue-500">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 block font-semibold mb-0.5">
                            Step {i + 1}
                          </span>
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {node.label}
                          </span>
                        </div>
                      </div>

                      {i < parsedGraph.nodes.length - 1 && (
                        <div className="flex items-center text-slate-400 dark:text-slate-600 font-mono text-sm px-1">
                          <svg className="w-6 h-6 text-blue-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    Visual diagram available in Stage Inspector below.
                  </div>
                )}
              </div>
            </div>
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
