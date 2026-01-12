import React from 'react';
import { ToolType } from '../types';
import { Zap, ScanSearch, Users, MessageSquare, Paintbrush, LayoutDashboard } from 'lucide-react';

interface NavigationProps {
  currentTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTool, onSelectTool }) => {
  const navItems = [
    { id: ToolType.IMAGE_TO_TEXT, label: "Image vers Prompt", icon: <ScanSearch size={18} /> },
    { id: ToolType.FACE_SWAP, label: "Face Swap", icon: <Users size={18} /> },
    { id: ToolType.AI_CHAT, label: "Oracle IA", icon: <MessageSquare size={18} /> },
    { id: ToolType.PHOTO_RETOUCH, label: "Retouche", icon: <Paintbrush size={18} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-brand-dark/90 backdrop-blur-xl border-b border-brand-gold/20 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button onClick={() => onSelectTool(ToolType.DASHBOARD)} className="flex items-center gap-3">
          <div className="bg-brand-gold p-2 rounded-xl text-brand-dark">
            <Zap size={20} fill="currentColor" />
          </div>
          <h1 className="text-xl font-magic font-black tracking-tighter uppercase">Abdelhamid IA</h1>
        </button>

        <div className="hidden md:flex gap-4">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onSelectTool(item.id)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${currentTool === item.id ? 'bg-brand-gold text-brand-dark shadow-lg shadow-brand-gold/20' : 'text-slate-400 hover:text-white'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
export default Navigation;