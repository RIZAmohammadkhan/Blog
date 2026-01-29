import { type ReactNode } from 'react';
import { Clock, User, Calendar, FileCode } from 'lucide-react';
import { getLanguageColor, type FontSettings, type Article } from '../types';

interface ArticleViewerProps {
    article: Article | undefined;
    fontSettings: FontSettings;
}

export default function ArticleViewer({ article, fontSettings }: ArticleViewerProps) {
    if (!article) {
        return (
            <div className="flex-1 flex items-center justify-center text-[#6e6e6e]">
                Article not found
            </div>
        );
    }

    // Parse markdown-like content to HTML
    const renderContent = (content: string): ReactNode[] => {
        const elements: ReactNode[] = [];
        const lines = content.split('\n');
        let inCodeBlock = false;
        let codeContent: string[] = [];
        let codeLang = '';
        let blockIndex = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Code block handling
            if (line.startsWith('```')) {
                if (inCodeBlock) {
                    // End of code block
                    elements.push(
                        <div key={`code-${blockIndex++}`} className="my-4 rounded-lg overflow-hidden bg-[#1e1e1e] border border-[#3e3e42]">
                            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d30] border-b border-[#3e3e42]">
                                <span className="text-xs text-[#858585]">{codeLang || 'text'}</span>
                                <button
                                    onClick={() => navigator.clipboard.writeText(codeContent.join('\n'))}
                                    className="text-xs text-[#569cd6] hover:text-[#4ec9b0] transition-colors"
                                >
                                    Copy
                                </button>
                            </div>
                            <pre className="p-4 overflow-x-auto">
                                <code className="text-sm text-[#d4d4d4] font-mono">
                                    {codeContent.join('\n')}
                                </code>
                            </pre>
                        </div>
                    );
                    codeContent = [];
                    codeLang = '';
                    inCodeBlock = false;
                } else {
                    // Start of code block
                    inCodeBlock = true;
                    codeLang = line.slice(3).trim();
                }
                continue;
            }

            if (inCodeBlock) {
                codeContent.push(line);
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
                elements.push(
                    <hr key={i} className="my-6 border-[#3e3e42]" />
                );
                continue;
            }

            // Tables
            if (line.startsWith('|')) {
                // Simple table rendering
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

            // Numbered lists
            if (/^\d+\.\s/.test(line)) {
                const content = line.replace(/^\d+\.\s/, '');
                elements.push(
                    <div key={i} className="flex gap-2 ml-4 my-1">
                        <span className="text-[#569cd6]">{line.match(/^\d+/)?.[0]}.</span>
                        <span className="text-[#d4d4d4]">{renderInlineText(content)}</span>
                    </div>
                );
                continue;
            }

            // Checkboxes
            if (line.startsWith('- [ ]')) {
                elements.push(
                    <div key={i} className="flex items-center gap-2 ml-4 my-1">
                        <div className="w-4 h-4 border border-[#6e6e6e] rounded" />
                        <span className="text-[#d4d4d4]">{line.slice(6)}</span>
                    </div>
                );
                continue;
            }
            if (line.startsWith('- [x]')) {
                elements.push(
                    <div key={i} className="flex items-center gap-2 ml-4 my-1">
                        <div className="w-4 h-4 bg-[#007acc] rounded flex items-center justify-center text-white text-xs">✓</div>
                        <span className="text-[#d4d4d4]">{line.slice(6)}</span>
                    </div>
                );
                continue;
            }

            // Lists
            if (line.startsWith('- ')) {
                elements.push(
                    <li key={i} className="text-[#d4d4d4] ml-4 my-1 list-disc list-inside">
                        {renderInlineText(line.slice(2))}
                    </li>
                );
                continue;
            }

            // Italic text lines (starting with *)
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

            // Regular paragraph with inline formatting
            elements.push(
                <p key={i} className="text-[#d4d4d4] leading-relaxed my-2">
                    {renderInlineText(line)}
                </p>
            );
        }

        return elements;
    };

    // Render inline text with bold, code, etc.
    const renderInlineText = (text: string): ReactNode => {
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
                return <strong key={i} className="text-[#9cdcfe] font-semibold">{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <div
            className="flex-1 overflow-y-auto"
            style={{
                fontFamily: fontSettings.fontFamily,
                fontWeight: fontSettings.fontWeight
            }}
        >
            {/* Article Header */}
            <div className="px-8 py-6 border-b border-[#3e3e42] bg-[#252526]">
                <div className="flex items-center gap-2 mb-3">
                    <FileCode
                        size={18}
                        style={{ color: getLanguageColor(article.language) }}
                    />
                    <span className="text-sm text-[#858585]">{article.title}</span>
                </div>

                <h1 className="text-3xl font-bold text-[#dcdcaa] mb-4">{article.displayTitle}</h1>

                {article.excerpt && (
                    <p className="text-[#9cdcfe] text-lg mb-4">{article.excerpt}</p>
                )}

                <div className="flex items-center gap-6 text-sm text-[#858585]">
                    <span className="flex items-center gap-1">
                        <User size={14} /> Rixa
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={14} /> {article.readTime}
                    </span>
                    {article.date && (
                        <span className="flex items-center gap-1">
                            <Calendar size={14} /> {article.date}
                        </span>
                    )}
                </div>

                {article.tags && article.tags.length > 0 && (
                    <div className="flex gap-2 mt-4">
                        {article.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-[#1e1e1e] text-[#9cdcfe] rounded"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Article Content */}
            <div className="px-8 py-6 max-w-4xl">
                {article.content ? renderContent(article.content) : (
                    <p className="text-[#6e6e6e] italic">Content coming soon...</p>
                )}
            </div>
        </div>
    );
}
