import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#000e38] text-white py-12 font-poppins selection:bg-blue-600 selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8">
          {/* Left: Brand & Subtitle */}
          <div className="space-y-2">
            <a href="#home" className="inline-block">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-0.5">
                chel<span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 mx-0.5"></span>indo
              </span>
            </a>
            <p className="text-xs sm:text-sm text-slate-300 font-normal">
              Indonesia's largest Chelsea supporters community.
            </p>
          </div>

          {/* Right: Nav Links */}
          <div className="flex items-center gap-8 text-xs sm:text-sm font-semibold text-slate-300">
            <a href="#news-page" className="hover:text-white transition-colors">
              Our Story
            </a>
            <a href="#social" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>

        {/* Horizontal Divider Line */}
        <div className="w-full border-b border-white/20 mb-6" />

        {/* Bottom Copyright Row */}
        <div>
          <p className="text-xs text-slate-300 font-normal">
            © {new Date().getFullYear()} Chelindo. Independent fan site — not affiliated with Chelsea Football Club.
          </p>
        </div>
      </div>
    </footer>
  );
}
