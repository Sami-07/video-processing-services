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
  thumbnailUrl?: string
}

const DisplayEachVideo: React.FC<VideoThumbnailProps> = ({ video, creatorData }) => {
  const {data: thumbnailUrl} = useQuery({
    queryKey: ["thumbnailUrl", video.thumbnailKey],
    queryFn: async () => {
      const response = await axios.get(`/api/videos/get-thumbnail-url?videoId=${video.id}`);
      console.log("response thumbnail", response.data[0])
      return response.data[0];
    }
  })
  
  return (
    <Card className="w-full overflow-hidden border border-gray-700 hover:border-gray-600 rounded-lg transition-all bg-gray-800">
      <Link href={`/watch/${video.id}`}>
        <div className="relative aspect-video bg-gray-900">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Icons.Image className="w-10 h-10 text-gray-600" />
            </div>
          )}
          {/* <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
            {formatDuration(video.duration || 0)}
          </div> */}
        </div>
        
        <CardContent className="p-3">
          <div className="flex space-x-3">
            <Avatar className="h-8 w-8 ring-1 ring-gray-700">
              <AvatarImage src={creatorData.imageUrl} alt={creatorData.fullName} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white text-xs">
                {creatorData.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="text-sm font-medium leading-snug line-clamp-2 text-gray-200 group-hover:text-white">
                {video.title}
              </h3>
              <div className="flex flex-wrap items-center text-xs text-gray-400 gap-1">
                <p className="truncate max-w-[120px]">{creatorData.fullName}</p>
                <span className="inline-block">•</span>
         
                <p className="whitespace-nowrap">{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</p>
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

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default DisplayEachVideo

