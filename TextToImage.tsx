
import React, { useState } from 'react';
import { generateImage } from '../services/aiService';
import { AiResponse } from '../types';
import { ImageIcon, Wand2, Download, Loader2 } from 'lucide-react';

const TextToImage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResponse | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const data = await generateImage(prompt);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Image <span className="text-emerald-400">Studio</span></h2>
            <p className="text-zinc-500">Générez des visuels ultra-réalistes en 8K grâce à Gemini 2.5.</p>
          </div>
          <div className="glass p-8 rounded-[40px] space-y-6">
            <textarea 
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Décrivez l'image de vos rêves (ex: Un astronaute sur Mars en style cyberpunk)..."
              className="w-full h-40 bg-black/40 border border-white/10 rounded-3xl p-6 text-sm outline-none focus:border-emerald-500 transition-all resize-none"
            />
            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 text-black py-5 rounded-3xl font-black text-sm uppercase flex items-center justify-center gap-3 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
              {loading ? 'Calcul Neuronal...' : 'Générer le Visuel'}
            </button>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-[48px] blur opacity-25"></div>
          <div className="relative glass h-full min-h-[500px] rounded-[48px] flex flex-col items-center justify-center overflow-hidden border border-white/5">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Rendu en cours...</p>
              </div>
            ) : result?.images ? (
              <div className="w-full h-full flex flex-col">
                <img src={result.images[0].url} className="w-full h-full object-cover" alt="Generated" />
                <div className="absolute bottom-6 right-6 flex gap-2">
                  <a href={result.images[0].url} download="abdelhamid-ai-image.png" className="bg-white text-black p-4 rounded-2xl shadow-2xl hover:scale-105 transition-transform">
                    <Download size={20} />
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 opacity-20">
                <ImageIcon size={100} strokeWidth={1} />
                <p className="font-black uppercase tracking-[0.5em] text-xs">Aperçu du Rendu</p>
              </div>
            )}
            {result?.error && <p className="text-red-500 text-xs font-bold mt-4">{result.error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToImage;
