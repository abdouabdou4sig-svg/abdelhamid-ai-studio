import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * ABDELHAMID AI STUDIO PRO - CORE BOOT
 */

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Libération immédiate après le rendu initial
    if (typeof (window as any).releaseStudio === 'function') {
      (window as any).releaseStudio();
    }
  } catch (err) {
    console.error("Boot error:", err);
    // On force la disparition du loader même en cas d'erreur pour voir le debug
    if (typeof (window as any).releaseStudio === 'function') {
      (window as any).releaseStudio();
    }
  }
}