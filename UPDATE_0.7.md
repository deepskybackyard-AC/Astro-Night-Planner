# Update auf Version 0.7

Das Update ist kumulativ und kann direkt über Version 0.6 eingespielt werden.

## GitHub aktualisieren

1. `astro-night-planner-v0.7-update-only.zip` entpacken.
2. In GitHub **Code → Add file → Upload files** öffnen.
3. Den gesamten Inhalt des entpackten Ordners hineinziehen.
4. Vorhandene Dateien ersetzen beziehungsweise aktualisieren lassen.
5. Committen, zum Beispiel mit:

```text
Add planning windows, object selector and improved framing
```

GitHub Actions baut die App anschließend automatisch neu.

Nach erfolgreichem Build die Seite mit `Strg + F5` neu laden. Auf Smartphones die installierte PWA beziehungsweise den Browser vollständig schließen und erneut öffnen, damit der Service-Worker-Cache der Version 0.7 verwendet wird.
