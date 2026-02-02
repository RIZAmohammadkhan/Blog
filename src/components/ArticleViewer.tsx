import { Clock, User, Calendar, FileCode } from 'lucide-react';
import { getLanguageColor, type FontSettings, type Article } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import type { ThemeId } from '../types';

interface ArticleViewerProps {
    article: Article | undefined;
    fontSettings: FontSettings;
    theme: ThemeId;
}

export default function ArticleViewer({ article, fontSettings, theme }: ArticleViewerProps) {
    if (!article) {
        return (
            <div className="flex-1 flex items-center justify-center text-[color:var(--text-muted)]">
                Article not found
            </div>
        );
    }

    return (
        <div
            className="flex-1 overflow-y-auto"
            style={{
                fontFamily: fontSettings.fontFamily,
                fontWeight: fontSettings.fontWeight
            }}
        >
            {/* Article Header */}
            <div className="px-4 md:px-8 py-5 md:py-6 border-b border-[color:var(--bg-hover)] bg-[color:var(--bg-secondary)]">
                <div className="flex items-center gap-2 mb-3">
                    <FileCode
                        size={18}
                        style={{ color: getLanguageColor(article.language) }}
                    />
                    <span className="text-sm text-[color:var(--text-secondary)]">{article.title}</span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-[color:var(--accent-yellow)] mb-4">{article.displayTitle}</h1>

                {article.excerpt && (
                    <p className="text-[color:var(--accent-cyan)] text-lg mb-4">{article.excerpt}</p>
                )}

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[color:var(--text-secondary)]">
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
                    <div className="flex flex-wrap gap-2 mt-4">
                        {article.tags.map(tag => (
                            <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-[color:var(--bg-primary)] text-[color:var(--accent-cyan)] rounded"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Article Content */}
            <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
                {article.content ? <MarkdownRenderer content={article.content} theme={theme} /> : (
                    <p className="text-[color:var(--text-muted)] italic">Content coming soon...</p>
                )}
            </div>
        </div>
    );
}
