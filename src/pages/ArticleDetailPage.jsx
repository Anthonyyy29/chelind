import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsappBanner from '../components/WhatsappBanner';
import { useData } from '../context/DataContext';
import { ArrowLeft, ArrowRight, Share2, Clock, User, Calendar } from 'lucide-react';

export default function ArticleDetailPage({ articleSlug, onNavigateBack, onSelectArticle }) {
  const { articles } = useData();

  // Find target article or fallback to first
  const article = articles.find((a) => a.slug === articleSlug) || articles[0];
  const moreStories = articles.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#bebebe] text-slate-900 font-poppins selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Header with Cover Image */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-end pt-28 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.85) 100%), url("${article.image || 'assets/news/cole palmer.jpg'}")`,
            backgroundPosition: 'center 20%',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto w-full text-white">
          <button
            onClick={onNavigateBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-md mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>

          <span className="inline-block px-3 py-1 rounded text-[11px] font-extrabold tracking-wider bg-blue-600 text-white uppercase mb-4 shadow-md">
            {article.category || 'MATCH REPORT'}
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4 drop-shadow-md">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 font-normal max-w-3xl mb-6 leading-relaxed">
            {article.subtitle || article.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 border-t border-white/15 pt-4">
            <span className="text-blue-400 font-bold uppercase">{article.category}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime || '5 MENIT BACA'}</span>
            <span>•</span>
            <span className="text-white font-bold">Oleh {article.author || 'Rizky Fadhillah'}</span>
          </div>
        </div>
      </section>

      {/* Main Article Body Container */}
      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 leading-relaxed">
        {/* Lead Box */}
        <div className="border-l-4 border-blue-600 pl-5 my-6 text-slate-900 text-base sm:text-lg font-medium leading-relaxed">
          Stamford Bridge bergemuruh pada Rabu malam yang menegangkan saat Cole Palmer tampil luar biasa untuk membalikkan keadaan atas Tottenham Hotspur dan memberikan tiga poin penting bagi Chelsea di Premier League. Dua gol di babak kedua dari pemain internasional Inggris tersebut melengkapi kebangkitan yang luar biasa.
        </div>

        {/* Paragraphs in Indonesian */}
        <div className="space-y-6 text-slate-800 text-sm sm:text-base font-normal">
          <p>
            Situasi sempat terlihat sulit pada babak pertama. Son Heung-min membawa Spurs unggul terlebih dahulu di pertengahan babak pertama, dan Chelsea berjuang keras menemukan ritme permainan menghadapi lini pertahanan lawan yang terorganisir dengan baik. Namun Enzo Fernandez berhasil mengendalikan permainan setelah jeda, dan umpan-umpan terukurnya berulang kali membongkar pertahanan Spurs.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">Palmer Mengambil Alih Pertandingan</h2>
          <p>
            Pemain berusia 22 tahun itu menyamakan kedudukan pada menit ke-58 lewat tembakan melengkung indah dari luar kotak penalti yang membuat kiper Vicario terpaku di tempatnya. Pendukung di Stamford Bridge yang sempat frustrasi langsung bersorak gemuruh. Palmer merayakan gol ke arah bendera sudut dengan ketenangan khas seorang pemain bintang.
          </p>
          <p>
            Gol keduanya tercipta pada menit ke-79 dengan penyelesaian yang sama klinisnya. Liam Delap menahan bola dengan sangat baik di bawah tekanan bek tengah Spurs sebelum mengumpannya ke arah Palmer, yang mengontrol bola dan melepaskan tembakan keras ke tiang dekat. Vicario tidak berkutik.
          </p>

          {/* Quote Box Component */}
          <div className="bg-[#18181b] text-white rounded-xl p-8 my-8 shadow-xl border-l-4 border-blue-500">
            <p className="text-xl sm:text-2xl font-bold italic mb-4 leading-snug">
              "{article.quote?.text || "Dia adalah pemenang pertandingan sejati. Ketika tim sangat membutuhkan, Cole selalu datang memberikan hasil luar biasa."}"
            </p>
            <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">
              {article.quote?.author || "ENZO MARESCA — PELATIH UTAMA CHELSEA"}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">Pertahanan Kokoh Menjaga Keunggulan</h2>
          <p>
            Pujian juga patut diberikan kepada Filip Jorgensen yang melakukan tiga penyelamatan krusial dalam sepuluh menit terakhir saat Spurs menggempur untuk menyamakan skor. Kiper asal Denmark yang sedang dalam performa terbaiknya musim ini menepis tembakan jarak dekat Richarlison untuk menjaga keunggulan tipis Chelsea.
          </p>
          <p>
            Kemenangan ini membawa Chelsea melesat ke puncak klasemen sementara Premier League dan mengirimkan sinyal kuat kepada tim-tim pesaing gelar juara. Skuad asuhan Maresca kini tak terkalahkan dalam delapan laga liga terakhir.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 pt-4">Langkah Chelsea Selanjutnya</h2>
          <p>
            The Blues tidak punya banyak waktu untuk berpuas diri. Laga tandang berat menuju Anfield sudah menanti akhir pekan ini menghadapi Liverpool — pertandingan yang bisa makin mengokohkan posisi mereka di puncak klasemen. Maresca membutuhkan seluruh pemainnya dalam kondisi bugar dan fokus penuh.
          </p>
        </div>

        {/* Match Stats Widget in Indonesian */}
        <div className="bg-[#18181b] text-white rounded-xl p-6 sm:p-8 my-10 shadow-2xl border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <span className="bg-blue-600 text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
              STATISTIK PERTANDINGAN
            </span>
            <span className="text-xs font-bold text-slate-300">
              Chelsea 2-1 Tottenham Hotspur
            </span>
          </div>

          {/* Stats Bar List */}
          <div className="space-y-4 text-xs font-semibold">
            {/* Possession */}
            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span className="font-bold text-sm text-white">58%</span>
                <span className="text-[10px] tracking-wider text-slate-400 uppercase">PENGUASAAN BOLA</span>
                <span className="font-bold text-sm text-white">42%</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden flex">
                <div className="bg-blue-600 h-full w-[58%]" />
                <div className="bg-slate-500 h-full w-[42%]" />
              </div>
            </div>

            {/* Shots on Target */}
            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span className="font-bold text-sm text-white">7</span>
                <span className="text-[10px] tracking-wider text-slate-400 uppercase">TEMBAKAN TEPAT SASARAN</span>
                <span className="font-bold text-sm text-white">4</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden flex">
                <div className="bg-blue-600 h-full w-[63%]" />
                <div className="bg-slate-500 h-full w-[37%]" />
              </div>
            </div>

            {/* Pass Accuracy */}
            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span className="font-bold text-sm text-white">91%</span>
                <span className="text-[10px] tracking-wider text-slate-400 uppercase">AKURASI UMPAN</span>
                <span className="font-bold text-sm text-white">84%</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden flex">
                <div className="bg-blue-600 h-full w-[91%]" />
                <div className="bg-slate-500 h-full w-[84%]" />
              </div>
            </div>

            {/* Corners */}
            <div>
              <div className="flex justify-between mb-1 text-slate-300">
                <span className="font-bold text-sm text-white">6</span>
                <span className="text-[10px] tracking-wider text-slate-400 uppercase">TENDANGAN SUDUT</span>
                <span className="font-bold text-sm text-white">3</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden flex">
                <div className="bg-blue-600 h-full w-[66%]" />
                <div className="bg-slate-500 h-full w-[34%]" />
              </div>
            </div>
          </div>

          {/* Goalscorers List */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase block mb-2">
              PENCETAK GOL
            </span>
            <div className="flex items-center gap-3 text-xs">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">⚽</div>
              <div>
                <p className="font-bold text-white">Son Heung-min 34'</p>
                <p className="text-[10px] text-slate-400">Tottenham Hotspur</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">⚽</div>
              <div>
                <p className="font-bold text-white">Cole Palmer 58', 79'</p>
                <p className="text-[10px] text-slate-400">Chelsea</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tags List */}
        <div className="flex flex-wrap gap-2 pt-4 pb-8 border-b border-slate-400/40">
          {(article.tags || ['MATCH REPORT', 'COLE PALMER', 'LONDON DERBY', 'PREMIER LEAGUE', 'TOTTENHAM']).map((tag, idx) => (
            <span
              key={idx}
              className="px-3.5 py-1.5 rounded bg-slate-900 text-white text-[11px] font-bold tracking-wider uppercase hover:bg-blue-600 cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </main>

      {/* More Stories Recommendation Grid */}
      <section className="bg-[#bebebe] py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-400/40">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Berita Lainnya</h2>
            <button
              onClick={onNavigateBack}
              className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1 uppercase tracking-wider"
            >
              LIHAT SEMUA <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {moreStories.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectArticle && onSelectArticle(item.slug)}
                className="bg-[#18181b] text-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase mb-2">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span className="text-slate-400">{item.date}</span>
                  </div>
                  <h3 className="text-base font-bold group-hover:text-blue-400 transition-colors mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mt-auto">
                    {item.subtitle || item.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhatsappBanner />
      <Footer />
    </div>
  );
}
