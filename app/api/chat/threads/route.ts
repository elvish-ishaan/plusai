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