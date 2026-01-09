import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Type, Image as ImageIcon, Wand2, Maximize, Eraser, Palette, Users, Crop, History, Scissors, FileText, LayoutGrid, UserCircle2, ImagePlus, Paintbrush, PenTool, Layers, Briefcase, Gem, Pen, Compass, Leaf, MessageSquare, UserPlus, Library, Monitor, Sun, Shirt, Sparkles, FileImage, Film, Video, Zap, Key, CheckCircle2, AlertCircle, ChevronDown, Menu, X, RefreshCw, ScanSearch, Save, PlusCircle
} from 'lucide-react';
import { ToolType } from '../types.ts';

interface NavigationProps {
  currentTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTool, onSelectTool }) => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      try {
        if ((window as any).aistudio && typeof (window as any).aistudio.hasSelectedApiKey === 'function') {
          const selected = await (window as any).aistudio.hasSelectedApiKey();
          setHasKey(!!selected);
        }
      } catch (e) {
        console.warn("API Key check skipped:", e);
      }
    };
    checkKey();
    const interval = setInterval(checkKey, 5000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    {
      id: 'studio',
      label: 'Invocation',
      icon: <Video size={16} />,
      tools: [
        { id: ToolType.VIDEO_GENERATOR, label: "Vidéo VEO 3.1", icon: <Video size={16} /> },
        { id: ToolType.REMIX_IMAGE, label: "Ultra Remix", icon: <Zap size={16} /> },
        { id: ToolType.IMAGE_TO_IMAGE, label: "Image à Image", icon: <Wand2 size={16} /> },
        { id: ToolType.STORYBOARD, label: "Storyboard IA", icon: <Film size={16} /> },
        { id: ToolType.TEXT_TO_IMAGE, label: "Texte -> Image", icon: <Type size={16} /> },
        { id: ToolType.AI_ART_GENERATOR, label: "Générateur d'Art", icon: <Paintbrush size={16} /> },
      ]
    },
    {
      id: 'editing',
      label: 'Alchimie Visuelle',
      icon: <Wand2 size={16} />,
      tools: [
        { id: ToolType.FACE_SWAP, label: "Face Swap Pro", icon: <Users size={16} /> },
        { id: ToolType.CHARACTER_SWAP_V2, label: "Héros Swap V2", icon: <UserPlus size={16} /> },
        { id: ToolType.PHOTO_RETOUCH, label: "Retouche Photo", icon: <Crop size={16} /> },
        { id: ToolType.AI_RELIGHT, label: "Lumière IA", icon: <Sun size={16} /> },
        { id: ToolType.SKIN_ENHANCER, label: "Peau Parfaite", icon: <Sparkles size={16} /> },
        { id: ToolType.CHANGE_VIEW, label: "Angle de Vue", icon: <Compass size={16} /> },
        { id: ToolType.AI_STYLIST, label: "AI Stylist", icon: <Shirt size={16} /> },
      ]
    },
    {
      id: 'enhance',
      label: 'Transmutation',
      icon: <Maximize size={16} />,
      tools: [
        { id: ToolType.UPSCALE, label: "Magic 4K", icon: <Maximize size={16} /> },
        { id: ToolType.RESTORATION, label: "Restauration", icon: <History size={16} /> },
        { id: ToolType.OBJECT_REMOVAL, label: "Gomme Magique", icon: <Scissors size={16} /> },
        { id: ToolType.REMOVE_BG, label: "Supprimer Fond", icon: <Eraser size={16} /> },
        { id: ToolType.COLORIZE, label: "Coloriser", icon: <Palette size={16} /> },
        { id: ToolType.BG_GENERATOR, label: "Arrière-plan IA", icon: <ImagePlus size={16} /> },
      ]
    },
    {
      id: 'design',
      label: 'Gryptographie',
      icon: <LayoutGrid size={16} />,
      tools: [
        { id: ToolType.AI_POSTER_GENERATOR, label: "Affiches Pro", icon: <FileImage size={16} /> },
        { id: ToolType.AI_LOGO_GENERATOR, label: "Créateur Logo", icon: <Monitor size={16} /> },
        { id: ToolType.AI_NFT_GENERATOR, label: "Générateur NFT", icon: <Gem size={16} /> },
        { id: ToolType.AI_ILLUSTRATION_GENERATOR, label: "Illustration", icon: <Pen size={16} /> },
        { id: ToolType.AI_HEADSHOTS, label: "Portrait Business", icon: <Briefcase size={16} /> },
        { id: ToolType.PROFILE_MAKER, label: "Profile Maker", icon: <UserCircle2 size={16} /> },
        { id: ToolType.PHOTO_TO_STENCIL, label: "Pochoir", icon: <PenTool size={16} /> },
        { id: ToolType.PHOTO_COLLAGE, label: "Collage Maker", icon: <LayoutGrid size={16} /> },
        { id: ToolType.TEXT_BEHIND, label: "Texte Derrière", icon: <Layers size={16} /> },
      ]
    }
  ];

  const handleSelectTool = (id: ToolType) => {
    onSelectTool(id);
    setActiveCategory(null);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-[#020205]/80 backdrop-blur-2xl border-b border-[#D4AF37]/20 shadow-2xl px-6 py-4">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        
        <button 
          onClick={() => handleSelectTool(ToolType.DASHBOARD)}
          className="flex items-center gap-3 group"
        >
          <div className="bg-[#D4AF37] p-2.5 rounded-2xl shadow-lg shadow-[#D4AF37]/20 group-hover:scale-110 transition-transform duration-500">
            <Zap size={20} className="text-[#020205]" />
          </div>
          <div className="flex flex-col text-left">
            <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none font-magic">Abdelhamid IA</h1>
            <span className="text-[10px] text-[#D4AF37] font-bold tracking-[0.4em] uppercase mt-1">Alchimie Numérique</span>
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-1">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="relative"
              onMouseEnter={() => setActiveCategory(cat.id)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <button 
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${activeCategory === cat.id ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-slate-300 hover:text-[#D4AF37] hover:bg-white/5'}`}
              >
                {cat.icon}
                {cat.label}
                <ChevronDown size={14} className={`transition-transform duration-300 ${activeCategory === cat.id ? 'rotate-180' : ''}`} />
              </button>

              <div className={`
                absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-500
                ${activeCategory === cat.id ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}
              `}>
                <div className="bg-[#0a0a10] border border-[#D4AF37]/30 rounded-[28px] p-3 shadow-[0_20px_80px_rgba(0,0,0,0.8)] min-w-[280px] grid grid-cols-1 gap-1">
                  {cat.tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleSelectTool(tool.id)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                        ${currentTool === tool.id ? 'bg-gradient-to-r from-[#D4AF37] to-[#8B5CF6] text-white' : 'text-slate-400 hover:bg-white/5 hover:text-[#D4AF37]'}
                      `}
                    >
                      <div className="shrink-0 group-hover:rotate-12 transition-transform duration-300">{tool.icon}</div>
                      <span className="text-[12px] font-bold uppercase tracking-tight">{tool.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className={`hidden md:flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#D4AF37]/30 ${hasKey ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#D4AF37]/10 text-[#D4AF37] animate-pulse'}`}>
            <Key size={14} />
            <span className="text-[11px] font-black uppercase tracking-widest">
              {hasKey ? 'ESSENCE ACTIVE' : 'RITUEL REQUIS'}
            </span>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-3 bg-white/5 rounded-2xl text-[#D4AF37] hover:bg-white/10 transition-all border border-[#D4AF37]/20"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`
        fixed inset-0 top-[80px] bg-[#020205]/98 backdrop-blur-3xl z-[90] lg:hidden transition-all duration-700 overflow-y-auto
        ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-12'}
      `}>
        <div className="p-8 pb-32 space-y-12">
          {categories.map((cat) => (
            <div key={cat.id} className="space-y-6">
              <div className="flex items-center gap-3 text-[#D4AF37] font-black text-[12px] uppercase tracking-[0.4em] pb-4 border-b border-[#D4AF37]/20 opacity-80 font-magic">
                {cat.icon} {cat.label}
              </div>
              <div className="grid grid-cols-1 gap-3">
                {cat.tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleSelectTool(tool.id)}
                    className={`
                      flex items-center gap-5 p-6 rounded-3xl transition-all border
                      ${currentTool === tool.id ? 'bg-[#D4AF37] text-[#020205] border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4)]' : 'bg-white/5 text-slate-300 border-white/10'}
                    `}
                  >
                    <div className="opacity-80">{tool.icon}</div>
                    <span className="text-[14px] font-black uppercase tracking-tight">{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;