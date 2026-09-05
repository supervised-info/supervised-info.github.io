# Regenerationsspec: `todo/index.html`

Stand der Live-PWA: **2026-09-04**. Diese Spec beschreibt die Seite so, dass sie daraus neu erzeugt werden kann.

## Zweck

To-Do-Liste mit Person, Priorität (A–Z + 1–9), Enddatum, Wiedereröffnen mit UID-Kette, **benannte Listen** (Phase 10), lokale Persistenz, Import/Export JSON/MD/CSV. Tools-Karte 03. Eine Datei.

## Chrome

- Shared Keys, FOUC, `#paletteBtn` + `#themeBtn`.
- Favicon navy `#0d1f6e`. Skip `href="#inp-task"` „Zur Aufgabeneingabe“.
- Kicker `supervised-info · 03` → `../`.
- `referrer` strict-origin-when-cross-origin.
- Extra: `--mono`, `--r: 12px`. Body zentriert, `.page` `min(72rem, 100%)`.

## Layout

- `.page-head`: h1 „To-Do Liste“, lede „Person, Priorität, Enddatum“, `#filename-display`.
- Toolbar links: „Neue Liste“ `#btn-new` (soft-red) — **wischt alle Aufgaben** (Confirm → `tasks=[]`, `nextUid=1`); nicht mit benannten Listen verwechseln. Tooltip „Alle Aufgaben löschen und neu beginnen“. Label „Importieren“ für hidden `#md-import` accept `.json,.md,.markdown,.csv`.
- **Listenleiste** `.list-bar` unter der Toolbar: Label „Liste“, Select `#sel-list` (**Alle** + benannte Listen), „Neue Liste…“ `#btn-named-list-new` (legt eine benannte Liste an), „Listen…“ `#btn-lists-manage` (Modal: umbenennen / löschen mit Confirm). Optional Zähler `#list-count` `oo/xx/yy` der Sicht nach Listenfilter, dann Abgeschlossen-Toggle (ohne Suche).
- Rechts in der Toolbar: Checkbox „Abgeschlossen einblenden“ `#toggle-completed`; JSON / MD / CSV export; Suche-Button (Lupen-SVG).
- Search-Drawer `#inp-filter` Placeholder „Person oder Text …“.
- Add-Form: Person, Prio A (Optionen A–Z plus „– Prio“), Prio B 1–9 plus „–“, date, „Neue Aufgabe …“, „Hinzufügen“. Enter im Aufgabenfeld = add. Neue Aufgaben bekommen `listId` der **aktuellen** Liste; bei **Alle** bleibt `listId` leer.
- `#task-list` Tabellen/Karten: offene Aufgaben gruppiert, abgeschlossene Sektion einklappbar. Sichtbare Aufgaben = zuerst Listenfilter, dann Abgeschlossen-Toggle, dann Suche, dann Sort/Personen-Gruppierung. Zähler (Abgeschlossen-Sektion, `#list-count`) beziehen sich auf die gefilterte Sicht.
- Inline-Edit: Person, Prio, Text, Datum, **Listen-Zuordnung** (`#ef-list` / `.ef-list`, Option „Keine Liste“).
- Import-Modal: Abbrechen / Anhängen / Ersetzen.
- Listen-Modal `#lists-modal`: Abbrechen über Overlay/Escape/„Fertig“; Löschen bestätigt, leert `listId` der betroffenen Aufgaben, löscht die Aufgaben nicht.
- Toast `#toast` ~2,6 s.

## Task-Shape (Speicher + JSON)

Runtime hat zusätzlich `id` (Number, Date.now()+random) als DOM-Key, nicht im JSON-Export.

```
{
  uid: number,
  text: string,
  completed: boolean,
  prioA: "A"–"Z" | "",
  prioB: "1"–"9" | "",
  dueDate: "YYYY-MM-DD" | "",
  completedDate: "YYYY-MM-DD" | "",
  person: string,
  reopenedFromUid, reopenedToUid: number | "",
  reopenedAt: "YYYY-MM-DD" | "",
  createdAt, updatedAt: ISO-Timestamp,
  changedBy: string,   // UI setzt "TS/NA"
  listId?: string      // fehlt / null / leer = keiner Liste zugeordnet, sichtbar unter Alle
}
```

`normalizeTasks`: fehlende UIDs aus `nextUid`; `nextUid = max+1`. `listId` nur behalten, wenn die ID in `lists` vorkommt, sonst leeren.

Benannte Listen: `{ id: string, name: string }`. Stabile String-IDs (UUID). Leerer Name wird verworfen; fehlende ID wird erzeugt; doppelte IDs: erste gewinnt.

## localStorage

