# Astro Night Planner 1.0.1

Produktivversion des Astro Night Planners für GitHub Pages.

Öffentliche Adresse:

https://planner.deepskyastrophoto.de

## Inhalt der Version 1.0.1

- Navigation „Planung“ und „Einstellungen“ in die feste Kopfzeile oben rechts verschoben.
- Bisherige untere/floating Navigation entfernt.
- LDN-Katalog mit 1787 benannten Lynds-Dunkelnebeln ergänzt.
- Suche nach Schreibweisen wie `LDN 1093` und `LDN1093` unterstützt.
- Katalogfilter „LDN/LBN“ nutzt jetzt die importierten LDN-Daten. LBN ist weiterhin noch kein eigener importierter Katalog.
- Hilfe, PDF-Handbuch, Katalogquellen und Versionshinweise aktualisiert.

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

- `INSTALLATION_ASTRO_NIGHT_PLANNER_1.0.1_PRODUKTIV.md`
- `KORREKTUREN_PRODUKTVERSION_1.0.1.md`
- `PRUEFPROTOKOLL_PRODUKTVERSION_1.0.1.md`
- `docs/ASTRO_NIGHT_PLANNER_HANDBUCH.html`
- `docs/ASTRO_NIGHT_PLANNER_HANDBUCH.pdf`
