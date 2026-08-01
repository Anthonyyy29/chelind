import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
    { to: '/berita', label: 'News' },
    { to: '/transfer', label: 'Transfer Rumour' },
    { to: '/matchday', label: 'Matchday' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 12);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'border-b border-white/10 bg-[#000f3a]/95 py-3 shadow-xl backdrop-blur-md'
                    : 'bg-gradient-to-b from-[#000f3a]/90 to-transparent py-4'
            }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="group flex items-center gap-1">
                    <span className="text-2xl font-extrabold tracking-tight text-white">
                        chel
                        <span className="mx-0.5 inline-block h-2.5 w-2.5 rounded-full bg-blue-500 transition-transform group-hover:scale-125"></span>
                        indo
                    </span>
                </Link>

                <nav className="hidden items-center gap-8 text-sm font-semibold tracking-wider text-slate-300 md:flex">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            to={link.to}
                            className="uppercase transition-colors hover:text-blue-400"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 md:flex">
                    <Link
                        to="/komunitas"
                        className="rounded-full bg-[#001f66] px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-lg transition-all duration-200 hover:bg-[#002db3] hover:shadow-blue-500/25 active:scale-95"
                    >
                        Join Our Community
                    </Link>
                </div>

                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label="Toggle Navigation Menu"
                    className="rounded-lg p-2 text-slate-200 hover:bg-white/10 hover:text-white focus:outline-none md:hidden"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {isMobileOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {isMobileOpen && (
                <div className="space-y-4 border-b border-white/10 bg-[#000f3a] px-4 pt-4 pb-6 md:hidden">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            to={link.to}
                            onClick={() => setIsMobileOpen(false)}
                            className="block border-b border-white/5 py-2 text-sm font-semibold tracking-wider text-slate-200 hover:text-blue-400"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        to="/komunitas"
                        onClick={() => setIsMobileOpen(false)}
                        className="block w-full rounded-full bg-[#001f66] px-5 py-3 text-center text-xs font-bold tracking-wider text-white uppercase shadow-lg"
                    >
                        Join Our Community
                    </Link>
                </div>
            )}
        </header>
    );
}
