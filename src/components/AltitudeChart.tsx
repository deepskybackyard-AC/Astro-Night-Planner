import { useMemo } from 'react';
import type { DeepSkyObject, LocationProfile, NightWindow } from '../types';
import type { PlanningWindow } from '../lib/astro';
import { horizontalForObject, makeObserver } from '../lib/astro';
import { formatTime } from '../lib/time';

type Props = {
  object: DeepSkyObject;
  night: NightWindow;
  planningWindow: PlanningWindow;
  location: LocationProfile;
  timezone: string;
  minAltitude: number;
  selectedTime: Date;
  onSelectedTimeChange: (time: Date) => void;
  expanded: boolean;
  onToggle: () => void;
};

type Point = {
  time: Date;
  altitude: number;
  azimuth: number;
};

type TwilightBand = {
  start: Date;
  end: Date;
  kind: 'civil' | 'nautical' | 'astronomical' | 'dark';
};

const WIDTH = 920;
const HEIGHT = 368;
const MARGIN = { top: 28, right: 20, bottom: 76, left: 52 };
const PLOT_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function direction(azimuth: number) {
  const names = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
  return names[Math.round(((azimuth % 360) + 360) % 360 / 45) % 8];
}

function localMinute(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat('de-DE', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);
  return Number(parts.find(part => part.type === 'minute')?.value ?? 0);
}

function buildBands(night: NightWindow, start: Date, end: Date): TwilightBand[] {
  const raw: Array<[Date | undefined, Date | undefined, TwilightBand['kind']]> = [
    [start, night.civilDusk, 'civil'],
    [night.civilDusk, night.nauticalDusk, 'nautical'],
    [night.nauticalDusk, night.astronomicalDusk, 'astronomical'],
    [night.astronomicalDusk, night.astronomicalDawn, 'dark'],
    [night.astronomicalDawn, night.nauticalDawn, 'astronomical'],
    [night.nauticalDawn, night.civilDawn, 'nautical'],
    [night.civilDawn, end, 'civil'],
  ];
  return raw
    .filter((item): item is [Date, Date, TwilightBand['kind']] => Boolean(item[0] && item[1] && item[1]!.getTime() > item[0]!.getTime()))
    .map(([bandStart, bandEnd, kind]) => ({
      start: new Date(Math.max(start.getTime(), bandStart.getTime())),
      end: new Date(Math.min(end.getTime(), bandEnd.getTime())),
      kind,
    }))
    .filter(band => band.end.getTime() > band.start.getTime());
}

