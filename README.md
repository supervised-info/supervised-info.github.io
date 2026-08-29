# supervised-info.github.io

Sammlung eigenständiger HTML-Seiten für GitHub Pages. Keine Werkzeugkette: Dateien so ablegen, wie der Browser sie lesen soll.

## Seiten

- [Relativitätstheorie, anschaulich](relativitaetstheorie/)
- [Elektroautos, im Vergleich](elektroautos/)

## Nächste Seite anlegen

1. Im Repo-Root einen Ordner ohne Umlaute anlegen, z. B. quantentheorie/.
2. Darin index.html schreiben — eine in sich geschlossene Datei (CSS und JS inline oder lokal mit relativen Pfaden). Die Seite muss per Doppelklick oder statischem Server laufen.
3. Auf der Startseite index.html einen Eintrag mit Titel, einer Zeile Abstract und Link ergänzen.
4. Nach dem Push auf den Default-Branch liefert GitHub Pages die Dateien aus.

Die Datei .nojekyll ist absichtlich leer, damit GitHub die Dateien nicht durch Jekyll schickt.
