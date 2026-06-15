import type {
  CentralSettings,
  EquipmentState,
  EvaluationWeights,
  DisplayProfileKey,
  ListColumnKey,
  ListDisplayProfile,
  ListDisplaySettings,
  LocationProfile,
  WindProfileKey,
  WindThresholds,
} from '../types';

export const STORAGE_KEYS = {
  locations: 'astroPlanner.locations.v1',
  equipment: 'astroPlanner.equipment.v1',
  filters: 'astroPlanner.filters.v1',
  detailSections: 'astroPlanner.detailSections.v1',
  centralSettings: 'astroPlanner.centralSettings.v1',
  selectedLocation: 'astroPlanner.selectedLocation.v1',
  objectPage: 'astroPlanner.objectPage.v1',
  objectSizeVisible: 'astroPlanner.objectSizeVisible.v1',
  objectRotations: 'astroPlanner.objectRotations.v1',
  settingsTab: 'astroPlanner.settingsTab.v1',
};

export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export const defaultLocation: LocationProfile = {
  id: 'default-tuebingen',
  name: 'Tübingen (Beispiel)',
  latitude: 48.5216,
  longitude: 9.0576,
  elevation: 341,
  timezone: 'Europe/Berlin',
  country: 'Deutschland',
  geonameId: 2820860,
  meteobluePath: 'tübingen_deutschland_2820860',
  horizonProfile: [
    { azimuth: 0, altitude: 0 },
    { azimuth: 90, altitude: 0 },
    { azimuth: 180, altitude: 0 },
    { azimuth: 270, altitude: 0 },
    { azimuth: 360, altitude: 0 },
  ],
  obstacles: [],
};

export const defaultEquipment: EquipmentState = {
  telescopes: [
    {
      id: 'askar-200',
      name: 'Askar 200 mm',
      focalLengthMm: 200,
      apertureMm: 50,
      reducerFactor: 1,
    },
  ],
  cameras: [
    {
      id: 'qhy268m',
      name: 'QHY268M',
      sensorWidthMm: 23.5,
      sensorHeightMm: 15.7,
      pixelSizeUm: 3.76,
      resolutionX: 6280,
      resolutionY: 4210,
    },
  ],
  selectedTelescopeId: 'askar-200',
  selectedCameraId: 'qhy268m',
};

export const WIND_PRESETS: Record<Exclude<WindProfileKey, 'custom'>, WindThresholds> = {
  travel: {
    windGreenMax: 2,
    windYellowMax: 4,
    gustGreenMax: 4,
    gustYellowMax: 6,
  },
  normal: {
    windGreenMax: 3,
    windYellowMax: 6,
    gustGreenMax: 5,
    gustYellowMax: 9,
  },
  robust: {
    windGreenMax: 4,
    windYellowMax: 8,
    gustGreenMax: 7,
    gustYellowMax: 12,
  },
};

export const WIND_PROFILE_LABELS: Record<WindProfileKey, string> = {
  travel: 'Leichtes Reisesetup',
  normal: 'Normales Setup',
  robust: 'Robuste Säule / Montierung',
  custom: 'Benutzerdefiniert',
};

export const DISPLAY_PROFILE_LABELS: Record<DisplayProfileKey, string> = {
  compact: 'Kompakt',
  standard: 'Standard',
  detailed: 'Detailliert',
  custom: 'Benutzerdefiniert',
};

export const LIST_COLUMN_LABELS: Record<ListColumnKey, string> = {
  score: 'Bewertung',
  object: 'Objekt / Typ / Katalog',
  maxAltitude: 'Maximalhöhe',
  visibleHours: 'Sichtbarkeitsdauer',
  transit: 'Meridian',
  framing: 'Framing',
  miniAltitude: 'Mini-Höhenprofil',
  bestTime: 'Beste Zeit',
  altStartEnd: 'Höhe Start / Ende',
  moonDistance: 'Mondabstand',
  moonAltitude: 'Mondhöhe',
  weatherScore: 'Wetterwert',
  size: 'Objektgröße',
  magnitude: 'Magnitude / Flächenhelligkeit',
  filters: 'Filterempfehlung',
  fovUsage: 'Bildfeldnutzung',
};

const ALL_COLUMNS: ListColumnKey[] = [
  'score',
  'object',
  'maxAltitude',
  'visibleHours',
  'transit',
  'framing',
  'miniAltitude',
  'bestTime',
  'altStartEnd',
  'moonDistance',
  'moonAltitude',
  'weatherScore',
  'size',
  'magnitude',
  'filters',
  'fovUsage',
];

