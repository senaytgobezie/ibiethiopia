'use client';

import React, { useState, useRef } from 'react';
import Sidebar from '../../components/Sidebar';

export default function SubmitEntry() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            // Optional: Validate file type/size here
            if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
                setError('File size must be less than 10MB.');
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(null);
        setError(null);

        if (!file) {
            setError('Please select a file to upload.');
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('file', file);

            console.log('Submitting form with file:', file.name);
            const res = await fetch('/api/submit-work', {
                method: 'POST',
                body: formData,
                credentials: 'include', // Include cookies for authentication
            });

            const data = await res.json();
            console.log('Response:', res.status, data);

            if (res.ok) {
                setSuccess('Your work has been submitted successfully!');
                setTitle('');
                setDescription('');
                setFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            } else {
                setError(data.error || 'Submission failed. Please try again.');
            }
        } catch (err: unknown) {
            console.error('Submit error:', err);
            const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-row">
            <Sidebar />
            <main className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-xl mx-auto p-8 bg-black rounded-2xl shadow-2xl border border-accent flex flex-col items-center gap-6 mt-12">
                    <h1 className="text-3xl font-heading text-white font-bold mb-2 text-center">Submit Your Work</h1>
                    <form className="flex flex-col text-white gap-8 w-full" onSubmit={handleSubmit}>
                        <input
                            className="w-full p-2 rounded bg-background border border-accent text-white"
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                        <textarea
                            className="w-full p-2 rounded bg-background border border-accent text-text"
                            placeholder="Description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                        <input
                            className="w-full p-2 rounded bg-background border border-accent text-text"
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            required
                            ref={fileInputRef}
                        />
                        <button
                            className="bg-primary text-background font-bold py-2 rounded hover:bg-yellow-600 transition border disabled:opacity-50"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                        {success && <div className="text-green-500 font-bold text-center mt-2">{success}</div>}
                        {error && <div className="text-red-500 font-bold text-center mt-2">{error}</div>}
                    </form>
                </div>
            </main>
        </div>
    );
}
