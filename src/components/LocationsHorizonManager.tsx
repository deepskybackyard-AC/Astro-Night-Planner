import { useEffect, useMemo, useState } from 'react';
import type { CentralSettings, HorizonObstacle, HorizonPoint, LocationProfile } from '../types';
import LocationPicker from './LocationPicker';

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function direction(azimuth: number) {
  const names = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
  return names[Math.round((((azimuth % 360) + 360) % 360) / 45) % 8];
}

function formatAzimuth(azimuth: number) {
  const normalized = ((azimuth % 360) + 360) % 360;
  return `${Math.round(azimuth)}° (${direction(normalized)})`;
}

function cloneLocation(location: LocationProfile): LocationProfile {
  return {
    ...location,
    horizonProfile: (location.horizonProfile ?? []).map((point) => ({ ...point })),
    obstacles: (location.obstacles ?? []).map((obstacle) => ({ ...obstacle })),
  };
}

function same(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b);
}

type Props = {
  locations: LocationProfile[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd: (location: LocationProfile) => void;
  onDelete: (id: string) => void;
  onUpdate: (location: LocationProfile) => void;
  settings: CentralSettings;
  onSettingsChange: (settings: CentralSettings) => void;
};

export default function LocationsHorizonManager({ locations, selectedId, onSelect, onAdd, onDelete, onUpdate, settings, onSettingsChange }: Props) {
  const location = locations.find((item) => item.id === selectedId) ?? locations[0];
  const [behaviorDraft, setBehaviorDraft] = useState(() => ({ defaultLocationId: settings.defaultLocationId, gpsBehavior: settings.gpsBehavior }));
  const [locationDraft, setLocationDraft] = useState<LocationProfile | null>(() => location ? cloneLocation(location) : null);
  const [point, setPoint] = useState({ azimuth: '0', altitude: '0' });
  const [obstacle, setObstacle] = useState({ name: '', type: 'Baum' as HorizonObstacle['type'], azimuthStart: '0', azimuthEnd: '20', altitude: '15' });
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    setBehaviorDraft({ defaultLocationId: settings.defaultLocationId, gpsBehavior: settings.gpsBehavior });
  }, [settings.defaultLocationId, settings.gpsBehavior]);

  useEffect(() => {
    setLocationDraft(location ? cloneLocation(location) : null);
  }, [location?.id, location?.horizonProfile, location?.obstacles]);

  const profile = useMemo(
    () => [...(locationDraft?.horizonProfile ?? [])].sort((a, b) => a.azimuth - b.azimuth),
    [locationDraft],
  );

  if (!location || !locationDraft) return null;

  const behaviorDirty = !same(behaviorDraft, { defaultLocationId: settings.defaultLocationId, gpsBehavior: settings.gpsBehavior });
  const horizonDirty = !same(locationDraft, cloneLocation(location));

  function notify(text: string) {
    setSavedMessage(text);
    window.setTimeout(() => setSavedMessage(''), 2200);
  }

  function updateDraft(patch: Partial<LocationProfile>) {
    setLocationDraft((current) => current ? { ...current, ...patch } : current);
  }

  function addPoint() {
    const azimuth = clamp(Number(point.azimuth), 0, 360);
    const altitude = clamp(Number(point.altitude), 0, 90);
    if (!Number.isFinite(azimuth) || !Number.isFinite(altitude)) return;
    const points = [...(locationDraft!.horizonProfile ?? [])].filter((item) => Math.abs(item.azimuth - azimuth) > 0.01);
    points.push({ azimuth, altitude });
    points.sort((a, b) => a.azimuth - b.azimuth);
    updateDraft({ horizonProfile: points });
  }

  function updatePoint(index: number, patch: Partial<HorizonPoint>) {
    const points = [...profile];
    points[index] = { ...points[index], ...patch };
    points.sort((a, b) => a.azimuth - b.azimuth);
    updateDraft({ horizonProfile: points });
  }

  function removePoint(index: number) {
    updateDraft({ horizonProfile: profile.filter((_, itemIndex) => itemIndex !== index) });
  }

  function addObstacle() {
    if (!obstacle.name.trim()) return;
    const item: HorizonObstacle = {
      id: `obstacle-${Date.now()}`,
      name: obstacle.name.trim(),
      type: obstacle.type,
      azimuthStart: clamp(Number(obstacle.azimuthStart), 0, 360),
      azimuthEnd: clamp(Number(obstacle.azimuthEnd), 0, 360),
      altitude: clamp(Number(obstacle.altitude), 0, 90),
    };
    updateDraft({ obstacles: [...(locationDraft!.obstacles ?? []), item] });
    setObstacle({ ...obstacle, name: '' });
  }

  function saveBehavior() {
    onSettingsChange({ ...settings, ...behaviorDraft });
    notify('Standortverhalten gespeichert.');
  }

  function saveHorizon() {
    onUpdate(cloneLocation(locationDraft!));
    notify('Horizont und Hindernisse gespeichert.');
  }

  const chartWidth = 720;
  const chartHeight = 198;
  const baseline = 165;
  const profilePath = profile.length
    ? profile.map((item, index) => `${index ? 'L' : 'M'} ${(item.azimuth / 360 * chartWidth).toFixed(1)} ${(baseline - item.altitude / 90 * 145).toFixed(1)}`).join(' ')
    : `M 0 ${baseline} L ${chartWidth} ${baseline}`;
  const compassTicks = [
    [0, 'N'], [45, 'NO'], [90, 'O'], [135, 'SO'], [180, 'S'], [225, 'SW'], [270, 'W'], [315, 'NW'], [360, 'N'],
  ] as const;

  return (
    <div className="settings-stack">
      {savedMessage && <div className="settings-save-toast" role="status">✓ {savedMessage}</div>}
      <LocationPicker locations={locations} selectedId={selectedId} onSelect={(id) => { if (!horizonDirty || window.confirm('Ungespeicherte Horizontänderungen verwerfen und Standort wechseln?')) onSelect(id); }} onAdd={onAdd} onDelete={onDelete} />

      <section className={`panel settings-card ${behaviorDirty ? 'has-unsaved' : ''}`}>
        <div className="section-heading"><div><span className="eyebrow">Standortverhalten</span><h2>Standard und GPS</h2></div>{behaviorDirty && <span className="unsaved-badge">Ungespeichert</span>}</div>
        <div className="form-grid two">
          <label>Standardstandort
            <select value={behaviorDraft.defaultLocationId} onChange={(event) => setBehaviorDraft({ ...behaviorDraft, defaultLocationId: event.target.value })}>
              {locations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label>GPS beim Start
            <select value={behaviorDraft.gpsBehavior} onChange={(event) => setBehaviorDraft({ ...behaviorDraft, gpsBehavior: event.target.value as CentralSettings['gpsBehavior'] })}>
              <option value="ask">Bei Bedarf nachfragen</option>
              <option value="last">Zuletzt gewählten Standort verwenden</option>
              <option value="off">GPS nicht automatisch verwenden</option>
            </select>
          </label>
        </div>
        <p className="footnote">Die zentrale Synchronisierung dieser Angaben folgt später zusammen mit dem Benutzerkonto.</p>
        <SectionSaveActions dirty={behaviorDirty} onSave={saveBehavior} onDiscard={() => setBehaviorDraft({ defaultLocationId: settings.defaultLocationId, gpsBehavior: settings.gpsBehavior })} />
      </section>

      <section className={`panel settings-card ${horizonDirty ? 'has-unsaved' : ''}`}>
        <div className="section-heading"><div><span className="eyebrow">Persönlicher Horizont</span><h2>{location.name}</h2></div>{horizonDirty && <span className="unsaved-badge">Ungespeichert</span>}</div>
        <div className="horizon-profile-chart-scroll">
          <svg className="horizon-profile-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label="Persönliches Horizontprofil">
            {[0, 15, 30, 45, 60, 75, 90].map((altitude) => {
              const y = baseline - altitude / 90 * 145;
              return <g key={altitude}><line x1="0" x2={chartWidth} y1={y} y2={y} className="horizon-profile-grid" /><text x="4" y={y - 3}>{altitude}°</text></g>;
            })}
            {compassTicks.map(([azimuth, label]) => <g key={azimuth}><line x1={azimuth / 360 * chartWidth} x2={azimuth / 360 * chartWidth} y1="20" y2={baseline} className="horizon-profile-grid vertical" /><text x={azimuth / 360 * chartWidth} y="181" textAnchor={azimuth === 0 ? 'start' : azimuth === 360 ? 'end' : 'middle'}>{label}</text><text className="azimuth-degree-label" x={azimuth / 360 * chartWidth} y="193" textAnchor={azimuth === 0 ? 'start' : azimuth === 360 ? 'end' : 'middle'}>{azimuth}°</text></g>)}
            {(locationDraft!.obstacles ?? []).map((item) => {
              const start = item.azimuthStart / 360 * chartWidth;
              const end = item.azimuthEnd / 360 * chartWidth;
              const height = item.altitude / 90 * 145;
              if (item.azimuthStart <= item.azimuthEnd) return <rect key={item.id} className="horizon-obstacle" x={start} y={baseline - height} width={Math.max(2, end - start)} height={height} />;
              return <g key={item.id}><rect className="horizon-obstacle" x={start} y={baseline - height} width={chartWidth - start} height={height} /><rect className="horizon-obstacle" x="0" y={baseline - height} width={end} height={height} /></g>;
            })}
            <path className="horizon-profile-line" d={profilePath} />
          </svg>
        </div>
        <p className="compass-help"><strong>Azimut:</strong> 0° N · 45° NO · 90° O · 135° SO · 180° S · 225° SW · 270° W · 315° NW</p>

        <h3>Horizontpunkte</h3>
        <div className="horizon-point-list">
          {profile.map((item, index) => <div className="horizon-point-row" key={`${item.azimuth}-${index}`}>
            <label>Azimut <small>{direction(item.azimuth)}</small><input type="number" min="0" max="360" step="1" value={item.azimuth} onChange={(event) => updatePoint(index, { azimuth: clamp(Number(event.target.value), 0, 360) })} /></label>
            <label>Höhe<input type="number" min="0" max="90" step="1" value={item.altitude} onChange={(event) => updatePoint(index, { altitude: clamp(Number(event.target.value), 0, 90) })} /></label>
            <button type="button" className="icon-button danger" onClick={() => removePoint(index)} aria-label="Horizontpunkt löschen">×</button>
          </div>)}
        </div>
        <div className="inline-add-row">
          <label>Azimut <small>{direction(Number(point.azimuth) || 0)}</small><input type="number" min="0" max="360" value={point.azimuth} onChange={(event) => setPoint({ ...point, azimuth: event.target.value })} /></label>
          <label>Höhe<input type="number" min="0" max="90" value={point.altitude} onChange={(event) => setPoint({ ...point, altitude: event.target.value })} /></label>
          <button type="button" onClick={addPoint}>Punkt hinzufügen</button>
        </div>

        <h3>Hindernisse</h3>
        <div className="saved-list">
          {(locationDraft!.obstacles ?? []).map((item) => <div className="saved-item" key={item.id}><div><strong>{item.name}</strong><small>{item.type} · {formatAzimuth(item.azimuthStart)} bis {formatAzimuth(item.azimuthEnd)} · Höhe {item.altitude}°</small></div><button type="button" className="icon-button danger" onClick={() => updateDraft({ obstacles: (locationDraft!.obstacles ?? []).filter((entry) => entry.id !== item.id) })}>×</button></div>)}
        </div>
        <div className="obstacle-form">
          <label className="wide">Bezeichnung<input value={obstacle.name} onChange={(event) => setObstacle({ ...obstacle, name: event.target.value })} placeholder="z. B. Baumgruppe Ost" /></label>
          <label>Art<select value={obstacle.type} onChange={(event) => setObstacle({ ...obstacle, type: event.target.value as HorizonObstacle['type'] })}><option>Baum</option><option>Gebäude</option><option>Berg</option><option>Sonstiges</option></select></label>
          <label>Azimut von <small>{direction(Number(obstacle.azimuthStart) || 0)}</small><input type="number" min="0" max="360" value={obstacle.azimuthStart} onChange={(event) => setObstacle({ ...obstacle, azimuthStart: event.target.value })} /></label>
          <label>Azimut bis <small>{direction(Number(obstacle.azimuthEnd) || 0)}</small><input type="number" min="0" max="360" value={obstacle.azimuthEnd} onChange={(event) => setObstacle({ ...obstacle, azimuthEnd: event.target.value })} /></label>
          <label>Höhe<input type="number" min="0" max="90" value={obstacle.altitude} onChange={(event) => setObstacle({ ...obstacle, altitude: event.target.value })} /></label>
          <button type="button" onClick={addObstacle}>Hindernis hinzufügen</button>
        </div>
        <SectionSaveActions dirty={horizonDirty} onSave={saveHorizon} onDiscard={() => setLocationDraft(cloneLocation(location))} />
      </section>
    </div>
  );
}

function SectionSaveActions({ dirty, onSave, onDiscard }: { dirty: boolean; onSave: () => void; onDiscard: () => void }) {
  return <div className="section-save-actions"><span>{dirty ? 'Änderungen sind noch nicht gespeichert.' : 'Gespeicherter Stand'}</span><div><button type="button" className="secondary" disabled={!dirty} onClick={onDiscard}>Änderungen verwerfen</button><button type="button" disabled={!dirty} onClick={onSave}>Änderungen speichern</button></div></div>;
}
