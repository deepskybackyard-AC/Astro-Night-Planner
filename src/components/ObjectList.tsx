import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type {
  CatalogName,
  CentralSettings,
  DeepSkyObject,
  EquipmentState,
  ListColumnKey,
  LocationProfile,
  NightWindow,
  ObjectFilters,
  ObjectNightData,
  ObjectResultStats,
  ObjectType,
} from '../types';
import type { PlanningWindow } from '../lib/astro';
import { horizontalForObject, makeObserver } from '../lib/astro';
import { CATALOGS, CATALOG_COUNTS, CATALOG_LABELS, OBJECT_TYPES } from '../data/objects';
import { formatTime } from '../lib/time';
import { LIST_COLUMN_LABELS, loadJson, saveJson, STORAGE_KEYS } from '../lib/storage';
import SkyViewer from './SkyViewer';
import AltitudeChart from './AltitudeChart';

type Props = {
  objects: ObjectNightData[];
  stats: ObjectResultStats;
  filters: ObjectFilters;
  onFiltersChange: (filters: ObjectFilters) => void;
  timezone: string;
  equipment: EquipmentState;
  onEquipmentChange: (equipment: EquipmentState) => void;
  search: string;
  onSearchChange: (value: string) => void;
  night: NightWindow;
  location: LocationProfile;
  planningWindow: PlanningWindow;
  settings: CentralSettings;
};

type DetailSections = { altitude: boolean; horizon: boolean; framing: boolean };
const DEFAULT_SECTIONS: DetailSections = { altitude: true, horizon: true, framing: true };

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

function columnWidth(key: ListColumnKey) {
  const widths: Record<ListColumnKey, string> = {
    score: '68px',
    object: 'minmax(230px, 1.55fr)',
    maxAltitude: '92px',
    visibleHours: '104px',
    transit: '94px',
    framing: '88px',
    miniAltitude: '210px',
    bestTime: '92px',
    altStartEnd: '120px',
    moonDistance: '98px',
    moonAltitude: '92px',
    weatherScore: '94px',
    size: '112px',
    magnitude: '88px',
    filters: '150px',
    fovUsage: '105px',
  };
  return widths[key];
}

function MiniAltitudeProfile({ object, location, planningWindow, minAltitude }: { object: DeepSkyObject; location: LocationProfile; planningWindow: PlanningWindow; minAltitude: number }) {
  const geometry = useMemo(() => {
    const observer = makeObserver(location);
    const width = 196;
    const height = 66;
    const left = 5;
    const right = 191;
    const top = 5;
    const bottom = 61;
    const count = 40;
    const duration = Math.max(1, planningWindow.end.getTime() - planningWindow.start.getTime());
    const samples = Array.from({ length: count }, (_, index) => {
      const ratio = index / (count - 1);
      const time = new Date(planningWindow.start.getTime() + duration * ratio);
      const altitude = horizontalForObject(object, time, observer).altitude;
      const x = left + ratio * (right - left);
      const y = top + ((90 - Math.max(0, Math.min(90, altitude))) / 90) * (bottom - top);
      return { x, y, altitude };
    });
    const maximum = samples.reduce((best, sample) => sample.altitude > best.altitude ? sample : best, samples[0]);
    return {
      path: samples.map((sample, index) => `${index ? 'L' : 'M'} ${sample.x.toFixed(1)} ${sample.y.toFixed(1)}`).join(' '),
      thresholdY: top + ((90 - minAltitude) / 90) * (bottom - top),
      maximum,
      start: samples[0],
      end: samples.at(-1)!,
    };
  }, [object, location, planningWindow, minAltitude]);

  return <svg className="mini-altitude" viewBox="0 0 196 66" aria-label="Mini-Höhenprofil von 0 bis 90 Grad">
    <line className="mini-altitude-grid" x1="5" x2="191" y1="5" y2="5" />
    <line className="mini-altitude-grid" x1="5" x2="191" y1="33" y2="33" />
    <line className="mini-altitude-grid" x1="5" x2="191" y1="61" y2="61" />
    <line className="mini-altitude-threshold" x1="5" x2="191" y1={geometry.thresholdY} y2={geometry.thresholdY} />
    <path className="mini-altitude-area" d={`${geometry.path} L 191 61 L 5 61 Z`} />
    <path className="mini-altitude-line" d={geometry.path} />
    <circle className="mini-altitude-edge" cx={geometry.start.x} cy={geometry.start.y} r="2.2" />
    <circle className="mini-altitude-edge" cx={geometry.end.x} cy={geometry.end.y} r="2.2" />
    <circle className="mini-altitude-maximum" cx={geometry.maximum.x} cy={geometry.maximum.y} r="3.4" />
  </svg>;
}

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (page: number) => void }) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, index) => index + 1).filter((page) => page === 1 || page === total || Math.abs(page - current) <= 2);
  return <nav className="pagination" aria-label="Seiten der Objektliste">
    <button type="button" className="secondary" disabled={current <= 1} onClick={() => onChange(current - 1)}>‹ <span>Zurück</span></button>
    <div className="pagination-pages">
      {pages.map((page, index) => <span key={page} className="pagination-item-wrap">
        {index > 0 && page - pages[index - 1] > 1 && <i>…</i>}
        <button type="button" className={page === current ? 'active' : 'secondary'} onClick={() => onChange(page)}>{page}</button>
      </span>)}
    </div>
    <strong>Seite {current} von {total}</strong>
    <button type="button" className="secondary" disabled={current >= total} onClick={() => onChange(current + 1)}><span>Weiter</span> ›</button>
  </nav>;
}

