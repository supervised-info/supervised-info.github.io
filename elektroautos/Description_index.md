# Regenerationsspec: `elektroautos/index.html`

## Zweck

Vollflächige Vergleichstabelle für Elektrofahrzeuge: Suche, Filter, Spaltengruppen, Merken (Pins), Präferenz, Detail-Sheet, CSV/JSON Export/Import. Tools-Karte 01 auf dem Hub (CTA Öffnen).

## Datei-Ort, Abhängigkeiten

Drei Dateien, **kein** Single-File:

- `elektroautos/index.html` — Shell, CSS, FOUC, Markup
- `elektroautos/app.js` — gesamte Logik (`defer`)
- `elektroautos/data.json` — `{ fahrzeuge: [...], letzte_aktualisierung?, daten_stand? }` (~395 Modelle)

Relative Pfade `./app.js`, `./data.json`. `fetch("./data.json")`; bei Fehler eingebetteter FALLBACK mit 2 Notdatensätzen (BMW iX1 eDrive20, Tesla Model 3 Long Range) und Notice.

Zusätzlich: `CHANGELOG-2026-08.md` (nicht für die App nötig).

## Chrome

- Shared Keys + FOUC. Buttons: **zuerst** `#filterBtn` „Filter“, dann `#paletteBtn`, dann `#themeBtn`. (Filter ist extra, Palette bleibt vor Theme.)
- Favicon navy `#0d1f6e`.
- Skip: `<a class="skip" href="#search">Zur Suche</a>`.
- Kicker **Ist-Zustand**: `<p class="kicker"><a href="../">supervised-info</a> · 02</p>` (DESIGN sagt Tools 01 — **HTML hat 02**, so regenerieren).
- `html, body { height: 100%; }`, `.shell` 100dvh Flex-Spalte.
- `meta theme-color` initial `#f0f4ff` (Navy-Light First-Paint in `:root` dieser Seite — Abweichung: Elektroautos startet visuell navy in `:root`, Vintage kommt über `html[data-palette="vintage"]`). FOUC setzt Attribute vor Paint, wenn Keys gesetzt.
- `referrer` `strict-origin-when-cross-origin`.
- Extra Token `--mono`, `--rail: 19.25rem`.

## Layout

- Mast: Kicker + Filter/Palette/Theme; `h1` „Elektroautos, im Vergleich“; Hero: `#search` Placeholder „Suche: Marke, Modell, Antrieb…“ + `#matchCount` `aria-live="polite"` (Start „Lade Daten…“).
- `.work` Grid `--rail` | 1fr. Klasse `.filters-off` blendet Rail aus (Desktop).
- Rail `#rail` „Eingrenzen“, `#closeRail` „Schließen“:
  - Klasse-Chips: Pkw / Camper / Nutzfahrzeug (`data-class` pkw|camper|nutz). Default Pkw an.
  - Status: Aktuell / Veraltet / eingestellt (`data-st` aktuell|alt). Default aktuell an.
  - Spannen `#ranges` (dynamisch)
  - Auswahl `#picks` (dynamisch)
  - Ausstattung `#toggles`
  - `#resetBtn` „Filter zurücksetzen“ (Pins und hiddenGroups bleiben)
- Stage: `#toolbar`, `#importBar`, `#notice`, Tabelle `#grid` (caption „Vergleichstabelle der Elektrofahrzeuge“), `#empty`, `#compare`, Footer `#foot`.
- Detail: `#scrim` + `#sheet` Dialog.
- ≤860px: Rail Off-Canvas, Scrim; sticky-Spalten s1/s3 nicht sticky.

## Spalten (`COLUMNS` in app.js)

Sticky 0–3: Pin-Checkbox, Pref (`user_wish` 1–10), Modell (Link), Marke.

Weitere Keys (Label): autotyp Segment; preis.basispreis_eur Preis; WLTP min/max; 0-100 s; kW; kWh; DC kW; Antrieb; WP bool; Status; Einstellgrund (`whenAlt`); ADAC; NCAP + Erw/Kind/Fuß/Assi %; PS; Nm; Vmax; Motoren; Motortyp; kWh brutto; Volt; Chemie; Zelltyp; 10-80 min; AC kW; AC opt.; V2L; P&C; Vorkond.; WLTP kWh; Winter km; Autobahn km; Länge/Breite/Höhe/Radst mm; Sitze; Wendk.; cw; Gew. kg; Kofferr. L; Koff. max L; Frunk; Frunk L; AHK; OTA; Vers. €/J; Wartung; Wartung €; Wartung relevant für Garantie; Nutzlast; Achsen; Achskonf.; Laderaum m3; Führerhaus; Prod.land; Modelljahr; Links.

Gruppen `GROUPS`: Sicherheit, Motor, Batterie, Laden, Reichweite, Abmessungen, Specs, Kosten, LKW. Default **alle Gruppen hidden** außer identity-Spalten.

## Filter / Suche

