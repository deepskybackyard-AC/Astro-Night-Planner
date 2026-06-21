/* Explizite Build-Konfiguration: PRODUKTIV-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'prod',
  repositoryRole: 'production',
  appVersion: '1.0.1',
  release: '1.0.1',
  databaseName: 'astro-night-planner-prod-v1',
  badgeText: '',
  documentTitle: 'Astro Night Planner 1.0.1',
  releaseNotes: {
    de: [
      'Hauptnavigation Planung/Einstellungen in die feste Titelzeile oben rechts verschoben; die bisherige untere Navigation wurde entfernt.',
      'LDN-Katalog mit 1787 benannten Lynds-Dunkelnebeln ergänzt; LDN 1093 und Schreibweisen wie LDN1093 sind suchbar.',
      'Der Katalogfilter LDN/LBN nutzt jetzt die importierten LDN-Daten; LBN ist weiterhin noch kein eigener importierter Katalog.',
      'Hilfe, Handbuch, Katalogquellen und Versionshinweise aktualisiert.'
    ],
    en: [
      'Moved the main Planning/Settings navigation into the fixed top-right header; the former bottom navigation has been removed.',
      'Added an LDN catalog with 1,787 named Lynds dark nebulae; LDN 1093 and compact spellings such as LDN1093 are searchable.',
      'The LDN/LBN catalog filter now uses the imported LDN data; LBN is still not imported as a separate catalog.',
      'Updated help, manual, catalog sources and version notes.'
    ]
  }
});
