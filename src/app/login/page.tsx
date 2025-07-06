'use client';
// import { supabase } from '@/utils/supabaseClient';
// import { useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import { login } from './actions';

function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/contestant';

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        try {
            // Call the server action
            await login(formData, redirectUrl);
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl text-center font-semibold text-primary mb-6">Contestant Login</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form action={handleSubmit} className="space-y-4">
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
                    />
                </div>

                <button
                    className="w-full bg-primary text-white py-2 rounded hover:bg-yellow-600 transition disabled:opacity-50"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-primary hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <div className="min-h-screen relative bg-black overflow-hidden">
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black opacity-70 z-10" />
            <div className="relative z-20 w-full">
                <div style={{ margin: 0 }}>
                    <Header />
                </div>
                <div className="flex min-h-[calc(100vh-80px)] bg-hero items-center justify-center">
                    <Suspense fallback={<div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md text-center">Loading...</div>}>
                        <LoginForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
