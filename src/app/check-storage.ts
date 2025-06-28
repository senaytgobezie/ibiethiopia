import { supabase } from '@/utils/supabaseClient';

export async function checkStoragePermissions() {
    try {
        // List buckets
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

        console.log('Available buckets:', buckets);
        if (bucketsError) {
            console.error('Error listing buckets:', bucketsError);
        }

        // Try to get the payment-screenshots bucket
        const { data: bucket, error: bucketError } = await supabase.storage.getBucket('payment-screenshots');

        console.log('Payment screenshots bucket:', bucket);
        if (bucketError) {
            console.error('Error getting bucket:', bucketError);
        }

        // Try to list files in the payment-screenshots bucket
        const { data: files, error: filesError } = await supabase.storage.from('payment-screenshots').list();

        console.log('Files in payment-screenshots bucket:', files);
        if (filesError) {
            console.error('Error listing files:', filesError);
        }

        return { buckets, bucket, files };
    } catch (e) {
        console.error('Exception checking storage permissions:', e);
        return { error: e };
    }
} 