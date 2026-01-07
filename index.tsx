
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Abdelhamid AI Studio : Démarrage du moteur graphique...");

const hideLoader = () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    console.log("Abdelhamid AI Studio : Chargement terminé.");
    // Optionnel: suppression du DOM après l'animation
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
    
    // On cache le loader dès que React a pris la main
    // On utilise requestAnimationFrame pour s'assurer que le premier rendu est fait
    requestAnimationFrame(() => {
      setTimeout(hideLoader, 200);
    });
  } catch (error) {
    console.error("Erreur critique au démarrage de React:", error);
    hideLoader(); // On cache quand même pour ne pas bloquer l'utilisateur sur une erreur
  }
} else {
  console.error("Erreur : Élément #root introuvable.");
  hideLoader();
}

// Sécurité ultime : si après 4 secondes on est encore sur le loader, on le force à partir
setTimeout(hideLoader, 4000);
