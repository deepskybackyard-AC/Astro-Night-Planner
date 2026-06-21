# Produktivversion 1.0

Die Produktivversion basiert auf der bestätigten Testversion 23.

## Produktiv-Anpassungen

- Build-Konfiguration auf `prod` umgestellt.
- App-Version auf `1.0.0` gesetzt.
- Produktive IndexedDB: `astro-night-planner-prod-v1`.
- Produktiver PWA-Cache: `astro-night-planner-prod-1.0.0`.
- Test-Badge, gelbe Testkennzeichnung und Test-Manifest entfernt.
- Service Worker löscht zusätzlich versehentlich vorhandene Test-Caches auf der produktiven Installationsadresse.
- Erststartprofil enthält keine vorgegebenen Orte, Teleskope, Kameras, Montierungen oder Setups.
- Planungsansicht zeigt beim Erststart einen klaren Hinweis, dass zuerst ein Standort angelegt werden muss.
- Standortverwaltung ist bei leerer Standortliste erststartfähig und öffnet den Bereich zum Hinzufügen eines neuen Standorts.
- Handbuch, Hilfe, README und Installationshinweise auf Produktivversion angepasst.

## Enthaltene fachliche Funktionen aus Test 23

- Verbesserte Aladin-Mondanzeige mit pixelstabilem SVG/DOM-Symbol.
- Basisfilter-Reset nur für die Basisfilter.
- Direktsuche ohne weitere Filter.
- Verbesserte Wikipedia-Suchlogik über Katalognummern.
- Vollständige DE/EN-Hilfe und PDF-Handbuch.
