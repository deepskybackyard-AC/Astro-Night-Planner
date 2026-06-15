import { useEffect, useMemo, useRef, useState } from 'react';
import type { DeepSkyObject, EquipmentState, LocationProfile, NightWindow } from '../types';
import { calculateFov, horizonAltitudeAtAzimuth, horizontalForObject, makeObserver } from '../lib/astro';
import { loadJson, saveJson, STORAGE_KEYS } from '../lib/storage';
import { addDaysToDateKey, dateKeyInZone, formatTime, zonedLocalToUtc } from '../lib/time';

let aladinLoader: Promise<void> | null = null;

function loadAladin(): Promise<void> {
  if (window.A?.init) return Promise.resolve();
  if (aladinLoader) return aladinLoader;
  aladinLoader = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-aladin-lite]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Aladin Lite konnte nicht geladen werden.')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://aladin.cds.unistra.fr/AladinLite/api/v3/latest/aladin.js';
    script.async = true;
    script.dataset.aladinLite = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Aladin Lite konnte nicht geladen werden.'));
    document.head.appendChild(script);
  });
  return aladinLoader;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function direction(azimuth: number) {
  const names = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
  return names[Math.round(((azimuth % 360) + 360) % 360 / 45) % 8];
}

function localDateLabel(date: Date, timezone: string) {
  return new Intl.DateTimeFormat('de-DE', {
    timeZone: timezone,
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  }).format(date);
}

function localTimeValue(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const hour = parts.find(part => part.type === 'hour')?.value ?? '00';
  const minute = parts.find(part => part.type === 'minute')?.value ?? '00';
  return `${hour}:${minute}`;
}

type Props = {
  object: DeepSkyObject;
  equipment: EquipmentState;
  onEquipmentChange: (equipment: EquipmentState) => void;
  night: NightWindow;
  location: LocationProfile;
  timezone: string;
  selectedTime: Date;
  onSelectedTimeChange: (time: Date) => void;
  horizonExpanded: boolean;
  framingExpanded: boolean;
  onToggleHorizon: () => void;
  onToggleFraming: () => void;
};

