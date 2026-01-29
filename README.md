# Minimal Dev Blog (Vite + React + TypeScript)

A small personal blog scaffolded with Vite, React, and TypeScript. Articles are plain Markdown files under `src/articles` and the UI is in `src/components`.

Getting started

- Install dependencies:

```bash
npm install
```

- Run the dev server:

```bash
npm run dev
```

- Build for production:

```bash
npm run build
```

Available scripts (from `package.json`)

- `dev` — start Vite dev server
- `build` — build production files
- `preview` — locally preview production build

Project layout

- `src/` — application source
  - `articles/` — markdown content used by the site
  - `components/` — React UI components
  - `main.tsx`, `App.tsx` — app entry

Notes

- Add new posts as Markdown files in `src/articles`.
- Environment variables: create a `.env` file for local secrets (excluded from git).

Want me to commit these files or run `npm install` now? 
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    # Blog (Vite + React + TypeScript)

    A small personal blog built with Vite, React and TypeScript. Includes a simple file-based article loader and a lightweight UI components library.

    ## Features

    - Vite dev server with HMR
    - TypeScript and ESLint configuration
    - File-based article content under `src/articles`

    ## Prerequisites

    - Node.js 18+ (or an active LTS) and npm, yarn or pnpm

    ## Setup

    Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

    ## Development

    Run the dev server:

    ```bash
    npm run dev
    ```

    Open http://localhost:5173 in your browser.

    ## Build

    Create a production build:

    ```bash
    npm run build
    ```

    Preview the production build locally:

    ```bash
    npm run preview
    ```

    ## Project layout (key paths)

    - `src/` — application source
    - `src/articles/` — markdown articles
    - `src/components/` — React components and UI primitives
    - `public/` — static assets

    ## Contributing

    Contributions are welcome. Open an issue or a PR with a clear description of changes.

    ## License

    This project is provided "as-is". Add a license file if you want to apply one.
