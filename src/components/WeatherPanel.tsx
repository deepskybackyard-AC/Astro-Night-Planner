import type { CSSProperties } from 'react';
import type { CentralSettings, LocationProfile, NightWindow, WeatherModelResult, WeatherNightSummary } from '../types';
import type { PlanningWindow } from '../lib/astro';
import MeteobluePanel from './MeteobluePanel';
import { formatTime } from '../lib/time';

type Props = {
  summary?: WeatherNightSummary;
  night: NightWindow;
  timezone: string;
  models: WeatherModelResult[];
  errors: string[];
  loading: boolean;
  error?: string;
  location: LocationProfile;
  evaluationWindow: PlanningWindow;
  settings: CentralSettings;
};

function scoreLabel(score: number) {
  if (score >= 80) return 'sehr gut';
  if (score >= 65) return 'gut';
  if (score >= 50) return 'wechselhaft';
  if (score >= 35) return 'kritisch';
  return 'schlecht';
}

function scoreClass(score: number) {
  if (score >= 70) return 'good';
  if (score >= 45) return 'medium';
  return 'bad';
}

function value(valueToShow: number | null, digits = 0) {
  return valueToShow == null ? '–' : valueToShow.toFixed(digits).replace('.', ',');
}

function percentCell(valueToShow: number | null): CSSProperties {
  const level = valueToShow == null ? 0 : Math.max(0, Math.min(100, valueToShow));
  return { '--weather-level': `${level}%` } as CSSProperties;
}

function thresholdClass(valueToShow: number | null, greenMax: number, yellowMax: number) {
  if (valueToShow == null) return '';
  if (valueToShow < greenMax) return 'quality-good';
  if (valueToShow <= yellowMax) return 'quality-medium';
  return 'quality-bad';
}

function dewClass(gap: number | null, greenMin: number, yellowMin: number) {
  if (gap == null) return '';
  if (gap > greenMin) return 'quality-good';
  if (gap >= yellowMin) return 'quality-medium';
  return 'quality-bad';
}

function displayWind(valueMs: number | null, settings: CentralSettings, digits = 0) {
  if (valueMs == null) return '–';
  const converted = settings.windUnit === 'kmh' ? valueMs * 3.6 : valueMs;
  return `${value(converted, digits)} ${settings.windUnit === 'kmh' ? 'km/h' : 'm/s'}`;
}

