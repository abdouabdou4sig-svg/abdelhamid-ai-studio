
import { GoogleGenAI, Type } from "@google/genai";
import { AiResponse } from "../types";

/**
 * ABDELHAMID AI CORE SERVICE
 * Robustesse et performance
 */

const getApiKey = () => {
  try {
    // Accès sécurisé à l'environnement
    return (typeof process !== 'undefined' && process.env?.API_KEY) ? process.env.API_KEY : "";
  } catch (e) {
    return "";
  }
};

// Use a factory function for GoogleGenAI to ensure fresh instance as per guidelines
const getAI = () => new GoogleGenAI({ apiKey: getApiKey() });

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fix: Added callWithRetry for exponential backoff handling
/**
 * Utility to retry an async function with exponential backoff.
 */
export const callWithRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries <= 0) throw error;
    await sleep(delay);
    return callWithRetry(fn, retries - 1, delay * 2);
  }
};

export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve({ inlineData: { data: base64Data, mimeType: file.type } });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const chatWithAi = async (message: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message
  });
  return response.text;
};

export const generateImage = async (prompt: string, ratio: string = "1:1"): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: ratio as any } }
    });
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return { 
        images: [{ 
          url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`, 
          mimeType: part.inlineData.mimeType 
        }] 
      };
    }
    return { error: "L'IA n'a pas pu générer d'image." };
  } catch (e: any) {
    return { error: e.message || "Erreur de génération." };
  }
};

export const swapFaces = async (face: File, target: File, prompt?: string, strength: number = 90): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const p1 = await fileToGenerativePart(face);
    const p2 = await fileToGenerativePart(target);
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { 
        parts: [
          p1, 
          p2, 
          { text: `Surgically swap the face from the first image onto the person in the second image. Realism strength: ${strength}%. ${prompt || ""}` }
        ] 
      }
    });
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return { 
        images: [{ 
          url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`, 
          mimeType: part.inlineData.mimeType 
        }] 
      };
    }
    return { error: "Le Face Swap a échoué." };
  } catch (e: any) {
    return { error: e.message };
  }
};

export const editImage = async (file: File, prompt: string): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const part = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [part, { text: prompt }] }
    });
    const outPart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (outPart?.inlineData) {
      return { 
        images: [{ 
          url: `data:${outPart.inlineData.mimeType};base64,${outPart.inlineData.data}`, 
          mimeType: part.inlineData.mimeType 
        }] 
      };
    }
    return { error: "L'édition a échoué." };
  } catch (e: any) {
    return { error: e.message };
  }
};

