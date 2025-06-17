import { GoogleGenAI, Tool } from "@google/genai";


export class GoogleClient {
    //init the client
    private gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
    async generate(
      prompt: string,
      maxOutputTokens: number,
      temperature: number,
      model: string,
      isWebSearchEnabled: boolean,
      attachmentUrl: string | null = null
    ) {
      // Conditionally define the tools array
      const toolsToUse: Tool[] = isWebSearchEnabled ? [{ googleSearch: {} }] : [];
      const CustomContents = []
      if (attachmentUrl) {
         const response = await fetch(attachmentUrl || '');
          // Get the array buffer of the PDF data
           const pdfArrayBuffer = await response.arrayBuffer();
          // Convert ArrayBuffer to Buffer
          const pdfBuffer = Buffer.from(pdfArrayBuffer);
      // If attachmentUrl is provided, include it in the prompt
        CustomContents.push(
          { text: prompt },
          {
              inlineData: {
                  mimeType: 'application/pdf',
                  data: pdfBuffer.toString("base64")
              }
          }
        )
      }
      //construct the options for the gemini api
      const options = {
        model: model,
        contents: CustomContents.length > 0 ? CustomContents : prompt,
        config: {
          tools: toolsToUse,
        },
      };
      
        try {
          const res = await this.gemini.models.generateContent(options);
          console.log(res.text,'getting res')
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
