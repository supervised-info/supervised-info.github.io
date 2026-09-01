# Regenerationsspec: `relativitaetstheorie/index.html`

## Zweck

Anschaulicher Essay (Recherche 01) zu spezieller und allgemeiner Relativität: Lichtuhr, Gleichzeitigkeit, Zwillinge, E=mc², Krümmung. Drei Canvas-Demos. Kein App-Speicher außer Site-Theme.

## Datei-Ort, Abhängigkeiten

- Eine Datei: `relativitaetstheorie/index.html` (CSS, Essay, SVG, Canvas-JS, Theme-JS inline).
- Kein `app.js`, keine PWA.
- Hub-Karte: Recherche 01, CTA Lesen.

## Chrome

- Shared Chrome wie Hub/DESIGN: Keys `supervised-info.theme` / `supervised-info.palette`, FOUC-Skript wortgleich, `#paletteBtn` dann `#themeBtn`.
- Favicon: **navy TS** `#0d1f6e`.
- Skip-Link: `<a class="skip" href="#inhalt">Zum Inhalt springen</a>`.
- Topnav (`.site.topnav`): Link `<a href="../">supervised-info</a>` **ohne Katalognummer** (Ist-Zustand; DESIGN würde `· 01` erwarten — beim Regenerieren die **Ist-Datei** nachbauen: keine `· 01` in der Topnav).
- Hero-Kicker ist inhaltlich: „Spezielle und allgemeine Relativität“ (kein supervised-info-Kicker).
- `theme-color` initial `#f3eee4`.
- OG-Tags: `og:title` Relativitätstheorie, anschaulich; `og:description` „Die Lichtgeschwindigkeit ist fest. Zeit und Raum sind es nicht.“; `og:locale` `de_DE`.
- Extra Tokens für Demos: `--demo #11151c`, `--demo-2 #1a2230`, `--demo-line #8eb4c4`, `--demo-photon #f3e6c4`, `--demo-warm #e07a5f`.

## Layout / UI-Elemente

- Lesespalte `.site`: `width: min(44rem, calc(100% - 2.2rem))`.
- Article `#inhalt`:
  - h1: `Relativitätstheorie,<br>anschaulich`
  - `.dek` wie Meta-Description-Erweiterung (siehe HTML-Hero).
  - `.meta` drei Spans: „Intuition vor Formalismus“, „Drei Experimente zum Anfassen“, „Deutsch“.
- TOC `nav.toc` `aria-label="Abschnitte"`: `#c` c ist fest; `#gleichzeitig` Gleichzeitig; `#lichtuhr` Lichtuhr; `#laenge` Länge; `#zwillinge` Zwillinge; `#energie` E = mc²; `#allgemein` Krümmung. (Kein TOC-Link auf `#schluss`.)
- Acht Sections mit `.numeral` römisch:

| id | numeral | h2 |
|---|---|---|
| c | I — Das Prinzip | Warum die Lichtgeschwindigkeit nicht mitmacht |
| gleichzeitig | II — Jetzt | Gleichzeitigkeit ist lokal |
| lichtuhr | III — Zeit | Eine Uhr aus Licht |
| laenge | IV — Länge | Was sich in Flugrichtung stutzt |
| zwillinge | V — Wege | Das Zwillingsparadoxon ist keines |
| energie | VI — Trägheit | Was E = mc² wirklich sagt |
| allgemein | VII — Äquivalenz | Freier Fall ist die gerade Bahn |
| schluss | VIII — Was fest bleibt | Kein Freibrief für Beliebigkeit |

- Formeln `.formula` (exakt):
  - `(u + v) / (1 + uv/c²)` — Einstein-Addition
  - `γ = 1 / √(1 − β²)` — Lorentzfaktor, β = v/c
  - `t = γ τ` — Koordinatenzeit t, Eigenzeit τ
  - `L = L₀ / γ` — nur parallel zur Bewegung
  - `τ = t / γ = (2D / v) √(1 − v²/c²)` — hin und zurück
  - `E₀ = mc²` — Ruheenergie
  - `dτ ≈ √(1 − rₛ/r) dt` — statischer Beobachter, Schwarzschild
- Pullquotes: „Nicht alles ist relativ…“; „Die Erdoberfläche hält uns von der Geodäte ab…“
- Abb. 1: Inline-SVG Lichtkegel (viewBox 0 0 640 220), Labels t/x, zeitartig/lichtartig/raumartig. Figcaption Abb. 1 …
- Energie: `.grid-2` Karten Massendefekt / Photonen.
- Footer `.colophon`: Anschauungshilfe-Disclaimer + Link `../` „Zur Übersicht“.
- Fließtext: den bestehenden Essay **inhaltlich vollständig** wiedergeben (Michelson-Morley 1887, Einstein 1905, Bahnsteig-Blitze, Myonen 2,2 µs, GPS, 1919 Finsternis, Schwarzschild rₛ = 2GM/c²). Nicht kürzen auf Stichworte.

## Demos (Interaktionen)

Drei `<canvas>` + Range-Controls. `prefers-reduced-motion` / Pause-Button. Fallback-`<p class="fallback">` ohne JS.

1. **Lichtuhr** `#cv-clock` 800×340  
   - `#clock-beta` range min 0 max 0.94 step 0.01 default 0.6; output `#clock-beta-out` de-DE Komma.  
   - `#clock-gamma-out` zeigt γ.  
   - `#btn-pause` `aria-pressed`, Label „Animation pausieren“ / Fortsetzen.  
   Links ruhende Uhr, rechts bewegte Zickzack-Photon-Uhr, Tick-Zähler.

2. **Zwillinge** `#cv-twins` 800×360  
   - `#twin-beta` 0.2–0.96 step 0.01 default 0.8  
   - `#twin-dist` 1–12 step 0.1 default 4.3 Lichtjahre  
   - `#twin-readout` Eigenzeiten. Minkowski-Diagramm c=1, 45°.

3. **Brunnen** `#cv-well` 800×400  
   - `#well-mass` 0.25–2.2 step 0.05 default 1  
   - `#well-readout`  
   Schematisches Einbettungsbild, Orbit, Lichtablenkung, zwei Uhren.

Demo-Farben aus `--demo*` Tokens; nicht Site-Palette für die Canvas-Szene hardcoden wo Tokens existieren. SVG-Illustration Abb. 1 nutzt feste Vintage-Farben im Markup (`#e9e1d2`, `#9c3424`) — Ist-Zustand beibehalten.

## Datenmodell

Nur Site-Theme-Keys. Kein Essay-localStorage.

## Nicht ändern / Constraints

- Single-file, `lang="de"`, relative `../`.
- Kein Mathematik-CDN. Canvas-Code inline.
- Recherche-Karte 01 auf dem Hub nicht umnummerieren.

## Akzeptanzkriterien

- [ ] Navy-Favicon, FOUC, Palette/Theme, Skip zu `#inhalt`.
- [ ] Alle 8 Sections + TOC + 3 Demos mit denselben IDs/Ranges.
- [ ] Pause stoppt Lichtuhr-Animation; Slider aktualisieren Outputs live.
- [ ] Footer-Link zur Übersicht.
