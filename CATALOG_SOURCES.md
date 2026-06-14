# Herkunft und Lizenzen der Katalogdaten

## OpenNGC

NGC-, IC- und Messier-Grunddaten wurden aus **OpenNGC** abgeleitet.

- Projekt: OpenNGC von Mattia Verga
- Lizenz: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- Enthaltene Felder: Bezeichnungen, Positionen, Objekttypen, Helligkeiten, Flächenhelligkeiten, Winkelgrößen, Sternbilder und alternative Identifikationen
- Anpassungen in dieser App: Ausschluss von als Duplikat oder nicht existent geführten Einträgen, kompakte Datenstruktur, deutsche Typ- und Sternbildbezeichnungen, Zusammenführung von Kreuzidentifikationen und fachlich kuratierte Korrekturen

Die aus OpenNGC abgeleiteten Katalogdaten in `src/data/catalog.generated.json` werden unter denselben Bedingungen CC BY-SA 4.0 weitergegeben.

## Sharpless 2

Die 313 Einträge des Sharpless-2-Katalogs beruhen auf:

- Stewart Sharpless, *A Catalogue of H II Regions*, Astrophysical Journal Supplement Series 4, 257–280 (1959)
- VizieR-Katalog VII/20

Die historischen B1900-Positionen wurden für die App nach ICRS/J2000 transformiert. Kuratierte bekannte Objekte können durch aktuellere Werte überschrieben werden.

## Abell-PN

Enthalten sind 83 heute gelistete Einträge des Abell-Katalogs planetarischer Nebel. Historisch verworfene Einträge werden nicht als planetarische Nebel geführt. Abell 75 und Abell 81 sind über ihre NGC-/IC-Kreuzidentifikationen ergänzt.

## Kuratierte Ergänzungen

`src/data/curated.ts` enthält gebräuchliche deutsche Namen, einzelne aktuelle Größen-/Typkorrekturen und praxisbezogene Filterempfehlungen. Diese Angaben sind Bestandteil des App-Projekts.
