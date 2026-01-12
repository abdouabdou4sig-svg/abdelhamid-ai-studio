
import React, { useState } from 'react';
import { generateVideoVeo } from '../services/aiService';
import { AiResponse } from '../types';
import { Video, Sparkles, Loader2, Download, Key } from 'lucide-react';

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResponse | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Vérification de la clé Studio pour VEO
    if ((window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
    }

    setLoading(true);
    const data = await generateVideoVeo(prompt);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black uppercase tracking-tighter">Cinema <span className="text-purple-400">VEO 3.1</span></h2>
        <p className="text-zinc-500 max-w-2xl mx-auto">Générez des vidéos cinématiques de 5 secondes avec un réalisme époustouflant.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-8 rounded-[40px] space-y-8 border border-white/5">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-purple-400">Scénario Vidéo</label>
              <textarea 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Décrivez l'action cinématographique..."
                className="w-full h-48 bg-black/40 border border-white/10 rounded-3xl p-6 text-sm outline-none focus:border-purple-500 transition-all resize-none"
              />
            </div>
            <button 
              onClick={handleGenerate} 
              disabled={loading || !prompt.trim()}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 text-white py-6 rounded-3xl font-black text-sm uppercase flex items-center justify-center gap-3 transition-all shadow-xl shadow-purple-900/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? 'Rendu VEO...' : 'Lancer le Rendu'}
            </button>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-start gap-3">
              <Key size={16} className="text-purple-400 mt-1" />
              <p className="text-[9px] text-zinc-500 leading-relaxed font-bold uppercase">L'utilisation de VEO nécessite une clé API issue d'un projet payant Google Cloud.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="glass rounded-[48px] overflow-hidden min-h-[500px] flex flex-col items-center justify-center border border-white/5 bg-black/20">
            {loading ? (
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 border-8 border-purple-500/20 border-t-purple-600 rounded-full animate-spin"></div>
                <div className="text-center space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-400">Génération Neuronale (2-3 min)</p>
                  <p className="text-zinc-600 text-[9px] font-bold uppercase">Veuillez ne pas fermer cette fenêtre</p>
                </div>
              </div>
            ) : result?.videos ? (
              <div className="w-full h-full flex flex-col relative group">
                <video src={result.videos[0].url} controls className="w-full aspect-video bg-black" autoPlay loop muted />
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={result.videos[0].url} download="abdelhamid-veo.mp4" className="bg-white text-black px-6 py-3 rounded-2xl font-black uppercase text-[10px] shadow-2xl flex items-center gap-2">
                    <Download size={16} /> Télécharger
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 opacity-10">
                <Video size={120} strokeWidth={0.5} />
                <p className="font-black uppercase tracking-[1em] text-sm">Studio Vidéo VEO</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
