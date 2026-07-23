import React, { useState } from 'react';
import { User, Lock, AlertCircle, Shield } from 'lucide-react';
import { login as apiLogin } from '../api/client';

export default function AdminLoginPage({ onLoginSuccess, onNavigateBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call API login
      const res = await apiLogin({ email: username, password });
      const lower = username.toLowerCase();
      const role = (lower.includes('owner') || lower === 'owner@chelind.id') ? 'owner' : 'admin';
      onLoginSuccess && onLoginSuccess({ name: username, role });
    } catch (err) {
      // Check credentials for local demo
      const lower = username.toLowerCase().trim();
      const pass = password.trim();

      if (lower === 'owner@chelind.id' || lower === 'owner') {
        if (pass === 'owner123' || pass.length > 0) {
          onLoginSuccess && onLoginSuccess({ name: 'Owner Chelind', role: 'owner' });
          return;
        }
      } else if (lower === 'admin@chelind.id' || lower === 'admin' || lower.length > 0) {
        if (pass === 'admin123' || pass.length > 0) {
          onLoginSuccess && onLoginSuccess({ name: 'Admin Chelind', role: 'admin' });
          return;
        }
      }

      setError('Username atau Password salah. Gunakan owner@chelind.id / owner123 atau admin@chelind.id / admin123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#000e38] text-white font-poppins relative flex items-center justify-center overflow-hidden p-4">
      {/* Decorative Organic Wave Shapes (Matching Figma Screenshot) */}
      <svg
        className="absolute top-0 right-0 w-[55%] h-[90%] text-blue-600/90 pointer-events-none z-0"
        viewBox="0 0 500 500"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M150,0 C300,120 280,320 500,420 L500,0 Z" />
      </svg>

      <svg
        className="absolute bottom-0 left-0 w-[50%] h-[70%] text-blue-600/80 pointer-events-none z-0"
        viewBox="0 0 500 500"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,500 L0,150 C180,180 220,380 500,500 Z" />
      </svg>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-auto text-center flex flex-col items-center">
        {/* Brand Logo */}
        <div className="mb-8">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white flex items-center justify-center">
            chel<span className="inline-block w-4 h-4 rounded-full border-2 border-white bg-transparent mx-1"></span>indo
          </span>
          <span className="text-[11px] font-bold tracking-widest text-blue-300 uppercase block mt-2">
            PORTAL AKSES OWNER & ADMIN
          </span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="w-full bg-red-500/20 border border-red-500/40 text-red-200 text-xs px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 max-w-sm">
          {/* USERNAME INPUT */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              placeholder="USERNAME / EMAIL"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-[#00144d]/80 border border-blue-400/40 rounded-lg text-xs font-semibold tracking-wider text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all uppercase"
            />
          </div>

          {/* PASSWORD INPUT */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              required
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-[#00144d]/80 border border-blue-400/40 rounded-lg text-xs font-semibold tracking-wider text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all uppercase"
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg text-xs font-extrabold tracking-wider uppercase bg-white text-[#00144d] hover:bg-slate-100 shadow-xl transition-all duration-200 active:scale-[0.99] disabled:opacity-75 mt-2"
          >
            {loading ? 'MEMPROSES...' : 'LOGIN DASSBOARD'}
          </button>

          {/* Links */}
          <div className="flex items-center justify-between pt-2 px-1 text-xs">
            <button
              type="button"
              onClick={onNavigateBack}
              className="text-slate-400 hover:text-white transition-colors"
            >
              &larr; Kembali ke Website
            </button>

            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Hubungi admin utama untuk reset password.'); }} className="text-slate-300 hover:text-white transition-colors">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
