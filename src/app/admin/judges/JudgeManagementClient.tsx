'use client';

import { useState } from 'react';

// Define the Judge type
interface Judge {
    id: string;
    user_id?: string | null; // Make optional/nullable
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

            const response = await fetch('/api/admin/add-judge', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setErrorMessage(data.error || data.message || 'Failed to add judge');
                console.error('Error adding judge:', data);
            } else {
                let message = data.message;

                // Enhanced feedback based on user type and email status
                if (data.data?.isExistingUser) {
                    message = 'Existing user successfully added as judge!';
                } else if (data.data?.emailSent === false) {
                    message = data.message + ' Note: You may need to send credentials manually.';
                } else {
                    message = 'Judge added successfully and credentials sent via email!';
                }

                setSuccessMessage(message);

                // Reset the form
                (e.target as HTMLFormElement).reset();

                // Close modal after success
                setTimeout(() => {
                    setIsModalOpen(false);
                    // Refresh the page to show the new judge
                    window.location.reload();
                }, 2500); // Slightly longer delay for existing user message
            }
        } catch (error) {
            setErrorMessage('An unexpected error occurred. Please try again.');
            console.error('Unexpected error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Judges</h1>
                <button
                    className="flex gap-2 items-center px-6 py-2 font-medium text-black rounded-md bg-accent hover:bg-accent/90"
                    onClick={openModal}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Judge
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                <div className="p-6 text-white bg-black rounded-xl shadow-md">
                    <h3 className="mb-4 text-lg text-accent">Total Judges</h3>
                    <p className="text-4xl font-bold">{judges?.length || 0}</p>
                </div>
                <div className="p-6 text-white bg-black rounded-xl shadow-md">
                    <h3 className="mb-4 text-lg text-accent">Active Judges</h3>
                    <p className="text-4xl font-bold">{judges?.filter(judge => judge.status === 'active')?.length || 0}</p>
                </div>
                <div className="p-6 text-white bg-black rounded-xl shadow-md">
                    <h3 className="mb-4 text-lg text-accent">Evaluations Made</h3>
                    <p className="text-4xl font-bold">0</p>
                    <p className="mt-2 text-sm text-gray-400">Connect to evaluations table</p>
                </div>
            </div>

            {/* Judges Table */}
            <div className="overflow-hidden mb-8 bg-white rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="text-white bg-black">
                        <tr>
                            <th className="px-6 py-4 text-xs font-medium tracking-wider text-left uppercase">Judge</th>
                            <th className="px-6 py-4 text-xs font-medium tracking-wider text-left uppercase">Email</th>
                            <th className="px-6 py-4 text-xs font-medium tracking-wider text-left uppercase">Specialty</th>
                            <th className="px-6 py-4 text-xs font-medium tracking-wider text-left uppercase">Experience</th>
                            <th className="px-6 py-4 text-xs font-medium tracking-wider text-left uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-medium tracking-wider text-right uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {judges && judges.length > 0 ? (
                            judges.map((judge: Judge) => (
                                <tr key={judge.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-10 h-10">
                                                {judge.profile_image ? (
                                                    <img className="object-cover w-10 h-10 rounded-full" src={judge.profile_image} alt="" />
                                                ) : (
                                                    <div className="flex justify-center items-center w-10 h-10 text-white rounded-full bg-accent">
                                                        {judge.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{judge.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{judge.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1">
                                            {judge.specialty && judge.specialty.map((spec: string, index: number) => (
                                                <span key={index} className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded-full">
                                                    {spec}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {judge.years_experience} {judge.years_experience === 1 ? 'year' : 'years'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${judge.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {judge.status || 'active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
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
                <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-gray-900">Add New Judge</h3>
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-500"
                                    onClick={closeModal}
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="p-3 mx-6 mt-4 text-red-700 bg-red-100 rounded-md">
                                {errorMessage}
                            </div>
                        )}

                        {successMessage && (
                            <div className="p-3 mx-6 mt-4 text-green-700 bg-green-100 rounded-md">
                                {successMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="years_experience" className="block mb-1 text-sm font-medium text-gray-700">Years of Experience</label>
                                        <input
                                            type="number"
                                            id="years_experience"
                                            name="years_experience"
                                            min="0"
                                            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="specialty" className="block mb-1 text-sm font-medium text-gray-700">Specialty Areas</label>
                                        <select
                                            id="specialty"
                                            name="specialty"
                                            multiple
                                            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                                        >
                                            {beautyCategories.map((category, index) => (
                                                <option key={index} value={category}>{category}</option>
                                            ))}
                                        </select>
                                        <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="bio" className="block mb-1 text-sm font-medium text-gray-700">Biography</label>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            rows={4}
                                            placeholder="Brief professional background and expertise..."
                                            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                                        ></textarea>
                                    </div>

                                    <div className="md:col-span-2">
                                        <p className="p-3 text-sm text-gray-600 bg-blue-50 rounded-md border border-blue-200">
                                            <strong>Note:</strong> Login credentials will be automatically generated and sent to the judge&apos;s email address.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end p-6 space-x-3 border-t border-gray-200">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 font-medium text-black rounded-md border border-transparent shadow-sm bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                            <svg className="mr-2 w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Adding Judge...
                                        </span>
                                    ) : 'Add Judge'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
} 