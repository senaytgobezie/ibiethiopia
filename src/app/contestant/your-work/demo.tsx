'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';
import StarRating from '../../components/StarRating';
import { sampleSubmissions } from './sample-data';

export default function YourWorkDemoPage() {
    const [submissions] = useState(sampleSubmissions);

    return (
        <div className="min-h-screen bg-white flex flex-row">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-heading font-bold text-primary">Your Submitted Work</h1>
                        <div className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded">Demo Mode</div>
                    </div>

                    {submissions.length === 0 ? (
                        <div className="bg-black rounded-2xl shadow-2xl border border-accent p-8 text-white text-center">
                            <p className="text-lg mb-4">You don&apos;t have any submissions yet.</p>
                            <Link href="/contestant/submit" className="bg-primary text-white py-2 px-4 rounded hover:bg-yellow-600 transition">
                                Submit Your First Work
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {submissions.map((submission) => (
                                <div key={submission.id} className="bg-black rounded-2xl shadow-2xl border border-accent overflow-hidden">
                                    <div className="relative h-64 w-full bg-gray-800 flex items-center justify-center">
                                        {submission.publicUrl ? (
                                            <Image
                                                src={submission.publicUrl}
                                                alt={submission.title}
                                                width={300}
                                                height={300}
                                                style={{ objectFit: 'contain' }}
                                                priority={false}
                                            />
                                        ) : (
                                            <div className="text-gray-400">No image available</div>
                                        )}
                                    </div>
                                    <div className="p-6 text-white">
                                        <h2 className="text-xl font-bold text-accent mb-2">{submission.title}</h2>
                                        <p className="text-gray-300 mb-4">{submission.description}</p>

                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-sm text-gray-400">Status: </span>
                                                <span className={`font-medium ${submission.status === 'approved' ? 'text-green-400' :
                                                    submission.status === 'rejected' ? 'text-red-400' :
                                                        'text-yellow-400'
                                                    }`}>
                                                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {new Date(submission.submitted_at).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {submission.status === 'approved' && (
                                            <div className="mt-4 border-t border-gray-700 pt-4">
                                                <div className="flex items-center">
                                                    <span className="text-sm text-gray-400 mr-2">Rating:</span>
                                                    {submission.rating ? (
                                                        <div className="flex items-center">
                                                            <StarRating rating={submission.rating} />
                                                            <span className="ml-2 text-yellow-400 font-bold">{submission.rating.toFixed(1)}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Not yet rated</span>
                                                    )}
                                                </div>

                                                {submission.judge_comments && (
                                                    <div className="mt-3">
                                                        <h4 className="text-sm text-gray-400 mb-1">Judge Feedback:</h4>
                                                        <p className="text-white text-sm bg-gray-800 p-3 rounded border border-gray-700">
                                                            {submission.judge_comments}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {submission.status === 'rejected' && submission.judge_comments && (
                                            <div className="mt-4 border-t border-gray-700 pt-4">
                                                <div className="mt-3">
                                                    <h4 className="text-sm text-gray-400 mb-1">Feedback:</h4>
                                                    <p className="text-white text-sm bg-gray-800 p-3 rounded border border-gray-700">
                                                        {submission.judge_comments}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <Link href="/contestant/submit" className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-yellow-600 transition inline-block">
                            Submit New Work
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
} 