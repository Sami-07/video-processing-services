import React from 'react'
import Navbar from '@/components/navbar'
import DashboardContent from '@/components/dashboard/dashboard-content'

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-gray-900">
    
      <div className="container mx-auto">
        <DashboardContent />
        <main>{children}</main>
      </div>
    </div>
  )
}
