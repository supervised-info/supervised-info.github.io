# Regenerationsspec: `einkauf/index.html`

Stand der Live-PWA: **2026-09-04**. Diese Spec beschreibt die Seite so, dass sie daraus neu erzeugt werden kann.

## Zweck

Einkaufsliste nach Ladenweg (Abteilungen von Eingang bis Kasse), Checkboxen, Stamm-Artikel als `{name,dept}`, benannte gespeicherte Listen (`savedLists`), mehrere Laden-Layouts, abteilungsübergreifendes Drag, Offline-PWA. Tools-Karte 02.

## Datei-Ort, Abhängigkeiten

PWA (einzige im Repo):

- `einkauf/index.html` (eine HTML-Datei, CSS+JS inline)
- `einkauf/sw.js` — Cache-Name **aktuell** `einkauf-offline-v22`
- `einkauf/manifest.webmanifest`
- Icons: `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`

`start_url` und `scope` relativ `./`. Manifest: name „Einkaufsliste“, short_name „Einkauf“, display standalone, lang de, background/theme `#f3eee4`.

SW: PRECACHE `./`, `index.html`, `manifest.webmanifest`, drei PNG. Strategie network-first, Cache-Fallback; navigate fällt auf `./` bzw. `index.html`. Install `skipWaiting`, activate löscht fremde Caches, `clients.claim`. Seite: `navigator.serviceWorker.register("sw.js", { updateViaCache: "none" })` + `reg.update()`; bei `controllerchange` einmal `location.reload()`.

**Bei jedem Deploy Cache-Namen hochzählen** (`v22` → `v23` …), sonst bleiben alte Assets. Nie denselben Cache-Namen wiederverwenden.

## Chrome

- Shared Keys + FOUC (`supervised-info.theme` / `supervised-info.palette`). Palette `#paletteBtn` (Label Creme↔Blau); Theme-Button **ID `theme-btn`** (JS akzeptiert auch `themeBtn`; Label Hell↔Dunkel). Theme und Palette sitzen am **Site-Mast**, nicht im Einstellungen-Sheet (kein Block Darstellung / Hell / Dunkel / System dort).
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
- Toolbar: `#store` Select „Laden“, `#count` live (`aria-live`, Format `oo/xx/yy` = offen/erledigt/gesamt, leer `0/0/0`; `aria-label` „X offen, Y erledigt, Z gesamt“), `#btn-hide-done` Auge, `#btn-walk` Geh-Modus, Stamm-Menü, Burger `#btn-more`.
- `#status` role=status; `#list` Abteilungen.

### Einstellungen-Sheet — Reihenfolge

Kein Darstellung-Block (Hell/Dunkel/System/Creme/Blau). Theme bleibt am Mast.

1. **Aktueller Laden** `#store-list`: Liste aller Läden, Tippen setzt `currentStoreId` (Häkchen am aktuellen). Eigene Läden (`!builtin`) haben pro Zeile **Löschen** (Bestätigung „Laden „X“ wirklich löschen?“). Builtin-Seeds sind unlöschbar. Fallback nach Löschen des aktuellen Ladens: `edeka`, sonst erster Rest.
2. **Neuer Laden**: `#new-store-name` max 60, Enter oder „Anlegen“. Hinweis: „Übernimmt das Layout des ausgewählten Ladens.“ `builtin: false`, wird sofort aktuell.
3. **Alle Läden** (nur HTML): JSON speichern/laden `kind: "einkauf-laeden"`.
4. **Ladenweg** `#layout-heading` Text `Ladenweg · {Name}`: `#layout-list` sortierbare Abteilungen (Grip nur **innerhalb** der Layout-Liste; plus Nach oben / Nach unten / Entfernen). Hinweis: Vor dem Einkauf immer vorn, Nach dem Einkauf immer hinten, **Sonstiges folgt der Position im Ladenweg**. Unused-Chips „Abteilung hinzufügen“; „Layout zurücksetzen“ (nur builtin, Seed-Layout).
5. **Stamm-Artikel** `#staple-list`: anlegen (`#new-staple` max 60, Enter), Abteilung editieren (Select → `staples[i].dept` + `mappings[mappingKey(name)]`), Reihenfolge (Nach oben / Nach unten), löschen.
6. **Gespeicherte Listen** `#saved-list-edit`: Tippen auf den Namen **füllt** die aktuelle Liste auf (nicht ersetzen). Pro Zeile **Löschen** (Bestätigung „Gespeicherte Liste „X“ wirklich löschen?“). Leer: „Noch keine gespeicherten Listen.“ Hinweis: Anlass-Listen wie Grillen oder Drogerie.
7. **Wörterbuch**: Suche `#dict-query` „Wort suchen“ (über der Liste, nicht nur im `<details>`). **Meine Zuordnungen** darüber, editierbar aus `state.mappings` (kein neues Backup-Feld): je Key Text + Dept-`<select>` (`DEPTS`) + Löschen. Select schreibt `state.mappings[key]` und speichert; Löschen entfernt den Key. Leer: „Noch keine — Abteilung in der Liste ändern, dann erscheint der Name hier.“ Optional Zeile Name + Dept + Anlegen (Key via `mappingKey`). Darunter `<details>` „Wörter anzeigen“: feste Wörter aus `DICT_SRC` nur lesen, lokal (kein Netz). Gruppen nach deutschen Abteilungs-Titeln (`DEPTS`), Wörter je Gruppe alphabetisch `localeCompare` de, Duplikate und Leereinträge weg. `#dict-query` filtert Zuordnungen **und** die feste Liste. Footer: „Die feste Liste bleibt unverändert. Eigene Zuordnungen liegen im Backup unter mappings und gewinnen beim Tippen. Sonderregeln (TK, Eistee, Schorle, Chips, Eis) stehen nicht in dieser Liste.“

