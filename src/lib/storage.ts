import type { EquipmentState, LocationProfile } from '../types';

export const STORAGE_KEYS = {
  locations: 'astroPlanner.locations.v1',
  equipment: 'astroPlanner.equipment.v1',
  filters: 'astroPlanner.filters.v1',
  detailSections: 'astroPlanner.detailSections.v1',
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
