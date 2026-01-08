import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * ABDELHAMID AI STUDIO - BOOT SEQUENCE
 * World-class frontend architecture.
 */

console.log("%c [ENGINE] Initialisation du système... ", "background: #e11d48; color: white; font-weight: bold;");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    // On rend l'App directement pour plus de robustesse dans certains environnements de développement
    root.render(<App />);
    
    // Le loader doit disparaître dès que le DOM est pris en main
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (typeof (window as any).wakeUp === 'function') {
          (window as any).wakeUp();
        }
      }, 300);
    });
  } catch (err) {
    console.error("[CRITICAL] Erreur de montage React:", err);
    // En cas d'erreur fatale, on libère quand même l'écran pour afficher le diagnostic
    if (typeof (window as any).wakeUp === 'function') {
      (window as any).wakeUp();
    }
  }
} else {
  console.error("[CRITICAL] Le point de montage #root est manquant.");
}