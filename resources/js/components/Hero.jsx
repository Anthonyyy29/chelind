import React from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
    return (
        <section
            id="hero"
            className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-4 pt-24 pb-16 text-center sm:min-h-[85vh] lg:min-h-screen"
        >
            <div
                className="absolute inset-0 z-0 bg-cover"
                style={{
                    backgroundImage: `linear-gradient(180deg, rgba(0, 10, 35, 0.45) 0%, rgba(0, 10, 35, 0.75) 100%), url("/assets/news/hero.jpg")`,
                    backgroundPosition: 'center 40%',
                }}
            />

            <div className="relative z-10 mx-auto max-w-4xl text-white">
                <h1 className="mb-4 text-3xl leading-tight font-black tracking-tight drop-shadow-xl sm:text-5xl md:text-6xl">
                    Selamat Datang di Website
                    <br className="hidden sm:inline" /> Resmi Chelind
                </h1>
                <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed font-normal text-slate-200 drop-shadow-md sm:text-xl">
                    Fanspage Chelsea terbesar dan terlengkap nomor 1 di
                    Indonesia.
                </p>
                <Link
                    to="/berita"
                    className="inline-flex transform items-center justify-center rounded-full bg-[#001f66] px-9 py-3.5 text-xs font-extrabold tracking-wider text-white uppercase shadow-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#002db3] hover:shadow-blue-500/40 active:translate-y-0 sm:text-sm"
                >
                    Baca Selengkapnya Disini
                </Link>
            </div>
        </section>
    );
}
