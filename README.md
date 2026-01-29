# Rixa's Guide (Dev Blog)

A personal developer blog and documentation site styled to look and feel like a modern IDE (VS Code). Built with React, Vite, and TypeScript.

## ✨ Features

- **IDE Interface**: A fully functional UI with a file explorer, tab system, activity bar, and status bar.
- **Markdown Content**: Articles are written in Markdown and dynamically loaded from the file system using Vite's glob imports.
- **Command Palette**: Press `Ctrl+K` (or `Cmd+K`) to search articles instantly using Fuse.js.
- **Syntax Highlighting**: Code blocks in articles feature proper syntax coloring.
- **Dynamic File Tree**: The sidebar automatically generates a folder structure based on your `src/articles` directory.
- **Customizable**: Settings panel to adjust font family and weight.
- **Responsive**: Adapts to mobile views with a drawer-based navigation.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Search**: [Fuse.js](https://www.fusejs.io/)
- **Routing**: React Router DOM

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/rixas-guide.git
   cd rixas-guide
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## 📝 Adding New Articles

You do not need to write any React code to add content. The application uses a dynamic loader to find files.

1. Create a new `.md` file in `src/articles/[category]/`.
   *Example: `src/articles/react/hooks-guide.md`*

2. Add the required Frontmatter at the top of the file:

   ```markdown
   ---
   title: Complete Guide to Hooks
   readTime: 8 min
   date: 2026-01-30
   tags: react, hooks, frontend
   image: /images/react-cover.jpg
   ---

   ## Your Content Here
   Markdown content goes here...
   ```

3. **That's it!** The application will automatically:
   - Detect the file.
   - Create the category folder in the "Explorer" sidebar if it doesn't exist.
   - Index the content for the search modal.
   - Determine the file icon color based on the extension (or default to Markdown).

## 📂 Project Structure

```
src/
├── articles/       # Markdown content files organized by folders
├── components/     # React UI components
│   ├── ui/         # shadcn/ui primitives
│   ├── ArticleViewer.tsx  # Renders markdown content
│   ├── FolderTree.tsx     # Recursive sidebar file explorer
│   ├── SearchModal.tsx    # Fuse.js powered command palette
│   └── TabBar.tsx         # IDE-like tab management
├── utils/          # Helper functions (article loader, markdown parser)
├── App.tsx         # Main layout and state management
└── types.ts        # TypeScript interfaces
```

## ⌨️ Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + K` / `Cmd + K` | Open Search / Command Palette |
| `Ctrl + B` / `Cmd + B` | Toggle Sidebar |
| `Esc` | Close Modals |

## 🎨 Customization

- **Theme Colors**: Modified in `src/index.css` via CSS variables.
- **Font Settings**: Defaults defined in `src/types.ts`.
- **UI Components**: Built using Tailwind CSS in `src/components/ui`.

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.