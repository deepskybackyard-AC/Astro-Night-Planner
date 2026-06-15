import { useEffect, useMemo, useState } from 'react';
import type {
  CentralSettings,
  DisplayProfileKey,
  EvaluationWeights,
  ListColumnKey,
  ListDisplayProfile,
  WindProfileKey,
  WindThresholds,
} from '../types';
import {
  DISPLAY_PROFILE_LABELS,
  LIST_COLUMN_LABELS,
  LIST_PRESETS,
  WIND_PRESETS,
  WIND_PROFILE_LABELS,
} from '../lib/storage';

const WEIGHT_LABELS: Record<keyof EvaluationWeights, string> = {
  clouds: 'Wolken',
  transparency: 'Transparenz',
  seeing: 'Seeing',
  wind: 'Wind / Böen',
  dew: 'Tauabstand',
  moon: 'Mond',
  altitude: 'Objekthöhe',
  duration: 'Sichtbarkeitsdauer',
};

const WIND_KEYS: WindProfileKey[] = ['travel', 'normal', 'robust', 'custom'];
const DISPLAY_KEYS: DisplayProfileKey[] = ['compact', 'standard', 'detailed', 'custom'];

function toDisplay(valueMs: number, unit: CentralSettings['windUnit']) {
  return unit === 'kmh' ? valueMs * 3.6 : valueMs;
}

function fromDisplay(value: number, unit: CentralSettings['windUnit']) {
  return unit === 'kmh' ? value / 3.6 : value;
}

function rounded(value: number) {
  return Math.round(value * 10) / 10;
}

