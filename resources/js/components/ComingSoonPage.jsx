import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ComingSoonPage({ title = 'Coming Soon' }) {
    return (
        <div className="min-h-screen bg-[#00144d] font-poppins text-white selection:bg-blue-600 selection:text-white">
            <Navbar />

            <section className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 pt-28 pb-16 text-center sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                    {title}
                </h1>
                <Link
                    to="/"
                    className="rounded-full bg-white/10 px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase backdrop-blur-md transition-colors hover:bg-white/20"
                >
                    Kembali ke Beranda
                </Link>
            </section>

            <Footer />
        </div>
    );
}
