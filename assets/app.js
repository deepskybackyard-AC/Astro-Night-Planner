/* Astro Night Planner 1.0.2 – Produktivversion mit korrigierter Header-Navigation und LDN-Katalog */
'use strict';

const BUILD = Object.freeze(window.ANP_BUILD || {environment:'prod', appVersion:'1.0.2', release:'1.0.2', databaseName:'astro-night-planner-prod-v1', documentTitle:'Astro Night Planner 1.0.2'});
const ENV = BUILD.environment === 'test' ? 'test' : 'prod';
const APP_VERSION = BUILD.appVersion || '1.0.0';
const RELEASE = BUILD.release || '1.0';
const DB_NAME = BUILD.databaseName || `astro-night-planner-${ENV}-v1`;
const DEFAULT_RELEASE_NOTES = {
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
};
const RELEASE_NOTES = BUILD.releaseNotes || DEFAULT_RELEASE_NOTES;
const DB_VERSION = 2;
const LOCAL_CATALOG_URL = 'assets/catalog.generated.json';
const REMOTE_CATALOG_URL = 'https://raw.githubusercontent.com/deepskybackyard-AC/Astro-Night-Planner/refs/heads/main/src/data/catalog.generated.json';
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
    updateAvailable:'Eine neue App-Version ist verfügbar.', updateNow:'Jetzt aktualisieren', headerEyebrow:'✦ Astrofotografie-Planung', version:'Version', profile:'lokales Profil', install:'App installieren', loading:'Planner wird vorbereitet …',
    footer:{impressum:'Impressum',datenschutz:'Datenschutz',nutzung:'Nutzungshinweise',quellen:'Datenquellen & Lizenzen',hilfe:'Hilfe',version:'Version'}, close:'Schließen', mainPlan:'Planung', mainSettings:'Einstellungen', settingsArea:'Einstellungsbereiche', profileSelect:'Aktives Benutzerprofil', helpBrowser:'Handbuch im Browser', helpPdf:'Handbuch als PDF', helpTitle:'Ausführliche browserbasierte Hilfe', helpSub:'Bedienung, Daten und Funktionen der Anwendung', helpNote:'Die Links öffnen die deutschsprachige Hilfe. Über 🌐 DE | EN wird zwischen deutscher und englischer Dokumentation gewechselt.'
  },
  en: {
    updateAvailable:'A new app version is available.', updateNow:'Update now', headerEyebrow:'✦ Astrophotography planning', version:'Version', profile:'local profile', install:'Install app', loading:'Preparing planner …',
    footer:{impressum:'Legal notice',datenschutz:'Privacy',nutzung:'Usage notes',quellen:'Data sources & licenses',hilfe:'Help',version:'Version'}, close:'Close', mainPlan:'Planning', mainSettings:'Settings', settingsArea:'Settings areas', profileSelect:'Active user profile', helpBrowser:'Open help in browser', helpPdf:'Open PDF manual', helpTitle:'Detailed browser-based help', helpSub:'Workflow, data and app functions', helpNote:'These links open the English help. Use 🌐 DE | EN to switch between German and English documentation.'
  }
};
const EN_EXACT = {
  'Planungsnacht':'Planning night','Standort und Datum gelten nur für diese Planung. Den Standardstandort legst du in den Einstellungen fest.':'Location and date apply only to this planning session. Set the default location in Settings.','Wetter aktualisieren':'Refresh weather','Standort für diese Planung':'Location for this plan','Heute':'Today','Morgen':'Tomorrow','Sonnenuntergang':'Sunset','Gewählter Zeitraum':'Selected window','Astronomische Dunkelheit':'Astronomical darkness','Sonnenaufgang':'Sunrise','Mondaufgang':'Moonrise','Mondkulmination':'Moon culmination','Monduntergang':'Moonset','Mondbeleuchtung':'Moon illumination','Profile für diese Planung':'Profiles for this plan','Alle Auswahlen sind temporär. Dauerhafte Standards werden ausschließlich in den Einstellungen geändert.':'All selections are temporary. Persistent defaults are changed only in Settings.','Planungszeitraum':'Planning window','Teleskop':'Telescope','Kamera':'Camera','Horizontprofil':'Horizon profile','Aufnahmequalitätsprofil':'Capture quality profile','Darstellungsprofil':'Display profile','Wetterdarstellung':'Weather view','Objektauswahl':'Object selection','Filter':'Filters','Suche':'Search','Filter anwenden':'Apply filters','Basisfilter zurücksetzen':'Reset basic filters','Basisfilter wurden auf Standard zurückgesetzt.':'Basic filters have been reset to defaults.','Automatische Aktualisierung nach 1,5 Sekunden; Enter sucht sofort.':'Automatic update after 1.5 seconds; Enter searches immediately.','Max. Magnitude (mag)':'Max. magnitude (mag)','Mindesthöhe (°)':'Minimum altitude (°)','Mind. Sichtbarkeit (h)':'Min. visible duration (h)','Mind. Mondabstand (°)':'Min. Moon distance (°)','Min. Objektgröße (′)':'Min. object size (′)','Max. Objektgröße (′)':'Max. object size (′)','Kataloge':'Catalogs','Objekttypen (keine Auswahl = alle)':'Object types (none selected = all)','Nur Objekte, die auf den Sensor passen':'Only objects that fit the sensor','Treffer':'results','Objekte/Seite':'Objects/page','Bewertung':'Score','Objekt':'Object','Max. Höhe':'Max. altitude','Sichtbar':'Visible','Meridian':'Meridian','Framing':'Framing','Höhenprofil':'Altitude profile','Beste Stunde':'Best hour','Mondabstand':'Moon distance','Wetter':'Weather','Größe':'Size','Mag.':'Mag.','Filterempfehlung':'Filter recommendation','Keine Objekte entsprechen den Filtern.':'No objects match the filters.','Details schließen':'Close details','Höhenkurve':'Altitude curve','Horizontansicht':'Horizon view','Rahmung mit Aladin Lite':'Framing with Aladin Lite','Einstellungen':'Settings','Lokales Profil':'Local profile','Ausrüstung':'Equipment','Zentrale Einstellungen':'Central settings','Standorte & Horizont':'Locations & horizon','Info, Hilfe & Sicherung':'Info, help & backup','Neu':'New','Duplizieren':'Duplicate','Umbenennen':'Rename','Löschen':'Delete','Bitte vor der Nutzung lesen':'Please read before use','Wichtiger Hinweis zur lokalen Datenspeicherung':'Important note on local data storage','Astro Night Planner 1.0':'Astro Night Planner 1.0','Datenstatus':'Data status','Technischer Status der lokalen Speicherung':'Technical status of local storage','Status aktualisieren':'Refresh status','Speicherschutz':'Storage protection','Lokaler Speicherverbrauch':'Local storage usage','Externe Sicherung':'External backup','Letzte Sicherung':'Last backup','Lokale Daten vor automatischer Browserbereinigung schützen':'Protect local data from automatic browser cleanup','Der Speicherschutz verhindert keine manuelle Löschung von Websitedaten.':'Storage protection does not prevent manual deletion of site data.','Automatische externe Sicherung':'Automatic external backup','Sicherungsordner auswählen':'Choose backup folder','Sicherung jetzt erstellen':'Create backup now','Gesamtsicherung wiederherstellen':'Restore full backup','Gesamtsicherung exportieren':'Export all data','Aktuelles Profil exportieren':'Export current profile','Profil importieren':'Import profile','Sicherungseinstellungen speichern':'Save backup settings','Ausführliche browserbasierte Hilfe':'Detailed browser-based help','Bedienung, Daten und Funktionen der Anwendung':'Workflow, data and app functions','Handbuch im Browser':'Open help in browser','Handbuch als PDF':'Open PDF manual','Zurück zur aktuellen Anwendung':'Back to the current app','Produktivversion':'Production version','Test':'Test','Produktion':'Production','Nicht aktiv':'Not active','Aktiv':'Active','Nicht ermittelbar':'Unknown','Zugriff vorhanden':'Access available','Freigabe erforderlich':'Permission required','Zugriff verweigert':'Access denied','Kein Ordner gewählt':'No folder selected','Kein Ziel':'No target selected','Automatische Ordnersicherung unterstützt':'Automatic folder backup supported','Automatische Ordnersicherung in diesem Browser nicht unterstützt':'Automatic folder backup is not supported in this browser','Keine geeignete Stunde im nautischen Zeitraum':'No suitable hour in the nautical window','Qualität':'Quality','Mindestrand':'Minimum margin','Alle':'All','alle':'all','keine':'none','Standard':'Default','Benutzerdefiniert':'Custom','Kompakt':'Compact','Detailliert':'Detailed','Nautischer Planungszeitraum':'Nautical planning window','Astronomische Nacht':'Astronomical night','Bürgerliche Nacht':'Civil night','Sonnenuntergang–Sonnenaufgang':'Sunset to sunrise','Nautisch + astronomisch':'Nautical + astronomical','Wetter und Aufnahmequalität':'Weather and imaging quality','Stündlicher Wetterverlauf':'Hourly weather trend','Animierte 24-Stunden-Wolkenkarte':'Animated 24-hour cloud map','Karte + Wolken':'Map + clouds','Nur Wolken':'Clouds only','Niederschlag':'Precipitation','Regen':'Rain','Schnee':'Snow','Wolkenanteil':'Cloud cover','am Prognosepunkt':'at forecast point','Meteoblue-Kontrollquellen':'Meteoblue reference sources','Datenquellen & Lizenzen':'Data sources & licenses','Nutzungshinweise':'Usage notes','Datenschutz':'Privacy','Impressum':'Legal notice'
};
Object.assign(EN_EXACT,{
  'Der Katalogfilter LDN/LBN enthält in dieser Version benannte LDN-Dunkelnebel. LBN-Objekte sind noch nicht als eigener Katalog importiert. Größenwerte der LDN-Objekte werden aus der katalogisierten Fläche als äquivalenter Kreis-Durchmesser berechnet und dienen als praktische Filter- und Rahmungshilfe.':'In this version, the LDN/LBN catalog filter contains named LDN dark nebulae. LBN objects have not yet been imported as a separate catalog. LDN size values are derived from the catalogued area as an equivalent circular diameter and are intended as practical filtering and framing aids.',
  'Mindestbewertung':'Minimum score','Mindestdauer sichtbar (h)':'Minimum visible duration (h)','Basis der Mindestdauer':'Reference for visible duration','Aktuell gewählter Planungszeitraum':'Currently selected planning window','Objektgröße-Preset':'Object size preset','Mindestgröße':'Minimum size','Maximalgröße':'Maximum size','Grad':'Degrees','Bogenminuten':'Arcminutes','Max. Flächenhelligkeit':'Max. surface brightness','Objekte ohne Größenangabe ausschließen':'Exclude objects without size information','Objekte ohne Flächenhelligkeit anzeigen':'Show objects without surface brightness','Aufnahmefilter':'Imaging filters','keine Filterangabe':'no filter information','Rahmungsfilter':'Framing filter','gut gerahmt':'well framed','knapp passend':'near edge','Objekt zu groß':'object too large','keine Rahmungsbewertung':'no framing rating','Objekttyp-Profil':'Object type profile','temporär geändert':'temporarily changed','Meine Aufnahmeziele':'My imaging targets','Zu Meine Aufnahmeziele hinzufügen':'Add to My imaging targets','Aus Meine Aufnahmeziele entfernen':'Remove from My imaging targets','Mond anzeigen':'Show Moon','Objektausrichtung zurücksetzen':'Reset object orientation','Filterprofile und Standardfilter':'Filter profiles and default filters','Standard-Mindestbewertung':'Default minimum score','Standard-Basis der Mindestdauer':'Default visible-duration reference','Standard max. Flächenhelligkeit':'Default max. surface brightness','Objektgrößen-Presets':'Object size presets','Objekttyp-Profile':'Object type profiles','Größen-Preset hinzufügen':'Add size preset','Objekttyp-Profil hinzufügen':'Add object-type profile','Aktuelle Planungs-Objekttypen übernehmen':'Use current planning object types','Filterprofile speichern':'Save filter profiles','Standorte':'Locations','Horizontprofile':'Horizon profiles','Status':'Status','Sicherung':'Backup','Hilfe':'Help','Aufnahmeziel hinzufügen':'Add imaging target','Objekt per Nummer oder Name hinzufügen':'Add object by number or name','Priorität':'Priority','Notiz':'Note','Referenzbild-Links':'Reference image links','Aufnahmeziele':'Imaging targets','Wunschziel':'target','geplant':'planned','begonnen':'started','Daten vollständig':'data complete','bearbeitet':'processed','abgeschlossen':'completed','erneut aufnehmen':'re-image','Entfernen':'Remove','Planungsnacht':'Planning night','Standort für diese Planung':'Location for this plan','Wettermodelle werden geladen …':'Loading weather models ...','Stündliche Modellwerte werden geladen …':'Loading hourly model values ...','Für diesen Planungszeitraum liegen noch keine stündlichen Modellwerte vor.':'No hourly model values are available for this planning window yet.','Mindestgröße Grad':'Minimum size degrees','Mindestgröße Bogenminuten':'Minimum size arcminutes','Maximalgröße Grad':'Maximum size degrees','Maximalgröße Bogenminuten':'Maximum size arcminutes','Objektgrößenprofil':'Object size profile','Kataloge':'Catalogs','Empfohlene Aufnahmefilter':'Recommended imaging filters','Rahmung':'Framing','Objekttypen (mindestens ein Typ erforderlich)':'Object types (at least one required)','Bitte mindestens einen Objekttyp auswählen.':'Please select at least one object type.','Aufnahmeziel suchen':'Search imaging target','Aufnahmeziel suchen und hinzufügen':'Search and add imaging target','Suchen':'Search','Suche innerhalb der aktiven Filter':'Search within active filters','Direktsuche ohne weitere Filter':'Direct search without other filters','Ignoriert alle anderen Filter.':'Ignores all other filters.','Direktsuche aktiv: andere Filter werden ignoriert.':'Direct search active: other filters are ignored.','Basisfilter zurücksetzen':'Reset basic filters','Basisfilter wurden auf Standard zurückgesetzt.':'Basic filters have been reset to defaults.','Kein passendes Objekt gefunden.':'No matching object found.','Dieses Objekt ist bereits in Meine Aufnahmeziele enthalten.':'This object is already in My imaging targets.','Objektlisteninformationen konfigurieren':'Configure object-list information','Objektliste Darstellungsprofil – aktiv':'Object-list display profile - active','Sichtbarkeit, Reihenfolge und aktives Darstellungsprofil der Objektliste.':'Visibility, order and active display profile of the object list.','Anzeige und Planung':'Display and planning','Dauerhafte Standards für neue beziehungsweise zurückgesetzte Planungen':'Persistent defaults for new or reset planning sessions','Standard-Planungszeitraum':'Default planning window','Zu Meine Aufnahmeziele hinzufügen':'Add to My imaging targets','In Meine Aufnahmeziele':'In My imaging targets','Alle Ziele':'All targets','Ziele filtern':'Filter targets','Status filtern':'Filter status','Priorität filtern':'Filter priority','Objekttyp filtern':'Filter object type','Filterempfehlung filtern':'Filter recommendation','Saison/Monat filtern':'Season/month filter','Alle Status':'All statuses','Alle Prioritäten':'All priorities','Alle Objekttypen':'All object types','Alle Filter':'All filters','Alle Monate':'All months','Zielfilter anwenden':'Apply target filters','Zielfilter zurücksetzen':'Reset target filters','Änderungen speichern':'Save changes','Gespeichert ✓':'Saved ✓','Link öffnen':'Open link','Referenz öffnen':'Open reference','Keine gültige Webadresse':'No valid web address'
});

