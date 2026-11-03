import React, { useEffect, useRef, useState, useMemo } from 'react';
import { VisualDiagramData } from '@cogflow/shared';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ChevronLeft, ChevronRight, Layers, Eye, RefreshCw, Code, ArrowRight } from 'lucide-react';
import { useTheme } from '../../../design-system/theme';

export interface VisualStudioProps {
  diagram: VisualDiagramData;
}

// Parses flowchart/graph text into structured nodes and edges for pure zero-dependency SVG rendering
function parseMermaidFallback(code: string) {
  if (!code) return { nodes: [], edges: [] };

  const lines = code
    .split('\n')
    .map((l) => l.trim())
    .filter(
      (l) =>
        l &&
        !l.startsWith('%%') &&
        !l.startsWith('graph') &&
        !l.startsWith('flowchart') &&
        !l.startsWith('subgraph') &&
        !l.startsWith('end') &&
        !l.startsWith('style') &&
        !l.startsWith('classDef') &&
        !l.startsWith('class')
    );

  const nodesMap = new Map<string, string>();
  const edges: Array<{ from: string; to: string; label?: string }> = [];

  for (const line of lines) {
    const arrowParts = line.split(/-->|-\.->|==>|->/);
    if (arrowParts.length >= 2) {
      for (let i = 0; i < arrowParts.length - 1; i++) {
        const leftPart = arrowParts[i].trim();
        let rightPart = arrowParts[i + 1].trim();

        let edgeLabel: string | undefined;
        const edgeLabelMatch = rightPart.match(/^\|([^|]+)\|\s*(.*)/);
        if (edgeLabelMatch) {
          edgeLabel = edgeLabelMatch[1].replace(/["']/g, '');
          rightPart = edgeLabelMatch[2];
        }

        const extractNode = (raw: string) => {
          const match = raw.match(
            /^([a-zA-Z0-9_\-]+)(?:\[["']?(.*?)["']?\]|\(\["?(.*?)"?\]\)|\(["']?(.*?)["']?\)|\[\((.*?)\)\]|\{["']?(.*?)["']?\})?/
          );
          if (match) {
            const id = match[1];
            const label = match[2] || match[3] || match[4] || match[5] || match[6] || id;
            return { id, label: label.replace(/["']/g, '').trim() };
          }
          return { id: raw, label: raw };
        };

        const left = extractNode(leftPart);
        const right = extractNode(rightPart);

        if (left.id && left.label) nodesMap.set(left.id, left.label);
        if (right.id && right.label) nodesMap.set(right.id, right.label);
        if (left.id && right.id) {
          edges.push({ from: left.id, to: right.id, label: edgeLabel });
        }
      }
    }
  }

  const nodes = Array.from(nodesMap.entries()).map(([id, label], index) => ({
    id,
    label,
    index,
  }));

  return { nodes, edges };
}

// Remove any rogue error divs that Mermaid 10 injects into document.body
function purgeRogueMermaidDOMElements() {
  if (typeof document === 'undefined') return;
  try {
    const rogues = document.querySelectorAll('div[id^="dmermaid"], svg[id^="dmermaid"], .error-icon');
    rogues.forEach((el) => {
      if (el.parentElement === document.body) {
        el.remove();
      }
    });
  } catch {
    // Ignore DOM removal errors
  }
}

export const VisualStudio: React.FC<VisualStudioProps> = ({ diagram }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [renderMode, setRenderMode] = useState<'mermaid' | 'flow' | 'raw'>('flow');
  const [mermaidSvg, setMermaidSvg] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const parsedGraph = useMemo(() => {
    return parseMermaidFallback(diagram.mermaidCode);
  }, [diagram.mermaidCode]);

  useEffect(() => {
    let isCancelled = false;

    // Purge any rogue elements immediately on mount
    purgeRogueMermaidDOMElements();

    const tryLoadMermaid = async () => {
      const win = typeof window !== 'undefined' ? (window as any) : null;
      if (!win) return;

      try {
        if (!win.mermaid) {
          await new Promise<void>((resolve, reject) => {
            const existingScript = document.getElementById('mermaid-cdn-script');
            if (existingScript) {
              existingScript.addEventListener('load', () => resolve());
              existingScript.addEventListener('error', () => reject(new Error('CDN failed')));
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
            suppressErrorRendering: true,
          });

          purgeRogueMermaidDOMElements();

          try {
            // Validate syntax first if parse function is available
            if (typeof win.mermaid.parse === 'function') {
              const isValid = await win.mermaid.parse(diagram.mermaidCode).catch(() => false);
              if (!isValid) {
                purgeRogueMermaidDOMElements();
                if (!isCancelled) setRenderMode('flow');
                return;
              }
            }

            const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
            const result = await win.mermaid.render(uniqueId, diagram.mermaidCode);
            purgeRogueMermaidDOMElements();

            if (!isCancelled && result && result.svg) {
              setMermaidSvg(result.svg);
              setRenderMode('mermaid');
            }
          } catch (renderError) {
            purgeRogueMermaidDOMElements();
            console.warn('[VisualStudio] Mermaid render error (seamlessly using SVG flow renderer):', renderError);
            if (!isCancelled) {
              setRenderMode('flow');
            }
          }
        }
      } catch (err) {
        purgeRogueMermaidDOMElements();
        if (!isCancelled) {
          setRenderMode('flow');
        }
      }
    };

    tryLoadMermaid();

    return () => {
      isCancelled = true;
      purgeRogueMermaidDOMElements();
    };
  }, [diagram.mermaidCode, resolvedTheme]);

  const stages = diagram.stages || [];
  const currentStage = stages[activeStageIndex];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 font-sans">
      {/* Diagram Canvas Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center justify-between mb-5 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-zinc-950 dark:text-white" />
            <div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-white font-display">
                {diagram.title}
              </h3>
              <p className="text-xs text-zinc-500 font-mono capitalize">
                {diagram.type} Visualization • Multi-Stage Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRenderMode((m) => (m === 'flow' ? 'raw' : 'flow'))}
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition font-mono"
              title="Toggle syntax spec"
            >
              <Code className="w-3.5 h-3.5" />
              <span>{renderMode === 'raw' ? 'Show Graph' : 'View Spec'}</span>
            </button>
          </div>
        </div>

        {/* Diagram Display Area */}
        <div className="min-h-[280px] flex items-center justify-center p-6 bg-zinc-50/50 dark:bg-black rounded-xl overflow-x-auto border border-zinc-200 dark:border-zinc-800">
          {renderMode === 'raw' ? (
            <div className="w-full">
              <div className="text-xs font-mono text-zinc-500 mb-2">Mermaid Source Definition:</div>
              <pre className="text-xs bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg font-mono text-zinc-800 dark:text-zinc-200 overflow-x-auto max-h-64 border border-zinc-200 dark:border-zinc-800">
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
                        <div className="px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs transition hover:border-zinc-950 dark:hover:border-white">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block font-bold mb-0.5">
                            Step {i + 1}
                          </span>
                          <span className="text-xs font-bold text-zinc-950 dark:text-white font-sans">
                            {node.label}
                          </span>
                        </div>
                      </div>

                      {i < parsedGraph.nodes.length - 1 && (
                        <div className="flex items-center text-zinc-400 font-mono text-sm px-1">
                          <ArrowRight className="w-4 h-4 text-zinc-500" />
                        </div>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <div className="text-center py-6 text-zinc-500 text-xs font-mono">
                    Visual diagram available in Stage Inspector below.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {diagram.caption && (
          <p className="text-xs text-zinc-500 mt-4 leading-relaxed text-center font-mono">
            {diagram.caption}
          </p>
        )}
      </div>

      {/* Interactive Phase & Stage Inspector */}
      {stages.length > 0 && (
        <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-zinc-950 dark:text-white" />
              <h4 className="text-sm font-bold text-zinc-950 dark:text-white font-display">
                Phase Inspector (Stage {activeStageIndex + 1} of {stages.length})
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={activeStageIndex === 0}
                onClick={() => setActiveStageIndex((prev) => Math.max(0, prev - 1))}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-30 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={activeStageIndex === stages.length - 1}
                onClick={() => setActiveStageIndex((prev) => Math.min(stages.length - 1, prev + 1))}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-30 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stepper Dots / Stage Badges */}
          <div className="flex flex-wrap gap-2">
            {stages.map((stage, idx) => (
              <button
                key={stage.step || idx}
                onClick={() => setActiveStageIndex(idx)}
                className={`text-xs px-3.5 py-1.5 rounded-lg border font-mono font-bold transition-all ${
                  idx === activeStageIndex
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {stage.step}. {stage.label}
              </button>
            ))}
          </div>

          {/* Active Stage Detail */}
          {currentStage && (
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
              <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1">
                {currentStage.label}
              </h5>
              <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans">
                {currentStage.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
