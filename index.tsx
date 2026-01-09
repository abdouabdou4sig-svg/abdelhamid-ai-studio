import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const mountApp = () => {
  const container = document.getElementById('root');
  const loader = document.getElementById('initial-loader');

  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Retrait progressif du loader après l'initialisation de React
    setTimeout(() => {
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 1000);
      }
    }, 1500);
  } catch (error) {
    console.error("Erreur de montage Alchemy AI:", error);
    // Force le retrait du loader en cas d'erreur pour voir le contenu
    if (loader) loader.remove();
  }
};

mountApp();