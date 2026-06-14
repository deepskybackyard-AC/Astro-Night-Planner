import type { LocationProfile } from '../types';

export type GeocodingResult = LocationProfile & { country?: string; admin1?: string };

type OpenMeteoGeocodingResponse = {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation?: number;
    timezone?: string;
    country?: string;
    admin1?: string;
  }>;
};

export async function searchPlaces(query: string): Promise<GeocodingResult[]> {
  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', query);
  url.searchParams.set('count', '8');
  url.searchParams.set('language', 'de');
  url.searchParams.set('format', 'json');
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Ortssuche fehlgeschlagen (${response.status})`);
  const data = await response.json() as OpenMeteoGeocodingResponse;
  return (data.results ?? []).map(item => ({
    id: `place-${item.id}`,
    name: [item.name, item.admin1, item.country].filter(Boolean).join(', '),
    latitude: item.latitude,
    longitude: item.longitude,
    elevation: item.elevation ?? 0,
    timezone: item.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    country: item.country,
    admin1: item.admin1,
    geonameId: item.id,
  }));
}

export async function locationFromGps(): Promise<LocationProfile> {
  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('GPS wird von diesem Browser nicht unterstützt.'));
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 300000,
    });
  });
  const { latitude, longitude, altitude } = position.coords;
  let elevation = altitude ?? 0;
  try {
    const elevationUrl = new URL('https://api.open-meteo.com/v1/elevation');
    elevationUrl.searchParams.set('latitude', String(latitude));
    elevationUrl.searchParams.set('longitude', String(longitude));
    const elevationResponse = await fetch(elevationUrl);
    if (elevationResponse.ok) {
      const data = await elevationResponse.json() as { elevation?: number[] };
      elevation = data.elevation?.[0] ?? elevation;
    }
  } catch {
    // Browser-GPS-Höhe oder 0 verwenden.
  }

  return {
    id: `gps-${latitude.toFixed(4)}-${longitude.toFixed(4)}`,
    name: 'Aktueller GPS-Standort',
    latitude,
    longitude,
    elevation,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}
