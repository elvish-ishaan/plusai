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

//write post post route to pin a thread
export async function PATCH(request: Request, { params }: { params: { threadId: string } }) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({
                success: false,
                message: "You are not logged in",
            }, { status: 401 });
        }

        const threadId = await params.threadId
        console.log("Thread ID to pin:", threadId);
        //first get the thread 
       try {
         const thread = await prisma.thread.findUnique({
            where: {
                id: threadId,
            },
        });
        if (!thread) {
            return NextResponse.json({
                success: false,
                message: "Thread not found",
            }, { status: 404 });
        }
        //update the thread
        const updatedThread = await prisma.thread.updateMany({
            where: {
                id: threadId,
            },
            data: {
                pinned: !thread.pinned, // Toggle the pinned status
            },
        });
        console.log("Thread updated successfully:", updatedThread);

        return NextResponse.json({
            success: true,
            message: "Thread pinned successfully",
            thread,
        }, { status: 200 });
       } catch (error) {
        console.error("Error fetching thread from db:", error);
        return NextResponse.json({
            success: false,
            message: "Thread not found",
        }, { status: 404 });
        
       }
    } catch (error) {
        console.error("Error pinning thread:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
        }, { status: 500 });
    }
}   