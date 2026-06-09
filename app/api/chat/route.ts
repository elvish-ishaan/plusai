import { generateStreamingResponse } from "@/app/core/clientV2";
import { authOptions } from "@/libs/authOptions";
import prisma from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { v4 as uuid } from "uuid";
import { z } from "zod/v4";

const prevPromSchema = z.object({
    createdAt: z.string(),
    id: z.string(),
    model: z.string(),
    prompt: z.string(),
    provider: z.string(),
    response: z.string(),
    thread: z.string().optional(),
    updatedAt: z.string(),
    userId: z.string().optional(),
});

const requestSchema = z.object({
    prompt: z.string(),
    prevPrompts: z.array(prevPromSchema).nullable(),
    temperature: z.number(),
    model: z.string(),
    attachmentUrl: z.string().nullable(),
    isWebSearchEnabled: z.boolean(),
    maxOutputTokens: z.number(),
    llmProvider: z.string(),
    threadId: z.uuidv4(),
});

// NDJSON helpers — each line is one JSON object
function chunk(text: string) {
    return JSON.stringify({ t: "c", v: text }) + "\n";
}
function done(payload: Record<string, unknown>) {
    return JSON.stringify({ t: "d", ...payload }) + "\n";
}
function error(message: string) {
    return JSON.stringify({ t: "e", message }) + "\n";
}

export async function POST(req: Request) {
    const body = requestSchema.parse(await req.json());
    const { prompt, prevPrompts, temperature, model, attachmentUrl, isWebSearchEnabled, maxOutputTokens, llmProvider, threadId } = body;

    const session = await getServerSession(authOptions);

    let finalPrompt = `userId: ${session?.user?.id ?? "guest"}, prompt: ${prompt}`;
    if (prevPrompts && prevPrompts.length > 0 && prevPrompts[0].prompt !== "") {
        finalPrompt = `
userId: ${session?.user?.id ?? "guest"}
previous conversation:
${prevPrompts.map((p) => `user: ${p.prompt}\nresponse: ${p.response}`).join("\n")}

current prompt:
${prompt}`.trim();
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            let fullText = "";
            try {
                for await (const textChunk of generateStreamingResponse({
                    finalPrompt,
                    maxOutputTokens,
                    temperature,
                    model,
                    isWebSearchEnabled,
                    attachmentUrl,
                })) {
                    fullText += textChunk;
                    controller.enqueue(encoder.encode(chunk(textChunk)));
                }

                // Save to DB and send final metadata
                if (session?.user) {
                    await prisma.thread.upsert({
                        where: { id: threadId },
                        update: { updatedAt: new Date() },
                        create: {
                            id: threadId,
                            userId: session.user.id as string,
                            title: prompt,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                    });

                    const chat = await prisma.chat.create({
                        data: {
                            prompt,
                            response: fullText,
                            provider: llmProvider,
                            model,
                            thread: { connect: { id: threadId } },
                        },
                    });

                    await prisma.user.update({
                        where: { id: session.user.id as string },
                        data: { threads: { connect: { id: threadId } } },
                    });

                    controller.enqueue(encoder.encode(done({
                        id: chat.id,
                        threadId,
                        model,
                        provider: llmProvider,
                        prompt,
                        response: fullText,
                        createdAt: chat.createdAt.toISOString(),
                        updatedAt: chat.updatedAt.toISOString(),
                    })));
                } else {
                    controller.enqueue(encoder.encode(done({
                        id: uuid(),
                        threadId,
                        model,
                        provider: llmProvider,
                        prompt,
                        response: fullText,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    })));
                }
            } catch (err) {
                console.error(err, "streaming error");
                controller.enqueue(encoder.encode(error("Something went wrong while generating a response.")));
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
        },
    });
}
