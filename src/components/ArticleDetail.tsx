import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Clock,
  User,
  Calendar,
  Share2,
  Bookmark,
  Copy,
  Check,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

interface Article {
  id: number;
  title: string;
  displayTitle: string;
  excerpt: string;
  content?: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  language: string;
  tags?: string[];
}

const articlesData: Article[] = [
  {
    id: 1,
    title: "junior_developer_playbook.md",
    displayTitle: "The Junior Developer Playbook",
    excerpt: "What I'd tell my past self. A short, opinionated plan to go from tutorials to shipping.",
    content: `# The Junior Developer Playbook

## What I'd Tell My Past Self

After years of writing code, reviewing pull requests, and mentoring junior developers, I've distilled my advice into this playbook. If you're just starting out, this is for you.

## 1. Build a Habit of Shipping

The difference between developers who grow fast and those who plateau is simple: shipping frequency.

\`\`\`javascript
// Bad: Perfectionism paralysis
function optimizeForMonths() {
  // Never ships
}

// Good: Ship, learn, iterate
function shipAndIterate() {
  // Version 1 goes live
  // Feedback comes in
  // Version 2 improves
}
\`\`\`

## 2. Read Code More Than You Write It

The best developers are code archaeologists. They dig into libraries, frameworks, and senior developers' code to understand patterns.

## 3. Embrace the Uncomfortable

If you're not slightly confused daily, you're not growing. Comfort zones are where skills go to die.

## 4. Document Your Learning

Start a blog. Write READMEs. Comment your code. Teaching is the best way to learn.

## 5. Find Your Community

Join Discord servers. Attend meetups. Contribute to open source. Coding alone is hard; coding with support is sustainable.

---

*Remember: Every senior developer was once where you are now. Keep shipping.*`,
    category: "career",
    readTime: "8 min",
    date: "2026-01-28",
    image: "/images/hero-laptop.jpg",
    language: "markdown",
    tags: ["career", "beginners", "advice"]
  },
  {
    id: 2,
    title: "habit_of_shipping.rs",
    displayTitle: "Build a Habit of Shipping",
    excerpt: "Why shipping frequently is the key to growth.",
    content: `# Build a Habit of Shipping

## The Shipping Mindset

\`\`\`rust
fn main() {
    let mut project = Project::new();
    
    loop {
        project.ship_small_iteration();
        project.gather_feedback();
        project.improve();
        
        if project.is_complete() {
            break;
        }
    }
}
\`\`\`

Shipping is a muscle. The more you exercise it, the stronger it gets.`,
    category: "career",
    readTime: "6 min",
    date: "2026-01-25",
    image: "/images/featured-shipping.jpg",
    language: "rust",
    tags: ["productivity", "career"]
  },
  {
    id: 3,
    title: "code_reviews.tsx",
    displayTitle: "Code Reviews That Help",
    excerpt: "How to give and receive constructive code reviews.",
    content: `# Code Reviews That Help

## The Golden Rule

Review the code, not the coder.

\`\`\`typescript
// Instead of: "You did this wrong"
// Say: "What do you think about this alternative approach?"
\`\`\`

## Checklist for Reviewers

- [ ] Does it solve the problem?
- [ ] Is it readable?
- [ ] Are there tests?
- [ ] Is it performant enough?
- [ ] Is it secure?`,
    category: "team",
    readTime: "5 min",
    date: "2026-01-22",
    image: "/images/featured-code-review.jpg",
    language: "typescript",
    tags: ["team", "code-review"]
  },
  {
    id: 4,
    title: "documentation.md",
    displayTitle: "Docs People Actually Read",
    excerpt: "Writing documentation that developers will actually use.",
    content: `# Docs People Actually Read

## The README Formula

1. **What** - One sentence description
2. **Why** - Problem it solves
3. **How** - Quick start guide
4. **Examples** - Copy-paste ready code

## Code Comments

\`\`\`markdown
// WHY, not WHAT
// Good: Compensate for timezone offset
// Bad: Add 3600 to timestamp
\`\`\``,
    category: "writing",
    readTime: "7 min",
    date: "2026-01-20",
    image: "/images/featured-docs.jpg",
    language: "markdown",
    tags: ["documentation", "writing"]
  },
  {
    id: 5,
    title: "choose_language.go",
    displayTitle: "Choose Your Next Language",
    excerpt: "A guide to picking your next programming language.",
    content: `# Choose Your Next Language

## Readability vs Performance

\`\`\`go
// Go balances both
package main

import "fmt"

func main() {
    fmt.Println("Simple, fast, readable")
}
\`\`\`

## Ecosystem & Hiring

Consider:
- Job market in your area
- Community size
- Package ecosystem
- Learning resources

## Learning Curve Truths

Every language has quirks. Embrace them.`,
    category: "languages",
    readTime: "12 min",
    date: "2026-01-18",
    image: "/images/languages-feature.jpg",
    language: "go",
    tags: ["golang", "rust", "typescript", "python"]
  },
  {
    id: 6,
    title: "macos_setup.sh",
    displayTitle: "macOS for Developers",
    excerpt: "Essential macOS setup for developers.",
    content: `# macOS for Developers

## Essential Tools

\`\`\`bash
# Homebrew - The missing package manager
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# iTerm2 - Better terminal
brew install --cask iterm2

# Zsh + Oh My Zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ools/install.sh)"
\`\`\`

## Development Environment

- VS Code or JetBrains IDEs
- Docker Desktop
- Postman or Insomnia`,
    category: "macOS",
    readTime: "9 min",
    date: "2026-01-15",
    image: "/images/os-macos.jpg",
    language: "bash",
    tags: ["homebrew", "zsh", "macos"]
  },
  {
    id: 7,
    title: "windows_setup.ps1",
    displayTitle: "Windows Without the Friction",
    excerpt: "Setting up Windows for modern development.",
    content: `# Windows Without the Friction

## WSL2 Setup

\`\`\`powershell
# Enable WSL
wsl --install

# Install Ubuntu from Microsoft Store
# Set up Windows Terminal
\`\`\`

## PowerShell Profile

Customize your prompt with Oh My Posh and PSReadLine.`,
    category: "Windows",
    readTime: "9 min",
    date: "2026-01-12",
    image: "/images/os-windows.jpg",
    language: "powershell",
    tags: ["wsl2", "powershell", "windows"]
  },
  {
    id: 8,
    title: "ubuntu_guide.sh",
    displayTitle: "Ubuntu Setup Guide",
    excerpt: "Getting started with Ubuntu for development.",
    content: `# Ubuntu Setup Guide

## Initial Setup

\`\`\`bash
# Update system
sudo apt update && sudo apt upgrade -y

# Essential packages
sudo apt install git curl wget build-essential

# Install VS Code
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
\`\`\``,
    category: "Linux",
    readTime: "6 min",
    date: "2026-01-10",
    image: "/images/linux-ubuntu.jpg",
    language: "bash",
    tags: ["ubuntu", "linux"]
  },
  {
    id: 9,
    title: "fedora_guide.sh",
    displayTitle: "Fedora Workstation",
    excerpt: "Why Fedora might be your next distro.",
    content: `# Fedora Workstation

## Why Fedora?

- Bleeding-edge software
- Strong container/Docker support
- Excellent GNOME experience
- Red Hat backing

## Setup

\`\`\`bash
# Enable RPM Fusion
sudo dnf install https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm
\`\`\``,
    category: "Linux",
    readTime: "6 min",
    date: "2026-01-08",
    image: "/images/linux-fedora.jpg",
    language: "bash",
    tags: ["fedora", "linux"]
  },
  {
    id: 10,
    title: "arch_install.sh",
    displayTitle: "Arch Linux Installation",
    excerpt: "The Arch way: minimal and customizable.",
    content: `# Arch Linux Installation

## The Arch Way

\`\`\`bash
# Boot ISO
# Partition, format, mount
# pacstrap base system
# Configure and reboot
\`\`\`

## Why Arch?

- Rolling release
- AUR - massive package repository
- Complete customization
- Excellent documentation

*Not for beginners, but incredibly rewarding.*`,
    category: "Linux",
    readTime: "8 min",
    date: "2026-01-05",
    image: "/images/linux-arch.jpg",
    language: "bash",
    tags: ["arch", "linux"]
  },
  {
    id: 11,
    title: "terminal_setup.zsh",
    displayTitle: "Terminal Setup That Sticks",
    excerpt: "Building the perfect terminal environment.",
    content: `# Terminal Setup That Sticks

## Zsh + Oh My Zsh

\`\`\`zsh
# Install Oh My Zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/tools/install.sh)"

# Plugins
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
\`\`\`

## Tmux for Session Management

\`\`\`bash
# Install
crew install tmux

# Config in ~/.tmux.conf
\`\`\``,
    category: "tools",
    readTime: "7 min",
    date: "2026-01-03",
    image: "/images/tools-terminal.jpg",
    language: "zsh",
    tags: ["zsh", "tmux", "terminal"]
  },
  {
    id: 12,
    title: "git_workflow.sh",
    displayTitle: "Git Workflow for Teams",
    excerpt: "Branching strategies and best practices.",
    content: `# Git Workflow for Teams

## Feature Branch Workflow

\`\`\`bash
# Start new feature
git checkout -b feature/amazing-thing

# Work, commit, push
git add .
git commit -m "Add amazing thing"
git push origin feature/amazing-thing

# Create PR, review, merge
\`\`\`

## Commit Message Convention

\`\`\`
feat: add new feature
fix: resolve bug
docs: update documentation
refactor: improve code structure
\`\`\``,
    category: "tools",
    readTime: "10 min",
    date: "2025-12-28",
    image: "/images/tools-git.jpg",
    language: "bash",
    tags: ["git", "workflow"]
  },
  {
    id: 13,
    title: "vscode_extensions.json",
    displayTitle: "VS Code Extensions",
    excerpt: "Essential extensions for productivity.",
    content: `# VS Code Extensions

## Essential Extensions

\`\`\`json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "eamodio.gitlens"
  ]
}
\`\`\`

## Themes

- Dracula Official
- One Dark Pro
- Atom One Dark`,
    category: "extensions",
    readTime: "5 min",
    date: "2025-12-25",
    image: "/images/extensions-vscode.jpg",
    language: "json",
    tags: ["vscode", "extensions"]
  },
  {
    id: 14,
    title: "browser_helpers.js",
    displayTitle: "Browser Helpers",
    excerpt: "Extensions that make browsing better.",
    content: `# Browser Helpers

## Development

- **React DevTools** - Inspect React components
- **Redux DevTools** - Debug Redux state
- **JSON Viewer** - Format JSON responses
- **Wappalyzer** - Detect technologies

## Productivity

- **uBlock Origin** - Ad blocker
- **Dark Reader** - Dark mode everywhere
- **Vimium** - Vim bindings for browsing`,
    category: "extensions",
    readTime: "5 min",
    date: "2025-12-22",
    image: "/images/extensions-browser.jpg",
    language: "javascript",
    tags: ["browser", "extensions"]
  },
  {
    id: 15,
    title: "ai_coding.py",
    displayTitle: "AI-Assisted Coding",
    excerpt: "Using AI tools effectively in your workflow.",
    content: `# AI-Assisted Coding

## Tools Overview

\`\`\`python
# GitHub Copilot - Inline suggestions
# ChatGPT - Architecture discussions
# Claude - Code review and explanation
\`\`\`

## Best Practices

1. **AI writes, you verify** - Always review AI-generated code
2. **Use for boilerplate** - Let AI handle repetitive tasks
3. **Ask for explanations** - Understand the code
4. **Don't blindly copy** - Adapt to your codebase

## Prompt Engineering

\`\`\`
"Write a Python function that [specific task].
Include error handling and type hints.
Follow PEP 8 style guidelines."
\`\`\``,
    category: "extensions",
    readTime: "6 min",
    date: "2025-12-20",
    image: "/images/extensions-ai.jpg",
    language: "python",
    tags: ["ai", "productivity"]
  }
];

