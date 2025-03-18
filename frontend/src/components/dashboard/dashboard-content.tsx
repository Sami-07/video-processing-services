'use client'

import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import UploadVideo from '../profile/upload-video'

export default function DashboardContent() {
    const pathname = usePathname()
    const tabs = [
        {
            name: "All Videos",
            href: "/dashboard/all-videos",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M9 8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                </svg>
            )
        },
       
       
    ];

    return (
        <div className="mt-6 mb-8">
            <div className="flex overflow-x-auto no-scrollbar py-2">
                <div className="flex gap-2 mx-auto">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap
                                    ${isActive 
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'}
                                `}
                            >
                                <span className={`${isActive ? 'text-white' : 'text-gray-400'}`}>
                                    {tab.icon}
                                </span>
                                <span className="font-medium text-sm">{tab.name}</span>
                            </Link>
                        );
                    })}
                   
                </div>
            </div>
        </div>
    );
}

