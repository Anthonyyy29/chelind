import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getMatches } from '../api/client';
import { Calendar, MapPin, Trophy, ArrowRight, Search, Clock } from 'lucide-react';

const INITIAL_MATCHES = [
  // Upcoming Matches
  {
    id: 1,
    status: 'scheduled',
    day: 'SAB',
    num: '18',
    month: 'JUL',
    year: '2026',
    competition: 'PREMIER LEAGUE',
    homeTeam: 'Chelsea FC',
    awayTeam: 'Arsenal FC',
    homeScore: null,
    awayScore: null,
    time: '20:00 WIB',
    venue: 'Stamford Bridge (Kandang)',
  },
  {
    id: 2,
    status: 'scheduled',
    day: 'MIN',
    num: '26',
    month: 'JUL',
    year: '2026',
    competition: 'PREMIER LEAGUE',
    homeTeam: 'Liverpool FC',
    awayTeam: 'Chelsea FC',
    homeScore: null,
    awayScore: null,
    time: '21:00 WIB',
    venue: 'Anfield (Tandang)',
  },
  {
    id: 3,
    status: 'scheduled',
    day: 'RAB',
    num: '05',
    month: 'AGU',
    year: '2026',
    competition: 'PIALA LIGA',
    homeTeam: 'Chelsea FC',
    awayTeam: 'Manchester City',
    homeScore: null,
    awayScore: null,
    time: '19:30 WIB',
    venue: 'Wembley Stadium (Netral)',
  },
  {
    id: 4,
    status: 'scheduled',
    day: 'SAB',
    num: '15',
    month: 'AGU',
    year: '2026',
    competition: 'PREMIER LEAGUE',
    homeTeam: 'Chelsea FC',
    awayTeam: 'Brighton & Hove Albion',
    homeScore: null,
    awayScore: null,
    time: '20:00 WIB',
    venue: 'Stamford Bridge (Kandang)',
  },
  // Past Results
  {
    id: 5,
    status: 'finished',
    day: 'MIN',
    num: '12',
    month: 'JUL',
    year: '2026',
    competition: 'CLUB WORLD CUP',
    homeTeam: 'Chelsea FC',
    awayTeam: 'Paris Saint-Germain',
    homeScore: 3,
    awayScore: 0,
    time: 'SELESAI',
    venue: 'MetLife Stadium (Netral)',
  },
  {
    id: 6,
    status: 'finished',
    day: 'RAB',
    num: '01',
    month: 'JUL',
    year: '2026',
    competition: 'FRIENDLY MATCH',
    homeTeam: 'Chelsea FC',
    awayTeam: 'AC Milan',
    homeScore: 2,
    awayScore: 1,
    time: 'SELESAI',
    venue: 'Stamford Bridge (Kandang)',
  },
  {
    id: 7,
    status: 'finished',
    day: 'MIN',
    num: '24',
    month: 'MEI',
    year: '2026',
    competition: 'PREMIER LEAGUE',
    homeTeam: 'Chelsea FC',
    awayTeam: 'Bournemouth',
    homeScore: 2,
    awayScore: 1,
    time: 'SELESAI',
    venue: 'Stamford Bridge (Kandang)',
  },
];

