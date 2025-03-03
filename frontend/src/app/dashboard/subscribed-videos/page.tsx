'use client'

import React from 'react';
import EachVideo from '@/components/dashboard/each-video';
import { VideoType } from '@/lib/types/video-type';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import CustomLoader from '@/components/globals/loader';
import { useUser } from '@clerk/nextjs';

export default function AllVideos() {
    const { user, isLoaded } = useUser();
    if (!isLoaded) return null;
    if (!user) {
        return <div>Please sign in to view all videos</div>;
    }
    const observer = React.useRef<IntersectionObserver | null>(null);
    const loadMoreRef = React.useRef<HTMLDivElement | null>(null);

    const fetchVideos = async ({ pageParam = 1 }) => {
        const response = await axios.get(`/api/videos/subscribed-videos?page=${pageParam}`);
        return response.data;
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['videos'],
        queryFn: fetchVideos,
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
        initialPageParam: 1,
        
    });


    React.useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });

        if (loadMoreRef.current) {
            observer.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [hasNextPage, fetchNextPage]);

    if (isLoading) return <CustomLoader />;
    if (!data) return <div className="text-center text-2xl font-bold flex justify-center items-center h-screen">No videos found</div>;
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {data?.pages.map((page) =>
                page.videos.map((video: VideoType) => (
                    <div key={video.id}>
                        <EachVideo video={video} />
                       
                    </div>
                ))
            )}
            {hasNextPage && (
                <div ref={loadMoreRef} style={{ height: '20px' }} />
            )}
        </div>
    );
}