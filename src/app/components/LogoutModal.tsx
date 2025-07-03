'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    if (!isOpen) return null;

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await fetch('/api/auth/logout', { method: 'GET' });
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Logout</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to log out of your account?</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoggingOut}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition disabled:opacity-50"
                    >
                        {isLoggingOut ? 'Logging out...' : 'Log out'}
                    </button>
                </div>
            </div>
        </div>
    );
} 