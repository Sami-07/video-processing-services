
'use client'

import { useSearchParams } from 'next/navigation'
import React from 'react';
import EachVideo from '@/components/dashboard/each-video';
import { VideoType } from '@/lib/types/video-type';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import CustomLoader from '@/components/globals/loader';
import { useUser } from '@clerk/nextjs';
import InfiniteScroll from 'react-infinite-scroll-component'; 
export default function page() {
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    
    const { user, isLoaded } = useUser();
    
    const fetchVideos = async ({ pageParam = 1 }) => {
        const response = await axios.get(`/api/videos/get-all?page=${pageParam}&search=${search}`);
        return response.data;
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        refetch
    } = useInfiniteQuery({
        queryKey: ['videos', search], 
        queryFn: fetchVideos,
        getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
        initialPageParam: 1,
    });

    React.useEffect(() => {
        refetch();
    }, [search]); 

    if (!isLoaded) return null;
    if (!user) {
        return <div>Please sign in to view all videos</div>;
    }

    if (isLoading) return <CustomLoader />;

    return (
        <InfiniteScroll
            dataLength={data?.pages.flatMap(page => page.videos).length || 0} 
            next={fetchNextPage} 
            hasMore={hasNextPage} 
            loader={<CustomLoader />} 
            endMessage={<p className="text-center text-gray-500">No more videos</p>}    
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {data?.pages.map((page) =>
                    page.videos.map((video: VideoType) => (
                        <div key={video.id}>
                            <EachVideo video={video} />
                        </div>
                    ))
                )}
            </div>
        </InfiniteScroll>
    );
}