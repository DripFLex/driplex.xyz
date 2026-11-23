# driplex personal site

Static personal site (plain HTML/CSS/JS, no build step).

## Run locally

```powershell
python -m http.server 8123
```

Then open http://localhost:8123. Opening `index.html` directly also works, except the map tiles.

## Files

- `index.html`, `about.html`, `now.html`, `blog.html`, `photos.html`, `map.html`, `training.html`, `stuff.html`: the pages
- `style.css`: shared styles (dark/light theme tokens in `:root`)
- `nav.js`: left sidebar + theme toggle, injected on every page
- `strava.js`: 2026 Strava activities, used by Home, Now and Training
- `scripts/strava_sync.py`: rewrites the `ACTIVITIES` array in `strava.js` from the Strava API (test: `python scripts/test_strava_sync.py`)

## Strava auto-sync

`.github/workflows/strava-sync.yml` runs the sync daily (and on demand from the Actions tab) and commits `strava.js` when it changed. Only date, sport, moving time and distance are written: no names, places or descriptions.

One-time setup:

1. Create an API app at https://www.strava.com/settings/api (any website; Authorization Callback Domain: `localhost`). Note the Client ID and Client Secret.
2. Open this URL in a browser (replace `CLIENT_ID`), click Authorize, then copy the `code=` value from the `localhost` address you land on (the page itself fails to load, that is expected):
   `https://www.strava.com/oauth/authorize?client_id=CLIENT_ID&response_type=code&redirect_uri=http://localhost&approval_prompt=force&scope=activity:read_all`
3. Exchange the code for a refresh token:

   ```powershell
   curl.exe -X POST https://www.strava.com/oauth/token -d client_id=CLIENT_ID -d client_secret=CLIENT_SECRET -d code=CODE -d grant_type=authorization_code
   ```

   Keep the `refresh_token` from the JSON reply.
4. In the GitHub repo, Settings > Secrets and variables > Actions, add `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET` and `STRAVA_REFRESH_TOKEN`.
5. Actions > Strava sync > Run workflow, to check it works.

If a run logs that Strava issued a new refresh token, update the `STRAVA_REFRESH_TOKEN` secret with a fresh one (step 2-3).

## Still placeholder

Blog posts, books, photos and map places.
