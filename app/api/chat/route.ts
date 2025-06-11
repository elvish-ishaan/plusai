import { initClient } from "@/app/core";
import { z } from "zod/v4";

export async function POST(req: Request) {
    //adding zod validation
    const requestSchema = z.object({
        prompt: z.string(),
        maxOutputTokens: z.number(),
        temperature: z.number(),
        model: z.string(),
        systemPrompt: z.string(),
    });
    const { prompt, maxOutputTokens, temperature, model, systemPrompt } = requestSchema.parse(await req.json()); 
    //generate diff client on the basis of provider
    const client = initClient('gemini');
    if (!client) {
        return new Response("Invalid model", { status: 400 });
    }
    const res = await client.generate(prompt, maxOutputTokens, temperature, model, systemPrompt);
    return new Response(JSON.stringify(res));
}