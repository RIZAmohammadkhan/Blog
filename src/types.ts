// Shared types for VS Code-like blog interface

export interface Article {
  id: number;
  title: string;
  displayTitle: string;
  excerpt?: string;
  content?: string;
  category: string;
  readTime: string;
  date?: string;
  image: string;
  language: string;
  tags?: string[];
  featured?: boolean;
  sidebarItems?: string[];
}

export interface Tab {
  id: number;
  title: string;
  displayTitle: string;
  language: string;
}

export interface FolderState {
  [folderId: string]: boolean; // true = expanded, false = collapsed
}

export interface FontSettings {
  fontFamily: string;
  fontWeight: number;
}

export type ThemeId = 'default' | 'dracula' | 'one-dark-pro' | 'aura-dark';

export const defaultThemeId: ThemeId = 'default';

export const themeOptions: Array<{ label: string; value: ThemeId }> = [
  { label: 'Default', value: 'default' },
  { label: 'Dracula', value: 'dracula' },
  { label: 'One Dark Pro', value: 'one-dark-pro' },
  { label: 'Aura Dark', value: 'aura-dark' },
];

export interface FolderNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon?: string;
  articleId?: number;
  children?: FolderNode[];
}

// Language colors for file icons
export const getLanguageColor = (lang: string): string => {
  const colors: Record<string, string> = {
    // Theme-aware defaults
    markdown: 'var(--accent-green)',
    typescript: 'var(--accent-blue)',
    javascript: 'var(--accent-yellow)',
    go: 'var(--accent-cyan)',
    bash: 'var(--accent-orange)',
    zsh: 'var(--accent-green)',
    json: 'var(--accent-yellow)',
    powershell: 'var(--accent-blue)',
    rust: 'var(--accent-orange)',

    // If something isn't covered by theme variables, fall back to a readable neutral.
    python: '#3572A5'
  };
  return colors[lang] || "#d4d4d4";
};

// Default font settings
export const defaultFontSettings: FontSettings = {
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontWeight: 400
};

// Available font options
export const fontFamilyOptions = [
  { label: 'System Default', value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { label: 'Inter', value: '"Inter", sans-serif' },
  { label: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
  { label: 'Fira Code', value: '"Fira Code", monospace' },
  { label: 'Source Code Pro', value: '"Source Code Pro", monospace' },
  { label: 'IBM Plex Mono', value: '"IBM Plex Mono", monospace' },
];
