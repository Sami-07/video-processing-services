import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { Subscription } from "@/drizzle/schema";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const page = searchParams.get('page') || 1;
        const limit = 12;
        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }
        const subscriptions = await db.select().from(Subscription).where(eq(Subscription.subscriberId, userId)).limit(Number(limit)).offset(Number(page));
        if (!subscriptions) {
            return NextResponse.json({ message: "No subscriptions found" }, { status: 404 });
        }

        return NextResponse.json(subscriptions);
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}