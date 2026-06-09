import { OpenRouter } from "@openrouter/sdk";
import type { ChatMessages } from "@openrouter/sdk/models";
import { systemPrompt } from "@/libs/systemPrompt";

const openrouter = new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

interface UserParams {
    finalPrompt: string;
    maxOutputTokens?: number;
    temperature?: number;
    model: string;
    isWebSearchEnabled: boolean;
    attachmentUrl?: string | null;
}

function buildMessages(finalPrompt: string, attachmentUrl?: string | null): ChatMessages[] {
    const userContent = attachmentUrl
        ? [
              { type: "text" as const, text: finalPrompt },
              { type: "image_url" as const, imageUrl: { url: attachmentUrl } },
          ]
        : finalPrompt;

    return [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent as string },
    ];
}

// Streaming: yields text chunks as they arrive
export async function* generateStreamingResponse(userParams: UserParams): AsyncGenerator<string> {
    const { finalPrompt, maxOutputTokens, temperature, model, isWebSearchEnabled, attachmentUrl } = userParams;

    const stream = await openrouter.chat.send({
        chatRequest: {
            model,
            messages: buildMessages(finalPrompt, attachmentUrl),
            maxTokens: maxOutputTokens ?? undefined,
            temperature: temperature ?? undefined,
            stream: true,
            ...(isWebSearchEnabled && { plugins: [{ id: "web" as const }] }),
        },
    });

    for await (const chunk of stream) {
        if (chunk.error) throw new Error(chunk.error.message);
        const content = chunk.choices?.[0]?.delta?.content;
        if (content) yield content;
    }
}

// Non-streaming: used by title generation
export const generateResponse = async (userParams: UserParams) => {
    const { finalPrompt, maxOutputTokens, temperature, model, isWebSearchEnabled, attachmentUrl } = userParams;
    try {
        const response = await openrouter.chat.send({
            chatRequest: {
                model,
                messages: buildMessages(finalPrompt, attachmentUrl),
                maxTokens: maxOutputTokens ?? undefined,
                temperature: temperature ?? undefined,
                ...(isWebSearchEnabled && { plugins: [{ id: "web" as const }] }),
            },
        });
        const content = response.choices[0].message.content;
        return { text: typeof content === "string" ? content : "" };
    } catch (error) {
        console.log(error, "error while generating response from llm.");
    }
};
