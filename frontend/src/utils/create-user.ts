import { db } from "@/drizzle/db";
import { User } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
interface UserType {
    id: string;
    name: string;
    email: string;
}
export async function createUser(user: UserType) {
    try {
        const { id, name, email } = user;
        const userAlreadyExists = await db.query.User.findFirst({
            where: eq(User.id, user.id),
        });
        if (userAlreadyExists) {
            return { status: 400, error: "User already exists" };
        }
        const userCreated = await db.insert(User).values({ id, name, email }).returning();
        return { status: 200, user: userCreated };
    } catch (error) {
        return { status: 500, error: error };
    }
}