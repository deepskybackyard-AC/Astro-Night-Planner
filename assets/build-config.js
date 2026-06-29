/* Explizite Build-Konfiguration: Produktiv-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'prod',
  repositoryRole: 'prod',
  appVersion: '1.2.0',
  release: '1.2.0',
  databaseName: 'astro-night-planner-prod-v1',
  badgeText: '',
  documentTitle: 'Astro Night Planner 1.2.0',
  releaseNotes: {
    "de": [
        "Der separate Wettervergleich in einem neuen Tab wurde entfernt.",
        "Windy, Ventusky, Meteoblue und Clear Outside bleiben als einzelne externe Kontrollquellen unter „Zusätzliche Wetterquellen“ erhalten.",
        "Jede externe Wetterquelle verwendet ihre eigene Bedienung und eigene Zeitachse; die Anwendung zeigt keine zentrale Vergleichszeit mehr für diese externen Karten an.",
        "Die eigene Astro-Wolkenkarte bleibt ausschließlich in der Planungsansicht verfügbar und wird nicht mehr in einem separaten Vergleichsfenster nachgebaut.",
        "Nicht mehr benötigter Code für Vergleichsfenster, gemeinsame Vergleichszeit und Zeitübergabe an externe Karten wurde entfernt.",
        "Hilfe, Handbuch und Versionshinweise wurden auf die neue, stabilere Darstellung der Wetterquellen angepasst."
    ],
    "en": [
        "The separate weather comparison in a new tab has been removed.",
        "Windy, Ventusky, Meteoblue and Clear Outside remain available as individual external reference sources under “Additional weather sources”.",
        "Each external weather source uses its own controls and timeline; the app no longer displays a shared comparison time for those external maps.",
        "The own astro cloud map remains available only in the planning view and is no longer rebuilt in a separate comparison window.",
        "No longer needed code for the comparison window, shared comparison time and time handoff to external maps has been removed.",
        "Help, handbook and version notes have been adjusted to the more stable handling of weather sources."
    ]
},
  versionHistory: {
    "de": {
        "version120": {
            "title": "Version 1.2.0 gegenüber 1.1.0",
            "items": [
                "Der separate Wettervergleich in einem neuen Tab wurde entfernt.",
                "Windy, Ventusky, Meteoblue und Clear Outside bleiben als einzelne externe Kontrollquellen unter „Zusätzliche Wetterquellen“ erhalten.",
                "Jede externe Wetterquelle verwendet ihre eigene Bedienung und eigene Zeitachse; die Anwendung zeigt keine zentrale Vergleichszeit mehr für diese externen Karten an.",
                "Die eigene Astro-Wolkenkarte bleibt ausschließlich in der Planungsansicht verfügbar und wird nicht mehr in einem separaten Vergleichsfenster nachgebaut.",
                "Nicht mehr benötigter Code für Vergleichsfenster, gemeinsame Vergleichszeit und Zeitübergabe an externe Karten wurde entfernt.",
                "Hilfe, Handbuch und Versionshinweise wurden auf die neue, stabilere Darstellung der Wetterquellen angepasst."
            ]
        },
        "version110": {
            "title": "Version 1.1.0 gegenüber 1.0.0",
            "items": [
                "PWA mit lokalen Benutzerprofilen, getrennter Test-/Produktivspeicherung und Sicherungs-/Wiederherstellungsfunktionen.",
                "Erweiterte Ausrüstung: Kameras mit Sensor- und Auflösungsdaten, Teleskope und Objektive mit Brennweite und Öffnungsverhältnis sowie Reducer-, Flattener- und Barlow-Faktoren.",
                "Verbesserte Aladin-Rahmung mit verschiebbarem Kamerarahmen, Infofeldern, Mondanzeige, Objektbeschriftungen, externer Himmelsbildansicht und N.I.N.A.-Export.",
                "Standorte und Horizontprofile wurden ausgebaut, einschließlich interaktivem Horizonteditor sowie N.I.N.A.-Import und -Export.",
                "Objektauswahl erweitert: Direktsuche ohne übrige Filter, konfigurierbare Objektlisteninformationen, persönliche Aufnahmeziele und zusätzliche Filteroptionen.",
                "Wetterbereich erweitert: Astro-Wolkenmodell, stündlicher Wetterverlauf, Modellkonsens, Wolkenschichten, Niederschlag/Regen/Schnee und zusätzliche externe Wetterquellen.",
                "Hilfe, Browserdaten-FAQ, Update-Mechanik und Bedienung auf Tablet/iPad wurden verbessert."
            ]
        }
    },
    "en": {
        "version120": {
            "title": "Version 1.2.0 compared with 1.1.0",
            "items": [
                "The separate weather comparison in a new tab has been removed.",
                "Windy, Ventusky, Meteoblue and Clear Outside remain available as individual external reference sources under “Additional weather sources”.",
                "Each external weather source uses its own controls and timeline; the app no longer displays a shared comparison time for those external maps.",
                "The own astro cloud map remains available only in the planning view and is no longer rebuilt in a separate comparison window.",
                "No longer needed code for the comparison window, shared comparison time and time handoff to external maps has been removed.",
                "Help, handbook and version notes have been adjusted to the more stable handling of weather sources."
            ]
        },
        "version110": {
            "title": "Version 1.1.0 compared with 1.0.0",
            "items": [
                "PWA with local user profiles, separate test/production storage and backup/restore functions.",
                "Extended equipment model: cameras with sensor and resolution data, telescopes and lenses with focal length and focal ratio, plus reducer, flattener and Barlow factors.",
                "Improved Aladin framing with movable camera frame, information boxes, Moon display, object labels, external sky-image view and N.I.N.A. export.",
                "Locations and horizon profiles have been extended, including interactive horizon editor and N.I.N.A. import/export.",
                "Object selection extended with direct search without other filters, configurable object-list information, personal imaging targets and additional filter options.",
                "Weather section extended with astro cloud model, hourly weather trend, model consensus, cloud layers, precipitation/rain/snow and additional external weather sources.",
                "Help, browser data FAQ, update handling and tablet/iPad operation have been improved."
            ]
        }
    }
}
});
