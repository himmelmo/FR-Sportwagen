# Anleitung: Neues verkauftes Fahrzeug als Referenz einbauen

So wurde der Lamborghini Gallardo eingebaut – dieselben Schritte gelten für jedes weitere
verkaufte Fahrzeug (Beispiele unten mit `<kuerzel>` = Kurzname des Autos, z. B. `gallardo`,
`carrera`, `targa`).

## Voraussetzungen

- Die Originalfotos liegen in einem Unterordner von `Fotos verkaufte/` (dieser Ordner ist
  bewusst per `.gitignore` vom Repository ausgeschlossen – Originale bleiben nur lokal).
- Dateinamen enden idealerweise auf `_0.jpg`, `_1.jpg`, … plus optional `Haupt.jpg`
  als Titelbild.

## Schritt 1: Fotos fürs Web verkleinern

Die Originale (10–25 MB pro Bild) sind zu groß fürs Web. Mit PowerShell und System.Drawing
werden sie auf max. 1600 px Breite bei 82 % JPEG-Qualität verkleinert (Ergebnis: ~150 KB
pro Bild) und nach `assets/verkauft/<kuerzel>/<kuerzel>-XX.jpg` geschrieben:

- `Haupt.jpg` → `<kuerzel>-haupt.jpg`
- `..._7.jpg` → `<kuerzel>-07.jpg` (zweistellig aufgefüllt, damit die Sortierung stimmt)

Zusätzlich kleine Vorschaubilder (320 px) in einen Temp-Ordner erzeugen, um die Bilder
schnell durchsehen und einteilen zu können.

## Schritt 2: Bilder sichten und einteilen

Vorschaubilder durchsehen und drei Gruppen bilden – diese Reihenfolge gilt überall:

1. **Hauptbild** (Titelmotiv, meist Front schräg)
2. **Außenaufnahmen** (Studio: Seite, Heck, Front, Vogelperspektive, Karosserie-Details)
3. **Motor/Technik**, dann **Innenraum**

Daraus auswählen:
- 1 Hauptbild + 3 Kachel-Bilder (z. B. Seite, Cockpit, Motor) für die Referenzen-Seite
- 6–8 Highlight-Bilder für die Scroll-Stationen der Einzelseite

## Schritt 3: Einzelseite `<kuerzel>.html` erstellen

`gallardo.html` als Vorlage kopieren und anpassen (Magazin-Stil, von Fabian gewählt):

- `<title>`, `meta description`, `h1`: voller Fahrzeugname
- Zitat/Text von Fabian in der ersten Station (`.zitat`)
- `stationsBilder`: die 6–8 Highlight-Bilder mit passenden Bildunterschriften
  (jede Station hat `data-img="N"` passend zum Index im Array)
- Arrays `aussen`, `motor`, `innen`: alle Bildnummern in der richtigen Reihenfolge –
  daraus entsteht die Foto-Wand mit Lightbox
- Basis-Pfad `var basis = 'assets/verkauft/<kuerzel>/<kuerzel>-';`

## Schritt 4: Referenzen-Seite (`referenzen.html`)

- Neues Fahrzeug als Kachel in `.sold-grid` einfügen (Foto, Name, Badge "Verkauft"),
  als Link auf die Einzelseite. Neueste/wichtigste Referenz zuerst.
- Nur der stolzeste Besitz (aktuell der Gallardo) bleibt im eigenen Bereich oben.

## Schritt 5: Startseite (`index.html`)

- Im Referenzen-Bereich (`#referenzen`) die Kachel ergänzen bzw. tauschen –
  gleiche Kachelgröße wie die bestehenden, Link auf die Einzelseite.

## Schritt 6: Übersetzungen (`assets/i18n.js`)

Alle neuen deutschen Texte (Bildunterschriften der Stationen) als Schlüssel ins Wörterbuch
eintragen mit Übersetzungen `en`, `fr`, `it`. Eigennamen (Fahrzeugname, Farbnamen) und
Fabians Original-Zitate werden nicht übersetzt.

## Schritt 7: Prüfen, committen, pushen

- Lokal im Browser testen: Stationen wechseln beim Scrollen, Foto-Wand + Lightbox,
  Sprachumschalter.
- `git add` nur der Web-Bilder (`assets/verkauft/<kuerzel>/`) und geänderten Dateien –
  **niemals** den Ordner `Fotos verkaufte/`.
- Commit + Push → Cloudflare deployt automatisch in 1–2 Minuten.

## Merkregeln

- Mobile Ansicht ist abgenommen: mobile Werte in den `@media (max-width: …)`-Blöcken
  nicht antasten, Änderungen gelten sonst immer für Desktop UND Mobil.
- Bildreihenfolge überall: Haupt → Außen → Motor → Innen.
- Auf der Referenzen-Seite stehen seit Juli 2026 zwei Fahrzeuge pro Reihe.
