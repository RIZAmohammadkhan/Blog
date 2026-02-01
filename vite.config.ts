import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Shiki language grammars / wasm can create large (but fine) lazy chunks.
    // Raise the warning threshold and split other vendor code to keep the entry chunk slim.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          // Keep Shiki's own dynamic language chunks intact; don't force them into one.
          if (id.includes('/node_modules/shiki/') || id.includes('/node_modules/@shikijs/')) {
            return;
          }

          // Only match the actual React packages (Radix packages contain "react-" in their names).
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/scheduler/')
          ) {
            return 'react-vendor';
          }

          if (
            id.includes('@radix-ui') ||
            id.includes('vaul') ||
            id.includes('cmdk') ||
            id.includes('react-resizable-panels')
          ) {
            return 'ui-vendor';
          }

          if (id.includes('recharts') || id.includes('d3')) {
            return 'charts';
          }

          if (id.includes('fuse.js')) {
            return 'search';
          }

          // Let Rollup decide the rest; forcing a catch-all chunk tends to create a huge "vendor" bundle.
          return;
        }
      }
    }
  }
});
