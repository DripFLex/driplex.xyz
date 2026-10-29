import { z } from 'zod';
import rawSessions from '../data/sessions.json';
import rawProfile from '../data/profile.json';

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, 'Date civile invalide');
const base = { id: z.string().regex(/^[a-z0-9-]+$/), date: dateSchema, title: z.string().min(1), minutes: z.number().positive(), effort: z.enum(['Facile', 'Modéré', 'Soutenu']), note: z.string().optional(), demo: z.literal(true) };
export const exerciseSchema = z.object({ name: z.string().min(1), sets: z.number().int().positive(), reps: z.number().int().positive().optional(), seconds: z.number().positive().optional(), kg: z.number().nonnegative().optional() }).refine(exercise => exercise.reps !== undefined || exercise.seconds !== undefined, 'Répétitions ou durée requises');
export const sessionSchema = z.discriminatedUnion('sport', [
  z.object({ ...base, sport: z.literal('Running'), km: z.number().positive().optional(), personalRecord: z.object({ label: z.string().min(1), seconds: z.number().positive() }).optional() }).strict(),
  z.object({ ...base, sport: z.literal('Strength'), km: z.literal(0).optional(), exercises: z.array(exerciseSchema).optional() }).strict(),
]);
export type Session = z.infer<typeof sessionSchema>;
export type Discipline = 'All' | Session['sport'];
export const sessions = z.array(sessionSchema).refine(items => new Set(items.map(item => item.id)).size === items.length, 'Identifiants dupliqués').parse(rawSessions).sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
export const profile = z.object({ name: z.string(), intro: z.string(), note: z.string(), links: z.array(z.object({ label: z.string(), href: z.string().regex(/^\/(?!\/)/) })), goals: z.array(z.string()), quests: z.array(z.string()) }).parse(rawProfile);
export { DEMO_TODAY, filterSessions, totals, sportStats, volumeLevel, calendar, dateLabel, fullDateLabel, durationLabel, paceLabel } from './training';
