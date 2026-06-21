/* Explizite Build-Konfiguration: PRODUKTIV-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'prod',
  repositoryRole: 'production',
  appVersion: '1.0.2',
  release: '1.0.2',
  databaseName: 'astro-night-planner-prod-v1',
  badgeText: '',
  documentTitle: 'Astro Night Planner 1.0.2',
  releaseNotes: {
    de: [
      'Produktivpaket korrigiert: Die Schaltflächen Planung und Einstellungen sind jetzt tatsächlich oben rechts in der festen Titelzeile enthalten.',
      'Die versehentlich im Produktivpaket verbliebene untere/floating Navigation wurde entfernt.',
      'Der LDN-Katalog aus 1.0.1 bleibt enthalten: 1787 benannte Lynds-Dunkelnebel inklusive Suche nach LDN 1093/LDN1093.',
      'Der Katalogfilter LDN/LBN nutzt weiterhin die importierten LDN-Daten; LBN ist weiterhin noch kein eigener importierter Katalog.'
    ],
    en: [
      'Production package corrected: the Planning and Settings buttons are now actually included in the fixed top-right header.',
      'The bottom/floating navigation that accidentally remained in the production package has been removed.',
      'The LDN catalog from 1.0.1 remains included: 1,787 named Lynds dark nebulae including search for LDN 1093/LDN1093.',
      'The LDN/LBN catalog filter still uses the imported LDN data; LBN is still not imported as a separate catalog.'
    ]
  }
});
