import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import {
    createTransfer,
    deleteTransfer,
    getAdminTransfers,
    updateTransfer,
} from '../../api/client';
import { transferBadges, transferValue } from '../../lib/transferBadges';
import { getInitials } from '../../lib/playerInitials';

const EMPTY_FORM = {
    direction: 'in',
    is_loan: false,
    player_name: '',
    position: '',
    club_from: '',
    club_to: '',
    fee: '',
};

export default function TransferAdminPage() {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Semua');
    const [search, setSearch] = useState('');
    const [brokenPhotoIds, setBrokenPhotoIds] = useState(() => new Set());

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [photo, setPhoto] = useState(null);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const load = () => {
        setLoading(true);
        getAdminTransfers()
            .then(setTransfers)
            .finally(() => setLoading(false));
    };

    useEffect(load, []);

    const openAdd = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setPhoto(null);
        setErrors({});
        setShowModal(true);
    };

    const openEdit = (transfer) => {
        setEditingId(transfer.id);
        setForm({
            direction: transfer.direction,
            is_loan: transfer.is_loan,
            player_name: transfer.player_name,
            position: transfer.position,
            club_from: transfer.club_from,
            club_to: transfer.club_to,
            fee: transfer.fee !== null ? String(transfer.fee) : '',
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
        formData.append('direction', form.direction);
        formData.append('is_loan', form.is_loan ? '1' : '0');
        formData.append('player_name', form.player_name);
        formData.append('position', form.position);
        formData.append('club_from', form.club_from);
        formData.append('club_to', form.club_to);
        formData.append('fee', form.fee);

        if (photo) {
            formData.append('photo', photo);
        }

        try {
            if (editingId) {
                await updateTransfer(editingId, formData);
            } else {
                await createTransfer(formData);
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

    const handleDelete = async (transfer) => {
        if (!confirm(`Hapus transfer "${transfer.player_name}"?`)) {
            return;
        }

        await deleteTransfer(transfer.id);
        load();
    };

    const stats = useMemo(
        () => ({
            in: transfers.filter((t) => t.direction === 'in').length,
            out: transfers.filter((t) => t.direction === 'out').length,
            loan: transfers.filter((t) => t.is_loan).length,
            totalFee: transfers.reduce((sum, t) => sum + (t.fee || 0), 0),
        }),
        [transfers],
    );

    const filteredTransfers = transfers.filter((t) => {
        const matchesFilter =
            filter === 'Semua' ||
            (filter === 'Masuk' && t.direction === 'in') ||
            (filter === 'Keluar' && t.direction === 'out') ||
            (filter === 'On Loan' && t.is_loan);

        const query = search.trim().toLowerCase();
        const matchesSearch =
            !query ||
            t.player_name.toLowerCase().includes(query) ||
            t.club_from.toLowerCase().includes(query) ||
            t.club_to.toLowerCase().includes(query);

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-lg font-bold text-blue-400">
                        {stats.in}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Transfer Masuk</h4>
                        <p className="text-[11px] text-slate-400">
                            Pemain baru bergabung
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 text-lg font-bold text-red-400">
                        {stats.out}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">Transfer Keluar</h4>
                        <p className="text-[11px] text-slate-400">
                            Pemain meninggalkan klub
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-[#121929] p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-lg font-bold text-emerald-400">
                        {stats.loan}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">On Loan</h4>
                        <p className="text-[11px] text-slate-400">
                            Sedang dipinjamkan
                        </p>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#121929]">
                <div className="flex flex-col gap-4 border-b border-slate-800/60 p-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h3 className="text-sm font-bold">Daftar Transfer</h3>
                        <p className="text-[11px] text-slate-400">
                            {transfers.length} transfer &bull; Total fee &euro;
                            {stats.totalFee.toFixed(1)}M
                        </p>
                    </div>

                    <button
                        onClick={openAdd}
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-500"
                    >
                        <Plus className="h-4 w-4" /> Tambah Transfer
                    </button>
                </div>

                <div className="flex flex-col gap-4 border-b border-slate-800/60 p-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        {['Semua', 'Masuk', 'Keluar', 'On Loan'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                                    filter === tab
                                        ? 'bg-blue-600 text-white shadow'
                                        : 'bg-slate-800/40 text-slate-400 hover:text-white'
                                }`}
                            >
                                {tab === 'Semua'
                                    ? 'Semua Transfer'
                                    : tab === 'On Loan'
                                      ? 'On Loan'
                                      : `Transfer ${tab}`}
                            </button>
                        ))}
                    </div>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari pemain atau klub..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white outline-none focus:border-blue-500 md:w-64"
                    />
                </div>

                <div className="space-y-3 p-6">
                    {loading && (
                        <p className="py-6 text-center text-xs text-slate-500">
                            Memuat...
                        </p>
                    )}
                    {!loading && filteredTransfers.length === 0 && (
                        <p className="py-6 text-center text-xs text-slate-500">
                            Belum ada transfer.
                        </p>
                    )}
                    {filteredTransfers.map((transfer) => {
                        const badges = transferBadges(transfer);

                        return (
                            <div
                                key={transfer.id}
                                className="flex flex-col gap-4 rounded-xl border border-slate-800/60 bg-slate-950/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    {transfer.photo &&
                                    !brokenPhotoIds.has(transfer.id) ? (
                                        <img
                                            src={transfer.photo}
                                            alt={transfer.player_name}
                                            onError={() =>
                                                setBrokenPhotoIds((prev) =>
                                                    new Set(prev).add(
                                                        transfer.id,
                                                    ),
                                                )
                                            }
                                            className="h-12 w-12 shrink-0 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-sm font-extrabold text-blue-400">
                                            {getInitials(transfer.player_name)}
                                        </div>
                                    )}

                                    <div>
                                        <div className="mb-1 flex flex-wrap gap-1.5">
                                            {badges.map((badge) => (
                                                <span
                                                    key={badge}
                                                    className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                                                        badge ===
                                                        'Transfer Masuk'
                                                            ? 'bg-blue-500/15 text-blue-400'
                                                            : badge ===
                                                                'Transfer Keluar'
                                                              ? 'bg-red-500/15 text-red-400'
                                                              : 'bg-slate-700/50 text-slate-300'
                                                    }`}
                                                >
                                                    {badge}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-sm font-extrabold text-white">
                                            {transfer.player_name}{' '}
                                            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                                                {transfer.position}
                                            </span>
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {transfer.club_from}{' '}
                                            <span className="text-slate-600">
                                                &rarr;
                                            </span>{' '}
                                            {transfer.club_to}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                                    <span className="text-sm font-extrabold text-white">
                                        {transferValue(transfer)}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEdit(transfer)}
                                            className="rounded p-1.5 text-slate-400 hover:bg-blue-600/20 hover:text-blue-400"
                                        >
                                            <Edit2 className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(transfer)
                                            }
                                            className="rounded p-1.5 text-slate-400 hover:bg-red-600/20 hover:text-red-400"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
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
                            {editingId ? 'Edit Transfer' : 'Tambah Transfer'}
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
                                    value={form.player_name}
                                    onChange={handleChange('player_name')}
                                    placeholder="Nama lengkap"
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-base font-bold text-white outline-none focus:border-blue-500"
                                />
                                {errors.player_name && (
                                    <p className="mt-1 text-red-400">
                                        {errors.player_name[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-bold text-slate-300">
                                    Arah Transfer
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                direction: 'in',
                                            }))
                                        }
                                        className={`rounded-xl border px-4 py-2.5 font-bold transition-colors ${
                                            form.direction === 'in'
                                                ? 'border-blue-500 bg-blue-600/20 text-blue-400'
                                                : 'border-slate-800 bg-slate-950 text-slate-400'
                                        }`}
                                    >
                                        Masuk
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                direction: 'out',
                                            }))
                                        }
                                        className={`rounded-xl border px-4 py-2.5 font-bold transition-colors ${
                                            form.direction === 'out'
                                                ? 'border-red-500 bg-red-600/20 text-red-400'
                                                : 'border-slate-800 bg-slate-950 text-slate-400'
                                        }`}
                                    >
                                        Keluar
                                    </button>
                                </div>
                            </div>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.is_loan}
                                    onChange={handleChange('is_loan')}
                                />
                                Transfer Pinjaman (Loan)
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1 block font-bold text-slate-300">
                                        Klub Asal
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.club_from}
                                        onChange={handleChange('club_from')}
                                        placeholder="Chelsea FC"
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-blue-500"
                                    />
                                    {errors.club_from && (
                                        <p className="mt-1 text-red-400">
                                            {errors.club_from[0]}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block font-bold text-slate-300">
                                        Klub Tujuan
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.club_to}
                                        onChange={handleChange('club_to')}
                                        placeholder="Real Madrid"
                                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-blue-500"
                                    />
                                    {errors.club_to && (
                                        <p className="mt-1 text-red-400">
                                            {errors.club_to[0]}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block font-bold text-slate-300">
                                    Posisi
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.position}
                                    onChange={handleChange('position')}
                                    placeholder="LW"
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-blue-500"
                                />
                                {errors.position && (
                                    <p className="mt-1 text-red-400">
                                        {errors.position[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-bold text-slate-300">
                                    Foto Pemain
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

                            <div>
                                <label className="mb-1 block font-bold text-slate-300">
                                    Fee dalam juta Euro (contoh: 45.0)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={form.fee}
                                    onChange={handleChange('fee')}
                                    placeholder="Kosongkan jika free transfer / loan tanpa fee"
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-blue-500"
                                />
                                {errors.fee && (
                                    <p className="mt-1 text-red-400">
                                        {errors.fee[0]}
                                    </p>
                                )}
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