function columnsWithVisible(visible: ListColumnKey[]): ListDisplaySettings['columns'] {
  return ALL_COLUMNS.map((key) => ({ key, visible: visible.includes(key) }));
}

export const LIST_PRESETS: Record<'compact' | 'standard' | 'detailed', ListDisplaySettings['columns']> = {
  compact: columnsWithVisible(['score', 'object', 'maxAltitude', 'visibleHours', 'miniAltitude']),
  standard: columnsWithVisible(['score', 'object', 'maxAltitude', 'visibleHours', 'transit', 'framing', 'miniAltitude']),
  detailed: columnsWithVisible([
    'score',
    'object',
    'maxAltitude',
    'visibleHours',
    'transit',
    'framing',
    'miniAltitude',
    'bestTime',
    'altStartEnd',
    'moonDistance',
    'weatherScore',
    'fovUsage',
  ]),
};

function cloneColumns(columns: ListDisplaySettings['columns']) {
  return columns.map((item) => ({ ...item }));
}

function defaultDisplayProfiles(): Record<DisplayProfileKey, ListDisplayProfile> {
  return {
    compact: { pageSize: 20, columns: cloneColumns(LIST_PRESETS.compact) },
    standard: { pageSize: 20, columns: cloneColumns(LIST_PRESETS.standard) },
    detailed: { pageSize: 20, columns: cloneColumns(LIST_PRESETS.detailed) },
    custom: { pageSize: 20, columns: cloneColumns(LIST_PRESETS.standard) },
  };
}

function defaultWindProfiles(): Record<WindProfileKey, WindThresholds> {
  return {
    travel: { ...WIND_PRESETS.travel },
    normal: { ...WIND_PRESETS.normal },
    robust: { ...WIND_PRESETS.robust },
    custom: { ...WIND_PRESETS.normal },
  };
}

export const defaultCentralSettings: CentralSettings = {
  windUnit: 'kmh',
  activeWindProfile: 'normal',
  windProfiles: defaultWindProfiles(),
  windPreset: 'normal',
  windThresholds: { ...WIND_PRESETS.normal },
  dewThresholds: { greenMin: 5, yellowMin: 2 },
  jetThresholds: { greenMax: 10, yellowMax: 20 },
  evaluationWeights: {
    clouds: 30,
    transparency: 15,
    seeing: 10,
    wind: 10,
    dew: 10,
    moon: 10,
    altitude: 10,
    duration: 5,
  },
  defaultPlanningWindow: 'nautical',
  listDisplay: {
    activeProfile: 'standard',
    profiles: defaultDisplayProfiles(),
    pageSize: 20,
    preset: 'standard',
    columns: cloneColumns(LIST_PRESETS.standard),
  },
  defaultLocationId: defaultLocation.id,
  gpsBehavior: 'ask',
};

function normalizeColumns(savedColumns: unknown, fallback: ListDisplaySettings['columns']): ListDisplaySettings['columns'] {
  const source = Array.isArray(savedColumns) ? savedColumns as Array<{ key?: unknown; visible?: unknown }> : [];
  const normalized = ALL_COLUMNS.map((key) => {
    const match = source.find((item) => item.key === key);
    const standard = fallback.find((item) => item.key === key);
    return { key, visible: typeof match?.visible === 'boolean' ? match.visible : standard?.visible ?? false };
  });
  const order = source
    .map((item) => item.key)
    .filter((key): key is ListColumnKey => typeof key === 'string' && ALL_COLUMNS.includes(key as ListColumnKey));
  return [
    ...order.map((key) => normalized.find((item) => item.key === key)!),
    ...normalized.filter((item) => !order.includes(item.key)),
  ];
}

function normalizePageSize(value: unknown): 10 | 20 | 50 | 100 {
  return [10, 20, 50, 100].includes(Number(value)) ? Number(value) as 10 | 20 | 50 | 100 : 20;
}

function normalizeDisplayProfile(saved: Partial<ListDisplayProfile> | undefined, fallback: ListDisplayProfile): ListDisplayProfile {
  return {
    pageSize: normalizePageSize(saved?.pageSize ?? fallback.pageSize),
    columns: normalizeColumns(saved?.columns, fallback.columns),
  };
}