### Stamm-Menü

`#btn-staple-menu` „Stamm“. Erstes Item immer **Gesamtliste** (`applyAllStaples`: fehlende Artikel anlegen, erledigte wieder öffnen, schon offene zählen). Danach ein Chip pro Stamm-Artikel (`tapStaple`). Leer: Status „Noch keine Stamm-Artikel. In den Einstellungen anlegen.“

### Burger-Menü

Deutsche Labels, Reihenfolge: Liste in Zwischenablage; Daten importieren (`.md/.txt`); Liste als Datei exportieren; Liste teilen (`navigator.share`, Button hidden wenn fehlend); nach Bring exportieren; nach Erinnerungen exportieren; Backup teilen/speichern/laden; **Einkaufsliste speichern** (`#btn-save-list`); gespeicherte Listen (Namen zum Auffüllen, oder disabled „Keine gespeicherten Listen“); Erledigte löschen; Einstellungen.

Gespeicherte Listen im Burger sind **eingerückt** unter „Einkaufsliste speichern“ (Klasse `saved-list-item`, `margin-left` ~1.35rem / schmalere Breite), also Kinder, nicht volle Chips wie Backup laden / Einkaufsliste speichern / Erledigte löschen. Leerzustand „Keine gespeicherten Listen“ bleibt disabled und gleich eingerückt. Einstellungen-Sheet `#saved-list-edit` ohne diese Einrückung.

**Einkaufsliste speichern:** `prompt` mit Titel „Einkaufsliste speichern“, dann Namen (max 60). Snapshot der **aktuellen** Artikel als `{name,dept}` **ohne** `done` (erledigte gehören in den Snapshot, damit Apply sie wieder öffnet). Leere Liste: nicht speichern, Status „Die Liste ist leer.“ Leerer Name: „Bitte einen Namen eingeben.“ Doppelte Listennamen sind erlaubt. IDs `l` + time36 + random.

**Apply füllt:** wie Stamm/`applyStaple` — fehlende anlegen, erledigte mit gleichem `mappingKey` wieder öffnen, schon offene zählen. Die Einkaufsliste wird **nicht** ersetzt.

## Abteilungen `DEPTS`

`vor` Vor dem Einkauf; `obst` Obst & Gemüse; `brot` Brot & Backwaren; `bedienung` Fleisch, Wurst, Käse; `kuehlung` Kühlregal; `tiefkuehl` Tiefkühl; `trocken` Trockenwaren; `suess` Süßwaren & Snacks; `getraenke` Getränke; `drogerie` Drogerie & Haushalt; `sonstiges` Sonstiges; `nach` Nach dem Einkauf.

### Gruppenreihenfolge (`groupItems` / `walkLayout`)

**Sonstiges bleibt, wo der Laden es im Layout platziert hat.** Nicht `sonstiges` aus dem Layout ziehen und vor `nach` kleben.

Walk über das sanitisierte Layout:

1. `vor` zuerst (auch wenn das gespeicherte Layout `vor` nicht enthält).
2. alle übrigen Layout-IDs in Layout-Reihenfolge, **außer** `vor`/`nach` — `sonstiges` genau dort, wo der Store es hat.
3. Extra-Abteilungen mit Artikeln, die **nicht** im Layout stehen: Extra-Gänge **nach dem letzten Layout-Gang vor `nach`** (Reihenfolge: `Object.keys(DEPTS)`). `item.dept` **nicht** nach `sonstiges` umschreiben.
4. `nach` zuletzt.

