/* Explizite Build-Konfiguration: Produktiv-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'prod',
  repositoryRole: 'prod',
  appVersion: '1.4.2',
  release: '1.4.2',
  databaseName: 'astro-night-planner-prod-v1',
  badgeText: '',
  documentTitle: 'Astro Night Planner 1.4.2',
  releaseNotes: {
    de: ['🟨 WICHTIG: ANP-Local-Survey-Server.exe vollständig beenden und durch die Datei aus dem Paket ANP Local Survey Server 1.1 ersetzen. Der Dateiname bleibt unverändert.'],
    en: ['🟨 IMPORTANT: Fully exit ANP-Local-Survey-Server.exe and replace it with the file from the ANP Local Survey Server 1.1 package. The executable name remains unchanged.']
  },
  criticalUpdate: {
    de: 'ANP-Local-Survey-Server.exe vollständig beenden und durch die EXE aus ANP Local Survey Server 1.1 ersetzen.',
    en: 'Fully exit ANP-Local-Survey-Server.exe and replace it with the executable from ANP Local Survey Server 1.1.'
  },
  detailsUrl: {de:'docs/NEUERUNGEN_DE.html', en:'docs/NEUERUNGEN_EN.html'},
  versionHistory: {
    de: {
      version142: { title: "1.4.2 gegenüber 1.4.1", items: [
          "ANP Local Survey Server 1.1 mit Downloadverwaltung für alle in der App eingebauten Surveys und für benutzerdefinierte kompatible HiPS-Quellen.",
          "Vorbelegte Quelladressen und relative Zielpfade für DSS2, PanSTARRS, VTSS, Finkbeiner, WISE, 2MASS, IRIS und alle sechs NSNS-Surveys.",
          "Downloads starten, pausieren, fortsetzen, abbrechen und vorhandene Daten prüfen; vollständige Dateien werden übersprungen und unvollständige .part-Dateien fortgesetzt.",
          "Native Ordnerauswahl unter Windows sowie Ordnerdialoge unter Linux und macOS.",
          "Automatische Übernahme der bisherigen Windows-Konfiguration aus dem Local Survey Server 1.0.",
          "Speichern-Bestätigung direkt am Button statt eines Erfolgs-Popups.",
          "Verständlicher Dialog zur Auswahl relativer Survey-Pfade aus den vom Server erkannten HiPS-Ordnern.",
          "Der Sammelschalter setzt alle lokalen Survey-Präferenzen gemeinsam; einzelne Surveys können anschließend abweichend eingestellt werden.",
          "Zuverlässige Tray-Steuerung für Öffnen, Starten, Stoppen und Beenden sowie erweiterte Hilfe in Deutsch und Englisch."
        ]},
      version141: { title: "1.4.1 gegenüber 1.4.0", items: [
          "Zusätzliches natives Linux/macOS-Paket für lokale HiPS-Surveys ohne Wine und ohne Python-Abhängigkeit.",
          "Browserbasierte Konfigurationsoberfläche des Linux/macOS-Servers mit Status, Pfadprüfung, Start/Stop und Programm beenden.",
          "systemd-user-Beispiel für Linux und LaunchAgent-Beispiel für macOS.",
          "Getrennte Downloadlinks und Hinweise in den lokalen Survey-Einstellungen für Windows, Linux/macOS und den Python-Fallback.",
          "Ausführliche HTML-Anleitungen für Windows, Linux/macOS, Autostart und Python-Fallback."
        ]},
      version140: { title: "1.4.0 gegenüber 1.3.0", items: [
          "Lokale HiPS-Surveys über einen lokalen HTTP-Server und das Windows-Hilfsprogramm ANP Local Survey Server.",
          "Konfiguration lokaler Survey-Basis-URL und relativer Pfade pro Survey, einschließlich Prüfung und Diagnose der tatsächlich geladenen Quelle.",
          "Online-Fallback nur, wenn er aktiviert ist und die lokale Quelle nicht erreichbar ist.",
          "Lokale HiPS-properties werden ausgewertet; PNG- und JPEG-Kachelformate werden passend behandelt.",
          "Aladin-Rahmung mit frei kombinierbarem Teleskop, Reducer/Korrektor/Barlow und Kamera.",
          "Nicht gespeicherte Equipment-Kombinationen bleiben temporär aktiv und können als Setup gespeichert werden.",
          "Erweiterte Mondinformationen: Tagesbuttons zeigen die maximale Mondhöhe im gewählten Planungszeitraum; Planungsdaten markieren Mondereignisse außerhalb dieses Zeitraums."
        ]},
      version130: { title: "1.3.0 gegenüber 1.2.0", items: [
          "Standortabhängiger Polarlicht-Hinweis mit Detailansicht und konfigurierbaren Warnschwellen.",
          "Mehrnächte-Wetterverlauf für die aktuelle und weitere Nächte.",
          "Planungsnacht und Tagesbuttons mit erweiterten Wetter-, Qualitäts- und Mondinformationen.",
          "Erweiterte Aladin-, Himmels- und Horizontdarstellung sowie zusätzliche zentrale Anzeigeeinstellungen.",
          "Weitere Übersetzungen und Erweiterungen von Hilfe und Handbuch."
        ]},
      version120: { title: "1.2.0 gegenüber 1.1.0", items: [
          "Der separate Wettervergleich in einem neuen Tab wurde entfernt und durch stabilere einzelne externe Kontrollquellen ersetzt.",
          "Windy, Ventusky, Meteoblue und Clear Outside bleiben unter „Zusätzliche Wetterquellen“ verfügbar.",
          "Jede externe Wetterquelle verwendet ihre eigene Bedienung und Zeitachse; eine künstliche gemeinsame Vergleichszeit entfällt.",
          "Die eigene Astro-Wolkenkarte bleibt ausschließlich in der Planungsansicht.",
          "Hilfe, Handbuch und Versionshinweise wurden an die stabilere Darstellung der Wetterquellen angepasst."
        ]},
      version110: { title: "1.1.0 gegenüber 1.0.0", items: [
          "PWA mit lokalen Benutzerprofilen, getrennter Test-/Produktivspeicherung und Sicherungs-/Wiederherstellungsfunktionen.",
          "Erweiterte Ausrüstung mit Kameras, Teleskopen/Objektiven und Reducer-, Flattener- und Barlow-Faktoren.",
          "Verbesserte Aladin-Rahmung mit verschiebbarem Kamerarahmen, Infofeldern, Mondanzeige, Objektbeschriftungen, externer Ansicht und N.I.N.A.-Export.",
          "Standorte und Horizontprofile einschließlich interaktivem Editor sowie N.I.N.A.-Import und -Export.",
          "Erweiterte Objektauswahl mit Direktsuche, konfigurierbaren Listeninformationen, persönlichen Aufnahmezielen und zusätzlichen Filtern.",
          "Erweiterter Wetterbereich mit Astro-Wolkenmodell, stündlichem Verlauf, Modellkonsens, Wolkenschichten und Niederschlagsinformationen.",
          "Verbesserte Hilfe, Browserdaten-FAQ, Update-Mechanik und Tablet-/iPad-Bedienung."
        ]}
    },
    en: {
      version142: { title: "1.4.2 compared with 1.4.1", items: [
          "ANP Local Survey Server 1.1 with download management for every survey built into the app and for compatible custom HiPS sources.",
          "Default source URLs and relative target paths for DSS2, PanSTARRS, VTSS, Finkbeiner, WISE, 2MASS, IRIS and all six NSNS surveys.",
          "Start, pause, resume and cancel downloads and validate existing data; complete files are skipped and incomplete .part files are resumed.",
          "Native Windows folder selection and folder dialogs on Linux and macOS.",
          "Automatic migration of the previous Windows configuration from Local Survey Server 1.0.",
          "Save confirmation directly on the button instead of a success popup.",
          "Clear dialog for selecting relative survey paths from HiPS folders detected by the server.",
          "The bulk switch sets all local survey preferences together while individual surveys can still be configured differently.",
          "Reliable tray controls for open, start, stop and exit, plus expanded German and English help."
        ]},
      version141: { title: "1.4.1 compared with 1.4.0", items: [
          "Additional native Linux/macOS package for local HiPS surveys without Wine or a Python dependency.",
          "Browser-based Linux/macOS server interface with status, path checks, start/stop and shutdown.",
          "systemd user-service example for Linux and LaunchAgent example for macOS.",
          "Separate downloads and guidance in local survey settings for Windows, Linux/macOS and the Python fallback.",
          "Detailed HTML guides for Windows, Linux/macOS, autostart and the Python fallback."
        ]},
      version140: { title: "1.4.0 compared with 1.3.0", items: [
          "Local HiPS surveys via a local HTTP server and the ANP Local Survey Server Windows helper.",
          "Configuration of local survey base URL and relative paths per survey, including checks and diagnostics for the source actually loaded.",
          "Online fallback only when enabled and the local source is not reachable.",
          "Local HiPS properties are evaluated; PNG and JPEG tile formats are handled accordingly.",
          "Aladin framing with freely combinable telescope, reducer/corrector/Barlow and camera.",
          "Unsaved equipment combinations remain temporarily active and can be saved as a setup.",
          "Extended Moon information: date buttons show maximum Moon altitude in the selected planning window and planning data marks Moon events outside it."
        ]},
      version130: { title: "1.3.0 compared with 1.2.0", items: [
          "Location-dependent aurora notice with a detail view and configurable warning thresholds.",
          "Multi-night weather trend for the current and additional nights.",
          "Planning-night and date-button presentation with extended weather, quality and Moon information.",
          "Extended Aladin, sky and horizon presentation plus additional central display settings.",
          "Further translations and expanded help and manual."
        ]},
      version120: { title: "1.2.0 compared with 1.1.0", items: [
          "The separate weather comparison in a new tab was removed and replaced by more stable individual external reference sources.",
          "Windy, Ventusky, Meteoblue and Clear Outside remain available under “Additional weather sources”.",
          "Each external source uses its own controls and timeline; an artificial shared comparison time is no longer shown.",
          "The built-in astro cloud map remains available only in the planning view.",
          "Help, manual and version notes were adjusted to the more stable weather-source presentation."
        ]},
      version110: { title: "1.1.0 compared with 1.0.0", items: [
          "PWA with local user profiles, separate test/production storage and backup/restore functions.",
          "Extended equipment model with cameras, telescopes/lenses and reducer, flattener and Barlow factors.",
          "Improved Aladin framing with movable camera frame, information fields, Moon display, object labels, external view and N.I.N.A. export.",
          "Locations and horizon profiles including an interactive editor and N.I.N.A. import/export.",
          "Extended object selection with direct search, configurable list information, personal imaging targets and additional filters.",
          "Extended weather section with astro cloud model, hourly trend, model consensus, cloud layers and precipitation information.",
          "Improved help, browser-data FAQ, update handling and tablet/iPad operation."
        ]}
    }
  }
});
