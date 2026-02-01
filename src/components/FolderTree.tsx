import { useState, useEffect } from 'react';
import { ChevronRight, FileCode, Folder } from 'lucide-react';
import { getLanguageColor, type FolderNode, type FolderState, type Article } from '../types';

interface FolderTreeProps {
    folderTree: FolderNode[];
    articles: Article[];
    onFileClick: (articleId: number) => void;
}

export default function FolderTree({ folderTree, articles, onFileClick }: FolderTreeProps) {
    const [folderStates, setFolderStates] = useState<FolderState>(() => {
        // Load from localStorage or default to root expanded
        const saved = localStorage.getItem('rixa-folder-states');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return { root: true };
            }
        }
        return { root: true };
    });

    // Persist folder states
    useEffect(() => {
        localStorage.setItem('rixa-folder-states', JSON.stringify(folderStates));
    }, [folderStates]);

    const toggleFolder = (folderId: string) => {
        setFolderStates(prev => ({
            ...prev,
            [folderId]: !prev[folderId]
        }));
    };

    const getArticle = (articleId: number) => {
        return articles.find(a => a.id === articleId);
    };

    const renderNode = (node: FolderNode, depth: number = 0) => {
        const isExpanded = folderStates[node.id] || false;
        const paddingLeft = depth * 12 + 8;

        if (node.type === 'folder') {
            return (
                <div key={node.id}>
                    <button
                        type="button"
                        onClick={() => toggleFolder(node.id)}
                        className="w-full flex items-center gap-1 py-2 text-[#cccccc] text-sm cursor-pointer hover:bg-[#2a2d2e] transition-colors text-left select-none touch-manipulation"
                        style={{ paddingLeft }}
                    >
                        <ChevronRight
                            size={14}
                            className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                        {depth === 0 ? (
                            <span className="font-bold">{node.name}</span>
                        ) : (
                            <>
                                <Folder size={14} className="text-[#dcb67a]" />
                                <span>{node.name}/</span>
                            </>
                        )}
                    </button>
                    {isExpanded && node.children && (
                        <div>
                            {node.children.map(child => renderNode(child, depth + 1))}
                        </div>
                    )}
                </div>
            );
        }

        // File node
        const article = node.articleId ? getArticle(node.articleId) : null;
        const language = article?.language || 'markdown';

        return (
            <button
                key={node.id}
                type="button"
                onClick={() => node.articleId && onFileClick(node.articleId)}
                className="w-full flex items-center gap-2 py-2 text-[#cccccc] text-sm cursor-pointer hover:bg-[#2a2d2e] transition-colors text-left select-none touch-manipulation"
                style={{ paddingLeft: paddingLeft + 14 }}
            >
                <FileCode size={14} style={{ color: getLanguageColor(language) }} />
                <span className="truncate">{node.name}</span>
            </button>
        );
    };

    if (folderTree.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-[#6e6e6e] text-sm p-4">
                <p className="text-center">
                    No articles found.<br />
                    <span className="text-xs">Add .md files to public/articles/</span>
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto py-1">
            {folderTree.map(node => renderNode(node, 0))}
        </div>
    );
}
