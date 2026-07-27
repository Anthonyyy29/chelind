import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
    createUser,
    deleteUser,
    getAdminRoles,
    getAdminUsers,
} from '../../api/client';

const EMPTY_FORM = {
    name: '',
    email: '',
    password: '',
    role_id: '',
};

export default function AccountAdminPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const load = () => {
        getAdminUsers().then(setUsers);
    };

    useEffect(() => {
        load();
        getAdminRoles().then(setRoles);
    }, []);

    const openAdd = () => {
        setForm(EMPTY_FORM);
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
            await createUser(form);
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

    const handleDelete = async (targetUser) => {
        if (!confirm(`Hapus akun "${targetUser.name}"?`)) {
            return;
        }

        try {
            await deleteUser(targetUser.id);
            load();
        } catch (err) {
            alert(err.response?.data?.message || 'Gagal menghapus akun.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-500"
                >
                    <Plus className="h-4 w-4" /> Tambah Admin Baru
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#121929]">
                <div className="border-b border-slate-800/60 p-6">
                    <h3 className="text-base font-bold">
                        Daftar Akun Pengelola Chelind
                    </h3>
                    <p className="text-xs text-slate-400">
                        Atur akun Master & Admin yang bisa login ke panel ini
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-800 bg-slate-800/30 font-extrabold tracking-wider text-slate-400 uppercase">
                            <tr>
                                <th className="p-4">Nama</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                            {users.map((u) => (
                                <tr
                                    key={u.id}
                                    className="border-slate-800/60 hover:bg-slate-800/30"
                                >
                                    <td className="flex items-center gap-3 p-4 font-bold">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                                            {u.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <span>
                                            {u.name}
                                            {u.id === currentUser?.id && (
                                                <span className="ml-2 text-[10px] text-slate-500">
                                                    (kamu)
                                                </span>
                                            )}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400">
                                        {u.email}
                                    </td>
                                    <td className="p-4">
                                        <span className="rounded border border-blue-500/30 bg-blue-500/15 px-2.5 py-1 text-[10px] font-bold text-blue-400 uppercase">
                                            {u.role.name}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {u.id !== currentUser?.id && (
                                            <button
                                                onClick={() => handleDelete(u)}
                                                className="rounded p-1.5 text-slate-400 hover:bg-red-600/20 hover:text-red-400"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white sm:p-8">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <h3 className="mb-6 text-xl font-bold">
                            Tambah Admin Baru
                        </h3>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 text-xs"
                        >
                            <div>
                                <label className="mb-1 block font-bold text-slate-300">
                                    Nama
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={handleChange('name')}
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
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={handleChange('email')}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-blue-500"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-red-400">
                                        {errors.email[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-bold text-slate-300">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={form.password}
                                    onChange={handleChange('password')}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-blue-500"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-red-400">
                                        {errors.password[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block font-bold text-slate-300">
                                    Role
                                </label>
                                <select
                                    required
                                    value={form.role_id}
                                    onChange={handleChange('role_id')}
                                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-blue-500"
                                >
                                    <option value="" disabled>
                                        Pilih role
                                    </option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.role_id && (
                                    <p className="mt-1 text-red-400">
                                        {errors.role_id[0]}
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
