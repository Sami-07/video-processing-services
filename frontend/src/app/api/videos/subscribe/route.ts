import { db } from "@/drizzle/db";
import { Subscription } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const subscriberId = searchParams.get('subscriberId');
    const creatorId = searchParams.get('creatorId');

    if (!subscriberId || !creatorId) {
        return NextResponse.json({ message: "User ID and Creator ID is required" }, { status: 400 });
    }
    const existingSubscription = await db.select().from(Subscription).where(and(eq(Subscription.subscriberId, subscriberId), eq(Subscription.creatorId, creatorId)));
    console.log("existingSubscription", existingSubscription)
    return NextResponse.json({ isSubscribed: existingSubscription.length > 0 ? true : false });
}

export async function POST(request: Request) {
    const { subscriberId, creatorId } = await request.json();
    console.log("subscriberId", subscriberId)
    console.log("creatorId", creatorId)
    if (!subscriberId || !creatorId) {
        return NextResponse.json({ message: "User ID and Creator ID is required" }, { status: 400 });
    }
    if (subscriberId === creatorId) {
        return NextResponse.json({ message: "You cannot subscribe to yourself" }, { status: 400 });
    }
    const existingSubscription = await db.select().from(Subscription).where(and(eq(Subscription.subscriberId, subscriberId), eq(Subscription.creatorId, creatorId)));
    if (existingSubscription.length > 0) {
        return NextResponse.json({ message: "You are already subscribed to this creator" }, { status: 400 });
    }
    const subscription = await db.insert(Subscription).values({
        id: crypto.randomUUID(),
        subscriberId: subscriberId,
        creatorId: creatorId,
        createdAt: new Date(),
    });
    return NextResponse.json({ message: "You are now subscribed to this creator", subscription: subscription });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const subscriberId = searchParams.get('subscriberId');
    const creatorId = searchParams.get('creatorId');
    if (!subscriberId || !creatorId) {
        return NextResponse.json({ message: "User ID and Creator ID is required" }, { status: 400 });
    }
    await db.delete(Subscription).where(and(eq(Subscription.subscriberId, subscriberId), eq(Subscription.creatorId, creatorId)));
    return NextResponse.json({ message: "You are no longer subscribed to this creator" });
}
