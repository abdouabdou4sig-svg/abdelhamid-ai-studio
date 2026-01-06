
import { GoogleGenAI, Type } from "@google/genai";
import { AiResponse } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      resolve({ inlineData: { data: base64Data, mimeType: file.type } });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const callWithRetry = async <T>(task: () => Promise<T>, retries = 3): Promise<T> => {
  try {
    return await task();
  } catch (error: any) {
    if (retries > 0 && (error.message?.includes('429') || error.message?.includes('limit'))) {
      await sleep(2000);
      return callWithRetry(task, retries - 1);
    }
    throw error;
  }
};

// --- CHAT & TEXT ---
export const chatWithAi = async (message: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message
  });
  return response.text;
};

export const imageToText = async (file: File, prompt: string): Promise<AiResponse> => {
  const ai = getAI();
  const part = await fileToGenerativePart(file);
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [part, { text: prompt }] }
  });
  return { text: response.text };
};

// --- GENERATION ---
export const generateImage = async (prompt: string): Promise<AiResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] }
  });
  const img = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return img ? { images: [{ url: `data:${img.inlineData.mimeType};base64,${img.inlineData.data}`, mimeType: img.inlineData.mimeType }] } : { error: "Échec de génération" };
};

export const generateVideoVeo = async (prompt: string, image?: File): Promise<AiResponse> => {
  const ai = getAI();
  const config: any = { model: 'veo-3.1-fast-generate-preview', prompt, config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' } };
  if (image) {
    const p = await fileToGenerativePart(image);
    config.image = { imageBytes: p.inlineData.data, mimeType: p.inlineData.mimeType };
  }
  let op = await ai.models.generateVideos(config);
  while (!op.done) { await sleep(10000); op = await ai.operations.getVideosOperation({ operation: op }); }
  return { videos: [{ url: `${op.response?.generatedVideos?.[0]?.video?.uri}&key=${process.env.API_KEY}` }] };
};

// --- EDITING ---
export const editImage = async (file: File, prompt: string): Promise<AiResponse> => {
  const ai = getAI();
  const part = await fileToGenerativePart(file);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [part, { text: prompt }] }
  });
  const img = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return img ? { images: [{ url: `data:${img.inlineData.mimeType};base64,${img.inlineData.data}`, mimeType: img.inlineData.mimeType }] } : { error: "Échec de traitement" };
};

export const editImageWithReference = async (source: File, ref: File, prompt: string): Promise<AiResponse> => {
  const ai = getAI();
  const p1 = await fileToGenerativePart(source);
  const p2 = await fileToGenerativePart(ref);
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [p1, p2, { text: prompt }] }
  });
  const img = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return img ? { images: [{ url: `data:${img.inlineData.mimeType};base64,${img.inlineData.data}`, mimeType: img.inlineData.mimeType }] } : { error: "Échec de fusion" };
};

// --- TOOLS WRAPPERS (Assurant l'existence de toutes les fonctions appelées par les vues) ---
export const swapFaces = (f: File, t: File, p?: string, s = 90) => editImageWithReference(t, f, `Swap faces surgically. Strength ${s}%. ${p || ""}`);
export const restorePhoto = (f: File, c: boolean) => editImage(f, `Restore this old photo. Remove scratches. ${c ? 'Add color.' : ''}`);
export const removeObject = (f: File, o: string) => editImage(f, `Remove ${o} from this image naturally.`);
export const documentToText = (f: File) => imageToText(f, "Perform OCR and extract all text from this document accurately.");
export const replaceBackground = (f: File, p: string) => editImage(f, `Replace background with: ${p}. Keep subject same.`);
export const generateArtisticImage = (p: string, s: string, r: string) => generateImage(`Artistic ${s} style: ${p}. Aspect ratio ${r}.`);
export const generateStencil = (f: File) => editImage(f, "Convert to clean black and white stencil art.");
export const generateHeadshot = (f: File, s: string) => editImage(f, `Professional high-end corporate headshot in ${s} outfit.`);
export const generateNftArt = (p: string, s: string) => generateImage(`Unique NFT Collectible ${s}: ${p}`);
export const generateTransparentOverlay = (f: File) => editImage(f, "Extract subject and put it on a pure white background for masking.");
export const generateIllustration = (p: string, s: string) => generateImage(`High-quality ${s} illustration of ${p}`);
export const changeImagePerspective = (f: File, p: string) => editImage(f, `Change perspective to: ${p}`);
export const swapCharacters = (p: File, c: File, i: string) => editImageWithReference(p, c, i);
export const generateLogo = (c: string, i: string, s: string, e: string) => generateImage(`Professional minimalist logo for ${c}, industry: ${i}, style: ${s}. ${e}`);
export const reLightImage = (f: File, l: string, i: number) => editImage(f, `Apply professional ${l} lighting at ${i}% intensity.`);
export const generatePoster = (t: string, s: string, r: string, f?: File) => f ? editImage(f, `Movie poster design: ${t}, style ${s}`) : generateImage(`Movie poster design: ${t}, style ${s}. Ratio ${r}.`);
export const remixImage = (f: File, i: string, id: boolean) => editImage(f, `Remix image: ${i}. ${id ? 'Keep original face identity exactly same.' : ''}`);

export const generateStoryboard = async (script: string, style: string, count: number): Promise<AiResponse> => {
  const ai = getAI();
  const res = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Plan ${count} frames for a professional storyboard: ${script}. Return a JSON array of objects with {prompt, technicalNote}.`,
    config: { 
      responseMimeType: "application/json", 
      responseSchema: { 
        type: Type.ARRAY, 
        items: { 
          type: Type.OBJECT, 
          properties: { 
            prompt: { type: Type.STRING }, 
            technicalNote: { type: Type.STRING } 
          },
          required: ["prompt", "technicalNote"]
        } 
      } 
    }
  });
  
  const data = JSON.parse(res.text);
  const frames = [];
  for (const f of data) {
    const img = await generateArtisticImage(f.prompt, style, "16:9");
    frames.push({ ...f, imageUrl: img.images?.[0].url || "" });
    await sleep(1000); 
  }
  return { frames };
};
