import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsappBanner from '../components/WhatsappBanner';
import { getArticles, getTransfers } from '../api/client';
import { transferBadges, transferValue } from '../lib/transferBadges';
import { getInitials } from '../lib/playerInitials';

const BADGE_CLASSES = {
    'Transfer Masuk': 'bg-blue-100 text-blue-700',
    'Transfer Keluar': 'bg-red-100 text-red-700',
    'On Loan': 'bg-slate-800 text-white',
    'Free Transfer': 'bg-emerald-100 text-emerald-700',
};

export default function TransferPage() {
    const [transfers, setTransfers] = useState([]);
    const [news, setNews] = useState([]);
    const [filter, setFilter] = useState('Semua');
    const [search, setSearch] = useState('');
    const [brokenPhotoIds, setBrokenPhotoIds] = useState(() => new Set());

    useEffect(() => {
        getTransfers()
            .then((data) => setTransfers(Array.isArray(data) ? data : []))
            .catch(() => setTransfers([]));

        getArticles({ category: 'transfer-news' })
            .then((res) => setNews((res.data || []).slice(0, 3)))
            .catch(() => setNews([]));
    }, []);

    const stats = useMemo(
        () => ({
            in: transfers.filter((t) => t.direction === 'in').length,
            out: transfers.filter((t) => t.direction === 'out').length,
            totalFee: transfers.reduce((sum, t) => sum + (t.fee || 0), 0),
        }),
        [transfers],
    );

    const filteredTransfers = transfers.filter((t) => {
        const matchesFilter =
            filter === 'Semua' ||
            (filter === 'Masuk' && t.direction === 'in') ||
            (filter === 'Keluar' && t.direction === 'out');

        const query = search.trim().toLowerCase();
        const matchesSearch =
            !query ||
            t.player_name.toLowerCase().includes(query) ||
            t.club_from.toLowerCase().includes(query) ||
            t.club_to.toLowerCase().includes(query);

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#dcdcdc] font-poppins text-slate-900 selection:bg-blue-600 selection:text-white">
            <Navbar />

            <section className="relative overflow-hidden border-b border-white/10 bg-[#00144d] px-4 pt-28 pb-16 text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <span className="mb-3 inline-block rounded-full border border-blue-400/30 bg-blue-600/30 px-3 py-1 text-xs font-bold tracking-wider text-blue-300 uppercase">
                        Transfer Center
                    </span>
                    <h1 className="mb-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
                        Transfer Rumour
                    </h1>
                    <p className="max-w-xl text-sm text-slate-300 sm:text-base">
                        Pantau setiap pergerakan transfer Chelsea FC, dari rumor
                        hingga resmi, lengkap dengan detail fee terbaru.
                    </p>
                </div>
            </section>

            <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-white/10 bg-[#0b1330] p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div>
                        <span className="mb-2 inline-block rounded bg-blue-600 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase">
                            Transfer Center
                        </span>
                        <h2 className="text-2xl font-bold sm:text-3xl">
                            Transfer Masuk &amp; Keluar
                        </h2>
                    </div>

                    <div className="flex items-center gap-6 rounded-xl border border-white/10 bg-white/5 px-6 py-4">
                        <div className="text-center">
                            <p className="text-2xl font-extrabold text-emerald-400">
                                {stats.in}
                            </p>
                            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                Masuk
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-extrabold text-red-400">
                                {stats.out}
                            </p>
                            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                Keluar
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-extrabold text-white">
                                &euro;{stats.totalFee.toFixed(1)}M
                            </p>
                            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                Total Fee
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white/80 p-1.5 shadow-sm sm:w-auto">
                        {['Semua', 'Masuk', 'Keluar'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                                    filter === tab
                                        ? 'bg-[#001f66] text-white shadow-md'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                {tab === 'Semua'
                                    ? 'Semua Transfer'
                                    : `Transfer ${tab}`}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari pemain atau klub..."
                            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pr-4 pl-10 text-xs text-slate-700 shadow-sm outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredTransfers.length === 0 && (
                        <p className="py-12 text-center text-sm text-slate-500">
                            Belum ada data transfer.
                        </p>
                    )}
                    {filteredTransfers.map((transfer) => {
                        const badges = transferBadges(transfer);

                        return (
                            <div
                                key={transfer.id}
                                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    {transfer.photo &&
                                    !brokenPhotoIds.has(transfer.id) ? (
                                        <img
                                            src={transfer.photo}
                                            alt={transfer.player_name}
                                            onError={() =>
                                                setBrokenPhotoIds((prev) =>
                                                    new Set(prev).add(
                                                        transfer.id,
                                                    ),
                                                )
                                            }
                                            className="h-14 w-14 shrink-0 rounded-full object-cover shadow-sm"
                                        />
                                    ) : (
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#001f66]/10 text-base font-extrabold text-[#001f66]">
                                            {getInitials(transfer.player_name)}
                                        </div>
                                    )}

                                    <div>
                                        <div className="mb-1 flex flex-wrap gap-1.5">
                                            {badges.map((badge) => (
                                                <span
                                                    key={badge}
                                                    className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${BADGE_CLASSES[badge]}`}
                                                >
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-base font-extrabold text-slate-900">
                                            {transfer.player_name}{' '}
                                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                                                {transfer.position}
                                            </span>
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {transfer.club_from}{' '}
                                            <span className="text-slate-400">
                                                &rarr;
                                            </span>{' '}
                                            {transfer.club_to}
                                        </p>
                                    </div>
                                </div>

                                <span className="self-start text-base font-extrabold text-slate-900 sm:self-center">
                                    {transferValue(transfer)}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {news.length > 0 && (
                    <div className="mt-16">
                        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
                            Berita Transfer
                        </h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {news.map((item) => (
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
                    </div>
                )}
            </main>

            <WhatsappBanner />
            <Footer />
        </div>
    );
}
