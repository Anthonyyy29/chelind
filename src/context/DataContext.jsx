import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

const INITIAL_ARTICLES = [
  {
    id: 1,
    slug: 'palmer-double-sinks-spurs',
    category: 'MATCH REPORT',
    title: 'Dua gol Palmer menenggelamkan Spurs dalam Derby London.',
    subtitle: 'The Blues membalikkan keadaan dari tertinggal satu gol menjadi kemenangan spektakuler di babak kedua, dengan Cole Palmer menjadi bintang utama di Stamford Bridge.',
    author: 'Admin Chelind',
    date: '18 Jul 2026',
    readTime: '5 MENIT BACA',
    image: 'assets/news/featured.jpg', // Cole Palmer Holding Trophy / Celebrating
    isFeatured: true,
    status: 'published',
    content: `Stamford Bridge bergemuruh pada Rabu malam yang menegangkan saat Cole Palmer tampil luar biasa untuk membalikkan keadaan atas Tottenham Hotspur dan memberikan tiga poin penting bagi Chelsea di Premier League. Dua gol di babak kedua dari pemain internasional Inggris tersebut melengkapi kebangkitan yang luar biasa.

Situasi sempat terlihat sulit pada babak pertama. Son Heung-min membawa Spurs unggul terlebih dahulu di pertengahan babak pertama, dan Chelsea berjuang keras menemukan ritme permainan menghadapi lini pertahanan lawan yang terorganisir dengan baik. Namun Enzo Fernandez berhasil mengendalikan permainan setelah jeda, dan umpan-umpan terukurnya berulang kali membongkar pertahanan Spurs.`,
    quote: {
      text: "Dia adalah pemenang pertandingan sejati. Ketika tim sangat membutuhkan, Cole selalu datang memberikan hasil luar biasa.",
      author: "ENZO MARESCA — PELATIH UTAMA CHELSEA"
    },
    tags: ['MATCH REPORT', 'COLE PALMER', 'LONDON DERBY', 'PREMIER LEAGUE', 'TOTTENHAM']
  },
  {
    id: 2,
    slug: 'transfer-update-chelsea-bidik-bintang-muda-la-liga',
    category: 'TRANSFER NEWS',
    title: 'Chelsea Buka Pembicaraan Negosiasi Bek Muda Berbakat Serie A',
    subtitle: 'Laporan resmi mengonfirmasi tawaran awal telah diajukan untuk memperkuat lini pertahanan The Blues musim depan.',
    author: 'Redaksi Chelind',
    date: '17 Jul 2026',
    readTime: '4 MENIT BACA',
    image: 'assets/news/enzo fernandes.jpg', // Enzo Fernandez
    isFeatured: false,
    status: 'published',
    content: 'Chelsea telah secara resmi memulai diskusi dengan klub papan atas Italia dan Spanyol saat Enzo Maresca berusaha memperkuat unit pertahanannya menjelang musim baru.',
    tags: ['TRANSFER NEWS', 'SERIE A', 'CHELSEA', 'ENZO MARESCA']
  },
  {
    id: 3,
    slug: 'jadwal-pramusim-chelsea-2026-lawan-dan-venue',
    category: 'MATCHDAY',
    title: 'Segala Hal Yang Perlu Anda Ketahui Sebelum Kick-Off di Anfield',
    subtitle: 'Kabar terkini skuad, prediksi susunan pemain, dan panduan nonton bareng fans di Indonesia.',
    author: 'Admin Chelind',
    date: '16 Jul 2026',
    readTime: '3 MENIT BACA',
    image: 'assets/news/matchday.jpg', // Matchday
    isFeatured: false,
    status: 'published',
    content: 'Seluruh perhatian tertuju ke Anfield akhir pekan ini saat Chelsea bertandang menghadapi Liverpool dalam laga sengit perburuan puncak klasemen Premier League.',
    tags: ['PREVIEW', 'LIVERPOOL', 'PREMIER LEAGUE', 'MATCHDAY']
  }
];

const CHELSEA_LOGO = 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg';
const ARSENAL_LOGO = 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg';
const MANCITY_LOGO = 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg';
const REALMADRID_LOGO = 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg';
const LIVERPOOL_LOGO = 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg';
const TOTTENHAM_LOGO = 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg';
const PSG_LOGO = 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg';
const BRENTFORD_LOGO = 'https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg';

