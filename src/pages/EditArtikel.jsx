import React, { useState } from 'react';
import ImageCropModal from '../components/ImageCropModal';
import { ArrowLeft, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Quote, Link, Image as ImageIcon, Trash2, CheckCircle, UploadCloud, X } from 'lucide-react';

export default function EditArtikel({ article, onSave, onCancel, isDarkMode = true }) {
  const [title, setTitle] = useState(article?.title || '');
  const [category, setCategory] = useState(article?.category || 'MATCH REPORT');
  const [author, setAuthor] = useState(article?.author || 'Admin Chelind');
  const [publishDate, setPublishDate] = useState(article?.date || '18 Jul 2026');
  const [status, setStatus] = useState(article?.status || 'published');
  const [content, setContent] = useState(article?.content || '');
  const [image, setImage] = useState(article?.image || '');
  const [tags, setTags] = useState(article?.tags || ['Chelsea', 'Premier League', 'Cole Palmer', 'Enzo Maresca', 'Stamford Bridge', 'UCL', 'Transfer']);
  const [newTag, setNewTag] = useState('');

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

  const handlePublish = () => {
    onSave && onSave({
      ...article,
      title,
      category,
      author,
      date: publishDate,
      status: 'published',
      content,
      image,
      tags,
      readTime: `${readTime} MIN READ`,
    });
  };

  const handleDraft = () => {
    onSave && onSave({
      ...article,
      title,
      category,
      author,
      date: publishDate,
      status: 'draft',
      content,
      image,
      tags,
      readTime: `${readTime} MIN READ`,
    });
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
    <div className="space-y-6">
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
            Publikasikan
          </button>
        </div>
      </div>

      {/* Editor Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Main Text Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title Card */}
          <div className={`${themeClasses.card} rounded-2xl p-6 border`}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul Artikel..."
              className="w-full text-2xl sm:text-3xl font-extrabold bg-transparent border-none outline-none focus:ring-0 placeholder:text-slate-500 text-white"
            />
            <p className="text-xs text-slate-500 mt-2 font-mono truncate">
              p/ {slug}
            </p>
          </div>

          {/* Formatting Toolbar & Content Area */}
          <div className={`${themeClasses.card} rounded-2xl overflow-hidden border`}>
            {/* Toolbar */}
            <div className={`flex flex-wrap items-center gap-1 p-3 border-b ${themeClasses.toolbar}`}>
              <button className="p-1.5 hover:bg-white/10 rounded font-bold">B</button>
              <button className="p-1.5 hover:bg-white/10 rounded italic">I</button>
              <button className="p-1.5 hover:bg-white/10 rounded underline">U</button>
              <span className="w-px h-4 bg-slate-700 mx-1" />
              <button className="p-1.5 hover:bg-white/10 rounded"><AlignLeft className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-white/10 rounded"><AlignCenter className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-white/10 rounded"><AlignRight className="w-4 h-4" /></button>
              <span className="w-px h-4 bg-slate-700 mx-1" />
              <button className="p-1.5 hover:bg-white/10 rounded"><Quote className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-white/10 rounded"><Link className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-white/10 rounded"><ImageIcon className="w-4 h-4" /></button>
            </div>

            {/* Main Textarea */}
            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis konten artikel di sini..."
              className="w-full p-6 bg-transparent border-none outline-none focus:ring-0 text-sm leading-relaxed text-slate-200 placeholder:text-slate-500 resize-y"
            />
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
