'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';

// Sample notice data - in a real app, this would come from the database
const notices = [
    {
        id: 1,
        title: "Contest Registration Deadline Extended",
        content: "Due to popular demand, we've extended the registration deadline to June 30, 2025. Don't miss your chance to participate!",
        category: "Important",
        date: "2025-05-15",
        isNew: true
    },
    {
        id: 2,
        title: "Workshop: Advanced Makeup Techniques",
        content: "Join us for a special workshop on advanced makeup techniques with industry expert Maria Johnson. The workshop will be held on July 5, 2025, from 10:00 AM to 2:00 PM at the IBI Studio.",
        category: "Event",
        date: "2025-05-12",
        isNew: true
    },
    {
        id: 3,
        title: "First Challenge Theme Announced",
        content: "We're excited to announce that the theme for the first challenge will be 'Cultural Fusion'. Prepare to showcase your skills by blending traditional and modern elements in your work.",
        category: "Challenge",
        date: "2025-05-10",
        isNew: false
    },
    {
        id: 4,
        title: "Judging Panel Announcement",
        content: "We're thrilled to welcome five distinguished industry professionals to our judging panel this year. Each brings decades of experience in their respective fields.",
        category: "Announcement",
        date: "2025-05-05",
        isNew: false
    },
    {
        id: 5,
        title: "Technical Requirements for Submissions",
        content: "Please ensure all photo submissions are in high resolution (minimum 300 DPI) and in JPG or PNG format. Videos should be in MP4 format, maximum 3 minutes in length.",
        category: "Guidelines",
        date: "2025-05-01",
        isNew: false
    }
];

export default function NoticesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [user, setUser] = useState(null);

    // Check authentication on component mount
    useState(() => {
        async function checkAuth() {
            setLoading(true);
            const supabase = createClient();

            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error || !user) {
                    router.push('/login?redirect=/contestant/notices');
                    return;
                }

                setUser(user);
            } catch (err) {
                console.error('Authentication error:', err);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, [router]);

    // Filter notices based on selected category
    const filteredNotices = selectedCategory
        ? notices.filter(notice => notice.category === selectedCategory)
        : notices;

    // Get important notices
    const importantNotices = notices.filter(notice => notice.category === "Important");

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-row">
                <Sidebar />
                <main className="flex-1 p-8 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-lg">Loading notices...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-row">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-heading font-bold text-primary">Notice Board</h1>

                        <div className="flex gap-2">
                            <select
                                className="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="Important">Important</option>
                                <option value="Event">Events</option>
                                <option value="Challenge">Challenges</option>
                                <option value="Announcement">Announcements</option>
                                <option value="Guidelines">Guidelines</option>
                            </select>
                        </div>
                    </div>

                    {/* Pinned important notice - always show regardless of filter if there are any */}
                    {!selectedCategory && importantNotices.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-heading font-bold mb-4">Important Updates</h2>
                            {importantNotices.map(notice => (
                                <div key={notice.id} className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg shadow-md mb-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-amber-800">{notice.title}</h3>
                                        {notice.isNew && (
                                            <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 mt-2">{notice.content}</p>
                                    <div className="mt-4 text-sm text-gray-500">
                                        Posted on {new Date(notice.date).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* All filtered notices */}
                    <div>
                        <h2 className="text-2xl font-heading font-bold mb-4">
                            {selectedCategory ? `${selectedCategory} Notices` : 'All Notices'}
                        </h2>

                        {filteredNotices.length === 0 ? (
                            <div className="bg-gray-100 p-8 text-center rounded-lg">
                                <p className="text-lg text-gray-600">No notices found in this category. Check back later for updates.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredNotices.map(notice => (
                                    <div key={notice.id} className="bg-black rounded-lg shadow-lg border border-accent overflow-hidden">
                                        <div className="p-6 text-white">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <span className={`inline-block px-2 py-1 text-xs rounded-full mr-2 ${notice.category === "Important" ? "bg-red-500 text-white" :
                                                        notice.category === "Event" ? "bg-blue-500 text-white" :
                                                            notice.category === "Challenge" ? "bg-green-500 text-white" :
                                                                notice.category === "Announcement" ? "bg-purple-500 text-white" :
                                                                    "bg-gray-500 text-white"
                                                        }`}>
                                                        {notice.category}
                                                    </span>
                                                    <h3 className="text-xl font-bold text-accent inline">{notice.title}</h3>
                                                </div>
                                                {notice.isNew && (
                                                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">NEW</span>
                                                )}
                                            </div>
                                            <p className="text-gray-300 mb-4">{notice.content}</p>
                                            <div className="text-sm text-gray-400">
                                                Posted on {new Date(notice.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
} 