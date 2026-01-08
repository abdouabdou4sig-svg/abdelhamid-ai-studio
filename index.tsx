import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * ABDELHAMID AI STUDIO - REANIMATION SEQUENCE
 */

console.log("%c [ENGINE] Initialisation du système... ", "background: #e11d48; color: white; font-weight: bold;");

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    // On rend l'App directement
    root.render(<App />);
    
    // On retire le loader dès que possible
    if (typeof (window as any).wakeUp === 'function') {
      (window as any).wakeUp();
    }
  } catch (err) {
    console.error("[CRITICAL] Erreur de montage React:", err);
    // On force la visibilité même en cas d'erreur
    if (typeof (window as any).wakeUp === 'function') {
      (window as any).wakeUp();
    }
  }
} else {
  console.error("[CRITICAL] Le point de montage #root est manquant.");
}