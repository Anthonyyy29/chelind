import React, { useEffect, useState } from 'react';
import { ExternalLink, Plus, Edit2, Trash2, X } from 'lucide-react';
import {
    createSocialLink,
    deleteSocialLink,
    getAdminSocialLinks,
    updateSocialLink,
} from '../../api/client';

const EMPTY_FORM = {
    platform: '',
    handle: '',
    url: '',
    description: '',
    sort_order: 0,
};

export default function SocialLinkAdminPage() {
    const [links, setLinks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const load = () => {
        getAdminSocialLinks().then(setLinks);
    };

    useEffect(load, []);

    const openAdd = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setErrors({});
        setShowModal(true);
    };

    const openEdit = (link) => {
        setEditingId(link.id);
        setForm({
            platform: link.platform,
            handle: link.handle,
            url: link.url,
            description: link.description || '',
            sort_order: link.sort_order,
        });
        setErrors({});
        setShowModal(true);
    };

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        try {
            if (editingId) {
                await updateSocialLink(editingId, form);
            } else {
                await createSocialLink(form);
            }

            setShowModal(false);
            load();
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (link) => {
        if (!confirm(`Hapus social link "${link.platform}"?`)) {
            return;
        }

        await deleteSocialLink(link.id);
        load();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-500"
                >
                    <Plus className="h-4 w-4" /> Tambah Link Baru
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {links.length === 0 && (
                    <p className="col-span-full text-center text-sm text-slate-500">
                        Belum ada social link.
                    </p>
                )}
                {links.map((link) => (
                    <div
                        key={link.id}
                        className="space-y-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-6"
                    >
                        <div className="flex items-center justify-between">
                            <span className="rounded-full border border-blue-500/30 bg-blue-500/15 px-3 py-1 text-[10px] font-extrabold text-blue-400 uppercase">
                                {link.platform}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">
                                #{link.sort_order}
                            </span>
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-white">
                                {link.handle}
                            </h3>
                            {link.description && (
                                <p className="mt-1 text-xs text-slate-400">
                                    {link.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 text-xs">
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 font-bold text-blue-400 hover:text-blue-300"
                            >
                                Buka <ExternalLink className="h-3 w-3" />
                            </a>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => openEdit(link)}
                                    className="rounded p-1.5 text-slate-400 hover:bg-blue-600/20 hover:text-blue-400"
                                >
                                    <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(link)}
                                    className="rounded p-1.5 text-slate-400 hover:bg-red-600/20 hover:text-red-400"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white sm:p-8">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <h3 className="mb-6 text-xl font-bold">
                            {editingId ? 'Edit Link' : 'Tambah Link Baru'}
                        </h3>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 text-xs"
                        >
                            <div>
                                <label className="mb-1 block font-bold text-slate-300">
                                    Platform
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.platform}
                                    onChange={handleChange('platform')}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-blue-500"
                                />
                                {errors.platform && (
                                    <p className="mt-1 text-red-400">
                                        {errors.platform[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-bold text-slate-300">
                                    Handle
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.handle}
                                    onChange={handleChange('handle')}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-blue-500"
                                />
                                {errors.handle && (
                                    <p className="mt-1 text-red-400">
                                        {errors.handle[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-bold text-slate-300">
                                    URL
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={form.url}
                                    onChange={handleChange('url')}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-blue-500"
                                />
                                {errors.url && (
                                    <p className="mt-1 text-red-400">
                                        {errors.url[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-bold text-slate-300">
                                    Deskripsi
                                </label>
                                <textarea
                                    rows={2}
                                    value={form.description}
                                    onChange={handleChange('description')}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block font-bold text-slate-300">
                                    Urutan
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    value={form.sort_order}
                                    onChange={handleChange('sort_order')}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 font-mono text-white outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-500 disabled:opacity-60"
                                >
                                    {saving ? 'Menyimpan...' : 'Simpan'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-full border border-slate-700 px-5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
