# Update auf Version 0.9

Dieses Paket ist kumulativ und kann direkt über Version 0.8 oder eine ältere bereitgestellte Version hochgeladen werden.

## Aktualisierung auf GitHub

1. `astro-night-planner-v0.9-update-only.zip` entpacken.
2. Im GitHub-Repository **Code → Add file → Upload files** öffnen.
3. Den gesamten Inhalt des entpackten Ordners hineinziehen.
4. Vorhandene Dateien ersetzen beziehungsweise aktualisieren lassen.
5. Commit-Nachricht eintragen, zum Beispiel:

```text
Add confirmed settings and temporary planning profiles
```

6. **Commit changes** bestätigen.
7. Unter **Actions** den automatisch gestarteten Build kontrollieren.

## Änderungen

- Aufnahmequalitäts- und Darstellungsprofil besitzen ein eindeutiges Feld **Aktiv**.
- Profile können bearbeitet werden, ohne sie dadurch zu aktivieren.
- Beide Profile können in der Planung temporär umgeschaltet werden.
- Zentrale Einstellungen und Horizontdaten werden erst nach Betätigung des jeweiligen Speichern-Buttons übernommen.
- Gewichtungen verwenden ganzzahlige Eingabefelder statt Schiebereglern.
- Himmelsrichtungen werden im Horizonteditor und in der großen Höhenkurve angezeigt.
- Mini-Höhenprofile zeigen Dämmerungsphasen in Grauabstufungen und sichtbare Grenzlinien.
- Der Regler für die Objektrotation ist wesentlich kompakter.

## Nach erfolgreichem Build

- Desktop: mit `Strg + F5` neu laden.
- Smartphone/PWA: vollständig schließen und erneut öffnen.
- Falls weiterhin die alte Version erscheint, den Seiten-Cache löschen oder die PWA neu installieren.
