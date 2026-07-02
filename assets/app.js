/* Astro Night Planner 1.3.1 – Produktivversion */
'use strict';

const BUILD = Object.freeze(window.ANP_BUILD || {environment:'prod', appVersion:'1.3.1', release:'1.3.1', databaseName:'astro-night-planner-prod-v1', documentTitle:'Astro Night Planner 1.3.1'});
const ENV = BUILD.environment === 'test' ? 'test' : 'prod';
const APP_VERSION = BUILD.appVersion || '1.0.0';
const RELEASE = BUILD.release || '1.0';
const DB_NAME = BUILD.databaseName || `astro-night-planner-${ENV}-v1`;
const DEFAULT_RELEASE_NOTES = {
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
}
const RELEASE_NOTES = BUILD.releaseNotes || DEFAULT_RELEASE_NOTES;
const DEFAULT_VERSION_HISTORY = {
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
};
const VERSION_HISTORY = BUILD.versionHistory || DEFAULT_VERSION_HISTORY;
const DB_VERSION = 7;
const LOCAL_CATALOG_URL = 'assets/catalog.generated.json';
const REMOTE_CATALOG_URL = 'https://raw.githubusercontent.com/deepskybackyard-AC/Astro-Night-Planner/refs/heads/main/src/data/catalog.generated.json';
const FLIGHT_WEATHER_PROXY_BASE = 'https://astro-night-weather-proxy.deepskybackyard.workers.dev';
const app = document.getElementById('app');
const importInput = document.getElementById('fileImport');
const LANGUAGE_STORAGE_KEY = 'astroNightPlanner.language.v1';
const detectInitialLanguage = () => {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'de' || saved === 'en') return saved;
  } catch (error) {}
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language || 'en'];
  return browserLanguages.some(lang => String(lang).toLowerCase().startsWith('de')) ? 'de' : 'en';
};
let language = detectInitialLanguage();
const docLink = (kind='html') => `./docs/ASTRO_NIGHT_PLANNER_HANDBUCH_${language === 'en' ? 'EN' : 'DE'}.${kind}`;
const UI_TEXT = {
  de: {
    updateAvailable:'Eine neue App-Version ist verfügbar. Möchtest du sie installieren?', updateNow:'Jetzt aktualisieren', headerEyebrow:'✦ Astrofotografie-Planung', version:'Version', profile:'lokales Profil', install:'App installieren', loading:'Planner wird vorbereitet …',
    footer:{impressum:'Impressum',datenschutz:'Datenschutz',nutzung:'Nutzungshinweise',quellen:'Datenquellen & Lizenzen',hilfe:'Hilfe',version:'Version'}, close:'Schließen', mainPlan:'Planung', mainSettings:'Einstellungen', settingsArea:'Einstellungsbereiche', profileSelect:'Aktives Benutzerprofil', helpBrowser:'Handbuch im Browser', helpPdf:'Handbuch als PDF', helpTitle:'Ausführliche browserbasierte Hilfe', helpSub:'Bedienung, Daten und Funktionen der Anwendung', helpNote:'Die Links öffnen die deutschsprachige Hilfe. Über 🌐 DE | EN wird zwischen deutscher und englischer Dokumentation gewechselt.', headerHelp:'Hilfe öffnen'
  },
  en: {
    updateAvailable:'A new app version is available. Install it now?', updateNow:'Update now', headerEyebrow:'✦ Astrophotography planning', version:'Version', profile:'local profile', install:'Install app', loading:'Preparing planner …',
    footer:{impressum:'Legal notice',datenschutz:'Privacy',nutzung:'Usage notes',quellen:'Data sources & licenses',hilfe:'Help',version:'Version'}, close:'Close', mainPlan:'Planning', mainSettings:'Settings', settingsArea:'Settings areas', profileSelect:'Active user profile', helpBrowser:'Open help in browser', helpPdf:'Open PDF manual', helpTitle:'Detailed browser-based help', helpSub:'Operation, data and app functions', helpNote:'These links open the English help. Use 🌐 DE | EN to switch between German and English documentation.', headerHelp:'Open help'
  }
};
const EN_EXACT = {
  'Planungsnacht':'Planning night','Standort und Datum gelten nur für diese Planung. Den Standardstandort legst du in den Einstellungen fest.':'Location and date apply only to this planning session. Set the default location in Settings.','Wetter aktualisieren':'Refresh weather','Standort für diese Planung':'Location for this plan','Heute':'Today','Morgen':'Tomorrow','Sonnenuntergang':'Sunset','Gewählter Zeitraum':'Selected window','Astronomische Dunkelheit':'Astronomical darkness','Sonnenaufgang':'Sunrise','Mondaufgang':'Moonrise','Mondkulmination':'Moon culmination','Monduntergang':'Moonset','Mondbeleuchtung':'Moon illumination','Profile für diese Planung':'Profiles for this plan','Alle Auswahlen sind temporär. Dauerhafte Standards werden ausschließlich in den Einstellungen geändert.':'All selections are temporary. Persistent defaults are changed only in Settings.','Planungszeitraum':'Planning window','Teleskop':'Telescope','Kamera':'Camera','Horizontprofil':'Horizon profile','Aufnahmequalitätsprofil':'Capture quality profile','Darstellungsprofil':'Display profile','Wetterdarstellung':'Weather view','Objektauswahl':'Object selection','Filter':'Filters','Suche':'Search','Filter anwenden':'Apply filters','Basisfilter zurücksetzen':'Reset basic filters','Basisfilter wurden auf Standard zurückgesetzt.':'Basic filters have been reset to defaults.','Automatische Aktualisierung nach 1,5 Sekunden; Enter sucht sofort.':'Automatic update after 1.5 seconds; Enter searches immediately.','Max. Magnitude (mag)':'Max. magnitude (mag)','Mindesthöhe (°)':'Minimum altitude (°)','Mind. Sichtbarkeit (h)':'Min. visible duration (h)','Mind. Mondabstand (°)':'Min. Moon distance (°)','Min. Objektgröße (′)':'Min. object size (′)','Max. Objektgröße (′)':'Max. object size (′)','Kataloge':'Catalogs','Objekttypen (keine Auswahl = alle)':'Object types (none selected = all)','Nur Objekte, die auf den Sensor passen':'Only objects that fit the sensor','Treffer':'results','Objekte/Seite':'Objects/page','Bewertung':'Score','Objekt':'Object','Max. Höhe':'Max. altitude','Sichtbar':'Visible','Meridian':'Meridian','Framing':'Framing','Höhenprofil':'Altitude profile','Beste Stunde':'Best hour','Mondabstand':'Moon distance','Wetter':'Weather','Größe':'Size','Mag.':'Mag.','Filterempfehlung':'Filter recommendation','Keine Objekte entsprechen den Filtern.':'No objects match the filters.','Details schließen':'Close details','Höhenkurve':'Altitude curve','Horizontansicht':'Horizon view','Rahmung mit Aladin Lite':'Framing with Aladin Lite','Einstellungen':'Settings','Lokales Profil':'Local profile','Ausrüstung':'Equipment','Zentrale Einstellungen':'Central settings','Standorte & Horizont':'Locations & horizon','Info, Hilfe & Sicherung':'Info, help & backup','Neu':'New','Duplizieren':'Duplicate','Umbenennen':'Rename','Löschen':'Delete','Bitte vor der Nutzung lesen':'Please read before use','Wichtiger Hinweis zur lokalen Datenspeicherung':'Important note on local data storage','Astro Night Planner 1.0':'Astro Night Planner 1.0','Datenstatus':'Data status','Technischer Status der lokalen Speicherung':'Technical status of local storage','Status aktualisieren':'Refresh status','Speicherschutz':'Storage protection','Lokaler Speicherverbrauch':'Local storage usage','Externe Sicherung':'External backup','Letzte Sicherung':'Last backup','Lokale Daten vor automatischer Browserbereinigung schützen':'Protect local data from automatic browser cleanup','Der Speicherschutz verhindert keine manuelle Löschung von Websitedaten.':'Storage protection does not prevent manual deletion of site data.','Automatische externe Sicherung':'Automatic external backup','Sicherungsordner auswählen':'Choose backup folder','Sicherung jetzt erstellen':'Create backup now','Gesamtsicherung wiederherstellen':'Restore full backup','Gesamtsicherung exportieren':'Export all data','Aktuelles Profil exportieren':'Export current profile','Profil importieren':'Import profile','Sicherungseinstellungen speichern':'Save backup settings','Ausführliche browserbasierte Hilfe':'Detailed browser-based help','Bedienung, Daten und Funktionen der Anwendung':'Operation, data and app functions','Handbuch im Browser':'Open help in browser','Handbuch als PDF':'Open PDF manual','Zurück zur aktuellen Anwendung':'Back to the current app','Produktivversion':'Production version','Test':'Test','Produktion':'Production','Nicht aktiv':'Not active','Aktiv':'Active','Nicht ermittelbar':'Unknown','Zugriff vorhanden':'Access available','Freigabe erforderlich':'Permission required','Zugriff verweigert':'Access denied','Kein Ordner gewählt':'No folder selected','Kein Ziel':'No target selected','Automatische Ordnersicherung unterstützt':'Automatic folder backup supported','Automatische Ordnersicherung in diesem Browser nicht unterstützt':'Automatic folder backup is not supported in this browser','Keine geeignete Stunde im nautischen Zeitraum':'No suitable hour in the nautical window','Qualität':'Quality','Mindestrand':'Minimum margin','Alle':'All','alle':'all','keine':'none','Standard':'Default','Benutzerdefiniert':'Custom','Kompakt':'Compact','Detailliert':'Detailed','Nautischer Planungszeitraum':'Nautical planning window','Astronomische Nacht':'Astronomical night','Bürgerliche Nacht':'Civil night','Sonnenuntergang–Sonnenaufgang':'Sunset to sunrise','Nautisch + astronomisch':'Nautical + astronomical','Wetter und Aufnahmequalität':'Weather and imaging quality','Stündlicher Wetterverlauf':'Hourly weather trend','Animierte 24-Stunden-Wolkenkarte':'Animated 24-hour cloud map','Karte + Wolken':'Map + clouds','Nur Wolken':'Clouds only','Niederschlag':'Precipitation','Regen':'Rain','Schnee':'Snow','Wolkenanteil':'Cloud cover','am Prognosepunkt':'at forecast point','Meteoblue-Kontrollquellen':'Meteoblue reference sources','Datenquellen & Lizenzen':'Data sources & licenses','Nutzungshinweise':'Usage notes','Datenschutz':'Privacy','Impressum':'Legal notice','Polarlicht prüfen':'Check aurora','Polarlicht-Dashboard':'Aurora dashboard','Polarlichtdaten aktualisieren':'Refresh aurora data','Mehrnächte-Wetterverlauf öffnen':'Open multi-night weather trend','Anzahl zusätzlicher Nächte':'Number of additional nights','Polarlichtdaten automatisch aktualisieren':'Automatically refresh aurora data','Horizont im Mini-Höhenprofil anzeigen':'Show horizon in mini altitude chart','Himmel & Horizont im externen Aladin-Tab':'Sky & horizon in external Aladin tab'
};
Object.assign(EN_EXACT,{
  'Der Katalogfilter LDN/LBN enthält in dieser Version benannte LDN-Dunkelnebel. LBN-Objekte sind noch nicht als eigener Katalog importiert. Größenwerte der LDN-Objekte werden aus der katalogisierten Fläche als äquivalenter Kreis-Durchmesser berechnet und dienen als praktische Filter- und Rahmungshilfe.':'In this version, the LDN/LBN catalog filter contains named LDN dark nebulae. LBN objects have not yet been imported as a separate catalog. LDN size values are derived from the catalogued area as an equivalent circular diameter and are intended as practical filtering and framing aids.',
  'Mindestbewertung':'Minimum score','Mindestdauer sichtbar (h)':'Minimum visible duration (h)','Basis der Mindestdauer':'Reference for visible duration','Aktuell gewählter Planungszeitraum':'Currently selected planning window','Objektgröße-Preset':'Object size preset','Mindestgröße':'Minimum size','Maximalgröße':'Maximum size','Grad':'Degrees','Bogenminuten':'Arcminutes','Max. Flächenhelligkeit':'Max. surface brightness','Objekte ohne Größenangabe ausschließen':'Exclude objects without size information','Objekte ohne Flächenhelligkeit anzeigen':'Show objects without surface brightness','Aufnahmefilter':'Imaging filters','keine Filterangabe':'no filter information','Rahmungsfilter':'Framing filter','gut gerahmt':'well framed','knapp passend':'near edge','Objekt zu groß':'object too large','keine Rahmungsbewertung':'no framing rating','Objekttyp-Profil':'Object type profile','temporär geändert':'temporarily changed','Meine Aufnahmeziele':'My imaging targets','Zu Meine Aufnahmeziele hinzufügen':'Add to My imaging targets','Aus Meine Aufnahmeziele entfernen':'Remove from My imaging targets','Mond anzeigen':'Show Moon','Objektausrichtung zurücksetzen':'Reset object orientation','Filterprofile und Standardfilter':'Filter profiles and default filters','Standard-Mindestbewertung':'Default minimum score','Standard-Basis der Mindestdauer':'Default visible-duration reference','Standard max. Flächenhelligkeit':'Default max. surface brightness','Objektgrößen-Presets':'Object size presets','Objekttyp-Profile':'Object type profiles','Größen-Preset hinzufügen':'Add size preset','Objekttyp-Profil hinzufügen':'Add object-type profile','Aktuelle Planungs-Objekttypen übernehmen':'Use current planning object types','Filterprofile speichern':'Save filter profiles','Standorte':'Locations','Horizontprofile':'Horizon profiles','Status':'Status','Sicherung':'Backup','Hilfe':'Help','Aufnahmeziel hinzufügen':'Add imaging target','Objekt per Nummer oder Name hinzufügen':'Add object by number or name','Priorität':'Priority','Notiz':'Note','Referenzbild-Links':'Reference image links','Aufnahmeziele':'Imaging targets','Wunschziel':'target','geplant':'planned','begonnen':'started','Daten vollständig':'data complete','bearbeitet':'processed','abgeschlossen':'completed','erneut aufnehmen':'re-image','Entfernen':'Remove','Planungsnacht':'Planning night','Standort für diese Planung':'Location for this plan','Wettermodelle werden geladen …':'Loading weather models ...','Stündliche Modellwerte werden geladen …':'Loading hourly model values ...','Für diesen Planungszeitraum liegen noch keine stündlichen Modellwerte vor.':'No hourly model values are available for this planning window yet.','Mindestgröße Grad':'Minimum size degrees','Mindestgröße Bogenminuten':'Minimum size arcminutes','Maximalgröße Grad':'Maximum size degrees','Maximalgröße Bogenminuten':'Maximum size arcminutes','Objektgrößenprofil':'Object size profile','Kataloge':'Catalogs','Empfohlene Aufnahmefilter':'Recommended imaging filters','Rahmung':'Framing','Objekttypen (mindestens ein Typ erforderlich)':'Object types (at least one required)','Bitte mindestens einen Objekttyp auswählen.':'Please select at least one object type.','Aufnahmeziel suchen':'Search imaging target','Aufnahmeziel suchen und hinzufügen':'Search and add imaging target','Suchen':'Search','Suche innerhalb der aktiven Filter':'Search within active filters','Direktsuche ohne weitere Filter':'Direct search without other filters','Ignoriert alle anderen Filter.':'Ignores all other filters.','Direktsuche aktiv: andere Filter werden ignoriert.':'Direct search active: other filters are ignored.','Basisfilter zurücksetzen':'Reset basic filters','Basisfilter wurden auf Standard zurückgesetzt.':'Basic filters have been reset to defaults.','Kein passendes Objekt gefunden.':'No matching object found.','Dieses Objekt ist bereits in Meine Aufnahmeziele enthalten.':'This object is already in My imaging targets.','Objektlisteninformationen konfigurieren':'Configure object-list information','Objektliste Darstellungsprofil – aktiv':'Object-list display profile - active','Sichtbarkeit, Reihenfolge und aktives Darstellungsprofil der Objektliste.':'Visibility, order and active display profile of the object list.','Anzeige und Planung':'Display and planning','Dauerhafte Standards für neue beziehungsweise zurückgesetzte Planungen':'Persistent defaults for new or reset planning sessions','Standard-Planungszeitraum':'Default planning window','Zu Meine Aufnahmeziele hinzufügen':'Add to My imaging targets','In Meine Aufnahmeziele':'In My imaging targets','Alle Ziele':'All targets','Ziele filtern':'Filter targets','Status filtern':'Filter status','Priorität filtern':'Filter priority','Objekttyp filtern':'Filter object type','Filterempfehlung filtern':'Filter recommendation','Saison/Monat filtern':'Season/month filter','Alle Status':'All statuses','Alle Prioritäten':'All priorities','Alle Objekttypen':'All object types','Alle Filter':'All filters','Alle Monate':'All months','Zielfilter anwenden':'Apply target filters','Zielfilter zurücksetzen':'Reset target filters','Änderungen speichern':'Save changes','Änderungen verwerfen':'Discard changes','Gespeichert ✓':'Saved ✓','Link öffnen':'Open link','Referenz öffnen':'Open reference','Keine gültige Webadresse':'No valid web address'
});

Object.assign(EN_EXACT,{
  'Wettermodelle':'Weather models','Gewichtung für den Modellkonsens je Prognosestunde':'Weights for the model consensus per forecast hour','Summe:':'Total:','Standarddarstellung in der Planung':'Default view in planning','Einzelmodell ohne Mittelung':'Single model without averaging','Wolkenkarte und Datenmenge':'Cloud map and data volume','Auflösung, Kartenausschnitt und Standarddarstellung der animierten 24-Stunden-Prognose':'Resolution, map radius and default view of the animated 24-hour forecast','Kartendetails':'Map detail','Kartenradius':'Map radius','Animationsgeschwindigkeit':'Animation speed','Standard-Zeitschritt der Wolkenanimation':'Default time step for cloud animation','Standard-Modellansicht':'Default model view','Standard-Wolkenschicht':'Default cloud layer','Standard-Kartenmodus':'Default map mode','Standard-Kartenansicht':'Default map view','Glättung der Wolkenfelder':'Cloud-field smoothing','Prozentwerte an Prognosepunkten anzeigen':'Show percentages at forecast points','Astro-Wolkenmodell initial eingeklappt':'Cloud map initially collapsed','Meteoblue-Wetterkarte initial eingeklappt':'Meteoblue weather map initially collapsed','Deep-Sky-Gewichtung':'Deep-sky weighting','Gewichtung speichern':'Save weights','Wettermodelle speichern':'Save weather models','Wolkenkarte speichern':'Save cloud map','Wind und Aufnahmequalität':'Wind and imaging quality','Einheit für Wind, Böen und Jetstream':'Unit for wind, gusts and jet stream','Aktives Aufnahmequalitätsprofil':'Active imaging-quality profile','Tauabstand':'Dew gap','Jetstream':'Jet stream','Teleskope':'Telescopes','Teleskop hinzufügen':'Add telescope','Kameras':'Cameras','Kamera hinzufügen':'Add camera','Montierungen':'Mounts','Montierung hinzufügen':'Add mount','Name':'Name','Brennweite (mm)':'Focal length (mm)','Öffnung (mm)':'Aperture (mm)','Sensorbreite (mm)':'Sensor width (mm)','Sensorhöhe (mm)':'Sensor height (mm)','Pixelgröße (µm)':'Pixel size (µm)','Montierungsart':'Mount type','Max. Zuladung (kg, optional)':'Max. payload (kg, optional)','Aktiv':'Active','Ausrüstung speichern':'Save equipment','Standard-Mindestbewertung':'Default minimum score','Standard-Basis der Mindestdauer':'Default visible-duration reference','Standard max. Flächenhelligkeit':'Default max. surface brightness','Größen-Presets':'Size presets','Objekttyp-Profile':'Object-type profiles','Größen-Preset hinzufügen':'Add size preset','Objekttyp-Profil hinzufügen':'Add object-type profile','Filterprofile speichern':'Save filter profiles','Anzeigeeinstellungen speichern':'Save display settings','Setup-Rahmen standardmäßig anzeigen':'Show setup frame by default','Objektgröße standardmäßig anzeigen':'Show object size by default','Meteoblue standardmäßig eingeklappt':'Meteoblue initially collapsed','Höhenkurve initial eingeklappt':'Altitude curve initially collapsed','Horizontansicht initial eingeklappt':'Horizon view initially collapsed','Aufklappzustand beim Öffnen der Planung':'Collapsed sections when opening planning','Gespeicherte Aufnahmeorte':'Saved imaging locations','Standort hinzufügen':'Add location','Standort bearbeiten':'Edit location','Standardstandort':'Default location','GPS-Verhalten':'GPS behavior','Ort oder Postleitzahl':'City or postal code','Bevorzugtes Land':'Preferred country','Standort suchen':'Search location','Suche läuft …':'Searching ...','Name':'Name','Zeitzone':'Time zone','Breitengrad (°)':'Latitude (°)','Längengrad (°)':'Longitude (°)','Höhe über Meer (m)':'Elevation (m)','GPS verwenden':'Use GPS','Standort löschen':'Delete location','Interaktive Horizontprofile':'Interactive horizon profiles','Letzte Änderung rückgängig':'Undo last change','Horizont auf 0° setzen':'Reset horizon to 0°','Horizont bearbeiten':'Edit horizon','Standardprofil dieses Standorts':'Default profile for this location','Duplizieren':'Duplicate','Umbenennen':'Rename','Hindernisse':'Obstacles','Hindernis hinzufügen':'Add obstacle','Freies Hindernis zeichnen':'Draw free obstacle','Freies Hindernis beenden':'Finish free obstacle','Freies Hindernis':'Free obstacle','Bezeichnung':'Label','Azimut (°)':'Azimuth (°)','Höhe (°)':'Altitude (°)','Standort und Horizonte speichern':'Save location and horizons','Lokales Profil':'Local profile','Einstellungen in IndexedDB, Programmdateien im PWA-Cache':'Settings in IndexedDB, app files in the PWA cache','Einstellungen, Profile, Ausrüstung, Standorte und Horizonte werden lokal in der Browserdatenbank IndexedDB gespeichert. Normale Cookies sind nicht der primäre Speicherort.':'Settings, profiles, equipment, locations and horizons are stored locally in the browser database IndexedDB. Regular cookies are not the primary storage location.','Installierbare PWA für Nachtplanung, astronomisches Wetter, Mond und Dämmerung, Deep-Sky-Auswahl, persönliche Ausrüstung, Standorte, Horizont und Rahmung.':'Installable PWA for night planning, astronomical weather, Moon and twilight, deep-sky selection, personal equipment, locations, horizon and framing.','Umgebung':'Environment','Datenbank':'Database','Version':'Version','Sicherungseinstellungen speichern':'Save backup settings','Aufnahmeziel suchen und hinzufügen':'Search and add imaging target','Katalognummer, Kurzschreibweise oder Objektname eingeben. Beispiele: M 31, NGC7000, NGC 7000, Sh2-129, Barnard 33.':'Enter a catalog number, short form or object name. Examples: M 31, NGC7000, NGC 7000, Sh2-129, Barnard 33.','Persönlicher Zielkatalog für die Frage: Was kann ich heute aufnehmen, was ich schon immer aufnehmen wollte?':'Personal target catalog for the question: what can I image tonight that I have always wanted to capture?','Dieser Katalog erscheint in der Planung als eigener Katalogfilter und ist initial nicht aktiv. Wenn nur „Meine Aufnahmeziele“ gewählt ist, gelten weiterhin alle normalen Filter wie Wetter, Mond, Rahmung, Größe und Mindestbewertung.':'This catalog appears in planning as a separate catalog filter and is initially inactive. If only My imaging targets is selected, all normal filters such as weather, Moon, framing, size and minimum score still apply.','Noch keine Aufnahmeziele gespeichert. Füge Ziele in der Objektliste oder über die Suche hinzu.':'No imaging targets saved yet. Add targets from the object list or via search.','Priorität':'Priority','Notiz':'Note','Referenzbild-Links':'Reference image links','Ein Link pro Zeile':'One link per line','Eigene Hinweise, Ziel, Palette, Setup, offene Punkte':'Own notes, purpose, palette, setup, open points','Beste Monate':'Best months','Rahmung aktuell':'Current framing','Maximalhöhe wird in der Planung standortbezogen berechnet.':'Maximum altitude is calculated for the location in planning.'
});

Object.assign(EN_EXACT, {
  'Wolken gesamt':'Total clouds','Effektive Transparenz':'Effective transparency','Atmosphäre ohne Wolken:':'Atmosphere without clouds:','Seeing-Tendenz':'Seeing trend','Tauabstand':'Dew gap','Böen maximal':'Max. gusts','Bewerteter Zeitraum':'Evaluated window','Sonnenuntergang bis Sonnenaufgang':'Sunset to sunrise','gewählter Planungszeitraum hervorgehoben':'selected planning window highlighted','Astro-Wolkenmodell rund um':'Astro cloud model around','Gewichteter Konsens oder Einzelmodell':'Weighted consensus or single model','Zwischenbilder werden zeitlich interpoliert':'intermediate frames are interpolated in time','Wolkenbewegung und Modellabweichung anzeigen':'Show cloud movement and model deviation','Wettermodell':'Weather model','Wolkenschicht':'Cloud layer','Auswertung':'Evaluation','Kartenansicht':'Map view','Glättung':'Smoothing','Zeitschritt':'Time step','Minuten':'minutes','Prozentwerte anzeigen':'Show percentage values','Kartenzeit':'Map time','Am Standort':'At location','Kartenmittel':'Map average','Modellabweichung':'Model deviation','Wolkenkarte aktualisieren':'Refresh cloud map','Lädt …':'Loading …','Noch keine Wolkenkartendaten vorhanden.':'No cloud-map data available yet.','Gespeicherte Standorte vergleichen':'Compare saved locations','Vergleich laden':'Load comparison','Standort':'Location','Ø Wolken':'Ø clouds','Modellstreuung':'Model spread','Meteoblue Astronomy Seeing':'Meteoblue Astronomy Seeing','unabhängige Kontrollvorhersage':'independent reference forecast','Meteoblue Wetterkarten':'Meteoblue weather maps','zusätzliche Live-, Radar-, Satelliten- und Modellansicht':'additional live, radar, satellite and model view','Zusätzliche unabhängige Karte mit Windanimation, Böen, Satellit, Wolken und Niederschlag, Temperatur, Sonnenscheindauer und Extremprognose.':'Additional independent map with wind animation, gusts, satellite, clouds and precipitation, temperature, sunshine duration and extreme forecast.','Diese Kontrollvorhersage wird nicht in den automatischen Modellkonsens eingerechnet. Standort:':'This reference forecast is not included in the automatic model consensus. Location:','Großansicht':'Large view','Bei Meteoblue öffnen':'Open at Meteoblue','Wetterkarten bei Meteoblue öffnen':'Open weather maps at Meteoblue','Planungsnacht':'Planning night','Sonne und Mond':'Sun and Moon','Wettermodelle':'Weather models','Wetter und Aufnahmequalität':'Weather and imaging quality','Stündlicher Wetterverlauf':'Hourly weather trend','Uhrzeit':'Time','gesamt':'total','tief':'low','mittel':'mid','hoch':'high','Temp.':'Temp.','Böen':'Gusts','Effektive Transparenz*':'Effective transparency*','Die farbliche Bewertung bezieht sich auf die erwartete Aufnahmequalität. * Seeing und Transparenz sind abgeleitete Tendenzen. Die effektive Transparenz berücksichtigt die Gesamtbewölkung; der kleine atmosphärische Wert zeigt die wolkenunabhängige Klarheit.':'Color coding refers to expected imaging quality. * Seeing and transparency are derived trends. Effective transparency includes total cloud cover; the small atmospheric value shows cloud-independent clarity.','Filter':'Filters','Basisfilter':'Basic filters','Kataloge & Aufnahme':'Catalogs & imaging','Objekttypen':'Object types','Mindestdauer sichtbar (h)':'Minimum visible duration (h)','Max. Flächenhelligkeit':'Max. surface brightness','Objektgrößenprofil':'Object size profile','Mindestgröße Grad':'Minimum size degrees','Mindestgröße Bogenminuten':'Minimum size arcminutes','Maximalgröße Grad':'Maximum size degrees','Maximalgröße Bogenminuten':'Maximum size arcminutes','Objekte ohne Größenangabe ausschließen':'Exclude objects without size information','Objekte ohne Flächenhelligkeit anzeigen':'Show objects without surface brightness','Empfohlene Aufnahmefilter':'Recommended imaging filters','Rahmung':'Framing','Objekttyp-Profil':'Object-type profile','Objekttypen (mindestens ein Typ erforderlich)':'Object types (at least one type required)','Meine Aufnahmeziele':'My imaging targets','Aufnahmeziel suchen':'Search target','Aufnahmeziel suchen und hinzufügen':'Search and add target','Änderungen speichern':'Save changes','Öffnen':'Open','Entfernen':'Remove','Referenzbild-Links':'Reference image links','Notiz':'Note','Priorität':'Priority','Status':'Status','Objektumriss':'Object outline','Overlay-Ebenen':'Overlay layers','Himmelsbild in neuem Tab öffnen':'Open sky view in new tab','Survey':'Survey','Messwerkzeug':'Measurement tool','Abstand messen':'Measure distance','Messung zurücksetzen':'Reset measurement','Setup für diese Planung':'Setup for this plan','Setup-Kombinationen':'Setup combinations','Setup hinzufügen':'Add setup','Vergleichsrahmen':'Comparison frames','Keine Umrissdaten verfügbar – Ellipse wird verwendet.':'No outline data available – using ellipse.','Echter Objektumriss verfügbar':'True object outline available','kein Mondaufgang in dieser Nacht':'no moonrise this night','kein Monduntergang in dieser Nacht':'no moonset this night'
});

Object.assign(EN_EXACT,{
  'Modellkonsens':'Model consensus','Gesamtbewölkung':'Total cloud cover','Tiefe Wolken':'Low clouds','Mittlere Wolken':'Mid-level clouds','Hohe Wolken':'High clouds','Wolkenverteilung':'Cloud distribution','Karte + Wolken':'Map + clouds','Nur Wolken':'Clouds only','Strukturiert – deutlichere Wolkengrenzen':'Structured – clearer cloud boundaries','Ausgewogen – Standard':'Balanced – default','Weich – fließende Wetter-App-Darstellung':'Soft – smooth weather-map style','30 Minuten (Standard)':'30 minutes (default)','15 Minuten':'15 minutes','60 Minuten':'60 minutes','25 Kartenpunkte (sparsam)':'25 map points (light)','49 Kartenpunkte (Standard)':'49 map points (default)','81 Kartenpunkte (detailliert)':'81 map points (detailed)','25 Prognosepunkte (sparsam)':'25 forecast points (light)','49 Prognosepunkte (Standard)':'49 forecast points (default)','81 Prognosepunkte (detailliert)':'81 forecast points (detailed)','120 km (Standard)':'120 km (default)','langsam':'slow','normal':'normal','schnell':'fast','Automatisch nach Zoomstufe':'Automatic by zoom level','Nur Hauptobjekte':'Main objects only','Erweitert':'Extended','DSS2 Farbe':'DSS2 color','DSS2 Rot':'DSS2 red','DSS2 Blau':'DSS2 blue','DSS2 red (nativ schwarzweiß)':'DSS2 red (native black/white)','VTSS H-alpha':'VTSS H-alpha','Finkbeiner H-alpha':'Finkbeiner H-alpha','WISE Infrarot':'WISE infrared','PanSTARRS DR1 Farbe':'PanSTARRS DR1 color','Aktive Aladin-Surveys':'Active Aladin surveys','Aladin-Surveys':'Aladin surveys','Surveys in Aladin-Auswahl anzeigen':'Show surveys in Aladin selection','Survey hinzufügen':'Add survey','Anzeigename':'Display name','HiPS-ID':'HiPS ID','Kategorie':'Category','in Auswahl':'in selection','Standard-Survey':'Default survey','Benutzerdefinierte Survey-ID':'Custom survey ID','Weitere Surveys können manuell per HiPS-ID ergänzt werden. Monochrome Surveys werden in ihrer nativen Darstellung angezeigt und nicht künstlich eingefärbt.':'Additional surveys can be added manually by HiPS ID. Monochrome surveys are displayed natively and are not artificially colorized.','Mondaufgang liegt vor dem Planungszeitraum':'Moonrise is before the planning window','Mondaufgang liegt nach dem Planungszeitraum':'Moonrise is after the planning window','Monduntergang liegt vor dem Planungszeitraum':'Moonset is before the planning window','Monduntergang liegt nach dem Planungszeitraum':'Moonset is after the planning window','Abstandslinie anzeigen':'Show measurement line','Messlinie zurücksetzen':'Reset measurement line'
});

Object.assign(EN_EXACT,{
  'Northern Sky Narrowband Survey':'Northern Sky Narrowband Survey','NSNS DR0.2 · H-alpha':'NSNS DR0.2 · H-alpha','NSNS DR0.2 · OIII':'NSNS DR0.2 · OIII','NSNS DR0.2 · SII':'NSNS DR0.2 · SII','NSNS DR0.2 · OIII/H-alpha/SII':'NSNS DR0.2 · OIII/H-alpha/SII','NSNS DR0.2 · H-alpha + Kontinuum':'NSNS DR0.2 · H-alpha + continuum','NSNS DR0.2 · RGB-Kontinuum':'NSNS DR0.2 · RGB continuum',
  'Mit Messwerkzeug und Umrisszeichnung':'With measuring tool and outline drawing','Rahmen auf ausgewähltes Objekt':'Frame selected object','Rahmen auf neues Objekt setzen':'Frame new object','Objektinformationen':'Object information','Wikipedia':'Wikipedia','Wikipedia öffnen':'Open Wikipedia','Zeichenmodus':'Drawing mode','Stützpunkte':'Control points','Freihand':'Freehand','Umriss zeichnen':'Draw outline','Umriss schließen':'Close outline','Punkt zurück':'Undo point','Neu zeichnen':'Redraw','Umriss speichern':'Save outline','Eigener Umriss gespeichert':'Custom outline saved','Kein Objektumriss gespeichert':'No object outline saved','Objektumriss anzeigen':'Show object outline','Objektgröße anzeigen':'Show object size','Standort hinzufügen':'Add location','Neuen Standort hinzufügen':'Add new location','Standort speichern':'Save location','Standortänderungen speichern':'Save location changes','Abbrechen':'Cancel','Bitte zuerst einen Standort aus der Trefferliste wählen oder Koordinaten eingeben.':'Please first select a location from the results or enter coordinates.','Objektumrisse werden lokal im Browser gespeichert und mit der Gesamtsicherung exportiert.':'Object outlines are stored locally in the browser and exported with the full backup.',
  'Survey-Liste anzeigen':'Show survey list','Survey-Liste ausblenden':'Hide survey list','Eigene Umrisse verwalten':'Manage custom outlines','Objektinformationen erweitert':'Extended object information','Rahmen gesetzt – Popup bleibt geöffnet.':'Frame set - popup remains open.',
  'Wikipedia-Symbol':'Wikipedia icon','Schließen':'Close','Gespeicherten Umriss löschen':'Delete saved outline','Gespeicherter Umriss gelöscht':'Saved outline deleted','Kein gespeicherter Umriss vorhanden':'No saved outline available','Umriss löschen':'Delete outline','Aufklappen':'Expand','Zuklappen':'Collapse',
  'Automatische Aktualisierung nach 1,5 Sekunden; Enter sucht sofort.':'Automatic update after 1.5 seconds; Enter searches immediately.'
});
Object.assign(EN_EXACT,{
  'Flugwetterstationen Deutschland':'Aviation weather stations Germany',
  'Wähle die Hauptflughäfen, die im Tab Flugwetter angezeigt werden. Die nächstgelegene Station kann automatisch ergänzt werden.':'Choose the major airports shown in the aviation weather tab. The nearest station can be added automatically.',
  'Nächstgelegene Station automatisch anzeigen':'Automatically show nearest station',
  'METAR/TAF-Daten aktualisieren':'Refresh METAR/TAF data',
  'Stationskarte anzeigen':'Show station map',
  'METAR/TAF werden geladen …':'Loading METAR/TAF ...',
  'Stationen':'Stations',
  'Quelle':'Source',
  'App-Proxy':'App proxy',
  'noch nicht geladen':'not loaded yet',
  'METAR noch nicht geladen.':'METAR not loaded yet.',
  'TAF noch nicht geladen.':'TAF not loaded yet.',
  'Keine Flugwetterstation ausgewählt.':'No aviation weather station selected.',
  'Flugwetterdaten konnten derzeit nicht geladen werden.':'Aviation weather data could not be loaded at the moment.',
  'Flugwetter / Stationsabgleich':'Aviation weather / station check',
  'METAR und TAF sind Stationsmeldungen und flugmeteorologische Kurzfristprognosen. Sie dienen als Realitätsabgleich und fließen nicht automatisch in die Bewertung ein.':'METAR and TAF are station reports and short-range aviation forecasts. They are a reality check and are not automatically included in the score.',
  'Die Daten werden über den festen App-Proxy geladen und unten als verständliche Stationskarten angezeigt. Die Stationskarte wird direkt in der App dargestellt.':'The data is loaded through the fixed app proxy and shown below as readable station cards. The station map is displayed directly in the app.',
  'Der feste App-Proxy ist intern hinterlegt. In den Einstellungen muss keine Proxy-Adresse eingetragen werden.':'The fixed app proxy is stored internally. No proxy address needs to be entered in settings.',
  'TAF-Kurzprognose':'TAF short forecast',
  'Keine auffälligen Einschränkungen aus METAR erkennbar':'No notable METAR restrictions apparent',
  'Keine auffälligen Einschränkungen aus TAF erkennbar':'No notable TAF restrictions apparent',
  'TAF weist auf mögliche Einschränkungen hin':'TAF indicates possible restrictions',
  'Sicht':'Visibility',
  'Wolken':'Clouds',
  'Wind':'Wind',
  'Flugkategorie':'Flight category'
});

Object.assign(EN_EXACT,{
  'Niederschlag gesamt standardmäßig anzeigen':'Show precipitation by default',
  'Regen standardmäßig anzeigen':'Show rain by default',
  'Schnee standardmäßig anzeigen':'Show snow by default',
  'Dämmerungsphasen':'Twilight phases',
  'astronomische Nacht':'astronomical night'
});

Object.assign(EN_EXACT,{
  'Zusätzliche Wetterquellen':'Additional weather sources',
  'Externe Wetterquellen':'External weather sources',
  'Meteoblue':'Meteoblue',
  'Clear Outside':'Clear Outside',
  'Windy':'Windy',
  'Ventusky':'Ventusky',
  'Kontrollquelle':'Reference source',
  'Standort':'Location',
  'Großansicht':'Full-screen view',
  'In neuem Tab öffnen':'Open in new tab',
  'Bei Meteoblue öffnen':'Open at Meteoblue',
  'Wetterkarten bei Meteoblue öffnen':'Open weather maps at Meteoblue',
  'Clear Outside in neuem Tab öffnen':'Open Clear Outside in a new tab',
  'Windy in neuem Tab öffnen':'Open Windy in a new tab',
  'Ventusky in neuem Tab öffnen':'Open Ventusky in a new tab',
  'Meteoblue-Tab anzeigen':'Show Meteoblue tab',
  'Clear-Outside-Tab anzeigen':'Show Clear Outside tab',
  'Windy-Tab anzeigen':'Show Windy tab',
  'Ventusky-Tab anzeigen':'Show Ventusky tab',
  'Ausgewählte externe Wetterquellen werden in der Planung als Tabs angezeigt. Sie werden erst beim Anwählen geladen und fließen nicht automatisch in die Astro-Bewertung ein.':'Selected external weather sources are shown as tabs in the planning view. They are loaded only when selected and are not automatically included in the astro score.',
  'Externe Wetterquellen nutzen den aktuellen Planungsstandort. Sie dienen als Kontrollblick und ersetzen nicht die eigene ANP-Bewertung.':'External weather sources use the current planning location. They are a reference check and do not replace the ANP score.',
  'Meteoblue Astronomy Seeing und Wetterkarten':'Meteoblue Astronomy Seeing and weather maps',
  'Clear Outside Astro-Prognosebild':'Clear Outside astronomy forecast image',
  'Interaktive Windy-Wetterkarte':'Interactive Windy weather map',
  'Interaktive Ventusky-Wetterkarte':'Interactive Ventusky weather map'
});


Object.assign(EN_EXACT,{
  'Niederschlag gesamt standardmäßig anzeigen':'Show precipitation by default',
  'Regen standardmäßig anzeigen':'Show rain by default',
  'Schnee standardmäßig anzeigen':'Show snow by default',
  'Dämmerungsphasen':'Twilight phases',
  'astronomische Nacht':'astronomical night'
});

Object.assign(EN_EXACT,{
  'Zusätzliche Wetterquellen':'Additional weather sources',
  'Die zusätzlichen Wetterquellen sind als Tabs organisiert. Meteoblue, Clear Outside, Windy und Ventusky nutzen den aktuell gewählten Planungsstandort und werden erst geladen, wenn der jeweilige Tab angewählt wird. Sie sind externe Kontrollquellen und fließen nicht automatisch in die Astro-Bewertung ein. Clear Outside wird als Prognosebild eingebunden und kann zusätzlich in einem separaten Browser-Tab geöffnet werden.':'Additional weather sources are organized as tabs. Meteoblue, Clear Outside, Windy and Ventusky use the currently selected planning location and are loaded only when their tab is selected. They are external reference sources and are not automatically included in the astro score. Clear Outside is embedded as a forecast image and can also be opened in a separate browser tab.'
});


Object.assign(EN_EXACT,{
  // General settings/action/status labels
  'Gespeichert':'Saved','Ungespeicherte Änderungen':'Unsaved changes','Rubrik auf Standard zurücksetzen':'Reset section to defaults','Änderungen verwerfen':'Discard changes','Verwerfen':'Discard','Speichern':'Save','Lädt …':'Loading …','Abspielen':'Play','Pause':'Pause','Großansicht':'Full-screen view','Öffnen':'Open','Entfernen':'Remove','Bearbeiten':'Edit','Hinzufügen':'Add','Berechnet:':'Calculated:',
  // Planning night and moon messages
  'liegt vor dem Planungszeitraum':'is before the planning window','liegt nach dem Planungszeitraum':'is after the planning window','kein Mondaufgang in dieser Nacht':'no moonrise this night','kein Monduntergang in dieser Nacht':'no moonset this night','keine astronomische Nacht':'no astronomical night',
  // Cloud map / weather
  'Astro-Wolkenmodell rund um':'Astro cloud model around','Gewichteter Konsens oder Einzelmodell':'Weighted consensus or single model','Zwischenbilder werden zeitlich interpoliert':'Intermediate frames are interpolated in time','Show cloud movement and model deviation':'Show cloud movement and model deviation','Wolkenbewegung und Modellabweichung anzeigen':'Show cloud movement and model deviation','Kartenzeit':'Map time','Am Standort':'At location','Kartenmittel':'Map average','Modellabweichung':'Model deviation','Gespeicherte Standorte vergleichen':'Compare saved locations','Punktprognosen mit geringer Datenmenge.':'Point forecasts with reduced data volume.','Noch kein Standortvergleich geladen.':'No location comparison loaded yet.','Prognosepunkte':'forecast points','Geplante Auflösung':'Planned resolution','15-/30-Minuten-Bilder sind interpoliert und erhöhen nicht die Wettermodellgenauigkeit.':'15/30-minute frames are interpolated and do not increase weather-model accuracy.','Meteoblue Wetterkarten':'Meteoblue weather maps','zusätzliche Live-, Radar-, Satelliten- und Modellansicht':'additional live, radar, satellite and model view','Wetterkarten bei Meteoblue öffnen':'Open weather maps at Meteoblue',
  // Object filters and list
  'Mindestzeit über Mindesthöhe und persönlichem Horizont.':'Minimum time above minimum altitude and personal horizon.','Alle Objekttypen ausgewählt':'All object types selected','Doppelstern':'Double star','Dunkelnebel':'Dark nebula','Emissionsnebel':'Emission nebula','Galaxie':'Galaxy','Galaxiengruppe':'Galaxy group','Galaxienpaar':'Galaxy pair','Kugelsternhaufen':'Globular cluster','Nebel':'Nebula','Offener Sternhaufen':'Open cluster','Planetarischer Nebel':'Planetary nebula','Reflexionsnebel':'Reflection nebula','Sonstiges':'Other','Stern':'Star','Sternassoziation':'Stellar association','Sternhaufen mit Nebel':'Cluster with nebulosity','Supernovaüberrest':'Supernova remnant','Nordamerikanebel':'North America Nebula','Hantelnebel':'Dumbbell Nebula','Viel Umfeld':'Large margin','Qualität':'Quality','Mindestrand':'Minimum margin','Wetterwert':'Weather value','Objektgröße':'Object size','Maximalhöhe':'Maximum altitude','Sichtbarkeitsdauer':'Visible duration','Mini-Höhenprofil':'Mini altitude profile','Wikipedia-Symbol':'Wikipedia icon','Wikipedia icon':'Wikipedia icon',
  // Equipment
  'Teleskope und Objektive':'Telescopes and lenses','Brennweite, Öffnung oder Blende bestimmen zusammen mit Kamera und optischem Faktor das Bildfeld.':'Focal length, aperture or f-number determine the field of view together with the camera and optical factor.','Blende / f-Zahl':'Aperture / f-number','Berechnet: f/4.0 · 50.0 mm Öffnung':'Calculated: f/4.0 · 50.0 mm aperture','Sensorgröße bestimmt das Bildfeld. Pixelgröße kann direkt eingegeben oder aus Sensorgröße und Auflösung/Megapixel berechnet werden.':'Sensor size determines the field of view. Pixel size can be entered directly or calculated from sensor size and resolution/megapixels.','Auflösung X (px)':'Resolution X (px)','Auflösung Y (px)':'Resolution Y (px)','Megapixel':'Megapixels','Reducer, Flattener und Barlow':'Reducers, flatteners and Barlows','Optische Faktoren werden im Setup berücksichtigt. Beispiel: 0,8× Reducer oder 2,0× Barlow.':'Optical factors are included in the setup. Example: 0.8× reducer or 2.0× Barlow.','Noch keine optische Zusatzkomponente angelegt. Setups verwenden dann Faktor 1,0×.':'No optical accessory has been created yet. Setups then use factor 1.0×.','Die Montierung wird derzeit dokumentiert; eine spätere Qualitätsbewertung kann Typ und Tragfähigkeit berücksichtigen.':'The mount is currently documented; a later quality rating may take type and payload capacity into account.','Parallaktisch':'Equatorial','Montierung':'Mount','Montierungen':'Mounts','Optik':'Optics','Faktor':'Factor','Ohne Reducer/Barlow (1.00×)':'No reducer/Barlow (1.00×)','Effektive Brennweite:':'Effective focal length:',
  // Settings / central
  'Windwerte speichern':'Save wind values','Bewertung speichern':'Save score','Bewertung speichern':'Save score','Nur ganzzahlige Eingabefelder. Speichern ist nur bei exakt 100 % möglich.':'Integer fields only. Saving is possible only at exactly 100%.','Wolken (%)':'Clouds (%)','Effektive Transparenz (%)':'Effective transparency (%)','Seeing (%)':'Seeing (%)','Wind/Böen (%)':'Wind/gusts (%)','Tauabstand (%)':'Dew gap (%)','Mond (%)':'Moon (%)','Objekthöhe (%)':'Object altitude (%)','Sichtbarkeitsdauer (%)':'Visibility duration (%)','Gewünschter Mindestfreiraum zum Bildrand (%)':'Desired minimum clearance to image edge (%)','Kamera bei verlässlichem Positionswinkel automatisch optimal drehen':'Automatically rotate camera optimally when position angle is reliable','Qualitätsampel':'Quality traffic light','Rot 0 bis unter Gelb, Gelb bis unter Grün, Grün bis 100.':'Red 0 to below yellow, yellow to below green, green to 100.','Gelb ab':'Yellow from','Grün ab':'Green from','Objektbeschriftungen in Aladin':'Object labels in Aladin','Objektnamen und Katalognummern anzeigen':'Show object names and catalog numbers','Kompakt – Informationen und Reihenfolge':'Compact – information and order','Standard – Informationen und Reihenfolge':'Standard – information and order','Detailliert – Informationen und Reihenfolge':'Detailed – information and order','Einträge per Drag & Drop verschieben oder die Pfeile verwenden. Der Objektname bleibt immer sichtbar.':'Move entries by drag and drop or use the arrows. The object name always remains visible.','Filterprofile':'Filter profiles','Voreinstellungen für Objektgröße, Objekttypen, Mindestbewertung und fehlende Katalogangaben.':'Presets for object size, object types, minimum score and missing catalog data.','Min Grad':'Min degrees','Max Grad':'Max degrees','ohne Größenangabe ausschließen':'exclude objects without size information','Use current planning object types':'Use current planning object types','Aktuelle Planungs-Objekttypen verwenden':'Use current planning object types',
  // Planning section defaults
  'Aufklappzustand beim Öffnen der Planung':'Collapsed sections when opening planning','„Profile für diese Planung“ eingeklappt':'“Profiles for this plan” collapsed','„Wetter und Aufnahmequalität“ eingeklappt':'“Weather and imaging quality” collapsed','„Stündlicher Wetterverlauf“ eingeklappt':'“Hourly weather trend” collapsed','Wolkenkarte anzeigen':'Show cloud map','Wolkenkarte show':'Show cloud map','Additional weather sources show':'Show additional weather sources','Object selection show':'Show object selection','Profiles for this plan show':'Show profiles for this plan','Weather and imaging quality show':'Show weather and imaging quality','Hourly weather trend show':'Show hourly weather trend',
  // Horizon profiles
  'Interaktive Horizontprofile':'Interactive horizon profiles','Mehrere Profile pro Standort sind möglich, zum Beispiel Garten, Terrasse oder mobile Aufstellung.':'Multiple profiles per location are possible, for example garden, terrace or mobile setup.','Persönlicher Horizont und Hindernisse':'Personal horizon and obstacles','Änderungen werden erst mit Speichern dauerhaft übernommen.':'Changes are applied permanently only after saving.','Hindernisse im Profil':'Obstacles in profile','Block-Hindernisse bleiben für einfache Gebäude nutzbar. Freie Hindernisse werden direkt im Diagramm mit Stützpunkten gezeichnet; erneutes Klicken auf „Freies Hindernis beenden“ schließt die Kontur.':'Block obstacles remain useful for simple buildings. Free obstacles are drawn directly in the chart with support points; clicking “Finish free obstacle” again closes the contour.','Block-Hindernis hinzufügen':'Add block obstacle','Freies Hindernis zeichnen':'Draw free obstacle','Freies Hindernis beenden':'Finish free obstacle','Freie Kontur':'Free contour','Stützpunkte':'support points','Beschriftung':'Label','Label':'Label',
  // My imaging targets
  'Name, Nummer, Notiz, Link …':'Name, number, note, link …','Objekttyp':'Object type','Monat':'Month','Beste Monate':'Best months','Flächenhelligkeit':'Surface brightness','Rahmung aktuell: Objekt zu groß · Maximalhöhe wird in der Planung standortbezogen berechnet.':'Current framing: object too large · maximum altitude is calculated per planning location.','Referenz 1 öffnen ↗':'Open reference 1 ↗','Referenz 1 öffnen':'Open reference 1','von':'of','Aufnahmezielen angezeigt':'imaging targets shown',
  // Backup/help
  'Datenspeicherung':'Data storage','Erste Schritte':'First steps','Planungsprofile':'Planning profiles','Wolkenkarte':'Cloud map','Objektfilter':'Object filters','Objektliste':'Object list','Objektdetails':'Object details','Horizont':'Horizon','Browserdaten-FAQ':'Browser data FAQ','Fehlerbehebung':'Troubleshooting','Bewertungswerte':'Score values','Datenspeicherung, Cookies und Browsercache':'Data storage, cookies and browser cache','Einstellungssicherung':'Settings backup','Automatische Sicherung aktivieren':'Enable automatic backup','Nach jedem erfolgreichen Speichern der Einstellungen sichern':'Back up after every successful settings save','Sicherungserinnerung nach Tagen':'Backup reminder after days','Aufzubewahrende datierte Sicherungen':'Dated backups to keep','Sicherungsziel':'Backup target','Berechtigung: Freigabe erforderlich':'Permission: approval required','Die Sicherungsdatei liegt außerhalb des Browsercaches. Nach einer vollständigen Löschung der Websitedaten muss Ordner oder Datei erneut ausgewählt werden.':'The backup file is stored outside the browser cache. After fully deleting site data, the folder or file must be selected again.','Zwei Dateitypen: astro-night-planner-aktuell.json wird fortlaufend überschrieben und ist für die normale Wiederherstellung gedacht. Datierte Dateien sind historische Rücksprungpunkte. Vor einer Wiederherstellung werden Datum und Inhalt angezeigt.':'Two file types: astro-night-planner-current.json is overwritten continuously and intended for normal recovery. Dated files are historical restore points. Before restoring, the date and content are shown.',
  // Locations
  'Der Standardstandort wird hier festgelegt. In der Planung kann vorübergehend ein anderer Ort gewählt werden.':'The default location is set here. A different location can temporarily be selected in planning.','Letzten/Standardstandort verwenden':'Use last/default location','Standortänderungen speichern':'Save location changes'
});

const EN_PHRASE_REPLACEMENTS = [
  [/Mondaufgang\s+([^\n]+?)\s+–\s+liegt vor dem Planungszeitraum/g,'Moonrise $1 – is before the planning window'],
  [/Mondaufgang\s+([^\n]+?)\s+–\s+liegt nach dem Planungszeitraum/g,'Moonrise $1 – is after the planning window'],
  [/Monduntergang\s+([^\n]+?)\s+–\s+liegt vor dem Planungszeitraum/g,'Moonset $1 – is before the planning window'],
  [/Monduntergang\s+([^\n]+?)\s+–\s+liegt nach dem Planungszeitraum/g,'Moonset $1 – is after the planning window'],
  [/Astro-Wolkenmodell rund um/g,'Astro cloud model around'],
  [/Gewichteter Konsens oder Einzelmodell/g,'Weighted consensus or single model'],
  [/Zwischenbilder werden zeitlich interpoliert/g,'Intermediate frames are interpolated in time'],
  [/([0-9]+) Prognosepunkte/g,'$1 forecast points'],
  [/Radius ([0-9]+) km/g,'Radius $1 km'],
  [/DWD ICON, ECMWF IFS und NOAA GFS/g,'DWD ICON, ECMWF IFS and NOAA GFS'],
  [/15-\/30-Minuten-Bilder sind interpoliert und erhöhen nicht die Wettermodellgenauigkeit\./g,'15/30-minute frames are interpolated and do not increase weather-model accuracy.'],
  [/\bGespeichert\b/g,'Saved'],[/\bUngespeicherte Änderungen\b/g,'Unsaved changes'],[/\bRubrik auf Standard zurücksetzen\b/g,'Reset section to defaults'],
  [/Voreinstellungen für Objektgröße, Objekttypen, Mindestbewertung und fehlende Katalogangaben\./g,'Presets for object size, object types, minimum score and missing catalog data.'],
  [/Alle persönlichen Daten werden im gerade verwendeten Browser und Browserprofil gespeichert\.[\s\S]*?externen Sicherung\./g,'All personal data is stored in the current browser and browser profile. IndexedDB contains the app data; Cache Storage contains the app files needed for offline use. Cookies are not the main storage location. A normal cache cleanup usually does not affect the settings; deleting all site data for the installation address can remove them. A domain or browser-profile change also creates a separate storage area. Transfer data with an external backup.']
];



Object.assign(EN_EXACT,{
  // Additional test.29 translation cleanup from screenshot review
  'Neues Setup':'New setup','Neues Setup (Standard)':'New setup (default)','Neues Teleskop':'New telescope','Neue Kamera':'New camera','Neue Montierung':'New mount','Neue Optik':'New optics','Mein Setup':'My setup','Mein Standort':'My location',
  'Leichtes Reisesetup':'Light travel setup','Normales Setup':'Normal setup','Robuste Säule/Montierung':'Robust pier/mount','Parallaktisch':'Equatorial','Alt-Az':'Alt-az',
  'Änderungen wirken sofort auf Objektliste, Rahmungsbewertung und Detailansicht.':'Changes immediately affect the object list, framing rating and detail view.',
  'Sonnenuntergang bis Sonnenaufgang · gewählter Planungszeitraum hervorgehoben':'Sunset to sunrise · selected planning window highlighted',
  'Niederschlag':'Precipitation','Regen':'Rain','Schnee':'Snow','Wolkenanteil am Prognosepunkt':'Cloud cover at forecast point','▶ Abspielen':'▶ Play','Pause':'Pause',
  'Geschätzte Verlagerung':'Estimated movement','Bewegungsrichtung unsicher':'Movement direction uncertain','Sicherheit':'confidence','Richtung':'direction',
  'Meteoblue Astronomy Seeing · unabhängige Kontrollvorhersage':'Meteoblue Astronomy Seeing · independent reference forecast',
  'Meteoblue Wetterkarten · zusätzliche Live-, Radar-, Satelliten- und Modellansicht':'Meteoblue weather maps · additional live, radar, satellite and model view',
  'Meteoblue weather maps · zusätzliche Live-, Radar-, Satelliten- und Modellansicht':'Meteoblue weather maps · additional live, radar, satellite and model view',
  'Zusätzliche unabhängige Karte mit Windanimation, Böen, Satellit, Wolken und Niederschlag, Temperatur, Sonnenscheindauer und Extremprognose.':'Additional independent map with wind animation, gusts, satellite, clouds and precipitation, temperature, sunshine duration and extreme forecast.',
  'Diese Kontrollvorhersage wird nicht in den automatischen Modellkonsens eingerechnet.':'This reference forecast is not included in the automatic model consensus.',
  'Großansicht':'Large view','⛶ Großansicht':'⛶ Large view','Bei Meteoblue öffnen':'Open at Meteoblue','Wetterkarten bei Meteoblue öffnen':'Open weather maps at Meteoblue',
  'Details schließen':'Close details','Planetarischer Nebel':'Planetary nebula','Emissionsnebel':'Emission nebula','Dunkelnebel':'Dark nebula','Reflexionsnebel':'Reflection nebula','Supernovaüberrest':'Supernova remnant',
  'Mit Messwerkzeug, Umrisszeichnung und ersten experimentellen Himmel-/Horizont-Overlays. Der externe Tab kann jederzeit über den Button rechts in der Tab-Zeile geöffnet werden.':'With measuring tool and outline drawing. The external tab can be opened anytime with the button on the right side of the tab row.',
  'Gewählte Aufnahmezeit':'Selected capture time','GEWÄHLTE AUFNAHMEZEIT':'SELECTED CAPTURE TIME','Höhe':'Altitude','Azimut':'Azimuth','Objekthöhe':'Object altitude','persönlicher Horizont':'personal horizon','— persönlicher Horizont':'— personal horizon',
  'Bürgerliche Dämmerung':'Civil twilight','Nautische Dämmerung':'Nautical twilight','Astronomische Dämmerung':'Astronomical twilight','Gewählter Planungszeitraum':'Selected planning window','Gewählte Aufnahmezeit':'Selected capture time',
  'Horizontprofil für diese Planung':'Horizon profile for this plan','Boden/Horizont anzeigen':'Show ground/horizon','Horizont (grün) · Objektbahn (gelb) · Mindesthöhe (gelb gestrichelt) · Dämmerungsphasen (blau) · Planungszeitraum (hellblau)':'Horizon (green) · object path (yellow) · minimum altitude (yellow dashed) · twilight phases (blue) · planning window (light blue)',
  'Berechnet':'Calculated','Öffnung fehlt':'Aperture missing','Optische Komponente hinzufügen':'Add optical accessory','Effektive Brennweite':'Effective focal length','Faktor':'Factor','Optik':'Optics','Ohne Reducer/Barlow (1.00×)':'No reducer/Barlow (1.00×)',
  'Wetter/Karte':'Weather/map','Anzeige':'Display','Grenzwerte bewerten die erwartete Aufnahmequalität, nicht die strukturelle Sicherheit der Ausrüstung.':'Thresholds rate expected imaging quality, not the structural safety of the equipment.',
  'Wind grün unter (km/h)':'Wind green below (km/h)','Wind gelb bis (km/h)':'Wind yellow up to (km/h)','Böen grün unter (km/h)':'Gusts green below (km/h)','Böen gelb bis (km/h)':'Gusts yellow up to (km/h)',
  'Grün über (°C)':'Green above (°C)','Gelb ab (°C)':'Yellow from (°C)','Grün unter (km/h)':'Green below (km/h)','Gelb bis (km/h)':'Yellow up to (km/h)',
  'Der Modellkonsens mittelt DWD ICON, ECMWF IFS und NOAA GFS nach diesen Anteilen. Default: 40 % / 20 % / 40 %.':'The model consensus averages DWD ICON, ECMWF IFS and NOAA GFS using these shares. Default: 40% / 20% / 40%.',
  'In der Planung kann die Ansicht temporär auf ein Einzelmodell umgestellt werden. Der Standard wird ausschließlich hier gespeichert.':'In planning, the view can temporarily be switched to a single model. The default is stored only here.',
  'Summe: 100 %':'Total: 100%','Summe':'Total',
  '25, 49 oder 81 forecast points bestimmen die API-Datenmenge. Die sichtbare Karte wird unabhängig davon in hoher Auflösung weich interpoliert; es werden keine Zellumrandungen gezeichnet. Standard: 49 Punkte in einem Radius von 120 km.':'25, 49 or 81 forecast points determine the API data volume. The visible map is softly interpolated at high resolution independently of this; no cell borders are drawn. Default: 49 points within a 120 km radius.',
  'Einstellungen in IndexedDB, Programmdateien im PWA-Cache':'settings in IndexedDB, app files in the PWA cache','Lokales Profil':'Local profile',
  'Gültige IANA-Zeitzone; wird bei der Standortwahl automatisch gesetzt.':'Valid IANA time zone; set automatically when selecting a location.',
  'Hindernisse im Profil':'Obstacles in profile','Freie Kontur':'Free contour','Stützpunkte':'support points',
  'Größe':'Size','Flächenhelligkeit':'Surface brightness','Beste Monate':'Best months','Rahmung aktuell':'Current framing','Objekt zu groß':'object too large','Maximalhöhe wird in der Planung standortbezogen berechnet.':'Maximum altitude is calculated per planning location.',
  'Zusätzlich höchstens einmal täglich datierte Sicherung':'Additionally create a dated backup at most once per day',
  'Datensicherung':'Backup','Sicherung':'Backup','Einstellungssicherung':'Settings backup',
  'von':'of',
  'Nordamerikanebel':'North America Nebula','Hantelnebel':'Dumbbell Nebula',
  'DSS2 Farbe':'DSS2 color','DSS2 Blau':'DSS2 blue','Optisch':'Optical','Optisch Rotband':'Optical red band','Optisch Blauband':'Optical blue band','H-alpha':'H-alpha','Infrarot':'Infrared','Infrarot/FIR':'Infrared/FIR','Benutzerdefiniert':'Custom'
});
EN_PHRASE_REPLACEMENTS.push(
  [/Aktiv:\s*/g,'Active: '],
  [/Änderungen wirken sofort auf Objektliste, Rahmungsbewertung und Detailansicht\./g,'Changes immediately affect the object list, framing rating and detail view.'],
  [/Sonnenuntergang bis Sonnenaufgang · gewählter Planungszeitraum hervorgehoben/g,'Sunset to sunrise · selected planning window highlighted'],
  [/Geschätzte Verlagerung:\s*Richtung\s*([^·]+)\s*·\s*([0-9.,]+)\s*km\/h\s*·\s*Sicherheit\s*([0-9.,]+)\s*%/g,'Estimated movement: direction $1 · $2 km/h · confidence $3%'],
  [/Meteoblue Astronomy Seeing · unabhängige Kontrollvorhersage/g,'Meteoblue Astronomy Seeing · independent reference forecast'],
  [/Meteoblue Wetterkarten · zusätzliche Live-, Radar-, Satelliten- und Modellansicht/g,'Meteoblue weather maps · additional live, radar, satellite and model view'],
  [/Meteoblue weather maps · zusätzliche Live-, Radar-, Satelliten- und Modellansicht/g,'Meteoblue weather maps · additional live, radar, satellite and model view'],
  [/Mit Messwerkzeug und Umrisszeichnung\.\s*Der externe Tab kann jederzeit über den Button rechts in der Tab-Zeile geöffnet werden\./g,'With measuring tool and outline drawing. The external tab can be opened anytime with the button on the right side of the tab row.'],
  [/Höhe\s+([0-9.,]+)°\s+·\s+Azimut\s+([0-9.,]+)°/g,'Altitude $1° · azimuth $2°'],
  [/Mindesthöhe\s+([0-9.,]+)°/g,'Minimum altitude $1°'],
  [/Berechnet:\s*f\/([0-9.,]+)\s*·\s*([0-9.,]+)\s*mm\s*Öffnung/g,'Calculated: f/$1 · $2 mm aperture'],
  [/Berechnet:\s*([0-9.,]+)\s*µm\s*·\s*([0-9.,]+)\s*MP/g,'Calculated: $1 µm · $2 MP'],
  [/Berechnet:\s*([0-9.,]+)\s*µm/g,'Calculated: $1 µm'],
  [/Effektive Brennweite:\s*([0-9.,]+)\s*mm\s*·\s*Faktor\s*([0-9.,]+)×/g,'Effective focal length: $1 mm · factor $2×'],
  [/Der Modellkonsens mittelt DWD ICON, ECMWF IFS und NOAA GFS nach diesen Anteilen\. Default:\s*40 %\s*\/\s*20 %\s*\/\s*40 %\./g,'The model consensus averages DWD ICON, ECMWF IFS and NOAA GFS using these shares. Default: 40% / 20% / 40%.'],
  [/In der Planung kann die Ansicht temporär auf ein Einzelmodell umgestellt werden\. Der Standard wird ausschließlich hier gespeichert\./g,'In planning, the view can temporarily be switched to a single model. The default is stored only here.'],
  [/([0-9]+)\s+von\s+([0-9]+)\s+Aufnahmezielen angezeigt/g,'$1 of $2 imaging targets shown'],
  [/Größe\s+([0-9′'°×x\s.,]+?)\s*·\s*Mag\.?\s*([0-9.,–-]+)\s*·\s*Flächenhelligkeit\s*([0-9.,–-]*)/g,'Size $1 · Mag. $2 · Surface brightness $3'],
  [/Beste Monate:\s*([^·]+)\s*·\s*Rahmung aktuell:\s*Objekt zu groß\s*·\s*Maximalhöhe wird in der Planung standortbezogen berechnet\./g,'Best months: $1 · Current framing: object too large · maximum altitude is calculated per planning location.'],
  [/Horizont \(grün\) · Objektbahn \(gelb\) · Mindesthöhe \(gelb gestrichelt\) · Dämmerungsphasen \(blau\) · Planungszeitraum \(hellblau\)/g,'Horizon (green) · object path (yellow) · minimum altitude (yellow dashed) · twilight phases (blue) · planning window (light blue)'],
  [/Zwei Dateitypen:\s*astro-night-planner-aktuell\.json wird fortlaufend überschrieben und ist für die normale Wiederherstellung gedacht\. Datierte Dateien sind historische Rücksprungpunkte\. Vor einer Wiederherstellung werden Datum und Inhalt angezeigt\./g,'Two file types: astro-night-planner-current.json is continuously overwritten and intended for normal recovery. Dated files are historical restore points. Before restoring, the date and content are shown.'],
  [/Zusätzlich höchstens einmal täglich datierte Sicherung/g,'Additionally create a dated backup at most once per day'],
  [/Die PWA-Programmdateien liegen getrennt im Cache Storage\.[\s\S]*?Erstelle deshalb regelmäßig externe Sicherungen\./g,'The PWA app files are stored separately in Cache Storage. Deleting only “images and files in cache” normally does not remove IndexedDB. Deleting site data can remove profiles, settings and stored file permissions. Persistent storage only protects against automatic browser cleanup, not against deliberate deletion. Create regular external backups.'],
  [/Lokales Profil\s*„([^“]+)“\s*·\s*Einstellungen in IndexedDB, Programmdateien im PWA-Cache/g,'Local profile “$1” · settings in IndexedDB, app files in the PWA cache'],
  [/Freie Kontur\s*·\s*([0-9]+)\s*Stützpunkte/g,'Free contour · $1 support points'],
  [/Hindernisse im Profil\s*„([^“]+)“/g,'Obstacles in profile “$1”'],
  [/([0-9]+)\s*aus\s*([0-9]+)\s*Katalogobjekten/g,'$1 of $2 catalog objects'],
  [/([0-9]+) Treffer aus ([0-9]+) Katalogobjekten/g,'$1 result of $2 catalog objects'],
  [/([0-9]+) Treffer/g,'$1 result'],
  [/([0-9]+) Prognosepunkte/g,'$1 forecast points'],
  [/Geplante Auflösung:\s*([0-9]+) forecast points/g,'Planned resolution: $1 forecast points'],
  [/Punktprognosen mit geringer Datenmenge\./g,'Point forecasts with a small data volume.'],
  [/Noch kein Standortvergleich geladen\./g,'No location comparison loaded yet.']
);



EN_PHRASE_REPLACEMENTS.push(
  [/Die zusätzlichen Wetterquellen sind als Tabs organisiert\./g,'Additional weather sources are organized as tabs.'],
  [/Meteoblue, Clear Outside, Windy und Ventusky nutzen den aktuell gewählten Planungsstandort und werden erst geladen, wenn der jeweilige Tab angewählt wird\./g,'Meteoblue, Clear Outside, Windy and Ventusky use the currently selected planning location and are loaded only when their tab is selected.'],
  [/Sie sind externe Kontrollquellen und fließen nicht automatisch in die Astro-Bewertung ein\./g,'They are external reference sources and are not automatically included in the astro score.'],
  [/Clear Outside wird als Prognosebild eingebunden und kann zusätzlich in einem separaten Browser-Tab geöffnet werden\./g,'Clear Outside is embedded as a forecast image and can also be opened in a separate browser tab.'],
  [/Öffne die Tabs nacheinander, wenn du die eigene Astro-Wolkenkarte mit externen Quellen vergleichen möchtest\./g,'Open the tabs one after another when you want to compare your own astro cloud map with external sources.'],
  [/Windy und Ventusky dienen als interaktive Karten, Meteoblue als zusätzliche Kontrollansicht und Clear Outside als kompakte Prognosegrafik\./g,'Windy and Ventusky serve as interactive maps, Meteoblue as an additional reference view and Clear Outside as a compact forecast image.'],
  [/Eine separate Wettervergleichsansicht mit gemeinsamer Zeitsteuerung wurde entfernt, weil die externen eingebetteten Karten ihre Zeitachsen nicht zuverlässig gemeinsam übernehmen\./g,'The separate weather comparison view with a shared time control was removed because the embedded external maps do not reliably accept one shared timeline.']
);

Object.assign(EN_EXACT,{
  'Bei Bedarf nach GPS fragen':'Ask for GPS when needed','Standardprofil dieses Standorts':'Default profile for this location','Standort und Horizonte speichern':'Save location and horizons','Standort und Horizonte speichern':'Save location and horizons','Keine zusätzlichen Hindernisse erfasst.':'No additional obstacles recorded.',
  'Bezeichnung':'Label','Azimut (°)':'Azimuth (°)','Höhe (°)':'Altitude (°)','Höhe über Meer (m)':'Elevation (m)','Längengrad (°)':'Longitude (°)','Breitengrad (°)':'Latitude (°)',
  'Teleskope und Objektive':'Telescopes and lenses','Blende / f-Zahl':'Aperture / f-number','Optische Faktoren werden im Setup berücksichtigt. Beispiel: 0,8× Reducer oder 2,0× Barlow.':'Optical factors are included in the setup. Example: 0.8× reducer or 2.0× Barlow.',
  'Noch keine optische Zusatzkomponente angelegt. Setups verwenden dann Faktor 1,0×.':'No optical accessory has been created yet. Setups then use factor 1.0×.',
  'Setups bündeln Teleskop/Objektiv, Kamera, Montierung und optional Reducer/Barlow. Daraus berechnet die Planung die effektive Rahmung.':'Setups bundle telescope/lens, camera, mount and optional reducer/Barlow. The planner calculates the effective framing from this.',
  'Sensorgröße bestimmt das Bildfeld. Pixelgröße kann direkt eingegeben oder aus Sensorgröße und Auflösung/Megapixel berechnet werden.':'Sensor size determines the field of view. Pixel size can be entered directly or calculated from sensor size and resolution/megapixels.',
  'Die Montierung wird derzeit dokumentiert; eine spätere Qualitätsbewertung kann Typ und Tragfähigkeit berücksichtigen.':'The mount is currently documented; a later quality rating may take type and payload capacity into account.',
  'Montierung':'Mount','Mount':'Mount','Auflösung X (px)':'Resolution X (px)','Auflösung Y (px)':'Resolution Y (px)','Megapixel':'Megapixels','Reducer, Flattener und Barlow':'Reducers, flatteners and Barlows',
  'Kamera hinzufügen':'Add camera','Teleskop hinzufügen':'Add telescope','Montierung hinzufügen':'Add mount','Setup hinzufügen':'Add setup','Optische Komponente hinzufügen':'Add optical accessory',
  'Wind und Aufnahmequalität':'Wind and imaging quality','Einheit für Wind, Böen und Jetstream':'Unit for wind, gusts and jet stream','Aktives Aufnahmequalitätsprofil':'Active imaging-quality profile',
  'Wolkenkarte und Datenmenge':'Cloud map and data volume','Auflösung, Kartenradius und Standarddarstellung der animierten 24-Stunden-Prognose':'Resolution, map radius and default view of the animated 24-hour forecast',
  'Niederschlag gesamt standardmäßig anzeigen':'Show precipitation by default','Regen standardmäßig anzeigen':'Show rain by default','Schnee standardmäßig anzeigen':'Show snow by default','Clear Outside initial sichtbar':'Clear Outside shown by default',
  'Externe Wetterquellen als Tabs':'External weather-source tabs','Tabs für externe Wetterquellen':'External weather-source tabs','Ausgewählte externe Wetterquellen werden in der Planung als Tabs angezeigt. Sie werden erst beim Anwählen geladen und fließen nicht automatisch in die Astro-Bewertung ein.':'Selected external weather sources are shown as tabs in the planning view. They are loaded only when selected and are not automatically included in the astro score.',
  'Anzeige und Planung':'Display and planning','Dauerhafte Standards für neue beziehungsweise zurückgesetzte Planungen':'Persistent defaults for new or reset planning sessions','Standard-Planungszeitraum':'Default planning window',
  'Objektlisteninformationen konfigurieren':'Configure object-list information','Sichtbarkeit, Reihenfolge und aktives Darstellungsprofil der Objektliste.':'Visibility, order and active display profile of the object list.','Objektliste Darstellungsprofil – aktiv':'Object-list display profile – active',
  'Aufklappzustand beim Öffnen der Planung':'Collapsed sections when opening planning','Rubriken in der Planung anzeigen oder ausblenden':'Show or hide planning sections',
  'Wetter und Aufnahmequalität anzeigen':'Show weather and imaging quality','Stündlicher Wetterverlauf anzeigen':'Show hourly weather trend','Zusätzliche Wetterquellen anzeigen':'Show additional weather sources','Objektauswahl anzeigen':'Show object selection','Profile für diese Planung anzeigen':'Show profiles for this plan',
  'Aladin-Surveys':'Aladin surveys','Weitere Surveys können manuell per HiPS-ID ergänzt werden. Monochrome Surveys werden nativ angezeigt.':'Additional surveys can be added manually by HiPS ID. Monochrome surveys are shown natively.',
  'Bitte vor der Nutzung lesen':'Please read before use','Wichtiger Hinweis zur lokalen Datenspeicherung':'Important note on local data storage','Einstellungen, Profile, Ausrüstung, Standorte und Horizonte werden lokal in der Browserdatenbank IndexedDB gespeichert. Normale Cookies sind nicht der primäre Speicherort.':'Settings, profiles, equipment, locations and horizons are stored locally in the browser database IndexedDB. Regular cookies are not the primary storage location.',
  'Automatische Sicherung aktivieren':'Enable automatic backup','Nach jedem erfolgreichen Speichern der Einstellungen sichern':'Back up after every successful settings save','Sicherungserinnerung nach Tagen':'Backup reminder after days','Aufzubewahrende datierte Sicherungen':'Dated backups to keep','Sicherungsziel':'Backup target','Noch nicht gewählt':'Not selected yet','Berechtigung':'Permission',
  'Sicherungsordner auswählen':'Choose backup folder','Sicherung jetzt erstellen':'Create backup now','Gesamtsicherung wiederherstellen':'Restore full backup','Gesamtsicherung exportieren':'Export all data','Aktuelles Profil exportieren':'Export current profile','Profil importieren':'Import profile',
  'Persönlicher Zielkatalog für die Frage: Was kann ich heute aufnehmen, was ich schon immer aufnehmen wollte?':'Personal target catalog for the question: what can I image tonight that I have always wanted to capture?',
  'Dieser Katalog erscheint in der Planung als eigener Katalogfilter und ist initial nicht aktiv. Wenn nur „Meine Aufnahmeziele“ gewählt ist, gelten weiterhin alle normalen Filter wie Wetter, Mond, Rahmung, Größe und Mindestbewertung.':'This catalog appears in planning as a separate catalog filter and is initially inactive. If only My imaging targets is selected, all normal filters such as weather, Moon, framing, size and minimum score still apply.',
  'Ziele filtern':'Filter targets','Zielfilter anwenden':'Apply target filters','Zielfilter zurücksetzen':'Reset target filters','Alle Status':'All statuses','Alle Prioritäten':'All priorities','Alle Monate':'All months','Alle Filter':'All filters',
  'Wunschziel':'target','geplant':'planned','begonnen':'started','Daten vollständig':'data complete','bearbeitet':'processed','abgeschlossen':'completed','erneut aufnehmen':'re-image',
  'Aufnahmeziel suchen':'Search target','Referenzbild-Links':'Reference image links','Notiz':'Note','Priorität':'Priority','Referenz öffnen':'Open reference',
  'Datenstatus':'Data status','Speicherschutz':'Storage protection','Lokaler Speicherverbrauch':'Local storage usage','Externe Sicherung':'External backup','Letzte Sicherung':'Last backup',
  'Automatische externe Sicherung':'Automatic external backup','Automatische Ordnersicherung unterstützt':'Automatic folder backup supported','Datenschutz':'Privacy','Impressum':'Legal notice','Nutzungshinweise':'Usage notes',
  'Datenspeicherung, Cookies und Browsercache':'Data storage, cookies and browser cache','Wetter und Modellkonsens':'Weather and model consensus','Meteoblue-Kontrollquellen':'Meteoblue reference sources','Zusätzliche Wetterquellen':'Additional weather sources','Objektliste und Mini-Höhenprofile':'Object list and mini altitude profiles','Objektdetails, Höhenkurve und Horizontansicht':'Object details, altitude curve and horizon view','Bedeutung der Bewertungswerte':'Meaning of score values'
});
EN_PHRASE_REPLACEMENTS.push(
  [/Wetter und Aufnahmequalität anzeigen/g,'Show weather and imaging quality'],
  [/Stündlicher Wetterverlauf anzeigen/g,'Show hourly weather trend'],
  [/Zusätzliche Wetterquellen anzeigen/g,'Show additional weather sources'],
  [/Objektauswahl anzeigen/g,'Show object selection'],
  [/Profile für diese Planung anzeigen/g,'Show profiles for this plan'],
  [/„Profile für diese Planung“ eingeklappt/g,'“Profiles for this plan” collapsed'],
  [/„Wetter und Aufnahmequalität“ eingeklappt/g,'“Weather and imaging quality” collapsed'],
  [/„Stündlicher Wetterverlauf“ eingeklappt/g,'“Hourly weather trend” collapsed'],
  [/([0-9.,]+)\s*von\s*([0-9.,]+)\s*GB/g,'$1 of $2 GB'],
  [/Keine zusätzlichen Hindernisse erfasst\./g,'No additional obstacles recorded.'],
  [/Berechtigung:\s*Freigabe erforderlich/g,'Permission: approval required'],
  [/Berechtigung:\s*([^\n]+)/g,'Permission: $1']
);


Object.assign(EN_EXACT,{
  'Ungespeicherte Änderungen':'Unsaved changes',
  'Gespeichert':'Saved',
  'Gespeichert ✓':'Saved ✓',
  'Erfolgreich gespeichert':'Saved successfully',
  'Änderungen verwerfen':'Discard changes',
  'Änderungen speichern':'Save changes',
  'Anzeigeeinstellungen speichern':'Save display settings',
  'Windwerte speichern':'Save wind values',
  'Wettermodelle speichern':'Save weather models',
  'Wolkenkarte speichern':'Save cloud map',
  'Bewertung speichern':'Save score',
  'Gewichtung speichern':'Save weights',
  'Ausrüstung speichern':'Save equipment',
  'Standort und Horizonte speichern':'Save location and horizons',
  'Filterprofile speichern':'Save filter profiles',
  'Sicherungseinstellungen speichern':'Save backup settings',
  'Rubrik auf Standard zurücksetzen':'Reset section to defaults',
  'Meteoblue-Wetterkarten':'Meteoblue weather maps',
  'Die eingebettete Karte fordert Wolken und Niederschlag als Startansicht an. Falls Meteoblue den zuletzt verwendeten Kartenmodus wiederherstellt, öffne die Wetterkarten bei Meteoblue oder wähle rechts im Meteoblue-Menü „Wolken und Niederschlag“.':'The embedded map requests clouds and precipitation as its start view. If Meteoblue restores the last used map mode, open the weather maps at Meteoblue or choose “Clouds & Precipitation” in the Meteoblue menu on the right.',
  'Die Windkarte wird separat geöffnet, damit die eingebettete Wolken-/Niederschlagskarte nicht versehentlich im Windmodus startet.':'The wind map opens separately so that the embedded clouds/precipitation map does not accidentally start in wind mode.',
  'Astro-Wolkenmodell':'Astro cloud model',
  'Astro-Wolkenmodell anzeigen':'Show astro cloud model',
  'Astro-Wolkenmodell initial eingeklappt':'Astro cloud model initially collapsed',
  'Astro-Wolkenmodell rund um':'Astro cloud model around',
  'Animierte 24-Stunden-Prognose':'Animated 24-hour forecast',
  'Gewichteter Konsens oder Einzelmodell':'Weighted consensus or single model',
  'Zwischenbilder werden zeitlich interpoliert':'intermediate frames are time-interpolated',
  'Wolkenkarte aktualisieren':'Refresh cloud map',
  'Prognosepunkte für drei Wettermodelle werden geladen …':'forecast points for three weather models are loading ...',
  'Noch keine Wolkenkartendaten vorhanden.':'No cloud-map data loaded yet.',
  'Kartenzeit':'Map time',
  'Am Standort':'At location',
  'Kartenmittel':'Map average',
  'Modellabweichung':'Model deviation',
  'Gespeicherte Standorte vergleichen':'Compare saved locations',
  'Vergleich laden':'Load comparison',
  'Punktprognosen mit geringer Datenmenge.':'Point forecasts with reduced data volume.',
  'Noch kein Standortvergleich geladen.':'No location comparison loaded yet.',
  'Standort':'Location',
  'Ø Wolken':'Avg. clouds',
  'Modellstreuung':'Model spread',
  'Bewegungsrichtung unsicher':'Movement direction uncertain',
  'Niederschlag gesamt':'Total precipitation',
  'Niederschlagsarten':'Precipitation layers',
  'Niederschlag gesamt standardmäßig anzeigen':'Show total precipitation by default',
  'Regen standardmäßig anzeigen':'Show rain by default',
  'Schnee standardmäßig anzeigen':'Show snow by default',
  'Niederschlag gesamt enthält Regen, Schauer und Schnee. Regen und Schnee zeigen die Einzelanteile.':'Total precipitation includes rain, showers and snow. Rain and snow show the individual components.',
  'Wolken-/Niederschlagskarte bei Meteoblue öffnen':'Open Meteoblue cloud/precipitation map',
  'Windanimationskarte bei Meteoblue öffnen':'Open Meteoblue wind animation map',
  'Die eingebettete Karte startet wieder als Windanimationskarte. Für Wolken und Niederschlag nutze den separaten Meteoblue-Button.':'The embedded map starts as the wind-animation map again. For clouds and precipitation, use the separate Meteoblue button.',
  'Die separaten Meteoblue-Buttons übergeben den aktuellen Planungsstandort und öffnen gezielt Windanimation oder Wolken/Niederschlag.':'The separate Meteoblue buttons pass the current planning location and open wind animation or clouds/precipitation deliberately.'
});
const OBJECT_NAME_TRANSLATIONS_EN = Object.freeze({
  'Andromedagalaxie':'Andromeda Galaxy','Dreiecksnebel':'Triangulum Galaxy','Orionnebel':'Orion Nebula','Plejaden':'Pleiades','Krebsnebel':'Crab Nebula','Herkuleshaufen':'Great Hercules Cluster','Kugelsternhaufen M92':'Globular Cluster M92','Whirlpool-Galaxie':'Whirlpool Galaxy','Bodes Galaxie':'Bode’s Galaxy','Zigarrengalaxie':'Cigar Galaxy','Feuerradgalaxie':'Pinwheel Galaxy','Sombrerogalaxie':'Sombrero Galaxy','Hantelnebel':'Dumbbell Nebula','Ringnebel':'Ring Nebula','Lagunenebel':'Lagoon Nebula','Adlernebel':'Eagle Nebula','Omeganebel':'Omega Nebula','Trifidnebel':'Trifid Nebula','Sonnenblumengalaxie':'Sunflower Galaxy','Schwarzes Auge':'Black Eye Galaxy','Eulennebel':'Owl Nebula','Nordamerikanebel':'North America Nebula','Pelikannebel':'Pelican Nebula','Westlicher Schleiernebel':'Western Veil Nebula','Hexenhandnebel':'Witch’s Broom Nebula','Östlicher Schleiernebel':'Eastern Veil Nebula','Herznebel':'Heart Nebula','Seelennebel':'Soul Nebula','Blasennebel':'Bubble Nebula','Kaliforniennebel':'California Nebula','Rosettennebel':'Rosette Nebula','Spaghettinebel':'Spaghetti Nebula','Medusanebel':'Medusa Nebula','Helixnebel':'Helix Nebula','Sichelnebel':'Crescent Nebula',
  'Neues Setup':'New setup','Neues Teleskop':'New telescope','Neue Kamera':'New camera','Neuer Standort':'New location','Freier Horizont':'Clear horizon','Leichtes Reisesetup':'Light travel setup','Normales Setup':'Normal setup','Robuste Säule/Montierung':'Robust pier/mount','Alle Objekttypen ausgewählt':'All object types selected'
});
function escapeRegExp(value){return String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
for(const [de,en] of Object.entries(OBJECT_NAME_TRANSLATIONS_EN)){
  EN_EXACT[de]=en;
  EN_PHRASE_REPLACEMENTS.push([new RegExp(escapeRegExp(de),'g'),en]);
}
function tx(key){return (UI_TEXT[language]||UI_TEXT.de)[key]||UI_TEXT.de[key]||key}
function txFooter(key){return (UI_TEXT[language]||UI_TEXT.de).footer[key]||UI_TEXT.de.footer[key]||key}
Object.assign(EN_EXACT,{
  'Himmelsbild':'Sky image','Rahmen':'Frame','Objekte':'Objects','Zeit & Mond':'Time & Moon','Interaktives Himmelsbild':'Interactive sky image','Rahmung:':'Framing:','Survey':'Survey','Himmelsbild neu laden':'Reload sky image','Himmelsbild in neuem Tab öffnen':'Open sky image in new tab','Mit Messwerkzeug und Umrisszeichnung':'With measuring tool and outline drawing','Vergleichsrahmen':'Comparison frames','Setup-Rahmen anzeigen':'Show setup frame','Kamerarotation':'Camera rotation','Optimale Rotation':'Optimal rotation','Rahmen auf Objekt zurücksetzen':'Reset frame to object','Rahmen verschieben':'Move frame','Infofelder anzeigen':'Show info boxes','Infofelder-Position':'Info-box position','rechts':'right','links':'left','oben':'top','unten':'bottom','Objektnamen anzeigen':'Show object names','Beschriftungsumfang':'Label detail','Automatisch nach Zoomstufe':'Automatic by zoom level','Nur Hauptobjekte':'Main objects only','Erweitert':'Extended','Mond anzeigen':'Show Moon','Zeit im Planungsfenster':'Time in planning window','Objektumriss anzeigen':'Show object outline','Objekt-/Umrissrotation':'Object/outline rotation','Objektausrichtung zurücksetzen':'Reset object orientation','Ändert Planungswerte, nicht das Sternfeld.':'Changes planning values, not the star field.','Astronomische Nacht':'Astronomical night','keine':'none','Keine astronomische Nacht – nautischer Zeitraum':'No astronomical night – nautical window','Horizont (grün) · Objektbahn (gelb) · Mindesthöhe (gelb gestrichelt) · Dämmerungsphasen (blau) · Planungszeitraum (hellblau)':'Horizon (green) · object path (yellow) · minimum altitude (yellow dashed) · twilight phases (blue) · planning window (light blue)'
});

Object.assign(EN_EXACT,{
  'Die eingebetteten Karten starten näher am Planungsstandort, damit lokale Strukturen schneller erkennbar sind.':'The embedded maps start closer to the planning location so local structures are easier to see.',
  'Meteoblue wird nicht zentral synchronisiert. Nutze dort die eigene Zeitachse.':'Meteoblue is not centrally synchronized. Use its own timeline there.'
});
Object.assign(EN_EXACT,{
  'Sichtbar Mindesthöhe':'Visible above minimum altitude',
  'Sichtbar über pers. Horizont':'Visible above personal horizon',
  'Sichtbar über pers. Horizont und Mindesthöhe':'Visible above personal horizon and minimum altitude',
  'Sichtbar über pers. Horizont + Mindesthöhe':'Visible above personal horizon + minimum altitude',
  'Polarlicht':'Aurora',
  'Polarlicht-Einstellungen speichern':'Save aurora settings',
  'Intervall Minuten':'Interval in minutes',
  'Benachrichtigung ab':'Notify from',
  'Gelb':'Yellow',
  'Orange':'Orange',
  'Rot':'Red',
  'Kp-Schwellen':'Kp thresholds',
  'Letzter Datenstatus':'Last data status',
  'Aladin - Survey':'Aladin - Survey',
  'Aladin - Himmel & Horizont':'Aladin - Sky & Horizon',
  'Äquatoriales Gradnetz anzeigen':'Show equatorial grid',
  'Azimutales Gradnetz anzeigen':'Show azimuthal grid',
  'Gradnetz-Abstufung':'Grid spacing',
  'Boden/Horizontbereich anzeigen':'Show ground/horizon area',
  'Himmelsrichtungen/Kompassmarken anzeigen':'Show cardinal directions/compass marks',
  'Horizontlinie im Mini-Höhenprofil anzeigen':'Show horizon line in mini altitude chart'
});
function optionLabel(label){return language==='en'?(EN_EXACT[label]||label):label}
function optionText(label){return esc(optionLabel(label))}
function setText(id,text){const el=document.getElementById(id);if(el)el.textContent=text}
function updateStaticLanguageUi(){
  document.documentElement.lang=language==='en'?'en':'de';document.documentElement.dataset.language=language;
  document.querySelectorAll('.language-switch button').forEach(btn=>btn.classList.toggle('active',btn.dataset.language===language));
  setText('updateBannerText',tx('updateAvailable'));setText('reloadForUpdate',tx('updateNow'));setText('headerEyebrow',tx('headerEyebrow'));setText('versionLabel',tx('version'));setText('profileLabel',tx('profile'));setText('installButton',tx('install'));setText('loadingText',tx('loading'));setText('legalCloseButton',tx('close'));setText('bottomPlanLabel',tx('mainPlan'));setText('bottomSettingsLabel',tx('mainSettings'));
  const profileSelect=document.getElementById('headerProfileSelect'); if(profileSelect) profileSelect.setAttribute('aria-label', tx('profileSelect'));
  const footerButtons={impressum:txFooter('impressum'),datenschutz:txFooter('datenschutz'),nutzung:txFooter('nutzung'),quellen:txFooter('quellen'),version:txFooter('version')};
  document.querySelectorAll('[data-legal-page]').forEach(btn=>{const key=btn.dataset.legalPage;if(footerButtons[key])btn.textContent=footerButtons[key]});
  const footerHelp=document.getElementById('footerHelpLink'); if(footerHelp){footerHelp.textContent=txFooter('hilfe')}
  const headerHelp=document.getElementById('headerHelpButton'); if(headerHelp){headerHelp.title=tx('headerHelp');headerHelp.setAttribute('aria-label',tx('headerHelp'))}
}
function localizeExactText(root=document.body){
  if(language!=='en'||!root)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){return node.nodeValue&&node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
  const nodes=[];let node;while((node=walker.nextNode()))nodes.push(node);
  for(const textNode of nodes){
    const raw=textNode.nodeValue;const trimmed=raw.trim();const replacement=EN_EXACT[trimmed];let next=replacement?raw.replace(trimmed,replacement):raw;
    if(language==='en'&&Array.isArray(EN_PHRASE_REPLACEMENTS))for(const [pattern,value] of EN_PHRASE_REPLACEMENTS)next=next.replace(pattern,value);
    if(next!==raw)textNode.nodeValue=next;
  }
  root.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(element=>{
    for(const attr of ['placeholder','aria-label','title']){const value=element.getAttribute(attr);if(!value)continue;let next=EN_EXACT[value]||value;if(language==='en'&&Array.isArray(EN_PHRASE_REPLACEMENTS))for(const [pattern,repl] of EN_PHRASE_REPLACEMENTS)next=next.replace(pattern,repl);if(next!==value)element.setAttribute(attr,next)}
  });
}
function setLanguage(next){if(next!=='de'&&next!=='en')return;language=next;try{localStorage.setItem(LANGUAGE_STORAGE_KEY,language);}catch(error){}updateStaticLanguageUi();render();}

const deepClone = value => JSON.parse(JSON.stringify(value));
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const HORIZON_POINT_COUNT = 145;
const HORIZON_LAST_INDEX = HORIZON_POINT_COUNT - 1;
const HORIZON_STEP_DEG = 360 / HORIZON_LAST_INDEX;
function emptyHorizonProfile(){return Array(HORIZON_POINT_COUNT).fill(0)}
function horizonAzForIndex(index){return Math.round(index * HORIZON_STEP_DEG * 1000) / 1000}
function horizonIndexForAz(az){return clamp(Math.round((((Number(az)||0)%360+360)%360) / HORIZON_STEP_DEG),0,HORIZON_LAST_INDEX)}
function horizonCardinalIndex(index){return clamp(Math.round((index*45)/HORIZON_STEP_DEG),0,HORIZON_LAST_INDEX)}
function resampleHorizonProfile(values){
  const arr=Array.isArray(values)?values.map(value=>clamp(Number(value)||0,0,90)):[];
  if(arr.length===HORIZON_POINT_COUNT){arr[HORIZON_LAST_INDEX]=arr[0];return arr}
  if(!arr.length)return emptyHorizonProfile();
  const sourceLast=Math.max(1,arr.length-1),out=[];
  for(let index=0;index<HORIZON_POINT_COUNT;index++){
    const sourcePos=index/HORIZON_LAST_INDEX*sourceLast,lo=Math.floor(sourcePos),hi=Math.min(sourceLast,lo+1),f=sourcePos-lo;
    const a=clamp(Number(arr[lo])||0,0,90),b=clamp(Number(arr[hi])||0,0,90);
    out.push(a*(1-f)+b*f);
  }
  out[HORIZON_LAST_INDEX]=out[0];return out;
}
function horizonFromCardinals(values){
  const card=Array.isArray(values)&&values.length===8?values.map(value=>clamp(Number(value)||0,0,90)):Array(8).fill(0);
  const out=[];
  for(let index=0;index<HORIZON_POINT_COUNT;index++){
    const position=horizonAzForIndex(index)/45,lower=Math.floor(position)%8,upper=(lower+1)%8,fraction=position-Math.floor(position);
    out.push(card[lower]*(1-fraction)+card[upper]*fraction);
  }
  out[HORIZON_LAST_INDEX]=out[0];return out;
}
const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const WIND_PROFILES = {
  travel: { name: 'Leichtes Reisesetup', windGreen: 7, windYellow: 14, gustGreen: 11, gustYellow: 22 },
  normal: { name: 'Normales Setup', windGreen: 11, windYellow: 22, gustGreen: 18, gustYellow: 32 },
  robust: { name: 'Robuste Säule/Montierung', windGreen: 18, windYellow: 32, gustGreen: 29, gustYellow: 47 },
};
const WEATHER_MODEL_CONFIG = Object.freeze({
  icon: { name:'DWD ICON', model:'icon_seamless', defaultWeight:40 },
  ecmwf: { name:'ECMWF IFS', model:'ecmwf_ifs025', defaultWeight:20 },
  gfs: { name:'NOAA GFS', model:'gfs_seamless', defaultWeight:40 }
});
const WEATHER_VIEW_OPTIONS = [
  ['consensus','Modellkonsens'],
  ['icon','DWD ICON'],
  ['ecmwf','ECMWF IFS'],
  ['gfs','NOAA GFS'],
];
const CLOUD_MAP_VIEW_OPTIONS = WEATHER_VIEW_OPTIONS;
const CLOUD_MAP_LAYER_OPTIONS = [
  ['cloud','Gesamtbewölkung'],
  ['cloudLow','Tiefe Wolken'],
  ['cloudMid','Mittlere Wolken'],
  ['cloudHigh','Hohe Wolken'],
];
const CLOUD_MAP_MODE_OPTIONS = [
  ['clouds','Wolkenverteilung'],
  ['uncertainty','Modellabweichung'],
];
const CLOUD_MAP_BASE_OPTIONS = [
  ['combined','Karte + Wolken'],
  ['cloudOnly','Nur Wolken'],
];
const CLOUD_MAP_GRID_OPTIONS = [
  [5,'25 Kartenpunkte (sparsam)'],
  [7,'49 Kartenpunkte (Standard)'],
  [9,'81 Kartenpunkte (detailliert)'],
];
const CLOUD_MAP_RADIUS_OPTIONS = [
  [60,'60 km'],
  [120,'120 km (Standard)'],
  [200,'200 km'],
];
const DISPLAY_COLUMNS = [
  ['score','Bewertung'],['name','Objekt / Typ / Katalog'],['wikipedia','Wikipedia-Symbol'],['maxAltitude','Maximalhöhe'],
  ['visibleHours','Sichtbar Mindesthöhe'],['visibleHorizon','Sichtbar über pers. Horizont'],['visibleHorizonAndMin','Sichtbar über pers. Horizont und Mindesthöhe'],
  ['meridian','Meridian'],['framing','Framing'],['miniChart','Mini-Höhenprofil'],
  ['bestHour','Beste Stunde'],['moonDistance','Mondabstand'],['weather','Wetterwert'],['size','Objektgröße'],['magnitude','Magnitude'],['filters','Filterempfehlung']
];
const DISPLAY_COLUMN_IDS = DISPLAY_COLUMNS.map(item=>item[0]);
const DETAILED_DEFAULT_COLUMNS = DISPLAY_COLUMN_IDS.filter(id=>id!=='visibleHorizon');
const DISPLAY_PROFILES = {
  compact: { name:'Kompakt', pageSize:20, columns:['score','name','wikipedia','maxAltitude','visibleHours','miniChart'], columnOrder:[...DISPLAY_COLUMN_IDS] },
  standard: { name:'Standard', pageSize:20, columns:['score','name','wikipedia','maxAltitude','visibleHours','meridian','framing','miniChart'], columnOrder:[...DISPLAY_COLUMN_IDS] },
  detailed: { name:'Detailliert', pageSize:20, columns:[...DETAILED_DEFAULT_COLUMNS], columnOrder:[...DISPLAY_COLUMN_IDS] },
};
const CLOUD_SMOOTHING_OPTIONS = [
  ['structured','Strukturiert – deutlichere Wolkengrenzen'],
  ['balanced','Ausgewogen – Standard'],
  ['soft','Weich – fließende Wetter-App-Darstellung'],
];
const ALADIN_LABEL_DETAIL_OPTIONS = [
  ['auto','Automatisch nach Zoomstufe'],
  ['main','Nur Hauptobjekte'],
  ['extended','Erweitert'],
];

Object.assign(EN_EXACT,{
  'Kalenderdatum':'Calendar date',
  'Datum im Kalender wählen':'Choose date in calendar',
  'Wetterdaten nicht verfügbar':'Weather data unavailable',
  'Für dieses Datum liegen keine verlässlichen Wetterdaten im Vorhersagebereich vor. Astronomische Planung, Objektliste, Mondinformationen und Rahmung bleiben verfügbar.':'No reliable forecast data is available for this date. Astronomical planning, object list, Moon information and framing remain available.',
  'Rubriken anzeigen oder ausblenden':'Show or hide sections',
  'Rubrik anzeigen':'Show section',
  'Standardzustand':'Default state',
  'offen':'open',
  'zugeklappt':'collapsed',
  'Horizont importieren/exportieren':'Import/export horizon',
  'N.I.N.A.-Horizont importieren':'Import N.I.N.A. horizon',
  'N.I.N.A.-Horizont exportieren':'Export N.I.N.A. horizon',
  'Für N.I.N.A. exportieren':'Export for N.I.N.A.',
  'Planungsdaten für N.I.N.A. wurden exportiert.':'Planning data for N.I.N.A. has been exported.',
  'Horizont wurde importiert.':'Horizon has been imported.',
  'Horizont wurde exportiert.':'Horizon has been exported.',
  'Azimut':'Azimuth',
  'Höhe':'Altitude'
});

const DEFAULT_ALADIN_SURVEYS = [
  {id:'dss2-color',name:'DSS2 Farbe',hipsId:'P/DSS2/color',category:'Optisch',enabled:true,builtin:true},
  {id:'dss2-red',name:'DSS2 red (nativ schwarzweiß)',hipsId:'P/DSS2/red',category:'Optisch Rotband',enabled:true,builtin:true},
  {id:'dss2-blue',name:'DSS2 Blau',hipsId:'P/DSS2/blue',category:'Optisch Blauband',enabled:false,builtin:true},
  {id:'panstarrs-color',name:'PanSTARRS DR1 Farbe',hipsId:'P/PanSTARRS/DR1/color-z-zg-g',category:'Optisch Farbe',enabled:true,builtin:true},
  {id:'vtss-ha',name:'VTSS H-alpha',hipsId:'P/VTSS/Ha',category:'H-alpha',enabled:true,builtin:true},
  {id:'finkbeiner-ha',name:'Finkbeiner H-alpha',hipsId:'P/Finkbeiner',category:'H-alpha',enabled:false,builtin:true},
  {id:'allwise-color',name:'WISE Infrarot',hipsId:'P/allWISE/color',category:'Infrarot',enabled:true,builtin:true},
  {id:'2mass-color',name:'2MASS',hipsId:'P/2MASS/color',category:'Infrarot',enabled:false,builtin:true},
  {id:'iris',name:'IRIS',hipsId:'P/IRIS/color',category:'Infrarot/FIR',enabled:false,builtin:true},
  {id:'nsns-ha',name:'NSNS DR0.2 · H-alpha',hipsId:'simg.de/P/NSNS/DR0_2/halpha8',category:'Northern Sky Narrowband Survey',enabled:true,builtin:true},
  {id:'nsns-oiii',name:'NSNS DR0.2 · OIII',hipsId:'simg.de/P/NSNS/DR0_2/oiii8',category:'Northern Sky Narrowband Survey',enabled:true,builtin:true},
  {id:'nsns-sii',name:'NSNS DR0.2 · SII',hipsId:'simg.de/P/NSNS/DR0_2/sii8',category:'Northern Sky Narrowband Survey',enabled:true,builtin:true},
  {id:'nsns-ohs',name:'NSNS DR0.2 · OIII/H-alpha/SII',hipsId:'simg.de/P/NSNS/DR0_2/ohs8',category:'Northern Sky Narrowband Survey',enabled:true,builtin:true},
  {id:'nsns-hbr',name:'NSNS DR0.2 · H-alpha + Kontinuum',hipsId:'simg.de/P/NSNS/DR0_2/hbr8',category:'Northern Sky Narrowband Survey',enabled:false,builtin:true},
  {id:'nsns-rgb',name:'NSNS DR0.2 · RGB-Kontinuum',hipsId:'simg.de/P/NSNS/DR0_2/rgb8',category:'Northern Sky Narrowband Survey',enabled:false,builtin:true}
];
function defaultAladinSurveys(){return DEFAULT_ALADIN_SURVEYS.map(item=>({...item}))}
function normalizeAladinSurveys(value){
  const saved=Array.isArray(value)?value:[];
  const byHips=new Map(saved.map(item=>[String(item.hipsId||item.id||'').trim(),item]).filter(([key])=>key));
  const builtins=DEFAULT_ALADIN_SURVEYS.map(item=>{const stored=byHips.get(item.hipsId)||saved.find(x=>x.id===item.id)||{};return {...item,name:String(stored.name||item.name),category:String(stored.category||item.category),enabled:stored.enabled!==undefined?Boolean(stored.enabled):Boolean(item.enabled)}});
  const custom=saved.filter(item=>item&&!DEFAULT_ALADIN_SURVEYS.some(base=>base.id===item.id||base.hipsId===item.hipsId)).map((item,index)=>({id:item.id||`custom-survey-${index}`,name:String(item.name||item.hipsId||'Custom survey'),hipsId:String(item.hipsId||'').trim(),category:String(item.category||'Benutzerdefiniert'),enabled:item.enabled!==false,builtin:false})).filter(item=>item.hipsId);
  return [...builtins,...custom];
}
function enabledAladinSurveys(source=profile){const list=normalizeAladinSurveys(source?.central?.aladinSurveys);return list.filter(item=>item.enabled&&item.hipsId)}
function surveyLabelFor(hipsId,source=profile){const item=normalizeAladinSurveys(source?.central?.aladinSurveys).find(x=>x.hipsId===hipsId);return item?.name||hipsId||'DSS2 Farbe'}
const TIMEZONE_FALLBACK = ['Europe/Berlin','Europe/Vienna','Europe/Zurich','Europe/Paris','Europe/London','Europe/Rome','Europe/Madrid','Europe/Prague','Europe/Warsaw','Europe/Amsterdam','Europe/Brussels','Europe/Copenhagen','Europe/Stockholm','Europe/Oslo','Europe/Helsinki','Europe/Athens','Europe/Istanbul','UTC','America/New_York','America/Chicago','America/Denver','America/Los_Angeles','America/Toronto','America/Vancouver','Asia/Tokyo','Asia/Shanghai','Australia/Sydney'];
const TIMEZONE_OPTIONS = (()=>{try{return Intl.supportedValuesOf?.('timeZone')||TIMEZONE_FALLBACK}catch{return TIMEZONE_FALLBACK}})();
const COUNTRY_OPTIONS = [
  ['DE','Deutschland'],['AT','Österreich'],['CH','Schweiz'],['FR','Frankreich'],['IT','Italien'],['NL','Niederlande'],['BE','Belgien'],['LU','Luxemburg'],['CZ','Tschechien'],['PL','Polen'],['DK','Dänemark'],['SE','Schweden'],['NO','Norwegen'],['FI','Finnland'],['ES','Spanien'],['PT','Portugal'],['GB','Vereinigtes Königreich'],['US','USA'],['','Weltweit']
];

const EXTRA_CATALOGS = ['Barnard','LDN','LBN','Meine Aufnahmeziele'];
const FILTER_KEYS = ['L','R','G','B','Ha','OIII','SII','NO_FILTER'];
const FILTER_LABELS = {L:'L',R:'R',G:'G',B:'B',Ha:'Ha',OIII:'OIII',SII:'SII',NO_FILTER:'keine Filterangabe'};
const DEFAULT_SELECTED_FILTERS = FILTER_KEYS.slice();
const FRAMING_FILTERS = [
  ['good','gut passend'],['near-edge','knapp / nahe am Rand'],['too-large','Objekt zu groß'],['unknown','keine Bewertung']
];
const DEFAULT_NEW_ENTRY_NAMES = new Set(['Neues Teleskop','Neue Kamera','Neue Montierung','Neues Setup','Neue Optik','Neuer Standort','Mein Teleskop','Mein Standort','Mein Setup']);
const OPTICAL_ACCESSORY_NONE_ID = 'optical-none';
function opticalAccessoriesFor(equipment){
  const list = Array.isArray(equipment?.opticalAccessories) ? equipment.opticalAccessories : [];
  const normalized = list.map((item,index)=>({id:item.id||`optical-${index}`,name:String(item.name||'Optischer Faktor'),factor:Number(item.factor)||1,type:item.type||'neutral'}));
  return [{id:OPTICAL_ACCESSORY_NONE_ID,name:'Ohne Reducer/Barlow',factor:1,type:'neutral'},...normalized];
}
function opticalFactorForSetup(setup,equipment=profile?.equipment){
  if(!setup)return 1;
  const direct = Number(setup.opticalFactor);
  if(Number.isFinite(direct) && direct>0) return direct;
  const item = opticalAccessoriesFor(equipment).find(acc=>acc.id===setup.opticalAccessoryId);
  return Number(item?.factor)||1;
}
function effectiveFocalLength(scope,setup=null,equipment=profile?.equipment){
  const focal=Number(scope?.focalLength)||0;
  return focal * opticalFactorForSetup(setup,equipment);
}
function fRatioFromScope(scope){
  const fl=Number(scope?.focalLength)||0, ap=Number(scope?.aperture)||0;
  return fl>0 && ap>0 ? fl/ap : (Number(scope?.fRatio)||0);
}
function calculateCameraPixelSize(camera){
  const w=Number(camera?.sensorWidth)||0, h=Number(camera?.sensorHeight)||0;
  const rx=Number(camera?.resolutionX)||0, ry=Number(camera?.resolutionY)||0;
  if(w>0 && rx>0) return (w*1000)/rx;
  const mp=Number(camera?.megapixels)||0;
  if(w>0 && h>0 && mp>0){
    const aspect=w/h, total=mp*1e6, pxX=Math.sqrt(total*aspect);
    if(pxX>0) return (w*1000)/pxX;
  }
  return Number(camera?.pixelSize)||0;
}
function updateCalculatedEquipmentValues(equipment){
  (equipment?.telescopes||[]).forEach(scope=>{
    const fl=Number(scope.focalLength)||0, fr=Number(scope.fRatio)||0, ap=Number(scope.aperture)||0;
    if(fl>0 && fr>0) scope.aperture=Math.round(fl/fr*10)/10;
    else if(fl>0 && ap>0) scope.fRatio=Math.round(fl/ap*100)/100;
  });
  (equipment?.cameras||[]).forEach(camera=>{
    const px=calculateCameraPixelSize(camera);
    if(px>0) camera.pixelSize=Math.round(px*100)/100;
    const rx=Number(camera.resolutionX)||0, ry=Number(camera.resolutionY)||0;
    if(rx>0 && ry>0) camera.megapixels=Math.round(rx*ry/10000)/100;
  });
  (equipment?.setups||[]).forEach(setup=>{
    const acc=opticalAccessoriesFor(equipment).find(item=>item.id===setup.opticalAccessoryId);
    if(acc) setup.opticalFactor=Number(acc.factor)||1;
    else if(!Number(setup.opticalFactor)) setup.opticalFactor=1;
  });
}
function frameCenterForObject(object){
  const ra=Number(profile?.planning?.frameCenterRaDeg), dec=Number(profile?.planning?.frameCenterDecDeg);
  const owner=profile?.planning?.frameCenterObjectId;
  if(object&&owner===object.id&&Number.isFinite(ra)&&Number.isFinite(dec))return {raDeg:ra,decDeg:dec};
  return {raDeg:(Number(object?.raHours)||0)*15,decDeg:Number(object?.decDeg)||0};
}

function degMinToArcMin(deg,min){return Math.max(0,(Number(deg)||0)*60+clamp(Math.round(Number(min)||0),0,59))}
function arcMinToDegMin(value){const total=Math.max(0,Math.round(Number(value)||0));return{deg:Math.floor(total/60),min:total%60}}
function formatDegMinArc(value){const dm=arcMinToDegMin(value);return `${dm.deg}°${String(dm.min).padStart(2,'0')}′`}
function defaultSizeProfiles(){return[{id:'size-standard',name:'Standard Deep-Sky',minDeg:0,minMin:3,maxDeg:4,maxMin:0,excludeNoSize:false}]}
function defaultObjectTypeProfiles(){return[{id:'types-all',name:'Alle Objekttypen ausgewählt',types:[]}]}
function recommendedFilterSet(object){const out=new Set();for(const raw of object.recommendedFilters||[]){const v=String(raw).trim();if(!v)continue;const u=v.toUpperCase().replace(/\s+/g,'');if(u==='RGB'){out.add('R');out.add('G');out.add('B');continue}if(u==='LRGB'){out.add('L');out.add('R');out.add('G');out.add('B');continue}if(u==='HA'||u==='H-ALPHA')out.add('Ha');else if(u==='OIII'||u==='O3')out.add('OIII');else if(u==='SII'||u==='S2')out.add('SII');else if(['L','R','G','B'].includes(u))out.add(u);}
  return out;
}
function objectMatchesCatalogSelection(object,selectedCatalogs){const selected=Array.isArray(selectedCatalogs)?selectedCatalogs:[];if(!selected.length)return true;const catalogs=object.catalogs||[];const inTargets=(profile.targets||[]).some(t=>t.objectId===object.id);return selected.some(cat=>{if(cat==='Meine Aufnahmeziele')return inTargets;if(cat==='LDN/LBN')return catalogs.some(c=>['LDN','LBN','LDN/LBN'].includes(String(c)))||/^(LDN|LBN)\s*\d+/i.test(object.id);if(cat==='LDN')return catalogs.includes('LDN')||/^LDN\s*\d+/i.test(object.id);if(cat==='LBN')return catalogs.includes('LBN')||/^LBN\s*\d+/i.test(object.id);if(cat==='Barnard')return catalogs.includes('Barnard')||/^(B|Barnard)\s*\d+/i.test(object.id);return catalogs.includes(cat)})}
function objectFramingFilterBucket(code){if(code==='too-large')return'too-large';if(code==='unknown'||!code)return'unknown';if(code==='good'||code==='wide')return'good';return'near-edge'}
function selectedTypeProfileName(){const id=profile.planning.objectTypeProfileId;return (profile.central.objectTypeProfiles||[]).find(x=>x.id===id)?.name||'Benutzerdefiniert'}
function targetObjectIds(){return new Set((profile.targets||[]).map(item=>item.objectId))}
function allObjectTypes(){return [...new Set(catalog.map(object=>object.type).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'de'))}
function resolvedObjectTypeProfileTypes(preset){const all=allObjectTypes();if(!preset||preset.id==='types-all'||!Array.isArray(preset.types)||!preset.types.length)return all;return preset.types.filter(type=>all.includes(type))}
function ensurePlanningObjectTypes(){if(!profile?.planning)return;const all=allObjectTypes();if(!profile.planning.objectTypeProfileCustom){const preset=(profile.central.objectTypeProfiles||[]).find(item=>item.id===profile.planning.objectTypeProfileId)||profile.central.objectTypeProfiles?.[0];profile.planning.types=resolvedObjectTypeProfileTypes(preset)}else{profile.planning.types=Array.isArray(profile.planning.types)?profile.planning.types.filter(type=>all.includes(type)):[]}}
function framingStatusLabel(value){const text=String(value||'').trim();const map={'too-large':'Objekt zu groß','unknown':'keine Bewertung','good':'gut passend','wide':'gut passend','near-edge':'knapp / nahe am Rand','extremely-tight':'knapp / nahe am Rand','Objekt zu groß für das Bildfeld':'Objekt zu groß','Gut gerahmt':'gut passend','Viel Umfeld':'gut passend','Objekt nahe am Bildrand':'knapp / nahe am Rand','Objekt passt nur äußerst knapp':'knapp / nahe am Rand'};return map[text]||text||'keine Bewertung'}

const CURATED_OBJECT_OUTLINES = {};
function outlineKeyForObject(obj){return String(obj?.id||'').replace(/\s+/g,'').toUpperCase()}
function curatedOutlineForObject(obj){return CURATED_OBJECT_OUTLINES[outlineKeyForObject(obj)]||null}


function standardProfile(){
  return {
    id:'standard', name:'Standard', schemaVersion:8, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString(),
    equipment:{
      telescopes:[], selectedTelescopeId:'',
      cameras:[], selectedCameraId:'',
      mounts:[], selectedMountId:'',
      setups:[], selectedSetupId:'', opticalAccessories:[], selectedOpticalAccessoryId:''
    },
    central:{
      windUnit:'kmh', activeWindProfile:'normal', windProfiles:deepClone(WIND_PROFILES),
      dew:{green:5,yellow:2}, jet:{green:36,yellow:72},
      weatherModels:{weights:{icon:40,ecmwf:20,gfs:40},defaultView:'consensus'},
      cloudMap:{gridSize:7,radiusKm:120,defaultView:'consensus',defaultLayer:'cloud',defaultMode:'clouds',defaultBaseMode:'combined',showValues:true,animationMs:900,timeStepMinutes:30,smoothing:'balanced',collapsed:false,meteoblueMapCollapsed:true,weatherOverlays:{precip:true,rain:true,snow:true}},
      weights:{clouds:30,transparency:15,seeing:10,wind:10,dew:10,moon:10,altitude:10,duration:5},
      qualityThresholds:{yellow:60,green:80},
      filterDefaults:{minScore:0,visibilityBasis:'nautical',showNoSurfaceBrightness:true,surfaceBrightnessMax:99,selectedFilters:DEFAULT_SELECTED_FILTERS.slice(),framingFilter:['good','near-edge','too-large','unknown']},
      sizeProfiles:defaultSizeProfiles(),activeSizeProfileId:'size-standard',objectTypeProfiles:defaultObjectTypeProfiles(),activeObjectTypeProfileId:'types-all',
      defaultPlanningWindow:'nautical', defaultLocationId:'', gpsBehavior:'last', locationSearchCountry:'DE',
      framing:{minMarginPercent:10,autoRotate:true},
      aladinLabels:{visible:true,detail:'auto'},
      aladinInfo:{visible:true,position:'right'},
      aladinSurveys:defaultAladinSurveys(),
      weatherSources:{meteoblue:true,clearoutside:true,windy:true,ventusky:true},
      multiNightWeather:{extraNights:3},
      aurora:{enabled:true,autoRefreshMinutes:0,notifyLevel:'orange',yellowKp:5.7,orangeKp:6.7,redKp:7.3,lastStatus:null},
      miniHorizon:{show:true,showVisibleText:true},
      externalAladin:{altAzGrid:false,altAzGridStep:'auto',altAzGridColor:'#1f6f52',altAzGridLineWidth:0.8,groundMode:'standard',groundOpacity:50,compass:true,orientation:'standard'},
      listDisplay:{activeProfile:'standard',profiles:deepClone(DISPLAY_PROFILES)},
      objectSizeVisible:false, frameVisible:true, meteoblueCollapsed:true,
      detailPanels:{altitudeCollapsed:true,horizonCollapsed:true},
      collapsed:{profiles:false,weatherSummary:false,weatherHourly:false,weather:false,meteoblue:true,filters:false,framing:false,cloudMap:false},
      visibleSections:{profiles:true,weatherSummary:true,weatherHourly:true,cloudMap:true,meteoblue:true,weatherSources:true,objectSelection:true},
      persistentStorageRequested:false
    },
    locations:[], selectedLocationId:'',
    planning:{dateKey:'',locationId:null,planningWindow:'nautical',temporaryWindProfile:null,temporaryDisplayProfile:null,temporaryWeatherView:null,temporarySetupId:null,temporaryTelescopeId:null,temporaryCameraId:null,temporaryHorizonProfileId:null,cloudMapTimeStepMinutes:null,
      temporaryCloudMapView:null,temporaryCloudMapBaseMode:null,temporaryCloudSmoothing:null,temporaryCloudMapShowValues:null,cloudMapLayer:'cloud',cloudMapMode:'clouds',cloudMapFrame:0,cloudMapWeatherOverlays:{precip:true,rain:true,snow:true},
      search:'',directSearch:'',catalogs:['Messier','NGC','IC','Sh2','Abell','Zusatzkatalog'],types:[],objectTypeProfileId:'types-all',objectTypeProfileCustom:false,maxMagnitude:16,minAltitude:25,minVisibleHours:1.5,visibilityBasis:'nautical',minMoonDistance:25,
      minSize:3,maxSize:240,sizeProfileId:'size-standard',excludeNoSize:false,minScore:0,selectedFilters:DEFAULT_SELECTED_FILTERS.slice(),framingFilter:['good','near-edge','too-large','unknown'],surfaceBrightnessMax:99,showNoSurfaceBrightness:true,onlyFits:false,page:1,pageSize:20,selectedObjectId:'M31',detailsOpen:false,objectRotation:35,objectRotationObjectId:null,frameRotation:0,timeFraction:.5,showMoonInAladin:false,
      detailTimeFraction:0,showGroundHorizon:true,comparisonSetupIds:[],frameMoveMode:false,frameCenterRaDeg:null,frameCenterDecDeg:null,frameCenterObjectId:null,weatherSourceTab:'meteoblue'},
    targets:[],
    targetFilters:{search:'',status:'all',priority:'all',type:'all',filter:'all',month:'all'},
    ui:{mainTab:'plan',settingsTab:'equipment',scroll:{plan:0,settings:0}}
  };
}

const BUILTIN_OBJECTS = [
 ['M31','Andromedagalaxie',['NGC 224'],'Galaxie',0.712,41.269,3.44,190,60,'Andromeda',['L','RGB'],['Messier','NGC'],35],
 ['M33','Dreiecksnebel',['NGC 598'],'Galaxie',1.564,30.66,5.72,70.8,41.7,'Triangulum',['L','RGB','Ha'],['Messier','NGC'],23],
 ['M42','Orionnebel',['NGC 1976'],'Emissionsnebel',5.588,-5.391,4,85,60,'Orion',['Ha','OIII','RGB'],['Messier','NGC'],0],
 ['M45','Plejaden',[],'Offener Sternhaufen',3.792,24.117,1.6,110,110,'Taurus',['RGB','L'],['Messier'],0],
 ['M1','Krebsnebel',['NGC 1952'],'Supernovaüberrest',5.575,22.014,8.4,7,5,'Taurus',['Ha','OIII','RGB'],['Messier','NGC'],0],
 ['M13','Herkuleshaufen',['NGC 6205'],'Kugelsternhaufen',16.695,36.461,5.8,20,20,'Hercules',['L','RGB'],['Messier','NGC'],0],
 ['M92','Kugelsternhaufen M92',['NGC 6341'],'Kugelsternhaufen',17.285,43.136,6.4,14,14,'Hercules',['L','RGB'],['Messier','NGC'],0],
 ['M51','Whirlpool-Galaxie',['NGC 5194'],'Galaxie',13.498,47.195,8.4,11.2,6.9,'Canes Venatici',['L','RGB','Ha'],['Messier','NGC'],0],
 ['M81','Bodes Galaxie',['NGC 3031'],'Galaxie',9.926,69.065,6.9,26.9,14.1,'Ursa Major',['L','RGB','Ha'],['Messier','NGC'],157],
 ['M82','Zigarrengalaxie',['NGC 3034'],'Galaxie',9.932,69.679,8.4,11.2,4.3,'Ursa Major',['L','RGB','Ha'],['Messier','NGC'],65],
 ['M101','Feuerradgalaxie',['NGC 5457'],'Galaxie',14.053,54.349,7.9,28.8,26.9,'Ursa Major',['L','RGB','Ha'],['Messier','NGC'],39],
 ['M104','Sombrerogalaxie',['NGC 4594'],'Galaxie',12.667,-11.623,8,8.7,3.5,'Virgo',['L','RGB'],['Messier','NGC'],90],
 ['M27','Hantelnebel',['NGC 6853'],'Planetarischer Nebel',19.993,22.721,7.4,8,5.7,'Vulpecula',['OIII','Ha','RGB'],['Messier','NGC'],0],
 ['M57','Ringnebel',['NGC 6720'],'Planetarischer Nebel',18.893,33.03,8.8,1.4,1,'Lyra',['OIII','Ha','RGB'],['Messier','NGC'],0],
 ['M8','Lagunenebel',['NGC 6523'],'Emissionsnebel',18.063,-24.386,6,90,40,'Sagittarius',['Ha','OIII','RGB'],['Messier','NGC'],0],
 ['M16','Adlernebel',['NGC 6611'],'Sternhaufen mit Nebel',18.314,-13.806,6.4,35,28,'Serpens',['Ha','OIII','SII','RGB'],['Messier','NGC'],0],
 ['M17','Omeganebel',['NGC 6618'],'Emissionsnebel',18.347,-16.171,6,46,37,'Sagittarius',['Ha','OIII','SII','RGB'],['Messier','NGC'],0],
 ['M20','Trifidnebel',['NGC 6514'],'Sternhaufen mit Nebel',18.043,-23.029,6.3,28,28,'Sagittarius',['Ha','OIII','RGB'],['Messier','NGC'],0],
 ['M63','Sonnenblumengalaxie',['NGC 5055'],'Galaxie',13.264,42.029,8.6,12.6,7.2,'Canes Venatici',['L','RGB','Ha'],['Messier','NGC'],105],
 ['M64','Schwarzes Auge',['NGC 4826'],'Galaxie',12.945,21.683,8.5,10,5.4,'Coma Berenices',['L','RGB'],['Messier','NGC'],115],
 ['M65','Galaxie M65',['NGC 3623'],'Galaxie',11.316,13.093,9.3,8.7,2.5,'Leo',['L','RGB'],['Messier','NGC'],174],
 ['M66','Galaxie M66',['NGC 3627'],'Galaxie',11.338,12.991,8.9,9.1,4.2,'Leo',['L','RGB','Ha'],['Messier','NGC'],173],
 ['M97','Eulennebel',['NGC 3587'],'Planetarischer Nebel',11.247,55.019,9.9,3.4,3.3,'Ursa Major',['OIII','Ha','RGB'],['Messier','NGC'],0],
 ['NGC 7000','Nordamerikanebel',[],'Emissionsnebel',20.98,44.33,4,120,100,'Cygnus',['Ha','OIII','SII'],['NGC'],0],
 ['IC 5070','Pelikannebel',[],'Emissionsnebel',20.85,44.33,8,80,70,'Cygnus',['Ha','OIII','SII'],['IC'],0],
 ['NGC 6960','Westlicher Schleiernebel',['Hexenhandnebel'],'Supernovaüberrest',20.758,30.72,7,70,6,'Cygnus',['OIII','Ha','RGB'],['NGC'],0],
 ['NGC 6992','Östlicher Schleiernebel',[],'Supernovaüberrest',20.94,31.72,7,60,8,'Cygnus',['OIII','Ha','RGB'],['NGC'],0],
 ['IC 1805','Herznebel',[],'Emissionsnebel',2.55,61.45,6.5,150,150,'Cassiopeia',['Ha','OIII','SII'],['IC'],0],
 ['IC 1848','Seelennebel',[],'Emissionsnebel',2.85,60.4,6.5,150,75,'Cassiopeia',['Ha','OIII','SII'],['IC'],0],
 ['NGC 7635','Blasennebel',[],'Emissionsnebel',23.345,61.2,10,15,8,'Cassiopeia',['Ha','OIII','SII'],['NGC'],0],
 ['NGC 1499','Kaliforniennebel',[],'Emissionsnebel',4.05,36.42,5,145,40,'Perseus',['Ha','RGB'],['NGC'],0],
 ['NGC 2237','Rosettennebel',['NGC 2244'],'Sternhaufen mit Nebel',6.55,5.05,6,80,60,'Monoceros',['Ha','OIII','SII','RGB'],['NGC'],0],
 ['SH2-240','Spaghettinebel',['Simeis 147'],'Supernovaüberrest',5.67,28.0,12,180,180,'Taurus',['Ha','OIII'],['Sh2'],0],
 ['SH2-216','Sh2-216',[],'Planetarischer Nebel',4.72,46.7,12,100,90,'Perseus',['OIII','Ha'],['Sh2'],0],
 ['SH2-221','Sh2-221',['HB9'],'Supernovaüberrest',5.02,46.7,12,120,90,'Auriga',['Ha','OIII'],['Sh2'],0],
 ['CTB 1','CTB 1',['Abell 85'],'Supernovaüberrest',23.99,62.45,12,34,28,'Cassiopeia',['OIII','Ha'],['Abell','Zusatzkatalog'],0],
 ['Abell 39','Abell 39',[],'Planetarischer Nebel',16.455,27.91,13.7,2.8,2.8,'Hercules',['OIII','Ha'],['Abell'],0],
 ['Abell 21','Medusanebel',['Sh2-274'],'Planetarischer Nebel',7.49,13.25,10.3,12,10,'Gemini',['OIII','Ha'],['Abell','Sh2'],0],
 ['NGC 7293','Helixnebel',[],'Planetarischer Nebel',22.494,-20.837,7.6,25,20,'Aquarius',['OIII','Ha','RGB'],['NGC'],0],
 ['NGC 6888','Sichelnebel',[],'Emissionsnebel',20.201,38.355,7.4,20,10,'Cygnus',['OIII','Ha','SII'],['NGC'],0]
].map(r=>({id:r[0],name:r[1],aliases:r[2],type:r[3],raHours:r[4],decDeg:r[5],magnitude:r[6],majorArcMin:r[7],minorArcMin:r[8],constellation:r[9],recommendedFilters:r[10],catalogs:r[11],positionAngleDeg:r[12]}));


const GERMAN_AVIATION_STATIONS = [
  {id:'EDDS',name:'Stuttgart',lat:48.6899,lon:9.2219},
  {id:'EDDM',name:'München',lat:48.3538,lon:11.7861},
  {id:'EDDF',name:'Frankfurt/Main',lat:50.0379,lon:8.5622},
  {id:'EDDL',name:'Düsseldorf',lat:51.2895,lon:6.7668},
  {id:'EDDH',name:'Hamburg',lat:53.6304,lon:9.9882},
  {id:'EDDK',name:'Köln/Bonn',lat:50.8659,lon:7.1427},
  {id:'EDDB',name:'Berlin Brandenburg',lat:52.3667,lon:13.5033},
  {id:'EDDP',name:'Leipzig/Halle',lat:51.4239,lon:12.2364},
  {id:'EDDN',name:'Nürnberg',lat:49.4987,lon:11.0780},
  {id:'EDDV',name:'Hannover',lat:52.4611,lon:9.6851},
  {id:'EDDG',name:'Münster/Osnabrück',lat:52.1346,lon:7.6848},
  {id:'EDLW',name:'Dortmund',lat:51.5183,lon:7.6122},
  {id:'EDNY',name:'Friedrichshafen',lat:47.6713,lon:9.5115},
  {id:'EDSB',name:'Karlsruhe/Baden-Baden',lat:48.7794,lon:8.0805},
  {id:'EDFM',name:'Mannheim City',lat:49.4727,lon:8.5143},
  {id:'EDDR',name:'Saarbrücken',lat:49.2146,lon:7.1095},
  {id:'EDDW',name:'Bremen',lat:53.0475,lon:8.7867},
  {id:'EDJA',name:'Memmingen',lat:47.9888,lon:10.2395},
  {id:'EDDC',name:'Dresden',lat:51.1340,lon:13.7672},
  {id:'EDDE',name:'Erfurt-Weimar',lat:50.9798,lon:10.9581}
];
function haversineKm(aLat,aLon,bLat,bLon){const R=6371,rad=x=>Number(x)*Math.PI/180,dLat=rad(bLat-aLat),dLon=rad(bLon-aLon),la1=rad(aLat),la2=rad(bLat);const h=Math.sin(dLat/2)**2+Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(h));}
function nearestAviationStation(loc){if(!loc)return GERMAN_AVIATION_STATIONS[0];return GERMAN_AVIATION_STATIONS.reduce((best,st)=>haversineKm(loc.latitude,loc.longitude,st.lat,st.lon)<haversineKm(loc.latitude,loc.longitude,best.lat,best.lon)?st:best,GERMAN_AVIATION_STATIONS[0]);}
function selectedAviationStations(loc){const cfg=profile?.central?.flightWeather||{};const ids=new Set(Array.isArray(cfg.selectedStations)?cfg.selectedStations:['EDDS','EDDM','EDDF']);if(cfg.autoNearest!==false){const near=nearestAviationStation(loc);if(near)ids.add(near.id);}return GERMAN_AVIATION_STATIONS.filter(st=>ids.has(st.id));}
function aviationStationLabel(st,loc){const d=loc?haversineKm(loc.latitude,loc.longitude,st.lat,st.lon):null;return `${st.id} ${st.name}${Number.isFinite(d)?` · ${fmt(d,0)} km`:''}`;}
function airportWeatherLink(st){return `https://aviationweather.gov/data/metar/?ids=${encodeURIComponent(st.id)}&format=decoded`;}
function airportTafLink(st){return `https://aviationweather.gov/data/metar/?ids=${encodeURIComponent(st.id)}&format=decoded&taf=true`;}
function aviationApiUrl(kind,ids){return `https://aviationweather.gov/api/data/${kind}?ids=${encodeURIComponent(ids)}&format=json`;}
function aviationProxyBase(){return FLIGHT_WEATHER_PROXY_BASE.replace(/\/+$/,'');}
function aviationProxyUrl(ids){const base=aviationProxyBase();return `${base}/flight?stations=${encodeURIComponent(ids)}`;}
function flightAstroHint(metar){
  const raw=safeRawText(metar?.rawOb||metar?.raw_text||metar?.raw||metar?.text).toUpperCase();
  const cat=String(metar?.fltCat||metar?.flightCategory||'').toUpperCase();
  const clouds=Array.isArray(metar?.clouds)?metar.clouds.map(c=>String(c.cover||c.coverage||'').toUpperCase()).join(' '):raw;
  const dewGap=(Number.isFinite(Number(metar?.temp))&&Number.isFinite(Number(metar?.dewp)))?Number(metar.temp)-Number(metar.dewp):null;
  const hints=[];
  if(/\bCAVOK\b/.test(raw))hints.push(language==='en'?'CAVOK: good visibility, no low clouds reported':'CAVOK: gute Sicht, keine niedrigen Wolken gemeldet');
  if(/\b(OVC|BKN)\d{3}\b/.test(raw)||/\b(OVC|BKN)\b/.test(clouds))hints.push(language==='en'?'BKN/OVC: check broken or overcast cloud layers':'BKN/OVC: geschlossene oder durchbrochene Bewölkung prüfen');
  if(/\b(FG|BR|HZ|FU)\b/.test(raw))hints.push(language==='en'?'Mist/fog/reduced visibility reported':'Sichttrübung/Nebel/Dunst gemeldet');
  if(/\b(VCSH|SHRA|RA|SN|TS)\b/.test(raw))hints.push(language==='en'?'Precipitation/thunderstorm indication present':'Niederschlag/Gewitterhinweis vorhanden');
  if(cat&&cat!=='VFR')hints.push(language==='en'?`Flight category ${cat}: visibility/clouds restricted`:`Flugkategorie ${cat}: Sicht/Wolken eingeschränkt`);
  if(Number.isFinite(dewGap)&&dewGap<3)hints.push(language==='en'?`Dew point spread only ${fmt(dewGap,1)} °C`:`Taupunktabstand nur ${fmt(dewGap,1)} °C`);
  return hints.length?hints.join(' · '):(language==='en'?'No notable METAR restrictions apparent':'Keine auffälligen Einschränkungen aus METAR erkennbar');
}
function tafAstroHint(taf){
  const raw=safeRawText(taf?.rawTAF||taf?.raw_text||taf?.raw||taf?.text).toUpperCase();
  if(!raw)return language==='en'?'TAF not loaded yet.':'TAF noch nicht geladen.';
  const hints=[];
  if(/\b(TS|CB|TCU|RA|SHRA|DZ|SN|FG|BR|HZ)\b/.test(raw))hints.push(language==='en'?'weather or visibility restrictions possible':'mögliche Wetter-/Sichteinschränkungen');
  if(/\b(BKN|OVC)(00[0-9]|01[0-9]|02[0-9]|03[0-9])\b/.test(raw))hints.push(language==='en'?'low closed cloud layer possible':'tiefe geschlossene Wolken möglich');
  if(/\b(VRB|\d{3})(1[5-9]|[2-9]\d)(G\d{2})?KT\b/.test(raw))hints.push(language==='en'?'stronger wind possible':'stärkerer Wind möglich');
  if(/\bCAVOK\b/.test(raw)&&!hints.length)return language==='en'?'CAVOK forecast, no notable TAF restrictions apparent':'CAVOK-Prognose, keine auffälligen Einschränkungen aus TAF erkennbar';
  return hints.length?hints.join(' · '):(language==='en'?'No notable TAF restrictions apparent':'Keine auffälligen Einschränkungen aus TAF erkennbar');
}

function flightCategoryFromMetar(metar){
  const raw=safeRawText(metar?.rawOb||metar?.raw_text||metar?.raw||metar?.text).toUpperCase();
  const cat=String(metar?.fltCat||metar?.flightCategory||'').toUpperCase();
  if(['VFR','MVFR','IFR','LIFR'].includes(cat))return cat;
  if(/\bCAVOK\b/.test(raw))return 'VFR';
  if(/\b(FG|TS|CB|OVC00[0-9]|BKN00[0-9])\b/.test(raw))return 'IFR';
  if(/\b(BKN|OVC|BR|HZ|RA|SHRA|SN)\b/.test(raw))return 'MVFR';
  return raw?'VFR':'UNKNOWN';
}
function flightCategoryClass(category){return `flight-category-${String(category||'UNKNOWN').toLowerCase()}`}
function renderFlightStationMap(loc,stations,metars,tafs){
  const label=(de,en)=>language==='en'?en:de;
  const bounds={minLat:47.0,maxLat:55.2,minLon:5.5,maxLon:15.4};
  const xFor=lon=>clamp((Number(lon)-bounds.minLon)/(bounds.maxLon-bounds.minLon)*100,3,97);
  const yFor=lat=>clamp((bounds.maxLat-Number(lat))/(bounds.maxLat-bounds.minLat)*100,3,97);
  const outline='51,96 45,88 35,88 31,80 22,73 18,63 11,56 12,45 18,37 17,29 26,18 38,11 49,6 61,8 70,16 75,27 84,35 88,49 84,64 79,75 70,83 65,94';
  const markers=stations.map(st=>{
    const metar=metars.get(st.id)||{}, taf=tafs.get(st.id)||{};
    const category=flightCategoryFromMetar(metar), rawMetar=safeRawText(metar.rawOb||metar.raw_text||metar.rawMETAR||metar.raw);
    const title=[aviationStationLabel(st,loc), category, rawMetar, tafAstroHint(taf)].filter(Boolean).join(' · ');
    return `<div class="flight-station-marker ${flightCategoryClass(category)}" style="left:${xFor(st.lon)}%;top:${yFor(st.lat)}%" title="${esc(title)}"><span>${esc(st.id)}</span></div>`;
  }).join('');
  const site=(loc&&Number.isFinite(Number(loc.latitude))&&Number.isFinite(Number(loc.longitude)))?`<div class="flight-site-marker" style="left:${xFor(loc.longitude)}%;top:${yFor(loc.latitude)}%" title="${esc(loc.name||label('Planungsstandort','Planning location'))}"><span>★</span></div>`:'';
  return `<div class="flight-station-map-wrap">
    <div class="flight-station-map-header"><strong>${label('Integrierte Stationskarte','Integrated station map')}</strong><span class="small muted">${label('Schematische Übersicht der ausgewählten Stationen. Markerfarbe nach METAR-Flugkategorie.','Schematic overview of selected stations. Marker color follows the METAR flight category.')}</span></div>
    <div class="flight-station-map" role="img" aria-label="${label('Flugwetter-Stationskarte','Aviation weather station map')}">
      <svg class="flight-germany-outline" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><polyline points="${outline}" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round" opacity=".45"/></svg>
      <div class="flight-map-label flight-map-label-north">N</div><div class="flight-map-label flight-map-label-south">S</div><div class="flight-map-label flight-map-label-west">W</div><div class="flight-map-label flight-map-label-east">${label('O','E')}</div>
      ${markers}${site}
    </div>
    <div class="flight-station-legend"><span><i class="flight-category-vfr"></i>VFR / unauffällig</span><span><i class="flight-category-mvfr"></i>MVFR / prüfen</span><span><i class="flight-category-ifr"></i>IFR/LIFR / kritisch</span><span><i class="flight-category-unknown"></i>${label('noch nicht geladen','not loaded yet')}</span><span><i class="flight-site-dot"></i>${label('Planungsstandort','Planning location')}</span></div>
  </div>`;
}
function mosmixRowsForDisplay(data,windowRange){
  const rawRows=Array.isArray(data?.weather)?data.weather:[];
  const parsed=rawRows.map(row=>({...row,time:new Date(row.timestamp||row.time||row.date)})).filter(row=>Number.isFinite(row.time.getTime()));
  if(!parsed.length)return [];
  const start=windowRange?.start instanceof Date?windowRange.start:null, end=windowRange?.end instanceof Date?windowRange.end:null;
  const inWindow=start&&end?parsed.filter(row=>row.time>=start&&row.time<=end):[];
  return (inWindow.length?inWindow:parsed).slice(0,18);
}
function mosmixValue(row,...keys){for(const key of keys){const value=row?.[key];if(Number.isFinite(Number(value)))return Number(value)}return NaN}
function mosmixConditionLabel(row){return String(row?.condition||row?.icon||'').replace(/_/g,' ')||'–'}
function renderMosmix(loc,night,windowRange){
  const label=(de,en)=>language==='en'?en:de;
  const rows=mosmixRowsForDisplay(mosmixData,windowRange);
  const loadedAt=mosmixData?.loadedAt?new Date(mosmixData.loadedAt):null;
  const avg=key=>{const values=rows.map(row=>mosmixValue(row,key)).filter(Number.isFinite);return values.length?values.reduce((a,b)=>a+b,0)/values.length:NaN};
  const summary=rows.length?`<div class="grid four" style="margin-top:12px"><div class="metric"><div class="label">${label('Zeitraum','Window')}</div><div class="value">${esc(fmtTime(rows[0].time,loc.timezone))}–${esc(fmtTime(rows[rows.length-1].time,loc.timezone))}</div></div><div class="metric"><div class="label">${label('Ø Wolken','Avg. clouds')}</div><div class="value ${valueClass(100-avg('cloud_cover'))}">${Number.isFinite(avg('cloud_cover'))?fmt(avg('cloud_cover'))+' %':'–'}</div></div><div class="metric"><div class="label">${label('Ø Wind','Avg. wind')}</div><div class="value">${Number.isFinite(avg('wind_speed'))?fmt(avg('wind_speed'),1)+' km/h':'–'}</div></div><div class="metric"><div class="label">${label('Datenquelle','Source')}</div><div class="value">Bright Sky</div><div class="small muted">DWD</div></div></div>`:'';
  const table=rows.length?`<div class="table-wrap mosmix-table"><table><thead><tr><th>${label('Zeit','Time')}</th><th>${label('Wolken','Clouds')}</th><th>${label('Sicht','Visibility')}</th><th>${label('Temp.','Temp.')}</th><th>${label('Taupunkt','Dew point')}</th><th>${label('Wind','Wind')}</th><th>${label('Böen','Gusts')}</th><th>${label('Niederschlag','Precip.')}</th><th>${label('Zustand','Condition')}</th></tr></thead><tbody>${rows.map(row=>`<tr><td><strong>${esc(fmtTime(row.time,loc.timezone))}</strong></td><td>${Number.isFinite(mosmixValue(row,'cloud_cover'))?fmt(mosmixValue(row,'cloud_cover'))+' %':'–'}</td><td>${Number.isFinite(mosmixValue(row,'visibility'))?fmt(mosmixValue(row,'visibility')/1000,1)+' km':'–'}</td><td>${Number.isFinite(mosmixValue(row,'temperature'))?fmt(mosmixValue(row,'temperature'),1)+' °C':'–'}</td><td>${Number.isFinite(mosmixValue(row,'dew_point'))?fmt(mosmixValue(row,'dew_point'),1)+' °C':'–'}</td><td>${Number.isFinite(mosmixValue(row,'wind_speed'))?fmt(mosmixValue(row,'wind_speed'),1)+' km/h':'–'}</td><td>${Number.isFinite(mosmixValue(row,'wind_gust_speed'))?fmt(mosmixValue(row,'wind_gust_speed'),1)+' km/h':'–'}</td><td>${Number.isFinite(mosmixValue(row,'precipitation'))?fmt(mosmixValue(row,'precipitation'),1)+' mm':'–'}</td><td>${esc(mosmixConditionLabel(row))}</td></tr>`).join('')}</tbody></table></div>`:'';
  return `<details open class="weather-inner-details"><summary><strong>${label('MOSMIX-Punktprognose','MOSMIX point forecast')}</strong></summary>
    <div class="notice" style="margin-top:12px">${label('MOSMIX ergänzt die Modellbewertung als standortnahe DWD-Punktprognose. Die Werte dienen als Kontrollquelle und werden nicht automatisch in die Bewertung eingerechnet.','MOSMIX complements the model score as a DWD point forecast near the planning location. These values are a reference source and are not automatically included in the score.')}</div>
    <div class="data-actions" style="margin-top:10px"><button type="button" id="loadMosmix" ${mosmixLoading?'disabled':''}>${mosmixLoading?label('MOSMIX wird geladen …','Loading MOSMIX ...'):label('MOSMIX-Punktprognose laden','Load MOSMIX point forecast')}</button><span class="small muted">${esc(loc.name||'')} ${loadedAt&&Number.isFinite(loadedAt.getTime())?` · ${label('geladen','loaded')} ${esc(fmtTime(loadedAt,loc.timezone))}`:''}</span></div>
    ${mosmixError?`<div class="notice warn" style="margin-top:10px">${esc(mosmixError)}</div>`:''}
    ${rows.length?summary+table:`<div class="notice subtle" style="margin-top:12px">${label('Noch keine MOSMIX-Daten geladen. Bitte den Button oben verwenden.','No MOSMIX data loaded yet. Use the button above.')}</div>`}
  </details>`;
}
function brightskyMosmixUrl(loc){const key=selectedDateKey||dateKeyFor(new Date(),loc.timezone);const end=addDays(key,2);return `https://api.brightsky.dev/weather?lat=${encodeURIComponent(loc.latitude)}&lon=${encodeURIComponent(loc.longitude)}&date=${encodeURIComponent(key)}&last_date=${encodeURIComponent(end)}&tz=${encodeURIComponent(loc.timezone||'Europe/Berlin')}`;}
function safeRawText(value){return String(value||'').replace(/\s+/g,' ').trim();}

let db;
let profiles=[];
let profile;
let draft;
let catalog=[...BUILTIN_OBJECTS];
let weatherModels=[];
let weatherError='';
let cloudMapData=null;
let cloudMapError='';
let cloudMapLoading=false;
let cloudMapRequestId=0;
let cloudMapAbortController=null;
let cloudMapAnimationTimer=null;
let cloudMapSaveTimer=null;
let cloudBaseMap=null;
let cloudBaseMapSignature='';
let cloudBaseResizeObserver=null;
let importMode='auto';
let locationComparisonData=null;
let locationComparisonLoading=false;
let locationComparisonError='';
let currentComputedObjects=[];
let installPrompt=null;
let currentMainTab='plan';
let currentSettingsTab='equipment';
let currentCentralSubTab='wind';
let currentInfoSubTab='status';
let currentLocationsSubTab='locations';
let currentObjectFilterTab='basis';
let selectedDateKey='';
let weatherSourceTab='meteoblue';
let auroraStatus={level:'none',message:'',details:[],updatedAt:null,windows:[],kpMax:NaN,source:'NOAA/SWPC',dataStatus:'not-loaded',reason:''};
let auroraTimer=null;
let flightWeatherData=null;
let flightWeatherLoading=false;
let flightWeatherError='';
let flightStationMapOpen=false;
let mosmixData=null;
let mosmixLoading=false;
let mosmixError='';
let page=1;
let scrollByTab={plan:0,settings:0};
let dirtySections=new Set();
let openDisplayConfigKey=null;
let swRegistration=null;
let saveFeedbackSections=new Set();
let horizonUndoStack=[];
let horizonObstacleDrawId=null;
let backupInProgress=false;
let backupConfig={enabled:false,afterSave:true,daily:true,keep:10,reminderDays:7,lastSuccessAt:null,lastError:'',lastDailyDate:null,targetName:'',permission:'none'};
let backupDraft=deepClone(backupConfig);
let storageInfo={persistent:null,usage:null,quota:null,fileSystemSupported:typeof window.showDirectoryPicker==='function',handleAvailable:false,permission:'none'};
let objectFilterTimer=null;
let locationSearchResults=[];
let locationSearchQuery='';
let locationSearchLoading=false;
let locationSearchError='';
let showAddLocationDialog=false;
let pendingLocationDraft=null;


function openDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,DB_VERSION);req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains('profiles'))d.createObjectStore('profiles',{keyPath:'id'});if(!d.objectStoreNames.contains('meta'))d.createObjectStore('meta',{keyPath:'key'});if(!d.objectStoreNames.contains('cache'))d.createObjectStore('cache',{keyPath:'key'});if(!d.objectStoreNames.contains('objectOutlines'))d.createObjectStore('objectOutlines',{keyPath:'key'});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
function idb(store,mode='readonly'){return db.transaction(store,mode).objectStore(store)}
function idbGet(store,key){return new Promise((resolve,reject)=>{const r=idb(store).get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
function idbAll(store){return new Promise((resolve,reject)=>{const r=idb(store).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
function idbPut(store,value){return new Promise((resolve,reject)=>{const r=idb(store,'readwrite').put(value);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
function idbDelete(store,key){return new Promise((resolve,reject)=>{const r=idb(store,'readwrite').delete(key);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
async function metaValue(key,fallback=null){const entry=await idbGet('meta',key);return entry?.value??fallback}
async function setMetaValue(key,value){await idbPut('meta',{key,value})}
function formatBytes(value){if(!Number.isFinite(value))return'–';const units=['B','KB','MB','GB'];let number=value,index=0;while(number>=1024&&index<units.length-1){number/=1024;index++}return`${number.toFixed(index?1:0)} ${units[index]}`}
function backupFileStamp(date=new Date()){return date.toISOString().replace(/[:.]/g,'-').slice(0,19)}
async function buildBackupPayload(){return{kind:'astro-night-planner-backup',appVersion:APP_VERSION,environment:ENV,exportedAt:new Date().toISOString(),profiles:await idbAll('profiles'),activeProfileId:profile?.id||null,backupSchemaVersion:3,backupSettings:{afterSave:Boolean(backupConfig.afterSave),daily:Boolean(backupConfig.daily),keep:Number(backupConfig.keep)||10,reminderDays:Number(backupConfig.reminderDays)||7},objectOutlines:await idbAll('objectOutlines')}}
async function getBackupDirectoryHandle(){return metaValue('backupDirectoryHandle',null)}
async function fileHandlePermission(handle,{request=false}={}){
  if(!handle)return'none';
  try{
    let permission=await handle.queryPermission?.({mode:'readwrite'})||'prompt';
    if(permission!=='granted'&&request&&handle.requestPermission)permission=await handle.requestPermission({mode:'readwrite'});
    return permission;
  }catch{return'denied'}
}
async function refreshStorageInfo(){
  storageInfo.fileSystemSupported=typeof window.showDirectoryPicker==='function';
  try{storageInfo.persistent=await navigator.storage?.persisted?.()??null}catch{storageInfo.persistent=null}
  try{const estimate=await navigator.storage?.estimate?.();storageInfo.usage=estimate?.usage??null;storageInfo.quota=estimate?.quota??null}catch{storageInfo.usage=null;storageInfo.quota=null}
  const handle=await getBackupDirectoryHandle();
  storageInfo.handleAvailable=Boolean(handle);
  storageInfo.permission=await fileHandlePermission(handle);
  if(handle?.name&&!backupConfig.targetName)backupConfig.targetName=handle.name;
}
async function saveBackupConfig(){await setMetaValue('backupConfig',deepClone(backupConfig))}
async function writeJsonFile(directoryHandle,name,data){
  const fileHandle=await directoryHandle.getFileHandle(name,{create:true});
  const writable=await fileHandle.createWritable();
  await writable.write(JSON.stringify(data,null,2));
  await writable.close();
}
async function rotateBackupFiles(directoryHandle,keep){
  if(!directoryHandle?.entries||keep<1)return;
  const names=[];
  for await(const [name,entry]of directoryHandle.entries()){
    if(entry.kind==='file'&&/^astro-night-planner-\d{4}-\d{2}-\d{2}T/.test(name)&&name.endsWith('.json'))names.push(name);
  }
  names.sort().reverse();
  for(const name of names.slice(keep))await directoryHandle.removeEntry(name).catch(()=>{});
}
async function performExternalBackup({requestPermission=false,forceDated=false,manualFallback=false}={}){
  if(backupInProgress)return false;
  backupInProgress=true;
  try{
    const payload=await buildBackupPayload();
    const handle=await getBackupDirectoryHandle();
    if(!handle){
      if(manualFallback){downloadJson(`astro-night-planner-sicherung-${new Date().toISOString().slice(0,10)}.json`,payload);return true}
      throw new Error('Kein externer Sicherungsordner ausgewählt.');
    }
    const permission=await fileHandlePermission(handle,{request:requestPermission});
    storageInfo.permission=permission;
    if(permission!=='granted')throw new Error(permission==='denied'?'Der Zugriff auf den Sicherungsordner wurde verweigert.':'Der Sicherungsordner muss erneut freigegeben werden.');
    const now=new Date(),today=now.toISOString().slice(0,10);
    await writeJsonFile(handle,'astro-night-planner-aktuell.json',payload);
    if(forceDated||backupConfig.daily&&backupConfig.lastDailyDate!==today){
      await writeJsonFile(handle,`astro-night-planner-${backupFileStamp(now)}.json`,payload);
      backupConfig.lastDailyDate=today;
      await rotateBackupFiles(handle,clamp(Number(backupConfig.keep)||10,1,50));
    }
    backupConfig.lastSuccessAt=now.toISOString();backupConfig.lastError='';backupConfig.targetName=handle.name||backupConfig.targetName;backupConfig.permission='granted';
    await saveBackupConfig();backupDraft=deepClone(backupConfig);await refreshStorageInfo();
    return true;
  }catch(error){
    backupConfig.lastError=error?.message||String(error);backupConfig.permission=storageInfo.permission||'none';
    await saveBackupConfig().catch(()=>{});backupDraft=deepClone(backupConfig);
    return false;
  }finally{backupInProgress=false}
}
async function maybeAutomaticBackup(reason='daily'){
  if(!backupConfig.enabled)return false;
  const now=Date.now();
  const dailyDue=!backupConfig.lastSuccessAt||now-new Date(backupConfig.lastSuccessAt).getTime()>=24*3600000;
  if(reason==='settings'&&backupConfig.afterSave)return performExternalBackup();
  if(reason==='daily'&&backupConfig.daily&&dailyDue)return performExternalBackup();
  return false;
}
function backupAgeText(){
  if(!backupConfig.lastSuccessAt)return'Noch keine Sicherung erstellt';
  return new Intl.DateTimeFormat('de-DE',{dateStyle:'medium',timeStyle:'short'}).format(new Date(backupConfig.lastSuccessAt));
}
async function saveProfile(p=profile){p.updatedAt=new Date().toISOString();await idbPut('profiles',deepClone(p));profiles=await idbAll('profiles');updateProfileSelectors();}
async function setActiveProfile(id){await idbPut('meta',{key:'activeProfileId',value:id});}

function normalizeProfile(p){
  const base=standardProfile();
  const out={...base,...p};
  out.equipment={...base.equipment,...(p.equipment||{})};
  out.equipment.telescopes=Array.isArray(p.equipment?.telescopes)&&p.equipment.telescopes.length?p.equipment.telescopes:base.equipment.telescopes;
  out.equipment.cameras=Array.isArray(p.equipment?.cameras)&&p.equipment.cameras.length?p.equipment.cameras:base.equipment.cameras;
  out.equipment.mounts=Array.isArray(p.equipment?.mounts)&&p.equipment.mounts.length?p.equipment.mounts:base.equipment.mounts;
  out.equipment.setups=Array.isArray(p.equipment?.setups)&&p.equipment.setups.length?p.equipment.setups:base.equipment.setups;
  out.equipment.opticalAccessories=Array.isArray(p.equipment?.opticalAccessories)?p.equipment.opticalAccessories:base.equipment.opticalAccessories;
  updateCalculatedEquipmentValues(out.equipment);
  out.equipment.setups=out.equipment.setups.map((setup,index)=>({id:setup.id||`setup-${index}`,name:String(setup.name||'Setup'),telescopeId:setup.telescopeId||out.equipment.telescopes[0]?.id||'',cameraId:setup.cameraId||out.equipment.cameras[0]?.id||'',mountId:setup.mountId||out.equipment.mounts[0]?.id||''}));
  if(!out.equipment.setups.length)out.equipment.setups=[{id:'setup-auto',name:`${out.equipment.telescopes[0]?.name||'Teleskop'} + ${out.equipment.cameras[0]?.name||'Kamera'}`,telescopeId:out.equipment.telescopes[0]?.id||'',cameraId:out.equipment.cameras[0]?.id||'',mountId:out.equipment.mounts[0]?.id||''}];
  out.equipment.setups=out.equipment.setups.map(setup=>({ ...setup,
    telescopeId:out.equipment.telescopes.some(item=>item.id===setup.telescopeId)?setup.telescopeId:(out.equipment.selectedTelescopeId||out.equipment.telescopes[0]?.id||''),
    cameraId:out.equipment.cameras.some(item=>item.id===setup.cameraId)?setup.cameraId:(out.equipment.selectedCameraId||out.equipment.cameras[0]?.id||''),
    mountId:out.equipment.mounts.some(item=>item.id===setup.mountId)?setup.mountId:(out.equipment.selectedMountId||out.equipment.mounts[0]?.id||''),
    opticalAccessoryId:setup.opticalAccessoryId&&opticalAccessoriesFor(out.equipment).some(item=>item.id===setup.opticalAccessoryId)?setup.opticalAccessoryId:OPTICAL_ACCESSORY_NONE_ID,
    opticalFactor:Number(setup.opticalFactor)||opticalFactorForSetup(setup,out.equipment)||1
  }));
  if(!out.equipment.selectedSetupId||!out.equipment.setups.some(item=>item.id===out.equipment.selectedSetupId))out.equipment.selectedSetupId=out.equipment.setups[0]?.id||'';
  if(!out.equipment.selectedTelescopeId||!out.equipment.telescopes.some(item=>item.id===out.equipment.selectedTelescopeId))out.equipment.selectedTelescopeId=out.equipment.telescopes[0]?.id||'';
  if(!out.equipment.selectedCameraId||!out.equipment.cameras.some(item=>item.id===out.equipment.selectedCameraId))out.equipment.selectedCameraId=out.equipment.cameras[0]?.id||'';
  if(!out.equipment.selectedMountId||!out.equipment.mounts.some(item=>item.id===out.equipment.selectedMountId))out.equipment.selectedMountId=out.equipment.mounts[0]?.id||'';
  out.central={...base.central,...(p.central||{})};
  out.central.windProfiles={...deepClone(WIND_PROFILES),...(p.central?.windProfiles||{})};
  out.central.dew={...base.central.dew,...(p.central?.dew||{})};
  out.central.jet={...base.central.jet,...(p.central?.jet||{})};
  out.central.framing={...base.central.framing,...(p.central?.framing||{})};
  out.central.weatherModels={...base.central.weatherModels,...(p.central?.weatherModels||{}),weights:{...base.central.weatherModels.weights,...(p.central?.weatherModels?.weights||{})}};
  if(Number(out.central.weatherModels.weights?.icon)===40&&Number(out.central.weatherModels.weights?.ecmwf)===40&&Number(out.central.weatherModels.weights?.gfs)===20){out.central.weatherModels.weights={icon:40,ecmwf:20,gfs:40};}
  out.central.cloudMap={...base.central.cloudMap,...(p.central?.cloudMap||{}),weatherOverlays:{...base.central.cloudMap.weatherOverlays,...(p.central?.cloudMap?.weatherOverlays||{})}};
  out.central.weights={...base.central.weights,...(p.central?.weights||{})};
  out.central.qualityThresholds={...base.central.qualityThresholds,...(p.central?.qualityThresholds||{})};
  out.central.aladinLabels={...base.central.aladinLabels,...(p.central?.aladinLabels||{})};
  out.central.aladinInfo={...base.central.aladinInfo,...(p.central?.aladinInfo||{})};
  out.central.weatherSources={...base.central.weatherSources,...(p.central?.weatherSources||{})};
  out.central.multiNightWeather={...base.central.multiNightWeather,...(p.central?.multiNightWeather||{})};
  out.central.multiNightWeather.extraNights=clamp(Math.round(Number(out.central.multiNightWeather.extraNights)||3),0,7);
  out.central.aurora={...base.central.aurora,...(p.central?.aurora||{})};
  out.central.aurora.autoRefreshMinutes=clamp(Math.round(Number(out.central.aurora.autoRefreshMinutes)||0),0,720);
  out.central.aurora.yellowKp=Number.isFinite(Number(out.central.aurora.yellowKp))?Number(out.central.aurora.yellowKp):5.7;
  out.central.aurora.orangeKp=Number.isFinite(Number(out.central.aurora.orangeKp))?Number(out.central.aurora.orangeKp):6.7;
  out.central.aurora.redKp=Number.isFinite(Number(out.central.aurora.redKp))?Number(out.central.aurora.redKp):7.3;
  if(!['yellow','orange','red'].includes(out.central.aurora.notifyLevel))out.central.aurora.notifyLevel='orange';
  out.central.miniHorizon={...base.central.miniHorizon,...(p.central?.miniHorizon||{})};
  out.central.aladinSurveys=normalizeAladinSurveys(p.central?.aladinSurveys||base.central.aladinSurveys);
  out.central.externalAladin={...base.central.externalAladin,...(p.central?.externalAladin||{})};
  if(!['standard','south','west','north','east'].includes(out.central.externalAladin.orientation))out.central.externalAladin.orientation='standard';
  if(typeof out.central.externalAladin.ground==='boolean'&&!out.central.externalAladin.groundMode)out.central.externalAladin.groundMode=out.central.externalAladin.ground?'standard':'none';
  out.central.externalAladin.groundMode=['none','standard','personal'].includes(out.central.externalAladin.groundMode)?out.central.externalAladin.groundMode:'standard';
  out.central.externalAladin.groundOpacity=clamp(Number(out.central.externalAladin.groundOpacity??50),0,100);
  out.central.externalAladin.altAzGridLineWidth=clamp(Number(out.central.externalAladin.altAzGridLineWidth??0.8),0.5,3);
  out.central.externalAladin.altAzGridStep=['auto','10','5','2','1'].includes(String(out.central.externalAladin.altAzGridStep||'auto'))?String(out.central.externalAladin.altAzGridStep||'auto'):'auto';
  const gridColor=String(out.central.externalAladin.altAzGridColor||'#1f6f52').trim();
  out.central.externalAladin.altAzGridColor=/^#[0-9a-fA-F]{6}$/.test(gridColor)?gridColor:'#1f6f52';
  out.central.filterDefaults={...base.central.filterDefaults,...(p.central?.filterDefaults||{})};
  out.central.filterDefaults.selectedFilters=Array.isArray(out.central.filterDefaults.selectedFilters)?out.central.filterDefaults.selectedFilters.filter(x=>FILTER_KEYS.includes(x)):DEFAULT_SELECTED_FILTERS.slice();
  out.central.filterDefaults.framingFilter=Array.isArray(out.central.filterDefaults.framingFilter)?out.central.filterDefaults.framingFilter.filter(x=>['good','near-edge','too-large','unknown'].includes(x)):['good','near-edge','too-large','unknown'];
  out.central.sizeProfiles=Array.isArray(p.central?.sizeProfiles)&&p.central.sizeProfiles.length?p.central.sizeProfiles.map(x=>({...x,id:x.id||`size-${Date.now()}`,name:String(x.name||'Größenprofil'),minDeg:Number(x.minDeg)||0,minMin:clamp(Number(x.minMin)||0,0,59),maxDeg:Number(x.maxDeg)||0,maxMin:clamp(Number(x.maxMin)||0,0,59),excludeNoSize:Boolean(x.excludeNoSize)})):defaultSizeProfiles();
  if(!out.central.sizeProfiles.some(x=>x.id===out.central.activeSizeProfileId))out.central.activeSizeProfileId=out.central.sizeProfiles[0].id;
  out.central.objectTypeProfiles=Array.isArray(p.central?.objectTypeProfiles)&&p.central.objectTypeProfiles.length?p.central.objectTypeProfiles.map(x=>({...x,id:x.id||`types-${Date.now()}`,name:String(x.name||'Objekttyp-Profil'),types:Array.isArray(x.types)?x.types:[]})):defaultObjectTypeProfiles();
  if(!out.central.objectTypeProfiles.some(x=>x.id===out.central.activeObjectTypeProfileId))out.central.activeObjectTypeProfileId=out.central.objectTypeProfiles[0].id;
  out.central.locationSearchCountry=p.central?.locationSearchCountry??base.central.locationSearchCountry;
  out.central.listDisplay={...base.central.listDisplay,...(p.central?.listDisplay||{})};
  out.central.listDisplay.profiles={...deepClone(DISPLAY_PROFILES),...(p.central?.listDisplay?.profiles||{})};
  for(const value of Object.values(out.central.listDisplay.profiles)){
    value.columns=(Array.isArray(value.columns)?value.columns:[]).map(id=>id==='bestTime'?'bestHour':id).filter(id=>DISPLAY_COLUMN_IDS.includes(id));
    if(value.name==='Detailliert'&&!value.columns.includes('visibleHorizonAndMin'))value.columns.push('visibleHorizonAndMin');
    if(!value.columns.includes('name'))value.columns.unshift('name');
    if(!value.columns.includes('wikipedia'))value.columns.push('wikipedia');
    const legacyOrder=(Array.isArray(value.columnOrder)?value.columnOrder:value.columns).map(id=>id==='bestTime'?'bestHour':id).filter(id=>DISPLAY_COLUMN_IDS.includes(id));
    value.columnOrder=[...new Set([...legacyOrder,...DISPLAY_COLUMN_IDS])];
  }
  out.central.detailPanels={...base.central.detailPanels,...(p.central?.detailPanels||{})};
  out.central.collapsed={...base.central.collapsed,...(p.central?.collapsed||{})};
  out.central.visibleSections={...base.central.visibleSections,...(p.central?.visibleSections||{})};
  out.locations=(p.locations?.length?p.locations:base.locations).map((x,locationIndex)=>{
    const legacyValues=Array.isArray(x.horizonProfile)&&x.horizonProfile.length?resampleHorizonProfile(x.horizonProfile):horizonFromCardinals(x.horizon);
    let profiles=Array.isArray(x.horizonProfiles)&&x.horizonProfiles.length?x.horizonProfiles.map((entry,index)=>{
      const values=Array.isArray(entry.horizonProfile)&&entry.horizonProfile.length?resampleHorizonProfile(entry.horizonProfile):legacyValues.slice();
      return{id:entry.id||`horizon-${locationIndex}-${index}`,name:String(entry.name||`Horizont ${index+1}`),horizonProfile:values,obstacles:(entry.obstacles||[]).map(item=>({...item}))};
    }):[{id:x.defaultHorizonProfileId||`horizon-${locationIndex}-standard`,name:'Standardhorizont',horizonProfile:legacyValues.slice(),obstacles:(x.obstacles||[]).map(item=>({...item}))}];
    const defaultId=profiles.some(item=>item.id===x.defaultHorizonProfileId)?x.defaultHorizonProfileId:profiles[0].id;
    const selectedId=profiles.some(item=>item.id===x.selectedHorizonProfileId)?x.selectedHorizonProfileId:defaultId;
    const selected=profiles.find(item=>item.id===selectedId)||profiles[0];
    return{...x,horizonProfiles:profiles,defaultHorizonProfileId:defaultId,selectedHorizonProfileId:selectedId,horizonProfile:selected.horizonProfile.slice(),horizon:Array.from({length:8},(_,index)=>Number(selected.horizonProfile[horizonCardinalIndex(index)]||0)),obstacles:selected.obstacles.map(item=>({...item}))};
  });
  out.planning={...base.planning,...(p.planning||{})};
  if(!['meteoblue','clearoutside','windy','ventusky'].includes(out.planning.weatherSourceTab))out.planning.weatherSourceTab='meteoblue';
  out.planning.search=String(out.planning.search||'');
  out.planning.directSearch=String(out.planning.directSearch||'');
  const defaultSize=out.central.sizeProfiles.find(x=>x.id===(out.planning.sizeProfileId||out.central.activeSizeProfileId))||out.central.sizeProfiles[0];
  if(!Number.isFinite(Number(out.planning.minSize)))out.planning.minSize=degMinToArcMin(defaultSize.minDeg,defaultSize.minMin);
  if(!Number.isFinite(Number(out.planning.maxSize)))out.planning.maxSize=degMinToArcMin(defaultSize.maxDeg,defaultSize.maxMin);
  out.planning.excludeNoSize=Boolean(out.planning.excludeNoSize);
  out.planning.minScore=Number.isFinite(Number(out.planning.minScore))?Number(out.planning.minScore):Number(out.central.filterDefaults.minScore)||0;
  out.planning.visibilityBasis=['current','nautical','astronomicalNight','sunset'].includes(out.planning.visibilityBasis)?out.planning.visibilityBasis:(out.central.filterDefaults.visibilityBasis||'nautical');
  out.planning.selectedFilters=Array.isArray(out.planning.selectedFilters)?out.planning.selectedFilters.filter(x=>FILTER_KEYS.includes(x)):DEFAULT_SELECTED_FILTERS.slice();
  if(!out.planning.selectedFilters.length)out.planning.selectedFilters=DEFAULT_SELECTED_FILTERS.slice();
  out.planning.framingFilter=Array.isArray(out.planning.framingFilter)?out.planning.framingFilter.filter(x=>['good','near-edge','too-large','unknown'].includes(x)):['good','near-edge','too-large','unknown'];
  if(!out.planning.framingFilter.length)out.planning.framingFilter=['good','near-edge','too-large','unknown'];
  out.planning.surfaceBrightnessMax=Number.isFinite(Number(out.planning.surfaceBrightnessMax))?Number(out.planning.surfaceBrightnessMax):Number(out.central.filterDefaults.surfaceBrightnessMax)||99;
  out.planning.showNoSurfaceBrightness=out.planning.showNoSurfaceBrightness!==false;
  if(!out.central.objectTypeProfiles.some(x=>x.id===out.planning.objectTypeProfileId))out.planning.objectTypeProfileId='types-all';
  if(Array.isArray(out.planning.catalogs)&&out.planning.catalogs.includes('LDN/LBN')){out.planning.catalogs=[...new Set(out.planning.catalogs.flatMap(c=>c==='LDN/LBN'?['LDN','LBN']:c))];}
  out.targets=Array.isArray(p.targets)?p.targets.map(x=>({...x,objectId:String(x.objectId||x.id||''),id:x.id||`target-${String(x.objectId||x.id||'').replace(/\W/g,'-')}`,note:x.note||'',priority:x.priority||'normal',status:x.status||'Wunschziel',referenceLinks:Array.isArray(x.referenceLinks)?x.referenceLinks:[]})).filter(x=>x.objectId):[];
  out.targetFilters={search:String(p.targetFilters?.search||''),status:p.targetFilters?.status||'all',priority:p.targetFilters?.priority||'all',type:p.targetFilters?.type||'all',filter:p.targetFilters?.filter||'all',month:p.targetFilters?.month||'all'};
  if(Number(p.schemaVersion||0)<6){
    const selected=BUILTIN_OBJECTS.find(item=>item.id===out.planning.selectedObjectId);
    out.planning.objectRotation=normalizedAngle180((Number(selected?.positionAngleDeg)||0)+(Number(out.planning.objectRotation)||0));
  }
  out.schemaVersion=8;
  if(out.planning.locationId&&!out.locations.some(item=>item.id===out.planning.locationId))out.planning.locationId=null;
  if(out.planning.temporaryTelescopeId&&!out.equipment.telescopes.some(item=>item.id===out.planning.temporaryTelescopeId))out.planning.temporaryTelescopeId=null;
  if(out.planning.temporarySetupId&&!out.equipment.setups.some(item=>item.id===out.planning.temporarySetupId))out.planning.temporarySetupId=null;
  out.planning.comparisonSetupIds=Array.isArray(out.planning.comparisonSetupIds)?out.planning.comparisonSetupIds.filter(id=>out.equipment.setups.some(item=>item.id===id)).slice(0,3):[];
  if(out.planning.temporaryCameraId&&!out.equipment.cameras.some(item=>item.id===out.planning.temporaryCameraId))out.planning.temporaryCameraId=null;
  out.ui={...base.ui,...(p.ui||{})};
  out.schemaVersion=base.schemaVersion;
  return out;
}

async function init(){
  document.documentElement.dataset.environment=ENV;
  document.body.classList.toggle('env-test',ENV==='test');
  document.body.classList.toggle('env-prod',ENV==='prod');
  document.title=BUILD.documentTitle || `Astro Night Planner ${RELEASE}`;
  updateStaticLanguageUi();
  const headerVersion=document.getElementById('headerVersion');
  if(headerVersion)headerVersion.textContent=RELEASE;
  const headerEnvironment=document.getElementById('headerEnvironmentText');
  if(headerEnvironment){headerEnvironment.hidden=ENV==='prod';headerEnvironment.textContent=ENV==='test'?' · TESTVERSION':'';}
  const badge=document.getElementById('environmentBadge');
  badge.hidden=ENV==='prod';
  if(ENV==='test')badge.textContent=BUILD.badgeText || 'TESTVERSION';
  db=await openDb(); profiles=(await idbAll('profiles')).map(normalizeProfile);
  if(!profiles.length){const p=standardProfile();await idbPut('profiles',p);profiles=[p];}
  const storedBackupConfig=await metaValue('backupConfig',null);
  backupConfig={...backupConfig,...(storedBackupConfig||{})};backupDraft=deepClone(backupConfig);
  const active=await idbGet('meta','activeProfileId'); profile=profiles.find(x=>x.id===active?.value)||profiles.find(x=>x.id==='standard')||profiles[0];
  await setActiveProfile(profile.id); draft=deepClone(profile); currentMainTab=profile.ui?.mainTab||'plan'; currentSettingsTab=profile.ui?.settingsTab||'equipment';
  selectedDateKey=dateKeyFor(new Date(),activeLocation()?.timezone||'Europe/Berlin'); profile.planning.dateKey=selectedDateKey; draft.planning.dateKey=selectedDateKey; page=profile.planning.page||1;
  await refreshStorageInfo();
  updateProfileSelectors(); bindGlobal(); render(); registerPwa(); loadCatalog(); fetchWeather(); fetchAuroraStatus(); setupAuroraAutoRefresh();
  window.setTimeout(()=>maybeAutomaticBackup('daily'),1200);
}


function releaseNotesListHtml(lang=language){
  const notes=Array.isArray(RELEASE_NOTES?.[lang])?RELEASE_NOTES[lang]:(Array.isArray(DEFAULT_RELEASE_NOTES[lang])?DEFAULT_RELEASE_NOTES[lang]:[]);
  if(!notes.length)return '';
  return `<ul>${notes.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;
}
function versionNotesHtml(lang=language){
  const overview=VERSION_HISTORY?.[lang]||VERSION_HISTORY?.de||DEFAULT_VERSION_HISTORY.de;
  const title=lang==='en'?'Version overview':'Neuerungsübersicht';
  const intro=lang==='en'?'The latest changes are shown first; older version steps follow below.':'Die Neuerungen der aktuellen Version stehen oben; ältere Versionsschritte folgen darunter.';
  const preferred=['version131','version130','version120','version110'];
  const keys=[...preferred.filter(key=>overview?.[key]),...Object.keys(overview||{}).filter(key=>!preferred.includes(key))];
  const groups=keys.map(key=>{
    const group=overview?.[key];
    if(!group||!Array.isArray(group.items))return '';
    return `<h4>${esc(group.title||key)}</h4><ul>${group.items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;
  }).join('');
  return `<h3>${title}</h3><p>${esc(intro)}</p>${groups}`;
}
async function loadOnlineVersionInfo(){
  try{
    const response=await fetch(`./VERSION.json?update=${Date.now()}`,{cache:'no-store'});
    if(!response.ok)return null;
    return await response.json();
  }catch(error){return null}
}
function notesFromVersionInfo(info,lang=language){
  const changes=info?.changes?.[lang]||info?.changes?.de||info?.changes?.en||info?.releaseNotes?.[lang]||info?.releaseNotes?.de||info?.releaseNotes?.en;
  if(Array.isArray(changes)&&changes.length)return changes;
  if(typeof info?.notes==='string'&&info.notes.trim())return [info.notes.trim()];
  return [];
}
async function showUpdateBanner(){
  const banner=document.getElementById('updateBanner'),text=document.getElementById('updateBannerText');
  if(!banner)return;
  if(text){
    let message=tx('updateAvailable');
    const info=await loadOnlineVersionInfo();
    const notes=notesFromVersionInfo(info,language);
    if(info?.version&&info.version!==APP_VERSION){
      message=language==='en'?`A new app version ${info.version} is available. Install it now?`:`Eine neue App-Version ${info.version} ist verfügbar. Möchtest du sie installieren?`;
    }
    if(notes.length){
      const lead=language==='en'?'What\'s new':'Neu';
      message+=` ${lead}: ${notes.slice(0,2).join(' · ')}`;
    }
    text.textContent=message;
  }
  banner.hidden=false;
}

async function clearAnpCachesForEnvironment(){
  if(!('caches' in window))return;
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith(`astro-night-planner-${ENV}-`)).map(key=>caches.delete(key)));
}
async function activateWaitingServiceWorker(){
  if(!('serviceWorker' in navigator))return false;
  const registration=swRegistration||await navigator.serviceWorker.getRegistration();
  if(!registration)return false;
  await registration.update().catch(()=>{});
  const worker=registration.waiting||registration.installing;
  if(!worker)return false;
  return await new Promise(resolve=>{
    let done=false;
    const finish=value=>{if(done)return;done=true;resolve(value)};
    const timeout=setTimeout(()=>finish(false),3500);
    navigator.serviceWorker.addEventListener('controllerchange',()=>{clearTimeout(timeout);finish(true)},{once:true});
    try{worker.postMessage({type:'SKIP_WAITING'});}catch(error){clearTimeout(timeout);finish(false)}
  });
}
function cacheBustingReload(){
  const url=new URL(location.href);
  url.searchParams.set('anpUpdate',Date.now().toString());
  location.replace(url.toString());
}
async function applyAppUpdateNow(){
  const button=document.getElementById('reloadForUpdate');
  if(button){button.disabled=true;button.textContent=language==='en'?'Updating ...':'Aktualisiere ...'}
  try{
    await activateWaitingServiceWorker();
    await clearAnpCachesForEnvironment();
  }catch(error){console.warn('Update-Aktualisierung nicht vollständig möglich',error)}
  cacheBustingReload();
}
async function installUpdateWithOptionalBackup(){
  const ask=confirm(language==='en'?'Create a backup before installing the update?':'Vor der Installation des Updates eine Datensicherung erstellen?');
  if(!ask){await applyAppUpdateNow();return}
  try{
    const handle=await getBackupDirectoryHandle();
    if(handle){
      const ok=await performExternalBackup({forceDated:true,requestPermission:true,manualFallback:true});
      if(ok){await applyAppUpdateNow();return}
      if(confirm(language==='en'?'The backup could not be created. Continue without backup?':'Die Sicherung konnte nicht erstellt werden. Ohne Sicherung fortfahren?'))await applyAppUpdateNow();
      return;
    }
    const manual=confirm(language==='en'?'No backup folder is configured. Download a manual backup file now?':'Es ist noch kein Sicherungsordner eingerichtet. Jetzt eine manuelle Sicherungsdatei herunterladen?');
    if(manual){
      downloadJson(`astro-night-planner-update-backup-${new Date().toISOString().slice(0,10)}.json`,await buildBackupPayload());
      if(confirm(language==='en'?'Install the update now?':'Update jetzt installieren?'))await applyAppUpdateNow();
      return;
    }
    if(confirm(language==='en'?'Continue without backup?':'Ohne Sicherung fortfahren?'))await applyAppUpdateNow();
  }catch(error){
    if(confirm((language==='en'?'Backup failed: ':'Sicherung fehlgeschlagen: ')+(error?.message||error)+(language==='en'?' Continue without backup?':' Ohne Sicherung fortfahren?')))await applyAppUpdateNow();
  }
}

function legalPageContent(page){
  const publicUrl=location.href.split('#')[0].split('?')[0];
  if(language==='en'){
    const pages={
      impressum:{title:'Legal notice',html:`<p><strong>Provider information</strong></p><p>Andreas Cordt<br>Schwarzwaldstraße 15<br>70794 Filderstadt<br>Germany</p><p>Email: <a href="mailto:andreas@deepskyastrophoto.de">andreas@deepskyastrophoto.de</a><br>Homepage: <a href="https://www.deepskyastrophoto.de" target="_blank" rel="noopener noreferrer">www.deepskyastrophoto.de</a></p><p>The Astro Night Planner is provided privately under the name of Andreas Cordt.</p>`},
      datenschutz:{title:'Privacy',html:`<p><strong>Controller</strong><br>Andreas Cordt, Schwarzwaldstraße 15, 70794 Filderstadt, Germany<br><a href="mailto:andreas@deepskyastrophoto.de">andreas@deepskyastrophoto.de</a></p><p><strong>Local data storage</strong><br>Profiles, equipment, locations, horizon profiles and settings are stored locally in the browser using IndexedDB. PWA files are stored separately in Cache Storage. The application does not provide user accounts, contact forms or central synchronization.</p><p><strong>No built-in analytics</strong><br>The provider does not integrate visitor statistics, tracking or error analytics in the app.</p><p><strong>Hosting and external services</strong><br>The app is hosted via GitHub Pages. When the app is loaded, GitHub may process technically required connection data, including the IP address. Depending on the feature used, the browser can connect directly to Open-Meteo, OpenStreetMap/Nominatim, OpenFreeMap, MapLibre terrain tiles, CDS/Aladin Lite, Meteoblue and the GitHub raw-data server. The respective provider may receive IP address, request time, browser data and the selected coordinates.</p><p><strong>Location</strong><br>The browser location is used only after explicit permission. Locations can also be entered manually.</p><p><strong>Current installation URL</strong><br><code>${esc(publicUrl)}</code></p>`},
      nutzung:{title:'Usage notes',html:`<p>Weather forecasts, model consensus, cloud maps, astronomical calculations and quality ratings are planning aids. They do not guarantee actual observing or imaging conditions.</p><p>Safety decisions for people and equipment must be based on the current local conditions and, where relevant, official weather and warning information. The quality colors describe expected imaging quality, not structural safety of mount, tripod, pier, telescope or roof.</p><p><strong>Development note</strong><br>The Astro Night Planner was developed by Andreas Cordt with support from generative AI and has been tested continuously. Forecast, calculation, display and software errors cannot be ruled out completely.</p>`},
      quellen:{title:'Data sources & licenses',html:`<ul><li><strong>Weather:</strong> Open-Meteo with DWD ICON, ECMWF IFS and NOAA GFS.</li><li><strong>Maps and geocoding:</strong> OpenStreetMap/Nominatim, OpenFreeMap and MapLibre GL JS including MapLibre demo terrain tiles. OpenStreetMap data © OpenStreetMap contributors.</li><li><strong>Sky image:</strong> Aladin Lite and CDS Strasbourg; surveys are subject to the terms of their providers.</li><li><strong>Reference forecast:</strong> Meteoblue Astronomy Seeing and Meteoblue weather maps.</li><li><strong>Astronomical calculations:</strong> Astronomy Engine and app-specific calculations.</li><li><strong>Object catalog:</strong> bundled Planner catalog; optional raw-data request from the associated GitHub repository.</li></ul>`},
      version:{title:'Version',html:`<p><strong>Astro Night Planner ${esc(RELEASE)}</strong></p><p>App version: <code>${esc(APP_VERSION)}</code><br>Environment: <code>${esc(ENV==='test'?'TEST VERSION':'Production')}</code><br>Profile schema: 7</p>${versionNotesHtml('en')}<p>© Andreas Cordt · <a href="https://www.deepskyastrophoto.de" target="_blank" rel="noopener noreferrer">www.deepskyastrophoto.de</a></p>`}
    };
    return pages[page]||pages.version;
  }
  const pages={
    impressum:{title:'Impressum',html:`<p><strong>Angaben zum Anbieter</strong></p><p>Andreas Cordt<br>Schwarzwaldstraße 15<br>70794 Filderstadt<br>Deutschland</p><p>E-Mail: <a href="mailto:andreas@deepskyastrophoto.de">andreas@deepskyastrophoto.de</a><br>Homepage: <a href="https://www.deepskyastrophoto.de" target="_blank" rel="noopener noreferrer">www.deepskyastrophoto.de</a></p><p>Der Astro Night Planner wird rein privat unter dem eigenen Namen angeboten.</p>`},
    datenschutz:{title:'Datenschutz',html:`<p><strong>Verantwortlicher</strong><br>Andreas Cordt, Schwarzwaldstraße 15, 70794 Filderstadt<br><a href="mailto:andreas@deepskyastrophoto.de">andreas@deepskyastrophoto.de</a></p><p><strong>Lokale Datenhaltung</strong><br>Profile, Ausrüstung, Standorte, Horizonte und Einstellungen werden lokal im Browser in IndexedDB gespeichert. PWA-Programmdateien liegen in Cache Storage. Es bestehen keine Benutzerkonten, keine Kontaktformulare und keine zentrale Synchronisierung.</p><p><strong>Keine eigene Reichweitenmessung</strong><br>Der Betreiber setzt keine eigene Besucherstatistik, kein Tracking und keine eigene Fehleranalyse ein.</p><p><strong>Hosting und externe Abrufe</strong><br>Die Anwendung wird über GitHub Pages bereitgestellt. Beim Abruf können technisch erforderliche Verbindungsdaten, insbesondere die IP-Adresse, durch GitHub verarbeitet werden. Je nach genutzter Funktion stellt der Browser direkte Verbindungen zu Open-Meteo, OpenStreetMap/Nominatim, OpenFreeMap, MapLibre einschließlich der Geländeschattierung, CDS/Aladin Lite, Meteoblue sowie gegebenenfalls dem GitHub-Rohdatenserver her. Dabei können IP-Adresse, Zeitpunkt, Browserdaten und die gewählten Koordinaten an den jeweiligen Anbieter übertragen werden.</p><p><strong>Standort</strong><br>Der Browserstandort wird nur nach ausdrücklicher Freigabe verwendet. Alternativ kann ein Ort manuell ausgewählt werden.</p><p><strong>Aktuelle Installationsadresse</strong><br><code>${esc(publicUrl)}</code></p><p class="notice warn">Vor der Veröffentlichung im Produktivsystem werden die endgültige URL und die tatsächlich eingebundenen Dienste nochmals aus dem ausgelieferten Programmstand geprüft.</p>`},
    nutzung:{title:'Nutzungshinweise',html:`<p>Wetterprognosen, Modellkonsens, Wolkenkarten, astronomische Berechnungen und Qualitätsbewertungen sind Planungshilfen. Sie stellen keine Garantie für tatsächliche Beobachtungs- oder Aufnahmebedingungen dar.</p><p>Sicherheitsentscheidungen für Personen und Ausrüstung müssen anhand der aktuellen Bedingungen vor Ort sowie gegebenenfalls offizieller Wetter- und Warninformationen getroffen werden. Die Qualitätsfarben bewerten die erwartete Aufnahmequalität, nicht die strukturelle Sicherheit einer Montierung oder anderer Ausrüstung.</p><p><strong>Entwicklungshinweis</strong><br>Der Astro Night Planner wurde von Andreas Cordt mit Unterstützung generativer KI entwickelt und fortlaufend getestet. Trotz sorgfältiger Entwicklung können Prognose-, Berechnungs-, Darstellungs- und Programmfehler nicht vollständig ausgeschlossen werden.</p>`},
    quellen:{title:'Datenquellen & Lizenzen',html:`<ul><li><strong>Wetter:</strong> Open-Meteo mit DWD ICON, ECMWF IFS und NOAA GFS.</li><li><strong>Karten und Geocoding:</strong> OpenStreetMap/Nominatim, OpenFreeMap und MapLibre GL JS einschließlich MapLibre-Demotiles für die Geländeschattierung. OpenStreetMap-Daten © OpenStreetMap-Mitwirkende.</li><li><strong>Himmelsbild:</strong> Aladin Lite und CDS Strasbourg; genutzte Surveys unterliegen den Angaben der jeweiligen Datenanbieter.</li><li><strong>Externe Wetterquellen:</strong> Meteoblue Astronomy Seeing/Wetterkarten, Clear Outside, Windy und Ventusky als Kontrollquellen mit Standortübergabe.</li><li><strong>Astronomische Berechnungen:</strong> Astronomy Engine sowie anwendungseigene Berechnungen.</li><li><strong>Objektkatalog:</strong> mitgelieferter Planner-Katalog; optionaler Rohdatenabruf aus dem zugehörigen GitHub-Repository.</li></ul>`},
    version:{title:'Version',html:`<p><strong>Astro Night Planner ${esc(RELEASE)}</strong></p><p>Programmversion: <code>${esc(APP_VERSION)}</code><br>Umgebung: <code>${esc(ENV==='test'?'TESTVERSION':'Produktivversion')}</code><br>Profilschema: 8</p>${versionNotesHtml('de')}<p>© Andreas Cordt · <a href="https://www.deepskyastrophoto.de" target="_blank" rel="noopener noreferrer">www.deepskyastrophoto.de</a></p>`}
  };
  return pages[page]||pages.version;
}
function openLegalDialog(page){
  const dialog=document.getElementById('legalDialog'),title=document.getElementById('legalDialogTitle'),content=document.getElementById('legalDialogContent');if(!dialog||!title||!content)return;
  const data=legalPageContent(page);title.textContent=data.title;content.innerHTML=data.html;dialog.showModal?.();
}
function bindGlobal(){
  document.querySelectorAll('.language-switch [data-language]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.language)));
  document.querySelectorAll('[data-main-tab]').forEach(button=>button.addEventListener('click',()=>switchMain(button.dataset.mainTab)));
  document.querySelectorAll('[data-legal-page]').forEach(button=>button.addEventListener('click',()=>openLegalDialog(button.dataset.legalPage)));
  document.getElementById('headerProfileSelect').addEventListener('change',async event=>{
    const found=profiles.find(item=>item.id===event.target.value);
    if(!found)return;
    profile=normalizeProfile(found);
    draft=deepClone(profile);
    dirtySections.clear();
    await setActiveProfile(profile.id);
    selectedDateKey=dateKeyFor(new Date(),activeLocation()?.timezone||'Europe/Berlin');
    profile.planning.dateKey=selectedDateKey; draft.planning.dateKey=selectedDateKey;
    page=1;
    render();
    fetchWeather();
  });
  importInput.addEventListener('change',handleImportFile);
  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    installPrompt=event;
    document.getElementById('installButton').hidden=false;
  });
  document.getElementById('installButton').addEventListener('click',async()=>{
    if(installPrompt){
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt=null;
      document.getElementById('installButton').hidden=true;
    }
  });
  document.getElementById('reloadForUpdate').addEventListener('click',installUpdateWithOptionalBackup);
  window.addEventListener('resize',layoutFramingOverlays,{passive:true});
}
function updateProfileSelectors(){
  const select=document.getElementById('headerProfileSelect'); if(!select)return;
  select.innerHTML=profiles.sort((a,b)=>a.name.localeCompare(b.name,'de')).map(p=>`<option value="${esc(p.id)}" ${profile&&p.id===profile.id?'selected':''}>${esc(p.name)}</option>`).join('');
  document.getElementById('headerProfileName').textContent=profile?.name||'Standard';
}
async function switchMain(tab){if(dirtySections&&dirtySections.size&&currentMainTab==='settings'&&tab!=='settings'&&!confirm('Es gibt ungespeicherte Änderungen in den Einstellungen. Bereich trotzdem verlassen?'))return;scrollByTab[currentMainTab]=scrollY;if(tab!=='plan')stopCloudMapAnimation();currentMainTab=tab;profile.ui.mainTab=tab;await saveProfile();render();if(tab==='plan'&&!cloudMapData)fetchCloudMap();requestAnimationFrame(()=>scrollTo({top:scrollByTab[tab]||0,behavior:'instant'}));}

function activeLocation(){const id=profile.planning?.locationId||profile.central?.defaultLocationId||profile.selectedLocationId;return profile.locations.find(x=>x.id===id)||profile.locations[0]||standardProfile().locations[0]}
function activeSetup(){const id=profile.planning?.temporarySetupId||profile.equipment.selectedSetupId;return (profile.equipment.setups||[]).find(x=>x.id===id)||(profile.equipment.setups||[])[0]||null}
function activeScope(){const setup=activeSetup();const id=profile.planning?.temporaryTelescopeId||setup?.telescopeId||profile.equipment.selectedTelescopeId;return profile.equipment.telescopes.find(x=>x.id===id)||profile.equipment.telescopes[0]}
function activeCamera(){const setup=activeSetup();const id=profile.planning?.temporaryCameraId||setup?.cameraId||profile.equipment.selectedCameraId;return profile.equipment.cameras.find(x=>x.id===id)||profile.equipment.cameras[0]}
function activeMount(){return profile.equipment.mounts?.find(x=>x.id===profile.equipment.selectedMountId)}
function fov(){const setup=activeSetup(),s=activeScope(),c=activeCamera(),fl=effectiveFocalLength(s,setup);if(!s||!c||!fl)return null;const px=calculateCameraPixelSize(c)||Number(c.pixelSize)||0;return {width:57.2958*c.sensorWidth/fl,height:57.2958*c.sensorHeight/fl,pixelScale:px?206.265*px/fl:null,effectiveFocalLength:fl,opticalFactor:opticalFactorForSetup(setup),setupName:setup?.name||''}}
function fovForSetup(setup){const s=profile.equipment.telescopes.find(x=>x.id===setup?.telescopeId),c=profile.equipment.cameras.find(x=>x.id===setup?.cameraId),fl=effectiveFocalLength(s,setup);if(!s||!c||!fl)return null;const px=calculateCameraPixelSize(c)||Number(c.pixelSize)||0;return {width:57.2958*c.sensorWidth/fl,height:57.2958*c.sensorHeight/fl,pixelScale:px?206.265*px/fl:null,effectiveFocalLength:fl,opticalFactor:opticalFactorForSetup(setup),name:setup.name,id:setup.id}}
function esc(v){return String(v??'').replace(/[&<>"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]))}
function dateMs(value){return value instanceof Date&&Number.isFinite(value.getTime())?value.getTime():''}
function ui(de,en){return language==='en'?en:de}
function fmt(v,d=0){return Number.isFinite(v)?Number(v).toFixed(d):'–'}
function toRad(x){return x*Math.PI/180} function toDeg(x){return x*180/Math.PI}
function dateKeyFor(date,tz='Europe/Berlin'){return new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).format(date)}
function addDays(key,n){const d=new Date(`${key}T12:00:00Z`);d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
function fmtDate(key,tz){return new Intl.DateTimeFormat('de-DE',{timeZone:tz,weekday:'short',day:'2-digit',month:'2-digit'}).format(new Date(`${key}T12:00:00Z`))}
function fmtTime(date,tz){if(!date||isNaN(date))return'–';return new Intl.DateTimeFormat('de-DE',{timeZone:tz,hour:'2-digit',minute:'2-digit'}).format(date)}
function fmtEventTime(date,tz,emptyText){return(!date||isNaN(date))?emptyText:fmtTime(date,tz)}
function findMoonEventNear(type,mode,night,windowRange,loc){
  const moonFn=(date,l)=>{const c=moonCoords(date);return altitude(c.raHours,c.decDeg,date,l.latitude,l.longitude)};
  const targetDescending=type==='set';
  const from=mode==='before'?new Date(windowRange.start.getTime()-36*3600000):new Date(windowRange.end.getTime());
  const to=mode==='before'?new Date(windowRange.start.getTime()):new Date(windowRange.end.getTime()+36*3600000);
  const crossings=findCrossings(from,to,loc,0,moonFn).filter(item=>Boolean(item.descending)===targetDescending);
  if(!crossings.length)return null;
  return mode==='before'?crossings[crossings.length-1].time:crossings[0].time;
}
function moonEventDisplay(date,type,night,windowRange,loc){
  const label=type==='rise'?'Mondaufgang':'Monduntergang';
  const outsideText=(time,mode)=>`${label}${time?` ${time}`:''} – liegt ${mode==='before'?'vor':'nach'} dem Planungszeitraum`;
  const none=`kein ${label.toLowerCase()} in dieser Nacht`;
  if(date&&!isNaN(date)){
    const time=fmtTime(date,loc.timezone);
    if(date<windowRange.start)return outsideText(time,'before');
    if(date>windowRange.end)return outsideText(time,'after');
    return time;
  }
  const moonStart=moonCoords(windowRange.start),moonEnd=moonCoords(windowRange.end);
  const altStart=altitude(moonStart.raHours,moonStart.decDeg,windowRange.start,loc.latitude,loc.longitude);
  const altEnd=altitude(moonEnd.raHours,moonEnd.decDeg,windowRange.end,loc.latitude,loc.longitude);
  if(type==='rise'&&altStart>0){
    const event=findMoonEventNear(type,'before',night,windowRange,loc);
    return outsideText(event?fmtTime(event,loc.timezone):'', 'before');
  }
  if(type==='set'&&altEnd>0){
    const event=findMoonEventNear(type,'after',night,windowRange,loc);
    return outsideText(event?fmtTime(event,loc.timezone):'', 'after');
  }
  return none;
}
function fmtDateTime(date,tz){return new Intl.DateTimeFormat('de-DE',{timeZone:tz,day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(date)}
function timeZoneOptions(selected){const values=[...new Set([selected,...TIMEZONE_OPTIONS].filter(Boolean))];return values.map(value=>`<option value="${esc(value)}" ${value===selected?'selected':''}>${esc(value)}</option>`).join('')}
function clockInputValue(date,tz){
  if(!date||isNaN(date))return'00:00';
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date);
  const get=type=>parts.find(part=>part.type===type)?.value||'00';
  return`${get('hour')}:${get('minute')}`;
}
function localMinuteOfDay(date,tz){
  const [hour,minute]=clockInputValue(date,tz).split(':').map(Number);
  return hour*60+minute;
}
function nearestFractionForClock(clock,start,end,tz){
  const [hour,minute]=String(clock||'00:00').split(':').map(Number);
  const target=hour*60+minute;
  let bestTime=start.getTime(),bestDistance=Infinity;
  for(let time=start.getTime();time<=end.getTime();time+=60000){
    const value=localMinuteOfDay(new Date(time),tz);
    const distance=Math.min(Math.abs(value-target),1440-Math.abs(value-target));
    if(distance<bestDistance){bestDistance=distance;bestTime=time}
  }
  return clamp((bestTime-start.getTime())/Math.max(1,end-start),0,1);
}

function julian(date){return date.getTime()/86400000+2440587.5}
function gmst(date){const d=julian(date)-2451545;return ((18.697374558+24.06570982441908*d)%24+24)%24}
function altitude(raHours,decDeg,date,lat,lon){const ha=toRad((((gmst(date)+lon/15-raHours)%24+24)%24)*15);const p=toRad(lat),d=toRad(decDeg);return toDeg(Math.asin(clamp(Math.sin(p)*Math.sin(d)+Math.cos(p)*Math.cos(d)*Math.cos(ha),-1,1)))}
function azimuth(raHours,decDeg,date,lat,lon){const ha=toRad((((gmst(date)+lon/15-raHours)%24+24)%24)*15);const p=toRad(lat),d=toRad(decDeg);const y=Math.sin(ha),x=Math.cos(ha)*Math.sin(p)-Math.tan(d)*Math.cos(p);return (toDeg(Math.atan2(y,x))+180+360)%360}
function sunCoords(date){const n=julian(date)-2451545;const L=(280.46+.9856474*n)%360;const g=toRad((357.528+.9856003*n)%360);const lambda=toRad(L+1.915*Math.sin(g)+.02*Math.sin(2*g));const eps=toRad(23.439-.0000004*n);const ra=Math.atan2(Math.cos(eps)*Math.sin(lambda),Math.cos(lambda));const dec=Math.asin(Math.sin(eps)*Math.sin(lambda));return {raHours:((toDeg(ra)/15)%24+24)%24,decDeg:toDeg(dec)}}
function sunAltitude(date,loc){const c=sunCoords(date);return altitude(c.raHours,c.decDeg,date,loc.latitude,loc.longitude)}
function moonCoords(date){const d=julian(date)-2451543.5;const N=toRad(125.1228-.0529538083*d);const i=toRad(5.1454);const w=toRad(318.0634+.1643573223*d);const a=60.2666;const e=.0549;const M=toRad((115.3654+13.0649929509*d)%360);let E=M+e*Math.sin(M)*(1+e*Math.cos(M));for(let k=0;k<3;k++)E=E-(E-e*Math.sin(E)-M)/(1-e*Math.cos(E));const xv=a*(Math.cos(E)-e),yv=a*Math.sqrt(1-e*e)*Math.sin(E);const v=Math.atan2(yv,xv),r=Math.hypot(xv,yv);const xh=r*(Math.cos(N)*Math.cos(v+w)-Math.sin(N)*Math.sin(v+w)*Math.cos(i));const yh=r*(Math.sin(N)*Math.cos(v+w)+Math.cos(N)*Math.sin(v+w)*Math.cos(i));const zh=r*Math.sin(v+w)*Math.sin(i);const lon=Math.atan2(yh,xh),lat=Math.atan2(zh,Math.hypot(xh,yh));const eps=toRad(23.4393);const xe=Math.cos(lon)*Math.cos(lat),ye=Math.sin(lon)*Math.cos(lat)*Math.cos(eps)-Math.sin(lat)*Math.sin(eps),ze=Math.sin(lon)*Math.cos(lat)*Math.sin(eps)+Math.sin(lat)*Math.cos(eps);const ra=Math.atan2(ye,xe),dec=Math.atan2(ze,Math.hypot(xe,ye));return{raHours:((toDeg(ra)/15)%24+24)%24,decDeg:toDeg(dec)}}
function moonPhaseInfo(date){const syn=29.53058867;const age=((julian(date)-2451550.1)%syn+syn)%syn,illumination=(1-Math.cos(2*Math.PI*age/syn))/2*100,waxing=age<syn/2;let phaseKey='new';if(illumination<3)phaseKey='new';else if(illumination<35)phaseKey=waxing?'waxingCrescent':'waningCrescent';else if(illumination<65)phaseKey=waxing?'firstQuarter':'lastQuarter';else if(illumination<97)phaseKey=waxing?'waxingGibbous':'waningGibbous';else phaseKey='full';return{age,illumination,waxing,phaseKey}}
function moonIllumination(date){return moonPhaseInfo(date).illumination}
function findCrossings(start,end,loc,threshold,fn=sunAltitude){const step=5*60000;let prevT=start,prev=fn(start,loc)-threshold;const out=[];for(let t=start.getTime()+step;t<=end.getTime();t+=step){const dt=new Date(t),v=fn(dt,loc)-threshold;if(prev===0||v===0||prev*v<0){const frac=Math.abs(prev)/(Math.abs(prev)+Math.abs(v));out.push({time:new Date(prevT.getTime()+frac*(dt-prevT)),descending:prev>v});}prev=v;prevT=dt;}return out}
function nightData(key,loc){
  const center=new Date(`${key}T12:00:00Z`),start=new Date(center.getTime()-2*3600000),end=new Date(center.getTime()+26*3600000);
  const cross=t=>findCrossings(start,end,loc,t);
  const c0=cross(-.833),c6=cross(-6),c12=cross(-12),c18=cross(-18);
  const desc=a=>a.find(x=>x.descending)?.time,asc=a=>[...a].reverse().find(x=>!x.descending)?.time;
  const sunset=desc(c0)||new Date(`${key}T18:00:00Z`),sunrise=asc(c0)||new Date(sunset.getTime()+12*3600000);
  let astroDusk=desc(c18)||null,astroDawn=asc(c18)||null;
  // Astronomische Nacht wird nur angezeigt, wenn unter -18° eine zusammenhängende, für die Planung nutzbare Phase entsteht.
  // Kurze/rechnerisch grenzwertige Minuten um die Sommersonnenwende werden als astronomische Dämmerung behandelt.
  const ASTRO_NIGHT_MIN_DURATION_MS=2*3600000;
  let minSunAltitude=90;
  for(let t=sunset.getTime();t<=sunrise.getTime();t+=5*60000)minSunAltitude=Math.min(minSunAltitude,sunAltitude(new Date(t),loc));
  const astroDuration=astroDusk&&astroDawn&&astroDawn>astroDusk?astroDawn-astroDusk:0;
  const hasAstronomicalNight=Boolean(astroDuration>=ASTRO_NIGHT_MIN_DURATION_MS&&minSunAltitude<=-18);
  if(!hasAstronomicalNight){astroDusk=null;astroDawn=null;}
  const moonFn=(date,l)=>{const c=moonCoords(date);return altitude(c.raHours,c.decDeg,date,l.latitude,l.longitude)};
  const mc=findCrossings(sunset,sunrise,loc,0,moonFn);
  let moonMax=-90,moonTransit=null;
  for(let t=sunset.getTime();t<=sunrise.getTime();t+=10*60000){const a=moonFn(new Date(t),loc);if(a>moonMax){moonMax=a;moonTransit=new Date(t)}}
  return{sunset,sunrise,civilDusk:desc(c6)||sunset,civilDawn:asc(c6)||sunrise,nauticalDusk:desc(c12)||desc(c6)||sunset,nauticalDawn:asc(c12)||asc(c6)||sunrise,astronomicalDusk:astroDusk,astronomicalDawn:astroDawn,hasAstronomicalNight,moonrise:mc.find(x=>!x.descending)?.time,moonset:mc.find(x=>x.descending)?.time,moonTransit,moonMaxAltitude:moonMax,moonIllumination:moonIllumination(new Date((sunset.getTime()+sunrise.getTime())/2))}
}
function planningWindow(night,key){switch(key){case'sunset':return{start:night.sunset,end:night.sunrise,label:'Sonnenuntergang bis Sonnenaufgang'};case'civil':return{start:night.civilDusk,end:night.civilDawn,label:'Bürgerliche Nacht'};case'astronomicalTwilight':return{start:night.nauticalDusk,end:night.nauticalDawn,label:'Nautische und astronomische Nacht'};case'astronomicalNight':return night.hasAstronomicalNight?{start:night.astronomicalDusk,end:night.astronomicalDawn,label:'Astronomische Nacht'}:{start:night.nauticalDusk,end:night.nauticalDawn,label:'Keine astronomische Nacht – nautischer Zeitraum'};default:return{start:night.nauticalDusk,end:night.nauticalDawn,label:'Nautischer Planungszeitraum'}}}
function angularSeparation(aRa,aDec,bRa,bDec){const a=toRad(aRa*15),b=toRad(bRa*15),da=toRad(aDec),db=toRad(bDec);return toDeg(Math.acos(clamp(Math.sin(da)*Math.sin(db)+Math.cos(da)*Math.cos(db)*Math.cos(a-b),-1,1)))}
function horizonProfilesFor(loc){
  if(!loc)return[];
  if(!Array.isArray(loc.horizonProfiles)||!loc.horizonProfiles.length){
    const values=Array.isArray(loc.horizonProfile)&&loc.horizonProfile.length?resampleHorizonProfile(loc.horizonProfile):emptyHorizonProfile();
    values[HORIZON_LAST_INDEX]=values[0];
    loc.horizonProfiles=[{id:uid('horizon'),name:'Standardhorizont',horizonProfile:values,obstacles:(loc.obstacles||[]).map(item=>({...item}))}];
    loc.defaultHorizonProfileId=loc.horizonProfiles[0].id;loc.selectedHorizonProfileId=loc.horizonProfiles[0].id;
  }
  return loc.horizonProfiles;
}
function horizonProfileFor(loc,preferredId=null){
  const profiles=horizonProfilesFor(loc);
  const id=preferredId||((loc===activeLocation())?profile.planning?.temporaryHorizonProfileId:null)||loc.selectedHorizonProfileId||loc.defaultHorizonProfileId;
  return profiles.find(item=>item.id===id)||profiles.find(item=>item.id===loc.defaultHorizonProfileId)||profiles[0];
}
function ensureHorizonProfile(loc,preferredId=null){const entry=horizonProfileFor(loc,preferredId);if(!entry)return emptyHorizonProfile();entry.horizonProfile=resampleHorizonProfile(entry.horizonProfile);entry.horizonProfile[HORIZON_LAST_INDEX]=entry.horizonProfile[0];return entry.horizonProfile}
function horizonObstacles(loc,preferredId=null){return(horizonProfileFor(loc,preferredId)?.obstacles||[])}
function horizonAt(loc,az,preferredId=null){const normalized=((az%360)+360)%360;const values=ensureHorizonProfile(loc,preferredId);const pos=normalized/HORIZON_STEP_DEG,i=Math.floor(pos),j=Math.min(HORIZON_LAST_INDEX,i+1),f=pos-i;return Number(values[i]||0)*(1-f)+Number(values[j]||0)*f}
function syncCardinalHorizon(loc,preferredId=null){const values=ensureHorizonProfile(loc,preferredId);values[HORIZON_LAST_INDEX]=values[0];const entry=horizonProfileFor(loc,preferredId);loc.horizonProfile=values.slice();loc.horizon=Array.from({length:8},(_,index)=>Number(values[horizonCardinalIndex(index)]||0));loc.obstacles=(entry?.obstacles||[]).map(item=>({...item}))}


function objectStats(obj,window,loc,minAlt){
  const points=[];let max=-90,best=window.start,visibleMs=0,horizonOnlyMs=0,minOnlyMs=0;
  const count=49,step=(window.end-window.start)/Math.max(1,count-1);
  for(let i=0;i<count;i++){
    const t=new Date(window.start.getTime()+step*i);
    const alt=altitude(obj.raHours,obj.decDeg,t,loc.latitude,loc.longitude);
    const az=azimuth(obj.raHours,obj.decDeg,t,loc.latitude,loc.longitude);
    const horizonAlt=horizonAt(loc,az);
    const min=Number(minAlt)||0,effectiveMin=Math.max(min,horizonAlt);
    points.push({t,alt,az,horizonAlt});
    if(alt>max){max=alt;best=t}
    if(i){if(alt>=horizonAlt)horizonOnlyMs+=step;if(alt>=min)minOnlyMs+=step;if(alt>=effectiveMin)visibleMs+=step}
  }
  const moon=moonCoords(best);const moonAlt=altitude(moon.raHours,moon.decDeg,best,loc.latitude,loc.longitude);
  return{points,maxAltitude:max,bestTime:best,visibleHours:visibleMs/3600000,horizonVisibleHours:horizonOnlyMs/3600000,minAltitudeVisibleHours:minOnlyMs/3600000,meridian:best,moonDistance:angularSeparation(obj.raHours,obj.decDeg,moon.raHours,moon.decDeg),moonAltitude:moonAlt}
}

function currentWindProfile(){return profile.planning.temporaryWindProfile||profile.central.activeWindProfile}
function currentDisplayProfile(){return profile.planning.temporaryDisplayProfile||profile.central.listDisplay.activeProfile}
function visibleDisplayColumns(display){const order=Array.isArray(display?.columnOrder)?display.columnOrder:DISPLAY_COLUMN_IDS;const visible=new Set(Array.isArray(display?.columns)?display.columns:['name']);visible.add('name');const result=order.filter(id=>visible.has(id)&&DISPLAY_COLUMN_IDS.includes(id));return result.length?result:['name']}

function currentWeatherView(){return profile.planning.temporaryWeatherView||profile.central.weatherModels?.defaultView||'consensus'}
function weatherViewLabel(view=currentWeatherView()){return optionLabel(WEATHER_VIEW_OPTIONS.find(([key])=>key===view)?.[1]||'Modellkonsens')}
function cardinal(azimuth){const names=language==='en'?['N','NE','E','SE','S','SW','W','NW']:['N','NO','O','SO','S','SW','W','NW'];return names[Math.round((((azimuth%360)+360)%360)/45)%8]}
function horizonTooltipText(point){const az=clamp(Number(point?.azimuth)||0,0,360),alt=clamp(Number(point?.altitude)||0,0,90),azLabel=Math.round(az),altLabel=Math.round(alt),dir=cardinal(az);return language==='en'?`Azimuth ${azLabel}° ${dir} · Altitude ${altLabel}°`:`Azimut ${azLabel}° ${dir} · Höhe ${altLabel}°`}
function weightedValue(entries,key){
  const available=entries.filter(entry=>Number.isFinite(entry.row[key]));
  if(!available.length)return NaN;
  const configured=profile.central.weatherModels?.weights||{};
  let denominator=available.reduce((sum,entry)=>sum+Math.max(0,Number(configured[entry.model.key]??0)),0);
  if(denominator<=0)denominator=available.length;
  return available.reduce((sum,entry)=>{
    const configuredWeight=Math.max(0,Number(configured[entry.model.key]??0));
    const weight=denominator===available.length&&configuredWeight===0?1:configuredWeight;
    return sum+entry.row[key]*weight;
  },0)/denominator;
}
function weatherRowsForWindow(windowRange,view=currentWeatherView()){
  if(!weatherModels.length)return[];
  if(view!=='consensus'){
    const model=weatherModels.find(item=>item.key===view);
    if(!model)return[];
    return model.time.map((time,index)=>({...(model.values[index]||{}),time:new Date(time),model:model.name,modelKey:model.key}))
      .filter(row=>row.time>=windowRange.start&&row.time<=windowRange.end)
      .map(enrichWeatherRow);
  }
  const byTime=new Map();
  for(const model of weatherModels){
    model.time.forEach((time,index)=>{
      const timestamp=new Date(time).getTime();
      if(timestamp<windowRange.start.getTime()||timestamp>windowRange.end.getTime())return;
      if(!byTime.has(timestamp))byTime.set(timestamp,[]);
      byTime.get(timestamp).push({model,row:model.values[index]||{}});
    });
  }
  const keys=['temperature','dewPoint','humidity','cloud','cloudLow','cloudMid','cloudHigh','visibility','precip','wind','gust','jet'];
  return [...byTime.entries()].sort((a,b)=>a[0]-b[0]).map(([timestamp,entries])=>{
    const row={time:new Date(timestamp),model:'Modellkonsens',modelKey:'consensus'};
    keys.forEach(key=>row[key]=weightedValue(entries,key));
    return enrichWeatherRow(row);
  });
}
function enrichWeatherRow(row){
  const cloud=clamp(Number.isFinite(row.cloud)?row.cloud:0,0,100);
  const visibility=Number.isFinite(row.visibility)?row.visibility:0;
  const wind=Number.isFinite(row.wind)?row.wind:0;
  const high=Number.isFinite(row.cloudHigh)?row.cloudHigh:0;
  const atmosphericTransparency=clamp((visibility/24000)*100,0,100);
  const cloudTransmission=Math.pow(clamp(1-cloud/100,0,1),.8);
  const effectiveTransparency=clamp(atmosphericTransparency*cloudTransmission,0,100);
  return {
    ...row,
    dewGap:Number.isFinite(row.temperature)&&Number.isFinite(row.dewPoint)?row.temperature-row.dewPoint:NaN,
    atmosphericTransparency,
    effectiveTransparency,
    transparency:effectiveTransparency,
    seeing:clamp(82-wind*2.1-high*.12,0,100)
  };
}
function thresholdClass(value,green,yellow,lowerIsBetter=true){
  if(!Number.isFinite(value))return'';
  if(lowerIsBetter)return value<green?'good':value<=yellow?'warn':'bad';
  return value>green?'good':value>=yellow?'warn':'bad';
}
function windQualityClass(value,type='wind'){
  const thresholds=windThresholds();
  const green=type==='gust'?thresholds.gustGreen:thresholds.windGreen;
  const yellow=type==='gust'?thresholds.gustYellow:thresholds.windYellow;
  return thresholdClass(windFromKmh(value),green,yellow,true);
}
function weatherHourScore(row){
  const weights=profile.central.weights;
  const windClassScore=Math.min(
    windQualityClass(row.wind)==='good'?100:windQualityClass(row.wind)==='warn'?60:20,
    windQualityClass(row.gust,'gust')==='good'?100:windQualityClass(row.gust,'gust')==='warn'?60:20
  );
  const dewScore=row.dewGap>profile.central.dew.green?100:row.dewGap>=profile.central.dew.yellow?55:15;
  const parts=[
    [weights.clouds,100-(row.cloud||0)],
    [weights.transparency,row.transparency],
    [weights.seeing,row.seeing],
    [weights.wind,windClassScore],
    [weights.dew,dewScore]
  ];
  const denominator=parts.reduce((sum,[weight])=>sum+weight,0)||1;
  return clamp(parts.reduce((sum,[weight,value])=>sum+weight*(Number.isFinite(value)?value:50),0)/denominator,0,100);
}
function bestObjectHour(object,night,loc,minAltitude,view=currentWeatherView()){
  const range={start:night.nauticalDusk,end:night.nauticalDawn};
  if(!(range.start instanceof Date)||!(range.end instanceof Date)||range.end<=range.start)return null;
  const rows=weatherRowsForWindow(range,view);
  let best=null;
  for(const row of rows){
    const alt=altitude(object.raHours,object.decDeg,row.time,loc.latitude,loc.longitude);
    const az=azimuth(object.raHours,object.decDeg,row.time,loc.latitude,loc.longitude);
    const effectiveMin=Math.max(Number(minAltitude)||0,horizonAt(loc,az));
    if(alt<effectiveMin)continue;
    const quality=weatherHourScore(row);
    const candidate={time:row.time,quality,altitude:alt,azimuth:az,cloud:Number(row.cloud)};
    if(!best||candidate.quality>best.quality+.01||Math.abs(candidate.quality-best.quality)<=.01&&(candidate.altitude>best.altitude+.01||Math.abs(candidate.altitude-best.altitude)<=.01&&candidate.cloud<best.cloud))best=candidate;
  }
  return best;
}
function windUnitLabel(unit=profile.central.windUnit){return unit==='ms'?'m/s':'km/h'}
function windFromKmh(value,unit=profile.central.windUnit){return unit==='ms'?value/3.6:value}
function convertWindValue(value,fromUnit,toUnit){if(fromUnit===toUnit)return value;return toUnit==='ms'?value/3.6:value*3.6}
function windThresholds(){return profile.central.windProfiles[currentWindProfile()]||WIND_PROFILES.normal}
function weatherForWindow(windowRange,view=currentWeatherView()){
  const rows=weatherRowsForWindow(windowRange,view);
  if(!rows.length)return null;
  const finite=key=>rows.map(row=>row[key]).filter(Number.isFinite);
  const avg=key=>{const values=finite(key);return values.length?values.reduce((a,b)=>a+b,0)/values.length:NaN};
  const max=key=>{const values=finite(key);return values.length?Math.max(...values):NaN};
  const dewGap=avg('dewGap');
  const cloud=avg('cloud');
  const windKmh=avg('wind');
  const gustKmh=max('gust');
  const jetKmh=avg('jet');
  const visibility=avg('visibility');
  const wind=windFromKmh(windKmh),gust=windFromKmh(gustKmh),jet=windFromKmh(jetKmh);
  const transparency=avg('transparency');
  const atmosphericTransparency=avg('atmosphericTransparency');
  const seeing=avg('seeing');
  const thresholds=windThresholds();
  const windScore=Math.min(
    wind<thresholds.windGreen?100:wind<=thresholds.windYellow?60:20,
    gust<thresholds.gustGreen?100:gust<=thresholds.gustYellow?60:20
  );
  const dewScore=dewGap>profile.central.dew.green?100:dewGap>=profile.central.dew.yellow?55:15;
  return{rows,cloud,wind,gust,jet,windKmh,gustKmh,jetKmh,dewGap,visibility,transparency,atmosphericTransparency,seeing,windScore,dewScore,view};
}
function scoreObject(obj,stats,weather,window,night){const w=profile.central.weights;const duration=Math.max(.1,(window.end-window.start)/3600000);const altitudeScore=clamp((stats.maxAltitude-15)/60*100,0,100),durationScore=clamp(stats.visibleHours/duration*100,0,100);const moonPenalty=stats.moonAltitude<=0?100:clamp((stats.moonDistance-15)/75*100,0,100)*(1-night.moonIllumination/180);const cloud=weather?100-weather.cloud:55,trans=weather?weather.transparency:55,seeing=weather?weather.seeing:55,wind=weather?weather.windScore:55,dew=weather?weather.dewScore:55;const total=w.clouds*cloud+w.transparency*trans+w.seeing*seeing+w.wind*wind+w.dew*dew+w.moon*moonPenalty+w.altitude*altitudeScore+w.duration*durationScore;return clamp(total/100,0,100)}
function qualityThresholds(source=profile){const values=source?.central?.qualityThresholds||{yellow:60,green:80};return{yellow:clamp(Math.round(Number(values.yellow)||60),1,98),green:clamp(Math.round(Number(values.green)||80),2,99)}}
function scoreClass(v,source=profile){const thresholds=qualityThresholds(source);return v>=thresholds.green?'good':v>=thresholds.yellow?'warn':'bad'}
function scoreClassOrNeutral(score){return Number.isFinite(score)?scoreClass(score):'neutral'}
function nightQualityForDateKey(dateKey,loc){
  if(!loc||!isForecastDateKey(dateKey)||!weatherModels.length)return NaN;
  const night=nightData(dateKey,loc),range=planningWindow(night,profile.planning.planningWindow),rows=weatherRowsForWindow(range,currentWeatherView());
  const scores=rows.filter(row=>row.time>=range.start&&row.time<=range.end).map(row=>weatherHourScore(row)).filter(Number.isFinite);
  return scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:NaN;
}
function dateButtonInfo(dateKey,loc,index){
  const night=nightData(dateKey,loc);
  const moon=Number(night.moonIllumination);
  const quality=nightQualityForDateKey(dateKey,loc);
  const qText=Number.isFinite(quality)?`Ø ${fmt(quality)}`:(language==='en'?'no weather':'keine Wetterdaten');
  const title=index===0?'Heute':index===1?'Morgen':`+${index}`;
  return{title,moon,quality,qualityText:qText,className:Number.isFinite(quality)?scoreClass(quality):'neutral'};
}
function auroraLevelRank(level){return{none:0,yellow:1,orange:2,red:3}[level]||0}
function auroraLevelClass(level){return auroraLevelRank(level)?`aurora-${level}`:'aurora-none'}
function framingSettings(){return{minMarginPercent:10,autoRotate:true,...(profile.central?.framing||{})}}
function normalizedAngle180(value){let result=Number(value)||0;result%=180;if(result<0)result+=180;return result}
function effectiveObjectRotation(obj){
  const isSelected=obj?.id===profile.planning.selectedObjectId;
  return isSelected&&Number.isFinite(Number(profile.planning.objectRotation))?normalizedAngle180(Number(profile.planning.objectRotation)):normalizedAngle180(Number(obj?.positionAngleDeg)||0);
}
function framingAtRotation(obj,rotation){
  const frame=fov();
  if(!frame||!Number(obj.majorArcMin))return{status:'–',code:'unknown',minMargin:NaN,rotation:normalizedAngle180(rotation)};
  const major=Math.max(.0001,Number(obj.majorArcMin)/60),minor=Math.max(.0001,Number(obj.minorArcMin||obj.majorArcMin)/60);
  const a=major/2,b=minor/2,pa=effectiveObjectRotation(obj);
  const delta=toRad(pa-normalizedAngle180(rotation));
  const extentW=Math.sqrt(Math.pow(a*Math.cos(delta),2)+Math.pow(b*Math.sin(delta),2));
  const extentH=Math.sqrt(Math.pow(a*Math.sin(delta),2)+Math.pow(b*Math.cos(delta),2));
  const marginW=(frame.width/2-extentW)/frame.width*100;
  const marginH=(frame.height/2-extentH)/frame.height*100;
  const minMargin=Math.min(marginW,marginH),target=clamp(Number(framingSettings().minMarginPercent)||10,0,45);
  let code,status;
  if(minMargin<0){code='too-large';status='Objekt zu groß für das Bildfeld'}
  else if(minMargin<5){code='extremely-tight';status='Objekt passt nur äußerst knapp'}
  else if(minMargin<target){code='near-edge';status='Objekt nahe am Bildrand'}
  else if(minMargin>=30){code='wide';status='Viel Umfeld'}
  else{code='good';status='Gut gerahmt'}
  return{status,code,minMargin,marginW,marginH,rotation:normalizedAngle180(rotation),major,minor,frame};
}
function optimalFrameRotation(obj){
  if(!framingSettings().autoRotate||!Number.isFinite(Number(obj.positionAngleDeg)))return normalizedAngle180(profile.planning.frameRotation||0);
  let best=null;
  for(let rotation=0;rotation<180;rotation+=1){const result=framingAtRotation(obj,rotation);if(!best||result.minMargin>best.minMargin)best=result}
  return best?.rotation||0;
}
function framingAnalysis(obj,{rotation=null,optimize=true}={}){const chosen=rotation==null?(optimize?optimalFrameRotation(obj):Number(profile.planning.frameRotation)||0):rotation;return framingAtRotation(obj,chosen)}
function fitsSensor(obj){return framingAnalysis(obj).status}

async function loadCatalog(){try{const cached=await idbGet('cache','catalog-v12');if(cached?.value?.length){catalog=mergeCatalog(cached.value);render()}let rows=null,lastError=null;for(const url of [LOCAL_CATALOG_URL,REMOTE_CATALOG_URL]){try{const response=await fetch(url,{cache:'no-cache'});if(!response.ok)throw new Error(`${url}: HTTP ${response.status}`);const candidate=await response.json();if(!Array.isArray(candidate)||!candidate.length)throw new Error(`${url}: ungültiger Katalog`);rows=candidate;break}catch(error){lastError=error}}if(!rows)throw lastError||new Error('Kein Katalog verfügbar');const converted=rows.map(r=>({id:r[0],name:r[1],aliases:r[2]||[],type:r[3],raHours:r[4],decDeg:r[5],magnitude:r[6]??null,surfaceBrightness:r[7]??null,majorArcMin:r[8]||0,minorArcMin:r[9]||r[8]||0,constellation:r[10]||'–',recommendedFilters:r[11]||[],catalogs:r[12]||['Zusatzkatalog'],positionAngleDeg:Number.isFinite(r[13])?r[13]:0}));catalog=mergeCatalog(converted);await idbPut('cache',{key:'catalog-v12',value:converted,updatedAt:new Date().toISOString()});render();}catch(err){console.warn('Katalog-Fallback aktiv',err)}}
function mergeCatalog(remote){const map=new Map();for(const o of [...remote,...BUILTIN_OBJECTS]){const key=o.id.replace(/\s/g,'').toUpperCase();map.set(key,{...(map.get(key)||{}),...o,aliases:[...new Set([...(map.get(key)?.aliases||[]),...(o.aliases||[])])],catalogs:[...new Set([...(map.get(key)?.catalogs||[]),...(o.catalogs||[])])]});}return [...map.values()]}

async function fetchWeather(){
  weatherError='';
  weatherModels=[];
  cloudMapData=null;
  cloudMapError='';
  locationComparisonData=null;
  locationComparisonError='';
  render();
  const loc=activeLocation();
  if(!loc)return;
  const vars='temperature_2m,dew_point_2m,relative_humidity_2m,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,precipitation,wind_speed_10m,wind_gusts_10m,wind_speed_250hPa';
  const specs=Object.entries(WEATHER_MODEL_CONFIG);
  const settled=await Promise.allSettled(specs.map(async([key,config])=>{
    const url=new URL('https://api.open-meteo.com/v1/forecast');
    url.search=new URLSearchParams({
      latitude:loc.latitude,
      longitude:loc.longitude,
      elevation:loc.elevation||'',
      hourly:vars,
      models:config.model,
      wind_speed_unit:'kmh',
      timezone:'auto',
      forecast_days:'8'
    });
    const response=await fetch(url);
    if(!response.ok)throw new Error(`${config.name}: HTTP ${response.status}`);
    const json=await response.json();
    const hourly=json.hourly;
    return{
      key,
      name:config.name,
      time:hourly.time,
      values:hourly.time.map((_,index)=>({
        temperature:hourly.temperature_2m?.[index],
        dewPoint:hourly.dew_point_2m?.[index],
        humidity:hourly.relative_humidity_2m?.[index],
        cloud:hourly.cloud_cover?.[index],
        cloudLow:hourly.cloud_cover_low?.[index],
        cloudMid:hourly.cloud_cover_mid?.[index],
        cloudHigh:hourly.cloud_cover_high?.[index],
        visibility:hourly.visibility?.[index],
        precip:hourly.precipitation?.[index],
        wind:hourly.wind_speed_10m?.[index],
        gust:hourly.wind_gusts_10m?.[index],
        jet:hourly.wind_speed_250hPa?.[index]
      }))
    };
  }));
  weatherModels=settled.filter(result=>result.status==='fulfilled').map(result=>result.value);
  const failures=settled.filter(result=>result.status==='rejected');
  if(!weatherModels.length)weatherError='Keine Wettermodelle konnten geladen werden.';
  else if(failures.length)weatherError=`${failures.length} Wettermodell(e) derzeit nicht verfügbar.`;
  render();
  fetchCloudMap();
}

function cloudMapSettings(source=profile){
  const base=standardProfile().central.cloudMap;
  return{...base,...(source?.central?.cloudMap||{})};
}
function currentCloudMapView(){
  return profile.planning.temporaryCloudMapView||profile.central.cloudMap?.defaultView||'consensus';
}
function currentCloudMapBaseMode(){
  return profile.planning.temporaryCloudMapBaseMode||cloudMapSettings().defaultBaseMode||'combined';
}
function currentCloudSmoothing(){
  return profile.planning.temporaryCloudSmoothing||cloudMapSettings().smoothing||'balanced';
}
function cloudMapValuesVisible(){
  return profile.planning.temporaryCloudMapShowValues==null?cloudMapSettings().showValues!==false:Boolean(profile.planning.temporaryCloudMapShowValues);
}
function cloudMapWeatherOverlays(){
  return{precip:true,rain:true,snow:true,...(cloudMapSettings().weatherOverlays||{}),...(profile.planning.cloudMapWeatherOverlays||{})};
}
function cloudMapRange(night){
  const rawStart=night.sunset.getTime()-4*3600000;
  const start=new Date(Math.floor(rawStart/3600000)*3600000);
  return{start,end:new Date(start.getTime()+23*3600000),times:Array.from({length:24},(_,index)=>new Date(start.getTime()+index*3600000))};
}
function cloudMapTimeStepMinutes(){return[15,30,60].includes(Number(profile.planning.cloudMapTimeStepMinutes))?Number(profile.planning.cloudMapTimeStepMinutes):clamp(Number(cloudMapSettings().timeStepMinutes)||30,15,60)}
function cloudDisplayTimes(){if(!cloudMapData?.times?.length)return[];const raw=cloudMapData.times.map(value=>new Date(value).getTime()),step=cloudMapTimeStepMinutes()*60000,start=raw[0],end=raw[raw.length-1];const result=[];for(let time=start;time<=end+1;time+=step)result.push(new Date(Math.min(time,end)).toISOString());return result}
function cloudRawPosition(displayIndex){return clamp((Number(displayIndex)||0)*cloudMapTimeStepMinutes()/60,0,Math.max(0,(cloudMapData?.times?.length||1)-1))}
function cloudMapGrid(loc,settings){
  const size=clamp(Number(settings.gridSize)||7,5,9);
  const radius=clamp(Number(settings.radiusKm)||120,40,250);
  const latPerKm=1/111.32;
  const lonPerKm=1/(111.32*Math.max(.2,Math.cos(toRad(loc.latitude))));
  const points=[];
  for(let y=0;y<size;y++){
    const northKm=radius-(2*radius*y/(size-1));
    for(let x=0;x<size;x++){
      const eastKm=-radius+(2*radius*x/(size-1));
      points.push({
        x,y,
        latitude:loc.latitude+northKm*latPerKm,
        longitude:loc.longitude+eastKm*lonPerKm,
        northKm,eastKm
      });
    }
  }
  return{size,radius,points};
}
function parseCloudApiTime(value){
  const text=String(value||'');
  return new Date(/[zZ]|[+-]\d\d:\d\d$/.test(text)?text:`${text}Z`);
}
function nearestTimeIndex(times,target){
  if(!times.length)return-1;
  let lo=0,hi=times.length-1;
  while(lo<hi){
    const mid=Math.floor((lo+hi)/2);
    if(times[mid]<target)lo=mid+1;else hi=mid;
  }
  if(lo>0&&Math.abs(times[lo-1]-target)<Math.abs(times[lo]-target))return lo-1;
  return lo;
}
function cloudMapCacheKey(loc,settings){
  return`cloud-map-v3:${selectedDateKey}:${loc.latitude.toFixed(3)}:${loc.longitude.toFixed(3)}:${settings.gridSize}:${settings.radiusKm}`;
}
async function fetchCloudModel(key,config,grid,frameTimes,signal){
  const layerKeys=['cloud','cloudLow','cloudMid','cloudHigh','precip','rain','snow'];
  const frames=frameTimes.map(()=>Object.fromEntries(layerKeys.map(layer=>[layer,new Array(grid.points.length).fill(NaN)])));
  const chunkSize=40;
  for(let offset=0;offset<grid.points.length;offset+=chunkSize){
    const chunk=grid.points.slice(offset,offset+chunkSize);
    const startDate=frameTimes[0].toISOString().slice(0,10);
    const endDate=frameTimes.at(-1).toISOString().slice(0,10);
    const url=new URL('https://api.open-meteo.com/v1/forecast');
    url.search=new URLSearchParams({
      latitude:chunk.map(point=>point.latitude.toFixed(4)).join(','),
      longitude:chunk.map(point=>point.longitude.toFixed(4)).join(','),
      hourly:'cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,precipitation,rain,snowfall',
      models:config.model,
      timezone:'GMT',
      start_date:startDate,
      end_date:endDate
    });
    const response=await fetch(url,{signal});
    if(!response.ok)throw new Error(`${config.name}: HTTP ${response.status}`);
    const payload=await response.json();
    const results=Array.isArray(payload)?payload:[payload];
    for(let localIndex=0;localIndex<results.length;localIndex++){
      const result=results[localIndex];
      const pointIndex=offset+localIndex;
      if(pointIndex>=grid.points.length||!result?.hourly?.time)continue;
      const sourceTimes=result.hourly.time.map(value=>parseCloudApiTime(value).getTime());
      frameTimes.forEach((frameTime,frameIndex)=>{
        const sourceIndex=nearestTimeIndex(sourceTimes,frameTime.getTime());
        const hourly=result.hourly;
        frames[frameIndex].cloud[pointIndex]=Number(hourly.cloud_cover?.[sourceIndex]);
        frames[frameIndex].cloudLow[pointIndex]=Number(hourly.cloud_cover_low?.[sourceIndex]);
        frames[frameIndex].cloudMid[pointIndex]=Number(hourly.cloud_cover_mid?.[sourceIndex]);
        frames[frameIndex].cloudHigh[pointIndex]=Number(hourly.cloud_cover_high?.[sourceIndex]);
        frames[frameIndex].precip[pointIndex]=Number(hourly.precipitation?.[sourceIndex]);
        frames[frameIndex].rain[pointIndex]=Number(hourly.rain?.[sourceIndex]);
        frames[frameIndex].snow[pointIndex]=Number(hourly.snowfall?.[sourceIndex]);
      });
    }
  }
  return{key,name:config.name,frames};
}
async function fetchCloudMap(force=false){
  if(!profile||currentMainTab!=='plan')return;
  const requestId=++cloudMapRequestId;
  const loc=activeLocation();
  const settings=cloudMapSettings();
  const night=nightData(selectedDateKey,loc);
  const range=cloudMapRange(night);
  const grid=cloudMapGrid(loc,settings);
  const key=cloudMapCacheKey(loc,settings);
  if(!force){
    try{
      const cached=await idbGet('cache',key);
      if(cached?.value&&Date.now()-new Date(cached.updatedAt||0).getTime()<90*60000){
        cloudMapData=cached.value;
        cloudMapError='';
        cloudMapLoading=false;
        render();
        return;
      }
    }catch(error){console.warn('Wolkenkarten-Cache nicht lesbar',error)}
  }
  cloudMapLoading=true;
  cloudMapError='';
  cloudMapData=null;
  render();
  cloudMapAbortController?.abort();
  const controller=new AbortController();
  cloudMapAbortController=controller;
  try{
    const settled=await Promise.allSettled(Object.entries(WEATHER_MODEL_CONFIG).map(([modelKey,config])=>fetchCloudModel(modelKey,config,grid,range.times,controller.signal)));
    if(requestId!==cloudMapRequestId)return;
    const models={};
    settled.forEach(result=>{if(result.status==='fulfilled')models[result.value.key]=result.value});
    const failures=settled.filter(result=>result.status==='rejected');
    if(!Object.keys(models).length)throw new Error('Keine Wolkenkartendaten konnten geladen werden.');
    cloudMapData={
      key,locationId:loc.id,locationName:loc.name,latitude:loc.latitude,longitude:loc.longitude,
      selectedDateKey,gridSize:grid.size,radiusKm:grid.radius,points:grid.points,times:range.times.map(time=>time.toISOString()),
      models,updatedAt:new Date().toISOString()
    };
    cloudMapError=failures.length?`${failures.length} Modell(e) der Wolkenkarte derzeit nicht verfügbar.`:'';
    try{await idbPut('cache',{key,value:cloudMapData,updatedAt:new Date().toISOString()})}catch(error){console.warn('Wolkenkarte konnte nicht zwischengespeichert werden',error)}
  }catch(error){
    if(requestId!==cloudMapRequestId)return;
    cloudMapError=error?.message||'Wolkenkarte konnte nicht geladen werden.';
  }finally{
    if(requestId===cloudMapRequestId){cloudMapLoading=false;cloudMapAbortController=null;render()}
  }
}
function cloudFrameValues(view,layer,frameIndex){
  if(!cloudMapData)return{values:[],spread:[]};
  const rawPosition=Number(frameIndex)||0,lower=clamp(Math.floor(rawPosition),0,cloudMapData.times.length-1),upper=clamp(Math.ceil(rawPosition),0,cloudMapData.times.length-1),fraction=rawPosition-lower;
  const interpolate=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)?a+(b-a)*fraction:Number.isFinite(a)?a:b;
  const modelValues=(model,key)=>{const a=model?.frames?.[lower]?.[layer]||[],b=model?.frames?.[upper]?.[layer]||a;return new Array(cloudMapData.points.length).fill(NaN).map((_,index)=>interpolate(Number(a[index]),Number(b[index])))};
  if(view!=='consensus'){const values=modelValues(cloudMapData.models[view],view);return{values,spread:new Array(values.length).fill(0)}}
  const weights=profile.central.weatherModels?.weights||{},count=cloudMapData.points.length,values=new Array(count).fill(NaN),spread=new Array(count).fill(NaN);
  const available=Object.entries(cloudMapData.models).map(([key,model])=>[key,modelValues(model,key)]);
  for(let index=0;index<count;index++){
    const entries=available.map(([key,array])=>({value:Number(array[index]),weight:Number(weights[key]||0)})).filter(entry=>Number.isFinite(entry.value));
    if(!entries.length)continue;
    const positive=entries.filter(entry=>entry.weight>0),weightedEntries=positive.length?positive:entries.map(entry=>({...entry,weight:1})),weightSum=weightedEntries.reduce((sum,entry)=>sum+entry.weight,0);
    const mean=weightedEntries.reduce((sum,entry)=>sum+entry.value*entry.weight,0)/weightSum;values[index]=mean;spread[index]=Math.sqrt(weightedEntries.reduce((sum,entry)=>sum+Math.pow(entry.value-mean,2)*entry.weight,0)/weightSum);
  }
  return{values,spread};
}
function cloudFrameStats(view,layer,frameIndex){
  const data=cloudFrameValues(view,layer,frameIndex);
  const finite=data.values.filter(Number.isFinite);
  const spreads=data.spread.filter(Number.isFinite);
  const center=Math.floor((cloudMapData?.points.length||1)/2);
  return{
    ...data,
    average:finite.length?finite.reduce((a,b)=>a+b,0)/finite.length:NaN,
    center:Number(data.values[center]),
    uncertainty:spreads.length?spreads.reduce((a,b)=>a+b,0)/spreads.length:NaN
  };
}
function estimateCloudMovement(view,layer,displayFrameIndex){
  if(!cloudMapData?.times?.length)return null;
  const size=cloudMapData.gridSize,rawCenter=cloudRawPosition(displayFrameIndex),base=clamp(Math.floor(rawCenter),0,cloudMapData.times.length-2),pairs=[];
  const normalized=(values)=>{const finite=values.filter(Number.isFinite);const mean=finite.reduce((a,b)=>a+b,0)/Math.max(1,finite.length),sd=Math.sqrt(finite.reduce((sum,v)=>sum+(v-mean)**2,0)/Math.max(1,finite.length))||1;return values.map(v=>Number.isFinite(v)?(v-mean)/sd:0)};
  const correlationShift=(a,b)=>{a=normalized(a);b=normalized(b);let best=null,second=null;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){if(dx===0&&dy===0)continue;let sum=0,count=0;for(let y=0;y<size;y++)for(let x=0;x<size;x++){const xx=x+dx,yy=y+dy;if(xx<0||xx>=size||yy<0||yy>=size)continue;sum+=a[y*size+x]*b[yy*size+xx];count++}const score=count?sum/count:-Infinity;const candidate={dx,dy,score};if(!best||score>best.score){second=best;best=candidate}else if(!second||score>second.score)second=candidate}if(!best)return null;return{...best,separation:best.score-(second?.score??best.score)}};
  for(let offset=-1;offset<=1;offset++){const index=base+offset;if(index<0||index>=cloudMapData.times.length-1)continue;const a=cloudFrameValues(view,layer,index).values,b=cloudFrameValues(view,layer,index+1).values,shift=correlationShift(a,b);if(shift&&shift.score>.12)pairs.push(shift)}
  if(!pairs.length)return{reliable:false,direction:'Bewegungsrichtung unsicher',distance:0,confidence:0};
  const spacing=2*cloudMapData.radiusKm/Math.max(1,size-1),vectors=pairs.map(item=>({east:item.dx*spacing,north:-item.dy*spacing,weight:Math.max(.01,item.score+item.separation)}));
  const weight=vectors.reduce((sum,item)=>sum+item.weight,0),east=vectors.reduce((sum,item)=>sum+item.east*item.weight,0)/weight,north=vectors.reduce((sum,item)=>sum+item.north*item.weight,0)/weight,distance=Math.hypot(east,north);
  const agreement=vectors.reduce((sum,item)=>{const len=Math.hypot(item.east,item.north)||1;return sum+(item.east*east+item.north*north)/(len*Math.max(distance,.001))*item.weight},0)/weight;
  const confidence=clamp((pairs.reduce((sum,item)=>sum+item.score,0)/pairs.length)*.7+agreement*.3,0,1);
  if(distance<spacing*.25||confidence<.32)return{reliable:false,direction:'Bewegungsrichtung unsicher',distance,confidence};
  const azimuth=(toDeg(Math.atan2(east,north))+360)%360;
  return{reliable:true,distance,east,north,azimuth,direction:`Richtung ${cardinal(azimuth)}`,cardinal:cardinal(azimuth),confidence};
}
function scheduleCloudMapProfileSave(){
  clearTimeout(cloudMapSaveTimer);
  cloudMapSaveTimer=setTimeout(()=>saveProfile(),500);
}
function render(){
  disposeCloudBaseMap();
  document.querySelectorAll('[data-main-tab]').forEach(button=>button.classList.toggle('active',button.dataset.mainTab===currentMainTab));
  document.getElementById('headerProfileName').textContent=profile.name;
  app.innerHTML=currentMainTab==='plan'?renderPlan():renderSettings();
  updateStaticLanguageUi();
  bindRendered();
  localizeExactText(app);
  drawMiniCharts();
  drawLargeCharts();
  drawCloudMap();
  drawSettingsHorizonCharts();
  layoutFramingOverlays();
  window.setTimeout(layoutFramingOverlays,80);
}
function dateKeys(){const today=dateKeyFor(new Date(),activeLocation().timezone);return Array.from({length:7},(_,i)=>addDays(today,i))}
function isForecastDateKey(key=selectedDateKey){return dateKeys().includes(key)}
function weatherAvailableForSelectedDate(){return isForecastDateKey(selectedDateKey)}
function renderWeatherUnavailableNotice(){return `<section class="card notice warn weather-unavailable-notice"><h2>${language==='en'?'Weather data unavailable':'Wetterdaten nicht verfügbar'}</h2><p>${language==='en'?'No reliable forecast data is available for this date. Astronomical planning, object list, Moon information and framing remain available.':'Für dieses Datum liegen keine verlässlichen Wetterdaten im Vorhersagebereich vor. Astronomische Planung, Objektliste, Mondinformationen und Rahmung bleiben verfügbar.'}</p></section>`}
function sectionVisible(key){return profile?.central?.visibleSections?.[key]!==false}

function planningWindowOptions(selected){
  return [
    ['sunset','Sonnenuntergang–Sonnenaufgang'],
    ['civil','Bürgerliche Nacht'],
    ['nautical','Nautischer Planungszeitraum'],
    ['astronomicalTwilight','Nautisch + astronomisch'],
    ['astronomicalNight','Astronomische Nacht']
  ].map(([key,label])=>`<option value="${key}" ${selected===key?'selected':''}>${label}</option>`).join('');
}
function renderFirstRunPlan(){
  return `<div data-page="plan">
    <section class="card storage-warning-card">
      <div class="eyebrow">Erststart</div>
      <h2>Bitte zuerst einen Standort anlegen</h2>
      <p>Die Produktivversion enthält bewusst keine vorgegebenen Aufnahmeorte, Teleskope oder Kameras. Lege unter <strong>Einstellungen → Standorte & Horizont</strong> deinen Aufnahmeort an. Danach kann die Planungsnacht berechnet werden.</p>
      <div class="data-actions"><button type="button" data-open-settings="locations">Standort jetzt anlegen</button><button type="button" data-open-settings="equipment" class="secondary">Ausrüstung erfassen</button><button type="button" id="firstRunRestoreBackup" class="secondary">Sicherung wiederherstellen</button></div>
      <div class="notice warn" style="margin-top:14px"><strong>Hinweis zur lokalen Speicherung:</strong> Wenn der Browser Website-Daten beim Beenden löscht, gehen lokale Standorte, Ausrüstung und Profile verloren. Prüfe dazu die Hinweise in der <button type="button" class="inline-help-link" data-open-help-section="help-browser-storage">Browser-FAQ</button>.</div>
    </section>
    <section class="card"><h2>Erste Schritte</h2><p>1. Vorhandene Sicherung importieren oder Standort anlegen und speichern. 2. Unter Ausrüstung Teleskop, Kamera und optional Setup erfassen. 3. Zur Planung zurückkehren und die Nacht berechnen lassen.</p></section>
  </div>`;
}
function renderPlan(){
  ensurePlanningObjectTypes();
  const loc=activeLocation();
  if(!loc)return renderFirstRunPlan();
  const keys=dateKeys();
  if(!selectedDateKey)selectedDateKey=keys[0];
  const hasWeatherDate=isForecastDateKey(selectedDateKey);
  const night=nightData(selectedDateKey,loc),windowRange=planningWindow(night,profile.planning.planningWindow),weather=hasWeatherDate?weatherForWindow(windowRange):null,objects=computeObjects(windowRange,night,weather);
  currentComputedObjects=objects;
  const display=profile.central.listDisplay.profiles[currentDisplayProfile()]||DISPLAY_PROFILES.standard;
  profile.planning.pageSize=display.pageSize||profile.planning.pageSize||20;
  const totalPages=Math.max(1,Math.ceil(objects.length/profile.planning.pageSize));page=clamp(page,1,totalPages);
  const start=(page-1)*profile.planning.pageSize,shown=objects.slice(start,start+profile.planning.pageSize);
  if(profile.planning.detailsOpen&&!shown.some(item=>item.object.id===profile.planning.selectedObjectId))profile.planning.detailsOpen=false;
  const currentWeather=currentWeatherView(),defaultWeather=profile.central.weatherModels.defaultView||'consensus';
  const locationOptions=profile.locations.map(item=>`<option value="${esc(item.id)}" ${item.id===loc.id?'selected':''}>${esc(item.name)}${item.id===profile.central.defaultLocationId?' (Standard)':''}</option>`).join('');
  const scope=activeScope(),camera=activeCamera(),mount=activeMount(),horizon=horizonProfileFor(loc);
  const setup=activeSetup();
  const setupOptions=(profile.equipment.setups||[]).map(item=>`<option value="${esc(item.id)}" ${item.id===setup?.id?'selected':''}>${esc(item.name)}${item.id===profile.equipment.selectedSetupId?' (Standard)':''}</option>`).join('');
  const scopeOptions=profile.equipment.telescopes.map(item=>`<option value="${esc(item.id)}" ${item.id===scope?.id?'selected':''}>${esc(item.name)}${item.id===profile.equipment.selectedTelescopeId?' (Standard)':''}</option>`).join('');
  const cameraOptions=profile.equipment.cameras.map(item=>`<option value="${esc(item.id)}" ${item.id===camera?.id?'selected':''}>${esc(item.name)}${item.id===profile.equipment.selectedCameraId?' (Standard)':''}</option>`).join('');
  const horizonOptions=horizonProfilesFor(loc).map(item=>`<option value="${esc(item.id)}" ${item.id===horizon?.id?'selected':''}>${esc(item.name)}${item.id===loc.defaultHorizonProfileId?' (Standard)':''}</option>`).join('');
  return `<div data-page="plan">
    <section class="card">
      <div class="section-title-row planning-night-header"><div class="planning-title-block"><h2>${language==='en'?'Planning night':'Planungsnacht'}</h2><div class="muted planning-night-subtitle">${language==='en'?'Location and date apply only for this planning session.<br>Set the default location in the settings.':'Standort und Datum gelten nur für diese Planung.<br>Den Standardstandort legst du in den Einstellungen fest.'}</div></div><div class="planning-night-actions">${renderAuroraButton(loc)}<button id="weatherRefresh" ${hasWeatherDate?'':'disabled'}>${language==='en'?'Refresh weather':'Wetter aktualisieren'}</button></div></div>
      <div class="planning-night-selector" style="margin-top:14px"><label class="planning-location-select">Standort für diese Planung<select id="planningLocationSelect">${locationOptions}</select><span class="planning-location-coordinates">${fmt(loc.latitude,4)}°, ${fmt(loc.longitude,4)}° · ${fmt(Number(loc.elevation)||0)} m</span></label><div class="date-buttons enhanced-date-buttons">${keys.map((key,index)=>{const info=dateButtonInfo(key,loc,index);return`<button data-date="${key}" class="${key===selectedDateKey?'active':''} date-quality-${info.className}" title="${esc(`Mond ${fmt(info.moon)} % · ${info.qualityText}`)}"><strong>${info.title}</strong><br><span class="small">${fmtDate(key,loc.timezone)}</span><br><span class="small moon-date-info">☾ ${fmt(info.moon)} %</span><br><span class="small quality-date-info">${esc(info.qualityText)}</span></button>`}).join('')}</div><label class="calendar-date-field">${language==='en'?'Calendar date':'Kalenderdatum'}<input id="planningCalendarDate" type="date" value="${esc(selectedDateKey)}"></label></div>
      <div class="grid four" style="margin-top:14px"><div class="metric"><div class="label">Sonnenuntergang</div><div class="value">${fmtTime(night.sunset,loc.timezone)}</div></div><div class="metric"><div class="label">Gewählter Zeitraum</div><div class="value">${fmtTime(windowRange.start,loc.timezone)}–${fmtTime(windowRange.end,loc.timezone)}</div><div class="small muted">${windowRange.label}</div></div><div class="metric"><div class="label">Astronomische Nacht</div><div class="value">${night.hasAstronomicalNight?`${fmtTime(night.astronomicalDusk,loc.timezone)}–${fmtTime(night.astronomicalDawn,loc.timezone)}`:'keine'}</div></div><div class="metric"><div class="label">Sonnenaufgang</div><div class="value">${fmtTime(night.sunrise,loc.timezone)}</div></div></div>
      <div class="grid four" style="margin-top:12px"><div class="metric"><div class="label">Mondaufgang</div><div class="value moon-event-value">${moonEventDisplay(night.moonrise,'rise',night,windowRange,loc)}</div></div><div class="metric"><div class="label">Mondkulmination</div><div class="value">${fmtTime(night.moonTransit,loc.timezone)} · ${fmt(night.moonMaxAltitude)}°</div></div><div class="metric"><div class="label">Monduntergang</div><div class="value moon-event-value">${moonEventDisplay(night.moonset,'set',night,windowRange,loc)}</div></div><div class="metric"><div class="label">Mondbeleuchtung</div><div class="value">${fmt(night.moonIllumination)} %</div></div></div>
    </section>
    ${sectionVisible('profiles')?`<section class="card collapsible-card">
      <details id="planningProfilesDetails" class="card-panel-details" ${profile.central.collapsed?.profiles?'':'open'}>
        <summary><div><h2>Profile für diese Planung</h2><div class="small muted">Alle Auswahlen sind temporär. Dauerhafte Standards werden ausschließlich in den Einstellungen geändert.</div></div></summary>
        <div class="card-panel-body">
          <div class="toolbar planning-profile-toolbar">
            <label>Planungszeitraum<select id="planningWindowTop">${planningWindowOptions(profile.planning.planningWindow)}</select></label>
            <label>Setup für diese Planung<select id="planSetupSelect">${setupOptions}</select></label>
            <label>Horizontprofil<select id="planHorizonProfile">${horizonOptions}</select></label>
            <label>Aufnahmequalitätsprofil<select id="planWindProfile"><option value="">Standard: ${esc(profile.central.windProfiles[profile.central.activeWindProfile].name)}</option>${Object.entries(profile.central.windProfiles).map(([key,value])=>`<option value="${key}" ${profile.planning.temporaryWindProfile===key?'selected':''}>${esc(value.name)}</option>`).join('')}</select></label>
            <label>Darstellungsprofil<select id="planDisplayProfile"><option value="">Standard: ${esc(profile.central.listDisplay.profiles[profile.central.listDisplay.activeProfile].name)}</option>${Object.entries(profile.central.listDisplay.profiles).map(([key,value])=>`<option value="${key}" ${profile.planning.temporaryDisplayProfile===key?'selected':''}>${esc(value.name)}</option>`).join('')}</select></label>
            <label>Wetterdarstellung<select id="planWeatherView"><option value="">Standard: ${esc(weatherViewLabel(defaultWeather))}</option>${WEATHER_VIEW_OPTIONS.map(([key,label])=>`<option value="${key}" ${profile.planning.temporaryWeatherView===key?'selected':''}>${optionText(label)}</option>`).join('')}</select></label>
          </div>
          <div class="small muted" style="margin-top:8px">Aktiv: ${esc(scope?.name||'–')} · ${esc(camera?.name||'–')} · ${esc(mount?.name||'keine Montierung')} · ${esc(horizon?.name||'kein Horizont')}. Änderungen wirken sofort auf Objektliste, Rahmungsbewertung und Detailansicht.</div>
        </div>
      </details>
    </section>`:''}
    ${hasWeatherDate?(((sectionVisible('weatherSummary')||sectionVisible('weatherHourly'))?renderWeather(windowRange,weather,loc,night):'')+(sectionVisible('cloudMap')?renderCloudMap(windowRange,loc,night):'')+(sectionVisible('weatherSources')?renderWeatherSourceTabs(loc,night,windowRange):'')):renderWeatherUnavailableNotice()}
    ${sectionVisible('objectSelection')?`<section class="card"><div class="section-title-row"><h2>Objektauswahl</h2><span class="muted">${objects.length} Treffer aus ${catalog.length} Katalogobjekten</span></div>${renderFilters()}${pagination(totalPages,objects.length)}${renderObjectTable(shown,visibleDisplayColumns(display),loc,windowRange,night)}${pagination(totalPages,objects.length)}</section>`:''}
  </div>`;
}
function visibilityBasisWindow(night){const key=profile.planning.visibilityBasis||'nautical';if(key==='current')return planningWindow(night,profile.planning.planningWindow);if(key==='astronomicalNight')return planningWindow(night,'astronomicalNight');if(key==='sunset')return planningWindow(night,'sunset');return planningWindow(night,'nautical')}

function objectMatchesSelectedType(object, selectedTypes){
  const selected=Array.isArray(selectedTypes)?selectedTypes:[];
  if(!selected.length)return false;
  const type=String(object?.type||'').trim();
  if(selected.includes(type))return true;
  const normalized=type.toLowerCase();
  if(selected.includes('Nebel') && normalized.includes('nebel'))return true;
  if(selected.includes('Emissionsnebel') && ['emissionsnebel','h-ii-region','hii-region','sharpless'].some(v=>normalized.includes(v)))return true;
  return false;
}
function objectSearchTerms(object){
  return uniqueObjectTerms([object?.id,object?.name,object?.constellation,object?.type,...(object?.aliases||[]),...(object?.catalogs||[])]);
}
function objectMatchesTextSearch(object,query){
  const q=normalizedCatalogSearchText(query),compact=normalizeObjectToken(query);
  if(!q&&!compact)return true;
  const terms=objectSearchTerms(object);
  const hay=normalizedCatalogSearchText(terms.join(' ')),hayCompact=normalizeObjectToken(terms.join(' '));
  return Boolean((q&&hay.includes(q))||(compact&&hayCompact.includes(compact)));
}
function objectTextSearchScore(object,query){
  const q=normalizedCatalogSearchText(query),compact=normalizeObjectToken(query);
  if(!q&&!compact)return 0;
  let best=0;
  for(const term of objectSearchTerms(object)){
    const n=normalizedCatalogSearchText(term),nc=normalizeObjectToken(term);
    if(n===q||nc===compact){best=Math.max(best,120);continue}
    if(n.startsWith(q)||nc.startsWith(compact)){best=Math.max(best,90);continue}
    if(n.includes(q)||nc.includes(compact))best=Math.max(best,55);
  }
  return best;
}
function computeObjects(window,night,weather){
  const p=profile.planning,needle=String(p.search||'').trim(),directNeedle=String(p.directSearch||'').trim(),loc=activeLocation();
  const durationWindow=visibilityBasisWindow(night),minSize=Number(p.minSize)||0,maxSize=Number(p.maxSize)||0;
  const directActive=Boolean(directNeedle);
  const source=directActive?catalog.filter(o=>objectMatchesTextSearch(o,directNeedle)):catalog
    .filter(o=>objectMatchesCatalogSelection(o,p.catalogs))
    .filter(o=>objectMatchesSelectedType(o,p.types))
    .filter(o=>o.magnitude==null||o.magnitude<=p.maxMagnitude)
    .filter(o=>{const size=Number(o.majorArcMin)||0;if(size<=0)return !p.excludeNoSize;return size>=minSize&&(!maxSize||size<=maxSize)})
    .filter(o=>{const selected=Array.isArray(p.selectedFilters)&&p.selectedFilters.length?p.selectedFilters:DEFAULT_SELECTED_FILTERS;const set=recommendedFilterSet(o);if(!set.size)return selected.includes('NO_FILTER');return [...set].some(key=>selected.includes(key))})
    .filter(o=>{const max=Number(p.surfaceBrightnessMax)||99;if(o.surfaceBrightness==null||!Number.isFinite(Number(o.surfaceBrightness)))return p.showNoSurfaceBrightness!==false;return Number(o.surfaceBrightness)<=max})
    .filter(o=>!needle||objectMatchesTextSearch(o,needle));
  const mapped=source.map(object=>{const stats=objectStats(object,window,loc,p.minAltitude),durationStats=objectStats(object,durationWindow,loc,p.minAltitude),framing=framingAnalysis(object),bestHour=bestObjectHour(object,night,loc,p.minAltitude);return{object,stats:{...stats,visibleHours:durationStats.visibleHours},displayStats:stats,bestHour,score:scoreObject(object,{...stats,visibleHours:durationStats.visibleHours},weather,window,night),fit:framing.status,framing}});
  if(directActive)return mapped.sort((a,b)=>objectTextSearchScore(b.object,directNeedle)-objectTextSearchScore(a.object,directNeedle)||b.score-a.score||a.object.id.localeCompare(b.object.id,'de'));
  return mapped
    .filter(x=>x.score>=Number(p.minScore||0))
    .filter(x=>x.stats.maxAltitude>=p.minAltitude&&x.stats.visibleHours>=p.minVisibleHours&&(x.stats.moonDistance>=p.minMoonDistance||x.stats.moonAltitude<=0)&&(!p.onlyFits||x.framing.code!=='too-large'))
    .filter(x=>(p.framingFilter||[]).includes(objectFramingFilterBucket(x.framing.code)))
    .sort((a,b)=>b.score-a.score)
}
function renderFilters(){
  ensurePlanningObjectTypes();
  const cats=['Messier','NGC','IC','Sh2','Abell','Zusatzkatalog',...EXTRA_CATALOGS];
  const types=allObjectTypes();
  const minDM=arcMinToDegMin(profile.planning.minSize),maxDM=arcMinToDegMin(profile.planning.maxSize);
  const sizeOptions=(profile.central.sizeProfiles||defaultSizeProfiles()).map(item=>`<option value="${esc(item.id)}" ${profile.planning.sizeProfileId===item.id?'selected':''}>${esc(item.name)} – ${formatDegMinArc(degMinToArcMin(item.minDeg,item.minMin))} bis ${formatDegMinArc(degMinToArcMin(item.maxDeg,item.maxMin))}${item.excludeNoSize?' · ohne Größenangabe ausblenden':''}</option>`).join('');
  const typeProfileOptions=(profile.central.objectTypeProfiles||defaultObjectTypeProfiles()).map(item=>`<option value="${esc(item.id)}" ${profile.planning.objectTypeProfileId===item.id&&!profile.planning.objectTypeProfileCustom?'selected':''}>${esc(item.name)}${item.id==='types-all'||!item.types?.length?' – alle Typen':` – ${item.types.length} Typen`}</option>`).join('');
  const typeWarning=!profile.planning.types?.length?'<div class="notice warn" style="margin-top:10px">Bitte mindestens einen Objekttyp auswählen.</div>':'';
  const active=['basis','catalogs','types'].includes(currentObjectFilterTab)?currentObjectFilterTab:'basis';
  return `<details ${profile.central.collapsed.filters?'':'open'} id="filterDetails">
    <summary>Filter</summary>
    <div class="filter-tabs" role="tablist" aria-label="Objektfilter" style="margin-top:13px">
      <button type="button" data-filter-tab="basis" class="${active==='basis'?'active':''}">Basisfilter</button>
      <button type="button" data-filter-tab="catalogs" class="${active==='catalogs'?'active':''}">Kataloge & Aufnahme</button>
      <button type="button" data-filter-tab="types" class="${active==='types'?'active':''}">Objekttypen</button>
    </div>
    <div class="filter-tab-panel ${active==='basis'?'active':''}" data-filter-tab-panel="basis">
      <div class="filters filter-main-grid">
        <label class="numeric-compact filter-area-score"><span class="field-label">Mindestbewertung</span><input id="minScore" type="number" min="0" max="100" step="1" value="${Number(profile.planning.minScore)||0}"><span class="small muted">0 = keine Einschränkung</span></label>
        <label class="numeric-compact filter-area-mag"><span class="field-label">Max. Magnitude (mag)</span><input id="maxMagnitude" type="number" step="0.1" value="${profile.planning.maxMagnitude}"><span class="small muted">&nbsp;</span></label>
        <label class="numeric-compact filter-area-surface"><span class="field-label">Max. Flächenhelligkeit</span><input id="surfaceBrightnessMax" type="number" step="0.1" value="${Number(profile.planning.surfaceBrightnessMax)||99}"><span class="small muted">Objekte mit fehlender Angabe bleiben sichtbar.</span></label>
        <label class="numeric-compact filter-area-alt"><span class="field-label">Mindesthöhe (°)</span><input id="minAltitude" type="number" min="0" max="90" value="${profile.planning.minAltitude}"><span class="small muted">&nbsp;</span></label>
        <label class="numeric-compact filter-area-visible"><span class="field-label">Mindestdauer sichtbar (h)</span><input id="minVisibleHours" type="number" step="0.25" min="0" value="${profile.planning.minVisibleHours}"><span class="small muted">&nbsp;</span></label>
        <label class="numeric-compact filter-area-moon"><span class="field-label">Mind. Mondabstand (°)</span><input id="minMoonDistance" type="number" min="0" max="180" value="${profile.planning.minMoonDistance}"><span class="small muted">&nbsp;</span></label>
        <label class="filter-area-basis"><span class="field-label">Basis der Mindestdauer</span><select id="visibilityBasis"><option value="nautical" ${profile.planning.visibilityBasis==='nautical'?'selected':''}>Nautischer Planungszeitraum</option><option value="astronomicalNight" ${profile.planning.visibilityBasis==='astronomicalNight'?'selected':''}>Astronomische Nacht</option><option value="sunset" ${profile.planning.visibilityBasis==='sunset'?'selected':''}>Sonnenuntergang bis Sonnenaufgang</option><option value="current" ${profile.planning.visibilityBasis==='current'?'selected':''}>Aktuell gewählter Planungszeitraum</option></select><span class="small muted basis-duration-hint">Mindestzeit über Mindesthöhe und persönlichem Horizont.</span></label>
      </div>
      <div class="size-filter-row">
        <label class="size-profile-field">Objektgrößenprofil<select id="sizeProfileSelect"><option value="">Benutzerdefiniert</option>${sizeOptions}</select></label>
        <label class="numeric-compact">Mindestgröße Grad<input id="minSizeDeg" type="number" min="0" max="60" value="${minDM.deg}"></label>
        <label class="numeric-compact">Mindestgröße Bogenminuten<input id="minSizeMin" type="number" min="0" max="59" value="${minDM.min}"></label>
        <label class="numeric-compact">Maximalgröße Grad<input id="maxSizeDeg" type="number" min="0" max="60" value="${maxDM.deg}"></label>
        <label class="numeric-compact">Maximalgröße Bogenminuten<input id="maxSizeMin" type="number" min="0" max="59" value="${maxDM.min}"></label>
      </div>
      <div class="chip-list" style="margin-top:12px"><label class="chip"><input id="excludeNoSize" type="checkbox" ${profile.planning.excludeNoSize?'checked':''}>Objekte ohne Größenangabe ausschließen</label><label class="chip"><input id="showNoSurfaceBrightness" type="checkbox" ${profile.planning.showNoSurfaceBrightness!==false?'checked':''}>Objekte ohne Flächenhelligkeit anzeigen</label></div>
      <div class="filter-search-bottom-row dual-search-row">
        <label class="filter-search-field ${String(profile.planning.search||'').trim()?'search-active':''}">Suche innerhalb der aktiven Filter<input id="objectSearch" value="${esc(profile.planning.search)}" placeholder="M31, NGC, Rosette …"><span class="small muted">Automatische Aktualisierung nach 1,5 Sekunden; Enter sucht sofort.</span></label>
        <label class="filter-search-field ${String(profile.planning.directSearch||'').trim()?'search-active':''}">Direktsuche ohne weitere Filter<input id="objectDirectSearch" value="${esc(profile.planning.directSearch||'')}" placeholder="SH 2-119, NGC 7000, Andromeda …"><span class="small muted">Ignoriert alle anderen Filter.</span></label>
      </div>${String(profile.planning.directSearch||'').trim()?'<div class="notice warn direct-search-notice">Direktsuche aktiv: andere Filter werden ignoriert.</div>':''}
    </div>
    <div class="filter-tab-panel ${active==='catalogs'?'active':''}" data-filter-tab-panel="catalogs">
      <div class="small muted">Kataloge</div>
      <div class="chip-list">${cats.map(cat=>`<label class="chip"><input type="checkbox" data-catalog="${cat}" ${profile.planning.catalogs.includes(cat)?'checked':''}>${cat==='Sh2'?'Sharpless 2':cat==='Abell'?'Abell-PN':cat}</label>`).join('')}</div>
      <div class="small muted" style="margin-top:12px">Empfohlene Aufnahmefilter</div>
      <div class="chip-list">${FILTER_KEYS.map(key=>`<label class="chip"><input type="checkbox" data-rec-filter="${key}" ${profile.planning.selectedFilters.includes(key)?'checked':''}>${esc(FILTER_LABELS[key])}</label>`).join('')}</div>
      <div class="small muted" style="margin-top:12px">Rahmung</div>
      <div class="chip-list">${FRAMING_FILTERS.map(([key,label])=>`<label class="chip"><input type="checkbox" data-framing-filter="${key}" ${profile.planning.framingFilter.includes(key)?'checked':''}>${esc(label)}</label>`).join('')}</div>
      <label class="chip" style="margin-top:12px"><input id="onlyFits" type="checkbox" ${profile.planning.onlyFits?'checked':''}>Nur Objekte, die auf den Sensor passen</label>
    </div>
    <div class="filter-tab-panel ${active==='types'?'active':''}" data-filter-tab-panel="types">
      <div class="small muted">Objekttyp-Profil</div>
      <label class="inline-select"><select id="objectTypeProfileSelect"><option value="custom" ${profile.planning.objectTypeProfileCustom?'selected':''}>Benutzerdefiniert / temporär geändert</option>${typeProfileOptions}</select><span class="small muted">${profile.planning.objectTypeProfileCustom?'Temporär geändert, gespeichertes Profil bleibt unverändert.':esc(selectedTypeProfileName())}</span></label>
      <div class="small muted" style="margin-top:12px">Objekttypen (mindestens ein Typ erforderlich)</div>
      <div class="chip-list">${types.map(type=>`<label class="chip"><input type="checkbox" data-object-type="${esc(type)}" ${profile.planning.types.includes(type)?'checked':''}>${esc(type)}</label>`).join('')}</div>${typeWarning}
    </div>
    <div class="filter-action-row"><button id="resetBasisFilters" type="button" class="secondary">${language==='en'?'Reset basic filters':'Basisfilter zurücksetzen'}</button><button id="applyObjectFilters" type="button">${language==='en'?'Apply filters':'Filter anwenden'}</button></div>
  </details>`;
}
function pagination(totalPages,total){const pageSize=profile.planning.pageSize;const buttons=[];const from=Math.max(1,page-2),to=Math.min(totalPages,page+2);for(let i=from;i<=to;i++)buttons.push(`<button data-page-number="${i}" class="${i===page?'active':''}">${i}</button>`);return `<div class="pagination"><div class="result-summary"><span>${total} Treffer</span><label>Objekte/Seite <select id="pageSizeSelect"><option>10</option><option>20</option><option>50</option><option>100</option></select></label></div><div class="pages"><button data-page-number="1" ${page===1?'disabled':''}>«</button><button data-page-number="${page-1}" ${page===1?'disabled':''}>‹</button>${buttons.join('')}<button data-page-number="${page+1}" ${page===totalPages?'disabled':''}>›</button><button data-page-number="${totalPages}" ${page===totalPages?'disabled':''}>»</button></div></div>`}
function renderObjectTable(items,columns,loc,windowRange,night){
  const heads={
    score:'Bewertung',name:'Objekt',wikipedia:'Wiki',maxAltitude:'Max. Höhe',visibleHours:'<span class="th-wrap">Sichtbar<br>Mindesthöhe</span>',visibleHorizon:'<span class="th-wrap">Sichtbar über<br>pers. Horizont</span>',visibleHorizonAndMin:'<span class="th-wrap">Sichtbar über<br>pers. Horizont +<br>Mindesthöhe</span>',meridian:'Meridian',
    framing:'Framing',miniChart:'Höhenprofil',bestHour:'Beste Stunde',moonDistance:'Mondabstand',
    weather:'Wetter',size:'Größe',magnitude:'Mag.',filters:'Filter'
  };
  const openItem=items.find(item=>profile.planning.detailsOpen&&profile.planning.selectedObjectId===item.object.id);
  const body=items.map(item=>{
    const object=item.object;
    const isOpen=profile.planning.detailsOpen&&profile.planning.selectedObjectId===object.id;
    return `<tr class="object-row ${isOpen?'selected':''}" data-object-row="${esc(object.id)}" tabindex="0" aria-expanded="${isOpen?'true':'false'}">${columns.map(column=>objectCell(column,item,loc,windowRange,night)).join('')}</tr>`;
  }).join('');
  const detail=openItem?`<div class="object-detail-outside">${renderObjectDetails(openItem.object,windowRange,loc,night)}</div>`:'';
  return `<div class="object-list-shell"><div class="object-table-wrap"><table class="object-table"><thead><tr>${columns.map(column=>`<th class="col-${esc(column)}">${heads[column]||column}</th>`).join('')}</tr></thead><tbody>${body||`<tr><td colspan="${columns.length}">Keine Objekte entsprechen den Filtern.</td></tr>`}</tbody></table></div>${detail}</div>`;
}
function objectCell(column,item,loc,windowRange,night){
  const object=item.object;
  const stats=item.stats;
  switch(column){
    case'score':return`<td><span class="score-badge ${scoreClass(item.score)}">${fmt(item.score)}</span></td>`;
    case'name':{const isTarget=targetObjectIds().has(object.id);return`<td><div class="object-name">${esc(object.id)} · ${esc(object.name)}</div><div class="small muted">${esc(object.type)} · ${esc(object.constellation)} · ${esc(object.catalogs.join(', '))}</div><button type="button" class="target-inline-button ${isTarget?'active':''}" data-toggle-target="${esc(object.id)}">${isTarget?'✓ In Meine Aufnahmeziele':'Zu Meine Aufnahmeziele hinzufügen'}</button></td>`;}
    case'wikipedia':return`<td class="wiki-cell"><button type="button" class="wiki-inline-button" data-wikipedia-object="${esc(object.id)}" title="Wikipedia" aria-label="Wikipedia für ${esc(object.id)} öffnen">W</button></td>`;
    case'maxAltitude':return`<td>${fmt(stats.maxAltitude)}°</td>`;
    case'visibleHours':return`<td title="Zeit oberhalb der eingestellten Mindesthöhe innerhalb der gewählten Basis der Mindestdauer."><strong>${fmt(stats.minAltitudeVisibleHours,1)} h</strong></td>`;
    case'visibleHorizon':return`<td title="Zeit oberhalb des aktiven persönlichen Horizontprofils."><strong>${fmt(stats.horizonVisibleHours,1)} h</strong></td>`;
    case'visibleHorizonAndMin':return`<td title="Zeit, in der das Objekt gleichzeitig über persönlichem Horizont und über Mindesthöhe steht."><strong>${fmt(stats.visibleHours,1)} h</strong></td>`;
    case'meridian':return`<td>${fmtTime(stats.meridian,loc.timezone)}<br><span class="small muted">${fmt(stats.maxAltitude)}°</span></td>`;
    case'framing':return`<td><button data-frame-object="${esc(object.id)}">${esc(item.fit)}</button><div class="small muted">Mindestrand ${Number.isFinite(item.framing?.minMargin)?fmt(item.framing.minMargin,1)+' %':'–'}</div></td>`;
    case'miniChart':return`<td><canvas class="mini-chart" width="230" height="92" data-points="${encodeURIComponent(JSON.stringify(stats.points.map(point=>[point.t.getTime(),point.alt])))}" data-horizon-points="${encodeURIComponent(JSON.stringify(stats.points.map(point=>[point.t.getTime(),point.horizonAlt??0])))}" data-show-horizon="${profile.central.miniHorizon?.show!==false?'1':'0'}" data-start="${windowRange.start.getTime()}" data-end="${windowRange.end.getTime()}" data-civil-start="${night.civilDusk.getTime()}" data-civil-end="${night.civilDawn.getTime()}" data-astro-start="${dateMs(night.astronomicalDusk)}" data-astro-end="${dateMs(night.astronomicalDawn)}" data-naut-start="${night.nauticalDusk.getTime()}" data-naut-end="${night.nauticalDawn.getTime()}" data-min-alt="${profile.planning.minAltitude}"></canvas>${profile.central.miniHorizon?.show!==false?`<div class="mini-chart-caption muted">Horizontlinie</div>`:''}</td>`;
    case'bestHour':case'bestTime':return`<td>${item.bestHour?`${fmtTime(item.bestHour.time,loc.timezone)}<br><span class="small muted">Qualität ${fmt(item.bestHour.quality)} · ${fmt(item.bestHour.altitude)}°</span>`:'<span class="small muted">Keine geeignete Stunde im nautischen Zeitraum</span>'}</td>`;
    case'moonDistance':return`<td>${fmt(stats.moonDistance)}°</td>`;
    case'weather':return`<td>${weatherModels.length?esc(weatherViewLabel()):'–'}</td>`;
    case'size':return`<td>${fmt(object.majorArcMin)}′ × ${fmt(object.minorArcMin)}′</td>`;
    case'magnitude':return`<td>${object.magnitude??'–'}${object.magnitude!=null?' mag':''}</td>`;
    case'filters':return`<td>${esc((object.recommendedFilters||[]).join(', ')||'–')}</td>`;
    default:return'<td>–</td>';
  }
}

function detailTimeState(o,night,loc){
  const fraction=clamp(Number(profile.planning.detailTimeFraction)||0,0,1);
  const time=new Date(night.sunset.getTime()+(night.sunrise-night.sunset)*fraction);
  const altitudeValue=altitude(o.raHours,o.decDeg,time,loc.latitude,loc.longitude);
  const azimuthValue=azimuth(o.raHours,o.decDeg,time,loc.latitude,loc.longitude);
  return{fraction,time,altitude:altitudeValue,azimuth:azimuthValue};
}
function sampleObjectTrack(o,start,end,loc,horizonEntry=null,count=361){
  const startMs=start instanceof Date?start.getTime():Number(start);
  const endMs=end instanceof Date?end.getTime():Number(end);
  if(!Number.isFinite(startMs)||!Number.isFinite(endMs)||endMs<=startMs)return[];
  const duration=endMs-startMs;
  const steps=Math.max(24,Math.min(720,Number(count)||361));
  return Array.from({length:steps},(_,index)=>{
    const time=startMs+duration*index/(steps-1);
    const date=new Date(time);
    const alt=altitude(o.raHours,o.decDeg,date,loc.latitude,loc.longitude);
    const az=azimuth(o.raHours,o.decDeg,date,loc.latitude,loc.longitude);
    const horizonAlt=horizonEntry?horizonAt(loc,az,horizonEntry.id):horizonAt(loc,az);
    return[time,Number(alt.toFixed(3)),Number(az.toFixed(3)),Number(horizonAlt.toFixed(3))];
  });
}

function hourlyObjectSamples(o,night,loc){
  const samples=[];
  let previousKey='';
  for(let time=night.sunset.getTime();time<=night.sunrise.getTime();time+=60000){
    const date=new Date(time);
    const clock=clockInputValue(date,loc.timezone);
    if(clock.endsWith(':00')&&clock!==previousKey){
      const altitudeValue=altitude(o.raHours,o.decDeg,date,loc.latitude,loc.longitude);
      const azimuthValue=azimuth(o.raHours,o.decDeg,date,loc.latitude,loc.longitude);
      samples.push({time,clock,altitude:altitudeValue,azimuth:azimuthValue});
      previousKey=clock;
    }
  }
  return samples;
}
function renderDetailTimeControls(o,night,loc,variant='altitude'){
  const state=detailTimeState(o,night,loc);
  const points=sampleObjectTrack(o,night.sunset,night.sunrise,loc,null,361).map(point=>[point[0],point[1],point[2]]);
  return`<div class="detail-time-controller" data-detail-time-controller data-start="${night.sunset.getTime()}" data-end="${night.sunrise.getTime()}" data-timezone="${esc(loc.timezone)}" data-points="${encodeURIComponent(JSON.stringify(points))}">
    <div class="detail-time-head">
      <div><div class="eyebrow">Gewählte Aufnahmezeit</div><strong data-detail-time-label>${fmtDateTime(state.time,loc.timezone)}</strong><div class="small muted" data-detail-time-position>Höhe ${fmt(state.altitude)}° · Azimut ${fmt(state.azimuth)}° (${cardinal(state.azimuth)})</div></div>
      <div class="detail-time-actions">
        <button type="button" data-detail-time-step="-15">−15 min</button>
        <label>Uhrzeit<input type="time" data-detail-time-clock value="${clockInputValue(state.time,loc.timezone)}"></label>
        <button type="button" data-detail-time-step="15">+15 min</button>
        ${variant==='horizon'?`<label class="chip"><input type="checkbox" data-detail-ground-toggle ${profile.planning.showGroundHorizon!==false?'checked':''}>Boden/Horizont anzeigen</label>`:''}
      </div>
    </div>
    <input class="detail-time-slider" type="range" min="0" max="1000" step="1" value="${Math.round(state.fraction*1000)}" data-detail-time-slider aria-label="Zeit zwischen Sonnenuntergang und Sonnenaufgang">
    <div class="detail-time-limits"><span>${fmtTime(night.sunset,loc.timezone)}</span><span>${fmtTime(night.sunrise,loc.timezone)}</span></div>
  </div>`;
}
function renderTwilightLegend(hasAstronomicalNight=false){
  return`<div class="twilight-legend" aria-label="Legende der Dämmerungsphasen">
    <span><i class="legend-civil"></i>Bürgerliche Dämmerung</span>
    <span><i class="legend-nautical"></i>Nautische Dämmerung</span>
    <span><i class="legend-astronomical"></i>Astronomische Dämmerung</span>
    ${hasAstronomicalNight?'<span><i class="legend-night"></i>Astronomische Nacht</span>':''}
    <span><i class="legend-selected"></i>Gewählter Planungszeitraum</span>
    <span><i class="legend-current"></i>Gewählte Aufnahmezeit</span>
  </div>`;
}
function renderHourlyAltitudeStrip(o,night,loc){
  const samples=hourlyObjectSamples(o,night,loc);
  return`<div class="hourly-altitude-strip" aria-label="Objekthöhe je voller Stunde">${samples.map(sample=>`<div class="hourly-altitude-item"><strong>${esc(sample.clock)}</strong><span>${fmt(sample.altitude)}°</span><small>${cardinal(sample.azimuth)}</small></div>`).join('')}</div>`;
}
function renderObjectDetails(o,windowRange,loc,night){
  const fullNight={start:night.sunset,end:night.sunrise},horizonEntry=horizonProfileFor(loc);
  const fullStats=objectStats(o,fullNight,loc,profile.planning.minAltitude),selectedStats=objectStats(o,windowRange,loc,profile.planning.minAltitude);
  const altitudePoints=sampleObjectTrack(o,night.sunset,night.sunrise,loc,horizonEntry,361);
  const horizonPoints=Array.from({length:HORIZON_POINT_COUNT},(_,index)=>{const az=horizonAzForIndex(index);return[az,Number(horizonAt(loc,az,horizonEntry?.id).toFixed(3))]});
  const obstacles=horizonObstacles(loc,horizonEntry?.id).map(item=>item.type==='free'?{type:'free',name:item.name||'Freies Hindernis',points:Array.isArray(item.points)?item.points:[],closed:Boolean(item.closed)}:{name:item.name||'Hindernis',azimuth:Number(item.azimuth)||0,altitude:Number(item.altitude)||0});
  const detailTime=detailTimeState(o,night,loc),horizonOptions=horizonProfilesFor(loc).map(item=>`<option value="${esc(item.id)}" ${item.id===horizonEntry?.id?'selected':''}>${esc(item.name)}${item.id===loc.defaultHorizonProfileId?' (Standard)':''}</option>`).join('');
  const isTarget=targetObjectIds().has(o.id);
  return`<div class="object-detail-card" id="objectDetail-${esc(o.id)}">
    <div class="object-detail-header"><div><div class="eyebrow">Objektdetails</div><h2>${esc(o.id)} · ${esc(o.name)}</h2><div class="small muted">${esc(o.type)} · ${esc(o.constellation)} · Größe ${fmt(o.majorArcMin)}′ × ${fmt(o.minorArcMin)}′ · Filter ${esc((o.recommendedFilters||[]).join(', ')||'–')}</div></div><div class="data-actions"><button type="button" data-toggle-target="${esc(o.id)}" class="${isTarget?'active':''}">${isTarget?'Aus Meine Aufnahmeziele entfernen':'Zu Meine Aufnahmeziele hinzufügen'}</button><button type="button" data-wikipedia-object="${esc(o.id)}">Wikipedia</button><button type="button" class="close-detail-button" data-close-object-details aria-label="Detailansicht schließen">✕ Details schließen</button></div></div>
    <div class="grid four object-detail-metrics"><div class="metric"><div class="label">Maximalhöhe im Planungszeitraum</div><div class="value">${fmt(selectedStats.maxAltitude)}°</div></div><div class="metric"><div class="label">Beste Stunde im nautischen Zeitraum</div><div class="value">${(()=>{const best=bestObjectHour(o,night,loc,profile.planning.minAltitude);return best?`${fmtTime(best.time,loc.timezone)} · Q ${fmt(best.quality)}`:'Keine geeignete Stunde'})()}</div></div><div class="metric"><div class="label">Sichtbar über Grenzhöhe</div><div class="value">${fmt(selectedStats.visibleHours,1)} h</div></div><div class="metric"><div class="label">Mondabstand</div><div class="value">${fmt(selectedStats.moonDistance)}°</div></div></div>
    ${renderFraming(o,windowRange,loc)}
    <details class="object-chart-panel" ${profile.central.detailPanels?.altitudeCollapsed?'':'open'}><summary>Höhenkurve</summary><div class="chart-description">Sonnenuntergang bis Sonnenaufgang; der gewählte Planungszeitraum ist hervorgehoben. Schieberegler, Uhrzeitfeld, Kurvenklick und Horizontansicht verwenden dieselbe Aufnahmezeit.</div>${renderDetailTimeControls(o,night,loc,'altitude')}<canvas class="large-altitude-chart" width="1400" height="430" data-points="${encodeURIComponent(JSON.stringify(altitudePoints))}" data-start="${night.sunset.getTime()}" data-end="${night.sunrise.getTime()}" data-selected-start="${windowRange.start.getTime()}" data-selected-end="${windowRange.end.getTime()}" data-civil-start="${night.civilDusk.getTime()}" data-civil-end="${night.civilDawn.getTime()}" data-naut-start="${night.nauticalDusk.getTime()}" data-naut-end="${night.nauticalDawn.getTime()}" data-astro-start="${dateMs(night.astronomicalDusk)}" data-astro-end="${dateMs(night.astronomicalDawn)}" data-current-time="${detailTime.time.getTime()}" data-min-alt="${profile.planning.minAltitude}" data-timezone="${esc(loc.timezone)}"></canvas>${renderTwilightLegend(night.hasAstronomicalNight)}${renderHourlyAltitudeStrip(o,night,loc)}</details>
    <details class="object-chart-panel" ${profile.central.detailPanels?.horizonCollapsed?'':'open'}><summary>Horizontansicht</summary><div class="chart-description horizon-detail-header"><span>Objektbahn und persönlicher Horizont. Die Aufnahmezeit ist mit der Höhenkurve synchronisiert.</span><label>Horizontprofil für diese Planung<select id="detailHorizonProfileSelect">${horizonOptions}</select></label></div>${renderDetailTimeControls(o,night,loc,'horizon')}<canvas class="large-horizon-chart" width="1400" height="430" data-horizon="${encodeURIComponent(JSON.stringify(horizonPoints))}" data-track="${encodeURIComponent(JSON.stringify(altitudePoints.map(point=>[point[2],point[1],point[0]])))}" data-obstacles="${encodeURIComponent(JSON.stringify(obstacles))}" data-start="${night.sunset.getTime()}" data-end="${night.sunrise.getTime()}" data-selected-start="${windowRange.start.getTime()}" data-selected-end="${windowRange.end.getTime()}" data-civil-start="${night.civilDusk.getTime()}" data-civil-end="${night.civilDawn.getTime()}" data-naut-start="${night.nauticalDusk.getTime()}" data-naut-end="${night.nauticalDawn.getTime()}" data-astro-start="${dateMs(night.astronomicalDusk)}" data-astro-end="${dateMs(night.astronomicalDawn)}" data-current-time="${detailTime.time.getTime()}" data-min-alt="${profile.planning.minAltitude}" data-show-ground="${profile.planning.showGroundHorizon!==false}" data-timezone="${esc(loc.timezone)}"></canvas></details>
  </div>`;
}

function renderWeather(windowRange,summary,loc,night){
  const notice=weatherError?`<div class="notice warn">${esc(weatherError)}</div>`:'';
  const summaryOpen=!profile.central.collapsed?.weatherSummary;
  const hourlyOpen=!(profile.central.collapsed?.weatherHourly??profile.central.collapsed?.weather);
  if(!weatherModels.length)return`<section class="card weather-card collapsible-card"><details id="weatherSummaryDetails" class="card-panel-details" ${summaryOpen?'open':''}><summary><div><div class="eyebrow">Wettermodelle</div><h2>Wetter und Aufnahmequalität</h2></div></summary><div class="card-panel-body">${notice}<div class="loading-card"><div class="spinner"></div><p>Wettermodelle werden geladen …</p></div></div></details></section><section class="card weather-card collapsible-card"><details id="weatherHourlyDetails" class="card-panel-details" ${hourlyOpen?'open':''}><summary><div><h2>Stündlicher Wetterverlauf</h2><div class="small muted">Sonnenuntergang bis Sonnenaufgang</div></div><button type="button" id="openMultiNightWeather" class="secondary">Mehrnächte-Wetterverlauf öffnen</button></summary><div class="card-panel-body"><div class="loading-card"><div class="spinner"></div><p>Stündliche Modellwerte werden geladen …</p></div></div></details></section>`;
  const selectedSummary=summary||weatherForWindow(windowRange);
  if(!selectedSummary)return`<section class="card weather-card collapsible-card"><details id="weatherSummaryDetails" class="card-panel-details" ${summaryOpen?'open':''}><summary><div><div class="eyebrow">Wettermodelle</div><h2>Wetter und Aufnahmequalität</h2></div></summary><div class="card-panel-body">${notice}<div class="notice warn">Für diesen Planungszeitraum liegen noch keine stündlichen Modellwerte vor.</div></div></details></section>`;
  const unit=windUnitLabel();
  const fullNight={start:night.sunset,end:night.sunrise};
  const rows=weatherRowsForWindow(fullNight,currentWeatherView());
  const view=currentWeatherView();
  const modelWeights=profile.central.weatherModels?.weights||{};
  const weightText=Object.entries(WEATHER_MODEL_CONFIG).map(([key,cfg])=>`${cfg.name} ${Number(modelWeights[key]??0)} %`).join(' · ');
  const valueClass=(value,goodMin=70,warnMin=45)=>!Number.isFinite(value)?'':value>=goodMin?'good':value>=warnMin?'warn':'bad';
  const cloudClass=value=>thresholdClass(value,25,60,true);
  const dewClass=value=>thresholdClass(value,profile.central.dew.green,profile.central.dew.yellow,false);
  const jetClass=value=>thresholdClass(windFromKmh(value),profile.central.jet.green,profile.central.jet.yellow,true);
  const selectedJetClass=thresholdClass(selectedSummary.jet,profile.central.jet.green,profile.central.jet.yellow,true);
  const summaryCard=`<section class="card weather-card collapsible-card">
    <details id="weatherSummaryDetails" class="card-panel-details" ${summaryOpen?'open':''}>
      <summary><div><div class="eyebrow">Wettermodelle</div><h2>Wetter und Aufnahmequalität</h2></div><div class="weather-model-summary"><strong>${esc(weatherViewLabel(view))}</strong><div class="small muted">${view==='consensus'?esc(weightText):'Einzelmodell ohne Mittelung'}</div></div></summary>
      <div class="card-panel-body">${notice}
        <div class="grid four weather-summary-grid">
          <div class="metric"><div class="label">Wolken gesamt</div><div class="value ${valueClass(100-selectedSummary.cloud)}">${fmt(selectedSummary.cloud)} %</div></div>
          <div class="metric"><div class="label">Effektive Transparenz</div><div class="value ${valueClass(selectedSummary.transparency)}">${fmt(selectedSummary.transparency)}/100</div><div class="small muted">Atmosphäre ohne Wolken: ${fmt(selectedSummary.atmosphericTransparency)}/100</div></div>
          <div class="metric"><div class="label">Seeing-Tendenz</div><div class="value ${valueClass(selectedSummary.seeing)}">${fmt(selectedSummary.seeing)}/100</div></div>
          <div class="metric"><div class="label">Tauabstand</div><div class="value ${dewClass(selectedSummary.dewGap)}">${fmt(selectedSummary.dewGap,1)} °C</div></div>
          <div class="metric"><div class="label">Wind</div><div class="value ${windQualityClass(selectedSummary.windKmh)}">${fmt(selectedSummary.wind,1)} ${unit}</div></div>
          <div class="metric"><div class="label">Böen maximal</div><div class="value ${windQualityClass(selectedSummary.gustKmh,'gust')}">${fmt(selectedSummary.gust,1)} ${unit}</div></div>
          <div class="metric"><div class="label">Jetstream</div><div class="value ${selectedJetClass}">${fmt(selectedSummary.jet,1)} ${unit}</div></div>
          <div class="metric"><div class="label">Bewerteter Zeitraum</div><div class="value">${fmtTime(windowRange.start,loc.timezone)}–${fmtTime(windowRange.end,loc.timezone)}</div><div class="small muted">${esc(windowRange.label)}</div></div>
        </div>
      </div>
    </details>
  </section>`;
  const hourlyCard=`<section class="card weather-card collapsible-card">
    <details id="weatherHourlyDetails" class="card-panel-details" ${hourlyOpen?'open':''}>
      <summary><div><h2>Stündlicher Wetterverlauf</h2><div class="small muted">Sonnenuntergang bis Sonnenaufgang · gewählter Planungszeitraum hervorgehoben</div></div><button type="button" id="openMultiNightWeather" class="secondary">Mehrnächte-Wetterverlauf öffnen</button></summary>
      <div class="card-panel-body">
        <div class="weather-scroll">
          <table class="weather-table weather-quality-table">
            <thead><tr><th rowspan="2">Uhrzeit</th><th rowspan="2">Qualität</th><th colspan="4">Wolken</th><th rowspan="2">Temp.</th><th rowspan="2">Tauabstand</th><th rowspan="2">Wind</th><th rowspan="2">Böen</th><th rowspan="2">Jetstream</th><th rowspan="2">Seeing*</th><th rowspan="2">Effektive Transparenz*</th></tr><tr><th>gesamt</th><th>tief</th><th>mittel</th><th>hoch</th></tr></thead>
            <tbody>${rows.map(row=>{const score=weatherHourScore(row);const rowInSelected=row.time>=windowRange.start&&row.time<=windowRange.end;return`<tr class="${rowInSelected?'selected-window-hour':''}"><td><strong>${fmtTime(row.time,loc.timezone)}</strong></td><td><span class="quality-pill ${scoreClass(score)}">${fmt(score)}</span></td><td class="weather-cell ${cloudClass(row.cloud)}">${fmt(row.cloud)} %</td><td class="weather-cell ${cloudClass(row.cloudLow)}">${fmt(row.cloudLow)} %</td><td class="weather-cell ${cloudClass(row.cloudMid)}">${fmt(row.cloudMid)} %</td><td class="weather-cell ${cloudClass(row.cloudHigh)}">${fmt(row.cloudHigh)} %</td><td>${fmt(row.temperature,1)} °C</td><td class="weather-cell ${dewClass(row.dewGap)}">${fmt(row.dewGap,1)} °C</td><td class="weather-cell ${windQualityClass(row.wind)}">${fmt(windFromKmh(row.wind),1)} ${unit}</td><td class="weather-cell ${windQualityClass(row.gust,'gust')}">${fmt(windFromKmh(row.gust),1)} ${unit}</td><td class="weather-cell ${jetClass(row.jet)}">${fmt(windFromKmh(row.jet),1)} ${unit}</td><td class="weather-cell ${valueClass(row.seeing)}"><span class="quality-pill ${valueClass(row.seeing)}">${fmt(row.seeing)}</span></td><td class="weather-cell ${valueClass(row.transparency)}" title="Atmosphärische Transparenz ohne Wolkeneinfluss: ${fmt(row.atmosphericTransparency)}/100"><span class="quality-pill ${valueClass(row.transparency)}">${fmt(row.transparency)}</span><div class="small muted">atm. ${fmt(row.atmosphericTransparency)}</div></td></tr>`}).join('')}</tbody>
          </table>
        </div>
        <div class="small muted weather-footnote">Die farbliche Bewertung bezieht sich auf die erwartete Aufnahmequalität. * Seeing und Transparenz sind abgeleitete Tendenzen. Die effektive Transparenz berücksichtigt die Gesamtbewölkung; der kleine atmosphärische Wert zeigt die wolkenunabhängige Klarheit.</div>
      </div>
    </details>
  </section>`;
  return (sectionVisible('weatherSummary')?summaryCard:'')+(sectionVisible('weatherHourly')?hourlyCard:'');
}

function renderCloudMap(windowRange,loc,night){
  const settings=cloudMapSettings(),view=currentCloudMapView(),baseMode=currentCloudMapBaseMode(),smoothing=currentCloudSmoothing(),showValues=cloudMapValuesVisible(),layer=profile.planning.cloudMapLayer||settings.defaultLayer||'cloud',mode=profile.planning.cloudMapMode||settings.defaultMode||'clouds',displayTimes=cloudMapData?cloudDisplayTimes():cloudMapRange(night).times.map(time=>time.toISOString()),frameCount=displayTimes.length||1,frameIndex=clamp(Number(profile.planning.cloudMapFrame)||0,0,Math.max(0,frameCount-1)),time=new Date(displayTimes[frameIndex]),rawPosition=cloudMapData?cloudRawPosition(frameIndex):frameIndex,stats=cloudMapData?cloudFrameStats(view,layer,rawPosition):null,movement=cloudMapData?estimateCloudMovement(view,layer,frameIndex):null;
  const viewOptions=CLOUD_MAP_VIEW_OPTIONS.map(([key,label])=>`<option value="${key}" ${view===key?'selected':''}>${optionText(label)}</option>`).join(''),baseOptions=CLOUD_MAP_BASE_OPTIONS.map(([key,label])=>`<option value="${key}" ${baseMode===key?'selected':''}>${optionText(label)}</option>`).join(''),smoothingOptions=CLOUD_SMOOTHING_OPTIONS.map(([key,label])=>`<option value="${key}" ${smoothing===key?'selected':''}>${optionText(label)}</option>`).join(''),layerOptions=CLOUD_MAP_LAYER_OPTIONS.map(([key,label])=>`<option value="${key}" ${layer===key?'selected':''}>${optionText(label)}</option>`).join(''),modeOptions=CLOUD_MAP_MODE_OPTIONS.map(([key,label])=>`<option value="${key}" ${mode===key?'selected':''}>${optionText(label)}</option>`).join(''),status=cloudMapError?`<div class="notice warn">${esc(cloudMapError)}</div>`:'',compareRows=locationComparisonData?.rows||[],step=cloudMapTimeStepMinutes();
  const title=`${ui('Astro-Wolkenmodell rund um','Astro cloud model around')} ${esc(loc.name)}`;
  return`<details id="cloudMapDetails" class="card cloud-map-card card-panel-details" ${settings.collapsed?'':'open'}>
    <summary><div><div class="eyebrow">${ui('Animierte 24-Stunden-Prognose','Animated 24-hour forecast')}</div><h2>${title}</h2><div class="small muted">${ui('Gewichteter Konsens oder Einzelmodell','Weighted consensus or single model')} · ${ui('Zwischenbilder werden zeitlich interpoliert','intermediate frames are time-interpolated')}</div></div></summary>
    <div class="card-panel-body">${status}<div class="section-title-row"><div></div><button id="cloudMapReload">${cloudMapLoading?ui('Lädt …','Loading ...'):ui('Wolkenkarte aktualisieren','Refresh cloud map')}</button></div>
    <div class="toolbar cloud-map-toolbar" style="margin-top:12px"><label>${ui('Wettermodell','Weather model')}<select id="cloudMapView">${viewOptions}</select></label><label>${ui('Wolkenschicht','Cloud layer')}<select id="cloudMapLayer">${layerOptions}</select></label><label>${ui('Auswertung','Evaluation')}<select id="cloudMapMode">${modeOptions}</select></label><label>${ui('Kartenansicht','Map view')}<select id="cloudMapBaseMode">${baseOptions}</select></label><label>${ui('Glättung','Smoothing')}<select id="cloudMapSmoothingTemporary">${smoothingOptions}</select></label><label>${ui('Zeitschritt','Time step')}<select id="cloudMapTimeStep">${[15,30,60].map(value=>`<option value="${value}" ${step===value?'selected':''}>${value} ${language==='en'?'minutes':'Minuten'}${value===30?(language==='en'?' (default)':' (Standard)'):''}</option>`).join('')}</select></label><label class="chip cloud-value-toggle"><input id="cloudMapShowValues" type="checkbox" ${showValues?'checked':''}>${ui('Prozentwerte anzeigen','Show percentage values')}</label></div>
    ${cloudMapLoading&&!cloudMapData?`<div class="loading-card"><div class="spinner"></div><p>${settings.gridSize*settings.gridSize} ${ui('Prognosepunkte für drei Wettermodelle werden geladen …','forecast points for three weather models are loading ...')}</p></div>`:cloudMapData?`<div class="cloud-map-stage ${baseMode==='cloudOnly'?'cloud-only':'combined'}" style="margin-top:12px"><div id="cloudMapBase" class="cloud-map-base" aria-label="${ui('Topografische Basiskarte','Topographic base map')}"></div><canvas id="cloudMapCanvas" width="1400" height="720"></canvas><div class="cloud-map-legend" id="cloudMapLegend"></div><div class="cloud-map-movement" id="cloudMapMovement">${movement?.reliable?(language==='en'?`Estimated movement: direction ${esc(movement.cardinal||cardinal(movement.azimuth))} · ${fmt(movement.distance,0)} km/h · confidence ${fmt(movement.confidence*100)} %`:`Geschätzte Verlagerung: ${esc(movement.direction)} · ${fmt(movement.distance,0)} km/h · Sicherheit ${fmt(movement.confidence*100)} %`):ui('Bewegungsrichtung unsicher','Movement direction uncertain')}</div></div>`:`<div class="notice warn" style="margin-top:12px">${ui('Noch keine Wolkenkartendaten vorhanden.','No cloud-map data loaded yet.')}</div>`}
    <div class="notice subtle" style="margin-top:10px">${ui('Niederschlag gesamt enthält Regen, Schauer und Schnee. Regen und Schnee zeigen die Einzelanteile.','Total precipitation includes rain, showers and snow. Rain and snow show the individual components.')}</div>
    <div class="grid four cloud-map-summary"><div class="metric"><div class="label">${ui('Kartenzeit','Map time')}</div><div class="value" id="cloudMapTimeLabel">${fmtDateTime(time,loc.timezone)}</div></div><div class="metric"><div class="label">${ui('Am Standort','At location')}</div><div class="value" id="cloudMapCenterValue">${stats?`${fmt(stats.center)} %`:'–'}</div></div><div class="metric"><div class="label">${ui('Kartenmittel','Map average')}</div><div class="value" id="cloudMapAverageValue">${stats?`${fmt(stats.average)} %`:'–'}</div></div><div class="metric"><div class="label">${ui('Modellabweichung','Model deviation')}</div><div class="value" id="cloudMapSpreadValue">${stats?`${fmt(stats.uncertainty,1)} ${language==='en'?'percentage points':'%-Punkte'}`:'–'}</div></div></div>
    <div class="cloud-map-time-controls"><button id="cloudMapPrev">−${step} min</button><button id="cloudMapPlay">${cloudMapAnimationTimer?ui('Pause','Pause'):ui('▶ Abspielen','▶ Play')}</button><input id="cloudMapTime" type="range" min="0" max="${Math.max(0,frameCount-1)}" step="1" value="${frameIndex}" ${cloudMapData?'':'disabled'}><button id="cloudMapNext">+${step} min</button></div>
    <div class="small muted" style="margin-top:8px">${cloudMapData?`${cloudMapData.gridSize*cloudMapData.gridSize} ${ui('Prognosepunkte','forecast points')} · Radius ${cloudMapData.radiusKm} km · ${Object.values(cloudMapData.models).map(model=>esc(model.name)).join(', ')}`:`${ui('Geplante Auflösung','Planned resolution')}: ${settings.gridSize*settings.gridSize} ${ui('Prognosepunkte','forecast points')}`} · ${ui('15-/30-Minuten-Bilder sind interpoliert und erhöhen nicht die Wettermodellgenauigkeit.','15-/30-minute frames are interpolated and do not increase weather-model accuracy.')}</div>
    <details class="location-comparison" style="margin-top:14px"><summary>${ui('Gespeicherte Standorte vergleichen','Compare saved locations')}</summary><div class="section-title-row" style="margin-top:10px"><div class="small muted">${ui('Punktprognosen mit geringer Datenmenge.','Point forecasts with reduced data volume.')}</div><button id="loadLocationComparison">${locationComparisonLoading?ui('Lädt …','Loading ...'):ui('Vergleich laden','Load comparison')}</button></div>${locationComparisonError?`<div class="notice warn">${esc(locationComparisonError)}</div>`:''}${compareRows.length?`<div class="weather-scroll"><table class="weather-table"><thead><tr><th>${ui('Standort','Location')}</th><th>${ui('Ø Wolken','Avg. clouds')}</th><th>${ui('Modellstreuung','Model spread')}</th></tr></thead><tbody>${compareRows.map(row=>`<tr><td>${esc(row.name)}</td><td>${fmt(row.cloud)} %</td><td>${fmt(row.spread,1)} ${language==='en'?'percentage points':'%-Punkte'}</td></tr>`).join('')}</tbody></table></div>`:`<div class="small muted">${ui('Noch kein Standortvergleich geladen.','No location comparison loaded yet.')}</div>`}</details>
    </div>
  </details>`;
}

function meteoblueSlugPart(value){
  return String(value||'').trim().toLocaleLowerCase('de').replace(/[’']/g,'').replace(/[^a-z0-9\u00c0-\u024f]+/gi,'-').replace(/^-+|-+$/g,'');
}
function meteoblueLocationInfo(loc){
  const geonameId=Number(loc.geonameId)||(/tübingen/i.test(loc.name)?2820860:0);
  const mbLang=language==='en'?'en':'de';
  let path=loc.meteobluePath||'';
  if(!path&&geonameId){
    const city=String(loc.name||'').split(',')[0].trim();
    const country=loc.country||String(loc.name||'').split(',').at(-1)||'Deutschland';
    const citySlug=meteoblueSlugPart(city),countrySlug=meteoblueSlugPart(country);
    if(citySlug&&countrySlug)path=`${citySlug}_${countrySlug}_${geonameId}`;
  }
  const encodedPath=path?path.split('_').map(encodeURIComponent).join('_'):'';
  const fixed=Boolean(encodedPath);
  const seeingWidget=fixed?`https://www.meteoblue.com/${mbLang}/weather/widget/seeing/${encodedPath}?geoloc=fixed&noground=0`:`https://www.meteoblue.com/${mbLang}/weather/widget/seeing?geoloc=detect&noground=0`;
  const seeingPage=fixed?`https://www.meteoblue.com/${mbLang}/weather/outdoorsports/seeing/${encodedPath}`:`https://www.meteoblue.com/${mbLang}/weather/outdoorsports/seeing`;
  const mapBase=fixed?`https://www.meteoblue.com/${mbLang}/weather/maps/widget/${encodedPath}`:`https://www.meteoblue.com/${mbLang}/weather/maps/widget`;
  const mapParams=new URLSearchParams();
  // Embedded Meteoblue view: keep the iframe as the original wind-animation map.
  // Cloud/precipitation is opened through the separate external button because
  // Meteoblue's iframe state is not reliable enough for forcing both modes here.
  mapParams.append('geoloc',fixed?'fixed':'detect');
  mapParams.append('tempunit','C');
  mapParams.append('windunit','km/h');
  mapParams.append('lengthunit','metric');
  mapParams.append('precipunit','mm');
  mapParams.append('zoom','8');
  mapParams.append('autowidth','auto');
  mapParams.append('map','windAnimation');
  mapParams.append('maps','windAnimation');
  mapParams.append('layers','windAnimation');
  mapParams.append('windAnimation','1');
  mapParams.append('embed_key',`anp-${RELEASE}`);
  const coordsHash=`coords=8/${Number(loc.latitude).toFixed(4)}/${Number(loc.longitude).toFixed(4)}`;
  const timeHash='';
  const windMapHash=`#map=windAnimation~rainbow~auto~10%20m%20above%20gnd~none&${coordsHash}${timeHash}`;
  const cloudWindMapHash=`#map=cloudsAndPrecipitation~hourly~auto~sfc~windAnimationOverlay&${coordsHash}${timeHash}`;
  const mapWidget=`${mapBase}?${mapParams.toString()}${windMapHash}`;
  const mapPage=fixed?`https://www.meteoblue.com/${mbLang}/weather/maps/${encodedPath}${cloudWindMapHash}`:`https://www.meteoblue.com/${mbLang}/weather/maps${cloudWindMapHash}`;
  const windMapPage=fixed?`https://www.meteoblue.com/${mbLang}/weather/maps/${encodedPath}${windMapHash}`:`https://www.meteoblue.com/${mbLang}/weather/maps${windMapHash}`;
  return{fixed,seeingWidget,seeingPage,mapWidget,mapPage,windMapPage};
}


function renderAuroraButton(loc){
  const settings=profile.central.aurora||{};
  if(settings.enabled===false)return'';
  const level=auroraStatus?.level||'none';
  const updated=auroraStatus?.updatedAt?fmtTime(new Date(auroraStatus.updatedAt),loc?.timezone||'Europe/Berlin'):'';
  const label=language==='en'?'Open aurora details':'Polarlichtdetails öffnen';
  const refreshTitle=language==='en'?'Refresh aurora data':'Polarlichtdaten aktualisieren';
  const statusText=auroraStatus.message|| (language==='en'?'Aurora data not loaded yet.':'Polarlichtdaten noch nicht geladen.');
  const sub=updated?`<div class="small muted aurora-status-line">${esc(statusText)} · ${updated}</div>`:`<div class="small muted aurora-status-line">${esc(statusText)}</div>`;
  return `<div class="aurora-box ${auroraLevelClass(level)}"><div class="aurora-row"><button type="button" id="auroraDashboard" class="aurora-main-button">${label}</button><button type="button" id="auroraRefresh" class="secondary" title="${refreshTitle}">↻</button></div>${sub}</div>`;
}
function noaaKpForecastUrl(){return 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json'}
function noaaObservedKpUrl(){return 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'}
function noaaAlertsUrl(){return 'https://services.swpc.noaa.gov/products/alerts.json'}
function noaaScalesUrl(){return 'https://services.swpc.noaa.gov/products/noaa-scales.json'}
function noaaSolarWindUrl(){return 'https://services.swpc.noaa.gov/products/solar-wind/mag-1-day.json'}
function gfzKpForecastUrl(){return 'https://spaceweather.gfz.de/fileadmin/Kp-Forecast/CSV/kp_product_file_FORECAST_PAGER_SWIFT_LAST.json'}
function gfzForecastsPageUrl(){return language==='en'?'https://spaceweather.gfz.de/products-data/forecasts':'https://spaceweather.gfz.de/de/produkte-daten/vorhersagen'}
function parseKpNumber(value){const n=Number(String(value??'').replace(/[^0-9.+-]/g,''));return Number.isFinite(n)?n:NaN}
function parseDateFlexible(value){
  if(value instanceof Date)return value;
  if(typeof value!=='string')return new Date(NaN);
  const trimmed=value.trim();
  let d=new Date(trimmed.endsWith('Z')||/[+-]\d\d:?\d\d$/.test(trimmed)?trimmed:`${trimmed}Z`);
  if(!isNaN(d))return d;
  const m=trimmed.match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})/);
  if(m)return new Date(Date.UTC(Number(m[3]),Number(m[2])-1,Number(m[1]),Number(m[4]),Number(m[5])));
  const n=trimmed.match(/^(\d{4})\s+([A-Za-z]{3})\s+(\d{1,2})\s+(\d{2})(\d{2})/);
  if(n){const mon=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(n[2]);if(mon>=0)return new Date(Date.UTC(Number(n[1]),mon,Number(n[3]),Number(n[4]),Number(n[5])))}
  return new Date(NaN);
}
function parseNoaaKpRows(data,source='NOAA'){return (Array.isArray(data)?data:[]).map(item=>{
  if(Array.isArray(item))return{time:parseDateFlexible(item[0]||item[1]),kp:parseKpNumber(item[item.length-1]),kind:'unknown',scale:'' ,source};
  const time=parseDateFlexible(item.time_tag||item.time||item[0]);
  const kp=parseKpNumber(item.kp??item.Kp??item.estimated_kp??item.value);
  return{time,kp,kind:String(item.observed||item.type||source).toLowerCase(),scale:String(item.noaa_scale||''),source};
}).filter(row=>row.time instanceof Date&&!isNaN(row.time)&&Number.isFinite(row.kp))}
function parseGfzForecastRows(data){
  const times=data?.['Time (UTC)']||data?.time||{};
  const median=data?.median||data?.MEDIAN||{};
  const maximum=data?.maximum||data?.MAX||{};
  const rows=[];
  for(const key of Object.keys(times)){
    const time=parseDateFlexible(times[key]);
    const kp=parseKpNumber(median[key]);
    const kpMax=parseKpNumber(maximum[key]);
    if(time instanceof Date&&!isNaN(time)&&(Number.isFinite(kp)||Number.isFinite(kpMax)))rows.push({time,kp:Number.isFinite(kp)?kp:kpMax,kpMax:Number.isFinite(kpMax)?kpMax:kp,kind:'forecast',source:'GFZ'});
  }
  return rows;
}
function kpRowsInRange(rows,from,to){const a=Number(from),b=Number(to);return (rows||[]).filter(row=>row.time&&row.time.getTime()>=a&&row.time.getTime()<=b)}
function kpMaxOf(rows,key='kp'){return (rows||[]).reduce((max,row)=>Math.max(max,Number(row[key])), -Infinity)}
function gScaleForKp(kp){if(!Number.isFinite(kp)||kp<5)return'';if(kp<6)return'G1';if(kp<7)return'G2';if(kp<8)return'G3';if(kp<9)return'G4';return'G5'}
function auroraLocalKpOffset(loc=activeLocation()){
  const lat=Math.abs(Number(loc?.latitude));
  if(!Number.isFinite(lat))return 0;
  if(lat>=66)return -2.2;
  if(lat>=60)return -1.5;
  if(lat>=54)return -0.8;
  if(lat>=47)return 0;
  if(lat>=40)return .6;
  return 1.2;
}
function auroraLevelFromKp(kp,loc=activeLocation()){
  const a=profile.central.aurora||{};if(!Number.isFinite(kp))return'none';
  const offset=auroraLocalKpOffset(loc);
  const y=Number(a.yellowKp??5.7)+offset,o=Number(a.orangeKp??6.7)+offset,r=Number(a.redKp??7.3)+offset;
  if(kp>=r)return'red';if(kp>=o)return'orange';if(kp>=y)return'yellow';return'none'
}
function auroraLevelLabel(level){return{none:'keine Warnung',yellow:'erhöhte geomagnetische Aktivität',orange:'Polarlicht am Standort möglich',red:'Polarlicht am Standort deutlich möglich'}[level]||'keine Warnung'}
function auroraLevelLabelEn(level){return{none:'no warning',yellow:'increased geomagnetic activity',orange:'aurora possible at the selected location',red:'aurora clearly possible at the selected location'}[level]||'no warning'}
function auroraText(de,en){return language==='en'?en:de}
function auroraLevelLabelLocalized(level){return language==='en'?auroraLevelLabelEn(level):auroraLevelLabel(level)}
function auroraDataStatusLabel(value){const map={ok:['ok','ok'],partial:['teilweise geladen','partially loaded'],'no-kp':['keine Kp-Daten','no Kp data'],error:['Fehler','error'],loading:['lädt','loading'],unknown:['unbekannt','unknown'],'not-loaded':['noch nicht geladen','not loaded']};const entry=map[value]||map.unknown;return language==='en'?entry[1]:entry[0]}
function auroraStrengthFromAlert(item){
  const text=String(item?.message||'');
  if(!/Geomagnetic|K-index|Storm Category|NOAA Scale:\s*G/i.test(text))return null;
  if(/CANCEL|Cancel|cancelled|expired/i.test(text))return null;
  const issue=parseDateFlexible(item?.issue_datetime||'');
  const now=Date.now();
  if(issue instanceof Date&&!isNaN(issue)&&issue.getTime()<now-96*3600000)return null;
  const g=[...text.matchAll(/(?:NOAA\s+Scale:\s*)?G\s*([1-5])|Storm\s+Category\s+G\s*([1-5])/gi)].map(m=>Number(m[1]||m[2])).filter(Number.isFinite);
  const k=[...text.matchAll(/K(?:p|-index|\s+index)?\s*(?:of|=|:)?\s*([4-9](?:\.\d)?)/gi)].map(m=>Number(m[1])).filter(Number.isFinite);
  const values=[];g.forEach(v=>values.push({type:'G',value:v,kp:Math.min(9,4+v),issue}));k.forEach(v=>values.push({type:'Kp',value:v,kp:v,issue}));
  return values.sort((a,b)=>b.kp-a.kp)[0]||null;
}
function parseNoaaAlertsSummary(alerts){
  const items=Array.isArray(alerts)?alerts:[];
  const sorted=items.slice().sort((a,b)=>parseDateFlexible(b.issue_datetime).getTime()-parseDateFlexible(a.issue_datetime).getTime());
  const geomagnetic=sorted.filter(item=>/Geomagnetic|K-index|Storm Category|NOAA Scale:\s*G/i.test(String(item?.message||'')));
  const strengths=geomagnetic.map(auroraStrengthFromAlert).filter(Boolean);
  const strongest=strengths.sort((a,b)=>b.kp-a.kp)[0]||null;
  return{count:geomagnetic.length,strongest,recent:geomagnetic.slice(0,5)};
}
async function fetchJsonSafe(url){const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw new Error(`${response.status} ${response.statusText}`);return response.json()}
async function fetchAuroraStatus(options={}){
  if(profile?.central?.aurora?.enabled===false)return;
  auroraStatus={...(auroraStatus||{}),level:'none',message:auroraText('Polarlichtdaten werden geladen …','Loading aurora data …'),dataStatus:'loading',reason:auroraText('Abruf läuft.','Fetch in progress.'),updatedAt:new Date().toISOString(),details:[],windows:[],kpMax:NaN,source:'NOAA/SWPC + GFZ',data:{}};
  if(options.manual)render();
  try{
    const [noaaForecast,noaaObserved,gfzForecast,alerts,mag,scales]=await Promise.allSettled([fetchJsonSafe(noaaKpForecastUrl()),fetchJsonSafe(noaaObservedKpUrl()),fetchJsonSafe(gfzKpForecastUrl()),fetchJsonSafe(noaaAlertsUrl()),fetchJsonSafe(noaaSolarWindUrl()),fetchJsonSafe(noaaScalesUrl())]);
    const loc=activeLocation();const details=[],problems=[];const now=Date.now(),limit=now+48*3600000;const localOffset=auroraLocalKpOffset(loc);
    let noaaForecastRows=[],noaaObservedRows=[],gfzRows=[],alertInfo={count:0,strongest:null,recent:[]};
    if(noaaForecast.status==='fulfilled'){
      noaaForecastRows=parseNoaaKpRows(noaaForecast.value,'NOAA forecast');
      const f=kpRowsInRange(noaaForecastRows,now-3*3600000,limit).filter(row=>row.kind!=='observed');
      details.push(auroraText(`NOAA Kp-Prognose: ${f.length?`Maximum nächste 48 h ${kpMaxOf(f,'kp').toFixed(1)}`:'keine Vorhersagewerte im 48-h-Zeitraum'}`,`NOAA Kp forecast: ${f.length?`maximum next 48 h ${kpMaxOf(f,'kp').toFixed(1)}`:'no forecast values in the 48-hour window'}`));
    }else{problems.push(auroraText(`NOAA Kp-Prognose konnte nicht geladen werden: ${noaaForecast.reason?.message||noaaForecast.reason}.`,`NOAA Kp forecast could not be loaded: ${noaaForecast.reason?.message||noaaForecast.reason}.`))}
    if(noaaObserved.status==='fulfilled'){
      noaaObservedRows=parseNoaaKpRows(noaaObserved.value,'NOAA observed');
      const recent=kpRowsInRange(noaaObservedRows,now-24*3600000,now+3600000);
      const latest=recent.slice().sort((a,b)=>b.time-a.time)[0];
      details.push(auroraText(`NOAA beobachteter Kp: ${latest?`${latest.kp.toFixed(1)} (${fmtDateTime(latest.time,loc.timezone)})`:'kein aktueller Wert'}`,`NOAA observed Kp: ${latest?`${latest.kp.toFixed(1)} (${fmtDateTime(latest.time,loc.timezone)})`:'no current value'}`));
    }else{problems.push(auroraText(`NOAA beobachteter Kp konnte nicht geladen werden: ${noaaObserved.reason?.message||noaaObserved.reason}.`,`NOAA observed Kp could not be loaded: ${noaaObserved.reason?.message||noaaObserved.reason}.`))}
    if(gfzForecast.status==='fulfilled'){
      gfzRows=parseGfzForecastRows(gfzForecast.value);
      const f=kpRowsInRange(gfzRows,now-3*3600000,limit);
      const med=kpMaxOf(f,'kp'),max=kpMaxOf(f,'kpMax');
      details.push(auroraText(`GFZ Kp-Prognose: ${f.length?`Median-Max ${med.toFixed(1)}, Ensemble-Max ${max.toFixed(1)}`:'keine auswertbaren Werte im 48-h-Zeitraum'}`,`GFZ Kp forecast: ${f.length?`median max ${med.toFixed(1)}, ensemble max ${max.toFixed(1)}`:'no usable values in the 48-hour window'}`));
    }else{problems.push(auroraText(`GFZ Kp-Prognose konnte nicht geladen werden: ${gfzForecast.reason?.message||gfzForecast.reason}.`,`GFZ Kp forecast could not be loaded: ${gfzForecast.reason?.message||gfzForecast.reason}.`))}
    if(alerts.status==='fulfilled'){
      alertInfo=parseNoaaAlertsSummary(alerts.value);
      details.push(auroraText(`${alertInfo.count} geomagnetische NOAA-Meldungen in den aktuellen Alert-Daten.`,`${alertInfo.count} geomagnetic NOAA messages in the current alert data.`));
      if(alertInfo.strongest)details.push(auroraText(`Stärkste NOAA-Meldung als Kontext: ${alertInfo.strongest.type} ${alertInfo.strongest.value} (entspricht etwa Kp ${alertInfo.strongest.kp.toFixed(1)}).`,`Strongest NOAA message as context: ${alertInfo.strongest.type} ${alertInfo.strongest.value} (roughly Kp ${alertInfo.strongest.kp.toFixed(1)}).`));
      details.push(auroraText('NOAA-Meldungen allein setzen keine lokale Warnfarbe; maßgeblich sind aktuelle oder prognostizierte Kp-Daten.','NOAA messages alone do not set a local warning colour; current or forecast Kp data are decisive.'));
    }else{problems.push(auroraText(`NOAA-Warnmeldungen konnten nicht geladen werden: ${alerts.reason?.message||alerts.reason}.`,`NOAA warning messages could not be loaded: ${alerts.reason?.message||alerts.reason}.`))}
    if(mag.status==='fulfilled'&&Array.isArray(mag.value)){
      const last=mag.value.slice(-1)[0]||[];const bz=Number(last[3]);const bt=Number(last[6]??last[4]);if(Number.isFinite(bz))details.push(auroraText(`Sonnenwind Bz zuletzt ${bz.toFixed(1)} nT${Number.isFinite(bt)?`, Bt ${bt.toFixed(1)} nT`:''}.`,`Solar wind Bz latest ${bz.toFixed(1)} nT${Number.isFinite(bt)?`, Bt ${bt.toFixed(1)} nT`:''}.`));
    }else{problems.push(auroraText(`Sonnenwinddaten konnten nicht geladen werden${mag.status==='rejected'?`: ${mag.reason?.message||mag.reason}`:''}.`,`Solar wind data could not be loaded${mag.status==='rejected'?`: ${mag.reason?.message||mag.reason}`:''}.`))}
    if(scales.status==='fulfilled')details.push(auroraText('NOAA-Skalenstatus geladen. R- und S-Skalen werden nicht für Polarlichtwarnungen verwendet.','NOAA scales status loaded. R and S scales are not used for aurora warnings.'));
    const noaaFuture=kpRowsInRange(noaaForecastRows,now-3*3600000,limit).filter(row=>row.kind!=='observed');
    const gfzFuture=kpRowsInRange(gfzRows,now-3*3600000,limit);
    const observedRecent=kpRowsInRange(noaaObservedRows,now-6*3600000,now+3600000);
    const noaaForecastMax=kpMaxOf(noaaFuture,'kp');
    const gfzMedianMax=kpMaxOf(gfzFuture,'kp');
    const observedMax=kpMaxOf(observedRecent,'kp');
    const candidates=[noaaForecastMax,gfzMedianMax,observedMax].filter(Number.isFinite);
    const kpMax=candidates.length?Math.max(...candidates):NaN;
    const bestSource=Number.isFinite(kpMax)?(kpMax===noaaForecastMax?auroraText('NOAA Kp-Prognose','NOAA Kp forecast'):kpMax===gfzMedianMax?auroraText('GFZ Kp-Prognose','GFZ Kp forecast'):auroraText('NOAA beobachteter Kp','NOAA observed Kp')):auroraText('keine Kp-Quelle','no Kp source');
    let bestLevel=auroraLevelFromKp(kpMax,loc);let dataStatus='ok';let reason=auroraText('Keine Warnschwelle erreicht.','No warning threshold reached.');
    if(!Number.isFinite(kpMax)){bestLevel='none';dataStatus=problems.length?'partial':'no-kp';reason=auroraText('Keine auswertbaren Kp-Werte aus NOAA oder GFZ verfügbar.','No usable Kp values available from NOAA or GFZ.')}
    else if(auroraLevelRank(bestLevel)>0){reason=auroraText(`${bestSource} erreicht Kp ${kpMax.toFixed(1)}. Bewertung mit standortabhängiger Schwelle (Breite ${Number.isFinite(Number(loc?.latitude))?Number(loc.latitude).toFixed(1):'–'}°, Offset ${localOffset>=0?'+':''}${localOffset.toFixed(1)} Kp).`,`${bestSource} reaches Kp ${kpMax.toFixed(1)}. Evaluation uses a location-dependent threshold (latitude ${Number.isFinite(Number(loc?.latitude))?Number(loc.latitude).toFixed(1):'–'}°, offset ${localOffset>=0?'+':''}${localOffset.toFixed(1)} Kp).`)}
    else{reason=auroraText(`Maximal auswertbarer Kp-Wert ${kpMax.toFixed(1)} bleibt unter der standortabhängigen Warnschwelle.`,`Maximum usable Kp value ${kpMax.toFixed(1)} remains below the location-dependent warning threshold.`)}
    const message=auroraLevelRank(bestLevel)>0?auroraText(`${auroraLevelLabel(bestLevel)} · Kp bis ${kpMax.toFixed(1)} in den nächsten 48 h`,`${auroraLevelLabelLocalized(bestLevel)} · Kp up to ${kpMax.toFixed(1)} in the next 48 h`):(dataStatus==='ok'?auroraText('Keine relevante Polarlichtwarnung für den gewählten Standort.','No relevant aurora warning for the selected location.'):auroraText('Polarlichtdaten unvollständig · keine belastbare Warnung','Aurora data incomplete · no reliable warning'));
    const windows=[...noaaFuture.map(row=>({...row,displaySource:'NOAA'})),...gfzFuture.map(row=>({...row,displaySource:'GFZ median'}))].sort((a,b)=>a.time-b.time);
    auroraStatus={level:bestLevel,message,details:[...details,...problems],updatedAt:new Date().toISOString(),windows,kpMax,source:'NOAA/SWPC + GFZ',dataStatus,reason,data:{noaaForecastRows:noaaFuture,noaaObservedRows:observedRecent,gfzRows:gfzFuture,alerts:alertInfo}};
    updateAuroraBadgeAndNotify(bestLevel,message,options.manual);
  }catch(error){
    auroraStatus={level:'none',message:auroraText(`Polarlichtdaten konnten nicht geladen werden: ${error.message}`,`Aurora data could not be loaded: ${error.message}`),details:[String(error.message)],updatedAt:new Date().toISOString(),windows:[],kpMax:NaN,source:'NOAA/SWPC + GFZ',dataStatus:'error',reason:auroraText('Datenquelle nicht erreichbar oder Format nicht erkannt.','Data source unavailable or format not recognised.'),data:{}};
  }
  render();
}
function updateAuroraBadgeAndNotify(level,message,manual=false){
  const rank=auroraLevelRank(level),notifyRank=auroraLevelRank(profile.central.aurora?.notifyLevel||'orange');
  if(navigator.setAppBadge){rank?navigator.setAppBadge(rank).catch(()=>{}):navigator.clearAppBadge?.().catch(()=>{})}
  document.title=rank?`⚠ ${message} · ${BUILD.documentTitle||'Astro Night Planner'}`:(BUILD.documentTitle||'Astro Night Planner');
  if(!manual&&rank>=notifyRank&&'Notification'in window&&Notification.permission==='granted')new Notification('Astro Night Planner', {body:message,tag:'anp-aurora'});
}
function setupAuroraAutoRefresh(){
  if(auroraTimer){clearInterval(auroraTimer);auroraTimer=null}
  const minutes=Number(profile?.central?.aurora?.autoRefreshMinutes)||0;
  if(profile?.central?.aurora?.enabled!==false&&minutes>0)auroraTimer=setInterval(()=>fetchAuroraStatus(),Math.max(5,minutes)*60000);
}
function hourlyWeatherRowsHtml(range,night,loc){
  const rows=weatherRowsForWindow({start:night.sunset,end:night.sunrise},currentWeatherView());
  const unit=windUnitLabel(),valueClass=(value,goodMin=70,warnMin=45)=>!Number.isFinite(value)?'':value>=goodMin?'good':value>=warnMin?'warn':'bad',cloudClass=value=>thresholdClass(value,25,60,true),dewClass=value=>thresholdClass(value,profile.central.dew.green,profile.central.dew.yellow,false),jetClass=value=>thresholdClass(windFromKmh(value),profile.central.jet.green,profile.central.jet.yellow,true);
  if(!rows.length)return'<div class="notice warn">Keine stündlichen Wetterdaten vorhanden.</div>';
  return `<div class="weather-scroll"><table class="weather-table weather-quality-table"><thead><tr><th>Uhrzeit</th><th>Qualität</th><th>Wolken ges.</th><th>tief</th><th>mittel</th><th>hoch</th><th>Temp.</th><th>Tauabstand</th><th>Wind</th><th>Böen</th><th>Jetstream</th><th>Seeing</th><th>Eff. Transparenz</th></tr></thead><tbody>${rows.map(row=>{const score=weatherHourScore(row),inside=row.time>=range.start&&row.time<=range.end;return`<tr class="${inside?'selected-window-hour':''}"><td><strong>${fmtTime(row.time,loc.timezone)}</strong></td><td><span class="quality-pill ${scoreClass(score)}">${fmt(score)}</span></td><td class="weather-cell ${cloudClass(row.cloud)}">${fmt(row.cloud)} %</td><td class="weather-cell ${cloudClass(row.cloudLow)}">${fmt(row.cloudLow)} %</td><td class="weather-cell ${cloudClass(row.cloudMid)}">${fmt(row.cloudMid)} %</td><td class="weather-cell ${cloudClass(row.cloudHigh)}">${fmt(row.cloudHigh)} %</td><td>${fmt(row.temperature,1)} °C</td><td class="weather-cell ${dewClass(row.dewGap)}">${fmt(row.dewGap,1)} °C</td><td class="weather-cell ${windQualityClass(row.wind)}">${fmt(windFromKmh(row.wind),1)} ${unit}</td><td class="weather-cell ${windQualityClass(row.gust,'gust')}">${fmt(windFromKmh(row.gust),1)} ${unit}</td><td class="weather-cell ${jetClass(row.jet)}">${fmt(windFromKmh(row.jet),1)} ${unit}</td><td class="weather-cell ${valueClass(row.seeing)}">${fmt(row.seeing)}</td><td class="weather-cell ${valueClass(row.transparency)}">${fmt(row.transparency)}<div class="small muted">atm. ${fmt(row.atmosphericTransparency)}</div></td></tr>`}).join('')}</tbody></table></div>`;
}
function openMultiNightWeatherWindow(){
  const loc=activeLocation();if(!loc)return;
  const extra=clamp(Math.round(Number(profile.central.multiNightWeather?.extraNights)||3),0,7);
  const keys=Array.from({length:extra+1},(_,i)=>addDays(selectedDateKey,i));
  const sections=keys.map(key=>{const night=nightData(key,loc),range=planningWindow(night,profile.planning.planningWindow),q=nightQualityForDateKey(key,loc);return`<section class="multi-night-section"><h2>${fmtDate(key,loc.timezone)} · ${esc(range.label)}</h2><div class="small muted">${esc(loc.name)} · ${fmtTime(range.start,loc.timezone)}–${fmtTime(range.end,loc.timezone)} · Ø Qualität ${Number.isFinite(q)?fmt(q):'–'} · Mond ${fmt(night.moonIllumination)} %</div>${hourlyWeatherRowsHtml(range,night,loc)}</section>`}).join('');
  const doc=`<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mehrnächte-Wetterverlauf</title><link rel="stylesheet" href="assets/styles.css"><style>body{padding:24px}.multi-night-section{margin:18px 0 28px;padding:18px;border:1px solid #264564;border-radius:18px;background:#0b1b2c}.weather-scroll{overflow:auto}</style></head><body><main><h1>Mehrnächte-Wetterverlauf</h1><p class="muted">${esc(loc.name)} · ${extra+1} Planungsnächte · Wetterdarstellung: ${esc(weatherViewLabel(currentWeatherView()))}</p>${sections}</main></body></html>`;
  const win=window.open('about:blank','_blank');if(!win){alert('Popup blockiert. Bitte Popups für diese Seite erlauben.');return}win.document.open();win.document.write(doc);win.document.close();
}
function auroraGraphicUrl(url){return `${url}${url.includes('?')?'&':'?'}ts=${Date.now()}`}
function openAuroraDashboard(){
  const loc=activeLocation();if(!loc)return;
  const T=(de,en)=>language==='en'?en:de;
  const details=(auroraStatus.details||[]).map(item=>`<li>${esc(item)}</li>`).join('')||`<li>${T('Keine Detaildaten vorhanden.','No detail data available.')}</li>`;
  const noRowsText=auroraStatus.dataStatus==='loading'?T('Daten werden geladen …','Loading data …'):auroraStatus.dataStatus==='error'?T('Datenquelle nicht erreichbar oder Format nicht erkannt.','Data source unavailable or format not recognised.'):auroraStatus.dataStatus==='partial'?T('Kp-Daten konnten nicht vollständig geladen oder ausgewertet werden.','Kp data could not be loaded or evaluated completely.'):T('Keine Kp-Werte im Zeitraum gefunden.','No Kp values found in the selected window.');
  const rows=(auroraStatus.windows||[]).length?(auroraStatus.windows||[]).map(row=>`<tr><td>${fmtDateTime(row.time,loc.timezone)}</td><td>${fmt(row.kp,1)}</td><td>${esc(row.displaySource||row.source||'')}</td><td>${esc(gScaleForKp(row.kp)||'')}</td><td>${esc(auroraLevelLabelLocalized(auroraLevelFromKp(row.kp,loc)))}</td></tr>`).join(''):`<tr><td colspan="5">${noRowsText}</td></tr>`;
  const statusText=auroraStatus.reason||T('Keine Bewertungsgrundlage vorhanden.','No evaluation basis available.');
  const northSouth=Number(loc.latitude)<0?'south':'north';
  const NOAA_AURORA=`https://services.swpc.noaa.gov/images/animations/ovation/${northSouth}/latest.jpg`;
  const NOAA_CME='https://services.swpc.noaa.gov/images/animations/lasco-c2/latest.jpg';
  const NOAA_EUV='https://services.swpc.noaa.gov/images/animations/suvi/primary/195/latest.png';
  const GFZ_KP='https://spaceweather.gfz.de/fileadmin/SW-Monitor/kp_swift_ensemble_LAST.png';
  const GFZ_HPO='https://isdc-data.gfz.de/geomagnetism/HpoForecast/v0102/output/Hpo/png/hpo_forecast_mean_bars.png';
  const GFZ_AURORA='https://spaceweather.gfz.de/sw-monitor/aurora-forecast';
  const gfzPage=gfzForecastsPageUrl();
  const visualCards=`<section class="dashboard-card"><div class="section-title-row"><div><h2>${T('Kontrollgrafiken','Reference graphics')}</h2><p class="muted">${T('Grafiken dienen der Plausibilitätsprüfung. Die automatische Warnstufe wird aus maschinenlesbaren Kp-Daten berechnet.','Graphics are for plausibility checking. The automatic warning level is calculated from machine-readable Kp data.')}</p></div><button type="button" id="auroraDataRefresh" class="primary">${T('Polarlichtdaten aktualisieren','Refresh aurora data')}</button></div><div class="aurora-visual-grid">
    ${auroraVisualCard(T('NOAA Polarlicht-Vorhersage / OVATION','NOAA Aurora Forecast / OVATION'),NOAA_AURORA,'https://www.spaceweather.gov/products/aurora-30-minute-forecast')}
    ${auroraVisualCard(T('GFZ Kp-Index-Prognose','GFZ Kp index forecast'),GFZ_KP,'https://spaceweather.gfz.de/products-data/forecasts/forecast-kp-index')}
    ${auroraVisualCard(T('GFZ Hp30-/Hp60-/Kp-Prognose','GFZ Hp30/Hp60/Kp forecast'),GFZ_HPO,'https://spaceweather.gfz.de/products-data/observatory-based-geomagnetic-forecasts/forecasting-global-kp-and-hpo-indices')}
    ${auroraVisualIframeCard(T('GFZ Polarlicht-Vorhersage','GFZ aurora forecast'),GFZ_AURORA,GFZ_AURORA)}
    ${auroraVisualCard(T('NOAA LASCO C2 / CME-Kontext','NOAA LASCO C2 / CME context'),NOAA_CME,'https://www.spaceweather.gov/products/coronagraph')}
    ${auroraVisualCard(T('NOAA GOES SUVI 195 Å / Sonnenaktivität','NOAA GOES SUVI 195 Å / solar activity'),NOAA_EUV,'https://www.spaceweather.gov/products/goes-solar-ultraviolet-imager-suvi')}
  </div></section>`;
  const doc=`<!doctype html><html lang="${language==='en'?'en':'de'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${T('Polarlicht-Dashboard','Aurora dashboard')}</title><link rel="stylesheet" href="assets/styles.css"><style>body{padding:24px}.dashboard-card{margin:18px 0;padding:18px;border:5px solid #264564;border-radius:18px;background:#0b1b2c}.dashboard-card.aurora-yellow{border-color:#ffd84d;background:linear-gradient(135deg,rgba(255,216,77,.18),#0b1b2c 45%)}.dashboard-card.aurora-orange{border-color:#ff7a21;background:linear-gradient(135deg,rgba(255,122,33,.22),#0b1b2c 45%)}.dashboard-card.aurora-red{border-color:#ff355e;background:linear-gradient(135deg,rgba(255,53,94,.24),#0b1b2c 45%)}.external-links a{display:inline-block;margin:6px 10px 6px 0}.dashboard-top-actions{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin:8px 0 18px}.aurora-visual-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;max-width:1980px}.aurora-visual-card{border:1px solid #264564;border-radius:14px;padding:14px;background:#071421;max-width:630px}.aurora-visual-card img,.aurora-visual-card iframe{width:100%;height:395px;object-fit:contain;background:#000;border:0;border-radius:10px}@media(max-width:1550px){.aurora-visual-grid{grid-template-columns:repeat(2,minmax(0,1fr));max-width:1300px}.aurora-visual-card{max-width:630px}}@media(max-width:820px){.aurora-visual-grid{grid-template-columns:1fr}.aurora-visual-card{max-width:none}.aurora-visual-card img,.aurora-visual-card iframe{height:310px}}.aurora-visual-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.aurora-modal{position:fixed;inset:0;background:rgba(0,0,0,.82);display:none;align-items:center;justify-content:center;z-index:9999;padding:24px}.aurora-modal.open{display:flex}.aurora-modal-inner{max-width:95vw;max-height:95vh;background:#06111d;border:2px solid #4c7ba6;border-radius:16px;padding:14px}.aurora-modal img,.aurora-modal iframe{max-width:90vw;width:90vw;height:80vh;object-fit:contain;background:#000;border:0}.aurora-modal button{margin-bottom:8px}</style></head><body><main><h1>${T('Polarlicht-Dashboard','Aurora dashboard')}</h1><div class="dashboard-top-actions"><button type="button" id="auroraDataRefreshTop" class="primary">${T('Polarlichtdaten aktualisieren','Refresh aurora data')}</button><span class="muted small">${T('Daten und Kontrollgrafiken neu laden.','Reload data and reference graphics.')}</span></div><section class="dashboard-card ${auroraLevelClass(auroraStatus.level)}"><h2>${T('Status','Status')}: ${esc(auroraStatus.message)}</h2><p class="muted">${T('Quelle','Source')}: ${esc(auroraStatus.source||'NOAA/SWPC + GFZ')} · ${T('Stand','Updated')} ${auroraStatus.updatedAt?fmtDateTime(new Date(auroraStatus.updatedAt),loc.timezone):'–'} · ${T('Datenstatus','Data status')}: ${esc(auroraDataStatusLabel(auroraStatus.dataStatus||'unknown'))}</p><p><strong>${T('Bewertung','Evaluation')}:</strong> ${esc(statusText)}</p><ul>${details}</ul></section><section class="dashboard-card"><h2>${T('Kp-Daten nächste 48 Stunden','Kp data next 48 hours')}</h2><div class="weather-scroll"><table class="weather-table"><thead><tr><th>${T('Zeit','Time')}</th><th>Kp</th><th>${T('Quelle','Source')}</th><th>${T('NOAA-Stufe','NOAA level')}</th><th>${T('lokale Bewertung','local evaluation')}</th></tr></thead><tbody>${rows}</tbody></table></div></section>${visualCards}<section class="dashboard-card external-links"><h2>${T('Externe Kontrollquellen','External reference sources')}</h2><a href="https://www.spaceweather.gov/" target="_blank" rel="noopener">NOAA/SWPC</a><a href="${esc(gfzPage)}" target="_blank" rel="noopener">${T('GFZ Prognosen','GFZ forecasts')}</a><a href="https://kp.gfz.de/" target="_blank" rel="noopener">${T('GFZ aktueller Kp','GFZ current Kp')}</a></section></main><div class="aurora-modal" id="auroraModal"><div class="aurora-modal-inner"><button type="button" id="auroraModalClose">${T('Schließen','Close')}</button><div id="auroraModalContent"></div></div></div><script>function refreshGraphics(){document.querySelectorAll('[data-refresh-src]').forEach(el=>{const base=el.getAttribute('data-refresh-src');el.src=base+(base.includes('?')?'&':'?')+'ts='+Date.now();});document.querySelectorAll('[data-refresh-iframe]').forEach(el=>{const base=el.getAttribute('data-refresh-iframe');el.src=base+(base.includes('?')?'&':'?')+'ts='+Date.now();});if(window.opener&&!window.opener.closed&&window.opener.fetchAuroraStatus)window.opener.fetchAuroraStatus({manual:true});}document.querySelectorAll('#auroraDataRefresh,#auroraDataRefreshTop').forEach(btn=>btn.addEventListener('click',refreshGraphics));const modal=document.getElementById('auroraModal'),content=document.getElementById('auroraModalContent');document.querySelectorAll('[data-enlarge-src]').forEach(btn=>btn.addEventListener('click',()=>{const src=btn.getAttribute('data-enlarge-src');const type=btn.getAttribute('data-enlarge-type')||'img';content.innerHTML=type==='iframe'?'<iframe src="'+src+'"></iframe>':'<img src="'+src+'">';modal.classList.add('open')}));document.getElementById('auroraModalClose')?.addEventListener('click',()=>{modal.classList.remove('open');content.innerHTML='';});</script></body></html>`;
  const win=window.open('about:blank','_blank');if(!win){alert(T('Popup blockiert. Bitte Popups für diese Seite erlauben.','Popup blocked. Please allow popups for this page.'));return}win.document.open();win.document.write(doc);win.document.close();
}
function auroraVisualCard(title,src,sourceUrl){const safeSrc=esc(src);const enlarge=language==='en'?'Enlarge':'Vergrößern',source=language==='en'?'Open source':'Quelle öffnen';return `<article class="aurora-visual-card"><h3>${esc(title)}</h3><img class="spaceweather-graphic" data-refresh-src="${safeSrc}" src="${esc(auroraGraphicUrl(src))}" alt="${esc(title)}" loading="lazy"><div class="aurora-visual-actions"><button type="button" data-enlarge-src="${safeSrc}" data-enlarge-type="img">${enlarge}</button><a class="button" href="${esc(sourceUrl)}" target="_blank" rel="noopener">${source}</a></div></article>`}
function auroraVisualIframeCard(title,src,sourceUrl){const safeSrc=esc(src);const enlarge=language==='en'?'Enlarge':'Vergrößern',source=language==='en'?'Open source':'Quelle öffnen';return `<article class="aurora-visual-card"><h3>${esc(title)}</h3><iframe data-refresh-iframe="${safeSrc}" src="${esc(auroraGraphicUrl(src))}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe><div class="aurora-visual-actions"><button type="button" data-enlarge-src="${safeSrc}" data-enlarge-type="iframe">${enlarge}</button><a class="button" href="${esc(sourceUrl)}" target="_blank" rel="noopener">${source}</a></div></article>`}
function renderFraming(o,windowRange,loc){
  const setup=fov(),activeSetupItem=activeSetup(),aspect=2.15,setupW=setup?.width||1.5,setupH=setup?.height||1,frameCenter=frameCenterForObject(o);
  const frameCenterRa=frameCenter.raDeg,frameCenterDec=frameCenter.decDeg;
  const objectW=Math.max(.02,(Number(o.majorArcMin)||1)/60),objectH=Math.max(.02,(Number(o.minorArcMin)||Number(o.majorArcMin)||1)/60);
  const frameRotation=normalizedAngle180(profile.planning.frameRotation||0),catalogRotation=normalizedAngle180(Number(o.positionAngleDeg)||0),rotationBelongsToObject=profile.planning.objectRotationObjectId===o.id,objectRotation=rotationBelongsToObject&&Number.isFinite(Number(profile.planning.objectRotation))?normalizedAngle180(Number(profile.planning.objectRotation)):catalogRotation;
  if(!rotationBelongsToObject){profile.planning.objectRotation=catalogRotation;profile.planning.objectRotationObjectId=o.id}
  const targetFov=clamp(Math.max(setupW,setupH*aspect,objectW,objectH*aspect,.08)*1.45,.08,120);
  const time=new Date(windowRange.start.getTime()+(windowRange.end-windowRange.start)*clamp(Number(profile.planning.timeFraction)||0,0,1)),currentAltitude=altitude(o.raHours,o.decDeg,time,loc.latitude,loc.longitude),currentAzimuth=azimuth(o.raHours,o.decDeg,time,loc.latitude,loc.longitude);
  const moon=moonCoords(time),moonRaDeg=moon.raHours*15,moonDecDeg=moon.decDeg,moonSep=angularSeparation(o.raHours,o.decDeg,moon.raHours,moon.decDeg),moonAlt=altitude(moon.raHours,moon.decDeg,time,loc.latitude,loc.longitude),moonPhase=moonPhaseInfo(time),moonName=language==='en'?'Moon':'Mond';
  const personalHorizonAltitude=horizonAt(loc,currentAzimuth,horizonProfileFor(loc)?.id),aboveMathematical=currentAltitude,abovePersonal=currentAltitude-personalHorizonAltitude;
  const horizonInfoLine=language==='en'?`${fmt(aboveMathematical)}° above horizon<br>${fmt(abovePersonal)}° above personal horizon`:`${fmt(aboveMathematical)}° über Horizont<br>${fmt(abovePersonal)}° über persönlichem Horizont`;
  const outline=curatedOutlineForObject(o),availableSurveys=enabledAladinSurveys(profile);let survey=profile.planning.aladinSurvey||availableSurveys[0]?.hipsId||'P/DSS2/color';if(!availableSurveys.some(item=>item.hipsId===survey))survey=availableSurveys[0]?.hipsId||'P/DSS2/color';
  const comparisonFrames=(profile.planning.comparisonSetupIds||[]).map(id=>(profile.equipment.setups||[]).find(setup=>setup.id===id)).filter(Boolean).map(fovForSetup).filter(Boolean).map((item,index)=>({id:item.id,name:item.name,width:item.width,height:item.height,rotation:frameRotation,color:['#ffcf5a','#ba7cff','#7ef29a'][index%3]}));
  const query=new URLSearchParams({ra:String(o.raHours*15),dec:String(o.decDeg),frameRa:String(frameCenterRa),frameDec:String(frameCenterDec),fov:String(targetFov),survey:String(survey),frameW:String(setupW),frameH:String(setupH),frameRot:String(frameRotation),showFrame:String(Boolean(profile.central.frameVisible&&setup)),objectW:String(objectW),objectH:String(objectH),objectRot:String(objectRotation),catalogRot:String(catalogRotation),showObject:String(Boolean(profile.central.objectSizeVisible)),showLabels:String(profile.central.aladinLabels?.visible!==false),labelDetail:String(profile.central.aladinLabels?.detail||'auto'),targetId:String(o.id),targetName:String(o.name),targetRa:String(o.raHours*15),targetDec:String(o.decDeg),showMoon:String(Boolean(profile.planning.showMoonInAladin)),moonRa:String(moonRaDeg),moonDec:String(moonDecDeg),moonLabel:language==='en'?`${moonName} · ${fmt(moonSep)}° distance · altitude ${fmt(moonAlt)}°`:`${moonName} · ${fmt(moonSep)}° Abstand · Höhe ${fmt(moonAlt)}°`,moonName,moonIllumination:String(moonPhase.illumination),moonAge:String(moonPhase.age),moonWaxing:String(moonPhase.waxing),outlinePolygons:'',outlineSource:'',dbName:DB_NAME,comparisonFrames:JSON.stringify(comparisonFrames),lang:language,frameKey:`${o.id}-${Math.round(frameCenterRa*100000)}-${Math.round(frameCenterDec*100000)}-${profile.central.frameVisible?'1':'0'}`,eqGrid:'false',altAzGrid:String(profile.central.externalAladin?.altAzGrid===true),altAzGridColor:String(profile.central.externalAladin?.altAzGridColor||'#1f6f52'),altAzGridLineWidth:String(profile.central.externalAladin?.altAzGridLineWidth??0.8),altAzGridStep:String(profile.central.externalAladin?.altAzGridStep||'auto'),groundMode:String(profile.central.externalAladin?.groundMode||'standard'),groundOpacity:String(profile.central.externalAladin?.groundOpacity??50),compass:String(profile.central.externalAladin?.compass!==false),orientation:String(profile.central.externalAladin?.orientation||'standard'),obsLat:String(loc.latitude),obsLon:String(loc.longitude),obsTime:time.toISOString(),horizonProfile:JSON.stringify(ensureHorizonProfile(loc,horizonProfileFor(loc)?.id))}).toString();
  const scopes=profile.equipment.telescopes.map(item=>`<option value="${esc(item.id)}" ${item.id===activeScope()?.id?'selected':''}>${esc(item.name)}</option>`).join(''),cameras=profile.equipment.cameras.map(item=>`<option value="${esc(item.id)}" ${item.id===activeCamera()?.id?'selected':''}>${esc(item.name)}</option>`).join('');
  const selectableObjects=[...new Map([...currentComputedObjects.map(entry=>entry.object),o].map(item=>[item.id,item])).values()].sort((a,b)=>a.id.localeCompare(b.id,'de',{numeric:true})),objectOptions=selectableObjects.map(x=>`<option value="${esc(x.id)}" ${x.id===o.id?'selected':''}>${esc(x.id)} · ${esc(x.name)}</option>`).join('');
  const analysis=framingAnalysis(o,{rotation:frameRotation,optimize:false});
  const activeAladinTab=['frame','objects','sky','time'].includes(profile.planning.aladinControlTab)?profile.planning.aladinControlTab:'frame';
  const tabButton=(key,label)=>`<button type="button" role="tab" data-aladin-control-tab="${key}" class="${activeAladinTab===key?'active':''}">${label}</button>`;
  const tabClass=key=>`framing-controls compact-framing-controls aladin-tab-panel ${activeAladinTab===key?'active':''}`;
  return`<section class="object-detail-section framing-section" id="framingCard">
    <div class="framing-header-grid"><div><div class="eyebrow">${ui('Interaktives Himmelsbild','Interactive sky image')}</div><h3>${ui('Rahmung','Framing')}: ${esc(o.id)} · ${esc(o.name)}</h3><div class="muted">${esc(o.type)} · ${fmt(o.majorArcMin)}′ × ${fmt(o.minorArcMin)}′ · ${language==='en'?esc(EN_EXACT[analysis.status]||analysis.status):esc(analysis.status)} · ${ui('Mindestrand','Minimum margin')} ${fmt(analysis.minMargin,1)} %</div></div><label>Objekt<select id="framingObjectSelect">${objectOptions}</select></label><label>Teleskop<select id="framingTelescopeSelect">${scopes}</select></label><label>Kamera<select id="framingCameraSelect">${cameras}</select></label></div>
    <div class="framing-view info-pos-${esc(profile.central.aladinInfo?.position||'right')}"><iframe id="aladinFrame" title="Aladin Lite – ${esc(o.id)}" src="aladin-frame.html?${query}" loading="eager"></iframe><div class="framing-info ${profile.central.aladinInfo?.visible===false?'hidden':''}"><div id="framingTimePosition"><strong id="framingTimeClock">${fmtTime(time,loc.timezone)}</strong><br>${ui('Höhe','Altitude')} ${fmt(currentAltitude)}° · ${ui('Azimut','azimuth')} ${fmt(currentAzimuth)}° (${cardinal(currentAzimuth)})<br><span class="horizon-delta-info">${horizonInfoLine}</span></div><div id="framingTimeWeather">${setup?`Setup ${fmt(setup.width,2)}° × ${fmt(setup.height,2)}°<br>${fmt(setup.pixelScale,2)}″/px`:ui('Kein Setup gewählt','No setup selected')}</div><div id="framingMoonInfo" class="moon-note">${moonName}: ${ui('Abstand','distance')} ${fmt(moonSep)}° · ${ui('Höhe','altitude')} ${fmt(moonAlt)}° · ${ui('Beleuchtung','illumination')} ${fmt(moonPhase.illumination)} %</div></div></div>
    <div class="aladin-control-card">
      <div class="aladin-control-tabs" role="tablist" aria-label="${ui('Aladin-Bediengruppen','Aladin control groups')}"><div class="aladin-tab-button-group">${tabButton('frame','Rahmen')}${tabButton('objects','Objekte')}${tabButton('sky','Himmelsbild')}${tabButton('time','Zeit & Mond')}</div><button type="button" id="openAladinExternal" class="aladin-external-action">Himmelsbild in neuem Tab öffnen</button></div>
      <div class="${tabClass('sky')}" data-aladin-tab-panel="sky"><label>Survey<select id="aladinSurveySelect">${availableSurveys.map(item=>`<option value="${esc(item.hipsId)}" ${survey===item.hipsId?'selected':''}>${optionText(item.name)}</option>`).join('')||`<option value="P/DSS2/color">DSS2 Farbe</option>`}</select></label><button type="button" id="reloadAladinImage">Himmelsbild neu laden</button><span class="small muted external-aladin-note">Mit Messwerkzeug und Umrisszeichnung. Der externe Tab kann jederzeit über den Button rechts in der Tab-Zeile geöffnet werden.</span></div>
      <div class="${tabClass('frame')}" data-aladin-tab-panel="frame"><div class="comparison-frame-picker"><span>Vergleichsrahmen</span>${(profile.equipment.setups||[]).map(setup=>`<label class="chip"><input type="checkbox" data-compare-setup="${esc(setup.id)}" ${(profile.planning.comparisonSetupIds||[]).includes(setup.id)?'checked':''}>${esc(setup.name)}</label>`).join('')}</div><label class="chip"><input id="frameVisible" type="checkbox" ${profile.central.frameVisible?'checked':''}>Setup-Rahmen anzeigen</label><label>Kamerarotation <span id="frameRotationValue">${fmt(frameRotation)}°</span><input id="frameRotation" type="range" min="0" max="179" value="${frameRotation}"></label><button type="button" id="optimalFrameRotation">Optimale Rotation</button><button type="button" id="centerAladinFrame">Rahmen auf Objekt zurücksetzen</button><button type="button" id="toggleFrameMoveMode" class="${profile.planning.frameMoveMode?'active':''}">Rahmen verschieben</button><button type="button" id="exportNinaPlan" class="primary">${language==='en'?'Export for N.I.N.A.':'Für N.I.N.A. exportieren'}</button></div>
      <div class="${tabClass('objects')}" data-aladin-tab-panel="objects"><label class="chip"><input id="aladinLabelsVisible" type="checkbox" ${profile.central.aladinLabels?.visible!==false?'checked':''}>Objektnamen anzeigen</label><label>Beschriftungsumfang<select id="aladinLabelDetail">${ALADIN_LABEL_DETAIL_OPTIONS.map(([key,label])=>`<option value="${key}" ${profile.central.aladinLabels?.detail===key?'selected':''}>${optionText(label)}</option>`).join('')}</select></label><label class="chip outline-control"><input id="objectSizeVisible" type="checkbox" ${profile.central.objectSizeVisible?'checked':''}>Objektumriss anzeigen</label><label class="outline-control" title="Dreht die Objektellipse bzw. manuelle Umrisse, nicht den Kamerarahmen.">Objekt-/Umrissrotation <span id="objectRotationValue">${fmt(objectRotation)}°</span><input id="objectRotation" class="short-range" type="range" min="0" max="179" value="${objectRotation}"></label><button type="button" id="resetObjectRotation" class="outline-control" title="Objektellipse auf den Katalog-Positionswinkel ${fmt(catalogRotation)}° zurücksetzen">Objektausrichtung zurücksetzen</button><label class="chip"><input id="aladinInfoVisible" type="checkbox" ${profile.central.aladinInfo?.visible!==false?'checked':''}>Infofelder anzeigen</label><label>Infofelder-Position<select id="aladinInfoPosition">${[['right','rechts'],['left','links'],['top','oben'],['bottom','unten']].map(([key,label])=>`<option value="${key}" ${profile.central.aladinInfo?.position===key?'selected':''}>${optionText(label)}</option>`).join('')}</select></label></div>
      <div class="${tabClass('time')}" data-aladin-tab-panel="time"><label class="chip"><input id="showMoonInAladin" type="checkbox" ${profile.planning.showMoonInAladin?'checked':''}>Mond anzeigen</label><label class="framing-time-control">Zeit im Planungsfenster <span id="framingTimeValue">${fmtTime(time,loc.timezone)} · ${Math.round((profile.planning.timeFraction||0)*100)} %</span><input id="framingTime" type="range" min="0" max="100" value="${(profile.planning.timeFraction||0)*100}"><small>${ui('Ändert Planungswerte, nicht das Sternfeld.','Changes planning values, not the star field.')} ${moonName}: ${fmt(moonSep)}° ${ui('Abstand','distance')}, ${ui('Höhe','altitude')} ${fmt(moonAlt)}°, ${ui('Beleuchtung','illumination')} ${fmt(moonPhase.illumination)} %.</small></label></div>
    </div>
  </section>`;
}

function normalizedLocationNumber(value,digits=3){const n=Number(value);return Number.isFinite(n)?n.toFixed(digits):'0'}
function externalWeatherUrls(loc){
  const lat=Number(loc?.latitude)||0, lon=Number(loc?.longitude)||0, name=String(loc?.name||'Planungsstandort').trim()||'Planungsstandort';
  const lat3=normalizedLocationNumber(lat,3), lon3=normalizedLocationNumber(lon,3), lat2=normalizedLocationNumber(lat,2), lon2=normalizedLocationNumber(lon,2);
  const windyParams=new URLSearchParams({type:'map',location:'coordinates',detail:'0',detailLat:lat3,detailLon:lon3,metricRain:'mm',metricSnow:'mm',metricTemp:'°C',metricWind:'kmh',zoom:'10',overlay:'clouds',product:'ecmwf',level:'surface',lat:lat3,lon:lon3,marker:'1',pressure:'0',message:'0',radarRange:'-1'});
  const ventuskyParams=new URLSearchParams({p:`${lat3};${lon3};9`,l:'clouds-total',pin:`${lat3};${lon3};dot;${name}`});
  const windyPageParams='';
  const ventuskyTime='';
  return {
    clearoutsidePage:`https://clearoutside.com/forecast/${lat2}/${lon2}`,
    clearoutsideImage:`https://clearoutside.com/forecast_image_large/${lat2}/${lon2}/forecast.png`,
    clearoutsideEmbed:`https://clearoutside.com/forecast_embed/${lat2}/${lon2}`,
    windyEmbed:`https://embed.windy.com/embed.html?${windyParams.toString()}`,
    windyPage:`https://www.windy.com/?clouds,${lat3},${lon3},10${windyPageParams}`,
    ventuskyEmbed:`https://embed.ventusky.com/?${ventuskyParams.toString()}`,
    ventuskyPage:`https://www.ventusky.com/?p=${lat3};${lon3};9&l=clouds-total${ventuskyTime}`
  };
}
function enabledWeatherSourceKeys(){
  const defaults={meteoblue:true,clearoutside:true,windy:true,ventusky:true};
  const settings={...defaults,...(profile.central.weatherSources||{})};
  return ['meteoblue','clearoutside','windy','ventusky'].filter(key=>settings[key]!==false);
}
function weatherSourceLabel(key){return ({meteoblue:'Meteoblue',clearoutside:'Clear Outside',windy:'Windy',ventusky:'Ventusky'})[key]||key}
function ensureActiveWeatherSourceTab(){
  const keys=enabledWeatherSourceKeys();
  if(!keys.length)return '';
  if(!keys.includes(profile.planning.weatherSourceTab))profile.planning.weatherSourceTab=keys[0];
  return profile.planning.weatherSourceTab;
}
function renderWeatherSourceTabs(loc,night,windowRange){
  const enabled=enabledWeatherSourceKeys();
  if(!enabled.length)return `<section class="card weather-source-tabs-card"><h2>${language==='en'?'Additional weather sources':'Zusätzliche Wetterquellen'}</h2><div class="notice subtle">${language==='en'?'No external weather source tab is enabled in Settings.':'In den Einstellungen ist keine externe Wetterquelle als Tab aktiviert.'}</div></section>`;
  const active=ensureActiveWeatherSourceTab();
  return `<section class="card weather-source-tabs-card"><div class="section-title-row"><div><h2>${language==='en'?'Additional weather sources':'Zusätzliche Wetterquellen'}</h2><div class="small muted">${language==='en'?'External reference sources for the selected planning location. Loaded only when the tab is opened.':'Externe Kontrollquellen für den gewählten Planungsstandort. Geladen wird erst beim Öffnen des jeweiligen Tabs.'}</div></div></div>
    <div class="settings-tabs weather-source-tabs" style="margin-top:12px">${enabled.map(key=>`<button type="button" data-weather-source-tab="${key}" class="${active===key?'active':''}">${esc(weatherSourceLabel(key))}</button>`).join('')}</div>
    <div class="weather-source-panel active">${renderWeatherSourcePanel(active,loc)}</div>
  </section>`;
}
function renderWeatherSourcePanel(key,loc){
  if(key==='meteoblue')return renderMeteoblue(loc);
  if(key==='clearoutside')return renderClearOutside(loc);
  if(key==='windy')return renderWindy(loc);
  if(key==='ventusky')return renderVentusky(loc);
  return '';
}
function renderExternalSourceShell({title,subtitle,notice,embedId,frameTitle,frameUrl,pageUrl,buttonText,content,sourceName,hideFullscreen=false,extraClass=''}){
  return `<section class="card external-weather-card ${esc(extraClass)}"><details open class="weather-inner-details"><summary><strong>${esc(title)}</strong> · ${esc(subtitle)}</summary>
    <div class="notice" style="margin-top:12px">${notice}</div>
    <div class="meteoblue-actions external-weather-actions" style="margin-top:10px">
      ${hideFullscreen?'':`<button type="button" data-meteoblue-fullscreen="${esc(embedId)}">⛶ ${language==='en'?'Full-screen view':'Großansicht'}</button>`}
      <a class="button primary" href="${esc(pageUrl)}" target="_blank" rel="noopener noreferrer">${esc(buttonText)}</a>
    </div>
    <div class="meteoblue-embed external-weather-embed" id="${esc(embedId)}">${content||`<iframe class="meteoblue-frame external-weather-frame" title="${esc(frameTitle)}" src="${esc(frameUrl)}" loading="lazy" sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms" referrerpolicy="strict-origin-when-cross-origin"></iframe>`}</div>
    <div class="meteoblue-credit"><a href="${esc(pageUrl)}" target="_blank" rel="noopener noreferrer">${esc(sourceName)}</a></div>
  </details></section>`;
}
function renderClearOutside(loc){
  const urls=externalWeatherUrls(loc), place=loc?.name||'Planungsstandort';
  const langNote=language==='en'?'The embedded forecast image is provided by Clear Outside. Its internal labels are part of the image and cannot be translated by the Astro Night Planner.':'Das eingebundene Prognosebild stammt direkt von Clear Outside. Die Beschriftungen innerhalb des Bildes sind Teil der Grafik und können vom Astro Night Planner nicht übersetzt werden.';
  const content=`<a class="clearoutside-image-link" href="${esc(urls.clearoutsidePage)}" target="_blank" rel="noopener noreferrer" aria-label="${language==='en'?'Open Clear Outside forecast':'Clear-Outside-Prognose öffnen'}"><img class="clearoutside-forecast-image" src="${esc(urls.clearoutsideImage)}" alt="Clear Outside Forecast ${esc(place)}" loading="lazy"></a><div class="small muted clearoutside-language-note">${esc(langNote)}</div>`;
  return renderExternalSourceShell({title:'Clear Outside',subtitle:language==='en'?'astronomy forecast image':'Astro-Prognosebild',notice:language==='en'?`Clear Outside is embedded as an automatically updated forecast image for ${esc(place)}. Open it in a separate browser tab for the full forecast.`:`Clear Outside wird als automatisch aktualisiertes Prognosebild für ${esc(place)} eingebunden. Für die vollständige Ansicht kannst du die Quelle in einem separaten Browser-Tab öffnen.`,embedId:'clearOutsideWrap',pageUrl:urls.clearoutsidePage,buttonText:language==='en'?'Open Clear Outside in a new tab':'Clear Outside in neuem Tab öffnen',content,sourceName:'Clear Outside',hideFullscreen:true,extraClass:'clearoutside-card'});
}
function renderWindy(loc){
  const urls=externalWeatherUrls(loc), place=loc?.name||'Planungsstandort';
  return renderExternalSourceShell({title:'Windy',subtitle:language==='en'?'interactive weather map':'interaktive Wetterkarte',notice:language==='en'?`Windy is opened directly at ${esc(place)} with cloud layer, ECMWF model, metric units and a closer zoom.`:`Windy wird direkt am Standort ${esc(place)} mit Wolkenlayer, ECMWF-Modell, metrischen Einheiten und näherem Zoom geöffnet.`,embedId:'windyWrap',frameTitle:`Windy Wetterkarte für ${place}`,frameUrl:urls.windyEmbed,pageUrl:urls.windyPage,buttonText:language==='en'?'Open Windy in a new tab':'Windy in neuem Tab öffnen',sourceName:'Windy'});
}
function renderVentusky(loc){
  const urls=externalWeatherUrls(loc), place=loc?.name||'Planungsstandort';
  return renderExternalSourceShell({title:'Ventusky',subtitle:language==='en'?'interactive weather map':'interaktive Wetterkarte',notice:language==='en'?`Ventusky is opened directly at ${esc(place)} with total cloud cover, a location marker and a closer zoom. Units and language follow the browser settings.`:`Ventusky wird direkt am Standort ${esc(place)} mit Gesamtbewölkung, Standortmarker und näherem Zoom geöffnet. Einheiten und Sprache folgen den Browser-Einstellungen.`,embedId:'ventuskyWrap',frameTitle:`Ventusky Wetterkarte für ${place}`,frameUrl:urls.ventuskyEmbed,pageUrl:urls.ventuskyPage,buttonText:language==='en'?'Open Ventusky in a new tab':'Ventusky in neuem Tab öffnen',sourceName:'Ventusky'});
}

async function fetchFlightWeather(){
  const ids=selectedAviationStations(activeLocation()).map(st=>st.id).join(',');
  if(!ids){flightWeatherError=language==='en'?'No aviation weather station selected.':'Keine Flugwetterstation ausgewählt.';render();return}
  flightWeatherLoading=true;flightWeatherError='';render();
  try{
    const proxy=aviationProxyUrl(ids);
    const res=await fetch(proxy,{cache:'no-store'});
    if(!res.ok)throw new Error(`HTTP ${res.status}`);
    const payload=await res.json();
    flightWeatherData={metars:Array.isArray(payload.metars)?payload.metars:[],tafs:Array.isArray(payload.tafs)?payload.tafs:[],loadedAt:payload.fetchedAt||new Date().toISOString(),source:'proxy'};
  }catch(error){
    flightWeatherError=(language==='en'?'Aviation weather data could not be loaded at the moment. Reason: ':'Flugwetterdaten konnten derzeit nicht geladen werden. Grund: ')+(error?.message||String(error));
  }finally{flightWeatherLoading=false;render();}
}
async function testFlightWeatherProxy(){
  alert(language==='en'?'The proxy is fixed in the app and no manual test is required.':'Der Proxy ist fest in der App hinterlegt und muss nicht manuell getestet werden.');
}
async function fetchMosmix(){
  const loc=activeLocation(); if(!loc)return;
  mosmixLoading=true;mosmixError='';render();
  try{
    const response=await fetch(brightskyMosmixUrl(loc),{cache:'no-store'});
    if(!response.ok)throw new Error(`${response.status} ${response.statusText}`);
    const payload=await response.json();
    mosmixData={...payload,loadedAt:new Date().toISOString(),source:'Bright Sky / DWD'};
  }catch(error){mosmixError=(language==='en'?'MOSMIX point forecast could not be loaded: ':'MOSMIX-/Punktprognose konnte nicht geladen werden: ')+(error?.message||String(error));}
  finally{mosmixLoading=false;render();}
}

function renderMeteoblue(loc){
  const urls=meteoblueLocationInfo(loc);
  const mapCollapsed=profile.central.cloudMap?.meteoblueMapCollapsed!==false;
  const locationText=urls.fixed?loc.name:ui('automatische Meteoblue-Standorterkennung','automatic Meteoblue location detection');
  return`<section class="card meteoblue-card">
    <details ${profile.central.meteoblueCollapsed?'':'open'} id="meteoblueDetails">
      <summary><strong>Meteoblue Astronomy Seeing</strong> · ${ui('unabhängige Kontrollvorhersage','independent reference forecast')}</summary>
      <div class="notice" style="margin-top:12px">${ui('Diese Kontrollvorhersage wird nicht in den automatischen Modellkonsens eingerechnet. Standort:','This reference forecast is not included in the automatic model consensus. Location:')} <strong>${esc(locationText)}</strong>.</div>
      <div class="meteoblue-actions" style="margin-top:10px">
        <button data-meteoblue-fullscreen="meteoblueSeeingWrap">⛶ ${ui('Großansicht','Large view')}</button>
        <a class="button primary" href="${urls.seeingPage}" target="_blank" rel="noopener noreferrer">${ui('Bei Meteoblue öffnen','Open at Meteoblue')}</a>
      </div>
      <div class="meteoblue-embed" id="meteoblueSeeingWrap">
        <iframe class="meteoblue-frame seeing-frame" title="${ui('Meteoblue Astronomy Seeing für','Meteoblue Astronomy Seeing for')} ${esc(loc.name)}" src="${urls.seeingWidget}" loading="lazy"
          allow="geolocation" sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms" referrerpolicy="strict-origin-when-cross-origin"></iframe>
      </div>
      <div class="meteoblue-credit"><a href="${urls.seeingPage}" target="_blank" rel="noopener noreferrer">meteoblue</a></div>
    </details>
  </section>
  <section class="card meteoblue-card">
    <details ${mapCollapsed?'':'open'} id="meteoblueMapDetails">
      <summary><strong>${ui('Meteoblue Wetterkarten','Meteoblue weather maps')}</strong> · ${ui('zusätzliche Live-, Radar-, Satelliten- und Modellansicht','additional live, radar, satellite and model view')}</summary>
      <div class="notice" style="margin-top:12px">${ui('Die eingebettete Karte startet wieder als Windanimationskarte. Für Wolken und Niederschlag nutze den separaten Meteoblue-Button.','The embedded map starts as the wind-animation map again. For clouds and precipitation, use the separate Meteoblue button.')}<br>${ui('Die separaten Meteoblue-Buttons übergeben den aktuellen Planungsstandort und öffnen gezielt Windanimation oder Wolken/Niederschlag.','The separate Meteoblue buttons pass the current planning location and open wind animation or clouds/precipitation deliberately.')}</div>
      <div class="meteoblue-actions" style="margin-top:10px">
        <button data-meteoblue-fullscreen="meteoblueMapWrap">⛶ ${ui('Großansicht','Large view')}</button>
        <a class="button primary" href="${urls.mapPage}" target="_blank" rel="noopener noreferrer">${ui('Wolken-/Niederschlagskarte bei Meteoblue öffnen','Open Meteoblue cloud/precipitation map')}</a>
        <a class="button" href="${urls.windMapPage}" target="_blank" rel="noopener noreferrer">${ui('Windanimationskarte bei Meteoblue öffnen','Open Meteoblue wind animation map')}</a>
      </div>
      <div class="meteoblue-embed meteoblue-map-embed" id="meteoblueMapWrap">
        <iframe class="meteoblue-frame map-frame" title="${ui('Meteoblue Wetterkarten für','Meteoblue weather maps for')} ${esc(loc.name)}" src="${urls.mapWidget}" loading="lazy"
          allow="geolocation" sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms" referrerpolicy="strict-origin-when-cross-origin"></iframe>
      </div>
      <div class="meteoblue-credit"><a href="${urls.mapPage}" target="_blank" rel="noopener noreferrer">meteoblue</a></div>
    </details>
  </section>`
}

function renderSaveBar(section,label='Änderungen speichern',placement='bottom'){
  const dirty=dirtySections.has(section),success=saveFeedbackSections.has(section);
  const state=dirty?ui('Ungespeicherte Änderungen','Unsaved changes'):success?ui('Erfolgreich gespeichert','Saved successfully'):ui('Gespeichert','Saved');
  return`<div class="save-bar ${placement==='top'?'save-bar-top':''} ${dirty?'is-dirty':''} ${success?'is-success':''}"><span class="save-state">${state}</span><div class="save-actions"><button type="button" class="ghost section-reset-button" data-reset-section="${section}">${ui('Rubrik auf Standard zurücksetzen','Reset section to defaults')}</button><button type="button" class="ghost section-discard-button" data-discard-section="${section}" ${dirty?'':'disabled'}>${ui('Änderungen verwerfen','Discard changes')}</button><button data-save-section="${section}" data-default-label="${esc(label)}" class="primary ${success?'save-success':''}" ${success?'disabled':''}>${success?ui('Gespeichert ✓','Saved ✓'):optionLabel(label)}</button></div></div>`;
}
function resetDraftSection(section){
  const base=standardProfile();
  if(section==='equipment')draft.equipment=deepClone(base.equipment);
  if(section==='centralWind'){
    draft.central.windUnit=base.central.windUnit;draft.central.activeWindProfile=base.central.activeWindProfile;draft.central.windProfiles=deepClone(base.central.windProfiles);draft.central.dew=deepClone(base.central.dew);draft.central.jet=deepClone(base.central.jet);
  }
  if(section==='weatherModels')draft.central.weatherModels=deepClone(base.central.weatherModels);
  if(section==='cloudMap'){draft.central.cloudMap=deepClone(base.central.cloudMap);draft.central.weatherSources=deepClone(base.central.weatherSources);draft.central.multiNightWeather=deepClone(base.central.multiNightWeather);}
  if(section==='aurora')draft.central.aurora=deepClone(base.central.aurora);
  if(section==='weights')draft.central.weights=deepClone(base.central.weights);
  if(section==='display'){
    draft.central.defaultPlanningWindow=base.central.defaultPlanningWindow;draft.central.framing=deepClone(base.central.framing);draft.central.qualityThresholds=deepClone(base.central.qualityThresholds);draft.central.aladinLabels=deepClone(base.central.aladinLabels);draft.central.aladinSurveys=deepClone(base.central.aladinSurveys);draft.central.externalAladin=deepClone(base.central.externalAladin);draft.central.miniHorizon=deepClone(base.central.miniHorizon);draft.central.listDisplay=deepClone(base.central.listDisplay);draft.central.frameVisible=base.central.frameVisible;draft.central.objectSizeVisible=base.central.objectSizeVisible;draft.central.meteoblueCollapsed=base.central.meteoblueCollapsed;draft.central.detailPanels=deepClone(base.central.detailPanels);draft.central.collapsed=deepClone(base.central.collapsed);draft.central.visibleSections=deepClone(base.central.visibleSections);
  }
  if(section==='locations'){
    draft.locations=deepClone(base.locations);draft.selectedLocationId=base.selectedLocationId;draft.central.defaultLocationId=base.central.defaultLocationId;draft.central.gpsBehavior=base.central.gpsBehavior;draft.central.locationSearchCountry=base.central.locationSearchCountry;locationSearchResults=[];locationSearchQuery='';locationSearchError='';horizonUndoStack=[];horizonObstacleDrawId=null;
  }
  if(section==='backup')backupDraft=deepClone({enabled:false,afterSave:true,daily:true,keep:10,reminderDays:7,lastSuccessAt:backupConfig.lastSuccessAt,lastError:'',lastDailyDate:backupConfig.lastDailyDate,targetName:backupConfig.targetName,permission:backupConfig.permission});
  setSectionDirty(section);render();
}

function discardDraftSection(section){
  if(!dirtySections.has(section))return;
  if(section==='equipment')draft.equipment=deepClone(profile.equipment);
  if(section==='centralWind'){
    draft.central.windUnit=profile.central.windUnit;draft.central.activeWindProfile=profile.central.activeWindProfile;draft.central.windProfiles=deepClone(profile.central.windProfiles);draft.central.dew=deepClone(profile.central.dew);draft.central.jet=deepClone(profile.central.jet);
  }
  if(section==='weatherModels')draft.central.weatherModels=deepClone(profile.central.weatherModels);
  if(section==='cloudMap'){draft.central.cloudMap=deepClone(profile.central.cloudMap);draft.central.weatherSources=deepClone(profile.central.weatherSources||{meteoblue:true,clearoutside:true,windy:true,ventusky:true});draft.central.multiNightWeather=deepClone(profile.central.multiNightWeather||{extraNights:3});}
  if(section==='aurora')draft.central.aurora=deepClone(profile.central.aurora||standardProfile().central.aurora);
  if(section==='weights')draft.central.weights=deepClone(profile.central.weights);
  if(section==='filterProfiles'){draft.central.sizeProfiles=deepClone(profile.central.sizeProfiles);draft.central.objectTypeProfiles=deepClone(profile.central.objectTypeProfiles);draft.central.defaultMinScore=profile.central.defaultMinScore;draft.central.defaultMinVisibleReference=profile.central.defaultMinVisibleReference;draft.central.defaultMaxSurfaceBrightness=profile.central.defaultMaxSurfaceBrightness;}
  if(section==='display'){
    draft.central.defaultPlanningWindow=profile.central.defaultPlanningWindow;draft.central.framing=deepClone(profile.central.framing);draft.central.qualityThresholds=deepClone(profile.central.qualityThresholds);draft.central.aladinLabels=deepClone(profile.central.aladinLabels);draft.central.aladinSurveys=deepClone(profile.central.aladinSurveys);draft.central.externalAladin=deepClone(profile.central.externalAladin||standardProfile().central.externalAladin);draft.central.miniHorizon=deepClone(profile.central.miniHorizon||standardProfile().central.miniHorizon);draft.central.listDisplay=deepClone(profile.central.listDisplay);draft.central.frameVisible=profile.central.frameVisible;draft.central.objectSizeVisible=profile.central.objectSizeVisible;draft.central.meteoblueCollapsed=profile.central.meteoblueCollapsed;draft.central.detailPanels=deepClone(profile.central.detailPanels);draft.central.collapsed=deepClone(profile.central.collapsed);draft.central.visibleSections=deepClone(profile.central.visibleSections||{});
  }
  if(section==='locations'){
    draft.locations=deepClone(profile.locations);draft.selectedLocationId=profile.selectedLocationId;draft.central.defaultLocationId=profile.central.defaultLocationId;draft.central.gpsBehavior=profile.central.gpsBehavior;draft.central.locationSearchCountry=profile.central.locationSearchCountry;locationSearchResults=[];locationSearchQuery='';locationSearchError='';horizonUndoStack=[];horizonObstacleDrawId=null;
  }
  if(section==='backup')backupDraft=deepClone(backupConfig);
  dirtySections.delete(section);saveFeedbackSections.delete(section);render();
}
function settingsTabHasDirty(tab){
  const groups={equipment:['equipment'],central:['centralWind','weatherModels','cloudMap','weights','display','filterProfiles'],locations:['locations'],targets:['targets'],info:['backup']};
  return(groups[tab]||[]).some(key=>dirtySections.has(key));
}
function renderSettings(){
  const tabs=[['equipment','Ausrüstung'],['central','Zentrale Einstellungen'],['locations','Standorte & Horizont'],['targets','Meine Aufnahmeziele'],['info','Info, Hilfe & Sicherung']];
  return`<div data-page="settings"><section class="card"><div class="section-title-row"><div><h2>Einstellungen</h2><div class="muted">Lokales Profil „${esc(profile.name)}“ · Einstellungen in IndexedDB, Programmdateien im PWA-Cache</div></div>${renderProfileBar()}</div><div class="settings-tabs" style="margin-top:16px">${tabs.map(([k,n])=>`<button data-settings-tab="${k}" class="${currentSettingsTab===k?'active':''} ${settingsTabHasDirty(k)?'dirty-dot':''}">${n}</button>`).join('')}</div></section><section class="settings-section ${currentSettingsTab==='equipment'?'active':''}">${renderEquipment()}</section><section class="settings-section ${currentSettingsTab==='central'?'active':''}">${renderCentral()}</section><section class="settings-section ${currentSettingsTab==='locations'?'active':''}">${renderLocations()}</section><section class="settings-section ${currentSettingsTab==='targets'?'active':''}">${renderTargets()}</section><section class="settings-section ${currentSettingsTab==='info'?'active':''}">${renderInfo()}</section></div>`
}
function renderProfileBar(){return`<div class="profile-bar"><select id="settingsProfileSelect">${profiles.map(p=>`<option value="${esc(p.id)}" ${p.id===profile.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select><button id="newProfile">Neu</button><button id="duplicateProfile">Duplizieren</button><button id="renameProfile">Umbenennen</button><button id="deleteProfile" class="danger" ${profiles.length===1?'disabled':''}>Löschen</button></div>`}
function renderEquipment(){
  updateCalculatedEquipmentValues(draft.equipment);
  const opticals=opticalAccessoriesFor(draft.equipment);
  return`<div class="card equipment-settings-card">
  ${renderSaveBar('equipment','Ausrüstung speichern','top')}
  <div class="section-title-row"><div><h2>Teleskope und Objektive</h2><div class="small muted">Brennweite, Öffnung oder Blende bestimmen zusammen mit Kamera und optischem Faktor das Bildfeld.</div></div><button id="addTelescope">Teleskop hinzufügen</button></div>
  <div class="equipment-list">${draft.equipment.telescopes.map(s=>`<div class="equipment-row scope-row extended-equipment-row" data-scope-row="${s.id}"><label>Name<input data-scope="name" data-default-clear="true" value="${esc(s.name)}"></label><label>Brennweite (mm)<input data-scope="focalLength" type="number" min="1" value="${s.focalLength}"></label><label>Blende / f-Zahl<input data-scope="fRatio" type="number" min="0.1" step="0.1" value="${Number(s.fRatio)||fmt(fRatioFromScope(s),1)}"></label><label>Öffnung (mm)<input data-scope="aperture" type="number" min="1" step="0.1" value="${s.aperture||''}"></label><div class="small muted calculated-equipment-value">Berechnet: f/${fmt(fRatioFromScope(s),1)} · ${s.aperture?fmt(Number(s.aperture),1)+' mm Öffnung':'Öffnung fehlt'}</div><label class="chip"><input data-selected-scope type="radio" name="selectedScope" value="${s.id}" ${draft.equipment.selectedTelescopeId===s.id?'checked':''}>Aktiv</label><button data-delete-scope="${s.id}" class="danger">Entfernen</button></div>`).join('')}</div>
  <div class="divider"></div>
  <div class="section-title-row"><div><h2>Kameras</h2><div class="small muted">Sensorgröße bestimmt das Bildfeld. Pixelgröße kann direkt eingegeben oder aus Sensorgröße und Auflösung/Megapixel berechnet werden.</div></div><button id="addCamera">Kamera hinzufügen</button></div>
  <div class="equipment-list">${draft.equipment.cameras.map(c=>`<div class="equipment-row camera-row extended-equipment-row" data-camera-row="${c.id}"><label>Name<input data-camera="name" data-default-clear="true" value="${esc(c.name)}"></label><label>Sensorbreite (mm)<input data-camera="sensorWidth" type="number" min="0.1" step="0.01" value="${c.sensorWidth}"></label><label>Sensorhöhe (mm)<input data-camera="sensorHeight" type="number" min="0.1" step="0.01" value="${c.sensorHeight}"></label><label>Auflösung X (px)<input data-camera="resolutionX" type="number" min="1" step="1" value="${c.resolutionX||''}"></label><label>Auflösung Y (px)<input data-camera="resolutionY" type="number" min="1" step="1" value="${c.resolutionY||''}"></label><label>Megapixel<input data-camera="megapixels" type="number" min="0.1" step="0.1" value="${c.megapixels||''}"></label><label>Pixelgröße (µm)<input data-camera="pixelSize" type="number" min="0.1" step="0.01" value="${c.pixelSize}"></label><div class="small muted calculated-equipment-value">Berechnet: ${fmt(c.pixelSize,2)} µm${c.resolutionX&&c.resolutionY?` · ${fmt(c.megapixels,2)} MP`:''}</div><label class="chip"><input data-selected-camera type="radio" name="selectedCamera" value="${c.id}" ${draft.equipment.selectedCameraId===c.id?'checked':''}>Aktiv</label><button data-delete-camera="${c.id}" class="danger">Entfernen</button></div>`).join('')}</div>
  <div class="divider"></div>
  <div class="section-title-row"><div><h2>Reducer, Flattener und Barlow</h2><div class="small muted">Optische Faktoren werden im Setup berücksichtigt. Beispiel: 0,8× Reducer oder 2,0× Barlow.</div></div><button id="addOpticalAccessory">Optische Komponente hinzufügen</button></div>
  <div class="equipment-list">${(draft.equipment.opticalAccessories||[]).map(acc=>`<div class="equipment-row optical-row" data-optical-row="${acc.id}"><label>Name<input data-optical="name" data-default-clear="true" value="${esc(acc.name)}"></label><label>Typ<select data-optical="type">${[['reducer','Reducer/Flattener'],['barlow','Barlow'],['neutral','Neutral/Sonstige']].map(([key,label])=>`<option value="${key}" ${acc.type===key?'selected':''}>${label}</option>`).join('')}</select></label><label>Faktor<input data-optical="factor" type="number" min="0.1" step="0.01" value="${Number(acc.factor)||1}"></label><button data-delete-optical="${acc.id}" class="danger">Entfernen</button></div>`).join('')||'<div class="notice">Noch keine optische Zusatzkomponente angelegt. Setups verwenden dann Faktor 1,0×.</div>'}</div>
  <div class="divider"></div>
  <div class="section-title-row"><div><h2>Montierungen</h2><div class="small muted">Die Montierung wird derzeit dokumentiert; eine spätere Qualitätsbewertung kann Typ und Tragfähigkeit berücksichtigen.</div></div><button id="addMount">Montierung hinzufügen</button></div>
  <div class="equipment-list">${draft.equipment.mounts.map(m=>`<div class="equipment-row mount-row" data-mount-row="${m.id}"><label>Name<input data-mount="name" data-default-clear="true" value="${esc(m.name)}"></label><label>Montierungsart<select data-mount="type">${['Parallaktisch','Alt-Azimutal','Startracker','Säule / stationär','Sonstige'].map(type=>`<option ${m.type===type?'selected':''}>${type}</option>`).join('')}</select></label><label>Max. Zuladung (kg, optional)<input data-mount="maxPayloadKg" type="number" min="0" step="0.1" value="${m.maxPayloadKg??''}"></label><label class="chip"><input data-selected-mount type="radio" name="selectedMount" value="${m.id}" ${draft.equipment.selectedMountId===m.id?'checked':''}>Aktiv</label><button data-delete-mount="${m.id}" class="danger">Entfernen</button></div>`).join('')}</div>
  <div class="divider"></div>
  <div class="section-title-row"><div><h2>Setup-Kombinationen</h2><div class="small muted">Setups bündeln Teleskop/Objektiv, Kamera, Montierung und optional Reducer/Barlow. Daraus berechnet die Planung die effektive Rahmung.</div></div><button id="addSetup">Setup hinzufügen</button></div>
  <div class="equipment-list">${(draft.equipment.setups||[]).map(setup=>{const scope=draft.equipment.telescopes.find(s=>s.id===setup.telescopeId), fl=effectiveFocalLength(scope,setup,draft.equipment), factor=opticalFactorForSetup(setup,draft.equipment);return`<div class="equipment-row setup-row extended-equipment-row" data-setup-row="${setup.id}"><label>Name<input data-setup="name" data-default-clear="true" value="${esc(setup.name)}"></label><label>Teleskop<select data-setup="telescopeId">${draft.equipment.telescopes.map(scope=>`<option value="${esc(scope.id)}" ${setup.telescopeId===scope.id?'selected':''}>${esc(scope.name)}</option>`).join('')}</select></label><label>Kamera<select data-setup="cameraId">${draft.equipment.cameras.map(camera=>`<option value="${esc(camera.id)}" ${setup.cameraId===camera.id?'selected':''}>${esc(camera.name)}</option>`).join('')}</select></label><label>Optik<select data-setup="opticalAccessoryId">${opticals.map(acc=>`<option value="${esc(acc.id)}" ${setup.opticalAccessoryId===acc.id?'selected':''}>${esc(acc.name)} (${fmt(Number(acc.factor)||1,2)}×)</option>`).join('')}</select></label><label>Faktor<input data-setup="opticalFactor" type="number" min="0.1" step="0.01" value="${Number(setup.opticalFactor)||factor}"></label><label>Montierung<select data-setup="mountId">${draft.equipment.mounts.map(mount=>`<option value="${esc(mount.id)}" ${setup.mountId===mount.id?'selected':''}>${esc(mount.name)}</option>`).join('')}</select></label><div class="small muted calculated-equipment-value">Effektive Brennweite: ${fl?fmt(fl,0)+' mm':'–'} · Faktor ${fmt(factor,2)}×</div><label class="chip"><input data-selected-setup type="radio" name="selectedSetup" value="${setup.id}" ${draft.equipment.selectedSetupId===setup.id?'checked':''}>Aktiv</label><button data-delete-setup="${setup.id}" class="danger">Entfernen</button></div>`}).join('')}</div>
  ${renderSaveBar('equipment','Ausrüstung speichern')}
</div>`}
function renderDisplayColumnConfigurator(key,value){
  const order=Array.isArray(value.columnOrder)?value.columnOrder:DISPLAY_COLUMN_IDS;
  const visible=new Set(value.columns||[]);visible.add('name');
  const isOpen=openDisplayConfigKey===key;
  return`<details class="display-column-config" data-display-config="${esc(key)}" ${isOpen?'open':''}><summary><span class="disclosure-arrow" aria-hidden="true"></span>${esc(value.name)} – Informationen und Reihenfolge</summary><div class="display-column-config-body"><label>Objekte/Seite<select data-display-page-size="${esc(key)}">${[10,20,50,100].map(number=>`<option ${Number(value.pageSize)===number?'selected':''}>${number}</option>`).join('')}</select></label><div class="small muted">Einträge per Drag & Drop verschieben oder die Pfeile verwenden. Der Objektname bleibt immer sichtbar.</div><div class="display-column-list" data-display-column-list="${esc(key)}">${order.map((id,index)=>{const label=DISPLAY_COLUMNS.find(item=>item[0]===id)?.[1]||id,locked=id==='name';return`<div class="display-column-item" draggable="true" data-display-column-item="${esc(id)}" data-profile-key="${esc(key)}"><span class="drag-handle" title="Ziehen">↕</span><label class="chip"><input type="checkbox" data-display-column-profile="${esc(key)}" data-column="${esc(id)}" ${visible.has(id)?'checked':''} ${locked?'disabled':''}>${esc(label)}</label><div class="column-move-buttons"><button type="button" data-move-column="up" data-profile-key="${esc(key)}" data-column="${esc(id)}" ${index===0?'disabled':''} aria-label="Nach oben">↑</button><button type="button" data-move-column="down" data-profile-key="${esc(key)}" data-column="${esc(id)}" ${index===order.length-1?'disabled':''} aria-label="Nach unten">↓</button></div></div>`}).join('')}</div></div></details>`;
}
function renderCentral(){
  const c=draft.central;
  const total=Object.values(c.weights).reduce((a,b)=>a+Number(b||0),0);
  const weatherTotal=Object.values(c.weatherModels?.weights||{}).reduce((a,b)=>a+Number(b||0),0);
  return`<div class="settings-tabs subtabs">${[['wind','Wind'],['weather','Wetter/Karte'],['weights','Bewertung'],['display','Anzeige'],['filters','Filterprofile'],['aurora','Polarlicht']].map(([k,n])=>`<button data-central-subtab="${k}" class="${currentCentralSubTab===k?'active':''}">${optionText(n)}</button>`).join('')}</div><div class="card subtab-panel ${currentCentralSubTab==='wind'?'active':''}">
    ${renderSaveBar('centralWind','Windwerte speichern','top')}
    <div class="section-title-row"><div><h2>Wind und Aufnahmequalität</h2><div class="small muted">Grenzwerte bewerten die erwartete Aufnahmequalität, nicht die strukturelle Sicherheit der Ausrüstung.</div></div></div>
    <div class="grid two">
      <label>Einheit für Wind, Böen und Jetstream<select id="windUnit"><option value="kmh" ${c.windUnit==='kmh'?'selected':''}>km/h</option><option value="ms" ${c.windUnit==='ms'?'selected':''}>m/s</option></select></label>
      <label>Aktives Aufnahmequalitätsprofil<select id="activeWindProfile">${Object.entries(c.windProfiles).map(([key,value])=>`<option value="${key}" ${c.activeWindProfile===key?'selected':''}>${esc(value.name)}</option>`).join('')}</select></label>
    </div>
    <div class="grid three" style="margin-top:12px">${Object.entries(c.windProfiles).map(([key,value])=>`<div class="metric"><strong>${esc(value.name)}</strong>
      <label>Wind grün unter (${windUnitLabel(c.windUnit)})<input data-wind-profile="${key}" data-field="windGreen" type="number" value="${value.windGreen}"></label>
      <label>Wind gelb bis (${windUnitLabel(c.windUnit)})<input data-wind-profile="${key}" data-field="windYellow" type="number" value="${value.windYellow}"></label>
      <label>Böen grün unter (${windUnitLabel(c.windUnit)})<input data-wind-profile="${key}" data-field="gustGreen" type="number" value="${value.gustGreen}"></label>
      <label>Böen gelb bis (${windUnitLabel(c.windUnit)})<input data-wind-profile="${key}" data-field="gustYellow" type="number" value="${value.gustYellow}"></label>
    </div>`).join('')}</div>
    <div class="grid two" style="margin-top:12px">
      <div class="metric"><strong>Tauabstand</strong><label>Grün über (°C)<input id="dewGreen" type="number" value="${c.dew.green}"></label><label>Gelb ab (°C)<input id="dewYellow" type="number" value="${c.dew.yellow}"></label></div>
      <div class="metric"><strong>Jetstream</strong><label>Grün unter (${windUnitLabel(c.windUnit)})<input id="jetGreen" type="number" value="${c.jet.green}"></label><label>Gelb bis (${windUnitLabel(c.windUnit)})<input id="jetYellow" type="number" value="${c.jet.yellow}"></label></div>
    </div>
    ${renderSaveBar('centralWind','Windwerte speichern')}
  </div>
  <div class="card subtab-panel ${currentCentralSubTab==='weather'?'active':''}">
    ${renderSaveBar('weatherModels','Wettermodelle speichern','top')}
    <div class="section-title-row"><div><h2>Wettermodelle</h2><div class="small muted">Gewichtung für den Modellkonsens je Prognosestunde</div></div><span class="weight-total ${weatherTotal===100?'ok':'error'}">Summe: ${weatherTotal} %</span></div>
    <div class="notice">Der Modellkonsens mittelt DWD ICON, ECMWF IFS und NOAA GFS nach diesen Anteilen. Default: 40 % / 20 % / 40 %.</div>
    <div class="grid three" style="margin-top:12px">${Object.entries(WEATHER_MODEL_CONFIG).map(([key,value])=>`<label>${esc(value.name)} (%)<input data-weather-weight="${key}" type="number" min="0" max="100" step="1" value="${Number(c.weatherModels?.weights?.[key]??value.defaultWeight)}"></label>`).join('')}</div>
    <div class="grid two" style="margin-top:12px"><label>Standarddarstellung in der Planung<select id="defaultWeatherView">${WEATHER_VIEW_OPTIONS.map(([key,label])=>`<option value="${key}" ${c.weatherModels?.defaultView===key?'selected':''}>${optionText(label)}</option>`).join('')}</select></label><div class="notice">In der Planung kann die Ansicht temporär auf ein Einzelmodell umgestellt werden. Der Standard wird ausschließlich hier gespeichert.</div></div>
    ${renderSaveBar('weatherModels','Wettermodelle speichern')}
  </div>
  <div class="card subtab-panel ${currentCentralSubTab==='weather'?'active':''}">
    ${renderSaveBar('cloudMap','Wolkenkarte speichern','top')}
    <div class="section-title-row"><div><h2>Wolkenkarte und Datenmenge</h2><div class="small muted">Auflösung, Kartenausschnitt und Standarddarstellung der animierten 24-Stunden-Prognose</div></div></div>
    <div class="grid three">
      <label>Kartendetails<select id="cloudMapGridSize">${CLOUD_MAP_GRID_OPTIONS.map(([value,label])=>`<option value="${value}" ${Number(c.cloudMap?.gridSize)===value?'selected':''}>${esc(label.replace('Kartenpunkte','Prognosepunkte'))}</option>`).join('')}</select></label>
      <label>Kartenradius<select id="cloudMapRadius">${CLOUD_MAP_RADIUS_OPTIONS.map(([value,label])=>`<option value="${value}" ${Number(c.cloudMap?.radiusKm)===value?'selected':''}>${esc(label)}</option>`).join('')}</select></label>
      <label>Animationsgeschwindigkeit<select id="cloudMapAnimationMs">${[[1400,'langsam'],[900,'normal'],[550,'schnell']].map(([value,label])=>`<option value="${value}" ${Number(c.cloudMap?.animationMs)===value?'selected':''}>${label} (${value} ms)</option>`).join('')}</select></label>
      <label>Standard-Zeitschritt der Wolkenanimation<select id="cloudMapTimeStepDefault">${[15,30,60].map(value=>`<option value="${value}" ${Number(c.cloudMap?.timeStepMinutes||30)===value?'selected':''}>${value} ${language==='en'?'minutes':'Minuten'}${value===30?(language==='en'?' (default)':' (Standard)'):''}</option>`).join('')}</select></label>
      <label>Standard-Modellansicht<select id="defaultCloudMapView">${CLOUD_MAP_VIEW_OPTIONS.map(([key,label])=>`<option value="${key}" ${c.cloudMap?.defaultView===key?'selected':''}>${optionText(label)}</option>`).join('')}</select></label>
      <label>Standard-Wolkenschicht<select id="defaultCloudMapLayer">${CLOUD_MAP_LAYER_OPTIONS.map(([key,label])=>`<option value="${key}" ${c.cloudMap?.defaultLayer===key?'selected':''}>${optionText(label)}</option>`).join('')}</select></label>
      <label>Standard-Kartenmodus<select id="defaultCloudMapMode">${CLOUD_MAP_MODE_OPTIONS.map(([key,label])=>`<option value="${key}" ${c.cloudMap?.defaultMode===key?'selected':''}>${optionText(label)}</option>`).join('')}</select></label>
      <label>Standard-Kartenansicht<select id="defaultCloudMapBaseMode">${CLOUD_MAP_BASE_OPTIONS.map(([key,label])=>`<option value="${key}" ${c.cloudMap?.defaultBaseMode===key?'selected':''}>${optionText(label)}</option>`).join('')}</select></label>
      <label>Glättung der Wolkenfelder<select id="cloudMapSmoothing">${CLOUD_SMOOTHING_OPTIONS.map(([key,label])=>`<option value="${key}" ${c.cloudMap?.smoothing===key?'selected':''}>${optionText(label)}</option>`).join('')}</select></label>
    </div>
    <div class="grid two" style="margin-top:12px"><label class="chip"><input id="defaultCloudMapShowValues" type="checkbox" ${c.cloudMap?.showValues!==false?'checked':''}>Prozentwerte an Prognosepunkten anzeigen</label><label class="chip"><input id="cloudMapCollapsedDefault" type="checkbox" ${c.cloudMap?.collapsed?'checked':''}>Astro-Wolkenmodell initial eingeklappt</label><label class="chip"><input id="meteoblueMapCollapsedDefault" type="checkbox" ${c.cloudMap?.meteoblueMapCollapsed?'checked':''}>Meteoblue-Wetterkarte initial eingeklappt</label><label class="chip"><input data-default-cloud-overlay="precip" type="checkbox" ${c.cloudMap?.weatherOverlays?.precip!==false?'checked':''}>Niederschlag gesamt standardmäßig anzeigen</label><label class="chip"><input data-default-cloud-overlay="rain" type="checkbox" ${c.cloudMap?.weatherOverlays?.rain!==false?'checked':''}>Regen standardmäßig anzeigen</label><label class="chip"><input data-default-cloud-overlay="snow" type="checkbox" ${c.cloudMap?.weatherOverlays?.snow!==false?'checked':''}>Schnee standardmäßig anzeigen</label></div>
    <div class="metric" style="margin-top:12px"><strong>${language==='en'?'External weather-source tabs':'Tabs für externe Wetterquellen'}</strong><div class="small muted">${language==='en'?'Selected external weather sources are shown as tabs in the planning view. They are loaded only when selected and are not automatically included in the astro score.':'Ausgewählte externe Wetterquellen werden in der Planung als Tabs angezeigt. Sie werden erst beim Anwählen geladen und fließen nicht automatisch in die Astro-Bewertung ein.'}</div><div class="grid two" style="margin-top:8px">${[['meteoblue','Meteoblue'],['clearoutside','Clear Outside'],['windy','Windy'],['ventusky','Ventusky']].map(([key,label])=>`<label class="chip"><input data-weather-source-enabled="${key}" type="checkbox" ${(c.weatherSources?.[key]!==false)?'checked':''}>${esc(label)}${key==='clearoutside'?(language==='en'?' shown by default':' initial sichtbar'):''}</label>`).join('')}</div></div><div class="metric" style="margin-top:12px"><strong>Mehrnächte-Wetterverlauf</strong><div class="small muted">Zusätzliche Nächte im externen stündlichen Wetterverlauf. 3 bedeutet: aktuelle Nacht plus 3 weitere Nächte.</div><label style="margin-top:8px;display:block">Anzahl zusätzlicher Nächte<input id="multiNightExtraNights" type="number" min="0" max="7" step="1" value="${c.multiNightWeather?.extraNights??3}"></label></div>
    <div class="notice" style="margin-top:12px">25, 49 oder 81 Prognosepunkte bestimmen die API-Datenmenge. Die sichtbare Karte wird unabhängig davon in hoher Auflösung weich interpoliert; es werden keine Zellumrandungen gezeichnet. Standard: 49 Punkte in einem Radius von 120 km.</div>
    ${renderSaveBar('cloudMap','Wolkenkarte speichern')}
  </div>
  <div class="card subtab-panel ${currentCentralSubTab==='aurora'?'active':''}">
    ${renderSaveBar('aurora',language==='en'?'Save aurora settings':'Polarlicht-Einstellungen speichern','top')}
    <div class="section-title-row"><div><h2>${language==='en'?'Aurora':'Polarlicht'}</h2><div class="small muted">${language==='en'?'Data is loaded when the app starts. Interval 0 means manual refresh only afterwards.':'Daten werden beim App-Start geladen. Intervall 0 bedeutet: danach nur manuell.'}</div></div></div>
    <div class="grid three" style="margin-top:12px"><label class="chip"><input id="auroraEnabled" type="checkbox" ${c.aurora?.enabled!==false?'checked':''}>${language==='en'?'Show aurora notice':'Polarlicht-Hinweis anzeigen'}</label><label>${language==='en'?'Interval in minutes':'Intervall Minuten'}<input id="auroraAutoRefreshMinutes" type="number" min="0" max="720" step="5" value="${c.aurora?.autoRefreshMinutes??0}"></label><label>${language==='en'?'Notify from':'Benachrichtigung ab'}<select id="auroraNotifyLevel"><option value="yellow" ${(c.aurora?.notifyLevel||'orange')==='yellow'?'selected':''}>${language==='en'?'Yellow':'Gelb'}</option><option value="orange" ${(c.aurora?.notifyLevel||'orange')==='orange'?'selected':''}>Orange</option><option value="red" ${(c.aurora?.notifyLevel||'orange')==='red'?'selected':''}>${language==='en'?'Red':'Rot'}</option></select></label></div>
    <div class="grid three" style="margin-top:12px"><label>${language==='en'?'Yellow Kp threshold':'Schwelle Gelb Kp'}<input id="auroraYellowKp" type="number" min="0" max="9" step="0.1" value="${c.aurora?.yellowKp??5.7}"></label><label>${language==='en'?'Orange Kp threshold':'Schwelle Orange Kp'}<input id="auroraOrangeKp" type="number" min="0" max="9" step="0.1" value="${c.aurora?.orangeKp??6.7}"></label><label>${language==='en'?'Red Kp threshold':'Schwelle Rot Kp'}<input id="auroraRedKp" type="number" min="0" max="9" step="0.1" value="${c.aurora?.redKp??7.3}"></label></div>
    <div class="notice" style="margin-top:12px">${language==='en'?'Warning colours are set only when a usable Kp forecast, an official strong NOAA warning or another reliable signal is available. Missing data does not create an aurora warning.':'Warnfarben werden nur gesetzt, wenn eine auswertbare Kp-Prognose, eine offizielle starke NOAA-Warnmeldung oder ein anderes belastbares Signal vorliegt. Fehlende Daten erzeugen keine Polarlichtwarnung.'}</div>
    <div class="metric" style="margin-top:12px"><strong>${language==='en'?'Last data status':'Letzter Datenstatus'}</strong><div class="small muted">${esc(auroraStatus?.message||(language==='en'?'No fetch yet.':'Noch kein Abruf.'))} ${auroraStatus?.updatedAt?`· ${fmtDateTime(new Date(auroraStatus.updatedAt),activeLocation()?.timezone||'Europe/Berlin')}`:''}</div></div>
    ${renderSaveBar('aurora',language==='en'?'Save aurora settings':'Polarlicht-Einstellungen speichern')}
  </div>
  <div class="card subtab-panel ${currentCentralSubTab==='weights'?'active':''}">
    ${renderSaveBar('weights','Bewertung speichern','top')}
    <div class="section-title-row"><h2>Deep-Sky-Gewichtung</h2><span class="weight-total ${total===100?'ok':'error'}">Summe: ${total} %</span></div>
    <div class="notice">Nur ganzzahlige Eingabefelder. Speichern ist nur bei exakt 100 % möglich.</div>
    <div class="weight-grid" style="margin-top:12px">${Object.entries({clouds:'Wolken',transparency:'Effektive Transparenz',seeing:'Seeing',wind:'Wind/Böen',dew:'Tauabstand',moon:'Mond',altitude:'Objekthöhe',duration:'Sichtbarkeitsdauer'}).map(([key,name])=>`<label>${name} (%)<input data-weight="${key}" type="number" min="0" max="100" step="1" value="${c.weights[key]}"></label>`).join('')}</div>
    ${renderSaveBar('weights','Gewichtung speichern')}
  </div>
  <div class="card subtab-panel ${currentCentralSubTab==='filters'?'active':''}">
    <div class="section-title-row"><div><h2>Filterprofile und Standardfilter</h2><div class="small muted">Voreinstellungen für Objektgröße, Objekttypen, Mindestbewertung und fehlende Katalogangaben.</div></div></div>
    <div class="grid three">
      <label>Standard-Mindestbewertung<input id="defaultMinScore" type="number" min="0" max="100" step="1" value="${Number(c.filterDefaults?.minScore)||0}"></label>
      <label>Standard-Basis der Mindestdauer<select id="defaultVisibilityBasis"><option value="nautical" ${c.filterDefaults?.visibilityBasis==='nautical'?'selected':''}>Nautischer Planungszeitraum</option><option value="astronomicalNight" ${c.filterDefaults?.visibilityBasis==='astronomicalNight'?'selected':''}>Astronomische Nacht</option><option value="sunset" ${c.filterDefaults?.visibilityBasis==='sunset'?'selected':''}>Sonnenuntergang bis Sonnenaufgang</option><option value="current" ${c.filterDefaults?.visibilityBasis==='current'?'selected':''}>Aktuell gewählter Planungszeitraum</option></select></label>
      <label>Standard max. Flächenhelligkeit<input id="defaultSurfaceBrightnessMax" type="number" step="0.1" value="${Number(c.filterDefaults?.surfaceBrightnessMax)||99}"></label>
    </div>
    <div class="chip-list" style="margin-top:12px"><label class="chip"><input id="defaultShowNoSurfaceBrightness" type="checkbox" ${c.filterDefaults?.showNoSurfaceBrightness!==false?'checked':''}>Objekte ohne Flächenhelligkeit anzeigen</label></div>
    <div class="divider"></div>
    <h3>Größen-Presets</h3>
    <div class="settings-list">${(c.sizeProfiles||[]).map((item,index)=>`<div class="settings-row"><label>Name<input data-size-preset="${esc(item.id)}" data-field="name" value="${esc(item.name)}"></label><label>Min Grad<input data-size-preset="${esc(item.id)}" data-field="minDeg" type="number" min="0" value="${Number(item.minDeg)||0}"></label><label>Min ′<input data-size-preset="${esc(item.id)}" data-field="minMin" type="number" min="0" max="59" value="${clamp(Number(item.minMin)||0,0,59)}"></label><label>Max Grad<input data-size-preset="${esc(item.id)}" data-field="maxDeg" type="number" min="0" value="${Number(item.maxDeg)||0}"></label><label>Max ′<input data-size-preset="${esc(item.id)}" data-field="maxMin" type="number" min="0" max="59" value="${clamp(Number(item.maxMin)||0,0,59)}"></label><label class="chip"><input data-size-preset="${esc(item.id)}" data-field="excludeNoSize" type="checkbox" ${item.excludeNoSize?'checked':''}>ohne Größenangabe ausschließen</label><button data-delete-size-preset="${esc(item.id)}" ${c.sizeProfiles.length<=1?'disabled':''}>Löschen</button></div>`).join('')}</div>
    <div class="data-actions"><button id="addSizePreset" type="button">Größen-Preset hinzufügen</button></div>
    <div class="divider"></div>
    <h3>Objekttyp-Profile</h3>
    <div class="settings-list">${(c.objectTypeProfiles||[]).map(item=>`<div class="settings-row"><label>Name<input data-type-preset="${esc(item.id)}" data-field="name" value="${esc(item.name)}"></label><button data-edit-type-preset="${esc(item.id)}" type="button">Aktuelle Planungs-Objekttypen übernehmen</button><button data-delete-type-preset="${esc(item.id)}" ${c.objectTypeProfiles.length<=1?'disabled':''}>Löschen</button><div class="small muted">${item.types?.length?`${item.types.length} ausgewählte Typen`:'Alle Objekttypen ausgewählt'}</div></div>`).join('')}</div>
    <div class="data-actions"><button id="addObjectTypePreset" type="button">Objekttyp-Profil hinzufügen</button></div>
    ${renderSaveBar('filterProfiles','Filterprofile speichern')}
  </div>
  <div class="card subtab-panel ${currentCentralSubTab==='display'?'active':''}">
    ${renderSaveBar('display','Anzeigeeinstellungen speichern','top')}
    <div class="section-title-row"><div><h2>Anzeige und Planung</h2><div class="small muted">Dauerhafte Standards für neue beziehungsweise zurückgesetzte Planungen</div></div></div>
    <div class="grid two"><label>Standard-Planungszeitraum<select id="defaultPlanningWindow">${[['sunset','Sonnenuntergang–Sonnenaufgang'],['civil','Bürgerliche Nacht'],['nautical','Nautischer Planungszeitraum'],['astronomicalTwilight','Nautisch + astronomisch'],['astronomicalNight','Astronomische Nacht']].map(([key,name])=>`<option value="${key}" ${c.defaultPlanningWindow===key?'selected':''}>${name}</option>`).join('')}</select></label></div>
    <div class="grid two" style="margin-top:12px"><label>Gewünschter Mindestfreiraum zum Bildrand (%)<input id="framingMinMargin" type="number" min="0" max="45" step="1" value="${Number(c.framing?.minMarginPercent??10)}"></label><label class="chip"><input id="framingAutoRotate" type="checkbox" ${c.framing?.autoRotate!==false?'checked':''}>Kamera bei verlässlichem Positionswinkel automatisch optimal drehen</label></div>
    <div class="grid two" style="margin-top:12px"><div class="metric"><strong>Qualitätsampel</strong><div class="small muted">Rot 0 bis unter Gelb, Gelb bis unter Grün, Grün bis 100.</div><div class="grid two" style="margin-top:8px"><label>Gelb ab<input id="qualityYellow" type="number" min="1" max="98" step="1" value="${Number(c.qualityThresholds?.yellow??60)}"></label><label>Grün ab<input id="qualityGreen" type="number" min="2" max="99" step="1" value="${Number(c.qualityThresholds?.green??80)}"></label></div></div><div class="metric"><strong>Objektbeschriftungen in Aladin</strong><label class="chip" style="margin-top:8px"><input id="defaultAladinLabelsVisible" type="checkbox" ${c.aladinLabels?.visible!==false?'checked':''}>Objektnamen und Katalognummern anzeigen</label><label>Detailstufe<select id="defaultAladinLabelDetail">${ALADIN_LABEL_DETAIL_OPTIONS.map(([key,label])=>`<option value="${key}" ${c.aladinLabels?.detail===key?'selected':''}>${optionText(label)}</option>`).join('')}</select></label></div></div>
    <div class="display-config-selector static"><div class="section-title-row"><div><h3>Objektlisteninformationen konfigurieren</h3><div class="small muted">Sichtbarkeit, Reihenfolge und aktives Darstellungsprofil der Objektliste.</div></div><label>Objektliste Darstellungsprofil – aktiv<select id="activeDisplayProfile">${Object.entries(c.listDisplay.profiles).map(([key,value])=>`<option value="${key}" ${c.listDisplay.activeProfile===key?'selected':''}>${esc(value.name)}</option>`).join('')}</select></label></div><div class="grid two" style="margin:12px 0"><label class="chip"><input id="miniHorizonShow" type="checkbox" ${c.miniHorizon?.show!==false?'checked':''}>Horizontlinie im Mini-Höhenprofil anzeigen</label></div><div class="display-config-list">${Object.entries(c.listDisplay.profiles).map(([key,value])=>renderDisplayColumnConfigurator(key,value)).join('')}</div></div>
    <div class="grid two" style="margin-top:12px"><label class="chip"><input id="defaultFrameVisible" type="checkbox" ${c.frameVisible?'checked':''}>Setup-Rahmen standardmäßig anzeigen</label><label class="chip"><input id="defaultObjectVisible" type="checkbox" ${c.objectSizeVisible?'checked':''}>Objektgröße standardmäßig anzeigen</label><label class="chip"><input id="defaultMeteoblueCollapsed" type="checkbox" ${c.meteoblueCollapsed?'checked':''}>Meteoblue standardmäßig eingeklappt</label><label class="chip"><input id="defaultAltitudeCollapsed" type="checkbox" ${c.detailPanels?.altitudeCollapsed?'checked':''}>Höhenkurve initial eingeklappt</label><label class="chip"><input id="defaultHorizonCollapsed" type="checkbox" ${c.detailPanels?.horizonCollapsed?'checked':''}>Horizontansicht initial eingeklappt</label></div>
    <div class="metric" style="margin-top:12px"><strong>Aufklappzustand beim Öffnen der Planung</strong><div class="grid three" style="margin-top:8px"><label class="chip"><input id="defaultProfilesCollapsed" type="checkbox" ${c.collapsed?.profiles?'checked':''}>„Profile für diese Planung“ eingeklappt</label><label class="chip"><input id="defaultWeatherSummaryCollapsed" type="checkbox" ${c.collapsed?.weatherSummary?'checked':''}>„Wetter und Aufnahmequalität“ eingeklappt</label><label class="chip"><input id="defaultWeatherHourlyCollapsed" type="checkbox" ${c.collapsed?.weatherHourly?'checked':''}>„Stündlicher Wetterverlauf“ eingeklappt</label></div></div><div class="metric section-visibility-config" style="margin-top:12px"><strong>${language==='en'?'Show or hide planning sections':'Planungsrubriken anzeigen oder ausblenden'}</strong><div class="small muted" style="margin-top:4px">${language==='en'?'Disabled sections are completely hidden in the planning view. This is independent of whether a visible section starts open or collapsed.':'Ausgeschaltete Rubriken werden in der Planung komplett ausgeblendet. Das ist unabhängig davon, ob eine sichtbare Rubrik offen oder eingeklappt startet.'}</div><div class="grid three" style="margin-top:8px">${[['profiles','Profile für diese Planung'],['weatherSummary','Wetter und Aufnahmequalität'],['weatherHourly','Stündlicher Wetterverlauf'],['cloudMap','Astro-Wolkenmodell'],['weatherSources','Zusätzliche Wetterquellen'],['objectSelection','Objektauswahl']].map(([key,label])=>`<label class="chip"><input data-visible-section="${key}" type="checkbox" ${c.visibleSections?.[key]!==false?'checked':''}>${optionText(label)} ${language==='en'?'show':'anzeigen'}</label>`).join('')}</div></div>
    <div class="metric aladin-settings" style="margin-top:16px"><h3>Aladin</h3><details class="aladin-survey-settings"><summary><span class="disclosure-arrow" aria-hidden="true"></span><strong>Aladin - Survey</strong><span class="small muted">Weitere Surveys können manuell per HiPS-ID ergänzt werden. Monochrome Surveys werden nativ angezeigt.</span></summary><div class="section-title-row" style="margin-top:12px"><div><div class="small muted">Surveys in der Aladin-Auswahl aktivieren, umbenennen oder eigene HiPS-IDs ergänzen. Diese Expertenliste ist initial zugeklappt.</div></div><button id="addAladinSurvey" type="button">Survey hinzufügen</button></div>
      <div class="aladin-survey-list">${normalizeAladinSurveys(c.aladinSurveys).map(item=>`<div class="survey-config-row" data-survey-row="${esc(item.id)}"><label class="chip"><input data-aladin-survey="${esc(item.id)}" data-field="enabled" type="checkbox" ${item.enabled?'checked':''}>in Auswahl</label><label>Anzeigename<input data-aladin-survey="${esc(item.id)}" data-field="name" value="${esc(item.name)}"></label><label>HiPS-ID<input data-aladin-survey="${esc(item.id)}" data-field="hipsId" value="${esc(item.hipsId)}" ${item.builtin?'readonly':''}></label><label>Kategorie<input data-aladin-survey="${esc(item.id)}" data-field="category" value="${esc(item.category||'')}"></label>${item.builtin?'':`<button type="button" class="danger" data-delete-aladin-survey="${esc(item.id)}">Entfernen</button>`}</div>`).join('')}</div>
    </details>
    <details class="aladin-horizon-settings" style="margin-top:12px"><summary><span class="disclosure-arrow" aria-hidden="true"></span><strong>Aladin - Himmel & Horizont</strong><span class="small muted">Boden/Horizont, azimutales App-Raster und Himmelsrichtungen für den externen Aladin-Tab.</span></summary>
      <div class="grid three" style="margin-top:12px"><label>Bodenanzeige im externen Aladin-Tab<select id="externalAladinGroundMode"><option value="none" ${String(c.externalAladin?.groundMode||'standard')==='none'?'selected':''}>kein Boden</option><option value="standard" ${String(c.externalAladin?.groundMode||'standard')==='standard'?'selected':''}>Standardhorizont (0°)</option><option value="personal" ${String(c.externalAladin?.groundMode||'standard')==='personal'?'selected':''}>persönlicher Horizont</option></select></label><label>Transparenz Boden (%)<input id="externalAladinGroundOpacity" type="number" min="0" max="100" step="5" value="${Number(c.externalAladin?.groundOpacity??50)}"></label><label class="chip"><input id="externalAladinAltAzGrid" type="checkbox" ${c.externalAladin?.altAzGrid===true?'checked':''}>Azimutales Gradnetz als App-Overlay anzeigen</label><label>Abstufung azimutales Gradnetz<select id="externalAladinAltAzGridStep"><option value="auto" ${String(c.externalAladin?.altAzGridStep||'auto')==='auto'?'selected':''}>Auto</option><option value="10" ${String(c.externalAladin?.altAzGridStep||'auto')==='10'?'selected':''}>10°</option><option value="5" ${String(c.externalAladin?.altAzGridStep||'auto')==='5'?'selected':''}>5°</option><option value="2" ${String(c.externalAladin?.altAzGridStep||'auto')==='2'?'selected':''}>2°</option><option value="1" ${String(c.externalAladin?.altAzGridStep||'auto')==='1'?'selected':''}>1°</option></select></label><label class="color-picker-field">Farbe azimutales Gradnetz<span class="color-picker-row"><input id="externalAladinAltAzGridColor" class="color-swatch-input" type="color" value="${esc(c.externalAladin?.altAzGridColor||'#1f6f52')}" title="Farbe azimutales Gradnetz"></span></label><label>Linienstärke azimutales Gradnetz (px)<input id="externalAladinAltAzGridLineWidth" type="number" min="0.5" max="3" step="0.1" value="${Number(c.externalAladin?.altAzGridLineWidth??0.8)}"></label><label class="chip"><input id="externalAladinCompass" type="checkbox" ${c.externalAladin?.compass!==false?'checked':''}>Himmelsrichtungen/Kompassmarken anzeigen</label></div>
    </details></div>
    ${renderSaveBar('display','Anzeigeeinstellungen speichern')}
  </div>`;
}

function createEmptyLocationDraft(){const id=uid('loc'),horizonId=uid('horizon');return {id,name:'Neuer Standort',latitude:null,longitude:null,elevation:0,timezone:'Europe/Berlin',horizonProfiles:[{id:horizonId,name:'Freier Horizont',horizonProfile:emptyHorizonProfile(),obstacles:[]}],defaultHorizonProfileId:horizonId,selectedHorizonProfileId:horizonId,horizonProfile:emptyHorizonProfile(),horizon:[0,0,0,0,0,0,0,0],obstacles:[]};}
function renderLocations(){
  const locations=Array.isArray(draft.locations)?draft.locations:[];
  const loc=locations.find(item=>item.id===draft.selectedLocationId)||locations[0]||null;
  const noLocations=!loc;
  const country=draft.central.locationSearchCountry??'DE';
  const addOpen=noLocations||showAddLocationDialog;
  const addDraft=pendingLocationDraft||createEmptyLocationDraft();
  const addLocationMarkup=addOpen?`<div class="location-add-dialog"><div class="section-title-row"><div><h3>Neuen Standort hinzufügen</h3><div class="small muted">Suche einen Ort oder gib Koordinaten manuell ein. Nach dem Speichern wird der neue Standort aktiv ausgewählt.</div></div>${noLocations?'': '<button id="cancelAddLocation" type="button">Abbrechen</button>'}</div><div class="grid four location-add-search-row"><label>Ort oder Postleitzahl<input id="locationSearchQuery" value="${esc(locationSearchQuery)}" placeholder="z. B. 72108 oder Rottenburg"></label><label>Bevorzugtes Land<select id="locationSearchCountry">${COUNTRY_OPTIONS.map(([code,label])=>`<option value="${code}" ${country===code?'selected':''}>${esc(label)}</option>`).join('')}</select></label><div class="inline" style="align-self:end"><button id="searchLocation" ${locationSearchLoading?'disabled':''}>${locationSearchLoading?'Suche läuft …':'Standort suchen'}</button></div><div class="inline" style="align-self:end"><button id="useGpsNewLocation" type="button">GPS verwenden</button></div></div><div class="small muted">Die Suche wird erst nach Klick oder Enter ausgelöst. GPS befüllt nur diesen neuen Standort.</div>${locationSearchError?`<div class="notice warn">${esc(locationSearchError)}</div>`:''}${locationSearchResults.length?`<div class="search-results">${locationSearchResults.map((r,i)=>`<button type="button" data-location-result="${i}"><strong>${esc(r.displayName)}</strong><span>${esc([r.postcode,r.region,r.country].filter(Boolean).join(' · '))}</span><span>${fmt(r.latitude,5)}°, ${fmt(r.longitude,5)}°</span></button>`).join('')}</div>`:''}<div class="grid three" style="margin-top:12px"><label>Name<input id="newLocName" value="${esc(addDraft.name||'Neuer Standort')}"></label><label>Zeitzone<select id="newLocTimezone">${timeZoneOptions(addDraft.timezone||'Europe/Berlin')}</select></label><label>Höhe über Meer (m)<input id="newLocElevation" type="number" value="${Number(addDraft.elevation)||0}"></label><label>Breitengrad (°)<input id="newLocLat" type="number" step="0.0001" value="${addDraft.latitude==null?'':Number(addDraft.latitude)}"></label><label>Längengrad (°)<input id="newLocLon" type="number" step="0.0001" value="${addDraft.longitude==null?'':Number(addDraft.longitude)}"></label><div class="inline" style="align-self:end"><button id="saveNewLocation" type="button">Standort speichern</button></div></div></div>`:'';
  if(noLocations){
    return`<div class="settings-tabs subtabs"><button data-locations-subtab="locations" class="${currentLocationsSubTab==='locations'?'active':''}">Standorte</button><button data-locations-subtab="horizon" class="${currentLocationsSubTab==='horizon'?'active':''}">Horizontprofile</button></div><div class="card subtab-panel ${currentLocationsSubTab==='locations'?'active':''}">${renderSaveBar('locations','Standort und Horizonte speichern','top')}<div class="section-title-row"><div><h2>Gespeicherte Aufnahmeorte</h2><div class="small muted">Lege zuerst einen Aufnahmeort an. Danach können Planung, Wetter und Horizontprofile berechnet werden.</div></div><button id="addLocation" type="button">Standort hinzufügen</button></div><div class="notice warn">Noch kein Standort vorhanden. Bitte einen Standort suchen oder Koordinaten manuell eintragen und speichern.</div>${addLocationMarkup}</div><div class="card subtab-panel ${currentLocationsSubTab==='horizon'?'active':''}"><h2>Horizontprofile</h2><p class="muted">Horizontprofile stehen zur Verfügung, sobald ein Standort gespeichert wurde.</p></div>`;
  }
  const profiles=horizonProfilesFor(loc),horizonEntry=horizonProfileFor(loc,loc.selectedHorizonProfileId),horizonPoints=ensureHorizonProfile(loc,horizonEntry?.id).map((altitude,index)=>[horizonAzForIndex(index),Number(altitude)||0]),obstacles=(horizonEntry?.obstacles||[]).map(item=>item.type==='free'?{type:'free',name:item.name||'Freies Hindernis',points:item.points||[],closed:Boolean(item.closed)}:{name:item.name||'Hindernis',azimuth:Number(item.azimuth)||0,altitude:Number(item.altitude)||0});
  const profileOptions=profiles.map(item=>`<option value="${esc(item.id)}" ${item.id===horizonEntry?.id?'selected':''}>${esc(item.name)}</option>`).join(''),defaultOptions=profiles.map(item=>`<option value="${esc(item.id)}" ${item.id===loc.defaultHorizonProfileId?'selected':''}>${esc(item.name)}</option>`).join('');
  return`<div class="settings-tabs subtabs">${[['locations','Standorte'],['horizon','Horizontprofile']].map(([k,n])=>`<button data-locations-subtab="${k}" class="${currentLocationsSubTab===k?'active':''}">${n}</button>`).join('')}</div><div class="card subtab-panel ${currentLocationsSubTab==='locations'?'active':''}"><div class="section-title-row"><div><h2>Gespeicherte Aufnahmeorte</h2><div class="small muted">Der Standardstandort wird hier festgelegt. In der Planung kann vorübergehend ein anderer Ort gewählt werden.</div></div><button id="addLocation">Standort hinzufügen</button></div>
    ${addLocationMarkup}

    <div class="grid two"><label>Standort bearbeiten<select id="locationSelect">${locations.map(item=>`<option value="${item.id}" ${item.id===loc.id?'selected':''}>${esc(item.name)}</option>`).join('')}</select></label><label>Standardstandort<select id="defaultLocationSelect">${locations.map(item=>`<option value="${item.id}" ${item.id===draft.central.defaultLocationId?'selected':''}>${esc(item.name)}</option>`).join('')}</select></label><label>GPS-Verhalten<select id="gpsBehavior"><option value="last" ${draft.central.gpsBehavior==='last'?'selected':''}>Letzten/Standardstandort verwenden</option><option value="ask" ${draft.central.gpsBehavior==='ask'?'selected':''}>Bei Bedarf nach GPS fragen</option></select></label><span></span></div>
    <div class="grid three" style="margin-top:12px"><label>Name<input id="locName" value="${esc(loc.name)}"></label><label>Zeitzone<select id="locTimezone">${timeZoneOptions(loc.timezone)}</select><span class="small muted">Gültige IANA-Zeitzone; wird bei der Standortwahl automatisch gesetzt.</span></label><label>Breitengrad (°)<input id="locLat" type="number" step="0.0001" value="${loc.latitude}"></label><label>Längengrad (°)<input id="locLon" type="number" step="0.0001" value="${loc.longitude}"></label><label>Höhe über Meer (m)<input id="locElevation" type="number" value="${loc.elevation||0}"></label><div class="inline" style="align-self:end"><button id="saveLocationChanges" type="button">Standortänderungen speichern</button><button id="deleteLocation" class="danger" ${locations.length===1?'disabled':''}>Standort löschen</button></div></div>
  </div>
  <div class="card subtab-panel ${currentLocationsSubTab==='horizon'?'active':''}">${renderSaveBar('locations','Standort und Horizonte speichern','top')}<div class="section-title-row"><div><div class="eyebrow">Interaktive Horizontprofile</div><h2>${esc(loc.name)}</h2><div class="small muted">Mehrere Profile pro Standort sind möglich, zum Beispiel Garten, Terrasse oder mobile Aufstellung.</div></div><div class="horizon-editor-actions"><button id="undoHorizon" ${!horizonUndoStack.length?'disabled':''}>Letzte Änderung rückgängig</button><button id="resetHorizon">Horizont auf 0° setzen</button><button id="importNinaHorizon" type="button">N.I.N.A.-Horizont importieren</button><button id="exportNinaHorizon" type="button">N.I.N.A.-Horizont exportieren</button></div></div>
    <div class="horizon-profile-toolbar"><label>Horizont bearbeiten<select id="horizonProfileSelect">${profileOptions}</select></label><label>Standardprofil dieses Standorts<select id="defaultHorizonProfileSelect">${defaultOptions}</select></label><button id="addHorizonProfile">Neu</button><button id="duplicateHorizonProfile">Duplizieren</button><button id="renameHorizonProfile">Umbenennen</button><button id="deleteHorizonProfile" class="danger" ${profiles.length===1?'disabled':''}>Löschen</button></div>
    <div class="horizon-editor-wrap"><canvas class="settings-horizon-chart editable-horizon" width="1400" height="440" data-editable="true" data-horizon="${encodeURIComponent(JSON.stringify(horizonPoints))}" data-obstacles="${encodeURIComponent(JSON.stringify(obstacles))}"></canvas><div class="small muted horizon-editor-help">${language==='en'?'0° N · 45° NE · 90° E · 135° SE · 180° S · 225° SW · 270° W · 315° NW · 360° N. Changes are applied permanently only after saving.':'0° N · 45° NO · 90° O · 135° SO · 180° S · 225° SW · 270° W · 315° NW · 360° N. Änderungen werden erst mit Speichern dauerhaft übernommen.'}</div></div>
    <div class="divider"></div><div class="section-title-row"><h3>Hindernisse im Profil „${esc(horizonEntry?.name||'–')}“</h3><div class="inline"><button id="addObstacle">Block-Hindernis hinzufügen</button><button id="addFreeObstacle" class="${horizonObstacleDrawId?'active':''}">${horizonObstacleDrawId?'Freies Hindernis beenden':'Freies Hindernis zeichnen'}</button></div></div>
    <div class="small muted">Block-Hindernisse bleiben für einfache Gebäude nutzbar. Freie Hindernisse werden direkt im Diagramm mit Stützpunkten gezeichnet; erneutes Klicken auf „Freies Hindernis beenden“ schließt die Kontur.</div>
    <div class="obstacle-list">${(horizonEntry?.obstacles||[]).map(item=>item.type==='free'?`<div class="obstacle-row" data-obstacle="${item.id}"><label>Bezeichnung<input data-obstacle-field="name" value="${esc(item.name)}"></label><div class="small muted">Freie Kontur · ${(item.points||[]).length} Stützpunkte</div><button data-delete-obstacle="${item.id}" class="danger">Entfernen</button></div>`:`<div class="obstacle-row" data-obstacle="${item.id}"><label>Bezeichnung<input data-obstacle-field="name" value="${esc(item.name)}"></label><label>Azimut (°)<input data-obstacle-field="azimuth" type="number" min="0" max="360" value="${item.azimuth}"></label><label>Höhe (°)<input data-obstacle-field="altitude" type="number" min="0" max="90" value="${item.altitude}"></label><button data-delete-obstacle="${item.id}" class="danger">Entfernen</button></div>`).join('')||'<div class="muted">Keine zusätzlichen Hindernisse erfasst.</div>'}</div>
    ${renderSaveBar('locations','Standort und Horizonte speichern')}
  </div>`;
}
function objectSizeText(o){return Number(o.majorArcMin)>0?`${fmt(Number(o.majorArcMin))}′ × ${fmt(Number(o.minorArcMin||o.majorArcMin))}′`:'keine Angabe'}
function bestMonthsText(o){
  if(!Number.isFinite(Number(o.raHours)))return 'nicht berechnet';
  const names=['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
  const sunRa=((Number(o.raHours)-12+24)%24);
  const center=(Math.round((sunRa/2+2.8))%12+12)%12;
  const months=[-1,0,1].map(offset=>names[(center+offset+12)%12]);
  return months.join(' · ');
}
function normalizedCatalogSearchText(text){return String(text||'').trim().toLowerCase().replace(/[._-]+/g,' ').replace(/\s+/g,' ')}
function findCatalogMatchesByText(text,limit=12){
  const q=normalizedCatalogSearchText(text);
  if(!q)return[];
  const compact=q.replace(/\s+/g,'');
  const scored=[];
  for(const o of catalog){
    const names=[o.id,o.name,...(o.aliases||[])].filter(Boolean);
    let best=0;
    for(const name of names){
      const n=normalizedCatalogSearchText(name),nc=n.replace(/\s+/g,'');
      if(n===q||nc===compact){best=Math.max(best,100);continue}
      if(n.startsWith(q)||nc.startsWith(compact)){best=Math.max(best,75);continue}
      if(n.includes(q)||nc.includes(compact)){best=Math.max(best,45)}
    }
    if(best>0)scored.push({object:o,score:best});
  }
  return scored.sort((a,b)=>b.score-a.score||a.object.id.localeCompare(b.object.id,'de')).slice(0,limit).map(item=>item.object);
}
function findCatalogObjectByText(text){return findCatalogMatchesByText(text,1)[0]||null}
async function addImagingTarget(objectId,messageElement=null){
  const object=catalog.find(item=>item.id===objectId)||findCatalogObjectByText(objectId);
  if(!object){if(messageElement)messageElement.textContent='Kein passendes Objekt gefunden.';return false}
  if((profile.targets||[]).some(t=>t.objectId===object.id)){if(messageElement)messageElement.textContent='Dieses Objekt ist bereits in Meine Aufnahmeziele enthalten.';return false}
  profile.targets=[...(profile.targets||[]),{id:`target-${object.id.replace(/\W/g,'-')}-${Date.now()}`,objectId:object.id,status:'Wunschziel',priority:'normal',note:'',referenceLinks:[],createdAt:new Date().toISOString()}];
  if(messageElement)messageElement.textContent=`${object.id} · ${object.name} wurde hinzugefügt.`;
  await saveProfile();
  return true;
}
function renderTargetSearchDialog(){
  return `<dialog id="targetSearchDialog" class="target-search-dialog"><form method="dialog" class="legal-dialog-shell target-search-shell"><div class="legal-dialog-header"><h2>Aufnahmeziel suchen und hinzufügen</h2><button type="submit" class="legal-dialog-close" aria-label="Fenster schließen">✕</button></div><div class="legal-dialog-content"><p class="small muted">Katalognummer, Kurzschreibweise oder Objektname eingeben. Beispiele: M 31, NGC7000, NGC 7000, Sh2-129, Barnard 33.</p><div class="target-search-row"><input id="targetSearchQuery" autocomplete="off" placeholder="z. B. ngc7000"><button id="targetSearchButton" type="button">Suchen</button></div><div id="targetSearchMessage" class="small muted" style="margin-top:8px"></div><div id="targetSearchResults" class="target-search-results"></div></div><div class="legal-dialog-actions"><button type="submit" class="primary">Schließen</button></div></form></dialog>`;
}

function validReferenceLinks(target){return (target.referenceLinks||[]).map(link=>String(link||'').trim()).filter(link=>/^https?:\/\//i.test(link))}
function targetStatusOptions(selected){return ['Wunschziel','geplant','begonnen','Daten vollständig','bearbeitet','abgeschlossen','erneut aufnehmen'].map(v=>`<option ${selected===v?'selected':''}>${esc(v)}</option>`).join('')}
function targetFilterDefaults(){return{search:'',status:'all',priority:'all',type:'all',filter:'all',month:'all'}}
function targetFilters(){profile.targetFilters={...targetFilterDefaults(),...(profile.targetFilters||{})};return profile.targetFilters}
function targetMatchesFilters(target,object){
  const f=targetFilters();
  const q=normalizedCatalogSearchText(f.search||'');
  if(q){const hay=normalizedCatalogSearchText([object?.id,object?.name,object?.type,object?.constellation,...(object?.aliases||[]),target.status,target.priority,target.note,...(target.referenceLinks||[])].filter(Boolean).join(' '));const compact=hay.replace(/\s+/g,'');const qc=q.replace(/\s+/g,'');if(!hay.includes(q)&&!compact.includes(qc))return false}
  if(f.status&&f.status!=='all'&&target.status!==f.status)return false;
  if(f.priority&&f.priority!=='all'&&target.priority!==f.priority)return false;
  if(f.type&&f.type!=='all'&&object?.type!==f.type)return false;
  if(f.filter&&f.filter!=='all'){const set=recommendedFilterSet(object||{});if(!set.has(f.filter))return false}
  if(f.month&&f.month!=='all'&&!bestMonthsText(object||{}).split(' · ').includes(f.month))return false;
  return true;
}
function renderTargetFilters(targets){
  const f=targetFilters();
  const objects=targets.map(t=>catalog.find(o=>o.id===t.objectId)).filter(Boolean);
  const types=[...new Set(objects.map(o=>o.type).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'de'));
  const months=['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
  const statusValues=['Wunschziel','geplant','begonnen','Daten vollständig','bearbeitet','abgeschlossen','erneut aufnehmen'];
  const priorities=['hoch','normal','niedrig'];
  return `<details class="target-filter-panel" open><summary>Ziele filtern</summary><div class="target-filter-grid"><label class="target-filter-search">Suche<input id="targetListSearch" value="${esc(f.search||'')}" placeholder="Name, Nummer, Notiz, Link …"><span class="small muted">Automatische Aktualisierung nach 1,5 Sekunden; Enter sucht sofort.</span></label><label>Status<select id="targetFilterStatus"><option value="all">Alle Status</option>${statusValues.map(v=>`<option value="${esc(v)}" ${f.status===v?'selected':''}>${esc(v)}</option>`).join('')}</select></label><label>Priorität<select id="targetFilterPriority"><option value="all">Alle Prioritäten</option>${priorities.map(v=>`<option value="${esc(v)}" ${f.priority===v?'selected':''}>${esc(v)}</option>`).join('')}</select></label><label>Objekttyp<select id="targetFilterType"><option value="all">Alle Objekttypen</option>${types.map(v=>`<option value="${esc(v)}" ${f.type===v?'selected':''}>${esc(v)}</option>`).join('')}</select></label><label>Filter<select id="targetFilterImaging"><option value="all">Alle Filter</option>${FILTER_KEYS.filter(k=>k!=='NO_FILTER').map(v=>`<option value="${esc(v)}" ${f.filter===v?'selected':''}>${esc(FILTER_LABELS[v])}</option>`).join('')}</select></label><label>Monat<select id="targetFilterMonth"><option value="all">Alle Monate</option>${months.map(v=>`<option value="${esc(v)}" ${f.month===v?'selected':''}>${esc(v)}</option>`).join('')}</select></label></div><div class="target-filter-actions"><button id="applyTargetFilters" type="button">Zielfilter anwenden</button><button id="resetTargetFilters" type="button">Zielfilter zurücksetzen</button></div></details>`;
}
function renderTargets(){
  const targets=profile.targets||[];
  const filtered=targets.filter(target=>targetMatchesFilters(target,catalog.find(item=>item.id===target.objectId)));
  const rows=filtered.map(target=>{
    const o=catalog.find(item=>item.id===target.objectId);
    if(!o)return`<div class="target-row" data-target-row="${esc(target.id)}"><strong>${esc(target.objectId)}</strong><span class="warn">Objekt nicht im Katalog gefunden.</span><div class="target-actions"><button data-delete-target="${esc(target.id)}" class="danger">Entfernen</button></div></div>`;
    const f=framingAnalysis(o),links=validReferenceLinks(target);
    const linkButtons=links.length?`<div class="reference-link-buttons">${links.map((link,index)=>`<a class="button small-button" href="${esc(link)}" target="_blank" rel="noopener noreferrer">Referenz ${index+1} öffnen ↗</a>`).join('')}</div>`:`<div class="small muted">Keine gültige Webadresse gespeichert.</div>`;
    return`<div class="target-row" data-target-row="${esc(target.id)}"><div class="target-main"><strong>${esc(o.id)} · ${esc(o.name)}</strong><span>${esc(o.type)} · ${esc(o.constellation)} · Größe ${objectSizeText(o)} · Mag. ${o.magnitude??'–'} · Flächenhelligkeit ${o.surfaceBrightness??'–'}</span><span>Filter: ${(o.recommendedFilters||[]).join(', ')||'keine Angabe'} · Beste Monate: ${bestMonthsText(o)} · Rahmung aktuell: ${framingStatusLabel(f.code||f.status)} · Maximalhöhe wird in der Planung standortbezogen berechnet.</span></div><div class="target-edit-grid"><label class="target-priority-field">Priorität<select data-target-field="priority"><option ${target.priority==='niedrig'?'selected':''}>niedrig</option><option ${target.priority==='normal'||!target.priority?'selected':''}>normal</option><option ${target.priority==='hoch'?'selected':''}>hoch</option></select></label><label class="target-status-field">Status<select data-target-field="status">${targetStatusOptions(target.status)}</select></label><label class="target-reference-field">Referenzbild-Links<textarea data-target-field="referenceLinksText" rows="3" placeholder="Ein Link pro Zeile">${esc((target.referenceLinks||[]).join('\n'))}</textarea>${linkButtons}</label><label class="target-note-field">Notiz<textarea data-target-field="note" rows="6" placeholder="Eigene Hinweise, Ziel, Palette, Setup, offene Punkte">${esc(target.note||'')}</textarea></label></div><div class="target-row-status small muted" data-target-status></div><div class="target-actions"><button data-save-target="${esc(target.id)}" type="button" class="primary">Änderungen speichern</button><button data-delete-target="${esc(target.id)}" class="danger">Entfernen</button></div></div>`;
  }).join('')||'<div class="muted">Keine Aufnahmeziele entsprechen den aktuellen Filtern.</div>';
  const emptyHint=targets.length?'':'<div class="muted">Noch keine Aufnahmeziele gespeichert. Füge Ziele in der Objektliste oder über die Suche hinzu.</div>';
  return`<div class="card"><div class="section-title-row"><div><h2>Meine Aufnahmeziele</h2><div class="small muted">Persönlicher Zielkatalog für die Frage: Was kann ich heute aufnehmen, was ich schon immer aufnehmen wollte?</div></div><button id="openTargetSearch" type="button">Aufnahmeziel suchen</button></div><div class="notice">Dieser Katalog erscheint in der Planung als eigener Katalogfilter und ist initial nicht aktiv. Wenn nur „Meine Aufnahmeziele“ gewählt ist, gelten weiterhin alle normalen Filter wie Wetter, Mond, Rahmung, Größe und Mindestbewertung.</div>${renderTargetFilters(targets)}<div class="small muted target-count">${filtered.length} von ${targets.length} Aufnahmezielen angezeigt</div><div id="targetAddMessage" class="small muted" style="margin-top:10px"></div><div class="target-list">${targets.length?rows:emptyHint}</div>${renderTargetSearchDialog()}</div>`;
}

function renderInfo(){
  const persistentText=storageInfo.persistent===true?'Aktiv':storageInfo.persistent===false?'Nicht aktiv':'Nicht ermittelbar';
  const permissionText={granted:'Zugriff vorhanden',prompt:'Freigabe erforderlich',denied:'Zugriff verweigert',none:'Kein Ordner gewählt'}[storageInfo.permission]||storageInfo.permission;
  const fileSupport=storageInfo.fileSystemSupported?'Automatische Ordnersicherung unterstützt':'Automatische Ordnersicherung in diesem Browser nicht unterstützt';
  const lastBackup=backupAgeText();
  const reminderDue=!backupConfig.lastSuccessAt||Date.now()-new Date(backupConfig.lastSuccessAt).getTime()>Number(backupConfig.reminderDays||7)*86400000;
  return`<div class="settings-tabs subtabs">${[['status','Status'],['backup','Sicherung'],['help','Hilfe']].map(([k,n])=>`<button data-info-subtab="${k}" class="${currentInfoSubTab===k?'active':''}">${n}</button>`).join('')}</div><div class="card storage-warning-card subtab-panel ${currentInfoSubTab==='status'?'active':''}"><div class="eyebrow">Bitte vor der Nutzung lesen</div><h2>Wichtiger Hinweis zur lokalen Datenspeicherung</h2><p><strong>Einstellungen, Profile, Ausrüstung, Standorte und Horizonte werden lokal in der Browserdatenbank IndexedDB gespeichert. Normale Cookies sind nicht der primäre Speicherort.</strong></p><p>Die PWA-Programmdateien liegen getrennt im Cache Storage. Das Löschen nur von „Bildern und Dateien im Cache“ entfernt IndexedDB normalerweise nicht. Das Löschen der Websitedaten kann jedoch Profile, Einstellungen und gespeicherte Dateizugriffe entfernen. Persistenter Speicher schützt nur vor automatischer Browserbereinigung – nicht vor einer bewussten Löschung. Erstelle deshalb regelmäßig externe Sicherungen.</p></div>
  <div class="card subtab-panel ${currentInfoSubTab==='status'?'active':''}"><h2>Astro Night Planner ${APP_VERSION}</h2><p>Installierbare PWA für Nachtplanung, astronomisches Wetter, Mond und Dämmerung, Deep-Sky-Auswahl, persönliche Ausrüstung, Standorte, Horizont und Rahmung.</p><div class="storage-status"><div class="metric"><div class="label">Umgebung</div><div class="value">${ENV==='prod'?'Produktion':'Test'}</div></div><div class="metric"><div class="label">Datenbank</div><div class="value small">${DB_NAME}</div></div><div class="metric"><div class="label">Version</div><div class="value">${APP_VERSION}</div></div></div></div>
  <div class="card subtab-panel ${currentInfoSubTab==='status'?'active':''}"><div class="section-title-row"><div><h2>Datenstatus</h2><div class="small muted">Technischer Status der lokalen Speicherung</div></div><button id="refreshStorageStatus">Status aktualisieren</button></div><div class="grid four"><div class="metric"><div class="label">Speicherschutz</div><div class="value ${storageInfo.persistent?'good':'warn'}">${persistentText}</div></div><div class="metric"><div class="label">Lokaler Speicherverbrauch</div><div class="value">${formatBytes(storageInfo.usage)}</div><div class="small muted">von ${formatBytes(storageInfo.quota)}</div></div><div class="metric"><div class="label">Externe Sicherung</div><div class="value small ${storageInfo.permission==='granted'?'good':'warn'}">${permissionText}</div><div class="small muted">${esc(backupConfig.targetName||'Kein Ziel')}</div></div><div class="metric"><div class="label">Letzte Sicherung</div><div class="value small ${reminderDue?'warn':'good'}">${esc(lastBackup)}</div></div></div><div class="data-actions" style="margin-top:12px"><button id="requestPersistence">Lokale Daten vor automatischer Browserbereinigung schützen</button></div><div id="storageMessage" class="notice" style="margin-top:12px">Der Speicherschutz verhindert keine manuelle Löschung von Websitedaten.</div></div>
  <div class="card subtab-panel ${currentInfoSubTab==='backup'?'active':''}">${renderSaveBar('backup','Sicherungseinstellungen speichern','top')}<div class="section-title-row"><div><h2>Automatische externe Sicherung</h2><div class="small muted">Die Sicherungsdatei liegt außerhalb des Browsercaches. Nach einer vollständigen Löschung der Websitedaten muss Ordner oder Datei erneut ausgewählt werden.</div></div><span class="backup-support ${storageInfo.fileSystemSupported?'good':'warn'}">${fileSupport}</span></div>
    <div class="grid two"><label class="chip"><input id="backupEnabled" type="checkbox" ${backupDraft.enabled?'checked':''} ${!storageInfo.fileSystemSupported?'disabled':''}>Automatische Sicherung aktivieren</label><label>Aufzubewahrende datierte Sicherungen<input id="backupKeep" type="number" min="1" max="50" value="${backupDraft.keep}"></label><label class="chip"><input id="backupAfterSave" type="checkbox" ${backupDraft.afterSave?'checked':''} ${!storageInfo.fileSystemSupported?'disabled':''}>Nach jedem erfolgreichen Speichern der Einstellungen sichern</label><label class="chip"><input id="backupDaily" type="checkbox" ${backupDraft.daily?'checked':''} ${!storageInfo.fileSystemSupported?'disabled':''}>Zusätzlich höchstens einmal täglich datierte Sicherung</label><label>Sicherungserinnerung nach Tagen<input id="backupReminderDays" type="number" min="1" max="90" value="${backupDraft.reminderDays}"></label><div class="metric"><div class="label">Sicherungsziel</div><div class="value small">${esc(backupConfig.targetName||'Noch nicht gewählt')}</div><div class="small muted">Berechtigung: ${permissionText}</div></div></div>
    <div class="notice backup-file-explanation" style="margin-top:12px"><strong>Zwei Dateitypen:</strong> <code>astro-night-planner-aktuell.json</code> wird fortlaufend überschrieben und ist für die normale Wiederherstellung gedacht. Datierte Dateien sind historische Rücksprungpunkte. Vor einer Wiederherstellung werden Datum und Inhalt angezeigt.</div><div class="data-actions backup-actions" style="margin-top:14px"><button id="chooseBackupDirectory" ${!storageInfo.fileSystemSupported?'disabled':''}>Sicherungsordner auswählen</button><button id="backupNow">Sicherung jetzt erstellen</button><button id="restoreBackup">Gesamtsicherung wiederherstellen</button><button id="exportAll">Gesamtsicherung exportieren</button><button id="exportProfile">Aktuelles Profil exportieren</button><button id="importProfile">Profil importieren</button></div>
    ${backupConfig.lastError?`<div class="notice warn" style="margin-top:12px">Letzter Sicherungsfehler: ${esc(backupConfig.lastError)}</div>`:''}
    ${!storageInfo.fileSystemSupported?'<div class="notice" style="margin-top:12px">Automatische Ordnersicherung ist in diesem Browser nicht verfügbar. Verwende Chrome oder Edge auf Desktop-Systemen oder nutze die manuelle JSON-Sicherung. Details: siehe Hilfe → Browserdaten-FAQ.</div>':''}
    ${renderSaveBar('backup','Sicherungseinstellungen speichern')}
  </div>
  <div class="card help-article subtab-panel ${currentInfoSubTab==='help'?'active':''}"><div class="section-title-row"><div><h2>${esc(tx('helpTitle'))}</h2><div class="small muted">${esc(tx('helpSub'))}</div><div class="help-language-note">${esc(tx('helpNote'))}</div></div><div class="data-actions"><button type="button" data-open-help-section="help-storage">${esc(language==='en'?'Open integrated help':'Integrierte Hilfe öffnen')}</button><a class="button primary" href="${docLink('pdf')}" target="_blank" rel="noopener">${esc(tx('helpPdf'))}</a></div></div>
    <div class="help-toc">${[['help-news','Neuerungen'],['help-storage','Datenspeicherung'],['help-first','Erste Schritte'],['help-plan','Planungsnacht'],['help-profiles','Planungsprofile'],['help-weather','Wetter'],['help-multiweather','Mehrnächte-Wetter'],['help-aurora','Polarlicht-Hinweis'],['help-cloudmap','Wolkenkarte'],['help-meteoblue','Meteoblue'],['help-weather-sources','Zusätzliche Wetterquellen'],['help-filters','Objektfilter'],['help-objects','Objektliste'],['help-details','Objektdetails'],['help-framing','Rahmung'],['help-horizon','Horizont'],['help-equipment','Ausrüstung'],['help-settings','Einstellungen'],['help-backup','Sicherung'],['help-browser-storage','Browserdaten-FAQ'],['help-pwa','PWA'],['help-troubleshooting','Fehlerbehebung'],['help-values','Bewertungswerte']].map(([id,label])=>`<a href="#${id}">${label}</a>`).join('')}</div>
    <section id="help-news"><h3>Neuerungen</h3><p>Die Neuerungen werden versionsweise angezeigt. Die aktuelle Version steht zuerst; danach folgen die vorherigen Versionsschritte.</p>${versionNotesHtml(language)}</section>
    <section id="help-storage"><h3>Datenspeicherung, Cookies und Browsercache</h3><p>Alle persönlichen Daten werden im gerade verwendeten Browser und Browserprofil gespeichert. IndexedDB enthält die fachlichen Daten, Cache Storage die für den Offlinebetrieb benötigten App-Dateien. Cookies sind nicht der Hauptspeicher. Ein normaler Cache-Löschvorgang betrifft die Einstellungen meist nicht; das Löschen aller Websitedaten der Installationsadresse kann sie jedoch entfernen. Auch ein Wechsel der Domain oder des Browserprofils erzeugt einen getrennten Speicherbereich. Übertrage Daten deshalb mit einer externen Sicherung.</p></section>
    <section id="help-first"><h3>Erste Schritte</h3><p>Prüfe zuerst unter Ausrüstung Teleskop, Kamera und Montierung. Lege anschließend unter Standorte & Horizont deinen Aufnahmeort, mindestens ein Horizontprofil und den jeweiligen Standard fest. Wähle in der Planung Standort, Datum, Planungszeitraum, Teleskop, Kamera, Horizontprofil und Wetterdarstellung. Danach kannst du Objektfilter setzen und ein Objekt durch Klick auf die gesamte Tabellenzeile öffnen.</p></section>
    <section id="help-plan"><h3>Planungsnacht</h3><p>Die Standortauswahl links neben den Datumsfeldern gilt nur für die aktuelle Planung. Koordinaten und Höhe stehen direkt darunter. Sonnen-, Dämmerungs- und Mondzeiten werden für diesen Standort berechnet. Der Planungszeitraum begrenzt Bewertung, Sichtbarkeitsdauer, Wetterzusammenfassung und Höhenprofile.</p></section>
    <section id="help-profiles"><h3>Profile für diese Planung</h3><p>Planungszeitraum, Aufnahmequalitätsprofil, Darstellungsprofil, Wetteransicht, Teleskop, Kamera und Horizontprofil können für die aktuelle Nacht temporär gewählt werden. Teleskop und Kamera wirken sofort auf Bildfeld, Framingbewertung und Aladin-Rahmung; das Horizontprofil auf die Horizontansicht. Keine dieser Auswahlen überschreibt einen gespeicherten Standard. Dauerhafte Standards werden ausschließlich in den Einstellungen festgelegt.</p></section>
    <section id="help-weather"><h3>Wetter und Modellkonsens</h3><p>Der Modellkonsens kombiniert DWD ICON, ECMWF IFS und NOAA GFS mit den gespeicherten Prozentgewichten. Einzelmodelle sind zur Kontrolle auswählbar. Die farbigen Felder bewerten die erwartete Aufnahmequalität. Die effektive Transparenz berücksichtigt die Bewölkung; der ergänzende atmosphärische Wert beschreibt die Klarheit ohne Wolkeneinfluss.</p></section>
    <section id="help-multiweather"><h3>Mehrnächte-Wetterverlauf</h3><p>Der Button in der Rubrik „Stündlicher Wetterverlauf“ öffnet eine zusätzliche Tab-Ansicht für die aktuelle Planungsnacht und weitere Nächte. Die Anzahl der zusätzlichen Nächte wird in den zentralen Einstellungen festgelegt; Standard ist 3. Die Tabellen verwenden denselben Standort, denselben Planungszeitraum und dieselbe Wetterdarstellung wie die Planung.</p></section><section id="help-aurora"><h3>Polarlicht-Hinweis</h3><p>Beim Öffnen der App werden Polarlichtdaten automatisch geladen. Die Bewertung nutzt maschinenlesbare Kp-Daten von NOAA/SWPC und, soweit verfügbar, die GFZ-Kp-Prognose. NOAA-Warnmeldungen werden als Kontext angezeigt, setzen aber nicht allein eine lokale Warnfarbe.</p><p>Die Warnstufen beziehen sich auf den aktuell gewählten Standort. Die eingestellten Kp-Schwellen werden vereinfacht an die geografische Breite angepasst: in hohen Breiten reicht niedrigere geomagnetische Aktivität, in niedrigen Breiten ist ein stärkeres Ereignis erforderlich. Gelb bedeutet erhöhte geomagnetische Aktivität, Orange bedeutet „Polarlicht am Standort möglich“, Rot eine deutlichere Lage. Reine Meldungszahlen ohne auswertbare Kp-Stärke erzeugen keine lokale Polarlichtwarnung.</p><p>Das Polarlicht-Dashboard zeigt Datenstatus, beobachtete und prognostizierte Kp-Werte sowie NOAA- und GFZ-Kontrollgrafiken. Der Button „Polarlichtdaten aktualisieren“ lädt Daten und Grafiken neu; die Grafiken dienen zur Plausibilitätsprüfung und ersetzen nicht die automatische Bewertung.</p></section><section id="help-cloudmap"><h3>Astro-Wolkenmodell</h3><p>Das Astro-Wolkenmodell ist eine eigene Planungsrubrik und kann wie der stündliche Wetterverlauf ein- oder ausgeklappt werden. In der Planung kann temporär zwischen „Karte + Wolken“ und „Nur Wolken“ gewechselt werden. Die kombinierte Ansicht nutzt eine bewusst dunkle, reduzierte topografische Basiskarte. Wolken erscheinen bei allen Modellen einheitlich weiß: je höher der Wolkenanteil, desto deckender die Fläche. Der Modus Modellabweichung bleibt farbig und zeigt die Streuung der drei Modelle.</p><p>Die Prozentangaben stehen an den tatsächlichen Prognosepunkten. 25, 49 oder 81 Prognosepunkte bestimmen die Datenmenge. Die Glättung verändert nur die Darstellung, nicht die Wetterdaten. Zwischenbilder werden aus stündlichen Modellwerten interpoliert und erhöhen nicht die Prognosegenauigkeit.</p><p><strong>Praxisbeispiel:</strong> Ein Standortwert von 15 % Bewölkung sieht gut aus. Liegt aber westlich eine 80-%-Wolkenkante und die Verlagerung zeigt auf den Standort, ist die Nacht riskanter als die Einzelzahl vermuten lässt. Umgekehrt kann ein mäßiger Kartenmittelwert akzeptabel sein, wenn der Standort dauerhaft in einer klaren Lücke bleibt.</p><p><strong>Niederschlag:</strong> „Niederschlag gesamt“ enthält Regen, Schauer und Schnee. Die Ebenen „Regen“ und „Schnee“ zeigen die Einzelanteile und helfen zu erkennen, welche Art von Niederschlag gemeint ist.</p></section>
    <section id="help-meteoblue"><h3>Meteoblue-Kontrollquellen</h3><p>Astronomy Seeing und Wetterkarten sind unabhängige Zusatzquellen und fließen nicht in den automatischen Konsens ein. Nutze sie zum Vergleich mit der eigenen Modellberechnung. Über Großansicht können die eingebetteten Karten bildschirmfüllend geöffnet werden. Die eingebetteten Karten starten näher am Planungsstandort, damit lokale Strukturen schneller erkennbar sind.</p><p><strong>Praxisbeispiel:</strong> Vor einer längeren Fahrt prüfst du zuerst das Astro-Wolkenmodell und öffnest danach die Meteoblue-Wolken-/Niederschlagskarte als externen Tab. Die eingebettete Meteoblue-Karte dient als schnelle Windanimationsansicht; Wolken und Niederschlag öffnest du gezielt über den separaten externen Meteoblue-Button.</p></section><section id="help-weather-sources"><h3>Zusätzliche Wetterquellen</h3><p>Die zusätzlichen Wetterquellen sind als Tabs organisiert. Meteoblue, Clear Outside, Windy und Ventusky nutzen den aktuell gewählten Planungsstandort und werden erst geladen, wenn der jeweilige Tab angewählt wird. Sie sind externe Kontrollquellen und fließen nicht automatisch in die Astro-Bewertung ein. Clear Outside wird als Prognosebild eingebunden und kann zusätzlich in einem separaten Browser-Tab geöffnet werden.</p><p><strong>Praxisbeispiel:</strong> Öffne die Tabs nacheinander, wenn du die eigene Astro-Wolkenkarte mit externen Quellen vergleichen möchtest. Windy und Ventusky dienen als interaktive Karten, Meteoblue als zusätzliche Kontrollansicht und Clear Outside als kompakte Prognosegrafik. Eine separate Wettervergleichsansicht mit gemeinsamer Zeitsteuerung wurde entfernt, weil die externen eingebetteten Karten ihre Zeitachsen nicht zuverlässig gemeinsam übernehmen.</p></section>
    <section id="help-filters"><h3>Objektfilter</h3><p>Filtere nach Katalog, Objekttyp, Magnitude, Mindesthöhe, Sichtbarkeitsdauer, Mondabstand und Objektgröße. Die Suche innerhalb der aktiven Filter verfeinert diese Auswahl. Die Direktsuche rechts daneben sucht dagegen nach Katalognummer, Objektname oder Alias und ignoriert bewusst alle anderen gesetzten Filter. So findest du zum Beispiel SH 2-119 oder NGC 7000 auch dann, wenn ein Katalog, Objekttyp, Größenbereich oder eine Mindesthöhe sie gerade ausblenden würde.</p><p>Texteingaben werden nach 1,5 Sekunden übernommen, damit nicht nach jedem Zeichen neu gerechnet wird; Enter oder „Filter anwenden“ startet sofort. Aktive Suchfelder werden hervorgehoben. Änderungen setzen die Ergebnisliste auf Seite 1 zurück. „Basisfilter zurücksetzen“ stellt nur die Werte dieser Basisfilter-Rubrik auf Standard zurück; Kataloge, Aufnahmefilter, Objekttypen, Ausrüstung und Anzeigeprofile bleiben unverändert.</p><p>Der Katalogfilter LDN/LBN enthält in dieser Version benannte LDN-Dunkelnebel. LBN-Objekte sind noch nicht als eigener Katalog importiert. Größenwerte der LDN-Objekte werden aus der katalogisierten Fläche als äquivalenter Kreis-Durchmesser berechnet und dienen als praktische Filter- und Rahmungshilfe.</p></section>
    <section id="help-objects"><h3>Objektliste und Mini-Höhenprofile</h3><p>Die Liste ist paginiert. Im Darstellungsprofil können die Informationen über eine aufklappbare Auswahlliste ein- oder ausgeschaltet und per Drag-and-drop beziehungsweise Auf-/Ab-Schaltflächen sortiert werden. Der Objektname bleibt immer sichtbar.</p><p>„Beste Stunde“ ist die Stunde mit dem höchsten Qualitätswert innerhalb des nautischen Planungszeitraums, sofern das Objekt über Mindesthöhe und persönlichem Horizont liegt. Meridian und Kulmination bleiben getrennte Informationen. Das Mini-Höhenprofil verwendet den gewählten Planungszeitraum und zeigt Dämmerungsbereiche, Mindesthöhe, Maximum und optional den aktiven persönlichen Horizont. Die Objektliste kann zusätzlich die Zeit über dem persönlichen Horizont anzeigen.</p></section>
    <section id="help-details"><h3>Objektdetails, Höhenkurve und Horizontansicht</h3><p>Ein Klick auf eine freie Stelle der Objektzeile öffnet die Details direkt darunter. Ein erneuter Klick oder „Details schließen“ schließt sie. Höhenkurve und Horizontansicht sind getrennt aufklappbar und besitzen synchronisierte Zeitregler. Himmelsrichtungen werden zusammen mit Gradwerten angezeigt. In der Horizontansicht kann für die aktuelle Detailprüfung vorübergehend ein anderes Horizontprofil des gewählten Standorts ausgewählt werden.</p></section>
    <section id="help-framing"><h3>Rahmung mit Aladin Lite</h3><p>Die Ansicht wird auf das gewählte Objekt zentriert und passend gezoomt. Kamerarahmen und Objektellipse werden in Himmelskoordinaten gezeichnet und folgen Zoom, Verschiebung und Größenänderung. Die Objektellipse verwendet die vollständigen Katalogachsen und den astronomischen Positionswinkel von Nord über Ost. Eine Rotation aktualisiert nur die Overlays und lädt das Himmelsbild nicht neu.</p><p>Nach dem Verschieben des Himmelsbilds setzt „Rahmen auf Bildmitte“ den Kamerarahmen auf die aktuell sichtbare Bildmitte, ohne zum ursprünglichen Katalogobjekt zurückzuspringen. „Himmelsbild neu laden“ ist nur für echte Ladeprobleme oder einen Surveywechsel vorgesehen. Der Regler „Zeit im Planungsfenster“ ändert nicht das Sternfeld, sondern aktualisiert Uhrzeit, Höhe, Azimut/Himmelsrichtung, Abstand zum persönlichen Horizont, Dämmerungsphase und die zeitlich nächstliegenden Wetterwerte.</p><p>„Objektnamen anzeigen“ blendet Namen und Katalognummern ein. In der automatischen Stufe erscheinen bei großem Sichtfeld nur Hauptobjekte; beim Hineinzoomen werden schrittweise weitere Objekte aus dem Planner-Katalog beschriftet. Die Zahl der Beschriftungen wird begrenzt, damit die Ansicht lesbar bleibt.</p><p>Die Framingbewertung berücksichtigt Objektgröße, Positionswinkel, Kamerafeld, relative Drehung und den Mindestfreiraum. Bei verlässlichem Positionswinkel kann die Kamera automatisch auf den größtmöglichen Mindestrand gedreht werden.</p><p>Im externen Aladin-Tab können zusätzlich Boden/Horizont und ein eigenes azimutales Gradnetz als App-Overlay angezeigt werden. Die Bodenmaske wird aus Standort, Zeit und gewähltem Horizont berechnet. Der Standardhorizont kann in der Aladin-Projektion als gerade Linie erscheinen; die Darstellung dient als Orientierungshilfe und ersetzt keine vollständige Planetariumsansicht. Das native Aladin-Gradnetz bleibt über den Aladin-eigenen Button steuerbar. Das azimutale App-Gradnetz besitzt im Auto-Modus feinere Abstufungen beim Hineinzoomen und zeigt Gradzahl-Labels am Rand der sichtbaren Linien.</p></section>
    <section id="help-horizon"><h3>Standorte und interaktive Horizontprofile</h3><p>Für jeden Standort können mehrere Horizontprofile angelegt werden. Die Standortsuche zeigt eine Trefferliste mit Ort, Region, Land, Postleitzahl und Koordinaten; ein bevorzugtes Land verhindert, dass eine deutsche PLZ ungeprüft einem weltweiten Ersttreffer zugeordnet wird. Die Zeitzone wird automatisch ermittelt und kann nur aus gültigen IANA-Zeitzonen gewählt werden.</p><p>Ein Horizontprofil wird als Standard festgelegt; in Planung und Detailansicht kann vorübergehend ein anderes gewählt werden. Bearbeite die Linie direkt mit Maus oder Finger. Hindernisse gehören zum jeweiligen Profil.</p></section>
    <section id="help-equipment"><h3>Ausrüstung</h3><p>Teleskope, Kameras und Montierungen werden als Listen geführt. Je Kategorie ist ein Eintrag als dauerhafter Standard aktiv. Teleskop und Kamera bestimmen Bildfeld und Pixelmaßstab. Für eine einzelne Planung können beide unter „Profile für diese Planung“ oder direkt im interaktiven Himmelsbild temporär gewechselt werden. Die Montierung dient zunächst der Dokumentation und kann später in Wind- oder Tragfähigkeitsbewertungen einbezogen werden.</p></section>
    <section id="help-settings"><h3>Speichern und Standardwerte</h3><p>Jede Rubrik besitzt eine einheitliche Speicherleiste und einen eigenen Button „Rubrik auf Standard zurücksetzen“. Das Zurücksetzen verändert zunächst nur die Eingaben; dauerhaft wird es erst nach dem Speichern. Nach erfolgreichem Speichern wird der Button drei Sekunden gelb und zeigt „Gespeichert ✓“.</p><p>Die Qualitätsampel verwendet standardmäßig Rot 0–59, Gelb 60–79 und Grün 80–100. Die Grenzen „Gelb ab“ und „Grün ab“ können geändert werden.</p></section>
    <section id="help-backup"><h3>Export, automatische Sicherung und Wiederherstellung</h3><p>„Gesamtsicherung exportieren“ enthält alle Profile samt Ausrüstung, Standorten und Einstellungen. „Aktuelles Profil exportieren“ überträgt nur das aktive Profil einschließlich der dafür benötigten Daten. Mit „Profil importieren“ wird eine solche Profildatei immer als neues Profil angelegt; ein vorhandenes Profil wird nicht ungefragt überschrieben.</p><p><code>astro-night-planner-aktuell.json</code> wird bei jeder automatischen Sicherung überschrieben. Sie enthält den neuesten Stand und ist die erste Wahl für eine normale Wiederherstellung. Dateien wie <code>astro-night-planner-2026-06-16T21-24-30.json</code> sind unveränderliche historische Rücksprungpunkte; verwende sie nur, wenn bewusst ein älterer Zustand benötigt wird.</p><p>Wähle „Aus Sicherung wiederherstellen“, öffne die gewünschte JSON-Datei und kontrolliere die Vorschau mit Sicherungsdatum, Profilen, Teleskopen, Kameras, Montierungen und Standorten. Vor der eigentlichen Wiederherstellung versucht die App, den aktuellen Zustand noch einmal als datierte Sicherung abzulegen. Die externe Datei bleibt nach dem Löschen von Websitedaten erhalten; die Ordnerberechtigung liegt jedoch in IndexedDB und muss danach erneut erteilt werden.</p></section>
    <section id="help-browser-storage"><h3>Browserdaten-FAQ: Daten dauerhaft behalten</h3><p>Der Astro Night Planner speichert Standorte, Ausrüstung, Horizonte, Profile und eigene Ziele lokal in IndexedDB. Diese Daten bleiben bei normalen App-Updates erhalten, gehen aber verloren, wenn der Browser Website-Daten beim Beenden löscht oder die Seite im privaten Modus genutzt wird.</p><p><strong>Firefox:</strong> Unter Datenschutz & Sicherheit darf „Cookies und Website-Daten beim Beenden von Firefox löschen“ nicht aktiv sein. Wenn die Option ausgegraut ist, ist häufig „niemals Chronik anlegen“ oder „immer privaten Modus verwenden“ aktiv. Stelle Firefox auf „Chronik anlegen“ oder erlaube mindestens <code>planner.deepskyastrophoto.de</code> als Ausnahme.</p><p><strong>Chrome und Edge:</strong> Prüfe unter Datenschutz/Site-Einstellungen, dass Website-Daten für diese App nicht automatisch gelöscht werden. Für automatische Ordnersicherung sind Chrome oder Edge auf Desktop-Systemen die bevorzugten Browser.</p><p><strong>Safari und iOS:</strong> Die App kann genutzt werden, aber automatische Ordnersicherung in einen gewählten lokalen Ordner ist nicht zuverlässig verfügbar. Nutze dort regelmäßig die manuelle JSON-Sicherung.</p><p>Empfehlung: Nach jeder größeren Änderung eine Gesamtsicherung exportieren und vor Updates die angebotene Sicherung verwenden.</p></section>
    <section id="help-pwa"><h3>Installation als PWA und Offlinebetrieb</h3><p>Nach der Installation kann die App wie ein eigenständiges Programm gestartet werden. Programmdateien stehen offline zur Verfügung. Wetter-, Karten-, Meteoblue- und Katalogaktualisierungen benötigen weiterhin eine Internetverbindung.</p></section>
    <section id="help-troubleshooting"><h3>Fehlerbehebung</h3><p>Bei alten Darstellungen zuerst die App neu laden und einen angebotenen PWA-Updatehinweis bestätigen. Zeigt die Browserhilfe trotzdem einen veralteten Stand, die Anwendung vollständig schließen und neu öffnen. Externe Dienste wie Aladin, Meteoblue und Wettermodelle können zeitweise nicht erreichbar sein. Lösche Websitedaten nur als letzte Maßnahme und ausschließlich nach einer aktuellen externen Sicherung.</p></section>
    <section id="help-values"><h3>Bedeutung der Bewertungswerte</h3><p>Die Gesamtbewertung kombiniert Wolken, effektive Transparenz, Seeing, Wind/Böen, Tauabstand, Mond, Objekthöhe und Sichtbarkeitsdauer. Die Gewichte ergeben zusammen 100 %. Farben beziehen sich auf erwartete Aufnahmequalität, nicht auf die sichere Belastbarkeit der Ausrüstung.</p><p><strong>Atmosphärische Transparenz</strong> beschreibt die wolkenunabhängige Klarheit der Luft. Sie wird durch Aerosole, Dunst, Feuchte, Schleier und Extinktion beeinflusst. Auch bei scheinbar wolkenfreiem Himmel kann eine schlechte atmosphärische Transparenz schwache Nebel- und Galaxienstrukturen deutlich abschwächen.</p><p><strong>Effektive Transparenz</strong> ist der praxisnähere Aufnahmeindikator, weil sie die Luftklarheit mit der tatsächlichen Bewölkung verbindet. Für die Entscheidung, ob sich eine Deep-Sky-Aufnahme lohnt, ist sie meist wichtiger als der reine, wolkenunabhängige Transparenzwert. Die atmosphärische Transparenz bleibt als ergänzende Erklärung nützlich, insbesondere wenn die Wolkenwerte gut aussehen, die Bildqualität aber trotzdem gedämpft sein kann.</p></section>
    <div class="help-return"><a class="button primary" href="./">Zurück zur aktuellen Anwendung</a></div>
  </div>`;
}

async function setObjectDetails(objectId,open=true,scroll=true){const changed=profile.planning.selectedObjectId!==objectId,wasOpen=Boolean(profile.planning.detailsOpen);if(changed){profile.planning.frameCenterRaDeg=null;profile.planning.frameCenterDecDeg=null;profile.planning.frameCenterObjectId=null;profile.planning.frameMoveMode=false;}profile.planning.selectedObjectId=objectId;profile.planning.detailsOpen=open;const object=catalog.find(item=>item.id===objectId);if(open&&object&&(changed||!wasOpen||profile.planning.objectRotationObjectId!==objectId)){profile.planning.objectRotation=normalizedAngle180(Number(object.positionAngleDeg)||0);profile.planning.objectRotationObjectId=objectId}if(open&&(changed||!Number.isFinite(Number(profile.planning.frameRotation)))&&framingSettings().autoRotate&&object)profile.planning.frameRotation=optimalFrameRotation(object);await saveProfile();render();if(scroll)requestAnimationFrame(()=>{const row=[...document.querySelectorAll('[data-object-row]')].find(item=>item.dataset.objectRow===objectId);const detail=document.getElementById(`objectDetail-${objectId}`);(open?detail||row:row)?.scrollIntoView({behavior:'smooth',block:open?'nearest':'center'})})}


function normalizeObjectToken(value){return String(value||'').toUpperCase().replace(/[^A-Z0-9]/g,'')}
function uniqueObjectTerms(values){const seen=new Set();return values.filter(Boolean).map(value=>String(value).trim()).filter(value=>{const key=normalizeObjectToken(value);if(!key||seen.has(key))return false;seen.add(key);return true})}
function formattedCatalogIdentifier(value){
  const compact=normalizeObjectToken(value);
  let m=compact.match(/^SH2(\d+[A-Z]?)$/);if(m)return`SH 2-${m[1]}`;
  m=compact.match(/^NGC(\d+[A-Z]?)$/);if(m)return`NGC ${m[1]}`;
  m=compact.match(/^IC(\d+[A-Z]?)$/);if(m)return`IC ${m[1]}`;
  m=compact.match(/^M(\d+[A-Z]?)$/);if(m)return`M ${m[1]}`;
  m=compact.match(/^ABELL(\d+[A-Z]?)$/);if(m)return`Abell ${m[1]}`;
  m=compact.match(/^LDN(\d+[A-Z]?)$/);if(m)return`LDN ${m[1]}`;
  m=compact.match(/^LBN(\d+[A-Z]?)$/);if(m)return`LBN ${m[1]}`;
  m=compact.match(/^B(\d+[A-Z]?)$/);if(m)return`Barnard ${m[1]}`;
  return String(value||'').trim();
}
function catalogIdentifierTerms(object){
  const terms=uniqueObjectTerms([object?.id,...(object?.aliases||[])]);
  return uniqueObjectTerms(terms.map(formattedCatalogIdentifier).filter(value=>/^((SH\s*2-|NGC|IC|M|Abell|LDN|LBN|B|Barnard)\s*\d+)/i.test(value)));
}
function wikipediaSearchTerms(object){
  const catalogTerms=catalogIdentifierTerms(object);
  const nameTerms=uniqueObjectTerms([object?.name,...(object?.aliases||[])]).filter(value=>!catalogIdentifierTerms({id:value,aliases:[]}).length);
  return uniqueObjectTerms([...catalogTerms,...nameTerms,object?.id]);
}
function preferredWikipediaTerm(object){return wikipediaSearchTerms(object)[0]||object?.id||''}
function wikipediaSearchUrl(object){
  const lang=language==='en'?'en':'de';
  const query=preferredWikipediaTerm(object);
  return `https://${lang}.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`;
}
function openWikipediaForObjectId(objectId){const object=catalog.find(item=>item.id===objectId);if(!object)return;window.open(wikipediaSearchUrl(object),'_blank','noopener');}
function bindRendered(){
  document.querySelectorAll('[data-open-settings]').forEach(button=>button.onclick=async()=>{currentMainTab='settings';currentSettingsTab=button.dataset.openSettings||'locations';profile.ui.mainTab=currentMainTab;profile.ui.settingsTab=currentSettingsTab;await saveProfile();render()});
  document.getElementById('firstRunRestoreBackup')?.addEventListener('click',()=>{importMode='backup';importInput.accept='application/json,.json';importInput.click()});
  document.querySelectorAll('[data-open-help-section]').forEach(button=>button.addEventListener('click',async()=>{currentMainTab='settings';currentSettingsTab='info';currentInfoSubTab='help';profile.ui.mainTab=currentMainTab;profile.ui.settingsTab=currentSettingsTab;await saveProfile();render();setTimeout(()=>document.getElementById(button.dataset.openHelpSection)?.scrollIntoView({behavior:'smooth',block:'start'}),120)}));
  document.querySelectorAll('[data-wikipedia-object]').forEach(button=>button.onclick=event=>{event.stopPropagation();openWikipediaForObjectId(button.dataset.wikipediaObject)});
  const planningLocationSelect=document.getElementById('planningLocationSelect');
  if(planningLocationSelect)planningLocationSelect.onchange=async()=>{
    profile.planning.locationId=planningLocationSelect.value||null;
    profile.planning.temporaryHorizonProfileId=null;
    profile.planning.detailsOpen=false;profile.planning.cloudMapFrame=0;page=1;
    const location=activeLocation();selectedDateKey=dateKeyFor(new Date(),location.timezone);profile.planning.dateKey=selectedDateKey;
    cloudMapData=null;locationComparisonData=null;
    await saveProfile();render();fetchWeather();
  };
  document.querySelectorAll('[data-date]').forEach(button=>button.onclick=async()=>{
    selectedDateKey=button.dataset.date;
    profile.planning.dateKey=selectedDateKey;
    profile.planning.detailsOpen=false;
    profile.planning.cloudMapFrame=0;
    cloudMapData=null;
    page=1;
    await saveProfile();
    render();
    fetchWeather();
  });
  document.getElementById('planningCalendarDate')?.addEventListener('change',async event=>{
    const value=event.target.value||dateKeys()[0];
    selectedDateKey=value;
    profile.planning.dateKey=selectedDateKey;
    profile.planning.detailsOpen=false;
    profile.planning.cloudMapFrame=0;
    cloudMapData=null;
    locationComparisonData=null;
    page=1;
    await saveProfile();
    render();
    if(isForecastDateKey(selectedDateKey))fetchWeather();
  });
  document.getElementById('weatherRefresh')?.addEventListener('click',fetchWeather);
  document.getElementById('openMultiNightWeather')?.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();openMultiNightWeatherWindow()});
  document.getElementById('auroraRefresh')?.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();fetchAuroraStatus({manual:true})});
  document.getElementById('auroraDashboard')?.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();openAuroraDashboard()});
  document.querySelectorAll('[data-weather-source-tab]').forEach(button=>button.addEventListener('click',async()=>{profile.planning.weatherSourceTab=button.dataset.weatherSourceTab;await saveProfile();render();}));
  document.getElementById('loadFlightWeather')?.addEventListener('click',fetchFlightWeather);
  document.getElementById('toggleFlightStationMap')?.addEventListener('click',()=>{flightStationMapOpen=!flightStationMapOpen;render();});
  document.getElementById('loadMosmix')?.addEventListener('click',fetchMosmix);
  const planningWindowTop=document.getElementById('planningWindowTop');
  if(planningWindowTop)planningWindowTop.onchange=async()=>{
    profile.planning.planningWindow=planningWindowTop.value;
    profile.planning.detailsOpen=false;
    page=1;
    await saveProfile();
    render();
  };
  document.querySelectorAll('[data-filter-tab]').forEach(button=>button.onclick=()=>{currentObjectFilterTab=button.dataset.filterTab||'basis';document.querySelectorAll('[data-filter-tab]').forEach(b=>b.classList.toggle('active',b===button));document.querySelectorAll('[data-filter-tab-panel]').forEach(panel=>panel.classList.toggle('active',panel.dataset.filterTabPanel===currentObjectFilterTab));});
  const applyFilterValue=async(element,key,type)=>{
    profile.planning[key]=type==='number'?Number(element.value):type==='checked'?element.checked:element.value;
    profile.planning.detailsOpen=false;page=1;await saveProfile();render();
  };
  const immediate=[
    ['maxMagnitude','maxMagnitude','number'],['minAltitude','minAltitude','number'],
    ['minScore','minScore','number'],['minVisibleHours','minVisibleHours','number'],['visibilityBasis','visibilityBasis','value'],['minMoonDistance','minMoonDistance','number'],
    ['surfaceBrightnessMax','surfaceBrightnessMax','number'],['showNoSurfaceBrightness','showNoSurfaceBrightness','checked'],['excludeNoSize','excludeNoSize','checked'],['onlyFits','onlyFits','checked']
  ];
  for(const[id,key,type]of immediate){
    const element=document.getElementById(id);
    if(element)element.addEventListener('change',()=>applyFilterValue(element,key,type));
  }
  const updateSizeFromFields=async()=>{const minD=document.getElementById('minSizeDeg'),minM=document.getElementById('minSizeMin'),maxD=document.getElementById('maxSizeDeg'),maxM=document.getElementById('maxSizeMin');if(!minD||!minM||!maxD||!maxM)return;let min=degMinToArcMin(minD.value,minM.value),max=degMinToArcMin(maxD.value,maxM.value);if(max&&min>max){min=max;const dm=arcMinToDegMin(min);minD.value=String(dm.deg);minM.value=String(dm.min)}profile.planning.minSize=min;profile.planning.maxSize=max;profile.planning.sizeProfileId='custom';profile.planning.detailsOpen=false;page=1;await saveProfile();render()};
  ['minSizeDeg','minSizeMin','maxSizeDeg','maxSizeMin'].forEach(id=>document.getElementById(id)?.addEventListener('change',updateSizeFromFields));
  document.getElementById('sizeProfileSelect')?.addEventListener('change',async event=>{const id=event.target.value;if(!id)return;const preset=profile.central.sizeProfiles.find(x=>x.id===id);if(!preset)return;profile.planning.sizeProfileId=id;profile.planning.minSize=degMinToArcMin(preset.minDeg,preset.minMin);profile.planning.maxSize=degMinToArcMin(preset.maxDeg,preset.maxMin);profile.planning.excludeNoSize=Boolean(preset.excludeNoSize);profile.planning.detailsOpen=false;page=1;await saveProfile();render()});
  document.getElementById('objectTypeProfileSelect')?.addEventListener('change',async event=>{const id=event.target.value;if(id==='custom'){profile.planning.objectTypeProfileCustom=true}else{const preset=profile.central.objectTypeProfiles.find(x=>x.id===id);if(preset){profile.planning.objectTypeProfileId=id;profile.planning.objectTypeProfileCustom=false;profile.planning.types=resolvedObjectTypeProfileTypes(preset)}}profile.planning.detailsOpen=false;page=1;await saveProfile();render()});
  const search=document.getElementById('objectSearch');
  const directSearch=document.getElementById('objectDirectSearch');
  const applySearch=async()=>{
    clearTimeout(objectFilterTimer);
    profile.planning.search=search?.value||'';
    profile.planning.directSearch=directSearch?.value||'';
    profile.planning.detailsOpen=false;page=1;
    await saveProfile();render();
  };
  for(const element of [search,directSearch].filter(Boolean)){
    element.addEventListener('input',()=>{clearTimeout(objectFilterTimer);objectFilterTimer=setTimeout(applySearch,1500)});
    element.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();applySearch()}});
  }
  document.getElementById('applyObjectFilters')?.addEventListener('click',applySearch);
  document.getElementById('resetBasisFilters')?.addEventListener('click',async()=>{
    clearTimeout(objectFilterTimer);
    const base=standardProfile(),defaults=profile.central.filterDefaults||base.central.filterDefaults;
    profile.planning.search='';
    profile.planning.directSearch='';
    profile.planning.maxMagnitude=base.planning.maxMagnitude;
    profile.planning.minAltitude=base.planning.minAltitude;
    profile.planning.minVisibleHours=base.planning.minVisibleHours;
    profile.planning.minMoonDistance=base.planning.minMoonDistance;
    profile.planning.minSize=base.planning.minSize;
    profile.planning.maxSize=base.planning.maxSize;
    profile.planning.sizeProfileId=profile.central.activeSizeProfileId||base.planning.sizeProfileId;
    const preset=(profile.central.sizeProfiles||[]).find(item=>item.id===profile.planning.sizeProfileId);
    if(preset){profile.planning.minSize=degMinToArcMin(preset.minDeg,preset.minMin);profile.planning.maxSize=degMinToArcMin(preset.maxDeg,preset.maxMin);profile.planning.excludeNoSize=Boolean(preset.excludeNoSize)}else profile.planning.excludeNoSize=base.planning.excludeNoSize;
    profile.planning.minScore=Number(defaults.minScore)||0;
    profile.planning.visibilityBasis=defaults.visibilityBasis||base.planning.visibilityBasis;
    profile.planning.surfaceBrightnessMax=Number(defaults.surfaceBrightnessMax)||base.planning.surfaceBrightnessMax;
    profile.planning.showNoSurfaceBrightness=defaults.showNoSurfaceBrightness!==false;
    profile.planning.detailsOpen=false;
    page=1;
    await saveProfile();
    render();
    const msg=document.createElement('div');
    msg.className='notice good filter-reset-feedback';
    msg.textContent=language==='en'?'Basic filters have been reset to defaults.':'Basisfilter wurden auf Standard zurückgesetzt.';
    const details=document.getElementById('filterDetails');
    const actions=document.querySelector('.filter-action-row');
    if(details&&actions){actions.insertAdjacentElement('afterend',msg);setTimeout(()=>msg.remove(),2600)}
  });
  document.querySelectorAll('[data-catalog]').forEach(element=>element.onchange=async()=>{
    profile.planning.catalogs=element.checked?[...new Set([...profile.planning.catalogs,element.dataset.catalog])]:profile.planning.catalogs.filter(item=>item!==element.dataset.catalog);
    profile.planning.detailsOpen=false;
    page=1;
    await saveProfile();
    render();
  });
  document.querySelectorAll('[data-object-type]').forEach(element=>element.onchange=async()=>{
    const current=Array.isArray(profile.planning.types)?profile.planning.types.slice():[];
    if(!element.checked&&current.length<=1){element.checked=true;alert('Bitte mindestens einen Objekttyp auswählen.');return}
    profile.planning.types=element.checked?[...new Set([...current,element.dataset.objectType])]:current.filter(item=>item!==element.dataset.objectType);
    profile.planning.objectTypeProfileCustom=true;
    profile.planning.detailsOpen=false;
    page=1;
    await saveProfile();
    render();
  });
  document.querySelectorAll('[data-rec-filter]').forEach(element=>element.onchange=async()=>{
    profile.planning.selectedFilters=element.checked?[...new Set([...profile.planning.selectedFilters,element.dataset.recFilter])]:profile.planning.selectedFilters.filter(item=>item!==element.dataset.recFilter);
    if(!profile.planning.selectedFilters.length)profile.planning.selectedFilters=DEFAULT_SELECTED_FILTERS.slice();
    profile.planning.detailsOpen=false;page=1;await saveProfile();render();
  });
  document.querySelectorAll('[data-framing-filter]').forEach(element=>element.onchange=async()=>{
    profile.planning.framingFilter=element.checked?[...new Set([...profile.planning.framingFilter,element.dataset.framingFilter])]:profile.planning.framingFilter.filter(item=>item!==element.dataset.framingFilter);
    if(!profile.planning.framingFilter.length)profile.planning.framingFilter=['good','near-edge','too-large','unknown'];
    profile.planning.detailsOpen=false;page=1;await saveProfile();render();
  });
  document.querySelectorAll('[data-page-number]').forEach(button=>button.onclick=async()=>{
    page=clamp(Number(button.dataset.pageNumber),1,999);
    profile.planning.page=page;
    profile.planning.detailsOpen=false;
    await saveProfile();
    render();
    document.querySelector('.object-table-wrap')?.scrollIntoView({behavior:'smooth',block:'start'});
  });
  document.querySelectorAll('#pageSizeSelect').forEach(select=>{
    select.value=String(profile.planning.pageSize);
    select.onchange=async()=>{
      const key=currentDisplayProfile();
      profile.central.listDisplay.profiles[key].pageSize=Number(select.value);
      profile.planning.pageSize=Number(select.value);
      profile.planning.detailsOpen=false;
      page=1;
      await saveProfile();
      render();
    };
  });
  document.querySelectorAll('[data-object-row]').forEach(row=>{
    const activate=event=>{
      if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;
      if(event.target.closest('button,input,select,a,label'))return;
      event.preventDefault();
      const sameOpen=profile.planning.detailsOpen&&profile.planning.selectedObjectId===row.dataset.objectRow;
      setObjectDetails(row.dataset.objectRow,!sameOpen,true);
    };
    row.addEventListener('click',activate);
    row.addEventListener('keydown',activate);
  });
  document.querySelectorAll('[data-frame-object]').forEach(button=>button.onclick=event=>{
    event.stopPropagation();
    setObjectDetails(button.dataset.frameObject,true,true);
  });
  document.querySelectorAll('[data-toggle-target]').forEach(button=>button.onclick=async event=>{
    event.stopPropagation();
    const objectId=button.dataset.toggleTarget;
    const exists=(profile.targets||[]).some(item=>item.objectId===objectId);
    if(exists){profile.targets=profile.targets.filter(item=>item.objectId!==objectId);await saveProfile();render();return}
    const ok=await addImagingTarget(objectId);
    if(ok)render();
  });
  document.querySelectorAll('[data-close-object-details]').forEach(button=>button.onclick=async event=>{
    event.stopPropagation();
    profile.planning.detailsOpen=false;
    await saveProfile();
    render();
    requestAnimationFrame(()=>{
      [...document.querySelectorAll('[data-object-row]')].find(item=>item.dataset.objectRow===profile.planning.selectedObjectId)?.scrollIntoView({behavior:'smooth',block:'center'});
    });
  });
  const detailHorizon=document.getElementById('detailHorizonProfileSelect');if(detailHorizon)detailHorizon.onchange=async()=>{const loc=activeLocation();profile.planning.temporaryHorizonProfileId=detailHorizon.value===loc.defaultHorizonProfileId?null:detailHorizon.value;await saveProfile();render()};
  bindPlanProfiles();
  bindFraming();
  bindDetailTimeControls();
  bindDetails();
  bindCloudMap();
  bindMeteobluePanels();
  bindSettings();
}

function stopCloudMapAnimation(){
  if(cloudMapAnimationTimer){clearInterval(cloudMapAnimationTimer);cloudMapAnimationTimer=null}
  const button=document.getElementById('cloudMapPlay');
  if(button)button.textContent=ui('▶ Abspielen','▶ Play');
}
function applyCloudMapFrame(index,persist=true){if(!cloudMapData)return;const times=cloudDisplayTimes(),max=Math.max(0,times.length-1),value=clamp(Math.round(Number(index)||0),0,max);profile.planning.cloudMapFrame=value;const slider=document.getElementById('cloudMapTime');if(slider){slider.max=String(max);slider.value=String(value)}updateCloudMapReadouts();drawCloudMap();if(persist)scheduleCloudMapProfileSave()}
function updateCloudMapReadouts(){if(!cloudMapData)return;const view=currentCloudMapView(),layer=profile.planning.cloudMapLayer||cloudMapSettings().defaultLayer,index=clamp(Number(profile.planning.cloudMapFrame)||0,0,cloudDisplayTimes().length-1),time=new Date(cloudDisplayTimes()[index]),stats=cloudFrameStats(view,layer,cloudRawPosition(index)),movement=estimateCloudMovement(view,layer,index),loc=activeLocation(),set=(id,text)=>{const element=document.getElementById(id);if(element)element.textContent=text};set('cloudMapTimeLabel',fmtDateTime(time,loc.timezone));set('cloudMapCenterValue',`${fmt(stats.center)} %`);set('cloudMapAverageValue',`${fmt(stats.average)} %`);set('cloudMapSpreadValue',language==='en'?`${fmt(stats.uncertainty,1)} percentage points`:`${fmt(stats.uncertainty,1)} %-Punkte`);set('cloudMapMovement',movement?.reliable?(language==='en'?`Estimated movement: direction ${movement.cardinal||cardinal(movement.azimuth)} · ${fmt(movement.distance,0)} km/h · confidence ${fmt(movement.confidence*100)} %`:`Geschätzte Verlagerung: ${movement.direction} · ${fmt(movement.distance,0)} km/h · Sicherheit ${fmt(movement.confidence*100)} %`):ui('Bewegungsrichtung unsicher','Movement direction uncertain'))}
async function fetchLocationComparison(){
  if(!profile.locations?.length)return;
  locationComparisonLoading=true;locationComparisonError='';locationComparisonData=null;render();
  try{
    const locations=profile.locations.slice(0,20);
    const activeNight=nightData(selectedDateKey,activeLocation());
    const range=cloudMapRange(activeNight);
    const modelResults={};
    for(const [modelKey,config] of Object.entries(WEATHER_MODEL_CONFIG)){
      const url=new URL('https://api.open-meteo.com/v1/forecast');
      url.search=new URLSearchParams({
        latitude:locations.map(location=>Number(location.latitude).toFixed(4)).join(','),
        longitude:locations.map(location=>Number(location.longitude).toFixed(4)).join(','),
        hourly:'cloud_cover,cloud_cover_high,precipitation',
        models:config.model,timezone:'GMT',
        start_date:range.start.toISOString().slice(0,10),
        end_date:range.end.toISOString().slice(0,10)
      });
      const response=await fetch(url);
      if(!response.ok)throw new Error(`${config.name}: HTTP ${response.status}`);
      const payload=await response.json();
      modelResults[modelKey]=Array.isArray(payload)?payload:[payload];
    }
    const weights=profile.central.weatherModels.weights;
    const rows=locations.map((location,locationIndex)=>{
      const hourlyFrames=range.times.map(frameTime=>{
        const values=[];
        for(const [modelKey] of Object.entries(WEATHER_MODEL_CONFIG)){
          const result=modelResults[modelKey]?.[locationIndex];
          if(!result?.hourly?.time)continue;
          const times=result.hourly.time.map(value=>parseCloudApiTime(value).getTime());
          const sourceIndex=nearestTimeIndex(times,frameTime.getTime());
          values.push({
            cloud:Number(result.hourly.cloud_cover?.[sourceIndex]),
            high:Number(result.hourly.cloud_cover_high?.[sourceIndex]),
            precip:Number(result.hourly.precipitation?.[sourceIndex]),
            weight:Number(weights[modelKey]||0)
          });
        }
        const positive=values.filter(item=>item.weight>0);
        const weightedValues=positive.length?positive:values.map(item=>({...item,weight:1}));
        const sum=weightedValues.reduce((acc,item)=>acc+item.weight,0)||1;
        const weighted=key=>weightedValues.reduce((acc,item)=>acc+Number(item[key]||0)*item.weight,0)/sum;
        const mean=weighted('cloud');
        const spread=Math.sqrt(weightedValues.reduce((acc,item)=>acc+Math.pow(item.cloud-mean,2)*item.weight,0)/sum);
        return{time:frameTime,cloud:mean,high:weighted('high'),precip:weighted('precip'),spread};
      });
      return{
        name:location.name,
        cloud:hourlyFrames.reduce((sum,frame)=>sum+frame.cloud,0)/hourlyFrames.length,
        spread:hourlyFrames.reduce((sum,frame)=>sum+frame.spread,0)/hourlyFrames.length
      };
    }).sort((a,b)=>a.cloud-b.cloud);
    locationComparisonData={rows,updatedAt:new Date().toISOString()};
  }catch(error){locationComparisonError=error?.message||'Standortvergleich konnte nicht geladen werden.'}
  finally{locationComparisonLoading=false;render()}
}
function bindCloudMap(){
  document.getElementById('cloudMapReload')?.addEventListener('click',()=>fetchCloudMap(true));
  const view=document.getElementById('cloudMapView');if(view)view.onchange=async()=>{profile.planning.temporaryCloudMapView=view.value;await saveProfile();updateCloudMapReadouts();drawCloudMap()};
  const layer=document.getElementById('cloudMapLayer');if(layer)layer.onchange=async()=>{profile.planning.cloudMapLayer=layer.value;await saveProfile();updateCloudMapReadouts();drawCloudMap()};
  const mode=document.getElementById('cloudMapMode');if(mode)mode.onchange=async()=>{profile.planning.cloudMapMode=mode.value;await saveProfile();drawCloudMap()};
  const baseMode=document.getElementById('cloudMapBaseMode');if(baseMode)baseMode.onchange=async()=>{profile.planning.temporaryCloudMapBaseMode=baseMode.value;await saveProfile();drawCloudMap()};
  const smoothing=document.getElementById('cloudMapSmoothingTemporary');if(smoothing)smoothing.onchange=async()=>{profile.planning.temporaryCloudSmoothing=smoothing.value;await saveProfile();drawCloudMap()};
  const showValues=document.getElementById('cloudMapShowValues');if(showValues)showValues.onchange=async()=>{profile.planning.temporaryCloudMapShowValues=showValues.checked;await saveProfile();drawCloudMap()};
  const stage=document.querySelector('.cloud-map-stage');if(stage)stage.onchange=async event=>{const target=event.target;if(!target?.matches?.('[data-cloud-overlay]'))return;profile.planning.cloudMapWeatherOverlays={...cloudMapWeatherOverlays(),[target.dataset.cloudOverlay]:target.checked};await saveProfile();drawCloudMap()};
  const step=document.getElementById('cloudMapTimeStep');if(step)step.onchange=async()=>{const oldTimes=cloudDisplayTimes(),oldTime=oldTimes[clamp(Number(profile.planning.cloudMapFrame)||0,0,oldTimes.length-1)];profile.planning.cloudMapTimeStepMinutes=Number(step.value);const newTimes=cloudDisplayTimes(),target=new Date(oldTime).getTime();profile.planning.cloudMapFrame=newTimes.reduce((best,item,index)=>Math.abs(new Date(item).getTime()-target)<Math.abs(new Date(newTimes[best]).getTime()-target)?index:best,0);await saveProfile();render()};
  const slider=document.getElementById('cloudMapTime');if(slider){slider.oninput=()=>applyCloudMapFrame(slider.value,false);slider.onchange=()=>applyCloudMapFrame(slider.value,true)}
  document.getElementById('cloudMapPrev')?.addEventListener('click',()=>applyCloudMapFrame((Number(profile.planning.cloudMapFrame)||0)-1));document.getElementById('cloudMapNext')?.addEventListener('click',()=>applyCloudMapFrame((Number(profile.planning.cloudMapFrame)||0)+1));
  document.getElementById('cloudMapPlay')?.addEventListener('click',()=>{if(cloudMapAnimationTimer){stopCloudMapAnimation();return}const button=document.getElementById('cloudMapPlay');if(button)button.textContent='Pause';cloudMapAnimationTimer=setInterval(()=>{if(!cloudMapData){stopCloudMapAnimation();return}const count=cloudDisplayTimes().length,next=((Number(profile.planning.cloudMapFrame)||0)+1)%count;applyCloudMapFrame(next,false)},Number(cloudMapSettings().animationMs)||900)});
  document.getElementById('loadLocationComparison')?.addEventListener('click',fetchLocationComparison);const details=document.getElementById('cloudMapDetails');if(details)details.ontoggle=()=>{profile.central.cloudMap.collapsed=!details.open;draft=deepClone(profile);scheduleCloudMapProfileSave()};
}
function bindMeteobluePanels(){
  document.querySelectorAll('[data-meteoblue-fullscreen]').forEach(button=>button.onclick=()=>{
    const element=document.getElementById(button.dataset.meteoblueFullscreen);
    if(!element)return;
    if(document.fullscreenElement)document.exitFullscreen?.();else element.requestFullscreen?.();
  });
  const seeing=document.getElementById('meteoblueDetails');
  if(seeing)seeing.ontoggle=()=>{profile.central.meteoblueCollapsed=!seeing.open;draft=deepClone(profile);scheduleCloudMapProfileSave()};
  const map=document.getElementById('meteoblueMapDetails');
  if(map)map.ontoggle=()=>{profile.central.cloudMap.meteoblueMapCollapsed=!map.open;draft=deepClone(profile);scheduleCloudMapProfileSave()};
}

function bindPlanProfiles(){
  const wind=document.getElementById('planWindProfile'),display=document.getElementById('planDisplayProfile'),weather=document.getElementById('planWeatherView'),scope=document.getElementById('planTelescope'),camera=document.getElementById('planCamera'),horizon=document.getElementById('planHorizonProfile');
  if(wind)wind.onchange=async()=>{profile.planning.temporaryWindProfile=wind.value||null;await saveProfile();render()};
  if(display)display.onchange=async()=>{profile.planning.temporaryDisplayProfile=display.value||null;profile.planning.detailsOpen=false;page=1;await saveProfile();render()};
  if(weather)weather.onchange=async()=>{profile.planning.temporaryWeatherView=weather.value||null;await saveProfile();render()};
  if(scope)scope.onchange=async()=>{profile.planning.temporaryTelescopeId=scope.value===profile.equipment.selectedTelescopeId?null:scope.value;profile.planning.detailsOpen=false;page=1;await saveProfile();render()};
  if(camera)camera.onchange=async()=>{profile.planning.temporaryCameraId=camera.value===profile.equipment.selectedCameraId?null:camera.value;profile.planning.detailsOpen=false;page=1;await saveProfile();render()};
  if(horizon)horizon.onchange=async()=>{const loc=activeLocation();profile.planning.temporaryHorizonProfileId=horizon.value===loc.defaultHorizonProfileId?null:horizon.value;await saveProfile();render()};
}
function sendAladinOverlayUpdate(){
  const frame=document.getElementById('aladinFrame');if(!frame?.contentWindow)return;
  const object=catalog.find(item=>item.id===profile.planning.selectedObjectId),setup=fov();if(!object)return;
  const loc=activeLocation(),win=planningWindow(nightData(selectedDateKey,loc),profile.planning.planningWindow),time=new Date(win.start.getTime()+(win.end-win.start)*clamp(Number(profile.planning.timeFraction)||0,0,1)),moon=moonCoords(time),sep=angularSeparation(object.raHours,object.decDeg,moon.raHours,moon.decDeg),malt=altitude(moon.raHours,moon.decDeg,time,loc.latitude,loc.longitude),moonPhase=moonPhaseInfo(time),moonName=language==='en'?'Moon':'Mond';
  frame.contentWindow.postMessage({type:'anp-overlay',frameW:setup?.width||0,frameH:setup?.height||0,frameRot:normalizedAngle180(profile.planning.frameRotation||0),frameRa:frameCenterForObject(object).raDeg,frameDec:frameCenterForObject(object).decDeg,frameMoveMode:Boolean(profile.planning.frameMoveMode),showFrame:Boolean(profile.central.frameVisible&&setup),objectW:Math.max(.02,(Number(object.majorArcMin)||1)/60),objectH:Math.max(.02,(Number(object.minorArcMin||object.majorArcMin)||1)/60),objectRot:normalizedAngle180(profile.planning.objectRotationObjectId===object.id&&Number.isFinite(Number(profile.planning.objectRotation))?Number(profile.planning.objectRotation):(Number(object.positionAngleDeg)||0)),catalogRot:normalizedAngle180(Number(object.positionAngleDeg)||0),showObject:Boolean(profile.central.objectSizeVisible),showLabels:profile.central.aladinLabels?.visible!==false,labelDetail:profile.central.aladinLabels?.detail||'auto',targetId:object.id,targetName:object.name,targetRa:object.raHours*15,targetDec:object.decDeg,showMoon:Boolean(profile.planning.showMoonInAladin),moonRa:moon.raHours*15,moonDec:moon.decDeg,moonLabel:`${moonName} · ${fmt(sep)}° ${ui('Abstand','distance')} · ${ui('Höhe','altitude')} ${fmt(malt)}°`,moonName,moonIllumination:moonPhase.illumination,moonAge:moonPhase.age,moonWaxing:moonPhase.waxing,outlinePolygons:curatedOutlineForObject(object)?JSON.stringify(curatedOutlineForObject(object).polygons):'',outlineSource:curatedOutlineForObject(object)?.source||'',comparisonFrames:JSON.stringify((profile.planning.comparisonSetupIds||[]).map(id=>(profile.equipment.setups||[]).find(setup=>setup.id===id)).filter(Boolean).map(fovForSetup).filter(Boolean).map((item,index)=>({id:item.id,name:item.name,width:item.width,height:item.height,rotation:normalizedAngle180(profile.planning.frameRotation||0),color:['#ffcf5a','#ba7cff','#7ef29a'][index%3]})))},location.origin);
}
function nearestWeatherAt(time,range){
  const rows=weatherRowsForWindow(range,currentWeatherView());
  if(!rows.length)return null;
  return rows.reduce((best,row)=>Math.abs(new Date(row.time).getTime()-time.getTime())<Math.abs(new Date(best.time).getTime()-time.getTime())?row:best,rows[0]);
}
function twilightLabelAt(time,night){
  const t=time.getTime();
  if(night.hasAstronomicalNight&&t>=night.astronomicalDusk?.getTime()&&t<=night.astronomicalDawn?.getTime())return ui('Astronomische Nacht','Astronomical night');
  if(t>=night.nauticalDusk?.getTime()&&t<=night.nauticalDawn?.getTime())return ui('Nautische Dämmerung','Nautical twilight');
  if(t>=night.civilDusk?.getTime()&&t<=night.civilDawn?.getTime())return ui('Bürgerliche Dämmerung','Civil twilight');
  return ui('Dämmerung / Tag','Twilight / day');
}
function updateFramingTimeReadouts(fraction){
  const object=catalog.find(item=>item.id===profile.planning.selectedObjectId),loc=activeLocation();if(!object||!loc)return;
  const night=nightData(selectedDateKey,loc),range=planningWindow(night,profile.planning.planningWindow),value=clamp(Number(fraction)||0,0,1),time=new Date(range.start.getTime()+(range.end-range.start)*value),alt=altitude(object.raHours,object.decDeg,time,loc.latitude,loc.longitude),az=azimuth(object.raHours,object.decDeg,time,loc.latitude,loc.longitude),horizon=horizonAt(loc,az),clearance=alt-horizon,row=nearestWeatherAt(time,{start:night.sunset,end:night.sunrise}),moon=moonCoords(time),moonSep=angularSeparation(object.raHours,object.decDeg,moon.raHours,moon.decDeg),moonAlt=altitude(moon.raHours,moon.decDeg,time,loc.latitude,loc.longitude),moonPhase=moonPhaseInfo(time),moonName=language==='en'?'Moon':'Mond';
  const label=document.getElementById('framingTimeValue'),clock=document.getElementById('framingTimeClock'),position=document.getElementById('framingTimePosition'),weather=document.getElementById('framingTimeWeather'),moonInfo=document.getElementById('framingMoonInfo');
  if(label)label.textContent=`${fmtTime(time,loc.timezone)} · ${Math.round(value*100)} %`;
  if(clock)clock.textContent=fmtTime(time,loc.timezone);
  if(position)position.innerHTML=`<strong id="framingTimeClock">${fmtTime(time,loc.timezone)}</strong><br>${ui('Höhe','Altitude')} ${fmt(alt)}° · ${ui('Azimut','Azimuth')} ${fmt(az)}° (${cardinal(az)})<br><span class="${clearance>=0?'good-text':'bad-text'}">${clearance>=0?`${fmt(clearance)}° ${ui('über persönlichem Horizont','above personal horizon')}`:`${fmt(Math.abs(clearance))}° ${ui('unter persönlichem Horizont','below personal horizon')}`}</span>`;
  if(weather){const setup=fov(),weatherLine=row?`${ui('Wolken','Clouds')} ${fmt(row.cloud)} % · Seeing Q ${fmt(row.seeing)} · ${ui('Wind','Wind')} ${fmt(windFromKmh(row.wind),1)} ${windUnitLabel(profile.central.windUnit)}`:ui('Keine stündlichen Wetterdaten','No hourly weather data');weather.innerHTML=`${twilightLabelAt(time,night)}<br>${weatherLine}${setup?`<br>Setup ${fmt(setup.width,2)}° × ${fmt(setup.height,2)}°`:''}`}
  if(moonInfo)moonInfo.textContent=`${moonName}: ${ui('Abstand','distance')} ${fmt(moonSep)}° · ${ui('Höhe','altitude')} ${fmt(moonAlt)}° · ${ui('Beleuchtung','illumination')} ${fmt(moonPhase.illumination)} %`;
  sendAladinOverlayUpdate();
}


function downloadTextFile(name,text,type='text/plain;charset=utf-8'){
  const blob=new Blob([text],{type});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function ninaHorizonTextFromValues(values){
  const rows=['# Astro Night Planner N.I.N.A. horizon export','# Azimuth Altitude'];
  (values||[]).forEach((altitude,index)=>{if(index>72)return;rows.push(`${horizonAzForIndex(index)} ${Math.round(clamp(Number(altitude)||0,0,90)*10)/10}`)});
  return rows.join('\n')+'\n';
}
function parseNinaHorizonText(text){
  const pairs=[];
  String(text||'').split(/\r?\n/).forEach(line=>{
    const clean=line.replace(/#.*/,'').trim();
    if(!clean)return;
    const parts=clean.split(/[;,\t ]+/).map(item=>item.trim()).filter(Boolean);
    if(parts.length<2)return;
    const az=Number(String(parts[0]).replace(',','.'));
    const alt=Number(String(parts[1]).replace(',','.'));
    if(Number.isFinite(az)&&Number.isFinite(alt)&&az>=0&&az<=360&&alt>=-5&&alt<=95){pairs.push({azimuth:clamp(az,0,360),altitude:clamp(alt,0,90)});}
  });
  if(pairs.length<2)throw new Error(language==='en'?'No valid azimuth/altitude pairs found.':'Keine gültigen Azimut-/Höhen-Paare gefunden.');
  pairs.sort((a,b)=>a.azimuth-b.azimuth);
  if(pairs[0].azimuth>0)pairs.unshift({azimuth:0,altitude:pairs[0].altitude});
  if(pairs[pairs.length-1].azimuth<360)pairs.push({azimuth:360,altitude:pairs[pairs.length-1].altitude});
  const values=Array.from({length:HORIZON_POINT_COUNT},(_,index)=>{
    const az=horizonAzForIndex(index);
    let left=pairs[0],right=pairs[pairs.length-1];
    for(let i=0;i<pairs.length-1;i++){if(pairs[i].azimuth<=az&&pairs[i+1].azimuth>=az){left=pairs[i];right=pairs[i+1];break}}
    const span=Math.max(1e-6,right.azimuth-left.azimuth);
    const f=clamp((az-left.azimuth)/span,0,1);
    return left.altitude+(right.altitude-left.altitude)*f;
  });
  values[HORIZON_LAST_INDEX]=values[0];
  return values;
}
function requestNinaHorizonImport(callback){
  const input=document.createElement('input');
  input.type='file';
  input.accept='.txt,.hrz,.csv,text/plain,text/csv';
  input.style.position='fixed';input.style.left='-10000px';
  document.body.appendChild(input);
  input.addEventListener('change',async()=>{
    const file=input.files&&input.files[0];
    try{
      if(!file)return;
      const text=await file.text();
      const values=parseNinaHorizonText(text);
      callback(values,file.name||'');
    }catch(error){alert((language==='en'?'Import failed: ':'Import fehlgeschlagen: ')+(error?.message||error));}
    finally{input.remove();}
  },{once:true});
  input.click();
}
function buildNinaPlanExport(object){
  const loc=activeLocation(), setup=activeSetup(), scope=activeScope(), camera=activeCamera(), frame=fov(), night=loc?nightData(selectedDateKey,loc):null, win=night?planningWindow(night,profile.planning.planningWindow):null;
  const time=win?new Date(win.start.getTime()+(win.end-win.start)*clamp(Number(profile.planning.timeFraction)||0,0,1)):new Date();
  const moon=moonCoords(time), moonSep=angularSeparation(object.raHours,object.decDeg,moon.raHours,moon.decDeg), analysis=framingAnalysis(object,{rotation:profile.planning.frameRotation||0,optimize:false});
  return {
    kind:'astro-night-planner-nina-object-export',schemaVersion:1,appVersion:APP_VERSION,exportedAt:new Date().toISOString(),
    object:{id:object.id,name:object.name,aliases:object.aliases||[],type:object.type,constellation:object.constellation,raHours:object.raHours,raDeg:object.raHours*15,decDeg:object.decDeg,majorArcMin:object.majorArcMin,minorArcMin:object.minorArcMin,positionAngleDeg:Number(object.positionAngleDeg)||0,recommendedFilters:object.recommendedFilters||[],catalogs:object.catalogs||[]},
    framing:{centerRaHours:frameCenterForObject(object).raDeg/15,centerRaDeg:frameCenterForObject(object).raDeg,centerDecDeg:frameCenterForObject(object).decDeg,rotationDeg:normalizedAngle180(profile.planning.frameRotation||0),objectRotationDeg:normalizedAngle180(profile.planning.objectRotation||0),frameWidthDeg:frame?.width||null,frameHeightDeg:frame?.height||null,pixelScaleArcSec:frame?.pixelScale||null,status:analysis.status,minMarginPercent:Number.isFinite(analysis.minMargin)?analysis.minMargin:null},
    setup:{name:setup?.name||'',telescope:scope||null,camera:camera||null,opticalFactor:opticalFactorForSetup(setup),effectiveFocalLengthMm:effectiveFocalLength(scope,setup)},
    planning:{dateKey:selectedDateKey,location:loc?{name:loc.name,latitude:loc.latitude,longitude:loc.longitude,elevation:loc.elevation,timezone:loc.timezone}:null,windowStart:win?.start?.toISOString()||null,windowEnd:win?.end?.toISOString()||null,exportTime:time.toISOString(),moonDistanceDeg:moonSep},
    notes:'Use the framing center, rotation and FOV values in N.I.N.A. framing/sequence tools as needed.'
  };
}
function exportNinaPlanForSelectedObject(){
  const object=catalog.find(item=>item.id===profile.planning.selectedObjectId);if(!object){alert(language==='en'?'No selected object.':'Kein ausgewähltes Objekt.');return}
  downloadJson(`anp-nina-${safeName(object.id)}-${selectedDateKey}.json`,buildNinaPlanExport(object));
  alert(language==='en'?'Planning data for N.I.N.A. has been exported.':'Planungsdaten für N.I.N.A. wurden exportiert.');
}

function postAladinCenterFrameToSelectedObject({feedback=false}={}){
  const frame=document.getElementById('aladinFrame'),button=document.getElementById('centerAladinFrame'),object=catalog.find(item=>item.id===profile.planning.selectedObjectId);
  if(!frame?.contentWindow||!object)return false;
  profile.planning.frameCenterRaDeg=null;
  profile.planning.frameCenterDecDeg=null;
  profile.planning.frameCenterObjectId=object.id;
  profile.planning.frameMoveMode=false;
  saveProfile();
  if(feedback&&button){button.textContent='Rahmen wird gesetzt …';button.disabled=true}
  const payload={type:'anp-center-frame',ra:object.raHours*15,dec:object.decDeg,objectId:object.id,silent:!feedback};
  const send=()=>{try{frame.contentWindow?.postMessage(payload,location.origin)}catch{}};
  send();window.setTimeout(send,120);window.setTimeout(send,360);window.setTimeout(send,900);
  if(feedback)window.setTimeout(()=>{if(button?.disabled){button.textContent='Rahmen auf Objekt zurücksetzen';button.disabled=false}},1800);
  return true;
}

function bindFraming(){
  document.querySelectorAll('[data-aladin-control-tab]').forEach(button=>button.addEventListener('click',async()=>{
    const tab=button.dataset.aladinControlTab;
    if(!['frame','objects','sky','time'].includes(tab))return;
    profile.planning.aladinControlTab=tab;
    await saveProfile();
    document.querySelectorAll('[data-aladin-control-tab]').forEach(item=>item.classList.toggle('active',item===button));
    document.querySelectorAll('[data-aladin-tab-panel]').forEach(panel=>panel.classList.toggle('active',panel.dataset.aladinTabPanel===tab));
  }));
  const objectSelect=document.getElementById('framingObjectSelect');if(objectSelect)objectSelect.onchange=async()=>{const item=currentComputedObjects.find(entry=>entry.object.id===objectSelect.value)?.object||catalog.find(entry=>entry.id===objectSelect.value);const changed=profile.planning.selectedObjectId!==objectSelect.value;if(changed){profile.planning.frameCenterRaDeg=null;profile.planning.frameCenterDecDeg=null;profile.planning.frameCenterObjectId=null;profile.planning.frameMoveMode=false;}profile.planning.selectedObjectId=objectSelect.value;if(item){profile.planning.objectRotation=normalizedAngle180(Number(item.positionAngleDeg)||0);profile.planning.objectRotationObjectId=item.id;if(framingSettings().autoRotate)profile.planning.frameRotation=optimalFrameRotation(item)}profile.planning.detailsOpen=true;await saveProfile();render();requestAnimationFrame(()=>document.getElementById(`objectDetail-${objectSelect.value}`)?.scrollIntoView({behavior:'smooth',block:'nearest'}))};
  const changeEquipment=async(type,value)=>{if(type==='scope')profile.planning.temporaryTelescopeId=value===profile.equipment.selectedTelescopeId?null:value;else profile.planning.temporaryCameraId=value===profile.equipment.selectedCameraId?null:value;const object=catalog.find(item=>item.id===profile.planning.selectedObjectId);if(object&&framingSettings().autoRotate)profile.planning.frameRotation=optimalFrameRotation(object);await saveProfile();render()};
  const scope=document.getElementById('framingTelescopeSelect'),camera=document.getElementById('framingCameraSelect');if(scope)scope.onchange=()=>changeEquipment('scope',scope.value);if(camera)camera.onchange=()=>changeEquipment('camera',camera.value);
  const frameVisible=document.getElementById('frameVisible');if(frameVisible)frameVisible.onchange=async()=>{profile.central.frameVisible=frameVisible.checked;await saveProfile();draft=deepClone(profile);sendAladinOverlayUpdate()};
  const objectVisible=document.getElementById('objectSizeVisible');if(objectVisible)objectVisible.onchange=async()=>{profile.central.objectSizeVisible=objectVisible.checked;await saveProfile();draft=deepClone(profile);sendAladinOverlayUpdate()};
  const labelsVisible=document.getElementById('aladinLabelsVisible');if(labelsVisible)labelsVisible.onchange=async()=>{profile.central.aladinLabels.visible=labelsVisible.checked;await saveProfile();draft=deepClone(profile);sendAladinOverlayUpdate()};
  const labelDetail=document.getElementById('aladinLabelDetail');if(labelDetail)labelDetail.onchange=async()=>{profile.central.aladinLabels.detail=labelDetail.value;await saveProfile();draft=deepClone(profile);sendAladinOverlayUpdate()};
  const showMoon=document.getElementById('showMoonInAladin');if(showMoon)showMoon.onchange=async()=>{profile.planning.showMoonInAladin=showMoon.checked;await saveProfile();sendAladinOverlayUpdate()};
  const infoVisible=document.getElementById('aladinInfoVisible');if(infoVisible)infoVisible.onchange=async()=>{profile.central.aladinInfo=profile.central.aladinInfo||{};profile.central.aladinInfo.visible=infoVisible.checked;await saveProfile();draft=deepClone(profile);document.querySelector('.framing-info')?.classList.toggle('hidden',!infoVisible.checked)};
  const infoPosition=document.getElementById('aladinInfoPosition');if(infoPosition)infoPosition.onchange=async()=>{profile.central.aladinInfo=profile.central.aladinInfo||{};profile.central.aladinInfo.position=infoPosition.value;await saveProfile();render()};
  const surveySelect=document.getElementById('aladinSurveySelect');if(surveySelect)surveySelect.onchange=async()=>{profile.planning.aladinSurvey=surveySelect.value;await saveProfile();render()};
  document.getElementById('openAladinExternal')?.addEventListener('click',()=>{const frame=document.getElementById('aladinFrame');if(frame?.src)window.open(frame.src+'&external=1','_blank')});
  document.querySelectorAll('[data-compare-setup]').forEach(element=>element.onchange=async()=>{let values=Array.isArray(profile.planning.comparisonSetupIds)?profile.planning.comparisonSetupIds.slice():[];if(element.checked){if(values.length>=3){element.checked=false;alert('Maximal drei Vergleichsrahmen auswählen.');return}values=[...new Set([...values,element.dataset.compareSetup])]}else values=values.filter(id=>id!==element.dataset.compareSetup);profile.planning.comparisonSetupIds=values;await saveProfile();sendAladinOverlayUpdate();});
  const bindAngle=(id,key,labelId)=>{const element=document.getElementById(id),label=document.getElementById(labelId);if(!element)return;element.oninput=()=>{profile.planning[key]=Number(element.value);if(key==='objectRotation')profile.planning.objectRotationObjectId=profile.planning.selectedObjectId;if(label)label.textContent=`${fmt(profile.planning[key])}°`;sendAladinOverlayUpdate()};element.onchange=async()=>{profile.planning[key]=Number(element.value);if(key==='objectRotation')profile.planning.objectRotationObjectId=profile.planning.selectedObjectId;await saveProfile();sendAladinOverlayUpdate()}};
  bindAngle('frameRotation','frameRotation','frameRotationValue');bindAngle('objectRotation','objectRotation','objectRotationValue');
  const timeSlider=document.getElementById('framingTime');if(timeSlider){timeSlider.oninput=()=>{profile.planning.timeFraction=Number(timeSlider.value)/100;updateFramingTimeReadouts(profile.planning.timeFraction)};timeSlider.onchange=async()=>{profile.planning.timeFraction=Number(timeSlider.value)/100;updateFramingTimeReadouts(profile.planning.timeFraction);await saveProfile()};updateFramingTimeReadouts(profile.planning.timeFraction)}
  document.getElementById('optimalFrameRotation')?.addEventListener('click',async()=>{const object=catalog.find(item=>item.id===profile.planning.selectedObjectId);if(!object)return;profile.planning.frameRotation=optimalFrameRotation(object);const slider=document.getElementById('frameRotation'),label=document.getElementById('frameRotationValue');if(slider)slider.value=String(profile.planning.frameRotation);if(label)label.textContent=`${fmt(profile.planning.frameRotation)}°`;await saveProfile();sendAladinOverlayUpdate()});
  document.getElementById('resetObjectRotation')?.addEventListener('click',async()=>{const object=catalog.find(item=>item.id===profile.planning.selectedObjectId);if(!object)return;profile.planning.objectRotation=normalizedAngle180(Number(object.positionAngleDeg)||0);profile.planning.objectRotationObjectId=object.id;const slider=document.getElementById('objectRotation'),label=document.getElementById('objectRotationValue');if(slider)slider.value=String(profile.planning.objectRotation);if(label)label.textContent=`${fmt(profile.planning.objectRotation)}°`;await saveProfile();sendAladinOverlayUpdate()});
  document.getElementById('centerAladinFrame')?.addEventListener('click',()=>postAladinCenterFrameToSelectedObject({feedback:true}));
  document.getElementById('toggleFrameMoveMode')?.addEventListener('click',async()=>{profile.planning.frameMoveMode=!profile.planning.frameMoveMode;await saveProfile();const frame=document.getElementById('aladinFrame');frame?.contentWindow?.postMessage({type:'anp-frame-move-mode',enabled:profile.planning.frameMoveMode},location.origin);document.getElementById('toggleFrameMoveMode')?.classList.toggle('active',profile.planning.frameMoveMode)});
  document.getElementById('reloadAladinImage')?.addEventListener('click',()=>{const frame=document.getElementById('aladinFrame');if(!frame)return;try{frame.contentWindow.location.reload()}catch{const url=new URL(frame.src);url.searchParams.set('reload',String(Date.now()));frame.src=url.toString()}});
  document.getElementById('exportNinaPlan')?.addEventListener('click',exportNinaPlanForSelectedObject);
}

function nearestDetailPoint(points,time){
  if(!Array.isArray(points)||!points.length)return null;
  const t=Number(time);
  const sorted=points.slice().sort((a,b)=>Number(a[0])-Number(b[0]));
  if(!Number.isFinite(t))return sorted[0];
  if(t<=Number(sorted[0][0]))return sorted[0];
  if(t>=Number(sorted[sorted.length-1][0]))return sorted[sorted.length-1];
  for(let index=1;index<sorted.length;index++){
    const left=sorted[index-1],right=sorted[index],lt=Number(left[0]),rt=Number(right[0]);
    if(t>=lt&&t<=rt){
      const f=(t-lt)/Math.max(1,rt-lt);
      return left.map((value,i)=>i===0?t:Number(value)+(Number(right[i])-Number(value))*f);
    }
  }
  return sorted.reduce((best,point)=>Math.abs(Number(point[0])-t)<Math.abs(Number(best[0])-t)?point:best,sorted[0]);
}
function applyDetailTimeFraction(value,{persist=false}={}){
  const fraction=clamp(Number(value)||0,0,1);
  profile.planning.detailTimeFraction=fraction;
  const controllers=[...document.querySelectorAll('[data-detail-time-controller]')];
  controllers.forEach(controller=>{
    const start=Number(controller.dataset.start),end=Number(controller.dataset.end),timezone=controller.dataset.timezone;
    const time=start+(end-start)*fraction;
    const points=decodeCanvasData(controller.dataset.points);
    const nearest=points.length?nearestDetailPoint(points,time):null;
    const slider=controller.querySelector('[data-detail-time-slider]');
    const clock=controller.querySelector('[data-detail-time-clock]');
    if(slider)slider.value=String(Math.round(fraction*1000));
    if(clock)clock.value=clockInputValue(new Date(time),timezone);
    const label=controller.querySelector('[data-detail-time-label]');
    const position=controller.querySelector('[data-detail-time-position]');
    if(label)label.textContent=fmtDateTime(new Date(time),timezone);
    if(position&&nearest)position.textContent=`Höhe ${fmt(nearest[1])}° · Azimut ${fmt(nearest[2])}° (${cardinal(nearest[2])})`;
  });
  document.querySelectorAll('.large-altitude-chart,.large-horizon-chart').forEach(canvas=>{
    const controller=controllers[0];
    if(controller){
      const start=Number(controller.dataset.start),end=Number(controller.dataset.end);
      canvas.dataset.currentTime=String(start+(end-start)*fraction);
    }
  });
  drawLargeCharts();
  if(persist)saveProfile();
}
function bindDetailTimeControls(){
  document.querySelectorAll('[data-detail-time-slider]').forEach(slider=>{
    slider.addEventListener('input',()=>applyDetailTimeFraction(Number(slider.value)/1000));
    slider.addEventListener('change',()=>applyDetailTimeFraction(Number(slider.value)/1000,{persist:true}));
  });
  document.querySelectorAll('[data-detail-time-step]').forEach(button=>button.addEventListener('click',()=>{
    const controller=button.closest('[data-detail-time-controller]');
    const start=Number(controller.dataset.start),end=Number(controller.dataset.end);
    const delta=Number(button.dataset.detailTimeStep)*60000/Math.max(1,end-start);
    applyDetailTimeFraction((Number(profile.planning.detailTimeFraction)||0)+delta,{persist:true});
  }));
  document.querySelectorAll('[data-detail-time-clock]').forEach(input=>input.addEventListener('change',()=>{
    const controller=input.closest('[data-detail-time-controller]');
    const start=new Date(Number(controller.dataset.start)),end=new Date(Number(controller.dataset.end));
    applyDetailTimeFraction(nearestFractionForClock(input.value,start,end,controller.dataset.timezone),{persist:true});
  }));
  document.querySelectorAll('[data-detail-ground-toggle]').forEach(input=>input.addEventListener('change',()=>{
    profile.planning.showGroundHorizon=input.checked;
    document.querySelectorAll('[data-detail-ground-toggle]').forEach(other=>other.checked=input.checked);
    document.querySelectorAll('.large-horizon-chart').forEach(canvas=>canvas.dataset.showGround=String(input.checked));
    drawLargeCharts();
    saveProfile();
  }));
  document.querySelectorAll('.large-altitude-chart').forEach(canvas=>{
    let dragging=false;
    const update=event=>{
      const rect=canvas.getBoundingClientRect();
      const internalX=(event.clientX-rect.left)/Math.max(1,rect.width)*canvas.width;
      const marginLeft=62,plotWidth=canvas.width-62-22;
      applyDetailTimeFraction((internalX-marginLeft)/Math.max(1,plotWidth));
    };
    canvas.addEventListener('pointerdown',event=>{dragging=true;if(typeof event.pointerId==='number')canvas.setPointerCapture?.(event.pointerId);update(event)});
    canvas.addEventListener('pointermove',event=>{if(dragging)update(event)});
    canvas.addEventListener('pointerup',event=>{if(!dragging)return;dragging=false;if(typeof event.pointerId==='number')canvas.releasePointerCapture?.(event.pointerId);applyDetailTimeFraction(profile.planning.detailTimeFraction,{persist:true})});
    canvas.addEventListener('pointercancel',()=>{dragging=false});
  });
}
function bindDetails(){
  const f=document.getElementById('filterDetails');if(f)f.ontoggle=async()=>{profile.central.collapsed.filters=!f.open;await saveProfile()};
  const panelToggles=[['planningProfilesDetails','profiles'],['weatherSummaryDetails','weatherSummary'],['weatherHourlyDetails','weatherHourly']];
  for(const [id,key]of panelToggles){const element=document.getElementById(id);if(element)element.ontoggle=async()=>{profile.central.collapsed[key]=!element.open;await saveProfile();draft=deepClone(profile)}}
  const m=document.getElementById('meteoblueDetails');if(m)m.ontoggle=async()=>{profile.central.meteoblueCollapsed=!m.open;await saveProfile();draft=deepClone(profile)};
  document.querySelectorAll('.object-chart-panel').forEach(panel=>panel.addEventListener('toggle',()=>{if(panel.open)requestAnimationFrame(drawLargeCharts)}));
}
function bindDefaultClearingInputs(){
  document.querySelectorAll('input[data-default-clear="true"]').forEach(input=>{
    if(input.dataset.defaultClearBound)return; input.dataset.defaultClearBound='1';
    input.addEventListener('focus',()=>{const value=String(input.value||'').trim(); if(DEFAULT_NEW_ENTRY_NAMES.has(value)){try{input.select()}catch{}}});
    input.addEventListener('pointerdown',()=>{const value=String(input.value||'').trim(); if(DEFAULT_NEW_ENTRY_NAMES.has(value))setTimeout(()=>{try{input.select()}catch{}},0);},{passive:true});
  });
}

function bindSettings(){
  bindDefaultClearingInputs();
  document.querySelectorAll('[data-central-subtab]').forEach(b=>b.onclick=()=>{currentCentralSubTab=b.dataset.centralSubtab;render()});
  document.querySelectorAll('[data-info-subtab]').forEach(b=>b.onclick=()=>{currentInfoSubTab=b.dataset.infoSubtab;render()});
  document.querySelectorAll('[data-locations-subtab]').forEach(b=>b.onclick=()=>{currentLocationsSubTab=b.dataset.locationsSubtab;render()});
  document.querySelectorAll('[data-settings-tab]').forEach(b=>b.onclick=async()=>{if(dirtySections&&dirtySections.size&&!confirm('Es gibt ungespeicherte Änderungen. Einstellungsbereich trotzdem wechseln?'))return;currentSettingsTab=b.dataset.settingsTab;profile.ui.settingsTab=currentSettingsTab;await saveProfile();render()});
  const ps=document.getElementById('settingsProfileSelect');if(ps)ps.onchange=()=>{document.getElementById('headerProfileSelect').value=ps.value;document.getElementById('headerProfileSelect').dispatchEvent(new Event('change'))};
  document.getElementById('newProfile')?.addEventListener('click',createProfile);document.getElementById('duplicateProfile')?.addEventListener('click',duplicateProfile);document.getElementById('renameProfile')?.addEventListener('click',renameProfile);document.getElementById('deleteProfile')?.addEventListener('click',deleteProfile);
  bindEquipmentDraft();bindCentralDraft();bindLocationDraft();bindTargetSettings();bindInfoActions();
  document.querySelectorAll('[data-save-section]').forEach(b=>b.onclick=()=>saveDraftSection(b.dataset.saveSection));
  document.querySelectorAll('[data-discard-section]').forEach(button=>button.onclick=()=>{const section=button.dataset.discardSection;if(dirtySections.has(section)&&confirm('Ungespeicherte Änderungen in dieser Rubrik verwerfen?'))discardDraftSection(section)});
  document.querySelectorAll('[data-reset-section]').forEach(button=>button.onclick=()=>{const section=button.dataset.resetSection;if(['equipment','locations'].includes(section)&&!confirm('Diese Rubrik auf die mitgelieferten Standardwerte zurücksetzen? Die Änderung wird erst nach dem Speichern dauerhaft.'))return;resetDraftSection(section)});
}
function bindTargetSettings(){
  const dialog=document.getElementById('targetSearchDialog');
  const input=document.getElementById('targetSearchQuery');
  const results=document.getElementById('targetSearchResults');
  const message=document.getElementById('targetSearchMessage');
  let timer=null;
  const renderMatches=()=>{
    if(!input||!results)return;
    const matches=findCatalogMatchesByText(input.value,12);
    if(!String(input.value||'').trim()){results.innerHTML='';if(message)message.textContent='';return}
    if(!matches.length){results.innerHTML='';if(message)message.textContent='Kein passendes Objekt gefunden.';return}
    if(message)message.textContent=`${matches.length} Treffer`;
    const targets=targetObjectIds();
    results.innerHTML=matches.map(o=>`<button type="button" class="target-search-result" data-target-result="${esc(o.id)}"><strong>${esc(o.id)} · ${esc(o.name)}</strong><span>${esc(o.type)} · ${esc(o.constellation)} · Größe ${objectSizeText(o)} · Filter ${(o.recommendedFilters||[]).join(', ')||'keine Angabe'}${targets.has(o.id)?' · bereits enthalten':''}</span></button>`).join('');
    results.querySelectorAll('[data-target-result]').forEach(button=>button.onclick=async()=>{const ok=await addImagingTarget(button.dataset.targetResult,message);if(ok)render()});
  };
  document.getElementById('openTargetSearch')?.addEventListener('click',()=>{dialog?.showModal?.();setTimeout(()=>input?.focus(),50)});
  document.getElementById('targetSearchButton')?.addEventListener('click',renderMatches);
  if(input){
    input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(renderMatches,900)});
    input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();clearTimeout(timer);renderMatches()}});
  }

  const applyTargetFilter=async()=>{const f=targetFilters();f.search=document.getElementById('targetListSearch')?.value||'';f.status=document.getElementById('targetFilterStatus')?.value||'all';f.priority=document.getElementById('targetFilterPriority')?.value||'all';f.type=document.getElementById('targetFilterType')?.value||'all';f.filter=document.getElementById('targetFilterImaging')?.value||'all';f.month=document.getElementById('targetFilterMonth')?.value||'all';profile.targetFilters=f;await saveProfile();render()};
  const targetSearch=document.getElementById('targetListSearch');
  let targetFilterTimer=null;
  if(targetSearch){
    targetSearch.addEventListener('input',()=>{clearTimeout(targetFilterTimer);targetFilterTimer=setTimeout(applyTargetFilter,1500)});
    targetSearch.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();clearTimeout(targetFilterTimer);applyTargetFilter()}});
  }
  ['targetFilterStatus','targetFilterPriority','targetFilterType','targetFilterImaging','targetFilterMonth'].forEach(id=>document.getElementById(id)?.addEventListener('change',applyTargetFilter));
  document.getElementById('applyTargetFilters')?.addEventListener('click',applyTargetFilter);
  document.getElementById('resetTargetFilters')?.addEventListener('click',async()=>{profile.targetFilters=targetFilterDefaults();await saveProfile();render()});

  document.querySelectorAll('[data-target-row]').forEach(row=>{
    const target=(profile.targets||[]).find(t=>t.id===row.dataset.targetRow);
    if(!target)return;
    row.querySelectorAll('[data-target-field]').forEach(element=>{
      const markDirty=()=>{row.classList.add('is-dirty');const status=row.querySelector('[data-target-status]');if(status)status.textContent=ui('Ungespeicherte Änderungen','Unsaved changes');};
      element.oninput=markDirty;
      element.onchange=()=>{const field=element.dataset.targetField;if(field==='referenceLinksText')target.referenceLinks=String(element.value||'').split(/\n+/).map(v=>v.trim()).filter(Boolean);else target[field]=element.value;markDirty();};
    });
  });
  document.querySelectorAll('[data-save-target]').forEach(button=>button.onclick=async()=>{const row=button.closest('[data-target-row]');const target=(profile.targets||[]).find(t=>t.id===button.dataset.saveTarget);if(row&&target){row.querySelectorAll('[data-target-field]').forEach(element=>{const field=element.dataset.targetField;if(field==='referenceLinksText')target.referenceLinks=String(element.value||'').split(/\n+/).map(v=>v.trim()).filter(Boolean);else target[field]=element.value;});}await saveProfile();if(row){row.classList.remove('is-dirty');const status=row.querySelector('[data-target-status]');if(status)status.textContent=ui('Gespeichert ✓','Saved ✓');setTimeout(()=>{if(status)status.textContent='';},2200)}});
  document.querySelectorAll('[data-delete-target]').forEach(button=>button.onclick=async()=>{if(!confirm('Aufnahmeziel entfernen?'))return;profile.targets=(profile.targets||[]).filter(t=>t.id!==button.dataset.deleteTarget);await saveProfile();render()});
}

function setSectionDirty(section){
  dirtySections.add(section);
  const button=document.querySelector(`[data-save-section="${section}"]`);
  const bar=button?.closest('.save-bar');
  if(bar){
    bar.classList.add('is-dirty');bar.classList.remove('is-success');
    const state=bar.querySelector('.save-state');if(state)state.textContent=ui('Ungespeicherte Änderungen','Unsaved changes');
  }
  if(button){button.disabled=false;button.classList.remove('save-success');button.textContent=optionLabel(button.dataset.defaultLabel||'Änderungen speichern')}
  const tabGroups={equipment:['equipment'],central:['centralWind','weatherModels','cloudMap','weights','display','filterProfiles'],locations:['locations'],targets:['targets'],info:['backup']};
  for(const [tab,sections]of Object.entries(tabGroups))if(sections.includes(section))document.querySelector(`[data-settings-tab="${tab}"]`)?.classList.add('dirty-dot');
}
function markDirty(section){setSectionDirty(section)}
function syncFlightWeatherSettingsFromInputs(target=draft){return target;}
function bindEquipmentDraft(){
  const recalcAndMark=()=>{updateCalculatedEquipmentValues(draft.equipment);setSectionDirty('equipment')};
  document.querySelectorAll('[data-scope-row]').forEach(row=>row.querySelectorAll('[data-scope]').forEach(element=>element.onchange=()=>{const item=draft.equipment.telescopes.find(value=>value.id===row.dataset.scopeRow);if(!item)return;item[element.dataset.scope]=element.type==='number'?(element.value===''?null:Number(element.value)):element.value;recalcAndMark();render()}));
  document.querySelectorAll('[data-camera-row]').forEach(row=>row.querySelectorAll('[data-camera]').forEach(element=>element.onchange=()=>{const item=draft.equipment.cameras.find(value=>value.id===row.dataset.cameraRow);if(!item)return;item[element.dataset.camera]=element.type==='number'?(element.value===''?null:Number(element.value)):element.value;recalcAndMark();render()}));
  document.querySelectorAll('[data-optical-row]').forEach(row=>row.querySelectorAll('[data-optical]').forEach(element=>element.onchange=()=>{const item=(draft.equipment.opticalAccessories||[]).find(value=>value.id===row.dataset.opticalRow);if(!item)return;item[element.dataset.optical]=element.type==='number'?Number(element.value):element.value;recalcAndMark();render()}));
  document.querySelectorAll('[data-mount-row]').forEach(row=>row.querySelectorAll('[data-mount]').forEach(element=>element.onchange=()=>{const item=draft.equipment.mounts.find(value=>value.id===row.dataset.mountRow);const field=element.dataset.mount;item[field]=element.type==='number'?(element.value===''?null:Number(element.value)):element.value;setSectionDirty('equipment')}));
  document.querySelectorAll('[data-setup-row]').forEach(row=>row.querySelectorAll('[data-setup]').forEach(element=>element.onchange=()=>{const item=(draft.equipment.setups||[]).find(value=>value.id===row.dataset.setupRow);if(item){item[element.dataset.setup]=element.type==='number'?Number(element.value):element.value;if(element.dataset.setup==='opticalAccessoryId'){const acc=opticalAccessoriesFor(draft.equipment).find(x=>x.id===element.value);item.opticalFactor=Number(acc?.factor)||1;}recalcAndMark();render()}}));
  document.querySelectorAll('[data-selected-scope]').forEach(element=>element.onchange=()=>{draft.equipment.selectedTelescopeId=element.value;setSectionDirty('equipment')});
  document.querySelectorAll('[data-selected-camera]').forEach(element=>element.onchange=()=>{draft.equipment.selectedCameraId=element.value;setSectionDirty('equipment')});
  document.querySelectorAll('[data-selected-mount]').forEach(element=>element.onchange=()=>{draft.equipment.selectedMountId=element.value;setSectionDirty('equipment')});
  document.querySelectorAll('[data-selected-setup]').forEach(element=>element.onchange=()=>{draft.equipment.selectedSetupId=element.value;const setup=(draft.equipment.setups||[]).find(item=>item.id===element.value);if(setup){draft.equipment.selectedTelescopeId=setup.telescopeId;draft.equipment.selectedCameraId=setup.cameraId;draft.equipment.selectedMountId=setup.mountId||draft.equipment.selectedMountId}setSectionDirty('equipment')});
  document.getElementById('addTelescope')?.addEventListener('click',()=>{const id=uid('scope');draft.equipment.telescopes.push({id,name:'Neues Teleskop',focalLength:500,fRatio:5,aperture:100});draft.equipment.selectedTelescopeId=id;recalcAndMark();render()});
  document.getElementById('addCamera')?.addEventListener('click',()=>{const id=uid('cam');draft.equipment.cameras.push({id,name:'Neue Kamera',sensorWidth:23.5,sensorHeight:15.7,resolutionX:6248,resolutionY:4176,megapixels:26.1,pixelSize:3.76});draft.equipment.selectedCameraId=id;recalcAndMark();render()});
  document.getElementById('addOpticalAccessory')?.addEventListener('click',()=>{const id=uid('optical');draft.equipment.opticalAccessories=draft.equipment.opticalAccessories||[];draft.equipment.opticalAccessories.push({id,name:'Neue Optik',type:'reducer',factor:0.8});recalcAndMark();render()});
  document.getElementById('addMount')?.addEventListener('click',()=>{const id=uid('mount');draft.equipment.mounts.push({id,name:'Neue Montierung',type:'Parallaktisch',maxPayloadKg:null});draft.equipment.selectedMountId=id;setSectionDirty('equipment');render()});
  document.getElementById('addSetup')?.addEventListener('click',()=>{const id=uid('setup');const scope=draft.equipment.selectedTelescopeId||draft.equipment.telescopes[0]?.id||'',camera=draft.equipment.selectedCameraId||draft.equipment.cameras[0]?.id||'',mount=draft.equipment.selectedMountId||draft.equipment.mounts[0]?.id||'';draft.equipment.setups=draft.equipment.setups||[];draft.equipment.setups.push({id,name:'Neues Setup',telescopeId:scope,cameraId:camera,mountId:mount,opticalAccessoryId:OPTICAL_ACCESSORY_NONE_ID,opticalFactor:1});draft.equipment.selectedSetupId=id;recalcAndMark();render()});
  document.querySelectorAll('[data-delete-scope]').forEach(button=>button.onclick=()=>{if(draft.equipment.telescopes.length<=1)return alert('Mindestens ein Teleskop muss erhalten bleiben.');draft.equipment.telescopes=draft.equipment.telescopes.filter(item=>item.id!==button.dataset.deleteScope);draft.equipment.selectedTelescopeId=draft.equipment.telescopes[0]?.id||'';setSectionDirty('equipment');render()});
  document.querySelectorAll('[data-delete-camera]').forEach(button=>button.onclick=()=>{if(draft.equipment.cameras.length<=1)return alert('Mindestens eine Kamera muss erhalten bleiben.');draft.equipment.cameras=draft.equipment.cameras.filter(item=>item.id!==button.dataset.deleteCamera);draft.equipment.selectedCameraId=draft.equipment.cameras[0]?.id||'';setSectionDirty('equipment');render()});
  document.querySelectorAll('[data-delete-optical]').forEach(button=>button.onclick=()=>{draft.equipment.opticalAccessories=(draft.equipment.opticalAccessories||[]).filter(item=>item.id!==button.dataset.deleteOptical);(draft.equipment.setups||[]).forEach(setup=>{if(setup.opticalAccessoryId===button.dataset.deleteOptical){setup.opticalAccessoryId=OPTICAL_ACCESSORY_NONE_ID;setup.opticalFactor=1;}});setSectionDirty('equipment');render()});
  document.querySelectorAll('[data-delete-mount]').forEach(button=>button.onclick=()=>{if(draft.equipment.mounts.length<=1)return alert('Mindestens eine Montierung muss erhalten bleiben.');draft.equipment.mounts=draft.equipment.mounts.filter(item=>item.id!==button.dataset.deleteMount);draft.equipment.selectedMountId=draft.equipment.mounts[0]?.id||'';setSectionDirty('equipment');render()});
  document.querySelectorAll('[data-delete-setup]').forEach(button=>button.onclick=()=>{if((draft.equipment.setups||[]).length<=1)return alert('Mindestens eine Setup-Kombination muss erhalten bleiben.');draft.equipment.setups=draft.equipment.setups.filter(item=>item.id!==button.dataset.deleteSetup);draft.equipment.selectedSetupId=draft.equipment.setups[0]?.id||'';setSectionDirty('equipment');render()});
}
function bindCentralDraft(){
  const set=(id,handler,section,eventName='change')=>{
    const element=document.getElementById(id);
    if(element)element.addEventListener(eventName,()=>{handler(element);setSectionDirty(section)});
  };
  const unit=document.getElementById('windUnit');
  if(unit)unit.onchange=()=>{
    const from=draft.central.windUnit,to=unit.value;
    if(from!==to){
      for(const value of Object.values(draft.central.windProfiles)){
        for(const key of['windGreen','windYellow','gustGreen','gustYellow'])value[key]=Math.round(convertWindValue(Number(value[key]),from,to)*10)/10;
      }
      draft.central.jet.green=Math.round(convertWindValue(Number(draft.central.jet.green),from,to)*10)/10;
      draft.central.jet.yellow=Math.round(convertWindValue(Number(draft.central.jet.yellow),from,to)*10)/10;
      draft.central.windUnit=to;
      setSectionDirty('centralWind');
      render();
    }
  };
  set('activeWindProfile',element=>draft.central.activeWindProfile=element.value,'centralWind');
  set('dewGreen',element=>draft.central.dew.green=Number(element.value),'centralWind');
  set('dewYellow',element=>draft.central.dew.yellow=Number(element.value),'centralWind');
  set('jetGreen',element=>draft.central.jet.green=Number(element.value),'centralWind');
  set('jetYellow',element=>draft.central.jet.yellow=Number(element.value),'centralWind');
  document.querySelectorAll('[data-wind-profile]').forEach(element=>element.onchange=()=>{
    draft.central.windProfiles[element.dataset.windProfile][element.dataset.field]=Number(element.value);
    setSectionDirty('centralWind');
  });
  document.querySelectorAll('[data-weather-weight]').forEach(element=>element.onchange=()=>{
    draft.central.weatherModels.weights[element.dataset.weatherWeight]=Math.round(Number(element.value));
    setSectionDirty('weatherModels');
    render();
  });
  set('defaultWeatherView',element=>draft.central.weatherModels.defaultView=element.value,'weatherModels');
  set('cloudMapGridSize',element=>draft.central.cloudMap.gridSize=Number(element.value),'cloudMap');
  set('cloudMapRadius',element=>draft.central.cloudMap.radiusKm=Number(element.value),'cloudMap');
  set('cloudMapAnimationMs',element=>draft.central.cloudMap.animationMs=Number(element.value),'cloudMap');
  set('cloudMapTimeStepDefault',element=>draft.central.cloudMap.timeStepMinutes=Number(element.value),'cloudMap');
  set('cloudMapSmoothing',element=>draft.central.cloudMap.smoothing=element.value,'cloudMap');
  set('defaultCloudMapView',element=>draft.central.cloudMap.defaultView=element.value,'cloudMap');
  set('defaultCloudMapLayer',element=>draft.central.cloudMap.defaultLayer=element.value,'cloudMap');
  set('defaultCloudMapMode',element=>draft.central.cloudMap.defaultMode=element.value,'cloudMap');
  set('defaultCloudMapBaseMode',element=>draft.central.cloudMap.defaultBaseMode=element.value,'cloudMap');
  set('defaultCloudMapShowValues',element=>draft.central.cloudMap.showValues=element.checked,'cloudMap');
  document.querySelectorAll('[data-default-cloud-overlay]').forEach(element=>element.onchange=()=>{draft.central.cloudMap.weatherOverlays=draft.central.cloudMap.weatherOverlays||{precip:true,rain:true,snow:true};draft.central.cloudMap.weatherOverlays[element.dataset.defaultCloudOverlay]=element.checked;setSectionDirty('cloudMap')});
  set('cloudMapCollapsedDefault',element=>draft.central.cloudMap.collapsed=element.checked,'cloudMap');
  set('meteoblueMapCollapsedDefault',element=>draft.central.cloudMap.meteoblueMapCollapsed=element.checked,'cloudMap');
  document.querySelectorAll('[data-weather-source-enabled]').forEach(element=>element.onchange=()=>{draft.central.weatherSources=draft.central.weatherSources||{};draft.central.weatherSources[element.dataset.weatherSourceEnabled]=element.checked;setSectionDirty('cloudMap')});
  const multiNightExtra=document.getElementById('multiNightExtraNights');if(multiNightExtra)multiNightExtra.onchange=()=>{draft.central.multiNightWeather=draft.central.multiNightWeather||{};draft.central.multiNightWeather.extraNights=clamp(Math.round(Number(multiNightExtra.value)||3),0,7);setSectionDirty('cloudMap')};
  const auroraEnabled=document.getElementById('auroraEnabled');if(auroraEnabled)auroraEnabled.onchange=()=>{draft.central.aurora=draft.central.aurora||{};draft.central.aurora.enabled=auroraEnabled.checked;setSectionDirty('aurora')};
  const auroraAuto=document.getElementById('auroraAutoRefreshMinutes');if(auroraAuto)auroraAuto.onchange=()=>{draft.central.aurora=draft.central.aurora||{};draft.central.aurora.autoRefreshMinutes=clamp(Math.round(Number(auroraAuto.value)||0),0,720);setSectionDirty('aurora')};
  const auroraNotify=document.getElementById('auroraNotifyLevel');if(auroraNotify)auroraNotify.onchange=()=>{draft.central.aurora=draft.central.aurora||{};draft.central.aurora.notifyLevel=auroraNotify.value;setSectionDirty('aurora')};
  for(const [id,key] of [['auroraYellowKp','yellowKp'],['auroraOrangeKp','orangeKp'],['auroraRedKp','redKp']]){const el=document.getElementById(id);if(el)el.onchange=()=>{draft.central.aurora=draft.central.aurora||{};draft.central.aurora[key]=Number(el.value);setSectionDirty('aurora')}}
  document.querySelectorAll('[data-weight]').forEach(element=>element.onchange=()=>{
    draft.central.weights[element.dataset.weight]=Math.round(Number(element.value));
    setSectionDirty('weights');
    render();
  });
  set('defaultPlanningWindow',element=>draft.central.defaultPlanningWindow=element.value,'display');
  set('framingMinMargin',element=>draft.central.framing.minMarginPercent=clamp(Number(element.value)||10,0,45),'display');
  set('framingAutoRotate',element=>draft.central.framing.autoRotate=element.checked,'display');
  set('qualityYellow',element=>draft.central.qualityThresholds.yellow=Math.round(Number(element.value)),'display');
  set('qualityGreen',element=>draft.central.qualityThresholds.green=Math.round(Number(element.value)),'display');
  set('defaultMinScore',element=>draft.central.filterDefaults.minScore=Math.round(Number(element.value)||0),'filterProfiles');
  set('defaultVisibilityBasis',element=>draft.central.filterDefaults.visibilityBasis=element.value,'filterProfiles');
  set('defaultSurfaceBrightnessMax',element=>draft.central.filterDefaults.surfaceBrightnessMax=Number(element.value)||99,'filterProfiles');
  set('defaultShowNoSurfaceBrightness',element=>draft.central.filterDefaults.showNoSurfaceBrightness=element.checked,'filterProfiles');
  document.querySelectorAll('[data-size-preset]').forEach(element=>element.onchange=()=>{const preset=draft.central.sizeProfiles.find(x=>x.id===element.dataset.sizePreset);if(!preset)return;const field=element.dataset.field;preset[field]=field==='name'?element.value:field==='excludeNoSize'?element.checked:clamp(Number(element.value)||0,0,field.endsWith('Min')?59:999);if(field==='minMin'||field==='maxMin')preset[field]=clamp(Number(element.value)||0,0,59);setSectionDirty('filterProfiles')});
  document.getElementById('addSizePreset')?.addEventListener('click',()=>{draft.central.sizeProfiles.push({id:`size-${Date.now()}`,name:'Neues Größen-Preset',minDeg:0,minMin:3,maxDeg:4,maxMin:0,excludeNoSize:false});setSectionDirty('filterProfiles');render()});
  document.querySelectorAll('[data-delete-size-preset]').forEach(button=>button.onclick=()=>{if(draft.central.sizeProfiles.length<=1)return;draft.central.sizeProfiles=draft.central.sizeProfiles.filter(x=>x.id!==button.dataset.deleteSizePreset);setSectionDirty('filterProfiles');render()});
  document.querySelectorAll('[data-type-preset]').forEach(element=>element.onchange=()=>{const preset=draft.central.objectTypeProfiles.find(x=>x.id===element.dataset.typePreset);if(!preset)return;preset[element.dataset.field]=element.value;setSectionDirty('filterProfiles')});
  document.getElementById('addObjectTypePreset')?.addEventListener('click',()=>{draft.central.objectTypeProfiles.push({id:`types-${Date.now()}`,name:'Neues Objekttyp-Profil',types:[...(profile.planning.types||[])]});setSectionDirty('filterProfiles');render()});
  document.querySelectorAll('[data-delete-type-preset]').forEach(button=>button.onclick=()=>{if(draft.central.objectTypeProfiles.length<=1)return;draft.central.objectTypeProfiles=draft.central.objectTypeProfiles.filter(x=>x.id!==button.dataset.deleteTypePreset);setSectionDirty('filterProfiles');render()});
  document.querySelectorAll('[data-edit-type-preset]').forEach(button=>button.onclick=()=>{const preset=draft.central.objectTypeProfiles.find(x=>x.id===button.dataset.editTypePreset);if(!preset)return;preset.types=[...(profile.planning.types||[])];setSectionDirty('filterProfiles');render()});
  document.querySelectorAll('.display-column-config').forEach(details=>details.addEventListener('toggle',()=>{
    const key=details.dataset.displayConfig;
    if(details.open)openDisplayConfigKey=key;
    else if(openDisplayConfigKey===key)openDisplayConfigKey=null;
  }));
  set('defaultAladinLabelsVisible',element=>draft.central.aladinLabels.visible=element.checked,'display');
  set('defaultAladinLabelDetail',element=>draft.central.aladinLabels.detail=element.value,'display');
  const miniHorizonShow=document.getElementById('miniHorizonShow');if(miniHorizonShow)miniHorizonShow.onchange=()=>{draft.central.miniHorizon=draft.central.miniHorizon||{};draft.central.miniHorizon.show=miniHorizonShow.checked;setSectionDirty('display')};
  for(const [id,key] of [['externalAladinAltAzGrid','altAzGrid'],['externalAladinCompass','compass']]){const el=document.getElementById(id);if(el)el.onchange=()=>{draft.central.externalAladin=draft.central.externalAladin||{};draft.central.externalAladin[key]=el.checked;setSectionDirty('display')}}
  const groundMode=document.getElementById('externalAladinGroundMode');if(groundMode)groundMode.onchange=()=>{draft.central.externalAladin=draft.central.externalAladin||{};draft.central.externalAladin.groundMode=groundMode.value;setSectionDirty('display')};
  const groundOpacity=document.getElementById('externalAladinGroundOpacity');if(groundOpacity)groundOpacity.onchange=()=>{draft.central.externalAladin=draft.central.externalAladin||{};{const v=Number(groundOpacity.value);draft.central.externalAladin.groundOpacity=clamp(Number.isFinite(v)?v:50,0,100);}setSectionDirty('display')};
  const altAzStep=document.getElementById('externalAladinAltAzGridStep');if(altAzStep)altAzStep.onchange=()=>{draft.central.externalAladin=draft.central.externalAladin||{};draft.central.externalAladin.altAzGridStep=['auto','10','5','2','1'].includes(altAzStep.value)?altAzStep.value:'auto';setSectionDirty('display')};
  const altAzColor=document.getElementById('externalAladinAltAzGridColor');if(altAzColor){const update=()=>{draft.central.externalAladin=draft.central.externalAladin||{};draft.central.externalAladin.altAzGridColor=altAzColor.value;setSectionDirty('display')};altAzColor.oninput=update;altAzColor.onchange=update;}
  const altAzLine=document.getElementById('externalAladinAltAzGridLineWidth');if(altAzLine)altAzLine.onchange=()=>{draft.central.externalAladin=draft.central.externalAladin||{};draft.central.externalAladin.altAzGridLineWidth=clamp(Number(altAzLine.value)||0.8,0.5,3);setSectionDirty('display')};
  document.querySelectorAll('[data-aladin-survey]').forEach(element=>element.onchange=()=>{const item=(draft.central.aladinSurveys||[]).find(x=>x.id===element.dataset.aladinSurvey);if(!item)return;const field=element.dataset.field;if(field==='enabled')item.enabled=element.checked;else item[field]=String(element.value||'').trim();setSectionDirty('display')});
  document.getElementById('addAladinSurvey')?.addEventListener('click',()=>{draft.central.aladinSurveys=normalizeAladinSurveys(draft.central.aladinSurveys);draft.central.aladinSurveys.push({id:`custom-survey-${Date.now()}`,name:'Neuer Survey',hipsId:'',category:'Benutzerdefiniert',enabled:true,builtin:false});setSectionDirty('display');render()});
  document.querySelectorAll('[data-delete-aladin-survey]').forEach(button=>button.onclick=()=>{draft.central.aladinSurveys=(draft.central.aladinSurveys||[]).filter(item=>item.id!==button.dataset.deleteAladinSurvey);setSectionDirty('display');render()});
  set('activeDisplayProfile',element=>draft.central.listDisplay.activeProfile=element.value,'display');
  set('defaultFrameVisible',element=>draft.central.frameVisible=element.checked,'display');
  set('defaultObjectVisible',element=>draft.central.objectSizeVisible=element.checked,'display');
  set('defaultMeteoblueCollapsed',element=>draft.central.meteoblueCollapsed=element.checked,'display');
  set('defaultAltitudeCollapsed',element=>draft.central.detailPanels.altitudeCollapsed=element.checked,'display');
  set('defaultHorizonCollapsed',element=>draft.central.detailPanels.horizonCollapsed=element.checked,'display');
  set('defaultProfilesCollapsed',element=>draft.central.collapsed.profiles=element.checked,'display');
  set('defaultWeatherSummaryCollapsed',element=>draft.central.collapsed.weatherSummary=element.checked,'display');
  set('defaultWeatherHourlyCollapsed',element=>draft.central.collapsed.weatherHourly=element.checked,'display');
  document.querySelectorAll('[data-visible-section]').forEach(element=>element.onchange=()=>{draft.central.visibleSections=draft.central.visibleSections||{};draft.central.visibleSections[element.dataset.visibleSection]=element.checked;setSectionDirty('display')});
  document.querySelectorAll('[data-display-page-size]').forEach(element=>element.onchange=()=>{
    draft.central.listDisplay.profiles[element.dataset.displayPageSize].pageSize=Number(element.value);
    setSectionDirty('display');
  });
  document.querySelectorAll('[data-display-column-profile]').forEach(element=>element.onchange=()=>{
    const settings=draft.central.listDisplay.profiles[element.dataset.displayColumnProfile];
    if(element.dataset.column==='name'){element.checked=true;return}
    const array=settings.columns||[];
    settings.columns=element.checked?[...new Set([...array,element.dataset.column])]:array.filter(item=>item!==element.dataset.column);
    setSectionDirty('display');
  });
  const moveColumn=(profileKey,column,direction)=>{const settings=draft.central.listDisplay.profiles[profileKey],order=settings.columnOrder||[...DISPLAY_COLUMN_IDS],index=order.indexOf(column),next=index+(direction==='up'?-1:1);if(index<0||next<0||next>=order.length)return;[order[index],order[next]]=[order[next],order[index]];settings.columnOrder=order;openDisplayConfigKey=profileKey;setSectionDirty('display');render()};
  document.querySelectorAll('[data-move-column]').forEach(button=>button.onclick=()=>moveColumn(button.dataset.profileKey,button.dataset.column,button.dataset.moveColumn));
  document.querySelectorAll('[data-display-column-item]').forEach(item=>{
    item.addEventListener('dragstart',event=>{event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',JSON.stringify({profile:item.dataset.profileKey,column:item.dataset.displayColumnItem}));item.classList.add('dragging')});
    item.addEventListener('dragend',()=>item.classList.remove('dragging'));
    item.addEventListener('dragover',event=>{event.preventDefault();event.dataTransfer.dropEffect='move';item.classList.add('drag-over')});
    item.addEventListener('dragleave',()=>item.classList.remove('drag-over'));
    item.addEventListener('drop',event=>{event.preventDefault();item.classList.remove('drag-over');let data;try{data=JSON.parse(event.dataTransfer.getData('text/plain'))}catch{return}if(data.profile!==item.dataset.profileKey||data.column===item.dataset.displayColumnItem)return;const settings=draft.central.listDisplay.profiles[data.profile],order=settings.columnOrder||[...DISPLAY_COLUMN_IDS],from=order.indexOf(data.column),to=order.indexOf(item.dataset.displayColumnItem);if(from<0||to<0)return;order.splice(to,0,order.splice(from,1)[0]);settings.columnOrder=order;openDisplayConfigKey=data.profile;setSectionDirty('display');render()});
  });
}

async function searchLocationCandidates(){
  const query=(document.getElementById('locationSearchQuery')?.value||locationSearchQuery||'').trim();
  if(!query){locationSearchError='Bitte einen Ort oder eine Postleitzahl eingeben.';render();return}
  locationSearchQuery=query;locationSearchLoading=true;locationSearchError='';locationSearchResults=[];render();
  try{
    const country=(draft.central.locationSearchCountry??'DE').toLowerCase();
    const params=new URLSearchParams({format:'jsonv2',addressdetails:'1',limit:'10','accept-language':'de'});
    if(/^\d[\d\s-]*$/.test(query))params.set('postalcode',query.replace(/\s/g,''));
    else params.set('q',query);
    if(country)params.set('countrycodes',country);
    let response=await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`,{headers:{Accept:'application/json'}});
    if(!response.ok)throw new Error(`Standortsuche: HTTP ${response.status}`);
    let results=await response.json();
    if(!results.length&&country){
      params.delete('countrycodes');
      response=await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`,{headers:{Accept:'application/json'}});
      if(!response.ok)throw new Error(`Standortsuche: HTTP ${response.status}`);
      results=await response.json();
    }
    locationSearchResults=results.map(item=>{
      const address=item.address||{},city=address.city||address.town||address.village||address.municipality||address.hamlet||item.name||query,region=address.state||address.county||'',countryName=address.country||'',postcode=address.postcode||'';
      return{displayName:[city,region,countryName].filter(Boolean).join(', '),name:city,region,country:countryName,countryCode:address.country_code||'',postcode,latitude:Number(item.lat),longitude:Number(item.lon),raw:item};
    }).filter(item=>Number.isFinite(item.latitude)&&Number.isFinite(item.longitude));
    if(!locationSearchResults.length)locationSearchError='Keine passenden Orte gefunden. Bitte Suchbegriff oder Land ändern.';
  }catch(error){locationSearchError=error.message||'Standortsuche fehlgeschlagen.'}
  finally{locationSearchLoading=false;render()}
}
async function applyLocationSearchResult(index){
  const result=locationSearchResults[Number(index)];
  const hasLocations=Array.isArray(draft.locations)&&draft.locations.length>0;
  const location=(showAddLocationDialog||!hasLocations)
    ? (pendingLocationDraft||(pendingLocationDraft=createEmptyLocationDraft()))
    : (draft.locations.find(item=>item.id===draft.selectedLocationId)||draft.locations[0]);
  if(!result||!location)return;
  if(!hasLocations)showAddLocationDialog=true;
  let timezone=location.timezone,elevation=location.elevation||0;
  try{
    const url=new URL('https://api.open-meteo.com/v1/forecast');
    url.search=new URLSearchParams({latitude:String(result.latitude),longitude:String(result.longitude),timezone:'auto',forecast_days:'1'});
    const response=await fetch(url);if(response.ok){const data=await response.json();timezone=data.timezone||timezone;elevation=Number(data.elevation)||elevation}
  }catch{}
  Object.assign(location,{name:result.displayName,latitude:result.latitude,longitude:result.longitude,elevation,timezone,country:result.country,postcode:result.postcode});
  delete location.geonameId;delete location.meteobluePath;
  locationSearchResults=[];locationSearchError='';setSectionDirty('locations');render();
}

function bindLocationDraft(){
  const location=()=>draft.locations.find(item=>item.id===draft.selectedLocationId)||draft.locations[0],entry=()=>horizonProfileFor(location(),location().selectedHorizonProfileId),mark=()=>{syncCardinalHorizon(location(),entry()?.id);setSectionDirty('locations');syncSettingsHorizonCanvas()},set=(id,field,numeric=false)=>{const element=document.getElementById(id);if(element)element.onchange=()=>{location()[field]=numeric?Number(element.value):element.value;setSectionDirty('locations')}};
  const locationSelect=document.getElementById('locationSelect');if(locationSelect)locationSelect.onchange=()=>{draft.selectedLocationId=locationSelect.value;horizonUndoStack=[];render()};
  set('locName','name');set('locTimezone','timezone');set('locLat','latitude',true);set('locLon','longitude',true);set('locElevation','elevation',true);
  const defaultSelect=document.getElementById('defaultLocationSelect');if(defaultSelect)defaultSelect.onchange=()=>{draft.central.defaultLocationId=defaultSelect.value;setSectionDirty('locations')};
  const gpsBehavior=document.getElementById('gpsBehavior');if(gpsBehavior)gpsBehavior.onchange=()=>{draft.central.gpsBehavior=gpsBehavior.value;setSectionDirty('locations')};
  document.getElementById('addLocation')?.addEventListener('click',()=>{pendingLocationDraft=createEmptyLocationDraft();locationSearchQuery='';locationSearchResults=[];locationSearchError='';showAddLocationDialog=true;render()});
  document.getElementById('cancelAddLocation')?.addEventListener('click',()=>{showAddLocationDialog=false;pendingLocationDraft=null;render()});
  document.getElementById('saveNewLocation')?.addEventListener('click',async()=>{const item=pendingLocationDraft||createEmptyLocationDraft();item.name=document.getElementById('newLocName')?.value?.trim()||'Neuer Standort';item.timezone=document.getElementById('newLocTimezone')?.value||'Europe/Berlin';const latValue=document.getElementById('newLocLat')?.value,lonValue=document.getElementById('newLocLon')?.value;const lat=Number(latValue),lon=Number(lonValue);if(!Number.isFinite(lat)||!Number.isFinite(lon)){alert('Bitte Breitengrad und Längengrad eingeben oder Standortsuche/GPS verwenden.');return}item.latitude=lat;item.longitude=lon;item.elevation=Number(document.getElementById('newLocElevation')?.value)||0;draft.locations=Array.isArray(draft.locations)?draft.locations:[];draft.locations.push(item);draft.selectedLocationId=item.id;draft.central.defaultLocationId=item.id;showAddLocationDialog=false;pendingLocationDraft=null;locationSearchResults=[];locationSearchQuery='';horizonUndoStack=[];setSectionDirty('locations');await saveDraftSection('locations');profile.planning.locationId=item.id;await saveProfile();draft=deepClone(profile);render()});
  document.getElementById('saveLocationChanges')?.addEventListener('click',()=>saveDraftSection('locations'));
  document.getElementById('deleteLocation')?.addEventListener('click',()=>{draft.locations=draft.locations.filter(item=>item.id!==location().id);draft.selectedLocationId=draft.locations[0]?.id||null;if(!draft.locations.some(item=>item.id===draft.central.defaultLocationId))draft.central.defaultLocationId=draft.locations[0]?.id||null;horizonUndoStack=[];setSectionDirty('locations');render()});
  document.getElementById('useGpsNewLocation')?.addEventListener('click',()=>navigator.geolocation?.getCurrentPosition(position=>{const item=pendingLocationDraft||(pendingLocationDraft=createEmptyLocationDraft());item.latitude=position.coords.latitude;item.longitude=position.coords.longitude;item.elevation=position.coords.altitude||item.elevation||0;locationSearchResults=[];locationSearchError='';setSectionDirty('locations');render()},error=>alert(`GPS nicht verfügbar: ${error.message}`)));
  const searchQuery=document.getElementById('locationSearchQuery');if(searchQuery){searchQuery.oninput=()=>{locationSearchQuery=searchQuery.value};searchQuery.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();searchLocationCandidates()}}}
  const searchCountry=document.getElementById('locationSearchCountry');if(searchCountry)searchCountry.onchange=()=>{draft.central.locationSearchCountry=searchCountry.value;setSectionDirty('locations')};
  document.getElementById('searchLocation')?.addEventListener('click',searchLocationCandidates);
  document.querySelectorAll('[data-location-result]').forEach(button=>button.onclick=()=>applyLocationSearchResult(button.dataset.locationResult));
  ['newLocName','newLocTimezone','newLocLat','newLocLon','newLocElevation'].forEach(id=>{const el=document.getElementById(id);if(el)el.onchange=()=>{if(!pendingLocationDraft)return;const field={newLocName:'name',newLocTimezone:'timezone',newLocLat:'latitude',newLocLon:'longitude',newLocElevation:'elevation'}[id];pendingLocationDraft[field]=el.type==='number'?Number(el.value):el.value;};});
  const profileSelect=document.getElementById('horizonProfileSelect');if(profileSelect)profileSelect.onchange=()=>{location().selectedHorizonProfileId=profileSelect.value;horizonUndoStack=[];render()};
  const defaultProfile=document.getElementById('defaultHorizonProfileSelect');if(defaultProfile)defaultProfile.onchange=()=>{location().defaultHorizonProfileId=defaultProfile.value;setSectionDirty('locations')};
  document.getElementById('addHorizonProfile')?.addEventListener('click',()=>{const name=prompt('Name des neuen Horizontprofils:','Neues Horizontprofil');if(!name)return;const id=uid('horizon');horizonProfilesFor(location()).push({id,name:name.trim(),horizonProfile:emptyHorizonProfile(),obstacles:[]});location().selectedHorizonProfileId=id;setSectionDirty('locations');render()});
  document.getElementById('duplicateHorizonProfile')?.addEventListener('click',()=>{const current=entry(),name=prompt('Name der Kopie:',`${current.name} – Kopie`);if(!name)return;const copy=deepClone(current);copy.id=uid('horizon');copy.name=name.trim();horizonProfilesFor(location()).push(copy);location().selectedHorizonProfileId=copy.id;setSectionDirty('locations');render()});
  document.getElementById('renameHorizonProfile')?.addEventListener('click',()=>{const current=entry(),name=prompt('Neuer Name:',current.name);if(!name)return;current.name=name.trim();setSectionDirty('locations');render()});
  document.getElementById('deleteHorizonProfile')?.addEventListener('click',()=>{const profiles=horizonProfilesFor(location()),current=entry();if(profiles.length<=1||!confirm(`Horizontprofil „${current.name}“ löschen?`))return;location().horizonProfiles=profiles.filter(item=>item.id!==current.id);if(location().defaultHorizonProfileId===current.id)location().defaultHorizonProfileId=location().horizonProfiles[0].id;location().selectedHorizonProfileId=location().defaultHorizonProfileId;setSectionDirty('locations');render()});
  document.getElementById('resetHorizon')?.addEventListener('click',()=>{horizonUndoStack.push(ensureHorizonProfile(location(),entry()?.id).slice());horizonUndoStack=horizonUndoStack.slice(-20);entry().horizonProfile=emptyHorizonProfile();mark();render()});
  document.getElementById('undoHorizon')?.addEventListener('click',()=>{const previous=horizonUndoStack.pop();if(!previous)return;entry().horizonProfile=previous.slice();mark();render()});
  document.getElementById('importNinaHorizon')?.addEventListener('click',()=>requestNinaHorizonImport((values,name)=>{horizonUndoStack.push(ensureHorizonProfile(location(),entry()?.id).slice());entry().horizonProfile=values;entry().updatedAt=new Date().toISOString();mark();alert((language==='en'?'Horizon has been imported.':'Horizont wurde importiert.')+(name?` (${name})`:''));render()}));
  document.getElementById('exportNinaHorizon')?.addEventListener('click',()=>{const locNow=location(),profileNow=entry();const values=ensureHorizonProfile(locNow,profileNow?.id);downloadTextFile(`nina-horizon-${safeName(locNow.name)}-${safeName(profileNow?.name||'horizon')}.hrz`,ninaHorizonTextFromValues(values));alert(language==='en'?'Horizon has been exported.':'Horizont wurde exportiert.');});
  const canvas=document.querySelector('.settings-horizon-chart[data-editable="true"]');
  if(canvas){
    const wrap=canvas.closest('.horizon-editor-wrap');
    let drawing=false,obstacleDrawing=false,lastIndex=null,lastAltitude=null,tooltip=document.querySelector('.horizon-editor-tooltip');
    if(!tooltip){tooltip=document.createElement('div');tooltip.className='horizon-editor-tooltip';wrap?.appendChild(tooltip)}
    let inputLayer=wrap?.querySelector('.horizon-input-layer');
    if(wrap&&!inputLayer){inputLayer=document.createElement('div');inputLayer.className='horizon-input-layer';inputLayer.setAttribute('aria-label',language==='en'?'Draw horizon':'Horizont zeichnen');canvas.insertAdjacentElement('afterend',inputLayer)}
    const currentValues=()=>ensureHorizonProfile(location(),entry()?.id);
    const positionInputLayer=()=>{
      if(!wrap||!inputLayer)return;
      inputLayer.style.left=`${canvas.offsetLeft}px`;
      inputLayer.style.top=`${canvas.offsetTop}px`;
      inputLayer.style.width=`${canvas.offsetWidth}px`;
      inputLayer.style.height=`${canvas.offsetHeight}px`;
    };
    const refreshCanvas=()=>{
      const values=currentValues();
      values[HORIZON_LAST_INDEX]=values[0];
      canvas.dataset.horizon=encodeURIComponent(JSON.stringify(values.map((altitude,index)=>[horizonAzForIndex(index),Number(altitude)||0])));
      canvas.dataset.obstacles=encodeURIComponent(JSON.stringify((entry()?.obstacles||[]).map(item=>item.type==='free'?{type:'free',name:item.name||'Freies Hindernis',points:item.points||[],closed:Boolean(item.closed)}:{name:item.name||'Hindernis',azimuth:Number(item.azimuth)||0,altitude:Number(item.altitude)||0})));
      drawHorizonChart(canvas,false);
      positionInputLayer();
    };
    const pointFromClient=(clientX,clientY)=>{
      const rect=canvas.getBoundingClientRect();
      const px=clamp(clientX-rect.left,0,rect.width),py=clamp(clientY-rect.top,0,rect.height);
      const margin={left:62,right:22,top:22,bottom:68};
      const cssScaleX=rect.width/Math.max(1,canvas.width),cssScaleY=rect.height/Math.max(1,canvas.height);
      const left=margin.left*cssScaleX,top=margin.top*cssScaleY;
      const plotW=(canvas.width-margin.left-margin.right)*cssScaleX,plotH=(canvas.height-margin.top-margin.bottom)*cssScaleY;
      const azimuth=clamp((px-left)/Math.max(1,plotW)*360,0,360);
      const altitude=clamp(90-(py-top)/Math.max(1,plotH)*90,0,90);
      return{index:horizonIndexForAz(azimuth),azimuth,altitude,clientX,clientY};
    };
    const eventPoint=event=>{const source=event.touches?.[0]||event.changedTouches?.[0]||event;return pointFromClient(source.clientX,source.clientY)};
    const showTooltip=point=>{if(!tooltip)return;const rect=wrap?.getBoundingClientRect();tooltip.textContent=horizonTooltipText(point);tooltip.style.display='block';tooltip.style.left=`${Math.max(8,point.clientX-(rect?.left||0)+(wrap?.scrollLeft||0)+14)}px`;tooltip.style.top=`${Math.max(8,point.clientY-(rect?.top||0)+(wrap?.scrollTop||0)-34)}px`;};
    const hideTooltip=()=>{if(tooltip&&!drawing)tooltip.style.display='none'};
    const applyPoint=point=>{
      const values=currentValues();
      const altitude=clamp(Number(point.altitude)||0,0,90);
      if(lastIndex===null){values[point.index]=altitude;}else{
        const from=Math.min(lastIndex,point.index),to=Math.max(lastIndex,point.index),span=Math.max(1,to-from);
        for(let index=from;index<=to;index++){
          const fraction=(index-from)/span;
          const start=lastIndex<=point.index?lastAltitude:altitude;
          const end=lastIndex<=point.index?altitude:lastAltitude;
          values[index]=start+(end-start)*fraction;
        }
      }
      if(point.index===0||point.index===HORIZON_LAST_INDEX){values[0]=altitude;values[HORIZON_LAST_INDEX]=altitude}
      lastIndex=point.index;lastAltitude=altitude;
      syncCardinalHorizon(location(),entry()?.id);
      setSectionDirty('locations');
      const undo=document.getElementById('undoHorizon');if(undo)undo.disabled=false;
      refreshCanvas();
    };
    const begin=event=>{if(event.type==='mousedown'&&event.button!==0)return;if(event.type==='pointerdown'&&event.button!==undefined&&event.button!==0)return;event.preventDefault?.();event.stopPropagation?.();const point=eventPoint(event);if(horizonObstacleDrawId){const obstacle=entry().obstacles.find(item=>item.id===horizonObstacleDrawId);if(obstacle){obstacle.points=Array.isArray(obstacle.points)?obstacle.points:[];if(!obstacle.points.length)horizonUndoStack.push(currentValues().slice());obstacleDrawing=true;const next=[Math.round(point.azimuth*10)/10,Math.round(point.altitude*10)/10];obstacle.points.push(next);showTooltip(point);setSectionDirty('locations');refreshCanvas();}return}if(!drawing){horizonUndoStack.push(currentValues().slice());horizonUndoStack=horizonUndoStack.slice(-20);}drawing=true;lastIndex=null;lastAltitude=null;showTooltip(point);applyPoint(point);};
    const hover=event=>{if(drawing)return;const point=eventPoint(event);showTooltip(point);};
    const move=event=>{if(obstacleDrawing&&horizonObstacleDrawId){event.preventDefault?.();event.stopPropagation?.();const point=eventPoint(event);const obstacle=entry().obstacles.find(item=>item.id===horizonObstacleDrawId);if(obstacle){obstacle.points=Array.isArray(obstacle.points)?obstacle.points:[];const last=obstacle.points[obstacle.points.length-1];const az=Math.round(point.azimuth*10)/10,alt=Math.round(point.altitude*10)/10;if(!last||Math.hypot(az-Number(last[0]),alt-Number(last[1]))>.8){obstacle.points.push([az,alt]);setSectionDirty('locations');refreshCanvas();}showTooltip(point);}return}if(!drawing)return;event.preventDefault?.();event.stopPropagation?.();const point=eventPoint(event);showTooltip(point);applyPoint(point);};
    const endDrawing=event=>{if(obstacleDrawing){event?.preventDefault?.();event?.stopPropagation?.();obstacleDrawing=false;hideTooltip();refreshCanvas();return}if(!drawing)return;event?.preventDefault?.();event?.stopPropagation?.();drawing=false;lastIndex=null;lastAltitude=null;hideTooltip();refreshCanvas();};
    const bindTarget=inputLayer||canvas;
    canvas.style.touchAction='none';canvas.style.cursor='crosshair';
    if(inputLayer){inputLayer.style.touchAction='none';inputLayer.style.cursor='crosshair';inputLayer.tabIndex=0}
    if(window.PointerEvent){
      bindTarget.addEventListener('pointerdown',begin,{passive:false});
      bindTarget.addEventListener('pointermove',hover,{passive:false});
      window.addEventListener('pointermove',move,{passive:false});
      window.addEventListener('pointerup',endDrawing,{passive:false});
      window.addEventListener('pointercancel',endDrawing,{passive:false});
    }else{
      bindTarget.addEventListener('mousedown',begin,{passive:false});
      bindTarget.addEventListener('mousemove',hover,{passive:false});
      window.addEventListener('mousemove',move,{passive:false});
      window.addEventListener('mouseup',endDrawing,{passive:false});
      bindTarget.addEventListener('touchstart',begin,{passive:false});
      bindTarget.addEventListener('touchmove',hover,{passive:false});
      window.addEventListener('touchmove',move,{passive:false});
      window.addEventListener('touchend',endDrawing,{passive:false});
      window.addEventListener('touchcancel',endDrawing,{passive:false});
    }
    bindTarget.addEventListener('mouseleave',()=>{if(!drawing)hideTooltip()});
    window.addEventListener('resize',positionInputLayer,{passive:true});
    wrap?.addEventListener('scroll',positionInputLayer,{passive:true});
    refreshCanvas();
  }
  document.getElementById('addObstacle')?.addEventListener('click',()=>{entry().obstacles.push({id:uid('obs'),name:'Baum/Gebäude',azimuth:180,altitude:20});horizonObstacleDrawId=null;setSectionDirty('locations');render()});
  document.getElementById('addFreeObstacle')?.addEventListener('click',()=>{if(horizonObstacleDrawId){const obs=entry().obstacles.find(item=>item.id===horizonObstacleDrawId);if(obs&&Array.isArray(obs.points)&&obs.points.length>=3)obs.closed=true;horizonObstacleDrawId=null;setSectionDirty('locations');render();return}const id=uid('obs');entry().obstacles.push({id,type:'free',name:'Freies Hindernis',points:[]});horizonObstacleDrawId=id;setSectionDirty('locations');render()});
  document.querySelectorAll('[data-obstacle]').forEach(row=>row.querySelectorAll('[data-obstacle-field]').forEach(element=>{const update=()=>{const obstacle=entry().obstacles.find(item=>item.id===row.dataset.obstacle);if(!obstacle)return;obstacle[element.dataset.obstacleField]=element.type==='number'?Number(element.value):element.value;setSectionDirty('locations');syncSettingsHorizonCanvas()};element.oninput=update;element.onchange=update}));
  document.querySelectorAll('[data-delete-obstacle]').forEach(button=>button.onclick=()=>{entry().obstacles=entry().obstacles.filter(item=>item.id!==button.dataset.deleteObstacle);if(horizonObstacleDrawId===button.dataset.deleteObstacle)horizonObstacleDrawId=null;setSectionDirty('locations');render()});
}
async function saveDraftSection(section){
  let profileChanged=true;
  if(section==='equipment'){
    updateCalculatedEquipmentValues(draft.equipment);
    profile.equipment=deepClone(draft.equipment);
    if(profile.planning.temporarySetupId&&!profile.equipment.setups.some(item=>item.id===profile.planning.temporarySetupId))profile.planning.temporarySetupId=null;
    if(profile.planning.temporaryTelescopeId&&!profile.equipment.telescopes.some(item=>item.id===profile.planning.temporaryTelescopeId))profile.planning.temporaryTelescopeId=null;
    if(profile.planning.temporaryCameraId&&!profile.equipment.cameras.some(item=>item.id===profile.planning.temporaryCameraId))profile.planning.temporaryCameraId=null;
    dirtySections.delete('equipment');
  }
  if(section==='centralWind'){
    profile.central.windUnit=draft.central.windUnit;profile.central.activeWindProfile=draft.central.activeWindProfile;profile.central.windProfiles=deepClone(draft.central.windProfiles);profile.central.dew=deepClone(draft.central.dew);profile.central.jet=deepClone(draft.central.jet);dirtySections.delete('centralWind');
  }
  if(section==='weatherModels'){
    const total=Object.values(draft.central.weatherModels.weights).reduce((sum,value)=>sum+Number(value),0);
    if(total!==100){alert('Die Gewichtung der Wettermodelle muss exakt 100 % ergeben.');return}
    profile.central.weatherModels=deepClone(draft.central.weatherModels);
    profile.planning.temporaryWeatherView=null;profile.planning.temporaryCloudMapView=null;dirtySections.delete('weatherModels');
  }
  if(section==='cloudMap'){
    profile.central.cloudMap={...deepClone(draft.central.cloudMap)};
    profile.central.weatherSources=deepClone(draft.central.weatherSources||{meteoblue:true,clearoutside:true,windy:true,ventusky:true});
    profile.central.multiNightWeather=deepClone(draft.central.multiNightWeather||{extraNights:3});
    profile.planning.temporaryCloudMapView=null;profile.planning.temporaryCloudMapBaseMode=null;profile.planning.temporaryCloudSmoothing=null;profile.planning.temporaryCloudMapShowValues=null;profile.planning.cloudMapWeatherOverlays=deepClone(profile.central.cloudMap.weatherOverlays||{precip:true,rain:true,snow:true});profile.planning.cloudMapLayer=profile.central.cloudMap.defaultLayer;profile.planning.cloudMapMode=profile.central.cloudMap.defaultMode;profile.planning.cloudMapFrame=0;profile.planning.cloudMapTimeStepMinutes=null;cloudMapData=null;dirtySections.delete('cloudMap');
  }
  if(section==='aurora'){
    const a=draft.central.aurora||standardProfile().central.aurora;
    a.autoRefreshMinutes=clamp(Math.round(Number(a.autoRefreshMinutes)||0),0,720);
    a.yellowKp=Number(a.yellowKp)||5.7;a.orangeKp=Number(a.orangeKp)||6.7;a.redKp=Number(a.redKp)||7.3;
    if(!(a.yellowKp<a.orangeKp&&a.orangeKp<a.redKp)){alert(language==='en'?'Please enter valid aurora thresholds: Yellow < Orange < Red.':'Bitte gültige Polarlicht-Schwellen eingeben: Gelb < Orange < Rot.');return}
    profile.central.aurora=deepClone(a);setupAuroraAutoRefresh();dirtySections.delete('aurora');
  }
  if(section==='weights'){
    const total=Object.values(draft.central.weights).reduce((sum,value)=>sum+Number(value),0);
    if(total!==100){alert('Die Gewichtung muss exakt 100 % ergeben.');return}
    profile.central.weights=deepClone(draft.central.weights);dirtySections.delete('weights');
  }
  if(section==='display'){
    const yellow=Math.round(Number(draft.central.qualityThresholds?.yellow)),green=Math.round(Number(draft.central.qualityThresholds?.green));
    if(!Number.isFinite(yellow)||!Number.isFinite(green)||yellow<1||green>100||yellow>=green){alert('Bitte gültige Qualitätsgrenzen eingeben: „Gelb ab“ muss kleiner als „Grün ab“ sein.');return}
    draft.central.qualityThresholds={yellow,green};
    draft.central.externalAladin=draft.central.externalAladin||standardProfile().central.externalAladin;draft.central.externalAladin.groundMode=['none','standard','personal'].includes(draft.central.externalAladin.groundMode)?draft.central.externalAladin.groundMode:'standard';draft.central.externalAladin.groundOpacity=clamp(Number(draft.central.externalAladin.groundOpacity??50),0,100);draft.central.externalAladin.altAzGridLineWidth=clamp(Number(draft.central.externalAladin.altAzGridLineWidth??0.8),0.5,3);draft.central.externalAladin.altAzGridStep=['auto','10','5','2','1'].includes(String(draft.central.externalAladin.altAzGridStep||'auto'))?String(draft.central.externalAladin.altAzGridStep||'auto'):'auto';if(!/^#[0-9a-fA-F]{6}$/.test(String(draft.central.externalAladin.altAzGridColor||'')))draft.central.externalAladin.altAzGridColor='#1f6f52';profile.central.defaultPlanningWindow=draft.central.defaultPlanningWindow;profile.planning.planningWindow=draft.central.defaultPlanningWindow;profile.central.framing=deepClone(draft.central.framing);profile.central.qualityThresholds=deepClone(draft.central.qualityThresholds);profile.central.aladinLabels=deepClone(draft.central.aladinLabels);profile.central.aladinSurveys=deepClone(draft.central.aladinSurveys);profile.central.externalAladin=deepClone(draft.central.externalAladin||standardProfile().central.externalAladin);profile.central.miniHorizon=deepClone(draft.central.miniHorizon||standardProfile().central.miniHorizon);profile.central.listDisplay=deepClone(draft.central.listDisplay);profile.central.frameVisible=draft.central.frameVisible;profile.central.objectSizeVisible=draft.central.objectSizeVisible;profile.central.meteoblueCollapsed=draft.central.meteoblueCollapsed;profile.central.detailPanels=deepClone(draft.central.detailPanels);profile.central.collapsed=deepClone(draft.central.collapsed);profile.central.visibleSections=deepClone(draft.central.visibleSections||{});profile.planning.detailsOpen=false;page=1;dirtySections.delete('display');
  }
  if(section==='locations'){
    draft.locations.forEach(item=>{horizonProfilesFor(item).forEach(entry=>{ensureHorizonProfile(item,entry.id);entry.horizonProfile[HORIZON_LAST_INDEX]=entry.horizonProfile[0]});syncCardinalHorizon(item,item.selectedHorizonProfileId)});
    profile.locations=deepClone(draft.locations);profile.selectedLocationId=draft.selectedLocationId;profile.central.defaultLocationId=draft.central.defaultLocationId;profile.central.gpsBehavior=draft.central.gpsBehavior;profile.central.locationSearchCountry=draft.central.locationSearchCountry;if(profile.planning.locationId&&!profile.locations.some(item=>item.id===profile.planning.locationId))profile.planning.locationId=null;const active=activeLocation();if(profile.planning.temporaryHorizonProfileId&&!horizonProfilesFor(active).some(item=>item.id===profile.planning.temporaryHorizonProfileId))profile.planning.temporaryHorizonProfileId=null;dirtySections.delete('locations');horizonUndoStack=[];horizonObstacleDrawId=null;
  }
  if(section==='backup'){
    profileChanged=false;
    if(backupDraft.enabled&&storageInfo.fileSystemSupported&&!await getBackupDirectoryHandle()){
      alert('Bitte zuerst einen Sicherungsordner auswählen oder die automatische Sicherung deaktivieren.');
      return;
    }
    backupConfig={...backupConfig,...deepClone(backupDraft),keep:clamp(Number(backupDraft.keep)||10,1,50),reminderDays:clamp(Number(backupDraft.reminderDays)||7,1,90)};
    await saveBackupConfig();dirtySections.delete('backup');
  }
  if(profileChanged)await saveProfile();
  draft=deepClone(profile);backupDraft=deepClone(backupConfig);
  saveFeedbackSections.add(section);render();
  window.setTimeout(()=>{saveFeedbackSections.delete(section);if(currentMainTab==='settings')render()},3000);
  if(section==='locations'||section==='weatherModels')fetchWeather();
  else if(section==='cloudMap')fetchCloudMap(true);
  await maybeAutomaticBackup('settings');
}

async function createProfile(){const name=prompt('Name des neuen Profils:','Neues Profil');if(!name)return;const p=standardProfile();p.id=uid('profile');p.name=name.trim();await idbPut('profiles',p);profiles=await idbAll('profiles');profile=p;draft=deepClone(p);await setActiveProfile(p.id);updateProfileSelectors();render()}
async function duplicateProfile(){const name=prompt('Name der Kopie:',`${profile.name} – Kopie`);if(!name)return;const p=deepClone(profile);p.id=uid('profile');p.name=name.trim();p.createdAt=new Date().toISOString();await idbPut('profiles',p);profiles=await idbAll('profiles');profile=p;draft=deepClone(p);await setActiveProfile(p.id);updateProfileSelectors();render()}
async function renameProfile(){const name=prompt('Neuer Profilname:',profile.name);if(!name)return;profile.name=name.trim();draft.name=profile.name;await saveProfile();render()}
async function deleteProfile(){if(profiles.length===1||!confirm(`Profil „${profile.name}“ wirklich löschen?`))return;await idbDelete('profiles',profile.id);profiles=await idbAll('profiles');profile=normalizeProfile(profiles[0]);draft=deepClone(profile);await setActiveProfile(profile.id);updateProfileSelectors();render()}
function bindInfoActions(){
  document.getElementById('exportProfile')?.addEventListener('click',()=>downloadJson(`astro-night-planner-profil-${safeName(profile.name)}.json`,{kind:'astro-night-planner-profile',appVersion:APP_VERSION,exportedAt:new Date().toISOString(),profile}));
  document.getElementById('exportAll')?.addEventListener('click',async()=>{downloadJson(`astro-night-planner-sicherung-${new Date().toISOString().slice(0,10)}.json`,await buildBackupPayload());backupConfig.lastSuccessAt=new Date().toISOString();backupConfig.lastError='';await saveBackupConfig();backupDraft=deepClone(backupConfig);render()});
  document.getElementById('importProfile')?.addEventListener('click',()=>{importMode='profile';importInput.accept='application/json,.json';importInput.click()});
  document.getElementById('restoreBackup')?.addEventListener('click',()=>{importMode='backup';importInput.accept='application/json,.json';importInput.click()});
  document.getElementById('refreshStorageStatus')?.addEventListener('click',async()=>{await refreshStorageInfo();render()});
  document.getElementById('requestPersistence')?.addEventListener('click',async()=>{
    const message=document.getElementById('storageMessage');
    if(!navigator.storage?.persist){if(message)message.textContent='Dieser Browser unterstützt die Anforderung persistenten Speichers nicht.';return}
    try{
      const granted=await navigator.storage.persist();
      profile.central.persistentStorageRequested=granted;
      await saveProfile();
      await refreshStorageInfo();
      if(message)message.textContent=granted?'Speicherschutz aktiv: Der Browser soll diese Daten nicht automatisch wegen Speichermangels entfernen. Manuelles Löschen der Websitedaten bleibt weiterhin möglich.':'Der Browser hat den Speicherschutz nicht gewährt. Regelmäßige externe Sicherungen bleiben besonders wichtig.';
      window.setTimeout(render,1200);
    }catch(error){if(message)message.textContent=`Speicherschutz konnte nicht angefordert werden: ${error.message}`}
  });
  const bindBackupDraft=(id,key,type='checked')=>{
    const element=document.getElementById(id);
    if(!element)return;
    element.addEventListener('change',()=>{
      backupDraft[key]=type==='number'?Number(element.value):element.checked;
      setSectionDirty('backup');
      render();
    });
  };
  bindBackupDraft('backupEnabled','enabled');
  bindBackupDraft('backupAfterSave','afterSave');
  bindBackupDraft('backupDaily','daily');
  bindBackupDraft('backupKeep','keep','number');
  bindBackupDraft('backupReminderDays','reminderDays','number');
  document.getElementById('chooseBackupDirectory')?.addEventListener('click',async()=>{
    if(typeof window.showDirectoryPicker!=='function'){alert('Dieser Browser unterstützt keine automatische Ordnersicherung. Verwende stattdessen „Gesamtsicherung exportieren“.');return}
    try{
      const handle=await window.showDirectoryPicker({id:'astro-night-planner-backup',mode:'readwrite',startIn:'documents'});
      await setMetaValue('backupDirectoryHandle',handle);
      backupConfig.targetName=handle.name||'Gewählter Ordner';
      backupConfig.permission=await fileHandlePermission(handle,true);
      backupDraft=deepClone(backupConfig);
      await saveBackupConfig();
      await refreshStorageInfo();
      render();
    }catch(error){if(error?.name!=='AbortError')alert(`Sicherungsordner konnte nicht gewählt werden: ${error.message}`)}
  });
  document.getElementById('backupNow')?.addEventListener('click',async()=>{
    const button=document.getElementById('backupNow');
    if(button){button.disabled=true;button.textContent='Sicherung läuft …'}
    try{
      if(storageInfo.fileSystemSupported&&await getBackupDirectoryHandle()){
        const ok=await performExternalBackup({forceDated:true,requestPermission:true});
        if(!ok)throw new Error(backupConfig.lastError||'Externe Sicherung nicht möglich.');
        await refreshStorageInfo();
        saveFeedbackSections.add('backup');
        render();
        window.setTimeout(()=>{saveFeedbackSections.delete('backup');if(currentMainTab==='settings')render()},3000);
      }else{
        downloadJson(`astro-night-planner-sicherung-${new Date().toISOString().slice(0,10)}.json`,await buildBackupPayload());
        backupConfig.lastSuccessAt=new Date().toISOString();backupConfig.lastError='';
        await saveBackupConfig();backupDraft=deepClone(backupConfig);render();
      }
    }catch(error){alert(`Sicherung fehlgeschlagen: ${error.message}`);render()}
  });
}
function downloadJson(name,data){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function safeName(s){return s.toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'-').replace(/^-|-$/g,'')}
async function handleImportFile(){
  const file=importInput.files?.[0];if(!file)return;
  try{
    const data=JSON.parse(await file.text()),isBackup=data.kind==='astro-night-planner-backup'&&Array.isArray(data.profiles);
    if(importMode==='profile'&&isBackup)throw new Error('Diese Datei ist eine Gesamtsicherung. Bitte „Gesamtsicherung wiederherstellen“ verwenden.');
    if(importMode==='backup'&&!isBackup)throw new Error('Diese Datei enthält nur ein Profil. Bitte „Profil importieren“ verwenden.');
    if(isBackup){
      const counts=data.profiles.reduce((acc,item)=>{acc.telescopes+=(item.equipment?.telescopes||[]).length;acc.cameras+=(item.equipment?.cameras||[]).length;acc.mounts+=(item.equipment?.mounts||[]).length;acc.locations+=(item.locations||[]).length;return acc},{telescopes:0,cameras:0,mounts:0,locations:0}),date=data.exportedAt?new Intl.DateTimeFormat('de-DE',{dateStyle:'medium',timeStyle:'short'}).format(new Date(data.exportedAt)):'unbekannt';
      if(!confirm(`Gesamtsicherung vom ${date}\nProfile: ${data.profiles.length}\nTeleskope: ${counts.telescopes}\nKameras: ${counts.cameras}\nMontierungen: ${counts.mounts}\nStandorte: ${counts.locations}\n\nDiesen Stand vollständig wiederherstellen? Vorhandene Profile mit gleicher interner ID werden ersetzt.`))return;
      try{await performExternalBackup({forceDated:true})}catch{}
      for(const item of data.profiles)await idbPut('profiles',normalizeProfile(item));
      if(Array.isArray(data.objectOutlines)) for(const outline of data.objectOutlines) await idbPut('objectOutlines',outline);
      profiles=await idbAll('profiles');profile=normalizeProfile(profiles.find(item=>item.id===data.activeProfileId)||profiles[0]);await setActiveProfile(profile.id);
      if(data.backupSettings){backupConfig={...backupConfig,...data.backupSettings,enabled:false,targetName:'',permission:'none',lastError:'',lastSuccessAt:null,lastDailyDate:null};await saveBackupConfig();backupDraft=deepClone(backupConfig)}
    }else{
      const raw=data.profile||data;if(!raw.name)throw new Error('Kein gültiges Profil gefunden.');
      const imported=normalizeProfile(raw),baseName=String(imported.name||'Importiertes Profil').trim(),names=new Set(profiles.map(item=>item.name));let candidate=`${baseName} – Import`,index=2;while(names.has(candidate))candidate=`${baseName} – Import ${index++}`;
      imported.id=uid('profile');imported.name=candidate;imported.createdAt=new Date().toISOString();imported.updatedAt=new Date().toISOString();
      await idbPut('profiles',imported);profiles=await idbAll('profiles');profile=imported;await setActiveProfile(imported.id);
    }
    draft=deepClone(profile);dirtySections.clear();updateProfileSelectors();render();alert(isBackup?'Gesamtsicherung erfolgreich wiederhergestellt.':`Profil „${profile.name}“ wurde als neues Profil importiert.`);
  }catch(error){alert(`Import fehlgeschlagen: ${error.message}`)}finally{importInput.value='';importMode='auto'}
}

function cloudMapInterpolated(values,size,gx,gy){
  const x0=clamp(Math.floor(gx),0,size-1),y0=clamp(Math.floor(gy),0,size-1);
  const x1=Math.min(size-1,x0+1),y1=Math.min(size-1,y0+1);
  const fx=gx-x0,fy=gy-y0;
  const v00=Number(values[y0*size+x0]),v10=Number(values[y0*size+x1]),v01=Number(values[y1*size+x0]),v11=Number(values[y1*size+x1]);
  const vals=[v00,v10,v01,v11].filter(Number.isFinite);
  if(!vals.length)return NaN;
  const safe=value=>Number.isFinite(value)?value:vals.reduce((a,b)=>a+b,0)/vals.length;
  const top=safe(v00)*(1-fx)+safe(v10)*fx;
  const bottom=safe(v01)*(1-fx)+safe(v11)*fx;
  return top*(1-fy)+bottom*fy;
}
function cloudStructureNoise(x,y,seed=0){
  const raw=Math.sin(x*12.9898+y*78.233+seed*37.719)*43758.5453;
  return raw-Math.floor(raw);
}
function cloudFractalNoise(x,y){
  return cloudStructureNoise(x,y,1)*.52+cloudStructureNoise(x*2.1+9,y*2.1-7,2)*.30+cloudStructureNoise(x*4.3-3,y*4.3+5,3)*.18;
}
function structuredCloudValue(value,gx,gy){
  if(!Number.isFinite(value))return value;
  const noise=cloudFractalNoise(gx,gy);
  const band=Math.sin((gx*1.7+gy*.9)+noise*4.4)*8;
  const adjusted=value+(noise-.5)*42+band;
  const threshold=18+cloudStructureNoise(Math.floor(gx*3),Math.floor(gy*3),5)*22;
  if(value<threshold&&noise<.62)return Math.max(0,adjusted*.26);
  return clamp(adjusted,0,100);
}
function cloudMapColor(value,layer,mode){
  if(!Number.isFinite(value))return'rgba(0,0,0,0)';
  if(mode==='uncertainty'){
    const t=clamp(value/30,0,1),hue=120*(1-t);
    return`hsla(${hue},82%,50%,${.25+.65*t})`;
  }
  const t=clamp(value/100,0,1);
  if(t<.01)return'rgba(255,255,255,0)';
  // Die Topografie bleibt auch unter dichter Bewölkung leicht erkennbar.
  return`rgba(255,255,255,${Math.min(.82,.04+.78*Math.pow(t,.88))})`;
}
function cloudLegendDefinition(layer,mode){
  if(mode==='uncertainty')return{left:'geringe Abweichung',right:'starke Abweichung',gradient:'linear-gradient(90deg,#2ed274 0%,#d7d34a 50%,#ef5a5a 100%)'};
  const label=optionLabel(CLOUD_MAP_LAYER_OPTIONS.find(item=>item[0]===layer)?.[1]||'Bewölkung');
  return{left:`${label}`,right:'100 %',gradient:'linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.38) 52%,rgba(255,255,255,.86) 100%)'};
}

function disposeCloudBaseMap(){
  try{cloudBaseResizeObserver?.disconnect()}catch{}
  cloudBaseResizeObserver=null;
  try{cloudBaseMap?.remove()}catch{}
  cloudBaseMap=null;
  cloudBaseMapSignature='';
}
function applyDarkAstroMapStyle(){
  if(!cloudBaseMap)return;
  const hideCompletely=/(building|house|poi|transit|rail|aeroway|airport|parking|ferry|shop|amenity|industrial)/i;
  const minorRoad=/(path|track|service|minor|residential|street)/i;
  const styleLayers=cloudBaseMap.getStyle().layers||[];
  for(const layer of styleLayers){
    const id=String(layer.id||''),source=String(layer['source-layer']||''),key=`${id} ${source}`;
    try{
      if(hideCompletely.test(key)){cloudBaseMap.setLayoutProperty(id,'visibility','none');continue}
      if(layer.type==='symbol'){
        if(!/(place|country|state|city|town|village|settlement)/i.test(key)){cloudBaseMap.setLayoutProperty(id,'visibility','none');continue}
        cloudBaseMap.setPaintProperty(id,'text-color','#b8d1e3');
        cloudBaseMap.setPaintProperty(id,'text-halo-color','#071018');
        cloudBaseMap.setPaintProperty(id,'text-halo-width',1.25);
        cloudBaseMap.setPaintProperty(id,'text-opacity',.88);
      }else if(layer.type==='background'){
        cloudBaseMap.setPaintProperty(id,'background-color','#18231f');
      }else if(layer.type==='fill'){
        const water=/(water|ocean|lake|river)/i.test(key),forest=/(wood|forest|park|grass|scrub)/i.test(key),farm=/(farmland|crop|meadow|landcover)/i.test(key),rock=/(rock|sand|glacier|mountain)/i.test(key);
        if(water){cloudBaseMap.setPaintProperty(id,'fill-color','#0b2b3b');cloudBaseMap.setPaintProperty(id,'fill-opacity',.94)}
        else if(forest){cloudBaseMap.setPaintProperty(id,'fill-color','#27382b');cloudBaseMap.setPaintProperty(id,'fill-opacity',.88)}
        else if(farm){cloudBaseMap.setPaintProperty(id,'fill-color','#3b3c2d');cloudBaseMap.setPaintProperty(id,'fill-opacity',.78)}
        else if(rock){cloudBaseMap.setPaintProperty(id,'fill-color','#4a4337');cloudBaseMap.setPaintProperty(id,'fill-opacity',.76)}
        else{try{cloudBaseMap.setPaintProperty(id,'fill-opacity',.82)}catch{}}
      }else if(layer.type==='line'){
        const boundary=/(boundary|admin|border)/i.test(key),water=/(water|river|stream)/i.test(key),road=/(road|highway|motorway|trunk|primary|secondary)/i.test(key);
        if(minorRoad.test(key)){cloudBaseMap.setPaintProperty(id,'line-opacity',.08);continue}
        if(boundary){cloudBaseMap.setPaintProperty(id,'line-color','#8aa1ad');cloudBaseMap.setPaintProperty(id,'line-opacity',.62)}
        else if(water){cloudBaseMap.setPaintProperty(id,'line-color','#3b7188');cloudBaseMap.setPaintProperty(id,'line-opacity',.65)}
        else if(road){cloudBaseMap.setPaintProperty(id,'line-color','#8a7659');cloudBaseMap.setPaintProperty(id,'line-opacity',.34)}
        else{try{cloudBaseMap.setPaintProperty(id,'line-opacity',.32)}catch{}}
      }else if(layer.type==='hillshade'){
        cloudBaseMap.setPaintProperty(id,'hillshade-shadow-color','#07100c');
        cloudBaseMap.setPaintProperty(id,'hillshade-highlight-color','#a7ab85');
        cloudBaseMap.setPaintProperty(id,'hillshade-accent-color','#53624c');
        cloudBaseMap.setPaintProperty(id,'hillshade-exaggeration',.58);
      }
    }catch{}
  }
  // Zusätzliche Geländeschattierung macht die Basiskarte auch unter den Wolken klar topografisch.
  try{
    if(!cloudBaseMap.getSource('anp-terrain-dem'))cloudBaseMap.addSource('anp-terrain-dem',{type:'raster-dem',url:'https://demotiles.maplibre.org/terrain-tiles/tiles.json',tileSize:256,maxzoom:12});
    if(!cloudBaseMap.getLayer('anp-terrain-hillshade')){
      const firstLabel=(cloudBaseMap.getStyle().layers||[]).find(item=>item.type==='symbol')?.id;
      cloudBaseMap.addLayer({id:'anp-terrain-hillshade',type:'hillshade',source:'anp-terrain-dem',paint:{'hillshade-shadow-color':'#020706','hillshade-highlight-color':'#b0b38c','hillshade-accent-color':'#5b6950','hillshade-exaggeration':.68,'hillshade-illumination-direction':315}},firstLabel);
    }
  }catch(error){console.warn('Geländeschattierung:',error)}
}

function initCloudBaseMap(){
  const element=document.getElementById('cloudMapBase');
  if(!element||!cloudMapData)return;
  const mode=profile.planning.cloudMapMode||cloudMapSettings().defaultMode;
  const baseMode=currentCloudMapBaseMode();
  const showBase=mode!=='uncertainty'&&baseMode==='combined';
  element.hidden=!showBase;
  if(!showBase){disposeCloudBaseMap();return}
  if(!window.maplibregl){disposeCloudBaseMap();element.hidden=false;element.innerHTML='<div class="cloud-map-base-fallback">Topografische Karte konnte nicht geladen werden.</div>';return}
  const loc=activeLocation(),radius=Number(cloudMapData.radiusKm)||120,latDelta=radius/111,lonDelta=radius/(111*Math.max(.2,Math.cos(toRad(loc.latitude)))),signature=[loc.latitude,loc.longitude,radius].map(v=>Number(v).toFixed(4)).join('|');
  const sameContainer=cloudBaseMap&&cloudBaseMap.getContainer?.()===element;
  if(sameContainer&&cloudBaseMapSignature===signature){requestAnimationFrame(()=>cloudBaseMap?.resize());return}
  disposeCloudBaseMap();
  cloudBaseMapSignature=signature;
  try{
    cloudBaseMap=new maplibregl.Map({container:element,style:'https://tiles.openfreemap.org/styles/liberty',center:[loc.longitude,loc.latitude],attributionControl:true,interactive:false,preserveDrawingBuffer:false,fadeDuration:0});
    cloudBaseMap.fitBounds([[loc.longitude-lonDelta,loc.latitude-latDelta],[loc.longitude+lonDelta,loc.latitude+latDelta]],{padding:0,duration:0});
    cloudBaseMap.on('style.load',()=>{applyDarkAstroMapStyle();requestAnimationFrame(()=>cloudBaseMap?.resize());window.setTimeout(()=>cloudBaseMap?.resize(),180)});
    cloudBaseMap.on('error',event=>console.warn('Topografische Karte:',event?.error||event));
    if('ResizeObserver'in window){cloudBaseResizeObserver=new ResizeObserver(()=>cloudBaseMap?.resize());cloudBaseResizeObserver.observe(element)}
  }catch(error){disposeCloudBaseMap();element.hidden=false;element.innerHTML=`<div class="cloud-map-base-fallback">Topografische Karte konnte nicht geladen werden: ${esc(error?.message||error)}</div>`}
}

function drawCloudMap(){
  const canvas=document.getElementById('cloudMapCanvas');
  if(!canvas||!cloudMapData)return;
  const stage=canvas.closest('.cloud-map-stage');
  const baseMode=currentCloudMapBaseMode();
  stage?.classList.toggle('cloud-only',baseMode==='cloudOnly');
  stage?.classList.toggle('combined',baseMode==='combined');
  initCloudBaseMap();
  const ctx=canvas.getContext('2d');
  const compactMode=false;
  const W=canvas.width,H=canvas.height;
  const view=currentCloudMapView();
  const layer=profile.planning.cloudMapLayer||cloudMapSettings().defaultLayer;
  const mode=profile.planning.cloudMapMode||cloudMapSettings().defaultMode;
  const frameIndex=clamp(Number(profile.planning.cloudMapFrame)||0,0,cloudDisplayTimes().length-1);
  const rawPosition=cloudRawPosition(frameIndex);
  const frame=cloudFrameValues(view,layer,rawPosition);
  const drawValues=mode==='uncertainty'?frame.spread:frame.values;
  const precip=cloudFrameValues(view,'precip',rawPosition).values;
  const rain=cloudFrameValues(view,'rain',rawPosition).values;
  const snow=cloudFrameValues(view,'snow',rawPosition).values;
  const weatherOverlays=cloudMapWeatherOverlays();
  const size=cloudMapData.gridSize;
  const map={x:88,y:54,w:W-176,h:H-126};
  ctx.clearRect(0,0,W,H);
  ctx.save();
  ctx.beginPath();ctx.roundRect(map.x,map.y,map.w,map.h,18);ctx.clip();
  if(mode==='uncertainty'||baseMode==='cloudOnly'||!window.maplibregl){
    const gradient=ctx.createLinearGradient(map.x,map.y,map.x,map.y+map.h);
    gradient.addColorStop(0,'#071522');gradient.addColorStop(1,'#030b12');ctx.fillStyle=gradient;ctx.fillRect(map.x,map.y,map.w,map.h);
  }

  const smoothing=currentCloudSmoothing();
  const offscreen=document.createElement('canvas');
  const renderWidth=smoothing==='structured'?760:smoothing==='soft'?90:390;
  offscreen.width=renderWidth;offscreen.height=Math.max(180,Math.round(renderWidth*map.h/map.w));
  const offCtx=offscreen.getContext('2d');
  for(let py=0;py<offscreen.height;py++){
    const gy=(py/Math.max(1,offscreen.height-1))*(size-1);
    for(let px=0;px<offscreen.width;px++){
      const gx=(px/Math.max(1,offscreen.width-1))*(size-1);
      let value=cloudMapInterpolated(drawValues,size,gx,gy);
      if(smoothing==='structured'&&mode==='clouds')value=structuredCloudValue(value,gx,gy);
      offCtx.fillStyle=cloudMapColor(value,layer,mode);
      offCtx.fillRect(px,py,1,1);
    }
  }
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.save();
  ctx.filter=smoothing==='soft'?'blur(26px)':smoothing==='balanced'?'blur(2px)':'none';
  const pad=smoothing==='soft'?56:smoothing==='balanced'?4:0;
  ctx.drawImage(offscreen,map.x-pad,map.y-pad,map.w+pad*2,map.h+pad*2);
  ctx.restore();

  if(mode==='clouds'){
    // Niederschlagsarten als getrennt schaltbare, dezente Kartenebenen.
    if(weatherOverlays.precip){
      for(let py=0;py<map.h;py+=18){
        const gy=(py/map.h)*(size-1);
        for(let px=0;px<map.w;px+=18){
          const gx=(px/map.w)*(size-1),value=cloudMapInterpolated(precip,size,gx,gy);
          if(value>.03){ctx.strokeStyle=`rgba(83,190,255,${clamp(.35+value/2,.35,.95)})`;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(map.x+px+4,map.y+py-4);ctx.lineTo(map.x+px-5,map.y+py+10);ctx.stroke()}
        }
      }
    }
    if(weatherOverlays.rain){
      for(let py=4;py<map.h;py+=24){
        const gy=(py/map.h)*(size-1);
        for(let px=6;px<map.w;px+=24){
          const gx=(px/map.w)*(size-1),value=cloudMapInterpolated(rain,size,gx,gy);
          if(value>.02){ctx.strokeStyle=`rgba(32,139,255,${clamp(.38+value/2,.38,.95)})`;ctx.lineWidth=2.8;ctx.beginPath();ctx.moveTo(map.x+px,map.y+py);ctx.lineTo(map.x+px-3,map.y+py+9);ctx.stroke()}
        }
      }
    }
    if(weatherOverlays.snow){
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='700 15px system-ui';
      for(let py=10;py<map.h;py+=30){
        const gy=(py/map.h)*(size-1);
        for(let px=10;px<map.w;px+=30){
          const gx=(px/map.w)*(size-1),value=cloudMapInterpolated(snow,size,gx,gy);
          if(value>.01){ctx.fillStyle=`rgba(188,112,255,${clamp(.42+value/2,.42,.98)})`;ctx.fillText('✦',map.x+px,map.y+py)}
        }
      }
    }
  }
  ctx.strokeStyle='rgba(135,190,225,.20)';ctx.lineWidth=1.2;
  for(let i=1;i<4;i++){ctx.beginPath();ctx.ellipse(map.x+map.w/2,map.y+map.h/2,map.w*i/8,map.h*i/8,0,0,Math.PI*2);ctx.stroke()}
  ctx.restore();
  ctx.strokeStyle='rgba(95,190,240,.72)';ctx.lineWidth=2;ctx.strokeRect(map.x,map.y,map.w,map.h);

  if(cloudMapValuesVisible()){
    const cssWidth=canvas.getBoundingClientRect().width||W;
    const cellCss=(cssWidth*map.w/W)/Math.max(1,size-1);
    const labelStep=cellCss<46?3:cellCss<76?2:1;
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`800 ${size>=9?18:20}px system-ui`;
    for(let row=0;row<size;row++)for(let col=0;col<size;col++){
      const index=row*size+col;
      if(row!==Math.floor(size/2)||col!==Math.floor(size/2))if(row%labelStep||col%labelStep)continue;
      const value=Number(frame.values[index]);if(!Number.isFinite(value))continue;
      const x=map.x+col/Math.max(1,size-1)*map.w,y=map.y+row/Math.max(1,size-1)*map.h;
      const text=`${Math.round(value)}%`;
      ctx.lineWidth=6;ctx.strokeStyle='rgba(2,7,12,.92)';ctx.strokeText(text,x,y);
      ctx.fillStyle='#f2ad55';ctx.fillText(text,x,y);
    }
  }

  const cx=map.x+map.w/2,cy=map.y+map.h/2;
  ctx.fillStyle='#ffd66b';ctx.strokeStyle='#06111b';ctx.lineWidth=5;ctx.beginPath();ctx.arc(cx,cy,10,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.strokeStyle='#ffd66b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-22,cy);ctx.lineTo(cx+22,cy);ctx.moveTo(cx,cy-22);ctx.lineTo(cx,cy+22);ctx.stroke();

  const movement=estimateCloudMovement(view,layer,frameIndex);
  if(movement?.reliable&&Number.isFinite(movement.azimuth)&&movement.distance>=1){
    const length=clamp(60+movement.distance*2,70,170),angle=toRad(movement.azimuth),dx=Math.sin(angle)*length,dy=-Math.cos(angle)*length;
    ctx.strokeStyle='#ffcf5b';ctx.fillStyle='#ffcf5b';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+dx,cy+dy);ctx.stroke();
    const head=14,headAngle=Math.atan2(dy,dx);ctx.beginPath();ctx.moveTo(cx+dx,cy+dy);ctx.lineTo(cx+dx-head*Math.cos(headAngle-.55),cy+dy-head*Math.sin(headAngle-.55));ctx.lineTo(cx+dx-head*Math.cos(headAngle+.55),cy+dy-head*Math.sin(headAngle+.55));ctx.closePath();ctx.fill();
  }
  if(!compactMode){
    ctx.fillStyle='#dcecff';ctx.font='700 26px system-ui';ctx.textAlign='center';ctx.fillText('N',W/2,34);ctx.fillText('S',W/2,H-16);ctx.textAlign='left';ctx.fillText('W',30,H/2);ctx.textAlign='right';ctx.fillText(language==='en'?'E':'O',W-30,H/2);
    ctx.textAlign='left';ctx.font='600 20px system-ui';ctx.fillStyle='#b9d3e8';ctx.fillText(`${cloudMapData.locationName} · Radius ${cloudMapData.radiusKm} km`,map.x,map.y-16);ctx.textAlign='right';ctx.fillText(`${weatherViewLabel(view)} · ${optionLabel(CLOUD_MAP_LAYER_OPTIONS.find(item=>item[0]===layer)?.[1]||layer)}`,map.x+map.w,map.y-16);
    ctx.textAlign='center';ctx.font='700 22px system-ui';ctx.fillStyle='#ffe08a';ctx.fillText(cloudMapData.locationName,cx,cy+44);
  }

  const legend=document.getElementById('cloudMapLegend');
  if(legend){
    const definition=cloudLegendDefinition(layer,mode),overlays=cloudMapWeatherOverlays();
    legend.innerHTML=`<div class="cloud-scale"><span>${definition.left}</span><span class="cloud-scale-zero">0 %</span><div class="legend-gradient dynamic" style="background:${definition.gradient}"></div><span>${definition.right}</span></div>${mode==='clouds'?`<div class="cloud-phenomena" aria-label="${ui('Niederschlagsarten','Precipitation types')}"><label class="cloud-phenomenon precip"><input type="checkbox" data-cloud-overlay="precip" ${overlays.precip?'checked':''}><i></i>${ui('Niederschlag gesamt','Total precipitation')}</label><label class="cloud-phenomenon rain"><input type="checkbox" data-cloud-overlay="rain" ${overlays.rain?'checked':''}><i></i>${ui('Regen','Rain')}</label><label class="cloud-phenomenon snow"><input type="checkbox" data-cloud-overlay="snow" ${overlays.snow?'checked':''}><i></i>${ui('Schnee','Snow')}</label></div>`:''}<div class="cloud-value-legend"><b>xx%</b><span>${ui('Wolkenanteil','Cloud cover')}<br>${ui('am Prognosepunkt','at forecast point')}</span></div>`;
  }
}
function drawMiniCharts(){document.querySelectorAll('.mini-chart').forEach(canvas=>{
  const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  const points=JSON.parse(decodeURIComponent(canvas.dataset.points||'%5B%5D'));
  const horizonPoints=JSON.parse(decodeURIComponent(canvas.dataset.horizonPoints||'%5B%5D'));
  const showHorizon=canvas.dataset.showHorizon==='1';
  const start=Number(canvas.dataset.start),end=Number(canvas.dataset.end),civilS=Number(canvas.dataset.civilStart),civilE=Number(canvas.dataset.civilEnd),astroS=Number(canvas.dataset.astroStart),astroE=Number(canvas.dataset.astroEnd),nautS=Number(canvas.dataset.nautStart),nautE=Number(canvas.dataset.nautEnd),minAlt=Number(canvas.dataset.minAlt);
  ctx.clearRect(0,0,w,h);const x=t=>(t-start)/(end-start)*w,y=a=>h-8-clamp(a,0,90)/90*(h-16);
  ctx.fillStyle='#3a3227';ctx.fillRect(0,0,w,h);
  const band=(s,e,fill)=>{s=Number(s);e=Number(e);if(!Number.isFinite(s)||!Number.isFinite(e)||s<=0||e<=0)return;const left=clamp(x(s),0,w),right=clamp(x(e),0,w);if(right<=left)return;ctx.fillStyle=fill;ctx.fillRect(left,0,right-left,h)};
  band(civilS,civilE,'#1b2a3d');band(nautS,nautE,'#142235');band(astroS,astroE,'#08121f');
  for(const t of [civilS,nautS,astroS,astroE,nautE,civilE]){if(!Number.isFinite(t)||t<=0)continue;ctx.beginPath();ctx.strokeStyle='#73849a';ctx.setLineDash([3,3]);ctx.moveTo(x(t),0);ctx.lineTo(x(t),h);ctx.stroke()}
  ctx.setLineDash([5,4]);ctx.strokeStyle='#d7ad47';ctx.beginPath();ctx.moveTo(0,y(minAlt));ctx.lineTo(w,y(minAlt));ctx.stroke();ctx.setLineDash([]);
  if(showHorizon&&horizonPoints.length){ctx.strokeStyle='#66d69a';ctx.lineWidth=1.4;ctx.beginPath();horizonPoints.forEach(([t,a],i)=>i?ctx.lineTo(x(t),y(a)):ctx.moveTo(x(t),y(a)));ctx.stroke()}
  ctx.strokeStyle='#7ec1ff';ctx.lineWidth=2;ctx.beginPath();points.forEach(([t,a],i)=>i?ctx.lineTo(x(t),y(a)):ctx.moveTo(x(t),y(a)));ctx.stroke();
  if(points.length){const max=points.reduce((m,p)=>p[1]>m[1]?p:m,points[0]);ctx.fillStyle='#f0c75e';ctx.beginPath();ctx.arc(x(max[0]),y(max[1]),3,0,Math.PI*2);ctx.fill()}
  ctx.fillStyle='#aabbd0';ctx.font='10px sans-serif';ctx.fillText('0°',2,h-2);ctx.fillText('90°',2,10)
})}

function decodeCanvasData(value,fallback=[]){
  try{return JSON.parse(decodeURIComponent(value||''))}catch{return fallback}
}

function chartPalette(){
  return{
    background:'#07111d',grid:'#263a51',text:'#a9bdd2',accent:'#6fc9ff',accent2:'#4ad18b',
    selected:'rgba(121,184,255,.13)',civil:'#3a3227',nautical:'#1b2a3d',astronomical:'#142235',night:'#08121f',
    warning:'#f0c75e',danger:'#f17070',horizonFill:'rgba(74,209,139,.14)'
  };
}

function drawLargeCharts(){
  const palette=chartPalette();
  document.querySelectorAll('.large-altitude-chart').forEach(canvas=>{
    const context=canvas.getContext('2d');
    const width=canvas.width,height=canvas.height;
    const points=decodeCanvasData(canvas.dataset.points);
    if(!points.length)return;
    const margin={left:62,right:22,top:22,bottom:70};
    const plotW=width-margin.left-margin.right,plotH=height-margin.top-margin.bottom;
    const start=Number(canvas.dataset.start),end=Number(canvas.dataset.end);
    const selectedStart=Number(canvas.dataset.selectedStart),selectedEnd=Number(canvas.dataset.selectedEnd);
    const x=time=>margin.left+(time-start)/(end-start)*plotW;
    const y=altitudeValue=>margin.top+(90-clamp(altitudeValue,0,90))/90*plotH;
    context.clearRect(0,0,width,height);
    context.fillStyle=palette.background;
    context.fillRect(0,0,width,height);
    context.fillStyle=palette.civil;
    context.fillRect(margin.left,margin.top,plotW,plotH);
    const band=(bandStart,bandEnd,fill)=>{
      bandStart=Number(bandStart);bandEnd=Number(bandEnd);if(!Number.isFinite(bandStart)||!Number.isFinite(bandEnd)||bandStart<=0||bandEnd<=0)return;
      const left=clamp(x(Number(bandStart)),margin.left,margin.left+plotW);
      const right=clamp(x(Number(bandEnd)),margin.left,margin.left+plotW);
      if(right<=left)return;
      context.fillStyle=fill;
      context.fillRect(left,margin.top,right-left,plotH);
    };
    band(canvas.dataset.civilStart,canvas.dataset.civilEnd,palette.nautical);
    band(canvas.dataset.nautStart,canvas.dataset.nautEnd,palette.astronomical);
    band(canvas.dataset.astroStart,canvas.dataset.astroEnd,palette.night);
    band(selectedStart,selectedEnd,palette.selected);
    context.strokeStyle=palette.accent;
    context.lineWidth=2;
    context.setLineDash([8,5]);
    context.strokeRect(clamp(x(selectedStart),margin.left,margin.left+plotW),margin.top,Math.max(1,clamp(x(selectedEnd),margin.left,margin.left+plotW)-clamp(x(selectedStart),margin.left,margin.left+plotW)),plotH);
    context.setLineDash([]);
    context.font='15px system-ui, sans-serif';
    context.textBaseline='middle';
    for(let altitudeValue=0;altitudeValue<=90;altitudeValue+=15){
      const py=y(altitudeValue);
      context.strokeStyle=palette.grid;
      context.lineWidth=1;
      context.beginPath();
      context.moveTo(margin.left,py);
      context.lineTo(margin.left+plotW,py);
      context.stroke();
      context.fillStyle=palette.text;
      context.textAlign='right';
      context.fillText(`${altitudeValue}°`,margin.left-10,py);
    }
    const ticks=8;
    for(let index=0;index<=ticks;index++){
      const time=start+(end-start)*index/ticks;
      const px=x(time);
      context.strokeStyle=palette.grid;
      context.beginPath();
      context.moveTo(px,margin.top);
      context.lineTo(px,margin.top+plotH);
      context.stroke();
      const nearest=points.reduce((best,point)=>Math.abs(point[0]-time)<Math.abs(best[0]-time)?point:best,points[0]);
      context.fillStyle=palette.text;
      context.textAlign=index===0?'left':index===ticks?'right':'center';
      context.textBaseline='top';
      context.fillText(fmtTime(new Date(time),canvas.dataset.timezone),px,margin.top+plotH+10);
      context.fillStyle='#d4e7fa';
      context.fillText(`${cardinal(nearest[2])} · ${fmt(nearest[2])}°`,px,margin.top+plotH+33);
    }
    const minAltitude=Number(canvas.dataset.minAlt);
    context.setLineDash([8,5]);
    context.strokeStyle=palette.warning;
    context.lineWidth=2;
    context.beginPath();
    context.moveTo(margin.left,y(minAltitude));
    context.lineTo(margin.left+plotW,y(minAltitude));
    context.stroke();
    context.setLineDash([]);
    context.fillStyle=palette.warning;
    context.textAlign='left';
    context.textBaseline='bottom';
    context.fillText(`${ui('Mindesthöhe','Minimum altitude')} ${fmt(minAltitude)}°`,margin.left+8,y(minAltitude)-4);
    context.strokeStyle=palette.accent2;
    context.lineWidth=2;
    context.setLineDash([5,4]);
    context.beginPath();
    points.forEach((point,index)=>index?context.lineTo(x(point[0]),y(point[3])):context.moveTo(x(point[0]),y(point[3])));
    context.stroke();
    context.setLineDash([]);
    context.strokeStyle=palette.accent;
    context.lineWidth=4;
    context.beginPath();
    points.forEach((point,index)=>index?context.lineTo(x(point[0]),y(point[1])):context.moveTo(x(point[0]),y(point[1])));
    context.stroke();
    const maxPoint=points.reduce((best,point)=>point[1]>best[1]?point:best,points[0]);
    context.fillStyle=palette.warning;
    context.beginPath();
    context.arc(x(maxPoint[0]),y(maxPoint[1]),6,0,Math.PI*2);
    context.fill();
    context.fillStyle='#d9ebff';
    context.textAlign='left';
    context.textBaseline='bottom';
    context.fillText(`Maximum ${fmt(maxPoint[1])}° · ${fmtTime(new Date(maxPoint[0]),canvas.dataset.timezone)} · ${cardinal(maxPoint[2])}`,x(maxPoint[0])+10,y(maxPoint[1])-7);
    const currentTime=clamp(Number(canvas.dataset.currentTime)||start,start,end);
    const currentPoint=nearestDetailPoint(points,currentTime);
    context.strokeStyle=palette.warning;
    context.lineWidth=2;
    context.setLineDash([5,4]);
    context.beginPath();context.moveTo(x(currentTime),margin.top);context.lineTo(x(currentTime),margin.top+plotH);context.stroke();
    context.setLineDash([]);
    context.fillStyle=palette.warning;
    context.beginPath();context.arc(x(currentTime),y(currentPoint[1]),7,0,Math.PI*2);context.fill();
    context.strokeStyle='#07111d';context.lineWidth=3;context.stroke();
    context.fillStyle='#fff2bd';context.textAlign=x(currentTime)>margin.left+plotW*.72?'right':'left';context.textBaseline='bottom';
    context.fillText(`${fmtTime(new Date(currentTime),canvas.dataset.timezone)} · ${fmt(currentPoint[1])}° · ${cardinal(currentPoint[2])}`,x(currentTime)+(x(currentTime)>margin.left+plotW*.72?-10:10),y(currentPoint[1])-10);
    context.strokeStyle='#38516d';
    context.lineWidth=1;
    context.strokeRect(margin.left,margin.top,plotW,plotH);
    context.fillStyle=palette.text;
    context.textAlign='left';
    context.textBaseline='top';
    context.fillText(ui('Objekthöhe','Object altitude'),margin.left,2);
    context.fillStyle=palette.accent2;
    context.fillText(ui('— persönlicher Horizont','— personal horizon'),margin.left+110,2);
  });
  document.querySelectorAll('.large-horizon-chart').forEach(canvas=>drawHorizonChart(canvas,true));
}

function drawHorizonChart(canvas,withTrack=false){
  const palette=chartPalette();
  const context=canvas.getContext('2d');
  const width=canvas.width,height=canvas.height;
  const horizon=decodeCanvasData(canvas.dataset.horizon);
  const obstacles=decodeCanvasData(canvas.dataset.obstacles);
  const track=withTrack?decodeCanvasData(canvas.dataset.track):[];
  const margin={left:62,right:22,top:22,bottom:68};
  const plotW=width-margin.left-margin.right,plotH=height-margin.top-margin.bottom;
  const x=azimuthValue=>margin.left+clamp(azimuthValue,0,360)/360*plotW;
  const y=altitudeValue=>margin.top+(90-clamp(altitudeValue,0,90))/90*plotH;
  const horizonAltAtAz=azimuthValue=>{
    if(!horizon.length)return 0;
    const az=((Number(azimuthValue)||0)%360+360)%360;
    const step=360/Math.max(1,horizon.length-1);
    const pos=az/step,lo=Math.floor(pos),hi=Math.min(horizon.length-1,lo+1),f=pos-lo;
    const a=Number(horizon[lo]?.[1])||0,b=Number(horizon[hi]?.[1])||0;
    return a*(1-f)+b*f;
  };
  context.clearRect(0,0,width,height);
  context.fillStyle=palette.background;
  context.fillRect(0,0,width,height);

  if(withTrack&&track.length){
    const trackTimes=track.map(point=>Number(point[2])).filter(Number.isFinite);
    const start=Number(canvas.dataset.start)||Math.min(...trackTimes),end=Number(canvas.dataset.end)||Math.max(...trackTimes);
    const selectedStart=Number(canvas.dataset.selectedStart),selectedEnd=Number(canvas.dataset.selectedEnd);
    const civilStart=Number(canvas.dataset.civilStart),civilEnd=Number(canvas.dataset.civilEnd),nautStart=Number(canvas.dataset.nautStart),nautEnd=Number(canvas.dataset.nautEnd),astroStart=Number(canvas.dataset.astroStart),astroEnd=Number(canvas.dataset.astroEnd);
    const sorted=track.slice().sort((a,b)=>Number(a[2])-Number(b[2]));
    // Dämmerungsphasen in der Horizontansicht: 360°-Azimutansicht bleibt erhalten,
    // die Phasen werden aber farblich und in relativer Breite wie in der Höhenkurve dargestellt.
    // Dafür wird der zeitliche Sonnenuntergang-Sonnenaufgang-Verlauf auf die sichtbare Azimutspanne der Objektbahn gelegt.
    const trackXs=sorted.map(point=>x(Number(point[0]))).filter(Number.isFinite);
    const trackLeft=trackXs.length?Math.max(margin.left,Math.min(...trackXs)):margin.left;
    const trackRight=trackXs.length?Math.min(margin.left+plotW,Math.max(...trackXs)):margin.left+plotW;
    const twilightLeft=Math.min(trackLeft,trackRight),twilightRight=Math.max(trackLeft,trackRight);
    const twilightWidth=Math.max(1,twilightRight-twilightLeft);
    const twilightX=time=>twilightLeft+clamp((Number(time)-start)/Math.max(1,end-start),0,1)*twilightWidth;
    const drawTimeBand=(bandStart,bandEnd,fill)=>{
      bandStart=Number(bandStart);bandEnd=Number(bandEnd);if(!Number.isFinite(bandStart)||!Number.isFinite(bandEnd)||bandStart<=0||bandEnd<=0)return;
      const left=clamp(twilightX(bandStart),twilightLeft,twilightRight);
      const right=clamp(twilightX(bandEnd),twilightLeft,twilightRight);
      if(!Number.isFinite(left)||!Number.isFinite(right)||right<=left)return;
      context.fillStyle=fill;
      context.fillRect(left,margin.top,right-left,plotH);
    };
    if(twilightWidth>1){
      context.fillStyle=palette.civil;
      context.fillRect(twilightLeft,margin.top,twilightWidth,plotH);
      drawTimeBand(civilStart,civilEnd,palette.nautical);
      drawTimeBand(nautStart,nautEnd,palette.astronomical);
      drawTimeBand(astroStart,astroEnd,palette.night);
      drawTimeBand(selectedStart,selectedEnd,palette.selected);
      context.save();
      context.strokeStyle='rgba(170,190,210,.32)';
      context.setLineDash([4,4]);
      [civilStart,nautStart,astroStart,astroEnd,nautEnd,civilEnd].forEach(boundary=>{
        if(!Number.isFinite(boundary)||boundary<=0)return;
        const px=twilightX(boundary);
        if(px<=twilightLeft+.5||px>=twilightRight-.5)return;
        context.beginPath();context.moveTo(px,margin.top);context.lineTo(px,margin.top+plotH);context.stroke();
      });
      context.restore();
    }
    context.font='15px system-ui, sans-serif';
    for(let altitudeValue=0;altitudeValue<=90;altitudeValue+=15){const py=y(altitudeValue);context.strokeStyle=palette.grid;context.lineWidth=1;context.beginPath();context.moveTo(margin.left,py);context.lineTo(margin.left+plotW,py);context.stroke();context.fillStyle=palette.text;context.textAlign='right';context.textBaseline='middle';context.fillText(`${altitudeValue}°`,margin.left-10,py)}
    const minAlt=Number(canvas.dataset.minAlt);if(Number.isFinite(minAlt)){const py=y(minAlt);context.save();context.strokeStyle=palette.warning;context.lineWidth=2;context.setLineDash([7,5]);context.beginPath();context.moveTo(margin.left,py);context.lineTo(margin.left+plotW,py);context.stroke();context.setLineDash([]);context.fillStyle=palette.warning;context.textAlign='left';context.textBaseline='bottom';context.fillText(`${ui('Mindesthöhe','Minimum altitude')} ${fmt(minAlt)}°`,margin.left+8,py-4);context.restore();}
    const directions=['N','NO','O','SO','S','SW','W','NW','N'];
    directions.forEach((direction,index)=>{const azimuthValue=index*45,px=x(azimuthValue);context.strokeStyle=palette.grid;context.beginPath();context.moveTo(px,margin.top);context.lineTo(px,margin.top+plotH);context.stroke();context.fillStyle='#d6e8fa';context.textAlign=index===0?'left':index===8?'right':'center';context.textBaseline='top';context.fillText(direction,px,margin.top+plotH+8);context.fillStyle=palette.text;context.fillText(`${azimuthValue}°`,px,margin.top+plotH+31)});
    const showGround=canvas.dataset.showGround!=='false';
    if(showGround&&horizon.length){context.beginPath();context.moveTo(x(horizon[0][0]),y(0));horizon.forEach(point=>context.lineTo(x(point[0]),y(point[1])));context.lineTo(x(horizon[horizon.length-1][0]),y(0));context.closePath();context.fillStyle=palette.horizonFill;context.fill();context.strokeStyle=palette.accent2;context.lineWidth=4;context.beginPath();horizon.forEach((point,index)=>index?context.lineTo(x(point[0]),y(point[1])):context.moveTo(x(point[0]),y(point[1])));context.stroke();}
    if(showGround)obstacles.forEach(obstacle=>{if(obstacle.type==='free'&&Array.isArray(obstacle.points)&&obstacle.points.length>=2){const points=obstacle.points.map(p=>Array.isArray(p)?{az:Number(p[0]),alt:Number(p[1])}:p).filter(p=>Number.isFinite(p.az)&&Number.isFinite(p.alt));if(points.length>=2){context.fillStyle='rgba(241,112,112,.14)';context.strokeStyle=palette.danger;context.lineWidth=2.5;context.beginPath();points.forEach((p,index)=>index?context.lineTo(x(p.az),y(p.alt)):context.moveTo(x(p.az),y(p.alt)));if(obstacle.closed&&points.length>=3){context.closePath();context.fill()}context.stroke();const mid=points[Math.floor(points.length/2)];context.fillStyle=palette.danger;context.textAlign='center';context.textBaseline='bottom';context.fillText(String(obstacle.name||'Freies Hindernis'),x(mid.az),y(mid.alt)-5)}return;}const center=((Number(obstacle.azimuth)%360)+360)%360,halfWidth=6,left=center-halfWidth,right=center+halfWidth;context.fillStyle='rgba(241,112,112,.28)';const drawBlock=(from,to)=>{context.fillRect(x(from),y(obstacle.altitude),x(to)-x(from),y(0)-y(obstacle.altitude));context.strokeStyle=palette.danger;context.lineWidth=2;context.strokeRect(x(from),y(obstacle.altitude),x(to)-x(from),y(0)-y(obstacle.altitude))};if(left<0){drawBlock(0,right);drawBlock(360+left,360)}else if(right>360){drawBlock(left,360);drawBlock(0,right-360)}else drawBlock(left,right);context.fillStyle=palette.danger;context.textAlign='center';context.textBaseline='bottom';context.fillText(String(obstacle.name||'Hindernis'),x(center),y(obstacle.altitude)-4);});
    context.strokeStyle=palette.accent;context.lineWidth=3;context.beginPath();track.forEach((point,index)=>{const px=x(point[0]),py=y(point[1]);index?context.lineTo(px,py):context.moveTo(px,py)});context.stroke();
    const selected=track.filter(point=>point[2]>=selectedStart&&point[2]<=selectedEnd);if(selected.length){context.strokeStyle=palette.warning;context.lineWidth=5;context.beginPath();selected.forEach((point,index)=>{const px=x(point[0]),py=y(point[1]);index?context.lineTo(px,py):context.moveTo(px,py)});context.stroke()}
    const currentTime=clamp(Number(canvas.dataset.currentTime)||track[0][2],start,end),currentPoint=nearestDetailPoint(track.map(point=>[point[2],point[1],point[0]]),currentTime),currentAltitude=currentPoint[1],currentAzimuth=currentPoint[2];
    context.strokeStyle='#d8ecff';context.lineWidth=2;context.beginPath();context.moveTo(x(currentAzimuth)-12,y(currentAltitude));context.lineTo(x(currentAzimuth)+12,y(currentAltitude));context.moveTo(x(currentAzimuth),y(currentAltitude)-12);context.lineTo(x(currentAzimuth),y(currentAltitude)+12);context.stroke();context.fillStyle=palette.warning;context.beginPath();context.arc(x(currentAzimuth),y(currentAltitude),7,0,Math.PI*2);context.fill();context.strokeStyle='#07111d';context.lineWidth=3;context.stroke();
    context.fillStyle='#fff2bd';context.textAlign=x(currentAzimuth)>margin.left+plotW*.72?'right':'left';context.textBaseline='bottom';context.fillText(`${fmtTime(new Date(currentTime),canvas.dataset.timezone)} · ${fmt(currentAltitude)}° · ${cardinal(currentAzimuth)} (${fmt(currentAzimuth)}°)`,x(currentAzimuth)+(x(currentAzimuth)>margin.left+plotW*.72?-12:12),y(currentAltitude)-12);
    context.strokeStyle='#38516d';context.lineWidth=1;context.strokeRect(margin.left,margin.top,plotW,plotH);context.fillStyle=palette.text;context.textAlign='left';context.textBaseline='top';context.fillText(ui('Horizont (grün) · Objektbahn (gelb) · Mindesthöhe (gelb gestrichelt) · Dämmerungsphasen (blau) · Planungszeitraum (hellblau)','Horizon (green) · object path (yellow) · minimum altitude (yellow dashed) · twilight phases (blue) · planning window (light blue)'),margin.left,2);
    return;
  }

  context.font='15px system-ui, sans-serif';
  for(let altitudeValue=0;altitudeValue<=90;altitudeValue+=15){
    const py=y(altitudeValue);
    context.strokeStyle=palette.grid;
    context.lineWidth=1;
    context.beginPath();context.moveTo(margin.left,py);context.lineTo(margin.left+plotW,py);context.stroke();
    context.fillStyle=palette.text;context.textAlign='right';context.textBaseline='middle';context.fillText(`${altitudeValue}°`,margin.left-10,py);
  }
  const directions=['N','NO','O','SO','S','SW','W','NW','N'];
  directions.forEach((direction,index)=>{
    const azimuthValue=index*45,px=x(azimuthValue);
    context.strokeStyle=palette.grid;
    context.beginPath();context.moveTo(px,margin.top);context.lineTo(px,margin.top+plotH);context.stroke();
    context.fillStyle='#d6e8fa';context.textAlign=index===0?'left':index===8?'right':'center';context.textBaseline='top';
    context.fillText(direction,px,margin.top+plotH+8);
    context.fillStyle=palette.text;context.fillText(`${azimuthValue}°`,px,margin.top+plotH+31);
  });
  const showGround=canvas.dataset.showGround!=='false';
  if(showGround&&horizon.length){
    context.beginPath();
    context.moveTo(x(horizon[0][0]),y(0));
    horizon.forEach(point=>context.lineTo(x(point[0]),y(point[1])));
    context.lineTo(x(horizon[horizon.length-1][0]),y(0));
    context.closePath();
    context.fillStyle=palette.horizonFill;context.fill();
    context.strokeStyle=palette.accent2;context.lineWidth=4;context.beginPath();
    horizon.forEach((point,index)=>index?context.lineTo(x(point[0]),y(point[1])):context.moveTo(x(point[0]),y(point[1])));context.stroke();
    if(canvas.dataset.editable==='true')horizon.forEach((point,index)=>{if(index%3!==0&&index!==horizon.length-1)return;context.fillStyle='#07111d';context.strokeStyle=palette.accent2;context.lineWidth=2;context.beginPath();context.arc(x(point[0]),y(point[1]),5,0,Math.PI*2);context.fill();context.stroke();});
  }
  if(showGround)obstacles.forEach(obstacle=>{
    if(obstacle.type==='free'&&Array.isArray(obstacle.points)&&obstacle.points.length>=2){
      const points=obstacle.points.map(p=>Array.isArray(p)?{az:Number(p[0]),alt:Number(p[1])}:p).filter(p=>Number.isFinite(p.az)&&Number.isFinite(p.alt));
      if(points.length>=2){context.fillStyle='rgba(241,112,112,.18)';context.strokeStyle=palette.danger;context.lineWidth=2.5;context.beginPath();points.forEach((p,index)=>index?context.lineTo(x(p.az),y(p.alt)):context.moveTo(x(p.az),y(p.alt)));if(obstacle.closed&&points.length>=3){context.closePath();context.fill()}context.stroke();points.forEach(p=>{context.fillStyle='#07111d';context.strokeStyle=palette.danger;context.beginPath();context.arc(x(p.az),y(p.alt),4,0,Math.PI*2);context.fill();context.stroke();});const mid=points[Math.floor(points.length/2)];context.fillStyle=palette.danger;context.textAlign='center';context.textBaseline='bottom';context.fillText(String(obstacle.name||'Freies Hindernis'),x(mid.az),y(mid.alt)-5)}
      return;
    }
    const center=((Number(obstacle.azimuth)%360)+360)%360,halfWidth=6,left=center-halfWidth,right=center+halfWidth;
    context.fillStyle='rgba(241,112,112,.28)';
    const drawBlock=(from,to)=>{context.fillRect(x(from),y(obstacle.altitude),x(to)-x(from),y(0)-y(obstacle.altitude));context.strokeStyle=palette.danger;context.lineWidth=2;context.strokeRect(x(from),y(obstacle.altitude),x(to)-x(from),y(0)-y(obstacle.altitude))};
    if(left<0){drawBlock(0,right);drawBlock(360+left,360)}else if(right>360){drawBlock(left,360);drawBlock(0,right-360)}else drawBlock(left,right);
    context.fillStyle=palette.danger;context.textAlign='center';context.textBaseline='bottom';context.fillText(String(obstacle.name||'Hindernis'),x(center),y(obstacle.altitude)-4);
  });
  context.strokeStyle='#38516d';context.lineWidth=1;context.strokeRect(margin.left,margin.top,plotW,plotH);
  context.fillStyle=palette.text;context.textAlign='left';context.textBaseline='top';context.fillText(ui('Persönlicher Horizont und Hindernisse','Personal horizon and obstacles'),margin.left,2);
}

function drawSettingsHorizonCharts(){
  document.querySelectorAll('.settings-horizon-chart').forEach(canvas=>drawHorizonChart(canvas,false));
}

function syncSettingsHorizonCanvas(){const canvas=document.querySelector('.settings-horizon-chart');if(!canvas)return;const location=draft.locations.find(item=>item.id===draft.selectedLocationId)||draft.locations[0],entry=horizonProfileFor(location,location.selectedHorizonProfileId),points=ensureHorizonProfile(location,entry?.id).map((altitude,index)=>[horizonAzForIndex(index),Number(altitude)||0]);canvas.dataset.horizon=encodeURIComponent(JSON.stringify(points));canvas.dataset.obstacles=encodeURIComponent(JSON.stringify((entry?.obstacles||[]).map(item=>item.type==='free'?{type:'free',name:item.name||'Freies Hindernis',points:item.points||[],closed:Boolean(item.closed)}:{name:item.name||'Hindernis',azimuth:Number(item.azimuth)||0,altitude:Number(item.altitude)||0})));drawSettingsHorizonCharts()}

function layoutFramingOverlays(){
  document.querySelectorAll('.framing-view').forEach(view=>{
    const horizontalFov=Number(view.dataset.targetFov)||1;
    const verticalFov=horizontalFov*Math.max(1,view.clientHeight)/Math.max(1,view.clientWidth);
    view.querySelectorAll('.framing-scaled-overlay').forEach(overlay=>{
      const widthDeg=Number(overlay.dataset.widthDeg)||0;
      const heightDeg=Number(overlay.dataset.heightDeg)||0;
      overlay.style.width=`${clamp(widthDeg/horizontalFov*100,.3,96)}%`;
      overlay.style.height=`${clamp(heightDeg/verticalFov*100,.3,96)}%`;
      overlay.style.transform=`translate(-50%,-50%) rotate(${Number(overlay.dataset.rotation)||0}deg)`;
    });
  });
}


window.addEventListener('beforeunload',event=>{if(dirtySections&&dirtySections.size){event.preventDefault();event.returnValue='';}});

window.addEventListener('message',event=>{
  if(event.origin!==location.origin)return;
  if(event.data?.type==='anp-aladin-ready'){sendAladinOverlayUpdate();postAladinCenterFrameToSelectedObject({feedback:false});return}
  if(event.data?.type==='anp-frame-centered'||event.data?.type==='anp-frame-moved'){
    if(event.data.objectId&&event.data.objectId!==profile.planning.selectedObjectId)return;
    if(Number.isFinite(Number(event.data.ra))&&Number.isFinite(Number(event.data.dec))){profile.planning.frameCenterRaDeg=Number(event.data.ra);profile.planning.frameCenterDecDeg=Number(event.data.dec);profile.planning.frameCenterObjectId=event.data.objectId||profile.planning.selectedObjectId;saveProfile();}
    if(event.data.silent)return;
    const button=document.getElementById('centerAladinFrame');
    if(!button)return;
    button.textContent='Rahmen gesetzt ✓';button.disabled=true;
    window.setTimeout(()=>{button.textContent='Rahmen auf Objekt zurücksetzen';button.disabled=false},1800);
    return;
  }
  if(event.data?.type==='anp-select-object'){
    const objectId=event.data.objectId;
    if(catalog.some(item=>item.id===objectId)){setObjectDetails(objectId,true,true);}
    return;
  }
  if(event.data?.type==='anp-add-target'){
    const objectId=event.data.objectId;
    addImagingTarget(objectId).then(ok=>{try{event.source?.postMessage({type:'anp-add-target-result',objectId,ok},event.origin)}catch{};render()});
    return;
  }
  if(event.data?.type==='anp-outline-saved'||event.data?.type==='anp-outline-deleted'){
    sendAladinOverlayUpdate();
    return;
  }
  if(event.data?.type==='anp-frame-center-error'){
    const button=document.getElementById('centerAladinFrame');
    if(!button)return;
    button.textContent='Bildmitte nicht verfügbar';button.disabled=true;
    window.setTimeout(()=>{button.textContent='Rahmen auf Objekt zurücksetzen';button.disabled=false},1800);
  }
});

async function registerPwa(){
  if(!('serviceWorker'in navigator))return;
  const hadController=Boolean(navigator.serviceWorker.controller);
  try{
    swRegistration=await navigator.serviceWorker.register('sw.js');
    swRegistration.addEventListener('updatefound',()=>{
      const worker=swRegistration.installing;
      worker?.addEventListener('statechange',()=>{
        if(worker.state==='installed'&&hadController&&navigator.serviceWorker.controller){
          showUpdateBanner();
        }
      });
    });
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(hadController)showUpdateBanner();
    });
  }catch(error){
    console.warn('Service Worker konnte nicht registriert werden',error);
  }
}

init().catch(err=>{console.error(err);app.innerHTML=`<section class="card"><h2>Start fehlgeschlagen</h2><div class="notice bad">${esc(err.message||err)}</div><p>Bitte Browserdaten für diese Seite prüfen oder die App neu laden.</p></section>`});
