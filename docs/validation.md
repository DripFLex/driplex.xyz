# Vérifications de la V1

Effectuées le 29 octobre 2026 avec Node 24.11.1, npm 11.6.2 et Astro 5.18.2.

- `npm run lint` : réussi, ESLint TypeScript et Astro.
- `npm test` : réussi, trois tests, agrégats, rejet de contenus incohérents, alignement et couverture du calendrier.
- `npm run build` : Astro Check puis compilation statique ; 16 pages, zéro erreur, avertissement ou hint TypeScript.
- `node --test tests/built.test.mjs` : réussi, vérifie les 16 pages générées et toutes leurs références locales (liens, styles, scripts et images).
- Navigateur local : Home et Training inspectés ; filtres Running → 4, Strength → 2, Tout voir → 6 ; ouverture d’une fiche.
- Viewport mobile demandé à 390 × 844 (375 px de largeur de contenu avec la barre de défilement) : Home et Training sans débordement horizontal global après correction d’un titre. La navigation défile dans sa propre zone.

Ce contrôle ne remplace pas un audit complet avec plusieurs lecteurs d’écran et appareils physiques.

## Particularités de l’environnement

La première installation isolée ne pouvait pas résoudre le registre npm ; l’installation avec accès réseau a abouti. Une réinstallation propre a réparé les dépendances d’une tentative interrompue. Le verrou `package-lock.json` est livré pour `npm ci`.

La télémétrie du CLI Astro cherche à écrire hors du dossier dans cet environnement restreint. Les commandes Astro ont été exécutées avec :

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm run build
```

Cette variable n’est pas nécessaire au site livré et ne change aucun paramètre système. Le serveur d’aperçu temporaire est arrêté à la fin des vérifications. Aucun déploiement.
