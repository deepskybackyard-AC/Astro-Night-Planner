import type { LocationProfile, NightWindow, WeatherConsensusHour, WeatherHour, WeatherModelResult, WeatherNightSummary } from '../types';
import { clamp, mean, median } from '../lib/time';

const MODELS = [
  { id: 'icon_seamless', label: 'DWD ICON' },
  { id: 'ecmwf_ifs025', label: 'ECMWF IFS' },
  { id: 'gfs_seamless', label: 'NOAA GFS' },
];

const HOURLY = [
  'temperature_2m',
  'relative_humidity_2m',
  'dew_point_2m',
  'precipitation_probability',
  'precipitation',
  'cloud_cover',
  'cloud_cover_low',
  'cloud_cover_mid',
  'cloud_cover_high',
  'visibility',
  'wind_speed_10m',
  'wind_gusts_10m',
  'wind_speed_250hPa',
].join(',');

type ApiHourly = Record<string, Array<number | string | null>> & { time: string[] };
type ApiResponse = { hourly?: ApiHourly };

function valueAt(hourly: ApiHourly, key: string, index: number): number | null {
  const value = hourly[key]?.[index];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

async function fetchModel(location: LocationProfile, model: typeof MODELS[number]): Promise<WeatherModelResult> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(location.latitude));
  url.searchParams.set('longitude', String(location.longitude));
  url.searchParams.set('elevation', String(location.elevation));
  url.searchParams.set('hourly', HOURLY);
  url.searchParams.set('models', model.id);
  url.searchParams.set('forecast_days', '8');
  url.searchParams.set('timezone', 'GMT');
  url.searchParams.set('wind_speed_unit', 'kmh');
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${model.label}: HTTP ${response.status}`);
  const data = await response.json() as ApiResponse;
  if (!data.hourly?.time) throw new Error(`${model.label}: keine Stundendaten`);
  const h = data.hourly;
  const hours: WeatherHour[] = h.time.map((time, index) => ({
    time: new Date(`${time}Z`),
    temperature: valueAt(h, 'temperature_2m', index),
    humidity: valueAt(h, 'relative_humidity_2m', index),
    dewPoint: valueAt(h, 'dew_point_2m', index),
    precipitationProbability: valueAt(h, 'precipitation_probability', index),
    precipitation: valueAt(h, 'precipitation', index),
    cloudTotal: valueAt(h, 'cloud_cover', index),
    cloudLow: valueAt(h, 'cloud_cover_low', index),
    cloudMid: valueAt(h, 'cloud_cover_mid', index),
    cloudHigh: valueAt(h, 'cloud_cover_high', index),
    visibilityKm: (() => {
      const v = valueAt(h, 'visibility', index);
      return v == null ? null : v / 1000;
    })(),
    windSpeed: valueAt(h, 'wind_speed_10m', index),
    windGust: valueAt(h, 'wind_gusts_10m', index),
    jetstreamSpeed: valueAt(h, 'wind_speed_250hPa', index),
  }));
  return { id: model.id, label: model.label, hours };
}

export async function fetchWeatherModels(location: LocationProfile): Promise<{ models: WeatherModelResult[]; errors: string[] }> {
  const results = await Promise.allSettled(MODELS.map(model => fetchModel(location, model)));
  const models: WeatherModelResult[] = [];
  const errors: string[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') models.push(result.value);
    else errors.push(`${MODELS[index].label}: ${result.reason instanceof Error ? result.reason.message : 'Abruf fehlgeschlagen'}`);
  });
  if (!models.length) throw new Error(`Keine Wetterdaten verfügbar. ${errors.join(' · ')}`);
  return { models, errors };
}

function collect(values: Array<number | null>): number[] {
  return values.filter((v): v is number => v != null && Number.isFinite(v));
}

function consensusScores(hour: WeatherHour, cloudSpread: number) {
  const total = hour.cloudTotal ?? 50;
  const low = hour.cloudLow ?? total;
  const mid = hour.cloudMid ?? total;
  const high = hour.cloudHigh ?? total;
  const cloudBurden = low * 0.35 + mid * 0.30 + high * 0.35;
  const precipPenalty = Math.max(hour.precipitationProbability ?? 0, (hour.precipitation ?? 0) * 80);
  const visibilityPenalty = hour.visibilityKm == null ? 0 : clamp((20 - hour.visibilityKm) * 3, 0, 35);
  const transparencyScore = clamp(100 - cloudBurden - precipPenalty * 0.35 - visibilityPenalty, 0, 100);

  const jet = hour.jetstreamSpeed ?? 65;
  const ground = hour.windSpeed ?? 12;
  const gust = hour.windGust ?? ground;
  const jetScore = clamp(110 - jet * 0.72, 0, 100);
  const groundScore = clamp(105 - Math.max(0, ground - 5) * 6 - Math.max(0, gust - 18) * 2, 0, 100);
  const seeingScore = clamp(jetScore * 0.72 + groundScore * 0.28, 0, 100);

  const dewGap = hour.temperature != null && hour.dewPoint != null ? hour.temperature - hour.dewPoint : 4;
  const humidity = hour.humidity ?? 75;
  const dewRiskScore = clamp(dewGap * 18 + (100 - humidity) * 0.8, 0, 100);
  const agreement = clamp(100 - cloudSpread * 1.5, 0, 100);
  const astroScore = clamp(
    transparencyScore * 0.52 + seeingScore * 0.20 + dewRiskScore * 0.16 + agreement * 0.12,
    0,
    100,
  );
  return { transparencyScore, seeingScore, dewRiskScore, astroScore };
}

export function buildConsensus(models: WeatherModelResult[]): WeatherConsensusHour[] {
  const timeMap = new Map<number, WeatherHour[]>();
  for (const model of models) {
    for (const hour of model.hours) {
      const key = hour.time.getTime();
      const list = timeMap.get(key) ?? [];
      list.push(hour);
      timeMap.set(key, list);
    }
  }

  return [...timeMap.entries()].sort(([a], [b]) => a - b).map(([time, list]) => {
    const med = (key: keyof WeatherHour) => {
      const vals = collect(list.map(h => h[key] as number | null));
      return vals.length ? median(vals) : null;
    };
    const clouds = collect(list.map(h => h.cloudTotal));
    const cloudSpread = clouds.length > 1 ? Math.max(...clouds) - Math.min(...clouds) : 0;
    const base: WeatherHour = {
      time: new Date(time),
      temperature: med('temperature'),
      humidity: med('humidity'),
      dewPoint: med('dewPoint'),
      precipitationProbability: med('precipitationProbability'),
      precipitation: med('precipitation'),
      cloudTotal: med('cloudTotal'),
      cloudLow: med('cloudLow'),
      cloudMid: med('cloudMid'),
      cloudHigh: med('cloudHigh'),
      visibilityKm: med('visibilityKm'),
      windSpeed: med('windSpeed'),
      windGust: med('windGust'),
      jetstreamSpeed: med('jetstreamSpeed'),
    };
    return {
      ...base,
      cloudSpread,
      modelCount: list.length,
      ...consensusScores(base, cloudSpread),
    };
  });
}

export function summarizeNight(consensus: WeatherConsensusHour[], night: NightWindow): WeatherNightSummary {
  const hours = consensus.filter(hour => hour.time >= night.darknessStart && hour.time <= night.darknessEnd);
  const source = hours.length ? hours : consensus.slice(0, 8);
  let bestHours: WeatherConsensusHour[] = [];
  let bestAverage = -1;
  const windowSize = Math.min(3, source.length);
  for (let i = 0; i <= source.length - windowSize; i += 1) {
    const candidate = source.slice(i, i + windowSize);
    const avg = mean(candidate.map(h => h.astroScore));
    if (avg > bestAverage) {
      bestAverage = avg;
      bestHours = candidate;
    }
  }
  const values = <K extends keyof WeatherConsensusHour>(key: K, fallback = 0) =>
    source.map(h => typeof h[key] === 'number' ? h[key] as number : fallback);
  const dewGaps = source.map(h => h.temperature != null && h.dewPoint != null ? h.temperature - h.dewPoint : 99);

  return {
    hours: source,
    score: bestAverage >= 0 ? bestAverage : 0,
    bestStart: bestHours[0]?.time,
    bestEnd: bestHours.at(-1) ? new Date(bestHours.at(-1)!.time.getTime() + 3600_000) : undefined,
    bestHours,
    meanCloud: mean(values('cloudTotal', 50)),
    meanHighCloud: mean(values('cloudHigh', 50)),
    meanWind: mean(values('windSpeed', 0)),
    meanJetstream: mean(values('jetstreamSpeed', 0)),
    maxHumidity: Math.max(...values('humidity', 0)),
    minDewGap: Math.min(...dewGaps),
    modelAgreement: clamp(100 - mean(values('cloudSpread', 0)) * 1.5, 0, 100),
  };
}
