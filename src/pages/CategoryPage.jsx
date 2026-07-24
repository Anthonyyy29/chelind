import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsappBanner from '../components/WhatsappBanner';
import { useData } from '../context/DataContext';

const CATEGORY_PILLS = [
  { id: 'ALL', label: 'ALL' },
  { id: 'MATCH REPORT', label: 'MATCH REPORT' },
  { id: 'TRANSFER NEWS', label: 'TRANSFER NEWS' },
  { id: 'MATCHDAY', label: 'MATCHDAY' },
  { id: 'COMMUNITY', label: 'COMMUNITY' },
  { id: 'OPINION', label: 'OPINION' },
];

export default function CategoryPage({ initialCategory = 'MATCHDAY', onSelectArticle }) {
  const { articles } = useData();
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filteredArticles = articles.filter((a) => {
    if (activeCategory === 'ALL') return true;
    return a.category?.toUpperCase() === activeCategory;
  });

  // Pick category hero image based on user-uploaded HD files:
  const getCategoryHeroImage = () => {
    const cat = initialCategory.toUpperCase();
    if (cat.includes('TRANSFER')) return 'assets/news/transfer news.jpg';
    if (cat.includes('NEWS')) return 'assets/news/news.jpg';
    return 'assets/news/matchday.jpg';
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-poppins selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Category Subhead */}
        <span className="text-[10px] font-extrabold tracking-widest text-blue-600 uppercase block mb-1">
          CHELINDO {initialCategory.toUpperCase()}
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-6">
          {initialCategory}
        </h1>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-slate-200">
          {CATEGORY_PILLS.map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActiveCategory(pill.id)}
              className={`px-4 py-1.5 rounded-sm text-[11px] font-extrabold tracking-wider border transition-all ${
                activeCategory === pill.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-800'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Big Featured Image Banner (Mapped per category HD uploaded file) */}
        <div className="w-full rounded-none overflow-hidden mb-12 shadow-xl border border-slate-200">
          <div
            className="aspect-[21/9] sm:aspect-[24/9] w-full overflow-hidden relative group cursor-pointer"
            onClick={() => onSelectArticle && onSelectArticle(articles[0]?.slug)}
          >
            <img
              src={articles[0]?.image || getCategoryHeroImage()}
              alt={articles[0]?.title || `Chelindo Featured ${initialCategory}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 sm:p-10">
              <div className="text-white max-w-3xl">
                <span className="bg-blue-600 text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                  FEATURED STORY
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md leading-tight mb-2">
                  {articles[0]?.title || 'Palmer Double Sinks Spurs in London Derby'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 line-clamp-2">
                  {articles[0]?.subtitle || 'The Blues turn a one-goal deficit into a statement win after the break.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {filteredArticles.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectArticle && onSelectArticle(item.slug)}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 cursor-pointer flex flex-col group"
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-[10px] font-extrabold tracking-wider text-blue-600 uppercase mb-2">
                  {item.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mt-auto">
                  {item.subtitle || item.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </main>

      <WhatsappBanner />
      <Footer />
    </div>
  );
}
