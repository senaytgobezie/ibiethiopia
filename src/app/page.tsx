import Image from 'next/image';
import Button from './components/Button';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen bg-black  bg-hero  flex flex-col items-center justify-center text-text">
            <div className=" bg-white/35 flex flex-col items-center gap-8 w-full max-w-lg mx-auto rounded-2xl p-10">
                <div className="flex flex-col items-center gap-8 w-full">
                    <Image src="/images/bg.png" alt="IBI Logo" width={100} height={100} className="mb-2" />
                    <div className="flex flex-col items-center">
                        <h1 className=" w-full text-4xl font-heading text-primary font-bold text-center mb-4">Welcome to IBI Ethiopia Portal</h1>
                        <p className="text-white text-lg text-center mb-6">
                            Please select your portal to continue. Only registered contestants and judges can access their respective dashboards.
                        </p>
                        <div className="flex flex-row gap-4 w-full">
                            <Link href="/contestant/login" className="w-full">
                                <Button className="w-80%">Contestant Login</Button>
                            </Link>
                            <Link href="/judge/login" className="w-full">
                                <Button className="w-80%">Judges Login</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
