import { eq } from "drizzle-orm";

import { Subscription } from "@/drizzle/schema";

import { db } from "@/drizzle/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');
    if (!creatorId) {
        return NextResponse.json({ error: "Creator ID is required" }, { status: 400 });
    }
    const subscriberCount = await db.select().from(Subscription).where(eq(Subscription.creatorId, creatorId)).execute().then(result => result.length);
    return NextResponse.json({ subscriberCount });
}   