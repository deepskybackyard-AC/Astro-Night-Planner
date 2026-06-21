# Astro Night Planner 1.0.2

Produktivversion des Astro Night Planners für GitHub Pages.

Öffentliche Adresse:

https://planner.deepskyastrophoto.de

## Inhalt der Version 1.0.2

- Korrektur des Produktivpakets 1.0.1: Die Navigation „Planung“ und „Einstellungen“ ist nun auch in der Produktivversion oben rechts in der festen Kopfzeile enthalten.
- Die versehentlich verbliebene untere/floating Navigation wurde entfernt.
- LDN-Katalog aus Version 1.0.1 bleibt enthalten: 1787 benannte Lynds-Dunkelnebel, inklusive Suche nach `LDN 1093` und `LDN1093`.
- Katalogfilter „LDN/LBN“ nutzt weiterhin die importierten LDN-Daten. LBN ist weiterhin noch kein eigener importierter Katalog.

## Deployment

GitHub Pages ist für dieses Repository auf „Deploy from a branch“ eingestellt:

- Branch: `main`
- Ordner: `/ (root)`

Zum Einspielen einer neuen Produktivversion den Inhalt des Produktivpakets in das Repository übernehmen, committen und nach `main` pushen.

Die Datei `CNAME` muss im Hauptverzeichnis erhalten bleiben und enthält:

```text
planner.deepskyastrophoto.de
```

## Lokale Daten

Persönliche Einstellungen, Profile, Standorte und Ausrüstung werden lokal im Browser in IndexedDB gespeichert. PWA-Dateien liegen im Cache Storage. Vor dem manuellen Löschen von Websitedaten sollte in der App eine Sicherung exportiert werden.

## Dokumente

- `INSTALLATION_ASTRO_NIGHT_PLANNER_1.0.2_PRODUKTIV.md`
- `KORREKTUREN_PRODUKTVERSION_1.0.2.md`
- `PRUEFPROTOKOLL_PRODUKTVERSION_1.0.2.md`
- `docs/ASTRO_NIGHT_PLANNER_HANDBUCH.html`
- `docs/ASTRO_NIGHT_PLANNER_HANDBUCH.pdf`
