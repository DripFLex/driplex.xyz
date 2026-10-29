# driplex.xyz

Première version locale et indépendante : Astro, TypeScript strict, CSS natif, JSON validé avec Zod et billets Markdown validés par Astro Content Collections. Aucun déploiement effectué.

## Lancer

Prérequis : Node.js 22.12+ (ou 24 LTS), npm.

```powershell
cd C:\Users\DripleX\Documents\Codex\2026-10-29\projet-driplex-xyz-nouveau-site-personnel\outputs\driplex
npm ci
npm run dev
```

Ouvrir l’adresse locale affichée, normalement http://127.0.0.1:4321.

```powershell
npm run lint
npm test
npm run build
node --test tests/built.test.mjs
npm run preview
```

`build` exécute aussi la vérification Astro/TypeScript. Le résultat est dans `dist/`. Aucun serveur applicatif n’est nécessaire après compilation.

## Modifier les contenus

- `src/data/profile.json` : nom, présentation, liens internes, objectifs et side quests.
- `src/data/sessions.json` : séances fictives, dates ISO, Running ou Strength, durée en minutes, distance en kilomètres. Validation au build dans `src/lib/data.ts`.
- `src/content/posts/*.md` : titre, date, description, tag et texte des publications. Routes générées sous `/notes/`.
- `public/cover.svg` : illustration placeholder originale. Pour une photo personnelle : déposer un fichier autorisé dans `public/`, changer l’image et son texte alternatif dans `src/pages/index.astro`. Aucun asset de la référence n’est repris.
- `src/pages/` : pages secondaires éditables ; aucun contenu personnel réel ni lien social inventé.
- `src/styles/global.css` : couleurs, dimensions et adaptations responsive.

Toutes les séances et les deux billets sont des démonstrations explicitement signalées. La période initiale du calendrier est octobre 2026, à adapter dans `calendar()` et dans la page Training lors d’un changement de jeu de données. Les filtres concernent le fil des séances ; les statistiques et le calendrier conservent le bilan du mois complet.

## Pages

Home, Training, Photos, Map, Stuff, About, Projects ; six fiches Training, deux billets et une 404. Sans JavaScript, toutes les séances restent lisibles ; seuls les filtres nécessitent JavaScript. Map est une illustration sans géolocalisation. Photos et Stuff ont une structure initiale, sans fausse collection.

Voir `docs/decisions.md` pour les choix d’architecture et `docs/validation.md` pour les vérifications.
