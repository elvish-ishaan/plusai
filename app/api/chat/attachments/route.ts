import { authOptions } from "@/libs/authOptions";
import prisma from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

//fetching all attachments of user
export async function GET() {
    const session = await getServerSession(authOptions);
    console.log(session,'get session in attachments route');
    if (!session) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    //fetching all attachments of user
    try {
        const attachments = await prisma.attachmentMetaData.findMany({
        where: {
            userid: session.user?.id || "",
        },
    });
    console.log(attachments, 'attachments');
    return NextResponse.json({ success: true, attachments });
    } catch (error) {
        console.log("Error fetching attachments:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch attachments" }, { status: 500 });
    }
}