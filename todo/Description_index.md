# Regenerationsspec: `todo/index.html`

Stand der Live-PWA: **2026-09-04**. Diese Spec beschreibt die Seite so, dass sie daraus neu erzeugt werden kann.

## Zweck

To-Do-Liste mit Person, Priorität (A–Z + 1–9), Enddatum, Wiedereröffnen mit UID-Kette, lokale Persistenz, Import/Export JSON/MD/CSV. Tools-Karte 03. Eine Datei.

## Chrome

- Shared Keys, FOUC, `#paletteBtn` + `#themeBtn`.
- Favicon navy `#0d1f6e`. Skip `href="#inp-task"` „Zur Aufgabeneingabe“.
- Kicker `supervised-info · 03` → `../`.
- `referrer` strict-origin-when-cross-origin.
- Extra: `--mono`, `--r: 12px`. Body zentriert, `.page` `min(72rem, 100%)`.

## Layout

- `.page-head`: h1 „To-Do Liste“, lede „Person, Priorität, Enddatum“, `#filename-display`.
- Toolbar links: „Neue Liste“ `#btn-new` (soft-red), Label „Importieren“ für hidden `#md-import` accept `.json,.md,.markdown,.csv`.
- Rechts: Checkbox „Abgeschlossen einblenden“ `#toggle-completed`; JSON / MD / CSV export; Suche-Button (Lupen-SVG).
- Search-Drawer `#inp-filter` Placeholder „Person oder Text …“.
- Add-Form: Person, Prio A (Optionen A–Z plus „– Prio“), Prio B 1–9 plus „–“, date, „Neue Aufgabe …“, „Hinzufügen“. Enter im Aufgabenfeld = add.
- `#task-list` Tabellen/Karten: offene Aufgaben gruppiert, abgeschlossene Sektion einklappbar.
- Import-Modal: Abbrechen / Anhängen / Ersetzen.
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
  changedBy: string   // UI setzt "TS/NA"
}
```

`normalizeTasks`: fehlende UIDs aus `nextUid`; `nextUid = max+1`.

## localStorage

| Key | Wert |
|---|---|
| `todo-v3` | JSON-Array tasks |
| `todo-v3-file` | letzter Import-Dateiname |
| `todo-v3-show-completed` | `'true'`/`'false'` |
| `todo-v3-completed-expanded` | `'true'`/`'false'` (Default expanded = nicht `'false'`) |
| `todo-v3-next-uid` | String Zahl |
| `todo-v3-collapsed-chains` | JSON Array von Chain-Keys |

Kein eigenes Theme-Key-Paar.

## Verhalten

- Sort-Header: person (Default asc), prioA, text, dueDate, completed, completedDate. Prio-Compare: `prioA + (prioB||'9')`, fehlendes prioA sortiert ans Ende (`￿`).
- Overdue: dueDate < heute und nicht `9999*`.
- Checkbox toggle setzt/löscht `completedDate` = heute ISO.
- Bearbeiten Inline; Speichern setzt `updatedAt`, `changedBy` TS/NA. Enter im Text speichert.
- Löschen; Bulk complete/delete wenn Mehrfachauswahl (`selectedIds`).
- **Wieder öffnen**: Confirm; Original bleibt completed, bekommt `reopenedToUid`; Kopie offen mit neuem uid, `reopenedFromUid`. Highlight ~2,6 s, scrollIntoView.
- Reopen-Ketten UI: einklappbar, State in `todo-v3-collapsed-chains`.
- Neue Liste: Confirm, tasks=[], nextUid=1, filename leer.
- Suche: filtert Person oder Text; Escape schließt Drawer; Blur ohne Text schließt.
- Prio-CSS: A–D `p-high`, E–J `p-mid`, sonst `p-low`, leer `p-none`.

## Export-Formate

**JSON** Datei `todo-liste.json`, `format: 'todo-v3-json'`, `exportedAt` ISO, `nextUid`, `tasks[]` ohne runtime `id`. Import: Array oder `{tasks, nextUid}`.

**MD** `todo-liste.md`:

```
# To-Do Liste
Exportiert am: {de-DE locale}

