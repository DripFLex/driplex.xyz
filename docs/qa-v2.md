# Rapport QA indépendant — DRIPLEX V2

Revue effectuée le 29 octobre 2026 par un agent distinct des agents d’implémentation, après stabilisation des composants V2. Aucun défaut bloquant identifié dans le périmètre contrôlé.

## Périmètre

- Relecture indépendante de la palette, navigation, composants Training et schémas locaux.
- Tests indépendants dans `tests/qa.test.ts` : palette centralisée, contrastes WCAG AA du texte, architecture statique et motifs de secrets dans `src/`.
- Vérification des agrégations, des calendriers annuels, des jours futurs et de plusieurs séances par jour.
- Exécution finale indépendante du lint, des tests et du build, après stabilisation de l’implémentation.

## Résultats exécutés

| Contrôle | Résultat |
|---|---|
| `npm run lint` | Réussi, code de sortie 0 |
| `npm test` | 12 tests réussis, dont 6 tests QA indépendants |
| `ASTRO_TELEMETRY_DISABLED=1 npm run build` | Réussi ; 21 fichiers vérifiés, zéro erreur, avertissement ou hint ; 59 pages statiques |
| `node --test tests/built.test.mjs` | Réussi ; existence de toutes les pages et de leurs références locales |

Le JavaScript Training compilé mesure 18,97 ko (4,47 ko gzip). Les calculs purs sont séparés de la validation Zod, qui reste au build. Les polices et icônes sont servies depuis les assets locaux compilés.

## Vérifications indépendantes des données

- Toutes les années de 1900 à 2100 : 365/366 jours selon les règles grégoriennes, y compris 1900 et 2100 non bissextiles et 2000 bissextile ; dates uniques, premier et dernier jours, alignement des semaines du lundi au dimanche et padding hors année.
- Journée synthétique fictive comportant 25 minutes de Running et 70 minutes de Strength : 95 minutes en All, 25 en Running et 70 en Strength ; niveaux respectifs 4, 1 et 3.
- Exclusion des séances futures et des autres années du périmètre filtré ; aucune activité dans le padding du calendrier.
- Seuils exacts testés : 0, 1, 29, 30, 59, 60, 89, 90 et 500 minutes.
- Absence de distance ou d’exercices facultatifs sans calcul fictif ; records non renseignés restent vides. Dates impossibles et `demo:false` rejetés.
- Scan du code source pour plusieurs motifs de clés privées, clés GitHub, Stripe et AWS : aucun motif trouvé. Aucun connecteur sportif ni serveur applicatif ajouté.

## Revue statique et corrections vérifiées

- Navigation : nom accessible de chaque lien, SVG décoratif masqué, page active, tooltip visible au survol/focus, indicateur de focus et six entrées visibles avec labels sur mobile. Les liens V1 restent en place ; Stuff reste accessible dans le pied de page.
- Calendrier : un point d’entrée clavier avec déplacements par flèches, Home et End ; détails de journée utilisables par les boutons ou le champ date. Les dates futures sont désactivées et l’année 2027 montre un état vide explicite.
- Les cellules tactiles mobiles mesurent 24 px ; les petites cellules desktop disposent d’un champ date équivalent d’au moins 44 px de hauteur. La zone du calendrier autorise le défilement horizontal.
- Les tokens Training avaient initialement des noms différents du design system, masqués par des fallbacks. Signalé puis corrigé : références directes à `--heat-*`, `--text` et `--interactive`.
- Le risque d’une « dernière séance » future sur Home a été signalé ; Home filtre maintenant par date de référence avant de sélectionner la dernière séance.
- Les interactions animées sont conditionnées par `prefers-reduced-motion`.

## Contrastes de la palette officielle

Calculs selon la luminance relative sRGB WCAG : texte principal `#EDF3FC`, secondaire `#9AAAC1`, interactif `#589BE8` sur les trois surfaces `#030812`, `#0A1220`, `#111C2B`.

- Texte principal : 15,37 à 17,98:1.
- Texte secondaire : 7,26 à 8,49:1.
- Texte interactif : 5,93 à 6,94:1.

Ces couples dépassent le seuil AA de 4,5:1 pour le texte courant. La revue des usages réels complète ces calculs ; ils ne constituent pas à eux seuls un audit de toutes les combinaisons visuelles.

## Limites

Le scan de motifs secrets ne prouve pas l’absence universelle de données sensibles. Aucun audit avec lecteur d’écran ni test sur appareil physique n’est inclus. Les contrôles navigateur à partir de 375 px et les captures desktop/mobile sont réalisés séparément par l’agent principal et identifiés comme tels dans la livraison. Le présent rapport distingue ces contrôles des commandes et de la revue statique exécutées indépendamment.
