# Regenerationsspec: `t-konto/index.html`

## Zweck

Buchungssätze erfassen, T-Konten automatisch aufbauen, Abschlussbuchungen mit Gegenkonten, Excel-Export (eigenes ZIP/OOXML, keine Library), Einstellungen (Farben/Layout) als JSON. Tools-Karte 05. Eine Datei. **Keine App-Daten in localStorage** (nur Site-Theme). Session-State im RAM.

## Chrome

- Shared Keys, FOUC, `#paletteBtn` + `#themeBtn`.
- Favicon navy `#0d1f6e`. Skip `href="#inhalt"` „Zum Inhalt springen“.
- Kicker `supervised-info · 05` → `../`.
- Mast sitzt **über** dem App-Header; App-Header `#inhalt` hat eigene Farben (`FARB_DEFAULTS.appheader` `#2E4057`), unabhängig von Creme/Blau — Site-Palette färbt Mast/Page-Hintergrund, T-Konto-Karten die Settings-Farben.

## Layout / Tabs

`zeigeTab(name)`: `buchungen` | `tkonto` | `abschluss` | `einstellungen`. Badges `#tkonto-badge` / `#abschluss-badge`.

### Buchungen

Tabelle Soll/Haben/Betrag. Footer-Inputs: `#inp-nr` Placeholder B-001, Soll, Haben, Betrag number step 0.01, „+ Add“. Buttons Speichern (CSV), Laden (`.csv,.txt`), Excel-Export, **BUCHEN**. Alert `#alert-box`. Empty-Row-Text wenn keine Buchungen. Hint mit Enter-Bedienung.

Validierung Add/Inline-Edit: nr, soll, haben, soll≠haben, betrag>0. Auto-Nr `B-001` padded. Enter: nr→soll→haben→betrag→Add. Inline-Edit Bleistift/Haken/Escape.

Buchung: `{ id, nr, soll, haben, betrag }`. `nextId` intern.

### T-Konto

Nach BUCHEN: Karten `.t-konto` Drag&Drop-Reihenfolge `kontenOrder`. Soll-Spalte = Buchungen mit diesem Soll-Konto, Haben analog; Saldo auf der schwächeren Seite. Summenzeile = max(sollSumme,habenSumme). „Neu generieren“ = `buchen()` setzt `abschlussDurchgefuehrt=false`. „Mit Abschlussbuchungen“ = `abschlussbuchen()`. Meta-Zeile mit Zeitstempel de-DE.

Layout: `tkontenProZeile` 0 = auto CSS, 1–10 = `repeat(N, 1fr)`.

### Abschlussbuchungen

`generiereAbschluss()`: Saldo = sollSumme−habenSumme; |saldo|≤0.001 ausblenden. Tabelle T-Konto, Gegenkonto-`<select>` aus `gegenkontenListe` (Default Bilanz, GuV, Notes, Sonstiges), Buchungstext `Saldo (<gk>)`, Soll/Haben-Zuweisung: saldo>0 → Gegenkonto Soll / Konto Haben. „Abschlussbuchungen durchführen“ hängt Gegenkonten-Karten an das T-Konto-Grid.

### Einstellungen

- JSON export/import `{ version:1, layout:{ tkontenProZeile }, abschlusskonten[], farben }` Dateiname `TKonto_Einstellungen_DD-MM-YYYY.json`.
- Layout-Zahl 0–10.
- Abschlusskonten Tags + Hinzufügen + Standard.
- Farben Color-Inputs + Hex-Spans; Live-Vorschau-Konto. „Druckversion“ setzt helle Grautöne (siehe `farbenDruckversion`). „Zurücksetzen“ = `FARB_DEFAULTS`.
- FARB_DEFAULTS: header/border `#2E4057`, headerText/subheaderText `#ffffff`, subheader `#7AB0DE`, saldo `#FFF4CC` / text `#333`, sum `#DDEEDD`, appheader `#2E4057`, tabbar `#3b5166`, tabactive `#7AB0DE`, btnbuchen `#1F7A4A`, btnexport `#217346`.
- Keys in `farben`: header, headerText, border, subheader, subheaderText, saldo, saldoText, sum, sumText, appheader, appheaderText, tabbar, tabactive, btnbuchen, btnexport. CSS-Vars `--tk-header` etc. auf Karten.

Nach CSV-Laden: Modal fragt ob Einstellungs-JSON importiert werden soll.

## CSV Speichern/Laden (Buchungen)

Speichern: UTF-8, Semikolon, Header-Zeile Soll;Haben;Betrag (de-Format), optional Abschnitt Abschlusskonten. Laden: `;` oder `,`; Betrag bei `;` deutsches Komma; optional Header wenn „soll“ in Zeile 1; generiert neue `B-00N`. Gegenkonto-Map aus Extra-Zeilen. T-Konten nicht auto-generiert — Hinweis „bitte BUCHEN“.

## Excel-Export

Eigenes STORED-ZIP/OOXML analog BrainDump (CRC32, keine SheetJS). Workbook mit Blättern Buchungen, T-Konten (Karten-Layout, Merge, Saldo-Styles), Abschlussbuchungen, Einstellungen. Download-Name zeitgestempelt. Auch nach Abschluss die Abschluss-T-Konten im Sheet.

## Datenmodell (RAM)

- `buchungen[]`, `kontenOrder[]`, `gegenkontoMap{}`, `gegenkontenListe[]`, `abschlussDurchgefuehrt`, `abschlussKontenOrder[]`, `tkontenProZeile`, `farben`
- **Kein** `localStorage` für Buchungen.

## Nicht ändern

- Keine Library für xlsx.
- Default-Abschlusskonten-Namen.
- Kicker 05. App-Daten nicht in Theme-Keys speichern.

## Akzeptanzkriterien

- [ ] Add/Edit/Delete Buchungen; BUCHEN erzeugt T-Konten; Drag reorder.
- [ ] Abschluss-Selects; Durchführen ergänzt Grid.
- [ ] CSV + Excel + Settings-JSON roundtrip.
- [ ] Site Creme/Blau + Hell/Dunkel am Mast; Skip; navy Favicon.