## {Person oder (Keine Person)}

- [ ] [A1] Text (YYYY-MM-DD)
  <!-- #uid | TS/NA | erstellt DD.MM.YYYY HH:MM | geändert … | von #x am DD.MM.YYYY | → #y am … -->

---

## Abgeschlossen

### Person
- [x] [A1] Text (due) {completedDate}
  <!-- … -->
```

Import versteht neues HTML-Comment-Meta und alt `<!-- todo: uid=N reopenedFrom=… -->`. Checkbox-Regex: `- [x] [A1]? text (due)? {done}?`

**CSV** BOM + Semikolon, quoted. Header: Person, Prio A, Prio B, Aufgabe, Enddatum, Abgeschlossen am, UID, Reopened From/To UID, Reopened At, Erstellt am, Geändert am, Geändert von. Open first, then row `## Abgeschlossen`, then done. Datetimes UTC `DD.MM.YYYY HH:MM`. Import: `;` vs `,`; completed wenn completedDate ISO-Datum; createdAt/updatedAt ISO oder de-DE parse.

Import wenn Liste nicht leer → Modal Anhängen/Ersetzen. Sonst direkt. Toast bei Erfolg/Fehler.

## Shortcuts

- Enter in `#inp-task` und Edit-Text: speichern/add
- Escape: Suche zu; Modal-Overlay-Klick schließt Import

## Native Begleit-App (nur dokumentieren, nicht nachbauen)

Stand 2026-09-04. Die native To-Do-UI lebt **nicht** als eigene App, sondern als zweiter Reiter **To-Do** in der Einkaufs-App ([einkauf-watch](https://github.com/supervised-info/einkauf-watch)). Die HTML-PWA hier bleibt eigenständig (`todo-v3*`, Tools-Karte 03). Kein Live-localStorage-Sync, kein gemeinsames Store mit Einkauf (`einkauf-backup` / `einkauf-local.json` bleiben fremd).

Brücke ist **nur** das Backup `format: "todo-v3-json"` (Roundtrip HTML ↔ Native: `{ format, exportedAt, nextUid, tasks[] }`). Native liest Array oder Objekt wie diese Spec.

Dieses Delta **bleibt bewusst**:

- **Nur HTML / in dieser Spec behalten:** MD- und CSV-Export/Import; Site-Mast Theme/Palette; eigenständige PWA ohne Tab-Einbettung.
- **Nur native / nicht ins HTML:** Tab-Integration in der Einkaufs-App; Watch Geh-Modus; Siri **Todo** (ein Token, nicht „To Do“; iPhone-Nachfrage **„o“**, Watch Freitext-Diktat ohne `requestValueDialog`); Watch-Complication Label **To Do**; PDF **Liste teilen**. Native **Phase 8** (MD/CSV) ist nicht gelandet — HTML behält MD/CSV, Native nicht.

Wieder öffnen, Sort und Suche existieren nativ nur auf dem iPhone. Watch bleibt Geh-Modus.

## Nicht ändern

- Keys `todo-v3*`, format-String `todo-v3-json`, changedBy `TS/NA`.
- Kicker 03.
- Bewusstes Delta zur nativen Begleit-App (Watch, Siri, Complication, Tab in Einkauf) nicht ins HTML ziehen. Native Phase-8-Lücke (kein MD/CSV) nicht schließen, indem HTML MD/CSV verliert.

## Akzeptanzkriterien

- [ ] CRUD + UID + Reopen-Kette roundtrip JSON/MD/CSV.
- [ ] Abgeschlossen-Toggle persistiert; Sort Person/Prio.
- [ ] Shared Theme/Palette; Skip; navy Favicon; FOUC.
- [ ] Native-Delta bleibt (HTML bleibt eigenständige PWA mit `todo-v3*` + MD/CSV; kein Watch, kein Siri, keine Complication, keine Tab-Einbettung in Einkauf).
