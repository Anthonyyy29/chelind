import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsappBanner from '../components/WhatsappBanner';
import { getArticle, getArticles } from '../api/client';

export default function ArticleDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [moreStories, setMoreStories] = useState([]);

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
                    <button
                        onClick={() => navigate('/berita')}
                        className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-colors hover:bg-white/20"
                    >
                        <ArrowLeft className="h-4 w-4" /> Kembali
                    </button>

                    <span className="mb-4 inline-block rounded bg-blue-600 px-3 py-1 text-[11px] font-extrabold tracking-wider text-white uppercase shadow-md">
                        {article.category?.name}
                    </span>

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
                        {article.author?.name && (
                            <>
                                <span>•</span>
                                <span className="font-bold text-white">
                                    Oleh {article.author.name}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-3xl px-4 py-12 leading-relaxed sm:px-6">
                <div
                    className="prose prose-slate max-w-none text-sm text-slate-800 sm:text-base [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_img]:rounded-xl [&_p]:mb-6"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(article.body || ''),
                    }}
                />
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
                                    <div className="aspect-video overflow-hidden">
                                        <img
                                            src={item.cover_image}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
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
