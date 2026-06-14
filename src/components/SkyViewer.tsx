import { useEffect, useMemo, useRef, useState } from 'react';
import type { Camera, DeepSkyObject, LocationProfile, NightWindow, Telescope } from '../types';
import { calculateFov, horizontalForObject, makeObserver } from '../lib/astro';
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

function rectangleCorners(ra: number, dec: number, width: number, height: number, rotationDeg: number): number[][] {
  const angle = rotationDeg * Math.PI / 180;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const cosDec = Math.max(0.1, Math.cos(dec * Math.PI / 180));
  const raw = [
    [-width / 2, -height / 2],
    [width / 2, -height / 2],
    [width / 2, height / 2],
    [-width / 2, height / 2],
    [-width / 2, -height / 2],
  ];
  return raw.map(([x, y]) => {
    const xr = x * cosA - y * sinA;
    const yr = x * sinA + y * cosA;
    return [((ra + xr / cosDec) % 360 + 360) % 360, Math.max(-89.9, Math.min(89.9, dec + yr))];
  });
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
  telescope?: Telescope;
  camera?: Camera;
  night: NightWindow;
  location: LocationProfile;
  timezone: string;
  selectedTime: Date;
  onSelectedTimeChange: (time: Date) => void;
};

export default function SkyViewer({ object, telescope, camera, night, location, timezone, selectedTime, onSelectedTimeChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const aladinRef = useRef<any>(null);
  const overlayRef = useRef<any>(null);
  const frameCenterRef = useRef<[number, number]>([object.raHours * 15, object.decDeg]);
  const [error, setError] = useState('');
  const [rotation, setRotation] = useState(0);
  const [frameVisible, setFrameVisible] = useState(true);
  const [groundVisible, setGroundVisible] = useState(true);
  const [frameMessage, setFrameMessage] = useState('Rahmen ist auf das Objekt zentriert.');
  const [screenFrame, setScreenFrame] = useState<{ points: string; corners: Array<[number, number]>; width: number; height: number } | null>(null);
  const fov = useMemo(() => calculateFov(telescope, camera), [telescope, camera]);
  const observer = useMemo(() => makeObserver(location), [location]);
  const horizontal = useMemo(() => horizontalForObject(object, selectedTime, observer), [object, selectedTime, observer]);

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
    if (!aladin || !fov || !frameVisible || typeof aladin.world2pix !== 'function') {
      setScreenFrame(null);
      return;
    }
    try {
      const skyCorners = rectangleCorners(
        frameCenterRef.current[0],
        frameCenterRef.current[1],
        fov.widthDeg,
        fov.heightDeg,
        rotation,
      ).slice(0, 4);
      const corners = skyCorners.map(([ra, dec]) => aladin.world2pix(ra, dec)) as Array<[number, number] | null>;
      if (corners.some(point => !point || !Number.isFinite(point[0]) || !Number.isFinite(point[1]))) {
        setScreenFrame(null);
        return;
      }
      const validCorners = corners as Array<[number, number]>;
      const size = aladin.getSize?.() ?? [containerRef.current?.clientWidth ?? 1000, containerRef.current?.clientHeight ?? 500];
      const points = validCorners.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
      setScreenFrame(previous => previous?.points === points && previous.width === size[0] && previous.height === size[1]
        ? previous
        : { points, corners: validCorners, width: size[0], height: size[1] });
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
      const overlay = A.graphicOverlay({ color: '#ffd45a', lineWidth: 3 });
      // Laut Aladin-Lite-API wird die Ebene zuerst an die Ansicht angehängt und
      // anschließend mit Formen befüllt. Der Setup-Rahmen selbst wird zusätzlich
      // als eigenes SVG über dem Viewer gezeichnet, damit er auf allen Geräten
      // und nach Zoom-/Verschiebevorgängen zuverlässig sichtbar bleibt.
      aladin.addOverlay(overlay);
      if (frameVisible && fov) {
        overlay.add(A.polyline(rectangleCorners(
          frameCenterRef.current[0],
          frameCenterRef.current[1],
          fov.widthDeg,
          fov.heightDeg,
          rotation,
        ), {
          color: '#34d8ff',
          lineWidth: 5,
        }));
      }
      if (object.majorArcMin > 0 && object.minorArcMin > 0) {
        overlay.add(A.ellipse(object.raHours * 15, object.decDeg, object.majorArcMin / 120, object.minorArcMin / 120, 0, {
          color: '#ffd45a',
          lineWidth: 3,
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
  }, [object.id, fov?.widthDeg, fov?.heightDeg]);

  useEffect(() => {
    if (aladinRef.current) {
      drawFrame();
      updateScreenFrame();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotation, frameVisible]);

  useEffect(() => {
    if (!fov || !frameVisible) {
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
  }, [object.id, fov?.widthDeg, fov?.heightDeg, rotation, frameVisible]);

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

  return (
    <div className="sky-viewer">
      <div className="sky-viewer-heading">
        <div><span className="eyebrow">Zeitabhängige Himmelslage und Framing</span><h3>Horizontansicht und Himmelsbild</h3></div>
        <div className="frame-legend"><span className="setup-frame-key">Setup</span><span className="object-frame-key">Objektgröße</span></div>
      </div>

      <section className="horizon-preview" aria-label={`Lokale Horizontansicht von ${object.name}`}>
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
            {[0, 45, 90, 135, 180, 225, 270, 315, 360].map(azimuth => <g key={azimuth}>
              <line className="horizon-az-line" x1={azimuth / 360 * horizonWidth} x2={azimuth / 360 * horizonWidth} y1={skyTop} y2={horizonY} />
            </g>)}
            <line className="mathematical-horizon" x1="0" x2={horizonWidth} y1={horizonY} y2={horizonY} />
            {groundVisible && <>
              <path className="ground-fill" d={`M 0 ${horizonY} L 0 ${horizonY - 8} L 80 ${horizonY - 20} L 150 ${horizonY - 7} L 230 ${horizonY - 28} L 330 ${horizonY - 10} L 430 ${horizonY - 18} L 520 ${horizonY - 5} L 610 ${horizonY - 25} L 700 ${horizonY - 9} L 790 ${horizonY - 22} L 900 ${horizonY - 7} L 900 ${horizonHeight} L 0 ${horizonHeight} Z`} fill={`url(#ground-gradient-${horizonId})`} />
              <text className="ground-label" x="450" y="278" textAnchor="middle">schematischer Boden · lokale Hindernisse nicht berücksichtigt</text>
            </>}
            <g className="compass-labels">
              <text x="4" y={horizonY + 18}>N</text>
              <text x="225" y={horizonY + 18} textAnchor="middle">O</text>
              <text x="450" y={horizonY + 18} textAnchor="middle">S</text>
              <text x="675" y={horizonY + 18} textAnchor="middle">W</text>
              <text x="896" y={horizonY + 18} textAnchor="end">N</text>
            </g>
            {fov && <rect className="horizon-fov-frame" x={objectX - frameWidth / 2} y={objectY - frameHeight / 2} width={frameWidth} height={frameHeight} transform={`rotate(${rotation} ${objectX} ${objectY})`} />}
            <line className="object-marker-stem" x1={objectX} x2={objectX} y1={Math.max(skyTop, objectY - 28)} y2={Math.min(groundBottom, objectY + 28)} />
            <line className="object-marker-stem" x1={Math.max(0, objectX - 28)} x2={Math.min(horizonWidth, objectX + 28)} y1={objectY} y2={objectY} />
            <circle className={horizontal.altitude >= 0 ? 'horizon-object-point' : 'horizon-object-point below'} cx={objectX} cy={objectY} r="8" />
            <text className="horizon-object-label" x={clamp(objectX, 90, horizonWidth - 90)} y={Math.max(skyTop + 18, objectY - 16)} textAnchor="middle">
              {object.name} · {Math.round(horizontal.altitude)}°
            </text>
            <g className="horizon-time-stamp">
              <rect x="14" y="13" width="238" height="48" rx="10" />
              <text x="28" y="34">{localDateLabel(selectedTime, timezone)} · {formatTime(selectedTime, timezone)}</text>
              <text x="28" y="51">Höhe {Math.round(horizontal.altitude)}° · {direction(horizontal.azimuth)}</text>
            </g>
          </svg>
        </div>
        <small className="horizon-help">Die Ansicht zeigt den mathematischen Horizont am gewählten Standort. Ein eigenes Profil für Bäume, Häuser oder Berge kann später ergänzt werden.</small>
      </section>

      <div className="sky-image-stack">
        {error ? <div className="notice warning">{error}</div> : <div ref={containerRef} className="aladin-container" />}
        {screenFrame && frameVisible && <svg
          className="aladin-framing-overlay"
          viewBox={`0 0 ${screenFrame.width} ${screenFrame.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon className="aladin-setup-frame-shadow" points={screenFrame.points} />
          <polygon className="aladin-setup-frame" points={screenFrame.points} />
          {screenFrame.corners.map(([x, y], index) => <g key={`${x}-${y}-${index}`}>
            <circle className="aladin-frame-corner-shadow" cx={x} cy={y} r="6" />
            <circle className="aladin-frame-corner" cx={x} cy={y} r="4" />
          </g>)}
        </svg>}
        <div className="aladin-frame-label" hidden={!screenFrame || !frameVisible}>SETUP {fov ? `${fov.widthDeg.toFixed(2)}° × ${fov.heightDeg.toFixed(2)}°` : ''}</div>
        <div className="aladin-time-overlay">
          <strong>{formatTime(selectedTime, timezone)}</strong>
          <span>{Math.round(horizontal.altitude)}° · {direction(horizontal.azimuth)}</span>
        </div>
      </div>
      <div className="sky-tools">
        {fov ? (
          <>
            <span className="fov-summary">Bildfeld <strong>{fov.widthDeg.toFixed(2)}° × {fov.heightDeg.toFixed(2)}°</strong> · {fov.pixelScale.toFixed(2)}″/px</span>
            <label className="rotation-control">
              Rotation
              <input type="range" min="0" max="180" value={rotation} onChange={event => setRotation(Number(event.target.value))} />
              <strong>{rotation}°</strong>
            </label>
            <label className="frame-toggle"><input type="checkbox" checked={frameVisible} onChange={event => setFrameVisible(event.target.checked)} /> Setup-Rahmen anzeigen</label>
            <div className="sky-button-row">
              <button type="button" className="secondary" onClick={centerFrameOnImage}>Rahmen auf Bildmitte</button>
              <button type="button" className="secondary" onClick={centerFrameOnObject}>Rahmen auf Objekt</button>
              <button type="button" onClick={() => fitFrameInView(true)}>Rahmen vollständig zeigen</button>
            </div>
            <small className="frame-help">{frameMessage}</small>
          </>
        ) : <span>Für einen Kamerarahmen bitte unter „Ausrüstung“ ein Teleskop und eine Kamera auswählen.</span>}
      </div>
    </div>
  );
}
