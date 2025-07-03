'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';

const categories = [
    'Halal',
    'Hair Artistry',
    'Makeup Artistry',
    'Fashion Design',
    'Nail Artistry',
    'Creative Make Up',
];

export default function ContestantRegister() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleCategoryChange = (cat: string) => {
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 1. Sign up user
        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        // 2. Upload payment screenshot
        let paymentScreenshotUrl = '';
        if (paymentScreenshot) {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('payment-screenshots')
                .upload(`screenshots/${Date.now()}_${paymentScreenshot.name}`, paymentScreenshot);

            if (uploadError) {
                setError(uploadError.message);
                setLoading(false);
                return;
            }
            paymentScreenshotUrl = uploadData?.path || '';
        }

        // 3. Insert into contestants table
        const user = data.user;
        if (user) {
            const { error: dbError } = await supabase
                .from('contestants')
                .insert({
                    user_id: user.id,
                    name: name,
                    email: email,
                    phone: phone,
                    gender: gender,
                    categories: selectedCategories.join(','),
                    payment_screenshot: paymentScreenshotUrl,
                });

            if (dbError) {
                setError(dbError.message);
                setLoading(false);
                return;
            }
        }

        // Redirect to login page instead of dashboard
        router.push('/login');
        setLoading(false);
    };

    return (
        <div className="min-h-screen relative bg-black overflow-hidden">
            {/* Black overlay */}
            <div className="absolute inset-0 bg-black opacity-70 z-10" />
            <div className="relative z-20 w-full">
                <div style={{ margin: 0 }}>
                    <Header />
                </div>
                <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
                    <form className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl" onSubmit={handleRegister}>
                        <h1 className="text-2xl text-center font-semibold text-primary mb-6">Contestant Registration</h1>
                        {step === 1 && (
                            <>
                                <div className="flex gap-4 mb-4">
                                    <div className="flex flex-col gap-2 w-full ">
                                        <label className="text-gray-700">Full Name</label>
                                        <input className="w-full p-2 rounded bg-background border border-accent text-text" type="text" required value={name} onChange={e => setName(e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex gap-4 mb-2">
                                    <div className="flex flex-col gap-2  w-1/2">
                                        <label className="text-gray-700 ">Email Address</label>
                                        <input className="w-full p-2 rounded bg-background border border-accent text-text" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
                                    </div>
                                    <div className="flex flex-col gap-2 w-1/2">
                                        <label className="text-gray-700">Phone Number</label>
                                        <input className="w-full p-2 rounded bg-background border border-accent text-text" type="tel" required value={phone} onChange={e => setPhone(e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 mb-6">
                                    <label className="text-gray-700">Password</label>
                                    <input className="w-full p-2 rounded bg-background border border-accent text-text" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                                <div className="flex flex-col gap-2 mb-6">
                                    <label className="text-gray-700">Gender</label>
                                    <div className="flex gap-8 mt-1">
                                        <label className="flex items-center gap-2 text-text">
                                            <input type="radio" name="gender" value="Male" className="accent-accent" required checked={gender === 'Male'} onChange={() => setGender('Male')} /> Male
                                        </label>
                                        <label className="flex items-center gap-2 text-text">
                                            <input type="radio" name="gender" value="Female" className="accent-accent" required checked={gender === 'Female'} onChange={() => setGender('Female')} /> Female
                                        </label>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="w-full bg-primary text-background py-2 rounded hover:bg-yellow-600 transition mb-2"
                                    onClick={() => setStep(2)}
                                >
                                    Next
                                </button>
                            </>
                        )}
                        {step === 2 && (
                            <div className="w-full">
                                <div className="flex flex-col gap-2 mb-4 w-full">
                                    <label className="text-gray-700 flex items-center gap-2">
                                        Choose Your Selected Category
                                        <span className="text-accent text-lg cursor-help" title="You can select more than one category">?</span>
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {categories.map((cat) => (
                                            <label key={cat} className="flex items-center gap-2 text-text">
                                                <input
                                                    type="checkbox"
                                                    value={cat}
                                                    checked={selectedCategories.includes(cat)}
                                                    onChange={() => handleCategoryChange(cat)}
                                                    className="accent-accent"
                                                />
                                                {cat}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-full bg-white/90 border-l-4 border-primary p-4 rounded text-black text-base mb-2">
                                    <strong className="block text-primary mb-1">Important:</strong>
                                    Please pay the registration fee and upload a screenshot of your payment <span className="font-bold">before</span> registering. Your registration will not be accepted without payment proof.
                                </div>
                                <div className="flex flex-col gap-2 mb-4 w-full">
                                    <label className="text-gray-700">Upload Payment Screenshot</label>
                                    <input type="file" accept="image/*" className="w-full p-2 rounded border border-accent bg-white text-black" required onChange={e => setPaymentScreenshot(e.target.files?.[0] || null)} />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        className="w-32 bg-gray-300 text-black py-2 rounded hover:bg-gray-400 transition"
                                        onClick={() => setStep(1)}
                                    >
                                        Back
                                    </button>
                                    <button
                                        className="w-32 bg-primary text-background py-2 rounded hover:bg-yellow-600 transition"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Registering...' : 'Register'}
                                    </button>
                                </div>
                                {error && <div className="text-red-500 mt-2">{error}</div>}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
