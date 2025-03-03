"use client"

import React from 'react'
import DisplayEachVideo from './display-each-video';
import { VideoType } from '@/lib/types/video-type';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function EachVideo({ video }: { video: VideoType }) {

    const creatorId = video.userId || "";
    const { data: creatorData } = useQuery({
        queryKey: ["creatorData", creatorId],
        queryFn: async () => {
            const response = await axios.get(`/api/user?userId=${creatorId}`);
            return response.data;
        }
    })
    const {data: thumbnailUrl} = useQuery({
        queryKey: ["thumbnailUrl", video.thumbnailKey],
        queryFn: async () => {
            const response = await axios.get(`/api/videos/get-thumbnail-url?thumbnailKey=${video.thumbnailKey}`);
            return response.data;
        }
    })

    if (!creatorData) return null;
    const simplifiedCreatorData = {
        id: creatorData.id,
        fullName: creatorData.fullName || "",
        imageUrl: creatorData.imageUrl || "",
    };
    console.log("creatorData", creatorData)
    return (
        <DisplayEachVideo video={video} thumbnailUrl={thumbnailUrl} creatorData={simplifiedCreatorData} />
    )
}
