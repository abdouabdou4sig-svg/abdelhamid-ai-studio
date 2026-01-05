
import { GoogleGenAI, Type } from "@google/genai";
import { AiResponse, GeneratedImage } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

// Utility to convert File to base64 inline data
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

// Utility for sleep
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Utility for retrying API calls
export const callWithRetry = async <T>(task: () => Promise<T>, retries = 3): Promise<T> => {
  try {
    return await task();
  } catch (error: any) {
    if (retries > 0 && (error.message?.includes('429') || error.message?.includes('500') || error.message?.includes('quota'))) {
      await sleep(2000 * (4 - retries));
      return callWithRetry(task, retries - 1);
    }
    throw error;
  }
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
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    
    const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imagePart?.inlineData) {
      return { 
        images: [{ 
          url: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
          mimeType: imagePart.inlineData.mimeType,
          prompt
        }] 
      };
    }
    return { error: "Aucune image générée." };
  } catch (e: any) {
    return { error: e.message };
  }
};

export const generateVideoVeo = async (prompt: string, image?: File): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const config: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
    };

    if (image) {
      const part = await fileToGenerativePart(image);
      config.image = { imageBytes: part.inlineData.data, mimeType: part.inlineData.mimeType };
    }

    let operation = await ai.models.generateVideos(config);
    while (!operation.done) {
      await new Promise(r => setTimeout(r, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    return { videos: [{ url: `${downloadLink}&key=${process.env.API_KEY}`, metadata: operation.response?.generatedVideos?.[0]?.video }] };
  } catch (e: any) {
    return { error: e.message };
  }
};

// Fixed: Added missing imageToText
export const imageToText = async (file: File, prompt: string): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const imagePart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, { text: prompt }] }
    });
    return { text: response.text };
  } catch (e: any) {
    return { error: e.message };
  }
};

// Fixed: Added missing editImage
export const editImage = async (file: File, prompt: string): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const imagePart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, { text: prompt }] }
    });
    const resultPart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (resultPart?.inlineData) {
      return {
        images: [{
          url: `data:${resultPart.inlineData.mimeType};base64,${resultPart.inlineData.data}`,
          mimeType: resultPart.inlineData.mimeType,
          prompt
        }]
      };
    }
    return { text: response.text, error: response.text ? undefined : "Aucune image générée" };
  } catch (e: any) {
    return { error: e.message };
  }
};

// Fixed: Added missing editImageWithReference
export const editImageWithReference = async (file: File, refFile: File, prompt: string): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const imagePart = await fileToGenerativePart(file);
    const refPart = await fileToGenerativePart(refFile);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, refPart, { text: prompt }] }
    });
    const resultPart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (resultPart?.inlineData) {
      return {
        images: [{
          url: `data:${resultPart.inlineData.mimeType};base64,${resultPart.inlineData.data}`,
          mimeType: resultPart.inlineData.mimeType,
          prompt
        }]
      };
    }
    return { error: "Aucune image générée" };
  } catch (e: any) {
    return { error: e.message };
  }
};

// Fixed: Added missing swapFaces
export const swapFaces = async (faceFile: File, targetFile: File, prompt?: string, identityStrength?: number): Promise<AiResponse> => {
  const instruction = `Perform a high-fidelity face swap. Replace the face in the target image with the identity from the face image. Strength: ${identityStrength ?? 90}%. ${prompt ?? ''}`;
  return editImageWithReference(targetFile, faceFile, instruction);
};

// Fixed: Added missing restorePhoto
export const restorePhoto = async (file: File, withColor: boolean): Promise<AiResponse> => {
  const prompt = `Restore this old photo. Remove scratches, noise, and enhance clarity. ${withColor ? 'Colorize the photo realistically.' : 'Keep it in high-quality black and white.'}`;
  return editImage(file, prompt);
};

// Fixed: Added missing removeObject
export const removeObject = async (file: File, objectName: string): Promise<AiResponse> => {
  const prompt = `Remove the following object from the image: ${objectName}. Fill the background naturally.`;
  return editImage(file, prompt);
};

// Fixed: Added missing documentToText
export const documentToText = async (file: File): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const docPart = await fileToGenerativePart(file);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [docPart, { text: "Extract all text from this document accurately. Maintain the structure." }] }
    });
    return { text: response.text };
  } catch (e: any) {
    return { error: e.message };
  }
};

// Fixed: Added missing replaceBackground
export const replaceBackground = async (file: File, prompt: string): Promise<AiResponse> => {
  const finalPrompt = `Keep the main subject exactly as is, but replace the background with: ${prompt}. Cinematic lighting.`;
  return editImage(file, finalPrompt);
};

