import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, Search, Clock } from 'lucide-react';
import { getMatches } from '../api/client';
import { getMatchDateParts, getCountdownParts } from '../lib/formatMatchDate';
import { CHELSEA_LOGO } from '../lib/teamLogos';

export default function MatchdayPage() {
    const [scheduled, setScheduled] = useState([]);
    const [finished, setFinished] = useState([]);
    const [filter, setFilter] = useState('all');
    const [competition, setCompetition] = useState('all');
    const [search, setSearch] = useState('');
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        getMatches()
            .then((data) => setScheduled(Array.isArray(data) ? data : []))
            .catch(() => setScheduled([]));
        getMatches({ status: 'finished' })
            .then((data) => setFinished(Array.isArray(data) ? data : []))
            .catch(() => setFinished([]));
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const allMatches = useMemo(
        () => [
            ...scheduled.map((m) => ({ ...m, _status: 'scheduled' })),
            ...finished.map((m) => ({ ...m, _status: 'finished' })),
        ],
        [scheduled, finished],
    );

    const competitions = useMemo(
        () => [...new Set(allMatches.map((m) => m.competition))],
        [allMatches],
    );

    const filteredMatches = allMatches.filter((m) => {
        const matchesFilter = filter === 'all' || m._status === filter;
        const matchesCompetition =
            competition === 'all' || m.competition === competition;
        const opponent = (m.opponent || '').toLowerCase();
        const matchesSearch =
            !search ||
            opponent.includes(search.toLowerCase()) ||
            (m.competition || '').toLowerCase().includes(search.toLowerCase());

        return matchesFilter && matchesCompetition && matchesSearch;
    });

    const nextMatch = scheduled[0];
    const countdown = nextMatch
        ? getCountdownParts(nextMatch.kickoff_at, now)
        : null;

    return (
        <div className="min-h-screen bg-[#dcdcdc] font-poppins text-slate-900 selection:bg-blue-600 selection:text-white">
            <Navbar />

            <section className="relative overflow-hidden border-b border-white/10 bg-[#00144d] px-4 pt-28 pb-16 text-white sm:px-6 lg:px-8">
                <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row">
                    <div>
                        <span className="mb-3 inline-block rounded-full border border-blue-400/30 bg-blue-600/30 px-3 py-1 text-xs font-bold tracking-wider text-blue-300 uppercase">
                            Match Center
                        </span>
                        <h1 className="mb-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
                            Jadwal & Hasil Matchday
                        </h1>
                        <p className="max-w-xl text-sm text-slate-300 sm:text-base">
                            Pantau jadwal pertandingan mendatang dan hasil skor
                            terbaru Chelsea FC, disinkron otomatis dari
                            football-data.org.
                        </p>
                    </div>

                    {nextMatch && countdown && (
                        <div className="w-full min-w-[340px] rounded-2xl border border-white/15 bg-[#001f66] p-6 shadow-2xl md:w-auto">
                            <div className="mb-3 flex items-center justify-between text-xs font-semibold text-blue-300">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4 text-blue-400" />{' '}
                                    Laga Berikutnya
                                </span>
                                <span className="rounded bg-blue-600/40 px-2 py-0.5 text-[10px] font-bold text-white">
                                    {nextMatch.competition}
                                </span>
                            </div>

                            <div className="my-2 flex items-center justify-around border-y border-white/10 py-4">
                                <div className="flex flex-col items-center text-center">
                                    <img
                                        src={
                                            nextMatch.is_home
                                                ? CHELSEA_LOGO
                                                : nextMatch.opponent_crest
                                        }
                                        alt="home"
                                        className="mb-1.5 h-10 w-10 object-contain drop-shadow"
                                    />
                                    <span className="text-[10px] font-semibold text-slate-300">
                                        {nextMatch.is_home
                                            ? 'Chelsea FC'
                                            : nextMatch.opponent}
                                    </span>
                                </div>

                                <div className="px-3 text-xl font-black text-blue-400">
                                    VS
                                </div>

                                <div className="flex flex-col items-center text-center">
                                    <img
                                        src={
                                            nextMatch.is_home
                                                ? nextMatch.opponent_crest
                                                : CHELSEA_LOGO
                                        }
                                        alt="away"
                                        className="mb-1.5 h-10 w-10 object-contain drop-shadow"
                                    />
                                    <span className="text-[10px] font-semibold text-slate-300">
                                        {nextMatch.is_home
                                            ? nextMatch.opponent
                                            : 'Chelsea FC'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                                {[
                                    ['HARI', countdown.days],
                                    ['JAM', countdown.hours],
                                    ['MENIT', countdown.minutes],
                                    ['DETIK', countdown.seconds],
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="rounded-lg bg-black/30 p-2"
                                    >
                                        <span className="block text-lg leading-none font-bold">
                                            {String(value).padStart(2, '0')}
                                        </span>
                                        <span className="text-[9px] text-slate-400 uppercase">
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white/80 p-1.5 shadow-sm sm:w-auto">
                        <button
                            onClick={() => setFilter('all')}
                            className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                                filter === 'all'
                                    ? 'bg-[#001f66] text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            Semua ({allMatches.length})
                        </button>
                        <button
                            onClick={() => setFilter('scheduled')}
                            className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                                filter === 'scheduled'
                                    ? 'bg-[#001f66] text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            Jadwal ({scheduled.length})
                        </button>
                        <button
                            onClick={() => setFilter('finished')}
                            className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                                filter === 'finished'
                                    ? 'bg-[#001f66] text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            Hasil ({finished.length})
                        </button>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari lawan atau kompetisi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-full border border-slate-200 bg-white py-2 pr-4 pl-10 text-xs font-medium text-slate-900 shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                    </div>
                </div>

                {competitions.length > 1 && (
                    <div className="mb-8 flex flex-wrap gap-2">
                        <button
                            onClick={() => setCompetition('all')}
                            className={`rounded-sm border px-3 py-1 text-[11px] font-bold uppercase ${
                                competition === 'all'
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-slate-300 bg-white text-slate-700'
                            }`}
                        >
                            Semua Kompetisi
                        </button>
                        {competitions.map((c) => (
                            <button
                                key={c}
                                onClick={() => setCompetition(c)}
                                className={`rounded-sm border px-3 py-1 text-[11px] font-bold uppercase ${
                                    competition === c
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : 'border-slate-300 bg-white text-slate-700'
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                )}

                <div className="space-y-4">
                    {filteredMatches.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                            <Calendar className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                            <h3 className="text-lg font-bold text-slate-700">
                                Tidak Ada Pertandingan Ditemukan
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Coba ubah kata kunci pencarian atau ganti filter
                                kompetisi.
                            </p>
                        </div>
                    ) : (
                        filteredMatches.map((item) => {
                            const dateParts = getMatchDateParts(
                                item.kickoff_at,
                            );
                            const homeTeam = item.is_home
                                ? 'Chelsea FC'
                                : item.opponent;
                            const awayTeam = item.is_home
                                ? item.opponent
                                : 'Chelsea FC';
                            const homeLogo = item.is_home
                                ? CHELSEA_LOGO
                                : item.opponent_crest;
                            const awayLogo = item.is_home
                                ? item.opponent_crest
                                : CHELSEA_LOGO;

                            return (
                                <div
                                    key={item.id}
                                    className="group flex flex-col items-start justify-between gap-5 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md sm:p-6 md:flex-row md:items-center"
                                >
                                    <div className="flex w-full items-center gap-5 md:w-auto">
                                        <div className="flex min-w-[68px] flex-col items-center justify-center rounded-xl bg-[#001f66] px-4 py-3 text-center text-white shadow-inner transition-transform group-hover:scale-105">
                                            <span className="text-[10px] font-bold tracking-widest opacity-80">
                                                {dateParts.weekday}
                                            </span>
                                            <span className="my-0.5 text-2xl leading-none font-black">
                                                {dateParts.day}
                                            </span>
                                            <span className="text-[10px] font-bold tracking-widest opacity-80">
                                                {dateParts.month}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="mb-1 block text-[10px] font-extrabold tracking-wider text-blue-600 uppercase">
                                                {item.competition}
                                            </span>

                                            <div className="flex flex-wrap items-center gap-2 text-base leading-snug font-extrabold text-slate-900 sm:text-lg">
                                                <div className="flex items-center gap-2">
                                                    {homeLogo && (
                                                        <img
                                                            src={homeLogo}
                                                            alt={homeTeam}
                                                            className="h-6 w-6 object-contain drop-shadow-sm"
                                                        />
                                                    )}
                                                    <span>{homeTeam}</span>
                                                </div>

                                                {item._status === 'finished' ? (
                                                    <span className="mx-1 inline-block rounded bg-blue-100 px-2.5 py-0.5 text-sm font-black text-[#001f66]">
                                                        {item.score_home} -{' '}
                                                        {item.score_away}
                                                    </span>
                                                ) : (
                                                    <span className="px-1 text-xs font-normal text-slate-400 uppercase">
                                                        vs
                                                    </span>
                                                )}

                                                <div className="flex items-center gap-2">
                                                    {awayLogo && (
                                                        <img
                                                            src={awayLogo}
                                                            alt={awayTeam}
                                                            className="h-6 w-6 object-contain drop-shadow-sm"
                                                        />
                                                    )}
                                                    <span>{awayTeam}</span>
                                                </div>
                                            </div>

                                            <p className="mt-1.5 text-xs text-slate-500">
                                                {dateParts.full} •{' '}
                                                {item.is_home
                                                    ? 'Kandang'
                                                    : 'Tandang'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
