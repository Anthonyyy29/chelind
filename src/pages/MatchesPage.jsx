import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useData } from '../context/DataContext';
import { Calendar, Search, Clock } from 'lucide-react';

const CHELSEA_LOGO = 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg';
const ARSENAL_LOGO = 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg';
const MANCITY_LOGO = 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg';
const REALMADRID_LOGO = 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg';
const LIVERPOOL_LOGO = 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg';
const TOTTENHAM_LOGO = 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg';
const PSG_LOGO = 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg';
const BRENTFORD_LOGO = 'https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg';

const FALLBACK_MATCHES = [
  { id: 1, status: 'scheduled', day: 'SAB', num: '18', month: 'JUL', competition: 'PREMIER LEAGUE', homeTeam: 'Chelsea FC', awayTeam: 'Arsenal FC', homeScore: null, awayScore: null, time: '20:00 WIB', venue: 'Stamford Bridge (Kandang)', homeLogo: CHELSEA_LOGO, awayLogo: ARSENAL_LOGO },
  { id: 2, status: 'scheduled', day: 'MIN', num: '26', month: 'JUL', competition: 'PREMIER LEAGUE', homeTeam: 'Liverpool FC', awayTeam: 'Chelsea FC', homeScore: null, awayScore: null, time: '21:00 WIB', venue: 'Anfield (Tandang)', homeLogo: LIVERPOOL_LOGO, awayLogo: CHELSEA_LOGO },
  { id: 3, status: 'scheduled', day: 'RAB', num: '05', month: 'AGU', competition: 'PIALA LIGA', homeTeam: 'Chelsea FC', awayTeam: 'Manchester City', homeScore: null, awayScore: null, time: '19:30 WIB', venue: 'Wembley Stadium (Netral)', homeLogo: CHELSEA_LOGO, awayLogo: MANCITY_LOGO },
  { id: 4, status: 'finished', day: 'MIN', num: '12', month: 'JUL', competition: 'CLUB WORLD CUP', homeTeam: 'Chelsea FC', awayTeam: 'Paris Saint-Germain', homeScore: 3, awayScore: 0, time: 'SELESAI', venue: 'MetLife Stadium (Netral)', homeLogo: CHELSEA_LOGO, awayLogo: PSG_LOGO },
];