| Key | Wert |
|---|---|
| `todo-v3` | JSON-Array tasks (inkl. `listId`, wenn gesetzt) |
| `todo-v3-file` | letzter Import-Dateiname |
| `todo-v3-show-completed` | `'true'`/`'false'` |
| `todo-v3-completed-expanded` | `'true'`/`'false'` (Default expanded = nicht `'false'`) |
| `todo-v3-next-uid` | String Zahl |
| `todo-v3-collapsed-chains` | JSON Array von Chain-Keys |
| `todo-v3-lists` | JSON-Array `{id,name}` (fehlend → `[]`) |
| `todo-v3-current-list-id` | aktuelle Listen-ID; leerer String = **Alle** |

Kein eigenes Theme-Key-Paar. Bestehende `todo-v3*`-Keys nicht umbenennen.

## Verhalten

- Sort-Header: person (Default asc), prioA, text, dueDate, completed, completedDate. Prio-Compare: `prioA + (prioB||'9')`, fehlendes prioA sortiert ans Ende (`￿`).
- Overdue: dueDate < heute und nicht `9999*`.
- Checkbox toggle setzt/löscht `completedDate` = heute ISO.
- Bearbeiten Inline; Speichern setzt `updatedAt`, `changedBy` TS/NA. Enter im Text speichert. Listen-Zuordnung änderbar.
- Löschen; Bulk complete/delete wenn Mehrfachauswahl (`selectedIds`).
- **Wieder öffnen**: Confirm; Original bleibt completed, bekommt `reopenedToUid`; Kopie offen mit neuem uid, `reopenedFromUid`, gleichem `listId`. Highlight ~2,6 s, scrollIntoView.
- Reopen-Ketten UI: einklappbar, State in `todo-v3-collapsed-chains`.
- **Neue Liste** (`#btn-new`): Confirm, tasks=[], nextUid=1, filename leer. **Wischt Aufgaben**, nicht die benannten Listen. Benannte Liste anlegen: **Neue Liste…** in der Listenleiste.
- Benannte Listen: anlegen (wechselt auf die neue Liste), umbenennen, löschen mit Confirm. Löschen leert `listId` der zugehörigen Aufgaben (`updatedAt`/`changedBy` TS/NA) — Aufgaben bleiben und sind unter **Alle** sichtbar.
- Suche: filtert Person oder Text; Escape schließt Drawer; Blur ohne Text schließt.
- Prio-CSS: A–D `p-high`, E–J `p-mid`, sonst `p-low`, leer `p-none`.

## Export-Formate

**JSON** Datei `todo-liste.json`, `format: 'todo-v3-json'` (kein Format-Bump), `exportedAt` ISO, `nextUid`, `lists` (optional, fehlt → `[]`), `tasks[]` ohne runtime `id`, optionales `listId`. Import: nacktes Array **oder** `{tasks, nextUid, lists?}`. Alte Dateien ohne `lists`/`listId` bleiben gültig. Anhängen merget `lists` per `id` (lokaler Name gewinnt). Ersetzen übernimmt die importierten Listen.

**MD** `todo-liste.md` — **volle Liste**, unabhängig von Auge und Listenfilter:

```
# To-Do Liste
Exportiert am: {de-DE locale}

## {Person oder (Keine Person)}

- [ ] [A1] Text (YYYY-MM-DD)
  <!-- #uid | TS/NA | erstellt DD.MM.YYYY HH:MM | geändert … | von #x am DD.MM.YYYY | → #y am … | Liste {name} | list:{id} -->

---

## Abgeschlossen

### Person
- [x] [A1] Text (due) {completedDate}
  <!-- … -->
```

Listen-Meta ist optional: `Liste {name}` und/oder `list:{id}` im HTML-Comment. Ohne Listeninfo importieren wie bisher. Alt `<!-- todo: uid=N listId=… listName=… -->` ebenfalls. Checkbox-Regex: `- [x] [A1]? text (due)? {done}?`

**CSV** BOM + Semikolon, quoted. Header: Person, Prio A, Prio B, Aufgabe, Enddatum, Abgeschlossen am, UID, Reopened From/To UID, Reopened At, Erstellt am, Geändert am, Geändert von. Wenn Listen vorhanden (oder irgendeine Aufgabe `listId` hat): zusätzliche Spalten **Liste** und **List-ID**. Import ohne diese Spalten bleibt gültig. Open first, then row `## Abgeschlossen`, then done. Datetimes UTC `DD.MM.YYYY HH:MM`. Import: `;` vs `,`; completed wenn completedDate ISO-Datum; createdAt/updatedAt ISO oder de-DE parse. Header-Lookup für Liste/List-ID (auch `ListId` / `listId`).

Import wenn Liste nicht leer → Modal Anhängen/Ersetzen. Sonst direkt. Toast bei Erfolg/Fehler. MD/CSV dump die **volle** Aufgabenmenge, nicht den Listenfilter.

## Shortcuts

- Enter in `#inp-task` und Edit-Text: speichern/add
- Escape: Suche zu; Modal-Overlay-Klick schließt Import; Listen-Modal zu

## Native Begleit-App (nur dokumentieren, nicht nachbauen)

