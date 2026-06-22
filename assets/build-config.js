/* Explizite Build-Konfiguration: PRODUKTIV-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'prod',
  repositoryRole: 'production',
  appVersion: '1.0.3',
  release: '1.0.3',
  databaseName: 'astro-night-planner-prod-v1',
  badgeText: '',
  documentTitle: 'Astro Night Planner 1.0.3',
  releaseNotes: {
    de: [
      'Der Erststart ohne vorhandenen Standort öffnet jetzt zuverlässig die Einstellungen für Standortanlage und Ausrüstung.',
      'Die Navigation „Planung“ und „Einstellungen“ befindet sich oben rechts in der festen Titelzeile.',
      'Der LDN-Katalog bleibt enthalten; LDN 1093 und LDN1093 sind suchbar.'
    ],
    en: [
      'The first start without an existing location now reliably opens the settings for location setup and equipment.',
      'The Planning and Settings navigation is located in the fixed top-right header.',
      'The LDN catalog remains included; LDN 1093 and LDN1093 are searchable.'
    ]
  }
});
