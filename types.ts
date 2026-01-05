
export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  AI_CHAT = 'AI_CHAT',
  TEXT_TO_IMAGE = 'TEXT_TO_IMAGE',
  VIDEO_GENERATOR = 'VIDEO_GENERATOR',
  FACE_SWAP = 'FACE_SWAP',
  PHOTO_RETOUCH = 'PHOTO_RETOUCH',
  REMIX_IMAGE = 'REMIX_IMAGE',
  IMAGE_TO_IMAGE = 'IMAGE_TO_IMAGE',
  REMOVE_BG = 'REMOVE_BG',
  COLORIZE = 'COLORIZE',
  STORYBOARD = 'STORYBOARD',
  AI_ART_GENERATOR = 'AI_ART_GENERATOR',
  CHARACTER_SWAP_V2 = 'CHARACTER_SWAP_V2',
  AI_RELIGHT = 'AI_RELIGHT',
  SKIN_ENHANCER = 'SKIN_ENHANCER',
  CHANGE_VIEW = 'CHANGE_VIEW',
  UPSCALE = 'UPSCALE',
  RESTORATION = 'RESTORATION',
  OBJECT_REMOVAL = 'OBJECT_REMOVAL',
  AI_POSTER_GENERATOR = 'AI_POSTER_GENERATOR',
  AI_LOGO_GENERATOR = 'AI_LOGO_GENERATOR',
  AI_NFT_GENERATOR = 'AI_NFT_GENERATOR',
  AI_ILLUSTRATION_GENERATOR = 'AI_ILLUSTRATION_GENERATOR',
  AI_HEADSHOTS = 'AI_HEADSHOTS',
  PROFILE_MAKER = 'PROFILE_MAKER',
  PHOTO_TO_STENCIL = 'PHOTO_TO_STENCIL',
  IMAGE_TO_TEXT = 'IMAGE_TO_TEXT',
  PROJECT_BACKUP = 'PROJECT_BACKUP',
  NEW_CUSTOM_TOOL = 'NEW_CUSTOM_TOOL',
  DOC_TO_TEXT = 'DOC_TO_TEXT',
  CONVERT_FORMAT = 'CONVERT_FORMAT',
  CLOUD_GALLERY = 'CLOUD_GALLERY'
}

export interface GeneratedImage {
  url: string;
  mimeType: string;
  // Added prompt and timestamp to GeneratedImage
  prompt?: string;
  timestamp?: number;
}

export interface AiResponse {
  text?: string;
  images?: GeneratedImage[];
  videos?: { url: string; metadata?: any }[];
  // Added frames for storyboard
  frames?: { prompt: string, imageUrl: string, technicalNote: string }[];
  error?: string;
}
