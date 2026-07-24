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
  UserCheck,
  Users,
  Flag,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

// Default Community Links matching Figma Image 2
const DEFAULT_COMMUNITY_LINKS = [
  { id: 1, platform: 'WhatsApp', name: 'Grup WhatsApp Chelind Utama', desc: 'Grup diskusi utama komunitas Chelind', url: 'https://chat.whatsapp.com/LqpgBD74aQVDd3tICsvCoG', members: '1,024', status: 'Aktif', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  { id: 2, platform: 'Telegram', name: 'Channel Telegram Chelind News', desc: 'Update berita dan transfer Chelsea', url: 'https://t.me/chelind_news', members: '8,320', status: 'Aktif', color: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
  { id: 3, platform: 'Discord', name: 'Discord Server Chelind', desc: 'Server Discord dengan voice chat', url: 'https://discord.gg/chelind', members: '3,150', status: 'Aktif', color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
  { id: 4, platform: 'Twitter', name: 'Twitter / X Chelind', desc: 'Akun Twitter resmi Chelind untuk hot news', url: 'https://twitter.com/chelind', members: '24,600', status: 'Aktif', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  { id: 5, platform: 'Instagram', name: 'Instagram Chelind', desc: 'Konten visual, highlight, infografis', url: 'https://instagram.com/chelind', members: '18,400', status: 'Aktif', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  { id: 6, platform: 'YouTube', name: 'YouTube Chelind TV', desc: 'Video analisis mendalam & highlights', url: 'https://youtube.com/@chelind', members: '9,870', status: 'Nonaktif', color: 'bg-red-500/15 text-red-400 border-red-500/30' },
];

// Default Admin Accounts
const DEFAULT_ADMIN_ROLES = [
  { id: 1, name: 'Admin Chelind', email: 'admin@chelind.id', role: 'Admin', status: 'Aktif', lastActive: 'Hari ini', avatar: 'AC' },
  { id: 2, name: 'Redaksi Utama', email: 'redaksi@chelind.id', role: 'Editor', status: 'Aktif', lastActive: 'Kemarin', avatar: 'RU' },
  { id: 3, name: 'Budi Santoso', email: 'budi@chelind.id', role: 'Moderator', status: 'Aktif', lastActive: '3 hari lalu', avatar: 'BS' },
  { id: 4, name: 'Sari Dewi', email: 'sari@chelind.id', role: 'Editor', status: 'Nonaktif', lastActive: '1 minggu lalu', avatar: 'SD' },
  { id: 5, name: 'Rizky Pratama', email: 'rizky@chelind.id', role: 'Admin', status: 'Aktif', lastActive: '2 hari lalu', avatar: 'RP' },
];

const PRESET_FLAGS = [
  { code: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', label: 'Inggris' },
  { code: '🇩🇰', label: 'Denmark' },
  { code: '🇧🇷', label: 'Brasil' },
  { code: '🇦🇷', label: 'Argentina' },
  { code: '🇫🇷', label: 'Prancis' },
  { code: '🇪🇸', label: 'Spanyol' },
  { code: '🇮🇩', label: 'Indonesia' },
  { code: '🇵🇹', label: 'Portugal' },
  { code: '🇳🇬', label: 'Nigeria' },
  { code: '🇸🇳', label: 'Senegal' },
];

export default function AdminDashboard({ onNavigateBack, onLogout, initialRole = 'owner' }) {
  const {
    articles,
    matches,
    players,
    addArticle,
    updateArticle,
    deleteArticle,
    addMatch,
    updateMatch,
    deleteMatch,
    addPlayer,
    updatePlayer,
    deletePlayer,
  } = useData();

  // Role State: 'owner' vs 'admin'
  const [userRole, setUserRole] = useState(initialRole);

  // Active Menu: 'dashboard', 'news', 'matches', 'players', 'links', 'roles', 'edit-article'
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Search & Filter States
  const [articleFilter, setArticleFilter] = useState('Semua');
  const [matchFilter, setMatchFilter] = useState('Semua');
  const [playerFilter, setPlayerFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Community Links State
  const [communityLinks, setCommunityLinks] = useState(DEFAULT_COMMUNITY_LINKS);

  // Admin Roles State
  const [adminRoles, setAdminRoles] = useState(DEFAULT_ADMIN_ROLES);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({ name: '', email: '', password: '', role: 'Editor', status: 'Aktif' });

  // Match Modal State
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
    venue: 'Stamford Bridge',
  });

  // Player Modal State (Add & Edit Squad Players + Flag Upload)
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [playerForm, setPlayerForm] = useState({
    name: '',
    number: '',
    position: 'Attacking Midfielder',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    flagUrl: '',
    image: '',
  });

  // Editing Article Data
  const [editingArticleData, setEditingArticleData] = useState(null);

  // Filtered Lists
  const filteredArticles = articles.filter((a) => {
    const matchesFilter = articleFilter === 'Semua' || a.category === articleFilter || a.status === articleFilter.toLowerCase();
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredMatches = matches.filter((m) => {
    const matchesFilter = matchFilter === 'Semua' || m.status === matchFilter;
    const matchesSearch = `${m.homeTeam} ${m.awayTeam} ${m.competition}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredPlayers = (players || []).filter((p) => {
    const matchesFilter = playerFilter === 'Semua' || p.position === playerFilter;
    const matchesSearch = `${p.name} ${p.number} ${p.position}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Match Handlers
  const handleOpenAddMatch = () => {
    setEditingMatch(null);
    setMatchForm({
      competition: 'PREMIER LEAGUE',
      date: '18 Jul 2026 • 21:00 WIB',
      homeTeam: 'Chelsea',
      homeScore: 3,
      awayTeam: 'Arsenal',
      awayScore: 1,
      status: 'Completed',
      result: 'MENANG',
      venue: 'Stamford Bridge',
    });
    setShowMatchModal(true);
  };

  const handleOpenEditMatch = (match) => {
    setEditingMatch(match);
    setMatchForm({ ...match });
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
  };

  // Player Handlers
  const handleOpenAddPlayer = () => {
    setEditingPlayer(null);
    setPlayerForm({
      name: '',
      number: '',
      position: 'Attacking Midfielder',
      flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      flagUrl: '',
      image: '',
    });
    setShowPlayerModal(true);
  };

  const handleOpenEditPlayer = (player) => {
    setEditingPlayer(player);
    setPlayerForm({
      name: player.name || '',
      number: player.number || '',
      position: player.position || 'Attacking Midfielder',
      flag: player.flag || '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      flagUrl: player.flagUrl || '',
      image: player.image || '',
    });
    setShowPlayerModal(true);
  };

  const handleSavePlayer = (e) => {
    e.preventDefault();
    if (!playerForm.name || !playerForm.number) return;
    const payload = {
      ...playerForm,
      number: parseInt(playerForm.number, 10),
    };
    if (editingPlayer) {
      updatePlayer(editingPlayer.id, payload);
    } else {
      addPlayer(payload);
    }
    setShowPlayerModal(false);
  };

  const handleFlagImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlayerForm((prev) => ({ ...prev, flagUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlayerPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlayerForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Article Handlers
  const handleOpenEditor = (article = null) => {
    setEditingArticleData(article);
    setActiveMenu('edit-article');
  };

  const handleSaveEditedArticle = (updatedArticle) => {
    if (updatedArticle.id) {
      updateArticle(updatedArticle.id, updatedArticle);
    } else {
      addArticle(updatedArticle);
    }
    setActiveMenu('news');
    setEditingArticleData(null);
  };

  // Admin Role Handlers
  const handleCreateAdmin = (e) => {
    e.preventDefault();
    if (!newAdminForm.name || !newAdminForm.email || !newAdminForm.password) return;
    const newAdmin = {
      id: Date.now(),
      name: newAdminForm.name,
      email: newAdminForm.email,
      role: newAdminForm.role,
      status: newAdminForm.status,
      lastActive: 'Baru saja',
      avatar: newAdminForm.name.slice(0, 2).toUpperCase(),
    };
    setAdminRoles([...adminRoles, newAdmin]);
    setShowAddAdminModal(false);
    setNewAdminForm({ name: '', email: '', password: '', role: 'Editor', status: 'Aktif' });
  };

  const handleDeleteAdmin = (id) => {
    setAdminRoles(adminRoles.filter((a) => a.id !== id));
  };

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
      {/* LEFT SIDEBAR - Sticky Fixed Top Left */}
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

          {/* Navigation Items */}
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
              onClick={() => setActiveMenu('players')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${activeMenu === 'players' ? t.navActive : t.navInactive}`}
            >
              <Users className="w-4 h-4" /> Manajemen Pemain
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
              {activeMenu === 'players' && 'Manajemen Pemain Skuad Chelsea'}
              {activeMenu === 'links' && 'Tautan Komunitas'}
              {activeMenu === 'roles' && 'Setelan Role Admin'}
              {activeMenu === 'edit-article' && 'Edit Artikel'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeMenu === 'dashboard' && `Selamat datang kembali, ${userRole === 'owner' ? 'Owner' : 'Admin'} Chelind`}
              {activeMenu === 'news' && 'Kelola semua artikel dan konten berita'}
              {activeMenu === 'matches' && 'Jadwal, hasil, dan rekap pertandingan Chelsea'}
              {activeMenu === 'players' && 'Kelola daftar pemain, nomor punggung, dan bendera negara'}
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
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className={`${t.card} p-5 rounded-2xl border flex items-center gap-4`}>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Total Artikel</span>
                    <h3 className="text-2xl font-black">{articles.length}</h3>
                  </div>
                </div>

                <div className={`${t.card} p-5 rounded-2xl border flex items-center gap-4`}>
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium font-medium">Pertandingan</span>
                    <h3 className="text-2xl font-black">{matches.length}</h3>
                  </div>
                </div>

                <div className={`${t.card} p-5 rounded-2xl border flex items-center gap-4`}>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Pemain Skuad</span>
                    <h3 className="text-2xl font-black">{(players || []).length}</h3>
                  </div>
                </div>

                <div className={`${t.card} p-5 rounded-2xl border flex items-center gap-4`}>
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Media Sosial</span>
                    <h3 className="text-2xl font-black">{communityLinks.length}</h3>
                  </div>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => handleOpenEditor()} className={`${t.card} p-6 rounded-2xl border cursor-pointer hover:border-blue-500 transition-all group`}>
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold mb-1">Tulis Artikel Baru</h3>
                  <p className="text-xs text-slate-400">Buat berita, laporan pertandingan, atau transfer news baru.</p>
                </div>

                <div onClick={() => handleOpenAddMatch()} className={`${t.card} p-6 rounded-2xl border cursor-pointer hover:border-amber-500 transition-all group`}>
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold mb-1">Tambah Jadwal Laga</h3>
                  <p className="text-xs text-slate-400">Input jadwal pertandingan mendatang atau hasil skor Chelsea.</p>
                </div>

                <div onClick={() => handleOpenAddPlayer()} className={`${t.card} p-6 rounded-2xl border cursor-pointer hover:border-emerald-500 transition-all group`}>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold mb-1">Tambah Pemain Skuad</h3>
                  <p className="text-xs text-slate-400">Kelola pemain Chelsea, nomor punggung, dan bendera negara.</p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: MANAJEMEN BERITA */}
          {activeMenu === 'news' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`${t.card} rounded-2xl p-5 border flex items-center gap-4`}>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold text-lg">{articles.length}</div>
                  <div>
                    <h4 className="text-sm font-bold">Total Artikel</h4>
                    <p className="text-[11px] text-slate-400">Telah dibuat</p>
                  </div>
                </div>
                <div className={`${t.card} rounded-2xl p-5 border flex items-center gap-4`}>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-lg">{articles.filter(a => a.status === 'published').length}</div>
                  <div>
                    <h4 className="text-sm font-bold">Published</h4>
                    <p className="text-[11px] text-slate-400">Tayang di website</p>
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

          {/* VIEW 3: PUSAT PERTANDINGAN */}
          {activeMenu === 'matches' && (
            <div className="space-y-6">
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

              <div className={`${t.card} rounded-2xl border overflow-hidden`}>
                <div className={`p-6 border-b ${t.cardHeader} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                  <div className="flex flex-wrap items-center gap-2">
                    {['Semua', 'Upcoming', 'Completed'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setMatchFilter(tab)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${matchFilter === tab ? 'bg-blue-600 text-white shadow' : 'bg-slate-800/40 text-slate-400 hover:text-white'}`}
                      >
                        {tab === 'Upcoming' ? 'Jadwal Mendatang' : tab === 'Completed' ? 'Hasil Laga' : 'Semua Laga'}
                      </button>
                    ))}
                  </div>

                  <button onClick={handleOpenAddMatch} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all shrink-0">
                    <Plus className="w-4 h-4" /> Tambah Jadwal Baru
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/30 text-slate-400 font-extrabold tracking-wider uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-4">KOMPETISI</th>
                        <th className="p-4">PERTANDINGAN (HOME VS AWAY)</th>
                        <th className="p-4">SKOR</th>
                        <th className="p-4">STADION / VENUE</th>
                        <th className="p-4">STATUS</th>
                        <th className="p-4 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {filteredMatches.map((m) => (
                        <tr key={m.id} className={t.tableRow}>
                          <td className="p-4 font-bold text-blue-400">{m.competition}</td>
                          <td className="p-4 font-bold text-sm">
                            {m.homeTeam} <span className="text-slate-500 font-normal">vs</span> {m.awayTeam}
                          </td>
                          <td className="p-4 font-mono font-bold text-sm text-amber-400">
                            {m.homeScore} - {m.awayScore}
                          </td>
                          <td className="p-4 text-slate-400">{m.venue}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${m.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'}`}>
                              {m.status === 'Completed' ? 'Selesai' : 'Mendatang'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleOpenEditMatch(m)} className="p-1.5 rounded hover:bg-blue-600/20 text-slate-400 hover:text-blue-400">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => deleteMatch(m.id)} className="p-1.5 rounded hover:bg-red-600/20 text-slate-400 hover:text-red-400">
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

          {/* VIEW 4: MANAJEMEN PEMAIN (SQUAD PLAYERS & BENDERA NEGARA CRUD) */}
          {activeMenu === 'players' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {['Semua', 'Goalkeeper', 'Defender', 'Attacking Midfielder', 'Central Midfielder', 'Forward', 'Striker'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setPlayerFilter(tab)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${playerFilter === tab ? 'bg-blue-600 text-white shadow' : 'bg-slate-800/40 text-slate-400 hover:text-white'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleOpenAddPlayer}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" /> Tambah Pemain Baru
                </button>
              </div>

              {/* Grid Player Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPlayers.map((player) => (
                  <div
                    key={player.id}
                    className={`${t.card} rounded-2xl overflow-hidden border flex flex-col group relative`}
                  >
                    {/* Player Image & Overlay Badge */}
                    <div className="aspect-[3/4] relative overflow-hidden bg-slate-950">
                      <img
                        src={player.image || 'assets/news/cole palmer.jpg'}
                        alt={player.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Top Left: Shirt Number */}
                      <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow">
                        {player.number}
                      </span>

                      {/* Top Right: Country Flag Badge (Uploaded Flag or Emoji) */}
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/20 shadow flex items-center justify-center">
                        {player.flagUrl ? (
                          <img src={player.flagUrl} alt="Bendera" className="w-5 h-3.5 object-cover rounded-sm" />
                        ) : (
                          <span className="text-base leading-none">{player.flag || '🏴󠁧󠁢󠁥󠁮󠁧󠁿'}</span>
                        )}
                      </div>
                    </div>

                    {/* Player Details */}
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider block mb-1">
                          {player.position}
                        </span>
                        <h3 className="text-base font-bold text-white leading-tight mb-4">
                          {player.name}
                        </h3>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditPlayer(player)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => deletePlayer(player.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 5: TAUTAN KOMUNITAS */}
          {activeMenu === 'links' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {communityLinks.map((link) => (
                  <div key={link.id} className={`${t.card} p-6 rounded-2xl border space-y-4`}>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${link.color}`}>
                        {link.platform}
                      </span>
                      <span className={`text-[10px] font-bold ${link.status === 'Aktif' ? 'text-emerald-400' : 'text-slate-500'}`}>
                        ● {link.status}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold">{link.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">{link.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono">{link.members} Anggota</span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                      >
                        Buka <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 6: SETELAN ROLE ADMIN (OWNER ONLY) */}
          {activeMenu === 'roles' && userRole === 'owner' && (
            <div className="space-y-6">
              <div className={`${t.card} rounded-2xl border overflow-hidden`}>
                <div className={`p-6 border-b ${t.cardHeader} flex items-center justify-between`}>
                  <div>
                    <h3 className="text-base font-bold">Daftar Akun Pengelola Chelind</h3>
                    <p className="text-xs text-slate-400">Atur hak akses dan buat akun admin/editor baru</p>
                  </div>

                  <button
                    onClick={() => setShowAddAdminModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all"
                  >
                    <UserCheck className="w-4 h-4" /> Tambah Admin Baru
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/30 text-slate-400 font-extrabold tracking-wider uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-4">NAMA PENGELOLA</th>
                        <th className="p-4">EMAIL</th>
                        <th className="p-4">ROLE HAK AKSES</th>
                        <th className="p-4">STATUS</th>
                        <th className="p-4">TERAKHIR AKTIF</th>
                        <th className="p-4 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {adminRoles.map((a) => (
                        <tr key={a.id} className={t.tableRow}>
                          <td className="p-4 font-bold flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
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

      {/* MODAL TAMBAH / EDIT PEMAIN SKUAD & BENDERA NEGARA */}
      {showPlayerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 sm:p-8 relative text-white max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowPlayerModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6">
              {editingPlayer ? 'Edit Data Pemain Chelsea' : 'Tambah Pemain Baru'}
            </h3>

            <form onSubmit={handleSavePlayer} className="space-y-5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nama Pemain</label>
                <input
                  type="text"
                  required
                  value={playerForm.name}
                  onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })}
                  placeholder="Misal: Cole Palmer / Reece James / Enzo Fernandez"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Nomor Punggung (#)</label>
                  <input
                    type="number"
                    required
                    value={playerForm.number}
                    onChange={(e) => setPlayerForm({ ...playerForm, number: e.target.value })}
                    placeholder="20"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Posisi Pemain</label>
                  <select
                    value={playerForm.position}
                    onChange={(e) => setPlayerForm({ ...playerForm, position: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  >
                    <option value="Goalkeeper">Goalkeeper</option>
                    <option value="Defender">Defender</option>
                    <option value="Attacking Midfielder">Attacking Midfielder</option>
                    <option value="Central Midfielder">Central Midfielder</option>
                    <option value="Forward">Forward</option>
                    <option value="Striker">Striker</option>
                  </select>
                </div>
              </div>

              {/* BENDERA NEGARA SECTION (IMAGE UPLOAD + EMOJI SELECTOR) */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Flag className="w-4 h-4 text-blue-400" /> Bendera Negara Pemain
                  </label>
                  <span className="text-[10px] text-slate-400">Tampil di pojok kanan kartu</span>
                </div>

                {/* Preset Emoji Picker */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-2">Pilih Bendera Cepat:</span>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_FLAGS.map((f) => (
                      <button
                        type="button"
                        key={f.code}
                        onClick={() => setPlayerForm({ ...playerForm, flag: f.code, flagUrl: '' })}
                        className={`px-2.5 py-1 rounded-lg border text-sm flex items-center gap-1 transition-all ${
                          playerForm.flag === f.code && !playerForm.flagUrl
                            ? 'bg-blue-600/30 border-blue-500 text-white shadow'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{f.code}</span> <span className="text-[10px]">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Upload Flag Image */}
                <div className="pt-2 border-t border-slate-800/80">
                  <label className="block text-[11px] text-slate-300 font-bold mb-1.5">
                    Atau Unggah Gambar Bendera Sendiri (PNG/JPG/SVG):
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-2 text-slate-200 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-blue-400" /> Unggah Bendera
                      <input type="file" accept="image/*" onChange={handleFlagImageUpload} className="hidden" />
                    </label>

                    {playerForm.flagUrl ? (
                      <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                        <img src={playerForm.flagUrl} alt="Preview" className="w-6 h-4 object-cover rounded-sm" />
                        <span className="text-[10px] text-emerald-400 font-bold">Terpasang</span>
                        <button
                          type="button"
                          onClick={() => setPlayerForm({ ...playerForm, flagUrl: '' })}
                          className="text-slate-400 hover:text-red-400 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        Aktif: <span className="text-base">{playerForm.flag || '🏴󠁧󠁢󠁥󠁮󠁧󠁿'}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* FOTO PEMAIN SECTION */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Foto Pemain (URL atau Unggah File)</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={playerForm.image}
                    onChange={(e) => setPlayerForm({ ...playerForm, image: e.target.value })}
                    placeholder="assets/news/cole palmer.jpg atau URL foto"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                  <div className="flex items-center justify-between">
                    <label className="cursor-pointer text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1">
                      <Upload className="w-3.5 h-3.5" /> Pilih File Foto dari Komputer
                      <input type="file" accept="image/*" onChange={handlePlayerPhotoUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPlayerModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-md transition-all"
                >
                  {editingPlayer ? 'Simpan Perubahan' : 'Tambah Pemain'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT MATCH */}
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
                    <option value="Completed">Selesai (Completed)</option>
                    <option value="Upcoming">Mendatang (Upcoming)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Stadion / Venue</label>
                  <input
                    type="text"
                    value={matchForm.venue}
                    onChange={(e) => setMatchForm({ ...matchForm, venue: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowMatchModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-md transition-all"
                >
                  {editingMatch ? 'Simpan Perubahan' : 'Tambah Pertandingan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH ADMIN BARU */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 sm:p-8 relative text-white">
            <button onClick={() => setShowAddAdminModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6">Tambah Akun Pengelola Baru</h3>

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nama Lengkap Pengelola</label>
                <input
                  type="text"
                  required
                  value={newAdminForm.name}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                  placeholder="Misal: Ahmad Fauzi"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Email / Username Login</label>
                <input
                  type="email"
                  required
                  value={newAdminForm.email}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                  placeholder="ahmad@chelind.id"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Password Baru</label>
                <input
                  type="password"
                  required
                  value={newAdminForm.password}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Role Hak Akses</label>
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
                  <label className="block text-slate-300 font-bold mb-1">Status Akun</label>
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

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-md transition-all"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
