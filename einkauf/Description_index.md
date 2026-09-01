# Regenerationsspec: `einkauf/index.html`

## Zweck

Einkaufsliste nach Ladenweg (Abteilungen von Eingang bis Kasse), Checkboxen, Stamm-Artikel, mehrere Laden-Layouts, Offline-PWA. Tools-Karte 02.

## Datei-Ort, Abhängigkeiten

PWA (einzige im Repo):

- `einkauf/index.html` (eine HTML-Datei, CSS+JS inline)
- `einkauf/sw.js` — Cache-Name **aktuell** `einkauf-offline-v16`
- `einkauf/manifest.webmanifest`
- Icons: `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`

`start_url` und `scope` relativ `./`. Manifest: name „Einkaufsliste“, short_name „Einkauf“, display standalone, lang de, background/theme `#f3eee4`.

SW: PRECACHE `./`, `index.html`, `manifest.webmanifest`, drei PNG. Strategie network-first, Cache-Fallback; navigate fällt auf `./` bzw. `index.html`. Install `skipWaiting`, activate löscht fremde Caches, `clients.claim`. Seite: `navigator.serviceWorker.register("sw.js", { updateViaCache: "none" })` + `reg.update()`; bei `controllerchange` einmal `location.reload()`.

**Bei jedem Deploy Cache-Namen hochzählen** (`v16` → `v17` …), sonst bleiben alte Assets.

## Chrome

- Shared Keys + FOUC. Palette `#paletteBtn`; Theme-Button **ID `theme-btn`** (JS akzeptiert auch `themeBtn`).
- Favicon navy `#0d1f6e`.
- Skip: `href="#add"` Text „Zur Eingabe“.
- Kicker: `supervised-info · 02` → `../`.
- `html` hat `data-theme="light"` im Markup.
- Apple: `apple-mobile-web-app-capable`, `mobile-web-app-capable`, title „Einkauf“, apple-touch-icon.
- `referrer` strict-origin-when-cross-origin.

## Layout

- Sheet `#sheet` Dialog „Einstellungen“ + Scrim (vor Wrap im DOM).
- Wrap: Mast, `h1` Einkaufsliste, `.lede` „im Ladenweg“.
- Form `#add-form`: `#add` Placeholder „Milch, Äpfel, Klopapier…“, Submit `+`.
- Toolbar: `#store` Select „Laden“, `#count` live, `#btn-walk` Geh-Modus, Stamm-Menü, Burger `#btn-more`.
- `#status` role=status; `#list` Abteilungen.

### Einstellungen-Sheet

- Aktueller Laden `#sheet-store`.
- `#layout-list` sortierbare Abteilungen; Hinweis: Vor dem Einkauf immer vorn, Nach dem Einkauf immer hinten, Sonstiges direkt davor.
- Unused-Chips Abteilungen hinzufügen; „Layout zurücksetzen“.
- Laden anlegen (`#new-store-name` max 60, Enter); „Übernimmt das aktuelle Layout.“; Laden löschen.
- Läden speichern/laden JSON; Stamm-Artikel Liste + Anlegen.

### Burger-Menü

Liste in Zwischenablage; Daten importieren (`.md/.txt`); Liste als Datei exportieren; Liste teilen (`navigator.share`); nach Bring exportieren; nach Erinnerungen exportieren; Backup teilen/speichern/laden; Erledigte löschen; Einstellungen.

## Abteilungen `DEPTS`

`vor` Vor dem Einkauf; `obst` Obst & Gemüse; `brot` Brot & Backwaren; `bedienung` Fleisch, Wurst, Käse; `kuehlung` Kühlregal; `tiefkuehl` Tiefkühl; `trocken` Trockenwaren; `suess` Süßwaren & Snacks; `getraenke` Getränke; `drogerie` Drogerie & Haushalt; `sonstiges` Sonstiges; `nach` Nach dem Einkauf.

Gruppen-Reihenfolge: `vor` zuerst, dann Layout ohne vor/nach/sonstiges, dann `sonstiges`, dann `nach`. Leere Depts nicht rendern.

## Seed-Läden `SEEDS` (builtin, immer mergen)

