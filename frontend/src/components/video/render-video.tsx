'use client'

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { getAwsUrl, getThumbnailAwsUrl } from '@/utils/get-aws-url';
import { VideoType } from '@/lib/types/video-type';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Share2, MoreHorizontal, Bell } from 'lucide-react'
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
    const [isExpanded, setIsExpanded] = useState(false);
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
                    console.log("availableQualities", availableQualities)
                    console.log("HLS", hlsInstance)
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
            console.log("response", response.data)
            console.log("cooool", response.data.isSubscribed)
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

    if (!isLoaded) return null;
    return (
        <div className="max-w-4xl mx-auto mt-8">
            <div className="relative pt-[56.25%]">
                <video
                    ref={videoRef}
                    controls
                    className="absolute top-0 left-0 w-full h-full"
                    poster={thumbnailUrl}
                ></video>
            </div>

            <div className="mt-4">
                <h1 className="text-2xl font-bold">{video.title}</h1>
                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src={creatorData.imageUrl} />
                            <AvatarFallback>{creatorData.fullName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{creatorData.fullName}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(video.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-black">
                        <p className="text-xs text-gray-200">{subscriberCount} Subscribers</p>
                        <Button
                            variant={isSubscribed ? "secondary" : "default"}
                            className={`${isSubscribed ? "bg-gray-200" : "bg-red-500"} ${creatorData.id === user?.id ? "hidden" : ""}`}
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
                        {/* <Button variant="outline" size="sm" onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast({
                                title: 'URL copied to clipboard!',
                                description: 'You can now share the link to of this video with your friends!',
                            });
                        }}>
                            <Share2 className="mr-2 h-4 w-4" /> Share
                        </Button> */}

                    </div>
                </div>
            </div>

            <Card className="mt-4">
                <CardContent className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold">Description</p>
                        <Select value={currentQuality} onValueChange={handleQualityChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select quality" />
                            </SelectTrigger>
                            <SelectContent>
                                {qualities.map((quality) => (
                                    <SelectItem key={quality.value} value={quality.value}>
                                        {quality.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <RenderDescription description={video.description} />
                </CardContent>
            </Card>
        </div>
    );
};

