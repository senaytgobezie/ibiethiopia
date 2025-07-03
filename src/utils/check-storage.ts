import { createClient } from '@/utils/supabase/client';

export async function checkStoragePermissions() {
    const supabase = createClient();

    try {
        // Check if we can list buckets
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

        if (bucketsError) {
            return {
                success: false,
                error: `Cannot list buckets: ${bucketsError.message}`,
                buckets: null
            };
        }

        // Check for payment-screenshots bucket
        const paymentBucket = buckets.find(b => b.name === 'payment-screenshots');

        // Try to create the bucket if it doesn't exist
        if (!paymentBucket) {
            const { data: newBucket, error: createError } = await supabase.storage.createBucket('payment-screenshots', {
                public: false
            });

            if (createError) {
                return {
                    success: false,
                    error: `Cannot create bucket: ${createError.message}`,
                    buckets
                };
            }

            return {
                success: true,
                message: 'Created payment-screenshots bucket successfully',
                buckets: [...buckets, newBucket]
            };
        }

        // Check if we can list files in the bucket
        const { data: files, error: filesError } = await supabase.storage
            .from('payment-screenshots')
            .list();

        if (filesError) {
            return {
                success: false,
                error: `Cannot list files in bucket: ${filesError.message}`,
                buckets
            };
        }

        return {
            success: true,
            message: 'Storage permissions check passed',
            buckets,
            files
        };

    } catch (err: any) {
        return {
            success: false,
            error: `Storage check exception: ${err.message || 'Unknown error'}`
        };
    }
} 