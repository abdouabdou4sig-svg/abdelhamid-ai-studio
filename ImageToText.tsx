import React, { useState } from 'react';
import { imageToText } from '../services/aiService';
import ImageUpload from '../components/ImageUpload';
import { ScanSearch, Trash2, Copy, Check, Play, Wand2, Layers, ArrowRight } from 'lucide-react';

interface Slot {
  id: number;
  file: File | null;
  loading: boolean;
  result: string | null;
  error: string | null;
}

const ImageToText: React.FC = () => {
  const [slots, setSlots] = useState<Slot[]>([
    { id: 1, file: null, loading: false, result: null, error: null },
    { id: 2, file: null, loading: false, result: null, error: null },
    { id: 3, file: null, loading: false, result: null, error: null },
    { id: 4, file: null, loading: false, result: null, error: null },
  ]);

  const [masterPrompt, setMasterPrompt] = useState("Décris cette image précisément pour un outil de génération d'image (style, lumière, angle de vue, détails techniques).");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const updateSlot = (id: number, updates: Partial<Slot>) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleProcess = async (slot: Slot) => {
    if (!slot.file) return;
    updateSlot(slot.id, { loading: true, error: null, result: null });
    const res = await imageToText(slot.file, masterPrompt);
    if (res.error) {
      updateSlot(slot.id, { loading: false, error: res.error });
    } else {
      updateSlot(slot.id, { loading: false, result: res.text || "Aucun prompt généré." });
    }
  };

  const processAll = async () => {
    slots.filter(s => s.file && !s.loading).forEach(s => handleProcess(s));
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-fade-in">
      <div className="flex justify-between items-center bg-brand-gold/10 p-8 rounded-[40px] border border-brand-gold/20">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-brand-gold rounded-3xl text-brand-dark shadow-xl shadow-brand-gold/20">
            <ScanSearch size={40} />
          </div>
          <div>
            <h2 className="text-4xl font-magic font-black text-brand-gold tracking-tight uppercase leading-none">Alchimie de <span className="text-white">l'Image vers Prompt</span></h2>
            <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">Traitement en lot par moteur neuronal Abdelhamid IA</p>
          </div>
        </div>
        <button 
          onClick={processAll}
          disabled={slots.filter(s => s.file).length === 0}
          className="bg-brand-gold hover:bg-white text-brand-dark px-12 py-5 rounded-full font-magic font-black text-sm uppercase transition-all shadow-2xl active:scale-95 disabled:opacity-30 flex items-center gap-3"
        >
          <Play size={20} fill="currentColor" /> Invoquer les Prompts
        </button>
      </div>

      {/* Case Prompt - Instructions */}
      <div className="glass-panel p-8 rounded-[40px] border-brand-gold/20">
        <label className="flex items-center gap-3 text-brand-gold font-magic text-xs uppercase tracking-[0.3em] mb-4">
          <Wand2 size={16} /> Grimoire d'Instructions (Master Case Prompt)
        </label>
        <textarea 
          value={masterPrompt}
          onChange={(e) => setMasterPrompt(e.target.value)}
          className="w-full h-24 bg-black/40 border border-white/10 rounded-3xl p-6 text-slate-300 font-bold italic text-sm outline-none focus:border-brand-gold/50 transition-all resize-none"
          placeholder="Entrez vos directives pour la génération des prompts..."
        />
      </div>

      {/* Grid 4x4 - Entrées et Sorties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {slots.map(slot => (
          <div key={slot.id} className="glass-panel rounded-[50px] p-8 border-white/5 flex flex-col gap-6 relative transition-all duration-500 hover:border-brand-gold/30">
            <div className="flex justify-between items-center">
              <span className="bg-brand-gold/20 text-brand-gold px-4 py-1 rounded-full font-magic text-[10px] uppercase tracking-widest">Unité Alchimique 0{slot.id}</span>
              {slot.file && <button onClick={() => updateSlot(slot.id, {file: null, result: null})} className="text-red-400/50 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>}
            </div>

            <div className="grid grid-cols-2 gap-6 h-[300px]">
              {/* Entrée */}
              <div className="flex flex-col gap-3">
                <span className="text-[9px] font-black text-slate-500 uppercase text-center tracking-widest">Case Entrante</span>
                {!slot.file ? (
                  <ImageUpload 
                    selectedImage={null} 
                    onImageSelected={(f) => updateSlot(slot.id, {file: f, result: null})} 
                    onClear={() => {}}
                    compact={true}
                    label="Ajouter"
                  />
                ) : (
                  <div className="flex-1 rounded-3xl overflow-hidden border border-white/10 relative group bg-black">
                    <img src={URL.createObjectURL(slot.file)} className="w-full h-full object-contain p-2" />
                    {slot.loading && <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm flex items-center justify-center animate-pulse"><div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div></div>}
                  </div>
                )}
              </div>

              {/* Sortie */}
              <div className="flex flex-col gap-3">
                <span className="text-[9px] font-black text-brand-gold uppercase text-center tracking-widest">Case Sortante</span>
                <div className="flex-1 bg-brand-dark/60 rounded-3xl border border-brand-gold/10 p-5 overflow-y-auto font-bold text-[11px] leading-relaxed italic text-slate-300">
                  {slot.result ? (
                    <div className="space-y-4">
                      <p>"{slot.result}"</p>
                      <button 
                        onClick={() => handleCopy(slot.result!, slot.id)}
                        className="w-full py-3 bg-brand-gold text-brand-dark rounded-2xl flex items-center justify-center gap-2 hover:bg-white transition-all text-[9px] uppercase font-magic"
                      >
                        {copiedId === slot.id ? <><Check size={12} /> Copié</> : <><Copy size={12} /> Copier</>}
                      </button>
                    </div>
                  ) : slot.error ? (
                    <div className="text-red-500 text-center py-10 uppercase tracking-tighter">Erreur d'invocation</div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-10"><Layers size={40} /><p className="mt-2 uppercase tracking-widest text-[9px]">En attente</p></div>
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