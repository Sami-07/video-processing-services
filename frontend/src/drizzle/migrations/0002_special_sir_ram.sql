ALTER TABLE "video" ADD COLUMN "video_key" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "video" ADD COLUMN "thumbnail_key" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "video" DROP COLUMN IF EXISTS "manifest_url";--> statement-breakpoint
ALTER TABLE "video" DROP COLUMN IF EXISTS "thumbnail_url";