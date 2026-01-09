import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("Démarrage du Studio Abdelhamid IA...");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // On laisse un petit délai pour que le premier rendu soit fait
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (typeof (window as any).hideAlchemyLoader === 'function') {
          (window as any).hideAlchemyLoader();
          console.log("Studio libéré avec succès.");
        }
      }, 300);
    });
  } catch (err) {
    console.error("Erreur fatale lors du montage React:", err);
    // En cas d'erreur, on cache quand même le loader pour voir ce qui est cassé
    if (typeof (window as any).hideAlchemyLoader === 'function') {
      (window as any).hideAlchemyLoader();
    }
  }
} else {
  console.error("Élément #root introuvable dans le DOM.");
}