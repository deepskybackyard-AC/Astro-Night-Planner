import {
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  CatalogName,
  CentralSettings,
  DisplayProfileKey,
  EquipmentState,
  LocationProfile,
  ObjectFilters,
  ObjectResultStats,
  ObjectType,
  WeatherModelResult,
  WindProfileKey,
} from './types';
import { CATALOGS, DEFAULT_OBJECT_TYPES, OBJECTS, OBJECT_TYPES } from './data/objects';
import { calculateFov, calculateNightWindow, calculateObjectNightData, planningWindowForNight } from './lib/astro';
import { addDaysToDateKey, dateKeyInZone, formatDateLabel, formatTime } from './lib/time';
import {
  defaultCentralSettings,
  defaultEquipment,
  defaultLocation,
  loadJson,
  normalizeCentralSettings,
  saveJson,
  STORAGE_KEYS,
  withEffectiveProfiles,
} from './lib/storage';
import { buildConsensus, fetchWeatherModels, summarizeNight } from './services/weather';
import LocationPicker from './components/LocationPicker';
import WeatherPanel from './components/WeatherPanel';
import ObjectList from './components/ObjectList';
import SettingsPanel from './components/SettingsPanel';

function defaultFilters(planningWindow: ObjectFilters['planningWindow']): ObjectFilters {
  return {
    planningWindow,
    catalogs: CATALOGS,
    types: DEFAULT_OBJECT_TYPES,
    maxMagnitude: 16,
    minAltitude: 25,
    minVisibleHours: 1.5,
    minMoonDistance: 25,
    minSizeArcMin: 0,
    maxSizeArcMin: 1200,
    onlyFitsSensor: false,
  };
}

function normalizeFilters(saved: Partial<ObjectFilters>, planningDefault: ObjectFilters['planningWindow']): ObjectFilters {
  const defaults = defaultFilters(planningDefault);
  const catalogs = Array.isArray(saved.catalogs)
    ? saved.catalogs.filter((item): item is CatalogName => CATALOGS.includes(item as CatalogName))
    : CATALOGS;
  const types = Array.isArray(saved.types)
    ? saved.types.filter((item): item is ObjectType => OBJECT_TYPES.includes(item as ObjectType))
    : DEFAULT_OBJECT_TYPES;
  const planningWindow = ['sunset', 'nautical', 'astronomicalTwilight', 'astronomicalNight'].includes(String(saved.planningWindow))
    ? (saved.planningWindow as ObjectFilters['planningWindow'])
    : planningDefault;
  return {
    ...defaults,
    ...saved,
    planningWindow,
    catalogs: catalogs.length ? catalogs : CATALOGS,
    types: types.length ? types : DEFAULT_OBJECT_TYPES,
  };
}

function qualityClass(value: number) {
  if (value >= 70) return 'good';
  if (value >= 45) return 'medium';
  return 'bad';
}

function fastAltitude(raHours: number, decDeg: number, time: Date, latitude: number, longitude: number): number {
  const julianDate = time.getTime() / 86_400_000 + 2_440_587.5;
  const daysSinceJ2000 = julianDate - 2_451_545.0;
  const gmstHours = 18.697374558 + 24.06570982441908 * daysSinceJ2000;
  const lstHours = (((gmstHours + longitude / 15) % 24) + 24) % 24;
  const hourAngle = ((lstHours - raHours) * 15 * Math.PI) / 180;
  const latitudeRad = (latitude * Math.PI) / 180;
  const decRad = (decDeg * Math.PI) / 180;
  const sinAltitude = Math.sin(latitudeRad) * Math.sin(decRad) + Math.cos(latitudeRad) * Math.cos(decRad) * Math.cos(hourAngle);
  return (Math.asin(Math.max(-1, Math.min(1, sinAltitude))) * 180) / Math.PI;
}

type MainTab = 'plan' | 'settings';

