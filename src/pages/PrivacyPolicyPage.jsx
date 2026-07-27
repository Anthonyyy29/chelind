import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsappBanner from '../components/WhatsappBanner';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage({ onNavigateBack }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-poppins selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Main Privacy Policy Container with Larger Font & Indonesian Language */}
      <main className="max-w-4xl mx-auto pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onNavigateBack || (() => (window.location.hash = '#home'))}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </button>

        {/* Page Title & Last Updated */}
        <div className="mb-10 pb-6 border-b border-slate-200">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3">
            Kebijakan Privasi (Privacy Policy)
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">
            Terakhir diperbarui: 11 April 2026
          </p>
        </div>

        {/* Privacy Content Sections in 100% Indonesian & Larger Readable Typography */}
        <div className="space-y-10 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
          {/* 1. Pendahuluan */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
              1. Pendahuluan
            </h2>
            <p>
              Chelindo ("kami", "milik kami", atau "kita") mengoperasikan platform dan situs web Chelindo. Halaman ini memberi tahu Anda tentang kebijakan kami mengenai pengumpulan, penggunaan, dan pengungkapan data pribadi saat Anda menggunakan layanan kami serta pilihan yang Anda miliki terkait dengan data tersebut.
            </p>
            <p>
              Kami berkomitmen untuk melindungi privasi Anda dan memastikan Anda memiliki pengalaman yang positif pada platform kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan melindungi informasi pribadi Anda.
            </p>
          </section>

          {/* 2. Pengumpulan dan Penggunaan Informasi */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
              2. Pengumpulan dan Penggunaan Informasi
            </h2>
            <p>
              Kami mengumpulkan beberapa jenis informasi yang berbeda untuk berbagai tujuan guna menyediakan dan meningkatkan kualitas layanan kami kepada Anda.
            </p>

            <div className="pt-2 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Jenis Data yang Dikumpulkan:
              </h3>
              <ul className="list-disc pl-6 space-y-2.5 text-slate-700">
                <li>
                  <strong className="text-slate-900">Data Pribadi:</strong> Nama lengkap, alamat email, nomor telepon, lokasi, dan informasi profil pengguna.
                </li>
                <li>
                  <strong className="text-slate-900">Data Barang/Konten:</strong> Deskripsi, foto, kategori, dan status berita atau konten yang diunggah.
                </li>
                <li>
                  <strong className="text-slate-900">Data Penggunaan:</strong> Informasi tentang bagaimana Anda berinteraksi dan mengakses platform kami.
                </li>
                <li>
                  <strong className="text-slate-900">Data Teknis:</strong> Alamat IP, jenis browser, versi sistem operasi, dan informasi perangkat.
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Penggunaan Data */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
              3. Penggunaan Data
            </h2>
            <p>
              Chelindo menggunakan data yang dikumpulkan untuk berbagai tujuan berikut:
            </p>
            <ul className="list-disc pl-6 space-y-2.5 text-slate-700">
              <li>Menyediakan, mengelola, dan memelihara layanan platform kami.</li>
              <li>Memberi tahu Anda tentang perubahan atau pembaruan pada layanan kami.</li>
              <li>Menyelaraskan data konten dan informasi berita komunitas.</li>
              <li>Memungkinkan Anda untuk berpartisipasi dalam fitur-fitur interaktif situs.</li>
              <li>Menyediakan layanan bantuan dan dukungan pelanggan.</li>
              <li>Mengumpulkan analisis atau informasi berharga untuk meningkatkan kualitas layanan.</li>
              <li>Memantau tingkat penggunaan dan kinerja platform.</li>
              <li>Mendeteksi, mencegah, dan mengatasi masalah teknis maupun keamanan.</li>
            </ul>
          </section>

          {/* 4. Keamanan Data */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
              4. Keamanan Data
            </h2>
            <p>
              Keamanan data Anda sangat penting bagi kami, namun perlu diingat bahwa tidak ada metode transmisi melalui Internet atau metode penyimpanan elektronik yang 100% aman. Meskipun kami berusaha menggunakan sarana yang dapat diterima secara komersial untuk melindungi data pribadi Anda, kami tidak dapat menjamin keamanan mutlaknya.
            </p>
          </section>

          {/* 5. Perubahan pada Kebijakan Privasi Ini */}
          <section className="space-y-4">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
              5. Perubahan pada Kebijakan Privasi Ini
            </h2>
            <p>
              Kami dapat memperbarui Kebijakan Privasi kami dari waktu ke waktu. Kami akan memberi tahu Anda tentang setiap perubahan dengan memposting Kebijakan Privasi baru di halaman ini dan memperbarui "tanggal efektif" di bagian atas Kebijakan Privasi ini. Anda disarankan untuk meninjau Kebijakan Privasi ini secara berkala untuk mengetahui setiap perubahan.
            </p>
          </section>

          {/* 6. Hubungi Kami */}
          <section className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
              6. Hubungi Kami
            </h2>
            <p>
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui email di{' '}
              <a href="mailto:support@chelind.id" className="text-blue-600 font-bold hover:underline">
                support@chelind.id
              </a>{' '}
              atau melalui saluran komunikasi resmi komunitas Chelindo Indonesia.
            </p>
          </section>
        </div>
      </main>

      <WhatsappBanner />
      <Footer />
    </div>
  );
}
