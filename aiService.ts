
import { GoogleGenAI, Type } from "@google/genai";
import { AiResponse, GeneratedImage, StoryboardFrame } from "../types";

// Helper to wait
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for retries with exponential backoff
export const callWithRetry = async <T>(task: () => Promise<T>, retries = 3, delay = 2000): Promise<T> => {
  try {
    return await task();
  } catch (error) {
    if (retries > 0) {
      await sleep(delay);
      return callWithRetry(task, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Initialize AI right before each call to ensure the latest API key is used
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

const extractImageFromResponse = (response: any): GeneratedImage[] | undefined => {
  const part = response.candidates?.[0]?.content?.parts.find((p: any) => p.inlineData);
  if (part?.inlineData) {
    return [{
      url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
      mimeType: part.inlineData.mimeType
    }];
  }
  return undefined;
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

export const generateImage = async (prompt: string, ratio: string = "1:1"): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: ratio as any } }
    });
    const images = extractImageFromResponse(response);
    if (images) return { images };
    return { error: "L'IA n'a pas pu générer d'image." };
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
    const images = extractImageFromResponse(response);
    if (images) return { images };
    return { error: "L'édition a échoué." };
  } catch (e: any) {
    return { error: e.message };
  }
};

export const editImageWithReference = async (source: File, reference: File, instruction: string): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const sourcePart = await fileToGenerativePart(source);
    const referencePart = await fileToGenerativePart(reference);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [sourcePart, referencePart, { text: instruction }] }
    });
    const images = extractImageFromResponse(response);
    if (images) return { images };
    return { error: "L'édition avec référence a échoué." };
  } catch (e: any) {
    return { error: e.message };
  }
};

