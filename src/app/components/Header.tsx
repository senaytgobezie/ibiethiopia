"use client";
import Link from 'next/link';
import Image from 'next/image';
import Button from './Button';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();

    let buttonText = "Login";
    let buttonHref = "/contestant/login";
    if (pathname === "/contestant/login") {
        buttonText = "Register";
        buttonHref = "/contestant/register";
    } else if (pathname === "/contestant/register") {
        buttonText = "Login";
        buttonHref = "/contestant/login";
    }

    return (
        <header className="w-full flex items-center justify-between px-12 py-4 border-b border-accent bg-black shadow-lg m-0 rounded-none" style={{ background: '#000' }}>
            <div className="flex items-center gap-4">
                <Image src="/images/bg.png" alt="Beauty Logo" width={100} height={100} className="object-contain" />
            </div>
            <nav className="flex-1 flex justify-center gap-10 text-white font-medium font-Cormorant ">
                <Link href="/contestant" className=" text-lg hover:text-accent transition text-white ">Dashboard</Link>
                <Link href="/contestant/submit" className=" text-lg hover:text-accent transition text-white ">Submit Entry</Link>
                <Link href="/contestant/profile" className=" text-lg hover:text-accent transition text-white ">Profile</Link>
            </nav>
            <Link href={buttonHref}>
                <Button type="button">{buttonText}</Button>
            </Link>
        </header>
    );
} 