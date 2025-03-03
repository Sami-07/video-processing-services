"use client"

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useUser } from '@clerk/nextjs'
import { VideoType } from '@/lib/types/video-type'
import EachVideo from '../dashboard/each-video'

export default function MyVideos() {
    const {user, isLoaded} = useUser()
    if(!isLoaded) return null
    if(!user) return null
    const {data: videos} = useQuery({
        queryKey: ["my-videos"],
        queryFn: async () => {
            const response = await axios.get(`/api/videos/get-my-videos?userId=${user.id}`);
            return response.data;
        }
    })
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos?.map((video: VideoType) => (
            <EachVideo key={video.id} video={video} />
        ))}
    </div>
  )
}
