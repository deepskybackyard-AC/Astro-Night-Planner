import { useEffect, useMemo, useRef, useState } from 'react';
import type { Camera, DeepSkyObject, Telescope } from '../types';
import { calculateFov } from '../lib/astro';

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

type Props = {
  object: DeepSkyObject;
  telescope?: Telescope;
  camera?: Camera;
};

export default function SkyViewer({ object, telescope, camera }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const aladinRef = useRef<any>(null);
  const overlayRef = useRef<any>(null);
  const [error, setError] = useState('');
  const [rotation, setRotation] = useState(0);
  const fov = useMemo(() => calculateFov(telescope, camera), [telescope, camera]);

  const drawFrame = (center?: number[]) => {
    const A = window.A;
    const aladin = aladinRef.current;
    if (!A || !aladin || !fov) return;
    try {
      if (overlayRef.current) aladin.removeOverlay?.(overlayRef.current);
      const [ra, dec] = center ?? aladin.getRaDec();
      const overlay = A.graphicOverlay({ color: '#55c7ff', lineWidth: 3 });
      overlay.add(A.polyline(rectangleCorners(ra, dec, fov.widthDeg, fov.heightDeg, rotation)));
      overlay.add(A.ellipse(object.raHours * 15, object.decDeg, object.majorArcMin / 120, object.minorArcMin / 120, 0, { color: '#f5e9a8', lineWidth: 2 }));
      aladin.addOverlay(overlay);
      overlayRef.current = overlay;
    } catch (cause) {
      console.warn('Framing-Overlay konnte nicht gezeichnet werden.', cause);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setError('');
    loadAladin()
      .then(() => window.A?.init)
      .then(() => {
        if (cancelled || !containerRef.current || !window.A) return;
        containerRef.current.innerHTML = '';
        const initialFov = Math.max(
          fov ? Math.max(fov.widthDeg, fov.heightDeg) * 1.45 : 0,
          object.majorArcMin / 60 * 1.4,
          0.3,
        );
        const aladin = window.A.aladin(containerRef.current, {
          survey: 'P/DSS2/color',
          target: `${object.raHours * 15} ${object.decDeg}`,
          fov: Math.min(initialFov, 20),
          projection: 'TAN',
          showReticle: true,
          showCooGrid: false,
          showShareControl: true,
          showContextMenu: true,
        });
        aladinRef.current = aladin;
        drawFrame([object.raHours * 15, object.decDeg]);
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
    if (aladinRef.current) drawFrame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotation]);

  return (
    <div className="sky-viewer">
      {error ? <div className="notice warning">{error}</div> : <div ref={containerRef} className="aladin-container" />}
      <div className="sky-tools">
        {fov ? (
          <>
            <span>Bildfeld {fov.widthDeg.toFixed(2)}° × {fov.heightDeg.toFixed(2)}° · {fov.pixelScale.toFixed(2)}″/px</span>
            <label>
              Rotation
              <input type="range" min="0" max="180" value={rotation} onChange={e => setRotation(Number(e.target.value))} />
              <strong>{rotation}°</strong>
            </label>
            <button type="button" className="secondary" onClick={() => drawFrame()}>
              Rahmen auf Bildmitte setzen
            </button>
          </>
        ) : <span>Für einen Kamerarahmen bitte Teleskop und Kamera auswählen.</span>}
      </div>
    </div>
  );
}
