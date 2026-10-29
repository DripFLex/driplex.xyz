import { z } from 'zod';
import rawSessions from '../data/sessions.json';
import rawProfile from '../data/profile.json';
export const sessionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s => !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().startsWith(s), 'Date invalide'),
  sport: z.enum(['Running','Strength']), title: z.string().min(1), minutes: z.number().positive(), km: z.number().nonnegative(), effort: z.enum(['Facile','Modéré','Soutenu']), note: z.string().min(1)
}).refine(s => s.sport !== 'Strength' || s.km === 0, 'Strength ne comporte pas de distance');
export type Session = z.infer<typeof sessionSchema>;
export const sessions = z.array(sessionSchema).refine(items => new Set(items.map(s => s.id)).size === items.length, 'Identifiants dupliqués').parse(rawSessions).sort((a,b) => b.date.localeCompare(a.date));
export const profile = z.object({ name:z.string(), intro:z.string(), note:z.string(), links:z.array(z.object({label:z.string(),href:z.string().regex(/^\/(?!\/)/)})), goals:z.array(z.string()), quests:z.array(z.string()) }).parse(rawProfile);
export function totals(items: Session[]) { return { count:items.length, minutes:items.reduce((n,s)=>n+s.minutes,0), km:Math.round(items.reduce((n,s)=>n+s.km,0)*10)/10 }; }
export function dateLabel(date:string) { return new Intl.DateTimeFormat('fr-BE',{day:'numeric',month:'short', timeZone:'UTC'}).format(new Date(date)); }
export function calendar(items:Session[]) {
  return Array.from({length:35},(_,i)=> { const date = new Date(Date.UTC(2026,8,28+i)).toISOString().slice(0,10); const matches=items.filter(s=>s.date===date); return {date,day:Number(date.slice(-2)),minutes:matches.reduce((n,s)=>n+s.minutes,0),sport:matches[0]?.sport}; });
}
