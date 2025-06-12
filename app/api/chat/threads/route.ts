import { authOptions } from "@/libs/authOptions";
import prisma from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

//get threads
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

//delete threadS
export async function DELETE(request: Request) {
    try {
      const session = await getServerSession(authOptions);
    if(!session){ 
        return NextResponse.json({
            success: false,
            message: "unauthenticated user",
        },{status: 401});
    }
    const { threadId } = await request.json();
    try {
        await prisma.thread.delete({
            where: {
                id: threadId,
            },
        });
        return NextResponse.json({
            success: true,
            message: "Thread deleted successfully",
        });
    } catch (error) {
        console.log(error as string, 'error in deleting thread from db');
    }
    } catch (error) {
      console.log(error as string, 'error in deleting thread');
      return NextResponse.json({
        success: false,
        message: "Internal server error",
      });
    }
} 