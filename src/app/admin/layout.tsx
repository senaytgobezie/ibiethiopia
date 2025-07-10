'use client';
import "../global.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-hero flex flex-col">
            {children}
        </div>
    );
} 