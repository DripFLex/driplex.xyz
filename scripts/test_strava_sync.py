"""Offline check of strava_sync with a fake API: python3 scripts/test_strava_sync.py"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
import strava_sync as s


def act(date, sport, t, m):
    return {'start_date_local': date + 'T07:00:00Z', 'sport_type': sport, 'moving_time': t, 'distance': m,
            'name': 'Secret name', 'start_latlng': [48.8, 2.3]}


# 201 activities -> 2 pages
fake = [act('2026-01-02', 'Run', 1800, 5000.0)] * 200 + [act('2026-11-20', 'WeightTraining', 3600, 12.3)]
pages = []
def fake_call(url, form=None, token=None):
    if form:
        assert form['grant_type'] == 'refresh_token'
        return {'access_token': 'tok', 'refresh_token': form['refresh_token']}
    assert token == 'tok' and 'after=1767225600' in url and 'per_page=200' in url
    pages.append(url)
    return fake[:200] if len(pages) == 1 else fake[200:]

s.call = fake_call
os.environ.update(STRAVA_CLIENT_ID='1', STRAVA_CLIENT_SECRET='x', STRAVA_REFRESH_TOKEN='r')
acts = s.fetch()
assert len(acts) == 201 and len(pages) == 2

old = s.JS.read_text(encoding='utf-8')
new = s.render(acts + [act('2026-11-21', 'Ride', 2659, 15286.4)], old)
head, tail = old.split('const ACTIVITIES = [\n')[0], old.split('\n];\n', 1)[1]
assert new.startswith(head + 'const ACTIVITIES = [\n') and new.endswith('\n];\n' + tail)  # other lines untouched
lines = new.split('const ACTIVITIES = [\n')[1].split('\n];')[0].split('\n')
assert lines[0] == "  ['2026-11-21','Ride',2659,15.29],['2026-11-20',W,3600,0],['2026-01-02','Run',1800,5],['2026-01-02','Run',1800,5],"
assert len(lines) == 51 and 'Secret' not in new and '48.8' not in new

for bad in ([], [act('2026-01-01', "Run'];alert(1)//", 1, 1)]):
    try:
        s.render(bad, old)
        raise AssertionError('should have failed')
    except SystemExit:
        pass
del os.environ['STRAVA_REFRESH_TOKEN']
try:
    s.fetch()
    raise AssertionError('should have failed')
except SystemExit as e:
    assert 'STRAVA_REFRESH_TOKEN' in str(e)
print('OK')
