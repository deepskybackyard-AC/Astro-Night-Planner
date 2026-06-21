# Installation Astro Night Planner 1.0.2

Produktivpaket fuer `https://planner.deepskyastrophoto.de`.

## Einspielen

1. Produktiv-Repository lokal aktualisieren.
2. Alten Inhalt entfernen, aber den Ordner `.git` nicht loeschen.
3. Inhalt dieses ZIP-Pakets in das Repository kopieren.
4. Pruefen, dass `CNAME` vorhanden ist und `planner.deepskyastrophoto.de` enthaelt.
5. Commit und Push nach `main`.
6. GitHub Pages wartet auf Branch `main` und Ordner `/ (root)`.

## Nach dem Deploy pruefen

- `https://planner.deepskyastrophoto.de/VERSION.json` muss `1.0.2` anzeigen.
- Die Schaltflaechen `Planung` und `Einstellungen` muessen oben rechts in der festen Titelzeile sichtbar sein.
- Der LDN-Katalog muss weiterhin Eintraege wie `LDN 1093` finden.

## Lokale Nutzerdaten

Die Produktivdatenbank bleibt `astro-night-planner-prod-v1`. Bestehende Standorte, Horizontprofile, Ausruestung und eigene Ziele bleiben bei einem normalen Update erhalten.
