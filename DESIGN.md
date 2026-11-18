# Daily Watch — Design system

**World:** a cinema marquee letterboard at night. Titles are spelled in block letters placed on a backlit opal board; everything else is the dark street around it. Posters and backdrops are the only colour.

## Palette (tokens in `tailwind.config.js`)

| Token | Value | Role |
| --- | --- | --- |
| `night` / `night-2..4` | `#0f0e0d` → `#2e2a26` | Ground and raised surfaces (warm asphalt black) |
| `fg` | `#efe9df` | Body text on night |
| `mute` | `#a59f95` | Secondary text (≥ 7:1 on night) |
| `line` | `rgba(242,237,227,.12)` | Hairlines, rings |
| `board` / `board-ink` | `#f2ede3` / `#141210` | The lit letterboard and its letters; also the **active** state everywhere |
| `marquee` | `#e3262f` | Frame rule, primary action, selection, active tab marker. Never decorative |
| `bulb` | `#f5b942` | Rating stars, focus ring |

State is brightness: active nav links, chips, tabs and segmented options turn into a lit board tile; dormant ones stay dim on night.

## Type

- **Display:** Big Shoulders Display 800/900, uppercase — board titles (`BoardText`), section titles (`.section-title`).
- **UI / body:** Geist 400–600.
- **Data:** Geist Mono, tabular numerals, uppercase, 0.04em tracking — years, ratings, runtimes, counts, in `.segments` rows split by thin rules (gate-board style).

## Components

- `Board` + `BoardText` (`src/components/Board.jsx`): aluminium frame (`.board-frame`, red top rule) around an opal panel (`.board`); text is split into per-letter spans sitting on groove lines (`.board-title`, `--slot` = line pitch).
- Buttons (`.btn` + `-primary` red / `-ghost` translucent / `-lit` board / `-icon`), 4px radius, `scale(.97)` on press.
- Chips (`.chip`), 3px radius; `aria-pressed`/`aria-selected` lights them.
- `PosterCard`: 2:3 poster, 5px radius, title + mono meta below, round list toggle top-right (always visible on touch, on hover with a mouse). Missing poster → letterboard fallback.
- `Row`: horizontal snap shelf with arrow buttons on desktop; `ranked` adds letterboard number tiles.

## Motion (GSAP via `src/lib/gsap.js`)

- **Signature:** letters are placed on the board one by one (`BoardText`, `power3.out`, small random tilt settling to 0) whenever a title appears.
- Hero: backdrop slow scale 1.08 → 1, copy rises in, a red progress rule drives rotation every 9 s; pauses on hover/focus and has a pause button.
- Ma liste: GSAP Flip glides remaining posters into place when items move between lists or filters.
- UI transitions stay ≤ 300 ms with `cubic-bezier(.23,1,.32,1)`. `prefers-reduced-motion` turns movement into fades and stops hero auto-rotation; `prefers-reduced-transparency` makes glass solid.

## Browser surfaces

Red text selection, amber focus ring, warm scrollbars, `color-scheme: dark`.
