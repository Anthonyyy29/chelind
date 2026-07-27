import React from 'react';
import { ShieldCheck, X, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-poppins selection:bg-blue-600 selection:text-white">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 sm:p-8 relative text-white shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Kebijakan Privasi (Privacy Policy)</h2>
              <p className="text-xs text-slate-400">Komitmen perlindungan data Chelindo Indonesia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Privacy Content */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed pr-2">
          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> 1. Pendahuluan
            </h3>
            <p>
              Selamat datang di <strong>Chelindo</strong> (Komunitas Pendukung Resmi Chelsea FC Indonesia). Kami sangat menghargai privasi dan kerahasiaan data pribadi seluruh anggota, pembaca berita, serta pengunjung platform kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, mengelola, menggunakan, dan melindungi informasi pribadi Anda saat mengakses layanan portal berita, jadwal pertandingan, dan forum komunitas Chelindo.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> 2. Informasi yang Kami Kumpulkan
            </h3>
            <p>Kami dapat mengumpulkan informasi dalam beberapa kategori berikut:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li><strong>Data Akun & Identitas</strong>: Nama lengkap, alamat email, foto profil, dan kata sandi saat Anda mendaftar atau diberi akses oleh pengelola admin/owner Chelindo.</li>
              <li><strong>Informasi Aktivitas & Log</strong>: Alamat IP, jenis browser, perangkat yang digunakan, serta halaman berita/jadwal pertandingan yang Anda akses untuk keperluan analisis kinerja situs.</li>
              <li><strong>Aset Media & Unggahan</strong>: Gambar berita, foto pemain, dan logo klub yang diunggah melalui dashboard pengelola.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> 3. Penggunaan Informasi
            </h3>
            <p>Informasi yang kami kumpulkan digunakan secara bertanggung jawab untuk tujuan:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Menyajikan artikel berita berita terkini Chelsea FC, pembaruan matchday, dan statistik pertandingan secara akurat.</li>
              <li>Mengelola hak akses pengelola (Owner, Admin, Editor, Moderator) pada Dashboard Pengelola Chelindo.</li>
              <li>Memulai komunikasi komunitas dan pembaruan informasi kegiatan fans club resmi Chelindo.</li>
              <li>Menjaga keamanan dan mencegah aktivitas akses ilegal tanpa izin pada platform.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> 4. Perlindungan & Keamanan Data
            </h3>
            <p>
              Chelindo menerapkan enkripsi standar industri dan kontrol keamanan yang ketat. Kami memastikan bahwa data sensitif pengguna disimpan secara aman dan tidak akan diperjualbelikan, disewakan, atau dibagikan kepada pihak ketiga mana pun tanpa persetujuan eksplisit dari Anda, kecuali diwajibkan oleh hukum yang berlaku.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> 5. Hak-Hak Pengguna
            </h3>
            <p>Sebagai pengguna, Anda memiliki hak penuh untuk:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Meminta akses terhadap data pribadi Anda yang tersimpan di sistem kami.</li>
              <li>Memperbarui atau mengoreksi data profil dan preferensi akun Anda.</li>
              <li>Meminta penghapusan akun atau data pribadi Anda dari database Chelindo.</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="space-y-2 border-t border-slate-800 pt-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> 6. Hubungi Kami
            </h3>
            <p>
              Jika Anda memiliki pertanyaan, saran, atau permintaan terkait Kebijakan Privasi ini, silakan hubungi tim pengelola Chelindo Indonesia melalui:
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 font-mono text-xs text-blue-400">
              <p>Email: support@chelind.id</p>
              <p>Komunitas: Chelsea Supporters Club Indonesia (Chelindo)</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">Terakhir diperbarui: 2026</span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> Saya Mengerti & Setuju
          </button>
        </div>
      </div>
    </div>
  );
}
