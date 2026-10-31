import type { Session, Discipline } from './data';

export const DEMO_TODAY = '2026-10-29';
export function filterSessions(items: Session[], year: number, discipline: Discipline = 'All', today = DEMO_TODAY) {
  return items.filter(item => item.date.startsWith(`${year}-`) && item.date <= today && (discipline === 'All' || item.sport === discipline));
}
export function totals(items: Session[]) {
  return { count: items.length, minutes: items.reduce((sum, item) => sum + item.minutes, 0), km: Math.round(items.reduce((sum, item) => sum + (item.sport === 'Running' ? item.km ?? 0 : 0), 0) * 100) / 100 };
}
export function sportStats(items: Session[]) {
  const running = items.filter(item => item.sport === 'Running');
  const strength = items.filter(item => item.sport === 'Strength');
  const latest = (list: Session[]) => [...list].sort((a, b) => b.date.localeCompare(a.date))[0];
  return { all: totals(items), running: { ...totals(running), latest: latest(running), records: running.flatMap(item => item.sport === 'Running' && item.personalRecord ? [{ ...item.personalRecord, id: item.id }] : []) }, strength: { ...totals(strength), latest: latest(strength), exercises: [...new Set(strength.flatMap(item => item.sport === 'Strength' ? item.exercises?.map(exercise => exercise.name) ?? [] : []))].sort() } };
}
/** Fixed duration thresholds, not physiological training load. */
export function volumeLevel(minutes: number): 0 | 1 | 2 | 3 | 4 {
  return minutes <= 0 ? 0 : minutes < 30 ? 1 : minutes < 60 ? 2 : minutes < 90 ? 3 : 4;
}
export function calendar(items: Session[], year = 2026, today = DEMO_TODAY, discipline: Discipline = 'All') {
  if (!Number.isInteger(year) || year < 1900 || year > 2100) throw new RangeError('Year out of range');
  const reference = new Date(`${today}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(today) || Number.isNaN(reference.getTime()) || reference.toISOString().slice(0, 10) !== today) throw new RangeError('Invalid reference date');
  const first = new Date(Date.UTC(year, 0, 1));
  const last = new Date(Date.UTC(year, 11, 31));
  const offset = (first.getUTCDay() + 6) % 7;
  const total = Math.ceil((Math.round((last.getTime() - first.getTime()) / 86400000) + 1 + offset) / 7) * 7;
  const filtered = filterSessions(items, year, discipline, today);
  const byDate = new Map<string, Session[]>();
  filtered.forEach(item => byDate.set(item.date, [...(byDate.get(item.date) ?? []), item]));
  return Array.from({ length: total }, (_, index) => {
    const date = new Date(Date.UTC(year, 0, 1 - offset + index)).toISOString().slice(0, 10);
    const outside = !date.startsWith(`${year}-`);
    const activities = outside ? [] : byDate.get(date) ?? [];
    const minutes = totals(activities).minutes;
    return { date, day: Number(date.slice(-2)), outside, future: date > today, activities, minutes, level: volumeLevel(minutes), week: Math.floor(index / 7), weekday: index % 7 };
  });
}
export function dateLabel(date: string) { return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`)); }
export function fullDateLabel(date: string) { return new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`)); }
export function durationLabel(minutes: number) { return minutes >= 60 ? `${Math.floor(minutes / 60)} h ${Math.round(minutes % 60).toString().padStart(2, '0')}` : `${minutes} min`; }
export function paceLabel(session: Session) {
  if (session.sport !== 'Running' || !session.km) return undefined;
  const seconds = Math.round(session.minutes * 60 / session.km);
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')} /km`;
}
