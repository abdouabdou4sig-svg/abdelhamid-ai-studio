
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log("Abdelhamid AI Studio: Initialisation...");

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Masquer le loader une fois que React a pris le relais
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }
} else {
  console.error("Erreur: Élément #root introuvable.");
}
