import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Trophy, Users, Share2, Plus } from 'lucide-react';
import {
    getAdminArticles,
    getAdminPlayers,
    getAdminSocialLinks,
    getMatches,
} from '../../api/client';

export default function AdminDashboardHome() {
    const [counts, setCounts] = useState({
        articles: 0,
        matches: 0,
        players: 0,
        socialLinks: 0,
    });

    useEffect(() => {
        getAdminArticles().then((res) =>
            setCounts((prev) => ({
                ...prev,
                articles: res.meta?.total ?? res.data.length,
            })),
        );
        getAdminPlayers().then((players) =>
            setCounts((prev) => ({ ...prev, players: players.length })),
        );
        getAdminSocialLinks().then((links) =>
            setCounts((prev) => ({ ...prev, socialLinks: links.length })),
        );
        Promise.all([getMatches(), getMatches({ status: 'finished' })]).then(
            ([scheduled, finished]) =>
                setCounts((prev) => ({
                    ...prev,
                    matches: scheduled.length + finished.length,
                })),
        );
    }, []);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xs font-medium text-slate-400">
                            Total Artikel
                        </span>
                        <h3 className="text-2xl font-black">
                            {counts.articles}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                        <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xs font-medium text-slate-400">
                            Pertandingan
                        </span>
                        <h3 className="text-2xl font-black">
                            {counts.matches}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xs font-medium text-slate-400">
                            Pemain Skuad
                        </span>
                        <h3 className="text-2xl font-black">
                            {counts.players}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                        <Share2 className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="text-xs font-medium text-slate-400">
                            Media Sosial
                        </span>
                        <h3 className="text-2xl font-black">
                            {counts.socialLinks}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Link
                    to="/admin/artikel/baru"
                    className="group rounded-2xl border border-slate-800/80 bg-[#121929] p-6 transition-all hover:border-blue-500"
                >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition-transform group-hover:scale-110">
                        <Plus className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1 text-base font-bold">
                        Tulis Artikel Baru
                    </h3>
                    <p className="text-xs text-slate-400">
                        Buat berita, laporan pertandingan, atau transfer news
                        baru.
                    </p>
                </Link>

                <Link
                    to="/admin/pemain"
                    className="group rounded-2xl border border-slate-800/80 bg-[#121929] p-6 transition-all hover:border-emerald-500"
                >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white transition-transform group-hover:scale-110">
                        <Users className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1 text-base font-bold">
                        Kelola Pemain Skuad
                    </h3>
                    <p className="text-xs text-slate-400">
                        Tambah atau perbarui data pemain Chelsea.
                    </p>
                </Link>

                <Link
                    to="/admin/social-link"
                    className="group rounded-2xl border border-slate-800/80 bg-[#121929] p-6 transition-all hover:border-indigo-500"
                >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white transition-transform group-hover:scale-110">
                        <Share2 className="h-5 w-5" />
                    </div>
                    <h3 className="mb-1 text-base font-bold">
                        Kelola Tautan Komunitas
                    </h3>
                    <p className="text-xs text-slate-400">
                        Atur link social media dan komunitas Chelind.
                    </p>
                </Link>
            </div>
        </div>
    );
}