Object.assign(EN_EXACT,{
  'Wettermodelle':'Weather models','Gewichtung für den Modellkonsens je Prognosestunde':'Weights for the model consensus per forecast hour','Summe:':'Total:','Standarddarstellung in der Planung':'Default view in planning','Einzelmodell ohne Mittelung':'Single model without averaging','Wolkenkarte und Datenmenge':'Cloud map and data volume','Auflösung, Kartenausschnitt und Standarddarstellung der animierten 24-Stunden-Prognose':'Resolution, map radius and default view of the animated 24-hour forecast','Kartendetails':'Map detail','Kartenradius':'Map radius','Animationsgeschwindigkeit':'Animation speed','Standard-Zeitschritt der Wolkenanimation':'Default time step for cloud animation','Standard-Modellansicht':'Default model view','Standard-Wolkenschicht':'Default cloud layer','Standard-Kartenmodus':'Default map mode','Standard-Kartenansicht':'Default map view','Glättung der Wolkenfelder':'Cloud-field smoothing','Prozentwerte an Prognosepunkten anzeigen':'Show percentages at forecast points','Wolkenkarte initial eingeklappt':'Cloud map initially collapsed','Meteoblue-Wetterkarte initial eingeklappt':'Meteoblue weather map initially collapsed','Deep-Sky-Gewichtung':'Deep-sky weighting','Gewichtung speichern':'Save weights','Wettermodelle speichern':'Save weather models','Wolkenkarte speichern':'Save cloud map','Wind und Aufnahmequalität':'Wind and imaging quality','Einheit für Wind, Böen und Jetstream':'Unit for wind, gusts and jet stream','Aktives Aufnahmequalitätsprofil':'Active imaging-quality profile','Tauabstand':'Dew gap','Jetstream':'Jet stream','Teleskope':'Telescopes','Teleskop hinzufügen':'Add telescope','Kameras':'Cameras','Kamera hinzufügen':'Add camera','Montierungen':'Mounts','Montierung hinzufügen':'Add mount','Name':'Name','Brennweite (mm)':'Focal length (mm)','Öffnung (mm)':'Aperture (mm)','Sensorbreite (mm)':'Sensor width (mm)','Sensorhöhe (mm)':'Sensor height (mm)','Pixelgröße (µm)':'Pixel size (µm)','Montierungsart':'Mount type','Max. Zuladung (kg, optional)':'Max. payload (kg, optional)','Aktiv':'Active','Ausrüstung speichern':'Save equipment','Standard-Mindestbewertung':'Default minimum score','Standard-Basis der Mindestdauer':'Default visible-duration reference','Standard max. Flächenhelligkeit':'Default max. surface brightness','Größen-Presets':'Size presets','Objekttyp-Profile':'Object-type profiles','Größen-Preset hinzufügen':'Add size preset','Objekttyp-Profil hinzufügen':'Add object-type profile','Filterprofile speichern':'Save filter profiles','Anzeigeeinstellungen speichern':'Save display settings','Setup-Rahmen standardmäßig anzeigen':'Show setup frame by default','Objektgröße standardmäßig anzeigen':'Show object size by default','Meteoblue standardmäßig eingeklappt':'Meteoblue initially collapsed','Höhenkurve initial eingeklappt':'Altitude curve initially collapsed','Horizontansicht initial eingeklappt':'Horizon view initially collapsed','Aufklappzustand beim Öffnen der Planung':'Collapsed sections when opening planning','Gespeicherte Aufnahmeorte':'Saved imaging locations','Standort hinzufügen':'Add location','Standort bearbeiten':'Edit location','Standardstandort':'Default location','GPS-Verhalten':'GPS behavior','Ort oder Postleitzahl':'City or postal code','Bevorzugtes Land':'Preferred country','Standort suchen':'Search location','Suche läuft …':'Searching ...','Name':'Name','Zeitzone':'Time zone','Breitengrad (°)':'Latitude (°)','Längengrad (°)':'Longitude (°)','Höhe über Meer (m)':'Elevation (m)','GPS verwenden':'Use GPS','Standort löschen':'Delete location','Interaktive Horizontprofile':'Interactive horizon profiles','Letzte Änderung rückgängig':'Undo last change','Horizont auf 0° setzen':'Reset horizon to 0°','Horizont bearbeiten':'Edit horizon','Standardprofil dieses Standorts':'Default profile for this location','Duplizieren':'Duplicate','Umbenennen':'Rename','Hindernisse':'Obstacles','Hindernis hinzufügen':'Add obstacle','Bezeichnung':'Label','Azimut (°)':'Azimuth (°)','Höhe (°)':'Altitude (°)','Standort und Horizonte speichern':'Save location and horizons','Lokales Profil':'Local profile','Einstellungen in IndexedDB, Programmdateien im PWA-Cache':'Settings in IndexedDB, app files in the PWA cache','Einstellungen, Profile, Ausrüstung, Standorte und Horizonte werden lokal in der Browserdatenbank IndexedDB gespeichert. Normale Cookies sind nicht der primäre Speicherort.':'Settings, profiles, equipment, locations and horizons are stored locally in the browser database IndexedDB. Regular cookies are not the primary storage location.','Installierbare PWA für Nachtplanung, astronomisches Wetter, Mond und Dämmerung, Deep-Sky-Auswahl, persönliche Ausrüstung, Standorte, Horizont und Rahmung.':'Installable PWA for night planning, astronomical weather, Moon and twilight, deep-sky selection, personal equipment, locations, horizon and framing.','Umgebung':'Environment','Datenbank':'Database','Version':'Version','Sicherungseinstellungen speichern':'Save backup settings','Aufnahmeziel suchen und hinzufügen':'Search and add imaging target','Katalognummer, Kurzschreibweise oder Objektname eingeben. Beispiele: M 31, NGC7000, NGC 7000, Sh2-129, Barnard 33.':'Enter a catalog number, short form or object name. Examples: M 31, NGC7000, NGC 7000, Sh2-129, Barnard 33.','Persönlicher Zielkatalog für die Frage: Was kann ich heute aufnehmen, was ich schon immer aufnehmen wollte?':'Personal target catalog for the question: what can I image tonight that I have always wanted to capture?','Dieser Katalog erscheint in der Planung als eigener Katalogfilter und ist initial nicht aktiv. Wenn nur „Meine Aufnahmeziele“ gewählt ist, gelten weiterhin alle normalen Filter wie Wetter, Mond, Rahmung, Größe und Mindestbewertung.':'This catalog appears in planning as a separate catalog filter and is initially inactive. If only My imaging targets is selected, all normal filters such as weather, Moon, framing, size and minimum score still apply.','Noch keine Aufnahmeziele gespeichert. Füge Ziele in der Objektliste oder über die Suche hinzu.':'No imaging targets saved yet. Add targets from the object list or via search.','Priorität':'Priority','Notiz':'Note','Referenzbild-Links':'Reference image links','Ein Link pro Zeile':'One link per line','Eigene Hinweise, Ziel, Palette, Setup, offene Punkte':'Own notes, purpose, palette, setup, open points','Beste Monate':'Best months','Rahmung aktuell':'Current framing','Maximalhöhe wird in der Planung standortbezogen berechnet.':'Maximum altitude is calculated for the location in planning.'
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
function tx(key){return (UI_TEXT[language]||UI_TEXT.de)[key]||UI_TEXT.de[key]||key}
function txFooter(key){return (UI_TEXT[language]||UI_TEXT.de).footer[key]||UI_TEXT.de.footer[key]||key}
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
  const footerHelp=document.getElementById('footerHelpLink'); if(footerHelp){footerHelp.textContent=txFooter('hilfe');footerHelp.href=docLink('html')}
}
function localizeExactText(root=document.body){
  if(language!=='en'||!root)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){return node.nodeValue&&node.nodeValue.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
  const nodes=[];let node;while((node=walker.nextNode()))nodes.push(node);
  for(const textNode of nodes){const raw=textNode.nodeValue;const trimmed=raw.trim();const replacement=EN_EXACT[trimmed];if(replacement)textNode.nodeValue=raw.replace(trimmed,replacement)}
  root.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(element=>{
    for(const attr of ['placeholder','aria-label','title']){const value=element.getAttribute(attr);if(value&&EN_EXACT[value])element.setAttribute(attr,EN_EXACT[value])}
  });
}
function setLanguage(next){if(next!=='de'&&next!=='en')return;language=next;try{localStorage.setItem(LANGUAGE_STORAGE_KEY,language);}catch(error){}updateStaticLanguageUi();render();}

const deepClone = value => JSON.parse(JSON.stringify(value));
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const WIND_PROFILES = {
  travel: { name: 'Leichtes Reisesetup', windGreen: 7, windYellow: 14, gustGreen: 11, gustYellow: 22 },
  normal: { name: 'Normales Setup', windGreen: 11, windYellow: 22, gustGreen: 18, gustYellow: 32 },
  robust: { name: 'Robuste Säule/Montierung', windGreen: 18, windYellow: 32, gustGreen: 29, gustYellow: 47 },
};
const WEATHER_MODEL_CONFIG = Object.freeze({
  icon: { name:'DWD ICON', model:'icon_seamless', defaultWeight:40 },
  ecmwf: { name:'ECMWF IFS', model:'ecmwf_ifs025', defaultWeight:40 },
  gfs: { name:'NOAA GFS', model:'gfs_seamless', defaultWeight:20 },
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
  ['visibleHours','Sichtbarkeitsdauer'],['meridian','Meridian'],['framing','Framing'],['miniChart','Mini-Höhenprofil'],
  ['bestHour','Beste Stunde'],['moonDistance','Mondabstand'],['weather','Wetterwert'],['size','Objektgröße'],['magnitude','Magnitude'],['filters','Filterempfehlung']
];
const DISPLAY_COLUMN_IDS = DISPLAY_COLUMNS.map(item=>item[0]);
const DISPLAY_PROFILES = {
  compact: { name:'Kompakt', pageSize:20, columns:['score','name','wikipedia','maxAltitude','visibleHours','miniChart'], columnOrder:[...DISPLAY_COLUMN_IDS] },
  standard: { name:'Standard', pageSize:20, columns:['score','name','wikipedia','maxAltitude','visibleHours','meridian','framing','miniChart'], columnOrder:[...DISPLAY_COLUMN_IDS] },
  detailed: { name:'Detailliert', pageSize:20, columns:[...DISPLAY_COLUMN_IDS], columnOrder:[...DISPLAY_COLUMN_IDS] },
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

const EXTRA_CATALOGS = ['Barnard','LDN/LBN','Meine Aufnahmeziele'];
const FILTER_KEYS = ['L','R','G','B','Ha','OIII','SII','NO_FILTER'];
const FILTER_LABELS = {L:'L',R:'R',G:'G',B:'B',Ha:'Ha',OIII:'OIII',SII:'SII',NO_FILTER:'keine Filterangabe'};
const DEFAULT_SELECTED_FILTERS = FILTER_KEYS.slice();
const FRAMING_FILTERS = [
  ['good','gut passend'],['near-edge','knapp / nahe am Rand'],['too-large','Objekt zu groß'],['unknown','keine Bewertung']
];
function degMinToArcMin(deg,min){return Math.max(0,(Number(deg)||0)*60+clamp(Math.round(Number(min)||0),0,59))}
function arcMinToDegMin(value){const total=Math.max(0,Math.round(Number(value)||0));return{deg:Math.floor(total/60),min:total%60}}
function formatDegMinArc(value){const dm=arcMinToDegMin(value);return `${dm.deg}°${String(dm.min).padStart(2,'0')}′`}
function defaultSizeProfiles(){return[{id:'size-standard',name:'Standard Deep-Sky',minDeg:0,minMin:3,maxDeg:4,maxMin:0,excludeNoSize:false}]}
function defaultObjectTypeProfiles(){return[{id:'types-all',name:'Alle Objekttypen ausgewählt',types:[]}]}
function recommendedFilterSet(object){const out=new Set();for(const raw of object.recommendedFilters||[]){const v=String(raw).trim();if(!v)continue;const u=v.toUpperCase().replace(/\s+/g,'');if(u==='RGB'){out.add('R');out.add('G');out.add('B');continue}if(u==='LRGB'){out.add('L');out.add('R');out.add('G');out.add('B');continue}if(u==='HA'||u==='H-ALPHA')out.add('Ha');else if(u==='OIII'||u==='O3')out.add('OIII');else if(u==='SII'||u==='S2')out.add('SII');else if(['L','R','G','B'].includes(u))out.add(u);}
  return out;
}
function objectMatchesCatalogSelection(object,selectedCatalogs){const selected=Array.isArray(selectedCatalogs)?selectedCatalogs:[];if(!selected.length)return true;const catalogs=object.catalogs||[];const inTargets=(profile.targets||[]).some(t=>t.objectId===object.id);return selected.some(cat=>{if(cat==='Meine Aufnahmeziele')return inTargets;if(cat==='LDN/LBN')return catalogs.some(c=>['LDN','LBN','LDN/LBN'].includes(String(c)))||/^(LDN|LBN)\s*\d+/i.test(object.id);if(cat==='Barnard')return catalogs.includes('Barnard')||/^B\s*\d+/i.test(object.id);return catalogs.includes(cat)})}
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
    id:'standard', name:'Standard', schemaVersion:7, createdAt:new Date().toISOString(), updatedAt:new Date().toISOString(),
    equipment:{
      telescopes:[], selectedTelescopeId:'',
      cameras:[], selectedCameraId:'',
      mounts:[], selectedMountId:'',
      setups:[], selectedSetupId:''
    },
    central:{
      windUnit:'kmh', activeWindProfile:'normal', windProfiles:deepClone(WIND_PROFILES),
      dew:{green:5,yellow:2}, jet:{green:36,yellow:72},
      weatherModels:{weights:{icon:40,ecmwf:40,gfs:20},defaultView:'consensus'},
      cloudMap:{gridSize:7,radiusKm:120,defaultView:'consensus',defaultLayer:'cloud',defaultMode:'clouds',defaultBaseMode:'combined',showValues:true,animationMs:900,timeStepMinutes:30,smoothing:'balanced',collapsed:false,meteoblueMapCollapsed:true},
      weights:{clouds:30,transparency:15,seeing:10,wind:10,dew:10,moon:10,altitude:10,duration:5},
      qualityThresholds:{yellow:60,green:80},
      filterDefaults:{minScore:0,visibilityBasis:'nautical',showNoSurfaceBrightness:true,surfaceBrightnessMax:99,selectedFilters:DEFAULT_SELECTED_FILTERS.slice(),framingFilter:['good','near-edge','too-large','unknown']},
      sizeProfiles:defaultSizeProfiles(),activeSizeProfileId:'size-standard',objectTypeProfiles:defaultObjectTypeProfiles(),activeObjectTypeProfileId:'types-all',
      defaultPlanningWindow:'nautical', defaultLocationId:'', gpsBehavior:'last', locationSearchCountry:'DE',
      framing:{minMarginPercent:10,autoRotate:true},
      aladinLabels:{visible:true,detail:'auto'},
      aladinSurveys:defaultAladinSurveys(),
      listDisplay:{activeProfile:'standard',profiles:deepClone(DISPLAY_PROFILES)},
      objectSizeVisible:false, frameVisible:true, meteoblueCollapsed:true,
      detailPanels:{altitudeCollapsed:true,horizonCollapsed:true},
      collapsed:{profiles:false,weatherSummary:false,weatherHourly:false,weather:false,meteoblue:true,filters:false,framing:false},
      persistentStorageRequested:false
    },
    locations:[], selectedLocationId:'',
    planning:{dateKey:'',locationId:null,planningWindow:'nautical',temporaryWindProfile:null,temporaryDisplayProfile:null,temporaryWeatherView:null,temporarySetupId:null,temporaryTelescopeId:null,temporaryCameraId:null,temporaryHorizonProfileId:null,cloudMapTimeStepMinutes:null,
      temporaryCloudMapView:null,temporaryCloudMapBaseMode:null,temporaryCloudSmoothing:null,temporaryCloudMapShowValues:null,cloudMapLayer:'cloud',cloudMapMode:'clouds',cloudMapFrame:0,cloudMapWeatherOverlays:{precip:true,rain:true,snow:true},
      search:'',directSearch:'',catalogs:['Messier','NGC','IC','Sh2','Abell','Zusatzkatalog'],types:[],objectTypeProfileId:'types-all',objectTypeProfileCustom:false,maxMagnitude:16,minAltitude:25,minVisibleHours:1.5,visibilityBasis:'nautical',minMoonDistance:25,
      minSize:3,maxSize:240,sizeProfileId:'size-standard',excludeNoSize:false,minScore:0,selectedFilters:DEFAULT_SELECTED_FILTERS.slice(),framingFilter:['good','near-edge','too-large','unknown'],surfaceBrightnessMax:99,showNoSurfaceBrightness:true,onlyFits:false,page:1,pageSize:20,selectedObjectId:'M31',detailsOpen:false,objectRotation:35,objectRotationObjectId:null,frameRotation:0,timeFraction:.5,showMoonInAladin:false,
      detailTimeFraction:0,showGroundHorizon:true,comparisonSetupIds:[]},
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
let page=1;
let scrollByTab={plan:0,settings:0};
let dirtySections=new Set();
let openDisplayConfigKey=null;
let swRegistration=null;
let saveFeedbackSections=new Set();
let horizonUndoStack=[];
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
  out.equipment.setups=out.equipment.setups.map((setup,index)=>({id:setup.id||`setup-${index}`,name:String(setup.name||'Setup'),telescopeId:setup.telescopeId||out.equipment.telescopes[0]?.id||'',cameraId:setup.cameraId||out.equipment.cameras[0]?.id||'',mountId:setup.mountId||out.equipment.mounts[0]?.id||''}));
  if(!out.equipment.setups.length)out.equipment.setups=[{id:'setup-auto',name:`${out.equipment.telescopes[0]?.name||'Teleskop'} + ${out.equipment.cameras[0]?.name||'Kamera'}`,telescopeId:out.equipment.telescopes[0]?.id||'',cameraId:out.equipment.cameras[0]?.id||'',mountId:out.equipment.mounts[0]?.id||''}];
  out.equipment.setups=out.equipment.setups.map(setup=>({ ...setup,
    telescopeId:out.equipment.telescopes.some(item=>item.id===setup.telescopeId)?setup.telescopeId:(out.equipment.selectedTelescopeId||out.equipment.telescopes[0]?.id||''),
    cameraId:out.equipment.cameras.some(item=>item.id===setup.cameraId)?setup.cameraId:(out.equipment.selectedCameraId||out.equipment.cameras[0]?.id||''),
    mountId:out.equipment.mounts.some(item=>item.id===setup.mountId)?setup.mountId:(out.equipment.selectedMountId||out.equipment.mounts[0]?.id||'')
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
  out.central.cloudMap={...base.central.cloudMap,...(p.central?.cloudMap||{})};
  out.central.weights={...base.central.weights,...(p.central?.weights||{})};
  out.central.qualityThresholds={...base.central.qualityThresholds,...(p.central?.qualityThresholds||{})};
  out.central.aladinLabels={...base.central.aladinLabels,...(p.central?.aladinLabels||{})};
  out.central.aladinSurveys=normalizeAladinSurveys(p.central?.aladinSurveys||base.central.aladinSurveys);
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
    if(!value.columns.includes('name'))value.columns.unshift('name');
    if(!value.columns.includes('wikipedia'))value.columns.push('wikipedia');
    const legacyOrder=(Array.isArray(value.columnOrder)?value.columnOrder:value.columns).map(id=>id==='bestTime'?'bestHour':id).filter(id=>DISPLAY_COLUMN_IDS.includes(id));
    value.columnOrder=[...new Set([...legacyOrder,...DISPLAY_COLUMN_IDS])];
  }
  out.central.detailPanels={...base.central.detailPanels,...(p.central?.detailPanels||{})};
  out.central.collapsed={...base.central.collapsed,...(p.central?.collapsed||{})};
  out.locations=(p.locations?.length?p.locations:base.locations).map((x,locationIndex)=>{
    const horizon=Array.isArray(x.horizon)&&x.horizon.length===8?x.horizon.map(value=>clamp(Number(value)||0,0,90)):[0,0,0,0,0,0,0,0];
    const legacyValues=Array.isArray(x.horizonProfile)&&x.horizonProfile.length===73?x.horizonProfile.map(value=>clamp(Number(value)||0,0,90)):Array.from({length:73},(_,index)=>{const position=index*5/45,lower=Math.floor(position)%8,upper=(lower+1)%8,fraction=position-Math.floor(position);return horizon[lower]*(1-fraction)+horizon[upper]*fraction});
    legacyValues[72]=legacyValues[0];
    let profiles=Array.isArray(x.horizonProfiles)&&x.horizonProfiles.length?x.horizonProfiles.map((entry,index)=>{
      const values=Array.isArray(entry.horizonProfile)&&entry.horizonProfile.length===73?entry.horizonProfile.map(value=>clamp(Number(value)||0,0,90)):legacyValues.slice();
      values[72]=values[0];
      return{id:entry.id||`horizon-${locationIndex}-${index}`,name:String(entry.name||`Horizont ${index+1}`),horizonProfile:values,obstacles:(entry.obstacles||[]).map(item=>({...item}))};
    }):[{id:x.defaultHorizonProfileId||`horizon-${locationIndex}-standard`,name:'Standardhorizont',horizonProfile:legacyValues.slice(),obstacles:(x.obstacles||[]).map(item=>({...item}))}];
    const defaultId=profiles.some(item=>item.id===x.defaultHorizonProfileId)?x.defaultHorizonProfileId:profiles[0].id;
    const selectedId=profiles.some(item=>item.id===x.selectedHorizonProfileId)?x.selectedHorizonProfileId:defaultId;
    const selected=profiles.find(item=>item.id===selectedId)||profiles[0];
    return{...x,horizonProfiles:profiles,defaultHorizonProfileId:defaultId,selectedHorizonProfileId:selectedId,horizonProfile:selected.horizonProfile.slice(),horizon:Array.from({length:8},(_,index)=>Number(selected.horizonProfile[index*9]||0)),obstacles:selected.obstacles.map(item=>({...item}))};
  });
  out.planning={...base.planning,...(p.planning||{})};
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
  out.targets=Array.isArray(p.targets)?p.targets.map(x=>({...x,objectId:String(x.objectId||x.id||''),id:x.id||`target-${String(x.objectId||x.id||'').replace(/\W/g,'-')}`,note:x.note||'',priority:x.priority||'normal',status:x.status||'Wunschziel',referenceLinks:Array.isArray(x.referenceLinks)?x.referenceLinks:[]})).filter(x=>x.objectId):[];
  out.targetFilters={search:String(p.targetFilters?.search||''),status:p.targetFilters?.status||'all',priority:p.targetFilters?.priority||'all',type:p.targetFilters?.type||'all',filter:p.targetFilters?.filter||'all',month:p.targetFilters?.month||'all'};
  if(Number(p.schemaVersion||0)<6){
    const selected=BUILTIN_OBJECTS.find(item=>item.id===out.planning.selectedObjectId);
    out.planning.objectRotation=normalizedAngle180((Number(selected?.positionAngleDeg)||0)+(Number(out.planning.objectRotation)||0));
  }
  out.schemaVersion=7;
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
  selectedDateKey=profile.planning.dateKey||dateKeyFor(new Date(),activeLocation()?.timezone||'Europe/Berlin'); page=profile.planning.page||1;
  await refreshStorageInfo();
  updateProfileSelectors(); bindGlobal(); render(); registerPwa(); loadCatalog(); fetchWeather();
  window.setTimeout(()=>maybeAutomaticBackup('daily'),1200);
}


function releaseNotesListHtml(lang=language){
  const notes=Array.isArray(RELEASE_NOTES?.[lang])?RELEASE_NOTES[lang]:(Array.isArray(DEFAULT_RELEASE_NOTES[lang])?DEFAULT_RELEASE_NOTES[lang]:[]);
  if(!notes.length)return '';
  return `<ul>${notes.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`;
}
function versionNotesHtml(lang=language){
  const title=lang==='en'?'Changes in this version':'Änderungen in dieser Version';
  return `<h3>${title}</h3>${releaseNotesListHtml(lang)}`;
}
async function loadOnlineVersionInfo(){
  try{
    const response=await fetch(`./VERSION.json?update=${Date.now()}`,{cache:'no-store'});
    if(!response.ok)return null;
    return await response.json();
  }catch(error){return null}
}
function notesFromVersionInfo(info,lang=language){
  const changes=info?.changes?.[lang]||info?.changes?.de||info?.changes?.en;
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
      message=language==='en'?`A new app version ${info.version} is available.`:`Eine neue App-Version ${info.version} ist verfügbar.`;
    }
    if(notes.length){
      const lead=language==='en'?'What\'s new':'Neu';
      message+=` ${lead}: ${notes.slice(0,2).join(' · ')}`;
    }
    text.textContent=message;
  }
  banner.hidden=false;
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
    quellen:{title:'Datenquellen & Lizenzen',html:`<ul><li><strong>Wetter:</strong> Open-Meteo mit DWD ICON, ECMWF IFS und NOAA GFS.</li><li><strong>Karten und Geocoding:</strong> OpenStreetMap/Nominatim, OpenFreeMap und MapLibre GL JS einschließlich MapLibre-Demotiles für die Geländeschattierung. OpenStreetMap-Daten © OpenStreetMap-Mitwirkende.</li><li><strong>Himmelsbild:</strong> Aladin Lite und CDS Strasbourg; genutzte Surveys unterliegen den Angaben der jeweiligen Datenanbieter.</li><li><strong>Kontrollvorhersage:</strong> Meteoblue Astronomy Seeing und Meteoblue-Wetterkarten.</li><li><strong>Astronomische Berechnungen:</strong> Astronomy Engine sowie anwendungseigene Berechnungen.</li><li><strong>Objektkatalog:</strong> mitgelieferter Planner-Katalog; optionaler Rohdatenabruf aus dem zugehörigen GitHub-Repository.</li></ul>`},
    version:{title:'Version',html:`<p><strong>Astro Night Planner ${esc(RELEASE)}</strong></p><p>Programmversion: <code>${esc(APP_VERSION)}</code><br>Umgebung: <code>${esc(ENV==='test'?'TESTVERSION':'Produktivversion')}</code><br>Profilschema: 7</p>${versionNotesHtml('de')}<p>© Andreas Cordt · <a href="https://www.deepskyastrophoto.de" target="_blank" rel="noopener noreferrer">www.deepskyastrophoto.de</a></p>`}
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
    selectedDateKey=profile.planning.dateKey||dateKeyFor(new Date(),activeLocation()?.timezone||'Europe/Berlin');
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
  document.getElementById('reloadForUpdate').addEventListener('click',()=>location.reload());
  window.addEventListener('resize',layoutFramingOverlays,{passive:true});
}
function updateProfileSelectors(){
  const select=document.getElementById('headerProfileSelect'); if(!select)return;
  select.innerHTML=profiles.sort((a,b)=>a.name.localeCompare(b.name,'de')).map(p=>`<option value="${esc(p.id)}" ${profile&&p.id===profile.id?'selected':''}>${esc(p.name)}</option>`).join('');
  document.getElementById('headerProfileName').textContent=profile?.name||'Standard';
}
async function switchMain(tab){scrollByTab[currentMainTab]=scrollY;if(tab!=='plan')stopCloudMapAnimation();currentMainTab=tab;profile.ui.mainTab=tab;await saveProfile();render();if(tab==='plan'&&!cloudMapData)fetchCloudMap();requestAnimationFrame(()=>scrollTo({top:scrollByTab[tab]||0,behavior:'instant'}));}

function activeLocation(){const id=profile.planning?.locationId||profile.central?.defaultLocationId||profile.selectedLocationId;return profile.locations.find(x=>x.id===id)||profile.locations[0]||standardProfile().locations[0]}
function activeSetup(){const id=profile.planning?.temporarySetupId||profile.equipment.selectedSetupId;return (profile.equipment.setups||[]).find(x=>x.id===id)||(profile.equipment.setups||[])[0]||null}
function activeScope(){const setup=activeSetup();const id=profile.planning?.temporaryTelescopeId||setup?.telescopeId||profile.equipment.selectedTelescopeId;return profile.equipment.telescopes.find(x=>x.id===id)||profile.equipment.telescopes[0]}
function activeCamera(){const setup=activeSetup();const id=profile.planning?.temporaryCameraId||setup?.cameraId||profile.equipment.selectedCameraId;return profile.equipment.cameras.find(x=>x.id===id)||profile.equipment.cameras[0]}
function activeMount(){return profile.equipment.mounts?.find(x=>x.id===profile.equipment.selectedMountId)}
function fov(){const s=activeScope(),c=activeCamera();if(!s||!c||!s.focalLength)return null;return {width:57.2958*c.sensorWidth/s.focalLength,height:57.2958*c.sensorHeight/s.focalLength,pixelScale:206.265*c.pixelSize/s.focalLength}}
function fovForSetup(setup){const s=profile.equipment.telescopes.find(x=>x.id===setup?.telescopeId),c=profile.equipment.cameras.find(x=>x.id===setup?.cameraId);if(!s||!c||!s.focalLength)return null;return {width:57.2958*c.sensorWidth/s.focalLength,height:57.2958*c.sensorHeight/s.focalLength,pixelScale:206.265*c.pixelSize/s.focalLength,name:setup.name,id:setup.id}}
function esc(v){return String(v??'').replace(/[&<>"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]))}
function fmt(v,d=0){return Number.isFinite(v)?Number(v).toFixed(d):'–'}
function toRad(x){return x*Math.PI/180} function toDeg(x){return x*180/Math.PI}
function dateKeyFor(date,tz='Europe/Berlin'){return new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).format(date)}
function addDays(key,n){const d=new Date(`${key}T12:00:00Z`);d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
function fmtDate(key,tz){return new Intl.DateTimeFormat('de-DE',{timeZone:tz,weekday:'short',day:'2-digit',month:'2-digit'}).format(new Date(`${key}T12:00:00Z`))}
function fmtTime(date,tz){if(!date||isNaN(date))return'–';return new Intl.DateTimeFormat('de-DE',{timeZone:tz,hour:'2-digit',minute:'2-digit'}).format(date)}
function fmtEventTime(date,tz,emptyText){return(!date||isNaN(date))?emptyText:fmtTime(date,tz)}
function moonEventDisplay(date,type,night,windowRange,loc){
  const before=`${type==='rise'?'Mondaufgang':'Monduntergang'} liegt vor dem Planungszeitraum`;
  const after=`${type==='rise'?'Mondaufgang':'Monduntergang'} liegt nach dem Planungszeitraum`;
  const none=`kein ${type==='rise'?'Mondaufgang':'Monduntergang'} in dieser Nacht`;
  if(date&&!isNaN(date)){if(date<windowRange.start)return before;if(date>windowRange.end)return after;return fmtTime(date,loc.timezone)}
  const moonStart=moonCoords(windowRange.start),moonEnd=moonCoords(windowRange.end);
  const altStart=altitude(moonStart.raHours,moonStart.decDeg,windowRange.start,loc.latitude,loc.longitude);
  const altEnd=altitude(moonEnd.raHours,moonEnd.decDeg,windowRange.end,loc.latitude,loc.longitude);
  if(type==='rise'&&altStart>0)return before;
  if(type==='set'&&altEnd>0)return after;
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
function nightData(key,loc){const center=new Date(`${key}T12:00:00Z`),start=new Date(center.getTime()-2*3600000),end=new Date(center.getTime()+26*3600000);const cross=t=>findCrossings(start,end,loc,t);const c0=cross(-.833),c6=cross(-6),c12=cross(-12),c18=cross(-18);const desc=a=>a.find(x=>x.descending)?.time,asc=a=>[...a].reverse().find(x=>!x.descending)?.time;const sunset=desc(c0)||new Date(`${key}T18:00:00Z`),sunrise=asc(c0)||new Date(sunset.getTime()+12*3600000);const moonFn=(date,l)=>{const c=moonCoords(date);return altitude(c.raHours,c.decDeg,date,l.latitude,l.longitude)};const mc=findCrossings(sunset,sunrise,loc,0,moonFn);let moonMax=-90,moonTransit=null;for(let t=sunset.getTime();t<=sunrise.getTime();t+=10*60000){const a=moonFn(new Date(t),loc);if(a>moonMax){moonMax=a;moonTransit=new Date(t)}}return{sunset,sunrise,civilDusk:desc(c6)||sunset,civilDawn:asc(c6)||sunrise,nauticalDusk:desc(c12)||desc(c6)||sunset,nauticalDawn:asc(c12)||asc(c6)||sunrise,astronomicalDusk:desc(c18)||desc(c12)||sunset,astronomicalDawn:asc(c18)||asc(c12)||sunrise,moonrise:mc.find(x=>!x.descending)?.time,moonset:mc.find(x=>x.descending)?.time,moonTransit,moonMaxAltitude:moonMax,moonIllumination:moonIllumination(new Date((sunset.getTime()+sunrise.getTime())/2))}}
function planningWindow(night,key){switch(key){case'sunset':return{start:night.sunset,end:night.sunrise,label:'Sonnenuntergang bis Sonnenaufgang'};case'civil':return{start:night.civilDusk,end:night.civilDawn,label:'Bürgerliche Nacht'};case'astronomicalTwilight':return{start:night.nauticalDusk,end:night.nauticalDawn,label:'Nautische und astronomische Nacht'};case'astronomicalNight':return{start:night.astronomicalDusk,end:night.astronomicalDawn,label:'Astronomische Nacht'};default:return{start:night.nauticalDusk,end:night.nauticalDawn,label:'Nautischer Planungszeitraum'}}}
function angularSeparation(aRa,aDec,bRa,bDec){const a=toRad(aRa*15),b=toRad(bRa*15),da=toRad(aDec),db=toRad(bDec);return toDeg(Math.acos(clamp(Math.sin(da)*Math.sin(db)+Math.cos(da)*Math.cos(db)*Math.cos(a-b),-1,1)))}
function horizonProfilesFor(loc){
  if(!loc)return[];
  if(!Array.isArray(loc.horizonProfiles)||!loc.horizonProfiles.length){
    const values=Array.isArray(loc.horizonProfile)&&loc.horizonProfile.length===73?loc.horizonProfile.slice():Array(73).fill(0);
    values[72]=values[0];
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
function ensureHorizonProfile(loc,preferredId=null){const entry=horizonProfileFor(loc,preferredId);if(!entry)return Array(73).fill(0);if(!Array.isArray(entry.horizonProfile)||entry.horizonProfile.length!==73)entry.horizonProfile=Array(73).fill(0);entry.horizonProfile[72]=entry.horizonProfile[0];return entry.horizonProfile}
function horizonObstacles(loc,preferredId=null){return(horizonProfileFor(loc,preferredId)?.obstacles||[])}
function horizonAt(loc,az,preferredId=null){const normalized=((az%360)+360)%360;const values=ensureHorizonProfile(loc,preferredId);const pos=normalized/5,i=Math.floor(pos),j=Math.min(72,i+1),f=pos-i;return Number(values[i]||0)*(1-f)+Number(values[j]||0)*f}
function syncCardinalHorizon(loc,preferredId=null){const values=ensureHorizonProfile(loc,preferredId);values[72]=values[0];const entry=horizonProfileFor(loc,preferredId);loc.horizonProfile=values.slice();loc.horizon=Array.from({length:8},(_,index)=>Number(values[index*9]||0));loc.obstacles=(entry?.obstacles||[]).map(item=>({...item}))}


function objectStats(obj,window,loc,minAlt){const points=[];let max=-90,best=window.start,visibleMs=0;const count=49;for(let i=0;i<count;i++){const t=new Date(window.start.getTime()+(window.end-window.start)*i/(count-1));const alt=altitude(obj.raHours,obj.decDeg,t,loc.latitude,loc.longitude);const az=azimuth(obj.raHours,obj.decDeg,t,loc.latitude,loc.longitude);const effectiveMin=Math.max(minAlt,horizonAt(loc,az));points.push({t,alt,az});if(alt>max){max=alt;best=t}if(i&&alt>=effectiveMin)visibleMs+=(window.end-window.start)/(count-1)}const moon=moonCoords(best);const moonAlt=altitude(moon.raHours,moon.decDeg,best,loc.latitude,loc.longitude);return{points,maxAltitude:max,bestTime:best,visibleHours:visibleMs/3600000,meridian:best,moonDistance:angularSeparation(obj.raHours,obj.decDeg,moon.raHours,moon.decDeg),moonAltitude:moonAlt}}

function currentWindProfile(){return profile.planning.temporaryWindProfile||profile.central.activeWindProfile}
function currentDisplayProfile(){return profile.planning.temporaryDisplayProfile||profile.central.listDisplay.activeProfile}
function visibleDisplayColumns(display){const order=Array.isArray(display?.columnOrder)?display.columnOrder:DISPLAY_COLUMN_IDS;const visible=new Set(Array.isArray(display?.columns)?display.columns:['name']);visible.add('name');const result=order.filter(id=>visible.has(id)&&DISPLAY_COLUMN_IDS.includes(id));return result.length?result:['name']}

function currentWeatherView(){return profile.planning.temporaryWeatherView||profile.central.weatherModels?.defaultView||'consensus'}
function weatherViewLabel(view=currentWeatherView()){return optionLabel(WEATHER_VIEW_OPTIONS.find(([key])=>key===view)?.[1]||'Modellkonsens')}
function cardinal(azimuth){const names=['N','NO','O','SO','S','SW','W','NW'];return names[Math.round((((azimuth%360)+360)%360)/45)%8]}
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

async function loadCatalog(){try{const cached=await idbGet('cache','catalog-v11');if(cached?.value?.length){catalog=mergeCatalog(cached.value);render()}let rows=null,lastError=null;for(const url of [LOCAL_CATALOG_URL,REMOTE_CATALOG_URL]){try{const response=await fetch(url,{cache:'no-cache'});if(!response.ok)throw new Error(`${url}: HTTP ${response.status}`);const candidate=await response.json();if(!Array.isArray(candidate)||!candidate.length)throw new Error(`${url}: ungültiger Katalog`);rows=candidate;break}catch(error){lastError=error}}if(!rows)throw lastError||new Error('Kein Katalog verfügbar');const converted=rows.map(r=>({id:r[0],name:r[1],aliases:r[2]||[],type:r[3],raHours:r[4],decDeg:r[5],magnitude:r[6]??null,surfaceBrightness:r[7]??null,majorArcMin:r[8]||0,minorArcMin:r[9]||r[8]||0,constellation:r[10]||'–',recommendedFilters:r[11]||[],catalogs:r[12]||['Zusatzkatalog'],positionAngleDeg:Number.isFinite(r[13])?r[13]:0}));catalog=mergeCatalog(converted);await idbPut('cache',{key:'catalog-v11',value:converted,updatedAt:new Date().toISOString()});render();}catch(err){console.warn('Katalog-Fallback aktiv',err)}}
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
  return{precip:true,rain:true,snow:true,...(profile.planning.cloudMapWeatherOverlays||{})};
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
function dateKeys(){const today=dateKeyFor(new Date(),activeLocation().timezone);return Array.from({length:8},(_,i)=>addDays(today,i))}

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
      <div class="data-actions"><button type="button" data-open-settings="locations">Standort jetzt anlegen</button><button type="button" data-open-settings="equipment" class="secondary">Ausrüstung erfassen</button></div>
    </section>
    <section class="card"><h2>Erste Schritte</h2><p>1. Standort anlegen und speichern. 2. Unter Ausrüstung Teleskop, Kamera und optional Setup erfassen. 3. Zur Planung zurückkehren und die Nacht berechnen lassen.</p></section>
  </div>`;
}
function renderPlan(){
  ensurePlanningObjectTypes();
  const loc=activeLocation();
  if(!loc)return renderFirstRunPlan();
  const keys=dateKeys();
  if(!keys.includes(selectedDateKey))selectedDateKey=keys[0];
  const night=nightData(selectedDateKey,loc),windowRange=planningWindow(night,profile.planning.planningWindow),weather=weatherForWindow(windowRange),objects=computeObjects(windowRange,night,weather);
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
      <div class="section-title-row"><div><h2>Planungsnacht</h2><div class="muted">Standort und Datum gelten nur für diese Planung. Den Standardstandort legst du in den Einstellungen fest.</div></div><button id="weatherRefresh">Wetter aktualisieren</button></div>
      <div class="planning-night-selector" style="margin-top:14px"><label class="planning-location-select">Standort für diese Planung<select id="planningLocationSelect">${locationOptions}</select><span class="planning-location-coordinates">${fmt(loc.latitude,4)}°, ${fmt(loc.longitude,4)}° · ${fmt(Number(loc.elevation)||0)} m</span></label><div class="date-buttons">${keys.map((key,index)=>`<button data-date="${key}" class="${key===selectedDateKey?'active':''}">${index===0?'Heute':index===1?'Morgen':`+${index}`}<br><span class="small">${fmtDate(key,loc.timezone)}</span></button>`).join('')}</div></div>
      <div class="grid four" style="margin-top:14px"><div class="metric"><div class="label">Sonnenuntergang</div><div class="value">${fmtTime(night.sunset,loc.timezone)}</div></div><div class="metric"><div class="label">Gewählter Zeitraum</div><div class="value">${fmtTime(windowRange.start,loc.timezone)}–${fmtTime(windowRange.end,loc.timezone)}</div><div class="small muted">${windowRange.label}</div></div><div class="metric"><div class="label">Astronomische Dunkelheit</div><div class="value">${fmtTime(night.astronomicalDusk,loc.timezone)}–${fmtTime(night.astronomicalDawn,loc.timezone)}</div></div><div class="metric"><div class="label">Sonnenaufgang</div><div class="value">${fmtTime(night.sunrise,loc.timezone)}</div></div></div>
      <div class="grid four" style="margin-top:12px"><div class="metric"><div class="label">Mondaufgang</div><div class="value moon-event-value">${moonEventDisplay(night.moonrise,'rise',night,windowRange,loc)}</div></div><div class="metric"><div class="label">Mondkulmination</div><div class="value">${fmtTime(night.moonTransit,loc.timezone)} · ${fmt(night.moonMaxAltitude)}°</div></div><div class="metric"><div class="label">Monduntergang</div><div class="value moon-event-value">${moonEventDisplay(night.moonset,'set',night,windowRange,loc)}</div></div><div class="metric"><div class="label">Mondbeleuchtung</div><div class="value">${fmt(night.moonIllumination)} %</div></div></div>
    </section>
    <section class="card collapsible-card">
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
    </section>
    ${renderWeather(windowRange,weather,loc,night)}${renderCloudMap(windowRange,loc,night)}${renderMeteoblue(loc)}
    <section class="card"><div class="section-title-row"><h2>Objektauswahl</h2><span class="muted">${objects.length} Treffer aus ${catalog.length} Katalogobjekten</span></div>${renderFilters()}${pagination(totalPages,objects.length)}${renderObjectTable(shown,visibleDisplayColumns(display),loc,windowRange,night)}${pagination(totalPages,objects.length)}</section>
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
    score:'Bewertung',name:'Objekt',wikipedia:'Wiki',maxAltitude:'Max. Höhe',visibleHours:'Sichtbar',meridian:'Meridian',
    framing:'Framing',miniChart:'Höhenprofil',bestHour:'Beste Stunde',moonDistance:'Mondabstand',
    weather:'Wetter',size:'Größe',magnitude:'Mag.',filters:'Filter'
  };
  const body=items.map(item=>{
    const object=item.object;
    const isOpen=profile.planning.detailsOpen&&profile.planning.selectedObjectId===object.id;
    const row=`<tr class="object-row ${isOpen?'selected':''}" data-object-row="${esc(object.id)}" tabindex="0" aria-expanded="${isOpen?'true':'false'}">${columns.map(column=>objectCell(column,item,loc,windowRange,night)).join('')}</tr>`;
    const detail=isOpen?`<tr class="object-detail-row"><td colspan="${columns.length}">${renderObjectDetails(object,windowRange,loc,night)}</td></tr>`:'';
    return row+detail;
  }).join('');
  return `<div class="object-table-wrap"><table class="object-table"><thead><tr>${columns.map(column=>`<th>${heads[column]||column}</th>`).join('')}</tr></thead><tbody>${body||`<tr><td colspan="${columns.length}">Keine Objekte entsprechen den Filtern.</td></tr>`}</tbody></table></div>`;
}
function objectCell(column,item,loc,windowRange,night){
  const object=item.object;
  const stats=item.stats;
  switch(column){
    case'score':return`<td><span class="score-badge ${scoreClass(item.score)}">${fmt(item.score)}</span></td>`;
    case'name':{const isTarget=targetObjectIds().has(object.id);return`<td><div class="object-name">${esc(object.id)} · ${esc(object.name)}</div><div class="small muted">${esc(object.type)} · ${esc(object.constellation)} · ${esc(object.catalogs.join(', '))}</div><button type="button" class="target-inline-button ${isTarget?'active':''}" data-toggle-target="${esc(object.id)}">${isTarget?'✓ In Meine Aufnahmeziele':'Zu Meine Aufnahmeziele hinzufügen'}</button></td>`;}
    case'wikipedia':return`<td class="wiki-cell"><button type="button" class="wiki-inline-button" data-wikipedia-object="${esc(object.id)}" title="Wikipedia" aria-label="Wikipedia für ${esc(object.id)} öffnen">W</button></td>`;
    case'maxAltitude':return`<td>${fmt(stats.maxAltitude)}°</td>`;
    case'visibleHours':return`<td>${fmt(stats.visibleHours,1)} h</td>`;
    case'meridian':return`<td>${fmtTime(stats.meridian,loc.timezone)}<br><span class="small muted">${fmt(stats.maxAltitude)}°</span></td>`;
    case'framing':return`<td><button data-frame-object="${esc(object.id)}">${esc(item.fit)}</button><div class="small muted">Mindestrand ${Number.isFinite(item.framing?.minMargin)?fmt(item.framing.minMargin,1)+' %':'–'}</div></td>`;
    case'miniChart':return`<td><canvas class="mini-chart" width="230" height="92" data-points="${encodeURIComponent(JSON.stringify(stats.points.map(point=>[point.t.getTime(),point.alt])))}" data-start="${windowRange.start.getTime()}" data-end="${windowRange.end.getTime()}" data-civil-start="${night.civilDusk.getTime()}" data-civil-end="${night.civilDawn.getTime()}" data-astro-start="${night.astronomicalDusk.getTime()}" data-astro-end="${night.astronomicalDawn.getTime()}" data-naut-start="${night.nauticalDusk.getTime()}" data-naut-end="${night.nauticalDawn.getTime()}" data-min-alt="${profile.planning.minAltitude}"></canvas></td>`;
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
  const points=objectStats(o,{start:night.sunset,end:night.sunrise},loc,profile.planning.minAltitude).points.map(point=>[
    point.t.getTime(),Number(point.alt.toFixed(3)),Number(point.az.toFixed(3))
  ]);
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
function renderTwilightLegend(){
  return`<div class="twilight-legend" aria-label="Legende der Dämmerungsphasen">
    <span><i class="legend-civil"></i>Bürgerliche Dämmerung</span>
    <span><i class="legend-nautical"></i>Nautische Dämmerung</span>
    <span><i class="legend-astronomical"></i>Astronomische Dämmerung</span>
    <span><i class="legend-night"></i>Astronomische Nacht</span>
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
  const altitudePoints=fullStats.points.map(point=>[point.t.getTime(),Number(point.alt.toFixed(3)),Number(point.az.toFixed(3)),Number(horizonAt(loc,point.az,horizonEntry?.id).toFixed(3))]);
  const horizonPoints=Array.from({length:73},(_,index)=>[index*5,Number(horizonAt(loc,index*5,horizonEntry?.id).toFixed(3))]);
  const obstacles=horizonObstacles(loc,horizonEntry?.id).map(item=>({name:item.name||'Hindernis',azimuth:Number(item.azimuth)||0,altitude:Number(item.altitude)||0}));
  const detailTime=detailTimeState(o,night,loc),horizonOptions=horizonProfilesFor(loc).map(item=>`<option value="${esc(item.id)}" ${item.id===horizonEntry?.id?'selected':''}>${esc(item.name)}${item.id===loc.defaultHorizonProfileId?' (Standard)':''}</option>`).join('');
  const isTarget=targetObjectIds().has(o.id);
  return`<div class="object-detail-card" id="objectDetail-${esc(o.id)}">
    <div class="object-detail-header"><div><div class="eyebrow">Objektdetails</div><h2>${esc(o.id)} · ${esc(o.name)}</h2><div class="small muted">${esc(o.type)} · ${esc(o.constellation)} · Größe ${fmt(o.majorArcMin)}′ × ${fmt(o.minorArcMin)}′ · Filter ${esc((o.recommendedFilters||[]).join(', ')||'–')}</div></div><div class="data-actions"><button type="button" data-toggle-target="${esc(o.id)}" class="${isTarget?'active':''}">${isTarget?'Aus Meine Aufnahmeziele entfernen':'Zu Meine Aufnahmeziele hinzufügen'}</button><button type="button" data-wikipedia-object="${esc(o.id)}">Wikipedia</button><button type="button" class="close-detail-button" data-close-object-details aria-label="Detailansicht schließen">✕ Details schließen</button></div></div>
    <div class="grid four object-detail-metrics"><div class="metric"><div class="label">Maximalhöhe im Planungszeitraum</div><div class="value">${fmt(selectedStats.maxAltitude)}°</div></div><div class="metric"><div class="label">Beste Stunde im nautischen Zeitraum</div><div class="value">${(()=>{const best=bestObjectHour(o,night,loc,profile.planning.minAltitude);return best?`${fmtTime(best.time,loc.timezone)} · Q ${fmt(best.quality)}`:'Keine geeignete Stunde'})()}</div></div><div class="metric"><div class="label">Sichtbar über Grenzhöhe</div><div class="value">${fmt(selectedStats.visibleHours,1)} h</div></div><div class="metric"><div class="label">Mondabstand</div><div class="value">${fmt(selectedStats.moonDistance)}°</div></div></div>
    ${renderFraming(o,windowRange,loc)}
    <details class="object-chart-panel" ${profile.central.detailPanels?.altitudeCollapsed?'':'open'}><summary>Höhenkurve</summary><div class="chart-description">Sonnenuntergang bis Sonnenaufgang; der gewählte Planungszeitraum ist hervorgehoben. Schieberegler, Uhrzeitfeld, Kurvenklick und Horizontansicht verwenden dieselbe Aufnahmezeit.</div>${renderDetailTimeControls(o,night,loc,'altitude')}<canvas class="large-altitude-chart" width="1400" height="430" data-points="${encodeURIComponent(JSON.stringify(altitudePoints))}" data-start="${night.sunset.getTime()}" data-end="${night.sunrise.getTime()}" data-selected-start="${windowRange.start.getTime()}" data-selected-end="${windowRange.end.getTime()}" data-civil-start="${night.civilDusk.getTime()}" data-civil-end="${night.civilDawn.getTime()}" data-naut-start="${night.nauticalDusk.getTime()}" data-naut-end="${night.nauticalDawn.getTime()}" data-astro-start="${night.astronomicalDusk.getTime()}" data-astro-end="${night.astronomicalDawn.getTime()}" data-current-time="${detailTime.time.getTime()}" data-min-alt="${profile.planning.minAltitude}" data-timezone="${esc(loc.timezone)}"></canvas>${renderTwilightLegend()}${renderHourlyAltitudeStrip(o,night,loc)}</details>
    <details class="object-chart-panel" ${profile.central.detailPanels?.horizonCollapsed?'':'open'}><summary>Horizontansicht</summary><div class="chart-description horizon-detail-header"><span>Objektbahn und persönlicher Horizont. Die Aufnahmezeit ist mit der Höhenkurve synchronisiert.</span><label>Horizontprofil für diese Planung<select id="detailHorizonProfileSelect">${horizonOptions}</select></label></div>${renderDetailTimeControls(o,night,loc,'horizon')}<canvas class="large-horizon-chart" width="1400" height="430" data-horizon="${encodeURIComponent(JSON.stringify(horizonPoints))}" data-track="${encodeURIComponent(JSON.stringify(altitudePoints.map(point=>[point[2],point[1],point[0]])))}" data-obstacles="${encodeURIComponent(JSON.stringify(obstacles))}" data-selected-start="${windowRange.start.getTime()}" data-selected-end="${windowRange.end.getTime()}" data-current-time="${detailTime.time.getTime()}" data-show-ground="${profile.planning.showGroundHorizon!==false}" data-timezone="${esc(loc.timezone)}"></canvas></details>
  </div>`;
}

function renderWeather(windowRange,summary,loc,night){
  const notice=weatherError?`<div class="notice warn">${esc(weatherError)}</div>`:'';
  const summaryOpen=!profile.central.collapsed?.weatherSummary;
  const hourlyOpen=!(profile.central.collapsed?.weatherHourly??profile.central.collapsed?.weather);
  if(!weatherModels.length)return`<section class="card weather-card collapsible-card"><details id="weatherSummaryDetails" class="card-panel-details" ${summaryOpen?'open':''}><summary><div><div class="eyebrow">Wettermodelle</div><h2>Wetter und Aufnahmequalität</h2></div></summary><div class="card-panel-body">${notice}<div class="loading-card"><div class="spinner"></div><p>Wettermodelle werden geladen …</p></div></div></details></section><section class="card weather-card collapsible-card"><details id="weatherHourlyDetails" class="card-panel-details" ${hourlyOpen?'open':''}><summary><div><h2>Stündlicher Wetterverlauf</h2><div class="small muted">Sonnenuntergang bis Sonnenaufgang</div></div></summary><div class="card-panel-body"><div class="loading-card"><div class="spinner"></div><p>Stündliche Modellwerte werden geladen …</p></div></div></details></section>`;
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
      <summary><div><h2>Stündlicher Wetterverlauf</h2><div class="small muted">Sonnenuntergang bis Sonnenaufgang · gewählter Planungszeitraum hervorgehoben</div></div></summary>
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
  return summaryCard+hourlyCard;
}

function renderCloudMap(windowRange,loc,night){
  const settings=cloudMapSettings(),view=currentCloudMapView(),baseMode=currentCloudMapBaseMode(),smoothing=currentCloudSmoothing(),showValues=cloudMapValuesVisible(),layer=profile.planning.cloudMapLayer||settings.defaultLayer||'cloud',mode=profile.planning.cloudMapMode||settings.defaultMode||'clouds',displayTimes=cloudMapData?cloudDisplayTimes():cloudMapRange(night).times.map(time=>time.toISOString()),frameCount=displayTimes.length||1,frameIndex=clamp(Number(profile.planning.cloudMapFrame)||0,0,Math.max(0,frameCount-1)),time=new Date(displayTimes[frameIndex]),rawPosition=cloudMapData?cloudRawPosition(frameIndex):frameIndex,stats=cloudMapData?cloudFrameStats(view,layer,rawPosition):null,movement=cloudMapData?estimateCloudMovement(view,layer,frameIndex):null;
  const viewOptions=CLOUD_MAP_VIEW_OPTIONS.map(([key,label])=>`<option value="${key}" ${view===key?'selected':''}>${optionText(label)}</option>`).join(''),baseOptions=CLOUD_MAP_BASE_OPTIONS.map(([key,label])=>`<option value="${key}" ${baseMode===key?'selected':''}>${optionText(label)}</option>`).join(''),smoothingOptions=CLOUD_SMOOTHING_OPTIONS.map(([key,label])=>`<option value="${key}" ${smoothing===key?'selected':''}>${optionText(label)}</option>`).join(''),layerOptions=CLOUD_MAP_LAYER_OPTIONS.map(([key,label])=>`<option value="${key}" ${layer===key?'selected':''}>${optionText(label)}</option>`).join(''),modeOptions=CLOUD_MAP_MODE_OPTIONS.map(([key,label])=>`<option value="${key}" ${mode===key?'selected':''}>${optionText(label)}</option>`).join(''),status=cloudMapError?`<div class="notice warn">${esc(cloudMapError)}</div>`:'',compareRows=locationComparisonData?.rows||[],step=cloudMapTimeStepMinutes();
  return`<section class="card cloud-map-card"><div class="section-title-row"><div><div class="eyebrow">Animierte 24-Stunden-Prognose</div><h2>Astro-Wolkenmodell rund um ${esc(loc.name)}</h2><div class="small muted">Gewichteter Konsens oder Einzelmodell · Zwischenbilder werden zeitlich interpoliert</div></div><button id="cloudMapReload">${cloudMapLoading?'Lädt …':'Wolkenkarte aktualisieren'}</button></div>${status}<details id="cloudMapDetails" ${settings.collapsed?'':'open'}><summary>Wolkenbewegung und Modellabweichung anzeigen</summary>
    <div class="toolbar cloud-map-toolbar" style="margin-top:12px"><label>Wettermodell<select id="cloudMapView">${viewOptions}</select></label><label>Wolkenschicht<select id="cloudMapLayer">${layerOptions}</select></label><label>Auswertung<select id="cloudMapMode">${modeOptions}</select></label><label>Kartenansicht<select id="cloudMapBaseMode">${baseOptions}</select></label><label>Glättung<select id="cloudMapSmoothingTemporary">${smoothingOptions}</select></label><label>Zeitschritt<select id="cloudMapTimeStep">${[15,30,60].map(value=>`<option value="${value}" ${step===value?'selected':''}>${value} ${language==='en'?'minutes':'Minuten'}${value===30?(language==='en'?' (default)':' (Standard)'):''}</option>`).join('')}</select></label><label class="chip cloud-value-toggle"><input id="cloudMapShowValues" type="checkbox" ${showValues?'checked':''}>Prozentwerte anzeigen</label></div>
    ${cloudMapLoading&&!cloudMapData?`<div class="loading-card"><div class="spinner"></div><p>${settings.gridSize*settings.gridSize} Prognosepunkte für drei Wettermodelle werden geladen …</p></div>`:cloudMapData?`<div class="cloud-map-stage ${baseMode==='cloudOnly'?'cloud-only':'combined'}" style="margin-top:12px"><div id="cloudMapBase" class="cloud-map-base" aria-label="Topografische Basiskarte"></div><canvas id="cloudMapCanvas" width="1400" height="720"></canvas><div class="cloud-map-legend" id="cloudMapLegend"></div><div class="cloud-map-movement" id="cloudMapMovement">${movement?.reliable?`Geschätzte Verlagerung: ${esc(movement.direction)} · ${fmt(movement.distance,0)} km/h · Sicherheit ${fmt(movement.confidence*100)} %`:'Bewegungsrichtung unsicher'}</div></div>`:`<div class="notice warn" style="margin-top:12px">Noch keine Wolkenkartendaten vorhanden.</div>`}
    <div class="grid four cloud-map-summary"><div class="metric"><div class="label">Kartenzeit</div><div class="value" id="cloudMapTimeLabel">${fmtDateTime(time,loc.timezone)}</div></div><div class="metric"><div class="label">Am Standort</div><div class="value" id="cloudMapCenterValue">${stats?`${fmt(stats.center)} %`:'–'}</div></div><div class="metric"><div class="label">Kartenmittel</div><div class="value" id="cloudMapAverageValue">${stats?`${fmt(stats.average)} %`:'–'}</div></div><div class="metric"><div class="label">Modellabweichung</div><div class="value" id="cloudMapSpreadValue">${stats?`${fmt(stats.uncertainty,1)} %-Punkte`:'–'}</div></div></div>
    <div class="cloud-map-time-controls"><button id="cloudMapPrev">−${step} min</button><button id="cloudMapPlay">${cloudMapAnimationTimer?'Pause':'▶ Abspielen'}</button><input id="cloudMapTime" type="range" min="0" max="${Math.max(0,frameCount-1)}" step="1" value="${frameIndex}" ${cloudMapData?'':'disabled'}><button id="cloudMapNext">+${step} min</button></div>
    <div class="small muted" style="margin-top:8px">${cloudMapData?`${cloudMapData.gridSize*cloudMapData.gridSize} Prognosepunkte · Radius ${cloudMapData.radiusKm} km · ${Object.values(cloudMapData.models).map(model=>esc(model.name)).join(', ')}`:`Geplante Auflösung: ${settings.gridSize*settings.gridSize} Prognosepunkte`} · 15-/30-Minuten-Bilder sind interpoliert und erhöhen nicht die Wettermodellgenauigkeit.</div>
    <details class="location-comparison" style="margin-top:14px"><summary>Gespeicherte Standorte vergleichen</summary><div class="section-title-row" style="margin-top:10px"><div class="small muted">Punktprognosen mit geringer Datenmenge.</div><button id="loadLocationComparison">${locationComparisonLoading?'Lädt …':'Vergleich laden'}</button></div>${locationComparisonError?`<div class="notice warn">${esc(locationComparisonError)}</div>`:''}${compareRows.length?`<div class="weather-scroll"><table class="weather-table"><thead><tr><th>Standort</th><th>Ø Wolken</th><th>Modellstreuung</th></tr></thead><tbody>${compareRows.map(row=>`<tr><td>${esc(row.name)}</td><td>${fmt(row.cloud)} %</td><td>${fmt(row.spread,1)} %-Punkte</td></tr>`).join('')}</tbody></table></div>`:'<div class="small muted">Noch kein Standortvergleich geladen.</div>'}</details>
  </details></section>`;
}

function meteoblueSlugPart(value){
  return String(value||'').trim().toLocaleLowerCase('de').replace(/[’']/g,'').replace(/[^a-z0-9\u00c0-\u024f]+/gi,'-').replace(/^-+|-+$/g,'');
}
function meteoblueLocationInfo(loc){
  const geonameId=Number(loc.geonameId)||(/tübingen/i.test(loc.name)?2820860:0);
  let path=loc.meteobluePath||'';
  if(!path&&geonameId){
    const city=String(loc.name||'').split(',')[0].trim();
    const country=loc.country||String(loc.name||'').split(',').at(-1)||'Deutschland';
    const citySlug=meteoblueSlugPart(city),countrySlug=meteoblueSlugPart(country);
    if(citySlug&&countrySlug)path=`${citySlug}_${countrySlug}_${geonameId}`;
  }
  const encodedPath=path?path.split('_').map(encodeURIComponent).join('_'):'';
  const fixed=Boolean(encodedPath);
  const seeingWidget=fixed?`https://www.meteoblue.com/de/wetter/widget/seeing/${encodedPath}?geoloc=fixed&noground=0`:'https://www.meteoblue.com/de/wetter/widget/seeing?geoloc=detect&noground=0';
  const seeingPage=fixed?`https://www.meteoblue.com/de/wetter/outdoorsports/seeing/${encodedPath}`:'https://www.meteoblue.com/de/wetter/outdoorsports/seeing';
  const mapBase=fixed?`https://www.meteoblue.com/de/wetter/maps/widget/${encodedPath}`:'https://www.meteoblue.com/de/wetter/maps/widget';
  const mapParams=new URLSearchParams({
    windAnimation:'1',gust:'1',satellite:'1',cloudsAndPrecipitation:'1',temperature:'1',sunshine:'1',extremeForecastIndex:'1',
    geoloc:fixed?'fixed':'detect',tempunit:'C',windunit:'km%2Fh',lengthunit:'metric',zoom:'6',autowidth:'auto'
  });
  const mapWidget=`${mapBase}?${mapParams.toString()}`;
  const mapPage=fixed?`https://www.meteoblue.com/de/wetter/maps/${encodedPath}`:'https://www.meteoblue.com/de/wetter/maps';
  return{fixed,seeingWidget,seeingPage,mapWidget,mapPage};
}

function renderFraming(o,windowRange,loc){
  const setup=fov(),aspect=2.15,setupW=setup?.width||1.5,setupH=setup?.height||1;
  const objectW=Math.max(.02,(Number(o.majorArcMin)||1)/60),objectH=Math.max(.02,(Number(o.minorArcMin)||Number(o.majorArcMin)||1)/60);
  const frameRotation=normalizedAngle180(profile.planning.frameRotation||0),catalogRotation=normalizedAngle180(Number(o.positionAngleDeg)||0),rotationBelongsToObject=profile.planning.objectRotationObjectId===o.id,objectRotation=rotationBelongsToObject&&Number.isFinite(Number(profile.planning.objectRotation))?normalizedAngle180(Number(profile.planning.objectRotation)):catalogRotation;
  if(!rotationBelongsToObject){profile.planning.objectRotation=catalogRotation;profile.planning.objectRotationObjectId=o.id}
  const targetFov=clamp(Math.max(setupW,setupH*aspect,objectW,objectH*aspect,.08)*1.45,.08,120);
  const time=new Date(windowRange.start.getTime()+(windowRange.end-windowRange.start)*clamp(Number(profile.planning.timeFraction)||0,0,1)),currentAltitude=altitude(o.raHours,o.decDeg,time,loc.latitude,loc.longitude),currentAzimuth=azimuth(o.raHours,o.decDeg,time,loc.latitude,loc.longitude);
  const moon=moonCoords(time),moonRaDeg=moon.raHours*15,moonDecDeg=moon.decDeg,moonSep=angularSeparation(o.raHours,o.decDeg,moon.raHours,moon.decDeg),moonAlt=altitude(moon.raHours,moon.decDeg,time,loc.latitude,loc.longitude),moonPhase=moonPhaseInfo(time),moonName=language==='en'?'Moon':'Mond';
  const outline=curatedOutlineForObject(o),availableSurveys=enabledAladinSurveys(profile);let survey=profile.planning.aladinSurvey||availableSurveys[0]?.hipsId||'P/DSS2/color';if(!availableSurveys.some(item=>item.hipsId===survey))survey=availableSurveys[0]?.hipsId||'P/DSS2/color';
  const comparisonFrames=(profile.planning.comparisonSetupIds||[]).map(id=>(profile.equipment.setups||[]).find(setup=>setup.id===id)).filter(Boolean).map(fovForSetup).filter(Boolean).map((item,index)=>({id:item.id,name:item.name,width:item.width,height:item.height,rotation:frameRotation,color:['#ffcf5a','#ba7cff','#7ef29a'][index%3]}));
  const query=new URLSearchParams({ra:String(o.raHours*15),dec:String(o.decDeg),fov:String(targetFov),survey:String(survey),frameW:String(setupW),frameH:String(setupH),frameRot:String(frameRotation),showFrame:String(Boolean(profile.central.frameVisible&&setup)),objectW:String(objectW),objectH:String(objectH),objectRot:String(objectRotation),catalogRot:String(catalogRotation),showObject:String(Boolean(profile.central.objectSizeVisible)),showLabels:String(profile.central.aladinLabels?.visible!==false),labelDetail:String(profile.central.aladinLabels?.detail||'auto'),targetId:String(o.id),targetName:String(o.name),showMoon:String(Boolean(profile.planning.showMoonInAladin)),moonRa:String(moonRaDeg),moonDec:String(moonDecDeg),moonLabel:`${moonName} · ${fmt(moonSep)}° Abstand · Höhe ${fmt(moonAlt)}°`,moonName,moonIllumination:String(moonPhase.illumination),moonAge:String(moonPhase.age),moonWaxing:String(moonPhase.waxing),outlinePolygons:'',outlineSource:'',dbName:DB_NAME,comparisonFrames:JSON.stringify(comparisonFrames),lang:language}).toString();
  const scopes=profile.equipment.telescopes.map(item=>`<option value="${esc(item.id)}" ${item.id===activeScope()?.id?'selected':''}>${esc(item.name)}</option>`).join(''),cameras=profile.equipment.cameras.map(item=>`<option value="${esc(item.id)}" ${item.id===activeCamera()?.id?'selected':''}>${esc(item.name)}</option>`).join('');
  const selectableObjects=[...new Map([...currentComputedObjects.map(entry=>entry.object),o].map(item=>[item.id,item])).values()].sort((a,b)=>a.id.localeCompare(b.id,'de',{numeric:true})),objectOptions=selectableObjects.map(x=>`<option value="${esc(x.id)}" ${x.id===o.id?'selected':''}>${esc(x.id)} · ${esc(x.name)}</option>`).join('');
  const analysis=framingAnalysis(o,{rotation:frameRotation,optimize:false});
  return`<section class="object-detail-section framing-section" id="framingCard">
    <div class="framing-header-grid"><div><div class="eyebrow">Interaktives Himmelsbild</div><h3>Rahmung: ${esc(o.id)} · ${esc(o.name)}</h3><div class="muted">${esc(o.type)} · ${fmt(o.majorArcMin)}′ × ${fmt(o.minorArcMin)}′ · ${esc(analysis.status)} · Mindestrand ${fmt(analysis.minMargin,1)} %</div></div><label>Objekt<select id="framingObjectSelect">${objectOptions}</select></label><label>Teleskop<select id="framingTelescopeSelect">${scopes}</select></label><label>Kamera<select id="framingCameraSelect">${cameras}</select></label></div>
    <div class="framing-view"><iframe id="aladinFrame" title="Aladin Lite – ${esc(o.id)}" src="aladin-frame.html?${query}" loading="eager"></iframe><div class="framing-info"><div id="framingTimePosition"><strong id="framingTimeClock">${fmtTime(time,loc.timezone)}</strong><br>Höhe ${fmt(currentAltitude)}° · ${cardinal(currentAzimuth)}</div><div id="framingTimeWeather">${setup?`Setup ${fmt(setup.width,2)}° × ${fmt(setup.height,2)}°<br>${fmt(setup.pixelScale,2)}″/px`:'Kein Setup gewählt'}</div><div id="framingMoonInfo" class="moon-note">${moonName}: Abstand ${fmt(moonSep)}° · Höhe ${fmt(moonAlt)}° · Beleuchtung ${fmt(moonPhase.illumination)} %</div></div></div>
    <div class="framing-controls compact-framing-controls"><label>Survey<select id="aladinSurveySelect">${availableSurveys.map(item=>`<option value="${esc(item.hipsId)}" ${survey===item.hipsId?'selected':''}>${optionText(item.name)}</option>`).join('')||`<option value="P/DSS2/color">DSS2 Farbe</option>`}</select></label><button type="button" id="openAladinExternal">Himmelsbild in neuem Tab öffnen</button><span class="small muted external-aladin-note">Mit Messwerkzeug und Umrisszeichnung</span><div class="comparison-frame-picker"><span>Vergleichsrahmen</span>${(profile.equipment.setups||[]).map(setup=>`<label class="chip"><input type="checkbox" data-compare-setup="${esc(setup.id)}" ${(profile.planning.comparisonSetupIds||[]).includes(setup.id)?'checked':''}>${esc(setup.name)}</label>`).join('')}</div><label class="chip"><input id="frameVisible" type="checkbox" ${profile.central.frameVisible?'checked':''}>Setup-Rahmen anzeigen</label><label>Kamerarotation <span id="frameRotationValue">${fmt(frameRotation)}°</span><input id="frameRotation" type="range" min="0" max="179" value="${frameRotation}"></label><button type="button" id="optimalFrameRotation">Optimale Rotation</button><button type="button" id="centerAladinFrame">Rahmen auf ausgewähltes Objekt</button><button type="button" id="reloadAladinImage">Himmelsbild neu laden</button><label class="chip"><input id="aladinLabelsVisible" type="checkbox" ${profile.central.aladinLabels?.visible!==false?'checked':''}>Objektnamen anzeigen</label><label>Beschriftungsumfang<select id="aladinLabelDetail">${ALADIN_LABEL_DETAIL_OPTIONS.map(([key,label])=>`<option value="${key}" ${profile.central.aladinLabels?.detail===key?'selected':''}>${optionText(label)}</option>`).join('')}</select></label><label class="chip"><input id="showMoonInAladin" type="checkbox" ${profile.planning.showMoonInAladin?'checked':''}>Mond anzeigen</label><label class="framing-time-control">Zeit im Planungsfenster <span id="framingTimeValue">${fmtTime(time,loc.timezone)} · ${Math.round((profile.planning.timeFraction||0)*100)} %</span><input id="framingTime" type="range" min="0" max="100" value="${(profile.planning.timeFraction||0)*100}"><small>Ändert Planungswerte, nicht das Sternfeld. Mond: ${fmt(moonSep)}° Abstand, Höhe ${fmt(moonAlt)}°, Beleuchtung ${fmt(moonPhase.illumination)} %.</small></label><label class="chip outline-control"><input id="objectSizeVisible" type="checkbox" ${profile.central.objectSizeVisible?'checked':''}>Objektumriss anzeigen</label><label class="outline-control">Objektrotation <span id="objectRotationValue">${fmt(objectRotation)}°</span><input id="objectRotation" class="short-range" type="range" min="0" max="179" value="${objectRotation}"></label><button type="button" id="resetObjectRotation" class="outline-control" title="Objektellipse auf den Katalog-Positionswinkel ${fmt(catalogRotation)}° zurücksetzen">Objektausrichtung zurücksetzen</button></div>
  </section>`;
}
function renderMeteoblue(loc){
  const urls=meteoblueLocationInfo(loc);
  const mapCollapsed=profile.central.cloudMap?.meteoblueMapCollapsed!==false;
  const locationText=urls.fixed?loc.name:'automatische Meteoblue-Standorterkennung';
  return`<section class="card meteoblue-card">
    <details ${profile.central.meteoblueCollapsed?'':'open'} id="meteoblueDetails">
      <summary><strong>Meteoblue Astronomy Seeing</strong> · unabhängige Kontrollvorhersage</summary>
      <div class="notice" style="margin-top:12px">Diese Kontrollvorhersage wird nicht in den automatischen Modellkonsens eingerechnet. Standort: <strong>${esc(locationText)}</strong>.</div>
      <div class="meteoblue-actions" style="margin-top:10px">
        <button data-meteoblue-fullscreen="meteoblueSeeingWrap">⛶ Großansicht</button>
        <a class="button primary" href="${urls.seeingPage}" target="_blank" rel="noopener noreferrer">Bei Meteoblue öffnen</a>
      </div>
      <div class="meteoblue-embed" id="meteoblueSeeingWrap">
        <iframe class="meteoblue-frame seeing-frame" title="Meteoblue Astronomy Seeing für ${esc(loc.name)}" src="${urls.seeingWidget}" loading="lazy"
          allow="geolocation" sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms" referrerpolicy="strict-origin-when-cross-origin"></iframe>
      </div>
      <div class="meteoblue-credit"><a href="${urls.seeingPage}" target="_blank" rel="noopener noreferrer">meteoblue</a></div>
    </details>
  </section>
  <section class="card meteoblue-card">
    <details ${mapCollapsed?'':'open'} id="meteoblueMapDetails">
      <summary><strong>Meteoblue Wetterkarten</strong> · zusätzliche Live-, Radar-, Satelliten- und Modellansicht</summary>
      <div class="notice" style="margin-top:12px">Zusätzliche unabhängige Karte mit Windanimation, Böen, Satellit, Wolken und Niederschlag, Temperatur, Sonnenscheindauer und Extremprognose.</div>
      <div class="meteoblue-actions" style="margin-top:10px">
        <button data-meteoblue-fullscreen="meteoblueMapWrap">⛶ Großansicht</button>
        <a class="button primary" href="${urls.mapPage}" target="_blank" rel="noopener noreferrer">Wetterkarten bei Meteoblue öffnen</a>
      </div>
      <div class="meteoblue-embed meteoblue-map-embed" id="meteoblueMapWrap">
        <iframe class="meteoblue-frame map-frame" title="Meteoblue Wetterkarten für ${esc(loc.name)}" src="${urls.mapWidget}" loading="lazy"
          allow="geolocation" sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms" referrerpolicy="strict-origin-when-cross-origin"></iframe>
      </div>
      <div class="meteoblue-credit"><a href="${urls.mapPage}" target="_blank" rel="noopener noreferrer">meteoblue</a></div>
    </details>
  </section>`
}

function renderSaveBar(section,label='Änderungen speichern'){
  const dirty=dirtySections.has(section),success=saveFeedbackSections.has(section);
  const state=dirty?'Ungespeicherte Änderungen':success?'Erfolgreich gespeichert':'Gespeichert';
  return`<div class="save-bar ${dirty?'is-dirty':''} ${success?'is-success':''}"><span class="save-state">${state}</span><div class="save-actions"><button type="button" class="ghost section-reset-button" data-reset-section="${section}">Rubrik auf Standard zurücksetzen</button><button data-save-section="${section}" data-default-label="${esc(label)}" class="primary ${success?'save-success':''}" ${success?'disabled':''}>${success?'Gespeichert ✓':label}</button></div></div>`;
}
function resetDraftSection(section){
  const base=standardProfile();
  if(section==='equipment')draft.equipment=deepClone(base.equipment);
  if(section==='centralWind'){
    draft.central.windUnit=base.central.windUnit;draft.central.activeWindProfile=base.central.activeWindProfile;draft.central.windProfiles=deepClone(base.central.windProfiles);draft.central.dew=deepClone(base.central.dew);draft.central.jet=deepClone(base.central.jet);
  }
  if(section==='weatherModels')draft.central.weatherModels=deepClone(base.central.weatherModels);
  if(section==='cloudMap')draft.central.cloudMap=deepClone(base.central.cloudMap);
  if(section==='weights')draft.central.weights=deepClone(base.central.weights);
  if(section==='display'){
    draft.central.defaultPlanningWindow=base.central.defaultPlanningWindow;draft.central.framing=deepClone(base.central.framing);draft.central.qualityThresholds=deepClone(base.central.qualityThresholds);draft.central.aladinLabels=deepClone(base.central.aladinLabels);draft.central.aladinSurveys=deepClone(base.central.aladinSurveys);draft.central.listDisplay=deepClone(base.central.listDisplay);draft.central.frameVisible=base.central.frameVisible;draft.central.objectSizeVisible=base.central.objectSizeVisible;draft.central.meteoblueCollapsed=base.central.meteoblueCollapsed;draft.central.detailPanels=deepClone(base.central.detailPanels);draft.central.collapsed=deepClone(base.central.collapsed);
  }
  if(section==='locations'){
    draft.locations=deepClone(base.locations);draft.selectedLocationId=base.selectedLocationId;draft.central.defaultLocationId=base.central.defaultLocationId;draft.central.gpsBehavior=base.central.gpsBehavior;draft.central.locationSearchCountry=base.central.locationSearchCountry;locationSearchResults=[];locationSearchQuery='';locationSearchError='';horizonUndoStack=[];
  }
  if(section==='backup')backupDraft=deepClone({enabled:false,afterSave:true,daily:true,keep:10,reminderDays:7,lastSuccessAt:backupConfig.lastSuccessAt,lastError:'',lastDailyDate:backupConfig.lastDailyDate,targetName:backupConfig.targetName,permission:backupConfig.permission});
  setSectionDirty(section);render();
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
function renderEquipment(){return`<div class="card">
  <div class="section-title-row"><div><h2>Teleskope</h2><div class="small muted">Brennweite und Öffnung bestimmen zusammen mit der Kamera das Bildfeld.</div></div><button id="addTelescope">Teleskop hinzufügen</button></div>
  <div class="equipment-list">${draft.equipment.telescopes.map(s=>`<div class="equipment-row scope-row" data-scope-row="${s.id}"><label>Name<input data-scope="name" value="${esc(s.name)}"></label><label>Brennweite (mm)<input data-scope="focalLength" type="number" min="1" value="${s.focalLength}"></label><label>Öffnung (mm)<input data-scope="aperture" type="number" min="1" value="${s.aperture||''}"></label><label class="chip"><input data-selected-scope type="radio" name="selectedScope" value="${s.id}" ${draft.equipment.selectedTelescopeId===s.id?'checked':''}>Aktiv</label><button data-delete-scope="${s.id}" class="danger">Entfernen</button></div>`).join('')}</div>
  <div class="divider"></div>
  <div class="section-title-row"><div><h2>Kameras</h2><div class="small muted">Sensorgröße und Pixelgröße werden für Bildfeld und Abbildungsmaßstab verwendet.</div></div><button id="addCamera">Kamera hinzufügen</button></div>
  <div class="equipment-list">${draft.equipment.cameras.map(c=>`<div class="equipment-row camera-row" data-camera-row="${c.id}"><label>Name<input data-camera="name" value="${esc(c.name)}"></label><label>Sensorbreite (mm)<input data-camera="sensorWidth" type="number" min="0.1" step="0.01" value="${c.sensorWidth}"></label><label>Sensorhöhe (mm)<input data-camera="sensorHeight" type="number" min="0.1" step="0.01" value="${c.sensorHeight}"></label><label>Pixelgröße (µm)<input data-camera="pixelSize" type="number" min="0.1" step="0.01" value="${c.pixelSize}"></label><label class="chip"><input data-selected-camera type="radio" name="selectedCamera" value="${c.id}" ${draft.equipment.selectedCameraId===c.id?'checked':''}>Aktiv</label><button data-delete-camera="${c.id}" class="danger">Entfernen</button></div>`).join('')}</div>
  <div class="divider"></div>
  <div class="section-title-row"><div><h2>Montierungen</h2><div class="small muted">Die Montierung wird derzeit dokumentiert; eine spätere Qualitätsbewertung kann Typ und Tragfähigkeit berücksichtigen.</div></div><button id="addMount">Montierung hinzufügen</button></div>
  <div class="equipment-list">${draft.equipment.mounts.map(m=>`<div class="equipment-row mount-row" data-mount-row="${m.id}"><label>Name<input data-mount="name" value="${esc(m.name)}"></label><label>Montierungsart<select data-mount="type">${['Parallaktisch','Alt-Azimutal','Startracker','Säule / stationär','Sonstige'].map(type=>`<option ${m.type===type?'selected':''}>${type}</option>`).join('')}</select></label><label>Max. Zuladung (kg, optional)<input data-mount="maxPayloadKg" type="number" min="0" step="0.1" value="${m.maxPayloadKg??''}"></label><label class="chip"><input data-selected-mount type="radio" name="selectedMount" value="${m.id}" ${draft.equipment.selectedMountId===m.id?'checked':''}>Aktiv</label><button data-delete-mount="${m.id}" class="danger">Entfernen</button></div>`).join('')}</div>
  <div class="divider"></div>
  <div class="section-title-row"><div><h2>Setup-Kombinationen</h2><div class="small muted">Setups bündeln Teleskop und Kamera für Planung, Rahmungsbewertung und Bildfeld.</div></div><button id="addSetup">Setup hinzufügen</button></div>
  <div class="equipment-list">${(draft.equipment.setups||[]).map(setup=>`<div class="equipment-row setup-row" data-setup-row="${setup.id}"><label>Name<input data-setup="name" value="${esc(setup.name)}"></label><label>Teleskop<select data-setup="telescopeId">${draft.equipment.telescopes.map(scope=>`<option value="${esc(scope.id)}" ${setup.telescopeId===scope.id?'selected':''}>${esc(scope.name)}</option>`).join('')}</select></label><label>Kamera<select data-setup="cameraId">${draft.equipment.cameras.map(camera=>`<option value="${esc(camera.id)}" ${setup.cameraId===camera.id?'selected':''}>${esc(camera.name)}</option>`).join('')}</select></label><label>Montierung<select data-setup="mountId">${draft.equipment.mounts.map(mount=>`<option value="${esc(mount.id)}" ${setup.mountId===mount.id?'selected':''}>${esc(mount.name)}</option>`).join('')}</select></label><label class="chip"><input data-selected-setup type="radio" name="selectedSetup" value="${setup.id}" ${draft.equipment.selectedSetupId===setup.id?'checked':''}>Aktiv</label><button data-delete-setup="${setup.id}" class="danger">Entfernen</button></div>`).join('')}</div>
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
  return`<div class="settings-tabs subtabs">${[['wind','Wind'],['weather','Wetter/Karte'],['weights','Bewertung'],['display','Anzeige'],['filters','Filterprofile']].map(([k,n])=>`<button data-central-subtab="${k}" class="${currentCentralSubTab===k?'active':''}">${n}</button>`).join('')}</div><div class="card subtab-panel ${currentCentralSubTab==='wind'?'active':''}">
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
    <div class="section-title-row"><div><h2>Wettermodelle</h2><div class="small muted">Gewichtung für den Modellkonsens je Prognosestunde</div></div><span class="weight-total ${weatherTotal===100?'ok':'error'}">Summe: ${weatherTotal} %</span></div>
    <div class="notice">Der Modellkonsens mittelt DWD ICON, ECMWF IFS und NOAA GFS nach diesen Anteilen. Default: 40 % / 40 % / 20 %.</div>
    <div class="grid three" style="margin-top:12px">${Object.entries(WEATHER_MODEL_CONFIG).map(([key,value])=>`<label>${esc(value.name)} (%)<input data-weather-weight="${key}" type="number" min="0" max="100" step="1" value="${Number(c.weatherModels?.weights?.[key]??value.defaultWeight)}"></label>`).join('')}</div>
    <div class="grid two" style="margin-top:12px"><label>Standarddarstellung in der Planung<select id="defaultWeatherView">${WEATHER_VIEW_OPTIONS.map(([key,label])=>`<option value="${key}" ${c.weatherModels?.defaultView===key?'selected':''}>${optionText(label)}</option>`).join('')}</select></label><div class="notice">In der Planung kann die Ansicht temporär auf ein Einzelmodell umgestellt werden. Der Standard wird ausschließlich hier gespeichert.</div></div>
    ${renderSaveBar('weatherModels','Wettermodelle speichern')}
  </div>
  <div class="card subtab-panel ${currentCentralSubTab==='weather'?'active':''}">
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
    <div class="grid two" style="margin-top:12px"><label class="chip"><input id="defaultCloudMapShowValues" type="checkbox" ${c.cloudMap?.showValues!==false?'checked':''}>Prozentwerte an Prognosepunkten anzeigen</label><label class="chip"><input id="cloudMapCollapsedDefault" type="checkbox" ${c.cloudMap?.collapsed?'checked':''}>Wolkenkarte initial eingeklappt</label><label class="chip"><input id="meteoblueMapCollapsedDefault" type="checkbox" ${c.cloudMap?.meteoblueMapCollapsed?'checked':''}>Meteoblue-Wetterkarte initial eingeklappt</label></div>
    <div class="notice" style="margin-top:12px">25, 49 oder 81 Prognosepunkte bestimmen die API-Datenmenge. Die sichtbare Karte wird unabhängig davon in hoher Auflösung weich interpoliert; es werden keine Zellumrandungen gezeichnet. Standard: 49 Punkte in einem Radius von 120 km.</div>
    ${renderSaveBar('cloudMap','Wolkenkarte speichern')}
  </div>
  <div class="card subtab-panel ${currentCentralSubTab==='weights'?'active':''}">
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
    <div class="section-title-row"><div><h2>Anzeige und Planung</h2><div class="small muted">Dauerhafte Standards für neue beziehungsweise zurückgesetzte Planungen</div></div></div>
    <div class="grid two"><label>Standard-Planungszeitraum<select id="defaultPlanningWindow">${[['sunset','Sonnenuntergang–Sonnenaufgang'],['civil','Bürgerliche Nacht'],['nautical','Nautischer Planungszeitraum'],['astronomicalTwilight','Nautisch + astronomisch'],['astronomicalNight','Astronomische Nacht']].map(([key,name])=>`<option value="${key}" ${c.defaultPlanningWindow===key?'selected':''}>${name}</option>`).join('')}</select></label></div>
    <div class="grid two" style="margin-top:12px"><label>Gewünschter Mindestfreiraum zum Bildrand (%)<input id="framingMinMargin" type="number" min="0" max="45" step="1" value="${Number(c.framing?.minMarginPercent??10)}"></label><label class="chip"><input id="framingAutoRotate" type="checkbox" ${c.framing?.autoRotate!==false?'checked':''}>Kamera bei verlässlichem Positionswinkel automatisch optimal drehen</label></div>
    <div class="grid two" style="margin-top:12px"><div class="metric"><strong>Qualitätsampel</strong><div class="small muted">Rot 0 bis unter Gelb, Gelb bis unter Grün, Grün bis 100.</div><div class="grid two" style="margin-top:8px"><label>Gelb ab<input id="qualityYellow" type="number" min="1" max="98" step="1" value="${Number(c.qualityThresholds?.yellow??60)}"></label><label>Grün ab<input id="qualityGreen" type="number" min="2" max="99" step="1" value="${Number(c.qualityThresholds?.green??80)}"></label></div></div><div class="metric"><strong>Objektbeschriftungen in Aladin</strong><label class="chip" style="margin-top:8px"><input id="defaultAladinLabelsVisible" type="checkbox" ${c.aladinLabels?.visible!==false?'checked':''}>Objektnamen und Katalognummern anzeigen</label><label>Detailstufe<select id="defaultAladinLabelDetail">${ALADIN_LABEL_DETAIL_OPTIONS.map(([key,label])=>`<option value="${key}" ${c.aladinLabels?.detail===key?'selected':''}>${optionText(label)}</option>`).join('')}</select></label></div></div>
    <div class="display-config-selector static"><div class="section-title-row"><div><h3>Objektlisteninformationen konfigurieren</h3><div class="small muted">Sichtbarkeit, Reihenfolge und aktives Darstellungsprofil der Objektliste.</div></div><label>Objektliste Darstellungsprofil – aktiv<select id="activeDisplayProfile">${Object.entries(c.listDisplay.profiles).map(([key,value])=>`<option value="${key}" ${c.listDisplay.activeProfile===key?'selected':''}>${esc(value.name)}</option>`).join('')}</select></label></div><div class="display-config-list">${Object.entries(c.listDisplay.profiles).map(([key,value])=>renderDisplayColumnConfigurator(key,value)).join('')}</div></div>
    <div class="grid two" style="margin-top:12px"><label class="chip"><input id="defaultFrameVisible" type="checkbox" ${c.frameVisible?'checked':''}>Setup-Rahmen standardmäßig anzeigen</label><label class="chip"><input id="defaultObjectVisible" type="checkbox" ${c.objectSizeVisible?'checked':''}>Objektgröße standardmäßig anzeigen</label><label class="chip"><input id="defaultMeteoblueCollapsed" type="checkbox" ${c.meteoblueCollapsed?'checked':''}>Meteoblue standardmäßig eingeklappt</label><label class="chip"><input id="defaultAltitudeCollapsed" type="checkbox" ${c.detailPanels?.altitudeCollapsed?'checked':''}>Höhenkurve initial eingeklappt</label><label class="chip"><input id="defaultHorizonCollapsed" type="checkbox" ${c.detailPanels?.horizonCollapsed?'checked':''}>Horizontansicht initial eingeklappt</label></div>
    <div class="metric" style="margin-top:12px"><strong>Aufklappzustand beim Öffnen der Planung</strong><div class="grid three" style="margin-top:8px"><label class="chip"><input id="defaultProfilesCollapsed" type="checkbox" ${c.collapsed?.profiles?'checked':''}>„Profile für diese Planung“ eingeklappt</label><label class="chip"><input id="defaultWeatherSummaryCollapsed" type="checkbox" ${c.collapsed?.weatherSummary?'checked':''}>„Wetter und Aufnahmequalität“ eingeklappt</label><label class="chip"><input id="defaultWeatherHourlyCollapsed" type="checkbox" ${c.collapsed?.weatherHourly?'checked':''}>„Stündlicher Wetterverlauf“ eingeklappt</label></div></div>
    <details class="metric aladin-survey-settings" style="margin-top:16px"><summary><span class="disclosure-arrow" aria-hidden="true"></span><strong>Aladin-Surveys</strong><span class="small muted">Weitere Surveys können manuell per HiPS-ID ergänzt werden. Monochrome Surveys werden nativ angezeigt.</span></summary><div class="section-title-row" style="margin-top:12px"><div><div class="small muted">Surveys in der Aladin-Auswahl aktivieren, umbenennen oder eigene HiPS-IDs ergänzen. Diese Expertenliste ist initial zugeklappt.</div></div><button id="addAladinSurvey" type="button">Survey hinzufügen</button></div>
      <div class="aladin-survey-list">${normalizeAladinSurveys(c.aladinSurveys).map(item=>`<div class="survey-config-row" data-survey-row="${esc(item.id)}"><label class="chip"><input data-aladin-survey="${esc(item.id)}" data-field="enabled" type="checkbox" ${item.enabled?'checked':''}>in Auswahl</label><label>Anzeigename<input data-aladin-survey="${esc(item.id)}" data-field="name" value="${esc(item.name)}"></label><label>HiPS-ID<input data-aladin-survey="${esc(item.id)}" data-field="hipsId" value="${esc(item.hipsId)}" ${item.builtin?'readonly':''}></label><label>Kategorie<input data-aladin-survey="${esc(item.id)}" data-field="category" value="${esc(item.category||'')}"></label>${item.builtin?'':`<button type="button" class="danger" data-delete-aladin-survey="${esc(item.id)}">Entfernen</button>`}</div>`).join('')}</div>
    </details>
    ${renderSaveBar('display','Anzeigeeinstellungen speichern')}
  </div>`;
}

function createEmptyLocationDraft(){const id=uid('loc'),horizonId=uid('horizon');return {id,name:'Neuer Standort',latitude:null,longitude:null,elevation:0,timezone:'Europe/Berlin',horizonProfiles:[{id:horizonId,name:'Freier Horizont',horizonProfile:Array(73).fill(0),obstacles:[]}],defaultHorizonProfileId:horizonId,selectedHorizonProfileId:horizonId,horizonProfile:Array(73).fill(0),horizon:[0,0,0,0,0,0,0,0],obstacles:[]};}
function renderLocations(){
  const loc=draft.locations.find(item=>item.id===draft.selectedLocationId)||draft.locations[0],profiles=horizonProfilesFor(loc),horizonEntry=horizonProfileFor(loc,loc.selectedHorizonProfileId),horizonPoints=ensureHorizonProfile(loc,horizonEntry?.id).map((altitude,index)=>[index*5,Number(altitude)||0]),obstacles=(horizonEntry?.obstacles||[]).map(item=>({name:item.name||'Hindernis',azimuth:Number(item.azimuth)||0,altitude:Number(item.altitude)||0}));
  const profileOptions=profiles.map(item=>`<option value="${esc(item.id)}" ${item.id===horizonEntry?.id?'selected':''}>${esc(item.name)}</option>`).join(''),defaultOptions=profiles.map(item=>`<option value="${esc(item.id)}" ${item.id===loc.defaultHorizonProfileId?'selected':''}>${esc(item.name)}</option>`).join('');
  const country=draft.central.locationSearchCountry??'DE';
  const searchResults=locationSearchResults.length?`<div class="location-search-results">${locationSearchResults.map((item,index)=>`<button type="button" class="location-search-result" data-location-result="${index}"><strong>${esc(item.displayName)}</strong><span>${item.postcode?`PLZ ${esc(item.postcode)} · `:''}${fmt(item.latitude,4)}°, ${fmt(item.longitude,4)}°${item.countryCode?` · ${esc(item.countryCode.toUpperCase())}`:''}</span></button>`).join('')}</div>`:'';
  return`<div class="settings-tabs subtabs">${[['locations','Standorte'],['horizon','Horizontprofile']].map(([k,n])=>`<button data-locations-subtab="${k}" class="${currentLocationsSubTab===k?'active':''}">${n}</button>`).join('')}</div><div class="card subtab-panel ${currentLocationsSubTab==='locations'?'active':''}"><div class="section-title-row"><div><h2>Gespeicherte Aufnahmeorte</h2><div class="small muted">Der Standardstandort wird hier festgelegt. In der Planung kann vorübergehend ein anderer Ort gewählt werden.</div></div><button id="addLocation">Standort hinzufügen</button></div>
    
    ${showAddLocationDialog?`<div class="location-add-dialog"><div class="section-title-row"><div><h3>Neuen Standort hinzufügen</h3><div class="small muted">Suche einen Ort oder gib Koordinaten manuell ein. Nach dem Speichern wird der neue Standort aktiv ausgewählt.</div></div><button id="cancelAddLocation" type="button">Abbrechen</button></div><div class="grid four location-add-search-row"><label>Ort oder Postleitzahl<input id="locationSearchQuery" value="${esc(locationSearchQuery)}" placeholder="z. B. 72108 oder Rottenburg"></label><label>Bevorzugtes Land<select id="locationSearchCountry">${COUNTRY_OPTIONS.map(([code,label])=>`<option value="${code}" ${country===code?'selected':''}>${esc(label)}</option>`).join('')}</select></label><div class="inline" style="align-self:end"><button id="searchLocation" ${locationSearchLoading?'disabled':''}>${locationSearchLoading?'Suche läuft …':'Standort suchen'}</button></div><div class="inline" style="align-self:end"><button id="useGpsNewLocation" type="button">GPS verwenden</button></div></div><div class="small muted">Die Suche wird erst nach Klick oder Enter ausgelöst. GPS befüllt nur diesen neuen Standort.</div>${locationSearchError?`<div class="notice warn">${esc(locationSearchError)}</div>`:''}${locationSearchResults.length?`<div class="search-results">${locationSearchResults.map((r,i)=>`<button type="button" data-location-result="${i}"><strong>${esc(r.displayName)}</strong><span>${esc([r.postcode,r.region,r.country].filter(Boolean).join(' · '))}</span><span>${fmt(r.latitude,5)}°, ${fmt(r.longitude,5)}°</span></button>`).join('')}</div>`:''}<div class="grid three" style="margin-top:12px"><label>Name<input id="newLocName" value="${esc(pendingLocationDraft?.name||'Neuer Standort')}"></label><label>Zeitzone<select id="newLocTimezone">${timeZoneOptions(pendingLocationDraft?.timezone||'Europe/Berlin')}</select></label><label>Höhe über Meer (m)<input id="newLocElevation" type="number" value="${Number(pendingLocationDraft?.elevation)||0}"></label><label>Breitengrad (°)<input id="newLocLat" type="number" step="0.0001" value="${pendingLocationDraft?.latitude==null?'':Number(pendingLocationDraft.latitude)}"></label><label>Längengrad (°)<input id="newLocLon" type="number" step="0.0001" value="${pendingLocationDraft?.longitude==null?'':Number(pendingLocationDraft.longitude)}"></label><div class="inline" style="align-self:end"><button id="saveNewLocation" type="button">Standort speichern</button></div></div></div>`:''}

    <div class="grid two"><label>Standort bearbeiten<select id="locationSelect">${draft.locations.map(item=>`<option value="${item.id}" ${item.id===loc.id?'selected':''}>${esc(item.name)}</option>`).join('')}</select></label><label>Standardstandort<select id="defaultLocationSelect">${draft.locations.map(item=>`<option value="${item.id}" ${item.id===draft.central.defaultLocationId?'selected':''}>${esc(item.name)}</option>`).join('')}</select></label><label>GPS-Verhalten<select id="gpsBehavior"><option value="last" ${draft.central.gpsBehavior==='last'?'selected':''}>Letzten/Standardstandort verwenden</option><option value="ask" ${draft.central.gpsBehavior==='ask'?'selected':''}>Bei Bedarf nach GPS fragen</option></select></label><span></span></div>
    <div class="grid three" style="margin-top:12px"><label>Name<input id="locName" value="${esc(loc.name)}"></label><label>Zeitzone<select id="locTimezone">${timeZoneOptions(loc.timezone)}</select><span class="small muted">Gültige IANA-Zeitzone; wird bei der Standortwahl automatisch gesetzt.</span></label><label>Breitengrad (°)<input id="locLat" type="number" step="0.0001" value="${loc.latitude}"></label><label>Längengrad (°)<input id="locLon" type="number" step="0.0001" value="${loc.longitude}"></label><label>Höhe über Meer (m)<input id="locElevation" type="number" value="${loc.elevation||0}"></label><div class="inline" style="align-self:end"><button id="saveLocationChanges" type="button">Standortänderungen speichern</button><button id="deleteLocation" class="danger" ${draft.locations.length===1?'disabled':''}>Standort löschen</button></div></div>
  </div>
  <div class="card subtab-panel ${currentLocationsSubTab==='horizon'?'active':''}"><div class="section-title-row"><div><div class="eyebrow">Interaktive Horizontprofile</div><h2>${esc(loc.name)}</h2><div class="small muted">Mehrere Profile pro Standort sind möglich, zum Beispiel Garten, Terrasse oder mobile Aufstellung.</div></div><div class="horizon-editor-actions"><button id="undoHorizon" ${!horizonUndoStack.length?'disabled':''}>Letzte Änderung rückgängig</button><button id="resetHorizon">Horizont auf 0° setzen</button></div></div>
    <div class="horizon-profile-toolbar"><label>Horizont bearbeiten<select id="horizonProfileSelect">${profileOptions}</select></label><label>Standardprofil dieses Standorts<select id="defaultHorizonProfileSelect">${defaultOptions}</select></label><button id="addHorizonProfile">Neu</button><button id="duplicateHorizonProfile">Duplizieren</button><button id="renameHorizonProfile">Umbenennen</button><button id="deleteHorizonProfile" class="danger" ${profiles.length===1?'disabled':''}>Löschen</button></div>
    <div class="horizon-editor-wrap"><canvas class="settings-horizon-chart editable-horizon" width="1400" height="440" data-editable="true" data-horizon="${encodeURIComponent(JSON.stringify(horizonPoints))}" data-obstacles="${encodeURIComponent(JSON.stringify(obstacles))}"></canvas><div class="small muted horizon-editor-help">0° N · 45° NO · 90° O · 135° SO · 180° S · 225° SW · 270° W · 315° NW · 360° N. Änderungen werden erst mit Speichern dauerhaft übernommen.</div></div>
    <div class="divider"></div><div class="section-title-row"><h3>Hindernisse im Profil „${esc(horizonEntry?.name||'–')}“</h3><button id="addObstacle">Hindernis hinzufügen</button></div>
    <div class="obstacle-list">${(horizonEntry?.obstacles||[]).map(item=>`<div class="obstacle-row" data-obstacle="${item.id}"><label>Bezeichnung<input data-obstacle-field="name" value="${esc(item.name)}"></label><label>Azimut (°)<input data-obstacle-field="azimuth" type="number" min="0" max="360" value="${item.azimuth}"></label><label>Höhe (°)<input data-obstacle-field="altitude" type="number" min="0" max="90" value="${item.altitude}"></label><button data-delete-obstacle="${item.id}" class="danger">Entfernen</button></div>`).join('')||'<div class="muted">Keine zusätzlichen Hindernisse erfasst.</div>'}</div>
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
  <div class="card subtab-panel ${currentInfoSubTab==='status'?'active':''}"><h2>Astro Night Planner 1.0</h2><p>Installierbare PWA für Nachtplanung, astronomisches Wetter, Mond und Dämmerung, Deep-Sky-Auswahl, persönliche Ausrüstung, Standorte, Horizont und Rahmung.</p><div class="storage-status"><div class="metric"><div class="label">Umgebung</div><div class="value">${ENV==='prod'?'Produktion':'Test'}</div></div><div class="metric"><div class="label">Datenbank</div><div class="value small">${DB_NAME}</div></div><div class="metric"><div class="label">Version</div><div class="value">${APP_VERSION}</div></div></div></div>
  <div class="card subtab-panel ${currentInfoSubTab==='status'?'active':''}"><div class="section-title-row"><div><h2>Datenstatus</h2><div class="small muted">Technischer Status der lokalen Speicherung</div></div><button id="refreshStorageStatus">Status aktualisieren</button></div><div class="grid four"><div class="metric"><div class="label">Speicherschutz</div><div class="value ${storageInfo.persistent?'good':'warn'}">${persistentText}</div></div><div class="metric"><div class="label">Lokaler Speicherverbrauch</div><div class="value">${formatBytes(storageInfo.usage)}</div><div class="small muted">von ${formatBytes(storageInfo.quota)}</div></div><div class="metric"><div class="label">Externe Sicherung</div><div class="value small ${storageInfo.permission==='granted'?'good':'warn'}">${permissionText}</div><div class="small muted">${esc(backupConfig.targetName||'Kein Ziel')}</div></div><div class="metric"><div class="label">Letzte Sicherung</div><div class="value small ${reminderDue?'warn':'good'}">${esc(lastBackup)}</div></div></div><div class="data-actions" style="margin-top:12px"><button id="requestPersistence">Lokale Daten vor automatischer Browserbereinigung schützen</button></div><div id="storageMessage" class="notice" style="margin-top:12px">Der Speicherschutz verhindert keine manuelle Löschung von Websitedaten.</div></div>
  <div class="card subtab-panel ${currentInfoSubTab==='backup'?'active':''}"><div class="section-title-row"><div><h2>Automatische externe Sicherung</h2><div class="small muted">Die Sicherungsdatei liegt außerhalb des Browsercaches. Nach einer vollständigen Löschung der Websitedaten muss Ordner oder Datei erneut ausgewählt werden.</div></div><span class="backup-support ${storageInfo.fileSystemSupported?'good':'warn'}">${fileSupport}</span></div>
    <div class="grid two"><label class="chip"><input id="backupEnabled" type="checkbox" ${backupDraft.enabled?'checked':''} ${!storageInfo.fileSystemSupported?'disabled':''}>Automatische Sicherung aktivieren</label><label>Aufzubewahrende datierte Sicherungen<input id="backupKeep" type="number" min="1" max="50" value="${backupDraft.keep}"></label><label class="chip"><input id="backupAfterSave" type="checkbox" ${backupDraft.afterSave?'checked':''} ${!storageInfo.fileSystemSupported?'disabled':''}>Nach jedem erfolgreichen Speichern der Einstellungen sichern</label><label class="chip"><input id="backupDaily" type="checkbox" ${backupDraft.daily?'checked':''} ${!storageInfo.fileSystemSupported?'disabled':''}>Zusätzlich höchstens einmal täglich datierte Sicherung</label><label>Sicherungserinnerung nach Tagen<input id="backupReminderDays" type="number" min="1" max="90" value="${backupDraft.reminderDays}"></label><div class="metric"><div class="label">Sicherungsziel</div><div class="value small">${esc(backupConfig.targetName||'Noch nicht gewählt')}</div><div class="small muted">Berechtigung: ${permissionText}</div></div></div>
    <div class="notice backup-file-explanation" style="margin-top:12px"><strong>Zwei Dateitypen:</strong> <code>astro-night-planner-aktuell.json</code> wird fortlaufend überschrieben und ist für die normale Wiederherstellung gedacht. Datierte Dateien sind historische Rücksprungpunkte. Vor einer Wiederherstellung werden Datum und Inhalt angezeigt.</div><div class="data-actions backup-actions" style="margin-top:14px"><button id="chooseBackupDirectory" ${!storageInfo.fileSystemSupported?'disabled':''}>Sicherungsordner auswählen</button><button id="backupNow">Sicherung jetzt erstellen</button><button id="restoreBackup">Gesamtsicherung wiederherstellen</button><button id="exportAll">Gesamtsicherung exportieren</button><button id="exportProfile">Aktuelles Profil exportieren</button><button id="importProfile">Profil importieren</button></div>
    ${backupConfig.lastError?`<div class="notice warn" style="margin-top:12px">Letzter Sicherungsfehler: ${esc(backupConfig.lastError)}</div>`:''}
    ${!storageInfo.fileSystemSupported?'<div class="notice" style="margin-top:12px">Fallback: Nutze „Gesamtsicherung exportieren“. Die App erinnert nach dem eingestellten Zeitraum an einen neuen Export.</div>':''}
    ${renderSaveBar('backup','Sicherungseinstellungen speichern')}
  </div>
  <div class="card help-article subtab-panel ${currentInfoSubTab==='help'?'active':''}"><div class="section-title-row"><div><h2>${esc(tx('helpTitle'))}</h2><div class="small muted">${esc(tx('helpSub'))}</div><div class="help-language-note">${esc(tx('helpNote'))}</div></div><div class="data-actions"><a class="button" href="${docLink('html')}" target="_blank" rel="noopener">${esc(tx('helpBrowser'))}</a><a class="button primary" href="${docLink('pdf')}" target="_blank" rel="noopener">${esc(tx('helpPdf'))}</a></div></div>
    <div class="help-toc">${[['help-storage','Datenspeicherung'],['help-first','Erste Schritte'],['help-plan','Planungsnacht'],['help-profiles','Planungsprofile'],['help-weather','Wetter'],['help-cloudmap','Wolkenkarte'],['help-meteoblue','Meteoblue'],['help-filters','Objektfilter'],['help-objects','Objektliste'],['help-details','Objektdetails'],['help-framing','Rahmung'],['help-horizon','Horizont'],['help-equipment','Ausrüstung'],['help-settings','Einstellungen'],['help-backup','Sicherung'],['help-pwa','PWA'],['help-troubleshooting','Fehlerbehebung'],['help-values','Bewertungswerte']].map(([id,label])=>`<a href="#${id}">${label}</a>`).join('')}</div>
    <section id="help-storage"><h3>Datenspeicherung, Cookies und Browsercache</h3><p>Alle persönlichen Daten werden im gerade verwendeten Browser und Browserprofil gespeichert. IndexedDB enthält die fachlichen Daten, Cache Storage die für den Offlinebetrieb benötigten App-Dateien. Cookies sind nicht der Hauptspeicher. Ein normaler Cache-Löschvorgang betrifft die Einstellungen meist nicht; das Löschen aller Websitedaten der Installationsadresse kann sie jedoch entfernen. Auch ein Wechsel der Domain oder des Browserprofils erzeugt einen getrennten Speicherbereich. Übertrage Daten deshalb mit einer externen Sicherung.</p></section>
    <section id="help-first"><h3>Erste Schritte</h3><p>Prüfe zuerst unter Ausrüstung Teleskop, Kamera und Montierung. Lege anschließend unter Standorte & Horizont deinen Aufnahmeort, mindestens ein Horizontprofil und den jeweiligen Standard fest. Wähle in der Planung Standort, Datum, Planungszeitraum, Teleskop, Kamera, Horizontprofil und Wetterdarstellung. Danach kannst du Objektfilter setzen und ein Objekt durch Klick auf die gesamte Tabellenzeile öffnen.</p></section>
    <section id="help-plan"><h3>Planungsnacht</h3><p>Die Standortauswahl links neben den Datumsfeldern gilt nur für die aktuelle Planung. Koordinaten und Höhe stehen direkt darunter. Sonnen-, Dämmerungs- und Mondzeiten werden für diesen Standort berechnet. Der Planungszeitraum begrenzt Bewertung, Sichtbarkeitsdauer, Wetterzusammenfassung und Höhenprofile.</p></section>
    <section id="help-profiles"><h3>Profile für diese Planung</h3><p>Planungszeitraum, Aufnahmequalitätsprofil, Darstellungsprofil, Wetteransicht, Teleskop, Kamera und Horizontprofil können für die aktuelle Nacht temporär gewählt werden. Teleskop und Kamera wirken sofort auf Bildfeld, Framingbewertung und Aladin-Rahmung; das Horizontprofil auf die Horizontansicht. Keine dieser Auswahlen überschreibt einen gespeicherten Standard. Dauerhafte Standards werden ausschließlich in den Einstellungen festgelegt.</p></section>
    <section id="help-weather"><h3>Wetter und Modellkonsens</h3><p>Der Modellkonsens kombiniert DWD ICON, ECMWF IFS und NOAA GFS mit den gespeicherten Prozentgewichten. Einzelmodelle sind zur Kontrolle auswählbar. Die farbigen Felder bewerten die erwartete Aufnahmequalität. Die effektive Transparenz berücksichtigt die Bewölkung; der ergänzende atmosphärische Wert beschreibt die Klarheit ohne Wolkeneinfluss.</p></section>
    <section id="help-cloudmap"><h3>Animierte 24-Stunden-Wolkenkarte</h3><p>In der Planung kann temporär zwischen „Karte + Wolken“ und „Nur Wolken“ gewechselt werden. Die kombinierte Ansicht nutzt eine bewusst dunkle, reduzierte topografische Basiskarte. Straßen, Gebäude und POIs werden ausgeblendet; Gelände, Gewässer, Grenzen und wenige Ortsnamen bleiben dezent zur Orientierung. Wolken erscheinen bei allen Modellen einheitlich weiß: je höher der Wolkenanteil, desto deckender die Fläche. Der Modus „Nur Wolken“ zeigt dieselben Felder auf neutral dunklem Hintergrund. Der Modus Modellabweichung bleibt farbig und zeigt die Streuung der drei Modelle.</p><p>Die orangefarbenen Prozentangaben stehen an den tatsächlichen Prognosepunkten und können kompakt ein- oder ausgeblendet werden. Ihre Dichte passt sich an Raster und Bildschirmbreite an. 25, 49 oder 81 Prognosepunkte bestimmen die Datenmenge. Die Glättung kann direkt in der Planung temporär als „Strukturiert“, „Ausgewogen“ oder „Weich“ gewählt werden, ohne zusätzliche Wetterdaten abzurufen. Das Zeitraster ist mit 15, 30 oder 60 Minuten wählbar; Standard sind 30 Minuten. Zwischenbilder werden aus den stündlichen Modellwerten interpoliert und erhöhen nicht die Prognosegenauigkeit. Bei geringer Sicherheit erscheint „Bewegungsrichtung unsicher“.</p></section>
    <section id="help-meteoblue"><h3>Meteoblue-Kontrollquellen</h3><p>Astronomy Seeing und Wetterkarten sind unabhängige Zusatzquellen und fließen nicht in den automatischen Konsens ein. Nutze sie zum Vergleich mit der eigenen Modellberechnung. Über Großansicht können die eingebetteten Karten bildschirmfüllend geöffnet werden.</p></section>
    <section id="help-filters"><h3>Objektfilter</h3><p>Filtere nach Katalog, Objekttyp, Magnitude, Mindesthöhe, Sichtbarkeitsdauer, Mondabstand und Objektgröße. Die Suche innerhalb der aktiven Filter verfeinert diese Auswahl. Die Direktsuche rechts daneben sucht dagegen nach Katalognummer, Objektname oder Alias und ignoriert bewusst alle anderen gesetzten Filter. So findest du zum Beispiel SH 2-119 oder NGC 7000 auch dann, wenn ein Katalog, Objekttyp, Größenbereich oder eine Mindesthöhe sie gerade ausblenden würde.</p><p>Texteingaben werden nach 1,5 Sekunden übernommen, damit nicht nach jedem Zeichen neu gerechnet wird; Enter oder „Filter anwenden“ startet sofort. Aktive Suchfelder werden hervorgehoben. Änderungen setzen die Ergebnisliste auf Seite 1 zurück. „Basisfilter zurücksetzen“ stellt nur die Werte dieser Basisfilter-Rubrik auf Standard zurück; Kataloge, Aufnahmefilter, Objekttypen, Ausrüstung und Anzeigeprofile bleiben unverändert.</p><p>Der Katalogfilter LDN/LBN enthält in dieser Version benannte LDN-Dunkelnebel. LBN-Objekte sind noch nicht als eigener Katalog importiert. Größenwerte der LDN-Objekte werden aus der katalogisierten Fläche als äquivalenter Kreis-Durchmesser berechnet und dienen als praktische Filter- und Rahmungshilfe.</p></section>
    <section id="help-objects"><h3>Objektliste und Mini-Höhenprofile</h3><p>Die Liste ist paginiert. Im Darstellungsprofil können die Informationen über eine aufklappbare Auswahlliste ein- oder ausgeschaltet und per Drag-and-drop beziehungsweise Auf-/Ab-Schaltflächen sortiert werden. Der Objektname bleibt immer sichtbar.</p><p>„Beste Stunde“ ist die Stunde mit dem höchsten Qualitätswert innerhalb des nautischen Planungszeitraums, sofern das Objekt über Mindesthöhe und persönlichem Horizont liegt. Meridian und Kulmination bleiben getrennte Informationen. Das Mini-Höhenprofil verwendet den gewählten Planungszeitraum und zeigt Dämmerungsbereiche, Mindesthöhe und Maximum.</p></section>
    <section id="help-details"><h3>Objektdetails, Höhenkurve und Horizontansicht</h3><p>Ein Klick auf eine freie Stelle der Objektzeile öffnet die Details direkt darunter. Ein erneuter Klick oder „Details schließen“ schließt sie. Höhenkurve und Horizontansicht sind getrennt aufklappbar und besitzen synchronisierte Zeitregler. Himmelsrichtungen werden zusammen mit Gradwerten angezeigt. In der Horizontansicht kann für die aktuelle Detailprüfung vorübergehend ein anderes Horizontprofil des gewählten Standorts ausgewählt werden.</p></section>
    <section id="help-framing"><h3>Rahmung mit Aladin Lite</h3><p>Die Ansicht wird auf das gewählte Objekt zentriert und passend gezoomt. Kamerarahmen und Objektellipse werden in Himmelskoordinaten gezeichnet und folgen Zoom, Verschiebung und Größenänderung. Die Objektellipse verwendet die vollständigen Katalogachsen und den astronomischen Positionswinkel von Nord über Ost. Eine Rotation aktualisiert nur die Overlays und lädt das Himmelsbild nicht neu.</p><p>Nach dem Verschieben des Himmelsbilds setzt „Rahmen auf Bildmitte“ den Kamerarahmen auf die aktuell sichtbare Bildmitte, ohne zum ursprünglichen Katalogobjekt zurückzuspringen. „Himmelsbild neu laden“ ist nur für echte Ladeprobleme oder einen Surveywechsel vorgesehen. Der Regler „Zeit im Planungsfenster“ ändert nicht das Sternfeld, sondern aktualisiert Uhrzeit, Höhe, Azimut/Himmelsrichtung, Abstand zum persönlichen Horizont, Dämmerungsphase und die zeitlich nächstliegenden Wetterwerte.</p><p>„Objektnamen anzeigen“ blendet Namen und Katalognummern ein. In der automatischen Stufe erscheinen bei großem Sichtfeld nur Hauptobjekte; beim Hineinzoomen werden schrittweise weitere Objekte aus dem Planner-Katalog beschriftet. Die Zahl der Beschriftungen wird begrenzt, damit die Ansicht lesbar bleibt.</p><p>Die Framingbewertung berücksichtigt Objektgröße, Positionswinkel, Kamerafeld, relative Drehung und den Mindestfreiraum. Bei verlässlichem Positionswinkel kann die Kamera automatisch auf den größtmöglichen Mindestrand gedreht werden.</p></section>
    <section id="help-horizon"><h3>Standorte und interaktive Horizontprofile</h3><p>Für jeden Standort können mehrere Horizontprofile angelegt werden. Die Standortsuche zeigt eine Trefferliste mit Ort, Region, Land, Postleitzahl und Koordinaten; ein bevorzugtes Land verhindert, dass eine deutsche PLZ ungeprüft einem weltweiten Ersttreffer zugeordnet wird. Die Zeitzone wird automatisch ermittelt und kann nur aus gültigen IANA-Zeitzonen gewählt werden.</p><p>Ein Horizontprofil wird als Standard festgelegt; in Planung und Detailansicht kann vorübergehend ein anderes gewählt werden. Bearbeite die Linie direkt mit Maus oder Finger. Hindernisse gehören zum jeweiligen Profil.</p></section>
    <section id="help-equipment"><h3>Ausrüstung</h3><p>Teleskope, Kameras und Montierungen werden als Listen geführt. Je Kategorie ist ein Eintrag als dauerhafter Standard aktiv. Teleskop und Kamera bestimmen Bildfeld und Pixelmaßstab. Für eine einzelne Planung können beide unter „Profile für diese Planung“ oder direkt im interaktiven Himmelsbild temporär gewechselt werden. Die Montierung dient zunächst der Dokumentation und kann später in Wind- oder Tragfähigkeitsbewertungen einbezogen werden.</p></section>
    <section id="help-settings"><h3>Speichern und Standardwerte</h3><p>Jede Rubrik besitzt eine einheitliche Speicherleiste und einen eigenen Button „Rubrik auf Standard zurücksetzen“. Das Zurücksetzen verändert zunächst nur die Eingaben; dauerhaft wird es erst nach dem Speichern. Nach erfolgreichem Speichern wird der Button drei Sekunden gelb und zeigt „Gespeichert ✓“.</p><p>Die Qualitätsampel verwendet standardmäßig Rot 0–59, Gelb 60–79 und Grün 80–100. Die Grenzen „Gelb ab“ und „Grün ab“ können geändert werden.</p></section>
    <section id="help-backup"><h3>Export, automatische Sicherung und Wiederherstellung</h3><p>„Gesamtsicherung exportieren“ enthält alle Profile samt Ausrüstung, Standorten und Einstellungen. „Aktuelles Profil exportieren“ überträgt nur das aktive Profil einschließlich der dafür benötigten Daten. Mit „Profil importieren“ wird eine solche Profildatei immer als neues Profil angelegt; ein vorhandenes Profil wird nicht ungefragt überschrieben.</p><p><code>astro-night-planner-aktuell.json</code> wird bei jeder automatischen Sicherung überschrieben. Sie enthält den neuesten Stand und ist die erste Wahl für eine normale Wiederherstellung. Dateien wie <code>astro-night-planner-2026-06-16T21-24-30.json</code> sind unveränderliche historische Rücksprungpunkte; verwende sie nur, wenn bewusst ein älterer Zustand benötigt wird.</p><p>Wähle „Aus Sicherung wiederherstellen“, öffne die gewünschte JSON-Datei und kontrolliere die Vorschau mit Sicherungsdatum, Profilen, Teleskopen, Kameras, Montierungen und Standorten. Vor der eigentlichen Wiederherstellung versucht die App, den aktuellen Zustand noch einmal als datierte Sicherung abzulegen. Die externe Datei bleibt nach dem Löschen von Websitedaten erhalten; die Ordnerberechtigung liegt jedoch in IndexedDB und muss danach erneut erteilt werden.</p></section>
    <section id="help-pwa"><h3>Installation als PWA und Offlinebetrieb</h3><p>Nach der Installation kann die App wie ein eigenständiges Programm gestartet werden. Programmdateien stehen offline zur Verfügung. Wetter-, Karten-, Meteoblue- und Katalogaktualisierungen benötigen weiterhin eine Internetverbindung.</p></section>
    <section id="help-troubleshooting"><h3>Fehlerbehebung</h3><p>Bei alten Darstellungen zuerst die App neu laden und einen angebotenen PWA-Updatehinweis bestätigen. Zeigt die Browserhilfe trotzdem einen veralteten Stand, die Anwendung vollständig schließen und neu öffnen. Externe Dienste wie Aladin, Meteoblue und Wettermodelle können zeitweise nicht erreichbar sein. Lösche Websitedaten nur als letzte Maßnahme und ausschließlich nach einer aktuellen externen Sicherung.</p></section>
    <section id="help-values"><h3>Bedeutung der Bewertungswerte</h3><p>Die Gesamtbewertung kombiniert Wolken, effektive Transparenz, Seeing, Wind/Böen, Tauabstand, Mond, Objekthöhe und Sichtbarkeitsdauer. Die Gewichte ergeben zusammen 100 %. Farben beziehen sich auf erwartete Aufnahmequalität, nicht auf die sichere Belastbarkeit der Ausrüstung.</p><p><strong>Atmosphärische Transparenz</strong> beschreibt die wolkenunabhängige Klarheit der Luft. Sie wird durch Aerosole, Dunst, Feuchte, Schleier und Extinktion beeinflusst. Auch bei scheinbar wolkenfreiem Himmel kann eine schlechte atmosphärische Transparenz schwache Nebel- und Galaxienstrukturen deutlich abschwächen.</p><p><strong>Effektive Transparenz</strong> ist der praxisnähere Aufnahmeindikator, weil sie die Luftklarheit mit der tatsächlichen Bewölkung verbindet. Für die Entscheidung, ob sich eine Deep-Sky-Aufnahme lohnt, ist sie meist wichtiger als der reine, wolkenunabhängige Transparenzwert. Die atmosphärische Transparenz bleibt als ergänzende Erklärung nützlich, insbesondere wenn die Wolkenwerte gut aussehen, die Bildqualität aber trotzdem gedämpft sein kann.</p></section>
    <div class="help-return"><a class="button primary" href="./">Zurück zur aktuellen Anwendung</a></div>
  </div>`;
}

async function setObjectDetails(objectId,open=true,scroll=true){const changed=profile.planning.selectedObjectId!==objectId,wasOpen=Boolean(profile.planning.detailsOpen);profile.planning.selectedObjectId=objectId;profile.planning.detailsOpen=open;const object=catalog.find(item=>item.id===objectId);if(open&&object&&(changed||!wasOpen||profile.planning.objectRotationObjectId!==objectId)){profile.planning.objectRotation=normalizedAngle180(Number(object.positionAngleDeg)||0);profile.planning.objectRotationObjectId=objectId}if(open&&(changed||!Number.isFinite(Number(profile.planning.frameRotation)))&&framingSettings().autoRotate&&object)profile.planning.frameRotation=optimalFrameRotation(object);await saveProfile();render();if(scroll)requestAnimationFrame(()=>{const row=[...document.querySelectorAll('[data-object-row]')].find(item=>item.dataset.objectRow===objectId);(open?row?.nextElementSibling:row)?.scrollIntoView({behavior:'smooth',block:open?'nearest':'center'})})}


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
  return uniqueObjectTerms(terms.map(formattedCatalogIdentifier).filter(value=>/^((SH\s*2-|NGC|IC|M|Abell|LDN|LBN|Barnard)\s*\d+)/i.test(value)));
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
  document.getElementById('weatherRefresh')?.addEventListener('click',fetchWeather);
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
  if(button)button.textContent='▶ Abspielen';
}
function applyCloudMapFrame(index,persist=true){if(!cloudMapData)return;const times=cloudDisplayTimes(),max=Math.max(0,times.length-1),value=clamp(Math.round(Number(index)||0),0,max);profile.planning.cloudMapFrame=value;const slider=document.getElementById('cloudMapTime');if(slider){slider.max=String(max);slider.value=String(value)}updateCloudMapReadouts();drawCloudMap();if(persist)scheduleCloudMapProfileSave()}
function updateCloudMapReadouts(){if(!cloudMapData)return;const view=currentCloudMapView(),layer=profile.planning.cloudMapLayer||cloudMapSettings().defaultLayer,index=clamp(Number(profile.planning.cloudMapFrame)||0,0,cloudDisplayTimes().length-1),time=new Date(cloudDisplayTimes()[index]),stats=cloudFrameStats(view,layer,cloudRawPosition(index)),movement=estimateCloudMovement(view,layer,index),loc=activeLocation(),set=(id,text)=>{const element=document.getElementById(id);if(element)element.textContent=text};set('cloudMapTimeLabel',fmtDateTime(time,loc.timezone));set('cloudMapCenterValue',`${fmt(stats.center)} %`);set('cloudMapAverageValue',`${fmt(stats.average)} %`);set('cloudMapSpreadValue',`${fmt(stats.uncertainty,1)} %-Punkte`);set('cloudMapMovement',movement?.reliable?`Geschätzte Verlagerung: ${movement.direction} · ${fmt(movement.distance,0)} km/h · Sicherheit ${fmt(movement.confidence*100)} %`:'Bewegungsrichtung unsicher')}
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
  frame.contentWindow.postMessage({type:'anp-overlay',frameW:setup?.width||0,frameH:setup?.height||0,frameRot:normalizedAngle180(profile.planning.frameRotation||0),showFrame:Boolean(profile.central.frameVisible&&setup),objectW:Math.max(.02,(Number(object.majorArcMin)||1)/60),objectH:Math.max(.02,(Number(object.minorArcMin||object.majorArcMin)||1)/60),objectRot:normalizedAngle180(profile.planning.objectRotationObjectId===object.id&&Number.isFinite(Number(profile.planning.objectRotation))?Number(profile.planning.objectRotation):(Number(object.positionAngleDeg)||0)),catalogRot:normalizedAngle180(Number(object.positionAngleDeg)||0),showObject:Boolean(profile.central.objectSizeVisible),showLabels:profile.central.aladinLabels?.visible!==false,labelDetail:profile.central.aladinLabels?.detail||'auto',targetId:object.id,targetName:object.name,showMoon:Boolean(profile.planning.showMoonInAladin),moonRa:moon.raHours*15,moonDec:moon.decDeg,moonLabel:`${moonName} · ${fmt(sep)}° Abstand · Höhe ${fmt(malt)}°`,moonName,moonIllumination:moonPhase.illumination,moonAge:moonPhase.age,moonWaxing:moonPhase.waxing,outlinePolygons:curatedOutlineForObject(object)?JSON.stringify(curatedOutlineForObject(object).polygons):'',outlineSource:curatedOutlineForObject(object)?.source||'',comparisonFrames:JSON.stringify((profile.planning.comparisonSetupIds||[]).map(id=>(profile.equipment.setups||[]).find(setup=>setup.id===id)).filter(Boolean).map(fovForSetup).filter(Boolean).map((item,index)=>({id:item.id,name:item.name,width:item.width,height:item.height,rotation:normalizedAngle180(profile.planning.frameRotation||0),color:['#ffcf5a','#ba7cff','#7ef29a'][index%3]})))},location.origin);
}
function nearestWeatherAt(time,range){
  const rows=weatherRowsForWindow(range,currentWeatherView());
  if(!rows.length)return null;
  return rows.reduce((best,row)=>Math.abs(new Date(row.time).getTime()-time.getTime())<Math.abs(new Date(best.time).getTime()-time.getTime())?row:best,rows[0]);
}
function twilightLabelAt(time,night){
  const t=time.getTime();
  if(t>=night.astronomicalDusk?.getTime()&&t<=night.astronomicalDawn?.getTime())return'Astronomische Nacht';
  if(t>=night.nauticalDusk?.getTime()&&t<=night.nauticalDawn?.getTime())return'Nautische Dämmerung';
  if(t>=night.civilDusk?.getTime()&&t<=night.civilDawn?.getTime())return'Bürgerliche Dämmerung';
  return'Dämmerung / Tag';
}
function updateFramingTimeReadouts(fraction){
  const object=catalog.find(item=>item.id===profile.planning.selectedObjectId),loc=activeLocation();if(!object||!loc)return;
  const night=nightData(selectedDateKey,loc),range=planningWindow(night,profile.planning.planningWindow),value=clamp(Number(fraction)||0,0,1),time=new Date(range.start.getTime()+(range.end-range.start)*value),alt=altitude(object.raHours,object.decDeg,time,loc.latitude,loc.longitude),az=azimuth(object.raHours,object.decDeg,time,loc.latitude,loc.longitude),horizon=horizonAt(loc,az),clearance=alt-horizon,row=nearestWeatherAt(time,{start:night.sunset,end:night.sunrise}),moon=moonCoords(time),moonSep=angularSeparation(object.raHours,object.decDeg,moon.raHours,moon.decDeg),moonAlt=altitude(moon.raHours,moon.decDeg,time,loc.latitude,loc.longitude),moonPhase=moonPhaseInfo(time),moonName=language==='en'?'Moon':'Mond';
  const label=document.getElementById('framingTimeValue'),clock=document.getElementById('framingTimeClock'),position=document.getElementById('framingTimePosition'),weather=document.getElementById('framingTimeWeather'),moonInfo=document.getElementById('framingMoonInfo');
  if(label)label.textContent=`${fmtTime(time,loc.timezone)} · ${Math.round(value*100)} %`;
  if(clock)clock.textContent=fmtTime(time,loc.timezone);
  if(position)position.innerHTML=`<strong id="framingTimeClock">${fmtTime(time,loc.timezone)}</strong><br>Höhe ${fmt(alt)}° · Azimut ${fmt(az)}° (${cardinal(az)})<br><span class="${clearance>=0?'good-text':'bad-text'}">${clearance>=0?`${fmt(clearance)}° über persönlichem Horizont`:`${fmt(Math.abs(clearance))}° unter persönlichem Horizont`}</span>`;
  if(weather){const setup=fov(),weatherLine=row?`Wolken ${fmt(row.cloud)} % · Seeing Q ${fmt(row.seeing)} · Wind ${fmt(windFromKmh(row.wind),1)} ${windUnitLabel(profile.central.windUnit)}`:'Keine stündlichen Wetterdaten';weather.innerHTML=`${twilightLabelAt(time,night)}<br>${weatherLine}${setup?`<br>Setup ${fmt(setup.width,2)}° × ${fmt(setup.height,2)}°`:''}`}
  if(moonInfo)moonInfo.textContent=`${moonName}: Abstand ${fmt(moonSep)}° · Höhe ${fmt(moonAlt)}° · Beleuchtung ${fmt(moonPhase.illumination)} %`;
  sendAladinOverlayUpdate();
}
function bindFraming(){
  const objectSelect=document.getElementById('framingObjectSelect');if(objectSelect)objectSelect.onchange=async()=>{const item=currentComputedObjects.find(entry=>entry.object.id===objectSelect.value)?.object||catalog.find(entry=>entry.id===objectSelect.value);profile.planning.selectedObjectId=objectSelect.value;if(item){profile.planning.objectRotation=normalizedAngle180(Number(item.positionAngleDeg)||0);profile.planning.objectRotationObjectId=item.id;if(framingSettings().autoRotate)profile.planning.frameRotation=optimalFrameRotation(item)}profile.planning.detailsOpen=true;await saveProfile();render();requestAnimationFrame(()=>document.getElementById(`objectDetail-${objectSelect.value}`)?.scrollIntoView({behavior:'smooth',block:'nearest'}))};
  const changeEquipment=async(type,value)=>{if(type==='scope')profile.planning.temporaryTelescopeId=value===profile.equipment.selectedTelescopeId?null:value;else profile.planning.temporaryCameraId=value===profile.equipment.selectedCameraId?null:value;const object=catalog.find(item=>item.id===profile.planning.selectedObjectId);if(object&&framingSettings().autoRotate)profile.planning.frameRotation=optimalFrameRotation(object);await saveProfile();render()};
  const scope=document.getElementById('framingTelescopeSelect'),camera=document.getElementById('framingCameraSelect');if(scope)scope.onchange=()=>changeEquipment('scope',scope.value);if(camera)camera.onchange=()=>changeEquipment('camera',camera.value);
  const frameVisible=document.getElementById('frameVisible');if(frameVisible)frameVisible.onchange=async()=>{profile.central.frameVisible=frameVisible.checked;await saveProfile();draft=deepClone(profile);sendAladinOverlayUpdate()};
  const objectVisible=document.getElementById('objectSizeVisible');if(objectVisible)objectVisible.onchange=async()=>{profile.central.objectSizeVisible=objectVisible.checked;await saveProfile();draft=deepClone(profile);sendAladinOverlayUpdate()};
  const labelsVisible=document.getElementById('aladinLabelsVisible');if(labelsVisible)labelsVisible.onchange=async()=>{profile.central.aladinLabels.visible=labelsVisible.checked;await saveProfile();draft=deepClone(profile);sendAladinOverlayUpdate()};
  const labelDetail=document.getElementById('aladinLabelDetail');if(labelDetail)labelDetail.onchange=async()=>{profile.central.aladinLabels.detail=labelDetail.value;await saveProfile();draft=deepClone(profile);sendAladinOverlayUpdate()};
  const showMoon=document.getElementById('showMoonInAladin');if(showMoon)showMoon.onchange=async()=>{profile.planning.showMoonInAladin=showMoon.checked;await saveProfile();sendAladinOverlayUpdate()};
  const surveySelect=document.getElementById('aladinSurveySelect');if(surveySelect)surveySelect.onchange=async()=>{profile.planning.aladinSurvey=surveySelect.value;await saveProfile();render()};
  document.getElementById('openAladinExternal')?.addEventListener('click',()=>{const frame=document.getElementById('aladinFrame');if(frame?.src)window.open(frame.src+'&external=1','_blank')});
  document.querySelectorAll('[data-compare-setup]').forEach(element=>element.onchange=async()=>{let values=Array.isArray(profile.planning.comparisonSetupIds)?profile.planning.comparisonSetupIds.slice():[];if(element.checked){if(values.length>=3){element.checked=false;alert('Maximal drei Vergleichsrahmen auswählen.');return}values=[...new Set([...values,element.dataset.compareSetup])]}else values=values.filter(id=>id!==element.dataset.compareSetup);profile.planning.comparisonSetupIds=values;await saveProfile();sendAladinOverlayUpdate();});
  const bindAngle=(id,key,labelId)=>{const element=document.getElementById(id),label=document.getElementById(labelId);if(!element)return;element.oninput=()=>{profile.planning[key]=Number(element.value);if(key==='objectRotation')profile.planning.objectRotationObjectId=profile.planning.selectedObjectId;if(label)label.textContent=`${fmt(profile.planning[key])}°`;sendAladinOverlayUpdate()};element.onchange=async()=>{profile.planning[key]=Number(element.value);if(key==='objectRotation')profile.planning.objectRotationObjectId=profile.planning.selectedObjectId;await saveProfile();sendAladinOverlayUpdate()}};
  bindAngle('frameRotation','frameRotation','frameRotationValue');bindAngle('objectRotation','objectRotation','objectRotationValue');
  const timeSlider=document.getElementById('framingTime');if(timeSlider){timeSlider.oninput=()=>{profile.planning.timeFraction=Number(timeSlider.value)/100;updateFramingTimeReadouts(profile.planning.timeFraction)};timeSlider.onchange=async()=>{profile.planning.timeFraction=Number(timeSlider.value)/100;updateFramingTimeReadouts(profile.planning.timeFraction);await saveProfile()};updateFramingTimeReadouts(profile.planning.timeFraction)}
  document.getElementById('optimalFrameRotation')?.addEventListener('click',async()=>{const object=catalog.find(item=>item.id===profile.planning.selectedObjectId);if(!object)return;profile.planning.frameRotation=optimalFrameRotation(object);const slider=document.getElementById('frameRotation'),label=document.getElementById('frameRotationValue');if(slider)slider.value=String(profile.planning.frameRotation);if(label)label.textContent=`${fmt(profile.planning.frameRotation)}°`;await saveProfile();sendAladinOverlayUpdate()});
  document.getElementById('resetObjectRotation')?.addEventListener('click',async()=>{const object=catalog.find(item=>item.id===profile.planning.selectedObjectId);if(!object)return;profile.planning.objectRotation=normalizedAngle180(Number(object.positionAngleDeg)||0);profile.planning.objectRotationObjectId=object.id;const slider=document.getElementById('objectRotation'),label=document.getElementById('objectRotationValue');if(slider)slider.value=String(profile.planning.objectRotation);if(label)label.textContent=`${fmt(profile.planning.objectRotation)}°`;await saveProfile();sendAladinOverlayUpdate()});
  document.getElementById('centerAladinFrame')?.addEventListener('click',()=>{const frame=document.getElementById('aladinFrame'),button=document.getElementById('centerAladinFrame');if(!frame?.contentWindow)return;if(button){button.textContent='Rahmen wird gesetzt …';button.disabled=true}const send=()=>frame.contentWindow?.postMessage({type:'anp-center-frame'},location.origin);send();window.setTimeout(send,160);window.setTimeout(()=>{if(button?.disabled){button.textContent='Rahmen auf ausgewähltes Objekt';button.disabled=false}},1800)});
  document.getElementById('reloadAladinImage')?.addEventListener('click',()=>{const frame=document.getElementById('aladinFrame');if(!frame)return;try{frame.contentWindow.location.reload()}catch{const url=new URL(frame.src);url.searchParams.set('reload',String(Date.now()));frame.src=url.toString()}});
}

function nearestDetailPoint(points,time){
  return points.reduce((best,point)=>Math.abs(point[0]-time)<Math.abs(best[0]-time)?point:best,points[0]);
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
    canvas.addEventListener('pointerdown',event=>{dragging=true;canvas.setPointerCapture?.(event.pointerId);update(event)});
    canvas.addEventListener('pointermove',event=>{if(dragging)update(event)});
    canvas.addEventListener('pointerup',event=>{if(!dragging)return;dragging=false;canvas.releasePointerCapture?.(event.pointerId);applyDetailTimeFraction(profile.planning.detailTimeFraction,{persist:true})});
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
function bindSettings(){
  document.querySelectorAll('[data-central-subtab]').forEach(b=>b.onclick=()=>{currentCentralSubTab=b.dataset.centralSubtab;render()});
  document.querySelectorAll('[data-info-subtab]').forEach(b=>b.onclick=()=>{currentInfoSubTab=b.dataset.infoSubtab;render()});
  document.querySelectorAll('[data-locations-subtab]').forEach(b=>b.onclick=()=>{currentLocationsSubTab=b.dataset.locationsSubtab;render()});
  document.querySelectorAll('[data-settings-tab]').forEach(b=>b.onclick=async()=>{currentSettingsTab=b.dataset.settingsTab;profile.ui.settingsTab=currentSettingsTab;await saveProfile();render()});
  const ps=document.getElementById('settingsProfileSelect');if(ps)ps.onchange=()=>{document.getElementById('headerProfileSelect').value=ps.value;document.getElementById('headerProfileSelect').dispatchEvent(new Event('change'))};
  document.getElementById('newProfile')?.addEventListener('click',createProfile);document.getElementById('duplicateProfile')?.addEventListener('click',duplicateProfile);document.getElementById('renameProfile')?.addEventListener('click',renameProfile);document.getElementById('deleteProfile')?.addEventListener('click',deleteProfile);
  bindEquipmentDraft();bindCentralDraft();bindLocationDraft();bindTargetSettings();bindInfoActions();
  document.querySelectorAll('[data-save-section]').forEach(b=>b.onclick=()=>saveDraftSection(b.dataset.saveSection));
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
      const markDirty=()=>{row.classList.add('is-dirty');const status=row.querySelector('[data-target-status]');if(status)status.textContent='Ungespeicherte Änderungen';};
      element.oninput=markDirty;
      element.onchange=()=>{const field=element.dataset.targetField;if(field==='referenceLinksText')target.referenceLinks=String(element.value||'').split(/\n+/).map(v=>v.trim()).filter(Boolean);else target[field]=element.value;markDirty();};
    });
  });
  document.querySelectorAll('[data-save-target]').forEach(button=>button.onclick=async()=>{const row=button.closest('[data-target-row]');const target=(profile.targets||[]).find(t=>t.id===button.dataset.saveTarget);if(row&&target){row.querySelectorAll('[data-target-field]').forEach(element=>{const field=element.dataset.targetField;if(field==='referenceLinksText')target.referenceLinks=String(element.value||'').split(/\n+/).map(v=>v.trim()).filter(Boolean);else target[field]=element.value;});}await saveProfile();if(row){row.classList.remove('is-dirty');const status=row.querySelector('[data-target-status]');if(status)status.textContent='Gespeichert ✓';setTimeout(()=>{if(status)status.textContent='';},2200)}});
  document.querySelectorAll('[data-delete-target]').forEach(button=>button.onclick=async()=>{if(!confirm('Aufnahmeziel entfernen?'))return;profile.targets=(profile.targets||[]).filter(t=>t.id!==button.dataset.deleteTarget);await saveProfile();render()});
}

function setSectionDirty(section){
  dirtySections.add(section);
  const button=document.querySelector(`[data-save-section="${section}"]`);
  const bar=button?.closest('.save-bar');
  if(bar){
    bar.classList.add('is-dirty');bar.classList.remove('is-success');
    const state=bar.querySelector('.save-state');if(state)state.textContent='Ungespeicherte Änderungen';
  }
  if(button){button.disabled=false;button.classList.remove('save-success');button.textContent=button.dataset.defaultLabel||'Änderungen speichern'}
  const tabGroups={equipment:['equipment'],central:['centralWind','weatherModels','cloudMap','weights','display','filterProfiles'],locations:['locations'],targets:['targets'],info:['backup']};
  for(const [tab,sections]of Object.entries(tabGroups))if(sections.includes(section))document.querySelector(`[data-settings-tab="${tab}"]`)?.classList.add('dirty-dot');
}
function markDirty(section){setSectionDirty(section)}
function bindEquipmentDraft(){
  document.querySelectorAll('[data-scope-row]').forEach(row=>row.querySelectorAll('[data-scope]').forEach(element=>element.onchange=()=>{const item=draft.equipment.telescopes.find(value=>value.id===row.dataset.scopeRow);item[element.dataset.scope]=element.type==='number'?Number(element.value):element.value;setSectionDirty('equipment')}));
  document.querySelectorAll('[data-camera-row]').forEach(row=>row.querySelectorAll('[data-camera]').forEach(element=>element.onchange=()=>{const item=draft.equipment.cameras.find(value=>value.id===row.dataset.cameraRow);item[element.dataset.camera]=element.type==='number'?Number(element.value):element.value;setSectionDirty('equipment')}));
  document.querySelectorAll('[data-mount-row]').forEach(row=>row.querySelectorAll('[data-mount]').forEach(element=>element.onchange=()=>{const item=draft.equipment.mounts.find(value=>value.id===row.dataset.mountRow);const field=element.dataset.mount;item[field]=element.type==='number'?(element.value===''?null:Number(element.value)):element.value;setSectionDirty('equipment')}));
  document.querySelectorAll('[data-setup-row]').forEach(row=>row.querySelectorAll('[data-setup]').forEach(element=>element.onchange=()=>{const item=(draft.equipment.setups||[]).find(value=>value.id===row.dataset.setupRow);if(item){item[element.dataset.setup]=element.value;setSectionDirty('equipment')}}));
  document.querySelectorAll('[data-selected-scope]').forEach(element=>element.onchange=()=>{draft.equipment.selectedTelescopeId=element.value;setSectionDirty('equipment')});
  document.querySelectorAll('[data-selected-camera]').forEach(element=>element.onchange=()=>{draft.equipment.selectedCameraId=element.value;setSectionDirty('equipment')});
  document.querySelectorAll('[data-selected-mount]').forEach(element=>element.onchange=()=>{draft.equipment.selectedMountId=element.value;setSectionDirty('equipment')});
  document.querySelectorAll('[data-selected-setup]').forEach(element=>element.onchange=()=>{draft.equipment.selectedSetupId=element.value;const setup=(draft.equipment.setups||[]).find(item=>item.id===element.value);if(setup){draft.equipment.selectedTelescopeId=setup.telescopeId;draft.equipment.selectedCameraId=setup.cameraId;draft.equipment.selectedMountId=setup.mountId||draft.equipment.selectedMountId}setSectionDirty('equipment')});
  document.getElementById('addTelescope')?.addEventListener('click',()=>{const id=uid('scope');draft.equipment.telescopes.push({id,name:'Neues Teleskop',focalLength:500,aperture:80});draft.equipment.selectedTelescopeId=id;setSectionDirty('equipment');render()});
  document.getElementById('addCamera')?.addEventListener('click',()=>{const id=uid('cam');draft.equipment.cameras.push({id,name:'Neue Kamera',sensorWidth:23.5,sensorHeight:15.7,pixelSize:3.76});draft.equipment.selectedCameraId=id;setSectionDirty('equipment');render()});
  document.getElementById('addMount')?.addEventListener('click',()=>{const id=uid('mount');draft.equipment.mounts.push({id,name:'Neue Montierung',type:'Parallaktisch',maxPayloadKg:null});draft.equipment.selectedMountId=id;setSectionDirty('equipment');render()});
  document.getElementById('addSetup')?.addEventListener('click',()=>{const id=uid('setup');const scope=draft.equipment.selectedTelescopeId||draft.equipment.telescopes[0]?.id||'',camera=draft.equipment.selectedCameraId||draft.equipment.cameras[0]?.id||'',mount=draft.equipment.selectedMountId||draft.equipment.mounts[0]?.id||'';draft.equipment.setups=draft.equipment.setups||[];draft.equipment.setups.push({id,name:'Neues Setup',telescopeId:scope,cameraId:camera,mountId:mount});draft.equipment.selectedSetupId=id;setSectionDirty('equipment');render()});
  document.querySelectorAll('[data-delete-scope]').forEach(button=>button.onclick=()=>{if(draft.equipment.telescopes.length<=1)return alert('Mindestens ein Teleskop muss erhalten bleiben.');draft.equipment.telescopes=draft.equipment.telescopes.filter(item=>item.id!==button.dataset.deleteScope);draft.equipment.selectedTelescopeId=draft.equipment.telescopes[0]?.id||'';setSectionDirty('equipment');render()});
  document.querySelectorAll('[data-delete-camera]').forEach(button=>button.onclick=()=>{if(draft.equipment.cameras.length<=1)return alert('Mindestens eine Kamera muss erhalten bleiben.');draft.equipment.cameras=draft.equipment.cameras.filter(item=>item.id!==button.dataset.deleteCamera);draft.equipment.selectedCameraId=draft.equipment.cameras[0]?.id||'';setSectionDirty('equipment');render()});
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
  set('cloudMapCollapsedDefault',element=>draft.central.cloudMap.collapsed=element.checked,'cloudMap');
  set('meteoblueMapCollapsedDefault',element=>draft.central.cloudMap.meteoblueMapCollapsed=element.checked,'cloudMap');
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
  const result=locationSearchResults[Number(index)],location=showAddLocationDialog?(pendingLocationDraft||(pendingLocationDraft=createEmptyLocationDraft())):(draft.locations.find(item=>item.id===draft.selectedLocationId)||draft.locations[0]);
  if(!result||!location)return;
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
  document.getElementById('saveNewLocation')?.addEventListener('click',async()=>{const item=pendingLocationDraft||createEmptyLocationDraft();item.name=document.getElementById('newLocName')?.value?.trim()||'Neuer Standort';item.timezone=document.getElementById('newLocTimezone')?.value||'Europe/Berlin';const latValue=document.getElementById('newLocLat')?.value,lonValue=document.getElementById('newLocLon')?.value;const lat=Number(latValue),lon=Number(lonValue);if(!Number.isFinite(lat)||!Number.isFinite(lon)){alert('Bitte Breitengrad und Längengrad eingeben oder Standortsuche/GPS verwenden.');return}item.latitude=lat;item.longitude=lon;item.elevation=Number(document.getElementById('newLocElevation')?.value)||0;draft.locations.push(item);draft.selectedLocationId=item.id;draft.central.defaultLocationId=item.id;showAddLocationDialog=false;pendingLocationDraft=null;locationSearchResults=[];locationSearchQuery='';horizonUndoStack=[];setSectionDirty('locations');await saveDraftSection('locations');profile.planning.locationId=item.id;await saveProfile();draft=deepClone(profile);render()});
  document.getElementById('saveLocationChanges')?.addEventListener('click',()=>saveDraftSection('locations'));
  document.getElementById('deleteLocation')?.addEventListener('click',()=>{draft.locations=draft.locations.filter(item=>item.id!==location().id);draft.selectedLocationId=draft.locations[0].id;if(!draft.locations.some(item=>item.id===draft.central.defaultLocationId))draft.central.defaultLocationId=draft.locations[0].id;horizonUndoStack=[];setSectionDirty('locations');render()});
  document.getElementById('useGpsNewLocation')?.addEventListener('click',()=>navigator.geolocation?.getCurrentPosition(position=>{const item=pendingLocationDraft||(pendingLocationDraft=createEmptyLocationDraft());item.latitude=position.coords.latitude;item.longitude=position.coords.longitude;item.elevation=position.coords.altitude||item.elevation||0;locationSearchResults=[];locationSearchError='';setSectionDirty('locations');render()},error=>alert(`GPS nicht verfügbar: ${error.message}`)));
  const searchQuery=document.getElementById('locationSearchQuery');if(searchQuery){searchQuery.oninput=()=>{locationSearchQuery=searchQuery.value};searchQuery.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();searchLocationCandidates()}}}
  const searchCountry=document.getElementById('locationSearchCountry');if(searchCountry)searchCountry.onchange=()=>{draft.central.locationSearchCountry=searchCountry.value;setSectionDirty('locations')};
  document.getElementById('searchLocation')?.addEventListener('click',searchLocationCandidates);
  document.querySelectorAll('[data-location-result]').forEach(button=>button.onclick=()=>applyLocationSearchResult(button.dataset.locationResult));
  ['newLocName','newLocTimezone','newLocLat','newLocLon','newLocElevation'].forEach(id=>{const el=document.getElementById(id);if(el)el.onchange=()=>{if(!pendingLocationDraft)return;const field={newLocName:'name',newLocTimezone:'timezone',newLocLat:'latitude',newLocLon:'longitude',newLocElevation:'elevation'}[id];pendingLocationDraft[field]=el.type==='number'?Number(el.value):el.value;};});
  const profileSelect=document.getElementById('horizonProfileSelect');if(profileSelect)profileSelect.onchange=()=>{location().selectedHorizonProfileId=profileSelect.value;horizonUndoStack=[];render()};
  const defaultProfile=document.getElementById('defaultHorizonProfileSelect');if(defaultProfile)defaultProfile.onchange=()=>{location().defaultHorizonProfileId=defaultProfile.value;setSectionDirty('locations')};
  document.getElementById('addHorizonProfile')?.addEventListener('click',()=>{const name=prompt('Name des neuen Horizontprofils:','Neues Horizontprofil');if(!name)return;const id=uid('horizon');horizonProfilesFor(location()).push({id,name:name.trim(),horizonProfile:Array(73).fill(0),obstacles:[]});location().selectedHorizonProfileId=id;setSectionDirty('locations');render()});
  document.getElementById('duplicateHorizonProfile')?.addEventListener('click',()=>{const current=entry(),name=prompt('Name der Kopie:',`${current.name} – Kopie`);if(!name)return;const copy=deepClone(current);copy.id=uid('horizon');copy.name=name.trim();horizonProfilesFor(location()).push(copy);location().selectedHorizonProfileId=copy.id;setSectionDirty('locations');render()});
  document.getElementById('renameHorizonProfile')?.addEventListener('click',()=>{const current=entry(),name=prompt('Neuer Name:',current.name);if(!name)return;current.name=name.trim();setSectionDirty('locations');render()});
  document.getElementById('deleteHorizonProfile')?.addEventListener('click',()=>{const profiles=horizonProfilesFor(location()),current=entry();if(profiles.length<=1||!confirm(`Horizontprofil „${current.name}“ löschen?`))return;location().horizonProfiles=profiles.filter(item=>item.id!==current.id);if(location().defaultHorizonProfileId===current.id)location().defaultHorizonProfileId=location().horizonProfiles[0].id;location().selectedHorizonProfileId=location().defaultHorizonProfileId;setSectionDirty('locations');render()});
  document.getElementById('resetHorizon')?.addEventListener('click',()=>{horizonUndoStack.push(ensureHorizonProfile(location(),entry()?.id).slice());horizonUndoStack=horizonUndoStack.slice(-20);entry().horizonProfile=Array(73).fill(0);mark();render()});
  document.getElementById('undoHorizon')?.addEventListener('click',()=>{const previous=horizonUndoStack.pop();if(!previous)return;entry().horizonProfile=previous.slice();mark();render()});
  const canvas=document.querySelector('.settings-horizon-chart[data-editable="true"]');if(canvas){let drawing=false,lastIndex=null,lastAltitude=null;const pointFromEvent=event=>{const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)*canvas.width/Math.max(1,rect.width),y=(event.clientY-rect.top)*canvas.height/Math.max(1,rect.height),margin={left:62,right:22,top:22,bottom:68},plotW=canvas.width-margin.left-margin.right,plotH=canvas.height-margin.top-margin.bottom;return{index:clamp(Math.round(clamp((x-margin.left)/plotW*360,0,360)/5),0,72),altitude:clamp(90-(y-margin.top)/plotH*90,0,90)}};const applyPoint=point=>{const values=ensureHorizonProfile(location(),entry()?.id);if(lastIndex===null)values[point.index]=point.altitude;else{const from=Math.min(lastIndex,point.index),to=Math.max(lastIndex,point.index),span=Math.max(1,to-from);for(let index=from;index<=to;index++){const fraction=(index-from)/span,start=lastIndex<=point.index?lastAltitude:point.altitude,end=lastIndex<=point.index?point.altitude:lastAltitude;values[index]=start+(end-start)*fraction}}if(point.index===0||point.index===72){values[0]=point.altitude;values[72]=point.altitude}lastIndex=point.index;lastAltitude=point.altitude;mark()};canvas.addEventListener('pointerdown',event=>{event.preventDefault();drawing=true;canvas.setPointerCapture?.(event.pointerId);horizonUndoStack.push(ensureHorizonProfile(location(),entry()?.id).slice());horizonUndoStack=horizonUndoStack.slice(-20);lastIndex=null;lastAltitude=null;applyPoint(pointFromEvent(event))});canvas.addEventListener('pointermove',event=>{if(!drawing)return;event.preventDefault();applyPoint(pointFromEvent(event))});const stop=event=>{if(!drawing)return;drawing=false;canvas.releasePointerCapture?.(event.pointerId);lastIndex=null;lastAltitude=null;render()};canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop)}
  document.getElementById('addObstacle')?.addEventListener('click',()=>{entry().obstacles.push({id:uid('obs'),name:'Baum/Gebäude',azimuth:180,altitude:20});setSectionDirty('locations');render()});
  document.querySelectorAll('[data-obstacle]').forEach(row=>row.querySelectorAll('[data-obstacle-field]').forEach(element=>{const update=()=>{const obstacle=entry().obstacles.find(item=>item.id===row.dataset.obstacle);obstacle[element.dataset.obstacleField]=element.type==='number'?Number(element.value):element.value;setSectionDirty('locations');syncSettingsHorizonCanvas()};element.oninput=update;element.onchange=update}));
  document.querySelectorAll('[data-delete-obstacle]').forEach(button=>button.onclick=()=>{entry().obstacles=entry().obstacles.filter(item=>item.id!==button.dataset.deleteObstacle);setSectionDirty('locations');render()});
}
async function saveDraftSection(section){
  let profileChanged=true;
  if(section==='equipment'){
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
    profile.central.weatherModels=deepClone(draft.central.weatherModels);profile.planning.temporaryWeatherView=null;profile.planning.temporaryCloudMapView=null;dirtySections.delete('weatherModels');
  }
  if(section==='cloudMap'){
    profile.central.cloudMap={...deepClone(draft.central.cloudMap)};profile.planning.temporaryCloudMapView=null;profile.planning.temporaryCloudMapBaseMode=null;profile.planning.temporaryCloudSmoothing=null;profile.planning.temporaryCloudMapShowValues=null;profile.planning.cloudMapLayer=profile.central.cloudMap.defaultLayer;profile.planning.cloudMapMode=profile.central.cloudMap.defaultMode;profile.planning.cloudMapFrame=0;profile.planning.cloudMapTimeStepMinutes=null;cloudMapData=null;dirtySections.delete('cloudMap');
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
    profile.central.defaultPlanningWindow=draft.central.defaultPlanningWindow;profile.planning.planningWindow=draft.central.defaultPlanningWindow;profile.central.framing=deepClone(draft.central.framing);profile.central.qualityThresholds=deepClone(draft.central.qualityThresholds);profile.central.aladinLabels=deepClone(draft.central.aladinLabels);profile.central.aladinSurveys=deepClone(draft.central.aladinSurveys);profile.central.listDisplay=deepClone(draft.central.listDisplay);profile.central.frameVisible=draft.central.frameVisible;profile.central.objectSizeVisible=draft.central.objectSizeVisible;profile.central.meteoblueCollapsed=draft.central.meteoblueCollapsed;profile.central.detailPanels=deepClone(draft.central.detailPanels);profile.central.collapsed=deepClone(draft.central.collapsed);profile.planning.detailsOpen=false;page=1;dirtySections.delete('display');
  }
  if(section==='locations'){
    draft.locations.forEach(item=>{horizonProfilesFor(item).forEach(entry=>{ensureHorizonProfile(item,entry.id);entry.horizonProfile[72]=entry.horizonProfile[0]});syncCardinalHorizon(item,item.selectedHorizonProfileId)});
    profile.locations=deepClone(draft.locations);profile.selectedLocationId=draft.selectedLocationId;profile.central.defaultLocationId=draft.central.defaultLocationId;profile.central.gpsBehavior=draft.central.gpsBehavior;profile.central.locationSearchCountry=draft.central.locationSearchCountry;if(profile.planning.locationId&&!profile.locations.some(item=>item.id===profile.planning.locationId))profile.planning.locationId=null;const active=activeLocation();if(profile.planning.temporaryHorizonProfileId&&!horizonProfilesFor(active).some(item=>item.id===profile.planning.temporaryHorizonProfileId))profile.planning.temporaryHorizonProfileId=null;dirtySections.delete('locations');horizonUndoStack=[];
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
  document.getElementById('importProfile')?.addEventListener('click',()=>{importMode='profile';importInput.click()});
  document.getElementById('restoreBackup')?.addEventListener('click',()=>{importMode='backup';importInput.click()});
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
  const renderWidth=smoothing==='structured'?520:smoothing==='soft'?280:390;
  offscreen.width=renderWidth;offscreen.height=Math.max(180,Math.round(renderWidth*map.h/map.w));
  const offCtx=offscreen.getContext('2d');
  for(let py=0;py<offscreen.height;py++){
    const gy=(py/Math.max(1,offscreen.height-1))*(size-1);
    for(let px=0;px<offscreen.width;px++){
      const gx=(px/Math.max(1,offscreen.width-1))*(size-1);
      const value=cloudMapInterpolated(drawValues,size,gx,gy);
      offCtx.fillStyle=cloudMapColor(value,layer,mode);
      offCtx.fillRect(px,py,1,1);
    }
  }
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  ctx.save();
  ctx.filter=smoothing==='soft'?'blur(5px)':smoothing==='balanced'?'blur(2px)':'none';
  const pad=smoothing==='soft'?9:smoothing==='balanced'?4:0;
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
  ctx.fillStyle='#dcecff';ctx.font='700 26px system-ui';ctx.textAlign='center';ctx.fillText('N',W/2,34);ctx.fillText('S',W/2,H-16);ctx.textAlign='left';ctx.fillText('W',30,H/2);ctx.textAlign='right';ctx.fillText('O',W-30,H/2);
  ctx.textAlign='left';ctx.font='600 20px system-ui';ctx.fillStyle='#b9d3e8';ctx.fillText(`${cloudMapData.locationName} · Radius ${cloudMapData.radiusKm} km`,map.x,map.y-16);ctx.textAlign='right';ctx.fillText(`${weatherViewLabel(view)} · ${optionLabel(CLOUD_MAP_LAYER_OPTIONS.find(item=>item[0]===layer)?.[1]||layer)}`,map.x+map.w,map.y-16);
  ctx.textAlign='center';ctx.font='700 22px system-ui';ctx.fillStyle='#ffe08a';ctx.fillText(cloudMapData.locationName,cx,cy+44);

  const legend=document.getElementById('cloudMapLegend');
  if(legend){
    const definition=cloudLegendDefinition(layer,mode),overlays=cloudMapWeatherOverlays();
    legend.innerHTML=`<div class="cloud-scale"><span>${definition.left}</span><span class="cloud-scale-zero">0 %</span><div class="legend-gradient dynamic" style="background:${definition.gradient}"></div><span>${definition.right}</span></div>${mode==='clouds'?`<div class="cloud-phenomena" aria-label="Niederschlagsarten"><label class="cloud-phenomenon precip"><input type="checkbox" data-cloud-overlay="precip" ${overlays.precip?'checked':''}><i></i>Niederschlag</label><label class="cloud-phenomenon rain"><input type="checkbox" data-cloud-overlay="rain" ${overlays.rain?'checked':''}><i></i>Regen</label><label class="cloud-phenomenon snow"><input type="checkbox" data-cloud-overlay="snow" ${overlays.snow?'checked':''}><i></i>Schnee</label></div>`:''}<div class="cloud-value-legend"><b>xx%</b><span>Wolkenanteil<br>am Prognosepunkt</span></div>`;
  }
}
function drawMiniCharts(){document.querySelectorAll('.mini-chart').forEach(canvas=>{const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;const points=JSON.parse(decodeURIComponent(canvas.dataset.points));const start=Number(canvas.dataset.start),end=Number(canvas.dataset.end),civilS=Number(canvas.dataset.civilStart),civilE=Number(canvas.dataset.civilEnd),astroS=Number(canvas.dataset.astroStart),astroE=Number(canvas.dataset.astroEnd),nautS=Number(canvas.dataset.nautStart),nautE=Number(canvas.dataset.nautEnd),minAlt=Number(canvas.dataset.minAlt);ctx.clearRect(0,0,w,h);const x=t=>(t-start)/(end-start)*w,y=a=>h-8-clamp(a,0,90)/90*(h-16);ctx.fillStyle='#3a3227';ctx.fillRect(0,0,w,h);const band=(s,e,fill)=>{const left=clamp(x(s),0,w),right=clamp(x(e),0,w);if(right<=left)return;ctx.fillStyle=fill;ctx.fillRect(left,0,right-left,h)};band(civilS,civilE,'#1b2a3d');band(nautS,nautE,'#142235');band(astroS,astroE,'#08121f');for(const t of [civilS,nautS,astroS,astroE,nautE,civilE]){ctx.beginPath();ctx.strokeStyle='#73849a';ctx.setLineDash([3,3]);ctx.moveTo(x(t),0);ctx.lineTo(x(t),h);ctx.stroke()}ctx.setLineDash([5,4]);ctx.strokeStyle='#d7ad47';ctx.beginPath();ctx.moveTo(0,y(minAlt));ctx.lineTo(w,y(minAlt));ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle='#7ec1ff';ctx.lineWidth=2;ctx.beginPath();points.forEach(([t,a],i)=>i?ctx.lineTo(x(t),y(a)):ctx.moveTo(x(t),y(a)));ctx.stroke();const max=points.reduce((m,p)=>p[1]>m[1]?p:m,points[0]);ctx.fillStyle='#f0c75e';ctx.beginPath();ctx.arc(x(max[0]),y(max[1]),3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#aabbd0';ctx.font='10px sans-serif';ctx.fillText('0°',2,h-2);ctx.fillText('90°',2,10)})}

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
    context.fillText(`Mindesthöhe ${fmt(minAltitude)}°`,margin.left+8,y(minAltitude)-4);
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
    context.fillText('Objekthöhe',margin.left,2);
    context.fillStyle=palette.accent2;
    context.fillText('— persönlicher Horizont',margin.left+110,2);
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
  context.clearRect(0,0,width,height);
  context.fillStyle=palette.background;
  context.fillRect(0,0,width,height);
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
    context.fillStyle=palette.horizonFill;
    context.fill();
    context.strokeStyle=palette.accent2;
    context.lineWidth=4;
    context.beginPath();
    horizon.forEach((point,index)=>index?context.lineTo(x(point[0]),y(point[1])):context.moveTo(x(point[0]),y(point[1])));
    context.stroke();
    if(canvas.dataset.editable==='true'){
      horizon.forEach((point,index)=>{
        if(index%3!==0&&index!==horizon.length-1)return;
        context.fillStyle='#07111d';context.strokeStyle=palette.accent2;context.lineWidth=2;
        context.beginPath();context.arc(x(point[0]),y(point[1]),5,0,Math.PI*2);context.fill();context.stroke();
      });
    }
  }
  if(showGround)obstacles.forEach(obstacle=>{
    const center=((Number(obstacle.azimuth)%360)+360)%360;
    const halfWidth=6;
    const left=center-halfWidth,right=center+halfWidth;
    context.fillStyle='rgba(241,112,112,.28)';
    const drawBlock=(from,to)=>{
      context.fillRect(x(from),y(obstacle.altitude),x(to)-x(from),y(0)-y(obstacle.altitude));
      context.strokeStyle=palette.danger;context.lineWidth=2;context.strokeRect(x(from),y(obstacle.altitude),x(to)-x(from),y(0)-y(obstacle.altitude));
    };
    if(left<0){drawBlock(0,right);drawBlock(360+left,360)}
    else if(right>360){drawBlock(left,360);drawBlock(0,right-360)}
    else drawBlock(left,right);
    context.fillStyle=palette.danger;context.textAlign='center';context.textBaseline='bottom';context.fillText(String(obstacle.name||'Hindernis'),x(center),y(obstacle.altitude)-4);
  });
  if(track.length){
    const selectedStart=Number(canvas.dataset.selectedStart),selectedEnd=Number(canvas.dataset.selectedEnd);
    context.strokeStyle=palette.accent;
    context.lineWidth=3;
    context.beginPath();
    let previous=null;
    track.forEach(point=>{
      if(previous&&Math.abs(point[0]-previous[0])>180){context.stroke();context.beginPath();previous=null}
      if(previous)context.lineTo(x(point[0]),y(point[1]));else context.moveTo(x(point[0]),y(point[1]));
      previous=point;
    });
    context.stroke();
    const selected=track.filter(point=>point[2]>=selectedStart&&point[2]<=selectedEnd);
    if(selected.length){
      context.strokeStyle=palette.warning;
      context.lineWidth=5;
      context.beginPath();
      let previousSelected=null;
      selected.forEach(point=>{
        if(previousSelected&&Math.abs(point[0]-previousSelected[0])>180){context.stroke();context.beginPath();previousSelected=null}
        if(previousSelected)context.lineTo(x(point[0]),y(point[1]));else context.moveTo(x(point[0]),y(point[1]));
        previousSelected=point;
      });
      context.stroke();
    }
    const currentTime=clamp(Number(canvas.dataset.currentTime)||track[0][2],track[0][2],track[track.length-1][2]);
    const currentPoint=nearestDetailPoint(track.map(point=>[point[2],point[1],point[0]]),currentTime);
    const currentAzimuth=currentPoint[2],currentAltitude=currentPoint[1];
    context.strokeStyle='#d8ecff';context.lineWidth=2;
    context.beginPath();context.moveTo(x(currentAzimuth)-12,y(currentAltitude));context.lineTo(x(currentAzimuth)+12,y(currentAltitude));context.moveTo(x(currentAzimuth),y(currentAltitude)-12);context.lineTo(x(currentAzimuth),y(currentAltitude)+12);context.stroke();
    context.fillStyle=palette.warning;context.beginPath();context.arc(x(currentAzimuth),y(currentAltitude),7,0,Math.PI*2);context.fill();
    context.strokeStyle='#07111d';context.lineWidth=3;context.stroke();
    context.fillStyle='#fff2bd';context.textAlign=currentAzimuth>280?'right':'left';context.textBaseline='bottom';
    context.fillText(`${fmtTime(new Date(currentTime),canvas.dataset.timezone)} · ${fmt(currentAltitude)}° · ${cardinal(currentAzimuth)} (${fmt(currentAzimuth)}°)`,x(currentAzimuth)+(currentAzimuth>280?-12:12),y(currentAltitude)-12);
  }
  context.strokeStyle='#38516d';
  context.lineWidth=1;
  context.strokeRect(margin.left,margin.top,plotW,plotH);
  context.fillStyle=palette.text;
  context.textAlign='left';
  context.textBaseline='top';
  context.fillText(withTrack?'Horizont (grün) · Objektbahn (blau) · Planungszeitraum (gelb)':'Persönlicher Horizont und Hindernisse',margin.left,2);
}

function drawSettingsHorizonCharts(){
  document.querySelectorAll('.settings-horizon-chart').forEach(canvas=>drawHorizonChart(canvas,false));
}

function syncSettingsHorizonCanvas(){const canvas=document.querySelector('.settings-horizon-chart');if(!canvas)return;const location=draft.locations.find(item=>item.id===draft.selectedLocationId)||draft.locations[0],entry=horizonProfileFor(location,location.selectedHorizonProfileId),points=ensureHorizonProfile(location,entry?.id).map((altitude,index)=>[index*5,Number(altitude)||0]);canvas.dataset.horizon=encodeURIComponent(JSON.stringify(points));canvas.dataset.obstacles=encodeURIComponent(JSON.stringify((entry?.obstacles||[]).map(item=>({name:item.name||'Hindernis',azimuth:Number(item.azimuth)||0,altitude:Number(item.altitude)||0}))));drawSettingsHorizonCharts()}

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


window.addEventListener('message',event=>{
  if(event.origin!==location.origin)return;
  if(event.data?.type==='anp-aladin-ready'){sendAladinOverlayUpdate();return}
  if(event.data?.type==='anp-frame-centered'){
    const button=document.getElementById('centerAladinFrame');
    if(!button)return;
    button.textContent='Rahmen gesetzt ✓';button.disabled=true;
    window.setTimeout(()=>{button.textContent='Rahmen auf ausgewähltes Objekt';button.disabled=false},1800);
    return;
  }
  if(event.data?.type==='anp-select-object'){
    const objectId=event.data.objectId;
    if(catalog.some(item=>item.id===objectId)){setObjectDetails(objectId,true,true);}
    return;
  }
  if(event.data?.type==='anp-add-target'){
    const objectId=event.data.objectId;
    addImagingTarget(objectId).then(()=>render());
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
    window.setTimeout(()=>{button.textContent='Rahmen auf ausgewähltes Objekt';button.disabled=false},1800);
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
