# Update auf Version 0.8

Dieses Paket ist kumulativ und kann direkt über Version 0.7 oder eine ältere bereitgestellte Version hochgeladen werden.

## Aktualisierung auf GitHub

1. `astro-night-planner-v0.8-update-only.zip` entpacken.
2. Im GitHub-Repository **Code → Add file → Upload files** öffnen.
3. Den gesamten Inhalt des entpackten Ordners hineinziehen.
4. Vorhandene Dateien ersetzen beziehungsweise aktualisieren lassen.
5. Commit-Nachricht eintragen, zum Beispiel:

```text
Add central settings, horizons and paginated object list
```

6. **Commit changes** bestätigen.
7. Unter **Actions** den automatisch gestarteten Build kontrollieren.

## Nach erfolgreichem Build

- Desktop: App mit `Strg + F5` neu laden.
- Smartphone/PWA: App vollständig schließen und erneut öffnen.
- Falls weiterhin die alte Version erscheint, Browser-Cache der Seite löschen oder die PWA einmal entfernen und neu zum Startbildschirm hinzufügen.

## Wichtige Änderungen

- Hauptnavigation „Einstellungen“ mit vier Tabs
- zentrale km/h- bzw. m/s-Umschaltung
- Wind-Presets und einstellbare Grenzwerte
- farbliche Bewertung von Tauabstand, Wind, Böen und Jetstream
- anpassbare Gewichtung der Objektbewertung
- Standort- und Horizontverwaltung
- paginierte Haupt-Objektliste
- frei konfigurierbare Spalten und Reihenfolge
- verbessertes Mini-Höhenprofil
- überarbeitete Objektgrößenanzeige in der Rahmung

Die lokale Browser-Speicherung bleibt zunächst erhalten. Login und zentrale Synchronisierung folgen in einer späteren Version.