export default function SkyViewer({ object, equipment, onEquipmentChange, night, location, timezone, selectedTime, onSelectedTimeChange, horizonExpanded, framingExpanded, onToggleHorizon, onToggleFraming }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const aladinRef = useRef<any>(null);
  const overlayRef = useRef<any>(null);
  const frameCenterRef = useRef<[number, number]>([object.raHours * 15, object.decDeg]);
  const [error, setError] = useState('');
  const [rotation, setRotation] = useState(0);
  const [frameVisible, setFrameVisible] = useState(true);
  const [objectSizeVisible, setObjectSizeVisible] = useState(() => loadJson(STORAGE_KEYS.objectSizeVisible, false));
  const [objectRotations, setObjectRotations] = useState<Record<string, number>>(() => loadJson(STORAGE_KEYS.objectRotations, {}));
  const [groundVisible, setGroundVisible] = useState(true);
  const [frameMessage, setFrameMessage] = useState('Rahmen ist auf das Objekt zentriert.');
  const [screenFrame, setScreenFrame] = useState<{ cx: number; cy: number; frameWidth: number; frameHeight: number; angle: number; corners: Array<[number, number]>; canvasWidth: number; canvasHeight: number } | null>(null);
  const telescope = equipment.telescopes.find(item => item.id === equipment.selectedTelescopeId);
  const camera = equipment.cameras.find(item => item.id === equipment.selectedCameraId);
  const fov = useMemo(() => calculateFov(telescope, camera), [telescope, camera]);
  const observer = useMemo(() => makeObserver(location), [location]);
  const horizontal = useMemo(() => horizontalForObject(object, selectedTime, observer), [object, selectedTime, observer]);
  const objectRotation = objectRotations[object.id] ?? object.positionAngleDeg ?? 0;

  useEffect(() => saveJson(STORAGE_KEYS.objectSizeVisible, objectSizeVisible), [objectSizeVisible]);
  useEffect(() => saveJson(STORAGE_KEYS.objectRotations, objectRotations), [objectRotations]);

  const timeRange = useMemo(() => {
    const start = night.sunset ?? new Date(night.darknessStart.getTime() - 2 * 3600_000);
    const end = night.sunrise ?? new Date(night.darknessEnd.getTime() + 2 * 3600_000);
    return { start, end, durationMinutes: Math.max(1, Math.round((end.getTime() - start.getTime()) / 60_000)) };
  }, [night]);

  const selectedMinute = clamp(Math.round((selectedTime.getTime() - timeRange.start.getTime()) / 60_000), 0, timeRange.durationMinutes);

  function setMinute(minute: number) {
    onSelectedTimeChange(new Date(timeRange.start.getTime() + clamp(minute, 0, timeRange.durationMinutes) * 60_000));
  }

  function setClockTime(value: string) {
    const [hour, minute] = value.split(':').map(Number);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return;
    const currentDateKey = dateKeyInZone(selectedTime, timezone);
    const candidateKeys = Array.from(new Set([
      currentDateKey,
      night.dateKey,
      addDaysToDateKey(night.dateKey, 1),
    ]));
    const candidates = candidateKeys
      .map(dateKey => zonedLocalToUtc(dateKey, timezone, hour, minute))
      .filter(candidate => candidate.getTime() >= timeRange.start.getTime() && candidate.getTime() <= timeRange.end.getTime());
    const chosen = candidates.length
      ? candidates.reduce((best, candidate) => Math.abs(candidate.getTime() - selectedTime.getTime()) < Math.abs(best.getTime() - selectedTime.getTime()) ? candidate : best, candidates[0])
      : new Date(clamp(zonedLocalToUtc(currentDateKey, timezone, hour, minute).getTime(), timeRange.start.getTime(), timeRange.end.getTime()));
    onSelectedTimeChange(chosen);
  }

  function clearOverlay(aladin: any) {
    if (!overlayRef.current) return;
    try {
      if (typeof aladin.removeOverlay === 'function') aladin.removeOverlay(overlayRef.current);
      else if (typeof overlayRef.current.removeAll === 'function') overlayRef.current.removeAll();
    } catch (cause) {
      console.warn('Vorheriges Framing-Overlay konnte nicht entfernt werden.', cause);
    }
    overlayRef.current = null;
  }

  function updateScreenFrame() {
    const aladin = aladinRef.current;
    if (!aladin || !fov || !frameVisible || !framingExpanded || typeof aladin.world2pix !== 'function') {
      setScreenFrame(null);
      return;
    }
    try {
      const [ra, dec] = frameCenterRef.current;
      const center = aladin.world2pix(ra, dec) as [number, number] | null;
      const cosDec = Math.max(0.08, Math.cos(dec * Math.PI / 180));
      const east = aladin.world2pix(((ra + fov.widthDeg / 2 / cosDec) % 360 + 360) % 360, dec) as [number, number] | null;
      const north = aladin.world2pix(ra, Math.max(-89.8, Math.min(89.8, dec + fov.heightDeg / 2))) as [number, number] | null;
      if (!center || !east || !north || [center, east, north].some(point => !Number.isFinite(point[0]) || !Number.isFinite(point[1]))) {
        setScreenFrame(null);
        return;
      }
      const frameWidth = Math.max(4, 2 * Math.hypot(east[0] - center[0], east[1] - center[1]));
      const frameHeight = Math.max(4, 2 * Math.hypot(north[0] - center[0], north[1] - center[1]));
      const baseAngle = Math.atan2(east[1] - center[1], east[0] - center[0]) * 180 / Math.PI;
      const angle = baseAngle + rotation;
      const angleRad = angle * Math.PI / 180;
      const cosA = Math.cos(angleRad);
      const sinA = Math.sin(angleRad);
      const localCorners: Array<[number, number]> = [
        [-frameWidth / 2, -frameHeight / 2],
        [frameWidth / 2, -frameHeight / 2],
        [frameWidth / 2, frameHeight / 2],
        [-frameWidth / 2, frameHeight / 2],
      ];
      const corners = localCorners.map(([x, y]) => [
        center[0] + x * cosA - y * sinA,
        center[1] + x * sinA + y * cosA,
      ] as [number, number]);
      const size = aladin.getSize?.() ?? [containerRef.current?.clientWidth ?? 1000, containerRef.current?.clientHeight ?? 500];
      const next = { cx: center[0], cy: center[1], frameWidth, frameHeight, angle, corners, canvasWidth: size[0], canvasHeight: size[1] };
      setScreenFrame(previous => previous
        && Math.abs(previous.cx - next.cx) < 0.15
        && Math.abs(previous.cy - next.cy) < 0.15
        && Math.abs(previous.frameWidth - next.frameWidth) < 0.15
        && Math.abs(previous.frameHeight - next.frameHeight) < 0.15
        && Math.abs(previous.angle - next.angle) < 0.05
        && previous.canvasWidth === next.canvasWidth
        && previous.canvasHeight === next.canvasHeight
        ? previous
        : next);
    } catch (cause) {
      console.warn('Setup-Rahmen konnte nicht auf Bildschirmkoordinaten abgebildet werden.', cause);
      setScreenFrame(null);
    }
  }

  function drawFrame(center?: number[]) {
    const A = window.A;
    const aladin = aladinRef.current;
    if (!A || !aladin) return;
    if (center && Number.isFinite(center[0]) && Number.isFinite(center[1])) {
      frameCenterRef.current = [center[0], center[1]];
    }
    try {
      clearOverlay(aladin);
      const overlay = A.graphicOverlay({ color: '#ffd45a', lineWidth: 2 });
      // Der Sensorrahmen wird als echtes Rechteck in einer eigenen SVG-Ebene gezeichnet.
      // Dadurch bleiben alle vier Winkel exakt 90°, auch bei großen Bildfeldern.
      aladin.addOverlay(overlay);
      if (objectSizeVisible && object.majorArcMin > 0 && object.minorArcMin > 0) {
        overlay.add(A.ellipse(object.raHours * 15, object.decDeg, object.majorArcMin / 120, object.minorArcMin / 120, objectRotation, {
          color: '#ffd45a',
          lineWidth: 2,
        }));
      }
      overlayRef.current = overlay;
      window.setTimeout(updateScreenFrame, 20);
    } catch (cause) {
      console.warn('Framing-Overlay konnte nicht gezeichnet werden.', cause);
      setFrameMessage('Der Rahmen konnte nicht gezeichnet werden. Bitte Ansicht neu öffnen.');
    }
  }

  function fitFrameInView(centerOnFrame = true) {
    const aladin = aladinRef.current;
    if (!aladin || !fov) return;
    const center = frameCenterRef.current;
    if (centerOnFrame) aladin.gotoRaDec?.(center[0], center[1]);
    const size = aladin.getSize?.() ?? [1000, 500];
    const aspect = Math.max(1, size[0] / Math.max(1, size[1]));
    const horizontalFov = Math.max(fov.widthDeg, fov.heightDeg * aspect) * 1.35;
    aladin.setFov?.(Math.min(40, Math.max(0.15, horizontalFov)));
    window.setTimeout(() => { drawFrame(); updateScreenFrame(); }, 80);
  }

  function centerFrameOnImage() {
    const center = aladinRef.current?.getRaDec?.();
    if (!center) return;
    drawFrame(center);
    updateScreenFrame();
    setFrameMessage('Rahmen wurde auf die aktuelle Bildmitte gesetzt. Bild verschieben und erneut klicken, um das Framing anzupassen.');
  }

  function centerFrameOnObject() {
    const center: [number, number] = [object.raHours * 15, object.decDeg];
    frameCenterRef.current = center;
    aladinRef.current?.gotoRaDec?.(center[0], center[1]);
    drawFrame(center);
    updateScreenFrame();
    setFrameMessage('Rahmen ist wieder auf das Objekt zentriert.');
  }

  useEffect(() => {
    if (!framingExpanded) {
      setScreenFrame(null);
      return;
    }
    let cancelled = false;
    setError('');
    frameCenterRef.current = [object.raHours * 15, object.decDeg];
    setFrameMessage('Rahmen ist auf das Objekt zentriert.');
    loadAladin()
      .then(() => window.A?.init)
      .then(() => {
        if (cancelled || !containerRef.current || !window.A) return;
        containerRef.current.innerHTML = '';
        const objectWidth = Math.max(object.majorArcMin / 60, 0.3);
        const initialFov = Math.max(fov ? Math.max(fov.widthDeg, fov.heightDeg) * 1.5 : 0, objectWidth * 1.5, 0.5);
        const aladin = window.A.aladin(containerRef.current, {
          survey: 'P/DSS2/color',
          target: `${object.raHours * 15} ${object.decDeg}`,
          fov: Math.min(initialFov, 30),
          projection: 'TAN',
          showReticle: true,
          showCooGrid: false,
          showShareControl: true,
          showContextMenu: true,
        });
        aladinRef.current = aladin;
        window.setTimeout(() => {
          if (cancelled) return;
          drawFrame([object.raHours * 15, object.decDeg]);
          if (fov) fitFrameInView(true);
        }, 180);
      })
      .catch(cause => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : 'Himmelsbild nicht verfügbar.');
      });
    return () => {
      cancelled = true;
      aladinRef.current = null;
      overlayRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [object.id, fov?.widthDeg, fov?.heightDeg, framingExpanded]);

  useEffect(() => {
    if (aladinRef.current) {
      drawFrame();
      updateScreenFrame();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotation, frameVisible, objectSizeVisible, objectRotation]);

  useEffect(() => {
    if (!fov || !frameVisible || !framingExpanded) {
      setScreenFrame(null);
      return;
    }
    // Aladin Lite dokumentiert world2pix(), aber keinen allgemeinen Listener für
    // jede Verschiebe- und Zoomänderung. Ein leichter Abgleich hält den Rahmen
    // deshalb auch beim Ziehen, Zoomen, Vollbildwechsel und Drehen synchron.
    const timer = window.setInterval(updateScreenFrame, 140);
    updateScreenFrame();
    return () => window.clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [object.id, fov?.widthDeg, fov?.heightDeg, rotation, frameVisible, framingExpanded]);

  const horizonWidth = 900;
  const horizonHeight = 300;
  const skyTop = 25;
  const horizonY = 230;
  const groundBottom = 295;
  const xForAzimuth = (azimuth: number) => (((azimuth % 360) + 360) % 360) / 360 * horizonWidth;
  const yForAltitude = (altitude: number) => altitude >= 0
    ? skyTop + (90 - clamp(altitude, 0, 90)) / 90 * (horizonY - skyTop)
    : horizonY + clamp(-altitude, 0, 15) / 15 * (groundBottom - horizonY - 8);
  const objectX = xForAzimuth(horizontal.azimuth);
  const objectY = yForAltitude(horizontal.altitude);
  const frameWidth = fov ? Math.max(8, fov.widthDeg / 360 * horizonWidth) : 0;
  const frameHeight = fov ? Math.max(7, fov.heightDeg / 90 * (horizonY - skyTop)) : 0;
  const horizonId = object.id.replace(/[^a-z0-9]/gi, '');
  const personalHorizonPoints = Array.from({ length: 73 }, (_, index) => {
    const azimuth = index * 5;
    return { x: azimuth / 360 * horizonWidth, y: yForAltitude(horizonAltitudeAtAzimuth(location, azimuth)) };
  });
  const personalHorizonPath = personalHorizonPoints.map((point, index) => `${index ? 'L' : 'M'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
  const personalGroundPath = `${personalHorizonPath} L ${horizonWidth} ${horizonHeight} L 0 ${horizonHeight} Z`;

  return (
    <div className="sky-viewer">
      <section className="viewer-subsection horizon-subsection" aria-label={`Lokale Horizontansicht von ${object.name}`}>
        <button type="button" className="detail-section-toggle" onClick={onToggleHorizon} aria-expanded={horizonExpanded}>
          <span><span className="eyebrow">Zeitabhängige Himmelslage</span><strong>Horizontansicht</strong></span>
          <span className="collapse-indicator">{horizonExpanded ? '−' : '+'}</span>
        </button>

        {horizonExpanded && <div className="horizon-preview">
          <div className="time-control-bar">
            <div className="selected-time-summary">
              <span>Gewählte Aufnahmezeit</span>
              <strong>{localDateLabel(selectedTime, timezone)} · {formatTime(selectedTime, timezone)}</strong>
              <small>{Math.round(horizontal.altitude)}° Höhe · Azimut {Math.round(horizontal.azimuth)}° ({direction(horizontal.azimuth)})</small>
            </div>
            <label className="clock-control">Uhrzeit
              <input type="time" step="300" value={localTimeValue(selectedTime, timezone)} onChange={event => setClockTime(event.target.value)} />
            </label>
            <div className="time-step-buttons">
              <button type="button" className="secondary compact" onClick={() => setMinute(selectedMinute - 15)}>−15 min</button>
              <button type="button" className="secondary compact" onClick={() => setMinute(selectedMinute + 15)}>+15 min</button>
            </div>
            <label className="ground-toggle"><input type="checkbox" checked={groundVisible} onChange={event => setGroundVisible(event.target.checked)} /> Boden/Horizont anzeigen</label>
          </div>
          <label className="night-time-slider">
            <span>{formatTime(timeRange.start, timezone)}</span>
            <input type="range" min="0" max={timeRange.durationMinutes} step="5" value={selectedMinute} onChange={event => setMinute(Number(event.target.value))} />
            <span>{formatTime(timeRange.end, timezone)}</span>
          </label>

          <div className="horizon-scroll">
            <svg className="horizon-svg" viewBox={`0 0 ${horizonWidth} ${horizonHeight}`} role="img" aria-label="Schematische lokale Horizontansicht">
              <defs>
                <linearGradient id={`sky-gradient-${horizonId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#07152c" />
                  <stop offset="70%" stopColor="#15345a" />
                  <stop offset="100%" stopColor="#6c7890" />
                </linearGradient>
                <linearGradient id={`ground-gradient-${horizonId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#17231b" />
                  <stop offset="100%" stopColor="#060a07" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width={horizonWidth} height={groundVisible ? horizonHeight : horizonY + 20} fill={`url(#sky-gradient-${horizonId})`} />
              {[15, 30, 45, 60, 75, 90].map(altitude => <g key={altitude}>
                <line className="horizon-alt-line" x1="0" x2={horizonWidth} y1={yForAltitude(altitude)} y2={yForAltitude(altitude)} />
                <text className="horizon-alt-label" x="8" y={yForAltitude(altitude) - 4}>{altitude}°</text>
              </g>)}
              {[0, 45, 90, 135, 180, 225, 270, 315, 360].map(azimuth => <line key={azimuth} className="horizon-az-line" x1={azimuth / 360 * horizonWidth} x2={azimuth / 360 * horizonWidth} y1={skyTop} y2={horizonY} />)}
              <line className="mathematical-horizon" x1="0" x2={horizonWidth} y1={horizonY} y2={horizonY} />
              {groundVisible && <>
                <path className="ground-fill" d={personalGroundPath} fill={`url(#ground-gradient-${horizonId})`} />
                <path className="personal-horizon-line" d={personalHorizonPath} />
                <text className="ground-label" x="450" y="278" textAnchor="middle">persönliches Horizontprofil und gespeicherte Hindernisse</text>
              </>}
              <g className="compass-labels">
                <text x="4" y={horizonY + 18}>N</text><text x="225" y={horizonY + 18} textAnchor="middle">O</text><text x="450" y={horizonY + 18} textAnchor="middle">S</text><text x="675" y={horizonY + 18} textAnchor="middle">W</text><text x="896" y={horizonY + 18} textAnchor="end">N</text>
              </g>
              {fov && <rect className="horizon-fov-frame" x={objectX - frameWidth / 2} y={objectY - frameHeight / 2} width={frameWidth} height={frameHeight} transform={`rotate(${rotation} ${objectX} ${objectY})`} />}
              <line className="object-marker-stem" x1={objectX} x2={objectX} y1={Math.max(skyTop, objectY - 28)} y2={Math.min(groundBottom, objectY + 28)} />
              <line className="object-marker-stem" x1={Math.max(0, objectX - 28)} x2={Math.min(horizonWidth, objectX + 28)} y1={objectY} y2={objectY} />
              <circle className={horizontal.altitude >= 0 ? 'horizon-object-point' : 'horizon-object-point below'} cx={objectX} cy={objectY} r="8" />
              <text className="horizon-object-label" x={clamp(objectX, 90, horizonWidth - 90)} y={Math.max(skyTop + 18, objectY - 16)} textAnchor="middle">{object.name} · {Math.round(horizontal.altitude)}°</text>
              <g className="horizon-time-stamp">
                <rect x="14" y="13" width="238" height="48" rx="10" />
                <text x="28" y="34">{localDateLabel(selectedTime, timezone)} · {formatTime(selectedTime, timezone)}</text>
                <text x="28" y="51">Höhe {Math.round(horizontal.altitude)}° · {direction(horizontal.azimuth)}</text>
              </g>
            </svg>
          </div>
          <small className="horizon-help">Die grüne Linie zeigt das persönliche Horizontprofil; gespeicherte Bäume, Gebäude und Berge werden als zusätzliche Hindernisse berücksichtigt.</small>
        </div>}
      </section>

      <section className="viewer-subsection framing-subsection">
        <button type="button" className="detail-section-toggle" onClick={onToggleFraming} aria-expanded={framingExpanded}>
          <span><span className="eyebrow">Interaktives Himmelsbild</span><strong>Rahmung</strong></span>
          <span className="collapse-indicator">{framingExpanded ? '−' : '+'}</span>
        </button>

        {framingExpanded && <>
          <div className="frame-legend inline-frame-legend"><span className="setup-frame-key">Setup</span>{objectSizeVisible && <span className="object-frame-key">Objektgröße</span>}</div>
          <div className="sky-image-stack">
            {error ? <div className="notice warning">{error}</div> : <div ref={containerRef} className="aladin-container" />}
            {screenFrame && frameVisible && <svg className="aladin-framing-overlay" viewBox={`0 0 ${screenFrame.canvasWidth} ${screenFrame.canvasHeight}`} preserveAspectRatio="none" aria-hidden="true">
              <g transform={`translate(${screenFrame.cx} ${screenFrame.cy}) rotate(${screenFrame.angle})`}>
                <rect className="aladin-setup-frame-shadow" x={-screenFrame.frameWidth / 2} y={-screenFrame.frameHeight / 2} width={screenFrame.frameWidth} height={screenFrame.frameHeight} />
                <rect className="aladin-setup-frame" x={-screenFrame.frameWidth / 2} y={-screenFrame.frameHeight / 2} width={screenFrame.frameWidth} height={screenFrame.frameHeight} />
                {[[-screenFrame.frameWidth / 2, -screenFrame.frameHeight / 2], [screenFrame.frameWidth / 2, -screenFrame.frameHeight / 2], [screenFrame.frameWidth / 2, screenFrame.frameHeight / 2], [-screenFrame.frameWidth / 2, screenFrame.frameHeight / 2]].map(([x, y], index) => <g key={index}>
                  <circle className="aladin-frame-corner-shadow" cx={x} cy={y} r="5" />
                  <circle className="aladin-frame-corner" cx={x} cy={y} r="3.2" />
                </g>)}
              </g>
            </svg>}
            <div className="aladin-info-stack">
              <div className="aladin-time-overlay"><strong>{formatTime(selectedTime, timezone)}</strong><span>{Math.round(horizontal.altitude)}° · {direction(horizontal.azimuth)}</span></div>
              <div className="aladin-frame-label" hidden={!screenFrame || !frameVisible}>SETUP {fov ? `${fov.widthDeg.toFixed(2)}° × ${fov.heightDeg.toFixed(2)}°` : ''}</div>
            </div>
          </div>
          <div className="sky-tools">
            <div className="inline-equipment-selectors">
              <label>Teleskop
                <select value={equipment.selectedTelescopeId} onChange={event => onEquipmentChange({ ...equipment, selectedTelescopeId: event.target.value })}>
                  {equipment.telescopes.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
              <label>Kamera
                <select value={equipment.selectedCameraId} onChange={event => onEquipmentChange({ ...equipment, selectedCameraId: event.target.value })}>
                  {equipment.cameras.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
            </div>
            {fov ? <>
              <span className="fov-summary">Bildfeld <strong>{fov.widthDeg.toFixed(2)}° × {fov.heightDeg.toFixed(2)}°</strong> · {fov.pixelScale.toFixed(2)}″/px</span>
              <label className="rotation-control">Rotation<input type="range" min="0" max="180" value={rotation} onChange={event => setRotation(Number(event.target.value))} /><strong>{rotation}°</strong></label>
              <label className="frame-toggle"><input type="checkbox" checked={frameVisible} onChange={event => setFrameVisible(event.target.checked)} /> Setup-Rahmen anzeigen</label>
              <label className="frame-toggle"><input type="checkbox" checked={objectSizeVisible} onChange={event => setObjectSizeVisible(event.target.checked)} /> Objektgröße anzeigen</label>
              {objectSizeVisible && <label className="rotation-control object-rotation-control">Objektrotation<input type="range" min="0" max="180" value={objectRotation} onChange={event => setObjectRotations(current => ({ ...current, [object.id]: Number(event.target.value) }))} /><strong>{Math.round(objectRotation)}°</strong></label>}
              <div className="sky-button-row">
                <button type="button" className="secondary" onClick={centerFrameOnImage}>Rahmen auf Bildmitte</button>
                <button type="button" className="secondary" onClick={centerFrameOnObject}>Rahmen auf Objekt</button>
                <button type="button" onClick={() => fitFrameInView(true)}>Rahmen vollständig zeigen</button>
              </div>
              <small className="frame-help">{frameMessage}</small>
            </> : <span>Für einen Kamerarahmen bitte ein Teleskop und eine Kamera auswählen.</span>}
          </div>
        </>}
      </section>
    </div>
  );
}
