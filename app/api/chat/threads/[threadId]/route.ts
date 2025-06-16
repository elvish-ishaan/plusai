import prisma from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { threadId: string } }) {
    try {
        //check for auth
    const session = await getServerSession()
    if(!session) {
        return NextResponse.json({
            success: false,
            message: "You are not logged in",
        },{status: 401})
    }

    try {
        const threadId = await params.threadId
        const thread = await prisma.thread.findUnique({
        where: {
            id: threadId
        },
        include: {
            chats: true
        }
    });
    if (!thread) {
        return NextResponse.json({
            success: false,
            message: "Thread not found",
        },{status: 404});
    }
    //sending thread to client
    return NextResponse.json({
        success: true,
        thread: thread,
    },{status: 200});
    
    } catch (error) {
        console.log(error, 'error in getting thread from threadid from db')
    }
    } catch (error) {
        console.log(error,'err in handling threadid ')
        return NextResponse.json({ 
            success: false,
            message: "Internal server error",
         });
    }
    
}