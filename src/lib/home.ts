import { z } from 'zod';
import rawHome from '../data/home.json';

export const homeSchema = z
  .object({
    name: z.string().min(1),
    introduction: z.string().min(1),
    reading: z
      .object({
        before: z.string(),
        label: z.string().min(1),
        after: z.string(),
        href: z.literal('/library/'),
      })
      .strict(),
    socials: z
      .array(
        z
          .object({
            id: z.enum(['instagram', 'linkedin', 'github', 'opgg']),
            label: z.string().min(1),
            url: z
              .string()
              .url()
              .refine((url) => url.startsWith('https://'), 'HTTPS required')
              .nullable(),
          })
          .strict(),
      )
      .min(1)
      .refine(
        (items) => new Set(items.map((item) => item.id)).size === items.length,
        'Duplicate social identifier',
      ),
  })
  .strict();
export type HomeContent = z.infer<typeof homeSchema>;
export const home = homeSchema.parse(rawHome);

type NavIcon =
  'house' | 'user-round' | 'terminal' | 'activity' | 'clock' | 'camera' | 'map' | 'gamepad-2';
export interface NavItem {
  href: string;
  label: string;
  icon: NavIcon;
  /** Page not filled yet: shown dimmed with a "Soon" label. Ideas live in ROADMAP.md. */
  soon?: boolean;
}

export const navigation: readonly NavItem[] = [
  { href: '/', label: 'Home', icon: 'house' },
  { href: '/about/', label: 'About', icon: 'user-round' },
  { href: '/projects/', label: 'Projects', icon: 'terminal' },
  { href: '/training/', label: 'Training', icon: 'activity' },
  { href: '/now/', label: 'Now', icon: 'clock', soon: true },
  { href: '/photos/', label: 'Photos', icon: 'camera', soon: true },
  { href: '/map/', label: 'Map', icon: 'map', soon: true },
  { href: '/league-of-legends/', label: 'League of Legends', icon: 'gamepad-2', soon: true },
];
