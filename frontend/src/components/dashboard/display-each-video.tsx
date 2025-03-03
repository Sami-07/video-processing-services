"use client"

import React from 'react'
import { VideoType } from '@/lib/types/video-type'
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Icons } from '@/lib/icons'

interface CreatorData {
  id: string
  imageUrl: string
  fullName: string
}

interface VideoThumbnailProps {
  video: VideoType
  creatorData: CreatorData
  thumbnailUrl: string
}

const DisplayEachVideo: React.FC<VideoThumbnailProps> = ({ video, creatorData }) => {
  const {data: thumbnailUrl} = useQuery({
    queryKey: ["thumbnailUrl", video.thumbnailKey],
    queryFn: async () => {
      const response = await axios.get(`/api/videos/get-thumbnail-url?videoId=${video.id}`);
      return response.data;
    }
  })
  return (
    <Card className="w-full max-w-[360px] overflow-hidden">
      <Link href={`/watch/${video.id}`}>
        <div className="relative aspect-video">
         {  thumbnailUrl ? <Image
              src={thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover"
            /> : <Icons.Image className="w-10 h-10 mx-auto text-gray-400" />}
        </div>
        <CardContent className="p-3">
          <div className="flex space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={creatorData.imageUrl} alt={creatorData.fullName} />
              <AvatarFallback>{creatorData.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-sm font-medium leading-none line-clamp-2">{video.title}</h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <p>{creatorData.fullName}</p>
                <span className="mx-1">•</span>
                {/* <p>{formatViewCount(video.views)} views</p> */}
                <span className="mx-1">•</span>
                <p>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

function formatViewCount(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  } else {
    return views.toString()
  }
}

export default DisplayEachVideo

