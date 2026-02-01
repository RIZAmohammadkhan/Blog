import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import { createHighlighter, type Highlighter } from 'shiki';

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for non-secure contexts / older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

let shikiHighlighterPromise: Promise<Highlighter> | null = null;
const shikiHtmlCache = new Map<string, string>();

function getShikiHighlighter(): Promise<Highlighter> {
  if (!shikiHighlighterPromise) {
    shikiHighlighterPromise = createHighlighter({
      themes: ['dark-plus'],
      langs: [
        'text',
        'bash',
        'shellscript',
        'json',
        'yaml',
        'toml',
        'ini',
        'markdown',
        'html',
        'css',
        'javascript',
        'typescript',
        'tsx',
        'jsx',
        'python',
        'go',
        'rust',
        'java',
        'c',
        'cpp',
        'csharp',
        'sql'
      ]
    });
  }
  return shikiHighlighterPromise;
}

function normalizeFenceLanguage(language?: string): string {
  const raw = (language || '').trim().toLowerCase();
  if (!raw) return 'text';

  const map: Record<string, string> = {
    txt: 'text',
    plaintext: 'text',
    sh: 'shellscript',
    shell: 'shellscript',
    bash: 'bash',
    zsh: 'shellscript',
    js: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
    ts: 'typescript',
    tsx: 'tsx',
    jsx: 'jsx',
    yml: 'yaml',
    md: 'markdown',
    py: 'python',
    rs: 'rust',
    cs: 'csharp',
    'c#': 'csharp'
  };

  return map[raw] || raw;
}

