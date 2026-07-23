import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#000f3a]/95 backdrop-blur-md shadow-xl border-b border-white/10 py-3'
          : 'bg-gradient-to-b from-[#000f3a]/90 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-1 group">
          <span className="text-2xl font-extrabold tracking-tight text-white">
            chel<span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 mx-0.5 group-hover:scale-125 transition-transform"></span>indo
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wider text-slate-300">
          <a href="#news-page" className="hover:text-blue-400 transition-colors uppercase">
            NEWS
          </a>
          <a href="#category-transfer" className="hover:text-blue-400 transition-colors uppercase">
            TRANSFER NEWS
          </a>
          <a href="#matches-page" className="hover:text-blue-400 transition-colors uppercase">
            MATCHDAY
          </a>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://chat.whatsapp.com/LqpgBD74aQVDd3tICsvCoG"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#001f66] hover:bg-[#002db3] text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-200 active:scale-95"
          >
            JOIN OUR COMMUNITY
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle Navigation Menu"
          className="md:hidden p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {isMobileOpen && (
        <div className="md:hidden bg-[#000f3a] border-b border-white/10 px-4 pt-4 pb-6 space-y-4">
          <a
            href="#news-page"
            onClick={() => setIsMobileOpen(false)}
            className="block text-sm font-semibold tracking-wider text-slate-200 hover:text-blue-400 py-2 border-b border-white/5"
          >
            NEWS
          </a>
          <a
            href="#category-transfer"
            onClick={() => setIsMobileOpen(false)}
            className="block text-sm font-semibold tracking-wider text-slate-200 hover:text-blue-400 py-2 border-b border-white/5"
          >
            TRANSFER NEWS
          </a>
          <a
            href="#matches-page"
            onClick={() => setIsMobileOpen(false)}
            className="block text-sm font-semibold tracking-wider text-slate-200 hover:text-blue-400 py-2 border-b border-white/5"
          >
            MATCHDAY
          </a>
          <a
            href="https://chat.whatsapp.com/LqpgBD74aQVDd3tICsvCoG"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center w-full px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#001f66] text-white shadow-lg"
          >
            JOIN OUR COMMUNITY
          </a>
        </div>
      )}
    </header>
  );
}
