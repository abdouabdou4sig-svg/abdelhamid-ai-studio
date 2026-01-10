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
    
    // On cache le loader dès que React a pris la main
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (typeof (window as any).hideAlchemyLoader === 'function') {
          (window as any).hideAlchemyLoader();
        }
      }, 300;
    });
  } catch (err) {
    console.error("Erreur critique de montage:", err);
    // On force l'affichage même en cas d'erreur de rendu
    if (typeof (window as any).hideAlchemyLoader === 'function') {
      (window as any).hideAlchemyLoader();
    }
  }
};

// Lancement au chargement
if (document.readyState === 'complete') {
  mountApp();
} else {
  window.addEventListener('load', mountApp);
}