- `SEARCH_KEYS`: marke, modell, autotyp, plattform, modelljahr, id, antrieb.konzept, batterie.chemie, produktionsland, bemerkung, hinweis, status. Fold: ä→ae usw.
- Numerische Tokens z. B. `400km`, `30k`, `<=8s` mit Units kwh|kw|km|k|s|eur.
- Klasse via `vehicleClass()`: autotyp/marke/modell Regex sattelzug|trucks|elektro-transporter → nutz; camper → camper; sonst pkw.
- RANGE_DEFS: preis €, wltp km, accel 0–100 s, dc kW, kwh kWh. Dual-Range + Zahlfelder.
- Picks: marken, segments, drives, chemie — Suche in der Liste, „alle“/keine.
- Toggles: Allrad, Wärmepumpe, AC 22 kW, V2L, Plug & Charge, Frunk, Präferenz gesetzt.
- Spaltenfilter `.col-filter` wenn `showColFilters`.
- Sort: Klick thead `data-sort`, default `marke` asc. Pins oben.

## Pins / Compare / Sheet

- Max 4 Pins (`MAX_PINS`); ältester fällt raus. Compare-Panel, Default `compareDiffOnly: true`. COMPARE_KEYS siehe app.js.
- Zeilenklick oder Enter öffnet Sheet „Steckbrief“ (Gruppen Antrieb/Laden/Reichweite/Maße…). Escape/Scrim/Schließen.
- `user_wish` 1–10 in localStorage `elektroautos_wish` Map id→zahl.

## Persistenz / Hash

Prefix `elektroautos_`:

| Key | Inhalt |
|---|---|
| `elektroautos_state` | JSON: q, classes, status, range, marken, segments, drives, chemie, tog, hiddenGroups, pins, sortCol, sortDir, colFilters, showColFilters, compareDiffOnly, dataStamp |
| `elektroautos_wish` | `{ [id]: number }` |
| `elektroautos_filters` | `"on"` \| `"off"` (Rail sichtbar) |
| `elektroautos_theme` / `elektroautos_palette` | Legacy; Init liest zuerst shared Keys, sonst diese |

Hash-Query (replaceState): `q`, `cls`, `st`, `preis`/`wltp`/`accel`/`dc`/`kwh` als `min-max`, `mk`/`sg`/`ch` mit `|`, `dr`/`t` mit Komma. Hash gewinnt bei Restore der Ranges wenn vorhanden.

## Toolbar-Aktionen (dynamisch in `#toolbar`)

Gruppen-Chips inkl. `__all__` (alle Gruppen ein/aus). Buttons CSV (`btnCsv`), JSON (`btnJson`), Spaltenfilter (`btnColF`), Datei-Input Import JSON mit `fahrzeuge[]`. ImportBar: Zusammenführen (by id) / Ersetzen / Abbrechen. Notice: Import ändert nicht `data.json`.

CSV: Semikolon, BOM, de-DE Komma in Zahlen, bool Ja/Nein. JSON-Export: gefilterte `fahrzeuge` + Meta. Dateinamen `elektroautos.csv` / `.json`.

## Shortcuts

- `/` fokussiert Suche (nicht in input/textarea/select)
- `Escape` schließt Sheet, sonst Rail

## data.json Fahrzeug-Shape (Kern)

`id`, `modell`, `marke`, `modelljahr`, `plattform`, `autotyp`, `status`, `user_wish`, `produktionsland`, `antrieb{konzept,anzahl_motoren,motortyp,achskonfiguration}`, `leistung{systemleistung_kw,ps,drehmoment_nm,beschleunigung_0_100_s,hoechstgeschwindigkeit_kmh}`, `batterie{brutto/netto_kwh,chemie,systemspannung_v,zelltyp,...}`, `laden{ac_serie_kw,ac_optional_kw,dc_max_kw,dc_10_80_min,v2l,plug_and_charge,vorkonditionierung,...}`, `verbrauch{wltp_reichweite_km{min,max}, wltp_kwh_100km, realreichweite_winter_km, realreichweite_autobahn_130_km}`, `abmessungen{...}`, `fahrwerk.waermepumpe`, `preis.basispreis_eur`, `euro_ncap`, `adac_note`, `produkt_url`, `bild_url`, `bemerkung`, `hinweis`, `eingestellt_grund`, `ota_updates`, `service{...}`. Ranges oft `{min,max}`.

## CSS-Besonderheiten

Sticky thead `var(--header-bg)`; Zeilen `.pinned` / `.stale`/`.alt` rötlich; `.hit` Suchtreffer; vintage thead col-filter invertieren.

## Nicht ändern

- Nicht die 395 Datensätze erfinden — `data.json` wiederverwenden.
- Fallback-IDs `fb1`/`fb2` und Notice-Text bei file:// ohne Server.
- Kicker `· 02` wie Ist-HTML.

## Akzeptanzkriterien

- [ ] fetch data.json, Tabelle scrollt, sticky Pin/Pref/Modell/Marke.
- [ ] Default nur Pkw+aktuell; Filter/Suche/Hash/localStorage rund.
- [ ] Max 4 Pins + Compare; Sheet; CSV/JSON; Import merge/replace nur im Speicher.
- [ ] `/` und Escape; Palette/Theme shared + Legacy-Keys.
- [ ] Skip zur Suche, navy Favicon, FOUC.
