export type LocationProfile = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  country?: string;
  geonameId?: number;
  meteobluePath?: string;
};

export type Telescope = {
  id: string;
  name: string;
  focalLengthMm: number;
  apertureMm: number;
  reducerFactor: number;
};

export type Camera = {
  id: string;
  name: string;
  sensorWidthMm: number;
  sensorHeightMm: number;
  pixelSizeUm: number;
  resolutionX?: number;
  resolutionY?: number;
};

export type EquipmentState = {
  telescopes: Telescope[];
  cameras: Camera[];
  selectedTelescopeId: string;
  selectedCameraId: string;
};

export type PlanningWindowMode = 'sunset' | 'nautical' | 'astronomicalTwilight' | 'astronomicalNight';

export type CatalogName = 'Messier' | 'NGC' | 'IC' | 'Sh2' | 'Abell' | 'Zusatzkatalog';

export type ObjectType =
  | 'Emissionsnebel'
  | 'Reflexionsnebel'
  | 'Planetarischer Nebel'
  | 'Supernovaüberrest'
  | 'Galaxie'
  | 'Galaxienpaar'
  | 'Galaxiengruppe'
  | 'Kugelsternhaufen'
  | 'Offener Sternhaufen'
  | 'Sternhaufen mit Nebel'
  | 'Sternassoziation'
  | 'Nebel'
  | 'Dunkelnebel'
  | 'Stern'
  | 'Doppelstern'
  | 'Nova'
  | 'Sonstiges';

export type DeepSkyObject = {
  id: string;
  name: string;
  aliases: string[];
  type: ObjectType;
  catalogs: CatalogName[];
  raHours: number;
  decDeg: number;
  magnitude?: number;
  surfaceBrightness?: number;
  majorArcMin: number;
  minorArcMin: number;
  constellation: string;
  recommendedFilters: string[];
};

export type NightWindow = {
  dateKey: string;
  sunset?: Date;
  civilDusk?: Date;
  nauticalDusk?: Date;
  astronomicalDusk?: Date;
  astronomicalDawn?: Date;
  nauticalDawn?: Date;
  civilDawn?: Date;
  sunrise?: Date;
  darknessStart: Date;
  darknessEnd: Date;
  moonrise?: Date;
  moonset?: Date;
  moonTransit?: Date;
  moonMaxAltitude: number;
  moonIllumination: number;
  moonPhaseAngle: number;
};

export type ObjectNightData = {
  object: DeepSkyObject;
  altitudeAtStart: number;
  altitudeAtEnd: number;
  maxAltitude: number;
  transitTime: Date;
  visibleHours: number;
  bestTime: Date;
  moonSeparationDeg: number;
  moonAltitudeAtBest: number;
  airmassAtBest: number | null;
  fovFit: 'gut' | 'knapp' | 'mosaik' | 'unbekannt';
  fovUsagePercent: number;
  score: number;
  reasons: string[];
};

export type WeatherHour = {
  time: Date;
  temperature: number | null;
  humidity: number | null;
  dewPoint: number | null;
  precipitationProbability: number | null;
  precipitation: number | null;
  cloudTotal: number | null;
  cloudLow: number | null;
  cloudMid: number | null;
  cloudHigh: number | null;
  visibilityKm: number | null;
  windSpeed: number | null;
  windGust: number | null;
  jetstreamSpeed: number | null;
};

export type WeatherModelResult = {
  id: string;
  label: string;
  hours: WeatherHour[];
};

export type WeatherConsensusHour = WeatherHour & {
  cloudSpread: number;
  modelCount: number;
  transparencyScore: number;
  seeingScore: number;
  dewRiskScore: number;
  astroScore: number;
};

export type WeatherNightSummary = {
  hours: WeatherConsensusHour[];
  score: number;
  bestStart?: Date;
  bestEnd?: Date;
  bestHours: WeatherConsensusHour[];
  meanCloud: number;
  meanHighCloud: number;
  meanWind: number;
  meanJetstream: number;
  maxHumidity: number;
  minDewGap: number;
  modelAgreement: number;
};

export type ObjectFilters = {
  planningWindow: PlanningWindowMode;
  catalogs: CatalogName[];
  types: ObjectType[];
  maxMagnitude: number;
  minAltitude: number;
  minVisibleHours: number;
  minMoonDistance: number;
  minSizeArcMin: number;
  maxSizeArcMin: number;
  onlyFitsSensor: boolean;
};

export type ObjectResultStats = {
  totalCatalogObjects: number;
  catalogMatches: number;
  detailedCalculated: number;
  shown: number;
  limited: boolean;
};