export const editImageWithReference = async (source: File, reference: File, prompt: string): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const p1 = await fileToGenerativePart(source);
    const p2 = await fileToGenerativePart(reference);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [p1, p2, { text: prompt }] }
    });
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return { 
        images: [{ 
          url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`, 
          mimeType: part.inlineData.mimeType 
        }] 
      };
    }
    return { error: "L'édition avec référence a échoué." };
  } catch (e: any) {
    return { error: e.message };
  }
};

export const remixImage = async (file: File, instruction: string, preserveIdentity: boolean): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const part = await fileToGenerativePart(file);
    const identityPrompt = preserveIdentity ? "Keep the person's face identity and features exactly the same. Do not change who they are." : "";
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [part, { text: `${instruction} ${identityPrompt}` }] }
    });
    const outPart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (outPart?.inlineData) {
      return { 
        images: [{ 
          url: `data:${outPart.inlineData.mimeType};base64,${outPart.inlineData.data}`, 
          mimeType: part.inlineData.mimeType 
        }] 
      };
    }
    return { error: "Le remix a échoué." };
  } catch (e: any) {
    return { error: e.message };
  }
};

export const restorePhoto = (file: File, colorize: boolean) => 
  editImage(file, `Full photo restoration. Remove scratches and noise. ${colorize ? 'Apply natural colorization.' : ''}`);

export const removeObject = (file: File, objectDescription: string) => 
  editImage(file, `Remove this object from the scene: ${objectDescription}. Fill background naturally.`);

export const replaceBackground = (file: File, backgroundPrompt: string) => 
  editImage(file, `Replace the background with: ${backgroundPrompt}. Match lighting.`);

export const generateArtisticImage = (p: string, s: string, r: string) => generateImage(`${p}. Style: ${s}`, r);
export const generateStencil = (f: File) => editImage(f, "Convert to black and white stencil art.");
export const generateHeadshot = (f: File, s: string) => editImage(f, `Professional business headshot, style: ${s}`);
export const generateNftArt = (p: string, s: string) => generateImage(`NFT digital art, ${p}, style: ${s}`, "1:1");
export const generateTransparentOverlay = (f: File) => editImage(f, "Remove background, isolate subject on clean background.");
export const generateIllustration = (p: string, s: string) => generateImage(`Vector illustration, ${p}, style: ${s}`, "1:1");
export const changeImagePerspective = (f: File, p: string) => editImage(f, p);
export const swapCharacters = (p: File, c: File, pr: string) => swapFaces(p, c, pr);
export const generateLogo = (c: string, i: string, s: string, e: string) => generateImage(`Logo for ${c} in ${i} industry, style ${s}. ${e}`, "1:1");
export const reLightImage = (f: File, t: string, i: number) => editImage(f, `Relight image with ${t} lighting at ${i}% intensity.`);
export const generatePoster = (t: string, s: string, r: string, i?: File) => i ? editImage(i, `Poster design, theme ${t}, style ${s}`) : generateImage(`Poster design, theme ${t}, style ${s}`, r);

export const imageToText = async (f: File, p: string): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const part = await fileToGenerativePart(f);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [part, { text: p }] }
    });
    return { text: response.text };
  } catch (e: any) {
    return { error: e.message };
  }
};

export const documentToText = async (file: File): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const part = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [part, { text: "Extract all text from this document. Maintain formatting where possible." }] }
    });
    return { text: response.text };
  } catch (e: any) {
    return { error: e.message };
  }
};

/**
 * Storyboard generator using a high-reasoning model for structuring and image generation for visual rendering
 */
export const generateStoryboard = async (script: string, style: string, count: number): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Génère ${count} images pour un storyboard basé sur ce script : "${script}". Style visuel : ${style}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            frames: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  prompt: { type: Type.STRING, description: "Prompt de génération d'image détaillé pour cette frame" },
                  technicalNote: { type: Type.STRING, description: "Note technique (angle, éclairage, etc.)" }
                },
                required: ["prompt", "technicalNote"]
              }
            }
          },
          required: ["frames"]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{"frames":[]}');
    const rawFrames = parsed.frames || [];
    
    // Pour chaque frame, on génère une image réelle via Gemini 2.5 Flash Image
    const framesWithImages = await Promise.all(rawFrames.map(async (f: any) => {
       const imgRes = await generateImage(f.prompt, "16:9");
       return {
         prompt: f.prompt,
         technicalNote: f.technicalNote,
         imageUrl: imgRes.images?.[0]?.url || ""
       };
    }));

    return { frames: framesWithImages };
  } catch (e: any) {
    return { error: e.message || "Erreur lors de la génération du storyboard." };
  }
};

/**
 * Vidéo generation service using Veo 3.1
 */
export const generateVideoVeo = async (prompt: string): Promise<AiResponse> => {
  try {
    const ai = getAI();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Poll for video generation completion
    while (!operation.done) {
      await sleep(10000);
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
      return {
        videos: [{
          url: `${downloadLink}&key=${getApiKey()}`
        }]
      };
    }
    return { error: "La génération vidéo a échoué." };
  } catch (e: any) {
    // Handling required API key selection for Veo models
    if (e.message?.includes("Requested entity was not found")) {
      if (typeof (window as any).aistudio?.openSelectKey === 'function') {
        (window as any).aistudio.openSelectKey();
      }
    }
    return { error: e.message || "Erreur de génération vidéo." };
  }
};
