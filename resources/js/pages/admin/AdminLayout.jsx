import React from 'react';
import {
    Link,
    Navigate,
    Outlet,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Trophy,
    Users,
    Share2,
    ShieldCheck,
    LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/artikel', label: 'Manajemen Berita', icon: FileText },
    { to: '/admin/pertandingan', label: 'Pusat Pertandingan', icon: Trophy },
    { to: '/admin/pemain', label: 'Manajemen Pemain', icon: Users },
    { to: '/admin/social-link', label: 'Tautan Komunitas', icon: Share2 },
];

const MASTER_NAV_ITEM = {
    to: '/admin/akun',
    label: 'Setelan Role',
    icon: ShieldCheck,
};

const PAGE_META = {
    '/admin/dashboard': {
        title: 'Dashboard',
        subtitle: 'Selamat datang kembali',
    },
    '/admin/artikel': {
        title: 'Manajemen Berita',
        subtitle: 'Kelola semua artikel dan konten berita',
    },
    '/admin/pertandingan': {
        title: 'Pusat Pertandingan',
        subtitle: 'Jadwal & hasil pertandingan Chelsea (disinkron otomatis)',
    },
    '/admin/pemain': {
        title: 'Manajemen Pemain',
        subtitle: 'Kelola daftar pemain skuad Chelsea',
    },
    '/admin/social-link': {
        title: 'Tautan Komunitas',
        subtitle: 'Kelola semua platform dan link komunitas Chelind',
    },
    '/admin/akun': {
        title: 'Setelan Role Admin',
        subtitle: 'Kelola akun dan hak akses admin',
    },
};

function resolvePageMeta(pathname) {
    if (pathname.startsWith('/admin/artikel')) {
        return PAGE_META['/admin/artikel'];
    }

    return (
        Object.entries(PAGE_META).find(([prefix]) =>
            pathname.startsWith(prefix),
        )?.[1] || { title: 'Admin', subtitle: '' }
    );
}

export default function AdminLayout() {
    const { user, checking, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    if (checking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#090d16] font-poppins text-sm text-white">
                Memuat...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin" replace state={{ from: location }} />;
    }

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const meta = resolvePageMeta(location.pathname);
    const isMaster = user.role?.name === 'master';

    if (location.pathname.startsWith('/admin/akun') && !isMaster) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const navItems = isMaster ? [...NAV_ITEMS, MASTER_NAV_ITEM] : NAV_ITEMS;

    return (
        <div className="flex min-h-screen flex-col bg-[#090d16] font-poppins text-slate-100 selection:bg-blue-600 selection:text-white md:flex-row">
            <aside className="flex w-full shrink-0 flex-col justify-between border-slate-800/60 bg-[#0e1422] p-6 md:h-screen md:w-64 md:border-r">
                <div>
                    <div className="mb-8 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/30">
                            c
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            chelind
                        </span>
                    </div>

                    <span className="mb-3 block px-3 text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
                        Menu Utama
                    </span>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = location.pathname.startsWith(
                                item.to,
                            );

                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-semibold transition-all ${
                                        active
                                            ? 'border-r-2 border-blue-500 bg-blue-600/15 font-bold text-blue-400'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" /> {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-slate-800/60 pt-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-md">
                            {user.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-xs leading-none font-bold">
                                {user.name}
                            </p>
                            <span className="text-[10px] text-slate-400">
                                {isMaster ? 'Owner' : 'Admin'}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-red-500"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
                <header className="flex items-center justify-between border-b border-slate-800/60 px-6 py-5 sm:px-8">
                    <div>
                        <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                            {meta.title}
                        </h1>
                        <p className="mt-0.5 text-xs text-slate-400">
                            {meta.subtitle}
                        </p>
                    </div>

                    <Link
                        to="/"
                        className="hidden items-center gap-1 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-500 sm:inline-flex"
                    >
                        Lihat Web &rarr;
                    </Link>
                </header>

                <main className="flex-1 space-y-8 p-6 sm:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
