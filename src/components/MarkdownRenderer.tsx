import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import type { Highlighter } from 'shiki';
import { defaultThemeId, type ThemeId } from '../types';

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
    shikiHighlighterPromise = import('shiki').then(({ createHighlighter }) =>
      createHighlighter({
        themes: ['dark-plus', 'dracula', 'one-dark-pro', 'aurora-x'],
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
      })
    );
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
  const nodes: ReactNode[] = [];
  let i = 0;
  let key = 0;

  const pushText = (value: string) => {
    if (!value) return;
    nodes.push(<span key={key++}>{value}</span>);
  };

  while (i < text.length) {
    // Inline code: `code`
    if (text[i] === '`') {
      const end = text.indexOf('`', i + 1);
      if (end !== -1) {
        const code = text.slice(i + 1, end);
        nodes.push(
          <code key={key++} className="bg-[color:var(--bg-secondary)] px-1.5 py-0.5 rounded text-[color:var(--accent-orange)] text-sm">
            {code}
          </code>
        );
        i = end + 1;
        continue;
      }
    }

    // Bold: **text**
    if (text.startsWith('**', i)) {
      const end = text.indexOf('**', i + 2);
      if (end !== -1) {
        const strongText = text.slice(i + 2, end);
        nodes.push(
          <strong key={key++} className="text-[#9cdcfe] font-semibold">
            {strongText}
          </strong>
        );
        i = end + 2;
        continue;
      }
    }

    // Link: [label](url)
    if (text[i] === '[') {
      const closeBracket = text.indexOf(']', i + 1);
      const openParen = closeBracket !== -1 ? text.indexOf('(', closeBracket + 1) : -1;
      if (closeBracket !== -1 && openParen === closeBracket + 1 && text[openParen] === '(') {
        // Find matching ')' allowing parentheses inside URL
        let depth = 1;
        let j = openParen + 1;
        while (j < text.length && depth > 0) {
          if (text[j] === '(') depth++;
          else if (text[j] === ')') depth--;
          j++;
        }
        const closeParen = depth === 0 ? j - 1 : -1;
        if (closeParen !== -1) {
          const label = text.slice(i + 1, closeBracket);
          const url = text.slice(openParen + 1, closeParen).trim();

          nodes.push(
            <a
              key={key++}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--accent-orange)] underline underline-offset-4 decoration-[color:var(--accent-orange)]/70 hover:text-[color:var(--accent-yellow)] hover:decoration-[color:var(--accent-yellow)]/70 transition-colors"
            >
              {label}
            </a>
          );

          i = closeParen + 1;
          continue;
        }
      }
    }

    // Plain text: consume until next special token
    const nextBacktick = text.indexOf('`', i);
    const nextBold = text.indexOf('**', i);
    const nextLink = text.indexOf('[', i);
    const candidates = [nextBacktick, nextBold, nextLink].filter(n => n !== -1);
    const next = candidates.length ? Math.min(...candidates) : -1;

    if (next === -1) {
      pushText(text.slice(i));
      break;
    }

    if (next > i) {
      pushText(text.slice(i, next));
      i = next;
      continue;
    }

    // Fallback: avoid infinite loop
    pushText(text[i]);
    i++;
  }

  return nodes;
}

const shikiThemeByAppTheme: Record<ThemeId, string> = {
  default: 'dark-plus',
  dracula: 'dracula',
  'one-dark-pro': 'one-dark-pro',
  'aura-dark': 'aurora-x'
};

