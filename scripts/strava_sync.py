#!/usr/bin/env python3
"""Rewrite the ACTIVITIES array in strava.js from the Strava API. Stdlib only.

Needs env STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN (see README).
Exits non-zero on any error, so strava.js is never overwritten with partial or empty data.
"""
import json, os, pathlib, re, sys, urllib.error, urllib.parse, urllib.request

AFTER = 1767225600  # 2026-01-01T00:00:00Z
JS = pathlib.Path(__file__).resolve().parent.parent / 'strava.js'
BLOCK = re.compile(r'^(const ACTIVITIES = \[\n).*?^(\];\n)', re.S | re.M)
SECRETS = ('STRAVA_CLIENT_ID', 'STRAVA_CLIENT_SECRET', 'STRAVA_REFRESH_TOKEN')


def fail(msg):
    sys.exit(f'strava_sync: {msg}')


def call(url, form=None, token=None):
    req = urllib.request.Request(url, urllib.parse.urlencode(form).encode() if form else None)
    if token:
        req.add_header('Authorization', f'Bearer {token}')
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        fail(f'{url.split("?")[0]} -> HTTP {e.code}: {e.read()[:300].decode(errors="replace")}')
    except (urllib.error.URLError, TimeoutError, ValueError) as e:
        fail(f'{url.split("?")[0]} -> {e}')


def fetch():
    env = {k: os.environ.get(k, '').strip() for k in SECRETS}
    missing = [k for k, v in env.items() if not v]
    if missing:
        fail('missing secret(s): ' + ', '.join(missing))
    auth = call('https://www.strava.com/oauth/token', {
        'client_id': env['STRAVA_CLIENT_ID'], 'client_secret': env['STRAVA_CLIENT_SECRET'],
        'refresh_token': env['STRAVA_REFRESH_TOKEN'], 'grant_type': 'refresh_token'})
    if not isinstance(auth, dict) or 'access_token' not in auth:
        fail('token response has no access_token')
    if auth.get('refresh_token') not in (None, env['STRAVA_REFRESH_TOKEN']):
        print('::warning::Strava issued a new refresh token; update the STRAVA_REFRESH_TOKEN secret')
    acts, page = [], 1
    while True:
        batch = call(f'https://www.strava.com/api/v3/athlete/activities?after={AFTER}&per_page=200&page={page}',
                     token=auth['access_token'])
        if not isinstance(batch, list):
            fail(f'unexpected activities response: {str(batch)[:200]}')
        acts += batch
        if len(batch) < 200:
            return acts
        page += 1


def row(a):
    # Only date, sport, time, distance: strava.js is public, so no names, places or descriptions.
    sport, date = a['sport_type'], a['start_date_local'][:10]
    if not re.fullmatch(r'\w+', sport) or not re.fullmatch(r'\d{4}-\d\d-\d\d', date):
        fail(f'unexpected activity fields: {sport!r} {date!r}')
    km = 0 if sport == 'WeightTraining' else round(a['distance'] / 1000, 2)
    return f"['{date}',{'W' if sport == 'WeightTraining' else repr(sport)},{int(a['moving_time'])},{km:g}]"


def render(acts, text):
    if not acts:
        fail('no activities returned, keeping strava.js as is')
    rows = [row(a) for a in sorted(acts, key=lambda a: a['start_date_local'], reverse=True)]
    body = ''.join('  ' + ','.join(rows[i:i + 4]) + ',\n' for i in range(0, len(rows), 4))
    new, n = BLOCK.subn(lambda m: m[1] + body + m[2], text)
    if n != 1:
        fail('ACTIVITIES array not found in strava.js')
    return new


if __name__ == '__main__':
    acts = fetch()
    JS.write_text(render(acts, JS.read_text(encoding='utf-8')), encoding='utf-8', newline='\n')
    print(f'strava_sync: wrote {len(acts)} activities')
