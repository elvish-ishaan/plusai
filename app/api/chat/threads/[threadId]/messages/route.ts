import { authOptions } from "@/libs/authOptions";
import prisma from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { threadId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const threadId = params.threadId;

  try {
    // Verify thread belongs to user
    const thread = await prisma.thread.findFirst({
      where: {
        id: threadId,
        userId: session.user.id
      }
    });

    if (!thread) {
      return NextResponse.json({ success: false, message: "Thread not found" }, { status: 404 });
    }

    // Get all chats for the thread
    const chats = await prisma.chat.findMany({
      where: {
        threadId: threadId
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Format messages
    const messages = chats.flatMap(chat => [
      { sender: "user", text: chat.prompt },
      { sender: "ai", text: chat.response }
    ]);

    return NextResponse.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch messages" 
    }, { status: 500 });
  }
} 