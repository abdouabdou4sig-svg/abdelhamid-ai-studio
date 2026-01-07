
import { GoogleGenAI, Type } from "@google/genai";
import { AiResponse } from "../types";

// Initialisation sécurisée de l'IA
const getAI = () => {
  // Vite injecte les variables via define ou import.meta.env
  const apiKey = (process.env.API_KEY) || "";
  if (!apiKey) {
    console.warn("API_KEY manquante. L'application risque de ne pas fonctionner.");
  }
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
    if (retries > 0 && (error.message?.includes('429') || error.message?.includes('limit'))) {
      await sleep(2000);
      return callWithRetry(task, retries - 1);
    }
    throw error;
  }
};

// --- SERVICES CORE ---

export const chatWithAi = async (message: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message
  });
  return response.text;
};

export const generateImage = async (prompt: string): Promise<AiResponse> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] }
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
    return { error: "Aucune image générée par le modèle." };
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
    return { error: e.message || "Erreur d'édition d'image." };
  }
};

export const editImageWithReference = async (source: File, ref: File, prompt: string): Promise<AiResponse> => {
  const ai = getAI();
  try {
    const p1 = await fileToGenerativePart(source);
    const p2 = await fileToGenerativePart(ref);
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [p1, p2, { text: prompt }] }
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
    return { error: "Échec du rendu avec référence." };
  } catch (e: any) {
    return { error: e.message || "Erreur de traitement pro." };
  }
};

export const generateVideoVeo = async (prompt: string, image?: File): Promise<AiResponse> => {
  const ai = getAI();
  try {
    const config: any = { 
      model: 'veo-3.1-fast-generate-preview', 
      prompt, 
      config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' } 
    };
    if (image) {
      const p = await fileToGenerativePart(image);
      config.image = { imageBytes: p.inlineData.data, mimeType: p.inlineData.mimeType };
    }
    let op = await ai.models.generateVideos(config);
    while (!op.done) { 
      await sleep(10000); 
      op = await ai.operations.getVideosOperation({ operation: op }); 
    }
    const uri = op.response?.generatedVideos?.[0]?.video?.uri;
    const apiKey = process.env.API_KEY || "";
    return { videos: [{ url: `${uri}&key=${apiKey}` }] };
  } catch (e: any) {
    return { error: e.message || "Erreur VEO." };
  }
};

// --- WRAPPERS OUTILS ---

export const swapFaces = (f: File, t: File, p?: string, s = 90) => 
  editImageWithReference(t, f, `Surgically swap the face from the first image onto the person in the second image. Maintain ${s}% identity. ${p || ""}`);

export const restorePhoto = (f: File, c: boolean) => 
  editImage(f, `Full professional restoration of this old photo. Remove scratches, stains and noise. ${c ? 'Colorize naturally.' : 'Keep B&W.'}`);

export const removeObject = (f: File, o: string) => 
  editImage(f, `Remove the object "${o}" from this image and fill the gap realistically using generative inpainting.`);

export const replaceBackground = (f: File, p: string) => 
  editImage(f, `Extract the subject and place them into a high-quality new background: ${p}. Maintain lighting consistency.`);

export const generateArtisticImage = (p: string, s: string, r: string) => 
  generateImage(`Digital art, ${s} style: ${p}. Aspect ratio ${r}. Ultra detailed.`);

export const generateStencil = (f: File) => 
  editImage(f, "Convert this image into a clean, high-contrast black and white stencil art with bold lines.");

export const generateHeadshot = (f: File, s: string) => 
  editImage(f, `Professional corporate headshot for LinkedIn. Subject wearing ${s}, clean studio background, perfect lighting.`);

export const generateNftArt = (p: string, s: string) => 
  generateImage(`Exclusive NFT collectible, ${s} aesthetic: ${p}. Unique character design.`);

export const generateIllustration = (p: string, s: string) => 
  generateImage(`Professional ${s} illustration of ${p}. Vibrant colors, commercial quality.`);

export const changeImagePerspective = (f: File, p: string) => 
  editImage(f, `Change the camera perspective of this image to ${p}. Maintain subject identity perfectly.`);

export const swapCharacters = (p: File, c: File, i: string) => 
  editImageWithReference(p, c, i);

export const generateLogo = (c: string, i: string, s: string, e: string) => 
  generateImage(`Professional logo design for "${c}" in the ${i} industry. Style: ${s}. ${e}. Vector-like, minimalist, high quality.`);

export const reLightImage = (f: File, l: string, i: number) => 
  editImage(f, `Apply new professional lighting: ${l}. Intensity ${i}%. Recalculate shadows and highlights realistically.`);

export const generatePoster = (t: string, s: string, r: string, f?: File) => 
  f ? editImage(f, `Movie poster design: ${t}, style ${s}. High impact typography.`) 
    : generateImage(`Movie poster design: ${t}, style ${s}. Aspect ratio ${r}.`);

export const remixImage = (f: File, i: string, id: boolean) => 
  editImage(f, `Remix this image: ${i}. ${id ? 'Keep the person facial features exactly the same.' : ''}`);

export const generateTransparentOverlay = (f: File) => 
  editImage(f, "Extract subject and place on a pure white background for transparency masking.");

export const documentToText = async (file: File): Promise<AiResponse> => {
  const ai = getAI();
  const part = await fileToGenerativePart(file);
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [part, { text: "Perform OCR and extract all text from this document. Format as readable text." }] }
  });
  return { text: response.text };
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

export const generateStoryboard = async (script: string, style: string, count: number): Promise<AiResponse> => {
  const ai = getAI();
  const res = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on this script: "${script}", create a ${count}-frame storyboard plan. For each frame, provide a descriptive visual prompt and a short technical camera note. Return strictly as JSON array of {prompt, technicalNote}.`,
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
    await sleep(1000); // Respect rate limits
  }
  return { frames };
};
