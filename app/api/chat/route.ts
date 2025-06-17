import { initClient } from "@/app/core";
import { authOptions } from "@/libs/authOptions";
import prisma from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

export async function POST(req: Request) {
  const prevPromSchema = z.object({
  createdAt: z.string(), // Accept ISO string
  id: z.string(),
  model: z.string(),
  prompt: z.string(),
  provider: z.string(),
  response: z.string(),
  thread: z.string().optional(), // Accept string or undefined
  updatedAt: z.string(), // Accept ISO string
  userId: z.string().optional(), // Accept string or undefined
});
    //adding zod validation
    const requestSchema = z.object({
        prompt: z.string(),
        prevPrompts: z.array(prevPromSchema).nullable(),
        temperature: z.number(),
        model: z.string(),
        attachmentUrl: z.string().nullable(),
        isWebSearchEnabled: z.boolean(),
        systemPrompt: z.string(),
        maxOutputTokens: z.number(),
        llmProvider: z.string(),
        threadId: z.uuidv4(),
    });
    const { prompt, isWebSearchEnabled, attachmentUrl, temperature, model, maxOutputTokens, threadId, llmProvider, prevPrompts } = requestSchema.parse(await req.json()); 
    //generate diff client on the basis of provider
    const client = initClient('gemini');
    if (!client) {
        return new Response("Invalid model", { status: 400 });
    }
    let finalPrompt: string = prompt;

    if (prevPrompts && prevPrompts.length > 0 && prevPrompts[0].prompt !== '') {
      finalPrompt = `
    previous conversation:
    ${prevPrompts.map((prompt) => "user:" + prompt.prompt +","+ "response" + prompt.response).join('\n')}
    
    current conversation:
    ${prompt}
      `;
    }

    console.log(finalPrompt, 'final prompt');
    const llmRes = await client.generate( finalPrompt, maxOutputTokens, temperature, model, isWebSearchEnabled, attachmentUrl );

    const session = await getServerSession(authOptions);

    let chat;
    if(session){
        const user = await prisma.user.findUnique({
      where: {
        id: session.user.id as string,
      },
    });
    if(user){
        // Make sure thread exists first
        const thread = await prisma.thread.upsert({
          where: {
            id: threadId,
          },
          update: {
            updatedAt: new Date(),
          },
          create: {
            id: threadId,
            userId: session.user?.id as string,
            title: prompt,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        console.log(thread, 'thread');
   
        // Now create the chat and connect it to the existing thread
         chat = await prisma.chat.create({
     data: {
       prompt,
       response: llmRes.text,
       provider: llmProvider,
       model,
       thread: {
         connect: { id: threadId },
       },
     },
        });
        console.log(chat, 'chat');
  
       // Connect the chat to the user
        await prisma.user.update({
     where: {
       id: session.user.id as string,
     },
     data: {
       threads: {
         connect: {
           id: threadId,
         },
       },
     },
        });
        console.log(user, 'user');
        return NextResponse.json({
          success: true,
          message: "Chat created successfully",
          genResponse: chat,
        });
    }
    }
    return NextResponse.json({
      success: true,
      message: "Chat created successfully",
      genResponse: llmRes.text,
    });
}