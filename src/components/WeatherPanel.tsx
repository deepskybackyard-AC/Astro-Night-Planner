import type { LocationProfile, NightWindow, WeatherModelResult, WeatherNightSummary } from '../types';
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

function value(value: number | null, digits = 0) {
  return value == null ? '–' : value.toFixed(digits).replace('.', ',');
}

export default function WeatherPanel({ summary, night, timezone, models, errors, loading, error, location }: Props) {
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
          <div><span>Bestes Fenster</span><strong>{formatTime(summary.bestStart, timezone)}–{formatTime(summary.bestEnd, timezone)}</strong></div>
          <div><span>Bewölkung</span><strong>{Math.round(summary.meanCloud)} %</strong></div>
          <div><span>Hohe Wolken</span><strong>{Math.round(summary.meanHighCloud)} %</strong></div>
          <div><span>Wind</span><strong>{summary.meanWind.toFixed(0)} km/h</strong></div>
          <div><span>Jetstream</span><strong>{summary.meanJetstream ? `${summary.meanJetstream.toFixed(0)} km/h` : '–'}</strong></div>
          <div><span>Taupunktabstand</span><strong>{summary.minDewGap.toFixed(1).replace('.', ',')} °C</strong></div>
          <div><span>Max. Feuchte</span><strong>{Math.round(summary.maxHumidity)} %</strong></div>
          <div><span>Modellkonsens</span><strong>{Math.round(summary.modelAgreement)} %</strong></div>
        </div>
        <div className="model-strip">
          <span>Verwendet:</span>{models.map(model => <span key={model.id} className="model-chip">{model.label}</span>)}
        </div>
        {errors.length > 0 && <details className="model-errors"><summary>Nicht verfügbare Modelle ({errors.length})</summary>{errors.map(item => <div key={item}>{item}</div>)}</details>}
        <div className="hourly-scroll" aria-label="Stündliche astronomische Wetterdaten">
          {summary.hours.map(hour => {
            const dewGap = hour.temperature != null && hour.dewPoint != null ? hour.temperature - hour.dewPoint : null;
            return <div className={`hour-card ${scoreClass(hour.astroScore)}`} key={hour.time.toISOString()}>
              <strong>{formatTime(hour.time, timezone)}</strong>
              <div className="hour-score">{Math.round(hour.astroScore)}</div>
              <dl>
                <div><dt>Wolken</dt><dd>{value(hour.cloudTotal)} %</dd></div>
                <div><dt>tief/mittel/hoch</dt><dd>{value(hour.cloudLow)}/{value(hour.cloudMid)}/{value(hour.cloudHigh)}</dd></div>
                <div><dt>Temp.</dt><dd>{value(hour.temperature, 1)} °C</dd></div>
                <div><dt>Tauabstand</dt><dd>{dewGap == null ? '–' : `${value(dewGap, 1)} °C`}</dd></div>
                <div><dt>Wind/Böen</dt><dd>{value(hour.windSpeed)}/{value(hour.windGust)} km/h</dd></div>
                <div><dt>Jetstream</dt><dd>{value(hour.jetstreamSpeed)} km/h</dd></div>
                <div><dt>Seeing*</dt><dd>{Math.round(hour.seeingScore)}/100</dd></div>
                <div><dt>Transparenz*</dt><dd>{Math.round(hour.transparencyScore)}/100</dd></div>
              </dl>
            </div>;
          })}
        </div>
        <p className="footnote">* Seeing und Transparenz sind in dieser ersten Version abgeleitete Tendenzen, keine gemessenen Bogensekundenwerte. Nachtfenster: {formatTime(night.darknessStart, timezone)}–{formatTime(night.darknessEnd, timezone)}.</p>
      </>}
      <MeteobluePanel location={location} />
    </section>
  );
}
