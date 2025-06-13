import { initClient } from "@/app/core";
import { authOptions } from "@/libs/authOptions";
import prisma from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

export async function POST(req: Request) {
    //adding zod validation
    const requestSchema = z.object({
        prompt: z.string(),
        prevPrompts: z.array(
            z.object({
              id: z.uuidv4().nullable(),
              prompt: z.string(),
              response: z.string().nullable(),
        })
        ),
        temperature: z.number(),
        model: z.string(),
        systemPrompt: z.string(),
        maxOutputTokens: z.number(),
        llmProvider: z.string(),
        threadId: z.uuidv4(),
    });
    const { prompt, temperature, model, maxOutputTokens, systemPrompt, threadId, llmProvider, prevPrompts } = requestSchema.parse(await req.json()); 
    //generate diff client on the basis of provider
    const client = initClient('gemini');
    if (!client) {
        return new Response("Invalid model", { status: 400 });
    }
    let finalPrompt;
    if(prevPrompts.length > 0 && prevPrompts[0].text !== ''){
        finalPrompt = `
        previous conversation:
        ${prevPrompts.map((prompt) => prompt.text).join('\n')}
        
        current conversation:
        ${prompt}
        `;
    }else{
        finalPrompt = prompt;
    }

    const llmRes = await client.generate( finalPrompt, temperature, maxOutputTokens, model, systemPrompt);

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
   
        // Add thread to user (if not already present – this line assumes threads relation is `user: User @relation(fields: [userId], references: [id])`)
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
          genResponse: chat.response,
        });
    }
    }
    return NextResponse.json({
      success: true,
      message: "Chat created successfully",
      genResponse: llmRes.text,
    });
}