export default function WeatherPanel({ summary, night, evaluationWindow, timezone, models, errors, loading, error, location, settings }: Props) {
  const sunset = night.sunset ?? night.darknessStart;
  const sunrise = night.sunrise ?? night.darknessEnd;

  return (
    <section className="panel weather-panel">
      <div className="section-heading">
        <div><span className="eyebrow">Mehrmodell-Prognose</span><h2>Astronomisches Wetter</h2></div>
        {summary && <div className={`score-badge ${scoreClass(summary.score)}`}><strong>{Math.round(summary.score)}</strong><span>{scoreLabel(summary.score)}</span></div>}
      </div>
      {loading && <div className="notice">Wettermodelle werden geladen …</div>}
      {error && <div className="notice warning">{error}</div>}
      {summary && <>
        <div className="weather-summary-grid">
          <div><span>Bestes Fenster im Planungszeitraum</span><strong>{formatTime(summary.bestStart, timezone)}–{formatTime(summary.bestEnd, timezone)}</strong></div>
          <div><span>Bewölkung</span><strong>{Math.round(summary.meanCloud)} %</strong></div>
          <div><span>Hohe Wolken</span><strong>{Math.round(summary.meanHighCloud)} %</strong></div>
          <div><span>Wind</span><strong>{displayWind(summary.meanWind, settings)}</strong></div>
          <div><span>Jetstream</span><strong>{summary.meanJetstream ? displayWind(summary.meanJetstream, settings) : '–'}</strong></div>
          <div><span>Taupunktabstand</span><strong>{summary.minDewGap.toFixed(1).replace('.', ',')} °C</strong></div>
          <div><span>Max. Feuchte</span><strong>{Math.round(summary.maxHumidity)} %</strong></div>
          <div><span>Modellkonsens</span><strong>{Math.round(summary.modelAgreement)} %</strong></div>
        </div>
        <div className="model-strip">
          <span>Verwendet:</span>{models.map((model) => <span key={model.id} className="model-chip">{model.label}</span>)}
        </div>
        {errors.length > 0 && <details className="model-errors"><summary>Nicht verfügbare Modelle ({errors.length})</summary>{errors.map((item) => <div key={item}>{item}</div>)}</details>}

        <div className="weather-table-heading">
          <div><span className="eyebrow">Stündlicher Konsens</span><h3>Sonnenuntergang bis Sonnenaufgang</h3></div>
          <strong>{formatTime(sunset, timezone)}–{formatTime(sunrise, timezone)}</strong>
        </div>

        <div className="weather-table-scroll" aria-label="Stündliche astronomische Wetterdaten von Sonnenuntergang bis Sonnenaufgang">
          <table className="weather-hourly-table">
            <thead>
              <tr>
                <th rowSpan={2} className="sticky-time-column">Uhrzeit</th>
                <th colSpan={3}>Wolken</th>
                <th rowSpan={2}>Temp.</th>
                <th rowSpan={2}>Tauabstand</th>
                <th rowSpan={2}>Wind</th>
                <th rowSpan={2}>Böen</th>
                <th rowSpan={2}>Jetstream</th>
                <th rowSpan={2}>Seeing*</th>
                <th rowSpan={2}>Transparenz*</th>
              </tr>
              <tr><th>tief</th><th>mittel</th><th>hoch</th></tr>
            </thead>
            <tbody>
              {summary.hours.map((hour) => {
                const dewGap = hour.temperature != null && hour.dewPoint != null ? hour.temperature - hour.dewPoint : null;
                return <tr className={scoreClass(hour.astroScore)} key={hour.time.toISOString()}>
                  <th scope="row" className="sticky-time-column"><strong>{formatTime(hour.time, timezone)}</strong><span className={`hour-table-score ${scoreClass(hour.astroScore)}`}>{Math.round(hour.astroScore)}</span></th>
                  <td className="weather-percent-cell" style={percentCell(hour.cloudLow)}>{value(hour.cloudLow)} %</td>
                  <td className="weather-percent-cell" style={percentCell(hour.cloudMid)}>{value(hour.cloudMid)} %</td>
                  <td className="weather-percent-cell" style={percentCell(hour.cloudHigh)}>{value(hour.cloudHigh)} %</td>
                  <td>{value(hour.temperature, 1)} °C</td>
                  <td className={dewClass(dewGap, settings.dewThresholds.greenMin, settings.dewThresholds.yellowMin)}>{dewGap == null ? '–' : `${value(dewGap, 1)} °C`}</td>
                  <td className={thresholdClass(hour.windSpeed, settings.windThresholds.windGreenMax, settings.windThresholds.windYellowMax)}>{displayWind(hour.windSpeed, settings, 1)}</td>
                  <td className={thresholdClass(hour.windGust, settings.windThresholds.gustGreenMax, settings.windThresholds.gustYellowMax)}>{displayWind(hour.windGust, settings, 1)}</td>
                  <td className={thresholdClass(hour.jetstreamSpeed, settings.jetThresholds.greenMax, settings.jetThresholds.yellowMax)}>{displayWind(hour.jetstreamSpeed, settings, 0)}</td>
                  <td><span className={`weather-index ${scoreClass(hour.seeingScore)}`}>{Math.round(hour.seeingScore)}</span></td>
                  <td><span className={`weather-index ${scoreClass(hour.transparencyScore)}`}>{Math.round(hour.transparencyScore)}</span></td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
        <p className="footnote">Die Tabelle zeigt die vollen Prognosestunden zwischen Sonnenuntergang und Sonnenaufgang. Die automatische Nachtbewertung und das beste Fenster beziehen sich auf den gewählten Planungszeitraum {formatTime(evaluationWindow.start, timezone)} bis {formatTime(evaluationWindow.end, timezone)} ({evaluationWindow.label}). * Seeing und Transparenz sind abgeleitete Tendenzen, keine gemessenen Bogensekundenwerte.</p>
      </>}
      <MeteobluePanel location={location} />
    </section>
  );
}
