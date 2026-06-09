import { OpenRouter } from "@openrouter/sdk";
import { z } from "zod/v4";

const openrouter = new OpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

function stripMarkdown(text: string): string {
    return text
        .replace(/^#{1,6}\s+/, "")          // headers
        .replace(/\*\*(.+?)\*\*/g, "$1")    // bold **
        .replace(/__(.+?)__/g, "$1")         // bold __
        .replace(/\*(.+?)\*/g, "$1")         // italic *
        .replace(/_(.+?)_/g, "$1")           // italic _
        .replace(/`(.+?)`/g, "$1")           // inline code
        .replace(/^["']|["']$/g, "")         // surrounding quotes
        .trim();
}

export async function POST(req: Request) {
    const requestSchema = z.object({
        initPrompt: z.string(),
    });
    const { initPrompt } = requestSchema.parse(await req.json());

    const response = await openrouter.chat.send({
        chatRequest: {
            model: "openai/gpt-oss-120b:free",
            messages: [
                {
                    role: "user",
                    content: `Generate a short plain text title (no markdown, no quotes, no formatting) for this conversation prompt. The title must be under 60 characters. Reply with only the title text, nothing else.\n\nPrompt: ${initPrompt}`,
                },
            ],
            maxTokens: 60,
            temperature: 0.3,
        },
    });

    const raw = response.choices[0]?.message?.content ?? "";
    const text = typeof raw === "string" ? raw : "";
    return new Response(stripMarkdown(text));
}
