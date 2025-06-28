'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { checkStoragePermissions } from '../check-storage';

export default function TestStorage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadResult, setUploadResult] = useState<any>(null);
    const [permissionsResult, setPermissionsResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function checkPermissions() {
            try {
                const result = await checkStoragePermissions();
                setPermissionsResult(result);
            } catch (e) {
                console.error('Error checking permissions:', e);
                setError('Error checking permissions');
            }
        }
        checkPermissions();
    }, []);

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

        setLoading(true);
        setError('');
        setUploadResult(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `test_${Date.now()}.${fileExt}`;
            const filePath = `test/${fileName}`;

            console.log('Uploading file:', filePath);

            const { data, error: uploadError } = await supabase.storage
                .from('payment-screenshots')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Upload error:', uploadError);
                setError(`Upload failed: ${uploadError.message}`);
            } else {
                console.log('Upload successful:', data);
                setUploadResult(data);
            }
        } catch (err) {
            console.error('Upload exception:', err);
            setError(`Upload exception: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Storage Test Page</h1>

            <div className="mb-8 p-4 bg-gray-100 rounded">
                <h2 className="text-xl font-semibold mb-2">Storage Permissions</h2>
                {permissionsResult ? (
                    <pre className="whitespace-pre-wrap bg-white p-4 rounded border">
                        {JSON.stringify(permissionsResult, null, 2)}
                    </pre>
                ) : (
                    <p>Checking permissions...</p>
                )}
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Test File Upload</h2>
                <div className="flex flex-col gap-4">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="border p-2 rounded"
                    />
                    <button
                        onClick={handleUpload}
                        disabled={loading || !file}
                        className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
                    >
                        {loading ? 'Uploading...' : 'Upload File'}
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {uploadResult && (
                    <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
                        <h3 className="font-semibold">Upload Successful!</h3>
                        <pre className="whitespace-pre-wrap bg-white p-2 mt-2 rounded border">
                            {JSON.stringify(uploadResult, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
} 