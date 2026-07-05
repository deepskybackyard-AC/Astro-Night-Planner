/* Explizite Build-Konfiguration: Produktiv-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'prod',
  repositoryRole: 'prod',
  appVersion: '1.4.0',
  release: '1.4.0',
  databaseName: 'astro-night-planner-prod-v1',
  badgeText: '',
  documentTitle: 'Astro Night Planner 1.4.0',
  releaseNotes: {
    de: [
      'Lokale HiPS-Surveys können über den ANP Local Survey Server 1.0 bereitgestellt, geprüft und bevorzugt verwendet werden.',
      'Aladin-Rahmung unterstützt temporäre Kombinationen aus Teleskop, Reducer/Korrektor/Barlow und Kamera sowie das Speichern neuer Setups.',
      'Planungsnacht und Tagesbuttons zeigen Mondinformationen klarer; die Mondhöhe in den Tagesbuttons bezieht sich auf den gewählten Planungszeitraum.',
      'Hilfe und Handbuch beschreiben lokale Surveys, Fallback, Ordnerstruktur, Tray-Bedienung, Autostart und Fehlerbehebung ausführlich.'
    ],
    en: [
      'Local HiPS surveys can be served, checked and preferred through ANP Local Survey Server 1.0.',
      'Aladin framing supports temporary telescope, reducer/corrector/Barlow and camera combinations and saving new setups.',
      'Planning night and date buttons show Moon information more clearly; Moon altitude in date buttons refers to the selected planning window.',
      'Help and manual describe local surveys, fallback, folder structure, tray usage, autostart and troubleshooting in detail.'
    ]
  },
  versionHistory: {
    de: {
      version140: { title: 'Version 1.4.0 gegenüber 1.3.0', items: [
        'Lokale HiPS-Surveys über einen lokalen HTTP-Server und das Windows-Hilfsprogramm ANP Local Survey Server 1.0.',
        'Konfiguration lokaler Survey-Basis-URL und relativer Pfade pro Survey, inklusive Prüfung und Diagnose der tatsächlich geladenen Quelle.',
        'Online-Fallback nur, wenn er aktiviert ist und die lokale Quelle nicht erreichbar ist.',
        'Lokale HiPS-properties werden ausgewertet; PNG- und JPEG-Kachelformate werden passend behandelt.',
        'Aladin-Rahmung mit frei kombinierbarem Teleskop, Reducer/Korrektor/Barlow und Kamera.',
        'Nicht gespeicherte Equipment-Kombinationen bleiben temporär aktiv und können als Setup gespeichert werden.',
        'Erweiterte Mondinformationen: Tagesbuttons zeigen die maximale Mondhöhe im gewählten Planungszeitraum; Planungsdaten markieren Mondaufgang, Mondkulmination und Monduntergang außerhalb des Planungszeitraums.',
        'Verbesserte kompakte Tagesbuttons und höher ausgerichtete Standort-/Datumsfelder.',
        'Ausführlich überarbeitete Hilfe und Handbuch zu lokalen Surveys, Local Survey Server, Tray, Autostart, Fallback und Fehlerbehebung.',
        'Ergänzte deutsch/englische Übersetzungen für neue Hinweise, Labels, Auswahllisten und Hilfetexte.'
      ]},
      version131: { title: 'Version 1.3.1 gegenüber 1.3.0', items: [
        'Korrigierte Polarlicht-Bewertung mit strengerer Trennung von Kp-Daten, NOAA-Warnmeldungen und lokalen Warnfarben.',
        'GFZ-Kp-Prognose als zusätzliche seriöse Kontroll- und Bewertungsquelle.',
        'Polarlicht-Dashboard mit Aktualisieren-Button, NOAA-/GFZ-Kontrollgrafiken, Vergrößerungsansicht und Quellenlinks.',
        'Neuerungsübersicht in der Hilfe funktioniert wieder und zeigt aktuelle Neuerungen vor älteren Versionen.'
      ]},
      version130: { title: 'Version 1.3.0 gegenüber 1.2.0', items: [
        'Datumsbuttons mit Mondbeleuchtung und farbiger durchschnittlicher Nachtqualität.',
        'Objektliste mit persönlicher Horizontlinie im Mini-Höhenprofil und getrennten Sichtbarkeitsangaben.',
        'Mehrnächte-Wetterverlauf in einem eigenen Tab.',
        'Polarlicht-Hinweis mit Dashboard und konfigurierbarem Aktualisierungsintervall.',
        'Externer Aladin-Tab mit Boden-/Horizontanzeige und azimutalem App-Gradnetz.'
      ]},
      version120: { title: 'Version 1.2.0 gegenüber 1.1.0', items: [
        'Meteoblue, Clear Outside, Windy und Ventusky bleiben als einzelne externe Kontrollquellen verfügbar.',
        'Der Wettervergleich wurde zugunsten stabiler Einzelquellen entfernt.',
        'Hilfe, Handbuch und Versionshinweise wurden an die stabilere Darstellung der Wetterquellen angepasst.'
      ]}
    },
    en: {
      version140: { title: 'Version 1.4.0 compared with 1.3.0', items: [
        'Local HiPS surveys via a local HTTP server and the ANP Local Survey Server 1.0 Windows helper.',
        'Configuration of local survey base URL and relative paths per survey, including checks and diagnostics for the source actually loaded.',
        'Online fallback is used only when enabled and the local source is not reachable.',
        'Local HiPS properties are evaluated; PNG and JPEG tile formats are handled accordingly.',
        'Aladin framing with freely combinable telescope, reducer/corrector/Barlow and camera.',
        'Unsaved equipment combinations remain temporarily active and can be saved as a setup.',
        'Extended Moon information: date buttons show maximum Moon altitude in the selected planning window; planning data marks moonrise, Moon culmination and moonset outside the planning window.',
        'Improved compact date buttons and higher-positioned location/date fields.',
        'Extensively revised help and manual for local surveys, Local Survey Server, tray, autostart, fallback and troubleshooting.',
        'Added German/English translations for new notices, labels, selection lists and help texts.'
      ]},
      version131: { title: 'Version 1.3.1 compared with 1.3.0', items: [
        'Corrected aurora assessment with a stricter separation of Kp data, NOAA alerts and local warning colors.',
        'GFZ Kp forecast added as an additional authoritative reference and assessment source.',
        'Aurora dashboard with refresh button, NOAA/GFZ reference graphics, enlarged view and source links.',
        'The Help “What’s new” entry works again and shows current changes before older versions.'
      ]},
      version130: { title: 'Version 1.3.0 compared with 1.2.0', items: [
        'Date buttons with Moon illumination and colored average night quality.',
        'Object list with personal horizon line in the mini altitude chart and separate visibility values.',
        'Multi-night weather trend in a dedicated tab.',
        'Aurora notice with dashboard and configurable refresh interval.',
        'External Aladin tab with ground/horizon view and azimuthal app grid.'
      ]},
      version120: { title: 'Version 1.2.0 compared with 1.1.0', items: [
        'Meteoblue, Clear Outside, Windy and Ventusky remain available as individual external reference sources.',
        'The weather comparison was removed in favor of stable single-source tabs.',
        'Help, manual and version notes were adjusted to the more stable weather-source handling.'
      ]}
    }
  }
});
