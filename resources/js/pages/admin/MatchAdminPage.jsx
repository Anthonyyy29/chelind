import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { getMatches } from '../../api/client';
import { getMatchDateParts } from '../../lib/formatMatchDate';

export default function MatchAdminPage() {
    const [scheduled, setScheduled] = useState([]);
    const [finished, setFinished] = useState([]);
    const [filter, setFilter] = useState('Semua');

    useEffect(() => {
        getMatches()
            .then((data) => setScheduled(Array.isArray(data) ? data : []))
            .catch(() => setScheduled([]));
        getMatches({ status: 'finished' })
            .then((data) => setFinished(Array.isArray(data) ? data : []))
            .catch(() => setFinished([]));
    }, []);

    const allMatches = [
        ...scheduled.map((m) => ({ ...m, _status: 'scheduled' })),
        ...finished.map((m) => ({ ...m, _status: 'finished' })),
    ];

    const filteredMatches = allMatches.filter((m) => {
        if (filter === 'Semua') {
            return true;
        }

        return filter === 'Mendatang'
            ? m._status === 'scheduled'
            : m._status === 'finished';
    });

    return (
        <div className="space-y-6">
            <div className="flex items-start gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-xs text-blue-300">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                    Jadwal & hasil pertandingan disinkron otomatis dari
                    football-data.org tiap 15 menit — tidak bisa ditambah/diedit
                    manual di sini.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-lg font-bold text-blue-400">
                        {allMatches.length}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">
                            Total Pertandingan
                        </h4>
                        <p className="text-[11px] text-slate-400">
                            Jadwal & hasil tersimpan
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-lg font-bold text-amber-400">
                        {scheduled.length}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Mendatang</h4>
                        <p className="text-[11px] text-slate-400">
                            Laga berikutnya
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-lg font-bold text-emerald-400">
                        {finished.length}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Selesai</h4>
                        <p className="text-[11px] text-slate-400">
                            Hasil pertandingan
                        </p>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#121929]">
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/60 p-6">
                    {['Semua', 'Mendatang', 'Selesai'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                                filter === tab
                                    ? 'bg-blue-600 text-white shadow'
                                    : 'bg-slate-800/40 text-slate-400 hover:text-white'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-800 bg-slate-800/30 font-extrabold tracking-wider text-slate-400 uppercase">
                            <tr>
                                <th className="p-4">Kompetisi</th>
                                <th className="p-4">Pertandingan</th>
                                <th className="p-4">Skor</th>
                                <th className="p-4">Tanggal</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                            {filteredMatches.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-6 text-center text-slate-500"
                                    >
                                        Belum ada data pertandingan.
                                    </td>
                                </tr>
                            )}
                            {filteredMatches.map((m) => {
                                const homeTeam = m.is_home
                                    ? 'Chelsea FC'
                                    : m.opponent;
                                const awayTeam = m.is_home
                                    ? m.opponent
                                    : 'Chelsea FC';

                                return (
                                    <tr
                                        key={m.id}
                                        className="border-slate-800/60 hover:bg-slate-800/30"
                                    >
                                        <td className="p-4 font-bold text-blue-400">
                                            {m.competition}
                                        </td>
                                        <td className="p-4 text-sm font-bold">
                                            {homeTeam}{' '}
                                            <span className="font-normal text-slate-500">
                                                vs
                                            </span>{' '}
                                            {awayTeam}
                                        </td>
                                        <td className="p-4 font-mono text-sm font-bold text-amber-400">
                                            {m._status === 'finished'
                                                ? `${m.score_home} - ${m.score_away}`
                                                : '-'}
                                        </td>
                                        <td className="p-4 text-slate-400">
                                            {
                                                getMatchDateParts(m.kickoff_at)
                                                    .full
                                            }
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                                    m._status === 'finished'
                                                        ? 'bg-emerald-500/15 text-emerald-400'
                                                        : 'bg-blue-500/15 text-blue-400'
                                                }`}
                                            >
                                                {m._status === 'finished'
                                                    ? 'Selesai'
                                                    : 'Mendatang'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
