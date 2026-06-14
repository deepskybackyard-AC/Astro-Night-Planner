import type { DeepSkyObject } from '../types';

type CuratedObject = Omit<DeepSkyObject, 'catalogs'>;

// Fachlich nachbearbeitete Werte und gebräuchliche deutsche Namen überschreiben Katalog-Rohdaten.
export const CURATED_OBJECTS: CuratedObject[] = [
  { id:'M31', name:'Andromedagalaxie', aliases:['M31','NGC 224'], type:'Galaxie', raHours:0.712, decDeg:41.269, magnitude:3.4, majorArcMin:190, minorArcMin:60, constellation:'Andromeda', recommendedFilters:['L','RGB'] },
  { id:'M33', name:'Dreiecksnebel', aliases:['M33','NGC 598'], type:'Galaxie', raHours:1.564, decDeg:30.660, magnitude:5.7, majorArcMin:73, minorArcMin:45, constellation:'Dreieck', recommendedFilters:['L','RGB','Hα'] },
  { id:'M51', name:'Whirlpool-Galaxie', aliases:['M51','NGC 5194'], type:'Galaxie', raHours:13.498, decDeg:47.195, magnitude:8.4, majorArcMin:11.2, minorArcMin:6.9, constellation:'Jagdhunde', recommendedFilters:['L','RGB','Hα'] },
  { id:'M63', name:'Sonnenblumen-Galaxie', aliases:['M63','NGC 5055'], type:'Galaxie', raHours:13.264, decDeg:42.030, magnitude:8.6, majorArcMin:12.6, minorArcMin:7.2, constellation:'Jagdhunde', recommendedFilters:['L','RGB'] },
  { id:'M64', name:'Black-Eye-Galaxie', aliases:['M64','NGC 4826'], type:'Galaxie', raHours:12.945, decDeg:21.683, magnitude:8.5, majorArcMin:10.7, minorArcMin:5.1, constellation:'Haar der Berenike', recommendedFilters:['L','RGB'] },
  { id:'M81', name:'Bodes Galaxie', aliases:['M81','NGC 3031'], type:'Galaxie', raHours:9.926, decDeg:69.065, magnitude:6.9, majorArcMin:26.9, minorArcMin:14.1, constellation:'Großer Bär', recommendedFilters:['L','RGB','Hα'] },
  { id:'M82', name:'Zigarrengalaxie', aliases:['M82','NGC 3034'], type:'Galaxie', raHours:9.931, decDeg:69.679, magnitude:8.4, majorArcMin:11.2, minorArcMin:4.3, constellation:'Großer Bär', recommendedFilters:['L','RGB','Hα'] },
  { id:'M101', name:'Feuerradgalaxie', aliases:['M101','NGC 5457'], type:'Galaxie', raHours:14.054, decDeg:54.349, magnitude:7.9, majorArcMin:28.8, minorArcMin:26.9, constellation:'Großer Bär', recommendedFilters:['L','RGB','Hα'] },
  { id:'M104', name:'Sombrerogalaxie', aliases:['M104','NGC 4594'], type:'Galaxie', raHours:12.667, decDeg:-11.623, magnitude:8.0, majorArcMin:8.7, minorArcMin:3.5, constellation:'Jungfrau', recommendedFilters:['L','RGB'] },
  { id:'M106', name:'Maser-Galaxie', aliases:['M106','NGC 4258'], type:'Galaxie', raHours:12.316, decDeg:47.304, magnitude:8.4, majorArcMin:18.6, minorArcMin:7.2, constellation:'Jagdhunde', recommendedFilters:['L','RGB','Hα'] },

  { id:'M1', name:'Krebsnebel', aliases:['M1','NGC 1952'], type:'Supernovaüberrest', raHours:5.575, decDeg:22.015, magnitude:8.4, majorArcMin:7, minorArcMin:5, constellation:'Stier', recommendedFilters:['RGB','Hα','OIII'] },
  { id:'NGC6960', name:'Westlicher Cirrusnebel', aliases:['NGC 6960','Hexenhand'], type:'Supernovaüberrest', raHours:20.760, decDeg:30.720, majorArcMin:70, minorArcMin:6, constellation:'Schwan', recommendedFilters:['Hα','OIII','RGB'] },
  { id:'NGC6992', name:'Östlicher Cirrusnebel', aliases:['NGC 6992','NGC 6995'], type:'Supernovaüberrest', raHours:20.940, decDeg:31.720, majorArcMin:80, minorArcMin:8, constellation:'Schwan', recommendedFilters:['Hα','OIII','RGB'] },
  { id:'Sh2-240', name:'Spaghettinebel', aliases:['Sh2-240','Simeis 147'], type:'Supernovaüberrest', raHours:5.650, decDeg:28.000, majorArcMin:180, minorArcMin:160, constellation:'Stier', recommendedFilters:['Hα','OIII'] },
  { id:'CTB1', name:'CTB 1', aliases:['CTB 1','Abell 85'], type:'Supernovaüberrest', raHours:23.990, decDeg:50.950, majorArcMin:34, minorArcMin:27, constellation:'Kassiopeia', recommendedFilters:['Hα','OIII'] },

  { id:'M8', name:'Lagunennebel', aliases:['M8','NGC 6523'], type:'Emissionsnebel', raHours:18.063, decDeg:-24.386, magnitude:6.0, majorArcMin:90, minorArcMin:40, constellation:'Schütze', recommendedFilters:['RGB','Hα','OIII'] },
  { id:'M16', name:'Adlernebel', aliases:['M16','NGC 6611'], type:'Emissionsnebel', raHours:18.314, decDeg:-13.806, magnitude:6.0, majorArcMin:35, minorArcMin:28, constellation:'Schlange', recommendedFilters:['RGB','Hα','OIII','SII'] },
  { id:'M17', name:'Omeganebel', aliases:['M17','NGC 6618'], type:'Emissionsnebel', raHours:18.346, decDeg:-16.176, magnitude:6.0, majorArcMin:46, minorArcMin:37, constellation:'Schütze', recommendedFilters:['RGB','Hα','OIII','SII'] },
  { id:'M20', name:'Trifidnebel', aliases:['M20','NGC 6514'], type:'Emissionsnebel', raHours:18.045, decDeg:-22.971, magnitude:6.3, majorArcMin:28, minorArcMin:28, constellation:'Schütze', recommendedFilters:['RGB','Hα','OIII'] },
  { id:'M42', name:'Orionnebel', aliases:['M42','NGC 1976'], type:'Emissionsnebel', raHours:5.588, decDeg:-5.391, magnitude:4.0, majorArcMin:85, minorArcMin:60, constellation:'Orion', recommendedFilters:['RGB','Hα','OIII'] },
  { id:'NGC2024', name:'Flammennebel', aliases:['NGC 2024'], type:'Emissionsnebel', raHours:5.700, decDeg:-1.850, majorArcMin:30, minorArcMin:30, constellation:'Orion', recommendedFilters:['RGB','Hα'] },
  { id:'NGC2237', name:'Rosettennebel', aliases:['NGC 2237','Caldwell 49'], type:'Emissionsnebel', raHours:6.530, decDeg:5.050, majorArcMin:80, minorArcMin:60, constellation:'Einhorn', recommendedFilters:['RGB','Hα','OIII','SII'] },
  { id:'NGC6888', name:'Sichelnebel', aliases:['NGC 6888','Crescent Nebula'], type:'Emissionsnebel', raHours:20.200, decDeg:38.350, magnitude:7.4, majorArcMin:20, minorArcMin:10, constellation:'Schwan', recommendedFilters:['Hα','OIII','RGB'] },
  { id:'NGC7000', name:'Nordamerikanebel', aliases:['NGC 7000','Caldwell 20'], type:'Emissionsnebel', raHours:20.990, decDeg:44.330, majorArcMin:120, minorArcMin:100, constellation:'Schwan', recommendedFilters:['Hα','OIII','RGB'] },
  { id:'IC5070', name:'Pelikannebel', aliases:['IC 5070','IC 5067'], type:'Emissionsnebel', raHours:20.850, decDeg:44.350, majorArcMin:60, minorArcMin:50, constellation:'Schwan', recommendedFilters:['Hα','OIII','RGB'] },
  { id:'NGC1499', name:'Kaliforniennebel', aliases:['NGC 1499'], type:'Emissionsnebel', raHours:4.050, decDeg:36.400, majorArcMin:160, minorArcMin:40, constellation:'Perseus', recommendedFilters:['Hα','RGB'] },
  { id:'IC1396', name:'Elefantenrüssel-Region', aliases:['IC 1396'], type:'Emissionsnebel', raHours:21.650, decDeg:57.500, majorArcMin:170, minorArcMin:140, constellation:'Kepheus', recommendedFilters:['Hα','OIII','SII','RGB'] },
  { id:'IC1805', name:'Herznebel', aliases:['IC 1805'], type:'Emissionsnebel', raHours:2.550, decDeg:61.450, majorArcMin:150, minorArcMin:150, constellation:'Kassiopeia', recommendedFilters:['Hα','OIII','SII','RGB'] },
  { id:'IC1848', name:'Seelennebel', aliases:['IC 1848','W5'], type:'Emissionsnebel', raHours:2.850, decDeg:60.430, majorArcMin:150, minorArcMin:75, constellation:'Kassiopeia', recommendedFilters:['Hα','OIII','SII','RGB'] },
  { id:'NGC7635', name:'Blasennebel', aliases:['NGC 7635','Caldwell 11'], type:'Emissionsnebel', raHours:23.350, decDeg:61.200, magnitude:10.0, majorArcMin:15, minorArcMin:8, constellation:'Kassiopeia', recommendedFilters:['Hα','OIII','RGB'] },

  { id:'M78', name:'M78', aliases:['M78','NGC 2068'], type:'Reflexionsnebel', raHours:5.779, decDeg:0.079, magnitude:8.3, majorArcMin:8, minorArcMin:6, constellation:'Orion', recommendedFilters:['L','RGB'] },
  { id:'NGC7023', name:'Irisnebel', aliases:['NGC 7023','Caldwell 4'], type:'Reflexionsnebel', raHours:21.018, decDeg:68.170, magnitude:7.2, majorArcMin:18, minorArcMin:18, constellation:'Kepheus', recommendedFilters:['L','RGB'] },

  { id:'M27', name:'Hantelnebel', aliases:['M27','NGC 6853'], type:'Planetarischer Nebel', raHours:19.994, decDeg:22.721, magnitude:7.4, majorArcMin:8, minorArcMin:6, constellation:'Füchschen', recommendedFilters:['RGB','OIII','Hα'] },
  { id:'M57', name:'Ringnebel', aliases:['M57','NGC 6720'], type:'Planetarischer Nebel', raHours:18.894, decDeg:33.030, magnitude:8.8, majorArcMin:1.4, minorArcMin:1.0, constellation:'Leier', recommendedFilters:['RGB','OIII','Hα'] },
  { id:'M76', name:'Kleiner Hantelnebel', aliases:['M76','NGC 650'], type:'Planetarischer Nebel', raHours:1.704, decDeg:51.576, magnitude:10.1, majorArcMin:2.7, minorArcMin:1.8, constellation:'Perseus', recommendedFilters:['RGB','OIII','Hα'] },
  { id:'M97', name:'Eulennebel', aliases:['M97','NGC 3587'], type:'Planetarischer Nebel', raHours:11.248, decDeg:55.019, magnitude:9.9, majorArcMin:3.4, minorArcMin:3.3, constellation:'Großer Bär', recommendedFilters:['RGB','OIII','Hα'] },
  { id:'NGC2392', name:'Eskimo-Nebel', aliases:['NGC 2392','Caldwell 39'], type:'Planetarischer Nebel', raHours:7.486, decDeg:20.911, magnitude:9.2, majorArcMin:0.8, minorArcMin:0.7, constellation:'Zwillinge', recommendedFilters:['RGB','OIII','Hα'] },
  { id:'NGC6543', name:'Katzenaugennebel', aliases:['NGC 6543','Caldwell 6'], type:'Planetarischer Nebel', raHours:17.975, decDeg:66.633, magnitude:8.1, majorArcMin:0.4, minorArcMin:0.3, constellation:'Drache', recommendedFilters:['RGB','OIII','Hα'] },
  { id:'NGC7293', name:'Helixnebel', aliases:['NGC 7293','Caldwell 63'], type:'Planetarischer Nebel', raHours:22.493, decDeg:-20.837, magnitude:7.6, majorArcMin:25, minorArcMin:20, constellation:'Wassermann', recommendedFilters:['OIII','Hα','RGB'] },
  { id:'Sh2-216', name:'Sh2-216', aliases:['Sh2-216'], type:'Planetarischer Nebel', raHours:4.730, decDeg:46.700, majorArcMin:100, minorArcMin:100, constellation:'Perseus', recommendedFilters:['Hα','OIII'] },

  { id:'M13', name:'Herkuleshaufen', aliases:['M13','NGC 6205'], type:'Kugelsternhaufen', raHours:16.695, decDeg:36.461, magnitude:5.8, majorArcMin:20, minorArcMin:20, constellation:'Herkules', recommendedFilters:['L','RGB'] },
  { id:'M92', name:'M92', aliases:['M92','NGC 6341'], type:'Kugelsternhaufen', raHours:17.285, decDeg:43.136, magnitude:6.4, majorArcMin:14, minorArcMin:14, constellation:'Herkules', recommendedFilters:['L','RGB'] },

  { id:'M35', name:'M35', aliases:['M35','NGC 2168'], type:'Offener Sternhaufen', raHours:6.148, decDeg:24.333, magnitude:5.1, majorArcMin:28, minorArcMin:28, constellation:'Zwillinge', recommendedFilters:['RGB'] },
  { id:'M37', name:'M37', aliases:['M37','NGC 2099'], type:'Offener Sternhaufen', raHours:5.872, decDeg:32.553, magnitude:6.2, majorArcMin:24, minorArcMin:24, constellation:'Fuhrmann', recommendedFilters:['RGB'] },
  { id:'M44', name:'Praesepe', aliases:['M44','Krippe'], type:'Offener Sternhaufen', raHours:8.670, decDeg:19.670, magnitude:3.1, majorArcMin:95, minorArcMin:95, constellation:'Krebs', recommendedFilters:['RGB'] },
  { id:'M45', name:'Plejaden', aliases:['M45','Siebengestirn'], type:'Offener Sternhaufen', raHours:3.791, decDeg:24.117, magnitude:1.6, majorArcMin:110, minorArcMin:110, constellation:'Stier', recommendedFilters:['L','RGB'] },
  { id:'M46', name:'M46', aliases:['M46','NGC 2437'], type:'Offener Sternhaufen', raHours:7.697, decDeg:-14.810, magnitude:6.1, majorArcMin:27, minorArcMin:27, constellation:'Achterdeck', recommendedFilters:['RGB'] },
  { id:'M47', name:'M47', aliases:['M47','NGC 2422'], type:'Offener Sternhaufen', raHours:7.610, decDeg:-14.500, magnitude:4.2, majorArcMin:30, minorArcMin:30, constellation:'Achterdeck', recommendedFilters:['RGB'] },
  { id:'NGC869884', name:'h und χ Persei', aliases:['NGC 869','NGC 884','Doppelhaufen'], type:'Offener Sternhaufen', raHours:2.330, decDeg:57.130, magnitude:4.0, majorArcMin:60, minorArcMin:30, constellation:'Perseus', recommendedFilters:['RGB'] },

  { id:'IC434', name:'Pferdekopfnebel', aliases:['IC 434','Barnard 33'], type:'Dunkelnebel', raHours:5.680, decDeg:-2.450, majorArcMin:60, minorArcMin:10, constellation:'Orion', recommendedFilters:['Hα','RGB'] },
  { id:'IC5146', name:'Kokon-Nebel', aliases:['IC 5146','Caldwell 19'], type:'Dunkelnebel', raHours:21.890, decDeg:47.270, magnitude:7.2, majorArcMin:12, minorArcMin:12, constellation:'Schwan', recommendedFilters:['RGB','Hα'] },
];

