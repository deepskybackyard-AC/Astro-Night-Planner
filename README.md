# Astro Night Planner 0.8

Eine installierbare, für Smartphones optimierte Web-App zur Planung von Deep-Sky-Aufnahmen. Sie verbindet Wettermodelle, Sonne/Mond, Dämmerungszeiten, vollständige Objektkataloge, persönliche Standorte und Horizontprofile sowie das Bildfeld eigener Kamera-/Teleskop-Kombinationen. Für diese Version sind weder ein kostenpflichtiger Dienst noch ein persönlicher API-Schlüssel erforderlich.

## Neu in Version 0.8

### Einstellungen statt separater Ausrüstungsseite

Der bisherige Hauptbereich **Ausrüstung** heißt jetzt **Einstellungen**. Darin stehen vier erweiterbare Tabs zur Verfügung:

- **Ausrüstung**
- **Zentrale Einstellungen**
- **Standorte & Horizont**
- **Info**

Der zuletzt verwendete Einstellungstab wird lokal gespeichert.

### Zentrale Einheiten und Grenzwerte

- gemeinsame Einheit für Wind, Böen und Jetstream
- Standard: **km/h**
- alternativ m/s
- intern werden die Werte weiterhin in m/s gespeichert
- Presets für Wind und Böen:
  - leichtes Reisesetup
  - normales Setup
  - robuste Säule / Montierung
- anschließend freie Anpassung aller Grenzen
- farbliche Bewertung der Wettertabelle:
  - Tauabstand: grün über 5 °C, gelb 2–5 °C, rot unter 2 °C
  - Jetstream: grün unter 10 m/s, gelb 10–20 m/s, rot über 20 m/s
  - Wind und Böen gemäß ausgewähltem Preset oder eigenen Grenzen

Die Farben bewerten die erwartete Aufnahmequalität und stellen keine Sicherheitsfreigabe für die Ausrüstung dar.

### Einstellbare Gesamtbewertung

Das Standardprofil **Deep-Sky** verwendet:

- Wolken 30 %
- Transparenz 15 %
- Seeing 10 %
- Wind und Böen 10 %
- Tauabstand 10 %
- Mond 10 %
- Objekthöhe 10 %
- Sichtbarkeitsdauer 5 %

Alle Gewichte können verändert und automatisch auf 100 % normiert werden. Die Objekt- und Wetterbewertung verwendet unmittelbar die gespeicherten Werte.

### Standorte und persönlicher Horizont

Für jeden gespeicherten Standort können verwaltet werden:

- Standardstandort
- Verhalten der Standortauswahl beim Start
- Horizontpunkte aus Azimut und Höhe
- Hindernisse wie Bäume, Gebäude oder Berge
- grafische Vorschau des Horizontprofils

Das persönliche Horizontprofil wird bei Sichtbarkeitsdauer, Objektfilterung und Horizontansicht berücksichtigt.

### Paginierte und konfigurierbare Objektliste

- der zusätzliche Button „Objektliste öffnen“ wurde entfernt
- die zentrale Ergebnisliste wird seitenweise dargestellt
- wählbar sind 10, 20, 50 oder 100 Objekte pro Seite
- Standard: 20
- Seitennavigation oberhalb und unterhalb der Liste
- vereinfachte große Navigation auf Smartphones
- Filteränderungen setzen die Liste auf Seite 1 zurück
- aktuelle Seite wird gespeichert
- Darstellungsprofile: Kompakt, Standard und Detailliert
- sichtbare Spalten können einzeln gewählt werden
- Reihenfolge per Drag-and-drop oder Pfeiltasten
- Standardansicht wiederherstellbar

Das neue Mini-Höhenprofil besitzt eine echte 0–90°-Proportion, Mindesthöhenlinie, Start-/Endpunkte und einen markierten Höchstpunkt. Es verwendet den aktuell gewählten Planungszeitraum.

### Überarbeitete Rahmung

- eigene Informationsfelder liegen am rechten mittleren Rand und verdecken die Aladin-Bedienelemente nicht mehr
- Objektgröße kann unabhängig vom Setup-Rahmen ein- und ausgeblendet werden
- Objektgröße ist standardmäßig deaktiviert
- bekannte Positionswinkel werden automatisch verwendet
- eigener Rotationsregler für die Objektgröße als Korrektur oder Fallback
- Objektrotation und Kamerarahmenrotation sind voneinander unabhängig

### Info-Bereich

Der Info-Tab erläutert:

- Datenquellen und Wettermodelle
- Gesamtbewertung
- Seeing, Jetstream und Tauabstand
- Windbewertung und Sicherheitshinweis
- Objektkataloge und Lizenzen
- Datenschutz und lokale Speicherung
- Projekt- und Fehlerlink

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

Version 0.8 speichert Standorte, Horizontprofile, Ausrüstung, Grenzwerte, Gewichtungen und Anzeigeeinstellungen weiterhin im `localStorage` des jeweiligen Browsers. Das ist eine Übergangslösung.

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
