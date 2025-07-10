import JudgeSidebar from '../../components/JudgeSidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';

export default async function JudgeProfile() {
    // Create client
    const supabase = await createClient();

    // Check authentication
    const { data, error } = await supabase.auth.getUser();

    // If no authenticated user, redirect to login
    if (error || !data?.user) {
        redirect('/login');
    }

    // Fetch judge profile data
    // In a real app, you'd fetch this from your database
    const judgeProfile = {
        name: "Sarah Mekonnen",
        email: data.user.email,
        title: "Senior Beauty Expert",
        specialty: "Makeup Artistry & Creative Look",
        bio: "Sarah is an internationally certified makeup artist with over 12 years of experience in the beauty industry. She has worked with leading beauty brands across Africa and Europe, and has been a judge for various beauty competitions. Sarah specializes in evaluating makeup technique, creativity, color theory application, and overall aesthetic harmony. She is passionate about promoting Ethiopian beauty standards on the global stage.",
        avatar: "/images/avatar-placeholder.png", // Replace with actual path
        joinedDate: "March 2022",
        totalEvaluations: 86,
        credentials: [
            "International Makeup Artist Certification",
            "Beauty Director at Ethio Beauty Magazine",
            "Former Creative Director at L'Oréal East Africa"
        ],
        expertise: ["Bridal Makeup", "Editorial Looks", "Special Effects", "Cultural Beauty Techniques"]
    };

    // Beauty contest categories for the specialty dropdown
    const beautyCategories = [
        "Makeup Artistry",
        "Nail Art",
        "Hair Styling",
        "Fashion Design",
        "Halal Beauty",
        "Creative Look",
        "Skincare",
        "Traditional Beauty Techniques",
        "Bridal Beauty"
    ];

    return (
        <div className="min-h-screen bg-white flex flex-row">
            {/* Sidebar */}
            <JudgeSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 md:ml-64">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Judge Profile</h1>

                    <div className="bg-black text-white rounded-xl shadow-xl p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                            <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-accent">
                                <Image
                                    src={judgeProfile.avatar}
                                    alt={judgeProfile.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-accent">{judgeProfile.name}</h2>
                                <p className="text-gray-300 mb-2">{judgeProfile.title}</p>
                                <p className="text-gray-400 mb-4">{judgeProfile.email}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p className="text-gray-400">Specialty</p>
                                        <p className="text-white">{judgeProfile.specialty}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Joined</p>
                                        <p className="text-white">{judgeProfile.joinedDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Total Evaluations</p>
                                        <p className="text-white">{judgeProfile.totalEvaluations}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold mb-2 text-accent">Bio</h3>
                                    <p className="text-gray-300">{judgeProfile.bio}</p>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold mb-2 text-accent">Credentials</h3>
                                    <ul className="list-disc list-inside text-gray-300">
                                        {judgeProfile.credentials.map((credential, index) => (
                                            <li key={index}>{credential}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold mb-2 text-accent">Areas of Expertise</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {judgeProfile.expertise.map((skill, index) => (
                                            <span key={index} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-100 rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Update Profile</h3>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        defaultValue={judgeProfile.name}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        defaultValue={judgeProfile.title}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                                    <select
                                        id="specialty"
                                        name="specialty"
                                        defaultValue={judgeProfile.specialty}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    >
                                        {beautyCategories.map((category, index) => (
                                            <option key={index} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                                    <input
                                        type="file"
                                        id="avatar"
                                        name="avatar"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows={4}
                                    defaultValue={judgeProfile.bio}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="credentials" className="block text-sm font-medium text-gray-700 mb-1">Credentials (one per line)</label>
                                <textarea
                                    id="credentials"
                                    name="credentials"
                                    rows={3}
                                    defaultValue={judgeProfile.credentials.join('\n')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                ></textarea>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                                >
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
} 