import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * ABDELHAMID AI STUDIO - REBOOT SEQUENCER
 */

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<App />);
  
  // Signaler au document que l'application est prête
  if (typeof (window as any).forceWake === 'function') {
    (window as any).forceWake();
  }
}