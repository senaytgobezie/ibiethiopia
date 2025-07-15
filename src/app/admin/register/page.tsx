'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';

export default function AdminRegister() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/admin/register', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Registration failed');
                setIsLoading(false);
                return;
            }

            setSuccess('Admin account created successfully! Redirecting to login...');
            setTimeout(() => {
                router.push('/admin/login');
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen relative bg-black overflow-hidden">
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black opacity-70 z-10" />
            <div className="relative z-20 w-full">
                <div style={{ margin: 0 }}>
                    <Header />
                </div>
                <div className="flex min-h-[calc(100vh-80px)] bg-hero items-center justify-center">
                    <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                        <h1 className="text-2xl text-center font-semibold text-primary mb-6">Admin Registration</h1>
                        <p className="text-sm text-center text-gray-600 mb-4">
                            Create a new admin account
                        </p>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                {success}
                            </div>
                        )}

                        <form action={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    className="w-full p-2 mt-1 rounded bg-background border border-accent text-text"
                                    type="text"
                                    name="name"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    className="w-full p-2 mt-1 rounded bg-background border border-accent text-text"
                                    type="email"
                                    name="email"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    className="w-full p-2 mt-1 rounded bg-background border border-accent text-text"
                                    type="password"
                                    name="password"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    className="w-full p-2 mt-1 rounded bg-background border border-accent text-text"
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                className="w-full bg-primary text-white py-2 rounded hover:bg-yellow-600 transition disabled:opacity-50"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating account...' : 'Create Admin Account'}
                            </button>
                        </form>

                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href="/login" className="text-primary hover:underline">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 