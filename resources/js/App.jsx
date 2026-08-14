import React, { useEffect } from 'react';
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useLocation,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import MatchdayPage from './pages/MatchdayPage';
import TransferPage from './pages/TransferPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import ArticleListPage from './pages/admin/ArticleListPage';
import ArticleEditorPage from './pages/admin/ArticleEditorPage';
import MatchAdminPage from './pages/admin/MatchAdminPage';
import TransferAdminPage from './pages/admin/TransferAdminPage';
import PlayerAdminPage from './pages/admin/PlayerAdminPage';
import SocialLinkAdminPage from './pages/admin/SocialLinkAdminPage';
import AccountAdminPage from './pages/admin/AccountAdminPage';

// React Router SPA tidak me-reset posisi scroll saat pindah route —
// tanpa ini, halaman baru terbuka di posisi scroll halaman sebelumnya.
// Pakai location.key (bukan pathname) karena key selalu unik tiap
// navigasi baru — termasuk klik Link ke path yang sama persis dengan
// yang sedang aktif, yang mana pathname-nya tidak "berubah" sama sekali.
function ScrollToTop() {
    const { key } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [key]);

    return null;
}

function AdminEntry() {
    const { user, checking } = useAuth();

    if (checking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#000e38] font-poppins text-sm text-white">
                Memuat...
            </div>
        );
    }

    return user ? (
        <Navigate to="/admin/dashboard" replace />
    ) : (
        <AdminLoginPage />
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/berita" element={<NewsPage />} />
                    <Route
                        path="/berita/:slug"
                        element={<ArticleDetailPage />}
                    />
                    <Route path="/matchday" element={<MatchdayPage />} />
                    <Route path="/transfer" element={<TransferPage />} />

                    <Route path="/admin">
                        <Route index element={<AdminEntry />} />
                        <Route element={<AdminLayout />}>
                            <Route
                                path="dashboard"
                                element={<AdminDashboardHome />}
                            />
                            <Route
                                path="artikel"
                                element={<ArticleListPage />}
                            />
                            <Route
                                path="artikel/baru"
                                element={<ArticleEditorPage />}
                            />
                            <Route
                                path="artikel/:id/edit"
                                element={<ArticleEditorPage />}
                            />
                            <Route
                                path="pertandingan"
                                element={<MatchAdminPage />}
                            />
                            <Route
                                path="transfer"
                                element={<TransferAdminPage />}
                            />
                            <Route
                                path="pemain"
                                element={<PlayerAdminPage />}
                            />
                            <Route
                                path="social-link"
                                element={<SocialLinkAdminPage />}
                            />
                            <Route path="akun" element={<AccountAdminPage />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
