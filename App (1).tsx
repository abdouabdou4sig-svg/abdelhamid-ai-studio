
import React, { useState } from 'react';
import { ToolType } from './types';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Image as ImageIcon, 
  Video, 
  Users, 
  Wand2, 
  Zap, 
  Sparkles,
  Github
} from 'lucide-react';
import AiChat from './views/AiChat';
import TextToImage from './views/TextToImage';
import VideoGenerator from './views/VideoGenerator';

const App: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<ToolType>(ToolType.DASHBOARD);

  const tools = [
    { id: ToolType.AI_CHAT, label: 'Conversation IA', icon: <MessageSquare size={20} />, color: 'text-blue-400' },
    { id: ToolType.TEXT_TO_IMAGE, label: 'Image Studio', icon: <ImageIcon size={20} />, color: 'text-emerald-400' },
    { id: ToolType.VIDEO_GENERATOR, label: 'Video VEO', icon: <Video size={20} />, color: 'text-purple-400' },
    { id: ToolType.FACE_SWAP, label: 'Face Swap Pro', icon: <Users size={20} />, color: 'text-orange-400' },
    { id: ToolType.REMIX_IMAGE, label: 'Ultra Remix', icon: <Zap size={20} />, color: 'text-red-500' },
  ];

  const renderContent = () => {
    switch (currentTool) {
      case ToolType.AI_CHAT: return <AiChat />;
      case ToolType.TEXT_TO_IMAGE: return <TextToImage />;
      case ToolType.VIDEO_GENERATOR: return <VideoGenerator />;
      default: return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
          <div className="relative">
            <div className="absolute -inset-4 bg-red-600/20 blur-2xl rounded-full animate-pulse"></div>
            <h1 className="relative text-6xl md:text-8xl font-black uppercase tracking-tighter">
              Abdelhamid <span className="text-red-600">AI</span>
            </h1>
          </div>
          <p className="text-xl text-zinc-500 font-medium max-w-2xl">
            La suite ultime de photographie neuronale. Propulsé par Gemini 3 Pro & VEO.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
            {tools.map(t => (
              <button 
                key={t.id} 
                onClick={() => setCurrentTool(t.id)}
                className="glass p-8 rounded-[32px] hover:bg-white/5 transition-all group border border-white/5"
              >
                <div className={`${t.color} mb-4 group-hover:scale-110 transition-transform`}>{t.icon}</div>
                <h3 className="font-bold uppercase text-sm tracking-widest">{t.label}</h3>
              </button>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark">
      {/* Navigation Header */}
      <nav className="glass sticky top-0 z-50 px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <button onClick={() => setCurrentTool(ToolType.DASHBOARD)} className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-xl"><Sparkles size={20} className="text-white" /></div>
          <span className="font-black uppercase tracking-tighter text-xl">Studio Pro</span>
        </button>
        <div className="hidden md:flex gap-2">
          {tools.map(t => (
            <button 
              key={t.id} 
              onClick={() => setCurrentTool(t.id)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentTool === t.id ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com" className="text-zinc-500 hover:text-white transition-colors"><Github size={20} /></a>
          <button className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200">Connexion</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-700">
        &copy; 2025 Abdelhamid AI Photography Studio • Premium Excellence
      </footer>
    </div>
  );
};

export default App;
