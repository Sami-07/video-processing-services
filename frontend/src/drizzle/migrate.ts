import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config();

const migrationClient = postgres(process.env.DATABASE_URL! , { max: 1 });

async function main() {
    await migrate(drizzle(migrationClient), { migrationsFolder: "src/drizzle/migrations" });

    await migrationClient.end();
}

main().catch((err) => {
    console.error("Error in migration", err);
    process.exit(1);
});
