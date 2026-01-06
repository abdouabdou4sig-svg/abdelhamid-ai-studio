
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Utilise une base relative pour que le site fonctionne dans n'importe quel dossier
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    // Garantit que le point d'entrée HTML est traité correctement
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
