
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 'base: './' est crucial pour que GitHub Pages trouve les fichiers dans le dossier dist
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  define: {
    // Injection de la clé API au moment de la compilation par GitHub Actions
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
