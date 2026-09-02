# Regenerationsspec: `einkauf/index.html`

Stand der Live-PWA: **2026-09-02**. Nur diese Spec anfassen; HTML/CSS/JS/`sw.js` nicht ändern.

## Zweck

Einkaufsliste nach Ladenweg (Abteilungen von Eingang bis Kasse), Checkboxen, Stamm-Artikel als `{name,dept}`, mehrere Laden-Layouts, abteilungsübergreifendes Drag, Offline-PWA. Tools-Karte 02.

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

- Shared Keys + FOUC (`supervised-info.theme` / `supervised-info.palette`). Palette `#paletteBtn` (Label Creme↔Blau); Theme-Button **ID `theme-btn`** (JS akzeptiert auch `themeBtn`; Label Hell↔Dunkel).
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
- Toolbar: `#store` Select „Laden“, `#count` live („N offen, M erledigt“), `#btn-walk` Geh-Modus, Stamm-Menü, Burger `#btn-more`.
- `#status` role=status; `#list` Abteilungen.

### Einstellungen-Sheet

- Aktueller Laden `#sheet-store`.
- `#layout-list` sortierbare Abteilungen (Grip nur **innerhalb** der Layout-Liste; plus Nach oben / Nach unten / Entfernen); Hinweis: Vor dem Einkauf immer vorn, Nach dem Einkauf immer hinten, Sonstiges direkt davor.
- Unused-Chips Abteilungen hinzufügen; „Layout zurücksetzen“ (nur builtin).
- Laden anlegen (`#new-store-name` max 60, Enter); „Übernimmt das aktuelle Layout.“; Laden löschen (nicht builtin).
- Läden speichern/laden JSON (`kind: "einkauf-laeden"`).
- Stamm-Artikel `#staple-list`: anlegen (`#new-staple` max 60, Enter), Abteilung editieren (Select → `staples[i].dept` + `mappings[mappingKey(name)]`), Reihenfolge (Nach oben / Nach unten), löschen.

### Stamm-Menü

`#btn-staple-menu` „Stamm“. Erstes Item immer **Gesamtliste** (`applyAllStaples`: fehlende Artikel anlegen, erledigte wieder öffnen, schon offene zählen). Danach ein Chip pro Stamm-Artikel (`tapStaple`). Leer: Status „Noch keine Stamm-Artikel. In den Einstellungen anlegen.“

### Burger-Menü

Deutsche Labels, Reihenfolge: Liste in Zwischenablage; Daten importieren (`.md/.txt`); Liste als Datei exportieren; Liste teilen (`navigator.share`, Button hidden wenn fehlend); nach Bring exportieren; nach Erinnerungen exportieren; Backup teilen/speichern/laden; Erledigte löschen; Einstellungen.

## Abteilungen `DEPTS`

`vor` Vor dem Einkauf; `obst` Obst & Gemüse; `brot` Brot & Backwaren; `bedienung` Fleisch, Wurst, Käse; `kuehlung` Kühlregal; `tiefkuehl` Tiefkühl; `trocken` Trockenwaren; `suess` Süßwaren & Snacks; `getraenke` Getränke; `drogerie` Drogerie & Haushalt; `sonstiges` Sonstiges; `nach` Nach dem Einkauf.

Gruppen-Reihenfolge: `vor` zuerst, dann Layout ohne vor/nach/sonstiges, dann übrige Depts mit Items, dann `sonstiges`, dann `nach`. Leere Depts nicht rendern.

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

`id` = `i` + time36 + random. `guessDept(name)` Keyword-Wörterbuch `DICT_SRC` + Sonderregeln (TK, Eistee, Schorle, Chips, Eis). `mappings[mappingKey(name)]` überschreibt Abteilung (Select **und** Cross-Dept-Drop schreiben denselben Key). Sort in Dept: `ord`, dann `added`, dann `localeCompare` de.

UI je Item: Checkbox, Name (Klick rename; Enter speichern, Escape abbrechen), Dept-Select, Drag-Handle, Löschen `×`. Empty: „Noch nichts auf der Liste.“

**Drag (Artikel):** Pointer-Drag am Grip, Slop `DRAG_SLOP = 8`. **Nicht** intra-dept-only: `findItemDrop` prüft alle `.dept`-Sections. Drop auf Zeile (before/after der Mitte) oder auf Abteilungs-`h2` (`mark: "target"`). Abteilungswechsel setzt `item.dept` und `mappings[mappingKey(name)]` wie der Dept-Select. Layout-Zeilen ziehen nur innerhalb `#layout-list`.

Geh-Modus: `body.walk` — Button-Label „Bearbeiten“, `aria-pressed` true; kein Grip/Select/Delete, Name nicht editierbar (CSS + Render). Persistiert.

