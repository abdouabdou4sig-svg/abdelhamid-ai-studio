import { GoogleGenAI, Type } from "@google/genai";
import { AiResponse } from "../types";

/**
 * ABDELHAMID AI CORE SERVICE
 * Optimized for Gemini 3 and Veo 3.1
 */

const getAI = () => {
  const apiKey = process.env.API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

export const callWithRetry = async <T>(task: () => Promise<T>, retries = 3): Promise<T> => {
  try {
    return await task();
  } catch (error: any) {
    if (retries > 0 && (error.message?.includes('429') || error.message?.includes('quota'))) {
      await sleep(3000);
      return callWithRetry(task, retries - 1);
    }
    throw error;
  }
};

// --- CORE AI CAPABILITIES ---

export const chatWithAi = async (message: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message
  });
  return response.text;
};

// Modified to support ratio parameter
export const generateImage = async (prompt: string, ratio: string = "1:1"): Promise<AiResponse> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { aspectRatio: ratio as any }
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
    return { error: "L'IA n'a pas pu générer d'image pour ce prompt." };
  } catch (e: any) {
    return { error: e.message || "Erreur de génération d'image." };
  }
};

export const editImage = async (file: File, prompt: string): Promise<AiResponse> => {
  const ai = getAI();
  try {
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
          mimeType: outPart.inlineData.mimeType 
        }] 
      };
    }
    return { error: "L'édition n'a pas produit d'image." };
  } catch (e: any) {
    return { error: e.message || "Erreur d'édition." };
  }
};

export const editImageWithReference = async (source: File, ref: File, prompt: string): Promise<AiResponse> => {
  const ai = getAI();
  try {
    const p1 = await fileToGenerativePart(source);
    const p2 = await fileToGenerativePart(ref);
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [p1, p2, { text: prompt }] },
      config: {
        imageConfig: { aspectRatio: "1:1", imageSize: "1K" }
      }
    });
    const outPart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (outPart?.inlineData) {
      return { 
        images: [{ 
          url: `data:${outPart.inlineData.mimeType};base64,${outPart.inlineData.data}`, 
          mimeType: outPart.inlineData.mimeType 
        }] 
      };
    }
    return { error: "La fusion a échoué." };
  } catch (e: any) {
    return { error: e.message || "Erreur Pro Image." };
  }
};

export const generateVideoVeo = async (prompt: string, image?: File): Promise<AiResponse> => {
  const ai = getAI();
  try {
    const payload: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    };
    if (image) {
      const p = await fileToGenerativePart(image);
      payload.image = { imageBytes: p.inlineData.data, mimeType: p.inlineData.mimeType };
    }
    
    let op = await ai.models.generateVideos(payload);
    while (!op.done) { 
      await sleep(10000); 
      op = await ai.operations.getVideosOperation({ operation: op }); 
    }
    const uri = op.response?.generatedVideos?.[0]?.video?.uri;
    const apiKey = process.env.API_KEY || "";
    return { videos: [{ url: `${uri}&key=${apiKey}` }] };
  } catch (e: any) {
    return { error: e.message || "Erreur de génération vidéo VEO." };
  }
};

// --- PHOTOGRAPHY TOOL WRAPPERS ---

export const swapFaces = (face: File, target: File, prompt?: string, strength = 90) => 
  editImageWithReference(target, face, `Surgically swap the face from the first image onto the person in the second image. Strength: ${strength}%. ${prompt || ""}`);

export const restorePhoto = (file: File, colorize: boolean) => 
  editImage(file, `Full professional restoration of this old photo. Remove scratches, noise and damage. ${colorize ? 'Apply natural colorization.' : 'Maintain B&W clarity.'}`);

export const removeObject = (file: File, objectDescription: string) => 
  editImage(file, `Completely remove the "${objectDescription}" from this image and fill the background realistically with generative inpainting.`);

export const replaceBackground = (file: File, backgroundPrompt: string) => 
  editImage(file, `Cleanly remove the current background and replace it with a high-quality: ${backgroundPrompt}. Match the lighting.`);

// Pass ratio to generateImage
export const generateArtisticImage = (prompt: string, style: string, ratio: string) => 
  generateImage(`Professional digital art, style ${style}: ${prompt}. Highly detailed.`, ratio);

