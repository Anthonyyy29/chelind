import React, { useState, useEffect } from 'react';
import { getMatches } from '../api/client';
import { ArrowRight } from 'lucide-react';

const FALLBACK_MATCHES = [
  {
    id: 1,
    day: 'SAB',
    num: '18',
    month: 'JUL',
    competition: 'PREMIER LEAGUE',
    title: 'Chelsea vs Arsenal',
    time: '20:00 WIB • Stamford Bridge (Kandang)',
  },
  {
    id: 2,
    day: 'MIN',
    num: '26',
    month: 'JUL',
    competition: 'PREMIER LEAGUE',
    title: 'Liverpool vs Chelsea',
    time: '21:00 WIB • Anfield (Tandang)',
  },
  {
    id: 3,
    day: 'RAB',
    num: '05',
    month: 'AGU',
    competition: 'PIALA LIGA',
    title: 'Chelsea vs Manchester City',
    time: '19:30 WIB • Wembley Stadium (Netral)',
  },
  {
    id: 4,
    day: 'SAB',
    num: '15',
    month: 'AGU',
    competition: 'PREMIER LEAGUE',
    title: 'Chelsea vs Brighton',
    time: '20:00 WIB • Stamford Bridge (Kandang)',
  },
];

export default function MatchSchedule() {
  const [matches, setMatches] = useState(FALLBACK_MATCHES);

  useEffect(() => {
    async function load() {
      const data = await getMatches({ limit: 4 });
      if (data && Array.isArray(data) && data.length > 0) {
        const mapped = data.map((m, idx) => {
          const date = new Date(m.kickoff || m.kickoff_at || Date.now());
          return {
            id: m.id || idx,
            day: date.toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase(),
            num: date.getDate().toString().padStart(2, '0'),
            month: date.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase(),
            competition: (m.competition || m.league || 'PREMIER LEAGUE').toUpperCase(),
            title: `${m.home_team || m.homeTeam || 'Chelsea'} vs ${m.away_team || m.awayTeam || 'Opponent'}`,
            time: `${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB • ${m.venue || m.location || 'Stamford Bridge'}`,
          };
        });
        setMatches(mapped);
      }
    }
    load();
  }, []);

  return (
    <section id="matches" className="bg-[#dcdcdc] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Jadwal Pertandingan</h2>
          <p className="text-slate-600 text-sm sm:text-base">Jangan lewatkan laga The Blues berikutnya.</p>
        </div>

        <div className="space-y-4">
          {matches.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-slate-100"
            >
              <div className="flex items-center gap-5 w-full sm:w-auto">
                <div className="bg-[#001f66] text-white rounded-xl px-4 py-2.5 flex flex-col items-center justify-center min-w-[64px] text-center shadow-inner">
                  <span className="text-[10px] font-bold tracking-widest opacity-80">{item.day}</span>
                  <span className="text-2xl font-extrabold leading-none my-0.5">{item.num}</span>
                  <span className="text-[10px] font-bold tracking-widest opacity-80">{item.month}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-[#001f66] uppercase block mb-1">
                    {item.competition}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                </div>
              </div>

              <div className="self-end sm:self-center">
                <a
                  href="#matches"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#001f66] hover:text-[#002db3] transition-colors"
                >
                  Lihat Detail <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
