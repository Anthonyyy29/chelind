import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#00144d] text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-10 pb-12">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-black tracking-wider text-white">CHELIND</h2>
          <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
            Fanspage Chelsea terbesar dan terlengkap nomor 1 di Indonesia.
          </p>
        </div>

        {/* Navigation Column */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Navigasi</h4>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li><a href="#hero" className="hover:text-blue-400 transition-colors">Beranda</a></li>
            <li><a href="#news" className="hover:text-blue-400 transition-colors">Berita</a></li>
            <li><a href="#matches" className="hover:text-blue-400 transition-colors">Jadwal</a></li>
            <li><a href="#matches" className="hover:text-blue-400 transition-colors">Klasemen</a></li>
          </ul>
        </div>

        {/* Community Column */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Komunitas</h4>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li><a href="#social" className="hover:text-blue-400 transition-colors">Regional</a></li>
            <li><a href="#social" className="hover:text-blue-400 transition-colors">Nobar</a></li>
            <li><a href="#social" className="hover:text-blue-400 transition-colors">Merchandise</a></li>
            <li><a href="#social" className="hover:text-blue-400 transition-colors">Donasi</a></li>
          </ul>
        </div>

        {/* About Column */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Tentang</h4>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li><a href="#hero" className="hover:text-blue-400 transition-colors">Profil</a></li>
            <li><a href="#social" className="hover:text-blue-400 transition-colors">Kontak</a></li>
            <li><a href="#hero" className="hover:text-blue-400 transition-colors">Kebijakan Privasi</a></li>
            <li><a href="#hero" className="hover:text-blue-400 transition-colors">Karier</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-white/10 text-center">
        <p className="text-[11px] text-slate-400">
          © {new Date().getFullYear()} Chelind. Fanspage independen, tidak berafiliasi resmi dengan Chelsea FC.
        </p>
      </div>
    </footer>
  );
}
