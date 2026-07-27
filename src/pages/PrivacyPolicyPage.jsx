import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsappBanner from '../components/WhatsappBanner';
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText, CheckCircle2, Mail, Users } from 'lucide-react';

export default function PrivacyPolicyPage({ onNavigateBack }) {
  return (
    <div className="min-h-screen bg-[#bebebe] text-slate-900 font-poppins selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Header Banner */}
      <section className="relative bg-[#000e38] text-white pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-blue-900/50">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <button
            onClick={onNavigateBack || (() => (window.location.hash = '#home'))}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold backdrop-blur-md mb-6 transition-colors text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-extrabold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> LEGAL & DATA PROTECTION
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md text-white">
            Privacy Policy
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Kebijakan Privasi dan komitmen perlindungan data pribadi pengguna pada platform komunitas Chelindo Indonesia.
          </p>
        </div>
      </section>

      {/* Main Privacy Content Body */}
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-[#18181b] text-white rounded-2xl p-6 sm:p-10 shadow-2xl border border-white/10 space-y-8 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-3 pb-6 border-b border-white/10">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 font-extrabold text-sm flex items-center justify-center">1</span>
              Pendahuluan
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Selamat datang di <strong>Chelindo</strong> (Komunitas Pendukung Resmi Chelsea FC Indonesia). Kami sangat menghargai privasi dan kerahasiaan data pribadi seluruh anggota, pembaca berita, serta pengunjung platform kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, mengelola, menggunakan, dan melindungi informasi pribadi Anda saat mengakses layanan portal berita, jadwal pertandingan, dan forum komunitas Chelindo.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 pb-6 border-b border-white/10">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 font-extrabold text-sm flex items-center justify-center">2</span>
              Informasi yang Kami Kumpulkan
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">Kami dapat mengumpulkan informasi dalam beberapa kategori berikut:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-300">
              <li><strong>Data Akun & Identitas</strong>: Nama lengkap, alamat email, foto profil, dan kata sandi saat Anda mendaftar atau diberi akses oleh pengelola admin/owner Chelindo.</li>
              <li><strong>Informasi Aktivitas & Log</strong>: Alamat IP, jenis browser, perangkat yang digunakan, serta halaman berita/jadwal pertandingan yang Anda akses untuk keperluan analisis kinerja situs.</li>
              <li><strong>Aset Media & Unggahan</strong>: Gambar berita, foto pemain, dan logo klub yang diunggah melalui dashboard pengelola.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 pb-6 border-b border-white/10">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 font-extrabold text-sm flex items-center justify-center">3</span>
              Penggunaan Informasi
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">Informasi yang kami kumpulkan digunakan secara bertanggung jawab untuk tujuan:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-300">
              <li>Menyajikan artikel berita berita terkini Chelsea FC, pembaruan matchday, dan statistik pertandingan secara akurat.</li>
              <li>Mengelola hak akses pengelola (Owner, Admin, Editor, Moderator) pada Dashboard Pengelola Chelindo.</li>
              <li>Memulai komunikasi komunitas dan pembaruan informasi kegiatan fans club resmi Chelindo.</li>
              <li>Menjaga keamanan dan mencegah aktivitas akses ilegal tanpa izin pada platform.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 pb-6 border-b border-white/10">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 font-extrabold text-sm flex items-center justify-center">4</span>
              Perlindungan & Keamanan Data
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Chelindo menerapkan enkripsi standar industri dan kontrol keamanan yang ketat. Kami memastikan bahwa data sensitif pengguna disimpan secara aman dan tidak akan diperjualbelikan, disewakan, atau dibagikan kepada pihak ketiga mana pun tanpa persetujuan eksplisit dari Anda, kecuali diwajibkan oleh hukum yang berlaku.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 pb-6 border-b border-white/10">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 font-extrabold text-sm flex items-center justify-center">5</span>
              Hak-Hak Pengguna
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">Sebagai pengguna, Anda memiliki hak penuh untuk:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-300">
              <li>Meminta akses terhadap data pribadi Anda yang tersimpan di sistem kami.</li>
              <li>Memperbarui atau mengoreksi data profil dan preferensi akun Anda.</li>
              <li>Meminta penghapusan akun atau data pribadi Anda dari database Chelindo.</li>
            </ul>
          </div>

          {/* Section 6: Hubungi Kami */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 font-extrabold text-sm flex items-center justify-center">6</span>
              Hubungi Kami
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Jika Anda memiliki pertanyaan, saran, atau permintaan terkait Kebijakan Privasi ini, silakan hubungi tim pengelola Chelindo Indonesia melalui:
            </p>
            <div className="bg-slate-950 p-4 sm:p-6 rounded-xl border border-slate-800 space-y-2 text-xs sm:text-sm font-mono text-blue-400">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" /> Email Support: support@chelind.id
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" /> Komunitas: Chelsea Supporters Club Indonesia (Chelindo)
              </p>
            </div>
          </div>
        </div>
      </main>

      <WhatsappBanner />
      <Footer />
    </div>
  );
}
