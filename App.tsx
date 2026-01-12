import React, { useState } from 'react';
import { ToolType } from './types.ts';
import Navigation from './components/Navigation.tsx';
import ImageToText from './views/ImageToText.tsx';
import { Zap, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<ToolType>(ToolType.DASHBOARD);

  const renderContent = () => {
    switch (currentTool) {
      case ToolType.IMAGE_TO_TEXT: return <ImageToText />;
      default: return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12 animate-fade-in relative px-6">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
             <div className="w-[600px] h-[600px] bg-brand-gold/10 blur-[150px] rounded-full animate-pulse"></div>
          </div>
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full text-brand-gold font-magic text-[10px] uppercase tracking-[0.4em]">
              <ShieldCheck size={14} /> Le Sanctuaire de l'Alchimie Numérique
            </div>
            <h1 className="text-7xl md:text-9xl font-magic font-black text-white tracking-tighter leading-none select-none">
              ABDELHAMID <span className="text-brand-gold">IA</span>
            </h1>
            <p className="text-slate-500 max-w-xl mx-auto font-bold uppercase tracking-widest text-[11px] leading-relaxed">
              Moteur de transmutation d'image piloté par <span className="text-white border-b border-brand-gold">Gemini 3 Pro</span>. L'art de la précision visuelle.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setCurrentTool(ToolType.IMAGE_TO_TEXT)}
              className="bg-brand-gold hover:bg-white text-brand-dark px-10 py-5 rounded-full font-magic font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-110 shadow-2xl shadow-brand-gold/20 flex items-center gap-3"
            >
              <Zap size={16} /> Entrer dans le Studio
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020205] text-white selection:bg-brand-gold/30">
      <Navigation currentTool={currentTool} onSelectTool={setCurrentTool} />
      <main className="flex-1 pt-32 pb-20 overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">{renderContent()}</div>
      </main>
      <footer className="py-12 border-t border-white/5 text-center">
         <p className="text-[10px] font-magic tracking-[1em] text-slate-600 uppercase">ABDELHAMID IA • L'EXCELLENCE ÉTERNELLE</p>
      </footer>
    </div>
  );
};
export default App;