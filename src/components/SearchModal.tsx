import { useEffect, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import { Search, FileCode, X } from 'lucide-react';
import { getLanguageColor, type Article } from '../types';

interface SearchModalProps {
    isOpen: boolean;
    articles: Article[];
    onClose: () => void;
    onSelectArticle: (article: Article) => void;
}

export default function SearchModal({ isOpen, articles, onClose, onSelectArticle }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Article[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const fuseRef = useRef<Fuse<Article> | null>(null);

    // Initialize/update Fuse.js when articles change
    useEffect(() => {
        fuseRef.current = new Fuse(articles, {
            keys: [
                { name: 'displayTitle', weight: 0.4 },
                { name: 'title', weight: 0.3 },
                { name: 'category', weight: 0.15 },
                { name: 'content', weight: 0.1 },
                { name: 'tags', weight: 0.05 },
            ],
            threshold: 0.4,
            includeScore: true,
            ignoreLocation: true,
        });
    }, [articles]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setQuery('');
            setResults(articles.slice(0, 8));
            setSelectedIndex(0);
        }
    }, [isOpen, articles]);

    // Prevent background scrolling when modal is open (especially important on mobile)
    useEffect(() => {
        if (!isOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    useEffect(() => {
        if (!fuseRef.current) return;

        if (query.trim() === '') {
            setResults(articles.slice(0, 8));
        } else {
            const searchResults = fuseRef.current.search(query);
            setResults(searchResults.map(r => r.item).slice(0, 8));
        }
        setSelectedIndex(0);
    }, [query, articles]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (results[selectedIndex]) {
                    onSelectArticle(results[selectedIndex]);
                    onClose();
                }
                break;
            case 'Escape':
                onClose();
                break;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 md:pt-[15vh] px-3">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onPointerDown={onClose} />

            {/* Modal */}
            <div
                className="relative w-full max-w-2xl bg-[#252526] rounded-lg border border-[#3c3c3c] shadow-2xl overflow-hidden"
                onPointerDown={e => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[#3c3c3c]">
                    <Search size={18} className="text-[#858585]" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search articles..."
                        className="flex-1 bg-transparent text-[#cccccc] text-base md:text-sm outline-none placeholder-[#6e6e6e]"
                    />
                    <button
                        onClick={onClose}
                        className="text-[#858585] hover:text-[#cccccc] transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[70vh] md:max-h-[50vh] overflow-y-auto">
                    {results.length === 0 ? (
                        <div className="px-4 py-8 text-center text-[#6e6e6e] text-sm">
                            {articles.length === 0
                                ? "No articles loaded. Add .md files to public/articles/"
                                : `No articles found matching "${query}"`
                            }
                        </div>
                    ) : (
                        <div className="py-2">
                            {results.map((article, index) => (
                                <div
                                    key={article.id}
                                    onClick={() => {
                                        onSelectArticle(article);
                                        onClose();
                                    }}
                                    className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${index === selectedIndex
                                            ? 'bg-[#04395e]'
                                            : 'hover:bg-[#2a2d2e]'
                                        }`}
                                >
                                    <FileCode
                                        size={16}
                                        style={{ color: getLanguageColor(article.language) }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-[#cccccc] truncate">
                                            {article.displayTitle}
                                        </div>
                                        <div className="text-xs text-[#858585] truncate">
                                            {article.title} • {article.category}
                                        </div>
                                    </div>
                                    <span className="text-xs text-[#6e6e6e]">
                                        {article.readTime}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Hint */}
                <div className="hidden md:flex px-4 py-2 border-t border-[#3c3c3c] items-center gap-4 text-xs text-[#6e6e6e]">
                    <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-[#3c3c3c] rounded">↑↓</kbd>
                        to navigate
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-[#3c3c3c] rounded">Enter</kbd>
                        to open
                    </span>
                    <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 bg-[#3c3c3c] rounded">Esc</kbd>
                        to close
                    </span>
                </div>
            </div>
        </div>
    );
}
