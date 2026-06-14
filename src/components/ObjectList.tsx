import { useState } from 'react';
import type { Camera, CatalogName, LocationProfile, NightWindow, ObjectFilters, ObjectNightData, ObjectResultStats, ObjectType, Telescope } from '../types';
import { CATALOGS, CATALOG_COUNTS, CATALOG_LABELS, OBJECT_TYPES } from '../data/objects';
import { formatTime } from '../lib/time';
import SkyViewer from './SkyViewer';
import AltitudeChart from './AltitudeChart';

type Props = {
  objects: ObjectNightData[];
  stats: ObjectResultStats;
  filters: ObjectFilters;
  onFiltersChange: (filters: ObjectFilters) => void;
  timezone: string;
  telescope?: Telescope;
  camera?: Camera;
  search: string;
  onSearchChange: (value: string) => void;
  night: NightWindow;
  location: LocationProfile;
};

function scoreClass(score: number) {
  if (score >= 70) return 'good';
  if (score >= 45) return 'medium';
  return 'bad';
}

function formatSize(value: number) {
  if (value <= 0) return '–';
  if (value >= 60) return `${(value / 60).toFixed(value >= 600 ? 0 : 1).replace('.', ',')}°`;
  if (value < 1) return `${Math.round(value * 60)}″`;
  return `${Number(value.toFixed(1)).toLocaleString('de-DE')}′`;
}

