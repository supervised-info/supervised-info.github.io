# Regenerationsspec: `regelwerk-analysator/index.html`

## Zweck

Lokaler Excel/CSV-Analysator für Regelwerke (EPOS, Dimensionen, Sachkonten, Kontenplan). Findet Merkmal-Überschneidungen und Kennzahl-Konflikte. Hub Tools **Beruf II**. **Eine Datei** — SheetJS 0.18.5 inline, kein CDN, kein `app.js`. Analyse-State nur im RAM.

## Datei-Ort, Abhängigkeiten

- `regelwerk-analysator/index.html` (CSS + FORCE_TABS + SheetJS + Analyse-JS + Theme-JS inline)
- Sibling-Spec: diese Datei
- Relativer Hub-Link im Kicker: `../`

## Chrome

- Shared Keys, FOUC wortgleich, `#paletteBtn` dann `#themeBtn` in `.mast-actions`.
- Labels: Creme/Blau, Hell/Dunkel. Beide Keys bei jedem Umschalten.
- Favicon navy `#0d1f6e`. Skip `href="#inhalt"` „Zum Inhalt springen“.
- Kicker `supervised-info · II` → `../`.
- `referrer` strict-origin-when-cross-origin.
- Token-Tabellen wie Hub/`t-konto/` (Vintage-Hell in `:root`).
- Mast sitzt **über** `.app`. `h1#inhalt` „Regelwerk-Analysator“, Lede `.subtitle`.

## Layout / Tabs

Sichtbare Reiter steuert `applyTabFilter()`:

Priorität: `FORCE_TABS` (Konstante oben in der Datei) > URL `?tabs=` > alle.

Aliase: `vorgaben`, `analyse`, `knzuebersicht`, `vergleich`, `dimension`, `sako`, `kontenplan`; Kombi `epos` → analyse + knzuebersicht + vergleich.

Tab-Buttons `.tab-btn` mit Gruppenfarben: kontenplan, vorgaben, epos, dimension, sako.

### Reiter

- `kontenplan` — CSV Kontenplan-Baum, Set 1/2, analysieren / Versionen vergleichen
- `vorgaben` — CSV Vorgabenanalyse für EPOS
- `analyse` — `.xlsx` Regelanalyse (Merkmale/Zuordnungen), Namensfilter, Picker, Merkmal/Wert-Suche
- `knzuebersicht` — Merkmals- und Kennzahlverwendung
- `vergleich` — Versionsvergleich zweier Regelwerk-Sets
- `dimension` — Dimensionsanalyse
- `sako` — Sachkontenableitung (`.xlsx`/`.xlsm`)

Drop-Zonen, File-Tags, Primary-Buttons, Ergebnis-Container bleiben IDs der Quelldatei (`dropZone`, `fileInput`, `sako-input-1`, …).

## SheetJS

Kommentar `SheetJS 0.18.5 – inline eingebettet`. Global `XLSX` (`XLSX.read`, `XLSX.utils.sheet_to_json`). **Nicht** durch CDN ersetzen, **nicht** auslagern.

## Datenmodell (RAM)

- `state` Regelanalyse: `merkmale`, `zuordnungen`, `filesLoaded`, `activeTarget`
- `diffState` Set 1/2 analog
- Weitere last-Result-Variablen (`lastDiffResult`, `lastSakoResult`, `lastDimResult`, …)
- **Kein** App-`localStorage`. Nur Site-Theme-Keys.

## CSS

Chrome (Hintergrund, Karten, Inputs, Primary, Drop-Zonen, Tab-Leiste inaktiv) über `var(--paper)` / `--ink` / `--rule` / `--muted` / `--oxide`. Semantikfarben der Gruppen und Diff/Tree-Highlights dürfen hardcodiert bleiben.

`.btn-ghost` für Leeren-Buttons. `prefers-reduced-motion`, `:focus-visible`.

## Nicht ändern

- SheetJS-Bundle und Analyse-Logik (Parser, Filter, Exporte).
- `FORCE_TABS`-Konstante und Alias-Tabelle.
- IDs der Datei-Inputs, Drop-Zonen, Ergebnis-Container.
- Kicker II. App-Daten nicht in Theme-Keys speichern.

## Akzeptanzkriterien

- [ ] Eine Datei, offline (file://) ohne Netz für Layout und SheetJS.
- [ ] Alle Reiter ohne `?tabs=`; `?tabs=sako` zeigt nur Sachkonten.
- [ ] Site Creme/Blau + Hell/Dunkel am Mast; Skip; navy Favicon.
- [ ] Hub-Karte Beruf II öffnet `regelwerk-analysator/`.
