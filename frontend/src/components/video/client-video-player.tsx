'use client'

import React, { useEffect, useState } from 'react';
import { VideoType } from '@/lib/types/video-type';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import RenderVideo from '@/components/video/render-video';
import EachVideo from '@/components/dashboard/each-video';
import CustomLoader from '@/components/globals/loader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSearchParams } from 'next/navigation';
interface ClientVideoPlayerProps {
  videoId: string;
}

export default function ClientVideoPlayer({ videoId }: ClientVideoPlayerProps) {
  const [currentVideo, setCurrentVideo] = useState<VideoType | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [creatorData, setCreatorData] = useState({ id: '', fullName: '', imageUrl: '' });
const params = useSearchParams();
console.log("params", params)
const videoKey = params.get('videoKey');

  // Fetch current video data
  const { data: videoData, isLoading: videoLoading } = useQuery({
    queryKey: ['video', videoId],
    queryFn: async () => {
      console.log("videoId", videoId)
      console.log("videoKey", videoKey)
      if(videoKey){
        console.log("videoKey", videoKey)
        const response = await axios.get(`/api/videos/get-video-by-video-key?videoKey=${videoKey}`);
        console.log("response", response.data[0])
        return response.data[0];
      }
      const response = await axios.get(`/api/videos?videoId=${videoId}`);
      console.log("response", response.data[0])
      return response.data[0];
    }
  });

  // Fetch current video thumbnail
  const { data: thumbnail } = useQuery({
    queryKey: ['thumbnail', videoData?.thumbnailKey],
    queryFn: async () => {
        console.log("debuggggg videoData", videoData?.thumbnailKey)
      if (!videoData?.thumbnailKey) return null;
      const response = await axios.get(`/api/videos/get-thumbnail-url?thumbnailKey=${videoData.thumbnailKey}`);
      console.log("debuggggg response", response.data)
      return response.data;
    },
    enabled: !!videoData?.thumbnailKey
  });

  // Fetch creator data
  const { data: creator } = useQuery({
    queryKey: ['creator', videoData?.userId],
    queryFn: async () => {
      if (!videoData?.userId) return null;
      const response = await axios.get(`/api/user?userId=${videoData.userId}`);
      return response.data;
    },
    enabled: !!videoData?.userId
  });

  // Set current video and related data when available
  useEffect(() => {
    if (videoData) {
      setCurrentVideo(videoData);
    }
    if (thumbnail) {
      setThumbnailUrl(thumbnail);
    }
    if (creator) {
      setCreatorData({
        id: creator.id,
        fullName: creator.fullName || '',
        imageUrl: creator.imageUrl || ''
      });
    }
  }, [videoData, thumbnail, creator]);

  // Fetch related videos using the same approach as all-videos-component
  const fetchRelatedVideos = async ({ pageParam = 1 }) => {
    const response = await axios.get(`/api/videos/get-all?page=${pageParam}&exclude=${videoId}`);
    return response.data;
  };

  const {
    data: relatedVideosData,
    fetchNextPage,
    hasNextPage,
    isLoading: relatedVideosLoading
  } = useInfiniteQuery({
    queryKey: ['relatedVideos', videoId],
    queryFn: fetchRelatedVideos,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1
  });

  if (videoLoading) {
    return (
      <div className="container mx-auto flex justify-center items-center h-[70vh]">
        <CustomLoader />
      </div>
    );
  }

  const relatedVideos = relatedVideosData?.pages.flatMap(page => page.videos) || [];
  const relatedVideosCount = relatedVideos.length;

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4">
          <RenderVideo
            video={videoData}
            thumbnailUrl={thumbnailUrl}
            creatorData={creatorData}
          />
        </div>

        <div className="lg:w-1/4 md:mt-0 mt-4">
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold text-white mb-3">
              Up Next <span className="text-sm font-normal text-gray-400">{relatedVideosCount > 0 && `(${relatedVideosCount})`}</span>
            </h2>
            
            {relatedVideosLoading ? (
              <div className="flex justify-center py-4">
                <CustomLoader />
              </div>
            ) : relatedVideosCount === 0 ? (
              <div className="text-center py-6">
                <div className="text-gray-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                    <path d="M17 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
                    <path d="m9 14 2 2 4-4"></path>
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">No related videos found</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto  pr-1" id="relatedVideosContainer">
                <InfiniteScroll
                  dataLength={relatedVideosCount}
                  next={fetchNextPage}
                  hasMore={!!hasNextPage}
                  loader={
                    <div className="flex justify-center py-2">
                      <CustomLoader />
                    </div>
                  }
                  scrollableTarget="relatedVideosContainer"
                  endMessage={
                    <p className="text-center text-gray-500 text-xs py-2">
                      No more videos
                    </p>
                  }
                  className="space-y-3"
                >
                  {relatedVideos.map((video: VideoType) => (
                    <div key={video.id} className="transform transition-all duration-200 hover:-translate-y-1">
                      <EachVideo video={video} />
                    </div>
                  ))}
                </InfiniteScroll>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 