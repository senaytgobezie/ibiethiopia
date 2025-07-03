'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function TestStorage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setUploading(true);
        setError(null);
        setUploadResult(null);

        try {
            const supabase = createClient();

            // Check if bucket exists
            const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

            if (bucketsError) {
                throw new Error(`Error listing buckets: ${bucketsError.message}`);
            }

            console.log('Available buckets:', buckets);

            // Create bucket if it doesn't exist
            if (!buckets.some(b => b.name === 'payment-screenshots')) {
                const { data: newBucket, error: createError } = await supabase.storage.createBucket('payment-screenshots', {
                    public: false
                });

                if (createError) {
                    throw new Error(`Error creating bucket: ${createError.message}`);
                }

                console.log('Created new bucket:', newBucket);
            }

            // Upload file
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `test/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('payment-screenshots')
                .upload(filePath, file);

            if (uploadError) {
                throw new Error(`Upload error: ${uploadError.message}`);
            }

            setUploadResult({
                success: true,
                path: uploadData?.path,
                fullPath: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/payment-screenshots/${uploadData?.path}`
            });

        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.message || 'An unknown error occurred');
            setUploadResult({ success: false });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Test Storage Upload</h1>

            <div className="mb-4">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="border p-2 w-full"
                />
            </div>

            <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-300"
            >
                {uploading ? 'Uploading...' : 'Upload File'}
            </button>

            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {uploadResult && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    <h3 className="font-bold">{uploadResult.success ? 'Upload Successful!' : 'Upload Failed'}</h3>
                    {uploadResult.success && (
                        <div className="mt-2">
                            <p><strong>Path:</strong> {uploadResult.path}</p>
                            <p className="mt-1"><strong>Full URL:</strong> {uploadResult.fullPath}</p>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-8 p-4 bg-gray-100 rounded">
                <h2 className="text-lg font-bold mb-2">Debug Info:</h2>
                <pre className="whitespace-pre-wrap text-xs">
                    {JSON.stringify({
                        file: file ? {
                            name: file.name,
                            size: file.size,
                            type: file.type
                        } : null,
                        uploadResult,
                        error
                    }, null, 2)}
                </pre>
            </div>
        </div>
    );
} 