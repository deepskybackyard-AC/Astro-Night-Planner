import { useMemo, useState } from 'react';
import type { Camera, EquipmentState, Telescope } from '../types';
import { calculateFov } from '../lib/astro';

type Props = {
  equipment: EquipmentState;
  onChange: (equipment: EquipmentState) => void;
};

export default function EquipmentManager({ equipment, onChange }: Props) {
  const [scope, setScope] = useState({ name: '', focalLengthMm: '500', apertureMm: '80', reducerFactor: '1' });
  const [camera, setCamera] = useState({ name: '', sensorWidthMm: '23.5', sensorHeightMm: '15.7', pixelSizeUm: '3.76', resolutionX: '', resolutionY: '' });

  const selectedScope = equipment.telescopes.find(item => item.id === equipment.selectedTelescopeId);
  const selectedCamera = equipment.cameras.find(item => item.id === equipment.selectedCameraId);
  const fov = useMemo(() => calculateFov(selectedScope, selectedCamera), [selectedScope, selectedCamera]);

  function addScope() {
    const values = {
      focalLengthMm: Number(scope.focalLengthMm),
      apertureMm: Number(scope.apertureMm),
      reducerFactor: Number(scope.reducerFactor),
    };
    if (!scope.name.trim() || !Object.values(values).every(v => Number.isFinite(v) && v > 0)) return;
    const item: Telescope = { id: `scope-${Date.now()}`, name: scope.name.trim(), ...values };
    onChange({ ...equipment, telescopes: [...equipment.telescopes, item], selectedTelescopeId: item.id });
    setScope({ ...scope, name: '' });
  }

  function addCamera() {
    const values = {
      sensorWidthMm: Number(camera.sensorWidthMm),
      sensorHeightMm: Number(camera.sensorHeightMm),
      pixelSizeUm: Number(camera.pixelSizeUm),
    };
    if (!camera.name.trim() || !Object.values(values).every(v => Number.isFinite(v) && v > 0)) return;
    const item: Camera = {
      id: `camera-${Date.now()}`,
      name: camera.name.trim(),
      ...values,
      resolutionX: Number(camera.resolutionX) || undefined,
      resolutionY: Number(camera.resolutionY) || undefined,
    };
    onChange({ ...equipment, cameras: [...equipment.cameras, item], selectedCameraId: item.id });
    setCamera({ ...camera, name: '' });
  }

  return (
    <div className="equipment-layout">
      <section className="panel">
        <div className="section-heading"><div><span className="eyebrow">Aktives Setup</span><h2>Bildfeld</h2></div></div>
        <div className="form-grid two">
          <label>Teleskop
            <select value={equipment.selectedTelescopeId} onChange={e => onChange({ ...equipment, selectedTelescopeId: e.target.value })}>
              <option value="">Keines gewählt</option>
              {equipment.telescopes.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label>Kamera
            <select value={equipment.selectedCameraId} onChange={e => onChange({ ...equipment, selectedCameraId: e.target.value })}>
              <option value="">Keine gewählt</option>
              {equipment.cameras.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
        </div>
        {fov ? <div className="fov-card">
          <strong>{fov.widthDeg.toFixed(2)}° × {fov.heightDeg.toFixed(2)}°</strong>
          <span>effektive Brennweite {Math.round(fov.focalLength)} mm</span>
          <span>Pixelmaßstab {fov.pixelScale.toFixed(2)} Bogensekunden/Pixel</span>
        </div> : <div className="notice">Teleskop und Kamera auswählen, um das Bildfeld zu berechnen.</div>}
      </section>

      <section className="panel">
        <div className="section-heading"><div><span className="eyebrow">Persönliche Daten</span><h2>Teleskope</h2></div></div>
        <div className="saved-list">
          {equipment.telescopes.map(item => <div key={item.id} className="saved-item"><div><strong>{item.name}</strong><small>{item.focalLengthMm} mm · Ø {item.apertureMm} mm · Faktor {item.reducerFactor}</small></div><button type="button" className="icon-button danger" onClick={() => {
            const telescopes = equipment.telescopes.filter(t => t.id !== item.id);
            onChange({ ...equipment, telescopes, selectedTelescopeId: equipment.selectedTelescopeId === item.id ? (telescopes[0]?.id ?? '') : equipment.selectedTelescopeId });
          }}>×</button></div>)}
        </div>
        <div className="form-grid two add-form">
          <label className="full">Bezeichnung<input value={scope.name} onChange={e => setScope({ ...scope, name: e.target.value })} placeholder="z. B. Newton 1000 mm" /></label>
          <label>Brennweite (mm)<input inputMode="decimal" value={scope.focalLengthMm} onChange={e => setScope({ ...scope, focalLengthMm: e.target.value })} /></label>
          <label>Öffnung (mm)<input inputMode="decimal" value={scope.apertureMm} onChange={e => setScope({ ...scope, apertureMm: e.target.value })} /></label>
          <label>Reducer/Barlow-Faktor<input inputMode="decimal" value={scope.reducerFactor} onChange={e => setScope({ ...scope, reducerFactor: e.target.value })} /></label>
          <button type="button" onClick={addScope}>Teleskop hinzufügen</button>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading"><div><span className="eyebrow">Persönliche Daten</span><h2>Kameras</h2></div></div>
        <div className="saved-list">
          {equipment.cameras.map(item => <div key={item.id} className="saved-item"><div><strong>{item.name}</strong><small>{item.sensorWidthMm} × {item.sensorHeightMm} mm · {item.pixelSizeUm} µm</small></div><button type="button" className="icon-button danger" onClick={() => {
            const cameras = equipment.cameras.filter(c => c.id !== item.id);
            onChange({ ...equipment, cameras, selectedCameraId: equipment.selectedCameraId === item.id ? (cameras[0]?.id ?? '') : equipment.selectedCameraId });
          }}>×</button></div>)}
        </div>
        <div className="form-grid two add-form">
          <label className="full">Bezeichnung<input value={camera.name} onChange={e => setCamera({ ...camera, name: e.target.value })} placeholder="z. B. APS-C Mono" /></label>
          <label>Sensorbreite (mm)<input inputMode="decimal" value={camera.sensorWidthMm} onChange={e => setCamera({ ...camera, sensorWidthMm: e.target.value })} /></label>
          <label>Sensorhöhe (mm)<input inputMode="decimal" value={camera.sensorHeightMm} onChange={e => setCamera({ ...camera, sensorHeightMm: e.target.value })} /></label>
          <label>Pixelgröße (µm)<input inputMode="decimal" value={camera.pixelSizeUm} onChange={e => setCamera({ ...camera, pixelSizeUm: e.target.value })} /></label>
          <label>Pixel X (optional)<input inputMode="numeric" value={camera.resolutionX} onChange={e => setCamera({ ...camera, resolutionX: e.target.value })} /></label>
          <label>Pixel Y (optional)<input inputMode="numeric" value={camera.resolutionY} onChange={e => setCamera({ ...camera, resolutionY: e.target.value })} /></label>
          <button type="button" onClick={addCamera}>Kamera hinzufügen</button>
        </div>
      </section>
    </div>
  );
}
