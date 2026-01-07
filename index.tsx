import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Abdelhamid AI Studio : Amorçage du système...");

const hideLoader = () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    console.log("Abdelhamid AI Studio : Interface prête.");
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
    
    // On cache le loader après le rendu initial
    requestAnimationFrame(() => {
      setTimeout(hideLoader, 300);
    });
  } catch (err) {
    console.error("Erreur critique au montage de l'application :", err);
    hideLoader(); // On libère l'écran même en cas d'erreur pour voir les messages d'erreur de l'UI
  }
} else {
  console.error("Erreur : Elément #root introuvable dans le DOM.");
  hideLoader();
}