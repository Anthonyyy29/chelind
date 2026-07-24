import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

const INITIAL_ARTICLES = [
  {
    id: 1,
    slug: 'palmer-double-sinks-spurs',
    category: 'MATCH REPORT',
    title: 'Dua gol Palmer menenggelamkan Spurs dalam Derby London.',
    subtitle: 'The Blues turn a one-goal deficit into a statement win after the break, with Cole Palmer stealing the show at Stamford Bridge.',
    author: 'Admin Chelind',
    date: '18 Jul 2026',
    readTime: '5 MIN READ',
    image: 'assets/news/featured.jpg', // Cole Palmer Holding FIFA Trophy / Celebrating
    isFeatured: true,
    status: 'published',
    content: `Stamford Bridge erupted on a tense Wednesday night as Cole Palmer delivered a masterclass to overturn Tottenham Hotspur and hand Chelsea three crucial Premier League points. Two second-half goals from the England international completed a remarkable comeback.

It looked bleak at the interval. Son Heung-min had given Spurs a deserved lead midway through the first half, and Chelsea struggled to find their rhythm against a well-organised backline. But Enzo Fernandez pulled the strings after the restart, and it was his incisive passing that unlocked the Spurs defence time and again.`,
    quote: {
      text: "He is a match-winner. Pure and simple. When it matters most, Cole delivers.",
      author: "ENZO MARESCA — CHELSEA HEAD COACH"
    },
    tags: ['MATCH REPORT', 'COLE PALMER', 'LONDON DERBY', 'PREMIER LEAGUE', 'TOTTENHAM']
  },
  {
    id: 2,
    slug: 'transfer-update-chelsea-bidik-bintang-muda-la-liga',
    category: 'TRANSFER NEWS',
    title: 'Chelsea Open Talks Over Serie A Defender',
    subtitle: 'Reports suggest an opening bid has already been submitted for the promising centre-back.',
    author: 'Redaksi',
    date: '17 Jul 2026',
    readTime: '4 MIN READ',
    image: 'assets/news/enzo fernandes.jpg', // Enzo Fernandez
    isFeatured: false,
    status: 'published',
    content: 'Chelsea have formally initiated discussions with Serie A and La Liga clubs as Enzo Maresca seeks to fortify his defensive unit.',
    tags: ['TRANSFER NEWS', 'LA LIGA', 'CHELSEA']
  },
  {
    id: 3,
    slug: 'jadwal-pramusim-chelsea-2026-lawan-dan-venue',
    category: 'MATCHDAY',
    title: 'Everything You Need Before Kick-Off at Anfield',
    subtitle: 'Team news, predicted line-ups, and where to watch from Indonesia.',
    author: 'Admin Chelind',
    date: '16 Jul 2026',
    readTime: '3 MIN READ',
    image: 'assets/news/matchday.jpg', // Matchday
    isFeatured: false,
    status: 'published',
    content: 'All eyes turn to Anfield this weekend as Chelsea travel to face Liverpool in a high-stakes Premier League clash.',
    tags: ['PREVIEW', 'LIVERPOOL', 'PREMIER LEAGUE']
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
    const saved = localStorage.getItem('chelind_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
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
      date: newArticle.date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      readTime: '4 MIN READ',
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