// Fixed: Added missing generateArtisticImage
export const generateArtisticImage = async (prompt: string, style: string, ratio: string): Promise<AiResponse> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Create an artistic image in ${style} style. Description: ${prompt}` }] },
      config: { imageConfig: { aspectRatio: ratio as any || "1:1" } }
    });
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return {
        images: [{
          url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
          mimeType: part.inlineData.mimeType,
          prompt
        }]
      };
    }
    return { error: "Aucun rendu artistique généré" };
  } catch (e: any) {
    return { error: e.message };
  }
};

// Fixed: Added missing generateStencil
export const generateStencil = async (file: File): Promise<AiResponse> => {
  const prompt = "Convert this photo into a high-contrast black and white stencil art. Clean lines, no shading.";
  return editImage(file, prompt);
};

// Fixed: Added missing generateHeadshot
export const generateHeadshot = async (file: File, style: string): Promise<AiResponse> => {
  const prompt = `Convert this selfie into a professional corporate headshot. Style: ${style}. High-end office background, professional attire, perfect lighting.`;
  return editImage(file, prompt);
};

// Fixed: Added missing generateNftArt
export const generateNftArt = async (prompt: string, style: string): Promise<AiResponse> => {
  const finalPrompt = `Unique NFT collectible art. Style: ${style}. Topic: ${prompt}. High value aesthetic.`;
  return generateImage(finalPrompt);
};

// Fixed: Added missing generateTransparentOverlay
export const generateTransparentOverlay = async (file: File): Promise<AiResponse> => {
  const prompt = "Remove the background completely and return the subject on a solid white background (for easier processing). High precision edges.";
  // Note: Gemini 2.5 flash image returns an image. We treat it as an edit.
  return editImage(file, prompt);
};

// Fixed: Added missing generateIllustration
export const generateIllustration = async (prompt: string, style: string): Promise<AiResponse> => {
  const finalPrompt = `A high-quality graphic illustration in ${style} style. Subject: ${prompt}. Professional vector-like look.`;
  return generateImage(finalPrompt);
};

// Fixed: Added missing changeImagePerspective
export const changeImagePerspective = async (file: File, instruction: string): Promise<AiResponse> => {
  return editImage(file, instruction);
};

// Fixed: Added missing swapCharacters
export const swapCharacters = async (personFile: File, charFile: File, instructions: string): Promise<AiResponse> => {
  return editImageWithReference(personFile, charFile, instructions);
};

// Fixed: Added missing generateLogo
export const generateLogo = async (company: string, industry: string, style: string, extra: string): Promise<AiResponse> => {
  const prompt = `Professional logo design for a company named '${company}' in the ${industry} industry. Style: ${style}. Additional details: ${extra}. Minimalist, vector-ready, iconic.`;
  return generateImage(prompt);
};

// Fixed: Added missing reLightImage
export const reLightImage = async (file: File, lightType: string, intensity: number): Promise<AiResponse> => {
  const prompt = `Apply a new lighting environment: ${lightType}. Intensity: ${intensity}%. Recalculate shadows and highlights on the subject naturally.`;
  return editImage(file, prompt);
};

// Fixed: Added missing generatePoster
export const generatePoster = async (theme: string, style: string, ratio: string, image?: File): Promise<AiResponse> => {
  const prompt = `High-end professional poster design. Theme: ${theme}. Style: ${style}. Graphic design elements, cinematic typography if applicable.`;
  if (image) {
    return editImage(image, prompt);
  }
  return generateImage(prompt);
};

// Fixed: Added missing generateStoryboard
export const generateStoryboard = async (script: string, style: string, framesCount: number): Promise<AiResponse> => {
  try {
    const ai = getAI();
    // 1. Generate visual prompts for each frame using LLM
    const schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          prompt: { type: Type.STRING },
          technicalNote: { type: Type.STRING }
        },
        required: ["prompt", "technicalNote"]
      }
    };

    const promptResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${framesCount} distinct visual frame descriptions for a storyboard based on this script: "${script}". Style should be: ${style}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const frameConfigs = JSON.parse(promptResponse.text);
    const frames: { prompt: string, imageUrl: string, technicalNote: string }[] = [];

    // 2. Generate images for each frame
    for (const config of frameConfigs) {
      const imgRes = await generateArtisticImage(config.prompt, style, "16:9");
      if (imgRes.images && imgRes.images[0]) {
        frames.push({
          prompt: config.prompt,
          imageUrl: imgRes.images[0].url,
          technicalNote: config.technicalNote
        });
      }
      await sleep(1000); // Throttling
    }

    return { frames };
  } catch (e: any) {
    return { error: e.message };
  }
};

// Fixed: Added missing remixImage
export const remixImage = async (file: File, instruction: string, preserveIdentity: boolean): Promise<AiResponse> => {
  const identityPrompt = preserveIdentity ? "Keep the subject's face and identity exactly the same." : "";
  const finalPrompt = `Remix this image with the following change: ${instruction}. ${identityPrompt}`;
  return editImage(file, finalPrompt);
};
