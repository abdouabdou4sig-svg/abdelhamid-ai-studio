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

    // Signaler au loader que l'app est prête
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (typeof (window as any).hideAlchemyLoader === 'function') {
          (window as any).hideAlchemyLoader();
        }
      }, 300);
    });
  } catch (error) {
    console.error("Erreur de montage ABDELHAMID IA:", error);
    // On libère le loader même en cas d'erreur pour voir ce qui se passe
    if (typeof (window as any).hideAlchemyLoader === 'function') {
      (window as any).hideAlchemyLoader();
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}