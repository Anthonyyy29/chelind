import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    BarChart3,
    Image as ImageIcon,
    MessageSquareQuote,
} from 'lucide-react';
import {
    createArticle,
    getAdminArticle,
    getCategories,
    updateArticle,
} from '../../api/client';

const EMPTY_FORM = {
    title: '',
    excerpt: '',
    body: '',
    category_id: '',
    is_featured: false,
    status: 'draft',
};

const EMPTY_MATCH_STATS = {
    home_team: '',
    away_team: '',
    home_score: '',
    away_score: '',
    possession_home: '',
    possession_away: '',
    shots_home: '',
    shots_away: '',
    pass_home: '',
    pass_away: '',
    corners_home: '',
    corners_away: '',
    goalscorers_text: '',
};

const MATCH_STATS_NUMERIC_FIELDS = [
    'possession_home',
    'possession_away',
    'shots_home',
    'shots_away',
    'pass_home',
    'pass_away',
    'corners_home',
    'corners_away',
];

function slugify(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function countWords(text) {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function cleanMatchStats(stats) {
    const cleaned = {};
    let hasValue = false;

    for (const field of Object.keys(EMPTY_MATCH_STATS)) {
        const raw = stats[field];

        if (MATCH_STATS_NUMERIC_FIELDS.includes(field)) {
            if (raw === '' || raw === null || raw === undefined) {
                cleaned[field] = null;
            } else {
                cleaned[field] = parseInt(raw, 10);
                hasValue = true;
            }

            continue;
        }

        const trimmed = (raw || '').trim();
        cleaned[field] = trimmed || null;

        if (trimmed) {
            hasValue = true;
        }
    }

    return hasValue ? cleaned : null;
}

export default function ArticleEditorPage() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [quoteText, setQuoteText] = useState('');
    const [quoteAuthor, setQuoteAuthor] = useState('');
    const [matchStats, setMatchStats] = useState(EMPTY_MATCH_STATS);
    const [coverImage, setCoverImage] = useState(null);
    const [existingCoverImage, setExistingCoverImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    useEffect(() => {
        if (!isEdit) {
            return;
        }

        getAdminArticle(id).then((article) => {
            setForm({
                title: article.title,
                excerpt: article.excerpt || '',
                body: article.body || '',
                category_id: article.category?.id || '',
                is_featured: article.is_featured,
                status: article.status,
            });
            setExistingCoverImage(article.cover_image);
            setTags(article.tags || []);
            setQuoteText(article.quote?.text || '');
            setQuoteAuthor(article.quote?.author || '');

            if (article.match_stats) {
                setMatchStats({
                    ...EMPTY_MATCH_STATS,
                    ...Object.fromEntries(
                        Object.entries(article.match_stats).map(
                            ([key, value]) => [
                                key,
                                value === null || value === undefined
                                    ? ''
                                    : String(value),
                            ],
                        ),
                    ),
                });
            }
        });
    }, [id, isEdit]);

    const handleChange = (field) => (e) => {
        const value =
            e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleStatsChange = (field) => (e) => {
        const { value } = e.target;
        setMatchStats((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddTag = (e) => {
        if (e.key !== 'Enter') {
            return;
        }

        e.preventDefault();
        const value = newTag.trim();

        if (value && !tags.includes(value)) {
            setTags([...tags, value]);
        }

        setNewTag('');
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const wordCount = countWords(form.body);
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    const slugPreview = form.title ? slugify(form.title) : '';

    const save = async (targetStatus) => {
        setSaving(true);
        setErrors({});

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('excerpt', form.excerpt);
        formData.append('body', form.body);
        formData.append('category_id', form.category_id);
        formData.append('is_featured', form.is_featured ? '1' : '0');
        formData.append('status', targetStatus);
        formData.append('tags', JSON.stringify(tags));
        formData.append('quote_text', quoteText);
        formData.append('quote_author', quoteAuthor);
        formData.append(
            'match_stats',
            JSON.stringify(cleanMatchStats(matchStats)),
        );

        if (coverImage) {
            formData.append('cover_image', coverImage);
        }

        try {
            if (isEdit) {
                await updateArticle(id, formData);
            } else {
                await createArticle(formData);
            }

            navigate('/admin/artikel');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 text-xs">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/artikel')}
                        className="flex items-center gap-1.5 font-bold text-slate-400 transition-colors hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" /> Kembali
                    </button>
                    <span className="text-slate-400">
                        {wordCount} kata &bull; {readTime} menit baca
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <span
                        className={`rounded-full px-3 py-1 font-extrabold uppercase ${
                            form.status === 'published'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : 'bg-amber-500/15 text-amber-400'
                        }`}
                    >
                        {form.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    <button
                        type="button"
                        disabled={saving}
                        onClick={() => {
                            setForm((prev) => ({ ...prev, status: 'draft' }));
                            save('draft');
                        }}
                        className="rounded-xl bg-slate-800 px-4 py-2.5 font-bold text-slate-200 transition-colors hover:bg-slate-700 disabled:opacity-60"
                    >
                        Simpan Draft
                    </button>
                    <button
                        type="button"
                        disabled={saving}
                        onClick={() => {
                            setForm((prev) => ({
                                ...prev,
                                status: 'published',
                            }));
                            save('published');
                        }}
                        className="rounded-xl bg-blue-600 px-5 py-2.5 font-bold text-white shadow-md shadow-blue-600/30 transition-all hover:bg-blue-500 disabled:opacity-60"
                    >
                        {saving ? 'Menyimpan...' : 'Publikasikan'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div className="space-y-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-6">
                        <div>
                            <label className="mb-2 block font-bold tracking-wider text-slate-400 uppercase">
                                Judul Artikel
                            </label>
                            <input
                                type="text"
                                required
                                value={form.title}
                                onChange={handleChange('title')}
                                placeholder="Judul Artikel..."
                                className="w-full border-b border-slate-800 bg-transparent pb-2 text-xl font-extrabold text-white outline-none focus:border-blue-500 sm:text-2xl"
                            />
                            {errors.title && (
                                <p className="mt-1 text-red-400">
                                    {errors.title[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block font-bold tracking-wider text-slate-400 uppercase">
                                Ringkasan / Sub-judul Artikel
                            </label>
                            <textarea
                                rows={2}
                                value={form.excerpt}
                                onChange={handleChange('excerpt')}
                                placeholder="Ringkasan singkat artikel yang muncul di kartu berita & bawah judul..."
                                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-200 outline-none focus:border-blue-500"
                            />
                            {errors.excerpt && (
                                <p className="mt-1 text-red-400">
                                    {errors.excerpt[0]}
                                </p>
                            )}
                        </div>

                        {slugPreview && (
                            <p className="truncate font-mono text-slate-500">
                                URL: /berita/{slugPreview}
                            </p>
                        )}
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#121929]">
                        <div className="border-b border-slate-800 bg-slate-950/60 p-3">
                            <span className="font-bold text-slate-300">
                                Isi Berita Utama (Gunakan Enter 2x untuk
                                Paragraf Baru)
                            </span>
                        </div>
                        <textarea
                            required
                            rows={14}
                            value={form.body}
                            onChange={handleChange('body')}
                            placeholder="Tulis isi artikel di sini..."
                            className="w-full resize-y border-none bg-transparent p-6 leading-relaxed text-slate-200 outline-none placeholder:text-slate-500"
                        />
                        {errors.body && (
                            <p className="p-3 pt-0 text-red-400">
                                {errors.body[0]}
                            </p>
                        )}
                    </div>

                    <div className="space-y-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-6">
                        <div className="flex items-center gap-2 font-bold tracking-wider text-blue-400 uppercase">
                            <MessageSquareQuote className="h-4 w-4" /> Kutipan
                            Utama Artikel (Opsional)
                        </div>
                        <div>
                            <label className="mb-1 block font-bold text-slate-400">
                                Isi Kutipan
                            </label>
                            <textarea
                                rows={2}
                                value={quoteText}
                                onChange={(e) => setQuoteText(e.target.value)}
                                placeholder="Tulis kata-kata kutipan di sini..."
                                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block font-bold text-slate-400">
                                Nama Tokoh / Jabatan
                            </label>
                            <input
                                type="text"
                                value={quoteAuthor}
                                onChange={(e) => setQuoteAuthor(e.target.value)}
                                placeholder="ENZO MARESCA — PELATIH UTAMA CHELSEA"
                                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-6">
                        <div className="flex items-center gap-2 font-bold tracking-wider text-blue-400 uppercase">
                            <BarChart3 className="h-4 w-4" /> Statistik
                            Pertandingan (Opsional)
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <div>
                                <label className="mb-1 block font-bold text-slate-400">
                                    Tim Home
                                </label>
                                <input
                                    type="text"
                                    value={matchStats.home_team}
                                    onChange={handleStatsChange('home_team')}
                                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block font-bold text-slate-400">
                                    Skor Home
                                </label>
                                <input
                                    type="text"
                                    value={matchStats.home_score}
                                    onChange={handleStatsChange('home_score')}
                                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block font-bold text-slate-400">
                                    Tim Away
                                </label>
                                <input
                                    type="text"
                                    value={matchStats.away_team}
                                    onChange={handleStatsChange('away_team')}
                                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block font-bold text-slate-400">
                                    Skor Away
                                </label>
                                <input
                                    type="text"
                                    value={matchStats.away_score}
                                    onChange={handleStatsChange('away_score')}
                                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block font-bold text-slate-300">
                                    Penguasaan Bola (%) Home - Away
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={matchStats.possession_home}
                                        onChange={handleStatsChange(
                                            'possession_home',
                                        )}
                                        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-white"
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={matchStats.possession_away}
                                        onChange={handleStatsChange(
                                            'possession_away',
                                        )}
                                        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block font-bold text-slate-300">
                                    Tembakan Tepat Sasaran Home - Away
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={matchStats.shots_home}
                                        onChange={handleStatsChange(
                                            'shots_home',
                                        )}
                                        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-white"
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={matchStats.shots_away}
                                        onChange={handleStatsChange(
                                            'shots_away',
                                        )}
                                        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block font-bold text-slate-300">
                                    Akurasi Umpan (%) Home - Away
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={matchStats.pass_home}
                                        onChange={handleStatsChange(
                                            'pass_home',
                                        )}
                                        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-white"
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={matchStats.pass_away}
                                        onChange={handleStatsChange(
                                            'pass_away',
                                        )}
                                        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block font-bold text-slate-300">
                                    Tendangan Sudut Home - Away
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={matchStats.corners_home}
                                        onChange={handleStatsChange(
                                            'corners_home',
                                        )}
                                        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-white"
                                    />
                                    <span>-</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={matchStats.corners_away}
                                        onChange={handleStatsChange(
                                            'corners_away',
                                        )}
                                        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block font-bold text-slate-300">
                                Daftar Pencetak Gol (Pisahkan dengan Enter)
                            </label>
                            <textarea
                                rows={3}
                                value={matchStats.goalscorers_text}
                                onChange={handleStatsChange('goalscorers_text')}
                                placeholder={
                                    "Son Heung-min 34' (Spurs)\nCole Palmer 58', 79' (Chelsea)"
                                }
                                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-white outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-[#121929] p-6">
                        <label className="mb-3 block font-bold tracking-wider text-slate-300 uppercase">
                            Gambar Utama (Featured Image)
                        </label>

                        {existingCoverImage && !coverImage && (
                            <img
                                src={existingCoverImage}
                                alt="Cover saat ini"
                                className="mb-3 aspect-video w-full rounded-xl object-cover"
                            />
                        )}

                        <div className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/60 p-8 text-center transition-colors hover:border-blue-500">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setCoverImage(e.target.files[0])
                                }
                                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                            />
                            <div className="flex flex-col items-center py-2">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400">
                                    <ImageIcon className="h-6 w-6" />
                                </div>
                                <p className="mb-1 font-bold text-white">
                                    {coverImage
                                        ? coverImage.name
                                        : 'Klik untuk unggah gambar'}
                                </p>
                                <p className="text-slate-400">PNG, JPG, WEBP</p>
                            </div>
                        </div>
                        {errors.cover_image && (
                            <p className="mt-1 text-red-400">
                                {errors.cover_image[0]}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-[#121929] p-6">
                        <h3 className="font-bold tracking-wider text-slate-400 uppercase">
                            Kategori
                        </h3>
                        <select
                            required
                            value={form.category_id}
                            onChange={handleChange('category_id')}
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 font-bold text-white outline-none focus:border-blue-500"
                        >
                            <option value="" disabled>
                                Pilih kategori
                            </option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <p className="text-red-400">
                                {errors.category_id[0]}
                            </p>
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-800/80 bg-[#121929] p-6">
                        <label className="flex items-center gap-2 font-bold text-slate-300">
                            <input
                                type="checkbox"
                                checked={form.is_featured}
                                onChange={handleChange('is_featured')}
                            />
                            Jadikan Berita Unggulan (Featured)
                        </label>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-[#121929] p-6">
                        <h3 className="font-bold tracking-wider text-slate-400 uppercase">
                            Tag
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 rounded border border-blue-500/30 bg-blue-500/15 px-2.5 py-1 font-semibold text-blue-400"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-1 hover:text-red-400"
                                    >
                                        &times;
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
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
