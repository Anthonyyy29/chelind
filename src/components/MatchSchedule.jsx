import React from 'react';
import { useData } from '../context/DataContext';
import { ArrowRight } from 'lucide-react';

const FALLBACK_LOGOS = {
  Chelsea: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
  Arsenal: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  City: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
  Liverpool: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
  Brighton: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg',
};

export default function MatchSchedule() {
  const { matches: contextMatches } = useData();

  const displayMatches = (contextMatches && contextMatches.length > 0) ? contextMatches.slice(0, 4) : [
    { id: 1, competition: 'PREMIER LEAGUE', date: '18 Jul 2026 • 20:00 WIB', homeTeam: 'Chelsea FC', awayTeam: 'Arsenal FC', venue: 'Stamford Bridge (Kandang)', homeLogo: FALLBACK_LOGOS.Chelsea, awayLogo: FALLBACK_LOGOS.Arsenal },
    { id: 2, competition: 'PREMIER LEAGUE', date: '26 Jul 2026 • 21:00 WIB', homeTeam: 'Liverpool FC', awayTeam: 'Chelsea FC', venue: 'Anfield (Tandang)', homeLogo: FALLBACK_LOGOS.Liverpool, awayLogo: FALLBACK_LOGOS.Chelsea },
    { id: 3, competition: 'PIALA LIGA', date: '05 Agu 2026 • 19:30 WIB', homeTeam: 'Chelsea FC', awayTeam: 'Manchester City', venue: 'Wembley Stadium (Netral)', homeLogo: FALLBACK_LOGOS.Chelsea, awayLogo: FALLBACK_LOGOS.City },
    { id: 4, competition: 'PREMIER LEAGUE', date: '15 Agu 2026 • 20:00 WIB', homeTeam: 'Chelsea FC', awayTeam: 'Brighton FC', venue: 'Stamford Bridge (Kandang)', homeLogo: FALLBACK_LOGOS.Chelsea, awayLogo: FALLBACK_LOGOS.Brighton },
  ];

  const parseDateParts = (dateStr) => {
    if (!dateStr) return { day: 'SAB', num: '18', month: 'JUL' };
    const parts = dateStr.split(' ');
    if (parts.length >= 3) {
      return {
        num: parts[0] || '18',
        month: (parts[1] || 'JUL').toUpperCase(),
        day: 'LAGA'
      };
    }
    return { day: 'SAB', num: '18', month: 'JUL' };
  };

  return (
    <section id="matches" className="bg-[#bebebe] py-20 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-2 tracking-tight">
            Jadwal Pertandingan
          </h2>
          <div className="w-12 h-[3px] bg-[#001f66] mx-auto mb-3" />
          <p className="text-slate-700 text-xs sm:text-sm">
            Jangan lewatkan laga The Blues berikutnya.
          </p>
        </div>

        <div className="space-y-4">
          {displayMatches.map((item) => {
            const dateObj = parseDateParts(item.date);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-slate-200"
              >
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  {/* Date Badge */}
                  <div className="bg-[#001f66] text-white rounded-xl px-4 py-3 flex flex-col items-center justify-center min-w-[68px] text-center shadow-inner shrink-0">
                    <span className="text-[9px] font-bold tracking-widest opacity-80 uppercase">{dateObj.day}</span>
                    <span className="text-2xl font-black leading-none my-0.5">{dateObj.num}</span>
                    <span className="text-[9px] font-bold tracking-widest opacity-80 uppercase">{dateObj.month}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold tracking-wider text-blue-600 uppercase block mb-1">
                      {item.competition}
                    </span>

                    {/* Match Title with Official Team Crest Logos */}
                    <div className="flex flex-wrap items-center gap-2 text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                      <div className="flex items-center gap-1.5">
                        {item.homeLogo ? (
                          <img src={item.homeLogo} alt={item.homeTeam} className="w-6 h-6 object-contain drop-shadow-sm" />
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-blue-600 inline-block"></span>
                        )}
                        <span>{item.homeTeam}</span>
                      </div>

                      <span className="text-slate-400 font-normal text-xs uppercase px-1">vs</span>

                      <div className="flex items-center gap-1.5">
                        {item.awayLogo ? (
                          <img src={item.awayLogo} alt={item.awayTeam} className="w-6 h-6 object-contain drop-shadow-sm" />
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-red-600 inline-block"></span>
                        )}
                        <span>{item.awayTeam}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mt-1.5">
                      {item.date} • {item.venue}
                    </p>
                  </div>
                </div>

                <div className="self-end sm:self-center shrink-0">
                  <a
                    href="#matches-page"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#001f66] hover:bg-[#002db3] text-white shadow-sm transition-all"
                  >
                    Lihat Match Center <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
