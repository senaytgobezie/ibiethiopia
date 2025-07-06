'use client';

import { useState } from 'react';
import ContestantLayout from '../../components/ContestantLayout';
import Link from 'next/link';

// Sample events data with more details
const eventsList = [
    {
        id: 1,
        date: 'June 14, 2025',
        time: '10:00 AM - 2:00 PM',
        title: 'Orientation & Kickoff Event',
        description: 'Meet fellow contestants, learn more about the competition journey, and get inspired by past winners and judges.',
        location: 'IBI Main Hall, Addis Ababa',
        image: '/images/logo transparent.png',
        category: 'Main Event',
        featured: true
    },
    {
        id: 2,
        date: 'July 1, 2025',
        time: '9:00 AM - 12:00 PM',
        title: 'Skill-Based Challenge: Cultural Fusion',
        description: 'Participate in our first category-specific creative challenge to showcase your talent in real time. Create a look that blends traditional and modern elements.',
        location: 'IBI Studio A',
        image: '/images/logo transparent.png',
        category: 'Challenge'
    },
    {
        id: 3,
        date: 'July 15, 2025',
        time: '2:00 PM - 5:00 PM',
        title: 'Mentorship Session with Maria Johnson',
        description: 'Join an exclusive workshop led by industry expert Maria Johnson covering advanced makeup techniques and cultural representation in the beauty space.',
        location: 'Virtual Session',
        image: '/images/logo transparent.png',
        category: 'Workshop'
    },
    {
        id: 4,
        date: 'August 5, 2025',
        time: '10:00 AM - 1:00 PM',
        title: 'Skill-Based Challenge: Avant-Garde',
        description: 'Push your creative boundaries with our avant-garde challenge. Create a bold, experimental look that showcases your unique artistic vision.',
        location: 'IBI Studio B',
        image: '/images/logo transparent.png',
        category: 'Challenge'
    },
    {
        id: 5,
        date: 'August 20, 2025',
        time: '3:00 PM - 6:00 PM',
        title: 'Industry Networking Event',
        description: 'Connect with industry professionals, potential sponsors, and fellow contestants in this exclusive networking opportunity.',
        location: 'Skylight Hotel, Addis Ababa',
        image: '/images/logo transparent.png',
        category: 'Networking'
    },
    {
        id: 6,
        date: 'September 30, 2025',
        time: '6:00 PM - 10:00 PM',
        title: 'Final Showcase & Awards Ceremony',
        description: 'The culmination of your journey! Present your final work to our panel of judges and celebrate the achievements of all contestants.',
        location: 'National Theatre, Addis Ababa',
        image: '/images/logo transparent.png',
        category: 'Main Event',
        featured: true
    }
];

// Function to format date for timeline display
const formatDateForTimeline = (dateString: string) => {
    const date = new Date(dateString);
    return {
        day: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' })
    };
};

