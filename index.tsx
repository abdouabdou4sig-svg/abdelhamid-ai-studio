
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Abdelhamid AI Studio : Lancement du moteur...");

// Fonction pour masquer le loader
const hideLoader = () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      if (loader.parentNode) loader.remove();
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
  
  // On masque le loader dès que le code commence à s'exécuter
  hideLoader();
} else {
  console.error("Erreur critique : Élément #root introuvable.");
}
