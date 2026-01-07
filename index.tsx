
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Abdelhamid AI Studio : Initialisation du script principal...");

// Fonction robuste pour masquer le loader
const hideLoader = () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
        console.log("Abdelhamid AI Studio : Interface prête.");
      }
    }, 500);
  }
};

// Sécurité supplémentaire pour masquer le loader si tout est chargé
window.addEventListener('load', hideLoader);

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Masquage agressif du loader pour une sensation de réactivité immédiate
  setTimeout(hideLoader, 50);
} else {
  console.error("Erreur critique : Élément #root introuvable.");
  // On cache le loader pour ne pas bloquer l'utilisateur si une erreur survient
  hideLoader();
}
