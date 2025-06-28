import Image from 'next/image';

export default function Sidebar() {
    return (
        <aside className="w-64 min-h-screen bg-black text-white flex flex-col py-10 px-6 gap-6 shadow-lg items-center">
            <Image src="/images/logo transparent.png" alt="IBI Ethiopia Logo" width={90} height={90} className="mb-6" />
            <h2 className="text-xl  w-full text-left font-bold text-accent mb-6">Contestant Menu</h2>
            <nav className="flex flex-col gap-4 w-full">
                <a href="/contestant/profile" className="hover:text-accent transition text-lg font-medium">Profile</a>
                <a href="/contestant/your-work" className="hover:text-accent transition text-lg font-medium">Your Work</a>
                <a href="/contestant/ratings" className="hover:text-accent transition text-lg font-medium">Ratings</a>
                <a href="/contestant/notices" className="hover:text-accent transition text-lg font-medium">Notice Board</a>
            </nav>
        </aside>
    );
}
