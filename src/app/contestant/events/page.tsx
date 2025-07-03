'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Image from 'next/image';

// Sample events data
const eventsList = [
    {
        id: 1,
        date: '6-14-2025',
        title: 'Orientation & Kickoff Event',
        description: 'Meet fellow contestants, learn more about the competition journey, and get inspired by past winners and judges.'
    },
    {
        id: 2,
        title: 'Skill-Based Challenges',
        description: 'Participate in category-specific creative challenges to showcase your talent in real time. These may include timed makeovers, themed nail/fashion looks, or hair styling challenges.'
    },
    {
        id: 3,
        title: 'Mentorship Sessions',
        description: 'Join exclusive workshops led by industry experts covering artistry, branding, and cultural representation in the beauty space.'
    },
    {
        id: 4,
        title: 'Weekly Check-ins & Submissions',
        description: 'Receive feedback and track your growth. Submit updated work each week for review and scoring.'
    }
];

export default function EventsPage() {
    return (
        <div className="min-h-screen bg-white flex flex-row">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left column - Timeline */}
                        <div className="w-full md:w-1/2">
                            <h1 className="text-3xl font-heading font-bold mb-6 text-primary">Contest Program Activities</h1>
                            <h2 className="text-2xl font-heading mb-6">What to Expect</h2>

                            <div className="relative pl-8">
                                {/* Timeline line */}
                                <div className="absolute left-0 top-2 bottom-0 w-px bg-gray-300"></div>

                                {/* Timeline events */}
                                {eventsList.map((event, index) => (
                                    <div key={event.id} className="mb-10 relative">
                                        {/* Timeline dot */}
                                        <div className="absolute -left-3 top-2 w-6 h-6 rounded-full bg-black"></div>

                                        {index === 0 && event.date && (
                                            <div className="text-gray-500 mb-1">{event.date}</div>
                                        )}

                                        <h3 className="text-xl font-bold mb-2">{event.id}. {event.title}</h3>
                                        <p className="text-gray-700">{event.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right column - Banner */}
                        <div className="w-full md:w-1/2 bg-amber-700 p-8 flex items-center justify-center">
                            <div className="text-center">
                                <h2 className="text-5xl font-heading font-bold text-black mb-4">Contest<br />Program<br />Activities</h2>
                                <p className="text-black mt-8">
                                    During this stage, selected contestants engage in category-specific challenges,
                                    mentorship sessions, and creative tasks. It's your time to grow, shine, and stand out.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional information section */}
                    <div className="mt-12 bg-black rounded-2xl shadow-2xl border border-accent p-8 text-white">
                        <h2 className="text-2xl font-heading font-bold mb-6 text-accent">Preparing for Success</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-bold mb-3 text-primary">What to Bring</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Your personal tools and equipment</li>
                                    <li>Portfolio of your previous work</li>
                                    <li>Notebook for workshop notes</li>
                                    <li>Professional attire for networking events</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3 text-primary">Important Dates</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><span className="font-bold">June 14, 2025:</span> Orientation Day</li>
                                    <li><span className="font-bold">July 1, 2025:</span> First Challenge Submission</li>
                                    <li><span className="font-bold">August 15, 2025:</span> Mentorship Workshop</li>
                                    <li><span className="font-bold">September 30, 2025:</span> Final Presentations</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 