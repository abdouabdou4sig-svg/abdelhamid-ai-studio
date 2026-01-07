
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // base: './' est la solution universelle pour GitHub Pages
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  define: {
    // Mapping manuel de la clé API pour le moteur de build
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
