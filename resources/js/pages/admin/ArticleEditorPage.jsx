import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RichTextEditor from '../../components/RichTextEditor';
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

export default function ArticleEditorPage() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
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
        });
    }, [id, isEdit]);

    const handleChange = (field) => (e) => {
        const value =
            e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('excerpt', form.excerpt);
        formData.append('body', form.body);
        formData.append('category_id', form.category_id);
        formData.append('is_featured', form.is_featured ? '1' : '0');
        formData.append('status', form.status);

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
        <div className="max-w-2xl rounded-2xl border border-slate-800/80 bg-[#121929] p-6 sm:p-8">
            <h1 className="mb-6 text-2xl font-bold text-white">
                {isEdit ? 'Edit Artikel' : 'Tambah Artikel'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                <div>
                    <label className="mb-1 block font-bold tracking-wider text-slate-300 uppercase">
                        Judul
                    </label>
                    <input
                        type="text"
                        required
                        value={form.title}
                        onChange={handleChange('title')}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-blue-500"
                    />
                    {errors.title && (
                        <p className="mt-1 text-red-400">{errors.title[0]}</p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block font-bold tracking-wider text-slate-300 uppercase">
                        Ringkasan (Excerpt)
                    </label>
                    <textarea
                        rows={2}
                        value={form.excerpt}
                        onChange={handleChange('excerpt')}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-1 block font-bold tracking-wider text-slate-300 uppercase">
                        Isi Artikel
                    </label>
                    <RichTextEditor
                        value={form.body}
                        onChange={(html) =>
                            setForm((prev) => ({ ...prev, body: html }))
                        }
                    />
                    {errors.body && (
                        <p className="mt-1 text-red-400">{errors.body[0]}</p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block font-bold tracking-wider text-slate-300 uppercase">
                        Kategori
                    </label>
                    <select
                        required
                        value={form.category_id}
                        onChange={handleChange('category_id')}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-blue-500"
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
                        <p className="mt-1 text-red-400">
                            {errors.category_id[0]}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block font-bold tracking-wider text-slate-300 uppercase">
                        Cover Image
                    </label>
                    {existingCoverImage && (
                        <img
                            src={existingCoverImage}
                            alt="Cover saat ini"
                            className="mb-2 h-32 w-full rounded-xl object-cover"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverImage(e.target.files[0])}
                        className="w-full text-slate-300"
                    />
                </div>

                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-slate-300">
                        <input
                            type="checkbox"
                            checked={form.is_featured}
                            onChange={handleChange('is_featured')}
                        />
                        Featured
                    </label>

                    <div className="flex items-center gap-2 text-slate-300">
                        <label>Status:</label>
                        <select
                            value={form.status}
                            onChange={handleChange('status')}
                            className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-white"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-full bg-blue-600 px-6 py-2.5 font-bold text-white shadow-sm hover:bg-blue-500 disabled:opacity-60"
                    >
                        {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/artikel')}
                        className="rounded-full border border-slate-700 px-6 py-2.5 font-bold text-slate-300 hover:bg-slate-800"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
}
