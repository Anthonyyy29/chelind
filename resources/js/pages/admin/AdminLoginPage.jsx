import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ email, password });
            navigate('/admin/dashboard');
        } catch (err) {
            const message =
                err.response?.data?.errors?.email?.[0] ||
                err.response?.data?.message ||
                'Login gagal, coba lagi.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#000e38] p-4 font-poppins text-white">
            <svg
                className="pointer-events-none absolute top-0 right-0 z-0 h-[90%] w-[55%] text-blue-600/90"
                viewBox="0 0 500 500"
                preserveAspectRatio="none"
                fill="currentColor"
            >
                <path d="M150,0 C300,120 280,320 500,420 L500,0 Z" />
            </svg>
            <svg
                className="pointer-events-none absolute bottom-0 left-0 z-0 h-[70%] w-[50%] text-blue-600/80"
                viewBox="0 0 500 500"
                preserveAspectRatio="none"
                fill="currentColor"
            >
                <path d="M0,500 L0,150 C180,180 220,380 500,500 Z" />
            </svg>

            <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center text-center">
                <div className="mb-8">
                    <img
                        src="/assets/logo-chelindo-white.png"
                        alt="Chelindo"
                        className="mx-auto h-12 w-auto sm:h-14"
                    />
                    <span className="mt-2 block text-[11px] font-bold tracking-widest text-blue-300 uppercase">
                        Portal Akses Owner & Admin
                    </span>
                </div>

                {error && (
                    <div className="mb-6 flex w-full items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/20 px-4 py-3 text-xs text-red-200">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-sm space-y-4"
                >
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-300">
                            <User className="h-4 w-4" />
                        </div>
                        <input
                            type="email"
                            required
                            placeholder="EMAIL"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-blue-400/40 bg-[#00144d]/80 py-3.5 pr-4 pl-11 text-xs font-semibold tracking-wider text-white uppercase placeholder-slate-400 transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-300">
                            <Lock className="h-4 w-4" />
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="PASSWORD"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-blue-400/40 bg-[#00144d]/80 py-3.5 pr-4 pl-11 text-xs font-semibold tracking-wider text-white uppercase placeholder-slate-400 transition-all focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 w-full rounded-lg bg-white py-3.5 text-xs font-extrabold tracking-wider text-[#00144d] uppercase shadow-xl transition-all duration-200 active:scale-[0.99] disabled:opacity-75"
                    >
                        {loading ? 'Memproses...' : 'Login Dashboard'}
                    </button>

                    <div className="flex items-center justify-center pt-2 text-xs">
                        <a href="/" className="text-slate-400 hover:text-white">
                            &larr; Kembali ke Website
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
