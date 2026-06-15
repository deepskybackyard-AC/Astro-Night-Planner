import { useMemo, useState } from 'react';
import type { CentralSettings, EvaluationWeights, ListColumnKey, WindPreset } from '../types';
import { LIST_COLUMN_LABELS, LIST_PRESETS, WIND_PRESETS } from '../lib/storage';

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

function toDisplay(valueMs: number, unit: CentralSettings['windUnit']) {
  return unit === 'kmh' ? valueMs * 3.6 : valueMs;
}

function fromDisplay(value: number, unit: CentralSettings['windUnit']) {
  return unit === 'kmh' ? value / 3.6 : value;
}

function rounded(value: number) {
  return Math.round(value * 10) / 10;
}

type Props = {
  settings: CentralSettings;
  onChange: (settings: CentralSettings) => void;
};

export default function CentralSettingsPanel({ settings, onChange }: Props) {
  const [dragKey, setDragKey] = useState<ListColumnKey | null>(null);
  const weightSum = useMemo(
    () => Object.values(settings.evaluationWeights).reduce((sum, value) => sum + Number(value || 0), 0),
    [settings.evaluationWeights],
  );

  function updateWindThreshold(key: keyof CentralSettings['windThresholds'], displayValue: number) {
    onChange({
      ...settings,
      windPreset: 'custom',
      windThresholds: {
        ...settings.windThresholds,
        [key]: Math.max(0, fromDisplay(displayValue, settings.windUnit)),
      },
    });
  }

  function applyWindPreset(preset: WindPreset) {
    if (preset === 'custom') {
      onChange({ ...settings, windPreset: preset });
      return;
    }
    onChange({ ...settings, windPreset: preset, windThresholds: { ...WIND_PRESETS[preset] } });
  }

  function updateWeight(key: keyof EvaluationWeights, value: number) {
    onChange({
      ...settings,
      evaluationWeights: { ...settings.evaluationWeights, [key]: Math.max(0, Math.min(100, value)) },
    });
  }

  function normalizeWeights() {
    const sum = weightSum || 1;
    const entries = Object.entries(settings.evaluationWeights) as Array<[keyof EvaluationWeights, number]>;
    const normalized = Object.fromEntries(entries.map(([key, value]) => [key, Math.round(value / sum * 1000) / 10])) as unknown as EvaluationWeights;
    const normalizedSum = Object.values(normalized).reduce((total, value) => total + value, 0);
    normalized.clouds = Math.round((normalized.clouds + (100 - normalizedSum)) * 10) / 10;
    onChange({ ...settings, evaluationWeights: normalized });
  }

  function applyListPreset(preset: 'compact' | 'standard' | 'detailed') {
    onChange({
      ...settings,
      listDisplay: {
        ...settings.listDisplay,
        preset,
        columns: LIST_PRESETS[preset].map((item) => ({ ...item })),
      },
    });
  }

  function updateColumn(key: ListColumnKey, visible: boolean) {
    onChange({
      ...settings,
      listDisplay: {
        ...settings.listDisplay,
        preset: 'custom',
        columns: settings.listDisplay.columns.map((item) => item.key === key ? { ...item, visible } : item),
      },
    });
  }

  function moveColumn(key: ListColumnKey, offset: number) {
    const columns = [...settings.listDisplay.columns];
    const index = columns.findIndex((item) => item.key === key);
    const target = index + offset;
    if (index < 0 || target < 0 || target >= columns.length) return;
    [columns[index], columns[target]] = [columns[target], columns[index]];
    onChange({ ...settings, listDisplay: { ...settings.listDisplay, preset: 'custom', columns } });
  }

  function dropColumn(targetKey: ListColumnKey) {
    if (!dragKey || dragKey === targetKey) return;
    const columns = [...settings.listDisplay.columns];
    const from = columns.findIndex((item) => item.key === dragKey);
    const to = columns.findIndex((item) => item.key === targetKey);
    if (from < 0 || to < 0) return;
    const [item] = columns.splice(from, 1);
    columns.splice(to, 0, item);
    setDragKey(null);
    onChange({ ...settings, listDisplay: { ...settings.listDisplay, preset: 'custom', columns } });
  }

  const unit = settings.windUnit === 'kmh' ? 'km/h' : 'm/s';

  return (
    <div className="settings-stack">
      <section className="panel settings-card">
        <div className="section-heading"><div><span className="eyebrow">Einheiten und Planungsstandard</span><h2>Allgemein</h2></div></div>
        <div className="form-grid two">
          <label>Einheit für Wind, Böen und Jetstream
            <select value={settings.windUnit} onChange={(event) => onChange({ ...settings, windUnit: event.target.value as CentralSettings['windUnit'] })}>
              <option value="kmh">km/h (Standard)</option>
              <option value="ms">m/s</option>
            </select>
          </label>
          <label>Standard-Planungszeitraum
            <select value={settings.defaultPlanningWindow} onChange={(event) => onChange({ ...settings, defaultPlanningWindow: event.target.value as CentralSettings['defaultPlanningWindow'] })}>
              <option value="sunset">Sonnenuntergang bis Sonnenaufgang</option>
              <option value="nautical">Nautischer Zeitraum – Sonne unter −6°</option>
              <option value="astronomicalTwilight">Astronomischer Zeitraum – Sonne unter −12°</option>
              <option value="astronomicalNight">Astronomische Nacht – Sonne unter −18°</option>
            </select>
          </label>
        </div>
      </section>

      <section className="panel settings-card">
        <div className="section-heading"><div><span className="eyebrow">Aufnahmequalität</span><h2>Wind, Böen, Tau und Jetstream</h2></div></div>
        <div className="preset-row" role="group" aria-label="Wind-Preset">
          <button type="button" className={settings.windPreset === 'travel' ? '' : 'secondary'} onClick={() => applyWindPreset('travel')}>Leichtes Reisesetup</button>
          <button type="button" className={settings.windPreset === 'normal' ? '' : 'secondary'} onClick={() => applyWindPreset('normal')}>Normales Setup</button>
          <button type="button" className={settings.windPreset === 'robust' ? '' : 'secondary'} onClick={() => applyWindPreset('robust')}>Robuste Säule / Montierung</button>
          {settings.windPreset === 'custom' && <span className="custom-badge">Benutzerdefiniert</span>}
        </div>
        <div className="threshold-grid">
          <label>Wind: Grün bis ({unit})
            <input type="number" min="0" step="0.5" value={rounded(toDisplay(settings.windThresholds.windGreenMax, settings.windUnit))} onChange={(event) => updateWindThreshold('windGreenMax', Number(event.target.value))} />
          </label>
          <label>Wind: Gelb bis ({unit})
            <input type="number" min="0" step="0.5" value={rounded(toDisplay(settings.windThresholds.windYellowMax, settings.windUnit))} onChange={(event) => updateWindThreshold('windYellowMax', Number(event.target.value))} />
          </label>
          <label>Böen: Grün bis ({unit})
            <input type="number" min="0" step="0.5" value={rounded(toDisplay(settings.windThresholds.gustGreenMax, settings.windUnit))} onChange={(event) => updateWindThreshold('gustGreenMax', Number(event.target.value))} />
          </label>
          <label>Böen: Gelb bis ({unit})
            <input type="number" min="0" step="0.5" value={rounded(toDisplay(settings.windThresholds.gustYellowMax, settings.windUnit))} onChange={(event) => updateWindThreshold('gustYellowMax', Number(event.target.value))} />
          </label>
          <label>Tauabstand: Grün über (°C)
            <input type="number" step="0.5" value={settings.dewThresholds.greenMin} onChange={(event) => onChange({ ...settings, dewThresholds: { ...settings.dewThresholds, greenMin: Number(event.target.value) } })} />
          </label>
          <label>Tauabstand: Gelb ab (°C)
            <input type="number" step="0.5" value={settings.dewThresholds.yellowMin} onChange={(event) => onChange({ ...settings, dewThresholds: { ...settings.dewThresholds, yellowMin: Number(event.target.value) } })} />
          </label>
          <label>Jetstream: Grün bis ({unit})
            <input type="number" min="0" step="1" value={rounded(toDisplay(settings.jetThresholds.greenMax, settings.windUnit))} onChange={(event) => onChange({ ...settings, jetThresholds: { ...settings.jetThresholds, greenMax: Math.max(0, fromDisplay(Number(event.target.value), settings.windUnit)) } })} />
          </label>
          <label>Jetstream: Gelb bis ({unit})
            <input type="number" min="0" step="1" value={rounded(toDisplay(settings.jetThresholds.yellowMax, settings.windUnit))} onChange={(event) => onChange({ ...settings, jetThresholds: { ...settings.jetThresholds, yellowMax: Math.max(0, fromDisplay(Number(event.target.value), settings.windUnit)) } })} />
          </label>
        </div>
        <p className="footnote">Die Farben bewerten die erwartete Aufnahmequalität und sind keine Sicherheitsfreigabe für Montierung, Stativ oder Optik. Intern werden Windwerte in m/s gespeichert.</p>
      </section>

      <section className="panel settings-card">
        <div className="section-heading"><div><span className="eyebrow">Standardprofil Deep-Sky</span><h2>Gewichtung der Gesamtbewertung</h2></div><div className={`weight-sum ${Math.abs(weightSum - 100) < 0.01 ? 'good' : 'medium'}`}><strong>{weightSum.toFixed(1).replace('.', ',')} %</strong><span>Summe</span></div></div>
        <div className="weight-grid">
          {(Object.keys(WEIGHT_LABELS) as Array<keyof EvaluationWeights>).map((key) => (
            <label key={key}>{WEIGHT_LABELS[key]} <strong>{settings.evaluationWeights[key].toFixed(1).replace('.', ',')} %</strong>
              <input type="range" min="0" max="50" step="1" value={settings.evaluationWeights[key]} onChange={(event) => updateWeight(key, Number(event.target.value))} />
            </label>
          ))}
        </div>
        <div className="settings-actions"><button type="button" className="secondary" onClick={normalizeWeights}>Auf 100 % normieren</button></div>
      </section>

      <section className="panel settings-card">
        <div className="section-heading"><div><span className="eyebrow">Anzeige</span><h2>Objektliste</h2></div></div>
        <div className="form-grid two">
          <label>Objekte pro Seite
            <select value={settings.listDisplay.pageSize} onChange={(event) => onChange({ ...settings, listDisplay: { ...settings.listDisplay, pageSize: Number(event.target.value) as 10 | 20 | 50 | 100 } })}>
              {[10, 20, 50, 100].map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>Darstellungsprofil
            <select value={settings.listDisplay.preset} onChange={(event) => {
              const preset = event.target.value as CentralSettings['listDisplay']['preset'];
              if (preset === 'compact' || preset === 'standard' || preset === 'detailed') applyListPreset(preset);
            }}>
              <option value="compact">Kompakt</option>
              <option value="standard">Standard</option>
              <option value="detailed">Detailliert</option>
              <option value="custom" disabled>Benutzerdefiniert</option>
            </select>
          </label>
        </div>
        <div className="column-config-list">
          {settings.listDisplay.columns.map((column, index) => (
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
                <button type="button" className="secondary compact" disabled={index === settings.listDisplay.columns.length - 1} onClick={() => moveColumn(column.key, 1)} aria-label="Nach unten">↓</button>
              </div>
            </div>
          ))}
        </div>
        <div className="settings-actions">
          <button type="button" className="secondary" onClick={() => applyListPreset('compact')}>Kompakt</button>
          <button type="button" className="secondary" onClick={() => applyListPreset('standard')}>Standard wiederherstellen</button>
          <button type="button" className="secondary" onClick={() => applyListPreset('detailed')}>Detailliert</button>
        </div>
      </section>
    </div>
  );
}
