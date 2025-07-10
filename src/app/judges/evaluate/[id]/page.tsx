import JudgeSidebar from '../../../components/JudgeSidebar';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

interface EvaluatePageProps {
    params: {
        id: string;
    };
}

export default async function EvaluateSubmission({ params }: EvaluatePageProps) {
    const submissionId = params.id;

    // Create client
    const supabase = await createClient();

    // Check authentication
    const { data, error } = await supabase.auth.getUser();

    // If no authenticated user, redirect to login
    if (error || !data?.user) {
        redirect('/login');
    }

    // In a real app, fetch the submission data from the database using the ID
    // For now, we'll use mock data
    const submission = {
        id: parseInt(submissionId),
        title: "E-Commerce Platform for Local Artisans",
        contestant: {
            name: "Abebe Kebede",
            email: "abebe.k@example.com",
            avatar: "/images/avatar-placeholder.png"
        },
        submittedDate: "2023-06-15",
        category: "Web Development",
        description: "An e-commerce platform designed to help local Ethiopian artisans sell their handcrafted products globally. The platform includes features like secure payments, multilingual support, and a storytelling component that shares the cultural significance of each product.",
        technologiesUsed: ["React", "Node.js", "MongoDB", "AWS"],
        images: [
            "/images/avatar-placeholder.png",
            "/images/avatar-placeholder.png",
            "/images/avatar-placeholder.png"
        ],
        demoLink: "https://example.com/demo",
        githubLink: "https://github.com/example/project",
        status: "Pending",
        score: null,
        evaluationCriteria: [
            { name: "Innovation", maxScore: 25, score: null },
            { name: "Technical Execution", maxScore: 25, score: null },
            { name: "User Experience", maxScore: 20, score: null },
            { name: "Impact & Relevance", maxScore: 20, score: null },
            { name: "Presentation", maxScore: 10, score: null }
        ]
    };

    return (
        <div className="min-h-screen bg-white flex flex-row">
            {/* Sidebar */}
            <JudgeSidebar />

            {/* Main Content */}
            <main className="flex-1 p-8 md:ml-64">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/judges/submissions" className="text-accent hover:underline flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to Submissions
                        </Link>
                        <h1 className="text-3xl font-bold flex-1">Evaluate Submission</h1>
                    </div>

                    {/* Submission Details */}
                    <div className="bg-black text-white rounded-xl shadow-xl p-6 mb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-accent">{submission.title}</h2>
                                <p className="text-gray-300">Category: {submission.category}</p>
                                <p className="text-gray-300">Submitted: {submission.submittedDate}</p>
                            </div>
                            <div className="flex items-center">
                                <div className="w-10 h-10 relative rounded-full overflow-hidden mr-3">
                                    <Image
                                        src={submission.contestant.avatar}
                                        alt={submission.contestant.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium text-white">{submission.contestant.name}</p>
                                    <p className="text-sm text-gray-400">{submission.contestant.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2 text-accent">Description</h3>
                            <p className="text-gray-300">{submission.description}</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2 text-accent">Technologies Used</h3>
                            <div className="flex flex-wrap gap-2">
                                {submission.technologiesUsed.map((tech, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2 text-accent">Project Images</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {submission.images.map((image, index) => (
                                    <div key={index} className="aspect-video relative rounded-lg overflow-hidden">
                                        <Image
                                            src={image}
                                            alt={`Project image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <a
                                href={submission.demoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-accent text-black rounded-md hover:bg-accent/80 transition flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                View Demo
                            </a>
                            <a
                                href={submission.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                GitHub Repository
                            </a>
                        </div>
                    </div>

                    {/* Evaluation Form */}
                    <div className="bg-gray-100 rounded-xl shadow-lg p-6 mb-8">
                        <h3 className="text-xl font-semibold mb-6">Evaluation Criteria</h3>
                        <form className="space-y-6">
                            {submission.evaluationCriteria.map((criteria, index) => (
                                <div key={index} className="border-b border-gray-200 pb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <label htmlFor={`criteria-${index}`} className="block text-lg font-medium">
                                            {criteria.name}
                                        </label>
                                        <span className="text-sm text-gray-500">
                                            Max: {criteria.maxScore} points
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            id={`criteria-${index}`}
                                            min="0"
                                            max={criteria.maxScore}
                                            defaultValue={criteria.score || 0}
                                            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <input
                                            type="number"
                                            min="0"
                                            max={criteria.maxScore}
                                            defaultValue={criteria.score || 0}
                                            className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
                                        />
                                    </div>
                                </div>
                            ))}

                            <div>
                                <label htmlFor="comments" className="block text-lg font-medium mb-2">
                                    Feedback & Comments
                                </label>
                                <textarea
                                    id="comments"
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                                    placeholder="Provide constructive feedback to the contestant..."
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                                >
                                    Save Draft
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                                >
                                    Submit Evaluation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
} 