export function normalizeCentralSettings(saved: Partial<CentralSettings>): CentralSettings {
  const defaultWind = defaultWindProfiles();
  const savedWindProfiles = saved.windProfiles as Partial<Record<WindProfileKey, Partial<WindThresholds>>> | undefined;
  const legacyWindProfile = (saved.activeWindProfile ?? saved.windPreset ?? 'normal') as WindProfileKey;
  const activeWindProfile: WindProfileKey = ['travel', 'normal', 'robust', 'custom'].includes(legacyWindProfile) ? legacyWindProfile : 'normal';
  const windProfiles: Record<WindProfileKey, WindThresholds> = {
    travel: { ...defaultWind.travel, ...(savedWindProfiles?.travel ?? {}) },
    normal: { ...defaultWind.normal, ...(savedWindProfiles?.normal ?? {}) },
    robust: { ...defaultWind.robust, ...(savedWindProfiles?.robust ?? {}) },
    custom: { ...defaultWind.custom, ...(savedWindProfiles?.custom ?? saved.windThresholds ?? {}) },
  };
  if (!saved.windProfiles && saved.windThresholds) windProfiles[activeWindProfile] = { ...windProfiles[activeWindProfile], ...saved.windThresholds };

  const defaultProfiles = defaultDisplayProfiles();
  const savedList = saved.listDisplay as Partial<ListDisplaySettings> | undefined;
  const legacyDisplayProfile = (savedList?.activeProfile ?? savedList?.preset ?? 'standard') as DisplayProfileKey;
  const activeProfile: DisplayProfileKey = ['compact', 'standard', 'detailed', 'custom'].includes(legacyDisplayProfile) ? legacyDisplayProfile : 'standard';
  const savedProfiles = savedList?.profiles as Partial<Record<DisplayProfileKey, Partial<ListDisplayProfile>>> | undefined;
  const profiles: Record<DisplayProfileKey, ListDisplayProfile> = {
    compact: normalizeDisplayProfile(savedProfiles?.compact, defaultProfiles.compact),
    standard: normalizeDisplayProfile(savedProfiles?.standard, defaultProfiles.standard),
    detailed: normalizeDisplayProfile(savedProfiles?.detailed, defaultProfiles.detailed),
    custom: normalizeDisplayProfile(savedProfiles?.custom ?? (savedList ? { pageSize: savedList.pageSize, columns: savedList.columns } : undefined), defaultProfiles.custom),
  };
  if (!savedProfiles && savedList?.columns) profiles[activeProfile] = normalizeDisplayProfile({ pageSize: savedList.pageSize, columns: savedList.columns }, defaultProfiles[activeProfile]);
  const activeDisplay = profiles[activeProfile];

  const weights = { ...defaultCentralSettings.evaluationWeights, ...(saved.evaluationWeights ?? {}) };
  const integerWeights = Object.fromEntries(Object.entries(weights).map(([key, value]) => [key, Math.max(0, Math.min(100, Math.round(Number(value) || 0))) ])) as EvaluationWeights;

  return {
    ...defaultCentralSettings,
    ...saved,
    activeWindProfile,
    windProfiles,
    windPreset: activeWindProfile,
    windThresholds: { ...windProfiles[activeWindProfile] },
    dewThresholds: { ...defaultCentralSettings.dewThresholds, ...(saved.dewThresholds ?? {}) },
    jetThresholds: { ...defaultCentralSettings.jetThresholds, ...(saved.jetThresholds ?? {}) },
    evaluationWeights: integerWeights,
    listDisplay: {
      activeProfile,
      profiles,
      pageSize: activeDisplay.pageSize,
      preset: activeProfile,
      columns: cloneColumns(activeDisplay.columns),
    },
  };
}

export function withEffectiveProfiles(
  settings: CentralSettings,
  windProfile: WindProfileKey = settings.activeWindProfile,
  displayProfile: DisplayProfileKey = settings.listDisplay.activeProfile,
): CentralSettings {
  const thresholds = settings.windProfiles[windProfile] ?? settings.windThresholds;
  const display = settings.listDisplay.profiles[displayProfile] ?? settings.listDisplay;
  return {
    ...settings,
    windPreset: windProfile,
    windThresholds: { ...thresholds },
    listDisplay: {
      ...settings.listDisplay,
      activeProfile: displayProfile,
      preset: displayProfile,
      pageSize: display.pageSize,
      columns: cloneColumns(display.columns),
    },
  };
}