export default function MatchesPage({ onNavigateBack }) {
  const [filter, setFilter] = useState('all'); // 'all', 'scheduled', 'finished'
  const [search, setSearch] = useState('');
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [nextMatchCountdown, setNextMatchCountdown] = useState({ days: '02', hours: '14', minutes: '35', seconds: '40' });

  useEffect(() => {
    async function load() {
      const data = await getMatches();
      if (data && Array.isArray(data) && data.length > 0) {
        // Map backend matches
        const mapped = data.map((m, idx) => {
          const date = new Date(m.kickoff || m.kickoff_at || Date.now());
          const isFinished = m.status === 'finished' || Boolean(m.home_score !== null && m.home_score !== undefined);
          return {
            id: m.id || idx + 10,
            status: isFinished ? 'finished' : 'scheduled',
            day: date.toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase(),
            num: date.getDate().toString().padStart(2, '0'),
            month: date.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase(),
            year: date.getFullYear().toString(),
            competition: (m.competition || m.league || 'PREMIER LEAGUE').toUpperCase(),
            homeTeam: m.home_team || m.homeTeam || 'Chelsea FC',
            awayTeam: m.away_team || m.awayTeam || 'Opponent',
            homeScore: m.home_score ?? (isFinished ? 2 : null),
            awayScore: m.away_score ?? (isFinished ? 1 : null),
            time: isFinished ? 'SELESAI' : `${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
            venue: m.venue || m.location || 'Stamford Bridge',
          };
        });
        setMatches(mapped);
      }
    }
    load();
  }, []);

  // Simple countdown timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setNextMatchCountdown((prev) => {
        let sec = parseInt(prev.seconds, 10) - 1;
        let min = parseInt(prev.minutes, 10);
        if (sec < 0) {
          sec = 59;
          min -= 1;
        }
        return {
          ...prev,
          minutes: String(Math.max(0, min)).padStart(2, '0'),
          seconds: String(Math.max(0, sec)).padStart(2, '0'),
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredMatches = matches.filter((m) => {
    const matchesFilter = filter === 'all' || m.status === filter;
    const matchesSearch =
      search === '' ||
      m.homeTeam.toLowerCase().includes(search.toLowerCase()) ||
      m.awayTeam.toLowerCase().includes(search.toLowerCase()) ||
      m.competition.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#dcdcdc] text-slate-900 font-poppins selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#00144d] text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-600/30 text-blue-300 border border-blue-400/30 mb-3 tracking-wider uppercase">
              Match Center
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
              Jadwal & Hasil Matchday
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl">
              Pantau jadwal pertandingan mendatang, statistik laga, dan hasil skor terbaru Chelsea FC musim 2026.
            </p>
          </div>

          {/* Next Match Countdown Card */}
          <div className="bg-[#001f66] rounded-2xl p-6 shadow-2xl border border-white/15 w-full md:w-auto min-w-[320px]">
            <div className="flex items-center justify-between text-xs text-blue-300 font-semibold mb-3">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-400" /> LAGA BERIKUTNYA</span>
              <span className="bg-blue-600/40 text-white px-2 py-0.5 rounded text-[10px] font-bold">PREMIER LEAGUE</span>
            </div>

            <div className="flex items-center justify-around py-3 border-y border-white/10 my-2">
              <div className="text-center">
                <span className="text-2xl font-black block">CHE 🔵</span>
                <span className="text-[10px] font-semibold text-slate-300">Chelsea FC</span>
              </div>
              <div className="text-xl font-bold text-blue-400 px-3">VS</div>
              <div className="text-center">
                <span className="text-2xl font-black block">🔴 ARS</span>
                <span className="text-[10px] font-semibold text-slate-300">Arsenal FC</span>
              </div>
            </div>

            {/* Countdown timer */}
            <div className="grid grid-cols-4 gap-2 text-center mt-3">
              <div className="bg-black/30 rounded-lg p-1.5">
                <span className="text-lg font-bold block leading-none">{nextMatchCountdown.days}</span>
                <span className="text-[9px] text-slate-400 uppercase">HARI</span>
              </div>
              <div className="bg-black/30 rounded-lg p-1.5">
                <span className="text-lg font-bold block leading-none">{nextMatchCountdown.hours}</span>
                <span className="text-[9px] text-slate-400 uppercase">JAM</span>
              </div>
              <div className="bg-black/30 rounded-lg p-1.5">
                <span className="text-lg font-bold block leading-none">{nextMatchCountdown.minutes}</span>
                <span className="text-[9px] text-slate-400 uppercase">MENIT</span>
              </div>
              <div className="bg-black/30 rounded-lg p-1.5">
                <span className="text-lg font-bold block leading-none">{nextMatchCountdown.seconds}</span>
                <span className="text-[9px] text-slate-400 uppercase">DETIK</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Controls Bar: Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-full shadow-sm border border-slate-200 w-full sm:w-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                filter === 'all'
                  ? 'bg-[#001f66] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Semua Pertandingan ({matches.length})
            </button>
            <button
              onClick={() => setFilter('scheduled')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                filter === 'scheduled'
                  ? 'bg-[#001f66] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Jadwal Mendatang ({matches.filter((m) => m.status === 'scheduled').length})
            </button>
            <button
              onClick={() => setFilter('finished')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                filter === 'finished'
                  ? 'bg-[#001f66] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Hasil Laga ({matches.filter((m) => m.status === 'finished').length})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari lawan atau kompetisi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-full text-xs font-medium text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            />
          </div>
        </div>

        {/* Match Cards List */}
        <div className="space-y-4">
          {filteredMatches.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700">Tidak Ada Pertandingan Ditemukan</h3>
              <p className="text-xs text-slate-500 mt-1">Coba ubah kata kunci pencarian atau ganti filter kategori.</p>
            </div>
          ) : (
            filteredMatches.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-slate-200/80 group"
              >
                {/* Date Badge & Match Info */}
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className="bg-[#001f66] text-white rounded-xl px-4 py-3 flex flex-col items-center justify-center min-w-[68px] text-center shadow-inner group-hover:scale-105 transition-transform">
                    <span className="text-[10px] font-bold tracking-widest opacity-80">{item.day}</span>
                    <span className="text-2xl font-black leading-none my-0.5">{item.num}</span>
                    <span className="text-[10px] font-bold tracking-widest opacity-80">{item.month}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-[#001f66] uppercase block mb-1">
                      {item.competition}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      {item.homeTeam}
                      {item.status === 'finished' ? (
                        <span className="inline-block px-2.5 py-0.5 rounded bg-blue-100 text-[#001f66] text-sm font-extrabold mx-1">
                          {item.homeScore} - {item.awayScore}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal text-sm px-1">VS</span>
                      )}
                      {item.awayTeam}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span>{item.time}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {item.venue}</span>
                    </p>
                  </div>
                </div>

                {/* Match Action */}
                <div className="self-end md:self-center">
                  <a
                    href="#match-detail"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-[#001f66] bg-blue-50 hover:bg-[#001f66] hover:text-white transition-colors duration-200"
                  >
                    {item.status === 'finished' ? 'Laporan Laga' : 'Lihat Detail'} <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