Unbekannte `item.dept`-IDs nur zur Anzeige nach `sonstiges` auflösen (`DEPTS[id] ? id : "sonstiges"`). Leere Depts nicht rendern.

Beispiel: Markt A `[vor, sonstiges, obst, nach]` zeigt Sonstiges vor Obst. Markt B `[vor, obst, sonstiges, nach]` zeigt Obst vor Sonstiges. dm-Seed: Drogerie … Sonstiges vor Nach; Süßwaren auf der dm-Liste bleiben eigener Extra-Gang hinter dem letzten Layout-Gang vor `nach`, nicht in Sonstiges.

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

`id` = `i` + time36 + random. `guessDept(name)` in dieser Reihenfolge (wie Native): **zuerst** `mappings[mappingKey(name)]`, falls bekannte `DEPTS`-ID; dann Sonderregeln (TK, Eistee, Schorle, Chips, Eis); dann längstes Keyword aus `DICT_SRC`; sonst `sonstiges`. Select **und** Cross-Dept-Drop schreiben denselben Mapping-Key — Nutzerkorrekturen gewinnen vor Wörterbuch und Sonderregeln. Sort in Dept: `ord`, dann `added`, dann `localeCompare` de.

UI je Item: Checkbox, Name (Klick rename; Enter speichern, Escape abbrechen), Dept-Select, Drag-Handle, Löschen `×`. Empty: „Noch nichts auf der Liste.“

**Drag (Artikel):** Pointer-Drag am Grip, Slop `DRAG_SLOP = 8`. **Nicht** intra-dept-only: `findItemDrop` prüft alle `.dept`-Sections. Drop auf Zeile (before/after der Mitte) oder auf Abteilungs-`h2` (`mark: "target"`). Abteilungswechsel setzt `item.dept` und `mappings[mappingKey(name)]` wie der Dept-Select. Layout-Zeilen ziehen nur innerhalb `#layout-list`.

Geh-Modus: `body.walk` — Button-Label „Bearbeiten“, `aria-pressed` true; kein Grip/Select/Delete, Name nicht editierbar (CSS + Render). Persistiert.

**Erledigte ausblenden (`#btn-hide-done`):** neben Geh-Modus. SVG Auge (`eye`) wenn erledigte sichtbar, durchgestrichenes Auge (`eye.slash`) wenn ausgeblendet. `aria-label` / `title`: „Erledigte ausblenden“ / „Erledigte einblenden“, `aria-pressed` true wenn versteckt. Tippen setzt `hideDone` und filtert **beide** Listen-Render (Geh-Modus und Bearbeiten): `done`-Artikel bleiben in `items` und im Backup, verschwinden nur aus der Anzeige. Leere Abteilungs-Header rendern nicht. Liste mit Artikeln, aber keiner sichtbar: `.empty` „Erledigte ausgeblendet.“ (Toggle bleibt). Leere Liste ohne Artikel bleibt „Noch nichts auf der Liste.“ Zähler `#count` weiter volle Offen/Erledigt/Gesamt-Zahlen (`oo/xx/yy`). Flag nur in `einkauf_v1.hideDone`, **nicht** in `einkauf-backup` (sonst kämpft iPhone-Backup gegen Android).

**Stamm:** `staples` ist **`{ name, dept }[]`**, kein `string[]`. `sanitizeStaples` akzeptiert alte String-Backups und neue Objekte (Name trimmen, Duplikate via `mappingKey`, ungültiges `dept` → `guessDept`). Menü: Gesamtliste + Chips; Settings: anlegen / Dept / Reorder / löschen.

**Gespeicherte Listen:** `savedLists` ist **`{ id, name, items: [{name,dept}] }[]`**. Snapshot ohne `done`. `sanitizeSavedLists`: fehlendes Feld / keine Liste → `[]`; leere Namen und Listen ohne Items verwerfen; doppelte IDs neu vergeben; Item-Duplikate **innerhalb** einer Liste erlaubt (anders als Stamm). Apply = `applyStaple` je Eintrag.

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
  hideDone,              // nur einkauf_v1, nicht Backup
  staples: [{ name, dept }],
  savedLists: [{ id, name, items: [{ name, dept }] }]
}
```

Save schreibt **kein** `palette` ins einkauf_v1-Objekt (nur theme + Rest). Palette nur Shared Key. Alte Speicherstände ohne `savedLists`: `[]`. Alte Stände ohne `hideDone`: `false`.

## Export / Import Formate

**Markdown Liste** (`# Einkauf — {Laden}` + `## {Dept}` + `- [x] ` / `- [ ] ` Name):

