'use client'
import React from 'react'
import { fetchUser } from '@/utils/fetch-user';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import CustomLoader from '../globals/loader';
import Image from 'next/image';
import { Button } from '../ui/button';
import UploadVideo from './upload-video';
import MyVideos from './my-videos';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export default function ProfilePage({ userId }: { userId: string }) {
    const { user, isLoaded } = useUser()
    const { data, isLoading, error } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => fetchUser(userId),
        retry: 1,
        enabled: isLoaded && !!user
    })

    if (!isLoaded || isLoading) return <CustomLoader />

    if (!user) return <div className="text-center mt-10">Please sign in to view profile</div>

    if (error) return <div className="text-center mt-10">Error loading profile: {error.message}</div>

    return (
        <div>

            <div className="flex flex-col items-center mt-10">
                <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="flex items-center justify-center p-6 bg-gray-100">
                       {user?.imageUrl ? <Image src={user?.imageUrl} alt={user?.fullName || ''} width={100} height={100} className="rounded-full" /> : <Avatar>
                            <AvatarImage src={user?.imageUrl} />
                            <AvatarFallback>{user?.fullName?.[0] || ''}</AvatarFallback>
                        </Avatar>}
                    </div>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-center mb-2">{data?.name}</h2>
                        <p className="text-gray-600 text-center mb-1">{data?.email}</p>
                        <p className="text-gray-500 text-center">Joined: {new Date(data?.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="w-full max-w-md mt-6 flex justify-center">
                    <UploadVideo />
                </div>
            </div>
            <div className="mt-10 w-[80%] mx-auto">
                <MyVideos />
            </div>
        </div>
    )
}