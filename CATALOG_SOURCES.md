# Katalogquellen

Der Astro Night Planner nutzt einen mitgelieferten, lokal geladenen Objektkatalog. Die vollständige Datei wird in der Produktivversion unter `assets/catalog.generated.json` ausgeliefert. Zusätzlich liegt dieselbe Datei unter `src/data/catalog.generated.json`, damit der öffentliche Rohdatenpfad des Repositorys erhalten bleibt.

Der Katalog enthält insbesondere:

- Messier-Daten
- NGC- und IC-Grunddaten aus OpenNGC
- Sharpless-2-Einträge aus den im Projekt dokumentierten VizieR-/Sharpless-Quellen
- Abell-Katalog planetarischer Nebel
- ergänzte gebräuchliche Deep-Sky-Ziele
- LDN-Dunkelnebel aus Lynds' Catalogue of Dark Nebulae

Fehlende Werte werden in der App nicht künstlich ergänzt. Wenn einzelne Kataloge unterschiedliche Objektgrenzen, Größen oder Bezeichnungen verwenden, nutzt die App die gespeicherten Werte als praktische Planungs- und Filterhilfe, nicht als wissenschaftliche Grenzdefinition.

## LDN - Lynds' Catalogue of Dark Nebulae

Mit Produktivversion 1.0.1 wurden 1787 benannte LDN-Einträge importiert. Ab Version 1.1.0 werden LDN und LBN als getrennte Katalogfilter dargestellt. LBN- und vollständige Barnard-Datensätze werden erst nach separater Prüfung einer maschinenlesbaren Rohquelle vollständig importiert.

Die LDN-Daten enthalten unter anderem Positionen und Flächenangaben. Für die App werden Größenwerte der LDN-Objekte aus der katalogisierten Fläche als äquivalenter Kreis-Durchmesser berechnet. Diese Werte sind eine praktische Hilfe für Größenfilter, Rahmung und Suche, aber keine exakten sichtbaren Objektumrisse.

Beispiel: `LDN 1093` ist als eigener Dunkelnebel-Eintrag vorhanden und kann über `LDN 1093` oder `LDN1093` gefunden werden.

## Kuratierte und nutzergezeichnete Objektumrisse

Die Aladin-Ansicht kann gespeicherte Objektumrisse aus lokalen Koordinatenpolygondaten verwenden. Diese Umrisse sind Planungs- und Orientierungshilfen und keine wissenschaftlichen Grenzdefinitionen.

Mitgelieferte Beispielumrisse für NGC 7000 wurden entfernt. Objektumrisse entstehen künftig durch nutzerseitige Zeichnung im externen Aladin-Tab und werden lokal in IndexedDB gespeichert. Bei vorhandenen Einträgen werden sie automatisch angezeigt; sonst wird die Katalogellipse als Fallback genutzt.

## Aladin-Surveys

Aladin-Lite-Surveys werden als externe HiPS-Datensätze über die jeweilige HiPS-ID genutzt. Die Survey-Auswahl der App kann in den Einstellungen konfiguriert und um eigene HiPS-IDs ergänzt werden. Für die rechtliche Bewertung gelten die Nutzungs- und Lizenzbedingungen der jeweiligen Survey-Anbieter sowie die Hinweise von CDS/Aladin Lite.

Die App erzwingt keine künstliche Farbskala für Aladin-Surveys. Monochrome Surveys wie DSS2 red oder DSS2 blue werden in der nativen Aladin-Darstellung geladen; farbige Surveys erscheinen nur dann farbig, wenn der Anbieter selbst einen Farbsurvey oder eine Farbkombination bereitstellt. Bei eigenen HiPS-IDs ist der Anwender dafür verantwortlich, die jeweilige Datenquelle und deren Nutzungshinweise zu prüfen.

## Northern Sky Narrowband Survey (NSNS)

Für die Aladin-Survey-Auswahl sind zusätzlich HiPS-Einträge der Northern Sky Narrowband Survey (NSNS DR0.2) vorbereitet. Die ersten vier Einträge sind in der Standardauswahl aktiv:

- NSNS DR0.2 · H-alpha — `simg.de/P/NSNS/DR0_2/halpha8`
- NSNS DR0.2 · OIII — `simg.de/P/NSNS/DR0_2/oiii8`
- NSNS DR0.2 · SII — `simg.de/P/NSNS/DR0_2/sii8`
- NSNS DR0.2 · OIII/H-alpha/SII — `simg.de/P/NSNS/DR0_2/ohs8`
- NSNS DR0.2 · H-alpha + Kontinuum — `simg.de/P/NSNS/DR0_2/hbr8`
- NSNS DR0.2 · RGB-Kontinuum — `simg.de/P/NSNS/DR0_2/rgb8`

Benutzerdefinierte HiPS-Surveys werden vom Nutzer selbst eingetragen; für deren Nutzbarkeit und Lizenzlage ist die jeweilige Quelle maßgeblich.


## Ergänzungen in Version 1.1.0

- LDN bleibt als Lynds Dark Nebulae eingebunden.
- LBN wird in der Oberfläche als separater Katalogfilter vorbereitet. Der vollständige Import der LBN-Objektdaten muss nach Prüfung der maschinenlesbaren Rohquelle erfolgen.
- Barnard wird als eigener Katalogfilter vorbereitet; bekannte vorhandene Barnard-Aliase wie B 33/B33 werden in der Suche berücksichtigt. Der vollständige Barnard-Datenbestand wird in einem separaten Katalogimport ergänzt, sobald eine belastbare maschinenlesbare Quelle im Build vorliegt.


## Version 1.1.0

Diese Version ergänzt die Wetter-Tabs Meteoblue, Flugwetter und MOSMIX. Flugwetterstationen können in den Einstellungen gewählt werden. METAR/TAF nutzt die AviationWeather-API, MOSMIX/Punktprognose Bright Sky/DWD-Daten. Bei Browser-CORS-Sperren zeigt die App Quellenlinks und Hinweise.
