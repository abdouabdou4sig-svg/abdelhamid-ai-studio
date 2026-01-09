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

    // Confirmation du chargement réussi
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (typeof (window as any).hideAlchemyLoader === 'function') {
          (window as any).hideAlchemyLoader();
        }
      }, 500);
    });
  } catch (error) {
    console.error("Critical mount error:", error);
    if (typeof (window as any).hideAlchemyLoader === 'function') {
      (window as any).hideAlchemyLoader();
    }
  }
};

// On s'assure que le DOM est prêt avant d'initier
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}