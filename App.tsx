// App.tsx - Le composant principal
import React, { useState } from 'react';
import { Camera, Sparkles, Upload, Download, Share2 } from 'lucide-react';

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      // Simulation d'une génération d'image
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // URL d'image de démonstration
      const demoImages = [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5',
      ];
      
      setImageUrl(`${demoImages[Math.floor(Math.random() * demoImages.length)]}?auto=format&fit=crop&w=800&q=80`);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Camera className="w-8 h-8 text-accent" />
              <h1 className="text-2xl font-bold">Abdelhamid<span className="text-accent">AI</span> Studio</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="hover:text-accent transition">Accueil</a>
              <a href="#" className="hover:text-accent transition">Galerie</a>
              <a href="#" className="hover:text-accent transition">À propos</a>
              <button className="bg-accent hover:bg-accent-hover px-6 py-2 rounded-lg font-semibold transition">
                Commencer
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm">Powered by Google Gemini AI</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6">
            Créez des <span className="text-accent">photos IA</span> époustouflantes
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Transformez vos idées en images photoréalistes avec l'intelligence artificielle.
            Simple, rapide, et d'une qualité exceptionnelle.
          </p>
        </div>

        {/* Generator Section */}
        <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-8">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">
                Décrivez votre image
              </label>
              <textarea
                className="w-full bg-black/50 border border-white/10 rounded-lg p-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Exemple : Un paysage montagneux au coucher du soleil avec un lac cristallin..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-400">
                  {prompt.length}/1000 caractères
                </div>
                <button
                  onClick={generateImage}
                  disabled={loading || !prompt.trim()}
                  className="bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Générer l'image
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
            {imageUrl ? (
              <div className="space-y-4">
                <div className="relative group">
                  <img 
                    src={imageUrl} 
                    alt="Generated" 
                    className="w-full max-w-2xl mx-auto rounded-lg shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-4">
                    <button className="bg-white text-black px-4 py-2 rounded-lg flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Télécharger
                    </button>
                    <button className="bg-accent px-4 py-2 rounded-lg flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Partager
                    </button>
                  </div>
                </div>
                <p className="text-gray-400">Image générée avec l'IA</p>
              </div>
            ) : (
              <>
                <Upload className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400 mb-2">
                  Votre image générée par IA apparaîtra ici
                </p>
                <p className="text-sm text-gray-500">
                  Décrivez votre image ci-dessus et cliquez sur "Générer l'image"
                </p>
              </>
            )}
          </div>

          {/* Tips */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">💡 Conseils de prompt</h4>
              <p className="text-sm text-gray-400">
                Soyez descriptif : incluez couleurs, lumières, styles
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">⚡ Rapide</h4>
              <p className="text-sm text-gray-400">
                Génération en quelques secondes seulement
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🎨 Haute qualité</h4>
              <p className="text-sm text-gray-400">
                Images en haute résolution, jusqu'à 4K
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 py-8">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>© 2024 Abdelhamid AI Photography Studio. Tous droits réservés.</p>
          <p className="mt-2 text-sm">
            Utilise la technologie Google Gemini AI pour la génération d'images
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;