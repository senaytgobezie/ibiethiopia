'use client'

import Link from 'next/link'
import Header from '@/app/components/Header'

export default function ErrorPage() {
    return (
        <div className="min-h-screen relative bg-black overflow-hidden">
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black opacity-70 z-10" />
            <div className="relative z-20 w-full">
                <div style={{ margin: 0 }}>
                    <Header />
                </div>
                <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
                    <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md text-center">
                        <h1 className="text-2xl font-semibold text-red-600 mb-6">Error</h1>

                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            <p>
                                Sorry, something went wrong. This could be due to an authentication error or
                                an issue with your request.
                            </p>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <Link
                                href="/login"
                                className="block w-full bg-primary text-white py-2 rounded hover:bg-yellow-600 transition text-center"
                            >
                                Return to Login
                            </Link>
                            <Link
                                href="/"
                                className="block w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition text-center"
                            >
                                Go to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}