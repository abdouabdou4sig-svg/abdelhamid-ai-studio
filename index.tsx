import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Abdelhamid Studio : Initialisation du moteur React...");

const hideLoader = () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    console.log("Abdelhamid Studio : Prêt.");
    setTimeout(() => {
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 600);
  }
};

const container = document.getElementById('root');
if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    // Masquer le loader après le premier rendu
    requestAnimationFrame(() => {
      setTimeout(hideLoader, 200);
    });
  } catch (error) {
    console.error("Erreur fatale au montage:", error);
    hideLoader();
  }
} else {
  hideLoader();
}