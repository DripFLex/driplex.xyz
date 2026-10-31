import { test } from 'node:test';
import assert from 'node:assert/strict';
import { home, homeSchema, navigation } from '../src/lib/home';
import { dateLabel, fullDateLabel, sessions } from '../src/lib/data';

test('Visitor dates and session efforts use English', () => {
  assert.equal(dateLabel('2026-10-28'), '28 Oct');
  assert.equal(fullDateLabel('2026-10-28'), 'Wednesday, 28 October 2026');
  assert.ok(sessions.every(session => ['Easy', 'Moderate', 'Hard'].includes(session.effort)));
});

test('Library is linked from the introduction and stays outside navigation', () => {
  assert.equal(home.reading.href, '/library/');
  assert.ok(navigation.every(item => !/library|books/i.test(`${item.href} ${item.label}`)));
});

test('Home accepts missing social profiles but refuses unsafe URLs and duplicate IDs', () => {
  assert.equal(homeSchema.safeParse(home).success, true);
  const [first, ...rest] = home.socials;
  assert.ok(first);
  for (const url of ['javascript:alert(1)', 'http://example.com/', '/profile/', '#']) {
    assert.equal(homeSchema.safeParse({ ...home, socials: [{ ...first, url }, ...rest] }).success, false);
  }
  assert.equal(homeSchema.safeParse({ ...home, socials: [first, first, ...rest.slice(1)] }).success, false);
});