export default function EventsPage() {
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter events based on category and search query
    const filteredEvents = eventsList.filter(event => {
        const matchesCategory = filter === 'all' || event.category.toLowerCase() === filter.toLowerCase();
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Get featured events
    const featuredEvents = eventsList.filter(event => event.featured);

    // Get unique categories for filter
    const categories = ['all', ...new Set(eventsList.map(event => event.category.toLowerCase()))];

    return (
        <ContestantLayout>
            <div className="w-full max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="mb-12 bg-gradient-to-r from-amber-700 to-amber-900 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
                        <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Upcoming Events</h1>
                            <p className="text-amber-100 text-lg">
                                Join us for these exciting events designed to showcase your talent, build your skills,
                                and connect you with industry professionals.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{eventsList.length} Events Scheduled</span>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                    </svg>
                                    <span>Networking Opportunities</span>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/3 flex justify-center">
                            <div className="w-40 h-40 md:w-52 md:h-52 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-2xl md:text-3xl font-bold text-white">IBI Events</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 whitespace-nowrap">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setFilter(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === category
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Events */}
                {filter === 'all' && searchQuery === '' && featuredEvents.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Featured Events</h2>
                        <div className="grid grid-cols-1 gap-6">
                            {featuredEvents.map(event => (
                                <div key={event.id} className="bg-gradient-to-r from-amber-700 to-amber-900 rounded-xl overflow-hidden shadow-lg">
                                    <div className="p-6 flex flex-col md:flex-row items-center">
                                        <div className="md:w-1/4 flex justify-center mb-6 md:mb-0">
                                            <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center">
                                                <span className="text-3xl font-bold text-amber-700">{formatDateForTimeline(event.date).day}</span>
                                                <span className="text-sm font-medium text-amber-700">{formatDateForTimeline(event.date).month}</span>
                                            </div>
                                        </div>
                                        <div className="md:w-3/4 text-white">
                                            <div className="flex items-center mb-2">
                                                <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full mr-2">{event.category}</span>
                                                <span className="text-amber-200 text-sm">{event.time}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                                            <p className="text-amber-100 mb-4">{event.description}</p>
                                            <div className="flex items-center text-amber-200">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span>{event.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Timeline View */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Event Timeline</h2>
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                        {/* Timeline events */}
                        <div className="space-y-8">
                            {filteredEvents.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">No events found matching your criteria.</p>
                                </div>
                            ) : (
                                filteredEvents.map(event => (
                                    <div key={event.id} className="relative pl-16 sm:pl-24">
                                        {/* Date circle */}
                                        <div className="absolute left-0 top-0 w-8 h-8 sm:w-12 sm:h-12 bg-amber-600 rounded-full flex flex-col items-center justify-center text-white">
                                            <span className="text-xs sm:text-sm font-bold">{formatDateForTimeline(event.date).day}</span>
                                            <span className="text-xs">{formatDateForTimeline(event.date).month}</span>
                                        </div>

                                        {/* Event card */}
                                        <div className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${event.category === 'Main Event' ? 'border-amber-600' :
                                            event.category === 'Challenge' ? 'border-green-500' :
                                                event.category === 'Workshop' ? 'border-blue-500' :
                                                    'border-purple-500'
                                            }`}>
                                            <div className="p-6">
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${event.category === 'Main Event' ? 'bg-amber-100 text-amber-800' :
                                                        event.category === 'Challenge' ? 'bg-green-100 text-green-800' :
                                                            event.category === 'Workshop' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-purple-100 text-purple-800'
                                                        }`}>{event.category}</span>
                                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">{event.time}</span>
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                                                <p className="text-gray-600 mb-4">{event.description}</p>
                                                <div className="flex items-center text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>{event.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Additional information section */}
                <div className="bg-black rounded-2xl shadow-2xl border border-accent p-6 sm:p-8 text-white">
                    <h2 className="text-2xl font-bold mb-6 text-accent">Preparing for Success</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-3 text-primary flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                What to Bring
                            </h3>
                            <ul className="space-y-3">
                                {["Your personal tools and equipment", "Portfolio of your previous work", "Notebook for workshop notes", "Professional attire for networking events"].map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="inline-block w-5 h-5 rounded-full bg-amber-600 mr-3 mt-1 flex-shrink-0"></span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-3 text-primary flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Important Dates
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    { date: "June 14, 2025", event: "Orientation Day" },
                                    { date: "July 1, 2025", event: "First Challenge Submission" },
                                    { date: "August 15, 2025", event: "Mentorship Workshop" },
                                    { date: "September 30, 2025", event: "Final Presentations" }
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="inline-block w-5 h-5 rounded-full bg-amber-600 mr-3 mt-1 flex-shrink-0"></span>
                                        <div>
                                            <span className="font-bold">{item.date}:</span> {item.event}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                        <p className="text-gray-400 mb-4">Have questions about any of these events?</p>
                        <Link href="/contestant/profile" className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition duration-200">
                            Contact Your Coordinator
                        </Link>
                    </div>
                </div>
            </div>
        </ContestantLayout>
    );
} 