import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

const removeLoader = () => {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }
};

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    // On laisse un petit délai pour le rendu initial avant de retirer le carré rouge
    setTimeout(removeLoader, 1000);
  } catch (err) {
    console.error("Erreur fatale au rendu:", err);
    removeLoader();
  }
} else {
  console.error("Conteneur #root non trouvé");
  removeLoader();
}