'use client'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser, UserButton, SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link';
import { searchAtom, hasSearchedAtom } from '@/atoms/atoms';
import { useAtom } from 'jotai';
import { useRouter, usePathname } from 'next/navigation';
import UploadVideo from './profile/upload-video';
import { Button } from '@/components/ui/button';

export default function Navbar() {
    const { user, isLoaded } = useUser();
    const [search, setSearch] = useAtom(searchAtom);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    if (!isLoaded) return null;

    const handleSearch = () => {
        if (search.trim()) {
            router.push(`/dashboard/all-videos/search?search=${encodeURIComponent(search.trim())}`);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const scrollToSection = (sectionId: string) => {
        if (!isHomePage) {
            router.push(`/#${sectionId}`);
            return;
        }

        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-lg backdrop-blur-sm bg-opacity-90">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo and site name */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-1.5 rounded-md shadow-md group-hover:shadow-blue-500/40 transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="23 7 16 12 23 17 23 7" />
                                    <rect width="15" height="14" x="1" y="5" rx="2" ry="2" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">MyTube</span>
                        </Link>
                    </div>

                    {/* Navigation links - shown for logged out users on landing page */}
                    <SignedOut>
                        <div className="hidden md:flex items-center space-x-8">
                            <button 
                                onClick={() => scrollToSection('features')}
                                className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
                            >
                                Features
                            </button>
                            <button 
                                onClick={() => scrollToSection('architecture')}
                                className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
                            >
                                Architecture
                            </button>
                            <button 
                                onClick={() => scrollToSection('tech-stack')}
                                className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
                            >
                                Tech Stack
                            </button>
                        </div>
                    </SignedOut>

                    <SignedIn>
                    {/* Search bar - hidden on mobile */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-4">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search videos..."
                                className="w-full px-4 py-2 pl-10 border border-gray-700 rounded-full bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-white placeholder-gray-400"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                        </div>
                    </div>
                    </SignedIn>
                    
                    {/* Auth, Navigation links and profile */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <SignedOut>
                            <Link 
                                href="/sign-up"
                                className="hidden md:inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-full font-medium shadow-md hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
                            >
                                Sign Up
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                                </svg>
                            </Link>
                        </SignedOut>
                        
                        {/* Mobile menu button */}
                        <button 
                            className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                            )}
                        </button>
                        
                        <SignedIn>
                            <UploadVideo />
                            
                            <Link 
                                href={`/profile/${user?.id}`}
                                className="hidden md:flex items-center gap-1.5 text-gray-300 hover:text-blue-400 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span className="text-sm">Profile</span>
                            </Link>
                        </SignedIn>
                        
                        <UserButton appearance={{
                            elements: {
                                avatarBox: "h-9 w-9"
                            }
                        }} />
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-3 pb-2 space-y-3">
                        <SignedOut>
                            <div className="flex flex-col space-y-3 pt-3 border-t border-gray-700">
                                <button 
                                    onClick={() => {
                                        scrollToSection('features');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="text-gray-300 hover:text-blue-400 transition-colors py-2 text-left"
                                >
                                    Features
                                </button>
                                <button 
                                    onClick={() => {
                                        scrollToSection('architecture');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="text-gray-300 hover:text-blue-400 transition-colors py-2 text-left"
                                >
                                    Architecture
                                </button>
                                <button 
                                    onClick={() => {
                                        scrollToSection('tech-stack');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="text-gray-300 hover:text-blue-400 transition-colors py-2 text-left"
                                >
                                    Tech Stack
                                </button>
                                
                                <Link 
                                    href="/sign-up" 
                                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md font-medium mt-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign Up
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                                    </svg>
                                </Link>
                            </div>
                        </SignedOut>

                        <SignedIn>
                            {/* Mobile search bar */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search videos..."
                                    className="w-full px-4 py-2 pl-10 border border-gray-700 rounded-full bg-gray-800 focus:outline-none text-white placeholder-gray-400"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </div>
                                <button 
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                                    onClick={handleSearch}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Mobile profile link */}
                            <div className="mt-3 pt-3 border-t border-gray-700">
                                <Link 
                                    href={`/profile/${user?.id}`}
                                    className="flex items-center gap-1.5 text-gray-300 hover:text-blue-400 transition-colors py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    <span>Profile</span>
                                </Link>
                            </div>
                        </SignedIn>
                    </div>
                )}
            </div>
        </nav>
    );
}
