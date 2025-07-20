import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";
import { componentTagger } from "lovable-tagger";
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [
    react(),
    mode === 'development' ? componentTagger() : undefined,
    viteCompression({ algorithm: 'brotliCompress' }),
    process.env.ANALYZE ? visualizer({ open: true, gzipSize: true, brotliSize: true }) : undefined,
  ].filter(Boolean);
  return {
    server: {
      host: '0.0.0.0',
      port: 8080,
      proxy: {
        '/api/clearbit': {
          target: 'https://autocomplete.clearbit.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/clearbit/, ''),
        },
      },
    },
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    optimizeDeps: {
      include: ['framer-motion', 'lucide-react'],
    },
    build: {
      chunkSizeWarningLimit: 1000,
      cssMinify: true,
    },
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp'],
  };
});
