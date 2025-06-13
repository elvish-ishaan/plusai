import { authOptions } from "@/libs/authOptions";
import prisma from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function GET() {
    const session = await getServerSession(authOptions);

    //get threads from db
    try {
        const response = await prisma.thread.findMany({
      where: {
        userId: session?.user.id as string,
      },
    });
    return NextResponse.json({
        success: true,
        threads: response,
    });
    } catch (error) {
        console.log(error as string, 'error in getting threads from db');
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get('threadId');

    if (!threadId) {
        return NextResponse.json({ success: false, message: "Thread ID is required" }, { status: 400 });
    }

    try {
        // Delete all chats associated with the thread first
        await prisma.chat.deleteMany({
            where: {
                threadId: threadId
            }
        });

        // Then delete the thread
        await prisma.thread.delete({
            where: {
                id: threadId,
                userId: session.user.id
            }
        });

        return NextResponse.json({
            success: true,
            message: "Thread deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting thread:', error);
        return NextResponse.json({ 
            success: false, 
            message: "Failed to delete thread" 
        }, { status: 500 });
    }
}