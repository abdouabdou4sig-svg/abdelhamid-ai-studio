import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const initApp = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Signaler au loader de s'effacer
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (typeof (window as any).hideAlchemyLoader === 'function') {
          (window as any).hideAlchemyLoader();
        }
      }, 400);
    });
  } catch (err) {
    console.error("Échec du démarrage ABDELHAMID IA:", err);
    // On force quand même la disparition du loader
    if (typeof (window as any).hideAlchemyLoader === 'function') {
      (window as any).hideAlchemyLoader();
    }
  }
};

// Exécution propre
if (document.readyState === 'complete') {
  initApp();
} else {
  window.addEventListener('load', initApp);
}