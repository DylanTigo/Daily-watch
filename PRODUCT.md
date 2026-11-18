# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Francophone viewers deciding what to watch tonight — a film or a series — usually in the evening, on a laptop or phone. They want to browse what is trending, look something up quickly, and keep track of titles without creating an account.

## Product Purpose
Daily Watch is a discovery site for films and series. It answers "what should I watch, and where can I watch it?" without any login: trending titles, search, rich detail pages, trailers, and legal streaming providers. Success is a visitor going from landing to a decision (a trailer watched, a title saved, a provider found) in under a minute.

## Positioning
No account, no friction: everything (including the personal list) works instantly and stays in the visitor's own browser.

## Capabilities and Constraints
- Data source: TMDB API v3 (key in `src/api/config.js`), queried in `fr-FR`, region FR for watch providers.
- Detail pages: synopsis, rating, runtime / seasons & episodes, genres, cast, embedded YouTube trailer, legal "where to watch" providers (TMDB/JustWatch), similar titles.
- No video streaming of films/series themselves — trailers and legal providers only.
- "Ma liste" and "Déjà vu" stored in `localStorage`, filterable films/séries.
- Stack: React 18, Vite, Tailwind 3, react-router-dom 6, TanStack Query 5.

## Brand Commitments
- Name: Daily Watch. Logo assets in `src/assets/logo{blanc,noir,rouge}.png`.
- Visual direction delegated to the designer by the user.

## Evidence on Hand
- All titles, images and metadata come live from TMDB; nothing is fabricated. TMDB attribution must be shown.

## Product Principles
1. Zero friction: no account, no modal gates, instant search.
2. The content leads: posters and backdrops are the material of the interface.
3. Always answer "where can I watch it?" honestly, including when no legal provider is known.
4. French-first copy.
