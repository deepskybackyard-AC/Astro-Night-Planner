# Astro Night Planner 1.0.0

Produktivfassung für das produktive Repository des Astro Night Planners.

## Wichtig

Diese Version verwendet die produktive IndexedDB `astro-night-planner-prod-v1` und den produktiven PWA-Cache `astro-night-planner-prod-1.0.0`. Frühere versehentlich hochgeladene Test-Caches werden beim Aktivieren des Service Workers entfernt.

Beim Erststart enthält das Profil bewusst keine vorgegebenen Orte, Teleskope, Kameras, Montierungen oder Setups. Vor der ersten Planung muss mindestens ein Standort angelegt werden; für Framing und Sensorfilterung müssen Teleskop und Kamera erfasst werden.

Profile und Einstellungen liegen in IndexedDB, PWA-Dateien in Cache Storage. Vor dem Löschen von Websitedaten immer eine externe Sicherung erstellen.

Den vorhandenen Ordner `src` im Repository nicht löschen. Der GitHub-Pages-Workflow übernimmt daraus den vollständigen Objektkatalog nach `assets/catalog.generated.json`.

## Dokumente

- `INSTALLATION_ASTRO_NIGHT_PLANNER_1.0_PRODUKTIV.md`
- `KORREKTUREN_PRODUKTVERSION_1.0.md`
- `PRUEFPROTOKOLL_PRODUKTVERSION_1.0.md`
- `docs/ASTRO_NIGHT_PLANNER_HANDBUCH.html`
- `docs/ASTRO_NIGHT_PLANNER_HANDBUCH.pdf`
