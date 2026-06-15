# Astro Night Planner 0.9

Eine installierbare, für Smartphones optimierte Web-App zur Planung von Deep-Sky-Aufnahmen. Sie verbindet Wettermodelle, Sonne/Mond, Dämmerungszeiten, vollständige Objektkataloge, persönliche Standorte und Horizontprofile sowie das Bildfeld eigener Kamera-/Teleskop-Kombinationen. Für diese Version sind weder ein kostenpflichtiger Dienst noch ein persönlicher API-Schlüssel erforderlich.

## Neu in Version 0.9

### Bestätigte Einstellungen statt Sofortübernahme

Die Rubriken **Allgemein**, **Aufnahmequalität**, **Gewichtung**, **Objektliste**, **Standortverhalten** und **Persönlicher Horizont** besitzen eigene Speichern- und Verwerfen-Schaltflächen. Ungespeicherte Änderungen werden sichtbar markiert und erst nach Bestätigung dauerhaft übernommen.

### Aktive und temporäre Profile

- eigenes Feld **Aktiv** für Aufnahmequalitäts- und Darstellungsprofil
- das Bearbeiten eines Profils aktiviert es nicht automatisch
- temporäre Profilwahl direkt in der Planungsansicht
- optionales **Als Standard übernehmen**
- klare Trennung zwischen Aufnahme-Setup, Aufnahmequalitätsprofil, Bewertungsprofil und Darstellungsprofil

### Präzisere Höhenanzeigen

- die große Höhenkurve zeigt zu jeder Stundenmarke zusätzlich N, NO, O, SO, S, SW, W oder NW
- das Mini-Höhenprofil zeigt den gesamten Zeitraum von Sonnenuntergang bis Sonnenaufgang
- Dämmerungsphasen erscheinen in Grauabstufungen; je dunkler der Zeitraum, desto dunkler die Fläche
- vertikale Dämmerungsgrenzen und der gewählte Planungszeitraum sind sichtbar
- Start, Ende, Höchstpunkt und Mindesthöhe bleiben erhalten

### Horizont und Bedienung

- Horizontachsen und Eingabefelder zeigen zusätzlich Himmelsrichtungen
- 0° = N, 45° = NO, 90° = O, 135° = SO, 180° = S, 225° = SW, 270° = W, 315° = NW
- der Rotationsregler der Objektellipse ist kompakter und verbreitert die Rahmungsansicht nicht mehr
- Gewichtungen werden nur noch als ganze Prozentwerte eingegeben

## Bereits enthaltene Kernfunktionen

- GPS, Ortssuche und direkte Koordinateneingabe
- heutige Nacht plus sieben weitere Nächte
- Sonnenuntergang, Dämmerungsgrenzen und Sonnenaufgang
- Mondaufgang, Kulmination, maximale Höhe, Untergang und Beleuchtung
- Wettervergleich aus DWD ICON, ECMWF IFS und NOAA GFS via Open-Meteo
- stündliche Wettertabelle von Sonnenuntergang bis Sonnenaufgang
- Meteoblue Astronomy Seeing als standardmäßig eingeklappte Kontrollansicht
- Messier-, NGC-, IC-, Sharpless-2- und Abell-PN-Kataloge
- wählbarer Planungszeitraum; Standard ist der nautische Zeitraum
- persönliche Teleskope und Kameras
- Bildfeld, Pixelmaßstab und interaktive Aladin-Lite-Rahmung
- große Höhenkurve, gekoppelte Uhrzeit und persönliche Horizontansicht
- PWA-Manifest und GitHub-Pages-Workflow

## Integrierte Objektkataloge

- Messier: 110 Objekte
- NGC und IC aus OpenNGC
- Sharpless 2: 313 Einträge
- Abell-Katalog planetarischer Nebel: 83 Einträge
- zusätzliche gebräuchliche Deep-Sky-Ziele

Die Katalogdaten liegen lokal in der App. Fehlende Werte wie Magnitude, Flächenhelligkeit, Größe oder Positionswinkel werden nicht erfunden.

## Lokal starten

Voraussetzung: Node.js 22 oder neuer.

```bash
npm install
npm run dev
```

## Prüfung und Produktions-Build

```bash
npm run check
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

Version 0.9 speichert Standorte, Horizontprofile, Ausrüstung, Grenzwerte, Gewichtungen und Anzeigeeinstellungen weiterhin im `localStorage` des jeweiligen Browsers. Das ist eine Übergangslösung.

Für eine spätere Ausbaustufe vorgesehen:

- Login pro Nutzer
- zentrale, geräteübergreifende Speicherung
- Synchronisierung von Teleskopen, Kameras, Standorten und Einstellungen
- optionaler individueller nächtlicher Zeitrahmen

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
- Der Jetstream ist ein wichtiger Seeing-Indikator, aber keine vollständige Seeing-Prognose.
- Windfarben sind keine Sicherheitsfreigabe.
- Der Sensorrahmen ist ein geometrisch rechteckiges Bildschirm-Overlay; großflächige Himmelsprojektionen können davon abweichen.
- Benutzerkonten und zentrale Synchronisierung sind noch nicht enthalten.
