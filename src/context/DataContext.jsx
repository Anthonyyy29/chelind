import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

const INITIAL_ARTICLES = [
  {
    id: 1,
    slug: 'palmer-double-sinks-spurs',
    category: 'MATCH REPORT',
    title: 'Palmer Double Sinks Spurs in London Derby',
    subtitle: 'The Blues turn a one-goal deficit into a statement win after the break, with Cole Palmer stealing the show at Stamford Bridge.',
    author: 'Admin Chelind',
    date: '18 Jul 2026',
    readTime: '5 MIN READ',
    image: '',
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
    title: 'Transfer Update: Chelsea Bidik Bintang Muda La Liga',
    subtitle: 'Reports suggest an opening bid has already been submitted for the promising centre-back.',
    author: 'Redaksi',
    date: '17 Jul 2026',
    readTime: '4 MIN READ',
    image: '',
    isFeatured: false,
    status: 'published',
    content: 'Chelsea have formally initiated discussions with Serie A and La Liga clubs as Enzo Maresca seeks to fortify his defensive unit.',
    tags: ['TRANSFER NEWS', 'LA LIGA', 'CHELSEA']
  },
  {
    id: 3,
    slug: 'jadwal-pramusim-chelsea-2026-lawan-dan-venue',
    category: 'PREVIEW',
    title: 'Jadwal Pramusim Chelsea 2026: Lawan dan Venue',
    subtitle: 'Team news, predicted line-ups, and where to watch from Indonesia.',
    author: 'Admin Chelind',
    date: '16 Jul 2026',
    readTime: '3 MIN READ',
    image: '',
    isFeatured: false,
    status: 'published',
    content: 'All eyes turn to Anfield this weekend as Chelsea travel to face Liverpool in a high-stakes Premier League clash.',
    tags: ['PREVIEW', 'LIVERPOOL', 'PREMIER LEAGUE']
  }
];

const INITIAL_MATCHES = [
  { id: 1, competition: 'PREMIER LEAGUE', date: '18 Jul 2026 • 21:00 WIB', homeTeam: 'Chelsea', homeScore: 3, awayTeam: 'Arsenal', awayScore: 1, status: 'Completed', result: 'MENANG', venue: 'Stamford Bridge' },
  { id: 2, competition: 'PREMIER LEAGUE', date: '12 Jul 2026 • 19:30 WIB', homeTeam: 'Manchester City', homeScore: 1, awayTeam: 'Chelsea', awayScore: 2, status: 'Completed', result: 'MENANG', venue: 'Etihad Stadium' },
  { id: 3, competition: 'UEFA CHAMPIONS LEAGUE', date: '23 Jul 2026 • 03:00 WIB', homeTeam: 'Chelsea', homeScore: '-', awayTeam: 'Real Madrid', awayScore: '-', status: 'Upcoming', result: '', venue: 'Stamford Bridge' },
  { id: 4, competition: 'PREMIER LEAGUE', date: '27 Jul 2026 • 23:30 WIB', homeTeam: 'Chelsea', homeScore: '-', awayTeam: 'Liverpool', awayScore: '-', status: 'Upcoming', result: '', venue: 'Stamford Bridge' },
  { id: 5, competition: 'PREMIER LEAGUE', date: '5 Jul 2026 • 22:00 WIB', homeTeam: 'Tottenham', homeScore: 0, awayTeam: 'Chelsea', awayScore: 0, status: 'Completed', result: 'IMBANG', venue: 'Tottenham Hotspur St.' },
  { id: 6, competition: 'UEFA CHAMPIONS LEAGUE', date: '30 Jul 2026 • 02:00 WIB', homeTeam: 'Chelsea', homeScore: '-', awayTeam: 'PSG', awayScore: '-', status: 'Upcoming', result: '', venue: 'Stamford Bridge' },
  { id: 7, competition: 'PREMIER LEAGUE', date: '1 Jul 2026 • 22:00 WIB', homeTeam: 'Chelsea', homeScore: 2, awayTeam: 'Brentford', awayScore: 0, status: 'Completed', result: 'MENANG', venue: 'Stamford Bridge' },
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

  useEffect(() => {
    localStorage.setItem('chelind_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('chelind_matches', JSON.stringify(matches));
  }, [matches]);

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

  return (
    <DataContext.Provider
      value={{
        articles,
        matches,
        addArticle,
        updateArticle,
        deleteArticle,
        addMatch,
        updateMatch,
        deleteMatch,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
