import { systemPrompt } from "@/libs/systemPrompt";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface UserParams {
    finalPrompt: string;
    maxOutputTokens?: number;
    temperature?: number;
    model: string;
    isWebSearchEnabled: boolean;
    attachmentUrl?: string | null;
}

type MessageContent =
    | string
    | Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }>;

function buildMessages(finalPrompt: string, attachmentUrl?: string | null) {
    const userContent: MessageContent = attachmentUrl
        ? [
              { type: "text" as const, text: finalPrompt },
              { type: "image_url" as const, image_url: { url: attachmentUrl } },
          ]
        : finalPrompt;

    return [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
    ];
}

// Streaming: yields text chunks as they arrive
export async function* generateStreamingResponse(userParams: UserParams): AsyncGenerator<string> {
    const { finalPrompt, maxOutputTokens, temperature, model, isWebSearchEnabled, attachmentUrl } = userParams;

    const body: Record<string, unknown> = {
        model,
        messages: buildMessages(finalPrompt, attachmentUrl),
        max_tokens: maxOutputTokens ?? undefined,
        temperature: temperature ?? undefined,
        stream: true,
    };

    if (isWebSearchEnabled) {
        body.plugins = [{ id: "web", max_results: 5 }];
    }

    const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter error ${response.status}: ${errorText}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") return;
            try {
                const chunk = JSON.parse(data);
                if (chunk.error) throw new Error(chunk.error.message ?? "Stream error");
                const content = chunk.choices?.[0]?.delta?.content;
                if (content) yield content;
            } catch (e) {
                if ((e as Error).message?.includes("Stream error") || (e as Error).message?.startsWith("OpenRouter")) throw e;
                // skip malformed SSE lines
            }
        }
    }
}
