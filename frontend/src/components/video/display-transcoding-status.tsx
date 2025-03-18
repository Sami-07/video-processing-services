'use client'

import React, { useEffect, useState } from 'react';
import { Loader2, PlayCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DisplayTranscodingStatus({ jobId }: { jobId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        pollTranscodingStatus(jobId);
    }, [jobId]);

    const fetchTranscodingStatus = async (jobId: string) => {
        const response = await fetch(`/api/transcoding-status?jobId=${jobId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch status");
        }
        return await response.json();
    };

    const pollTranscodingStatus = async (jobId: string) => {
        setLoading(true);

        try {
            // Polling for status
            const intervalId = setInterval(async () => {
                const statusResponse = await fetchTranscodingStatus(jobId);
                
                // Set the status message
                setStatus(statusResponse.status);

                // Check if complete or error
                if (statusResponse.status === "Your video is ready to be played" || 
                    statusResponse.status === "Transcoding Completed") {
                    setIsCompleted(true);
                    clearInterval(intervalId);
                    setLoading(false);
                } else if (statusResponse.status.startsWith("Error")) {
                    setHasError(true);
                    clearInterval(intervalId);
                    setLoading(false);
                }
            }, 3000);
        } catch (error) {
            console.error("Error:", error);
            setStatus("Error occurred during transcoding.");
            setHasError(true);
            setLoading(false);
        }
    };

    const handleWatchVideo = () => {
        if (jobId) {
            router.push(`/watch/${jobId}?videoKey=${jobId}`);
        }
    };

    const handleGoHome = () => {
        router.push('/');
    };

    return (
        <div className="flex items-center justify-center p-4 min-h-screen bg-gray-900">
            <Card className="w-full max-w-md shadow-lg border-gray-700 bg-gray-800 text-gray-100">
                <CardHeader>
                    <CardTitle className="text-center flex items-center justify-center gap-2 text-white">
                        {hasError ? (
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        ) : isCompleted ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                            <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                        )}
                        Video Processing
                    </CardTitle>
                    <CardDescription className="text-center text-gray-400">
                        {hasError ? 
                            "There was an error processing your video" : 
                            isCompleted ? 
                                "Your video is ready to watch!" : 
                                "Your video is being processed. Please wait..."}
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="flex justify-center items-center py-10">
                    {!hasError && !isCompleted && (
                        <Loader2 className="h-16 w-16 animate-spin text-blue-400" />
                    )}
                    
                    {hasError && (
                        <AlertTriangle className="h-16 w-16 text-red-500" />
                    )}
                    
                    {isCompleted && (
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    )}
                </CardContent>
                
                <CardFooter className="flex justify-center gap-3">
                    {isCompleted ? (
                        <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleWatchVideo}>
                            <PlayCircle className="h-4 w-4" />
                            Watch Video
                        </Button>
                    ) : (
                        <Button variant="secondary" className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200" onClick={handleGoHome}>
                            Go Home
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
