import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * ABDELHAMID AI STUDIO - CORE BOOTLOADER
 * Nettoyé de toute logique bloquante.
 */

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Signaler la fin du chargement
  if (typeof (window as any).forceWake === 'function') {
    (window as any).forceWake();
  }
}