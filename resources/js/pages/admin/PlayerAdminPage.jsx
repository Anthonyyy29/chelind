import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import {
    createPlayer,
    deletePlayer,
    getAdminPlayers,
    updatePlayer,
} from '../../api/client';

const EMPTY_FORM = {
    name: '',
    position: 'Attacking Midfielder',
    is_active: true,
};

const POSITIONS = [
    'Goalkeeper',
    'Defender',
    'Central Midfielder',
    'Attacking Midfielder',
    'Forward',
    'Striker',
];

export default function PlayerAdminPage() {
    const [players, setPlayers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [photo, setPhoto] = useState(null);
    const [brokenPhotoIds, setBrokenPhotoIds] = useState(() => new Set());
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const load = () => {
        getAdminPlayers().then(setPlayers);
    };

    useEffect(load, []);

    const openAdd = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setPhoto(null);
        setErrors({});
        setShowModal(true);
    };

    const openEdit = (player) => {
        setEditingId(player.id);
        setForm({
            name: player.name,
            position: player.position,
            is_active: player.is_active,
        });
        setPhoto(null);
        setErrors({});
        setShowModal(true);
    };

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
        formData.append('name', form.name);
        formData.append('position', form.position);
        formData.append('is_active', form.is_active ? '1' : '0');
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            if (editingId) {
                await updatePlayer(editingId, formData);
            } else {
                await createPlayer(formData);
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

    const handleDelete = async (player) => {
        if (!confirm(`Hapus pemain "${player.name}"?`)) {
            return;
        }

        await deletePlayer(player.id);
        load();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-500"
                >
                    <Plus className="h-4 w-4" /> Tambah Pemain Baru
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {players.length === 0 && (
                    <p className="col-span-full text-center text-sm text-slate-500">
                        Belum ada pemain.
                    </p>
                )}
                {players.map((player) => (
                    <div
                        key={player.id}
                        className="flex flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-[#121929]"
                    >
                        <div className="relative aspect-[3/4] overflow-hidden bg-slate-950">
                            {player.photo && !brokenPhotoIds.has(player.id) && (
                                <img
                                    src={player.photo}
                                    alt={player.name}
                                    onError={() =>
                                        setBrokenPhotoIds((prev) =>
                                            new Set(prev).add(player.id),
                                        )
                                    }
                                    className="h-full w-full object-cover"
                                />
                            )}
                            {!player.is_active && (
                                <span className="absolute top-3 left-3 rounded-md bg-slate-800/90 px-2 py-1 text-[10px] font-bold text-slate-300">
                                    Nonaktif
                                </span>
                            )}
                        </div>

                        <div className="flex flex-1 flex-col justify-between p-5">
                            <div>
                                <span className="mb-1 block text-[10px] font-extrabold tracking-wider text-blue-400 uppercase">
                                    {player.position}
                                </span>
                                <h3 className="mb-4 text-base leading-tight font-bold text-white">
                                    {player.name}
                                </h3>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-800/60 pt-3">
                                <button
                                    onClick={() => openEdit(player)}
                                    className="flex items-center gap-1 rounded-lg bg-blue-600/20 px-3 py-1.5 text-xs font-bold text-blue-400 transition-all hover:bg-blue-600 hover:text-white"
                                >
                                    <Edit2 className="h-3.5 w-3.5" /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(player)}
                                    className="flex items-center gap-1 rounded-lg bg-red-600/20 px-3 py-1.5 text-xs font-bold text-red-400 transition-all hover:bg-red-600 hover:text-white"
                                >
                                    <Trash2 className="h-3.5 w-3.5" /> Hapus
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
                            {editingId
                                ? 'Edit Data Pemain'
                                : 'Tambah Pemain Baru'}
                        </h3>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 text-xs"
                        >
                            <div>
                                <label className="mb-1 block font-bold text-slate-300">
                                    Nama Pemain
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={handleChange('name')}
                                    placeholder="Misal: Cole Palmer"
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-blue-500"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-red-400">
                                        {errors.name[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-bold text-slate-300">
                                    Posisi
                                </label>
                                <select
                                    value={form.position}
                                    onChange={handleChange('position')}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-blue-500"
                                >
                                    {POSITIONS.map((pos) => (
                                        <option key={pos} value={pos}>
                                            {pos}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block font-bold text-slate-300">
                                    Foto (nomor punggung & bendera menyatu di
                                    foto)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setPhoto(e.target.files[0])
                                    }
                                    className="w-full text-slate-300"
                                />
                            </div>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={handleChange('is_active')}
                                />
                                Aktif (tampil di halaman News)
                            </label>

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
