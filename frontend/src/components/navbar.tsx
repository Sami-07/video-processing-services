'use client'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link';
import { searchAtom, hasSearchedAtom } from '@/atoms/atoms';
import { useAtom } from 'jotai';
import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { user, isLoaded } = useUser();
    const [search, setSearch] = useAtom(searchAtom);
    const router = useRouter();
    if (!isLoaded) return null;

    return (
        <nav className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 shadow-lg">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="text-white text-2xl font-extrabold mb-4 md:mb-0">MyTube</div>
                <div className="space-x-6 flex flex-row items-center">
                    <input type="text" placeholder="Search" className="border-2 w-[400px] border-gray-300 rounded-md p-2 text-gray-900" value={search} onChange={(e) => {
                        setSearch(e.target.value);
                        
                    }} />
                    <button className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md flex flex-row items-center gap-2" onClick={() => {
                       
                        router.push(`/dashboard/all-videos/search?search=${search}`);
                    }}>Search <SearchIcon className="w-4 h-4" /></button>
                    <UserButton appearance={{
                        elements: {
                            avatarBox: "h-9 w-9"
                        }
                    }} />
                    <Link href={`/profile/${user?.id}`}>Profile</Link>
                    <Link href={`/dashboard/all-videos`}>All Videos</Link>
                </div>
            </div>
        </nav>
    )
}
