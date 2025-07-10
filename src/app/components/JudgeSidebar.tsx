'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LogoutModal from './LogoutModal';

interface SidebarProps {
    onToggle?: (collapsed: boolean) => void;
}

export default function JudgeSidebar({ onToggle }: SidebarProps) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Auto-collapse sidebar on small screens
    useEffect(() => {
        const handleResize = () => {
            const shouldCollapse = window.innerWidth < 768;
            setIsCollapsed(shouldCollapse);
            if (onToggle) {
                onToggle(shouldCollapse);
            }
        };

        // Set initial state
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, [onToggle]);

    // Call the onToggle callback whenever the sidebar state changes manually
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
                        className="text-gray-400 hover:text-white mb-6 md:block hidden"
                        aria-label="Expand sidebar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                    <Image src="/images/logo transparent.png" alt="IBI Ethiopia Logo" width={40} height={40} className="mb-6" />
                    <nav className="flex flex-col gap-6 w-full items-center">
                        <Link href="/judges/profile" className="hover:text-accent transition" title="Profile">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Link>
                        <Link href="/judges/submissions" className="hover:text-accent transition" title="Submissions">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </Link>
                        <Link href="/judges/notices" className="hover:text-accent transition" title="Notice Board">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </Link>
                        <Link href="/judges/events" className="hover:text-accent transition" title="Upcoming Events">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </Link>
                        <Link href="/judges/reports" className="hover:text-accent transition" title="Reports">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                <aside className="w-64 min-h-screen bg-black text-white flex flex-col py-10 px-6 gap-6 shadow-lg items-center fixed hidden md:flex">
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
                    <h2 className="text-xl w-full text-left font-bold text-accent mb-6">Judge Menu</h2>
                    <nav className="flex flex-col gap-4 w-full">
                        <Link href="/judges/profile" className="hover:text-accent transition text-lg font-medium">Profile</Link>
                        <Link href="/judges/submissions" className="hover:text-accent transition text-lg font-medium">Submissions</Link>
                        <Link href="/judges/notices" className="hover:text-accent transition text-lg font-medium">Notice Board</Link>
                        <Link href="/judges/events" className="hover:text-accent transition text-lg font-medium">Upcoming Events</Link>
                        <Link href="/judges/reports" className="hover:text-accent transition text-lg font-medium">Reports</Link>
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