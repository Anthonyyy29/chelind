import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsappBanner from '../components/WhatsappBanner';
import { getArticle, getArticles } from '../api/client';

function StatBar({ label, home, away, homeWidth, awayWidth }) {
    return (
        <div>
            <div className="mb-1 flex justify-between text-slate-300">
                <span className="text-sm font-bold text-white">{home}</span>
                <span className="text-[10px] tracking-wider text-slate-400 uppercase">
                    {label}
                </span>
                <span className="text-sm font-bold text-white">{away}</span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-700">
                <div
                    className="h-full bg-blue-600"
                    style={{ width: `${homeWidth}%` }}
                />
                <div
                    className="h-full bg-slate-500"
                    style={{ width: `${awayWidth}%` }}
                />
            </div>
        </div>
    );
}

function MatchStatsWidget({ stats }) {
    const possessionHome = stats.possession_home ?? 50;
    const possessionAway = stats.possession_away ?? 50;

    const shotsTotal = Math.max(
        1,
        (stats.shots_home ?? 0) + (stats.shots_away ?? 0),
    );
    const cornersTotal = Math.max(
        1,
        (stats.corners_home ?? 0) + (stats.corners_away ?? 0),
    );

    const goalscorers = stats.goalscorers_text
        ? stats.goalscorers_text.split('\n').filter(Boolean)
        : [];

    return (
        <div className="my-10 rounded-xl border border-white/10 bg-[#18181b] p-6 text-white shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <span className="rounded bg-blue-600 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                    Statistik Pertandingan
                </span>
                {(stats.home_team || stats.away_team) && (
                    <span className="text-xs font-bold text-slate-300">
                        {stats.home_team} {stats.home_score}-{stats.away_score}{' '}
                        {stats.away_team}
                    </span>
                )}
            </div>

            <div className="space-y-4 text-xs font-semibold">
                <StatBar
                    label="Penguasaan Bola"
                    home={`${possessionHome}%`}
                    away={`${possessionAway}%`}
                    homeWidth={possessionHome}
                    awayWidth={possessionAway}
                />
                <StatBar
                    label="Tembakan Tepat Sasaran"
                    home={stats.shots_home ?? 0}
                    away={stats.shots_away ?? 0}
                    homeWidth={((stats.shots_home ?? 0) / shotsTotal) * 100}
                    awayWidth={((stats.shots_away ?? 0) / shotsTotal) * 100}
                />
                <StatBar
                    label="Akurasi Umpan"
                    home={`${stats.pass_home ?? 0}%`}
                    away={`${stats.pass_away ?? 0}%`}
                    homeWidth={stats.pass_home ?? 0}
                    awayWidth={stats.pass_away ?? 0}
                />
                <StatBar
                    label="Tendangan Sudut"
                    home={stats.corners_home ?? 0}
                    away={stats.corners_away ?? 0}
                    homeWidth={((stats.corners_home ?? 0) / cornersTotal) * 100}
                    awayWidth={((stats.corners_away ?? 0) / cornersTotal) * 100}
                />
            </div>

            {goalscorers.length > 0 && (
                <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
                    <span className="mb-2 block text-[10px] font-bold tracking-wider text-blue-400 uppercase">
                        Pencetak Gol
                    </span>
                    {goalscorers.map((scorer, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-3 text-xs"
                        >
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                                ⚽
                            </div>
                            <p className="font-bold text-white">{scorer}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ArticleDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [moreStories, setMoreStories] = useState([]);
    const [brokenImageIds, setBrokenImageIds] = useState(() => new Set());

    useEffect(() => {
        setArticle(null);
        setNotFound(false);

        getArticle(slug)
            .then(setArticle)
            .catch(() => setNotFound(true));
    }, [slug]);

    useEffect(() => {
        if (!article) {
            return;
        }

        getArticles({ category: article.category?.slug })
            .then((res) =>
                setMoreStories(
                    (res.data || [])
                        .filter((a) => a.id !== article.id)
                        .slice(0, 3),
                ),
            )
            .catch(() => setMoreStories([]));
    }, [article]);

    if (notFound) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#bebebe] font-poppins text-slate-900">
                <p className="text-sm">Artikel tidak ditemukan.</p>
                <Link to="/berita" className="text-sm font-bold text-blue-700">
                    Kembali ke Berita
                </Link>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#bebebe] font-poppins text-sm text-slate-600">
                Memuat artikel...
            </div>
        );
    }

    const publishedDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : '';

    const wordCount = article.body
        ? article.body.trim().split(/\s+/).length
        : 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const paragraphs = (article.body || '')
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);

    return (
        <div className="min-h-screen bg-[#bebebe] font-poppins text-slate-900 selection:bg-blue-600 selection:text-white">
            <Navbar />

            <section className="relative flex min-h-[60vh] items-end overflow-hidden px-4 pt-28 pb-12 sm:min-h-[70vh] sm:px-6 lg:px-8">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.85) 100%), url("${article.cover_image || '/assets/news/featured.jpg'}")`,
                        backgroundPosition: 'center 20%',
                    }}
                />

                <div className="relative z-10 mx-auto w-full max-w-4xl text-white">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => navigate('/berita')}
                            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-colors hover:bg-white/20"
                        >
                            <ArrowLeft className="h-4 w-4" /> Kembali
                        </button>

                        <span className="inline-block rounded bg-blue-600 px-3 py-1 text-[11px] font-extrabold tracking-wider text-white uppercase shadow-md">
                            {article.category?.name}
                        </span>
                    </div>

                    <h1 className="mb-4 text-3xl leading-tight font-extrabold tracking-tight drop-shadow-md sm:text-5xl md:text-6xl">
                        {article.title}
                    </h1>

                    {article.excerpt && (
                        <p className="mb-6 max-w-3xl text-base leading-relaxed font-normal text-slate-200 sm:text-lg">
                            {article.excerpt}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 border-t border-white/15 pt-4 text-xs font-semibold text-slate-300">
                        <span>{publishedDate}</span>
                        <span>&bull;</span>
                        <span>{readTime} menit baca</span>
                        {article.author?.name && (
                            <>
                                <span>&bull;</span>
                                <span className="font-bold text-white">
                                    Oleh {article.author.name}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-3xl px-4 py-12 leading-relaxed sm:px-6">
                <div className="space-y-6 text-sm text-slate-800 sm:text-base">
                    {paragraphs.map((paragraph, idx) =>
                        idx === 0 ? (
                            <div
                                key={idx}
                                className="my-6 border-l-4 border-blue-600 pl-5 text-base leading-relaxed font-medium text-slate-900 sm:text-lg"
                            >
                                {paragraph}
                            </div>
                        ) : (
                            <p key={idx}>{paragraph}</p>
                        ),
                    )}
                </div>

                {article.quote && (
                    <div className="my-8 rounded-xl border-l-4 border-blue-500 bg-[#18181b] p-8 text-white shadow-xl">
                        <p className="mb-4 text-xl leading-snug font-bold italic sm:text-2xl">
                            &ldquo;{article.quote.text}&rdquo;
                        </p>
                        {article.quote.author && (
                            <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">
                                {article.quote.author}
                            </span>
                        )}
                    </div>
                )}

                {article.match_stats && (
                    <MatchStatsWidget stats={article.match_stats} />
                )}

                {article.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 border-b border-slate-400/40 pt-4 pb-8">
                        {article.tags.map((tag) => (
                            <span
                                key={tag}
                                className="cursor-pointer rounded bg-slate-900 px-3.5 py-1.5 text-[11px] font-bold tracking-wider text-white uppercase transition-colors hover:bg-blue-600"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </main>

            {moreStories.length > 0 && (
                <section className="border-t border-slate-400/40 bg-[#bebebe] px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900">
                                Berita Lainnya
                            </h2>
                            <Link
                                to="/berita"
                                className="flex items-center gap-1 text-xs font-bold tracking-wider text-blue-800 uppercase hover:text-blue-950"
                            >
                                Lihat Semua <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {moreStories.map((item) => (
                                <Link
                                    to={`/berita/${item.slug}`}
                                    key={item.id}
                                    className="group flex cursor-pointer flex-col overflow-hidden rounded-xl bg-[#18181b] text-white shadow-lg transition-all duration-300 hover:shadow-2xl"
                                >
                                    <div className="aspect-video overflow-hidden bg-slate-900">
                                        {item.cover_image &&
                                            !brokenImageIds.has(item.id) && (
                                                <img
                                                    src={item.cover_image}
                                                    alt={item.title}
                                                    onError={() =>
                                                        setBrokenImageIds(
                                                            (prev) =>
                                                                new Set(
                                                                    prev,
                                                                ).add(item.id),
                                                        )
                                                    }
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            )}
                                    </div>
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-2 flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase">
                                            <span>{item.category?.name}</span>
                                        </div>
                                        <h3 className="mb-3 text-base leading-snug font-bold transition-colors group-hover:text-blue-400">
                                            {item.title}
                                        </h3>
                                        <p className="mt-auto line-clamp-3 text-xs leading-relaxed text-slate-400">
                                            {item.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <WhatsappBanner />
            <Footer />
        </div>
    );
}
