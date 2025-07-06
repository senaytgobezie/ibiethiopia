'use client';

import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';

interface ContestantLayoutProps {
    children: ReactNode;
}

export default function ContestantLayout({ children }: ContestantLayoutProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Listen for sidebar state changes from the Sidebar component
    const handleSidebarToggle = (collapsed: boolean) => {
        setIsSidebarCollapsed(collapsed);
    };

    return (
        <div className="min-h-screen bg-white flex flex-row">
            <Sidebar onToggle={handleSidebarToggle} />
            <main className={`flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'md:ml-64'}`}>
                {children}
            </main>
        </div>
    );
} 