export const reLightImage = (file: File, lightStyle: string, intensity: number) => 
  editImage(file, `Redraw lighting in this image. Style: ${lightStyle}. Intensity: ${intensity}%. Ensure shadows and highlights are physically accurate.`);

export const imageToText = async (file: File, prompt: string): Promise<AiResponse> => {
  const ai = getAI();
  const part = await fileToGenerativePart(file);
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [part, { text: prompt }] }
  });
  return { text: response.text };
};

export const documentToText = async (file: File): Promise<AiResponse> => {
  const ai = getAI();
  const part = await fileToGenerativePart(file);
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [part, { text: "Perform high-accuracy OCR. Extract all text content and return as structured markdown." }] }
  });
  return { text: response.text };
};

export const generateStoryboard = async (script: string, style: string, count: number): Promise<AiResponse> => {
  const ai = getAI();
  const res = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on this script: "${script}", create a ${count}-frame storyboard plan. For each frame, provide a descriptive visual prompt and a short technical camera note.`,
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
  
  const data = JSON.parse(res.text || "[]");
  const frames = [];
  for (const f of data) {
    const img = await generateArtisticImage(f.prompt, style, "16:9");
    frames.push({ ...f, imageUrl: img.images?.[0].url || "" });
    await sleep(500); // Small delay to avoid hammering
  }
  return { frames };
};

// --- NEW TOOLS ADDED TO FIX EXPORT ERRORS ---

/**
 * Generate a high-contrast stencil version of a photo
 */
export const generateStencil = async (file: File): Promise<AiResponse> => {
  return editImage(file, "Convert this photo into a high-contrast black and white stencil. Clean lines, perfect for tattoos or laser cutting.");
};

/**
 * Generate professional headshots from a selfie
 */
export const generateHeadshot = async (file: File, style: string): Promise<AiResponse> => {
  return editImage(file, `Transform this selfie into a professional business headshot. Style: ${style}. High-end lighting, corporate background, sharp focus.`);
};

/**
 * Generate NFT Art with specific prompt and style
 */
export const generateNftArt = async (prompt: string, style: string): Promise<AiResponse> => {
  return generateArtisticImage(prompt, style, "1:1");
};

/**
 * Remove background and isolate the subject
 */
export const generateTransparentOverlay = async (file: File): Promise<AiResponse> => {
  return editImage(file, "Remove the background completely and isolate the main subject. The output should be the subject on a neutral background suitable for layering.");
};

/**
 * Generate a digital illustration
 */
export const generateIllustration = async (prompt: string, style: string): Promise<AiResponse> => {
  return generateArtisticImage(prompt, style, "1:1");
};

/**
 * Change the perspective of an image
 */
export const changeImagePerspective = async (file: File, instruction: string): Promise<AiResponse> => {
  return editImage(file, instruction);
};

/**
 * Advanced character fusion/swap
 */
export const swapCharacters = async (person: File, character: File, prompt: string): Promise<AiResponse> => {
  return editImageWithReference(person, character, prompt);
};

/**
 * Generate a company logo
 */
export const generateLogo = async (company: string, industry: string, style: string, extra: string): Promise<AiResponse> => {
  const prompt = `Design a professional logo for a company named "${company}" in the "${industry}" industry. Style: ${style}. ${extra}`;
  return generateImage(prompt, "1:1");
};

/**
 * Generate a professional poster
 */
export const generatePoster = async (theme: string, style: string, ratio: string, image?: File): Promise<AiResponse> => {
  const prompt = `Create a professional poster. Theme: ${theme}. Style: ${style}. Aspect ratio: ${ratio}.`;
  if (image) {
    return editImage(image, prompt);
  }
  return generateImage(prompt, ratio);
};

/**
 * Remix an image based on cinematic instructions
 */
export const remixImage = async (file: File, instruction: string, preserveIdentity: boolean): Promise<AiResponse> => {
  const identityPrompt = preserveIdentity ? "Keep the person's identity and facial features exactly the same." : "";
  return editImage(file, `${instruction}. ${identityPrompt}`);
};