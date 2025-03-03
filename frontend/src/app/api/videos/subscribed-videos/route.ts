import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { Subscription, Video } from "@/drizzle/schema";
import { eq, inArray } from "drizzle-orm";
export async function GET(request: Request) {
  try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId');
      const page = searchParams.get('page') || 1;
      const limit = 12;
      if (!userId) {
          return NextResponse.json({ message: "User ID is required" }, { status: 400 });
      }
      const subscriptions = await db.select().from(Subscription).where(eq(Subscription.subscriberId, userId));
      if (!subscriptions) {
          return NextResponse.json({ message: "No subscriptions found" }, { status: 404 });
      }
      const creatorIds = subscriptions.map((subscription) => subscription.creatorId).filter((id) => id !== null);
      const videos = await db.select().from(Video).where(inArray(Video.userId, creatorIds)).limit(Number(limit)).offset(Number(page));    
      return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}