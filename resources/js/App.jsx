import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import MatchdayPage from './pages/MatchdayPage';
import KomunitasPage from './pages/KomunitasPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import ArticleListPage from './pages/admin/ArticleListPage';
import ArticleEditorPage from './pages/admin/ArticleEditorPage';
import MatchAdminPage from './pages/admin/MatchAdminPage';
import PlayerAdminPage from './pages/admin/PlayerAdminPage';
import SocialLinkAdminPage from './pages/admin/SocialLinkAdminPage';

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
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/berita" element={<NewsPage />} />
                    <Route
                        path="/berita/:slug"
                        element={<ArticleDetailPage />}
                    />
                    <Route path="/matchday" element={<MatchdayPage />} />
                    <Route path="/komunitas" element={<KomunitasPage />} />

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
                                path="pemain"
                                element={<PlayerAdminPage />}
                            />
                            <Route
                                path="social-link"
                                element={<SocialLinkAdminPage />}
                            />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
