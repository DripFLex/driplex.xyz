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
- `strava.js`: 2026 Strava activities (static snapshot), used by Home and Training

## Still placeholder

Blog posts, books, photos and map places.