export default function ObjectList({ objects, stats, filters, onFiltersChange, timezone, equipment, onEquipmentChange, search, onSearchChange, night, location, planningWindow, settings }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<Record<string, number>>({});
  const [sections, setSections] = useState<DetailSections>(() => ({ ...DEFAULT_SECTIONS, ...loadJson<Partial<DetailSections>>(STORAGE_KEYS.detailSections, {}) }));
  const [page, setPage] = useState(() => Math.max(1, loadJson(STORAGE_KEYS.objectPage, 1)));
  const didMountFilters = useRef(false);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => saveJson(STORAGE_KEYS.detailSections, sections), [sections]);
  useEffect(() => saveJson(STORAGE_KEYS.objectPage, page), [page]);
  const filterSignature = JSON.stringify({ filters, search, pageSize: settings.listDisplay.pageSize });
  useEffect(() => {
    if (!didMountFilters.current) {
      didMountFilters.current = true;
      return;
    }
    setPage(1);
    setExpanded(null);
  }, [filterSignature]);

  const pageSize = settings.listDisplay.pageSize;
  const totalPages = Math.max(1, Math.ceil(objects.length / pageSize));
  useEffect(() => setPage((current) => Math.min(Math.max(1, current), totalPages)), [totalPages]);
  const visibleObjects = objects.slice((page - 1) * pageSize, page * pageSize);
  const visibleColumns = settings.listDisplay.columns.filter((column) => column.visible);
  const gridTemplate = `${visibleColumns.map((column) => columnWidth(column.key)).join(' ')} 30px`;
  const listStyle = { '--object-list-columns': gridTemplate } as CSSProperties;

  function changePage(next: number) {
    setPage(Math.min(totalPages, Math.max(1, next)));
    setExpanded(null);
    document.querySelector('.object-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function toggleType(type: ObjectType) {
    const types = filters.types.includes(type) ? filters.types.filter((item) => item !== type) : [...filters.types, type];
    onFiltersChange({ ...filters, types });
  }

  function toggleCatalog(catalog: CatalogName) {
    const catalogs = filters.catalogs.includes(catalog) ? filters.catalogs.filter((item) => item !== catalog) : [...filters.catalogs, catalog];
    onFiltersChange({ ...filters, catalogs });
  }

  function toggleSection(section: keyof DetailSections) {
    setSections((current) => ({ ...current, [section]: !current[section] }));
  }

  function renderColumn(key: ListColumnKey, item: ObjectNightData): ReactNode {
    const aliases = item.object.aliases.filter((alias) => alias !== item.object.name).slice(0, 5);
    switch (key) {
      case 'score': return <div className={`object-score ${scoreClass(item.score)}`}><strong>{Math.round(item.score)}</strong><span>/100</span></div>;
      case 'object': return <div className="object-title"><strong>{item.object.name}</strong><span>{aliases.join(' · ') || item.object.id} · {item.object.type}</span><small>{item.object.catalogs.map((catalog) => CATALOG_LABELS[catalog]).join(' · ')}{item.object.constellation !== '–' ? ` · ${item.object.constellation}` : ''}</small></div>;
      case 'maxAltitude': return <span className="list-metric"><small>max.</small><strong>{Math.round(item.maxAltitude)}°</strong></span>;
      case 'visibleHours': return <span className="list-metric"><small>sichtbar</small><strong>{item.visibleHours.toFixed(1).replace('.', ',')} h</strong></span>;
      case 'transit': return <span className="list-metric"><small>Meridian</small><strong>{formatTime(item.transitTime, timezone)}</strong></span>;
      case 'framing': return <span className="list-metric"><small>Framing</small><strong>{item.fovFit}</strong></span>;
      case 'miniAltitude': return <MiniAltitudeProfile object={item.object} location={location} planningWindow={planningWindow} minAltitude={filters.minAltitude} />;
      case 'bestTime': return <span className="list-metric"><small>beste Zeit</small><strong>{formatTime(item.bestTime, timezone)}</strong></span>;
      case 'altStartEnd': return <span className="list-metric"><small>Start / Ende</small><strong>{Math.round(item.altitudeAtStart)}° / {Math.round(item.altitudeAtEnd)}°</strong></span>;
      case 'moonDistance': return <span className="list-metric"><small>Mondabstand</small><strong>{Math.round(item.moonSeparationDeg)}°</strong></span>;
      case 'moonAltitude': return <span className="list-metric"><small>Mondhöhe</small><strong>{Math.round(item.moonAltitudeAtBest)}°</strong></span>;
      case 'weatherScore': return <span className={`list-metric ${scoreClass(item.weatherScore)}`}><small>Wetter</small><strong>{Math.round(item.weatherScore)}</strong></span>;
      case 'size': return <span className="list-metric"><small>Größe</small><strong>{formatSize(item.object.majorArcMin)} × {formatSize(item.object.minorArcMin)}</strong></span>;
      case 'magnitude': return <span className="list-metric"><small>Magnitude / Fläche</small><strong>{item.object.magnitude ?? '–'}</strong><small>{item.object.surfaceBrightness != null ? `${item.object.surfaceBrightness.toFixed(1).replace('.', ',')} mag/arcsec²` : 'Fläche –'}</small></span>;
      case 'filters': return <span className="list-metric"><small>Filter</small><strong>{item.object.recommendedFilters.join(', ')}</strong></span>;
      case 'fovUsage': return <span className="list-metric"><small>Bildfeld</small><strong>{item.fovFit === 'unbekannt' ? '–' : `${Math.round(item.fovUsagePercent)} %`}</strong></span>;
    }
  }

  return <section className="panel object-panel" style={listStyle}>
    <div className="section-heading object-heading">
      <div><span className="eyebrow">Rangliste aus {stats.totalCatalogObjects.toLocaleString('de-DE')} Objekten</span><h2>Geeignete Objekte</h2></div>
      <span className="result-count" title="Gefilterte Ergebnisse">{objects.length}</span>
    </div>

    <div className="planning-window-control">
      <label>Bezugszeitraum für Höhe, Sichtbarkeit und Objektbewertung
        <select value={filters.planningWindow} onChange={(event) => onFiltersChange({ ...filters, planningWindow: event.target.value as ObjectFilters['planningWindow'] })}>
          <option value="sunset">Sonnenuntergang bis Sonnenaufgang</option>
          <option value="nautical">Nautischer Zeitraum: Sonne unter −6° (Standard)</option>
          <option value="astronomicalTwilight">Astronomischer Zeitraum: Sonne unter −12°</option>
          <option value="astronomicalNight">Astronomische Nacht: Sonne unter −18°</option>
        </select>
      </label>
      <div><strong>{formatTime(planningWindow.start, timezone)}–{formatTime(planningWindow.end, timezone)}</strong><span>{planningWindow.label}</span></div>
    </div>

    <div className="object-toolbar">
      <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Gesamtkatalog filtern: M 31, NGC 7000, Sh2-216 …" />
      <button type="button" className="secondary" onClick={() => setShowFilters((value) => !value)}>Filter {showFilters ? 'schließen' : 'öffnen'}</button>
    </div>

    {showFilters && <div className="filters">
      <div className="filter-section-heading"><strong>Kataloge</strong><span className="filter-actions"><button type="button" onClick={() => onFiltersChange({ ...filters, catalogs: CATALOGS })}>alle</button><button type="button" onClick={() => onFiltersChange({ ...filters, catalogs: [] })}>keine</button></span></div>
      <div className="type-chips catalog-chips">{CATALOGS.map((catalog) => <button type="button" key={catalog} className={filters.catalogs.includes(catalog) ? 'active' : ''} onClick={() => toggleCatalog(catalog)}>{CATALOG_LABELS[catalog]} <small>{CATALOG_COUNTS[catalog].toLocaleString('de-DE')}</small></button>)}</div>
      <div className="filter-section-heading type-heading"><strong>Objekttypen</strong><span className="filter-actions"><button type="button" onClick={() => onFiltersChange({ ...filters, types: OBJECT_TYPES })}>alle</button><button type="button" onClick={() => onFiltersChange({ ...filters, types: [] })}>keine</button></span></div>
      <div className="type-chips">{OBJECT_TYPES.map((type) => <button type="button" key={type} className={filters.types.includes(type) ? 'active' : ''} onClick={() => toggleType(type)}>{type}</button>)}</div>
      <div className="filter-grid">
        <label>Schwächste Magnitude <strong>{filters.maxMagnitude.toFixed(1)}</strong><input type="range" min="4" max="22" step="0.5" value={filters.maxMagnitude} onChange={(event) => onFiltersChange({ ...filters, maxMagnitude: Number(event.target.value) })} /><small>Objekte ohne Magnitudenangabe bleiben enthalten.</small></label>
        <label>Mindesthöhe <strong>{filters.minAltitude}°</strong><input type="range" min="10" max="60" step="5" value={filters.minAltitude} onChange={(event) => onFiltersChange({ ...filters, minAltitude: Number(event.target.value) })} /></label>
        <label>Mindestsichtbarkeit <strong>{filters.minVisibleHours.toFixed(1)} h</strong><input type="range" min="0" max="12" step="0.5" value={filters.minVisibleHours} onChange={(event) => onFiltersChange({ ...filters, minVisibleHours: Number(event.target.value) })} /><small>Bezieht sich auf Planungszeitraum und persönlichen Horizont.</small></label>
        <label>Mondabstand <strong>{filters.minMoonDistance}°</strong><input type="range" min="0" max="120" step="5" value={filters.minMoonDistance} onChange={(event) => onFiltersChange({ ...filters, minMoonDistance: Number(event.target.value) })} /></label>
        <label>Min. Objektgröße <strong>{formatSize(filters.minSizeArcMin)}</strong><input type="range" min="0" max="180" step="5" value={filters.minSizeArcMin} onChange={(event) => onFiltersChange({ ...filters, minSizeArcMin: Number(event.target.value) })} /><small>Bei mehr als 0 werden Objekte ohne Größenangabe ausgeblendet.</small></label>
        <label>Max. Objektgröße <strong>{formatSize(filters.maxSizeArcMin)}</strong><input type="range" min="10" max="1200" step="10" value={filters.maxSizeArcMin} onChange={(event) => onFiltersChange({ ...filters, maxSizeArcMin: Number(event.target.value) })} /></label>
        <label className="check-row"><input type="checkbox" checked={filters.onlyFitsSensor} onChange={(event) => onFiltersChange({ ...filters, onlyFitsSensor: event.target.checked })} /> Nur Objekte mit bekannter Größe, die in das gewählte Bildfeld passen</label>
      </div>
    </div>}

    <div className="catalog-result-note" role="status">
      <span><strong>{stats.catalogMatches.toLocaleString('de-DE')}</strong> Katalogtreffer nach Grundfiltern</span>
      <span><strong>{stats.detailedCalculated.toLocaleString('de-DE')}</strong> aussichtsreichste Kandidaten detailliert berechnet</span>
      <span><strong>{objects.length.toLocaleString('de-DE')}</strong> erfüllen alle Filter</span>
      {stats.limited && <span>Bei sehr großen Treffermengen werden zunächst die aussichtsreichsten Kandidaten detailliert berechnet.</span>}
    </div>

    <div className="page-size-inline">Anzeige: <strong>{pageSize}</strong> Objekte pro Seite · konfigurierbar unter Einstellungen → Zentrale Einstellungen → Anzeige</div>
    <Pagination current={page} total={totalPages} onChange={changePage} />

    <div className="object-table-scroll">
      <div className="object-list-header">
        {visibleColumns.map((column) => <span key={column.key}>{LIST_COLUMN_LABELS[column.key]}</span>)}<span />
      </div>
      <div className="object-list">
        {visibleObjects.map((item) => {
          const open = expanded === item.object.id;
          const rangeStart = (night.sunset ?? new Date(night.darknessStart.getTime() - 2 * 3600_000)).getTime();
          const rangeEnd = (night.sunrise ?? new Date(night.darknessEnd.getTime() + 2 * 3600_000)).getTime();
          const storedTime = selectedTimes[item.object.id];
          const selectedTimeMs = storedTime != null && storedTime >= rangeStart && storedTime <= rangeEnd ? storedTime : item.bestTime.getTime();
          const selectedTime = new Date(selectedTimeMs);
          const setSelectedTime = (time: Date) => setSelectedTimes((current) => ({ ...current, [item.object.id]: time.getTime() }));
          return <article ref={(element) => { cardRefs.current[item.object.id] = element; }} data-scroll-anchor={`object-${item.object.id}`} className={`object-card ${open ? 'open' : ''}`} key={item.object.id}>
            <button type="button" className="object-card-main" onClick={() => setExpanded(open ? null : item.object.id)}>
              {visibleColumns.map((column) => <div className={`object-list-cell column-${column.key}`} key={column.key}>{renderColumn(column.key, item)}</div>)}
              <span className="chevron">{open ? '⌃' : '⌄'}</span>
            </button>
            {open && <div className="object-details">
              <div className="detail-grid">
                <div><span>Größe</span><strong>{item.object.majorArcMin > 0 ? `${formatSize(item.object.majorArcMin)} × ${formatSize(item.object.minorArcMin)}` : 'nicht katalogisiert'}</strong></div>
                <div><span>Magnitude</span><strong>{item.object.magnitude ?? '–'}</strong></div>
                <div><span>Höhe {formatTime(planningWindow.start, timezone)}</span><strong>{Math.round(item.altitudeAtStart)}°</strong></div>
                <div><span>Höhe {formatTime(planningWindow.end, timezone)}</span><strong>{Math.round(item.altitudeAtEnd)}°</strong></div>
                <div><span>Beste Zeit</span><strong>{formatTime(item.bestTime, timezone)}</strong></div>
                <div><span>Luftmasse</span><strong>{item.airmassAtBest?.toFixed(2) ?? '–'}</strong></div>
                <div><span>Mondabstand</span><strong>{Math.round(item.moonSeparationDeg)}°</strong></div>
                <div><span>Mondhöhe</span><strong>{Math.round(item.moonAltitudeAtBest)}°</strong></div>
                <div><span>Bildfeldnutzung</span><strong>{item.fovFit === 'unbekannt' ? '–' : `${Math.round(item.fovUsagePercent)} %`}</strong></div>
                <div><span>Filter</span><strong>{item.object.recommendedFilters.join(', ')}</strong></div>
              </div>
              <div className="reason-list">{item.reasons.map((reason) => <span key={reason}>✓ {reason}</span>)}</div>
              <AltitudeChart object={item.object} night={night} planningWindow={planningWindow} location={location} timezone={timezone} minAltitude={filters.minAltitude} selectedTime={selectedTime} onSelectedTimeChange={setSelectedTime} expanded={sections.altitude} onToggle={() => toggleSection('altitude')} />
              <SkyViewer object={item.object} equipment={equipment} onEquipmentChange={onEquipmentChange} night={night} location={location} timezone={timezone} selectedTime={selectedTime} onSelectedTimeChange={setSelectedTime} horizonExpanded={sections.horizon} framingExpanded={sections.framing} onToggleHorizon={() => toggleSection('horizon')} onToggleFraming={() => toggleSection('framing')} />
            </div>}
          </article>;
        })}
        {objects.length === 0 && <div className="empty-state"><strong>Kein Objekt erfüllt alle Filter.</strong><span>Prüfe Bezugszeitraum, Katalog- und Objekttypauswahl oder reduziere Mindesthöhe, Sichtbarkeitsdauer und Mondabstand.</span></div>}
      </div>
    </div>
    <Pagination current={page} total={totalPages} onChange={changePage} />
  </section>;
}
