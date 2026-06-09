import prisma from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const url = request.nextUrl;
    const threadId = url.pathname.split('/')[4]
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
        const thread = await prisma.thread.findUnique({
        where: {
            id: threadId || "",
        },
        include: {
            chats: true
        }
    });
    //check if thread exists
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

export async function PATCH(request: NextRequest) {
    const url = request.nextUrl;
    const threadId = url.pathname.split('/')[4]
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({
                success: false,
                message: "You are not logged in",
            }, { status: 401 });
        }
        const thread = await prisma.thread.findUnique({
            where: { id: threadId || "" },
        });
        if (!thread) {
            return NextResponse.json({
                success: false,
                message: "Thread not found",
            }, { status: 404 });
        }

        const body = await request.json().catch(() => ({}));
        const updateData: { pinned?: boolean; title?: string } = {};
        if (typeof body.title === "string") updateData.title = body.title;
        if (typeof body.pinned === "boolean") updateData.pinned = body.pinned;
        if (Object.keys(updateData).length === 0) updateData.pinned = !thread.pinned;

        await prisma.thread.update({
            where: { id: threadId || "" },
            data: updateData,
        });

        return NextResponse.json({
            success: true,
            message: "Thread updated successfully",
        }, { status: 200 });
    } catch (error) {
        console.error("Error updating thread:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
        }, { status: 500 });
    }
}   