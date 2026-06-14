import {
  Body,
  DefineStar,
  Equator,
  Horizon,
  Illumination,
  MoonPhase,
  Observer,
  SearchAltitude,
  SearchHourAngle,
  SearchRiseSet,
} from 'astronomy-engine';
import type { Camera, DeepSkyObject, LocationProfile, NightWindow, ObjectNightData, Telescope, WeatherNightSummary } from '../types';
import { clamp } from './time';
import { zonedLocalToUtc } from './time';

function toDate(value: { date: Date } | null | undefined): Date | undefined {
  return value?.date ? new Date(value.date) : undefined;
}

export function makeObserver(location: LocationProfile): Observer {
  return new Observer(location.latitude, location.longitude, location.elevation || 0);
}

export function calculateNightWindow(location: LocationProfile, dateKey: string): NightWindow {
  const observer = makeObserver(location);
  const noon = zonedLocalToUtc(dateKey, location.timezone, 12);
  const sunset = toDate(SearchRiseSet(Body.Sun, observer, -1, noon, 1.2));
  const civilDusk = toDate(SearchAltitude(Body.Sun, observer, -1, noon, 1.2, -6));
  const nauticalDusk = toDate(SearchAltitude(Body.Sun, observer, -1, noon, 1.2, -12));
  const astronomicalDusk = toDate(SearchAltitude(Body.Sun, observer, -1, noon, 1.2, -18));

  const eveningAnchor = nauticalDusk ?? civilDusk ?? sunset ?? noon;
  const astronomicalDawn = toDate(SearchAltitude(Body.Sun, observer, +1, eveningAnchor, 1.5, -18));
  const nauticalDawn = toDate(SearchAltitude(Body.Sun, observer, +1, eveningAnchor, 1.5, -12));
  const civilDawn = toDate(SearchAltitude(Body.Sun, observer, +1, eveningAnchor, 1.5, -6));
  const sunrise = toDate(SearchRiseSet(Body.Sun, observer, +1, eveningAnchor, 1.5));

  const darknessStart = astronomicalDusk ?? nauticalDusk ?? civilDusk ?? sunset ?? new Date(noon.getTime() + 6 * 3600_000);
  const darknessEnd = astronomicalDawn ?? nauticalDawn ?? civilDawn ?? sunrise ?? new Date(darknessStart.getTime() + 10 * 3600_000);
  const midpoint = new Date((darknessStart.getTime() + darknessEnd.getTime()) / 2);

  const moonriseCandidate = toDate(SearchRiseSet(Body.Moon, observer, +1, noon, 1.5));
  const moonsetCandidate = toDate(SearchRiseSet(Body.Moon, observer, -1, noon, 1.5));
  const moonTransitEvent = SearchHourAngle(Body.Moon, observer, 0, noon, +1);
  const moonTransit = new Date(moonTransitEvent.time.date);
  const moonIllumination = Illumination(Body.Moon, midpoint).phase_fraction * 100;

  return {
    dateKey,
    sunset,
    civilDusk,
    nauticalDusk,
    astronomicalDusk,
    astronomicalDawn,
    nauticalDawn,
    civilDawn,
    sunrise,
    darknessStart,
    darknessEnd,
    moonrise: moonriseCandidate,
    moonset: moonsetCandidate,
    moonTransit,
    moonMaxAltitude: moonTransitEvent.hor.altitude,
    moonIllumination,
    moonPhaseAngle: MoonPhase(midpoint),
  };
}

export function horizontalForObject(object: DeepSkyObject, time: Date, observer: Observer) {
  return Horizon(time, observer, object.raHours, object.decDeg, 'normal');
}

export function calculateFov(telescope?: Telescope, camera?: Camera) {
  if (!telescope || !camera) return undefined;
  const focalLength = telescope.focalLengthMm * telescope.reducerFactor;
  const widthDeg = 2 * Math.atan(camera.sensorWidthMm / (2 * focalLength)) * 180 / Math.PI;
  const heightDeg = 2 * Math.atan(camera.sensorHeightMm / (2 * focalLength)) * 180 / Math.PI;
  const pixelScale = 206.265 * camera.pixelSizeUm / focalLength;
  return { widthDeg, heightDeg, pixelScale, focalLength };
}

function angularSeparation(ra1Hours: number, dec1Deg: number, ra2Hours: number, dec2Deg: number): number {
  const ra1 = ra1Hours * 15 * Math.PI / 180;
  const ra2 = ra2Hours * 15 * Math.PI / 180;
  const d1 = dec1Deg * Math.PI / 180;
  const d2 = dec2Deg * Math.PI / 180;
  const cos = Math.sin(d1) * Math.sin(d2) + Math.cos(d1) * Math.cos(d2) * Math.cos(ra1 - ra2);
  return Math.acos(clamp(cos, -1, 1)) * 180 / Math.PI;
}

function airmass(altitude: number): number | null {
  if (altitude <= 0) return null;
  const z = 90 - altitude;
  const cosZ = Math.cos(z * Math.PI / 180);
  return 1 / (cosZ + 0.50572 * Math.pow(96.07995 - z, -1.6364));
}

