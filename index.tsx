
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Abdelhamid AI Studio : Initialisation du moteur...");

const hideLoader = () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
        console.log("Abdelhamid AI Studio : Interface affichée.");
      }
    }, 500);
  }
};

// Sécurité : on cache le loader après 2.5 secondes quoi qu'il arrive
setTimeout(hideLoader, 2500);

const container = document.getElementById('root');
if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    // Masquage dès que le rendu React commence
    hideLoader();
  } catch (error) {
    console.error("Erreur critique au démarrage:", error);
    hideLoader();
  }
} else {
  console.error("Élément #root introuvable dans le DOM.");
  hideLoader();
}
