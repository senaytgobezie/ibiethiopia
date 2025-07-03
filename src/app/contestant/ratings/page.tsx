import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ContestantLayout from '../../components/ContestantLayout';
import ImageWithFallback from '../../components/ImageWithFallback';

// Helper function to generate star ratings
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
                <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-600"}>★</span>
            ))}
        </div>
    );
}

// Sample placeholder image for when images are not available
const defaultImage = "/images/logo transparent.png";

export default async function RatingsPage() {
    // Create client
    const supabase = await createClient();

    // Check authentication - always use getUser() for security
    const { data, error } = await supabase.auth.getUser();

    // If no authenticated user, redirect to login
    if (error || !data?.user) {
        redirect('/login?redirect=/contestant/ratings');
    }

    // Sample top-rated works data
    // In a real application, you would fetch this from your database
    const topRatedWorks = [
        {
            id: 1,
            title: "Elegant Evening Makeup",
            description: "A sophisticated evening look featuring smokey eyes and nude lips.",
            category: "Makeup Artistry",
            rating: 5,
            image: "/images/placeholder-makeup.jpg",
            contestant: "Sophia Johnson",
            date: "2025-05-15"
        },
        {
            id: 2,
            title: "Modern Bridal Hairstyle",
            description: "Contemporary updo with delicate floral accents, perfect for the modern bride.",
            category: "Hair Artistry",
            rating: 4.8,
            image: "/images/placeholder-hair.jpg",
            contestant: "Marcus Williams",
            date: "2025-05-12"
        },
        {
            id: 3,
            title: "Abstract Nail Art",
            description: "Geometric patterns with bold colors creating a statement nail design.",
            category: "Nail Artistry",
            rating: 4.7,
            image: "/images/placeholder-nails.jpg",
            contestant: "Emma Thompson",
            date: "2025-05-10"
        },
        {
            id: 4,
            title: "Traditional Halal Wedding Look",
            description: "A beautiful fusion of traditional elements with modern techniques.",
            category: "Halal",
            rating: 4.9,
            image: "/images/placeholder-halal.jpg",
            contestant: "Aisha Ahmed",
            date: "2025-05-08"
        },
        {
            id: 5,
            title: "Avant-Garde Fashion Piece",
            description: "Pushing boundaries with this experimental fashion design.",
            category: "Fashion Design",
            rating: 4.6,
            image: "/images/placeholder-fashion.jpg",
            contestant: "Leo Chen",
            date: "2025-05-05"
        },
        {
            id: 6,
            title: "Fantasy Makeup Transformation",
            description: "Complete character transformation using advanced makeup techniques.",
            category: "Creative Make Up",
            rating: 4.9,
            image: "/images/placeholder-creative.jpg",
            contestant: "Isabella Garcia",
            date: "2025-05-03"
        }
    ];

    // Filter categories for the filter UI
    const categories = [...new Set(topRatedWorks.map(work => work.category))];

    return (
        <ContestantLayout>
            <div className="w-full max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-heading font-bold text-primary">Top Rated Works</h1>

                    <div className="flex gap-2">
                        <select className="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded">
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <select className="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded">
                            <option value="rating">Highest Rated</option>
                            <option value="date">Most Recent</option>
                        </select>
                    </div>
                </div>

                {/* Featured work - highest rated */}
                <div className="mb-10">
                    <h2 className="text-2xl font-heading font-bold mb-4">Featured Work</h2>
                    <div className="bg-black rounded-2xl shadow-2xl border border-accent overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/2 relative h-80 bg-gray-800 flex items-center justify-center">
                                <ImageWithFallback
                                    src={topRatedWorks[0].image}
                                    fallbackSrc={defaultImage}
                                    alt={topRatedWorks[0].title}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    priority
                                />
                            </div>
                            <div className="md:w-1/2 p-8 text-white">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="bg-primary text-white text-sm py-1 px-3 rounded-full">
                                        {topRatedWorks[0].category}
                                    </span>
                                    <div className="flex items-center">
                                        <span className="text-yellow-400 font-bold mr-2">{topRatedWorks[0].rating}</span>
                                        <StarRating rating={Math.round(topRatedWorks[0].rating)} />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-accent mb-2">{topRatedWorks[0].title}</h3>
                                <p className="text-gray-300 mb-4">{topRatedWorks[0].description}</p>
                                <div className="mt-auto">
                                    <p className="text-gray-400">By {topRatedWorks[0].contestant}</p>
                                    <p className="text-gray-400 text-sm">
                                        {new Date(topRatedWorks[0].date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid of other top rated works */}
                <div>
                    <h2 className="text-2xl font-heading font-bold mb-4">Other Top Rated Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topRatedWorks.slice(1).map((work) => (
                            <div key={work.id} className="bg-black rounded-2xl shadow-2xl border border-accent overflow-hidden">
                                <div className="relative h-48 w-full bg-gray-800 flex items-center justify-center">
                                    <ImageWithFallback
                                        src={work.image}
                                        fallbackSrc={defaultImage}
                                        alt={work.title}
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <div className="p-6 text-white">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="bg-primary text-white text-xs py-1 px-2 rounded-full">
                                            {work.category}
                                        </span>
                                        <div className="flex items-center">
                                            <span className="text-yellow-400 font-bold text-sm mr-1">{work.rating}</span>
                                            <StarRating rating={Math.round(work.rating)} />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-accent mb-2">{work.title}</h3>
                                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{work.description}</p>
                                    <div className="flex justify-between items-center text-sm">
                                        <p className="text-gray-400">By {work.contestant}</p>
                                        <p className="text-gray-400">
                                            {new Date(work.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to action */}
                <div className="mt-12 text-center">
                    <p className="text-lg mb-4">Ready to showcase your work and get rated by our judges?</p>
                    <Link href="/contestant/submit" className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-yellow-600 transition inline-block">
                        Submit Your Work
                    </Link>
                </div>
            </div>
        </ContestantLayout>
    );
} 