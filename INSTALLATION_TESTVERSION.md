# Installation der Testkorrektur 1.0.0-test.4

1. `astro-night-planner-v1.0-test-korrektur-4-update.zip` entpacken.
2. Den gesamten entpackten Inhalt in das Stammverzeichnis des Test-Repositorys kopieren beziehungsweise hochladen.
3. Gleichnamige Dateien ersetzen.
4. Den bereits vorhandenen Ordner `src` und insbesondere `src/data/catalog.generated.json` nicht löschen.
5. Prüfen, dass `.github/workflows/deploy-pages.yml` weiterhin vorhanden ist und die statische Seite veröffentlicht.
6. Nach `main` committen und unter **Actions** warten, bis der Pages-Workflow grün abgeschlossen ist.
7. Die Testseite zunächst mit `Strg + F5` neu laden.
8. Falls noch eine ältere Fassung erscheint, Service Worker und Websitedaten ausschließlich für die Testadresse löschen und erneut laden.

## Erkennungsmerkmale

- gelber Titel,
- sichtbarer Hinweis `TESTVERSION`,
- Browser-Titel mit `Korrektur 4`,
- unter **Info** beziehungsweise in `VERSION.json`: `1.0.0-test.4`.

## Empfohlene erste Prüfung

1. Unter **Einstellungen → Zentrale Einstellungen → Wolkenkarte und Datenmenge** zunächst 25 Kartenpunkte wählen und speichern.
2. In die Planung wechseln und die Wolkenkarte öffnen.
3. Konsens, Einzelmodelle, Wolkenschichten und Modellabweichung umschalten.
4. Zeitregler und Animation testen.
5. Danach bei Bedarf 49 oder 81 Kartenpunkte wählen.
6. Meteoblue Astronomy Seeing und die zusätzliche Meteoblue-Wetterkarte öffnen.

Das Produktiv-Repository bleibt bis zur ausdrücklichen Freigabe unverändert.