export function calculateObjectNightData(
  object: DeepSkyObject,
  night: NightWindow,
  location: LocationProfile,
  minAltitude: number,
  telescope?: Telescope,
  camera?: Camera,
  weather?: WeatherNightSummary,
): ObjectNightData {
  const observer = makeObserver(location);
  const start = night.darknessStart;
  const end = night.darknessEnd;
  const stepMs = 15 * 60_000;
  let maxAltitude = -90;
  let bestTime = start;
  let visibleMs = 0;

  for (let t = start.getTime(); t <= end.getTime(); t += stepMs) {
    const time = new Date(t);
    const altitude = horizontalForObject(object, time, observer).altitude;
    if (altitude > maxAltitude) {
      maxAltitude = altitude;
      bestTime = time;
    }
    if (altitude >= minAltitude) visibleMs += stepMs;
  }

  DefineStar(Body.Star1, object.raHours, object.decDeg, 1000);
  let transit = SearchHourAngle(Body.Star1, observer, 0, start, +1);
  if (transit.time.date > end) {
    const previous = SearchHourAngle(Body.Star1, observer, 0, end, -1);
    if (previous.time.date >= start) transit = previous;
  }

  const moonEq = Equator(Body.Moon, bestTime, observer, true, true);
  const moonHor = Horizon(bestTime, observer, moonEq.ra, moonEq.dec, 'normal');
  const moonSeparationDeg = angularSeparation(object.raHours, object.decDeg, moonEq.ra, moonEq.dec);

  const fov = calculateFov(telescope, camera);
  let fovFit: ObjectNightData['fovFit'] = 'unbekannt';
  let fovUsagePercent = 0;
  if (fov && object.majorArcMin > 0 && object.minorArcMin > 0) {
    const objW = object.majorArcMin / 60;
    const objH = object.minorArcMin / 60;
    const usage = Math.max(objW / fov.widthDeg, objH / fov.heightDeg);
    fovUsagePercent = usage * 100;
    fovFit = usage <= 0.85 ? 'gut' : usage <= 1.05 ? 'knapp' : 'mosaik';
  }

  const visibleHours = visibleMs / 3600_000;
  const reasons: string[] = [];
  let score = 0;

  const altitudeScore = clamp((maxAltitude - minAltitude) / Math.max(1, 75 - minAltitude) * 100, 0, 100);
  score += altitudeScore * 0.34;
  if (maxAltitude >= 60) reasons.push(`sehr gute Maximalhöhe ${Math.round(maxAltitude)}°`);
  else if (maxAltitude >= minAltitude) reasons.push(`Maximalhöhe ${Math.round(maxAltitude)}°`);
  else reasons.push('bleibt unter der Mindesthöhe');

  const durationScore = clamp(visibleHours / 6 * 100, 0, 100);
  score += durationScore * 0.24;
  reasons.push(`${visibleHours.toFixed(1).replace('.', ',')} h über ${minAltitude}°`);

  const moonPenalty = moonHor.altitude > 0
    ? clamp((60 - moonSeparationDeg) / 60, 0, 1) * (night.moonIllumination / 100) * 100
    : 0;
  const moonScore = 100 - moonPenalty;
  score += moonScore * 0.18;
  if (moonHor.altitude <= 0) reasons.push('Mond unter dem Horizont zur besten Zeit');
  else if (moonSeparationDeg >= 70) reasons.push(`großer Mondabstand ${Math.round(moonSeparationDeg)}°`);
  else reasons.push(`Mondabstand ${Math.round(moonSeparationDeg)}°`);

  const fitScore = fovFit === 'gut' ? 100 : fovFit === 'knapp' ? 70 : fovFit === 'mosaik' ? 35 : 55;
  score += fitScore * 0.09;
  if (fov && fovFit !== 'unbekannt') reasons.push(fovFit === 'mosaik' ? 'größer als das gewählte Bildfeld' : `nutzt etwa ${Math.round(fovUsagePercent)} % des Bildfelds`);
  else if (fov) reasons.push('keine verlässliche Kataloggröße für das Framing');

  const weatherScore = weather?.score ?? 55;
  score += weatherScore * 0.15;
  if (weather) reasons.push(`Wetternacht ${Math.round(weather.score)} / 100`);

  if (object.magnitude != null && object.magnitude > 10) score -= 4;
  score = clamp(score, 0, 100);

  return {
    object,
    altitudeAtStart: horizontalForObject(object, start, observer).altitude,
    altitudeAtEnd: horizontalForObject(object, end, observer).altitude,
    maxAltitude,
    transitTime: new Date(transit.time.date),
    visibleHours,
    bestTime,
    moonSeparationDeg,
    moonAltitudeAtBest: moonHor.altitude,
    airmassAtBest: airmass(maxAltitude),
    fovFit,
    fovUsagePercent,
    score,
    reasons,
  };
}
