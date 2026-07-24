import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import EditArtikel from './EditArtikel';
import {
  LayoutDashboard,
  FileText,
  Trophy,
  Share2,
  ShieldCheck,
  Sun,
  Moon,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  User,
  LogOut,
  ExternalLink,
  Lock,
  UserCheck
} from 'lucide-react';

// Default Community Links matching Figma Image 2 (Tautan Komunitas / Manajemen Link)
const DEFAULT_COMMUNITY_LINKS = [
  { id: 1, platform: 'WhatsApp', name: 'Grup WhatsApp Chelind Utama', desc: 'Grup diskusi utama komunitas Chelind', url: 'https://chat.whatsapp.com/LqpgBD74aQVDd3tICsvCoG', members: '1,024', status: 'Aktif', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { id: 2, platform: 'Telegram', name: 'Channel Telegram Chelind News', desc: 'Update berita dan transfer Chelsea', url: 'https://t.me/chelind_news', members: '8,320', status: 'Aktif', color: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
  { id: 3, platform: 'Discord', name: 'Discord Server Chelind', desc: 'Server Discord dengan voice chat', url: 'https://discord.gg/chelind', members: '3,150', status: 'Aktif', color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
  { id: 4, platform: 'Twitter', name: 'Twitter / X Chelind', desc: 'Akun Twitter resmi Chelind untuk hot news', url: 'https://twitter.com/chelind', members: '24,600', status: 'Aktif', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  { id: 5, platform: 'Instagram', name: 'Instagram Chelind', desc: 'Konten visual, highlight, infografis', url: 'https://instagram.com/chelind', members: '18,400', status: 'Aktif', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  { id: 6, platform: 'YouTube', name: 'YouTube Chelind TV', desc: 'Video analisis mendalam & highlights', url: 'https://youtube.com/@chelind', members: '9,870', status: 'Nonaktif', color: 'bg-red-500/15 text-red-400 border-red-500/30' },
];

// Default Admin Accounts matching Figma Image 1 & 3 (Role Setting)
const DEFAULT_ADMIN_ROLES = [
  { id: 1, name: 'Admin Chelind', email: 'admin@chelind.id', role: 'Admin', status: 'Aktif', lastActive: 'Hari ini', avatar: 'AC' },
  { id: 2, name: 'Redaksi Utama', email: 'redaksi@chelind.id', role: 'Editor', status: 'Aktif', lastActive: 'Kemarin', avatar: 'RU' },
  { id: 3, name: 'Budi Santoso', email: 'budi@chelind.id', role: 'Moderator', status: 'Aktif', lastActive: '3 hari lalu', avatar: 'BS' },
  { id: 4, name: 'Sari Dewi', email: 'sari@chelind.id', role: 'Editor', status: 'Nonaktif', lastActive: '1 minggu lalu', avatar: 'SD' },
  { id: 5, name: 'Rizky Pratama', email: 'rizky@chelind.id', role: 'Admin', status: 'Aktif', lastActive: '2 hari lalu', avatar: 'RP' },
];

export default function AdminDashboard({ onNavigateBack, onLogout, initialRole = 'owner' }) {
  const { articles, matches, addArticle, updateArticle, deleteArticle, addMatch, updateMatch, deleteMatch } = useData();

  // Role State: 'owner' vs 'admin'
  const [userRole, setUserRole] = useState(initialRole);

  // Active Menu: 'dashboard', 'news', 'matches', 'links', 'roles', 'edit-article'
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Search & Filter States
  const [articleFilter, setArticleFilter] = useState('Semua');
  const [matchFilter, setMatchFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Community Links State
  const [communityLinks, setCommunityLinks] = useState(DEFAULT_COMMUNITY_LINKS);

  // Admin Roles State
  const [adminRoles, setAdminRoles] = useState(DEFAULT_ADMIN_ROLES);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({ name: '', email: '', password: '', role: 'Editor', status: 'Aktif' });

  // Match Modal State (Add & Edit Match)
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [matchForm, setMatchForm] = useState({
    competition: 'PREMIER LEAGUE',
    date: '18 Jul 2026 • 21:00 WIB',
    homeTeam: 'Chelsea',
    homeScore: 3,
    awayTeam: 'Arsenal',
    awayScore: 1,
    status: 'Completed',
    result: 'MENANG',
    venue: 'Stamford Bridge'
  });

  // Dedicated Article Editor State
  const [editingArticleData, setEditingArticleData] = useState(null);

  // Match Modal Trigger
  const handleOpenMatchModal = (m = null) => {
    if (m) {
      setEditingMatch(m);
      setMatchForm({
        competition: m.competition || 'PREMIER LEAGUE',
        date: m.date || '18 Jul 2026 • 21:00 WIB',
        homeTeam: m.homeTeam || 'Chelsea',
        homeScore: m.homeScore ?? 0,
        awayTeam: m.awayTeam || 'Arsenal',
        awayScore: m.awayScore ?? 0,
        status: m.status || 'Upcoming',
        result: m.result || '',
        venue: m.venue || 'Stamford Bridge'
      });
    } else {
      setEditingMatch(null);
      setMatchForm({
        competition: 'PREMIER LEAGUE',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' • 21:00 WIB',
        homeTeam: 'Chelsea',
        homeScore: '-',
        awayTeam: 'Opponent FC',
        awayScore: '-',
        status: 'Upcoming',
        result: '',
        venue: 'Stamford Bridge'
      });
    }
    setShowMatchModal(true);
  };

  const handleSaveMatch = (e) => {
    e.preventDefault();
    if (editingMatch) {
      updateMatch(editingMatch.id, matchForm);
    } else {
      addMatch(matchForm);
    }
    setShowMatchModal(false);
    setEditingMatch(null);
  };

  // Open Article Editor
  const handleOpenEditor = (art = null) => {
    if (art) {
      setEditingArticleData(art);
    } else {
      setEditingArticleData({
        title: '',
        category: 'MATCH REPORT',
        author: userRole === 'owner' ? 'Owner Chelind' : 'Admin Chelind',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'published',
        content: '',
        image: '',
        tags: ['Chelsea', 'Premier League']
      });
    }
    setActiveMenu('edit-article');
  };

  const handleSaveEditedArticle = (savedData) => {
    if (savedData.id) {
      updateArticle(savedData.id, savedData);
    } else {
      addArticle(savedData);
    }
    setActiveMenu('news');
    setEditingArticleData(null);
  };

  const handleToggleLinkStatus = (id) => {
    setCommunityLinks(communityLinks.map(l => (l.id === id ? { ...l, status: l.status === 'Aktif' ? 'Nonaktif' : 'Aktif' } : l)));
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    const newAdmin = {
      id: Date.now(),
      name: newAdminForm.name,
      email: newAdminForm.email,
      role: newAdminForm.role,
      status: newAdminForm.status,
      lastActive: 'Baru saja',
      avatar: newAdminForm.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    };
    setAdminRoles([...adminRoles, newAdmin]);
    setShowAddAdminModal(false);
    setNewAdminForm({ name: '', email: '', password: '', role: 'Editor', status: 'Aktif' });
  };

  const handleDeleteAdmin = (id) => {
    setAdminRoles(adminRoles.filter(a => a.id !== id));
  };

  // Filtered Articles List
  const filteredArticles = articles.filter(a => {
    const matchesFilter = articleFilter === 'Semua' || (articleFilter === 'Published' && a.status === 'published') || (articleFilter === 'Draft' && a.status === 'draft') || (a.category?.toUpperCase() === articleFilter.toUpperCase());
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.author?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filtered Matches List
  const filteredMatches = matches.filter(m => {
    if (matchFilter === 'Upcoming') return m.status === 'Upcoming';
    if (matchFilter === 'Completed') return m.status === 'Completed';
    if (matchFilter === 'Live') return m.status === 'Live';
    return true;
  });

  // Theme Classes
  const t = isDarkMode
    ? {
        bg: 'bg-[#090d16] text-slate-100',
        sidebar: 'bg-[#0e1422] border-slate-800/60',
        navActive: 'bg-blue-600/15 text-blue-400 font-bold border-r-2 border-blue-500',
        navInactive: 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
        card: 'bg-[#121929] border-slate-800/80',
        cardHeader: 'border-slate-800/60',
        subtext: 'text-slate-400',
        tableRow: 'border-slate-800/60 hover:bg-slate-800/30',
        input: 'bg-[#0b101d] border-slate-800 text-white placeholder-slate-500 focus:border-blue-500',
        badge: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
      }
    : {
        bg: 'bg-[#f4f6fa] text-slate-900',
        sidebar: 'bg-white border-slate-200',
        navActive: 'bg-blue-50 text-blue-600 font-bold border-r-2 border-blue-600',
        navInactive: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        card: 'bg-white border-slate-200 shadow-sm',
        cardHeader: 'border-slate-100',
        subtext: 'text-slate-500',
        tableRow: 'border-slate-100 hover:bg-slate-50',
        input: 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600',
        badge: 'bg-blue-50 text-blue-600 border border-blue-200',
      };

  return (
    <div className={`min-h-screen ${t.bg} font-poppins flex flex-col md:flex-row transition-colors duration-300 selection:bg-blue-600 selection:text-white`}>
      {/* LEFT SIDEBAR (Matching Figma Screenshots 1-5 - Sticky Fixed Top Left) */}
      <aside className={`w-full md:w-64 shrink-0 ${t.sidebar} border-r flex flex-col justify-between p-6 z-30 md:sticky md:top-0 md:h-screen overflow-y-auto`}>
        <div>
          {/* Brand Logo - Sticky Pinned Top Left */}
          <div className="sticky top-0 z-20 flex items-center justify-between mb-8 pb-3 pt-1 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-600/30">
                c
              </div>
              <span className="text-xl font-bold tracking-tight">chelind</span>
            </div>

            <button onClick={onNavigateBack} className="md:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs">
              Lihat Web
            </button>
          </div>

          <span className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase block mb-3 px-3">
            MENU UTAMA
          </span>

          {/* Navigation Items (Role Scoped: Admin hides Setelan Role, Owner shows Setelan Role) */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveMenu('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${activeMenu === 'dashboard' ? t.navActive : t.navInactive}`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>

            <button
              onClick={() => setActiveMenu('news')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${(activeMenu === 'news' || activeMenu === 'edit-article') ? t.navActive : t.navInactive}`}
            >
              <FileText className="w-4 h-4" /> Manajemen Berita
            </button>

            <button
              onClick={() => setActiveMenu('matches')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${activeMenu === 'matches' ? t.navActive : t.navInactive}`}
            >
              <Trophy className="w-4 h-4" /> Pusat Pertandingan
            </button>

            <button
              onClick={() => setActiveMenu('links')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${activeMenu === 'links' ? t.navActive : t.navInactive}`}
            >
              <Share2 className="w-4 h-4" /> Tautan Komunitas
            </button>

            {/* SETELAN ROLE ONLY VISIBLE FOR OWNER */}
            {userRole === 'owner' && (
              <button
                onClick={() => setActiveMenu('roles')}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${activeMenu === 'roles' ? t.navActive : t.navInactive}`}
              >
                <ShieldCheck className="w-4 h-4" /> Setelan Role
              </button>
            )}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="pt-6 border-t border-slate-800/60 mt-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
              {userRole === 'owner' ? 'OC' : 'AC'}
            </div>
            <div>
              <p className="text-xs font-bold leading-none">{userRole === 'owner' ? 'Owner Chelind' : 'Admin Chelind'}</p>
              <span className="text-[10px] text-slate-400">{userRole === 'owner' ? 'Owner' : 'Super Admin'}</span>
            </div>
          </div>

          <button onClick={onLogout} title="Logout" className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-white/5 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className={`px-6 sm:px-8 py-5 flex items-center justify-between border-b ${t.cardHeader}`}>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight capitalize">
              {activeMenu === 'dashboard' && `Dashboard ${userRole === 'owner' ? 'Owner' : 'Admin'}`}
              {activeMenu === 'news' && 'Manajemen Berita'}
              {activeMenu === 'matches' && 'Pusat Pertandingan'}
              {activeMenu === 'links' && 'Tautan Komunitas'}
              {activeMenu === 'roles' && 'Setelan Role Admin'}
              {activeMenu === 'edit-article' && 'Edit Artikel'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeMenu === 'dashboard' && `Selamat datang kembali, ${userRole === 'owner' ? 'Owner' : 'Admin'} Chelind`}
              {activeMenu === 'news' && 'Kelola semua artikel dan konten berita'}
              {activeMenu === 'matches' && 'Jadwal, hasil, dan rekap pertandingan Chelsea'}
              {activeMenu === 'links' && 'Kelola semua platform dan link komunitas Chelind'}
              {activeMenu === 'roles' && 'Kelola akun dan hak akses admin'}
              {activeMenu === 'edit-article' && 'Perubahan disimpan otomatis sebagai draft'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Box */}
            <div className="relative hidden lg:block">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-8 pr-4 py-2 rounded-full text-xs ${t.input} border outline-none w-44 focus:w-60 transition-all`}
              />
            </div>

            {/* Dark/Light Mode Switcher */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2.5 rounded-full bg-slate-800/40 hover:bg-slate-800 text-amber-400 transition-colors border border-slate-700/50"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={onNavigateBack}
              className="hidden sm:inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all"
            >
              Lihat Web &rarr;
            </button>
          </div>
        </header>

        {/* MAIN PAGE BODY */}
        <main className="p-6 sm:p-8 space-y-8 flex-1">
          {/* VIEW EDIT ARTIKEL */}
          {activeMenu === 'edit-article' && (
            <EditArtikel
              article={editingArticleData}
              onSave={handleSaveEditedArticle}
              onCancel={() => { setActiveMenu('news'); setEditingArticleData(null); }}
              isDarkMode={isDarkMode}
            />
          )}

          {/* VIEW 1: DASHBOARD OVERVIEW */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className={`${t.card} rounded-2xl p-6 border relative overflow-hidden`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500"><FileText className="w-5 h-5" /></span>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+14 minggu ini</span>
                  </div>
                  <h3 className="text-3xl font-black mb-1">1,284</h3>
                  <p className="text-xs text-slate-400 font-medium">Total Artikel</p>
                </div>

                <div className={`${t.card} rounded-2xl p-6 border relative overflow-hidden`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500"><Eye className="w-5 h-5" /></span>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+2.4k bulan ini</span>
                  </div>
                  <h3 className="text-3xl font-black mb-1">48,320</h3>
                  <p className="text-xs text-slate-400 font-medium">Total Klik Komunitas</p>
                </div>

                <div className={`${t.card} rounded-2xl p-6 border relative overflow-hidden`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500"><CheckCircle2 className="w-5 h-5" /></span>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">76.5% dari total</span>
                  </div>
                  <h3 className="text-3xl font-black mb-1">982</h3>
                  <p className="text-xs text-slate-400 font-medium">Artikel Terpublikasi</p>
                </div>

                <div className={`${t.card} rounded-2xl p-6 border relative overflow-hidden`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500"><FileText className="w-5 h-5" /></span>
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">23.5% dari total</span>
                  </div>
                  <h3 className="text-3xl font-black mb-1">302</h3>
                  <p className="text-xs text-slate-400 font-medium">Draft Menunggu</p>
                </div>
              </div>

              {/* Articles Table */}
              <div className={`${t.card} rounded-2xl border overflow-hidden`}>
                <div className={`p-6 border-b ${t.cardHeader} flex items-center justify-between`}>
                  <div>
                    <h3 className="text-base font-bold">Postingan Berita Terbaru</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{articles.length} artikel ditemukan</p>
                  </div>

                  <button onClick={() => handleOpenEditor()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all">
                    <Plus className="w-4 h-4" /> Tambah Artikel
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/30 text-slate-400 font-extrabold tracking-wider uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-4">JUDUL ARTIKEL</th>
                        <th className="p-4">KATEGORI</th>
                        <th className="p-4">PENULIS</th>
                        <th className="p-4">TANGGAL</th>
                        <th className="p-4">VIEWS</th>
                        <th className="p-4">STATUS</th>
                        <th className="p-4 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {articles.map((art) => (
                        <tr key={art.id} className={t.tableRow}>
                          <td className="p-4 font-bold text-sm max-w-xs truncate">{art.title}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded text-[10px] font-extrabold bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase">
                              {art.category}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400">{art.author || 'Admin Chelind'}</td>
                          <td className="p-4 text-slate-400">{art.date}</td>
                          <td className="p-4 font-mono">12.480</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${art.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                              {art.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleOpenEditor(art)} className="p-1.5 rounded hover:bg-blue-600/20 text-slate-400 hover:text-blue-400">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => deleteArticle(art.id)} className="p-1.5 rounded hover:bg-red-600/20 text-slate-400 hover:text-red-400">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: MANAJEMEN BERITA */}
          {activeMenu === 'news' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className={`${t.card} rounded-2xl p-5 border flex items-center gap-4`}>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold text-lg">{articles.length}</div>
                  <div>
                    <h4 className="text-sm font-bold">Total Artikel</h4>
                    <p className="text-[11px] text-slate-400">Semua artikel terdaftar</p>
                  </div>
                </div>

                <div className={`${t.card} rounded-2xl p-5 border flex items-center gap-4`}>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-lg">{articles.filter(a => a.status === 'published').length}</div>
                  <div>
                    <h4 className="text-sm font-bold">Published</h4>
                    <p className="text-[11px] text-slate-400">Tampil di web</p>
                  </div>
                </div>

                <div className={`${t.card} rounded-2xl p-5 border flex items-center gap-4`}>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-lg">{articles.filter(a => a.status === 'draft').length}</div>
                  <div>
                    <h4 className="text-sm font-bold">Draft</h4>
                    <p className="text-[11px] text-slate-400">Belum dipublikasi</p>
                  </div>
                </div>
              </div>

              <div className={`${t.card} rounded-2xl border overflow-hidden`}>
                <div className={`p-6 border-b ${t.cardHeader} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                  <div className="flex flex-wrap items-center gap-2">
                    {['Semua', 'Published', 'Draft', 'MATCH REPORT', 'TRANSFER NEWS', 'OPINION'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setArticleFilter(tab)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${articleFilter === tab ? 'bg-blue-600 text-white shadow' : 'bg-slate-800/40 text-slate-400 hover:text-white'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <button onClick={() => handleOpenEditor()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all shrink-0">
                    <Plus className="w-4 h-4" /> Tulis Artikel Baru
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/30 text-slate-400 font-extrabold tracking-wider uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-4">JUDUL ARTIKEL</th>
                        <th className="p-4">KATEGORI</th>
                        <th className="p-4">PENULIS</th>
                        <th className="p-4">TANGGAL</th>
                        <th className="p-4">VIEWS</th>
                        <th className="p-4">STATUS</th>
                        <th className="p-4 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {filteredArticles.map((art) => (
                        <tr key={art.id} className={t.tableRow}>
                          <td className="p-4 font-bold text-sm max-w-sm truncate">{art.title}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase">
                              {art.category}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400">{art.author || 'Admin Chelind'}</td>
                          <td className="p-4 text-slate-400">{art.date}</td>
                          <td className="p-4 font-mono">12.480</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${art.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                              {art.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleOpenEditor(art)} className="p-1.5 rounded hover:bg-blue-600/20 text-slate-400 hover:text-blue-400">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => deleteArticle(art.id)} className="p-1.5 rounded hover:bg-red-600/20 text-slate-400 hover:text-red-400">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: PUSAT PERTANDINGAN (FULL CRUD FOR MATCHES) */}
          {activeMenu === 'matches' && (
            <div className="space-y-6">
              {/* Stat Header Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className={`${t.card} rounded-2xl p-5 border flex items-center gap-4`}>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold text-lg">{matches.length}</div>
                  <div>
                    <h4 className="text-sm font-bold">Total Pertandingan</h4>
                    <p className="text-[11px] text-slate-400">Jadwal musim ini</p>
                  </div>
                </div>
                <div className={`${t.card} rounded-2xl p-5 border flex items-center gap-4`}>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-lg">{matches.filter(m => m.status === 'Upcoming').length}</div>
                  <div>
                    <h4 className="text-sm font-bold">Mendatang</h4>
                    <p className="text-[11px] text-slate-400">Laga berikutnya</p>
                  </div>
                </div>
                <div className={`${t.card} rounded-2xl p-5 border flex items-center gap-4`}>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-lg">{matches.filter(m => m.status === 'Completed').length}</div>
                  <div>
                    <h4 className="text-sm font-bold">Selesai</h4>
                    <p className="text-[11px] text-slate-400">Hasil pertandingan</p>
                  </div>
                </div>
              </div>

              {/* Match Schedule Table */}
              <div className={`${t.card} rounded-2xl border overflow-hidden`}>
                <div className={`p-6 border-b ${t.cardHeader} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                  <div className="flex items-center gap-2">
                    {['Semua', 'Upcoming', 'Completed', 'Live'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setMatchFilter(filter)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${matchFilter === filter ? 'bg-blue-600 text-white shadow' : 'bg-slate-800/40 text-slate-400 hover:text-white'}`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleOpenMatchModal()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4" /> Tambah Jadwal
                  </button>
                </div>

                <div className="divide-y divide-slate-800/40">
                  {filteredMatches.map((m) => (
                    <div key={m.id} className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${t.tableRow}`}>
                      <div>
                        <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase block mb-1">
                          {m.competition} • {m.date}
                        </span>
                        <div className="flex items-center gap-4 text-sm font-extrabold text-white">
                          <span>{m.homeTeam}</span>
                          <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-blue-400">{m.homeScore} - {m.awayScore}</span>
                          <span>{m.awayTeam}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${m.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'}`}>
                          {m.status} {m.result && `• ${m.result}`}
                        </span>
                        <span className="text-xs text-slate-400 hidden sm:inline">{m.venue}</span>

                        {/* EDIT & DELETE MATCH BUTTONS */}
                        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
                          <button
                            onClick={() => handleOpenMatchModal(m)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors"
                            title="Edit Jadwal/Skor Laga"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteMatch(m.id)}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white transition-colors"
                            title="Hapus Jadwal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: TAUTAN KOMUNITAS */}
          {activeMenu === 'links' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className={`${t.card} rounded-2xl p-5 border flex items-center gap-4`}>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold text-lg">6</div>
                  <div>
                    <h4 className="text-sm font-bold">Total Platform</h4>
                    <p className="text-[11px] text-slate-400">Platform sosial terhubung</p>
                  </div>
                </div>

                <div className={`${t.card} rounded-2xl p-5 border flex items-center gap-4`}>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-lg">65.364</div>
                  <div>
                    <h4 className="text-sm font-bold">Total Member</h4>
                    <p className="text-[11px] text-slate-400">Total pengikut komunitas</p>
                  </div>
                </div>

                <div className={`${t.card} rounded-2xl p-5 border flex items-center gap-4`}>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-lg">5</div>
                  <div>
                    <h4 className="text-sm font-bold">Link Aktif</h4>
                    <p className="text-[11px] text-slate-400">Tampil di halaman publik</p>
                  </div>
                </div>
              </div>

              <div className={`${t.card} rounded-2xl border overflow-hidden`}>
                <div className={`p-6 border-b ${t.cardHeader} flex items-center justify-between`}>
                  <div>
                    <h3 className="text-base font-bold">Manajemen Tautan Komunitas</h3>
                    <p className="text-xs text-slate-400 mt-0.5">6 platform terdaftar</p>
                  </div>

                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow">
                    <Plus className="w-4 h-4" /> Tambah Tautan
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/30 text-slate-400 font-extrabold tracking-wider uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-4">PLATFORM</th>
                        <th className="p-4">NAMA & DESKRIPSI</th>
                        <th className="p-4">URL TAUTAN</th>
                        <th className="p-4">ANGGOTA</th>
                        <th className="p-4">STATUS</th>
                        <th className="p-4 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {communityLinks.map((l) => (
                        <tr key={l.id} className={t.tableRow}>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold ${l.color}`}>
                              {l.platform}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-white text-xs">{l.name}</p>
                            <p className="text-[10px] text-slate-400">{l.desc}</p>
                          </td>
                          <td className="p-4 font-mono text-[11px] text-blue-400 underline truncate max-w-xs">
                            <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                              {l.url} <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                          <td className="p-4 font-mono font-bold text-white">{l.members}</td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleLinkStatus(l.id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${l.status === 'Aktif' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'}`}
                            >
                              {l.status}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-1.5 rounded hover:bg-blue-600/20 text-slate-400 hover:text-blue-400">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: SETELAN ROLE ADMIN (ONLY FOR OWNER) */}
          {activeMenu === 'roles' && userRole === 'owner' && (
            <div className="space-y-6">
              <div className={`${t.card} rounded-2xl border overflow-hidden`}>
                <div className={`p-6 border-b ${t.cardHeader} flex items-center justify-between`}>
                  <div>
                    <h3 className="text-base font-bold">Daftar Akun Admin</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{adminRoles.length} akun terdaftar</p>
                  </div>

                  <button
                    onClick={() => setShowAddAdminModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow transition-all"
                  >
                    <Plus className="w-4 h-4" /> Tambah Admin
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/30 text-slate-400 font-extrabold tracking-wider uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-4">NAMA ADMIN</th>
                        <th className="p-4">EMAIL</th>
                        <th className="p-4">ROLE</th>
                        <th className="p-4">STATUS</th>
                        <th className="p-4">TERAKHIR AKTIF</th>
                        <th className="p-4 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {adminRoles.map((a) => (
                        <tr key={a.id} className={t.tableRow}>
                          <td className="p-4 font-bold flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs">
                              {a.avatar}
                            </div>
                            <span>{a.name}</span>
                          </td>
                          <td className="p-4 text-slate-400">{a.email}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                              {a.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${a.status === 'Aktif' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400">{a.lastActive}</td>
                          <td className="p-4 text-right">
                            <button onClick={() => handleDeleteAdmin(a.id)} className="p-1.5 rounded hover:bg-red-600/20 text-slate-400 hover:text-red-400">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL TAMBAH / EDIT MATCH (PUSAT PERTANDINGAN CRUD) */}
      {showMatchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 sm:p-8 relative text-white">
            <button onClick={() => setShowMatchModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6">
              {editingMatch ? 'Edit Jadwal Pertandingan' : 'Tambah Jadwal Pertandingan Baru'}
            </h3>

            <form onSubmit={handleSaveMatch} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Kompetisi</label>
                <input
                  type="text"
                  required
                  value={matchForm.competition}
                  onChange={(e) => setMatchForm({ ...matchForm, competition: e.target.value })}
                  placeholder="PREMIER LEAGUE / UEFA CHAMPIONS LEAGUE"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Tanggal & Waktu Kick-Off</label>
                <input
                  type="text"
                  required
                  value={matchForm.date}
                  onChange={(e) => setMatchForm({ ...matchForm, date: e.target.value })}
                  placeholder="18 Jul 2026 • 21:00 WIB"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tim Tuan Rumah (Home)</label>
                  <input
                    type="text"
                    required
                    value={matchForm.homeTeam}
                    onChange={(e) => setMatchForm({ ...matchForm, homeTeam: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Skor Home</label>
                  <input
                    type="text"
                    value={matchForm.homeScore}
                    onChange={(e) => setMatchForm({ ...matchForm, homeScore: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tim Tamu (Away)</label>
                  <input
                    type="text"
                    required
                    value={matchForm.awayTeam}
                    onChange={(e) => setMatchForm({ ...matchForm, awayTeam: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Skor Away</label>
                  <input
                    type="text"
                    value={matchForm.awayScore}
                    onChange={(e) => setMatchForm({ ...matchForm, awayScore: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Status Laga</label>
                  <select
                    value={matchForm.status}
                    onChange={(e) => setMatchForm({ ...matchForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Live">Live</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Hasil (Result)</label>
                  <select
                    value={matchForm.result}
                    onChange={(e) => setMatchForm({ ...matchForm, result: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  >
                    <option value="">(Belum Ada / Upcoming)</option>
                    <option value="MENANG">MENANG</option>
                    <option value="IMBANG">IMBANG</option>
                    <option value="KALAH">KALAH</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Stadion / Venue</label>
                <input
                  type="text"
                  required
                  value={matchForm.venue}
                  onChange={(e) => setMatchForm({ ...matchForm, venue: e.target.value })}
                  placeholder="Stamford Bridge"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowMatchModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold shadow">
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH ADMIN (DILENGKAPI INPUT PASSWORD & DATA LENGKAP) */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 sm:p-8 relative text-white">
            <button onClick={() => setShowAddAdminModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6">Tambah Akun Admin Baru</h3>

            <form onSubmit={handleAddAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nama Admin</label>
                <input
                  type="text"
                  required
                  value={newAdminForm.name}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                  placeholder="Contoh: Andi Pratama"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newAdminForm.email}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                  placeholder="andi@chelind.id"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newAdminForm.password}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                  placeholder="Ketik password untuk admin..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Role</label>
                  <select
                    value={newAdminForm.role}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Moderator">Moderator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Status</label>
                  <select
                    value={newAdminForm.status}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button type="button" onClick={() => setShowAddAdminModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold shadow">
                  Simpan Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
