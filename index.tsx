import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const startAlchemy = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Notification de succès au système de chargement
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (typeof (window as any).hideAlchemyLoader === 'function') {
          (window as any).hideAlchemyLoader();
        }
      }, 500);
    });
  } catch (err) {
    console.error("Échec critique du grimoire:", err);
    // On force quand même la disparition du loader pour voir les erreurs console
    if (typeof (window as any).hideAlchemyLoader === 'function') {
      (window as any).hideAlchemyLoader();
    }
  }
};

// Lancement immédiat ou sur DOMReady
if (document.readyState === 'complete') {
  startAlchemy();
} else {
  window.addEventListener('load', startAlchemy);
}