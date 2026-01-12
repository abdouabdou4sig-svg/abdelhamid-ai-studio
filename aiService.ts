
import { GoogleGenAI, Type } from "@google/genai";
import { AiResponse } from "../types";

/**
 * Utility function to wait for a specified duration.
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Utility function to retry an asynchronous task with exponential backoff.
 */
export async function callWithRetry<T>(task: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await task();
  } catch (error) {
    if (retries <= 0) throw error;
    await sleep(delay);
    return callWithRetry(task, retries - 1, delay * 2);
  }
}

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

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

/**
 * Core function for image editing and generation using Gemini 2.5 Flash Image.
 */
const performImageTask = async (parts: any[], instruction: string): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [...parts, { text: instruction }] }
    });
    
    const imageParts = response.candidates?.[0]?.content?.parts.filter(p => p.inlineData);
    if (imageParts && imageParts.length > 0) {
      return { 
        images: imageParts.map(p => ({
          url: `data:${p.inlineData!.mimeType};base64,${p.inlineData!.data}`,
          mimeType: p.inlineData!.mimeType
        }))
      };
    }
    return { error: "Aucune image générée par l'IA." };
  } catch (e: any) {
    return { error: e.message || "Erreur lors du traitement de l'image." };
  }
};

export const imageToText = async (file: File, instruction: string): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const part = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [part, { text: instruction }] }
    });
    return { text: response.text };
  } catch (e: any) {
    return { error: e.message || "Erreur d'analyse." };
  }
};

/**
 * Updated swapFaces to accept prompt and strength.
 */
export const swapFaces = async (face: File, target: File, prompt?: string, strength?: number): Promise<AiResponse> => {
  const p1 = await fileToGenerativePart(face);
  const p2 = await fileToGenerativePart(target);
  const instruction = prompt || `Merge the face of the first image onto the person in the second image. Realistic result. Identity strength: ${strength || 90}%`;
  return performImageTask([p1, p2], instruction);
};

export const chatWithAi = async (message: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message
  });
  return response.text;
};

export const generateImage = async (prompt: string): Promise<AiResponse> => {
  return performImageTask([], prompt);
};

export const editImage = async (file: File, instruction: string): Promise<AiResponse> => {
  const part = await fileToGenerativePart(file);
  return performImageTask([part], instruction);
};

export const editImageWithReference = async (file: File, reference: File, instruction: string): Promise<AiResponse> => {
  const p1 = await fileToGenerativePart(file);
  const p2 = await fileToGenerativePart(reference);
  return performImageTask([p1, p2], instruction);
};

export const restorePhoto = async (file: File, withColor: boolean): Promise<AiResponse> => {
  const instruction = withColor 
    ? "Restore this old photo, fix scratches, sharpen details, and add realistic colors."
    : "Restore this old photo, fix scratches, sharpen details, maintain original black and white style.";
  return editImage(file, instruction);
};

export const removeObject = async (file: File, objectName: string): Promise<AiResponse> => {
  return editImage(file, `Perfectly remove the following object: ${objectName}. Fill the background naturally.`);
};

export const documentToText = async (file: File): Promise<AiResponse> => {
  return imageToText(file, "Extract all text from this document accurately. Maintain layout if possible.");
};

export const replaceBackground = async (file: File, prompt: string): Promise<AiResponse> => {
  return editImage(file, `Keep the subject but replace the entire background with: ${prompt}`);
};

export const generateArtisticImage = async (prompt: string, style: string, ratio: string): Promise<AiResponse> => {
  return performImageTask([], `Style: ${style}. Aspect Ratio: ${ratio}. Prompt: ${prompt}`);
};

export const generateStencil = async (file: File): Promise<AiResponse> => {
  return editImage(file, "Convert this photo into a high-contrast black and white stencil or line art drawing.");
};

export const generateHeadshot = async (file: File, style: string): Promise<AiResponse> => {
  return editImage(file, `Transform this person into a professional business headshot. Style: ${style}. Maintain identity.`);
};

export const generateNftArt = async (prompt: string, style: string): Promise<AiResponse> => {
  return performImageTask([], `NFT Art Style: ${style}. Concept: ${prompt}`);
};

export const generateTransparentOverlay = async (file: File): Promise<AiResponse> => {
  return editImage(file, "Remove the background completely and return the subject on a solid white background (for easier transparency handling in canvas).");
};

export const generateIllustration = async (prompt: string, style: string): Promise<AiResponse> => {
  return performImageTask([], `Illustration Style: ${style}. Subject: ${prompt}`);
};

export const changeImagePerspective = async (file: File, instruction: string): Promise<AiResponse> => {
  return editImage(file, instruction);
};

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

    while (!operation.done) {
      await sleep(10000);
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
      return { videos: [{ url: `${downloadLink}&key=${process.env.API_KEY}` }] };
    }
    return { error: "Échec de la génération vidéo." };
  } catch (e: any) {
    return { error: e.message || "Erreur Vidéo." };
  }
};

export const swapCharacters = async (person: File, character: File, instruction: string): Promise<AiResponse> => {
  return editImageWithReference(person, character, instruction);
};

export const generateLogo = async (company: string, industry: string, style: string, extra: string): Promise<AiResponse> => {
  const prompt = `Create a professional logo for a company named '${company}' in the '${industry}' industry. Style: ${style}. ${extra}`;
  return performImageTask([], prompt);
};

export const reLightImage = async (file: File, lightType: string, intensity: number): Promise<AiResponse> => {
  return editImage(file, `Change the lighting of this image to ${lightType} with an intensity of ${intensity}%.`);
};

export const remixImage = async (file: File, instruction: string, preserveIdentity: boolean): Promise<AiResponse> => {
  const identity = preserveIdentity ? "Keep the person's identity exactly the same." : "";
  return editImage(file, `${instruction}. ${identity}`);
};

export const generatePoster = async (theme: string, style: string, ratio: string, file?: File): Promise<AiResponse> => {
  const prompt = `Create a high-quality poster. Theme: ${theme}. Style: ${style}. Ratio: ${ratio}.`;
  if (file) {
    return editImage(file, prompt);
  }
  return generateImage(prompt);
};

export const generateStoryboard = async (script: string, style: string, count: number): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Create a storyboard for: ${script}. Style: ${style}. Generate descriptions for ${count} cinematic frames. Format: JSON array of strings.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const prompts: string[] = JSON.parse(response.text || "[]");
    const frames = await Promise.all(prompts.slice(0, count).map(async (p) => {
      const imgRes = await performImageTask([], `Storyboard frame: ${p}. Style: ${style}`);
      return {
        prompt: p,
        imageUrl: imgRes.images?.[0]?.url || "",
        technicalNote: "Plan cinématique généré par IA"
      };
    }));

    return { text: "Storyboard généré", frames } as any;
  } catch (e: any) {
    return { error: e.message };
  }
};
