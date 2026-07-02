/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.3.1-test.2',
  release: '1.3.1-test.2',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.3.1-test.2',
  releaseNotes: {
    de: [
      'Polarlicht-Bewertung korrigiert: NOAA-Alert-Meldungen setzen nicht mehr allein eine lokale Warnfarbe; maßgeblich sind auswertbare Kp-Daten.',
      'NOAA-Kp-Prognose, beobachteter NOAA-Kp und GFZ-Kp-Prognose werden getrennt ausgewertet und im Dashboard nachvollziehbar angezeigt.',
      'Das Polarlicht-Dashboard enthält einen Button „Polarlichtdaten aktualisieren“ sowie NOAA- und GFZ-Kontrollgrafiken mit Vergrößern- und Quellenfunktionen.',
      'Der GFZ-Kontrolllink führt jetzt zur Vorhersageseite. Hilfe und Handbuch erklären Datenquellen, Warnstufen und Grenzen der lokalen Polarlichtbewertung.',
      'Der Hilfe-Button „Neuerungen“ öffnet wieder eine versionsweise Übersicht: aktuelle Version zuerst, danach ältere Versionsschritte.'
    ],
    en: [
      'Aurora assessment corrected: NOAA alert messages no longer set a local warning color by themselves; machine-readable Kp data is decisive.',
      'NOAA Kp forecast, observed NOAA Kp and GFZ Kp forecast are evaluated separately and shown transparently in the dashboard.',
      'The aurora dashboard now includes a Refresh aurora data button plus NOAA and GFZ reference graphics with enlarge and source actions.',
      'The GFZ reference link now opens the forecast page. Help and manual explain data sources, warning levels and limits of local aurora assessment.',
      'The Help button “What’s new” now opens a versioned overview: current version first, followed by older version steps.'
    ]
  },
  versionHistory: {
    de: {
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
        'Flugwetter/METAR/TAF und MOSMIX wurden nicht mehr als eigene Bereiche geführt.',
        'Meteoblue, Clear Outside, Windy und Ventusky bleiben als einzelne externe Kontrollquellen verfügbar.',
        'Der Wettervergleich wurde zugunsten stabiler Einzelquellen entfernt.',
        'Hilfe, Handbuch und Versionshinweise wurden an die stabilere Darstellung der Wetterquellen angepasst.'
      ]},
      version110: { title: 'Version 1.1.0 gegenüber 1.0.0', items: [
        'PWA mit lokalen Benutzerprofilen und Sicherungs-/Wiederherstellungsfunktionen.',
        'Erweiterte Ausrüstung, Standorte und Horizontprofile.',
        'Verbesserte Aladin-Rahmung mit Mondanzeige, Objektlabels und N.I.N.A.-Export.',
        'Erweiterte Objektfilter, Direktsuche, Aufnahmeziele und konfigurierbare Objektlisteninformationen.',
        'Ausgebauter Wetterbereich mit Astro-Wolkenmodell, stündlichem Verlauf und Modellkonsens.'
      ]}
    },
    en: {
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
        'METAR/TAF aviation weather and MOSMIX are no longer maintained as separate app sections.',
        'Meteoblue, Clear Outside, Windy and Ventusky remain available as individual external reference sources.',
        'The weather comparison was removed in favor of stable single-source tabs.',
        'Help, manual and version notes were adjusted to the more stable weather-source handling.'
      ]},
      version110: { title: 'Version 1.1.0 compared with 1.0.0', items: [
        'PWA with local user profiles and backup/restore functions.',
        'Extended equipment, locations and horizon profiles.',
        'Improved Aladin framing with Moon display, object labels and N.I.N.A. export.',
        'Extended object filters, direct search, imaging targets and configurable object-list information.',
        'Extended weather section with astro cloud model, hourly trend and model consensus.'
      ]}
    }
  }
});