function MarkdownCodeBlock({ code, language, theme }: { code: string; language?: string; theme: ThemeId }) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const lang = normalizeFenceLanguage(language);
    const cacheKey = `${theme}:${lang}\n${code}`;
    const cached = shikiHtmlCache.get(cacheKey);
    if (cached) {
      setHighlightedHtml(cached);
      return () => {
        cancelled = true;
      };
    }

    getShikiHighlighter()
      .then(highlighter => {
        const shikiTheme = shikiThemeByAppTheme[theme] || shikiThemeByAppTheme[defaultThemeId];
        const html = highlighter.codeToHtml(code, {
          lang,
          theme: shikiTheme
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
  }, [code, language, theme]);

  const onCopy = async () => {
    const ok = await copyToClipboard(code);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden bg-[color:var(--bg-primary)] border border-[color:var(--bg-hover)]">
      <div className="flex items-center justify-between px-4 py-2 bg-[color:var(--bg-tertiary)] border-b border-[color:var(--bg-hover)]">
        <span className="text-xs text-[color:var(--text-secondary)]">{normalizeFenceLanguage(language) || 'text'}</span>
        <button
          type="button"
          onClick={onCopy}
          className="p-1.5 rounded hover:bg-[color:var(--bg-hover)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
          aria-label={copied ? 'Copied' : 'Copy code'}
          title={copied ? 'Copied' : 'Copy'}
        >
          {copied ? <Check size={14} className="text-[color:var(--accent-green)]" /> : <Copy size={14} />}
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
            <code className="text-sm text-[color:var(--text-primary)] font-mono">{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

function buildNodes(content: string, theme: ThemeId): ReactNode[] {
  const elements: ReactNode[] = [];
  const lines = content.split('\n');

  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLang = '';
  let blockIndex = 0;

  const flushCodeBlock = () => {
    const code = codeLines.join('\n');
    elements.push(<MarkdownCodeBlock key={`code-${blockIndex++}`} code={code} language={codeLang} theme={theme} />);
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
        <h1 key={i} className="text-2xl font-bold text-[color:var(--accent-yellow)] mt-8 mb-4 first:mt-0">
          {line.slice(2)}
        </h1>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-xl font-semibold text-[color:var(--accent-yellow)] mt-6 mb-3">
          {line.slice(3)}
        </h2>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-lg font-semibold text-[color:var(--accent-yellow)] mt-5 mb-2">
          {line.slice(4)}
        </h3>
      );
      continue;
    }

    // Horizontal rule
    if (line.trim() === '---') {
      elements.push(<hr key={i} className="my-6 border-[color:var(--bg-hover)]" />);
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
              <div key={j} className="flex-1 px-2 py-1 text-[color:var(--text-primary)] border border-[color:var(--bg-hover)]">
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
          <div className="w-4 h-4 border border-[color:var(--text-muted)] rounded" />
          <span className="text-[color:var(--text-primary)]">{line.replace(/^\s*- \[ \]\s+/, '')}</span>
        </div>
      );
      continue;
    }
    if (/^\s*- \[x\]\s+/i.test(line)) {
      elements.push(
        <div key={i} className="flex items-center gap-2 ml-4 my-1">
          <div className="w-4 h-4 bg-[color:var(--accent-blue)] rounded flex items-center justify-center text-[color:var(--text-on-accent)] text-xs">✓</div>
          <span className="text-[color:var(--text-primary)]">{line.replace(/^\s*- \[x\]\s+/i, '')}</span>
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
            className={`text-[color:var(--text-primary)] leading-relaxed ${indent ? 'ml-4' : ''}`}
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
          className="my-3 pl-6 list-disc space-y-1 marker:text-[color:var(--accent-blue)]"
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
            className={`text-[color:var(--text-primary)] leading-relaxed ${indent ? 'ml-4' : ''}`}
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
          className="my-3 pl-6 list-decimal space-y-1 marker:text-[color:var(--accent-blue)]"
        >
          {items}
        </ol>
      );
      continue;
    }

    // Italic text lines (starting and ending with single *)
    if (line.startsWith('*') && line.endsWith('*') && line.length > 2) {
      elements.push(
        <p key={i} className="text-[color:var(--accent-green)] italic my-2">
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
      <p key={i} className="text-[color:var(--text-primary)] leading-relaxed my-2">
        {renderInlineText(line)}
      </p>
    );
  }

  if (inCodeBlock) {
    flushCodeBlock();
  }

  return elements;
}

export default function MarkdownRenderer({ content, theme }: { content: string; theme?: ThemeId }) {
  const resolvedTheme = theme || defaultThemeId;
  const nodes = useMemo(() => buildNodes(content, resolvedTheme), [content, resolvedTheme]);
  return <>{nodes}</>;
}