Stand 2026-09-05. Die native To-Do-UI lebt **nicht** als eigene App, sondern als zweiter Reiter **To-Do** in der Einkaufs-App ([einkauf-watch](https://github.com/supervised-info/einkauf-watch), **Build 62**). Die HTML-PWA hier bleibt eigenständig (`todo-v3*`, Tools-Karte 03). Kein Live-localStorage-Sync, kein gemeinsames Store mit Einkauf (`einkauf-backup` / `einkauf-local.json` bleiben fremd).

Brücke ist das Backup `format: "todo-v3-json"` (Roundtrip HTML ↔ Native: `{ format, exportedAt, nextUid, lists?, tasks[] }` mit optionalem `listId`). Native liest Array oder Objekt wie diese Spec. Phase 10 (benannte Listen) ist **nativ und HTML** geliefert — gleiches JSON-Schema, kein Format-Bump.

Native-To-Do seit Build 55 (kurz, nicht nachbauen):

- **Build 56:** JSON-Backup zusätzlich unter **Einstellungen → To-Do Backup** (`fileImporter` nur `.json`; MD/CSV bleiben im To-Do-**…**).
- **Build 57:** Import hebt `revision` analog Einkauf (`max(lokal, import) + 1`); HTML-Brücke hat keine `revision`. iPhone-Zeile zeigt **Abgeschlossen-Datum** (`geschlossen TT.MM.JJJJ`), wenn `completedDate` gesetzt.
- **Build 58:** iPhone-Zeile `#uid` Badge + reopen-Pills wie diese Spec (`von #` / `reopen #`).
- **Build 59–61:** iCloud-Inbox nur **Einkauf** (verbinden / abrufen / Auswahl / Löschen) — nie To-Do.
- **Build 62:** iPhone-Nav ohne großen Titel „To-Do“ (leer, `.inline`); Toolbar kompakt. Der Tab-Name reicht.

Dieses Delta **bleibt bewusst**:

- **Nur HTML / in dieser Spec behalten:** Site-Mast Theme/Palette; eigenständige PWA ohne Tab-Einbettung; `h1` „To-Do Liste“. MD- und CSV-Export/Import bleiben in der HTML-PWA (Native hat MD/CSV seit Phase 8 / Build 53 ebenfalls; HTML verliert sie nicht).
- **Nur native / nicht ins HTML:** Tab-Integration in der Einkaufs-App; Watch Geh-Modus; Siri **Todo** (ein Token, nicht „To Do“; iPhone-Nachfrage **„o“**, Watch Freitext-Diktat ohne `requestValueDialog`); Watch-Complication Label **To Do**; PDF **Liste teilen**; Einstellungen-To-Do-Backup; Import-`revision`-Floor; kompakte Nav ohne Listen-Titel. Native folgt mit PDF/Siri/Watch der aktuellen Liste — das bleibt native-only. iCloud-Inbox nie für To-Do.

Wieder öffnen, Sort, Suche, `#uid`/reopen-Pills und benannte Listen existieren nativ auf dem iPhone. Watch bleibt Geh-Modus (folgt der gesyncten aktuellen Liste, ohne Listen-Verwaltung).

## Nicht ändern

- Keys `todo-v3*` (neue Keys nur additiv: `todo-v3-lists`, `todo-v3-current-list-id`), format-String `todo-v3-json`, changedBy `TS/NA`.
- Kicker 03.
- `#btn-new` „Neue Liste“ bleibt der Aufgaben-Wipe, nicht das Anlegen benannter Listen.
- Bewusstes Delta zur nativen Begleit-App (Watch, Siri, Complication, PDF, Tab in Einkauf, Einstellungen-To-Do-Backup, Import-`revision`, kompakte Nav, iCloud-Inbox nur Einkauf) nicht ins HTML ziehen. HTML behält MD/CSV.

## Akzeptanzkriterien

- [ ] CRUD + UID + Reopen-Kette roundtrip JSON/MD/CSV.
- [ ] Benannte Listen: Alle / Filter / anlegen / umbenennen / löschen (Confirm; Aufgaben bleiben); neue Aufgaben erben die aktuelle Liste; Inline-Edit ändert `listId`.
- [ ] Alte JSON/MD/CSV ohne `lists`/`listId` importieren; neue Exporte roundtrippen Listen mit Native-Schema (`todo-v3-json`, optionales `lists`/`listId`).
- [ ] Anhängen merget Listen per id (lokaler Name gewinnt).
- [ ] Abgeschlossen-Toggle persistiert; Sort Person/Prio; Filter-Reihenfolge Liste → Abgeschlossen → Suche → Sort.
- [ ] Shared Theme/Palette; Skip; navy Favicon; FOUC; Creme/Blau ungebrochen.
- [ ] Native-Delta bleibt (HTML bleibt eigenständige PWA mit `todo-v3*` + MD/CSV; kein Watch, kein Siri, keine Complication, kein PDF, keine Tab-Einbettung in Einkauf, keine `revision`, keine iCloud-Inbox).
