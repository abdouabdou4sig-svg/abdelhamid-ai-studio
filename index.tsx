import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Abdelhamid AI Studio : Lancement du moteur...");

const hideLoader = () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    console.log("Abdelhamid AI Studio : Prêt.");
    setTimeout(() => {
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 500);
  }
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  // On cache le loader immédiatement après le premier rendu
  requestAnimationFrame(() => hideLoader());
} else {
  hideLoader();
}

// Sécurité : suppression automatique après 3 secondes si le JS est vivant
setTimeout(hideLoader, 3000);