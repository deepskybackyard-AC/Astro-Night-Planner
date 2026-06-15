import { useEffect, useMemo, useRef, useState } from "react";
import type {
  CatalogName,
  DeepSkyObject,
  EquipmentState,
  LocationProfile,
  NightWindow,
  ObjectFilters,
  ObjectNightData,
  ObjectResultStats,
  ObjectType,
} from "../types";
import type { PlanningWindow } from "../lib/astro";
import { horizontalForObject, makeObserver } from "../lib/astro";
import {
  CATALOGS,
  CATALOG_COUNTS,
  CATALOG_LABELS,
  OBJECT_TYPES,
} from "../data/objects";
import { formatTime } from "../lib/time";
import { loadJson, saveJson, STORAGE_KEYS } from "../lib/storage";
import SkyViewer from "./SkyViewer";
import AltitudeChart from "./AltitudeChart";

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
};

type DetailSections = {
  altitude: boolean;
  horizon: boolean;
  framing: boolean;
};

const DEFAULT_SECTIONS: DetailSections = {
  altitude: true,
  horizon: true,
  framing: true,
};

function scoreClass(score: number) {
  if (score >= 70) return "good";
  if (score >= 45) return "medium";
  return "bad";
}

function formatSize(value: number) {
  if (value <= 0) return "–";
  if (value >= 60)
    return `${(value / 60).toFixed(value >= 600 ? 0 : 1).replace(".", ",")}°`;
  if (value < 1) return `${Math.round(value * 60)}″`;
  return `${Number(value.toFixed(1)).toLocaleString("de-DE")}′`;
}

function MiniAltitudeSparkline({
  object,
  location,
  planningWindow,
  minAltitude,
}: {
  object: DeepSkyObject;
  location: LocationProfile;
  planningWindow: PlanningWindow;
  minAltitude: number;
}) {
  const { path, thresholdY } = useMemo(() => {
    const observer = makeObserver(location);
    const width = 116;
    const height = 36;
    const padding = 2;
    const count = 20;
    const duration = Math.max(
      1,
      planningWindow.end.getTime() - planningWindow.start.getTime(),
    );
    const points = Array.from({ length: count }, (_, index) => {
      const ratio = index / (count - 1);
      const time = new Date(planningWindow.start.getTime() + duration * ratio);
      const altitude = horizontalForObject(object, time, observer).altitude;
      const x = padding + ratio * (width - 2 * padding);
      const y =
        padding +
        ((90 - Math.max(0, Math.min(90, altitude))) / 90) *
          (height - 2 * padding);
      return [x, y] as const;
    });
    return {
      path: points
        .map(
          ([x, y], index) =>
            `${index ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`,
        )
        .join(" "),
      thresholdY: padding + ((90 - minAltitude) / 90) * (height - 2 * padding),
    };
  }, [object, location, planningWindow, minAltitude]);

  return (
    <svg
      className="mini-altitude"
      viewBox="0 0 116 36"
      aria-label="Kleine Höhenkurve"
    >
      <line
        className="mini-altitude-threshold"
        x1="2"
        x2="114"
        y1={thresholdY}
        y2={thresholdY}
      />
      <path className="mini-altitude-line" d={path} />
    </svg>
  );
}

