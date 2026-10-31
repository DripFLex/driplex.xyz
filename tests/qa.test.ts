import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { calendar, filterSessions, sportStats, volumeLevel, sessionSchema, type Session } from '../src/lib/data';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const palette = ['#030812', '#0A1220', '#111C2B', '#1C2A40', '#EDF3FC', '#9AAAC1', '#3475BA', '#589BE8'];

function luminance(hex: string) {
  const rgb = hex.replace('#', '').match(/../g)!.map(channel => parseInt(channel, 16) / 255);
  const linear = rgb.map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return linear[0]! * 0.2126 + linear[1]! * 0.7152 + linear[2]! * 0.0722;
}
function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0]! + 0.05) / (values[1]! + 0.05);
}

test('QA : palette officielle centralisée dans des variables CSS', () => {
  const css = read('src/styles/global.css').toLowerCase();
  for (const color of palette) assert.match(css, new RegExp(`--[\\w-]+\\s*:\\s*${color.toLowerCase()}\\b`));
});

test('QA : textes principaux, secondaires et liens atteignent WCAG AA sur les surfaces', () => {
  for (const foreground of ['#EDF3FC', '#9AAAC1', '#589BE8']) {
    for (const background of ['#030812', '#0A1220', '#111C2B']) {
      assert.ok(contrast(foreground, background) >= 4.5, `${foreground} / ${background} : ${contrast(foreground, background).toFixed(2)}`);
    }
  }
  assert.ok(contrast('#589BE8', '#030812') >= 3, 'indicateur de focus');
});

test('QA : architecture entièrement statique et données locales', () => {
  const config = read('astro.config.mjs');
  assert.match(config, /output:\s*['"]static['"]/);
  assert.doesNotMatch(config, /adapter\s*:/);
  const pkg = JSON.parse(read('package.json'));
  for (const dependency of Object.keys(pkg.dependencies)) {
    assert.doesNotMatch(dependency, /postgres|prisma|supabase|garmin|strava|auth0|fastify|express/i);
  }
  const files = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)]);
  for (const file of files(fileURLToPath(new URL('../src', import.meta.url)))) {
    const source = readFileSync(file, 'utf8');
    assert.doesNotMatch(source, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|ghp_[a-zA-Z0-9]{30,}|sk_live_[a-zA-Z0-9]{20,}|AKIA[A-Z0-9]{16}/, file);
  }
});

const activity = (values: Record<string, unknown>) => sessionSchema.parse({
  id: 'qa-run', date: '2024-02-29', sport: 'Running', title: 'QA fictive', minutes: 25, km: 5, effort: 'Easy', demo: true, ...values,
});

test('QA : calendrier civil exhaustif de 1900 à 2100, ordre lundi à dimanche', () => {
  for (const year of Array.from({ length: 201 }, (_, index) => 1900 + index)) {
    const days = calendar([], year, '2100-12-31');
    const inYear = days.filter(d => !d.outside);
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    assert.equal(inYear.length, leap ? 366 : 365, String(year));
    assert.equal(inYear[0]!.date, `${year}-01-01`);
    assert.equal(inYear.at(-1)!.date, `${year}-12-31`);
    assert.equal(new Set(days.map(d => d.date)).size, days.length);
    assert.equal(days.length % 7, 0);
    for (const [index, day] of days.entries()) {
      assert.equal(day.weekday, index % 7);
      assert.equal(day.weekday, (new Date(`${day.date}T00:00:00Z`).getUTCDay() + 6) % 7);
    }
  }
});

test('QA : journées multi-séances, filtres et statistiques partagent le même périmètre', () => {
  const entries: Session[] = [
    activity({ id: 'qa-run', minutes: 25 }),
    activity({ id: 'qa-force', sport: 'Strength', minutes: 70, km: 0, exercises: [{ name: 'Squat', sets: 3, reps: 8, kg: 40 }] }),
    activity({ id: 'qa-future', date: '2024-03-01', minutes: 200 }),
    activity({ id: 'qa-past-year', date: '2023-12-31' }),
  ];
  const all = calendar(entries, 2024, '2024-02-29').find(day => day.date === '2024-02-29')!;
  assert.equal(all.minutes, 95);
  assert.equal(all.level, 4);
  assert.equal(all.activities.length, 2);
  const run = calendar(entries, 2024, '2024-02-29', 'Running').find(day => day.date === '2024-02-29')!;
  assert.equal(run.minutes, 25);
  assert.equal(run.level, 1);
  const strength = calendar(entries, 2024, '2024-02-29', 'Strength').find(day => day.date === '2024-02-29')!;
  assert.equal(strength.minutes, 70);
  assert.equal(strength.level, 3);
  const filtered = filterSessions(entries, 2024, 'All', '2024-02-29');
  const stats = sportStats(filtered);
  assert.equal(stats.all.count, 2);
  assert.equal(stats.all.minutes, 95);
  assert.equal(stats.running.km, 5);
  assert.deepEqual(stats.strength.exercises, ['Squat']);
  assert.deepEqual(stats.running.records, []);
  const future = calendar(entries, 2024, '2024-02-29').find(day => day.date === '2024-03-01')!;
  assert.equal(future.future, true);
  assert.equal(future.minutes, 0);
  assert.equal(future.activities.length, 0);
  const padding = calendar(entries, 2024, '2024-02-29').filter(day => day.outside);
  assert.ok(padding.every(day => day.activities.length === 0));
});

test('QA : seuils fixes de durée, dates invalides et absence de métriques facultatives', () => {
  for (const [minutes, level] of [[0, 0], [1, 1], [29, 1], [30, 2], [59, 2], [60, 3], [89, 3], [90, 4], [500, 4]]) {
    assert.equal(volumeLevel(minutes!), level);
  }
  assert.equal(sessionSchema.safeParse({ ...activity({}), date: '2023-02-29' }).success, false);
  assert.equal(sessionSchema.safeParse({ ...activity({}), demo: false }).success, false);
  const withoutDistance = activity({ km: undefined });
  assert.equal(sportStats([withoutDistance]).running.km, 0);
  assert.equal(sportStats([]).running.latest, undefined);
  assert.deepEqual(sportStats([]).strength.exercises, []);
});