**Stamm:** `staples` ist **`{ name, dept }[]`**, kein `string[]`. `sanitizeStaples` akzeptiert alte String-Backups und neue Objekte (Name trimmen, Duplikate via `mappingKey`, ungültiges `dept` → `guessDept`). Menü: Gesamtliste + Chips; Settings: anlegen / Dept / Reorder / löschen.

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
  staples: [{ name, dept }]
}
```

Save schreibt **kein** `palette` ins einkauf_v1-Objekt (nur theme + Rest). Palette nur Shared Key.

## Export / Import Formate

**Markdown Liste** (`# Einkauf — {Laden}` + `## {Dept}` + `- [x] ` / `- [ ] ` Name):

- Zwischenablage, Download `einkauf-{slug}.md` (Dateiname mit Zeitstempel via `stampedFilename`), Share `{ title, text }`.
- Import: Überschriften → Dept; Checkbox, Bullet oder nummerierte Liste; führende `NN ` (Bring-Nummern) strippen. Confirm ersetzen vs. anhängen wenn Liste nicht leer. JSON-Läden-Datei wird in demselben Import-Pfad erkannt (`tryImportStoresText`).

**Bring:** offene Items als `01) Name`; Deeplink `https://deeplink.getbring.com/import?type=RECIPE&src=` + b64 eines Parser-URLs `https://api.getbring.com/rest/bringrecipes/parser?url=`. Zu lang (>7500): Text kopieren. Bleibt im HTML-Menü; Produktrichtung ist Watch-im-Laden, nicht Bring.

**Erinnerungen:** offene Namen, Zeilen `\r\n`; Clipboard + Hinweis „In Erinnerungen einfügen, dann in mehrere aufteilen.“

**Läden JSON** `kind: "einkauf-laeden"`, `v: 1`, currentStoreId, stores, mappings. Datei `einkauf-laeden.json`. Import Confirm ersetzen/dazunehmen; Seeds mergen. Nur HTML.

**Backup JSON** — gleiche Form wie die native iOS-App:

```
{
  kind: "einkauf-backup",
  v: 1,
  currentStoreId,
  stores: [{ id, name, layout[], builtin }],
  mappings,
  items: [{ id, name, dept, done, added, ord }],
  walkMode,
  layoutTrip: 1,
  staples: [{ name, dept }]
}
```

Share oder Download `einkauf-backup.json`. Import Confirm ersetzt Liste und Läden.

Escape schließt Menüs/Sheet. Enter in neuen Laden/Stamm legt an.

## Native Begleit-App (nur dokumentieren, nicht nachbauen)

https://github.com/supervised-info/einkauf-watch — iPhone + Apple Watch. Brücke ist **nur** die Backup-JSON-Datei (kein Live-localStorage-Sync, die App scrapt die PWA nicht).

Dieses Delta **bleibt bewusst** und darf von Regeneratoren **nicht geschlossen** werden:

- **Nur HTML / in dieser Spec behalten:** Markdown kopieren / Datei exportieren / teilen; Import `.md`/`.txt`; **nach Bring exportieren**; **nach Erinnerungen exportieren**; extra Läden-JSON `kind: "einkauf-laeden"`.
- **Nur native / nicht ins HTML:** Erscheinungsbild **System** (folgt iPhone-Appearance) plus Hell/Dunkel und Creme/Blau **nur in den Einstellungen**, nicht in der engen Toolbar. HTML behält die Site-Mast-Buttons Theme + Palette (`theme-btn`, `#paletteBtn`) und die Shared Keys `supervised-info.theme` / `supervised-info.palette`.
- Watch ist nur Geh-Modus (Checkbox + Name). Ladenwahl nur auf dem iPhone.
- Bring bleibt im HTML-Menü (dokumentieren), die Richtung ist Watch-im-Laden, nicht Bring.

## CSS

`.walk` versteckt Edit-Controls; Sheet von rechts; Tipziele ~44px; `body.locked` overflow hidden bei Sheet.

## Nicht ändern

- SW-Cache-Namen nur nach oben bumping, nie stillschweigend gleich lassen nach HTML-Änderung.
- Builtin-Laden-IDs und DEPT-IDs.
- Storage-Key `einkauf_v1` (kein Theme-Key-Reuse für die Liste).
- Bewusstes Delta zur nativen App (siehe oben) nicht angleichen.

## Akzeptanzkriterien

- [ ] Offline nach erstem Besuch (SW v-Bump).
- [ ] Add rät Abteilung; Checkbox; Pointer-Drag **abteilungsübergreifend** (Zeile oder `h2`); Mapping wie Dept-Select; Geh-Modus persistiert.
- [ ] Stamm `{name,dept}[]`; `sanitizeStaples` akzeptiert alte Strings; Settings anlegen/Dept/Reorder/löschen; Menü Gesamtliste + Chips (`tapStaple`).
- [ ] MD/Backup/Läden roundtrip; Backup-Shape wie native App; Bring-Link oder Fallback-Kopie.
- [ ] Palette/Theme site-weit; Theme-Button-ID `theme-btn`; Palette nicht in `einkauf_v1`.
- [ ] Kicker 02, navy Favicon, Skip zur Eingabe.
- [ ] Native-Delta bleibt (kein System-Theme in der Toolbar, keine HTML-Features in der Watch-App schließen).
