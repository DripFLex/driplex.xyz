# Modèle d’activité et calendrier annuel

`src/data/sessions.json` est la source unique. `sessionSchema` dans `src/lib/data.ts` valide le contenu et fournit `Session` via `z.infer`. Helpers dans `src/lib/training.ts`. Chaque identifiant est unique et utilisable dans une URL.

## Champs

Communs : `id`, `date` civile valide `YYYY-MM-DD`, `sport` (`Running` ou `Strength`), `title`, `minutes` positives, `effort` (`Facile`, `Modéré`, `Soutenu`), `demo: true`. `note` facultatif.

Running : `km` positive si connue ; absence de distance = absence d’allure. Allure moyenne calculée depuis minutes/km. `personalRecord` facultatif : `label` et `seconds`. Aucun record n’est déduit sans mention explicite dans les données.

Strength : `exercises` facultatif ; chaque exercice contient `name`, `sets`, `reps` ou `seconds`, et `kg` facultatif. Charge omise = non renseignée. Zéro kilogramme représente une valeur explicite. `km: 0` toléré pour compatibilité V1 ; distance positive refusée.

```json
{
  "id": "exemple-force",
  "date": "2026-10-28",
  "sport": "Strength",
  "title": "Séance de démonstration",
  "minutes": 45,
  "effort": "Modéré",
  "demo": true,
  "exercises": [{ "name": "Squat", "sets": 3, "reps": 8, "kg": 40 }]
}
```

## Agrégation

`filterSessions(items, year, discipline, today)` sélectionne année civile, sport et dates <= référence. `sportStats()` calcule sommes, dernières activités, exercices distincts et records explicitement déclarés. Statistiques, journal et graphe partagent ce périmètre.

Plusieurs séances par jour, y compris de même discipline, sont possibles. `calendar()` groupe par date et additionne les minutes filtrées. `volumeLevel()` détermine le niveau :

| Niveau | Minutes cumulées | Token |
| --- | --- | --- |
| 0 | 0 | `--heat-0` / `#111C2B` |
| 1 | plus de 0 à moins de 30 | `--heat-1` / `#17345A` |
| 2 | 30 à moins de 60 | `--heat-2` / `#24548A` |
| 3 | 60 à moins de 90 | `--heat-3` / `#3475BA` |
| 4 | 90 et plus | `--heat-4` / `#589BE8` |

Seuils fixes, comparables entre années et disciplines. Ils ne représentent ni stress physiologique, ni intensité cardiaque, ni performance.

## Calendrier

La fonction retourne les journées avec `date`, `outside`, `future`, `activities`, `minutes`, `level`, `week`, `weekday`. Calcul UTC, lundi en première ligne, dimanche en dernière. Grille remplie par colonnes de semaines. Cases hors année uniquement pour l’alignement. Futures désactivées et volume nul, même avec une entrée de test future.

Années proposées : 2024–2027, avec exemples au 29 février 2024 et au 31 décembre 2025. Une année vide affiche zéro et des états explicites. Référence de démonstration fixe et affichée : 29 octobre 2026.

Les fonctions pures sont testées avec dates injectées. Formatage français via `Intl.DateTimeFormat` UTC, sans dépendance de dates. Le calendrier se parcourt par flèches, Début/Fin et Entrée/Espace ; le sélecteur de date fournit une alternative tactile.