export default function AltitudeChart({ object, night, planningWindow, location, timezone, minAltitude, selectedTime, onSelectedTimeChange, expanded, onToggle }: Props) {
  const data = useMemo(() => {
    const start = night.sunset ?? new Date(night.darknessStart.getTime() - 2 * 3600_000);
    const end = night.sunrise ?? new Date(night.darknessEnd.getTime() + 2 * 3600_000);
    const observer = makeObserver(location);
    const stepMs = 10 * 60_000;
    const points: Point[] = [];
    for (let timestamp = start.getTime(); timestamp <= end.getTime(); timestamp += stepMs) {
      const time = new Date(timestamp);
      const horizontal = horizontalForObject(object, time, observer);
      points.push({ time, altitude: horizontal.altitude, azimuth: horizontal.azimuth });
    }
    if (points.at(-1)?.time.getTime() !== end.getTime()) {
      const horizontal = horizontalForObject(object, end, observer);
      points.push({ time: end, altitude: horizontal.altitude, azimuth: horizontal.azimuth });
    }
    const maxPoint = points.reduce((best, point) => point.altitude > best.altitude ? point : best, points[0]);
    let firstHourMs = start.getTime();
    for (let minuteOffset = 0; minuteOffset <= 60; minuteOffset += 1) {
      const candidate = new Date(start.getTime() + minuteOffset * 60_000);
      if (localMinute(candidate, timezone) === 0) {
        firstHourMs = candidate.getTime();
        break;
      }
    }
    const hourPoints: Point[] = [];
    for (let timestamp = firstHourMs; timestamp <= end.getTime(); timestamp += 3600_000) {
      const time = new Date(timestamp);
      const horizontal = horizontalForObject(object, time, observer);
      hourPoints.push({ time, altitude: horizontal.altitude, azimuth: horizontal.azimuth });
    }
    return { start, end, points, maxPoint, hourPoints, bands: buildBands(night, start, end) };
  }, [object, night, location, timezone]);

  const startMs = data.start.getTime();
  const durationMs = Math.max(1, data.end.getTime() - startMs);
  const xForTime = (time: Date) => MARGIN.left + (time.getTime() - startMs) / durationMs * PLOT_WIDTH;
  const yForAltitude = (altitude: number) => MARGIN.top + (90 - clamp(altitude, 0, 90)) / 90 * PLOT_HEIGHT;
  const linePath = data.points.map((point, index) => `${index ? 'L' : 'M'} ${xForTime(point.time).toFixed(2)} ${yForAltitude(point.altitude).toFixed(2)}`).join(' ');
  const areaPath = `${linePath} L ${xForTime(data.end)} ${yForAltitude(0)} L ${xForTime(data.start)} ${yForAltitude(0)} Z`;
  const selected = [...data.points, ...data.hourPoints].reduce((best, point) => Math.abs(point.time.getTime() - selectedTime.getTime()) < Math.abs(best.time.getTime() - selectedTime.getTime()) ? point : best, data.maxPoint);

  function selectNearest(clientX: number, element: SVGSVGElement) {
    const rect = element.getBoundingClientRect();
    const svgX = (clientX - rect.left) / rect.width * WIDTH;
    const ratio = clamp((svgX - MARGIN.left) / PLOT_WIDTH, 0, 1);
    const targetMs = startMs + ratio * durationMs;
    let closestIndex = 0;
    let closestDistance = Infinity;
    data.points.forEach((point, index) => {
      const distance = Math.abs(point.time.getTime() - targetMs);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    onSelectedTimeChange(data.points[closestIndex].time);
  }

  const planningX = xForTime(planningWindow.start);
  const planningWidth = Math.max(0, xForTime(planningWindow.end) - planningX);

  return (
    <section className="altitude-section" aria-label={`Höhenverlauf von ${object.name}`}>
      <button type="button" className="detail-section-toggle" onClick={onToggle} aria-expanded={expanded}>
        <span><span className="eyebrow">Objekthöhe über die Nacht</span><strong>Höhenkurve</strong></span>
        <span className="collapse-indicator">{expanded ? '−' : '+'}</span>
      </button>

      {expanded && <>
        <div className="altitude-heading compact-heading">
          <div><span>Bezugszeitraum</span><strong>{planningWindow.label}</strong></div>
          <div className="altitude-selected">
            <strong>{formatTime(selected.time, timezone)} · {Math.round(selected.altitude)}°</strong>
            <span>Azimut {Math.round(selected.azimuth)}° ({direction(selected.azimuth)})</span>
          </div>
        </div>

        <div className="altitude-chart-scroll">
          <svg
            className="altitude-chart"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label="Höhe des Objekts mit Dämmerungsphasen"
            onPointerMove={event => { if (event.pointerType === 'mouse') selectNearest(event.clientX, event.currentTarget); }}
            onPointerDown={event => selectNearest(event.clientX, event.currentTarget)}
          >
            <defs>
              <linearGradient id={`altitude-fill-${object.id.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#55c7ff" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#55c7ff" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {data.bands.map((band, index) => {
              const x = xForTime(band.start);
              const width = Math.max(0, xForTime(band.end) - x);
              return <rect key={`${band.kind}-${index}`} className={`twilight-band ${band.kind}`} x={x} y={MARGIN.top} width={width} height={PLOT_HEIGHT} />;
            })}

            <rect className="planning-window-highlight" x={planningX} y={MARGIN.top} width={planningWidth} height={PLOT_HEIGHT} />

            {[0, 15, 30, 45, 60, 75, 90].map(altitude => <g key={altitude}>
              <line className="altitude-grid-line" x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={yForAltitude(altitude)} y2={yForAltitude(altitude)} />
              <text className="altitude-y-label" x={MARGIN.left - 8} y={yForAltitude(altitude) + 4} textAnchor="end">{altitude}°</text>
            </g>)}

            <line className="minimum-altitude-line" x1={MARGIN.left} x2={WIDTH - MARGIN.right} y1={yForAltitude(minAltitude)} y2={yForAltitude(minAltitude)} />
            <text className="minimum-altitude-label" x={WIDTH - MARGIN.right - 4} y={yForAltitude(minAltitude) - 6} textAnchor="end">Mindesthöhe {minAltitude}°</text>

            {data.hourPoints.map(point => <g key={point.time.toISOString()}>
              <line className="hour-grid-line" x1={xForTime(point.time)} x2={xForTime(point.time)} y1={MARGIN.top} y2={MARGIN.top + PLOT_HEIGHT} />
              <text className="altitude-x-label" x={xForTime(point.time)} y={HEIGHT - 42} textAnchor="middle">{formatTime(point.time, timezone)}</text>
              <text className="altitude-direction-label" x={xForTime(point.time)} y={HEIGHT - 25} textAnchor="middle">{direction(point.azimuth)}</text>
            </g>)}

            <path d={areaPath} fill={`url(#altitude-fill-${object.id.replace(/[^a-z0-9]/gi, '')})`} />
            <path className="altitude-curve" d={linePath} />

            <line className="max-altitude-line" x1={xForTime(data.maxPoint.time)} x2={xForTime(data.maxPoint.time)} y1={yForAltitude(data.maxPoint.altitude)} y2={MARGIN.top + PLOT_HEIGHT} />
            <circle className="max-altitude-point" cx={xForTime(data.maxPoint.time)} cy={yForAltitude(data.maxPoint.altitude)} r="5" />
            <text className="max-altitude-label" x={xForTime(data.maxPoint.time)} y={Math.max(MARGIN.top + 32, yForAltitude(data.maxPoint.altitude) - 12)} textAnchor="middle">
              Maximum {Math.round(data.maxPoint.altitude)}° · {formatTime(data.maxPoint.time, timezone)}
            </text>

            <line className="selected-altitude-line" x1={xForTime(selected.time)} x2={xForTime(selected.time)} y1={MARGIN.top} y2={MARGIN.top + PLOT_HEIGHT} />
            <circle className="selected-altitude-point" cx={xForTime(selected.time)} cy={yForAltitude(selected.altitude)} r="4" />
          </svg>
        </div>

        <div className="twilight-legend" aria-label="Legende der Dämmerungsphasen">
          <span><i className="civil" />bürgerliche Dämmerung</span>
          <span><i className="nautical" />nautische Dämmerung</span>
          <span><i className="astronomical" />astronomische Dämmerung</span>
          <span><i className="dark" />astronomische Nacht</span>
          <span><i className="planning" />gewählter Planungszeitraum</span>
        </div>

        <div className="hourly-altitudes" aria-label="Stündliche Objekthöhen">
          {data.hourPoints.map(point => <button
            type="button"
            key={point.time.toISOString()}
            onClick={() => onSelectedTimeChange(point.time)}
            className={Math.abs(selected.time.getTime() - point.time.getTime()) < 5 * 60_000 ? 'active' : ''}
          >
            <strong>{formatTime(point.time, timezone)}</strong>
            <span>{Math.round(point.altitude)}°</span>
            <small>{direction(point.azimuth)}</small>
          </button>)}
        </div>
        <small className="altitude-help">Kurve mit Maus oder Finger berühren. Die gewählte Uhrzeit wird gleichzeitig in der Horizontansicht übernommen.</small>
      </>}
    </section>
  );
}