export default function MatchesPage() {
  const { matches: contextMatches } = useData();
  const [filter, setFilter] = useState('all'); // 'all', 'scheduled', 'finished'
  const [search, setSearch] = useState('');
  const [nextMatchCountdown, setNextMatchCountdown] = useState({ days: '02', hours: '14', minutes: '35', seconds: '40' });

  const rawMatches = (contextMatches && contextMatches.length > 0) ? contextMatches : FALLBACK_MATCHES;

  const matches = rawMatches.map((m, idx) => {
    const isFinished = m.status === 'Completed' || m.status === 'finished';
    return {
      id: m.id || idx + 1,
      status: isFinished ? 'finished' : 'scheduled',
      day: 'SAB',
      num: '18',
      month: 'JUL',
      competition: (m.competition || 'PREMIER LEAGUE').toUpperCase(),
      homeTeam: m.homeTeam || 'Chelsea FC',
      awayTeam: m.awayTeam || 'Opponent',
      homeScore: isFinished ? m.homeScore : null,
      awayScore: isFinished ? m.awayScore : null,
      time: m.date || '20:00 WIB',
      venue: m.venue || 'Stamford Bridge',
      homeLogo: m.homeLogo || CHELSEA_LOGO,
      awayLogo: m.awayLogo || ARSENAL_LOGO,
    };
  });

  // Countdown timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setNextMatchCountdown((prev) => {
        let sec = parseInt(prev.seconds, 10) - 1;
        let min = parseInt(prev.minutes, 10);
        if (sec < 0) {
          sec = 59;
          min = min - 1;
        }
        return {
          ...prev,
          minutes: min.toString().padStart(2, '0'),
          seconds: sec.toString().padStart(2, '0'),
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredMatches = matches.filter((item) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'scheduled' && item.status === 'scheduled') ||
      (filter === 'finished' && item.status === 'finished');
    const matchesSearch =
      item.homeTeam.toLowerCase().includes(search.toLowerCase()) ||
      item.awayTeam.toLowerCase().includes(search.toLowerCase()) ||
      item.competition.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const nextMatch = matches.find((m) => m.status === 'scheduled') || matches[0];

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
              Pantau jadwal pertandingan mendatang, statistik laga, dan hasil skor terbaru Chelsea FC.
            </p>
          </div>

          {/* Next Match Countdown Card matching Image 1 with Official Team Crests */}
          <div className="bg-[#001f66] rounded-2xl p-6 shadow-2xl border border-white/15 w-full md:w-auto min-w-[340px]">
            <div className="flex items-center justify-between text-xs text-blue-300 font-semibold mb-3">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-400" /> LAGA BERIKUTNYA</span>
              <span className="bg-blue-600/40 text-white px-2 py-0.5 rounded text-[10px] font-bold">{nextMatch.competition}</span>
            </div>

            <div className="flex items-center justify-around py-4 border-y border-white/10 my-2">
              <div className="text-center flex flex-col items-center">
                <div className="w-12 h-12 mb-1.5 flex items-center justify-center">
                  <img src={nextMatch.homeLogo} alt={nextMatch.homeTeam} className="w-10 h-10 object-contain drop-shadow" />
                </div>
                <span className="text-xs font-black block">{nextMatch.homeTeam.slice(0, 3).toUpperCase()}</span>
                <span className="text-[10px] font-semibold text-slate-300">{nextMatch.homeTeam}</span>
              </div>

              <div className="text-xl font-black text-blue-400 px-3">VS</div>

              <div className="text-center flex flex-col items-center">
                <div className="w-12 h-12 mb-1.5 flex items-center justify-center">
                  <img src={nextMatch.awayLogo} alt={nextMatch.awayTeam} className="w-10 h-10 object-contain drop-shadow" />
                </div>
                <span className="text-xs font-black block">{nextMatch.awayTeam.slice(0, 3).toUpperCase()}</span>
                <span className="text-[10px] font-semibold text-slate-300">{nextMatch.awayTeam}</span>
              </div>
            </div>

            {/* Countdown timer */}
            <div className="grid grid-cols-4 gap-2 text-center mt-3">
              <div className="bg-black/30 rounded-lg p-2">
                <span className="text-lg font-bold block leading-none">{nextMatchCountdown.days}</span>
                <span className="text-[9px] text-slate-400 uppercase">HARI</span>
              </div>
              <div className="bg-black/30 rounded-lg p-2">
                <span className="text-lg font-bold block leading-none">{nextMatchCountdown.hours}</span>
                <span className="text-[9px] text-slate-400 uppercase">JAM</span>
              </div>
              <div className="bg-black/30 rounded-lg p-2">
                <span className="text-lg font-bold block leading-none">{nextMatchCountdown.minutes}</span>
                <span className="text-[9px] text-slate-400 uppercase">MENIT</span>
              </div>
              <div className="bg-black/30 rounded-lg p-2">
                <span className="text-lg font-bold block leading-none">{nextMatchCountdown.seconds}</span>
                <span className="text-[9px] text-slate-400 uppercase">DETIK</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
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

        {/* Match Cards List matching Image 2 with Official Team Crest Logos */}
        <div className="space-y-4">
          {filteredMatches.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
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
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className="bg-[#001f66] text-white rounded-xl px-4 py-3 flex flex-col items-center justify-center min-w-[68px] text-center shadow-inner group-hover:scale-105 transition-transform">
                    <span className="text-[10px] font-bold tracking-widest opacity-80">SAB</span>
                    <span className="text-2xl font-black leading-none my-0.5">18</span>
                    <span className="text-[10px] font-bold tracking-widest opacity-80">JUL</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold tracking-wider text-blue-600 uppercase block mb-1">
                      {item.competition}
                    </span>

                    {/* Match Title with Team Logos */}
                    <div className="flex flex-wrap items-center gap-2 text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                      <div className="flex items-center gap-2">
                        <img src={item.homeLogo} alt={item.homeTeam} className="w-6 h-6 object-contain drop-shadow-sm" />
                        <span>{item.homeTeam}</span>
                      </div>

                      {item.status === 'finished' ? (
                        <span className="inline-block px-2.5 py-0.5 rounded bg-blue-100 text-[#001f66] text-sm font-black mx-1">
                          {item.homeScore} - {item.awayScore}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal text-xs uppercase px-1">vs</span>
                      )}

                      <div className="flex items-center gap-2">
                        <img src={item.awayLogo} alt={item.awayTeam} className="w-6 h-6 object-contain drop-shadow-sm" />
                        <span>{item.awayTeam}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mt-1.5">
                      {item.time} • {item.venue}
                    </p>
                  </div>
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
