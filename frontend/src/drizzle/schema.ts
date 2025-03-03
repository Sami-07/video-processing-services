import { pgTable, varchar, timestamp, index } from "drizzle-orm/pg-core";

export const User = pgTable("user", {
    id: varchar("id").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull().unique(),
},
    table => {
        return {
            emailIdx: index("email_idx").on(table.email),
        };
    }
);

export const Subscription = pgTable("subscription", {
    id: varchar("id").primaryKey(),
    subscriberId: varchar("subscriber_id").references(() => User.id),
    creatorId: varchar("creator_id").references(() => User.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const Video = pgTable("video", {
    id: varchar("id").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    title: varchar("title", { length: 256 }).notNull(),
    description: varchar("description").notNull().default(""),
    videoKey: varchar("video_key", { length: 256 }).notNull(),
    thumbnailKey: varchar("thumbnail_key", { length: 256 }).notNull(),
    userId: varchar("user_id").references(() => User.id),
});

export const VideoView = pgTable("video_view", {
    id: varchar("id").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    videoId: varchar("video_id").references(() => Video.id),
    userId: varchar("user_id").references(() => User.id),
});

