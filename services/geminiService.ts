import { GoogleGenAI } from "@google/genai";

// Ensure API key is available
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-types' });

/**
 * edits a headshot using Gemini 2.5 Flash Image.
 * 
 * @param base64Image The source image in base64 format (no data URI prefix needed for the API, but we strip it if present).
 * @param promptInstructions The text instructions for the edit.
 * @returns The base64 string of the generated image.
 */
export const generateProfessionalHeadshot = async (
  base64Image: string,
  promptInstructions: string
): Promise<string> => {
  try {
    // 1. Prepare the image data. 
    // The API expects raw base64, so strip the data url prefix if present.
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
    
    // 2. Determine MIME type (guess based on prefix or default to png if raw).
    // Simple heuristic: check the start of the string or pass 'image/png' as safe default for uploads.
    // For this app, we'll assume the helper strips the header, but we pass 'image/jpeg' or 'image/png'.
    // Better to parse it from the original string if possible, but 'image/png' usually works for the API inputs.
    const mimeType = 'image/png'; 

    // 3. Call the API
    // Using 'gemini-2.5-flash-image' for editing capabilities.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Edit this image to create a high-quality professional headshot. 
            Preserve the person's facial identity and main features strictly.
            ${promptInstructions}
            Output a photorealistic, high-resolution image.`
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          }
        ]
      },
      // Note: responseMimeType is not supported for Nano Banana models (flash-image)
    });

    // 4. Parse the response
    // The model might return text (if it refuses) or an image.
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          // Success: Found the image
          return part.inlineData.data;
        }
      }
      
      // If no image found, check for text (error/refusal)
      const textPart = parts.find(p => p.text);
      if (textPart) {
        throw new Error(`模型返回了文本而非图像: ${textPart.text}`);
      }
    }

    throw new Error("未生成图像。");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "生成头像失败。");
  }
};