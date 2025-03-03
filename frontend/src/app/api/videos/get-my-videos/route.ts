import { eq } from "drizzle-orm";

import { db } from "@/drizzle/db";
import { Video } from "@/drizzle/schema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    const videos = await db.select().from(Video).where(eq(Video.userId, userId));
    return NextResponse.json(videos);
}