const getLanguageColor = (lang: string) => {
  const colors: Record<string, string> = {
    markdown: "#6a9955",
    rust: "#dea584",
    typescript: "#569cd6",
    go: "#4ec9b0",
    bash: "#ce9178",
    powershell: "#569cd6",
    zsh: "#89e051",
    json: "#dcdcaa",
    javascript: "#f1e05a",
    python: "#3572A5"
  };
  return colors[lang] || "#d4d4d4";
};

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const article = articlesData.find(a => a.id === Number(id));

  useEffect(() => {
    // Check if bookmarked
    const bookmarks = JSON.parse(localStorage.getItem('rixa-bookmarks') || '[]');
    setBookmarked(bookmarks.includes(Number(id)));
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#f44747] text-xl">Error 404: Article not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 btn-terminal"
          >
            <ChevronLeft size={14} />
            cd ~
          </button>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('rixa-bookmarks') || '[]');
    let newBookmarks;
    if (bookmarked) {
      newBookmarks = bookmarks.filter((b: number) => b !== article.id);
    } else {
      newBookmarks = [...bookmarks, article.id];
    }
    localStorage.setItem('rixa-bookmarks', JSON.stringify(newBookmarks));
    setBookmarked(!bookmarked);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.displayTitle,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex flex-col">
      <div className="flex flex-1 h-screen">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-2 gap-1">
          <div
            onClick={() => navigate('/')}
            className="w-12 h-12 flex items-center justify-center text-[#858585] hover:text-[#cccccc] cursor-pointer"
          >
            <ChevronLeft size={24} />
          </div>
          <div className="flex-1"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
          {/* Tab Bar */}
          <div className="h-9 bg-[#2d2d2d] flex items-end">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#1e1e1e] text-[#cccccc] text-sm border-t-2 border-[#007acc]">
              <span style={{ color: getLanguageColor(article.language) }}>●</span>
              <span>{article.title}</span>
              <button onClick={() => navigate('/')}>
                <X size={14} className="hover:bg-[#4d4d4d] rounded cursor-pointer" />
              </button>
            </div>
          </div>

          {/* Article Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Hero Image */}
            <div className="h-64 overflow-hidden">
              <img
                src={article.image}
                alt={article.displayTitle}
                className="w-full h-full object-cover opacity-60"
              />
            </div>

            {/* Article Header */}
            <div className="px-8 py-6 border-b border-[#3e3e42]">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-lg"
                  style={{ color: getLanguageColor(article.language) }}
                >
                  ●
                </span>
                <span className="text-sm text-[#858585]">{article.title}</span>
              </div>

              <h1 className="text-3xl font-bold text-[#dcdcaa] mb-4">{article.displayTitle}</h1>

              <p className="text-[#9cdcfe] text-lg mb-4">{article.excerpt}</p>

              <div className="flex items-center gap-6 text-sm text-[#858585]">
                <span className="flex items-center gap-1">
                  <User size={14} /> Rixa
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {article.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {article.date}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={handleBookmark}
                  className={`btn-terminal ${bookmarked ? 'border-[#c586c0] text-[#c586c0]' : ''}`}
                >
                  <Bookmark size={14} className={bookmarked ? 'fill-current' : ''} />
                  {bookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
                <button onClick={handleShare} className="btn-terminal">
                  <Share2 size={14} />
                  Share
                </button>
                <button onClick={handleCopyLink} className="btn-terminal">
                  {copied ? <Check size={14} className="text-[#89e051]" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>

              {/* Tags */}
              {article.tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {article.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-[#252526] text-[#9cdcfe] rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="px-8 py-6 max-w-4xl">
              {article.content ? (
                <div className="max-w-none">
                  <MarkdownRenderer content={article.content} />
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-[#6a9955]">// Full article content coming soon...</p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-6 btn-terminal"
                  >
                    <ChevronLeft size={14} />
                    Back to guides
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] flex items-center justify-between px-2 text-xs text-white">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <ChevronLeft size={12} />
            Reading article
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>Ln 1, Col 1</span>
          <span>UTF-8</span>
          <span className="capitalize">{article.language}</span>
        </div>
      </div>
    </div>
  );
}
