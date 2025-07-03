import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ContestantLayout from '../../components/ContestantLayout';
import StarRating from '../../components/StarRating';
import ImageWithFallback from '../../components/ImageWithFallback';

// Default logo image to use as fallback
const defaultImage = "/images/logo transparent.png";

export default async function YourWorkPage() {
    // Create client
    const supabase = await createClient();

    // Check authentication - always use getUser() for security
    const { data, error } = await supabase.auth.getUser();

    // If no authenticated user, redirect to login
    if (error || !data?.user) {
        redirect('/login?redirect=/contestant/your-work');
    }

    const userId = data.user.id;

    // First get the contestant ID for this user
    const { data: contestantData } = await supabase
        .from('contestants')
        .select('id')
        .eq('user_id', userId)
        .single();

    const contestantId = contestantData?.id;

    // If no contestant profile exists, handle this case
    if (!contestantId) {
        return (
            <ContestantLayout>
                <div className="w-full max-w-4xl mx-auto bg-black rounded-2xl shadow-2xl border border-accent p-8 text-white">
                    <h1 className="text-3xl font-heading font-bold mb-6 text-center">Your Work</h1>
                    <div className="text-center p-8">
                        <p className="text-lg mb-4">You don&apos;t have any submissions yet.</p>
                        <Link href="/contestant/submit" className="bg-primary text-white py-2 px-4 rounded hover:bg-yellow-600 transition">
                            Submit Your First Work
                        </Link>
                    </div>
                </div>
            </ContestantLayout>
        );
    }

    // Get all submissions for this contestant
    const { data: submissions, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .eq('contestant_id', contestantId)
        .order('submitted_at', { ascending: false });

    if (submissionsError) {
        console.error('Error fetching submissions:', submissionsError);
    }

    // Get public URLs for the submission files
    const submissionsWithUrls = await Promise.all((submissions || []).map(async (submission) => {
        const { data: publicUrl } = await supabase
            .storage
            .from('submissions')
            .getPublicUrl(submission.file_path);

        return {
            ...submission,
            publicUrl: publicUrl?.publicUrl || defaultImage
        };
    }));

    return (
        <ContestantLayout>
            <div className="w-full max-w-6xl mx-auto">
                <h1 className="text-3xl font-heading font-bold mb-8 text-primary">Your Submitted Work</h1>

                {submissionsWithUrls.length === 0 ? (
                    <div className="bg-black rounded-2xl shadow-2xl border border-accent p-8 text-white text-center">
                        <p className="text-lg mb-4">You don&apos;t have any submissions yet.</p>
                        <Link href="/contestant/submit" className="bg-primary text-white py-2 px-4 rounded hover:bg-yellow-600 transition">
                            Submit Your First Work
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {submissionsWithUrls.map((submission) => (
                            <div key={submission.id} className="bg-[#1c2533] rounded-lg overflow-hidden shadow-lg">
                                <div className="relative h-80 w-full">
                                    <div className="w-full h-full flex justify-center items-center bg-[#1c2533]">
                                        <ImageWithFallback
                                            src={submission.publicUrl}
                                            fallbackSrc={defaultImage}
                                            alt={submission.title}
                                            width={300}
                                            height={300}
                                            style={{ objectFit: 'contain', maxHeight: '100%' }}
                                        />
                                    </div>
                                </div>
                                <div className="p-6 bg-black">
                                    <h2 className="text-xl font-bold text-primary mb-2">{submission.title}</h2>
                                    <p className="text-gray-300 mb-4">{submission.description}</p>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <span className="text-gray-400">Status: </span>
                                            <span className={`ml-2 font-medium ${submission.status === 'approved' ? 'text-green-400' :
                                                submission.status === 'rejected' ? 'text-red-400' :
                                                    'text-primary'
                                                }`}>
                                                {submission.status === 'pending' ? 'Pending' :
                                                    submission.status === 'approved' ? 'Approved' :
                                                        'Rejected'}
                                            </span>
                                        </div>
                                        <div className="text-gray-400">
                                            {new Date(submission.submitted_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {submission.status === 'approved' && submission.rating && (
                                        <div className="mt-4 pt-4 border-t border-gray-800">
                                            <div className="flex items-center">
                                                <span className="text-gray-400 mr-2">Rating:</span>
                                                <div className="flex items-center">
                                                    <StarRating rating={submission.rating} />
                                                    <span className="ml-2 text-yellow-400 font-bold">
                                                        {submission.rating.toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>

                                            {submission.judge_comments && (
                                                <div className="mt-3">
                                                    <p className="text-gray-300 text-sm italic">
                                                        &ldquo;{submission.judge_comments}&rdquo;
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-12 text-center">
                    <Link
                        href="/contestant/submit"
                        className="bg-primary text-white py-3 px-8 rounded-lg hover:bg-yellow-600 transition inline-block font-medium"
                    >
                        Submit New Work
                    </Link>
                </div>
            </div>
        </ContestantLayout>
    );
} 