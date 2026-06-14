import { useState } from 'react';
import type { LocationProfile } from '../types';
import { locationFromGps, searchPlaces, type GeocodingResult } from '../services/geocoding';

type Props = {
  locations: LocationProfile[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd: (location: LocationProfile) => void;
  onDelete: (id: string) => void;
};

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (value: number) => value * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function LocationPicker({ locations, selectedId, onSelect, onAdd, onDelete }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState({ name: '', latitude: '', longitude: '', elevation: '0', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });

  async function runSearch() {
    if (query.trim().length < 2) return;
    setBusy(true); setMessage('');
    try { setResults(await searchPlaces(query.trim())); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Ortssuche fehlgeschlagen.'); }
    finally { setBusy(false); }
  }

  async function useGps() {
    setBusy(true); setMessage('');
    try {
      const location = await locationFromGps();
      onAdd(location);
      setMessage('GPS-Standort wurde übernommen.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'GPS-Standort konnte nicht gelesen werden.');
    } finally { setBusy(false); }
  }

  async function addManual() {
    const latitude = Number(manual.latitude);
    const longitude = Number(manual.longitude);
    const elevation = Number(manual.elevation);
    if (!manual.name.trim() || !Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      setMessage('Bitte Name sowie gültige Breiten- und Längengrade eingeben.');
      return;
    }
    setBusy(true);
    setMessage('');
    let placeMetadata: Partial<LocationProfile> = {};
    try {
      const matches = await searchPlaces(manual.name.trim());
      const nearest = matches
        .map(match => ({ match, distance: distanceKm(latitude, longitude, match.latitude, match.longitude) }))
        .sort((a, b) => a.distance - b.distance)[0];
      if (nearest && nearest.distance <= 150) {
        placeMetadata = { geonameId: nearest.match.geonameId, country: nearest.match.country };
      }
    } catch {
      // Der Standort bleibt nutzbar; Meteoblue verwendet dann seine automatische Ortserkennung.
    }
    onAdd({
      id: `manual-${Date.now()}`,
      name: manual.name.trim(), latitude, longitude,
      elevation: Number.isFinite(elevation) ? elevation : 0,
      timezone: manual.timezone || 'UTC',
      ...placeMetadata,
    });
    setShowManual(false);
    setManual({ ...manual, name: '', latitude: '', longitude: '' });
    setMessage(placeMetadata.geonameId ? 'Standort gespeichert und für Meteoblue zugeordnet.' : 'Standort gespeichert. Meteoblue nutzt für diesen Eintrag die automatische Standorterkennung.');
    setBusy(false);
  }

  return (
    <section className="panel location-panel">
      <div className="section-heading">
        <div><span className="eyebrow">Beobachtungsort</span><h2>Standort</h2></div>
        <button type="button" className="secondary compact" onClick={useGps} disabled={busy}>⌖ GPS</button>
      </div>
      <div className="field-row">
        <select value={selectedId} onChange={e => onSelect(e.target.value)} aria-label="Gespeicherten Standort wählen">
          {locations.map(location => <option key={location.id} value={location.id}>{location.name}</option>)}
        </select>
        {locations.length > 1 && <button type="button" className="icon-button danger" title="Standort löschen" onClick={() => onDelete(selectedId)}>×</button>}
      </div>
      <div className="location-meta">
        {locations.find(l => l.id === selectedId) && (() => {
          const l = locations.find(item => item.id === selectedId)!;
          return <>{l.latitude.toFixed(4)}°, {l.longitude.toFixed(4)}° · {Math.round(l.elevation)} m · {l.timezone}</>;
        })()}
      </div>
      <div className="search-row">
        <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && runSearch()} placeholder="Ort oder Postleitzahl" />
        <button type="button" onClick={runSearch} disabled={busy || query.trim().length < 2}>Suchen</button>
      </div>
      {results.length > 0 && <div className="search-results">
        {results.map(result => <button type="button" key={result.id} onClick={() => { onAdd(result); setResults([]); setQuery(''); }}>{result.name}<small>{result.latitude.toFixed(3)}°, {result.longitude.toFixed(3)}° · {Math.round(result.elevation)} m</small></button>)}
      </div>}
      <button type="button" className="text-button" onClick={() => setShowManual(value => !value)}>Koordinaten manuell eingeben</button>
      {showManual && <div className="manual-grid">
        <label>Name<input value={manual.name} onChange={e => setManual({ ...manual, name: e.target.value })} /></label>
        <label>Breitengrad<input inputMode="decimal" value={manual.latitude} onChange={e => setManual({ ...manual, latitude: e.target.value })} /></label>
        <label>Längengrad<input inputMode="decimal" value={manual.longitude} onChange={e => setManual({ ...manual, longitude: e.target.value })} /></label>
        <label>Höhe (m)<input inputMode="numeric" value={manual.elevation} onChange={e => setManual({ ...manual, elevation: e.target.value })} /></label>
        <label className="full">Zeitzone<input value={manual.timezone} onChange={e => setManual({ ...manual, timezone: e.target.value })} placeholder="Europe/Berlin" /></label>
        <button type="button" onClick={addManual}>Standort speichern</button>
      </div>}
      {message && <div className="inline-message">{message}</div>}
    </section>
  );
}
