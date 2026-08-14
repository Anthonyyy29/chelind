import React from 'react';
import { Link } from 'react-router-dom';

export default function FeatureShowcase() {
    return (
        <section className="w-full overflow-hidden bg-[#bebebe] font-poppins">
            <div className="grid min-h-[440px] w-full grid-cols-1 border-b border-slate-400/40 md:min-h-[480px] md:grid-cols-2">
                <div className="h-[360px] w-full overflow-hidden md:h-full">
                    <img
                        src="/assets/HomePage_replacement_img/Matchday.jpg"
                        alt="Matchday Chelsea"
                        className="h-full w-full object-cover object-center"
                    />
                </div>

                <div className="flex min-h-[360px] flex-col items-start justify-center bg-[#bebebe] p-8 text-left sm:p-14 md:p-16">
                    <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[#0f172a] sm:text-4xl">
                        Matchday
                    </h2>
                    <p className="mb-6 max-w-md text-xs leading-relaxed text-slate-700 sm:text-sm">
                        Cek jadwal lengkap pertandingan Chelsea, kapan pun dan
                        di mana pun mereka bertanding.
                    </p>
                    <Link
                        to="/matchday"
                        className="rounded-full bg-[#001f66] px-7 py-3 text-xs font-bold text-white shadow-md transition-all duration-200 hover:bg-[#002db3] hover:shadow-lg"
                    >
                        Lihat Selengkapnya
                    </Link>
                </div>
            </div>

            <div className="grid min-h-[440px] w-full grid-cols-1 border-b border-slate-400/40 md:min-h-[480px] md:grid-cols-2">
                <div className="order-2 flex min-h-[360px] flex-col items-start justify-center bg-[#bebebe] p-8 text-left sm:p-14 md:order-1 md:p-16">
                    <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[#0f172a] sm:text-4xl">
                        News
                    </h2>
                    <p className="mb-6 max-w-md text-xs leading-relaxed text-slate-700 sm:text-sm">
                        Update berita terbaru seputar tim, pemain, dan performa
                        The Blues sepanjang musim.
                    </p>
                    <Link
                        to="/berita"
                        className="rounded-full bg-[#001f66] px-7 py-3 text-xs font-bold text-white shadow-md transition-all duration-200 hover:bg-[#002db3] hover:shadow-lg"
                    >
                        Lihat Selengkapnya
                    </Link>
                </div>

                <div className="order-1 h-[360px] w-full overflow-hidden md:order-2 md:h-full">
                    <img
                        src="/assets/HomePage_replacement_img/News.jpg"
                        alt="News Chelsea Squad"
                        className="h-full w-full object-cover object-center"
                    />
                </div>
            </div>

            <div className="grid min-h-[440px] w-full grid-cols-1 md:min-h-[480px] md:grid-cols-2">
                <div className="h-[360px] w-full overflow-hidden md:h-full">
                    <img
                        src="/assets/HomePage_replacement_img/Transfer News.jpg"
                        alt="Transfer Rumour Chelsea"
                        className="h-full w-full object-cover object-center"
                    />
                </div>

                <div className="flex min-h-[360px] flex-col items-start justify-center bg-[#bebebe] p-8 text-left sm:p-14 md:p-16">
                    <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-[#0f172a] sm:text-4xl">
                        Transfer Rumour
                    </h2>
                    <p className="mb-6 max-w-md text-xs leading-relaxed text-slate-700 sm:text-sm">
                        Pantau pergerakan transfer Chelsea, dari rumor hingga
                        resmi, lengkap dengan detail fee terbaru.
                    </p>
                    <Link
                        to="/transfer"
                        className="rounded-full bg-[#001f66] px-7 py-3 text-xs font-bold text-white shadow-md transition-all duration-200 hover:bg-[#002db3] hover:shadow-lg"
                    >
                        Lihat Selengkapnya
                    </Link>
                </div>
            </div>

            <div className="w-full border-b border-slate-400" />
        </section>
    );
}
