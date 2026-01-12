import React, { useState } from 'react';
import { ToolType } from './types';
import Navigation from './components/Navigation';
import ImageToText from './views/ImageToText';
import AiChat from './views/AiChat';
import { ShieldCheck, Sparkles, Wand2 } from 'lucide-react';

const App: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<ToolType>(ToolType.DASHBOARD);

  const renderContent = () => {
    switch (currentTool) {
      case ToolType.IMAGE_TO_TEXT: return <ImageToText />;
      case ToolType.AI_CHAT: return <AiChat />;
      default: return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12 animate-fade-in relative px-6">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
             <div className="w-[600px] h-[600px] bg-brand-gold blur-[180px] rounded-full"></div>
          </div>
          <div className="relative space-y-8">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-brand-gold/10 border border-brand-gold/20 rounded-full text-brand-gold font-magic text-[10px] uppercase tracking-[0.5em]">
              <ShieldCheck size={14} /> Le Sanctuaire de l'Image
            </div>
            <h1 className="text-7xl md:text-9xl font-magic font-black text-white tracking-tighter leading-none select-none">
              ABDELHAMID <br/><span className="text-brand-gold drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]">STUDIO IA</span>
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto font-bold uppercase tracking-widest text-[11px] leading-relaxed italic">
              "L'intelligence artificielle au service de la transmutation visuelle. <br/>Piloté par le moteur <span className="text-white border-b border-brand-gold">Gemini 3 Pro</span>."
            </p>
          </div>
          <div className="flex gap-6 relative z-10">
            <button onClick={() => setCurrentTool(ToolType.IMAGE_TO_TEXT)} className="bg-brand-gold hover:bg-white text-brand-dark px-12 py-6 rounded-full font-magic font-black text-sm uppercase tracking-[0.2em] transition-all hover:scale-110 shadow-2xl shadow-brand-gold/30 flex items-center gap-3">
              <Wand2 size={20} /> Entrer dans le Grimoire
            </button>
            <button onClick={() => setCurrentTool(ToolType.AI_CHAT)} className="px-12 py-6 rounded-full font-magic font-black text-sm uppercase tracking-[0.2em] border border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10 transition-all">
              Consulter l'Oracle
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark text-white selection:bg-brand-gold/30">
      <Navigation currentTool={currentTool} onSelectTool={setCurrentTool} />
      <main className="flex-1 pt-32 pb-20 overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          {renderContent()}
        </div>
      </main>
      <footer className="py-12 border-t border-white/5 text-center bg-black/40">
         <p className="text-[9px] font-magic tracking-[1em] text-slate-600 uppercase">Abdelhamid IA • L'excellence Éternelle</p>
      </footer>
    </div>
  );
};
export default App;