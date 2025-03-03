import React from 'react'
import Navbar from '@/components/navbar'
import DashboardContent from '@/components/dashboard/dashboard-content'
export default function layout({children}: {children: React.ReactNode}) {
  return (
    <>
    
    <DashboardContent/>
    {children}
    </>
  )
}
