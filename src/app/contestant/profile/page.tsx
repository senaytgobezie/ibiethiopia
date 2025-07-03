'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import ContestantLayout from '../../components/ContestantLayout';

// Categories available for selection
const categories = [
    'Halal',
    'Hair Artistry',
    'Makeup Artistry',
    'Fashion Design',
    'Nail Artistry',
    'Creative Make Up',
];

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
        categories: [] as string[]
    });

    // Fetch profile data on component mount
    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            const supabase = createClient();

            try {
                // Get current user
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError || !user) {
                    router.push('/login?redirect=/contestant/profile');
                    return;
                }

                // Get contestant profile
                const { data: contestantData, error: profileError } = await supabase
                    .from('contestants')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (profileError) {
                    throw new Error(profileError.message);
                }

                if (contestantData) {
                    // Parse categories from comma-separated string if it exists
                    const categoriesArray = contestantData.categories
                        ? contestantData.categories.split(',')
                        : [];

                    setProfileData({
                        name: contestantData.name || '',
                        email: contestantData.email || user.email || '',
                        phone: contestantData.phone || '',
                        gender: contestantData.gender || '',
                        categories: categoriesArray
                    });
                }
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                setError(errorMessage);
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [router]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle category selection
    const handleCategoryChange = (category: string) => {
        setProfileData(prev => {
            const updatedCategories = prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category];

            return {
                ...prev,
                categories: updatedCategories
            };
        });
    };

    // Save profile changes
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            // Call our API endpoint instead of direct Supabase call
            const response = await fetch('/api/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: profileData.name,
                    email: profileData.email,
                    phone: profileData.phone,
                    gender: profileData.gender,
                    categories: profileData.categories
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            setSuccess('Profile updated successfully!');

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            console.error('Error updating profile:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <ContestantLayout>
            <div className="w-full max-w-4xl mx-auto">
                <h1 className="text-3xl font-heading font-bold mb-6 text-primary">Your Profile</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        {success}
                    </div>
                )}

                {loading ? (
                    <div className="bg-black rounded-2xl shadow-2xl border border-accent p-8 text-white text-center">
                        <p>Loading profile data...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-black rounded-2xl shadow-2xl border border-accent p-8 text-white">
                        <div className="mb-6">
                            <label htmlFor="name" className="block text-accent mb-2">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={profileData.name}
                                onChange={handleInputChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="email" className="block text-accent mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleInputChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="phone" className="block text-accent mb-2">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleInputChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="gender" className="block text-accent mb-2">Gender</label>
                            <select
                                id="gender"
                                name="gender"
                                value={profileData.gender}
                                onChange={handleInputChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-accent mb-2">Categories</label>
                            <div className="grid grid-cols-2 gap-3">
                                {categories.map((category) => (
                                    <div key={category} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`category-${category}`}
                                            checked={profileData.categories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`category-${category}`}>{category}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-primary text-white py-2 px-6 rounded hover:bg-yellow-600 transition disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </ContestantLayout>
    );
}
