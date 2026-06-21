# Prüfprotokoll Produktivversion 1.0

## Geprüft

- JavaScript-Syntax `assets/app.js`.
- JavaScript-Syntax der Skripte aus `aladin-frame.html`.
- JSON-Dateien: Manifest, Package, Package-Lock, VERSION.
- Service-Worker-Version `1.0.0` und produktiver Cache-Name.
- Build-Konfiguration: `environment: prod`, `repositoryRole: prod`, `databaseName: astro-night-planner-prod-v1`.
- Erststartprofil ohne Orte, Teleskope, Kameras, Montierungen und Setups.
- Standortverwaltung mit leerer Standortliste.
- Handbuch-PDFs neu erzeugt und stichprobenartig gerendert.
- ZIP-Integritätstest.

## Hinweis

Die produktive App liest bewusst nicht die alte Test-IndexedDB. Wenn im produktiven Repository versehentlich eine Testversion aktiv war, bleiben deren Testdaten getrennt und werden von dieser Produktivversion nicht verwendet.
