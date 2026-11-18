# Daily Watch

Films et séries à l'affiche, bandes-annonces et plateformes légales où les regarder — sans compte.

## Fonctionnalités

- **Accueil** : « à l'affiche ce soir » (tendances du jour en rotation), Top 10 films, séries du moment, en salle, mieux notés, bientôt au cinéma.
- **Films / Séries** : filtres par genre, tri (populaires, mieux notés, récents), chargement infini. Les filtres sont dans l'URL (partageables).
- **Recherche** : suggestions en direct dans l'en-tête (touche `/`, flèches, Entrée) et page de résultats filtrable.
- **Fiche** : synopsis, note, durée/saisons, classification, casting, bande-annonce YouTube intégrée, **où regarder en France** (streaming, location, achat), saisons et épisodes, titres similaires.
- **Ma liste** : « À voir » et « Déjà vu », stockées dans le navigateur (`localStorage`), synchronisées entre onglets.

## Démarrer

```bash
npm install
npm run dev
```

Données : API TMDB (clé dans `src/lib/tmdb.js`). Offres de streaming : JustWatch via TMDB.

Stack : React 18, Vite, Tailwind CSS, React Router, TanStack Query, GSAP. Système visuel : voir `DESIGN.md`.
