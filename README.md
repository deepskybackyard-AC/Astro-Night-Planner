# Astro Night Planner 0.5

Eine installierbare, mobile Web-App für astronomisches Wetter, Mond-/Dämmerungsdaten, Deep-Sky-Objektbewertung, vollständige Aufnahmekataloge und persönliche Kamera-/Teleskopprofile. Die App benötigt weder einen kostenpflichtigen Dienst noch einen API-Schlüssel.

## Enthaltene Funktionen

- GPS, Ortssuche und direkte Koordinateneingabe
- mehrere lokal gespeicherte Beobachtungsorte
- aktueller Tag plus sieben weitere Nächte
- Sonnenuntergang, nautische und astronomische Dämmerung
- Mondaufgang, Mondkulmination, maximale Höhe, Monduntergang und Beleuchtung
- Wettervergleich aus DWD ICON, ECMWF IFS und NOAA GFS via Open-Meteo
- tiefe, mittlere und hohe Wolken, Wind, Böen, Feuchte, Taupunkt, Sichtweite, Niederschlag und Jetstream
- Modellmedian, Modellstreuung und gemeinsamer Nachtwert
- standardmäßig eingeklappte Meteoblue-Astronomy-Seeing-Kontrollansicht mit mobiler Vollbilddarstellung und Standortübernahme
- abgeleitete Seeing- und Transparenz-Tendenzen
- Höhe, Meridian, Sichtbarkeitsdauer, Mondabstand und Objekt-Rangliste
- persönliche Teleskope und Kameras pro Browser/Endgerät
- Bildfeld und Pixelmaßstab
- interaktive Aladin-Lite-Himmelsansicht mit verschiebbarem und rotierbarem Kamerarahmen
- gekoppelte Uhrzeitauswahl mit Höhenkurve, lokaler Horizontansicht, Boden-Schalter und stündlicher Objektposition
- responsive Smartphone-Oberfläche und PWA-Manifest

## Integrierte Objektkataloge

Die Kataloge liegen lokal in der App. Für die Objektsuche ist daher keine zusätzliche API erforderlich.

- **Messier:** 110 Objekte; M 102 wird der üblichen modernen Zuordnung NGC 5866 zugeordnet
- **NGC:** gültige, positionsbestimmte Aufnahmeziele aus OpenNGC
- **IC:** gültige, positionsbestimmte Aufnahmeziele aus OpenNGC
- **Sharpless 2:** alle 313 Einträge
- **Abell-PN:** 83 heute gelistete Einträge des Abell-Katalogs planetarischer Nebel
- zusätzliche gebräuchliche Deep-Sky-Ziele und fachlich nachbearbeitete Namen, Größen und Filterempfehlungen

Historisch als Duplikat oder nicht existent geführte NGC-/IC-Datensätze werden nicht als Aufnahmeziele angeboten. Der Begriff **Abell** bezeichnet in dieser App den Abell-Katalog planetarischer Nebel, nicht den Abell-Katalog von Galaxienhaufen.

Für eine flüssige Smartphone-Nutzung wendet die App zunächst Katalog-, Typ-, Helligkeits- und Größenfilter auf den gesamten lokalen Datenbestand an. Anschließend werden die aussichtsreichsten Kandidaten für den Standort und die gewählte Nacht astronomisch detailliert berechnet. Die Textsuche arbeitet weiterhin über den gesamten Katalog.

## Lokal starten

Voraussetzung: Node.js 22 oder neuer.

```bash
npm install
npm run dev
```

Danach die angezeigte lokale Adresse im Browser öffnen.

## Produktions-Build

```bash
npm run build
npm run preview
```

Der fertige Inhalt liegt in `dist/`.

## Veröffentlichung über GitHub Pages

1. Neues GitHub-Repository anlegen.
2. Den Inhalt dieses Projektordners hochladen und nach `main` pushen.
3. In GitHub unter **Settings → Pages → Build and deployment** als Quelle **GitHub Actions** wählen.
4. Der enthaltene Workflow `.github/workflows/deploy-pages.yml` baut und veröffentlicht die App automatisch.

