import React, { useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsappBanner from '../components/WhatsappBanner';
import { useData } from '../context/DataContext';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export default function NewsPage({ onSelectArticle }) {
  const { articles, players } = useData();
  const scrollRef = useRef(null);

  const featuredArticle = articles[0] || {
    title: "Palmer's Late Strike Sends Chelsea Top of the Table",
    subtitle: "A tense night at the Bridge ends in delirium as the Blues snatch three points deep into stoppage time.",
    category: "MATCH REPORT",
    date: "9 JUL 2026",
    readTime: "4 MIN READ",
    image: "assets/news/featured.jpg",
    slug: "palmer-double-sinks-spurs"
  };

  const defaultPlayers = [
    { id: 1, name: 'Filip Jorgensen', number: 1, position: 'Goalkeeper', flag: '🇩🇰', image: 'assets/news/Filip jorgenson .jpg' },
    { id: 2, name: 'Cole Palmer', number: 20, position: 'Attacking Midfielder', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', image: 'assets/news/cole palmer.jpg' },
    { id: 3, name: 'Joao Pedro', number: 10, position: 'Forward', flag: '🇧🇷', image: 'assets/news/joao pedro.jpg' },
    { id: 4, name: 'Enzo Fernandez', number: 8, position: 'Central Midfielder', flag: '🇦🇷', image: 'assets/news/enzo fernandes.jpg' },
    { id: 5, name: 'Liam Delap', number: 9, position: 'Striker', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', image: 'assets/news/Liam delap.jpg' },
  ];

  const displayPlayers = (players && players.length > 0) ? players : defaultPlayers;
  
  // Clean 3 unique articles without duplication
  const latestArticles = articles.slice(0, 3);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#bebebe] text-slate-900 font-poppins selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* 1. HERO HEADER BANNER (Team Trophy Celebration - Framed Center-Bottom to show players' faces) */}
      <section className="relative h-[48vh] sm:h-[58vh] w-full flex items-center justify-center text-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover z-0"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.75) 100%), url("assets/news/hero.jpg")`,
            backgroundPosition: 'center 45%',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-white">
          <span className="text-[11px] font-extrabold tracking-widest text-slate-300 uppercase block mb-2">
            CHELINDO NEWSROOM
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase drop-shadow-md">
            NEWS
          </h1>
        </div>
      </section>

      {/* MAIN CONTENT ON NEUTRAL GRAY BACKGROUND */}
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-12">
        {/* 2. FEATURED ARTICLE CARD (Cole Palmer Holding Trophy - assets/news/featured.jpg) */}
        <section
          onClick={() => onSelectArticle && onSelectArticle(featuredArticle.slug || 'palmer-double-sinks-spurs')}
          className="w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-300/60 relative group cursor-pointer"
        >
          <div className="aspect-[16/9] sm:aspect-[21/10] w-full overflow-hidden relative">
            <img
              src="assets/news/featured.jpg"
              alt={featuredArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              style={{ objectPosition: 'center 20%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex items-end p-6 sm:p-10">
              <div className="text-white max-w-2xl">
                <span className="bg-blue-600 text-white px-3 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider mb-3 inline-block shadow">
                  FEATURED
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3 group-hover:text-blue-300 transition-colors">
                  Palmer's Late Strike Sends Chelsea Top of the Table
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed mb-4 font-normal">
                  A tense night at the Bridge ends in delirium as the Blues snatch three points deep into stoppage time.
                </p>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-300 border-t border-white/10 pt-3">
                  <span className="text-blue-400 font-bold">MATCH REPORT</span>
                  <span>•</span>
                  <span>9 JUL 2026</span>
                  <span>•</span>
                  <span>4 MIN READ</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subtle Separator Divider Line */}
        <div className="w-full border-b border-slate-400/80 my-8" />

        {/* 3. PLAYERS SECTION (Scrollable Horizontal Carousel) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold text-slate-900 mx-auto text-center">Players</h2>

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-full bg-white text-slate-800 shadow hover:bg-slate-100 transition-colors"
                title="Scroll Kiri"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-full bg-white text-slate-800 shadow hover:bg-slate-100 transition-colors"
                title="Scroll Kanan"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex items-center gap-5 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayPlayers.map((player, idx) => (
              <div
                key={player.id || idx}
                className="w-52 shrink-0 bg-white rounded-xl overflow-hidden shadow-md border border-slate-200 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 snap-start flex flex-col"
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-slate-900">
                  <img
                    src={player.image || 'assets/news/cole palmer.jpg'}
                    alt={player.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Top Left: Shirt Number */}
                  <span className="absolute top-2.5 left-2.5 bg-blue-600/90 text-white text-[11px] font-black px-2 py-0.5 rounded shadow">
                    {player.number}
                  </span>

                  {/* Top Right: Country Flag (Uploaded Flag Image or Emoji) */}
                  <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm p-1 rounded-md border border-white/20 shadow flex items-center justify-center">
                    {player.flagUrl ? (
                      <img src={player.flagUrl} alt="Bendera" className="w-5 h-3.5 object-cover rounded-sm" />
                    ) : (
                      <span className="text-base leading-none">{player.flag || '🏴󠁧󠁢󠁥󠁮󠁧󠁿'}</span>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-white flex flex-col justify-between flex-1">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                    {player.position}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                    {player.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. LATEST SECTION (Clean 3 Cards Grid - No Duplication) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-400/60 pb-4">
            <h2 className="text-2xl font-extrabold text-slate-900">Latest</h2>
            <a href="#category-matchday" className="text-xs font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1 uppercase tracking-wider">
              VIEW ALL +
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestArticles.map((item, idx) => (
              <article
                key={idx}
                onClick={() => onSelectArticle && onSelectArticle(item.slug || 'palmer-double-sinks-spurs')}
                className="bg-[#18181b] text-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col"
              >
                <div className="aspect-video bg-slate-900 overflow-hidden relative">
                  <img
                    src={item.image || 'assets/news/featured.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-extrabold text-blue-400 uppercase mb-2">
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[9px]">{item.category}</span>
                    <span>•</span>
                    <span className="text-slate-400">{item.date}</span>
                  </div>
                  <h3 className="text-base font-bold group-hover:text-blue-400 transition-colors mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mt-auto">
                    {item.subtitle || item.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <WhatsappBanner />
      <Footer />
    </div>
  );
}
