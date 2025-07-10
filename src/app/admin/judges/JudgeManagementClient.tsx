'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Define the Judge type
interface Judge {
    id: string;
    user_id: string;
    name: string;
    email: string;
    bio?: string;
    specialty?: string[];
    years_experience?: number;
    profile_image?: string;
    status?: string;
    created_at?: string;
}

interface JudgeManagementClientProps {
    judges: Judge[];
    beautyCategories: string[];
}

export default function JudgeManagementClient({ judges, beautyCategories }: JudgeManagementClientProps) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const openModal = () => {
        setIsModalOpen(true);
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const formData = new FormData(e.currentTarget);

            // Always send credentials regardless of checkbox
            formData.set('send_credentials', 'on');

            const response = await fetch('/api/admin/add-judge', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.error || 'Failed to add judge');
                console.error('Error details:', data.details);
            } else {
                setSuccessMessage(data.message || 'Judge added successfully');
                // Reset the form
                (e.target as HTMLFormElement).reset();
                // Close modal after a delay and redirect to judges login page
                setTimeout(() => {
                    setIsModalOpen(false);
                    router.push('/judges/login');
                }, 2000);
            }
        } catch (error) {
            setErrorMessage('An unexpected error occurred');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Judges</h1>
                <button
                    className="bg-accent hover:bg-accent/90 text-black font-medium px-6 py-2 rounded-md flex items-center gap-2"
                    onClick={openModal}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Judge
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-black text-white p-6 rounded-xl shadow-md">
                    <h3 className="text-accent text-lg mb-4">Total Judges</h3>
                    <p className="text-4xl font-bold">{judges?.length || 0}</p>
                </div>
                <div className="bg-black text-white p-6 rounded-xl shadow-md">
                    <h3 className="text-accent text-lg mb-4">Active Judges</h3>
                    <p className="text-4xl font-bold">{judges?.filter(judge => judge.status === 'active')?.length || 0}</p>
                </div>
                <div className="bg-black text-white p-6 rounded-xl shadow-md">
                    <h3 className="text-accent text-lg mb-4">Evaluations Made</h3>
                    <p className="text-4xl font-bold">0</p>
                    <p className="text-sm text-gray-400 mt-2">Connect to evaluations table</p>
                </div>
            </div>

            {/* Judges Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-black text-white">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Judge</th>
                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Specialty</th>
                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Experience</th>
                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {judges && judges.length > 0 ? (
                            judges.map((judge: Judge) => (
                                <tr key={judge.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                {judge.profile_image ? (
                                                    <img className="h-10 w-10 rounded-full object-cover" src={judge.profile_image} alt="" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-accent text-white flex items-center justify-center">
                                                        {judge.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{judge.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{judge.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1">
                                            {judge.specialty && judge.specialty.map((spec: string, index: number) => (
                                                <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {judge.years_experience} {judge.years_experience === 1 ? 'year' : 'years'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${judge.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {judge.status || 'active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <button className="text-accent hover:text-accent/80">
                                                Edit
                                            </button>
                                            <button className="text-accent hover:text-accent/80">
                                                Email
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    No judges found. Add your first judge to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Judge Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-gray-900">Add New Judge</h3>
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-500"
                                    onClick={closeModal}
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                                {errorMessage}
                            </div>
                        )}

                        {successMessage && (
                            <div className="mx-6 mt-4 p-3 bg-green-100 text-green-700 rounded-md">
                                {successMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="years_experience" className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                                        <input
                                            type="number"
                                            id="years_experience"
                                            name="years_experience"
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">Specialty Areas</label>
                                        <select
                                            id="specialty"
                                            name="specialty"
                                            multiple
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                        >
                                            {beautyCategories.map((category, index) => (
                                                <option key={index} value={category}>{category}</option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                        ></textarea>
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="flex items-center">
                                            <input
                                                id="send_credentials"
                                                name="send_credentials"
                                                type="checkbox"
                                                checked
                                                disabled
                                                className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                                            />
                                            <label htmlFor="send_credentials" className="ml-2 block text-sm text-gray-900">
                                                Send login credentials via email (always enabled)
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-black font-medium bg-accent hover:bg-accent/90 disabled:opacity-50"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Adding...' : 'Add Judge'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
} 