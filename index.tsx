import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Abdelhamid Studio : Injection des fonctions vitales...");

// Fonction pour libérer l'écran
const wakeUpStudio = () => {
  // @ts-ignore - Accès à la fonction globale de secours si elle existe
  if (window.forceStart) {
    // @ts-ignore
    window.forceStart();
  } else {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      setTimeout(() => loader.parentNode?.removeChild(loader), 1000);
    }
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
    
    // Le studio est debout ! On enlève le brancard (loader)
    // On attend un petit cycle pour être sûr que React a affiché les pixels
    setTimeout(wakeUpStudio, 500);
    
  } catch (error) {
    console.error("Erreur critique, tentative de réveil forcé :", error);
    wakeUpStudio();
  }
} else {
  wakeUpStudio();
}