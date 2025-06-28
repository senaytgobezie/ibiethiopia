'use client'

import Link from 'next/link'
import Header from '@/app/components/Header'

export default function ConfirmationPage() {
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
                        <h1 className="text-2xl font-semibold text-primary mb-6">Check Your Email</h1>

                        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
                            <p>
                                We&apos;ve sent a confirmation link to your email address.
                                Please check your inbox and click the link to complete your registration.
                            </p>
                        </div>

                        <p className="text-gray-600 mb-6">
                            If you don&apos;t see the email, check your spam folder or try again.
                        </p>

                        <div className="flex flex-col space-y-4">
                            <Link
                                href="/login"
                                className="block w-full bg-primary text-white py-2 rounded hover:bg-yellow-600 transition text-center"
                            >
                                Return to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 