## Speicherung und Datenschutz

Standorte, Filter sowie Kamera- und Teleskopprofile werden ausschließlich über `localStorage` im Browser des jeweiligen Nutzers gespeichert. Es gibt keine Benutzerkonten und keine zentrale Datenbank.

GPS-Koordinaten werden für Wetterabfragen an Open-Meteo übertragen. Die Aladin-Himmelsansicht lädt Bildkacheln vom CDS Strasbourg. Beim Öffnen der Meteoblue-Kontrollansicht werden Standortinformationen an Meteoblue übertragen; bei GPS- oder rein manuell eingegebenen Standorten kann Meteoblue zusätzlich eine eigene Standortfreigabe anfordern. Diese Hinweise sollten vor einer öffentlichen Veröffentlichung in eine Datenschutzerklärung aufgenommen werden.

## Datenquellen

- Open-Meteo: Wetter, Geocoding und Geländehöhe
- Astronomy Engine: lokale astronomische Berechnungen
- Aladin Lite / CDS: interaktive Himmelsbilder
- Meteoblue Astronomy Seeing Widget: zusätzliche Kontrollvorhersage, nicht Bestandteil der App-Gesamtbewertung
- OpenNGC: NGC-, IC- und Messier-Grunddaten
- Sharpless 1959 / VizieR VII/20: Sharpless-2-Katalog
- Abell-Katalog planetarischer Nebel

Ausführliche Herkunfts- und Lizenzangaben stehen in `CATALOG_SOURCES.md`.

## Meteoblue-Kontrollansicht

Meteoblue wird als zusätzliche, unabhängige Vergleichsansicht direkt in der Wetterseite angezeigt. Bei Orten aus der Ortssuche wird die GeoNames-Ortskennung automatisch in die Meteoblue-URL übernommen. Für GPS-Standorte nutzt das Widget seine eigene Standorterkennung. Die Kontrollansicht ist beim Start eingeklappt. Beim Aufklappen wird sie für den aktuell ausgewählten Ort neu geladen; die Schaltfläche **Großansicht** öffnet auf Smartphones eine bildschirmfüllende Darstellung. Auch manuell gespeicherte Orte werden anhand ihres Namens möglichst einer GeoNames-Ortskennung zugeordnet.

Die Meteoblue-Werte werden bewusst nicht aus dem eingebetteten Widget ausgelesen und nicht in die automatische Punktzahl eingerechnet. Der App-Konsens bleibt transparent aus DWD ICON, ECMWF IFS und NOAA GFS berechnet.

## Fachliche Grenzen dieser Entwicklungsfassung

- Seeing und Transparenz sind Schätzindizes von 0 bis 100 und keine exakten Werte in Bogensekunden.
- Viele schwache Katalogobjekte besitzen keine verlässliche integrierte Magnitude oder Winkelgröße. Solche fehlenden Werte werden nicht erfunden und als „–“ beziehungsweise „nicht katalogisiert“ angezeigt.
- Der Rahmen in Aladin nutzt für kleine und mittlere Bildfelder eine Tangentialebenen-Näherung. Für sehr große Bildfelder und Mosaike sollte später eine sphärische Framing-Bibliothek ergänzt werden.


## Uhrzeit, Höhenkurve und Horizontansicht

Bei einem geöffneten Objekt verwenden Höhenkurve und Horizontansicht dieselbe gewählte Uhrzeit. Die Uhrzeit kann über ein Zeitfeld, einen Nacht-Regler, 15-Minuten-Schritte, die Höhenkurve oder die stündlichen Schaltflächen geändert werden. Höhe, Azimut, Markierung in der Kurve und lokale Horizontansicht aktualisieren sich gemeinsam.

Der Boden ist standardmäßig sichtbar und kann abgeschaltet werden. Die dargestellte Horizontlinie ist der mathematische Horizont des gewählten Standorts; Bäume, Gebäude und Berge sind noch kein individuelles Horizontprofil.
