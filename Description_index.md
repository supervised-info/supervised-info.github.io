# Regenerationsspec: Hub `index.html`

## Zweck

Startseite der GitHub-Pages-Site [supervised-info](https://supervised-info.github.io/). Katalog eigenständiger Seiten in zwei Tabs (Recherche / Tools). Kein App-Zustand außer Tab-Wahl und Site-Theme.

## Datei-Ort, Abhängigkeiten

- Datei: `/index.html` (Repo-Root), **eine Datei** (CSS + JS inline).
- Kein `app.js`, keine PWA.
- Sibling: `DESIGN.md`, `.nojekyll`.
- Links relativ: `relativitaetstheorie/`, `elektroautos/`, `einkauf/`, `todo/`, `braindump/`, `t-konto/`.


## Gemeinsames Chrome (alle Seiten)

Quelle: `DESIGN.md` + Skill `seiten-farbschema`. Nicht erfinden.

- `lang="de"`, deutsche UI, relative Pfade, kein Bundler, kein Jekyll.
- CSS-Token über `var(--paper)` etc.; kanonische Tabellen in `DESIGN.md` Abschnitt 6 (Vintage light `:root`, Vintage dark `html[data-theme="dark"]`, Navy light `html[data-palette="navy"]`, Navy dark `html[data-palette="navy"][data-theme="dark"]`).
- localStorage: `supervised-info.theme` = `light`|`dark` (Fallback `prefers-color-scheme`); `supervised-info.palette` = `vintage`|`navy` (Fallback `vintage`).
- Attribute `data-theme` / `data-palette` am `<html>`. Erster Paint Vintage-Hell in `:root`.
- FOUC-Skript wortgleich unmittelbar nach `</style>`, vor `</head>`:
  ```html
  <script>
  (function(){try{var t=localStorage.getItem("supervised-info.theme");var p=localStorage.getItem("supervised-info.palette");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t);if(p==="vintage"||p==="navy")document.documentElement.setAttribute("data-palette",p);}catch(e){}})();
  </script>
  ```
- Buttons in `.mast-actions`, Reihenfolge: `#paletteBtn` dann Theme-Button. Labels: Palette vintage → **Blau** `aria-pressed="true"`; navy → **Creme** `aria-pressed="false"`. Theme light → **Dunkel** `aria-pressed="false"`; dark → **Hell** `aria-pressed="true"`.
- Bei jedem Umschalten **beide** Schlüssel schreiben. `meta[name="theme-color"]` via `chromeColor`: vintage light `#f3eee4`, vintage dark `#14110e`, navy light `#f0f4ff`, navy dark `#060c1a`.
- Favicon Inline-SVG TS-Kachel `rx=6`, weißer Text „TS“: **Hub** Fill `#004225`; **jede Unterseite** Fill `#0d1f6e`.
- `:focus-visible { outline: 2px solid var(--oxide); outline-offset: 2px; }`; `prefers-reduced-motion` killt Animation/Transition/`scroll-behavior`.
- Typo: `--serif` Palatino…, `--sans` Segoe UI…. Glow auf `body::before` (zwei radiale Gradienten).
- Unterseiten-Kicker-Muster laut DESIGN: `supervised-info · NN` mit Link `../`. Hub: Text `supervised-info` ohne Link nach oben.


## Chrome (diese Seite)

- **Kein Skip-Link** (Abweichung vom DESIGN-Gerüst; so ist die aktuelle Datei).
- Mast: `<span>supervised-info</span>` (kein `../`-Link), `.mast-actions` mit `#paletteBtn` (Default-HTML: Blau, `aria-pressed="true"`) und `#themeBtn` (Dunkel).
- Favicon: **grün** `#004225` (nur Hub).
- Theme-Color Initial: `#f3eee4`.
- Skip-Ziel n/a. `h1` ist direkt im Wrap.

## Layout / UI-Elemente

- `.wrap` Breite `min(42rem, calc(100% - 2.4rem))`, zentriert, `body` flex-column `min-height: 100vh`.
- `h1`: „Anschauung,<br>nicht Ersatz.“ Serif, `clamp(2.4rem, 8vw, 4.4rem)`, letter-spacing `-0.03em`.
- `.dek`: „Eine wachsende Kollektion eigenständiger Seiten. Jede Datei steht für sich.“
- Tabs `role="tablist"` `aria-label="Bereiche"`:
  - `#tab-recherche` → `#panel-recherche`
  - `#tab-tools` → `#panel-tools` (initial `hidden` im Markup; JS setzt nach Hash/Storage)
- Karten `ol.cat` → `a.card` Grid `3.2rem 1fr auto`: `.num` zweistellig, `h2`, ein Satz, `.go` CTA.
- **Recherche** (Nummerierung startet bei 01):
  1. `01` Relativitätstheorie, anschaulich — „Lichtuhr, Eigenzeit, Zwillingswege und die Krümmung, in der wir fallen.“ CTA `Lesen →` → `relativitaetstheorie/`
- **Tools**:
  1. `01` Elektroautos, im Vergleich — „Preis, Reichweite, Laden — 395 Modelle, Stand August 2026.“ CTA `Öffnen →` → `elektroautos/`
  2. `02` Einkaufsliste — „Mit Checkboxen, nach Ladenweg sortiert — von Eingang bis Kasse.“ → `einkauf/`
  3. `03` To-Do Liste — „Aufgaben mit Person, Priorität und Enddatum — lokal speichern, importieren, exportieren.“ → `todo/`
  4. `04` BrainDump — „Gedanken als Knoten auf einer Canvas — verknüpfen, filtern, speichern.“ → `braindump/`
  5. `05` T-Konto Verwaltung — „Buchungssätze erfassen und T-Konten für die Buchhaltung automatisch erzeugen.“ → `t-konto/`
- Bestehende Hub-CTAs behalten ASCII-Pfeile `Lesen →` / `Öffnen →`. Neue Texte ohne Pfeile (DESIGN).
- Footer: „Keine Werkzeugkette. Statische Dateien, absichtlich.“
- `@media (max-width: 560px)`: CTA `.go` ausblenden, Grid ohne dritte Spalte.

## Verhalten / Interaktionen

- Palette/Theme wie Shared Chrome; IDs `#paletteBtn` / `#themeBtn`.
- Tab-Umschalten: `aria-selected`, `panel.hidden`.
- `showTab(id)` speichert Tab und setzt Hash: Recherche → `#` (leer, `history.replaceState`), Tools → `#tools`.
- Start-Tab: Hash `#tools` / `#recherche` **gewinnt** vor localStorage, sonst gespeicherter Tab, sonst `recherche`.
- Keine Tastatur-Shortcuts außer nativen Tabs/Links.

## Datenmodell

- `supervised-info.hub-tab` = `recherche` | `tools`
- Plus die zwei Site-Keys (siehe Chrome).

## Wichtige CSS-Token / Besonderheiten

- Hub-`:root` ist Vintage-Hell (kanonisch). Navy überschreibt über `data-palette`.
- `.tab[aria-selected="true"]` Unterstrich `var(--oxide)`.
- `.num` und `.go` in `--oxide`, sans, uppercase tracking.
- Kein `prefers-reduced-motion`-Block in der aktuellen Hub-Datei (nur `html { scroll-behavior: smooth }`). Beim Regenerieren **den DESIGN-Motion-Block hinzufügen ist erlaubt, aber nicht Pflicht**; Ist-Zustand hat ihn nicht.

## Nicht ändern / Constraints

- Katalogtexte und Modellzahl „395 Modelle, Stand August 2026“ nur ändern wenn Datenstand der Elektroauto-Seite sich ändert.
- Tab-Nummern **pro Tab**, nicht global (Einkauf bleibt Tools 02).
- Keine CDN, keine Root-Pfade `/foo/`.

## Akzeptanzkriterien

- [ ] `lang="de"`, grünes TS-Favicon, FOUC-Skript, Palette+Theme schreiben beide Keys.
- [ ] Zwei Tabs, Hash `#tools` öffnet Tools, Reload ohne Hash merkt letzten Tab.
- [ ] Sechs Karten, relative Ordner-Links, CTAs wie oben.
- [ ] Footer-Satz vorhanden.
- [ ] Funktioniert per file:// und GitHub Pages.
