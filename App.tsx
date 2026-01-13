import React, { useState } from 'react';
import { ToolType } from './types.ts';
import Navigation from './components/Navigation.tsx';

// Vues
import AiChat from './views/AiChat.tsx';
import TextToImage from './views/TextToImage.tsx';
import FaceSwap from './views/FaceSwap.tsx';
import PhotoRetouch from './views/PhotoRetouch.tsx';
import RemixImage from './views/RemixImage.tsx';
import MagicEditor from './views/MagicEditor.tsx';
import StoryboardCreator from './views/StoryboardCreator.tsx';
import AiArtGenerator from './views/AiArtGenerator.tsx';
import CharacterSwapV2 from './views/CharacterSwapV2.tsx';
import AiReLight from './views/AiReLight.tsx';
import SkinEnhancer from './views/SkinEnhancer.tsx';
import ChangeView from './views/ChangeView.tsx';
import AiEnhancer from './views/AiEnhancer.tsx';
import Restoration from './views/Restoration.tsx';
import ObjectRemoval from './views/ObjectRemoval.tsx';
import AiPosterGenerator from './views/AiPosterGenerator.tsx';
import AiLogoGenerator from './views/AiLogoGenerator.tsx';
import AiNftGenerator from './views/AiNftGenerator.tsx';
import AiIllustrationGenerator from './views/AiIllustrationGenerator.tsx';
import AiHeadshots from './views/AiHeadshots.tsx';
import ProfileMaker from './views/ProfileMaker.tsx';
import PhotoToStencil from './views/PhotoToStencil.tsx';
import ImageToText from './views/ImageToText.tsx';
import ProjectBackup from './views/ProjectBackup.tsx';
import CustomToolTemplate from './views/CustomToolTemplate.tsx';
import DocumentToText from './views/DocumentToText.tsx';
import FormatConverter from './views/FormatConverter.tsx';
import CloudGallery from './views/CloudGallery.tsx';
import PhotoCollage from './views/PhotoCollage.tsx';
import TextBehindImage from './views/TextBehindImage.tsx';
import AiStylist from './views/AiStylist.tsx';
import AiBackgroundGenerator from './views/AiBackgroundGenerator.tsx';
import ImageLibrary from './views/ImageLibrary.tsx';

