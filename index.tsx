import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * ABDELHAMID AI STUDIO - RÉANIMATION FINALE
 */

console.log("%c [SYSTEM] Amorçage du moteur... ", "background: #e11d48; color: white; font-weight: bold;");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(<App />);
    
    // Libération immédiate de l'interface utilisateur
    if (typeof (window as any).wakeUp === 'function') {
      (window as any).wakeUp();
    }
  } catch (err) {
    console.error("[CRITICAL] Erreur au démarrage de React:", err);
    if (typeof (window as any).wakeUp === 'function') {
      (window as any).wakeUp();
    }
  }
} else {
  console.error("[CRITICAL] Élément #root introuvable.");
}