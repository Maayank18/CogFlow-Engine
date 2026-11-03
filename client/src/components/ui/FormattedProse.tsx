import React from 'react';
import katex from 'katex';

export interface FormattedProseProps {
  content: string;
  className?: string;
}

// Safely renders inline text containing bold, italic, bold-italic, links, inline code, and inline LaTeX math ($...$)
function renderInlineFormatted(text: string): React.ReactNode[] {
  // Regex to match:
  // 1. Inline math: $...$
  // 2. Inline code: `...`
  // 3. Markdown links: [text](url)
  // 4. Bold-Italic: ***...***
  // 5. Bold: **...** or __...__
  // 6. Italic: *...* or _..._
  const tokenRegex = /(\$[^$]+\$|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*\*[^*]+?\*\*\*|\*\*[^*]+?\*\*|__[^_]+?__|\*[^*]+?\*|_[^_]+?_)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Inline Math: $...$
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      const mathStr = part.slice(1, -1);
      try {
        const html = katex.renderToString(mathStr, { throwOnError: false, displayMode: false });
        return (
          <span
            key={index}
            className="inline-math px-0.5 text-zinc-950 dark:text-zinc-100"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        return <code key={index} className="font-mono text-xs">{part}</code>;
      }
    }

    // Inline Code: `...`
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={index}
          className="font-mono text-[12.5px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/80 font-medium"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Markdown Links: [label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-950 dark:text-white underline decoration-zinc-400 hover:decoration-zinc-950 dark:hover:decoration-white font-medium transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
    }

    // Bold-Italic: ***...***
    if (part.startsWith('***') && part.endsWith('***') && part.length > 6) {
      return (
        <strong key={index} className="font-bold italic text-zinc-950 dark:text-white">
          {part.slice(3, -3)}
        </strong>
      );
    }

    // Bold: **...** or __...__
    if (
      (part.startsWith('**') && part.endsWith('**') && part.length > 4) ||
      (part.startsWith('__') && part.endsWith('__') && part.length > 4)
    ) {
      return (
        <strong key={index} className="font-bold text-zinc-950 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *...* or _..._
    if (
      (part.startsWith('*') && part.endsWith('*') && part.length > 2) ||
      (part.startsWith('_') && part.endsWith('_') && part.length > 2)
    ) {
      return (
        <em key={index} className="italic text-zinc-800 dark:text-zinc-200">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Plain text
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export const FormattedProse: React.FC<FormattedProseProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split into paragraphs / blocks by double newlines or single newlines with prefixes
  const rawParagraphs = content.split(/\n\s*\n/);

  return (
    <div className={`space-y-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-sans ${className}`}>
      {rawParagraphs.map((para, pIdx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Display Math Block: $$ ... $$
        if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
          const math = trimmed.slice(2, -2).trim();
          try {
            const html = katex.renderToString(math, { throwOnError: false, displayMode: true });
            return (
              <div
                key={pIdx}
                className="my-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 overflow-x-auto text-center"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return (
              <pre key={pIdx} className="font-mono text-xs p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                {math}
              </pre>
            );
          }
        }

        // Blockquote: starts with >
        if (trimmed.startsWith('>')) {
          const quoteLines = trimmed
            .split('\n')
            .map((l) => l.replace(/^>\s?/, ''))
            .join(' ');
          return (
            <div
              key={pIdx}
              className="p-4 rounded-xl border-l-4 border-l-zinc-950 dark:border-l-zinc-100 bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 my-3 text-xs leading-relaxed"
            >
              <div className="font-sans text-zinc-800 dark:text-zinc-200">{renderInlineFormatted(quoteLines)}</div>
            </div>
          );
        }

        // Headings: ### or ## or #
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={pIdx} className="text-base font-bold text-zinc-950 dark:text-white pt-2">
              {renderInlineFormatted(trimmed.slice(4))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={pIdx} className="text-lg font-bold text-zinc-950 dark:text-white pt-3">
              {renderInlineFormatted(trimmed.slice(3))}
            </h3>
          );
        }

        // Numbered list block
        const lines = trimmed.split('\n');
        const isNumberedList = lines.every((l) => /^\d+\.\s/.test(l.trim()));
        if (isNumberedList && lines.length > 0) {
          return (
            <ol key={pIdx} className="space-y-2.5 my-3 pl-1">
              {lines.map((line, lIdx) => {
                const match = line.match(/^(\d+)\.\s+(.*)/);
                if (!match) return null;
                const num = match[1];
                const rest = match[2];
                return (
                  <li key={lIdx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-[10.5px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs font-mono">
                      {num}
                    </span>
                    <span className="flex-1">{renderInlineFormatted(rest)}</span>
                  </li>
                );
              })}
            </ol>
          );
        }

        // Bullet list block
        const isBulletList = lines.every((l) => /^[-*]\s/.test(l.trim()));
        if (isBulletList && lines.length > 0) {
          return (
            <ul key={pIdx} className="space-y-2 my-3 pl-2">
              {lines.map((line, lIdx) => {
                const rest = line.replace(/^[-*]\s+/, '');
                return (
                  <li key={lIdx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 shrink-0 mt-2" />
                    <span className="flex-1">{renderInlineFormatted(rest)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Mixed paragraphs with inline bullet/number lines
        const hasNumberedOrBullet = lines.some((l) => /^(\d+\.|[-*])\s/.test(l.trim()));
        if (hasNumberedOrBullet && lines.length > 1) {
          return (
            <div key={pIdx} className="space-y-2">
              {lines.map((line, lIdx) => {
                const tLine = line.trim();
                const numMatch = tLine.match(/^(\d+)\.\s+(.*)/);
                if (numMatch) {
                  return (
                    <div key={lIdx} className="flex items-start gap-3 py-1">
                      <span className="w-5 h-5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 text-[10.5px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs font-mono">
                        {numMatch[1]}
                      </span>
                      <span className="flex-1">{renderInlineFormatted(numMatch[2])}</span>
                    </div>
                  );
                }
                if (/^[-*]\s/.test(tLine)) {
                  return (
                    <div key={lIdx} className="flex items-start gap-2.5 py-0.5 pl-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 shrink-0 mt-2" />
                      <span className="flex-1">{renderInlineFormatted(tLine.replace(/^[-*]\s+/, ''))}</span>
                    </div>
                  );
                }
                return (
                  <p key={lIdx} className="leading-relaxed">
                    {renderInlineFormatted(tLine)}
                  </p>
                );
              })}
            </div>
          );
        }

        // Standard prose paragraph
        return (
          <p key={pIdx} className="leading-relaxed">
            {renderInlineFormatted(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

