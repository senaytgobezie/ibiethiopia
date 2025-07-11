'use client';

import Link from 'next/link';
import Header from '../components/Header';

export default function AccessDenied() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <div className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)] p-4">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-red-100 p-3 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-3">Access Denied</h1>
                    <p className="text-gray-600 mb-6">
                        You don&apos;t have permission to access this area. Please contact an administrator if you believe this is an error.
                    </p>

                    <div className="flex flex-col space-y-3">
                        <Link href="/" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition">
                            Return to Home
                        </Link>
                        <Link href="/login" className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                            Login with Different Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 