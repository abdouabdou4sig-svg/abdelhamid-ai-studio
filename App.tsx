import React, { useState } from 'react';
import { ToolType } from './types';
import Navigation from './components/Navigation';

// Vues
import AiChat from './views/AiChat';
import TextToImage from './views/TextToImage';
import VideoGenerator from './views/VideoGenerator';
import FaceSwap from './views/FaceSwap';
import PhotoRetouch from './views/PhotoRetouch';
import RemixImage from './views/RemixImage';
import MagicEditor from './views/MagicEditor';
import StoryboardCreator from './views/StoryboardCreator';
import AiArtGenerator from './views/AiArtGenerator';
import CharacterSwapV2 from './views/CharacterSwapV2';
import AiReLight from './views/AiReLight';
import SkinEnhancer from './views/SkinEnhancer';
import ChangeView from './views/ChangeView';
import AiEnhancer from './views/AiEnhancer';
import Restoration from './views/Restoration';
import ObjectRemoval from './views/ObjectRemoval';
import AiPosterGenerator from './views/AiPosterGenerator';
import AiLogoGenerator from './views/AiLogoGenerator';
import AiNftGenerator from './views/AiNftGenerator';
import AiIllustrationGenerator from './views/AiIllustrationGenerator';
import AiHeadshots from './views/AiHeadshots';
import ProfileMaker from './views/ProfileMaker';
import PhotoToStencil from './views/PhotoToStencil';
import ImageToText from './views/ImageToText';
import ProjectBackup from './views/ProjectBackup';
import CustomToolTemplate from './views/CustomToolTemplate';
import DocumentToText from './views/DocumentToText';
import FormatConverter from './views/FormatConverter';
import CloudGallery from './views/CloudGallery';
import PhotoCollage from './views/PhotoCollage';
import TextBehindImage from './views/TextBehindImage';
import AiStylist from './views/AiStylist';
import AiBackgroundGenerator from './views/AiBackgroundGenerator';
import ImageLibrary from './views/ImageLibrary';

const App: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<ToolType>(ToolType.DASHBOARD);

  const renderContent = () => {
    switch (currentTool) {
      case ToolType.AI_CHAT: return <AiChat />;
      case ToolType.TEXT_TO_IMAGE: return <TextToImage />;
      case ToolType.VIDEO_GENERATOR: return <VideoGenerator />;
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
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-16 animate-fade-in relative px-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] pointer-events-none">
            <div className="absolute inset-0 bg-brand-gold/10 blur-[120px] rounded-full"></div>
            <div className="absolute inset-20 bg-brand-purple/5 blur-[100px] rounded-full"></div>
          </div>

          <div className="relative space-y-6">
            <span className="text-brand-gold font-magic tracking-[0.6em] text-xs uppercase opacity-70">Le Sanctuaire de l'Image</span>
            <h1 className="text-6xl md:text-9xl font-magic font-black text-white tracking-tighter leading-none">
              Abdelhamid <br/>
              <span className="text-brand-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">Alchemy AI</span>
            </h1>
          </div>

          <p className="text-lg md:text-xl text-slate-400 font-light max-w-3xl leading-relaxed mx-auto italic">
            "L'art de la transmutation numérique par <span className="text-brand-gold font-magic font-bold">Gemini 3 Pro</span>"
          </p>

          <div className="flex flex-col sm:flex-row gap-8 pt-4">
             <button 
                onClick={() => setCurrentTool(ToolType.REMIX_IMAGE)} 
                className="group relative bg-[#D4AF37] text-[#020205] px-14 py-6 rounded-full font-magic font-black text-sm tracking-[0.2em] transition-all hover:scale-110 active:scale-95 shadow-[0_10px_40px_rgba(212,175,55,0.3)]"
             >
                <span className="relative z-10">Ouvrir le Grimoire</span>
                <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
             </button>
             
             <button 
                onClick={() => setCurrentTool(ToolType.AI_CHAT)} 
                className="px-14 py-6 rounded-full font-magic font-black text-sm tracking-[0.2em] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all backdrop-blur-md"
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
        <div className="max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </main>
      <footer className="py-16 border-t border-[#D4AF37]/10 text-center bg-[#050508]">
         <p className="text-[10px] font-magic tracking-[1em] text-slate-700 uppercase">ABDELHAMID AI STUDIO • L'EXCELLENCE ÉTERNELLE</p>
      </footer>
    </div>
  );
};

export default App;