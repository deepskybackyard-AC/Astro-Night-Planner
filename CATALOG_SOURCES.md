# Katalogquellen

Der Astro Night Planner nutzt den bereits im Projekt vorhandenen generierten Objektkatalog. Er enthält insbesondere:

- Messier-Daten
- NGC- und IC-Grunddaten aus OpenNGC
- Sharpless-2-Einträge aus den im bisherigen Projekt dokumentierten VizieR-/Sharpless-Quellen
- Abell-Katalog planetarischer Nebel
- ergänzte gebräuchliche Deep-Sky-Ziele

Fehlende Werte werden in der App nicht künstlich ergänzt. Die Datei `src/data/catalog.generated.json` des bisherigen Repositorys soll beim Update erhalten bleiben. Der GitHub-Pages-Workflow kopiert sie beim Deployment automatisch nach `assets/catalog.generated.json`, damit der vollständige Katalog lokal von der PWA geladen werden kann.

Falls diese Quelldatei nicht vorhanden ist, versucht Version 1.0 den Katalog aus dem öffentlichen Haupt-Repository zu laden und verwendet bei Nichterreichbarkeit einen kleinen integrierten Basiskatalog.

## Kuratierte Objektumrisse

Ab Version 1.0 kann die Aladin-Ansicht kuratierte Objektumrisse aus lokalen Koordinatenpolygondaten verwenden. Diese Umrisse sind Planungs- und Orientierungshilfen und keine wissenschaftlichen Grenzdefinitionen. Sie werden manuell aus öffentlich sichtbaren Himmelsbilddarstellungen in der App/Aladin-Ansicht kuratiert; eine ungeprüfte Übernahme fremder Stellarium-/Katalogdaten erfolgt nicht.

Aktuell enthaltene Startobjekte:

- NGC 7000 - Nordamerikanebel, ungefährer Planungsumriss
- M42 - Orionnebel, ungefährer Planungsumriss

Weitere Umrisse werden nur ergänzt, wenn Herkunft, fachliche Plausibilität und Nutzungs-/Lizenzhinweise eindeutig dokumentiert werden können.

## Aladin-Surveys

Aladin-Lite-Surveys werden als externe HiPS-Datensätze über die jeweilige HiPS-ID genutzt. Die Survey-Auswahl der App kann in den Einstellungen konfiguriert und um eigene HiPS-IDs ergänzt werden. Für die rechtliche Bewertung gelten die Nutzungs- und Lizenzbedingungen der jeweiligen Survey-Anbieter sowie die Hinweise von CDS/Aladin Lite.

Ab Version 1.0 erzwingt die App keine künstliche Farbskala für Aladin-Surveys. Monochrome Surveys wie DSS2 red oder DSS2 blue werden in der nativen Aladin-Darstellung geladen; farbige Surveys erscheinen nur dann farbig, wenn der Anbieter selbst einen Farbsurvey oder eine Farbkombination bereitstellt. Bei eigenen HiPS-IDs ist der Anwender dafür verantwortlich, die jeweilige Datenquelle und deren Nutzungshinweise zu prüfen.

## Test 18 Ergänzung: Northern Sky Narrowband Survey (NSNS)

Für die Aladin-Survey-Auswahl werden zusätzlich HiPS-Einträge der Northern Sky Narrowband Survey (NSNS DR0.2) vorbereitet. Die ersten vier Einträge sind in der Standardauswahl aktiv:

- NSNS DR0.2 · H-alpha — `simg.de/P/NSNS/DR0_2/halpha8`
- NSNS DR0.2 · OIII — `simg.de/P/NSNS/DR0_2/oiii8`
- NSNS DR0.2 · SII — `simg.de/P/NSNS/DR0_2/sii8`
- NSNS DR0.2 · OIII/H-alpha/SII — `simg.de/P/NSNS/DR0_2/ohs8`
- NSNS DR0.2 · H-alpha + Kontinuum — `simg.de/P/NSNS/DR0_2/hbr8`
- NSNS DR0.2 · RGB-Kontinuum — `simg.de/P/NSNS/DR0_2/rgb8`

Lizenz- und Quellenhinweise sind in der Hilfe und im Handbuch zu dokumentieren. Benutzerdefinierte HiPS-Surveys werden vom Nutzer selbst eingetragen; für deren Nutzbarkeit und Lizenzlage ist die jeweilige Quelle maßgeblich.

## Test 18 Ergänzung: Nutzergezeichnete Objektumrisse

Mitgelieferte Beispielumrisse für NGC 7000 wurden entfernt. Objektumrisse entstehen künftig durch nutzerseitige Zeichnung im externen Aladin-Tab und werden lokal in IndexedDB gespeichert. Bei vorhandenen Einträgen werden sie automatisch angezeigt; sonst wird die Katalogellipse als Fallback genutzt.
