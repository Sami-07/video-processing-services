'use client'

import React, { useEffect, useState } from 'react';
export default function DisplayTranscodingStatus({ jobId }: { jobId: string }) {

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');


    useEffect(() => {
        pollTranscodingStatus(jobId)
    }, [])

    const loadingMessges = {
        "Your video is ready to be played": "Your video is ready to be played",
        "Transcoding Completed": "Transcoding Completed",
        "Error": "Error occurred during transcoding."
    }


    const fetchTranscodingStatus = async (jobId: string) => {
        const response = await fetch(`/api/transcoding-status?jobId=${jobId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch status");
        }
        return await response.json();
    };

    const pollTranscodingStatus = async (jobId: string) => {


        setLoading(true);
        setStatus('');

        try {

            let statusResponse;

            // Polling for status
            const intervalId = setInterval(async () => {
                statusResponse = await fetchTranscodingStatus(jobId);
                if (statusResponse.status === "Your video is being transcoded for 360p" || statusResponse.status === "Your video is being transcoded for 480p" || statusResponse.status === "Your video is being transcoded for 720p") {
                    setStatus(`Transcoding Status: Your video is being transcoded`);
                } else {
                    setStatus(`Transcoding Status: ${statusResponse.status}`);
                }


                if (statusResponse.status === "Transcoding Completed" || statusResponse.status.startsWith("Error")) {
                    clearInterval(intervalId);
                    setLoading(false);
                }
            }, 3000);

        } catch (error) {
            console.error("Error:", error);
            setStatus("Error occurred during transcoding.");
            setLoading(false);
        }
    };


    return (
        <div className="flex flex-col items-center justify-center p-4 text-center min-h-screen">

            {status &&  <div className="text-lg text-white mt-2">{status}</div>}
        </div>
    );
};
