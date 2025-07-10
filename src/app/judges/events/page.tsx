import JudgeSidebar from '../../components/JudgeSidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import Link from 'next/link';

export default async function JudgeEvents() {
    // Create client
    const supabase = await createClient();

    // Check authentication
    const { data, error } = await supabase.auth.getUser();

    // If no authenticated user, redirect to login
    if (error || !data?.user) {
        redirect('/login');
    }

    // Mock events data - in a real app, this would come from the database
    const events = [
        {
            id: 1,
            title: "Judges Final Deliberation Meeting",
            description: "Final meeting to discuss and finalize the scores for all submissions. Please come prepared with your evaluations completed.",
            date: "June 20, 2023",
            time: "2:00 PM - 5:00 PM",
            location: "Virtual (Zoom)",
            type: "Meeting",
            isRequired: true,
            link: "https://zoom.us/j/example",
            organizer: "Dr. Alemayehu Tadesse"
        },
        {
            id: 2,
            title: "Awards Ceremony Preparation",
            description: "Briefing for judges on the awards ceremony process, including announcement protocols and judge responsibilities during the event.",
            date: "June 22, 2023",
            time: "10:00 AM - 11:30 AM",
            location: "Virtual (Zoom)",
            type: "Briefing",
            isRequired: true,
            link: "https://zoom.us/j/example2",
            organizer: "Organizing Committee"
        },
        {
            id: 3,
            title: "IBI Ethiopia Innovation Awards Ceremony",
            description: "The grand finale of the competition where winners will be announced and prizes awarded. All judges are expected to attend and participate in the ceremony.",
            date: "June 25, 2023",
            time: "6:00 PM - 9:00 PM",
            location: "Skylight Hotel, Addis Ababa",
            type: "Ceremony",
            isRequired: true,
            link: null,
            organizer: "IBI Ethiopia"
        },
        {
            id: 4,
            title: "Post-Competition Judges Dinner",
            description: "A dinner to celebrate the successful completion of the competition and to thank all judges for their valuable contributions.",
            date: "June 25, 2023",
            time: "9:30 PM - 11:00 PM",
            location: "Skylight Hotel Restaurant, Addis Ababa",
            type: "Social",
            isRequired: false,
            link: null,
            organizer: "IBI Ethiopia"
        },
        {
            id: 5,
            title: "Innovation Showcase Exhibition",
            description: "An exhibition showcasing the top projects from the competition. Judges are invited to attend and interact with contestants.",
            date: "June 26, 2023",
            time: "10:00 AM - 4:00 PM",
            location: "Millennium Hall, Addis Ababa",
            type: "Exhibition",
            isRequired: false,
            link: null,
            organizer: "IBI Ethiopia & Ministry of Innovation"
        }
    ];

    // Group events by month for the calendar view
    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long' });
    const currentYear = today.getFullYear();

    return (
        <div className="min-h-screen bg-white flex flex-row">
            {/* Sidebar */}
            <JudgeSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 md:ml-64">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Upcoming Events</h1>
                        <div className="flex items-center gap-2">
                            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                                <option value="all">All Events</option>
                                <option value="meeting">Meetings</option>
                                <option value="ceremony">Ceremonies</option>
                                <option value="required">Required Only</option>
                            </select>
                            <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Add to Calendar
                            </button>
                        </div>
                    </div>

                    {/* Calendar Header */}
                    <div className="bg-black text-white p-6 rounded-t-xl shadow-md">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">{currentMonth} {currentYear}</h2>
                                <p className="text-gray-300">5 upcoming events</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-full hover:bg-gray-800 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-800 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="bg-white shadow-md rounded-b-xl overflow-hidden mb-8">
                        <div className="divide-y divide-gray-200">
                            {events.map((event) => (
                                <div key={event.id} className="p-6 hover:bg-gray-50 transition">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="flex-shrink-0 w-16 h-16 bg-black text-white rounded-lg flex flex-col items-center justify-center">
                                            <span className="text-xs">June</span>
                                            <span className="text-xl font-bold">{event.date.split(' ')[1].replace(',', '')}</span>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-semibold">{event.title}</h3>
                                                {event.isRequired && (
                                                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                        Required
                                                    </span>
                                                )}
                                                <span className={`bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded ${event.type === 'Meeting' ? 'bg-blue-100 text-blue-800' :
                                                    event.type === 'Ceremony' ? 'bg-purple-100 text-purple-800' :
                                                        event.type === 'Briefing' ? 'bg-yellow-100 text-yellow-800' :
                                                            event.type === 'Social' ? 'bg-pink-100 text-pink-800' :
                                                                'bg-green-100 text-green-800'
                                                    }`}>
                                                    {event.type}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mt-1">{event.description}</p>
                                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                    {event.time}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    {event.location}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                                    </svg>
                                                    {event.organizer}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 items-center md:items-end">
                                            {event.link ? (
                                                <a
                                                    href={event.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-accent text-black rounded-md hover:bg-accent/80 transition text-sm font-medium"
                                                >
                                                    Join Meeting
                                                </a>
                                            ) : (
                                                <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition text-sm font-medium">
                                                    View Details
                                                </button>
                                            )}
                                            <button className="text-gray-500 hover:text-accent text-sm">
                                                Add to Calendar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Past Events Section */}
                    <div className="mt-12">
                        <h2 className="text-xl font-semibold mb-4">Past Events</h2>
                        <div className="bg-white shadow-md rounded-xl overflow-hidden">
                            <div className="p-6 text-center text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p>No past events to display</p>
                                <button className="mt-3 text-accent hover:underline">
                                    View Archive
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 