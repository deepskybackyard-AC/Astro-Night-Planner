/* Explizite Build-Konfiguration: Produktiv-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'prod',
  repositoryRole: 'prod',
  appVersion: '1.4.1',
  release: '1.4.1',
  databaseName: 'astro-night-planner-prod-v1',
  badgeText: '',
  documentTitle: 'Astro Night Planner 1.4.1',
  releaseNotes: {
    de: [
      'Die Windows-Lösung des ANP Local Survey Server bleibt erhalten und wird weiterhin für Windows empfohlen.',
      'Zusätzlich steht ein natives Linux/macOS-Serverpaket mit Browser-Konfigurationsoberfläche, Survey-Dateiserver und systemd-/LaunchAgent-Beispielen bereit.',
      'Die lokalen Survey-Einstellungen zeigen getrennte Downloads, Hinweise und HTML-Anleitungen für Windows, Linux/macOS und den Python-Fallback.',
    ],
    en: [
      'The Windows edition of ANP Local Survey Server remains available and is still recommended for Windows.',
      'A native Linux/macOS server package with browser configuration interface, survey file server and systemd/LaunchAgent examples is now included.',
      'The local survey settings show separate downloads, guidance and HTML documentation for Windows, Linux/macOS and the Python fallback.',
    ]
  },
  versionHistory: {
    de: {
      version141: { title: 'Version 1.4.1 gegenüber 1.4.0', items: [
        'Zusätzliches natives Linux/macOS-Paket für lokale HiPS-Surveys ohne Wine und ohne Python-Abhängigkeit.',
        'Browserbasierte Konfigurationsoberfläche des Linux/macOS-Servers mit Status, Pfadprüfung, Start/Stop und Programm beenden.',
        'systemd-user-Beispiel für Linux und LaunchAgent-Beispiel für macOS.',
        'Getrennte Download-Links und Hinweise in den lokalen Survey-Einstellungen: Windows, Linux/macOS und Python-Fallback.',
        'Hilfe und Handbuch verlinken ausführliche HTML-Anleitungen für Windows, Linux/macOS, Linux-Autostart, macOS-Autostart und Python-Fallback.'
      ]},
      version140: { title: 'Version 1.4.0 gegenüber 1.3.0', items: [
        'Lokale HiPS-Surveys über einen lokalen HTTP-Server und das Windows-Hilfsprogramm ANP Local Survey Server 1.0.',
        'Konfiguration lokaler Survey-Basis-URL und relativer Pfade pro Survey, inklusive Prüfung und Diagnose der tatsächlich geladenen Quelle.',
        'Online-Fallback nur, wenn er aktiviert ist und die lokale Quelle nicht erreichbar ist.',
        'Lokale HiPS-properties werden ausgewertet; PNG- und JPEG-Kachelformate werden passend behandelt.',
        'Aladin-Rahmung mit frei kombinierbarem Teleskop, Reducer/Korrektor/Barlow und Kamera.',
        'Nicht gespeicherte Equipment-Kombinationen bleiben temporär aktiv und können als Setup gespeichert werden.',
        'Erweiterte Mondinformationen: Tagesbuttons zeigen die maximale Mondhöhe im gewählten Planungszeitraum; Planungsdaten markieren Mondaufgang, Mondkulmination und Monduntergang außerhalb des Planungszeitraums.'
      ]}
    },
    en: {
      version141: { title: 'Version 1.4.1 compared with 1.4.0', items: [
        'Additional native Linux/macOS package for local HiPS surveys without Wine and without a Python dependency.',
        'Browser-based configuration interface of the Linux/macOS server with status, path checks, start/stop and shutdown.',
        'systemd user-service example for Linux and LaunchAgent example for macOS.',
        'Separate download links and guidance in local survey settings: Windows, Linux/macOS and Python fallback.',
        'Help and manual link detailed HTML guides for Windows, Linux/macOS, Linux autostart, macOS autostart and Python fallback.'
      ]},
      version140: { title: 'Version 1.4.0 compared with 1.3.0', items: [
        'Local HiPS surveys via a local HTTP server and the ANP Local Survey Server 1.0 Windows helper.',
        'Configuration of local survey base URL and relative paths per survey, including checks and diagnostics for the source actually loaded.',
        'Online fallback is used only when enabled and the local source is not reachable.',
        'Local HiPS properties are evaluated; PNG and JPEG tile formats are handled accordingly.',
        'Aladin framing with freely combinable telescope, reducer/corrector/Barlow and camera.',
        'Unsaved equipment combinations remain temporarily active and can be saved as a setup.',
        'Extended Moon information: date buttons show maximum Moon altitude in the selected planning window; planning data marks moonrise, Moon culmination and moonset outside the planning window.'
      ]}
    }
  }
});