export default function ObjectList({ objects, stats, filters, onFiltersChange, timezone, telescope, camera, search, onSearchChange, night, location }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<Record<string, number>>({});

  function toggleType(type: ObjectType) {
    const types = filters.types.includes(type) ? filters.types.filter(item => item !== type) : [...filters.types, type];
    onFiltersChange({ ...filters, types });
  }

  function toggleCatalog(catalog: CatalogName) {
    const catalogs = filters.catalogs.includes(catalog)
      ? filters.catalogs.filter(item => item !== catalog)
      : [...filters.catalogs, catalog];
    onFiltersChange({ ...filters, catalogs });
  }

  return (
    <section className="panel object-panel">
      <div className="section-heading object-heading">
        <div><span className="eyebrow">Rangliste aus {stats.totalCatalogObjects.toLocaleString('de-DE')} Objekten</span><h2>Geeignete Objekte</h2></div>
        <span className="result-count" title="Angezeigte Ergebnisse">{objects.length}</span>
      </div>
      <div className="object-toolbar">
        <input value={search} onChange={e => onSearchChange(e.target.value)} placeholder="z. B. M 31, NGC 7000, Sh2-216 oder Sternbild" />
        <button type="button" className="secondary" onClick={() => setShowFilters(value => !value)}>Filter {showFilters ? 'schließen' : 'öffnen'}</button>
      </div>

      {showFilters && <div className="filters">
        <div className="filter-section-heading">
          <strong>Kataloge</strong>
          <span className="filter-actions">
            <button type="button" onClick={() => onFiltersChange({ ...filters, catalogs: CATALOGS })}>alle</button>
            <button type="button" onClick={() => onFiltersChange({ ...filters, catalogs: [] })}>keine</button>
          </span>
        </div>
        <div className="type-chips catalog-chips">
          {CATALOGS.map(catalog => <button type="button" key={catalog} className={filters.catalogs.includes(catalog) ? 'active' : ''} onClick={() => toggleCatalog(catalog)}>
            {CATALOG_LABELS[catalog]} <small>{CATALOG_COUNTS[catalog].toLocaleString('de-DE')}</small>
          </button>)}
        </div>

        <div className="filter-section-heading type-heading">
          <strong>Objekttypen</strong>
          <span className="filter-actions">
            <button type="button" onClick={() => onFiltersChange({ ...filters, types: OBJECT_TYPES })}>alle</button>
            <button type="button" onClick={() => onFiltersChange({ ...filters, types: [] })}>keine</button>
          </span>
        </div>
        <div className="type-chips">
          {OBJECT_TYPES.map(type => <button type="button" key={type} className={filters.types.includes(type) ? 'active' : ''} onClick={() => toggleType(type)}>{type}</button>)}
        </div>

        <div className="filter-grid">
          <label>Schwächste Magnitude <strong>{filters.maxMagnitude.toFixed(1)}</strong><input type="range" min="4" max="22" step="0.5" value={filters.maxMagnitude} onChange={e => onFiltersChange({ ...filters, maxMagnitude: Number(e.target.value) })} /><small>Objekte ohne Magnitudenangabe bleiben enthalten.</small></label>
          <label>Mindesthöhe <strong>{filters.minAltitude}°</strong><input type="range" min="10" max="60" step="5" value={filters.minAltitude} onChange={e => onFiltersChange({ ...filters, minAltitude: Number(e.target.value) })} /></label>
          <label>Mindestsichtbarkeit <strong>{filters.minVisibleHours.toFixed(1)} h</strong><input type="range" min="0" max="8" step="0.5" value={filters.minVisibleHours} onChange={e => onFiltersChange({ ...filters, minVisibleHours: Number(e.target.value) })} /></label>
          <label>Mondabstand <strong>{filters.minMoonDistance}°</strong><input type="range" min="0" max="120" step="5" value={filters.minMoonDistance} onChange={e => onFiltersChange({ ...filters, minMoonDistance: Number(e.target.value) })} /></label>
          <label>Min. Objektgröße <strong>{formatSize(filters.minSizeArcMin)}</strong><input type="range" min="0" max="180" step="5" value={filters.minSizeArcMin} onChange={e => onFiltersChange({ ...filters, minSizeArcMin: Number(e.target.value) })} /><small>Bei mehr als 0 werden Objekte ohne Größenangabe ausgeblendet.</small></label>
          <label>Max. Objektgröße <strong>{formatSize(filters.maxSizeArcMin)}</strong><input type="range" min="10" max="1200" step="10" value={filters.maxSizeArcMin} onChange={e => onFiltersChange({ ...filters, maxSizeArcMin: Number(e.target.value) })} /></label>
          <label className="check-row"><input type="checkbox" checked={filters.onlyFitsSensor} onChange={e => onFiltersChange({ ...filters, onlyFitsSensor: e.target.checked })} /> Nur Objekte mit bekannter Größe, die in das gewählte Bildfeld passen</label>
        </div>
      </div>}

      <div className="catalog-result-note" role="status">
        <span><strong>{stats.catalogMatches.toLocaleString('de-DE')}</strong> Katalogtreffer nach Grundfiltern</span>
        <span><strong>{stats.detailedCalculated.toLocaleString('de-DE')}</strong> aussichtsreichste Kandidaten detailliert berechnet</span>
        {stats.limited && <span>Die Liste zeigt höchstens 300 Resultate. Suche oder Katalogfilter grenzen gezielt ein.</span>}
      </div>

      <div className="object-list">
        {objects.map(item => {
          const open = expanded === item.object.id;
          const aliases = item.object.aliases.filter(alias => alias !== item.object.name).slice(0, 5);
          const rangeStart = (night.sunset ?? new Date(night.darknessStart.getTime() - 2 * 3600_000)).getTime();
          const rangeEnd = (night.sunrise ?? new Date(night.darknessEnd.getTime() + 2 * 3600_000)).getTime();
          const storedTime = selectedTimes[item.object.id];
          const selectedTimeMs = storedTime != null && storedTime >= rangeStart && storedTime <= rangeEnd ? storedTime : item.bestTime.getTime();
          const selectedTime = new Date(selectedTimeMs);
          const setSelectedTime = (time: Date) => setSelectedTimes(current => ({ ...current, [item.object.id]: time.getTime() }));
          return <article className={`object-card ${open ? 'open' : ''}`} key={item.object.id}>
            <button type="button" className="object-card-main" onClick={() => setExpanded(open ? null : item.object.id)}>
              <div className={`object-score ${scoreClass(item.score)}`}><strong>{Math.round(item.score)}</strong><span>/100</span></div>
              <div className="object-title">
                <strong>{item.object.name}</strong>
                <span>{aliases.join(' · ') || item.object.id} · {item.object.type}</span>
                <small>{item.object.catalogs.map(catalog => CATALOG_LABELS[catalog]).join(' · ')}{item.object.constellation !== '–' ? ` · ${item.object.constellation}` : ''}</small>
              </div>
              <div className="object-primary-metrics">
                <span><small>max.</small>{Math.round(item.maxAltitude)}°</span>
                <span><small>sichtbar</small>{item.visibleHours.toFixed(1).replace('.', ',')} h</span>
                <span><small>Meridian</small>{formatTime(item.transitTime, timezone)}</span>
                <span><small>Framing</small>{item.fovFit}</span>
              </div>
              <span className="chevron">{open ? '⌃' : '⌄'}</span>
            </button>
            {open && <div className="object-details">
              <div className="detail-grid">
                <div><span>Größe</span><strong>{item.object.majorArcMin > 0 ? `${formatSize(item.object.majorArcMin)} × ${formatSize(item.object.minorArcMin)}` : 'nicht katalogisiert'}</strong></div>
                <div><span>Magnitude</span><strong>{item.object.magnitude ?? '–'}</strong></div>
                <div><span>Höhe Start</span><strong>{Math.round(item.altitudeAtStart)}°</strong></div>
                <div><span>Höhe Ende</span><strong>{Math.round(item.altitudeAtEnd)}°</strong></div>
                <div><span>Beste Zeit</span><strong>{formatTime(item.bestTime, timezone)}</strong></div>
                <div><span>Luftmasse</span><strong>{item.airmassAtBest?.toFixed(2) ?? '–'}</strong></div>
                <div><span>Mondabstand</span><strong>{Math.round(item.moonSeparationDeg)}°</strong></div>
                <div><span>Mondhöhe</span><strong>{Math.round(item.moonAltitudeAtBest)}°</strong></div>
                <div><span>Bildfeldnutzung</span><strong>{item.fovFit === 'unbekannt' ? '–' : `${Math.round(item.fovUsagePercent)} %`}</strong></div>
                <div><span>Filter</span><strong>{item.object.recommendedFilters.join(', ')}</strong></div>
              </div>
              <div className="reason-list">{item.reasons.map(reason => <span key={reason}>✓ {reason}</span>)}</div>
              <AltitudeChart object={item.object} night={night} location={location} timezone={timezone} minAltitude={filters.minAltitude} selectedTime={selectedTime} onSelectedTimeChange={setSelectedTime} />
              <SkyViewer object={item.object} telescope={telescope} camera={camera} night={night} location={location} timezone={timezone} selectedTime={selectedTime} onSelectedTimeChange={setSelectedTime} />
            </div>}
          </article>;
        })}
        {objects.length === 0 && <div className="empty-state"><strong>Kein Objekt erfüllt alle Filter.</strong><span>Prüfe Katalog- und Objekttypauswahl oder reduziere Mindesthöhe, Sichtbarkeitsdauer und Mondabstand.</span></div>}
      </div>
    </section>
  );
}
