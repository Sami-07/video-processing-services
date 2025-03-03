'use client'

import React from 'react'
import dynamic from 'next/dynamic'
const AllVideos = dynamic(() => import('@/components/dashboard/all-videos-component'), { ssr: false });
export default function page() {
  return (
    <AllVideos />
  )
}
