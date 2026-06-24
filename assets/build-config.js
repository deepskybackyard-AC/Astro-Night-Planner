/* Explizite Build-Konfiguration: PRODUKTIV */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'prod',
  repositoryRole: 'prod',
  appVersion: '1.1.0',
  release: '1.1.0',
  databaseName: 'astro-night-planner-prod-v1',
  badgeText: '',
  documentTitle: 'Astro Night Planner 1.1.0',
  releaseNotes: {
    de: [
      'Die zusätzlichen Wetterquellen sind als Tabs für Meteoblue, Flugwetter und MOSMIX organisiert.',
      'Flugwetterstationen für Deutschland können in den Einstellungen gewählt werden; METAR/TAF-Bereiche enthalten Rohdaten und Quellenlinks.',
      'MOSMIX bzw. die Standortprognose ergänzt stündliche Wetterhinweise, soweit Daten verfügbar sind.',
      'N.I.N.A.-Horizontimport und -export sowie der Export der aktuellen Aladin-Rahmung für ein einzelnes Objekt wurden ergänzt.',
      'Der Aladin-Kamerarahmen kann im Verschiebemodus per Dragging verschoben werden; Infofelder können positioniert und ausgeblendet werden.',
      'Ausrüstung und Setups unterstützen Brennweite/f-Zahl, Sensor-/Auflösungsdaten sowie Reducer-, Flattener- und Barlow-Faktoren.',
      'Die Kalenderplanung für spätere Nächte und das Ausblenden von Planungsrubriken wurden ergänzt.',
      'Hilfe und Handbuch wurden um Browserdaten-FAQ, Sicherung, N.I.N.A.-Funktionen und neue Wetterbereiche erweitert.'
    ],
    en: [
      'Additional weather sources are organized as tabs for Meteoblue, aviation weather and MOSMIX.',
      'German aviation weather stations can be selected in the settings; METAR/TAF areas include raw data and source links.',
      'MOSMIX/location forecast adds hourly weather guidance where data is available.',
      'N.I.N.A. horizon import/export and export of the current Aladin framing for a single object have been added.',
      'The Aladin camera frame can be dragged in move mode; info boxes can be positioned and hidden.',
      'Equipment and setups support focal length/f-number, sensor/resolution data and reducer, flattener and Barlow factors.',
      'Calendar planning for later nights and hiding complete planning sections have been added.',
      'Help and manual now cover browser data, backups, N.I.N.A. functions and the new weather areas.'
    ]
  }
});
