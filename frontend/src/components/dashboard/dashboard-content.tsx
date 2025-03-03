'use client'

import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'

export default function DashboardContent() {
    const pathname = usePathname()
    const tabs = [
        {
            name: "All Videos",
            href: "/dashboard/all-videos",
        },
        {
            name: "Subscribed Videos",
            href: "/dashboard/subscribed-videos",
        },
    ]

    return (
        <div className='mt-10'>
            
        </div>
        // <nav className="flex flex-row space-y-0 space-x-4 bg-white shadow rounded-lg p-2 mb-4 mt-2">
        //     {tabs.map((tab) => (
        //         <Link
        //             key={tab.name}
        //             href={tab.href}
        //             className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
        //                 ${pathname === tab.href
        //                     ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
        //                     : 'text-gray-200 hover:bg-gray-100 hover:text-gray-900'
        //                 }
        //             `}
        //         >
        //             {tab.name}
        //         </Link>
        //     ))}
        // </nav>
    )
}