const INITIAL_MATCHES = [
  { id: 1, competition: 'PREMIER LEAGUE', date: '18 Jul 2026 • 21:00 WIB', homeTeam: 'Chelsea FC', homeScore: 3, awayTeam: 'Arsenal FC', awayScore: 1, status: 'Completed', result: 'MENANG', venue: 'Stamford Bridge', homeLogo: CHELSEA_LOGO, awayLogo: ARSENAL_LOGO },
  { id: 2, competition: 'PREMIER LEAGUE', date: '12 Jul 2026 • 19:30 WIB', homeTeam: 'Manchester City', homeScore: 1, awayTeam: 'Chelsea FC', awayScore: 2, status: 'Completed', result: 'MENANG', venue: 'Etihad Stadium', homeLogo: MANCITY_LOGO, awayLogo: CHELSEA_LOGO },
  { id: 3, competition: 'UEFA CHAMPIONS LEAGUE', date: '23 Jul 2026 • 03:00 WIB', homeTeam: 'Chelsea FC', homeScore: '-', awayTeam: 'Real Madrid', awayScore: '-', status: 'Upcoming', result: '', venue: 'Stamford Bridge', homeLogo: CHELSEA_LOGO, awayLogo: REALMADRID_LOGO },
  { id: 4, competition: 'PREMIER LEAGUE', date: '27 Jul 2026 • 23:30 WIB', homeTeam: 'Chelsea FC', homeScore: '-', awayTeam: 'Liverpool FC', awayScore: '-', status: 'Upcoming', result: '', venue: 'Stamford Bridge', homeLogo: CHELSEA_LOGO, awayLogo: LIVERPOOL_LOGO },
  { id: 5, competition: 'PREMIER LEAGUE', date: '5 Jul 2026 • 22:00 WIB', homeTeam: 'Tottenham Hotspur', homeScore: 0, awayTeam: 'Chelsea FC', awayScore: 0, status: 'Completed', result: 'IMBANG', venue: 'Tottenham Hotspur St.', homeLogo: TOTTENHAM_LOGO, awayLogo: CHELSEA_LOGO },
  { id: 6, competition: 'UEFA CHAMPIONS LEAGUE', date: '30 Jul 2026 • 02:00 WIB', homeTeam: 'Chelsea FC', homeScore: '-', awayTeam: 'PSG', awayScore: '-', status: 'Upcoming', result: '', venue: 'Stamford Bridge', homeLogo: CHELSEA_LOGO, awayLogo: PSG_LOGO },
  { id: 7, competition: 'PREMIER LEAGUE', date: '1 Jul 2026 • 22:00 WIB', homeTeam: 'Chelsea FC', homeScore: 2, awayTeam: 'Brentford FC', awayScore: 0, status: 'Completed', result: 'MENANG', venue: 'Stamford Bridge', homeLogo: CHELSEA_LOGO, awayLogo: BRENTFORD_LOGO },
];

const INITIAL_PLAYERS = [
  { id: 1, name: 'Filip Jorgensen', number: 1, position: 'Goalkeeper', flag: '🇩🇰', flagUrl: '', image: 'assets/news/Filip jorgenson .jpg' },
  { id: 2, name: 'Cole Palmer', number: 20, position: 'Attacking Midfielder', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flagUrl: '', image: 'assets/news/cole palmer.jpg' },
  { id: 3, name: 'Joao Pedro', number: 10, position: 'Forward', flag: '🇧🇷', flagUrl: '', image: 'assets/news/joao pedro.jpg' },
  { id: 4, name: 'Enzo Fernandez', number: 8, position: 'Central Midfielder', flag: '🇦🇷', flagUrl: '', image: 'assets/news/enzo fernandes.jpg' },
  { id: 5, name: 'Liam Delap', number: 9, position: 'Striker', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flagUrl: '', image: 'assets/news/Liam delap.jpg' },
];

export function DataProvider({ children }) {
  const [articles, setArticles] = useState(() => {
    return INITIAL_ARTICLES;
  });

  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('chelind_matches');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('chelind_players');
    return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
  });

  useEffect(() => {
    localStorage.setItem('chelind_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('chelind_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('chelind_players', JSON.stringify(players));
  }, [players]);

  // CRUD Articles
  const addArticle = (newArticle) => {
    const article = {
      ...newArticle,
      id: Date.now(),
      slug: newArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      date: newArticle.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      readTime: '4 MENIT BACA',
      author: newArticle.author || 'Admin Chelind',
      status: newArticle.status || 'published',
    };
    setArticles([article, ...articles]);
  };

  const updateArticle = (id, updatedFields) => {
    setArticles(articles.map((art) => (art.id === id ? { ...art, ...updatedFields } : art)));
  };

  const deleteArticle = (id) => {
    setArticles(articles.filter((art) => art.id !== id));
  };

  // CRUD Matches
  const addMatch = (newMatch) => {
    const match = { ...newMatch, id: Date.now() };
    setMatches([match, ...matches]);
  };

  const updateMatch = (id, updatedFields) => {
    setMatches(matches.map((m) => (m.id === id ? { ...m, ...updatedFields } : m)));
  };

  const deleteMatch = (id) => {
    setMatches(matches.filter((m) => m.id !== id));
  };

  // CRUD Players
  const addPlayer = (newPlayer) => {
    const player = { ...newPlayer, id: Date.now() };
    setPlayers([...players, player]);
  };

  const updatePlayer = (id, updatedFields) => {
    setPlayers(players.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));
  };

  const deletePlayer = (id) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
