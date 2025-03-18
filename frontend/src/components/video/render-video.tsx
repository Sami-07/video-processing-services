'use client'

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { getAwsUrl } from '@/utils/get-aws-url';
import { VideoType } from '@/lib/types/video-type';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Share2, Bell } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import '@/styles/tiptap.css'
import { useToast } from "@/hooks/use-toast"
import dynamic from 'next/dynamic'
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
const RenderDescription = dynamic(() => import('./render-description'), { ssr: false });

export default function YouTubeStylePlayer({ video, thumbnailUrl, creatorData }: { video: VideoType, thumbnailUrl: string, creatorData: any }) {
    const {user, isLoaded} = useUser();
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [qualities, setQualities] = useState<{ value: string; label: string }[]>([]);
    const [currentQuality, setCurrentQuality] = useState<string>('auto');
    const [hls, setHls] = useState<Hls | null>(null);
  
    useEffect(() => {
        const fetchAndRenderVideo = async () => {
            const videoElement = videoRef.current;
            if (!videoElement) return;
            const manifestKey = `master-${video.videoKey}.m3u8`
            const videoSrc = await getAwsUrl(manifestKey);
            if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                videoElement.src = videoSrc.src;
            } else if (Hls.isSupported()) {
                const hlsInstance = new Hls({
                    startLevel: -1 // Start with auto quality
                });
                hlsInstance.loadSource(videoSrc.src);
                hlsInstance.attachMedia(videoElement);

                hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
                    const availableQualities = hlsInstance.levels.map((level, index) => ({
                        value: index.toString(),
                        label: `${level.height}p`
                    }));
                    setQualities([{ value: 'auto', label: 'Auto' }, ...availableQualities]);
                });

                setHls(hlsInstance);
                return () => {
                    hlsInstance.destroy();
                };
            } else {
                console.error('HLS is not supported in this browser.');
            }
        };

        fetchAndRenderVideo();
    }, [video.videoKey]);

    const handleQualityChange = (quality: string) => {
        setCurrentQuality(quality);
        if (hls) {
            const levelIndex = quality === 'auto' ? -1 : parseInt(quality, 10);
            hls.currentLevel = levelIndex;
            
            // Get the actual resolution from HLS instance
            const currentLevel = hls.levels[levelIndex];
            const resolution = currentLevel ? `${currentLevel.height}p` : 'Auto';
            console.log("Switched to:", resolution);
            // Force immediate switch if not auto
            if (quality !== 'auto') {
                hls.nextLevel = levelIndex;  // Use nextLevel for immediate switch
            }
        }
    };
    const { data: isSubscribed, refetch } = useQuery({
        queryKey: ["isSubscribed", user?.id, video.userId],
        queryFn: async () => {
            const response = await axios.get(`/api/videos/subscribe?subscriberId=${user?.id}&creatorId=${video.userId}`);
            return response.data.isSubscribed;
        }
    })

    const { mutate: subscribe } = useMutation({
        mutationFn: async () => {
            if (isSubscribed) {
                const response = await axios.delete(`/api/videos/subscribe?subscriberId=${user?.id}&creatorId=${video.userId}`);
                return response.data;
            } else {
                const response = await axios.post(`/api/videos/subscribe`, { subscriberId: user?.id, creatorId: video.userId });
                return response.data;
            }
        },
        onSuccess: () => {
            if(isSubscribed){
                toast({
                    title: 'You are now unsubscribed from this creator',
                    description: 'You will no longer receive notifications for this creators videos',
                })
            }else{
                toast({
                    title: 'You are now subscribed to this creator',
                    description: 'You will now receive notifications for this creators videos',
                })
            }
            refetch();
            refetchSubscriberCount();
        }
    })

    const { data: subscriberCount , refetch: refetchSubscriberCount} = useQuery({
        queryKey: ["subscriberCount", creatorData.id],
        queryFn: async () => {
            const response = await axios.get(`/api/subscribe/get-subscriber-count?creatorId=${creatorData.id}`);
            return response.data.subscriberCount;
        }
    })

    const handleSubscribe = () => {
        subscribe();
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast({
            title: 'URL copied to clipboard!',
            description: 'You can now share this video with others',
        });
    };

    if (!isLoaded) return null;
    return (
        <div>
            {/* Video Player */}
            <div className="relative overflow-hidden rounded-lg">
                <div className="relative pt-[56.25%] bg-gray-900">
                    <video
                        ref={videoRef}
                        controls
                        className="absolute top-0 left-0 w-full h-full"
                        poster={thumbnailUrl}
                    ></video>
                </div>
            </div>

            {/* Video Info */}
            <div className="mt-4">
                <h1 className="text-2xl font-bold text-white mb-2">{video.title}</h1>
                
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mt-2 pb-4 border-b border-gray-700">
                    {/* Creator Info */}
                    <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-gray-700">
                            <AvatarImage src={creatorData.imageUrl} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white">
                                {creatorData.fullName[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-white">{creatorData.fullName}</p>
                            <p className="text-sm text-gray-400">
                                {subscriberCount || 0} subscribers
                            </p>
                        </div>
                    </div>
                    
                    {/* Interaction Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        {creatorData.id !== user?.id && (
                            <Button
                                variant={isSubscribed ? "outline" : "default"}
                                className={`${isSubscribed 
                                    ? "bg-gray-800 text-white hover:bg-gray-700 border-gray-600" 
                                    : "bg-blue-600 hover:bg-blue-700"}`}
                                size="sm"
                                onClick={handleSubscribe}
                            >
                                {isSubscribed ? (
                                    <>
                                        <Bell className="mr-2 h-4 w-4" /> Subscribed
                                    </>
                                ) : (
                                    'Subscribe'
                                )}
                            </Button>
                        )}
                        
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-300 hover:bg-gray-700 hover:text-white"
                            onClick={handleShare}
                        >
                            <Share2 className="mr-2 h-4 w-4" /> Share
                        </Button>
                    </div>
                </div>
            </div>

            {/* Description and Video Quality */}
            <Card className="mt-4 bg-gray-800 border-gray-700 shadow-lg overflow-hidden">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-300">
                            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center">
                            <span className="text-sm text-gray-300 mr-2">Quality:</span>
                            <Select value={currentQuality} onValueChange={handleQualityChange}>
                                <SelectTrigger className="w-[120px] bg-gray-700 border-gray-600 text-white">
                                    <SelectValue placeholder="Select quality" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                                    {qualities.map((quality) => (
                                        <SelectItem key={quality.value} value={quality.value}>
                                            {quality.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    <div className="text-gray-200">
                        <h2 className="font-semibold text-white mb-2">Description</h2>
                        <div className="prose prose-invert max-w-none">
                            <RenderDescription description={video.description} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

