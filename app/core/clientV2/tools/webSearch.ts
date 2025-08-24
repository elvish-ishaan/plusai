// tools/webSearch.ts
import { tool } from "ai";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function searchWeb(query: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: query }] }],
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return response.text as string;
}

export const WebSearchTool = tool({
  description: "Search the web for real-time information",
  inputSchema: z.object({
        query: z.string().describe('Web search query'),
    }),
  execute: async ({query}) => {
    const result = await searchWeb(query);
    return { result };
  },
});
