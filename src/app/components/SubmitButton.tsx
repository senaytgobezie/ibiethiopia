'use client';
import Link from 'next/link';

export default function SubmitButton() {
    return (
        <Link href="/contestant/submit">
            <button className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition font-heading text-lg shadow-lg tracking-wide mb-4">
                Submit Your Work
            </button>
        </Link>
    );
} 