- Zwischenablage, Download `einkauf-{slug}.md` (Dateiname mit Zeitstempel via `stampedFilename`), Share `{ title, text }`.
- Import: Überschriften → Dept; Checkbox, Bullet oder nummerierte Liste; führende `NN ` (Bring-Nummern) strippen. Confirm ersetzen vs. anhängen wenn Liste nicht leer. JSON-Läden-Datei wird in demselben Import-Pfad erkannt (`tryImportStoresText`).

**Bring:** offene Items als `01) Name`; Deeplink `https://deeplink.getbring.com/import?type=RECIPE&src=` + b64 eines Parser-URLs `https://api.getbring.com/rest/bringrecipes/parser?url=`. Zu lang (>7500): Text kopieren. Bleibt im HTML-Menü; Produktrichtung ist Watch-im-Laden, nicht Bring.

**Erinnerungen:** offene Namen, Zeilen `\r\n`; Clipboard + Hinweis „In Erinnerungen einfügen, dann in mehrere aufteilen.“

**Läden JSON** `kind: "einkauf-laeden"`, `v: 1`, currentStoreId, stores, mappings. Datei `einkauf-laeden.json`. Import Confirm ersetzen/dazunehmen; Seeds mergen. Nur HTML. Enthält **kein** `savedLists`.

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
  staples: [{ name, dept }],
  savedLists: [{ id, name, items: [{ name, dept }] }]
}
```

Share oder Download `einkauf-backup.json`. Import Confirm ersetzt Liste und Läden. Alte Backups ohne `savedLists`: leeres Array. Stamm und eingebaute Läden bleiben unangetastet (Seeds mergen). **`hideDone` gehört nicht ins Backup** — Export lässt es weg, Import ändert das lokale Flag nicht.

Escape schließt Menüs/Sheet. Enter in neuen Laden/Stamm legt an.

## Native Begleit-App (nur dokumentieren, nicht nachbauen)

https://github.com/supervised-info/einkauf-watch — iPhone + Apple Watch. Brücke ist **nur** die Backup-JSON-Datei (kein Live-localStorage-Sync, die App scrapt die PWA nicht).

Dieses Delta **bleibt bewusst** und darf von Regeneratoren **nicht geschlossen** werden:

- **Nur HTML / in dieser Spec behalten:** Markdown kopieren / Datei exportieren / teilen; Import `.md`/`.txt`; **nach Bring exportieren**; **nach Erinnerungen exportieren**; extra Läden-JSON `kind: "einkauf-laeden"`.
- **Nur native / nicht ins HTML:** Watch; **Siri / App Intents** (kein In-App-Mikro, kein `Speech.framework`); Watch-Complication; iPhone-Homescreen-Widget; **PDF Liste teilen**; Erscheinungsbild **System** (folgt iPhone-Appearance) plus Hell/Dunkel und Creme/Blau **nur in den Einstellungen**, nicht in der engen Toolbar. HTML behält die Site-Mast-Buttons Theme + Palette (`theme-btn`, `#paletteBtn`) und die Shared Keys `supervised-info.theme` / `supervised-info.palette`.
- Watch ist nur Geh-Modus (Checkbox + Name). Ladenwahl nur auf dem iPhone. Watch-Auge und iPhone-Auge sind **jeweils geräte-lokal** (`einkauf.watch.hideCompleted` / `einkauf.iphone.hideCompleted`); HTML-Auge ist `einkauf_v1.hideDone`. Keines der Flags liegt im Backup.
- **Sprache (native only, nicht implementieren):** Kein Watch-In-App-Mikrofon, kein Diktat-Panel, kein `Speech.framework`. Siri-Utterance: App-Name + **besorgen** (z. B. „Hey Siri, Einkauf besorgen“); Siri fragt danach **„o“**; die Antwort wird in mehrere Artikel gesplittet (Komma, Semikolon, Zeile, ` und `, ` sowie `). iPhone-Intent persistiert direkt. Watch-Intent schreibt keine volle Liste — App-Group-Pending-Queue (`group.net.tschelle.einkauf`), die Watch-App drain't beim Aktivwerden. Native `makeID` als `Int64` (watchOS `arm64_32`); HTML bleibt bei String-IDs `i`+time36+random.
- **Complication vs. App-Titel:** Complication zeigt nur die offene Anzahl, bei 0 das Wort **erledigt** (nicht `oo/xx/yy`). Watch-Titel, iPhone-Widget, PDF-Meta und HTML-`#count` bleiben `oo/xx/yy`.
- **Liste teilen (PDF):** folgt dem iPhone-Auge (`einkauf.iphone.hideCompleted`) — ausgeblendet nur offene Zeilen, gleiche Abteilungsreihenfolge. Nicht ins HTML.
- Bring bleibt im HTML-Menü (dokumentieren), die Richtung ist Watch-im-Laden, nicht Bring.