function renderInlineText(text: string): ReactNode {
  // Handle inline code and bold
  const parts = text.split(/(`[^`]+`)|(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-[#252526] px-1.5 py-0.5 rounded text-[#ce9178] text-sm">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-[#9cdcfe] font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function MarkdownCodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const lang = normalizeFenceLanguage(language);
    const cacheKey = `${lang}\n${code}`;
    const cached = shikiHtmlCache.get(cacheKey);
    if (cached) {
      setHighlightedHtml(cached);
      return () => {
        cancelled = true;
      };
    }

    getShikiHighlighter()
      .then(highlighter => {
        const html = highlighter.codeToHtml(code, {
          lang,
          theme: 'dark-plus'
        });

        // Keep our container styling; remove Shiki's background inline style.
        const sanitized = html.replace(/background-color:\s*#[0-9a-fA-F]{3,8};?/g, 'background-color: transparent;');
        shikiHtmlCache.set(cacheKey, sanitized);
        if (!cancelled) setHighlightedHtml(sanitized);
      })
      .catch(() => {
        if (!cancelled) setHighlightedHtml(null);
      });

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const onCopy = async () => {
    const ok = await copyToClipboard(code);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden bg-[#1e1e1e] border border-[#3e3e42]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d30] border-b border-[#3e3e42]">
        <span className="text-xs text-[#858585]">{normalizeFenceLanguage(language) || 'text'}</span>
        <button
          type="button"
          onClick={onCopy}
          className="p-1.5 rounded hover:bg-[#3e3e42] text-[#858585] hover:text-[#cccccc] transition-colors"
          aria-label={copied ? 'Copied' : 'Copy code'}
          title={copied ? 'Copied' : 'Copy'}
        >
          {copied ? <Check size={14} className="text-[#89e051]" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        {highlightedHtml ? (
          <div
            className="text-sm font-mono [&_.shiki]:bg-transparent [&_.shiki]:p-0 [&_.shiki]:m-0 [&_.shiki]:overflow-visible [&_pre]:bg-transparent"
            // Shiki escapes code content; this is safe for our use-case.
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre>
            <code className="text-sm text-[#d4d4d4] font-mono">{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

function buildNodes(content: string): ReactNode[] {
  const elements: ReactNode[] = [];
  const lines = content.split('\n');

  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = '';
  let blockIndex = 0;

  const flushCodeBlock = () => {
    const code = codeLines.join('\n');
    elements.push(<MarkdownCodeBlock key={`code-${blockIndex++}`} code={code} language={codeLang} />);
    codeLines = [];
    codeLang = '';
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block handling
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Headers
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-2xl font-bold text-[#dcdcaa] mt-8 mb-4 first:mt-0">
          {line.slice(2)}
        </h1>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-xl font-semibold text-[#dcdcaa] mt-6 mb-3">
          {line.slice(3)}
        </h2>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-lg font-semibold text-[#dcdcaa] mt-5 mb-2">
          {line.slice(4)}
        </h3>
      );
      continue;
    }

    // Horizontal rule
    if (line.trim() === '---') {
      elements.push(<hr key={i} className="my-6 border-[#3e3e42]" />);
      continue;
    }

    // Tables (simple per-row rendering)
    if (line.startsWith('|')) {
      const cells = line.split('|').filter(c => c.trim());
      const isSeparator = cells.every(c => /^[-:]+$/.test(c.trim()));
      if (!isSeparator) {
        elements.push(
          <div key={i} className="flex text-sm my-1">
            {cells.map((cell, j) => (
              <div key={j} className="flex-1 px-2 py-1 text-[#cccccc] border border-[#3e3e42]">
                {cell.trim()}
              </div>
            ))}
          </div>
        );
      }
      continue;
    }

    // Checkboxes (single line)
    if (/^\s*- \[ \]\s+/.test(line)) {
      elements.push(
        <div key={i} className="flex items-center gap-2 ml-4 my-1">
          <div className="w-4 h-4 border border-[#6e6e6e] rounded" />
          <span className="text-[#d4d4d4]">{line.replace(/^\s*- \[ \]\s+/, '')}</span>
        </div>
      );
      continue;
    }
    if (/^\s*- \[x\]\s+/i.test(line)) {
      elements.push(
        <div key={i} className="flex items-center gap-2 ml-4 my-1">
          <div className="w-4 h-4 bg-[#007acc] rounded flex items-center justify-center text-white text-xs">✓</div>
          <span className="text-[#d4d4d4]">{line.replace(/^\s*- \[x\]\s+/i, '')}</span>
        </div>
      );
      continue;
    }

    // Unordered list blocks
    if (/^\s*[-*]\s+/.test(line)) {
      const items: ReactNode[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        const raw = lines[i];
        const match = raw.match(/^(\s*)[-*]\s+(.*)$/);
        const indent = match?.[1]?.length ?? 0;
        const itemText = match?.[2] ?? raw.replace(/^\s*[-*]\s+/, '');
        items.push(
          <li
            key={`ul-${i}`}
            className={`text-[#d4d4d4] leading-relaxed ${indent ? 'ml-4' : ''}`}
          >
            {renderInlineText(itemText)}
          </li>
        );
        i++;
      }
      i--; // compensate for loop's i++
      elements.push(
        <ul
          key={`ul-block-${i}`}
          className="my-3 pl-6 list-disc space-y-1 marker:text-[#569cd6]"
        >
          {items}
        </ul>
      );
      continue;
    }

    // Ordered list blocks
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: ReactNode[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        const raw = lines[i];
        const match = raw.match(/^(\s*)\d+\.\s+(.*)$/);
        const indent = match?.[1]?.length ?? 0;
        const itemText = match?.[2] ?? raw.replace(/^\s*\d+\.\s+/, '');
        items.push(
          <li
            key={`ol-${i}`}
            className={`text-[#d4d4d4] leading-relaxed ${indent ? 'ml-4' : ''}`}
          >
            {renderInlineText(itemText)}
          </li>
        );
        i++;
      }
      i--;
      elements.push(
        <ol
          key={`ol-block-${i}`}
          className="my-3 pl-6 list-decimal space-y-1 marker:text-[#569cd6]"
        >
          {items}
        </ol>
      );
      continue;
    }

    // Italic text lines (starting and ending with single *)
    if (line.startsWith('*') && line.endsWith('*') && line.length > 2) {
      elements.push(
        <p key={i} className="text-[#6a9955] italic my-2">
          {line.slice(1, -1)}
        </p>
      );
      continue;
    }

    // Empty lines
    if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-[#d4d4d4] leading-relaxed my-2">
        {renderInlineText(line)}
      </p>
    );
  }

  if (inCodeBlock) {
    flushCodeBlock();
  }

  return elements;
}

export default function MarkdownRenderer({ content }: { content: string }) {
  const nodes = useMemo(() => buildNodes(content), [content]);
  return <>{nodes}</>;
}
