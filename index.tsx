import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const hideLoader = () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    console.log("Abdelhamid AI Studio : Interface prête.");
  }
};

const init = () => {
  const container = document.getElementById('root');
  if (!container) {
    console.error("Erreur : Conteneur #root introuvable.");
    hideLoader();
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // On laisse un court délai pour le rendu initial avant de cacher le loader
    requestAnimationFrame(() => {
      setTimeout(hideLoader, 300);
    });
  } catch (error) {
    console.error("Erreur critique lors du montage de l'application :", error);
    hideLoader();
  }
};

// Lancement de l'initialisation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Sécurité ultime au cas où DOMContentLoaded ne se déclencherait pas
setTimeout(hideLoader, 5000);