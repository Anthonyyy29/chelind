import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsappBanner from '../components/WhatsappBanner';
import { getArticles, getCategories, getPlayers } from '../api/client';

export default function NewsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get('kategori') || '';

    const [categories, setCategories] = useState([]);
    const [articles, setArticles] = useState([]);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const playersScrollRef = useRef(null);

    const scrollPlayers = (direction) => {
        if (!playersScrollRef.current) {
            return;
        }

        const { scrollLeft, clientWidth } = playersScrollRef.current;
        const scrollAmount =
            direction === 'left' ? -clientWidth / 2 : clientWidth / 2;

        playersScrollRef.current.scrollTo({
            left: scrollLeft + scrollAmount,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => setCategories([]));
        getPlayers()
            .then((data) => setPlayers(Array.isArray(data) ? data : []))
            .catch(() => setPlayers([]));
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = activeCategory ? { category: activeCategory } : {};

        getArticles(params)
            .then((res) => setArticles(res.data || []))
            .catch(() => setArticles([]))
            .finally(() => setLoading(false));
    }, [activeCategory]);

    const activeCategoryName = categories.find(
        (c) => c.slug === activeCategory,
    )?.name;

    const featured = articles[0];
    const rest = articles.slice(1);

    return (
        <div className="min-h-screen bg-[#bebebe] font-poppins text-slate-900 selection:bg-blue-600 selection:text-white">
            <Navbar />

            <section className="relative flex h-[40vh] w-full items-center justify-center overflow-hidden pt-20 text-center sm:h-[48vh]">
                <div
                    className="absolute inset-0 z-0 bg-cover"
                    style={{
                        backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.75) 100%), url("/assets/news/hero.jpg")`,
                        backgroundPosition: 'center 45%',
                    }}
                />
                <div className="relative z-10 mx-auto max-w-4xl px-4 text-white">
                    <span className="mb-2 block text-[11px] font-extrabold tracking-widest text-slate-300 uppercase">
                        Chelindo Newsroom
                    </span>
                    <h1 className="text-4xl font-black tracking-tight uppercase drop-shadow-md sm:text-6xl">
                        {activeCategoryName || 'News'}
                    </h1>
                </div>
            </section>

            <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
                <div className="mb-10 flex flex-wrap items-center gap-2 border-b border-slate-400/60 pb-4">
                    <button
                        onClick={() => setSearchParams({})}
                        className={`rounded-sm border px-4 py-1.5 text-[11px] font-extrabold tracking-wider uppercase transition-all ${
                            !activeCategory
                                ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                                : 'border-slate-400 bg-white text-slate-700 hover:border-slate-800'
                        }`}
                    >
                        Semua
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() =>
                                setSearchParams({ kategori: cat.slug })
                            }
                            className={`rounded-sm border px-4 py-1.5 text-[11px] font-extrabold tracking-wider uppercase transition-all ${
                                activeCategory === cat.slug
                                    ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                                    : 'border-slate-400 bg-white text-slate-700 hover:border-slate-800'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {!loading && articles.length === 0 && (
                    <p className="py-16 text-center text-sm text-slate-600">
                        Belum ada berita di kategori ini.
                    </p>
                )}

                {featured && (
                    <Link
                        to={`/berita/${featured.slug}`}
                        className="group mb-12 block w-full overflow-hidden rounded-2xl border border-slate-300/60 shadow-2xl"
                    >
                        <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/10]">
                            <img
                                src={featured.cover_image}
                                alt={featured.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 sm:p-10">
                                <div className="max-w-2xl text-white">
                                    <span className="mb-3 inline-block rounded bg-blue-600 px-3 py-1 text-[10px] font-extrabold tracking-wider text-white uppercase shadow">
                                        {featured.category?.name}
                                    </span>
                                    <h2 className="mb-3 text-2xl leading-tight font-extrabold tracking-tight transition-colors group-hover:text-blue-300 sm:text-4xl">
                                        {featured.title}
                                    </h2>
                                    <p className="line-clamp-2 text-xs leading-relaxed text-slate-200 sm:text-sm">
                                        {featured.excerpt}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {players.length > 0 && (
                    <div className="mb-12">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-extrabold text-slate-900">
                                Pemain
                            </h2>
                            <div className="hidden items-center gap-2 sm:flex">
                                <button
                                    onClick={() => scrollPlayers('left')}
                                    className="rounded-full bg-white p-2 text-slate-800 shadow transition-colors hover:bg-slate-100"
                                    title="Scroll Kiri"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => scrollPlayers('right')}
                                    className="rounded-full bg-white p-2 text-slate-800 shadow transition-colors hover:bg-slate-100"
                                    title="Scroll Kanan"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div
                            ref={playersScrollRef}
                            className="flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto pb-2"
                        >
                            {players.map((player) => (
                                <div
                                    key={player.id}
                                    className="flex w-44 shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-slate-300/60 bg-white shadow-sm"
                                >
                                    <div className="aspect-[3/4] overflow-hidden bg-slate-900">
                                        {player.photo && (
                                            <img
                                                src={player.photo}
                                                alt={player.name}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <span className="mb-1 block text-[10px] font-bold tracking-wider text-blue-600 uppercase">
                                            {player.position}
                                        </span>
                                        <h3 className="text-sm leading-tight font-extrabold text-slate-900">
                                            {player.name}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {rest.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-400/60 pb-4">
                            <h2 className="text-2xl font-extrabold text-slate-900">
                                Latest
                            </h2>
                            {activeCategory && (
                                <button
                                    onClick={() => setSearchParams({})}
                                    className="flex items-center gap-1 text-xs font-bold tracking-wider text-blue-900 uppercase hover:text-blue-950"
                                >
                                    Lihat Semua +
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {rest.map((item) => (
                                <Link
                                    to={`/berita/${item.slug}`}
                                    key={item.id}
                                    className="group flex cursor-pointer flex-col overflow-hidden rounded-xl bg-[#18181b] text-white shadow-lg transition-all duration-300 hover:shadow-2xl"
                                >
                                    <div className="relative aspect-video overflow-hidden bg-slate-900">
                                        <img
                                            src={item.cover_image}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold text-blue-400 uppercase">
                                            <span className="rounded bg-blue-600 px-2 py-0.5 text-[9px] text-white">
                                                {item.category?.name}
                                            </span>
                                            <span>•</span>
                                            <span className="text-slate-400">
                                                {item.published_at &&
                                                    new Date(
                                                        item.published_at,
                                                    ).toLocaleDateString(
                                                        'id-ID',
                                                        {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                            </span>
                                        </div>
                                        <h3 className="mb-2 text-base leading-snug font-bold transition-colors group-hover:text-blue-400">
                                            {item.title}
                                        </h3>
                                        <p className="mt-auto line-clamp-3 text-xs leading-relaxed text-slate-400">
                                            {item.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <WhatsappBanner />
            <Footer />
        </div>
    );
}
