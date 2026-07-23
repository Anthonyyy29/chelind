import React from 'react';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center text-center overflow-hidden pt-24 pb-16 px-4"
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover z-0 transition-transform duration-1000"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0, 10, 35, 0.45) 0%, rgba(0, 10, 35, 0.75) 100%), url("assets/news/hero.jpg")`,
          backgroundPosition: 'center 40%',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-white">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight drop-shadow-xl mb-4">
          Selamat Datang di Website<br className="hidden sm:inline" /> Resmi Chelind
        </h1>
        <p className="text-base sm:text-xl text-slate-200 font-normal max-w-2xl mx-auto mb-8 leading-relaxed drop-shadow-md">
          Fanspage Chelsea terbesar dan terlengkap nomor 1 di Indonesia.
        </p>
        <div>
          <a
            href="#news-page"
            className="inline-flex items-center justify-center px-9 py-3.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-[#001f66] hover:bg-[#002db3] text-white shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            BACA SELENGKAPNYA DISINI
          </a>
        </div>
      </div>
    </section>
  );
}
