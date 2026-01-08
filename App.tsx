import React, { useState } from 'react';
import { ToolType } from './types.ts';
import Navigation from './components/Navigation.tsx';

// Vues avec extensions explicites
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12 animate-fade-in">
          <div className="relative">
            <div className="absolute -inset-8 bg-brand-red/20 blur-3xl rounded-full animate-pulse"></div>
            <h1 className="relative text-7xl md:text-9xl font-black uppercase tracking-tighter text-white">
              Abdelhamid <span className="text-brand-red">AI</span>
            </h1>
          </div>
          <p className="text-2xl text-zinc-500 font-medium max-w-3xl leading-relaxed">
            La plateforme créative la plus avancée au monde. <br/>Propulsé par <span className="text-white">Gemini 3 Pro</span> & <span className="text-white">VEO 3.1</span>.
          </p>
          <div className="flex gap-4">
             <button onClick={() => setCurrentTool(ToolType.REMIX_IMAGE)} className="bg-brand-red hover:bg-red-500 text-white px-10 py-5 rounded-3xl font-black uppercase text-sm shadow-2xl transition-all hover:scale-105 active:scale-95">Commencer la création</button>
             <button onClick={() => setCurrentTool(ToolType.AI_CHAT)} className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-3xl font-black uppercase text-sm backdrop-blur-md transition-all">Parler à l'assistant</button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white">
      <Navigation currentTool={currentTool} onSelectTool={setCurrentTool} />
      <main className="flex-1 pt-32 pb-20 px-6 md:px-12 overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </main>
      <footer className="p-10 border-t border-white/5 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">© 2025 Abdelhamid AI Studio Pro • L'excellence algorithmique</p>
      </footer>
    </div>
  );
};

export default App;