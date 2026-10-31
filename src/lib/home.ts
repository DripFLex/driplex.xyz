import { z } from 'zod';
import rawHome from '../data/home.json';

export const homeSchema = z.object({
  name: z.string().min(1),
  introduction: z.string().min(1),
  reading: z.object({ before: z.string(), label: z.string().min(1), after: z.string(), href: z.literal('/library/') }).strict(),
  socials: z.array(z.object({
    id: z.enum(['instagram', 'linkedin', 'github', 'opgg']),
    label: z.string().min(1),
    url: z.string().url().refine(url => url.startsWith('https://'), 'HTTPS required').nullable(),
  }).strict()).length(4).refine(items => new Set(items.map(item => item.id)).size === items.length, 'Duplicate social identifier'),
}).strict();
export type HomeContent = z.infer<typeof homeSchema>;
export const home = homeSchema.parse(rawHome);

export const navigation = [
  { href: '/', label: 'Home', icon: 'house' },
  { href: '/about/', label: 'About', icon: 'user-round' },
  { href: '/now/', label: 'Now', icon: 'clock' },
  { href: '/photos/', label: 'Photos', icon: 'camera' },
  { href: '/map/', label: 'Map', icon: 'map' },
  { href: '/training/', label: 'Training', icon: 'activity' },
  { href: '/league-of-legends/', label: 'League of Legends', icon: 'gamepad-2' },
] as const;
