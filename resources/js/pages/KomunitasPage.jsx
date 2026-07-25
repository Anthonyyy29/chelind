import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getSocialLinks } from '../api/client';

export default function KomunitasPage() {
    const [socials, setSocials] = useState([]);

    useEffect(() => {
        getSocialLinks()
            .then((data) => setSocials(Array.isArray(data) ? data : []))
            .catch(() => setSocials([]));
    }, []);

    return (
        <div className="min-h-screen bg-[#bebebe] font-poppins text-slate-900 selection:bg-blue-600 selection:text-white">
            <Navbar />

            <section
                className="relative flex min-h-[50vh] items-center justify-center overflow-hidden px-4 pt-24 pb-16 text-center"
                style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0, 10, 35, 0.55) 0%, rgba(0, 10, 35, 0.85) 100%), url("/assets/news/chelsea.jpg")`,
                    backgroundPosition: 'center 40%',
                    backgroundSize: 'cover',
                }}
            >
                <div className="mx-auto max-w-2xl text-white">
                    <h1 className="mb-4 text-3xl leading-tight font-black tracking-tight drop-shadow-xl sm:text-5xl">
                        Join Our Community
                    </h1>
                    <p className="text-base leading-relaxed text-slate-200 sm:text-lg">
                        Gabung dengan ribuan sesama fans Chelsea di Indonesia —
                        diskusi pertandingan, transfer, dan nonton bareng.
                    </p>
                </div>
            </section>

            <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                {socials.length === 0 ? (
                    <p className="text-center text-sm text-slate-600">
                        Belum ada link komunitas tersedia.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {socials.map((item) => (
                            <a
                                key={item.id}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col rounded-2xl border border-slate-300/60 bg-white p-6 shadow-sm transition-all hover:shadow-xl"
                            >
                                <span className="mb-1 text-[11px] font-extrabold tracking-wider text-blue-600 uppercase">
                                    {item.platform}
                                </span>
                                <h3 className="mb-2 text-lg font-extrabold text-slate-900 group-hover:text-blue-700">
                                    {item.handle}
                                </h3>
                                {item.description && (
                                    <p className="mb-4 text-xs leading-relaxed text-slate-600">
                                        {item.description}
                                    </p>
                                )}
                                <span className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-[#001f66] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all group-hover:bg-[#002db3]">
                                    Kunjungi
                                </span>
                            </a>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