Gemeinsame Slice (HTML und Native, Stand 2026-09-04): Zähler `oo/xx/yy` (offen/erledigt/gesamt, leer `0/0/0`); `savedLists` füllen statt ersetzen; Sonstiges-Slot im Ladenweg; Einstellungen-Reihenfolge Aktueller Laden → Neuer Laden → Ladenweg → Stamm → Gespeicherte Listen → Wörterbuch; Wörterbuch aus dem lokalen Keyword-`DICT_SRC` plus **Meine Zuordnungen** aus dem bestehenden `mappings`-Objekt (`einkauf_v1` / Backup, kein neues Feld); `guessDept` zuerst Mapping, dann Sonderregeln, dann längstes Keyword; Auge blendet Erledigte aus (Flag geräte-lokal, nicht im Backup). HTML filtert Geh-Modus **und** Bearbeiten; iPhone-Bearbeiten bleibt ungefiltert.

## CSS

`.walk` versteckt Edit-Controls; Sheet von rechts; Tipziele ~44px; `body.locked` overflow hidden bei Sheet.

## Nicht ändern

- SW-Cache-Namen nur nach oben bumping, nie stillschweigend gleich lassen nach HTML-Änderung.
- Builtin-Laden-IDs und DEPT-IDs.
- Storage-Key `einkauf_v1` (kein Theme-Key-Reuse für die Liste).
- Bewusstes Delta zur nativen App (siehe oben) nicht angleichen — kein Siri, kein Watch-Mikro/`Speech.framework`, kein PDF, keine Complication im HTML.

## Akzeptanzkriterien

- [ ] Offline nach erstem Besuch (SW v-Bump, aktuell v22).
- [ ] `#count` zeigt `offen/erledigt/gesamt` (leer `0/0/0`); `aria-live` bleibt; `aria-label` „X offen, Y erledigt, Z gesamt“.
- [ ] Add rät Abteilung (`mappings` vor Sonderregeln vor Keyword); Checkbox; Pointer-Drag **abteilungsübergreifend** (Zeile oder `h2`); Mapping wie Dept-Select; Geh-Modus persistiert.
- [ ] Auge `#btn-hide-done` blendet `done` aus (nicht löschen) in Geh-Modus und Bearbeiten; leere Depts weg; alles erledigt → „Erledigte ausgeblendet.“; `hideDone` nur `einkauf_v1`, nicht Backup; Zähler bleibt voll.
- [ ] Stamm `{name,dept}[]`; `sanitizeStaples` akzeptiert alte Strings; Settings anlegen/Dept/Reorder/löschen; Menü Gesamtliste + Chips (`tapStaple`).
- [ ] Gespeicherte Listen: speichern mit Namen; Apply füllt; leere Liste nicht speichern; Duplikat-Namen erlaubt; Löschen in Einstellungen; Persistenz `einkauf_v1` + Backup `savedLists`; alte Backups `[]`.
- [ ] Sonstiges-Position folgt dem Laden-Layout; Extra-Gänge bleiben Extra-Gänge; `item.dept` nicht nach sonstiges umbuchen.
- [ ] Einstellungen-Reihenfolge wie oben; Wörterbuch: Meine Zuordnungen aus `state.mappings` (Select/Löschen/optional Anlegen); feste `DICT_SRC`-Liste nur lesen, gruppiert nach DEPT-Titeln, sortiert de; `#dict-query` filtert beides; Backup unverändert `mappings`.
- [ ] MD/Backup/Läden roundtrip; Backup-Shape wie native App inkl. `savedLists`; Bring-Link oder Fallback-Kopie.
- [ ] Palette/Theme site-weit am Mast; Theme-Button-ID `theme-btn`; Palette nicht in `einkauf_v1`; kein Darstellung-Block im Sheet.
- [ ] Kicker 02, navy Favicon, Skip zur Eingabe.
- [ ] Native-Delta bleibt (kein Watch, kein Siri/`Speech.framework`, kein PDF-Teilen, keine Complication, kein System-Theme in der Toolbar, kein Live-Sync — nur Backup-Datei).
