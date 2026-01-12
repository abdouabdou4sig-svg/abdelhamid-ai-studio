
export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  IMAGE_TO_TEXT = 'IMAGE_TO_TEXT',
  REMIX_IMAGE = 'REMIX_IMAGE',
  FACE_SWAP = 'FACE_SWAP',
  AI_CHAT = 'AI_CHAT',
  PHOTO_RETOUCH = 'PHOTO_RETOUCH',
  STORYBOARD = 'STORYBOARD',
  UPSCALE = 'UPSCALE',
  RESTORATION = 'RESTORATION',
  BG_GENERATOR = 'BG_GENERATOR',
  PROJECT_BACKUP = 'PROJECT_BACKUP',
  // Missing tool types required by components
  IMAGE_TO_IMAGE = 'IMAGE_TO_IMAGE',
  REMOVE_BG = 'REMOVE_BG',
  COLORIZE = 'COLORIZE',
  CHARACTER_SWAP_V2 = 'CHARACTER_SWAP_V2',
  AI_RELIGHT = 'AI_RELIGHT',
  SKIN_ENHANCER = 'SKIN_ENHANCER',
  CHANGE_VIEW = 'CHANGE_VIEW',
  AI_STYLIST = 'AI_STYLIST',
  OBJECT_REMOVAL = 'OBJECT_REMOVAL',
  AI_POSTER_GENERATOR = 'AI_POSTER_GENERATOR',
  AI_LOGO_GENERATOR = 'AI_LOGO_GENERATOR',
  AI_NFT_GENERATOR = 'AI_NFT_GENERATOR',
  AI_ILLUSTRATION_GENERATOR = 'AI_ILLUSTRATION_GENERATOR',
  AI_HEADSHOTS = 'AI_HEADSHOTS',
  PROFILE_MAKER = 'PROFILE_MAKER',
  PHOTO_TO_STENCIL = 'PHOTO_TO_STENCIL',
  PHOTO_COLLAGE = 'PHOTO_COLLAGE',
  TEXT_BEHIND = 'TEXT_BEHIND',
  TEXT_TO_IMAGE = 'TEXT_TO_IMAGE',
  AI_ART_GENERATOR = 'AI_ART_GENERATOR'
}

export interface GeneratedImage {
  url: string;
  mimeType: string;
  prompt?: string;
  timestamp?: number;
}

export interface GeneratedVideo {
  url: string;
}

export interface StoryboardFrame {
  prompt: string;
  imageUrl: string;
  technicalNote: string;
}

export interface AiResponse {
  text?: string;
  images?: GeneratedImage[];
  videos?: GeneratedVideo[];
  frames?: StoryboardFrame[];
  error?: string;
}
