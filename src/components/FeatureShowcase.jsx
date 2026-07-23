import React from 'react';

export default function FeatureShowcase() {
  return (
    <section className="bg-[#bebebe] w-full overflow-hidden font-poppins">
      {/* Row 1: Matchday */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[440px] md:min-h-[480px] w-full border-b border-slate-400/40">
        {/* Left: HD Matchday Image (assets/news/matchday.jpg) */}
        <div className="w-full h-[360px] md:h-full overflow-hidden">
          <img
            src="assets/news/matchday.jpg"
            alt="Matchday Chelsea"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Right: Text Box */}
        <div className="bg-[#bebebe] p-8 sm:p-14 md:p-16 flex flex-col justify-center items-start text-left min-h-[360px]">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-4 tracking-tight">
            Matchday
          </h2>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 max-w-md">
            Cek jadwal lengkap pertandingan Chelsea, kapan pun dan di mana pun mereka bertanding.
          </p>
          <a
            href="#matches-page"
            className="px-7 py-3 rounded-full text-xs font-bold bg-[#001f66] hover:bg-[#002db3] text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            Lihat Selengkapnya
          </a>
        </div>
      </div>

      {/* Row 2: News */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[440px] md:min-h-[480px] w-full border-b border-slate-400/40">
        {/* Left: Text Box */}
        <div className="order-2 md:order-1 bg-[#bebebe] p-8 sm:p-14 md:p-16 flex flex-col justify-center items-start text-left min-h-[360px]">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-4 tracking-tight">
            News
          </h2>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 max-w-md">
            Update berita terbaru seputar tim, pemain, dan performa The Blues sepanjang musim.
          </p>
          <a
            href="#news-page"
            className="px-7 py-3 rounded-full text-xs font-bold bg-[#001f66] hover:bg-[#002db3] text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            Lihat Selengkapnya
          </a>
        </div>

        {/* Right: HD News Image (assets/news/news.jpg) */}
        <div className="order-1 md:order-2 w-full h-[360px] md:h-full overflow-hidden">
          <img
            src="assets/news/news.jpg"
            alt="News Chelsea Squad"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Row 3: Transfer News */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[440px] md:min-h-[480px] w-full">
        {/* Left: HD Transfer News Image (assets/news/transfer news.jpg) */}
        <div className="w-full h-[360px] md:h-full overflow-hidden">
          <img
            src="assets/news/transfer news.jpg"
            alt="Transfer News Chelsea"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Right: Text Box */}
        <div className="bg-[#bebebe] p-8 sm:p-14 md:p-16 flex flex-col justify-center items-start text-left min-h-[360px]">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-4 tracking-tight">
            Transfer News
          </h2>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 max-w-md">
            Ikuti rumor dan kabar transfer terbaru yang melibatkan Chelsea di bursa musim ini.
          </p>
          <a
            href="#category-transfer"
            className="px-7 py-3 rounded-full text-xs font-bold bg-[#001f66] hover:bg-[#002db3] text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            Lihat Selengkapnya
          </a>
        </div>
      </div>

      {/* Bottom Separator Line */}
      <div className="w-full border-b border-slate-400" />
    </section>
  );
}
