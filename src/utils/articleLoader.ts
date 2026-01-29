import { type Article, type FolderNode } from '../types';

// Parse YAML-like frontmatter from markdown content
function parseFrontmatter(content: string): { frontmatter: Record<string, string>; body: string } {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return { frontmatter: {}, body: content };
    }

    const frontmatterStr = match[1];
    const body = match[2];

    const frontmatter: Record<string, string> = {};
    const lines = frontmatterStr.split('\n');

    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.slice(0, colonIndex).trim();
            const value = line.slice(colonIndex + 1).trim();
            frontmatter[key] = value;
        }
    }

    return { frontmatter, body };
}

// Get language from file extension or folder
function getLanguageFromPath(path: string): string {
    const ext = path.split('.').pop()?.toLowerCase() || 'md';
    const langMap: Record<string, string> = {
        md: 'markdown',
        rs: 'rust',
        tsx: 'typescript',
        ts: 'typescript',
        go: 'go',
        sh: 'bash',
        ps1: 'powershell',
        zsh: 'zsh',
        json: 'json',
        js: 'javascript',
        py: 'python'
    };
    return langMap[ext] || 'markdown';
}

// Convert filename to display name
function filenameToDisplayTitle(filename: string): string {
    return filename
        .replace(/\.md$/, '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Load all articles from the articles folder using Vite's import.meta.glob
export async function loadArticles(): Promise<{ articles: Article[]; folderTree: FolderNode[] }> {
    // Use Vite's glob import to load all markdown files from src/articles
    const articleModules = import.meta.glob('../articles/**/*.md', {
        query: '?raw',
        eager: true
    }) as Record<string, { default: string }>;

    const articles: Article[] = [];
    const folderMap: Map<string, FolderNode> = new Map();

    // Create root folder
    const rootFolder: FolderNode = {
        id: 'root',
        name: 'RIXA-GUIDE',
        type: 'folder',
        children: []
    };
    folderMap.set('root', rootFolder);

    let articleId = 1;

    for (const [path, module] of Object.entries(articleModules)) {
        const content = module.default;
        const { frontmatter, body } = parseFrontmatter(content);

        // Extract path parts: ../articles/category/filename.md
        const pathParts = path.replace('../articles/', '').split('/');
        const filename = pathParts.pop() || '';
        const category = pathParts[0] || 'uncategorized';

        // Create article
        const article: Article = {
            id: articleId++,
            title: filename,
            displayTitle: frontmatter.title || filenameToDisplayTitle(filename),
            excerpt: body.split('\n').find(line => line.trim() && !line.startsWith('#'))?.slice(0, 150) || '',
            content: body,
            category: category,
            readTime: frontmatter.readTime || '5 min',
            date: frontmatter.date,
            image: frontmatter.image || '/images/default.jpg',
            language: getLanguageFromPath(filename),
            tags: frontmatter.tags?.split(',').map(t => t.trim()) || []
        };

        articles.push(article);

        // Build folder structure
        if (!folderMap.has(category)) {
            const categoryFolder: FolderNode = {
                id: category,
                name: category,
                type: 'folder',
                children: []
            };
            folderMap.set(category, categoryFolder);
            rootFolder.children!.push(categoryFolder);
        }

        // Add file to category folder
        const categoryFolder = folderMap.get(category)!;
        categoryFolder.children!.push({
            id: `file-${article.id}`,
            name: filename,
            type: 'file',
            articleId: article.id
        });
    }

    // Sort folders and files alphabetically
    rootFolder.children!.sort((a, b) => a.name.localeCompare(b.name));
    for (const folder of rootFolder.children!) {
        if (folder.children) {
            folder.children.sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    return {
        articles,
        folderTree: [rootFolder]
    };
}

// Synchronous version that uses pre-loaded data
let cachedArticles: Article[] | null = null;
let cachedFolderTree: FolderNode[] | null = null;

export function getArticlesSync(): Article[] {
    return cachedArticles || [];
}

export function getFolderTreeSync(): FolderNode[] {
    return cachedFolderTree || [];
}

export function setCachedData(articles: Article[], folderTree: FolderNode[]) {
    cachedArticles = articles;
    cachedFolderTree = folderTree;
}
