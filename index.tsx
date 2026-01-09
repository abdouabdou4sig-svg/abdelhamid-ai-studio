import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const mountApp = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Retrait progressif du loader
    requestAnimationFrame(() => {
      setTimeout(() => {
        const loader = document.getElementById('initial-loader');
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => loader.remove(), 1000);
        }
      }, 800);
    });
  } catch (err) {
    console.error("Mount error:", err);
    // En cas d'erreur fatale, on retire quand même le loader pour voir les erreurs console
    const loader = document.getElementById('initial-loader');
    if (loader) loader.remove();
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}