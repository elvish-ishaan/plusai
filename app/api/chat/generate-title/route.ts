import { GoogleGenAI } from "@google/genai";
import { z } from "zod/v4";

//route for generating title of conversation 
export async function POST(req: Request) {
    const requestSchema = z.object({
        initPrompt: z.string(),
    })
    const { initPrompt } = requestSchema.parse(await req.json());
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
    const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Generate a title for this prompt, tile should be less than 100 characters. here is the prompt: ${initPrompt}`,
  });
  return new Response(response.text);
}