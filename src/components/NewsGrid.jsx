import React, { useState, useEffect } from 'react';
import { getArticles } from '../api/client';
import { useData } from '../context/DataContext';

export default function NewsGrid({ onSelectArticle }) {
  const { articles: contextArticles } = useData();
  const [articles, setArticles] = useState(contextArticles || []);

  useEffect(() => {
    if (contextArticles && contextArticles.length > 0) {
      setArticles(contextArticles.slice(0, 3));
    }
  }, [contextArticles]);

  return (
    <section id="news-grid" className="bg-[#dcdcdc] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Berita Terbaru</h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Update terbaru seputar The Blues, langsung dari redaksi Chelind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectArticle && onSelectArticle(item.slug || 'palmer-double-sinks-spurs')}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-slate-100 cursor-pointer"
            >
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-[11px] font-extrabold tracking-wider text-[#001f66] uppercase mb-2">
                  {item.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mt-auto">{item.subtitle || item.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
