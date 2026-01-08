import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * ABDELHAMID AI STUDIO - CORE STARTUP
 */

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(<App />);
    
    // Libération du loader dès que React a pris le relais
    if (typeof (window as any).forceWake === 'function') {
      (window as any).forceWake();
    }
  } catch (err) {
    console.error("Erreur de démarrage:", err);
    if (typeof (window as any).forceWake === 'function') {
      (window as any).forceWake();
    }
  }
}