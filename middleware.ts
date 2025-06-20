import { NextRequest, NextResponse } from "next/server";

//using in memory for rate limmiting
const inMemDb = new Map<string, number>();

export const middleware = async (request: NextRequest) => {
    const ip = request.headers.get("x-forwarded-for");
    const key = ip || "";

    if (inMemDb.has(key)) {
        const count = inMemDb.get(key) || 0;
        inMemDb.set(key, count + 1);
        if (count >= 20) {
            return NextResponse.json({
                success: false,
                message: "Too many requests from this IP. Please try again later.",
            })
        }
        return NextResponse.next();
    } else {
        inMemDb.set(key, 1);
        return NextResponse.next();
    }   
}

export const config = {
    matcher: [
      "/api/chat",
      "/api/chat/generate-title",
    ],
  };