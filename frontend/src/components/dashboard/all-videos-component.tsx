// src/components/dashboard/all-videos-component.tsx
'use client'

import React from 'react';
import EachVideo from '@/components/dashboard/each-video';
import { VideoType } from '@/lib/types/video-type';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import CustomLoader from '@/components/globals/loader';
import { useUser } from '@clerk/nextjs';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function AllVideos() {
    const { user, isLoaded } = useUser();
    
    const fetchVideos = async ({ pageParam = 1 }) => {
        const response = await axios.get(`/api/videos/get-all?page=${pageParam}`);
        return response.data;
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        refetch
    } = useInfiniteQuery({
        queryKey: ['videos'],
        queryFn: fetchVideos,
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
        initialPageParam: 1,
    });

    if (!isLoaded) return null;
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md">
                    <h2 className="text-2xl font-semibold text-white mb-4">
                        Authentication Required
                    </h2>
                    <p className="text-gray-300 mb-6">
                        Please sign in to view and manage your videos.
                    </p>
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-medium hover:shadow-lg transition-all">
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) return (
        <div className="h-[60vh] flex items-center justify-center">
            <CustomLoader />
        </div>
    );

    const allVideos = data?.pages.flatMap(page => page.videos) || [];
    const videosCount = allVideos.length;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-white">
                    All Videos <span className="text-sm font-normal text-gray-400 ml-2">({videosCount} videos)</span>
                </h1>
                <button 
                    onClick={() => refetch()}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-gray-300 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 0 1-9 9c-4.97 0-9-4.03-9-9s4.03-9 9-9h4.59L15 4.59"></path>
                        <path d="M20 5v3h-3"></path>
                        <path d="m9 15 3 3 3-3"></path>
                        <path d="M12 12v6"></path>
                    </svg>
                    Refresh
                </button>
            </div>

            {videosCount === 0 ? (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                    <div className="text-gray-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                            <path d="M17 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path>
                            <path d="m9 14 2 2 4-4"></path>
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No videos found</h3>
                    <p className="text-gray-400 mb-4">Start uploading your videos to see them here</p>
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={videosCount}
                    next={fetchNextPage}
                    hasMore={!!hasNextPage}
                    loader={
                        <div className="flex justify-center my-6">
                            <CustomLoader />
                        </div>
                    }
                    endMessage={
                        <p className="text-center text-gray-400 my-6 py-4 border-t border-gray-800">
                            You've seen all videos
                        </p>
                    }
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {allVideos.map((video: VideoType) => (
                            <div key={video.id} className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                                <EachVideo video={video} />
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            )}
        </div>
    );
}