- edeka: vor, obst, bedienung, brot, kuehlung, tiefkuehl, trocken, suess, getraenke, drogerie, sonstiges, nach
- aldi: vor, obst, brot, kuehlung, tiefkuehl, trocken, suess, getraenke, drogerie, sonstiges, nach
- rewe: vor, obst, brot, bedienung, trocken, suess, kuehlung, tiefkuehl, getraenke, drogerie, sonstiges, nach
- lidl: wie aldi-artig (vor obst brot kuehlung tiefkuehl trocken suess getraenke drogerie sonstiges nach)
- dm: vor, drogerie, trocken, getraenke, sonstiges, nach
- eigenes: vor, sonstiges, nach

Default `currentStoreId`: `edeka`. Builtin-Seeds fehlen nie (merge). Layout-Migration: wenn `layoutTrip !== 1`, `vor`/`nach` erzwingen.

## Artikel-Modell

```
{ id, name, dept, done:boolean, added:number, ord:number }
```

`id` = `i` + time36 + random. `guessDept(name)` Keyword-Wörterbuch `DICT_SRC` + Sonderregeln (TK, Eistee, Schorle, Chips, Eis). `mappings[mappingKey(name)]` überschreibt Abteilung. Sort in Dept: `ord`, dann `added`, dann `localeCompare` de.

UI je Item: Checkbox, Name (Klick rename; Enter speichern, Escape abbrechen), Dept-Select, Drag-Handle (Pointer, slop 8px) für Reorder innerhalb Dept (`ord` anpassen). Empty: „Noch nichts auf der Liste.“

Geh-Modus: `body.walk` — Button-Label „Bearbeiten“, `aria-pressed` true; reduziert Edit/Drag (CSS). Persistiert.

Stamm: `staples[]` Strings; Menü setzt Artikel auf die Liste.

## localStorage `einkauf_v1`

```
{
  theme,                 // auch in App-State; Shared Keys parallel
  currentStoreId,
  items[],
  mappings: { [canonName]: deptId },
  stores: [{ id, name, layout[], builtin }],
  layoutTrip: 1,
  walkMode,
  staples[]
}
```

Save schreibt **kein** `palette` ins einkauf_v1-Objekt (nur theme + Rest). Palette nur Shared Key.

## Export / Import Formate

**Markdown Liste** (`# Einkauf — {Laden}` + `## {Dept}` + `- [x] ` / `- [ ] ` Name):

- Zwischenablage, Download `einkauf-{slug}.md` (Dateiname mit Zeitstempel via `stampedFilename`), Share `{ title, text }`.
- Import: Überschriften → Dept; Checkbox, Bullet oder nummerierte Liste; führende `NN ` (Bring-Nummern) strippen. Confirm ersetzen vs. anhängen wenn Liste nicht leer. JSON-Läden-Datei wird in demselben Import-Pfad erkannt (`tryImportStoresText`).

**Bring:** offene Items als `01) Name`; Deeplink `https://deeplink.getbring.com/import?type=RECIPE&src=` + b64 eines Parser-URLs `https://api.getbring.com/rest/bringrecipes/parser?url=`. Zu lang (>7500): Text kopieren.

**Erinnerungen:** offene Namen, Zeilen `\r\n`; Clipboard + Hinweis „In Erinnerungen einfügen, dann in mehrere aufteilen.“

**Läden JSON** `kind: "einkauf-laeden"`, `v: 1`, currentStoreId, stores, mappings. Datei `einkauf-laeden.json`. Import Confirm ersetzen/dazunehmen; Seeds mergen.

**Backup JSON** `kind: "einkauf-backup"`, `v: 1`, plus items, walkMode, layoutTrip:1, staples. Share oder Download.

Escape schließt Menüs/Sheet. Enter in neuen Laden/Stamm legt an.

## CSS

`.walk` versteckt Edit-Controls; Sheet von rechts; Tipziele ~44px; `body.locked` overflow hidden bei Sheet.

## Nicht ändern

- SW-Cache-Namen nur nach oben bumping, nie stillschweigend gleich lassen nach HTML-Änderung.
- Builtin-Laden-IDs und DEPT-IDs.
- Storage-Key `einkauf_v1` (kein Theme-Key-Reuse für die Liste).

## Akzeptanzkriterien

- [ ] Offline nach erstem Besuch (SW v-Bump).
- [ ] Add rät Abteilung; Checkbox; Drag; Geh-Modus persistiert.
- [ ] MD/Backup/Läden roundtrip; Bring-Link oder Fallback-Kopie.
- [ ] Palette/Theme site-weit; Theme-Button-ID `theme-btn`.
- [ ] Kicker 02, navy Favicon, Skip zur Eingabe.
