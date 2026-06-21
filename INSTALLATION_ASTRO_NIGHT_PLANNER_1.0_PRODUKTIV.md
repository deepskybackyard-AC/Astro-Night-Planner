# Installation Astro Night Planner 1.0 Produktivversion

Diese ZIP-Datei ist für das produktive Repository bestimmt.

## Installation

1. Vorhandene produktive Daten bei Bedarf über die App sichern.
2. Inhalt der ZIP-Datei vollständig in das produktive Repository hochladen.
3. GitHub Pages Deployment abwarten.
4. Die produktive Seite öffnen und einmal hart neu laden.
5. Prüfen, ob unter Info die Umgebung `Produktion`, die Datenbank `astro-night-planner-prod-v1` und die Version `1.0.0` angezeigt werden.

## Wichtig nach versehentlich hochgeladener Testversion

Der produktive Service Worker verwendet `astro-night-planner-prod-1.0.0` und löscht beim Aktivieren zusätzlich alte `astro-night-planner-test-*` Caches auf derselben Installationsadresse. Die produktive App liest nicht aus der Testdatenbank `astro-night-planner-test-v1`.

## Erststart

Die Produktivversion enthält keine vorgegebenen Beispiel-Orte, Teleskope oder Kameras. Beim ersten Start muss zunächst ein Standort angelegt werden. Für Framing und Sensorfilterung müssen anschließend Teleskop und Kamera erfasst werden.
