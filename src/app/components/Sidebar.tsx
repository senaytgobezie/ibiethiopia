'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LogoutModal from './LogoutModal';

interface SidebarProps {
    onToggle?: (collapsed: boolean) => void;
}

export default function Sidebar({ onToggle }: SidebarProps) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Call the onToggle callback whenever the sidebar state changes
    useEffect(() => {
        if (onToggle) {
            onToggle(isCollapsed);
        }
    }, [isCollapsed, onToggle]);

    return (
        <>
            {/* Collapsed sidebar - only shows when collapsed */}
            {isCollapsed && (
                <div className="w-16 min-h-screen bg-black text-white flex flex-col py-6 px-2 shadow-lg items-center fixed">
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="text-gray-400 hover:text-white mb-6"
                        aria-label="Expand sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                    <Image src="/images/logo transparent.png" alt="IBI Ethiopia Logo" width={40} height={40} className="mb-6" />
                    <nav className="flex flex-col gap-6 w-full items-center">
                        <Link href="/contestant/profile" className="hover:text-accent transition" title="Profile">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Link>
                        <Link href="/contestant/your-work" className="hover:text-accent transition" title="Your Work">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </Link>
                        <Link href="/contestant/ratings" className="hover:text-accent transition" title="Ratings">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </Link>
                        <Link href="/contestant/notices" className="hover:text-accent transition" title="Notice Board">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </Link>
                        <Link href="/contestant/events" className="hover:text-accent transition" title="Upcoming Events">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </Link>
                        <Link href="/contestant/submit" className="hover:text-accent transition" title="Submit New Work">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </Link>
                    </nav>
                    <div className="mt-auto pt-6">
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="text-red-400 hover:text-red-300 transition"
                            title="Logout"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Full sidebar - only shows when expanded */}
            {!isCollapsed && (
                <aside className="w-64 min-h-screen bg-black text-white flex flex-col py-10 px-6 gap-6 shadow-lg items-center fixed">
                    <div className="w-full flex justify-between items-center mb-6">
                        <Image src="/images/logo transparent.png" alt="IBI Ethiopia Logo" width={90} height={90} />
                        <button
                            onClick={() => setIsCollapsed(true)}
                            className="text-gray-400 hover:text-white"
                            aria-label="Collapse sidebar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <h2 className="text-xl w-full text-left font-bold text-accent mb-6">Contestant Menu</h2>
                    <nav className="flex flex-col gap-4 w-full">
                        <Link href="/contestant/profile" className="hover:text-accent transition text-lg font-medium">Profile</Link>
                        <Link href="/contestant/your-work" className="hover:text-accent transition text-lg font-medium">Your Work</Link>
                        <Link href="/contestant/ratings" className="hover:text-accent transition text-lg font-medium">Ratings</Link>
                        <Link href="/contestant/notices" className="hover:text-accent transition text-lg font-medium">Notice Board</Link>
                        <Link href="/contestant/events" className="hover:text-accent transition text-lg font-medium">Upcoming Events</Link>
                        <Link href="/contestant/submit" className="hover:text-accent transition text-lg font-medium">Submit New Work</Link>
                    </nav>

                    <div className="mt-auto pt-6 w-full border-t border-gray-800">
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="flex items-center text-red-400 hover:text-red-300 transition text-lg font-medium w-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </aside>
            )}

            {/* Logout Confirmation Modal */}
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
            />
        </>
    );
}
