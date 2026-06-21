# Korrekturen Produktivversion 1.0.2

Diese Version korrigiert das Produktivpaket 1.0.1.

## Behoben

- Die Schaltflaechen `Planung` und `Einstellungen` wurden in `index.html` in die feste Kopfzeile uebernommen.
- Die versehentlich im Produktivpaket verbliebene untere/floating Navigation wurde entfernt.
- Der Service-Worker-Cache wurde auf `1.0.2` erhoeht, damit Browser die korrigierte Startseite laden.

## Weiterhin enthalten

- LDN-Katalog mit 1787 benannten Lynds-Dunkelnebeln.
- Suche nach `LDN 1093` und `LDN1093`.
- `LDN/LBN` filtert derzeit die importierten LDN-Daten; LBN ist weiterhin noch nicht separat importiert.

## Keine Datenmigration

Die lokale Produktivdatenbank bleibt unveraendert: `astro-night-planner-prod-v1`.
