import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { Video } from "@/drizzle/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const videoId = searchParams.get('videoId');
        if (!videoId) {
        return NextResponse.json({ message: "Video ID is required" }, { status: 400 });
    }
    const video = await db.select().from(Video).where(eq(Video.id, videoId));
    if (!video) {
        return NextResponse.json({ message: "Video not found" }, { status: 404 });
        }
        return NextResponse.json(video);
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { title, description, videoKey, thumbnailKey, userId } = await request.json();

        const video = await db.insert(Video).values({
            id: randomUUID(),
            title,
            description,
            videoKey,
            thumbnailKey,
            userId,
        })

        return NextResponse.json({ message: "Video uploaded successfully" });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message }, { status: 500 });

    }

}

