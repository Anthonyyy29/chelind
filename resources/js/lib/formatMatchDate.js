const WEEKDAYS = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];
const MONTHS = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MEI',
    'JUN',
    'JUL',
    'AGU',
    'SEP',
    'OKT',
    'NOV',
    'DES',
];

export function getMatchDateParts(iso) {
    if (!iso) {
        return { weekday: '-', day: '-', month: '-', full: '-' };
    }

    const date = new Date(iso);

    return {
        weekday: WEEKDAYS[date.getDay()],
        day: String(date.getDate()).padStart(2, '0'),
        month: MONTHS[date.getMonth()],
        full: date.toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }),
    };
}

export function formatMatchDate(iso) {
    return getMatchDateParts(iso).full;
}

export function getCountdownParts(targetIso, now = new Date()) {
    if (!targetIso) {
        return null;
    }

    const diffMs = new Date(targetIso).getTime() - now.getTime();

    if (diffMs <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const totalSeconds = Math.floor(diffMs / 1000);

    return {
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
    };
}
