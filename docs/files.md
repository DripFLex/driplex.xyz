# Fichiers modifiés — V2

Évolution du projet V1 existant. Aucun fichier du dépôt AthleteOS modifié.

## Identité et navigation

- `astro.config.mjs` : aperçu sans barre d’outils de développement.
- `package.json`, `package-lock.json` : polices Fontsource locales et SVG Lucide.
- `src/layouts/Layout.astro` : polices/préchargement, navigation iconographique et accessibilité.
- `src/styles/global.css` : palette centralisée, typographies et responsive Midnight Navy.
- `public/cover.svg`, `public/favicon.svg` : placeholders harmonisés.
- `src/pages/photos.astro`, `src/pages/map.astro` : noms Photography et Travel, routes conservées.

## Training et tests

- `src/data/sessions.json` : 49 activités explicitement fictives, dont multi-séances, année passée et 29 février.
- `src/lib/data.ts` : schéma d’activité et validation locale.
- `src/lib/training.ts` : nouveau module de calculs purs sans Zod client.
- `src/components/SessionCard.astro` : données facultatives et allure.
- `src/pages/index.astro` : dernière activité passée selon la référence démo.
- `src/pages/training/index.astro` : graphe annuel, contrôles, jour, statistiques et journal synchronisés.
- `src/pages/training/[id].astro` : fiches Running et Strength.
- `src/styles/training.css` : nouveau style du dashboard.
- `tests/data.test.ts` : agrégations, validation, calendrier et métriques.
- `tests/qa.test.ts` : tests indépendants, contrastes, années1900–2100, filtres et absence de motifs de secrets.
- `tests/built.test.mjs` : nombre dynamique de pages et références locales.

## Documentation et preuves

`README.md`, `docs/design-system.md`, `docs/training.md`, `docs/decisions.md`, `docs/validation.md`, `docs/qa-v2.md`, `docs/files.md` et quatre captures dans `docs/captures/`.

Générés et ignorés : `dist/`, `.astro/`, `node_modules/`.
