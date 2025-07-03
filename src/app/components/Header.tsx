"use client";
import Link from 'next/link';
import Image from 'next/image';
import Button from './Button';
import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();

    let buttonText = "Login";
    let buttonHref = "/login";
    if (pathname === "/login") {
        buttonText = "Register";
        buttonHref = "/register";
    } else if (pathname === "/register") {
        buttonText = "Login";
        buttonHref = "/login";
    }

    return (
        <header className="w-full flex items-center justify-between px-12 py-4 border-b border-accent bg-black shadow-lg m-0 rounded-none z-10" style={{ background: '#000', position: 'sticky', top: 0 }}>
            <div className="flex items-center gap-4">
                <Image src="/images/bg.png" alt="Beauty Logo" width={100} height={100} className="object-contain" />
            </div>
            <nav className="flex-1 flex justify-center gap-10 text-white font-medium font-Cormorant ">
                <Link href="/contestant" className=" text-lg hover:text-accent transition text-white ">Home</Link>
                <Link href="/contestant/submit" className=" text-lg hover:text-accent transition text-white ">About</Link>
                <Link href="/contestant/profile" className=" text-lg hover:text-accent transition text-white ">Submit Your Work</Link>
            </nav>
            <Link href={buttonHref}>
                <Button type="button">{buttonText}</Button>
            </Link>
        </header>
    );
} 