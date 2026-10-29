# Vérifications V2

Exécutées le 29 octobre 2026 avec Node 24.11.1, npm 11.6.2 et Astro 5.18.2. Voir également le rapport QA indépendant `qa-v2.md`.

| Commande | Résultat |
| --- | --- |
| `npm run lint` | Réussi |
| `npm test` | 12 tests réussis, dont 6 indépendants |
| `npm run build` | 59 pages statiques ; 21 fichiers vérifiés, zéro erreur/warning/hint |
| `node --test tests/built.test.mjs` | Réussi : pages et références locales |
| `git diff --check` | Réussi |

Le bundle JavaScript Training est de 18,97 ko (4,47 ko gzip). Aucune hydratation React ni bibliothèque de calendrier. Polices et icônes locales.

## Contrôles navigateur par l’agent principal

- Home et Training inspectés sur desktop. Filtres All : 47 séances / 46 jours ; Running : 31 / 31 ; Strength : 16 / 16.
- Le 28 octobre contient deux séances, 67 min au total ; Running 42 min, Strength 25 min. Statistiques et journal changent avec le même filtre.
- Année 2024 : 366 boutons jours, séance fictive du 29 février affichée par le champ date.
- Année 2027 : zéro bouton jour activé, zéro séance et message de date future.
- Clavier : flèche gauche depuis le 28 octobre mène au 21 octobre ; Entrée ouvre la journée vide. Sélecteur date permet de revenir au 28 octobre et d’afficher les deux activités.
- Viewport 375 × 844 (360 px de contenu après barre de défilement) : Home, Training, Photography, Travel, Projects et About ne débordent pas horizontalement. Le calendrier mobile défile dans sa propre région (~1516 px) ; cases hautes de 24 px et champ date tactile.
- Viewport tablette 768 × 1024 (753 px de contenu) : Training sans débordement global.
- Les limites de tests sont conservées : aucun audit avec lecteur d’écran ni appareil physique. Les contrastes sont testés automatiquement et les usages relus par la QA.

## Captures

- `captures/home-desktop.jpg`
- `captures/home-mobile.jpg`
- `captures/training-desktop.jpg`
- `captures/training-mobile.jpg`

Captures du navigateur local après suppression de la barre d’outils Astro de l’aperçu. Les dimensions du navigateur ont été rétablies après les essais. Le serveur temporaire lancé pour la QA utilisait le port 4322 car 4321 était déjà occupé ; seul le serveur temporaire possédé par cette tâche est arrêté à la fin.

## Reproduction

```powershell
npm ci
$env:ASTRO_TELEMETRY_DISABLED='1'
npm run lint
npm test
npm run build
node --test tests/built.test.mjs
npm run dev
```

La désactivation de télémétrie évite l’écriture de configuration du CLI Astro hors du dossier dans un environnement restreint. Elle n’ajoute aucun comportement au site livré.

Aucun déploiement, fusion de PR, identifiant sportif ou accès à AthleteOS.
