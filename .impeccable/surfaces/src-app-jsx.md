---
version: 1
slug: "src-app-jsx"
primary_target: "src/App.jsx"
related_targets: []
---

Scope: whole site (home, films, séries, recherche, fiche, ma liste, 404). Mode: Experience (browse) with Operate details (search, list).
Audience: francophone viewers choosing tonight's film/series, evening, low light, laptop or phone. Job: find, check trailer + where to watch, save.

## Direction contract

THESIS: The site is a cinema marquee letterboard at night. Titles are spelled in hand-placed block letters on a lit opal board; everything else is the dark street around it. Refuses the category default of a Netflix clone (gradient hero + rows of identical rounded cards on black).

OWN-WORLD: Night-asphalt warm black ground (#0f0e0d), lit opal letterboard panels (#f2ede3) with near-black condensed caps (Big Shoulders Display) set letter-by-letter in slots, marquee red from the logo (#e3262f) only for the frame rule and the live/active element, bulb amber for ratings. Body in Geist; all metadata in tabular Geist Mono segments separated by thin rules, gate-board style. Posters are the only colour; nothing is tinted.

STORY: Visitor sees what is "à l'affiche ce soir", understands it instantly, watches a trailer or saves it in one tap, then browses rows, filters, searches, finds where to stream legally. Their list lives in their browser.

FIRST VIEWPORT: Full-bleed backdrop of the current trending title, darkened toward the bottom-left. Bottom-left: the letterboard panel (~44vw desktop, full width mobile) with "À L'AFFICHE CE SOIR" strip, the title in board letters, a tabular meta row, a 2-line synopsis, primary action "Bande-annonce" + "Détails" + list toggle. Bottom-right: 5 numbered thumbnails of the rotation with a progress rule. Translucent header on top.

FORM: Cinema marquee letterboard, position 7 of my ordered list, seed key 2e6d4964. Raises: from boarding-pass/gate-board, tabular segmented metadata and in-place reranking (Flip) on list filtering; from cracktro, state is brightness (lit board = active, unlit = dormant).

Signature interaction: letters are placed onto the board one by one (GSAP stagger, y + rotate settle) whenever the featured title changes.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
