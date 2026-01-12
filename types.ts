
export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  IMAGE_TO_TEXT = 'IMAGE_TO_TEXT',
  FACE_SWAP = 'FACE_SWAP',
  AI_CHAT = 'AI_CHAT',
  PHOTO_RETOUCH = 'PHOTO_RETOUCH',
  // Added missing ToolType members used in MagicEditor and other views
  IMAGE_TO_IMAGE = 'IMAGE_TO_IMAGE',
  REMOVE_BG = 'REMOVE_BG',
  COLORIZE = 'COLORIZE'
}

export interface GeneratedImage {
  url: string;
  mimeType: string;
  // Added missing properties used in CloudGallery and other views
  prompt?: string;
  timestamp?: number;
  category?: string;
}

export interface AiResponse {
  text?: string;
  images?: GeneratedImage[];
  // Added missing property used in VideoGenerator
  videos?: { url: string }[];
  error?: string;
}
