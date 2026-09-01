# Design und Aufbau

Praktischer Leitfaden, um die GitHub-Pages-HTML von [supervised-info](https://supervised-info.github.io/) von Grund auf nachzubauen. Jede Seite ist eigenständiges HTML. Es gibt keinen Build, kein Bundling, kein Jekyll.

---

## 1. Zweck

Statische Dateien unter `https://supervised-info.github.io/`. Der Browser liest, was im Repo liegt. Eine Seite muss per Doppelklick auf `index.html` oder über einen beliebigen statischen Server funktionieren.

---

## 2. Rahmenbedingungen

- Hosting: GitHub Pages, User-Repo `supervised-info/supervised-info.github.io`
- Branch: `main`, öffentlich
- Werkzeugkette: keine (keine Node-Paketverwaltung, kein Bundler, kein Jekyll)
- `.nojekyll`: leere Datei im Repo-Root, damit GitHub die Dateien unverändert ausliefert
- Sprache: `lang="de"` auf dem Wurzelelement, deutsche Oberfläche
- Pfade: nur relativ (`./`, `../`, `data.json`)
- Fokus: `:focus-visible` mit Kontur `2px solid var(--oxide)`
- Tipziele: um 44px
- Bewegung: `prefers-reduced-motion` schaltet Animationen und `scroll-behavior` aus
- PWA: nur wenn nötig. Derzeit allein `einkauf/`

Doppelklick-Test: Ordner lokal öffnen, `index.html` starten. Kein Root-Pfad wie `/elektroautos/`, keine CDN-Pflicht für das Layout.

---

## 3. Repo-Baum

Ordnernamen ohne Umlaute. Jede Seite heißt `index.html`. CSS und JS inline, außer die Daten sind zu groß (dann eigene Datei neben der Seite). Favicon als Inline-SVG (`data:image/svg+xml`).

```
.
├── .nojekyll
├── README.md
├── DESIGN.md
├── index.html
├── relativitaetstheorie/
│   └── index.html
├── elektroautos/
│   ├── index.html
│   ├── app.js
│   └── data.json
├── einkauf/
│   ├── index.html
│   ├── sw.js
│   ├── manifest.webmanifest
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png
└── todo/
    └── index.html
```

---

## 4. Hub (`index.html`)

Zwei Tabs: **Recherche** und **Tools**. Die Nummerierung beginnt in jedem Tab bei `01`. Eine neue Seite ist genau eine Karte in der passenden `ol.cat`.

### Zustand

- `localStorage`-Schlüssel `supervised-info.hub-tab`: `recherche` oder `tools`
- Hash `#recherche` / `#tools`. Der Hash gewinnt vor dem gespeicherten Tab.
- Nach dem Umschalten Hash setzen (`#recherche` bzw. `#tools`).

### Karte

Raster: Nummer (`span.num`, zweistellig `01`), Titel (`h2`), ein Satz Abstract, CTA rechts.

- Recherche: CTA **Lesen** (bestehende Hub-Beschriftung: `Lesen →`)
- Tools: CTA **Öffnen** (bestehende Hub-Beschriftung: `Öffnen →`)

Neue UI-Texte ohne ASCII-Pfeile.

Aktueller Katalog:

- Recherche 01: `relativitaetstheorie/` Relativitätstheorie, anschaulich
- Tools 01: `elektroautos/` Elektroautos, im Vergleich
- Tools 02: `einkauf/` Einkaufsliste
- Tools 03: `todo/` To-Do Liste

### Unterseite, Kicker

Oben links: `supervised-info · NN`. Der Text `supervised-info` verlinkt nach `../`. **NN** ist die Katalognummer **dieses Tabs**, nicht eine globale Zählung über Tabs hinweg.

Beispiele: Relativitätstheorie = Recherche 01; Elektroautos = Tools 01; Einkaufsliste = Tools 02; To-Do Liste = Tools 03.

---

## 5. Typografie und Fläche

```css
--serif: Palatino, "Palatino Linotype", "Book Antiqua", Georgia, serif;
--sans: "Segoe UI", system-ui, -apple-system, sans-serif;
```

- Titel und Lede: `--serif`, `font-weight: 400`, `letter-spacing: -0.03em`
- UI (Kicker, Tabs, Buttons, Nummern, Footer): `--sans`
- Lesespalte: `width: min(40rem, calc(100% - 1.6rem))` bis `min(42rem, calc(100% - 2.4rem))`, zentriert. Hub: 42rem / 2.4rem.
- Volle Viewport-Fläche nur für die Elektroauto-Tabelle (`html, body { height: 100%; }`).
- Hintergrund: `var(--paper)` plus zwei radiale Glows auf `body::before` (oben links `--glow-1`, unten rechts `--glow-2`), `pointer-events: none`.

---

## 6. Farbsystem

Kanonisch sind die Token im Hub `index.html`. Komponentenfarben nie hardcoden: immer `var(--paper)`, `var(--ink)`, `var(--oxide)` usw.

### Gemeinsame Schlüssel

- `supervised-info.theme` = `light` oder `dark`. Fallback: `prefers-color-scheme`.
- `supervised-info.palette` = `vintage` oder `navy`. Fallback: `vintage`.

Attribute am Wurzelelement: `data-theme` und `data-palette`. Erster Paint: Vintage-Hell in `:root` (ohne Attribute reicht das).

### Buttons

In `.mast-actions` genau in dieser Reihenfolge: zuerst `#paletteBtn`, dann `#themeBtn`.

- Palette vintage: Label **Blau** (schaltet nach navy), `aria-pressed="true"`
- Palette navy: Label **Creme** (schaltet nach vintage), `aria-pressed="false"`
- Theme light: Label **Dunkel**, `aria-pressed="false"`
- Theme dark: Label **Hell**, `aria-pressed="true"`

Bei jedem Umschalten **beide** Schlüssel schreiben (`supervised-info.theme` und `supervised-info.palette`).

### FOUC-Skript

Unmittelbar nach dem Style-Block, noch vor dem schließenden Head, wortgleich:

```html
<script>
(function(){try{var t=localStorage.getItem("supervised-info.theme");var p=localStorage.getItem("supervised-info.palette");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t);if(p==="vintage"||p==="navy")document.documentElement.setAttribute("data-palette",p);}catch(e){}})();
</script>
```

### theme-color

- vintage light: `#f3eee4`
- vintage dark: `#14110e`
- navy light: `#f0f4ff`
- navy dark: `#060c1a`

### chromeColor

```js
function chromeColor(t, p) {
  var dark = t === "dark";
  var vintage = p !== "navy";
  if (vintage) return dark ? "#14110e" : "#f3eee4";
  return dark ? "#060c1a" : "#f0f4ff";
}
function writeShared(t, p) {
  try {
    localStorage.setItem("supervised-info.theme", t);
    localStorage.setItem("supervised-info.palette", p);
  } catch (e) {}
}
```

Nach `applyTheme` / `applyPalette`: Attribute setzen, Button-Labels und `aria-pressed` aktualisieren, `meta[name="theme-color"]` auf `chromeColor(...)`, dann `writeShared` mit **beiden** aktuellen Werten.

### Token-Tabellen (Hub)

Vintage light (`:root`):

```css
:root {
  --paper: #f3eee4;
  --paper-2: #e9e1d2;
  --paper-3: #dfd5c4;
  --ink: #1c1814;
  --muted: #5e564d;
  --rule: #d2c8b8;
  --oxide: #9c3424;
  --oxide-soft: rgba(156, 52, 36, 0.11);
  --slate: #2a5564;
  --ochre: #c4a35a;
  --good: #2c6a4a;
  --hit: rgba(196, 163, 90, 0.32);
  --shadow: 0 18px 50px rgba(28, 24, 20, 0.18);
  --header-bg: #e9e1d2;
  --header-text: #5e564d;
  --glow-1: rgba(156, 52, 36, 0.05);
  --glow-2: rgba(42, 85, 100, 0.045);
  --serif: Palatino, "Palatino Linotype", "Book Antiqua", Georgia, serif;
  --sans: "Segoe UI", system-ui, -apple-system, sans-serif;
}
html[data-theme="light"] { color-scheme: light; }
```

Vintage dark (`html[data-theme="dark"]`):

```css
html[data-theme="dark"] {
  --paper: #14110e;
  --paper-2: #1d1915;
  --paper-3: #2a241d;
  --ink: #f3eee4;
  --muted: #b3aa9c;
  --rule: #3d362c;
  --oxide: #e07060;
  --oxide-soft: rgba(224, 112, 96, 0.16);
  --slate: #8eb8c8;
  --ochre: #d4b56c;
  --good: #7dba96;
  --hit: rgba(212, 181, 108, 0.22);
  --shadow: 0 18px 50px rgba(0,0,0,0.45);
  --header-bg: #1d1915;
  --header-text: #f3eee4;
  --glow-1: rgba(224, 112, 96, 0.08);
  --glow-2: rgba(142, 184, 200, 0.06);
  color-scheme: dark;
}
```

Navy light (`html[data-palette="navy"]`):

```css
html[data-palette="navy"] {
  --paper: #f0f4ff;
  --paper-2: #ffffff;
  --paper-3: #e8ecf8;
  --ink: #08102a;
  --muted: #4a6080;
  --rule: #bfcfe8;
  --oxide: #2060df;
  --oxide-soft: #dce6ff;
  --slate: #2060df;
  --ochre: #d97706;
  --good: #059669;
  --hit: rgba(32, 96, 223, 0.18);
  --shadow: 0 18px 50px rgba(8, 16, 42, 0.18);
  --header-bg: #08102a;
  --header-text: #ffffff;
  --glow-1: rgba(74, 148, 255, 0.08);
  --glow-2: rgba(32, 96, 223, 0.06);
}
```

Navy dark (`html[data-palette="navy"][data-theme="dark"]`):

```css
html[data-palette="navy"][data-theme="dark"] {
  --paper: #060c1a;
  --paper-2: #0c1828;
  --paper-3: #102038;
  --ink: #edf2ff;
  --muted: #6e8fb0;
  --rule: #1b2f4a;
  --oxide: #4a94ff;
  --oxide-soft: #0a1e40;
  --slate: #4a94ff;
  --ochre: #fbbf24;
  --good: #34d399;
  --hit: rgba(74, 148, 255, 0.22);
  --shadow: 0 18px 50px rgba(0,0,0,0.45);
  --header-bg: #060c1a;
  --header-text: #edf2ff;
  --glow-1: rgba(74, 148, 255, 0.08);
  --glow-2: rgba(32, 96, 223, 0.06);
}
```

Keine weiteren Paletten.

---

## 7. Seitengerüst

Jede Seite (Hub und Unterseiten) folgt demselben Kopf. Skip-Link zuerst, dann Wrap, Mast mit Kicker und den zwei Buttons, danach `h1` und Lede.

```html
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>…</title>
<meta name="description" content="…">
<meta name="theme-color" content="#f3eee4">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22%3E%3Crect fill=%22%231c1814%22 width=%2232%22 height=%2232%22/%3E%3Cpath fill=%22none%22 stroke=%22%23e8d9c0%22 stroke-width=%221.4%22 d=%22M16 4 L28 28 H4 Z%22/%3E%3C/svg%3E">
<style>
  /* Token aus Abschnitt 6, plus Seiten-CSS über var(--…) */
  :focus-visible { outline: 2px solid var(--oxide); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }
</style>
</head>
```

FOUC-Skript aus Abschnitt 6 zwischen Style-Block und schließendem Head einfügen. Danach:

```html
<body>
<a class="skip" href="#inhalt">Zum Inhalt springen</a>
<div class="wrap">
  <header class="mast">
    <p class="kicker"><a href="../">supervised-info</a> · 01</p>
    <div class="mast-actions">
      <button type="button" class="iconbtn" id="paletteBtn" aria-pressed="true" title="Farbschema">Blau</button>
      <button type="button" class="iconbtn" id="themeBtn" aria-pressed="false">Dunkel</button>
    </div>
  </header>
  <h1 id="inhalt">Titel</h1>
  <p class="lede">Ein Satz, worum es geht.</p>
  <!-- Inhalt -->
</div>
<script>
  /* chromeColor, writeShared, applyTheme, applyPalette: Abschnitt 6 */
</script>
</body>
</html>
```

Hub: kein Kicker-Link nach oben, stattdessen der Text `supervised-info` im Mast. Skip-Ziel und Lede-Klasse dürfen zur Seite passen (`#search`, `#add`; `.dek` statt `.lede`).

---

## 8. Seitentypen

### Essay (`relativitaetstheorie/`)

Eine Datei: `index.html`. Langer Lesetext, Inhaltsverzeichnis, Demos inline. Lesespalte, Serif für Fließtext. Recherche-Karte 01, CTA Lesen.

### Tabelle (`elektroautos/`)

`index.html` plus `app.js` plus `data.json`. Volle Viewport-Fläche, Suche und Filter. Daten liegen neben der Seite, relative Pfade. Tools-Karte 01, CTA Öffnen.

### Offline-PWA (`einkauf/`)

Nur diese Seite ist eine PWA: `manifest.webmanifest`, `sw.js`, Icons. Eigener Speicher `einkauf_v1` (nicht die Theme-Schlüssel). Service Worker nur hier registrieren.

Bei jedem Deploy den Cache-Namen in `sw.js` hochzählen (`einkauf-offline-v4`, dann `v5`, …), sonst bleiben alte Assets im Cache. Strategie: network-first, Cache als Fallback. `start_url` und `scope` relativ (`./`). Tools-Karte 02, CTA Öffnen.

---

## 9. Neue Seite anlegen

1. Im Repo-Root einen Ordner ohne Umlaute, darin `index.html`.
2. Token, FOUC-Skript, Skip-Link, Mast, Palette- und Theme-Button, `chromeColor` plus `writeShared` (beide Schlüssel) übernehmen.
3. CSS/JS inline, außer große Daten. Nur relative Pfade. `lang="de"`. Tipziele um 44px, `focus-visible`, `prefers-reduced-motion`.
4. PWA-Dateien nur, wenn die Seite offline stehen muss.
5. Eine Karte in die richtige `ol.cat` auf dem Hub: nächste Nummer **in diesem Tab**, Titel, ein Satz, Lesen oder Öffnen.
6. Kicker der Unterseite: `supervised-info · NN` mit `../`, NN = diese Tab-Nummer.
7. Push auf `main`. GitHub Pages liefert den Branch aus.

### Nicht tun

- Das Repo forken und als zweite Quelle pflegen.
- Jekyll, Node-Paketverwaltung, Bundler oder andere Build-Schritte einziehen.
- Absolute Site-Pfade (`/foo/`) verwenden.
- Weitere Paletten neben vintage und navy.
- Nummern über Tabs hinweg durchzählen (Einkauf ist Tools 02, nicht 03).
