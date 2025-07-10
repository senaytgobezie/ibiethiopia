import AdminSidebar from '../../components/AdminSidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function ManageEvents() {
    // Create client
    const supabase = await createClient();

    // Check authentication
    const { data, error } = await supabase.auth.getUser();

    // If no authenticated user, redirect to login
    if (error || !data?.user) {
        redirect('/login');
    }

    // TODO: Add check for admin role
    // This would verify the user is actually an admin in the system

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
            audience: "Judges",
            status: "Upcoming",
            link: "https://zoom.us/j/example",
            organizer: "Admin"
        },
        {
            id: 2,
            title: "Awards Ceremony Preparation",
            description: "Briefing for judges on the awards ceremony process, including announcement protocols and judge responsibilities during the event.",
            date: "June 22, 2023",
            time: "10:00 AM - 11:30 AM",
            location: "Virtual (Zoom)",
            type: "Briefing",
            audience: "Judges",
            status: "Upcoming",
            link: "https://zoom.us/j/example2",
            organizer: "Admin"
        },
        {
            id: 3,
            title: "IBI Ethiopia Innovation Awards Ceremony",
            description: "The grand finale of the competition where winners will be announced and prizes awarded. All judges and contestants are expected to attend and participate in the ceremony.",
            date: "June 25, 2023",
            time: "6:00 PM - 9:00 PM",
            location: "Skylight Hotel, Addis Ababa",
            type: "Ceremony",
            audience: "All",
            status: "Upcoming",
            link: null,
            organizer: "Admin"
        },
        {
            id: 4,
            title: "Post-Competition Judges Dinner",
            description: "A dinner to celebrate the successful completion of the competition and to thank all judges for their valuable contributions.",
            date: "June 25, 2023",
            time: "9:30 PM - 11:00 PM",
            location: "Skylight Hotel Restaurant, Addis Ababa",
            type: "Social",
            audience: "Judges",
            status: "Upcoming",
            link: null,
            organizer: "Admin"
        },
        {
            id: 5,
            title: "Innovation Showcase Exhibition",
            description: "An exhibition showcasing the top projects from the competition. Judges and contestants are invited to attend and interact.",
            date: "June 26, 2023",
            time: "10:00 AM - 4:00 PM",
            location: "Millennium Hall, Addis Ababa",
            type: "Exhibition",
            audience: "All",
            status: "Upcoming",
            link: null,
            organizer: "Admin"
        },
        {
            id: 6,
            title: "Workshop: Preparing Your Final Presentation",
            description: "Workshop to help contestants prepare their final presentations. Learn tips and tricks from industry experts.",
            date: "June 12, 2023",
            time: "2:00 PM - 4:00 PM",
            location: "Virtual (Zoom)",
            type: "Workshop",
            audience: "Contestants",
            status: "Past",
            link: "https://zoom.us/j/example3",
            organizer: "Admin"
        },
        {
            id: 7,
            title: "Judges Orientation Session",
            description: "Initial orientation session for all judges to explain the evaluation criteria and judging process.",
            date: "June 5, 2023",
            time: "3:00 PM - 5:00 PM",
            location: "Virtual (Zoom)",
            type: "Meeting",
            audience: "Judges",
            status: "Past",
            link: "https://zoom.us/j/example4",
            organizer: "Admin"
        }
    ];

    // Calculate statistics
    const stats = {
        total: events.length,
        upcoming: events.filter(e => e.status === "Upcoming").length,
        past: events.filter(e => e.status === "Past").length,
        forJudges: events.filter(e => e.audience === "Judges" || e.audience === "All").length,
        forContestants: events.filter(e => e.audience === "Contestants" || e.audience === "All").length
    };

    // Group events by month for the calendar view
    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long' });
    const currentYear = today.getFullYear();

    return (
        <div className="min-h-screen bg-white flex flex-row">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 md:ml-64">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Manage Events</h1>
                        <button className="px-4 py-2 bg-accent text-black rounded-md hover:bg-accent/80 transition flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Create New Event
                        </button>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-accent text-lg font-medium">Total Events</h3>
                            <p className="text-3xl font-bold mt-2">{stats.total}</p>
                        </div>
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-green-400 text-lg font-medium">Upcoming</h3>
                            <p className="text-3xl font-bold mt-2">{stats.upcoming}</p>
                        </div>
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-yellow-400 text-lg font-medium">For Judges</h3>
                            <p className="text-3xl font-bold mt-2">{stats.forJudges}</p>
                        </div>
                        <div className="bg-black text-white p-6 rounded-xl shadow-md">
                            <h3 className="text-blue-400 text-lg font-medium">For Contestants</h3>
                            <p className="text-3xl font-bold mt-2">{stats.forContestants}</p>
                        </div>
                    </div>

                    {/* Calendar Header */}
                    <div className="bg-black text-white p-6 rounded-t-xl shadow-md mb-0">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">{currentMonth} {currentYear}</h2>
                                <p className="text-gray-300">{stats.upcoming} upcoming events</p>
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

                    {/* Search and Filter */}
                    <div className="bg-white p-4 shadow-md mb-0 border-x border-gray-200">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search events by title, location, or description..."
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                                    <option value="all">All Types</option>
                                    <option value="meeting">Meeting</option>
                                    <option value="workshop">Workshop</option>
                                    <option value="ceremony">Ceremony</option>
                                    <option value="exhibition">Exhibition</option>
                                    <option value="social">Social</option>
                                </select>
                                <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                                    <option value="all">All Audiences</option>
                                    <option value="judges">Judges</option>
                                    <option value="contestants">Contestants</option>
                                    <option value="all-users">All Users</option>
                                </select>
                                <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                                    <option value="all">All Status</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="past">Past</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="bg-white shadow-md rounded-b-lg overflow-hidden mb-8 border-x border-b border-gray-200">
                        <div className="divide-y divide-gray-200">
                            {events.filter(event => event.status === "Upcoming").map((event) => (
                                <div key={event.id} className="p-6 hover:bg-gray-50 transition">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="flex-shrink-0 w-16 h-16 bg-black text-white rounded-lg flex flex-col items-center justify-center">
                                            <span className="text-xs">{event.date.split(' ')[0]}</span>
                                            <span className="text-xl font-bold">{event.date.split(' ')[1].replace(',', '')}</span>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-semibold">{event.title}</h3>
                                                <span className={`bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded ${event.type === 'Meeting' ? 'bg-blue-100 text-blue-800' :
                                                    event.type === 'Ceremony' ? 'bg-purple-100 text-purple-800' :
                                                        event.type === 'Workshop' ? 'bg-yellow-100 text-yellow-800' :
                                                            event.type === 'Social' ? 'bg-pink-100 text-pink-800' :
                                                                'bg-green-100 text-green-800'
                                                    }`}>
                                                    {event.type}
                                                </span>
                                                <span className={`bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded ${event.audience === 'Judges' ? 'bg-yellow-100 text-yellow-800' :
                                                    event.audience === 'Contestants' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {event.audience}
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
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 items-center md:items-end">
                                            <div className="flex gap-2">
                                                <button className="text-blue-600 hover:text-blue-800">
                                                    Edit
                                                </button>
                                                <button className="text-red-600 hover:text-red-800">
                                                    Cancel
                                                </button>
                                            </div>
                                            <button className="text-gray-500 hover:text-accent text-sm">
                                                Send Reminder
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {events.filter(event => event.status === "Upcoming").length === 0 && (
                                <div className="p-6 text-center text-gray-500">
                                    No upcoming events. Create a new event to get started.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Create New Event Form */}
                    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-6">Create New Event</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="Enter event title"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                                    <select
                                        id="type"
                                        name="type"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    >
                                        <option value="">Select Event Type</option>
                                        <option value="meeting">Meeting</option>
                                        <option value="workshop">Workshop</option>
                                        <option value="ceremony">Ceremony</option>
                                        <option value="exhibition">Exhibition</option>
                                        <option value="social">Social</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="time"
                                            id="startTime"
                                            name="startTime"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                        <input
                                            type="time"
                                            id="endTime"
                                            name="endTime"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="Physical location or virtual platform"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">Meeting Link (if virtual)</label>
                                    <input
                                        type="url"
                                        id="link"
                                        name="link"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="https://zoom.us/j/example"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                                    <select
                                        id="audience"
                                        name="audience"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    >
                                        <option value="">Select Audience</option>
                                        <option value="judges">Judges</option>
                                        <option value="contestants">Contestants</option>
                                        <option value="all">All Users</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                                    <input
                                        type="text"
                                        id="organizer"
                                        name="organizer"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="Event organizer name"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                        placeholder="Enter event description"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="sendNotification"
                                    name="sendNotification"
                                    className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                                />
                                <label htmlFor="sendNotification" className="ml-2 block text-sm text-gray-700">
                                    Send notification to the selected audience
                                </label>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                                >
                                    Create Event
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Past Events */}
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-6">Past Events</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audience</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {events.filter(event => event.status === "Past").map((event) => (
                                        <tr key={event.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                                <div className="text-sm text-gray-500">{event.location}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{event.date}</div>
                                                <div className="text-sm text-gray-500">{event.time}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${event.type === 'Meeting' ? 'bg-blue-100 text-blue-800' :
                                                    event.type === 'Workshop' ? 'bg-yellow-100 text-yellow-800' :
                                                        event.type === 'Ceremony' ? 'bg-purple-100 text-purple-800' :
                                                            event.type === 'Social' ? 'bg-pink-100 text-pink-800' :
                                                                'bg-green-100 text-green-800'
                                                    }`}>
                                                    {event.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {event.audience}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-accent hover:text-accent-dark mr-3">
                                                    View
                                                </button>
                                                <button className="text-blue-600 hover:text-blue-800 mr-3">
                                                    Duplicate
                                                </button>
                                                <button className="text-red-600 hover:text-red-800">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {events.filter(event => event.status === "Past").length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No past events to display.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
} 