const App: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<ToolType>(ToolType.DASHBOARD);

  const renderContent = () => {
    switch (currentTool) {
      case ToolType.AI_CHAT: return <AiChat />;
      case ToolType.TEXT_TO_IMAGE: return <TextToImage />;
      case ToolType.FACE_SWAP: return <FaceSwap />;
      case ToolType.PHOTO_RETOUCH: return <PhotoRetouch />;
      case ToolType.REMIX_IMAGE: return <RemixImage />;
      case ToolType.IMAGE_TO_IMAGE: return <MagicEditor toolType={ToolType.IMAGE_TO_IMAGE} />;
      case ToolType.REMOVE_BG: return <MagicEditor toolType={ToolType.REMOVE_BG} />;
      case ToolType.COLORIZE: return <MagicEditor toolType={ToolType.COLORIZE} />;
      case ToolType.STORYBOARD: return <StoryboardCreator />;
      case ToolType.AI_ART_GENERATOR: return <AiArtGenerator />;
      case ToolType.CHARACTER_SWAP_V2: return <CharacterSwapV2 />;
      case ToolType.AI_RELIGHT: return <AiReLight />;
      case ToolType.SKIN_ENHANCER: return <SkinEnhancer />;
      case ToolType.CHANGE_VIEW: return <ChangeView />;
      case ToolType.UPSCALE: return <AiEnhancer />;
      case ToolType.RESTORATION: return <Restoration />;
      case ToolType.OBJECT_REMOVAL: return <ObjectRemoval />;
      case ToolType.AI_POSTER_GENERATOR: return <AiPosterGenerator />;
      case ToolType.AI_LOGO_GENERATOR: return <AiLogoGenerator />;
      case ToolType.AI_NFT_GENERATOR: return <AiNftGenerator />;
      case ToolType.AI_ILLUSTRATION_GENERATOR: return <AiIllustrationGenerator />;
      case ToolType.AI_HEADSHOTS: return <AiHeadshots />;
      case ToolType.PROFILE_MAKER: return <ProfileMaker />;
      case ToolType.PHOTO_TO_STENCIL: return <PhotoToStencil />;
      case ToolType.IMAGE_TO_TEXT: return <ImageToText />;
      case ToolType.PROJECT_BACKUP: return <ProjectBackup />;
      case ToolType.NEW_CUSTOM_TOOL: return <CustomToolTemplate />;
      case ToolType.DOC_TO_TEXT: return <DocumentToText />;
      case ToolType.CONVERT_FORMAT: return <FormatConverter />;
      case ToolType.CLOUD_GALLERY: return <CloudGallery />;
      case ToolType.PHOTO_COLLAGE: return <PhotoCollage />;
      case ToolType.TEXT_BEHIND: return <TextBehindImage />;
      case ToolType.AI_STYLIST: return <AiStylist />;
      case ToolType.BG_GENERATOR: return <AiBackgroundGenerator />;
      case ToolType.IMAGE_LIBRARY: return <ImageLibrary />;
      default: return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-16 animate-fade-in relative px-6 py-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[500px] pointer-events-none opacity-20">
            <div className="absolute inset-0 bg-brand-gold blur-[140px] rounded-full"></div>
            <div className="absolute inset-24 bg-brand-purple blur-[100px] rounded-full"></div>
          </div>

          <div className="relative space-y-8 z-10">
            <span className="text-brand-gold font-magic tracking-[0.8em] text-[10px] md:text-xs uppercase opacity-80 border-b border-brand-gold/30 pb-2">Le Sanctuaire de l'Image</span>
            <h1 className="text-5xl md:text-9xl font-magic font-black text-white tracking-tighter leading-none select-none">
              ABDELHAMID IA <br/>
              <span className="text-brand-gold drop-shadow-[0_0_25px_rgba(212,175,55,0.5)]">Alchemy Studio</span>
            </h1>
            <p className="text-base md:text-xl text-slate-400 font-light max-w-2xl leading-relaxed mx-auto italic">
              "L'art de la transmutation numérique par l'intelligence de <span className="text-brand-gold font-magic font-bold">Gemini 3 Pro</span>"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 pt-6 relative z-10">
             <button 
                onClick={() => setCurrentTool(ToolType.REMIX_IMAGE)} 
                className="group relative bg-[#D4AF37] text-[#020205] px-12 py-5 rounded-full font-magic font-black text-xs md:text-sm tracking-[0.2em] transition-all hover:scale-110 active:scale-95 shadow-[0_15px_50px_rgba(212,175,55,0.4)]"
             >
                <span className="relative z-10">Ouvrir le Grimoire</span>
                <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </button>
             
             <button 
                onClick={() => setCurrentTool(ToolType.AI_CHAT)} 
                className="px-12 py-5 rounded-full font-magic font-black text-xs md:text-sm tracking-[0.2em] border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all backdrop-blur-xl bg-white/5"
             >
                Consulter l'Oracle
             </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020205] text-white selection:bg-brand-gold/30">
      <Navigation currentTool={currentTool} onSelectTool={setCurrentTool} />
      <main className="flex-1 pt-24 pb-20 overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          {renderContent()}
        </div>
      </main>
      <footer className="py-12 border-t border-[#D4AF37]/10 text-center bg-[#050508]/80 backdrop-blur-md">
         <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-[10px] font-magic tracking-[1em] text-slate-600 uppercase">ABDELHAMID IA • L'EXCELLENCE ÉTERNELLE</p>
            <p className="text-[8px] text-slate-800 uppercase tracking-widest">© 2025 ALCHEMY STUDIO • TOUS DROITS RÉSERVÉS</p>
         </div>
      </footer>
    </div>
  );
};

export default App;