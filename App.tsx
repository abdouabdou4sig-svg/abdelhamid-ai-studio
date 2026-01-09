import React, { useState } from 'react';
import { ToolType } from './types.ts';
import Navigation from './components/Navigation.tsx';

// Vues
import AiChat from './views/AiChat.tsx';
import TextToImage from './views/TextToImage.tsx';
import VideoGenerator from './views/VideoGenerator.tsx';
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
        <div className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-16 animate-fade-in relative">
          
          {/* Cercles de lueur magique */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] pointer-events-none opacity-20">
            <div className="absolute inset-0 bg-brand-purple blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute inset-10 bg-brand-gold blur-[100px] rounded-full"></div>
          </div>

          <div className="relative space-y-8">
            <h1 className="relative text-7xl md:text-9xl font-black uppercase tracking-tighter text-white font-magic leading-none">
              Abdelhamid <br/><span className="text-brand-gold">Alchemy AI</span>
            </h1>
            <div className="h-1 w-40 bg-brand-gold mx-auto rounded-full shadow-[0_0_20px_#D4AF37]"></div>
          </div>

          <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-4xl leading-relaxed mx-auto px-6">
            Transcendez la photographie par l'invocation algorithmique. <br/>Propulsé par <span className="text-brand-gold font-magic">Gemini 3 Pro</span> & <span className="text-brand-purple font-magic">VEO 3.1</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
             <button 
              onClick={() => setCurrentTool(ToolType.REMIX_IMAGE)} 
              className="group relative bg-[#D4AF37] hover:bg-[#F3CF55] text-[#020205] px-12 py-6 rounded-2xl font-black uppercase text-sm shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
             >
               <span className="font-magic">Entrer dans le Grimoire</span>
               <div className="w-1.5 h-1.5 bg-[#020205] rounded-full animate-ping"></div>
             </button>
             
             <button 
              onClick={() => setCurrentTool(ToolType.AI_CHAT)} 
              className="bg-white/5 hover:bg-white/10 text-white border border-[#D4AF37]/30 px-12 py-6 rounded-2xl font-black uppercase text-sm backdrop-blur-xl transition-all hover:border-[#D4AF37] group"
             >
               <span className="opacity-70 group-hover:opacity-100 transition-opacity font-magic">Consulter l'Oracle</span>
             </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-20 max-w-5xl w-full mx-auto opacity-40">
            {[
              { label: "Puissance", val: "Tenseur Gemini" },
              { label: "Vision", val: "Rendu 8K" },
              { label: "Flux", val: "Temps Réel" },
              { label: "Sûreté", val: "Protocole Or" }
            ].map(stat => (
              <div key={stat.label} className="flex flex-col border-l border-brand-gold/20 pl-4 text-left">
                <span className="text-[10px] uppercase tracking-widest text-brand-gold font-black">{stat.label}</span>
                <span className="text-lg font-magic text-white">{stat.val}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020205] text-white selection:bg-brand-gold/30">
      <Navigation currentTool={currentTool} onSelectTool={setCurrentTool} />
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 overflow-x-hidden">
        <div className="max-w-[1700px] mx-auto">
          {renderContent()}
        </div>
      </main>
      <footer className="p-16 border-t border-[#D4AF37]/10 text-center bg-[#050508]">
         <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-700 font-magic">© 2025 Abdelhamid AI Studio Pro • L'Excellence Alchimique</p>
      </footer>
    </div>
  );
};

export default App;