import React from 'react';
import Navbar from '@/components/navbar';
import ClientVideoPlayer from '@/components/video/client-video-player';

// Server component
export default async function WatchPage({ params }: { params: { videoId: string } }) {
  const { videoId } = await params;

  return (
    <div className="min-h-screen bg-gray-900">
  
      <ClientVideoPlayer videoId={videoId} />
    </div>
  );
}
