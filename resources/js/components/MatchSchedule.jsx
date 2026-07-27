import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getMatches } from '../api/client';
import { getMatchDateParts } from '../lib/formatMatchDate';
import { CHELSEA_LOGO } from '../lib/teamLogos';

export default function MatchSchedule() {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        getMatches({ limit: 3 })
            .then((data) => setMatches(Array.isArray(data) ? data : []))
            .catch(() => setMatches([]));
    }, []);

    if (matches.length === 0) {
        return null;
    }

    return (
        <section
            id="matches"
            className="bg-[#bebebe] px-4 py-20 font-poppins sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-4xl">
                <div className="mb-12 text-center">
                    <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-[#0f172a] sm:text-4xl">
                        Jadwal Pertandingan
                    </h2>
                    <div className="mx-auto mb-3 h-[3px] w-12 bg-[#001f66]" />
                    <p className="text-xs text-slate-700 sm:text-sm">
                        Jangan lewatkan laga The Blues berikutnya.
                    </p>
                </div>

                <div className="space-y-4">
                    {matches.map((m) => {
                        const dateParts = getMatchDateParts(m.kickoff_at);
                        const homeTeam = m.is_home ? 'Chelsea FC' : m.opponent;
                        const awayTeam = m.is_home ? m.opponent : 'Chelsea FC';
                        const homeLogo = m.is_home
                            ? CHELSEA_LOGO
                            : m.opponent_crest;
                        const awayLogo = m.is_home
                            ? m.opponent_crest
                            : CHELSEA_LOGO;

                        return (
                            <div
                                key={m.id}
                                className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md sm:flex-row sm:items-center sm:p-6"
                            >
                                <div className="flex w-full items-center gap-5 sm:w-auto">
                                    <div className="flex min-w-[68px] shrink-0 flex-col items-center justify-center rounded-xl bg-[#001f66] px-4 py-3 text-center text-white shadow-inner">
                                        <span className="text-[9px] font-bold tracking-widest uppercase opacity-80">
                                            {dateParts.weekday}
                                        </span>
                                        <span className="my-0.5 text-2xl leading-none font-black">
                                            {dateParts.day}
                                        </span>
                                        <span className="text-[9px] font-bold tracking-widest uppercase opacity-80">
                                            {dateParts.month}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="mb-1 block text-[10px] font-extrabold tracking-wider text-blue-600 uppercase">
                                            {m.competition}
                                        </span>

                                        <div className="flex flex-wrap items-center gap-2 text-base leading-snug font-extrabold text-slate-900 sm:text-lg">
                                            <div className="flex items-center gap-1.5">
                                                {homeLogo && (
                                                    <img
                                                        src={homeLogo}
                                                        alt={homeTeam}
                                                        className="h-6 w-6 object-contain drop-shadow-sm"
                                                    />
                                                )}
                                                <span>{homeTeam}</span>
                                            </div>

                                            <span className="px-1 text-xs font-normal text-slate-400 uppercase">
                                                vs
                                            </span>

                                            <div className="flex items-center gap-1.5">
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
                                            {m.is_home ? 'Kandang' : 'Tandang'}
                                        </p>
                                    </div>
                                </div>

                                <div className="shrink-0 self-end sm:self-center">
                                    <Link
                                        to="/matchday"
                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#001f66] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#002db3]"
                                    >
                                        Lihat Matchday{' '}
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
