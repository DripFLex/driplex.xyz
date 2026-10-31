# Home V2.1 — Carnet en chapitres

Direction B validée par le propriétaire, implémentée localement sur `feat/v2.1-home`. Le concept C et son atlas restent retirés ; aucune nouvelle expérience interactive dominante.

## Composition

L’introduction approuvée conserve driplex., son texte anglais exact, les réseaux discrets et la prose culturelle. Le rail fixe desktop et le menu mobile conservent leurs sept destinations.

Après l’introduction, quatre chapitres structurent la lecture :

1. En ce moment — Construire. Bouger. Recommencer.
2. Making — Un site à soi., avec le projet réel DRIPLEX en construction.
3. Moving — Revenir au mouvement., avec la dernière séance fictive passée.
4. Le carnet — Quelques notes., issues de la collection Markdown existante.

Les objectifs et side quests suivent comme intentions à personnaliser, pas comme accomplissements. Les démonstrations sportives et les billets de démonstration restent identifiés. Aucun contenu personnel inventé.

Desktop : titres en marge et contenu de lecture à droite, filets fins et espaces généreux. Mobile : même ordre dans un seul fil, marges24px. La hauteur des chapitres suit le contenu ; les valeurs fixes des maquettes ne sont pas reproduites pour éviter rognages et chevauchements.

## Architecture et édition

- `HomeIntro.astro`, `HomeChapter.astro`, `HomeEntry.astro` composent la page.
- `SiteNav.astro` et `Layout.astro` conservent la structure commune. Les ajustements de largeur de la Home sont isolés des autres pages.
- `src/data/home.json` et `src/lib/home.ts` contiennent la présentation validée, les profils facultatifs et leur validation Zod.
- `src/data/profile.json` fournit les intentions et side quests ; `src/data/sessions.json` fournit les séances fictives ; `src/content/posts/*.md` fournit les notes.
- Le bilan sportif conserve sa référence `DEMO_TODAY` et ses données locales. Aucun backend ou service externe ajouté.

Les interactions de lecture restent des liens HTML : soulignement et contraste au survol, focus visible distinct, cibles tactiles adaptées. Aucun mouvement requis ni JavaScript ajouté pour parcourir les chapitres.

## Library — version future

Library est la bibliothèque culturelle Books / Movies / TV shows. Sa structure minimale est disponible sur `/library/`, depuis « Occasionally lost in a good story. » sur la Home. Le catalogue, les filtres, les critiques et les notes restent reportés ; aucun contenu personnel n’est inventé.

Library reste absent du rail, du menu mobile et du footer. Le seul accès entrant se trouve dans la prose de la Home ; un retour Home reste disponible depuis Library.

## Vérification et lancement

Depuis le dépôt :

```powershell
npm run lint
npm test
npm run build
node --test tests/built.test.mjs
npm run dev
```

Ouvrir l’URL Local imprimée par Astro. Les captures et le rapport de revue V2.1 sont produits dans le dossier de livrables `home-v21-implementation` hors du dépôt. Les vérifications visuelles et clavier ne constituent pas un audit formel avec toutes les technologies d’assistance.

Aucun commit, push, PR, fusion ou déploiement sans accord du propriétaire. Le site local est présenté pour examen avant toute publication.
