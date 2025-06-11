import { GoogleGenAI } from "@google/genai";


export class GoogleClient {
    //init the client
    private gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
    async generate(
      prompt: string,
      maxOutputTokens: number,
      temperature: number,
      model: string
    ) {
        try {
          const res = await this.gemini.models.generateContent({
          model: model ,
          contents: prompt,
          // config: {
          //   // maxOutputTokens: maxOutputTokens,
          //   temperature: temperature,
          // },
        });
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
