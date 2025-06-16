import { GoogleGenAI } from "@google/genai";


export class GoogleClient {
    //init the client
    private gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
    async generate(
      prompt: string,
      maxOutputTokens: number,
      temperature: number,
      model: string,
      isWebSearchEnabled: boolean,
    ) {
      // Conditionally define the tools array
      const toolsToUse = isWebSearchEnabled ? [{ googleSearch: {} }] : [];
      //construct the options for the gemini api
      const options = {
        model: model,
        contents: prompt,
        config: {
          tools: toolsToUse,
        },
      };
      
        try {
          console.log(options, 'options in gemini client');
          const res = await this.gemini.models.generateContent(options);
        return {
        text: res.text as string,
        usage: {
          prompt: res.usageMetadata?.promptTokenCount as number,
        },
    };
        } catch (error) {
          console.log(error,'error in calling gemini api')
          throw new Error(error as string);
        }
    }
}
