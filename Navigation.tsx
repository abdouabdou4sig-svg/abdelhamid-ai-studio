import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Type, Image as ImageIcon, Wand2, Maximize, Eraser, Palette, Users, Crop, History, Scissors, FileText, LayoutGrid, UserCircle2, ImagePlus, Paintbrush, PenTool, Layers, Briefcase, Gem, Pen, Compass, Leaf, MessageSquare, UserPlus, Library, Monitor, Sun, Shirt, Sparkles, FileImage, Film, Video, Zap, Key, CheckCircle2, AlertCircle, ChevronDown, Menu, X, RefreshCw, ScanSearch, Save, PlusCircle
} from 'lucide-react';
import { ToolType } from '../types';

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
      label: 'Génération',
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
      label: 'Édition & IA',
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
      label: 'Qualité',
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
      label: 'Design',
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
    },
    {
      id: 'tools',
      label: 'Outils',
      icon: <Library size={16} />,
      tools: [
        { id: ToolType.IMAGE_TO_TEXT, label: "Invite Magique", icon: <ScanSearch size={16} /> },
        { id: ToolType.AI_CHAT, label: "Assistant IA", icon: <MessageSquare size={16} /> },
        { id: ToolType.PROJECT_BACKUP, label: "Sauvegarde", icon: <Save size={16} /> },
        { id: ToolType.DOC_TO_TEXT, label: "Scanner OCR", icon: <FileText size={16} /> },
        { id: ToolType.CONVERT_FORMAT, label: "Convertisseur", icon: <RefreshCw size={16} /> },
        { id: ToolType.CLOUD_GALLERY, label: "Galerie Cloud", icon: <Library size={16} /> },
        { id: ToolType.IMAGE_LIBRARY, label: "Stock Photos", icon: <ImageIcon size={16} /> },
      ]
    }
  ];

  const handleSelectTool = (id: ToolType) => {
    onSelectTool(id);
    setActiveCategory(null);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl px-6 py-4">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        
        <button 
          onClick={() => handleSelectTool(ToolType.DASHBOARD)}
          className="flex items-center gap-3 group"
        >
          <div className="bg-brand-red p-2.5 rounded-2xl shadow-lg shadow-brand-red/20 group-hover:scale-110 transition-transform duration-300">
            <Leaf size={20} className="text-white" />
          </div>
          <div className="flex flex-col text-left">
            <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">Abdelhamid</h1>
            <span className="text-[10px] text-brand-red font-bold tracking-[0.4em] uppercase mt-1">AI Studio</span>
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
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${activeCategory === cat.id ? 'bg-white/10 text-brand-red' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
              >
                {cat.icon}
                {cat.label}
                <ChevronDown size={14} className={`transition-transform duration-300 ${activeCategory === cat.id ? 'rotate-180' : ''}`} />
              </button>

              <div className={`
                absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300
                ${activeCategory === cat.id ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'}
              `}>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-[24px] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[260px] grid grid-cols-1 gap-1">
                  {cat.tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleSelectTool(tool.id)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                        ${currentTool === tool.id ? 'bg-brand-red text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                      `}
                    >
                      <div className="shrink-0 group-hover:scale-110 transition-transform duration-300">{tool.icon}</div>
                      <span className="text-[12px] font-bold uppercase tracking-tight">{tool.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className={`hidden md:flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/10 ${hasKey ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-brand-red/10 text-brand-red animate-pulse'}`}>
            <Key size={14} />
            <span className="text-[11px] font-black uppercase tracking-widest">
              {hasKey ? 'PRO ACTIVE' : 'KEY REQUIRED'}
            </span>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-3 bg-white/5 rounded-2xl text-white hover:bg-white/10 transition-all"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`
        fixed inset-0 top-[80px] bg-black/95 backdrop-blur-3xl z-[90] lg:hidden transition-all duration-500 overflow-y-auto
        ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-8'}
      `}>
        <div className="p-6 pb-20 space-y-10">
          {categories.map((cat) => (
            <div key={cat.id} className="space-y-4">
              <div className="flex items-center gap-3 text-brand-red font-black text-[12px] uppercase tracking-[0.3em] pb-3 border-b border-white/10 opacity-60">
                {cat.icon} {cat.label}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cat.tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleSelectTool(tool.id)}
                    className={`
                      flex items-center gap-4 p-5 rounded-2xl transition-all border border-white/5
                      ${currentTool === tool.id ? 'bg-brand-red text-white border-brand-red shadow-lg' : 'bg-white/5 text-slate-300'}
                    `}
                  >
                    <div className="opacity-70">{tool.icon}</div>
                    <span className="text-[13px] font-bold uppercase tracking-tight">{tool.label}</span>
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
