# Midnight Navy — V2

Les tokens sont définis dans `:root` de `src/styles/global.css`. Les composants réutilisent ces variables ; aucun mode clair implicite ni service de thème externe.

| Token | Valeur | Usage |
| --- | --- | --- |
| `--background` | `#030812` | Fond |
| `--surface` | `#0A1220` | Cartes discrètes |
| `--surface-secondary` | `#111C2B` | Contrôles, surface secondaire |
| `--border` | `#1C2A40` | Séparateurs |
| `--text` | `#EDF3FC` | Texte principal |
| `--text-secondary` | `#9AAAC1` | Descriptions et métadonnées |
| `--accent` | `#3475BA` | Accent graphique |
| `--interactive` | `#589BE8` | Liens actifs, focus et interactions |

Le bleu principal sert à la visualisation, pas au petit texte sur une surface sombre. Les textes utilisent les tokens principal, secondaire ou interactif dont le contraste est testé sur les trois surfaces. Les bordures sont délibérément discrètes ; l’état actif possède aussi un indicateur et `aria-current`.

## Typographie et assets

Inter pour le corps et Space Grotesk pour titres/chiffres. Fichiers Latin 400, 500, 600 auto-hébergés via les packages Fontsource, avec `font-display: swap` et fallbacks système. Aucun appel Google Fonts au runtime. Le bundler émet les fontes comme assets locaux. Les glyphes Lucide sont rendus en SVG statiques via `@lucide/astro`, sans bibliothèque cliente ni téléchargement d’icônes à l’exécution.

La couverture SVG et le favicon sont des placeholders originaux harmonisés. Les emplacements Photography restent sobres et sans images empruntées.

## Navigation

Six entrées : Home/house, Training/activity, Photography/camera, Travel/globe-2, Projects/terminal, About/user-round. Desktop : icônes, labels au survol et au focus. Mobile : labels visibles, cibles de 44 px minimum. Le menu principal ne dépend pas de JavaScript. Les URLs V1 `/photos/` et `/map/` restent inchangées ; Stuff est accessible dans le footer. Les fiches Training conservent l’état actif de leur section.

Focus visible et lien d’évitement ; effets de survol courts uniquement quand `prefers-reduced-motion` autorise l’animation. Les pages éditoriales conservent leur structure V1.
