# Roadmap — pages à remplir

Les pages marquées `soon: true` dans [`src/lib/home.ts`](src/lib/home.ts) apparaissent atténuées dans le menu avec un badge **Soon**.
Quand une page a du vrai contenu : retirer `soon: true`, cocher ici, et supprimer le texte placeholder de la page.

> **Mes idées** = à toi de remplir. **Pistes** = suggestions de départ, à garder ou à jeter.

---

## Now — `/now/` · [src/pages/now.astro](src/pages/now.astro)

Ce qui t'occupe en ce moment (format « now page » : un instantané daté, mis à jour de temps en temps).

**Mes idées**

-

**Pistes**

- Date de dernière mise à jour bien visible en haut
- 3–5 rubriques courtes : je construis / je lis / je m'entraîne pour / j'apprends
- Pourrait remplacer le bloc « 01 / RIGHT NOW » de la Home

- [ ] Page remplie · `soon` retiré

---

## Photos — `/photos/` · [src/pages/photos.astro](src/pages/photos.astro)

Aujourd'hui : 3 tuiles placeholder (Light, Outside, Details).

**Mes idées**

-

**Pistes**

- Commencer avec une seule série de 6–12 photos plutôt qu'un album complet
- Images dans `src/assets/photos/` + composant `<Image>` d'Astro (optimisation automatique)
- Légende courte + lieu/date par photo

- [ ] Page remplie · `soon` retiré

---

## Map — `/map/` · [src/pages/map.astro](src/pages/map.astro)

Aujourd'hui : motif de carte abstrait, aucun lieu.

**Mes idées**

-

**Pistes**

- Liste de lieux visités / à visiter dans un fichier `src/data/places.json`
- Carte SVG statique simple (pas de service externe), points placés à la main
- Lien vers les photos du même lieu quand elles existent

- [ ] Page remplie · `soon` retiré

---

## League of Legends — `/league-of-legends/` · [src/pages/league-of-legends.astro](src/pages/league-of-legends.astro)

Aujourd'hui : page vide. Le lien OP.GG existe déjà dans les réseaux (Home + About).

**Mes idées**

-

**Pistes**

- Mains / rôle, rang actuel et objectif de saison
- Quelques notes sur ce que tu travailles (comme le carnet Training, mais pour le jeu)
- Question à trancher : page à part entière, ou section d'une page « Play » / « Stuff » ?

- [ ] Page remplie · `soon` retiré

---

## Autres chantiers (hors menu « Soon »)

- [ ] **Home** — réécrire les slogans (« Build. Move. Repeat. », « Stay the course »…) avec la voix de la page About
- [ ] **Home** — le lien « See things differently ↗ » pointe vers Photos (placeholder)
- [ ] **Training** — remplacer les 49 séances fictives par de vraies données ; revoir `DEMO_TODAY` (figé au 2026-10-29)
- [ ] **Notes** — remplacer les 2 billets de démo par de vrais textes
- [ ] **Projects** — ajouter un vrai deuxième projet
- [ ] **Library** (`/library/`, liée depuis la Home, pas dans le menu) — premiers livres / films / séries
- [ ] **Identité** — choisir un nom unique : driplex. / DripleX / driplex.xyz / Philippe
- [ ] **Mise en ligne** — aucun déploiement configuré pour l'instant
