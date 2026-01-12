import React, { useState } from 'react';
import { imageToText } from '../services/aiService';
import ImageUpload from '../components/ImageUpload';
import { ScanSearch, Play, Copy, Check, Wand2, Layers, Trash2 } from 'lucide-react';

interface Unit {
  id: number;
  file: File | null;
  loading: boolean;
  result: string | null;
}

const ImageToText: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([
    { id: 1, file: null, loading: false, result: null },
    { id: 2, file: null, loading: false, result: null },
    { id: 3, file: null, loading: false, result: null },
    { id: 4, file: null, loading: false, result: null },
  ]);

  const [masterPrompt, setMasterPrompt] = useState("Décris cette image précisément pour un outil de génération d'image (Midjourney style). Inclus le style, la lumière et l'angle.");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const updateUnit = (id: number, updates: Partial<Unit>) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const handleInvoquer = async () => {
    units.forEach(async (unit) => {
      if (!unit.file || unit.loading) return;
      updateUnit(unit.id, { loading: true, result: null });
      const res = await imageToText(unit.file, masterPrompt);
      updateUnit(unit.id, { loading: false, result: res.text || res.error || "Échec." });
    });
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-fade-in">
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-magic font-black text-brand-gold uppercase tracking-widest">Alchimie du <span className="text-white">Prompt</span></h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.5em]">Conversion d'image par matrice neuronale</p>
      </div>

      {/* Master Prompt Case */}
      <div className="glass-panel p-8 rounded-[40px] border-brand-gold/30">
        <div className="flex items-center gap-3 mb-4 text-brand-gold font-magic text-xs uppercase tracking-[0.3em]">
          <Wand2 size={16} /> Le Grimoire d'Instructions (Master Prompt)
        </div>
        <textarea 
          value={masterPrompt}
          onChange={(e) => setMasterPrompt(e.target.value)}
          className="w-full h-24 bg-brand-dark/50 border border-white/10 rounded-3xl p-6 text-slate-300 font-bold italic outline-none focus:border-brand-gold/50 transition-all resize-none"
          placeholder="Entrez vos directives magiques ici..."
        />
      </div>

      <div className="flex justify-center">
        <button 
          onClick={handleInvoquer}
          className="bg-brand-gold hover:bg-white text-brand-dark px-16 py-6 rounded-full font-magic font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 disabled:opacity-30 flex items-center gap-4"
        >
          <Play size={20} fill="currentColor" /> Invoquer la Matrice
        </button>
      </div>

      {/* 4x4 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {units.map((unit) => (
          <div key={unit.id} className="glass-panel p-8 rounded-[50px] border-white/5 flex flex-col gap-6 group hover:border-brand-gold/30 transition-all duration-500">
            <div className="flex justify-between items-center">
              <span className="bg-brand-gold/20 text-brand-gold px-4 py-1 rounded-full font-magic text-[9px] uppercase tracking-widest">Unité 0{unit.id}</span>
              {unit.file && <button onClick={() => updateUnit(unit.id, {file: null, result: null})} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>}
            </div>

            <div className="grid grid-cols-2 gap-6 h-[260px]">
              {/* Case Entrante */}
              <div className="flex flex-col gap-3">
                <span className="text-[8px] font-black text-slate-600 uppercase text-center tracking-[0.3em]">Case Entrante</span>
                <ImageUpload 
                  selectedImage={unit.file} 
                  onImageSelected={(f) => updateUnit(unit.id, {file: f, result: null})} 
                  onClear={() => updateUnit(unit.id, {file: null, result: null})} 
                  compact={true}
                  label="Ajouter Image"
                />
              </div>

              {/* Case Sortante */}
              <div className="flex flex-col gap-3">
                <span className="text-[8px] font-black text-brand-gold uppercase text-center tracking-[0.3em]">Case Sortante</span>
                <div className="flex-1 bg-brand-dark/40 rounded-3xl border border-brand-gold/10 p-5 overflow-y-auto font-bold text-[10px] leading-relaxed italic text-slate-400 relative custom-scroll">
                  {unit.loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-dark/80 backdrop-blur-sm rounded-3xl">
                      <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mb-2"></div>
                      <span className="text-[8px] text-brand-gold animate-pulse uppercase tracking-widest">Alchimie...</span>
                    </div>
                  ) : unit.result ? (
                    <div className="space-y-4">
                      <p>"{unit.result}"</p>
                      <button 
                        onClick={() => copyToClipboard(unit.result!, unit.id)}
                        className="w-full py-2 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold rounded-xl flex items-center justify-center gap-2 transition-all border border-brand-gold/20"
                      >
                        {copiedId === unit.id ? <Check size={12} /> : <Copy size={12} />}
                        <span className="uppercase text-[8px] font-black tracking-widest">Copier</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-10">
                      <Layers size={32} />
                      <p className="mt-2 uppercase tracking-widest text-[8px]">En attente</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ImageToText;