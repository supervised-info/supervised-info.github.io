# Regenerationsspec: `braindump/index.html`

## Zweck

Vollflächige Canvas-Mindmap: Baum aus Knoten und Kanten, Farben, Tags, Notizen, Fokus, Filter, Undo, Autosave, Import/Export MD/JSON/HTML/Excel/MindManager/PNG. Tools-Karte 04. Eine Datei (circa 5000 Zeilen). Kein app.js.

## Datei-Ort, Abhängigkeiten

Nur `braindump/index.html`. CSS und JS inline. Keine PWA.

## Chrome

- Shared Keys supervised-info.theme und supervised-info.palette, FOUC-Skript wortgleich, Buttons #paletteBtn dann #themeBtn.
- Favicon navy #0d1f6e.
- Kein Skip-Link (Ist-Zustand).
- Kicker: supervised-info · 04 mit Link ../ .
- html,body Höhe 100%, overflow hidden.
- Extra Tokens: --bg, --canvas-bg, --node-bg, --node-border, --node-border-selected, --node-text, --line, --toolbar-bg, --btn-*, --accent, --danger, --oxide-glow*.
- Standalone-HTML-Export hat Mini-Theme-Key braindump_view_theme (nicht die Site-Keys).

## Layout / Toolbar (Reihenfolge im DOM)

Mast, dann #app:
1. Titelblock BrainDump plus #current-file (Default-Anzeige Unbenannt).
2. Button Neue Wurzel (#btn-new-root).
3. Import (#btn-import).
4. Speichern JSON (#btn-save-json) — das verlustfreie Arbeitsformat, setzt den Dateinamen.
5. Export-Menü: Graphik, MD, HTML, Excel, MindManager (Beta).
6. Rückgängig, Wiederholen, Alles löschen.
7. Legende einfügen, Farbfilter, Tags, Suche.
8. Minimap-Toggle, Help-Toggle.

Hinweiszeile #hint (Default unsichtbar): Klick = bearbeiten; Enter = Geschwister; Tab = Kind; Umschalt+Tab = ausrücken; Ziehen = umhängen; Ecke ziehen = Größe; Cmd/Umschalt+Klick = Mehrfachauswahl; Entf = löschen; Strg/Cmd+Z Undo; Strg/Cmd+Umschalt+Z Redo; Shift/Cmd+D duplizieren.

Viewport: #canvas mit SVG #edges und #nodes; schwebende #node-toolbar; Empty-Hint; #search-bar; #focus-bar; Zoom plus Storage-Indikator; Minimap-Canvas.

Node-Toolbar: Kind, Geschwister, Duplizieren, Tags, Notizen, Fokus, Fix, Löschen (Kinder bleiben erhalten / werden an Parent gehängt).

Modals: MD-Format dash / hash / numbered / plain; Legende mit Farbbeschreibungen. Hidden file input accept .md,.markdown,.json,.mmap.

## Datenmodell Knoten

Felder: id (n plus uidCounter), text, collapsed, width/height (null = automatisch), color (null oder red/orange/yellow/green/teal/blue/purple/pink), fixed, isLegend, tags (Array ohne führendes Hash), notes, children.

Farb-Hex: red #e0554f, orange #e2924a, yellow #d7b740, green #4caf6e, teal #3fb0ac, blue #4a7dfc, purple #9166d6, pink #de6aa8. Rechtsklick öffnet Swatches plus Keine Farbe.

JSON-Dateityp-Feld: braindump-mindmap.

Layout-Konstanten: hGap 60, vGap 14, rootGap 34, padding 60. Baum nach rechts.

## localStorage

- mindmapper_state_v1 = { roots, uidCounter } Autosave
- mindmapper_current_filename Anzeigename; setzen bei Import jeder Art und bei JSON-Speichern; entfernen bei Alles löschen; unverändert bei MD/HTML/Excel/Graphik/mmap-Export
- braindump_minimap_visible: 0 aus, sonst an. Default an
- braindump_hint_visible: 1 an, sonst aus. Default aus
- __braindump_quota_probe__ nur temporär für Quota-Sonde
- Site-Theme-Keys separat

Storage-UI: Prozent; warn ab 70, danger ab 90; n/v im privaten Modus.

## Verhalten

- Pan der Viewport-Fläche, Zoom-Buttons, Fit, Reset 100%.
- Klick editiert Text (contenteditable). Anzeige linkifiziert http(s) und file-URLs; im Editor reiner Text.
- Enter Geschwister, Tab Kind, Shift+Tab Outdent.
- Entf / Backspace löscht Mehrfachauswahl.
- Toolbar-Löschen: Kinder bleiben (an Parent).
- Drag Node = Reparent. Ecke = Resize wenn nicht fixed.
- Cmd/Shift+Click Multi-Select. Duplicate deep clone, neue IDs.
- Collapse. Fokus-Modus plus Leiste Alle anzeigen.
- Undo-Stack MAX_UNDO 50, Redo. Text: ein Undo-Schritt pro Blur wenn Text geändert.
- Farbfilter und Tagfilter: Checkboxen der verwendeten Werte plus keine Farbe / keine Tags. Anzeige und Exporte nutzen kompaktierte sichtbare Bäume.
- Suche Ctrl/Cmd+F: Text oder #Tag; Zähler n/m; Enter / Shift+Enter; Esc.
- Legende: ein Wurzelknoten isLegend. Button disabled solange Legende existiert.
- Datei aufs Fenster droppen = Import.
- Alles löschen: Confirm, roots leer, Dateiname Unbenannt.

## Import / Export
- JSON type braindump-mindmap, roots, uidCounter.
- MD formats dash hash numbered plain; HTML; xlsx; PNG; mmap beta.

## Shortcuts
Enter Tab Shift+Tab Entf Ctrl+Z Ctrl+Shift+Z Shift+D Ctrl+F Esc Cmd+Click

## Nicht ändern
Keys mindmapper_* braindump_*. Kicker 04. Keine Libraries.

## Akzeptanzkriterien
- Canvas CRUD Undo Autosave JSON MD Theme FOUC Minimap Help