export const swapFaces = async (face: File, target: File, prompt?: string, strength?: number): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const facePart = await fileToGenerativePart(face);
    const targetPart = await fileToGenerativePart(target);
    const instruction = `Face swap task: replace the face in the target image with the face from the source image. ${prompt || ""}. Identity fidelity: ${strength ?? 90}%.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [facePart, targetPart, { text: instruction }] }
    });
    const images = extractImageFromResponse(response);
    if (images) return { images };
    return { error: "Le Face Swap a échoué." };
  } catch (e: any) {
    return { error: e.message };
  }
};

export const swapCharacters = async (person: File, character: File, instruction: string): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const personPart = await fileToGenerativePart(person);
    const characterPart = await fileToGenerativePart(character);
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [personPart, characterPart, { text: instruction }] }
    });
    const images = extractImageFromResponse(response);
    if (images) return { images };
    return { error: "La fusion de personnages a échoué." };
  } catch (e: any) {
    return { error: e.message };
  }
};

export const restorePhoto = async (file: File, withColor: boolean): Promise<AiResponse> => {
  const prompt = `Restore this old photo. Remove scratches, noise and improve clarity. ${withColor ? "Colorize it realistically." : "Keep it black and white."}`;
  return await editImage(file, prompt);
};

export const removeObject = async (file: File, objectName: string): Promise<AiResponse> => {
  const prompt = `Remove the ${objectName} from this image. Fill the area realistically using inpainting techniques.`;
  return await editImage(file, prompt);
};

export const documentToText = async (file: File): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const part = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [part, { text: "Extract all text from this document accurately, maintaining structure where possible." }] }
    });
    return { text: response.text };
  } catch (e: any) {
    return { error: e.message };
  }
};

export const replaceBackground = async (file: File, prompt: string): Promise<AiResponse> => {
  const fullPrompt = `Keep the main subject from this image exactly as it is, but replace the background with: ${prompt}. Cinematic studio quality.`;
  return await editImage(file, fullPrompt);
};

export const generateArtisticImage = async (prompt: string, style: string, ratio: string): Promise<AiResponse> => {
  const fullPrompt = `Artistic masterpiece. Style: ${style}. Prompt: ${prompt}. High resolution 8k.`;
  return await generateImage(fullPrompt, ratio);
};

export const generateStencil = async (file: File): Promise<AiResponse> => {
  const prompt = "Convert this image into a clean, high-contrast black and white stencil. Sharp outlines, perfect for street art or tattoos.";
  return await editImage(file, prompt);
};

export const generateHeadshot = async (file: File, style: string): Promise<AiResponse> => {
  const prompt = `Transform this selfie into a professional business headshot. Style: ${style}. High-end photography, professional attire, studio lighting.`;
  return await editImage(file, prompt);
};

export const generateNftArt = async (prompt: string, style: string): Promise<AiResponse> => {
  const fullPrompt = `NFT collectible artwork. Style: ${style}. Concept: ${prompt}. Vivid colors, unique traits.`;
  return await generateImage(fullPrompt, "1:1");
};

export const generateTransparentOverlay = async (file: File): Promise<AiResponse> => {
  const prompt = "Isolate the main subject by removing the background completely. Return the subject on a solid high-contrast background for easy layering.";
  return await editImage(file, prompt);
};

export const generateIllustration = async (prompt: string, style: string): Promise<AiResponse> => {
  const fullPrompt = `Graphic illustration. Style: ${style}. Subject: ${prompt}. Vector-like precision.`;
  return await generateImage(fullPrompt, "1:1");
};

export const changeImagePerspective = async (file: File, instruction: string): Promise<AiResponse> => {
  return await editImage(file, instruction);
};

export const generateVideoVeo = async (prompt: string): Promise<AiResponse> => {
  try {
    const ai = getAI();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: { numberOfVideos: 1, resolution: '1080p', aspectRatio: '16:9' }
    });
    while (!operation.done) {
      await sleep(10000);
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    // Append API key for direct fetch as per guidelines
    return { videos: [{ url: `${downloadLink}&key=${process.env.API_KEY}` }] };
  } catch (e: any) {
    return { error: e.message };
  }
};

export const chatWithAi = async (message: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message
    });
    return response.text || "L'IA n'a pas pu formuler de réponse.";
  } catch (e: any) {
    return "Désolé, une erreur technique est survenue.";
  }
};

export const generateLogo = async (company: string, industry: string, style: string, extra: string): Promise<AiResponse> => {
  const prompt = `Logo design for a company named "${company}" in the ${industry} industry. Style: ${style}. Additional details: ${extra}`;
  return await generateImage(prompt, "1:1");
};

export const reLightImage = async (file: File, type: string, intensity: number): Promise<AiResponse> => {
  const prompt = `Relight this image with ${type} lighting effects. Intensity: ${intensity}%. Preserve subject identity exactly. Professional lighting adjustment.`;
  return await editImage(file, prompt);
};

export const generatePoster = async (theme: string, style: string, ratio: string, file?: File): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const prompt = `Professional movie/event poster design. Theme: ${theme}. Style: ${style}. Aspect ratio: ${ratio}.`;
    
    if (file) {
      const part = await fileToGenerativePart(file);
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [part, { text: prompt }] },
        config: { imageConfig: { aspectRatio: ratio as any } }
      });
      return { images: extractImageFromResponse(response) };
    } else {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: prompt,
        config: { imageConfig: { aspectRatio: ratio as any } }
      });
      return { images: extractImageFromResponse(response) };
    }
  } catch (e: any) {
    return { error: e.message };
  }
};

export const generateStoryboard = async (script: string, style: string, count: number): Promise<AiResponse> => {
  try {
    const ai = getAI();
    // 1. Generate frame descriptions first
    const textResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a storyboard plan for the following script in exactly ${count} frames. Style: ${style}. Script: ${script}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              prompt: { type: Type.STRING, description: 'Image generation prompt for this frame' },
              technicalNote: { type: Type.STRING, description: 'Camera angle or lighting note' }
            },
            required: ['prompt', 'technicalNote']
          }
        }
      }
    });

    const storyboardData = JSON.parse(textResponse.text || "[]");
    
    // 2. Generate images for each frame in parallel
    const imagePromises = storyboardData.map(async (item: any) => {
      const imgRes = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: `Create a storyboard frame for: ${item.prompt}. Style: ${style}.`
      });
      const img = extractImageFromResponse(imgRes);
      return {
        prompt: item.prompt,
        technicalNote: item.technicalNote,
        imageUrl: img?.[0]?.url || ""
      };
    });

    const results = await Promise.all(imagePromises);
    return { frames: results };
  } catch (e: any) {
    return { error: e.message };
  }
};

export const remixImage = async (file: File, instruction: string, preserveIdentity: boolean): Promise<AiResponse> => {
  const ai = getAI();
  const part = await fileToGenerativePart(file);
  const identityPrompt = preserveIdentity ? "Preserve the main subject identity and facial features with 100% fidelity." : "";
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [part, { text: `${instruction}. ${identityPrompt}` }] }
  });
  return { images: extractImageFromResponse(response) };
};
