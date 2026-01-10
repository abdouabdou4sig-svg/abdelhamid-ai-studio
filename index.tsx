import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const initializeStudio = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // On laisse React s'installer avant de retirer le voile doré
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (typeof (window as any).hideAlchemyLoader === 'function') {
          (window as any).hideAlchemyLoader();
        }
      }, 500);
    });
  } catch (err) {
    console.error("Échec de l'invocation du studio:", err);
    // En cas d'erreur, on libère quand même la vue pour debug
    if (typeof (window as any).hideAlchemyLoader === 'function') {
      (window as any).hideAlchemyLoader();
    }
  }
};

// Lancement au chargement du DOM
if (document.readyState === 'complete') {
  initializeStudio();
} else {
  window.addEventListener('load', initializeStudio);
}