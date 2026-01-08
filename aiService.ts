import { GoogleGenAI, Type } from "@google/genai";
import { AiResponse } from "../types";

/**
 * ABDELHAMID AI CORE SERVICE
 * Accès centralisé aux modèles Gemini et Veo
 */

const getApiKey = () => {
  try {
    return process.env.API_KEY || "";
  } catch (e) {
    return "";
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for retrying API calls with exponential backoff
export const callWithRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await sleep(delay);
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
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
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message
  });
  return response.text;
};

export const generateImage = async (prompt: string, ratio: string = "1:1"): Promise<AiResponse> => {
  try {
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
    return { error: "Aucune image générée." };
  } catch (e: any) {
    return { error: e.message };
  }
};

// Updated swapFaces to accept identity strength parameter
export const swapFaces = async (face: File, target: File, prompt?: string, strength: number = 90): Promise<AiResponse> => {
  try {
    const p1 = await fileToGenerativePart(face);
    const p2 = await fileToGenerativePart(target);
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { 
        parts: [
          p1, 
          p2, 
          { text: `Swap the face from the first image onto the person in the second image. Identity strength: ${strength}%. ${prompt || ""}` }
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
    return { error: "L'IA n'a pas pu traiter cette image." };
  } catch (e: any) {
    return { error: e.message };
  }
};

// New function for editing with a reference image
export const editImageWithReference = async (source: File, reference: File, prompt: string): Promise<AiResponse> => {
  try {
    const p1 = await fileToGenerativePart(source);
    const p2 = await fileToGenerativePart(reference);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { 
        parts: [
          p1, 
          { text: "Source image to edit:" },
          p2, 
          { text: "Reference style/content image:" },
          { text: prompt }
        ] 
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
    return { error: "L'édition avec référence a échoué." };
  } catch (e: any) {
    return { error: e.message };
  }
};

// Function for OCR and text extraction
export const documentToText = async (file: File): Promise<AiResponse> => {
  try {
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

// Function for artistic image generation
export const generateArtisticImage = async (prompt: string, style: string, ratio: string): Promise<AiResponse> => {
  return generateImage(`${prompt}. Style: ${style}`, ratio);
};

// Function for stencil creation
export const generateStencil = async (file: File): Promise<AiResponse> => {
  return editImage(file, "Convert this image into a high-contrast black and white stencil. Clean lines, no grays, perfect for tattoo or spray paint.");
};

// Function for professional headshots
export const generateHeadshot = async (file: File, style: string): Promise<AiResponse> => {
  return editImage(file, `Transform this selfie into a professional headshot. Style: ${style}. Maintain facial identity perfectly but improve clothing, lighting and background.`);
};

// Function for NFT art generation
export const generateNftArt = async (prompt: string, style: string): Promise<AiResponse> => {
  return generateImage(`${prompt}. Artistic NFT style: ${style}`, "1:1");
};

// Function for transparent overlay (background removal)
export const generateTransparentOverlay = async (file: File): Promise<AiResponse> => {
  return editImage(file, "Remove the background completely and return only the main subject. Professional extraction for overlay use.");
};

// Function for graphic illustrations
export const generateIllustration = async (prompt: string, style: string): Promise<AiResponse> => {
  return generateImage(`${prompt}. Graphic illustration style: ${style}`, "1:1");
};

// Function for perspective changing
export const changeImagePerspective = async (file: File, prompt: string): Promise<AiResponse> => {
  return editImage(file, prompt);
};

// Function for character identity fusion
export const swapCharacters = async (person: File, character: File, prompt: string): Promise<AiResponse> => {
  try {
    const p1 = await fileToGenerativePart(person);
    const p2 = await fileToGenerativePart(character);
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { 
        parts: [
          p1, 
          { text: "Human identity source." },
          p2, 
          { text: "Character and style source." },
          { text: prompt }
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
    return { error: "La fusion de personnages a échoué." };
  } catch (e: any) {
    return { error: e.message };
  }
};

// Function for logo generation
export const generateLogo = async (company: string, industry: string, style: string, extra: string): Promise<AiResponse> => {
  const prompt = `Create a professional logo for a company named '${company}' in the '${industry}' industry. Style: ${style}. ${extra}`;
  return generateImage(prompt, "1:1");
};

// Function for relighting images
export const reLightImage = async (file: File, lightType: string, intensity: number): Promise<AiResponse> => {
  return editImage(file, `Relight this image using '${lightType}' lighting. Intensity: ${intensity}%. Adjust shadows and highlights realistically.`);
};

// Function for poster design
export const generatePoster = async (theme: string, style: string, ratio: string, image?: File): Promise<AiResponse> => {
  const prompt = `Create a professional poster with theme: '${theme}'. Artistic style: ${style}. Aspect ratio: ${ratio}.`;
  if (image) {
    return editImage(image, prompt);
  }
  return generateImage(prompt, ratio);
};

// Function for storyboard generation with structured data
export const generateStoryboard = async (script: string, style: string, framesCount: number): Promise<AiResponse> => {
  try {
    const descResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate ${framesCount} detailed visual descriptions for a storyboard based on this script: '${script}'. Style: ${style}. Output JSON array of objects with 'prompt' and 'technicalNote' fields.`,
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

    const descriptions = JSON.parse(descResponse.text || "[]");
    const frames = [];

    for (const desc of descriptions) {
      const imgRes = await generateImage(`${desc.prompt}. Style: ${style}`, "16:9");
      if (imgRes.images && imgRes.images[0]) {
        frames.push({
          prompt: desc.prompt,
          imageUrl: imgRes.images[0].url,
          technicalNote: desc.technicalNote
        });
      }
    }

    return { frames };
  } catch (e: any) {
    return { error: e.message };
  }
};

// Function for image remixing
export const remixImage = async (file: File, prompt: string, preserveIdentity: boolean): Promise<AiResponse> => {
  const finalPrompt = preserveIdentity ? `${prompt}. Maintain the person's identity perfectly.` : prompt;
  return editImage(file, finalPrompt);
};

export const restorePhoto = (file: File, colorize: boolean) => 
  editImage(file, `Professional photo restoration. Remove scratches, noise and damage. ${colorize ? 'Apply colors.' : ''}`);

export const removeObject = (file: File, objectDescription: string) => 
  editImage(file, `Remove the object: ${objectDescription} and fill the background.`);

export const replaceBackground = (file: File, backgroundPrompt: string) => 
  editImage(file, `Replace background with: ${backgroundPrompt}`);

export const imageToText = async (file: File, prompt: string): Promise<AiResponse> => {
  const part = await fileToGenerativePart(file);
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [part, { text: prompt }] }
  });
  return { text: response.text };
};

export const generateVideoVeo = async (prompt: string): Promise<AiResponse> => {
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    });
    while (!operation.done) {
      await sleep(10000);
      operation = await ai.operations.getVideosOperation({ operation });
    }
    const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
    return { videos: [{ url: `${uri}&key=${getApiKey()}` }] };
  } catch (e: any) {
    return { error: e.message };
  }
};