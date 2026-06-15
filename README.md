# Astro Night Planner 0.7

Eine installierbare, für Smartphones optimierte Web-App zur Planung von Deep-Sky-Aufnahmen. Sie verbindet Wettermodelle, Sonne/Mond, Dämmerungszeiten, Objektkataloge, Sichtbarkeit und das Bildfeld persönlicher Kamera-/Teleskop-Kombinationen. Für die aktuelle Version sind weder ein kostenpflichtiger Dienst noch ein API-Schlüssel erforderlich.

## Neu in Version 0.7

- frei wählbarer Bezugszeitraum für Höhe, Sichtbarkeit und Objektbewertung
  - Sonnenuntergang bis Sonnenaufgang
  - nautischer Planungszeitraum: Sonne unter −6° (Standard)
  - astronomischer Planungszeitraum: Sonne unter −12°
  - astronomische Nacht: Sonne unter −18°
- die Auswahl des Bezugszeitraums wird im Browser gespeichert
- filterbare, aufklappbare Objekt-Auswahlliste mit Maximalhöhe, Sichtbarkeitsdauer, Meridianzeit, Framing und kleiner Höhenkurve
- Höhenkurve ohne Beschriftung innerhalb der Dämmerungsflächen; die Legende bleibt erhalten
- dünnere Höhenkurve
- Setup-Rahmen wird als geometrisch echtes Rechteck mit vier 90°-Winkeln dargestellt
- dünnere Rahmenlinie und kleinere Eckpunkte
- Teleskop und Kamera können direkt unterhalb der Rahmung gewechselt werden
- Höhenkurve, Horizontansicht und Rahmung sind einzeln ein- und ausklappbar
- der Zustand dieser drei Bereiche wird für den nächsten Aufruf gespeichert
- beim Wechsel zwischen Planung, Ausrüstung und Info bleibt die Scrollposition einschließlich des geöffneten Objekts erhalten

## Enthaltene Funktionen

- GPS, Ortssuche und direkte Koordinateneingabe
- mehrere lokal gespeicherte Beobachtungsorte
- heutige Nacht plus sieben weitere Nächte
- Sonnenuntergang, Dämmerungsgrenzen und Sonnenaufgang
- Mondaufgang, Mondkulmination, maximale Höhe, Monduntergang und Beleuchtung
- Wettervergleich aus DWD ICON, ECMWF IFS und NOAA GFS via Open-Meteo
- tiefe, mittlere und hohe Wolken, Temperatur, Taupunktabstand, Wind, Böen, Jetstream, Seeing- und Transparenz-Tendenz
- stündliche Wettertabelle von Sonnenuntergang bis Sonnenaufgang
- Meteoblue Astronomy Seeing als einklappbare Kontrollansicht
- Objektbewertung anhand des gewählten Planungszeitraums
- persönliche Teleskope und Kameras
- Bildfeld und Pixelmaßstab
- interaktive Aladin-Lite-Himmelsansicht mit verschiebbarem und rotierbarem Sensorrahmen
- gekoppelte Uhrzeit für Höhenkurve und Horizontansicht
- PWA-Manifest und GitHub-Pages-Workflow

## Integrierte Objektkataloge

- Messier: 110 Objekte
- NGC und IC aus OpenNGC
- Sharpless 2: 313 Einträge
- Abell-Katalog planetarischer Nebel: 83 Einträge
- zusätzliche gebräuchliche Deep-Sky-Ziele

Die Katalogdaten liegen lokal in der App. Die Textsuche arbeitet über den gesamten Katalog. Für eine flüssige Smartphone-Nutzung werden anschließend nur die aussichtsreichsten Kandidaten astronomisch im Detail berechnet.

## Lokal starten

Voraussetzung: Node.js 22 oder neuer.

```bash
npm install
npm run dev
```

## Produktions-Build

```bash
npm run build
npm run preview
```

Der fertige Inhalt liegt in `dist/`.

## Veröffentlichung über GitHub Pages

1. Den Inhalt des Projektordners in das GitHub-Repository hochladen.
2. Nach `main` committen.
3. Unter **Settings → Pages → Build and deployment** als Quelle **GitHub Actions** wählen.
4. `.github/workflows/deploy-pages.yml` baut und veröffentlicht die App automatisch.

## Speicherung und spätere Synchronisierung

In Version 0.7 werden Standorte, Filter, ausgewählte Ausrüstung und Anzeigezustände noch in `localStorage` des jeweiligen Browsers gespeichert. Diese Speicherung ist nur eine Zwischenlösung.

Geplant ist später:

- Login pro Nutzer
- zentrale, geräteübergreifende Speicherung
- persönliche Teleskope, Kameras und Standorte
- Synchronisierung zwischen Smartphone, Tablet und PC
- optional ein individuell gespeicherter nächtlicher Zeitrahmen

## Datenquellen

- Open-Meteo: Wetter, Geocoding und Geländehöhe
- Astronomy Engine: lokale astronomische Berechnungen
- Aladin Lite / CDS: interaktive Himmelsbilder
- Meteoblue Astronomy Seeing Widget: zusätzliche Kontrollvorhersage, nicht Bestandteil des automatischen Modellkonsenses
- OpenNGC: NGC-, IC- und Messier-Grunddaten
- Sharpless / VizieR: Sharpless-2-Katalog
- Abell-Katalog planetarischer Nebel

Ausführliche Herkunfts- und Lizenzangaben stehen in `CATALOG_SOURCES.md`.

## Fachliche Grenzen

- Seeing und Transparenz sind Tendenzwerte von 0 bis 100, keine gemessenen Bogensekundenwerte.
- Fehlende Magnituden und Objektgrößen werden nicht geschätzt.
- Der rechteckige Sensorrahmen ist eine Bildschirmdarstellung in der lokalen Tangentialebene. Bei sehr großen Bildfeldern ist die gekrümmte Himmelsprojektion davon zu unterscheiden.
- Benutzerkonten und zentrale Synchronisierung sind noch nicht enthalten.
