import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { deleteArticle, getAdminArticles } from '../../api/client';

export default function ArticleListPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Semua');

    const load = () => {
        setLoading(true);
        getAdminArticles()
            .then((res) => setArticles(res.data || []))
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleDelete = async (article) => {
        if (!confirm(`Hapus artikel "${article.title}"?`)) {
            return;
        }

        await deleteArticle(article.id);
        load();
    };

    const filteredArticles = articles.filter((a) => {
        if (filter === 'Semua') {
            return true;
        }

        if (filter === 'Published' || filter === 'Draft') {
            return a.status === filter.toLowerCase();
        }

        return a.category?.name === filter;
    });

    const categoryNames = [
        ...new Set(articles.map((a) => a.category?.name).filter(Boolean)),
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-lg font-bold text-blue-400">
                        {articles.length}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Total Artikel</h4>
                        <p className="text-[11px] text-slate-400">
                            Telah dibuat
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-lg font-bold text-emerald-400">
                        {
                            articles.filter((a) => a.status === 'published')
                                .length
                        }
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Published</h4>
                        <p className="text-[11px] text-slate-400">
                            Tayang di website
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-lg font-bold text-amber-400">
                        {articles.filter((a) => a.status === 'draft').length}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Draft</h4>
                        <p className="text-[11px] text-slate-400">
                            Belum dipublikasi
                        </p>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#121929]">
                <div className="flex flex-col gap-4 border-b border-slate-800/60 p-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        {['Semua', 'Published', 'Draft', ...categoryNames].map(
                            (tab) => (
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
                            ),
                        )}
                    </div>

                    <Link
                        to="/admin/artikel/baru"
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-500"
                    >
                        <Plus className="h-4 w-4" /> Tulis Artikel Baru
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-800 bg-slate-800/30 font-extrabold tracking-wider text-slate-400 uppercase">
                            <tr>
                                <th className="p-4">Judul Artikel</th>
                                <th className="p-4">Kategori</th>
                                <th className="p-4">Views</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                            {loading && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-6 text-center text-slate-500"
                                    >
                                        Memuat...
                                    </td>
                                </tr>
                            )}
                            {!loading && filteredArticles.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-6 text-center text-slate-500"
                                    >
                                        Belum ada artikel.
                                    </td>
                                </tr>
                            )}
                            {filteredArticles.map((article) => (
                                <tr
                                    key={article.id}
                                    className="border-slate-800/60 hover:bg-slate-800/30"
                                >
                                    <td className="max-w-sm truncate p-4 text-sm font-bold">
                                        {article.title}
                                    </td>
                                    <td className="p-4">
                                        <span className="rounded border border-blue-500/30 bg-blue-500/15 px-2 py-0.5 text-[10px] font-extrabold text-blue-400 uppercase">
                                            {article.category?.name}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono text-slate-400">
                                        {article.views}
                                    </td>
                                    <td className="p-4">
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                                article.status === 'published'
                                                    ? 'bg-emerald-500/15 text-emerald-400'
                                                    : 'bg-amber-500/15 text-amber-400'
                                            }`}
                                        >
                                            {article.status === 'published'
                                                ? 'Published'
                                                : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/admin/artikel/${article.id}/edit`}
                                                className="rounded p-1.5 text-slate-400 hover:bg-blue-600/20 hover:text-blue-400"
                                            >
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(article)
                                                }
                                                className="rounded p-1.5 text-slate-400 hover:bg-red-600/20 hover:text-red-400"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