export default function App() {
  const [centralSettings, setCentralSettings] = useState<CentralSettings>(() =>
    normalizeCentralSettings(loadJson<Partial<CentralSettings>>(STORAGE_KEYS.centralSettings, defaultCentralSettings)),
  );
  const [locations, setLocations] = useState<LocationProfile[]>(() =>
    loadJson(STORAGE_KEYS.locations, [defaultLocation]).map((item) => ({ ...item, horizonProfile: item.horizonProfile ?? [], obstacles: item.obstacles ?? [] })),
  );
  const [selectedLocationId, setSelectedLocationId] = useState(() => {
    const savedSelection = loadJson(STORAGE_KEYS.selectedLocation, centralSettings.defaultLocationId || locations[0]?.id || defaultLocation.id);
    return centralSettings.gpsBehavior === 'last'
      ? savedSelection
      : (centralSettings.defaultLocationId || locations[0]?.id || defaultLocation.id);
  });
  const [equipment, setEquipment] = useState<EquipmentState>(() => loadJson(STORAGE_KEYS.equipment, defaultEquipment));
  const [filters, setFilters] = useState<ObjectFilters>(() =>
    normalizeFilters(loadJson<Partial<ObjectFilters>>(STORAGE_KEYS.filters, {}), centralSettings.defaultPlanningWindow),
  );
  const [selectedDate, setSelectedDate] = useState('');
  const [models, setModels] = useState<WeatherModelResult[]>([]);
  const [weatherErrors, setWeatherErrors] = useState<string[]>([]);
  const [weatherError, setWeatherError] = useState('');
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [tab, setTab] = useState<MainTab>('plan');
  const scrollPositions = useRef<Record<MainTab, number>>({ plan: 0, settings: 0 });
  const scrollAnchors = useRef<Record<MainTab, { key: string; offset: number } | null>>({ plan: null, settings: null });
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [planningWindProfileOverride, setPlanningWindProfileOverride] = useState<WindProfileKey | null>(null);
  const [planningDisplayProfileOverride, setPlanningDisplayProfileOverride] = useState<DisplayProfileKey | null>(null);

  const effectiveWindProfile = planningWindProfileOverride ?? centralSettings.activeWindProfile;
  const effectiveDisplayProfile = planningDisplayProfileOverride ?? centralSettings.listDisplay.activeProfile;
  const effectiveSettings = useMemo(
    () => withEffectiveProfiles(centralSettings, effectiveWindProfile, effectiveDisplayProfile),
    [centralSettings, effectiveWindProfile, effectiveDisplayProfile],
  );

  const location = locations.find((item) => item.id === selectedLocationId) ?? locations[0] ?? defaultLocation;
  const todayKey = dateKeyInZone(new Date(), location.timezone);
  const dateKeys = useMemo(() => Array.from({ length: 8 }, (_, index) => addDaysToDateKey(todayKey, index)), [todayKey]);
  const activeDate = selectedDate && dateKeys.includes(selectedDate) ? selectedDate : dateKeys[0];
  const night = useMemo(() => calculateNightWindow(location, activeDate), [location, activeDate]);
  const planningWindow = useMemo(() => planningWindowForNight(night, filters.planningWindow), [night, filters.planningWindow]);

  const selectedTelescope = equipment.telescopes.find((item) => item.id === equipment.selectedTelescopeId);
  const selectedCamera = equipment.cameras.find((item) => item.id === equipment.selectedCameraId);
  const fov = useMemo(() => calculateFov(selectedTelescope, selectedCamera), [selectedTelescope, selectedCamera]);

  useEffect(() => saveJson(STORAGE_KEYS.locations, locations), [locations]);
  useEffect(() => saveJson(STORAGE_KEYS.selectedLocation, selectedLocationId), [selectedLocationId]);
  useEffect(() => saveJson(STORAGE_KEYS.equipment, equipment), [equipment]);
  useEffect(() => saveJson(STORAGE_KEYS.filters, filters), [filters]);
  useEffect(() => saveJson(STORAGE_KEYS.centralSettings, centralSettings), [centralSettings]);

  useEffect(() => {
    if (!locations.some((item) => item.id === selectedLocationId)) setSelectedLocationId(locations[0]?.id ?? defaultLocation.id);
    if (!locations.some((item) => item.id === centralSettings.defaultLocationId)) {
      setCentralSettings((current) => ({ ...current, defaultLocationId: locations[0]?.id ?? defaultLocation.id }));
    }
  }, [locations, selectedLocationId, centralSettings.defaultLocationId]);

  useEffect(() => {
    let cancelled = false;
    setWeatherLoading(true);
    setWeatherError('');
    setModels([]);
    fetchWeatherModels(location)
      .then((result) => {
        if (cancelled) return;
        setModels(result.models);
        setWeatherErrors(result.errors);
      })
      .catch((error) => {
        if (!cancelled) setWeatherError(error instanceof Error ? error.message : 'Wetterdaten konnten nicht geladen werden.');
      })
      .finally(() => {
        if (!cancelled) setWeatherLoading(false);
      });
    return () => { cancelled = true; };
  }, [location.id, location.latitude, location.longitude, location.elevation]);

  const consensus = useMemo(() => buildConsensus(models, effectiveSettings), [models, effectiveSettings]);
  const weatherSummary = useMemo(
    () => consensus.length ? summarizeNight(consensus, night, planningWindow.start, planningWindow.end) : undefined,
    [consensus, night, planningWindow],
  );

  const objectResult = useMemo(() => {
    const needle = deferredSearch.trim().toLocaleLowerCase('de');
    const midpoint = new Date((planningWindow.start.getTime() + planningWindow.end.getTime()) / 2);
    const catalogMatches = OBJECTS.filter((object) => object.catalogs.some((catalog) => filters.catalogs.includes(catalog)))
      .filter((object) => filters.types.includes(object.type))
      .filter((object) => object.magnitude == null || object.magnitude <= filters.maxMagnitude)
      .filter((object) => object.majorArcMin <= 0 ? filters.minSizeArcMin <= 0 : object.majorArcMin >= filters.minSizeArcMin && object.majorArcMin <= filters.maxSizeArcMin)
      .filter((object) => !needle || [object.id, object.name, object.constellation, ...object.aliases].join(' ').toLocaleLowerCase('de').includes(needle))
      .filter((object) => 90 - Math.abs(location.latitude - object.decDeg) >= filters.minAltitude - 2);

    const candidateLimit = needle ? 1600 : 900;
    const candidates = catalogMatches.map((object) => {
      const midpointAltitude = fastAltitude(object.raHours, object.decDeg, midpoint, location.latitude, location.longitude);
      const theoreticalMax = 90 - Math.abs(location.latitude - object.decDeg);
      const size = object.majorArcMin;
      let framingBonus = 0;
      if (fov && size > 0) {
        const usage = Math.max(object.majorArcMin / 60 / fov.widthDeg, object.minorArcMin / 60 / fov.heightDeg);
        framingBonus = usage <= 0.85 ? 12 : usage <= 1.05 ? 6 : -8;
      }
      const brightnessBonus = object.magnitude == null ? 0 : Math.max(-12, (12 - object.magnitude) * 1.2);
      return { object, quickScore: theoreticalMax * 0.55 + midpointAltitude * 0.8 + framingBonus + brightnessBonus + (needle ? 100 : 0) };
    }).sort((a, b) => b.quickScore - a.quickScore).slice(0, candidateLimit).map((item) => item.object);

    const accepted = candidates
      .map((object) => calculateObjectNightData(object, night, location, filters.minAltitude, filters.planningWindow, selectedTelescope, selectedCamera, weatherSummary, effectiveSettings))
      .filter((item) => item.maxAltitude >= filters.minAltitude)
      .filter((item) => item.visibleHours >= filters.minVisibleHours)
      .filter((item) => item.moonSeparationDeg >= filters.minMoonDistance || item.moonAltitudeAtBest <= 0)
      .filter((item) => !filters.onlyFitsSensor || item.fovFit === 'gut' || item.fovFit === 'knapp')
      .sort((a, b) => b.score - a.score);

    const stats: ObjectResultStats = {
      totalCatalogObjects: OBJECTS.length,
      catalogMatches: catalogMatches.length,
      detailedCalculated: candidates.length,
      shown: accepted.length,
      limited: catalogMatches.length > candidateLimit,
    };
    return { items: accepted, stats };
  }, [filters, deferredSearch, night, location, selectedTelescope, selectedCamera, weatherSummary, effectiveSettings, fov]);

  useLayoutEffect(() => {
    const target = scrollPositions.current[tab] ?? 0;
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: target, left: 0, behavior: 'auto' });
      secondFrame = window.requestAnimationFrame(() => {
        const anchor = scrollAnchors.current[tab];
        if (!anchor) return;
        const element = document.querySelector<HTMLElement>(`[data-scroll-anchor="${CSS.escape(anchor.key)}"]`);
        if (!element) return;
        const correction = element.getBoundingClientRect().top - anchor.offset;
        if (Math.abs(correction) > 1) window.scrollBy({ top: correction, left: 0, behavior: 'auto' });
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [tab]);

  function switchTab(next: MainTab) {
    if (next === tab) return;
    scrollPositions.current[tab] = window.scrollY;
    const candidates = Array.from(document.querySelectorAll<HTMLElement>(`[data-tab-page="${tab}"] [data-scroll-anchor]`));
    const closest = candidates.map((element) => ({ element, distance: Math.abs(element.getBoundingClientRect().top) })).sort((a, b) => a.distance - b.distance)[0]?.element;
    scrollAnchors.current[tab] = closest ? { key: closest.dataset.scrollAnchor ?? '', offset: closest.getBoundingClientRect().top } : null;
    setTab(next);
  }

  function addLocation(item: LocationProfile) {
    const normalized = { ...item, horizonProfile: item.horizonProfile ?? [], obstacles: item.obstacles ?? [] };
    setLocations((current) => {
      const withoutDuplicate = current.filter((entry) => entry.id !== normalized.id && !(Math.abs(entry.latitude - normalized.latitude) < 0.0001 && Math.abs(entry.longitude - normalized.longitude) < 0.0001));
      return [...withoutDuplicate, normalized];
    });
    setSelectedLocationId(normalized.id);
    setSelectedDate('');
  }

  function updateLocation(item: LocationProfile) {
    setLocations((current) => current.map((entry) => entry.id === item.id ? item : entry));
  }

  function deleteLocation(id: string) {
    setLocations((current) => {
      const next = current.filter((item) => item.id !== id);
      const safe = next.length ? next : [defaultLocation];
      setSelectedLocationId(safe[0].id);
      return safe;
    });
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">✦</div>
        <div><span className="eyebrow">Astrofotografie-Planung</span><h1>Astro Night Planner</h1></div>
        <div className="header-setup"><span>{selectedTelescope?.name ?? 'Kein Teleskop'}</span><strong>{fov ? `${fov.widthDeg.toFixed(1)}° × ${fov.heightDeg.toFixed(1)}°` : 'kein Bildfeld'}</strong></div>
      </header>

      <main>
        <div className="tab-page" data-tab-page="plan" hidden={tab !== 'plan'}>
          <div className="top-grid">
            <LocationPicker locations={locations} selectedId={location.id} onSelect={(id) => { setSelectedLocationId(id); setSelectedDate(''); }} onAdd={addLocation} onDelete={deleteLocation} />
            <section className="panel date-panel">
              <div className="section-heading"><div><span className="eyebrow">Planungsnacht</span><h2>Datum</h2></div></div>
              <div className="date-strip">
                {dateKeys.map((dateKey, index) => <button type="button" key={dateKey} className={activeDate === dateKey ? 'active' : ''} onClick={() => setSelectedDate(dateKey)}><small>{index === 0 ? 'Heute' : index === 1 ? 'Morgen' : `+${index}`}</small><strong>{formatDateLabel(dateKey, location.timezone)}</strong></button>)}
              </div>
            </section>
          </div>

          <section className="panel night-panel">
            <div className="section-heading"><div><span className="eyebrow">Sonne und Mond</span><h2>Planungsnacht</h2></div>{weatherSummary && <div className={`night-quality ${qualityClass(weatherSummary.score)}`}><span>Wetternacht</span><strong>{Math.round(weatherSummary.score)}/100</strong></div>}</div>
            <div className="night-grid">
              <div><span>Sonnenuntergang</span><strong>{formatTime(night.sunset, location.timezone)}</strong></div>
              <div><span>Gewählter Zeitraum</span><strong>{formatTime(planningWindow.start, location.timezone)}–{formatTime(planningWindow.end, location.timezone)}</strong><small>{planningWindow.label}</small></div>
              <div><span>Astronomische Dunkelheit</span><strong>{formatTime(night.astronomicalDusk, location.timezone)}–{formatTime(night.astronomicalDawn, location.timezone)}</strong></div>
              <div><span>Sonnenaufgang</span><strong>{formatTime(night.sunrise, location.timezone)}</strong></div>
              <div><span>Mondaufgang</span><strong>{formatTime(night.moonrise, location.timezone)}</strong></div>
              <div><span>Mondkulmination</span><strong>{formatTime(night.moonTransit, location.timezone)} · {Math.round(night.moonMaxAltitude)}°</strong></div>
              <div><span>Monduntergang</span><strong>{formatTime(night.moonset, location.timezone)}</strong></div>
              <div><span>Mondbeleuchtung</span><strong>{Math.round(night.moonIllumination)} %</strong></div>
            </div>
          </section>

          <WeatherPanel summary={weatherSummary} night={night} evaluationWindow={planningWindow} timezone={location.timezone} models={models} errors={weatherErrors} loading={weatherLoading} error={weatherError} location={location} settings={effectiveSettings} />

          <ObjectList
            objects={objectResult.items}
            stats={objectResult.stats}
            filters={filters}
            onFiltersChange={setFilters}
            timezone={location.timezone}
            equipment={equipment}
            onEquipmentChange={setEquipment}
            search={search}
            onSearchChange={setSearch}
            night={night}
            location={location}
            planningWindow={planningWindow}
            settings={effectiveSettings}
            defaultWindProfile={centralSettings.activeWindProfile}
            selectedWindProfile={effectiveWindProfile}
            windProfileIsTemporary={planningWindProfileOverride !== null}
            onWindProfileChange={(profile) => setPlanningWindProfileOverride(profile === centralSettings.activeWindProfile ? null : profile)}
            onMakeWindProfileDefault={() => {
              const profile = effectiveWindProfile;
              const thresholds = centralSettings.windProfiles[profile];
              setCentralSettings({ ...centralSettings, activeWindProfile: profile, windPreset: profile, windThresholds: { ...thresholds } });
              setPlanningWindProfileOverride(null);
            }}
            defaultDisplayProfile={centralSettings.listDisplay.activeProfile}
            selectedDisplayProfile={effectiveDisplayProfile}
            displayProfileIsTemporary={planningDisplayProfileOverride !== null}
            onDisplayProfileChange={(profile) => setPlanningDisplayProfileOverride(profile === centralSettings.listDisplay.activeProfile ? null : profile)}
            onMakeDisplayProfileDefault={() => {
              const profile = effectiveDisplayProfile;
              const display = centralSettings.listDisplay.profiles[profile];
              setCentralSettings({
                ...centralSettings,
                listDisplay: { ...centralSettings.listDisplay, activeProfile: profile, preset: profile, pageSize: display.pageSize, columns: display.columns.map((column) => ({ ...column })) },
              });
              setPlanningDisplayProfileOverride(null);
            }}
          />
        </div>

        <div className="tab-page" data-tab-page="settings" hidden={tab !== 'settings'}>
          <SettingsPanel
            equipment={equipment}
            onEquipmentChange={setEquipment}
            settings={centralSettings}
            onSettingsChange={setCentralSettings}
            locations={locations}
            selectedLocationId={location.id}
            onSelectLocation={(id) => { setSelectedLocationId(id); setSelectedDate(''); }}
            onAddLocation={addLocation}
            onDeleteLocation={deleteLocation}
            onUpdateLocation={updateLocation}
          />
        </div>
      </main>

      <nav className="bottom-nav" aria-label="Hauptnavigation">
        <button type="button" className={tab === 'plan' ? 'active' : ''} onClick={() => switchTab('plan')}><span>☾</span>Planung</button>
        <button type="button" className={tab === 'settings' ? 'active' : ''} onClick={() => switchTab('settings')}><span>⚙</span>Einstellungen</button>
      </nav>
    </div>
  );
}
