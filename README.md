# DRIPLEX — Midnight Navy V2

Évolution de la V1 Astro et TypeScript. Site personnel entièrement statique avec contenus locaux validés ; aucun backend, compte, intégration Garmin/Strava ou infrastructure additionnelle.

## Lancement local

Node.js 22.12+ ou 24 LTS et npm. Depuis ce dossier :

```powershell
npm ci
$env:ASTRO_TELEMETRY_DISABLED='1'
npm run dev
```

Ouvrir http://127.0.0.1:4321. La variable facultative désactive la télémétrie du CLI Astro pour les environnements restreints ; elle ne concerne pas le site.

```powershell
npm run lint
npm test
npm run build
node --test tests/built.test.mjs
npm run preview
```

Le build vérifie aussi Astro/TypeScript. `dist/` contient le site statique ; aucun serveur applicatif nécessaire après compilation. Aucun déploiement automatisé configuré.

## Ce qui change

- Midnight Navy, tokens CSS centralisés, Space Grotesk et Inter auto-hébergées.
- Navigation Lucide compacte, tooltips desktop et labels mobiles ; aucun JavaScript pour naviguer.
- Training : année complète en semaines, filtres All/Running/Strength communs au calendrier, aux statistiques et au journal ; détail d’une journée multi-séances et fiches individuelles.
- Statistiques calculées depuis le JSON : distance/durée, dernières séances, exercices et éventuels records explicitement renseignés. Les valeurs absentes restent signalées comme non renseignées.
- Pages éditoriales conservées : Home, About, Photography (`/photos/`), Travel (`/map/`), Projects ; Stuff reste accessible dans le footer. Les URLs V1 sont conservées.

## Données de démonstration

Toutes les activités portent obligatoirement `demo: true`. La référence temporelle de la démo est **le 29 octobre 2026**, affichée dans l’interface et exportée comme `DEMO_TODAY`. Les années 2024 à 2027 illustrent l’année bissextile, le passage d’année et le futur. Les dates futures sont désactivées et exclues des statistiques. Pour actualiser la démo, modifier la constante et les années proposées ; ce choix explicite évite qu’une démonstration change selon la date du poste.

La couleur mesure uniquement la durée cumulée des séances filtrées du jour : 0 min, moins de 30, moins de 60, moins de 90, puis 90 min ou plus. Ce volume n’est pas une charge physiologique.

Sans JavaScript, le bilan initial 2026 et ses liens de fiches restent lisibles ; les filtres, les autres années et les interactions du calendrier nécessitent JavaScript.

## Où éditer

La Home V2.1 est décrite dans [Home V2.1](docs/home-v2.1.md) : composition **Carnet en chapitres** validée, introduction et navigation responsive, contenus locaux conservés. Now, League of Legends et Library disposent de structures minimales. **Library** accueillera livres, films et séries ; son catalogue sera développé ultérieurement. Le lien discret de la Home mène à `/library/`.

| Fichier | Contenu |
| --- | --- |
| `src/data/profile.json` | Présentation, liens, objectifs, side quests |
| `src/data/sessions.json` | Activités structurées et explicitement fictives |
| `src/lib/data.ts` | Validation Zod/TypeScript et exports de données |
| `src/lib/training.ts` | Agrégats et calendrier civil UTC, fonctions pures |
| `src/content/posts/*.md` | Billets Markdown validés et routes `/notes/` |
| `src/layouts/Layout.astro` | Navigation, polices et structure commune |
| `src/styles/global.css` | Tokens et style éditorial |
| `src/styles/training.css` | Mise en page du dashboard sportif |
| `src/pages/training/` | Dashboard et fiches |
| `public/cover.svg` | Illustration historique conservée, absente de la Home V2.1 |

Photography, Travel et Stuff sont des structures initiales soignées, pas des collections de données réelles. La Home V2.1 n’utilise aucune couverture. Les billets et séances présentés restent des démonstrations explicitement signalées.

## Documentation et revue

- [Design system](docs/design-system.md)
- [Modèle et calendrier](docs/training.md)
- [Décisions techniques](docs/decisions.md)
- [Rapport QA indépendant](docs/qa-v2.md)
- [Vérifications et commandes](docs/validation.md)
- [Fichiers modifiés](docs/files.md)

La V1 est conservée dans le commit de base `main`. La branche `feat/midnight-navy-training-v2` sépare identité/navigation, Training/tests, puis documentation/QA. Revue humaine avant fusion ; aucun déploiement et aucune modification d’AthleteOS.
