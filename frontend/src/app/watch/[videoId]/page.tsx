import RenderVideo from '@/components/video/render-video';
import { eq } from 'drizzle-orm';
import { Video } from '@/drizzle/schema';
import React from 'react'
import { db } from '@/drizzle/db';
import { VideoType } from '@/lib/types/video-type';
import { getThumbnailAwsUrl } from '@/utils/get-aws-url';
import { clerkClient } from "@clerk/nextjs/server"
   
export default async function WatchPage({params}: {params: {videoId: string}}) {
    const {videoId} = await params;

    console.log("videoKey", videoId)
    const video = await db.select().from(Video).where(eq(Video.id, videoId)).limit(1);
    const creatorId = video[0].userId;
    const myClerkClient = await clerkClient();
    const creatorData = await myClerkClient.users.getUser(creatorId as string); 
    const simplifiedCreatorData = {
      id: creatorData.id,
      fullName: creatorData.fullName || "",
      imageUrl: creatorData.imageUrl || "",
  };
   const thumbnailUrl = await getThumbnailAwsUrl(video[0].thumbnailKey);

  return (
    <div>
        <RenderVideo video={video[0] as unknown as VideoType} thumbnailUrl={thumbnailUrl.src} creatorData={simplifiedCreatorData} />
    </div>
  )
}