export default function ObjectList({
  objects,
  stats,
  filters,
  onFiltersChange,
  timezone,
  equipment,
  onEquipmentChange,
  search,
  onSearchChange,
  night,
  location,
  planningWindow,
}: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [selectedTimes, setSelectedTimes] = useState<Record<string, number>>(
    {},
  );
  const [sections, setSections] = useState<DetailSections>(() => ({
    ...DEFAULT_SECTIONS,
    ...loadJson<Partial<DetailSections>>(STORAGE_KEYS.detailSections, {}),
  }));
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => saveJson(STORAGE_KEYS.detailSections, sections), [sections]);

  const telescope = equipment.telescopes.find(
    (item) => item.id === equipment.selectedTelescopeId,
  );
  const camera = equipment.cameras.find(
    (item) => item.id === equipment.selectedCameraId,
  );

  const pickerObjects = useMemo(() => {
    const needle = pickerSearch.trim().toLocaleLowerCase("de");
    if (!needle) return objects;
    return objects.filter((item) =>
      [
        item.object.name,
        item.object.id,
        item.object.constellation,
        ...item.object.aliases,
      ]
        .join(" ")
        .toLocaleLowerCase("de")
        .includes(needle),
    );
  }, [objects, pickerSearch]);

  function toggleType(type: ObjectType) {
    const types = filters.types.includes(type)
      ? filters.types.filter((item) => item !== type)
      : [...filters.types, type];
    onFiltersChange({ ...filters, types });
  }

  function toggleCatalog(catalog: CatalogName) {
    const catalogs = filters.catalogs.includes(catalog)
      ? filters.catalogs.filter((item) => item !== catalog)
      : [...filters.catalogs, catalog];
    onFiltersChange({ ...filters, catalogs });
  }

  function toggleSection(section: keyof DetailSections) {
    setSections((current) => ({ ...current, [section]: !current[section] }));
  }

  function openObject(id: string) {
    setExpanded(id);
    setShowPicker(false);
    window.setTimeout(
      () =>
        cardRefs.current[id]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      60,
    );
  }

  return (
    <section className="panel object-panel">
      <div className="section-heading object-heading">
        <div>
          <span className="eyebrow">
            Rangliste aus {stats.totalCatalogObjects.toLocaleString("de-DE")}{" "}
            Objekten
          </span>
          <h2>Geeignete Objekte</h2>
        </div>
        <span className="result-count" title="Angezeigte Ergebnisse">
          {objects.length}
        </span>
      </div>

      <div className="planning-window-control">
        <label>
          Bezugszeitraum für Höhe, Sichtbarkeit und Objektbewertung
          <select
            value={filters.planningWindow}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                planningWindow: event.target
                  .value as ObjectFilters["planningWindow"],
              })
            }
          >
            <option value="sunset">Sonnenuntergang bis Sonnenaufgang</option>
            <option value="nautical">
              Nautischer Zeitraum: Sonne unter −6° (Standard)
            </option>
            <option value="astronomicalTwilight">
              Astronomischer Zeitraum: Sonne unter −12°
            </option>
            <option value="astronomicalNight">
              Astronomische Nacht: Sonne unter −18°
            </option>
          </select>
        </label>
        <div>
          <strong>
            {formatTime(planningWindow.start, timezone)}–
            {formatTime(planningWindow.end, timezone)}
          </strong>
          <span>{planningWindow.label}</span>
        </div>
      </div>

      <div className="object-toolbar">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Gesamtkatalog filtern: M 31, NGC 7000, Sh2-216 …"
        />
        <button
          type="button"
          className="secondary"
          onClick={() => setShowPicker((value) => !value)}
        >
          Objektliste {showPicker ? "schließen" : "öffnen"}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => setShowFilters((value) => !value)}
        >
          Filter {showFilters ? "schließen" : "öffnen"}
        </button>
      </div>

      {showPicker && (
        <div
          className="object-picker"
          role="dialog"
          aria-label="Gefilterte Objekt-Auswahlliste"
        >
          <div className="object-picker-head">
            <div>
              <strong>Objekt-Auswahlliste</strong>
              <span>
                {pickerObjects.length} Ergebnisse im gewählten Planungszeitraum
              </span>
            </div>
            <input
              value={pickerSearch}
              onChange={(event) => setPickerSearch(event.target.value)}
              placeholder="Innerhalb der Ergebnisliste filtern"
              autoFocus
            />
          </div>
          <div className="object-picker-columns" aria-hidden="true">
            <span>Objekt</span>
            <span>max.</span>
            <span>sichtbar</span>
            <span>Meridian</span>
            <span>Framing</span>
            <span>Höhenverlauf</span>
          </div>
          <div className="object-picker-list">
            {pickerObjects.map((item) => (
              <button
                type="button"
                className="object-picker-row"
                key={item.object.id}
                onClick={() => openObject(item.object.id)}
              >
                <span className="picker-object-name">
                  <strong>{item.object.name}</strong>
                  <small>
                    {item.object.id} · {item.object.type}
                  </small>
                </span>
                <span>
                  <small>max.</small>
                  <strong>{Math.round(item.maxAltitude)}°</strong>
                </span>
                <span>
                  <small>sichtbar</small>
                  <strong>
                    {item.visibleHours.toFixed(1).replace(".", ",")} h
                  </strong>
                </span>
                <span>
                  <small>Meridian</small>
                  <strong>{formatTime(item.transitTime, timezone)}</strong>
                </span>
                <span>
                  <small>Framing</small>
                  <strong>{item.fovFit}</strong>
                </span>
                <MiniAltitudeSparkline
                  object={item.object}
                  location={location}
                  planningWindow={planningWindow}
                  minAltitude={filters.minAltitude}
                />
              </button>
            ))}
            {pickerObjects.length === 0 && (
              <div className="empty-state compact">
                <strong>Kein Treffer in der Auswahlliste.</strong>
              </div>
            )}
          </div>
        </div>
      )}

      {showFilters && (
        <div className="filters">
          <div className="filter-section-heading">
            <strong>Kataloge</strong>
            <span className="filter-actions">
              <button
                type="button"
                onClick={() =>
                  onFiltersChange({ ...filters, catalogs: CATALOGS })
                }
              >
                alle
              </button>
              <button
                type="button"
                onClick={() => onFiltersChange({ ...filters, catalogs: [] })}
              >
                keine
              </button>
            </span>
          </div>
          <div className="type-chips catalog-chips">
            {CATALOGS.map((catalog) => (
              <button
                type="button"
                key={catalog}
                className={filters.catalogs.includes(catalog) ? "active" : ""}
                onClick={() => toggleCatalog(catalog)}
              >
                {CATALOG_LABELS[catalog]}{" "}
                <small>{CATALOG_COUNTS[catalog].toLocaleString("de-DE")}</small>
              </button>
            ))}
          </div>

          <div className="filter-section-heading type-heading">
            <strong>Objekttypen</strong>
            <span className="filter-actions">
              <button
                type="button"
                onClick={() =>
                  onFiltersChange({ ...filters, types: OBJECT_TYPES })
                }
              >
                alle
              </button>
              <button
                type="button"
                onClick={() => onFiltersChange({ ...filters, types: [] })}
              >
                keine
              </button>
            </span>
          </div>
          <div className="type-chips">
            {OBJECT_TYPES.map((type) => (
              <button
                type="button"
                key={type}
                className={filters.types.includes(type) ? "active" : ""}
                onClick={() => toggleType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="filter-grid">
            <label>
              Schwächste Magnitude{" "}
              <strong>{filters.maxMagnitude.toFixed(1)}</strong>
              <input
                type="range"
                min="4"
                max="22"
                step="0.5"
                value={filters.maxMagnitude}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    maxMagnitude: Number(e.target.value),
                  })
                }
              />
              <small>Objekte ohne Magnitudenangabe bleiben enthalten.</small>
            </label>
            <label>
              Mindesthöhe <strong>{filters.minAltitude}°</strong>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={filters.minAltitude}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    minAltitude: Number(e.target.value),
                  })
                }
              />
            </label>
            <label>
              Mindestsichtbarkeit{" "}
              <strong>{filters.minVisibleHours.toFixed(1)} h</strong>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={filters.minVisibleHours}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    minVisibleHours: Number(e.target.value),
                  })
                }
              />
              <small>
                Bezieht sich auf den oben gewählten Planungszeitraum.
              </small>
            </label>
            <label>
              Mondabstand <strong>{filters.minMoonDistance}°</strong>
              <input
                type="range"
                min="0"
                max="120"
                step="5"
                value={filters.minMoonDistance}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    minMoonDistance: Number(e.target.value),
                  })
                }
              />
            </label>
            <label>
              Min. Objektgröße{" "}
              <strong>{formatSize(filters.minSizeArcMin)}</strong>
              <input
                type="range"
                min="0"
                max="180"
                step="5"
                value={filters.minSizeArcMin}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    minSizeArcMin: Number(e.target.value),
                  })
                }
              />
              <small>
                Bei mehr als 0 werden Objekte ohne Größenangabe ausgeblendet.
              </small>
            </label>
            <label>
              Max. Objektgröße{" "}
              <strong>{formatSize(filters.maxSizeArcMin)}</strong>
              <input
                type="range"
                min="10"
                max="1200"
                step="10"
                value={filters.maxSizeArcMin}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    maxSizeArcMin: Number(e.target.value),
                  })
                }
              />
            </label>
            <label className="check-row">
              <input
                type="checkbox"
                checked={filters.onlyFitsSensor}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    onlyFitsSensor: e.target.checked,
                  })
                }
              />{" "}
              Nur Objekte mit bekannter Größe, die in das gewählte Bildfeld
              passen
            </label>
          </div>
        </div>
      )}

      <div className="catalog-result-note" role="status">
        <span>
          <strong>{stats.catalogMatches.toLocaleString("de-DE")}</strong>{" "}
          Katalogtreffer nach Grundfiltern
        </span>
        <span>
          <strong>{stats.detailedCalculated.toLocaleString("de-DE")}</strong>{" "}
          aussichtsreichste Kandidaten detailliert berechnet
        </span>
        {stats.limited && (
          <span>
            Die Liste zeigt höchstens 300 Resultate. Suche oder Katalogfilter
            grenzen gezielt ein.
          </span>
        )}
      </div>

      <div className="object-list">
        {objects.map((item) => {
          const open = expanded === item.object.id;
          const aliases = item.object.aliases
            .filter((alias) => alias !== item.object.name)
            .slice(0, 5);
          const rangeStart = (
            night.sunset ??
            new Date(night.darknessStart.getTime() - 2 * 3600_000)
          ).getTime();
          const rangeEnd = (
            night.sunrise ??
            new Date(night.darknessEnd.getTime() + 2 * 3600_000)
          ).getTime();
          const storedTime = selectedTimes[item.object.id];
          const selectedTimeMs =
            storedTime != null &&
            storedTime >= rangeStart &&
            storedTime <= rangeEnd
              ? storedTime
              : item.bestTime.getTime();
          const selectedTime = new Date(selectedTimeMs);
          const setSelectedTime = (time: Date) =>
            setSelectedTimes((current) => ({
              ...current,
              [item.object.id]: time.getTime(),
            }));
          return (
            <article
              ref={(element) => {
                cardRefs.current[item.object.id] = element;
              }}
              data-scroll-anchor={`object-${item.object.id}`}
              className={`object-card ${open ? "open" : ""}`}
              key={item.object.id}
            >
              <button
                type="button"
                className="object-card-main"
                onClick={() => setExpanded(open ? null : item.object.id)}
              >
                <div className={`object-score ${scoreClass(item.score)}`}>
                  <strong>{Math.round(item.score)}</strong>
                  <span>/100</span>
                </div>
                <div className="object-title">
                  <strong>{item.object.name}</strong>
                  <span>
                    {aliases.join(" · ") || item.object.id} · {item.object.type}
                  </span>
                  <small>
                    {item.object.catalogs
                      .map((catalog) => CATALOG_LABELS[catalog])
                      .join(" · ")}
                    {item.object.constellation !== "–"
                      ? ` · ${item.object.constellation}`
                      : ""}
                  </small>
                </div>
                <div className="object-primary-metrics">
                  <span>
                    <small>max.</small>
                    {Math.round(item.maxAltitude)}°
                  </span>
                  <span>
                    <small>sichtbar</small>
                    {item.visibleHours.toFixed(1).replace(".", ",")} h
                  </span>
                  <span>
                    <small>Meridian</small>
                    {formatTime(item.transitTime, timezone)}
                  </span>
                  <span>
                    <small>Framing</small>
                    {item.fovFit}
                  </span>
                </div>
                <span className="chevron">{open ? "⌃" : "⌄"}</span>
              </button>
              {open && (
                <div className="object-details">
                  <div className="detail-grid">
                    <div>
                      <span>Größe</span>
                      <strong>
                        {item.object.majorArcMin > 0
                          ? `${formatSize(item.object.majorArcMin)} × ${formatSize(item.object.minorArcMin)}`
                          : "nicht katalogisiert"}
                      </strong>
                    </div>
                    <div>
                      <span>Magnitude</span>
                      <strong>{item.object.magnitude ?? "–"}</strong>
                    </div>
                    <div>
                      <span>
                        Höhe {formatTime(planningWindow.start, timezone)}
                      </span>
                      <strong>{Math.round(item.altitudeAtStart)}°</strong>
                    </div>
                    <div>
                      <span>
                        Höhe {formatTime(planningWindow.end, timezone)}
                      </span>
                      <strong>{Math.round(item.altitudeAtEnd)}°</strong>
                    </div>
                    <div>
                      <span>Beste Zeit</span>
                      <strong>{formatTime(item.bestTime, timezone)}</strong>
                    </div>
                    <div>
                      <span>Luftmasse</span>
                      <strong>{item.airmassAtBest?.toFixed(2) ?? "–"}</strong>
                    </div>
                    <div>
                      <span>Mondabstand</span>
                      <strong>{Math.round(item.moonSeparationDeg)}°</strong>
                    </div>
                    <div>
                      <span>Mondhöhe</span>
                      <strong>{Math.round(item.moonAltitudeAtBest)}°</strong>
                    </div>
                    <div>
                      <span>Bildfeldnutzung</span>
                      <strong>
                        {item.fovFit === "unbekannt"
                          ? "–"
                          : `${Math.round(item.fovUsagePercent)} %`}
                      </strong>
                    </div>
                    <div>
                      <span>Filter</span>
                      <strong>
                        {item.object.recommendedFilters.join(", ")}
                      </strong>
                    </div>
                  </div>
                  <div className="reason-list">
                    {item.reasons.map((reason) => (
                      <span key={reason}>✓ {reason}</span>
                    ))}
                  </div>
                  <AltitudeChart
                    object={item.object}
                    night={night}
                    planningWindow={planningWindow}
                    location={location}
                    timezone={timezone}
                    minAltitude={filters.minAltitude}
                    selectedTime={selectedTime}
                    onSelectedTimeChange={setSelectedTime}
                    expanded={sections.altitude}
                    onToggle={() => toggleSection("altitude")}
                  />
                  <SkyViewer
                    object={item.object}
                    equipment={equipment}
                    onEquipmentChange={onEquipmentChange}
                    night={night}
                    location={location}
                    timezone={timezone}
                    selectedTime={selectedTime}
                    onSelectedTimeChange={setSelectedTime}
                    horizonExpanded={sections.horizon}
                    framingExpanded={sections.framing}
                    onToggleHorizon={() => toggleSection("horizon")}
                    onToggleFraming={() => toggleSection("framing")}
                  />
                </div>
              )}
            </article>
          );
        })}
        {objects.length === 0 && (
          <div className="empty-state">
            <strong>Kein Objekt erfüllt alle Filter.</strong>
            <span>
              Prüfe Bezugszeitraum, Katalog- und Objekttypauswahl oder reduziere
              Mindesthöhe, Sichtbarkeitsdauer und Mondabstand.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
