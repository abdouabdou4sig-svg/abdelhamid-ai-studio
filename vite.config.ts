
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Force l'utilisation de chemins relatifs (./) pour que GitHub Pages trouve les fichiers JS/CSS
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
    // Permet à l'application de lire la clé API injectée par GitHub Secrets
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
