export default function StarRating({ rating, maxStars = 5 }: { rating: number, maxStars?: number }) {
    // Round to nearest half
    const roundedRating = Math.round(rating * 2) / 2;

    return (
        <div className="flex text-yellow-400">
            {[...Array(maxStars)].map((_, i) => {
                const starValue = i + 1;

                // Full star
                if (starValue <= roundedRating) {
                    return <span key={i} className="text-yellow-400">★</span>;
                }
                // Half star
                else if (starValue - 0.5 === roundedRating) {
                    return <span key={i} className="text-yellow-400 relative">
                        <span className="absolute inset-0 overflow-hidden w-1/2">★</span>
                        <span className="text-gray-600">★</span>
                    </span>;
                }
                // Empty star
                else {
                    return <span key={i} className="text-gray-600">★</span>;
                }
            })}
        </div>
    );
} 