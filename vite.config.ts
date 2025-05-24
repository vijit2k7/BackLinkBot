import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';
import type { ViteDevServer } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    setupMiddleware(middlewares: ViteDevServer['middlewares']) {
      // Serve blog content during development
      middlewares.use('/content/blog', (req, res, next) => {
        const filePath = path.join(__dirname, 'content/blog', req.url || '');
        if (fs.existsSync(filePath)) {
          res.setHeader('Content-Type', 'text/plain');
          res.end(fs.readFileSync(filePath, 'utf8'));
        } else {
          next();
        }
      });
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'public/admin/index.html'),
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: true,
  },
  publicDir: 'public',
}));
