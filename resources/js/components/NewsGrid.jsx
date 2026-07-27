import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticles } from '../api/client';

export default function NewsGrid() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        getArticles()
            .then((res) => setArticles((res.data || []).slice(0, 3)))
            .catch(() => setArticles([]));
    }, []);

    if (articles.length === 0) {
        return null;
    }

    return (
        <section
            id="news-grid"
            className="bg-[#dcdcdc] px-4 py-20 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-6xl">
                <div className="mb-12 text-center">
                    <h2 className="mb-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                        Berita Terbaru
                    </h2>
                    <p className="text-sm text-slate-600 sm:text-base">
                        Update terbaru seputar The Blues, langsung dari redaksi
                        Chelind.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {articles.map((item) => (
                        <Link
                            to={`/berita/${item.slug}`}
                            key={item.id}
                            className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
                        >
                            <div className="relative aspect-video overflow-hidden">
                                <img
                                    src={item.cover_image}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="flex flex-1 flex-col p-6">
                                <span className="mb-2 text-[11px] font-extrabold tracking-wider text-[#001f66] uppercase">
                                    {item.category?.name}
                                </span>
                                <h3 className="mb-2 text-base leading-snug font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                                    {item.title}
                                </h3>
                                <p className="mt-auto line-clamp-3 text-xs leading-relaxed text-slate-600">
                                    {item.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        to="/berita"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#001f66] px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all hover:bg-[#002db3]"
                    >
                        Lihat Semua Berita
                    </Link>
                </div>
            </div>
        </section>
    );
}
