import { useEffect, useState } from 'react';
import {
  Search,
  FileCode,
  GitBranch,

  Layers,
  Settings,
  ChevronRight,
  Code2,
  X,
  Hash,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import SearchModal from './components/SearchModal';
import TabBar from './components/TabBar';
import ArticleViewer from './components/ArticleViewer';
import FolderTree from './components/FolderTree';
import SettingsPanel from './components/SettingsPanel';
import AboutPanel from './components/AboutPanel';
import ResourcesPanel from './components/ResourcesPanel';
import { loadArticles } from './utils/articleLoader';
import { useIsMobile } from './hooks/use-mobile';
import { Sheet, SheetContent } from './components/ui/sheet';
import {
  defaultFontSettings,
  defaultThemeId,
  type Tab,
  type FontSettings,
  type Article,
  type FolderNode,
  type ThemeId
} from './types';
import './App.css';

type SidebarPanel = 'explorer' | 'about' | 'resources';

// Welcome content component shown when no tabs are open
function WelcomeContent({
  isMobile,
  onOpenExplorer,
  onOpenSearch
}: {
  isMobile: boolean;
  onOpenExplorer: () => void;
  onOpenSearch: () => void;
}) {
  return (
    <div className="flex-1 flex items-center justify-center bg-[color:var(--bg-primary)]">
      <div className="text-center max-w-lg px-5 md:px-8">
        <div className="text-5xl md:text-6xl mb-5 md:mb-6">📚</div>
        <h1 className="text-2xl font-bold text-[color:var(--accent-yellow)] mb-4">Welcome to Rixa's Guide</h1>
        <p className="text-[color:var(--text-secondary)] mb-6 leading-relaxed text-balance">
          Browse the folders to find articles. For beginners, start with the <span className="text-[color:var(--text-primary)]">Hello-devs.md</span> article in the <span className="text-[color:var(--text-primary)]">getting_started</span> folder.
        </p>

        {isMobile ? (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onOpenExplorer}
              className="w-full rounded-lg bg-[color:var(--bg-tertiary)] border border-[color:var(--bg-hover)] px-4 py-3 text-sm text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)] active:bg-[color:var(--bg-selected)] transition-colors"
            >
              Open Explorer
            </button>
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-full rounded-lg bg-[color:var(--bg-secondary)] border border-[color:var(--bg-hover)] px-4 py-3 text-sm text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)] active:bg-[color:var(--bg-selected)] transition-colors"
            >
              Search articles
            </button>
            <div className="text-xs text-[color:var(--text-muted)] leading-relaxed">
              Tip: use the icons on the left rail (Explorer, Search, About).
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 text-sm text-[color:var(--text-muted)]">
            <div className="flex items-center justify-center gap-2">
              <kbd className="px-2 py-1 bg-[color:var(--bg-kbd)] rounded text-[color:var(--text-primary)]">Ctrl+K</kbd>
              <span>Open search</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[color:var(--text-primary)]">Click files</span>
              <span>in the sidebar to read articles</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const isMobile = useIsMobile();

  // Article data - loaded dynamically
  const [articles, setArticles] = useState<Article[]>([]);
  const [folderTree, setFolderTree] = useState<FolderNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tab state
  const [openTabs, setOpenTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);

  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sidebar state
  const [activeSidebarPanel, setActiveSidebarPanel] = useState<SidebarPanel>('explorer');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);


  // Font settings
  const [fontSettings, setFontSettings] = useState<FontSettings>(() => {
    const saved = localStorage.getItem('rixa-font-settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultFontSettings;
      }
    }
    return defaultFontSettings;
  });

  // Theme
  const [theme, setTheme] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('rixa-theme');
    if (saved === 'dracula' || saved === 'one-dark-pro' || saved === 'aura-dark' || saved === 'default') {
      return saved;
    }
    return defaultThemeId;
  });

  // Load articles on mount
  useEffect(() => {
    loadArticles().then(({ articles: loadedArticles, folderTree: loadedTree }) => {
      setArticles(loadedArticles);
      setFolderTree(loadedTree);
      setIsLoading(false);
    });
  }, []);

  // Persist font settings
  useEffect(() => {
    localStorage.setItem('rixa-font-settings', JSON.stringify(fontSettings));
  }, [fontSettings]);

  // Apply + persist theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('rixa-theme', theme);
  }, [theme]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsSettingsOpen(false);
      }
      // Ctrl/Cmd + B to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsSidebarVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Open article as tab
  const openArticle = (article: Article) => {
    // Check if already open
    if (openTabs.some(tab => tab.id === article.id)) {
      setActiveTabId(article.id);
      return;
    }

    const newTab: Tab = {
      id: article.id,
      title: article.title,
      displayTitle: article.displayTitle,
      language: article.language
    };

    setOpenTabs(prev => [...prev, newTab]);
    setActiveTabId(article.id);


  };

  // Open article by ID (from folder tree)
  const openArticleById = (articleId: number) => {
    const article = articles.find(a => a.id === articleId);
    if (article) {
      openArticle(article);
    }
  };

  const openArticleByIdFromSidebar = (articleId: number) => {
    openArticleById(articleId);
    if (isMobile) setIsMobileSidebarOpen(false);
  };

  // Close tab
  const closeTab = (tabId: number) => {
    setOpenTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);

      // If closing active tab, switch to adjacent tab
      if (activeTabId === tabId) {
        const closedIndex = prev.findIndex(tab => tab.id === tabId);
        if (newTabs.length > 0) {
          const newActiveIndex = Math.min(closedIndex, newTabs.length - 1);
          setActiveTabId(newTabs[newActiveIndex].id);
        } else {
          setActiveTabId(null);
        }
      }

      return newTabs;
    });
  };



  // Get active article
  const activeArticle = activeTabId !== null
    ? articles.find(a => a.id === activeTabId)
    : undefined;

  // Render sidebar content based on active panel
  const renderSidebarContent = () => {
    const rootNode = folderTree.find(node => node.id === 'root') || folderTree[0];
    const rootLevelCategories = (rootNode?.children || []).filter(child => child.type === 'folder');
    const categoryCount = rootLevelCategories.length;

    switch (activeSidebarPanel) {
      case 'about':
        return <AboutPanel articleCount={articles.length} categoryCount={categoryCount} isLoading={isLoading} />;
      case 'resources':
        return <ResourcesPanel />;
      case 'explorer':
      default:
        return (
          <>
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center text-[color:var(--text-muted)]">
                Loading articles...
              </div>
            ) : (
              <FolderTree
                folderTree={folderTree}
                articles={articles}
                onFileClick={openArticleByIdFromSidebar}
              />
            )}

            {/* Open Editors Section */}
            {openTabs.length > 0 && (
              <div className="border-t border-[color:var(--bg-primary)]">
                <div className="h-8 flex items-center px-3 text-xs text-[color:var(--text-primary)]">
                  <ChevronRight size={12} className="mr-1 rotate-90" />
                  OPEN EDITORS
                </div>
                <div className="px-2 pb-2 max-h-32 overflow-y-auto">
                  {openTabs.map(tab => (
                    <div
                      key={tab.id}
                      onClick={() => {
                        setActiveTabId(tab.id);
                        if (isMobile) setIsMobileSidebarOpen(false);
                      }}
                      className={`flex items-center gap-2 px-2 py-1 text-sm cursor-pointer transition-colors ${tab.id === activeTabId
                        ? 'bg-[color:var(--bg-selected)] text-[color:var(--text-primary)]'
                        : 'text-[color:var(--text-primary)] hover:bg-[color:var(--bg-hover)]'
                        }`}
                    >
                      <FileCode size={14} className="text-[#519aba]" />
                      <span className="truncate">{tab.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );
    }
  };

  const getSidebarTitle = () => {
    switch (activeSidebarPanel) {
      case 'about': return 'About';
      case 'resources': return 'Resources';
      default: return 'Explorer';
    }
  };

  const sidebarTitle = getSidebarTitle();

  const openSidebarPanel = (panel: SidebarPanel) => {
    setActiveSidebarPanel(panel);
    if (isMobile) {
      setIsMobileSidebarOpen(true);
      return;
    }
    setIsSidebarVisible(true);
  };

  const toggleSidebarPanel = (panel: SidebarPanel) => {
    if (isMobile) {
      if (activeSidebarPanel === panel && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      } else {
        setActiveSidebarPanel(panel);
        setIsMobileSidebarOpen(true);
      }
      return;
    }

    if (activeSidebarPanel === panel && isSidebarVisible) {
      setIsSidebarVisible(false);
    } else {
      setActiveSidebarPanel(panel);
      setIsSidebarVisible(true);
    }
  };

  const toggleExplorerPanel = () => {
    if (isMobile) {
      if (activeSidebarPanel === 'explorer' && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      } else {
        setActiveSidebarPanel('explorer');
        setIsMobileSidebarOpen(true);
      }
      return;
    }

    if (activeSidebarPanel === 'explorer' && isSidebarVisible) {
      setIsSidebarVisible(false);
    } else {
      setActiveSidebarPanel('explorer');
      setIsSidebarVisible(true);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[color:var(--bg-primary)] flex flex-col">
      {/* Main Layout - Full height without top bar */}
      <div className="flex flex-1 h-[100dvh]">
        {/* Activity Bar */}
        <div className="w-10 md:w-12 bg-[color:var(--bg-activity)] flex flex-col items-center py-2 gap-1">
          <div
            onClick={toggleExplorerPanel}
            className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center cursor-pointer transition-colors ${activeSidebarPanel === 'explorer' && (isMobile ? isMobileSidebarOpen : isSidebarVisible)
              ? 'text-[color:var(--text-primary)] border-l-2 border-[color:var(--accent-blue)] bg-[color:var(--bg-secondary)]'
              : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
              }`}
            title="Explorer"
          >
            <FileCode size={22} className="md:size-6" />
          </div>
          <div
            onClick={() => setIsSearchOpen(true)}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] cursor-pointer"
            title="Search (Ctrl+K)"
          >
            <Search size={22} className="md:size-6" />
          </div>
          <div
            onClick={() => toggleSidebarPanel('about')}
            className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center cursor-pointer transition-colors ${activeSidebarPanel === 'about' && (isMobile ? isMobileSidebarOpen : isSidebarVisible)
              ? 'text-[color:var(--text-primary)] border-l-2 border-[color:var(--accent-blue)] bg-[color:var(--bg-secondary)]'
              : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
              }`}
            title="About"
          >
            <GitBranch size={22} className="md:size-6" />
          </div>

          <div
            onClick={() => toggleSidebarPanel('resources')}
            className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center cursor-pointer transition-colors ${activeSidebarPanel === 'resources' && (isMobile ? isMobileSidebarOpen : isSidebarVisible)
              ? 'text-[color:var(--text-primary)] border-l-2 border-[color:var(--accent-blue)] bg-[color:var(--bg-secondary)]'
              : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
              }`}
            title="Resources"
          >
            <Layers size={22} className="md:size-6" />
          </div>
          <div className="flex-1"></div>
          <div
            onClick={() => {
              if (isMobile) {
                setIsMobileSidebarOpen(prev => !prev);
              } else {
                setIsSidebarVisible(prev => !prev);
              }
            }}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] cursor-pointer"
            title="Toggle Sidebar (Ctrl+B)"
          >
            {(isMobile ? isMobileSidebarOpen : isSidebarVisible) ? <PanelLeftClose size={22} className="md:size-6" /> : <PanelLeft size={22} className="md:size-6" />}
          </div>
          <div
            onClick={() => {
              if (isMobile) setIsMobileSidebarOpen(false);
              setIsSettingsOpen(true);
            }}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] cursor-pointer"
            title="Settings"
          >
            <Settings size={22} className="md:size-6" />
          </div>
        </div>

        {/* Desktop Sidebar */}
        {isSidebarVisible && (
          <div className="hidden md:flex w-64 bg-[color:var(--bg-secondary)] border-r border-[color:var(--bg-primary)] flex-col">
            <div className="h-9 flex items-center px-3 text-xs font-bold text-[color:var(--text-primary)] uppercase tracking-wide">
              {sidebarTitle}
            </div>
            {renderSidebarContent()}
          </div>
        )}

        {/* Mobile Sidebar Drawer */}
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetContent
            side="left"
            className="md:hidden bg-[color:var(--bg-secondary)] border-[color:var(--bg-primary)] p-0 gap-0"
          >
            <div className="h-9 flex items-center px-3 text-xs font-bold text-[color:var(--text-primary)] uppercase tracking-wide border-b border-[color:var(--bg-primary)]">
              {sidebarTitle}
            </div>
            <div className="flex-1 min-h-0 flex flex-col">
              {renderSidebarContent()}
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-[color:var(--bg-primary)] overflow-hidden">
          {/* Tab Bar */}
          <TabBar
            tabs={openTabs}
            activeTabId={activeTabId}
            onTabClick={setActiveTabId}
            onTabClose={closeTab}
          />

          {/* Content Area */}
          {activeTabId !== null ? (
            <ArticleViewer
              article={activeArticle}
              fontSettings={fontSettings}
              theme={theme}
            />
          ) : (
            <WelcomeContent
              isMobile={isMobile}
              onOpenExplorer={() => openSidebarPanel('explorer')}
              onOpenSearch={() => setIsSearchOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="hidden md:flex h-6 bg-[color:var(--accent-blue)] items-center justify-between px-2 text-xs text-[color:var(--text-on-accent)]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 cursor-pointer hover:bg-[color:var(--accent-blue-hover)] px-1 rounded">
            <GitBranch size={12} />
            main
          </span>
          <span className="flex items-center gap-1">
            <X size={12} />
            0 errors
          </span>
          <span className="flex items-center gap-1">
            <Hash size={12} />
            0 warnings
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>{articles.length} articles</span>
          <span>UTF-8</span>
          <span>{activeArticle?.language || 'Markdown'}</span>
          <span className="flex items-center gap-1">
            <Code2 size={12} />
            Prettier
          </span>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        articles={articles}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={openArticle}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={fontSettings}
        onSettingsChange={setFontSettings}
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
}

export default App;
