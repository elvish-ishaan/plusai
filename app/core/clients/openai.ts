import OpenAI from 'openai';

export class OpenAIClient {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });
  async generate(prompt: string, maxOutputTokens: number, temperature: number, model: string,
     systemPrompt: string, isWebSearchEnabled: boolean){

    const customTools=[] 
    if(isWebSearchEnabled){
      customTools.push(
        {"type": "web_search_preview"}
      )
    }
    const res = await this.openai.responses.create({
        model: model,
        input: prompt,
        instructions: systemPrompt,
        //@ts-expect-error fix it
        tools: customTools,
        temperature: temperature,
        max_output_tokens: maxOutputTokens,
    });
    return {
      text: res.text as string,
      usage: {
        prompt: res.metadata,
      },
    };
  }
}