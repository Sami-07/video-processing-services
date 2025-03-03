import { db } from "@/drizzle/db";
import { eq, ilike } from "drizzle-orm";
import { Video } from "@/drizzle/schema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
      const { searchParams } = new URL(request.url);
      const query = searchParams.get('query');
      if (!query) {
          return NextResponse.json({ message: "Query is required" }, { status: 400 });
      }
      const videos = await db.select().from(Video).where(ilike(Video.title, `%${query}%`));
      return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}