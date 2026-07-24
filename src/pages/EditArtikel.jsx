import React, { useState } from 'react';
import ImageCropModal from '../components/ImageCropModal';
import { ArrowLeft, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Quote, Link, Image as ImageIcon, Trash2, CheckCircle, UploadCloud, X, BarChart3, MessageSquareQuote } from 'lucide-react';

export default function EditArtikel({ article, onSave, onCancel, isDarkMode = true }) {
  const [title, setTitle] = useState(article?.title || '');
  const [subtitle, setSubtitle] = useState(article?.subtitle || '');
  const [category, setCategory] = useState(article?.category || 'MATCH REPORT');
  const [author, setAuthor] = useState(article?.author || 'Admin Chelind');
  const [publishDate, setPublishDate] = useState(article?.date || '18 Jul 2026');
  const [status, setStatus] = useState(article?.status || 'published');
  const [content, setContent] = useState(article?.content || '');
  const [image, setImage] = useState(article?.image || '');
  const [tags, setTags] = useState(article?.tags || ['Chelsea', 'Premier League', 'Cole Palmer', 'Enzo Maresca', 'Stamford Bridge', 'UCL', 'Transfer']);
  const [newTag, setNewTag] = useState('');

  // Quote State
  const [quoteText, setQuoteText] = useState(
    article?.quote?.text || 'Dia adalah pemenang pertandingan sejati. Ketika tim sangat membutuhkan, Cole selalu datang memberikan hasil luar biasa.'
  );
  const [quoteAuthor, setQuoteAuthor] = useState(
    article?.quote?.author || 'ENZO MARESCA — PELATIH UTAMA CHELSEA'
  );

  // Match Stats State
  const [stats, setStats] = useState({
    homeTeam: article?.stats?.homeTeam || 'Chelsea FC',
    awayTeam: article?.stats?.awayTeam || 'Tottenham Hotspur',
    homeScore: article?.stats?.homeScore || '2',
    awayScore: article?.stats?.awayScore || '1',
    possessionHome: article?.stats?.possessionHome ?? 58,
    possessionAway: article?.stats?.possessionAway ?? 42,
    shotsHome: article?.stats?.shotsHome ?? 7,
    shotsAway: article?.stats?.shotsAway ?? 4,
    passHome: article?.stats?.passHome ?? 91,
    passAway: article?.stats?.passAway ?? 84,
    cornersHome: article?.stats?.cornersHome ?? 6,
    cornersAway: article?.stats?.cornersAway ?? 3,
    goalscorersText: article?.stats?.goalscorersText || "Son Heung-min 34' (Spurs)\nCole Palmer 58', 79' (Chelsea)",
  });

  // Crop Modal State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState('');

  // Generated Slug
  const slug = title
    ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : 'profil-pemain-cole-palmer-motor-serangan-chelsea';

  // Calculate word count & reading time
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 259;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleImageFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageSrc(reader.result);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedUrl) => {
    setImage(croppedUrl);
    setCropModalOpen(false);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const getUpdatedArticleObject = (targetStatus) => {
    return {
      ...article,
      title,
      subtitle,
      category,
      author,
      date: publishDate,
      status: targetStatus,
      content,
      image,
      tags,
      readTime: `${readTime} MENIT BACA`,
      quote: {
        text: quoteText,
        author: quoteAuthor,
      },
      stats: {
        ...stats,
      },
    };
  };

  const handlePublish = () => {
    onSave && onSave(getUpdatedArticleObject('published'));
  };

  const handleDraft = () => {
    onSave && onSave(getUpdatedArticleObject('draft'));
  };

  const themeClasses = isDarkMode
    ? {
        bg: 'bg-[#090d16] text-slate-100',
        card: 'bg-[#121929] border-slate-800/80',
        input: 'bg-[#0b101d] border-slate-800 text-white placeholder-slate-500 focus:border-blue-500',
        subtext: 'text-slate-400',
        tag: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
        toolbar: 'bg-[#0b101d]/60 border-slate-800 text-slate-300',
      }
    : {
        bg: 'bg-[#f4f6fa] text-slate-900',
        card: 'bg-white border-slate-200 shadow-sm',
        input: 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600',
        subtext: 'text-slate-500',
        tag: 'bg-blue-50 text-blue-700 border-blue-200',
        toolbar: 'bg-slate-50 border-slate-200 text-slate-600',
      };

  return (
    <div className="space-y-6 font-poppins">
      {/* Top Controls Bar */}
      <div className={`p-4 rounded-2xl ${themeClasses.card} border flex flex-wrap items-center justify-between gap-4`}>
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
          <span className="text-xs text-slate-400">
            {wordCount} kata • {readTime} menit baca
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
            {status === 'published' ? 'Published' : 'Draft'}
          </span>
          <button
            onClick={handleDraft}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Simpan Draft
          </button>
          <button
            onClick={handlePublish}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all"
          >
            Publikasikan Perubahan
          </button>
        </div>
      </div>

      {/* Editor Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Main Text Editor & Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Subtitle Card */}
          <div className={`${themeClasses.card} rounded-2xl p-6 border space-y-4`}>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Judul Artikel</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul Artikel..."
                className="w-full text-2xl sm:text-3xl font-extrabold bg-transparent border-b border-slate-800 pb-2 outline-none focus:border-blue-500 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ringkasan / Sub-Judul Artikel</label>
              <textarea
                rows={2}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Ringkasan singkat artikel yang muncul di bawah judul..."
                className="w-full p-3 bg-[#0b101d] border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-blue-500 resize-y"
              />
            </div>

            <p className="text-xs text-slate-500 font-mono truncate">
              URL Slug: p/ {slug}
            </p>
          </div>

          {/* Formatting Toolbar & Main Body Content Area */}
          <div className={`${themeClasses.card} rounded-2xl overflow-hidden border`}>
            <div className={`flex flex-wrap items-center justify-between p-3 border-b ${themeClasses.toolbar}`}>
              <span className="text-xs font-bold text-slate-300">Isi Berita Utama (Gunakan Enter 2x untuk Paragraf Baru)</span>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-white/10 rounded font-bold">B</button>
                <button className="p-1.5 hover:bg-white/10 rounded italic">I</button>
                <button className="p-1.5 hover:bg-white/10 rounded underline">U</button>
              </div>
            </div>

            <textarea
              rows={14}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis konten paragraf artikel di sini..."
              className="w-full p-6 bg-transparent border-none outline-none focus:ring-0 text-sm leading-relaxed text-slate-200 placeholder:text-slate-500 resize-y"
            />
          </div>

          {/* Quote Section Card */}
          <div className={`${themeClasses.card} rounded-2xl p-6 border space-y-4`}>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <MessageSquareQuote className="w-4 h-4" /> Kutipan Utama Artikel (Quote Box)
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 font-bold mb-1">Isi Kutipan:</label>
              <textarea
                rows={2}
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                placeholder="Tulis kata-kata kutipan di sini..."
                className="w-full p-3 bg-[#0b101d] border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 font-bold mb-1">Nama Tokoh / Jabatan:</label>
              <input
                type="text"
                value={quoteAuthor}
                onChange={(e) => setQuoteAuthor(e.target.value)}
                placeholder="ENZO MARESCA — PELATIH UTAMA CHELSEA"
                className="w-full px-4 py-2.5 bg-[#0b101d] border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Match Statistics Widget Form Card */}
          <div className={`${themeClasses.card} rounded-2xl p-6 border space-y-4`}>
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <BarChart3 className="w-4 h-4" /> Edit Statistik Pertandingan & Pencetak Gol
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Tim Home</label>
                <input
                  type="text"
                  value={stats.homeTeam}
                  onChange={(e) => setStats({ ...stats, homeTeam: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0b101d] border border-slate-800 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Skor Home</label>
                <input
                  type="text"
                  value={stats.homeScore}
                  onChange={(e) => setStats({ ...stats, homeScore: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0b101d] border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Tim Away</label>
                <input
                  type="text"
                  value={stats.awayTeam}
                  onChange={(e) => setStats({ ...stats, awayTeam: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0b101d] border border-slate-800 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Skor Away</label>
                <input
                  type="text"
                  value={stats.awayScore}
                  onChange={(e) => setStats({ ...stats, awayScore: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0b101d] border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <label className="block text-slate-300 font-bold">Penguasaan Bola (%) Home - Away</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={stats.possessionHome}
                    onChange={(e) => setStats({ ...stats, possessionHome: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-[#0b101d] border border-slate-800 rounded-lg text-white font-mono"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={stats.possessionAway}
                    onChange={(e) => setStats({ ...stats, possessionAway: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-[#0b101d] border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-300 font-bold">Tembakan Tepat Sasaran Home - Away</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={stats.shotsHome}
                    onChange={(e) => setStats({ ...stats, shotsHome: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-[#0b101d] border border-slate-800 rounded-lg text-white font-mono"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={stats.shotsAway}
                    onChange={(e) => setStats({ ...stats, shotsAway: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-[#0b101d] border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <label className="block text-slate-300 font-bold">Akurasi Umpan (%) Home - Away</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={stats.passHome}
                    onChange={(e) => setStats({ ...stats, passHome: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-[#0b101d] border border-slate-800 rounded-lg text-white font-mono"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={stats.passAway}
                    onChange={(e) => setStats({ ...stats, passAway: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-[#0b101d] border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-300 font-bold">Tendangan Sudut Home - Away</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={stats.cornersHome}
                    onChange={(e) => setStats({ ...stats, cornersHome: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-[#0b101d] border border-slate-800 rounded-lg text-white font-mono"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={stats.cornersAway}
                    onChange={(e) => setStats({ ...stats, cornersAway: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-[#0b101d] border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 text-xs">Daftar Pencetak Gol (Pisahkan dengan Enter)</label>
              <textarea
                rows={3}
                value={stats.goalscorersText}
                onChange={(e) => setStats({ ...stats, goalscorersText: e.target.value })}
                placeholder="Son Heung-min 34' (Spurs)&#10;Cole Palmer 58', 79' (Chelsea)"
                className="w-full p-3 bg-[#0b101d] border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Featured Image Drag & Drop Upload Zone */}
          <div className={`${themeClasses.card} rounded-2xl p-6 border`}>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Gambar Utama (Featured Image)
            </label>

            <div className="relative border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl bg-[#0b101d]/60 p-8 flex flex-col items-center justify-center text-center cursor-pointer group transition-colors">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp, image/jpg"
                onChange={handleImageFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />

              {image ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-800">
                  <img src={image} alt="Featured Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Klik untuk Ganti & Crop Gambar
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-white mb-1">Klik untuk unggah & crop gambar</p>
                  <p className="text-xs text-slate-400">PNG, JPG, WEBP — maks. 5 MB</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Meta & Settings */}
        <div className="space-y-6">
          {/* Status Artikel Card */}
          <div className={`${themeClasses.card} rounded-2xl p-6 border space-y-4`}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Artikel</h3>
            <div className="space-y-2">
              <label
                onClick={() => setStatus('published')}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  status === 'published'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold'
                    : 'border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full ${status === 'published' ? 'bg-emerald-500 ring-4 ring-emerald-500/20' : 'bg-slate-700'}`} />
                <span className="text-xs">Published</span>
              </label>

              <label
                onClick={() => setStatus('draft')}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  status === 'draft'
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold'
                    : 'border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full ${status === 'draft' ? 'bg-amber-500 ring-4 ring-amber-500/20' : 'bg-slate-700'}`} />
                <span className="text-xs">Draft</span>
              </label>
            </div>
          </div>

          {/* Kategori Card */}
          <div className={`${themeClasses.card} rounded-2xl p-6 border space-y-3`}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</h3>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold ${themeClasses.input} border outline-none`}
            >
              <option value="MATCH REPORT">MATCH REPORT</option>
              <option value="TRANSFER NEWS">TRANSFER NEWS</option>
              <option value="PREVIEW">PREVIEW</option>
              <option value="ANALYSIS">ANALYSIS</option>
              <option value="ACADEMY">ACADEMY</option>
              <option value="REVIEW">REVIEW</option>
              <option value="PLAYER PROFILE">PLAYER PROFILE</option>
              <option value="OPINION">OPINION</option>
            </select>
          </div>

          {/* Penulis Card */}
          <div className={`${themeClasses.card} rounded-2xl p-6 border space-y-3`}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Penulis</h3>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium ${themeClasses.input} border outline-none`}
            />
          </div>

          {/* Tanggal Publish Card */}
          <div className={`${themeClasses.card} rounded-2xl p-6 border space-y-3`}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal Publish</h3>
            <input
              type="text"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl text-xs font-medium ${themeClasses.input} border outline-none`}
            />
          </div>

          {/* Tag Pills Card */}
          <div className={`${themeClasses.card} rounded-2xl p-6 border space-y-3`}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tag</h3>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold ${themeClasses.tag}`}
                >
                  ✓ {t}
                  <button onClick={() => handleRemoveTag(t)} className="hover:text-red-400 ml-1">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Tekan Enter untuk tambah tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#0b101d] border border-slate-800 text-white focus:outline-none focus:border-blue-500 mt-2"
            />
          </div>
        </div>
      </div>

      {/* Interactive Image Crop Modal for Article Image */}
      <ImageCropModal
        isOpen={cropModalOpen}
        imageSrc={tempImageSrc}
        aspectRatio={1.77} // 16:9 ratio for article header
        title="Crop & Sesuaikan Gambar Artikel (16:9)"
        onCropComplete={handleCropComplete}
        onCancel={() => setCropModalOpen(false)}
      />
    </div>
  );
}
