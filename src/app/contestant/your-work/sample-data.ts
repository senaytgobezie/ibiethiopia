// This file contains sample data for demonstration purposes
// In a real application, this data would come from the database

export const sampleSubmissions = [
    {
        id: '1',
        title: 'Creative Look',
        description: 'This is a creative look done by me, I tried to tell a story',
        status: 'approved',
        submitted_at: '2025-06-29',
        file_path: 'submissions/creative-look.jpg',
        publicUrl: '/images/logo transparent.png',
        rating: 4.5,
        judge_comments: 'Excellent work! The concept is unique and the execution is very professional. The way you integrated the story elements into the design shows great creativity and technical skill.'
    },
    {
        id: '2',
        title: 'Modern Bridal Makeup',
        description: 'A contemporary take on bridal makeup with subtle highlights',
        status: 'approved',
        submitted_at: '2025-06-15',
        file_path: 'submissions/bridal-makeup.jpg',
        publicUrl: '/images/logo transparent.png',
        rating: 4.0,
        judge_comments: 'Very well done. The subtle highlights complement the bride\'s features beautifully. Consider more attention to the blending around the temple area.'
    },
    {
        id: '3',
        title: 'Abstract Nail Art',
        description: 'Geometric patterns inspired by modern art',
        status: 'pending',
        submitted_at: '2025-07-02',
        file_path: 'submissions/nail-art.jpg',
        publicUrl: '/images/logo transparent.png'
    },
    {
        id: '4',
        title: 'Traditional Halal Style',
        description: 'Combining traditional elements with modern techniques',
        status: 'rejected',
        submitted_at: '2025-05-20',
        file_path: 'submissions/halal-style.jpg',
        publicUrl: '/images/logo transparent.png',
        judge_comments: 'The concept is interesting but the execution needs more refinement. Please review the guidelines for this category and consider resubmitting with improvements to the technique.'
    }
]; 