function same(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function cloneProfiles(settings: CentralSettings) {
  return Object.fromEntries(
    WIND_KEYS.map((key) => [key, { ...settings.windProfiles[key] }]),
  ) as Record<WindProfileKey, WindThresholds>;
}

function cloneDisplayProfiles(settings: CentralSettings) {
  return Object.fromEntries(
    DISPLAY_KEYS.map((key) => [key, {
      pageSize: settings.listDisplay.profiles[key].pageSize,
      columns: settings.listDisplay.profiles[key].columns.map((column) => ({ ...column })),
    }]),
  ) as Record<DisplayProfileKey, ListDisplayProfile>;
}

type Props = {
  settings: CentralSettings;
  onChange: (settings: CentralSettings) => void;
};

export default function CentralSettingsPanel({ settings, onChange }: Props) {
  const [generalDraft, setGeneralDraft] = useState(() => ({
    windUnit: settings.windUnit,
    defaultPlanningWindow: settings.defaultPlanningWindow,
  }));
  const [windDraft, setWindDraft] = useState(() => ({
    activeWindProfile: settings.activeWindProfile,
    windProfiles: cloneProfiles(settings),
    dewThresholds: { ...settings.dewThresholds },
    jetThresholds: { ...settings.jetThresholds },
  }));
  const [weightsDraft, setWeightsDraft] = useState<EvaluationWeights>(() => ({ ...settings.evaluationWeights }));
  const [displayDraft, setDisplayDraft] = useState(() => ({
    activeProfile: settings.listDisplay.activeProfile,
    profiles: cloneDisplayProfiles(settings),
  }));
  const [editingWindProfile, setEditingWindProfile] = useState<WindProfileKey>(settings.activeWindProfile);
  const [editingDisplayProfile, setEditingDisplayProfile] = useState<DisplayProfileKey>(settings.listDisplay.activeProfile);
  const [dragKey, setDragKey] = useState<ListColumnKey | null>(null);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    setGeneralDraft({ windUnit: settings.windUnit, defaultPlanningWindow: settings.defaultPlanningWindow });
    setWindDraft({
      activeWindProfile: settings.activeWindProfile,
      windProfiles: cloneProfiles(settings),
      dewThresholds: { ...settings.dewThresholds },
      jetThresholds: { ...settings.jetThresholds },
    });
    setWeightsDraft({ ...settings.evaluationWeights });
    setDisplayDraft({
      activeProfile: settings.listDisplay.activeProfile,
      profiles: cloneDisplayProfiles(settings),
    });
  }, [settings]);

  const generalSaved = { windUnit: settings.windUnit, defaultPlanningWindow: settings.defaultPlanningWindow };
  const windSaved = {
    activeWindProfile: settings.activeWindProfile,
    windProfiles: settings.windProfiles,
    dewThresholds: settings.dewThresholds,
    jetThresholds: settings.jetThresholds,
  };
  const displaySaved = {
    activeProfile: settings.listDisplay.activeProfile,
    profiles: settings.listDisplay.profiles,
  };
  const generalDirty = !same(generalDraft, generalSaved);
  const windDirty = !same(windDraft, windSaved);
  const weightsDirty = !same(weightsDraft, settings.evaluationWeights);
  const displayDirty = !same(displayDraft, displaySaved);

  const weightSum = useMemo(
    () => Object.values(weightsDraft).reduce((sum, value) => sum + Number(value || 0), 0),
    [weightsDraft],
  );

  const unit = settings.windUnit === 'kmh' ? 'km/h' : 'm/s';
  const editedWind = windDraft.windProfiles[editingWindProfile];
  const editedDisplay = displayDraft.profiles[editingDisplayProfile];

  function notify(text: string) {
    setSavedMessage(text);
    window.setTimeout(() => setSavedMessage(''), 2200);
  }

  function saveGeneral() {
    onChange({ ...settings, ...generalDraft });
    notify('Allgemeine Einstellungen gespeichert.');
  }

  function updateWindThreshold(key: keyof WindThresholds, displayValue: number) {
    setWindDraft((current) => ({
      ...current,
      windProfiles: {
        ...current.windProfiles,
        [editingWindProfile]: {
          ...current.windProfiles[editingWindProfile],
          [key]: Math.max(0, fromDisplay(displayValue, settings.windUnit)),
        },
      },
    }));
  }

  function resetEditedWindProfile() {
    const fallback = editingWindProfile === 'custom' ? WIND_PRESETS.normal : WIND_PRESETS[editingWindProfile];
    setWindDraft((current) => ({
      ...current,
      windProfiles: { ...current.windProfiles, [editingWindProfile]: { ...fallback } },
    }));
  }

  function saveWind() {
    const activeThresholds = windDraft.windProfiles[windDraft.activeWindProfile];
    onChange({
      ...settings,
      activeWindProfile: windDraft.activeWindProfile,
      windProfiles: cloneWindDraft(windDraft.windProfiles),
      windPreset: windDraft.activeWindProfile,
      windThresholds: { ...activeThresholds },
      dewThresholds: { ...windDraft.dewThresholds },
      jetThresholds: { ...windDraft.jetThresholds },
    });
    notify('Aufnahmequalitätsprofile gespeichert.');
  }

  function updateWeight(key: keyof EvaluationWeights, value: number) {
    setWeightsDraft((current) => ({ ...current, [key]: Math.max(0, Math.min(100, Math.round(value || 0))) }));
  }

  function normalizeWeights() {
    const entries = Object.entries(weightsDraft) as Array<[keyof EvaluationWeights, number]>;
    const sum = entries.reduce((total, [, value]) => total + value, 0);
    if (sum <= 0) return setWeightsDraft({ ...settings.evaluationWeights });
    const exact = entries.map(([key, value]) => ({ key, exact: value / sum * 100 }));
    const integers = exact.map((entry) => ({ ...entry, value: Math.floor(entry.exact), remainder: entry.exact - Math.floor(entry.exact) }));
    let remaining = 100 - integers.reduce((total, entry) => total + entry.value, 0);
    integers.sort((a, b) => b.remainder - a.remainder);
    for (let index = 0; index < integers.length && remaining > 0; index += 1, remaining -= 1) integers[index].value += 1;
    setWeightsDraft(Object.fromEntries(integers.map((entry) => [entry.key, entry.value])) as EvaluationWeights);
  }

  function saveWeights() {
    if (weightSum !== 100) return;
    onChange({ ...settings, evaluationWeights: { ...weightsDraft } });
    notify('Gewichtung gespeichert.');
  }

  function applyListPreset(preset: 'compact' | 'standard' | 'detailed') {
    setDisplayDraft((current) => ({
      ...current,
      profiles: {
        ...current.profiles,
        [editingDisplayProfile]: {
          ...current.profiles[editingDisplayProfile],
          columns: LIST_PRESETS[preset].map((item) => ({ ...item })),
        },
      },
    }));
  }

  function updateColumn(key: ListColumnKey, visible: boolean) {
    setDisplayDraft((current) => ({
      ...current,
      profiles: {
        ...current.profiles,
        [editingDisplayProfile]: {
          ...current.profiles[editingDisplayProfile],
          columns: current.profiles[editingDisplayProfile].columns.map((item) => item.key === key ? { ...item, visible } : item),
        },
      },
    }));
  }

  function updatePageSize(value: 10 | 20 | 50 | 100) {
    setDisplayDraft((current) => ({
      ...current,
      profiles: {
        ...current.profiles,
        [editingDisplayProfile]: { ...current.profiles[editingDisplayProfile], pageSize: value },
      },
    }));
  }

  function moveColumn(key: ListColumnKey, offset: number) {
    setDisplayDraft((current) => {
      const columns = [...current.profiles[editingDisplayProfile].columns];
      const index = columns.findIndex((item) => item.key === key);
      const target = index + offset;
      if (index < 0 || target < 0 || target >= columns.length) return current;
      [columns[index], columns[target]] = [columns[target], columns[index]];
      return {
        ...current,
        profiles: { ...current.profiles, [editingDisplayProfile]: { ...current.profiles[editingDisplayProfile], columns } },
      };
    });
  }

  function dropColumn(targetKey: ListColumnKey) {
    if (!dragKey || dragKey === targetKey) return;
    setDisplayDraft((current) => {
      const columns = [...current.profiles[editingDisplayProfile].columns];
      const from = columns.findIndex((item) => item.key === dragKey);
      const to = columns.findIndex((item) => item.key === targetKey);
      if (from < 0 || to < 0) return current;
      const [item] = columns.splice(from, 1);
      columns.splice(to, 0, item);
      return {
        ...current,
        profiles: { ...current.profiles, [editingDisplayProfile]: { ...current.profiles[editingDisplayProfile], columns } },
      };
    });
    setDragKey(null);
  }

  function saveDisplay() {
    const active = displayDraft.profiles[displayDraft.activeProfile];
    onChange({
      ...settings,
      listDisplay: {
        activeProfile: displayDraft.activeProfile,
        profiles: cloneDisplayDraft(displayDraft.profiles),
        preset: displayDraft.activeProfile,
        pageSize: active.pageSize,
        columns: active.columns.map((column) => ({ ...column })),
      },
    });
    notify('Darstellungsprofile gespeichert.');
  }

  return (
    <div className="settings-stack">
      {savedMessage && <div className="settings-save-toast" role="status">✓ {savedMessage}</div>}

      <section className={`panel settings-card ${generalDirty ? 'has-unsaved' : ''}`}>
        <div className="section-heading"><div><span className="eyebrow">Einheiten und Planungsstandard</span><h2>Allgemein</h2></div>{generalDirty && <span className="unsaved-badge">Ungespeichert</span>}</div>
        <div className="form-grid two">
          <label>Einheit für Wind, Böen und Jetstream
            <select value={generalDraft.windUnit} onChange={(event) => setGeneralDraft({ ...generalDraft, windUnit: event.target.value as CentralSettings['windUnit'] })}>
              <option value="kmh">km/h (Standard)</option>
              <option value="ms">m/s</option>
            </select>
          </label>
          <label>Standard-Planungszeitraum
            <select value={generalDraft.defaultPlanningWindow} onChange={(event) => setGeneralDraft({ ...generalDraft, defaultPlanningWindow: event.target.value as CentralSettings['defaultPlanningWindow'] })}>
              <option value="sunset">Sonnenuntergang bis Sonnenaufgang</option>
              <option value="nautical">Nautischer Zeitraum – Sonne unter −6°</option>
              <option value="astronomicalTwilight">Astronomischer Zeitraum – Sonne unter −12°</option>
              <option value="astronomicalNight">Astronomische Nacht – Sonne unter −18°</option>
            </select>
          </label>
        </div>
        <SaveActions dirty={generalDirty} onSave={saveGeneral} onDiscard={() => setGeneralDraft(generalSaved)} />
      </section>

      <section className={`panel settings-card ${windDirty ? 'has-unsaved' : ''}`}>
        <div className="section-heading"><div><span className="eyebrow">Aufnahmequalität</span><h2>Wind, Böen, Tau und Jetstream</h2></div>{windDirty && <span className="unsaved-badge">Ungespeichert</span>}</div>
        <div className="profile-management-grid">
          <label><strong>Aktiv</strong>
            <select value={windDraft.activeWindProfile} onChange={(event) => setWindDraft({ ...windDraft, activeWindProfile: event.target.value as WindProfileKey })}>
              {WIND_KEYS.map((key) => <option key={key} value={key}>{WIND_PROFILE_LABELS[key]}</option>)}
            </select>
            <small>Dieses Profil ist nach dem Speichern der dauerhafte Standard.</small>
          </label>
          <label>Profil bearbeiten
            <select value={editingWindProfile} onChange={(event) => setEditingWindProfile(event.target.value as WindProfileKey)}>
              {WIND_KEYS.map((key) => <option key={key} value={key}>{WIND_PROFILE_LABELS[key]}</option>)}
            </select>
            <small>Das Bearbeiten aktiviert das Profil nicht automatisch.</small>
          </label>
        </div>
        <div className="editing-profile-heading"><strong>{WIND_PROFILE_LABELS[editingWindProfile]}</strong><button type="button" className="secondary compact" onClick={resetEditedWindProfile}>Richtwerte wiederherstellen</button></div>
        <div className="threshold-grid">
          <label>Wind: Grün bis ({unit})
            <input type="number" min="0" step="0.5" value={rounded(toDisplay(editedWind.windGreenMax, settings.windUnit))} onChange={(event) => updateWindThreshold('windGreenMax', Number(event.target.value))} />
          </label>
          <label>Wind: Gelb bis ({unit})
            <input type="number" min="0" step="0.5" value={rounded(toDisplay(editedWind.windYellowMax, settings.windUnit))} onChange={(event) => updateWindThreshold('windYellowMax', Number(event.target.value))} />
          </label>
          <label>Böen: Grün bis ({unit})
            <input type="number" min="0" step="0.5" value={rounded(toDisplay(editedWind.gustGreenMax, settings.windUnit))} onChange={(event) => updateWindThreshold('gustGreenMax', Number(event.target.value))} />
          </label>
          <label>Böen: Gelb bis ({unit})
            <input type="number" min="0" step="0.5" value={rounded(toDisplay(editedWind.gustYellowMax, settings.windUnit))} onChange={(event) => updateWindThreshold('gustYellowMax', Number(event.target.value))} />
          </label>
          <label>Tauabstand: Grün über (°C)
            <input type="number" step="0.5" value={windDraft.dewThresholds.greenMin} onChange={(event) => setWindDraft({ ...windDraft, dewThresholds: { ...windDraft.dewThresholds, greenMin: Number(event.target.value) } })} />
          </label>
          <label>Tauabstand: Gelb ab (°C)
            <input type="number" step="0.5" value={windDraft.dewThresholds.yellowMin} onChange={(event) => setWindDraft({ ...windDraft, dewThresholds: { ...windDraft.dewThresholds, yellowMin: Number(event.target.value) } })} />
          </label>
          <label>Jetstream: Grün bis ({unit})
            <input type="number" min="0" step="1" value={rounded(toDisplay(windDraft.jetThresholds.greenMax, settings.windUnit))} onChange={(event) => setWindDraft({ ...windDraft, jetThresholds: { ...windDraft.jetThresholds, greenMax: Math.max(0, fromDisplay(Number(event.target.value), settings.windUnit)) } })} />
          </label>
          <label>Jetstream: Gelb bis ({unit})
            <input type="number" min="0" step="1" value={rounded(toDisplay(windDraft.jetThresholds.yellowMax, settings.windUnit))} onChange={(event) => setWindDraft({ ...windDraft, jetThresholds: { ...windDraft.jetThresholds, yellowMax: Math.max(0, fromDisplay(Number(event.target.value), settings.windUnit)) } })} />
          </label>
        </div>
        <p className="footnote">Die Farben bewerten die erwartete Aufnahmequalität und sind keine Sicherheitsfreigabe für Montierung, Stativ oder Optik. Intern werden Windwerte in m/s gespeichert.</p>
        <SaveActions dirty={windDirty} onSave={saveWind} onDiscard={() => setWindDraft(windSaved)} />
      </section>

      <section className={`panel settings-card ${weightsDirty ? 'has-unsaved' : ''}`}>
        <div className="section-heading"><div><span className="eyebrow">Bewertungsprofil Deep-Sky</span><h2>Gewichtung der Gesamtbewertung</h2></div><div className={`weight-sum ${weightSum === 100 ? 'good' : 'medium'}`}><strong>{weightSum} %</strong><span>Summe</span></div></div>
        {weightsDirty && <div className="unsaved-inline">Ungespeicherte Änderungen</div>}
        <div className="weight-grid integer-weights">
          {(Object.keys(WEIGHT_LABELS) as Array<keyof EvaluationWeights>).map((key) => (
            <label key={key}>{WEIGHT_LABELS[key]}
              <div className="integer-weight-input"><input type="number" min="0" max="100" step="1" value={weightsDraft[key]} onChange={(event) => updateWeight(key, Number(event.target.value))} /><span>%</span></div>
            </label>
          ))}
        </div>
        {weightSum !== 100 && <div className="notice warning compact-notice">Die Summe muss vor dem Speichern 100 % betragen.</div>}
        <div className="settings-actions"><button type="button" className="secondary" onClick={normalizeWeights}>Auf 100 % normieren</button></div>
        <SaveActions dirty={weightsDirty} onSave={saveWeights} onDiscard={() => setWeightsDraft({ ...settings.evaluationWeights })} saveDisabled={weightSum !== 100} />
      </section>

      <section className={`panel settings-card ${displayDirty ? 'has-unsaved' : ''}`}>
        <div className="section-heading"><div><span className="eyebrow">Anzeige</span><h2>Objektliste</h2></div>{displayDirty && <span className="unsaved-badge">Ungespeichert</span>}</div>
        <div className="profile-management-grid">
          <label><strong>Aktiv</strong>
            <select value={displayDraft.activeProfile} onChange={(event) => setDisplayDraft({ ...displayDraft, activeProfile: event.target.value as DisplayProfileKey })}>
              {DISPLAY_KEYS.map((key) => <option key={key} value={key}>{DISPLAY_PROFILE_LABELS[key]}</option>)}
            </select>
            <small>Dieses Profil wird nach dem Speichern standardmäßig in der Planung verwendet.</small>
          </label>
          <label>Profil bearbeiten
            <select value={editingDisplayProfile} onChange={(event) => setEditingDisplayProfile(event.target.value as DisplayProfileKey)}>
              {DISPLAY_KEYS.map((key) => <option key={key} value={key}>{DISPLAY_PROFILE_LABELS[key]}</option>)}
            </select>
            <small>Das Bearbeiten aktiviert das Profil nicht automatisch.</small>
          </label>
        </div>
        <div className="form-grid two">
          <label>Objekte pro Seite in „{DISPLAY_PROFILE_LABELS[editingDisplayProfile]}“
            <select value={editedDisplay.pageSize} onChange={(event) => updatePageSize(Number(event.target.value) as 10 | 20 | 50 | 100)}>
              {[10, 20, 50, 100].map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <div className="profile-preset-buttons"><span>Spaltenvorlage übernehmen</span><div><button type="button" className="secondary compact" onClick={() => applyListPreset('compact')}>Kompakt</button><button type="button" className="secondary compact" onClick={() => applyListPreset('standard')}>Standard</button><button type="button" className="secondary compact" onClick={() => applyListPreset('detailed')}>Detailliert</button></div></div>
        </div>
        <div className="column-config-list">
          {editedDisplay.columns.map((column, index) => (
            <div
              className={`column-config-row ${dragKey === column.key ? 'dragging' : ''}`}
              key={column.key}
              draggable
              onDragStart={() => setDragKey(column.key)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => dropColumn(column.key)}
              onDragEnd={() => setDragKey(null)}
            >
              <span className="drag-handle" aria-hidden="true">⋮⋮</span>
              <label><input type="checkbox" checked={column.visible} onChange={(event) => updateColumn(column.key, event.target.checked)} /> {LIST_COLUMN_LABELS[column.key]}</label>
              <div className="order-buttons">
                <button type="button" className="secondary compact" disabled={index === 0} onClick={() => moveColumn(column.key, -1)} aria-label="Nach oben">↑</button>
                <button type="button" className="secondary compact" disabled={index === editedDisplay.columns.length - 1} onClick={() => moveColumn(column.key, 1)} aria-label="Nach unten">↓</button>
              </div>
            </div>
          ))}
        </div>
        <SaveActions dirty={displayDirty} onSave={saveDisplay} onDiscard={() => setDisplayDraft(displaySaved)} />
      </section>
    </div>
  );
}

function cloneWindDraft(profiles: Record<WindProfileKey, WindThresholds>) {
  return Object.fromEntries(WIND_KEYS.map((key) => [key, { ...profiles[key] }])) as Record<WindProfileKey, WindThresholds>;
}

function cloneDisplayDraft(profiles: Record<DisplayProfileKey, ListDisplayProfile>) {
  return Object.fromEntries(DISPLAY_KEYS.map((key) => [key, {
    pageSize: profiles[key].pageSize,
    columns: profiles[key].columns.map((column) => ({ ...column })),
  }])) as Record<DisplayProfileKey, ListDisplayProfile>;
}

function SaveActions({ dirty, onSave, onDiscard, saveDisabled = false }: { dirty: boolean; onSave: () => void; onDiscard: () => void; saveDisabled?: boolean }) {
  return <div className="section-save-actions">
    <span>{dirty ? 'Änderungen sind noch nicht gespeichert.' : 'Gespeicherter Stand'}</span>
    <div><button type="button" className="secondary" disabled={!dirty} onClick={onDiscard}>Änderungen verwerfen</button><button type="button" disabled={!dirty || saveDisabled} onClick={onSave}>Änderungen speichern</button></div>
  </div>;
}
