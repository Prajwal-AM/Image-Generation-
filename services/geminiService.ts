
import { GoogleGenAI } from "@google/genai";
import { ModelType, AspectRatio, ImageSize } from "../types";

export const generateImage = async (
  prompt: string,
  model: ModelType,
  aspectRatio: AspectRatio,
  imageSize: ImageSize
): Promise<string> => {
  // Ensure we use the latest API key from the environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const config: any = {
    imageConfig: {
      aspectRatio,
    },
  };

  // Only Pro models support specific image sizes
  if (model === ModelType.PRO) {
    config.imageConfig.imageSize = imageSize;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: prompt }],
      },
      config,
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("No response from AI model");
    }

    const imagePart = response.candidates[0].content.parts.find(p => p.inlineData);
    
    if (!imagePart || !imagePart.inlineData) {
      // Sometimes it returns text explaining why it can't generate
      const textPart = response.candidates[0].content.parts.find(p => p.text);
      if (textPart) {
        throw new Error(`Model Response: ${textPart.text}`);
      }
      throw new Error("Failed to extract image data from response");
    }

    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_RESET_REQUIRED");
    }
    throw error;
  }
};
