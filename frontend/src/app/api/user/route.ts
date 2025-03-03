import { db } from "@/drizzle/db";
import { User } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, response: NextResponse) {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const myClerkClient = await clerkClient();
    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    try {
        const user = await db.query.User.findFirst({
            where: eq(User.id, userId),
        });
        const creatorData = await myClerkClient.users.getUser(userId);
        const simplifiedCreatorData = {
            ...user,
            imageUrl: creatorData.imageUrl || "",
        };
        return NextResponse.json(simplifiedCreatorData);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

