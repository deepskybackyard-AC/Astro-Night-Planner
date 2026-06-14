import { useEffect, useMemo, useState } from 'react';
import type { LocationProfile } from '../types';

type Props = {
  location: LocationProfile;
};

function slugPart(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase('de')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\u00c0-\u024f]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

function getGeoNamesId(location: LocationProfile): number | undefined {
  if (location.geonameId) return location.geonameId;
  const match = location.id.match(/^place-(\d+)$/);
  if (match) return Number(match[1]);
  if (/tübingen/i.test(location.name)) return 2820860;
  return undefined;
}

function getFixedLocationPath(location: LocationProfile): string | undefined {
  if (location.meteobluePath) return location.meteobluePath;
  const geonameId = getGeoNamesId(location);
  if (!geonameId) return undefined;

  const nameParts = location.name.split(',').map(part => part.trim()).filter(Boolean);
  const city = nameParts[0] || location.name;
  const country = location.country || nameParts.at(-1) || 'Deutschland';
  const citySlug = slugPart(city);
  const countrySlug = slugPart(country);
  if (!citySlug || !countrySlug) return undefined;
  return `${citySlug}_${countrySlug}_${geonameId}`;
}

function buildUrls(location: LocationProfile) {
  const fixedPath = getFixedLocationPath(location);
  if (fixedPath) {
    const encodedPath = fixedPath.split('_').map(encodeURIComponent).join('_');
    return {
      widget: `https://www.meteoblue.com/de/wetter/widget/seeing/${encodedPath}?geoloc=fixed&noground=0`,
      page: `https://www.meteoblue.com/de/wetter/outdoorsports/seeing/${encodedPath}`,
      mode: 'fixed' as const,
    };
  }

  return {
    widget: 'https://www.meteoblue.com/de/wetter/widget/seeing?geoloc=detect&noground=0',
    page: 'https://www.meteoblue.com/de/wetter/outdoorsports/seeing',
    mode: 'detect' as const,
  };
}

export default function MeteobluePanel({ location }: Props) {
  const [fullscreen, setFullscreen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const urls = useMemo(() => buildUrls(location), [location]);

  useEffect(() => {
    setLoaded(false);
  }, [urls.widget]);

  useEffect(() => {
    if (!fullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [fullscreen]);

  const iframe = (isFullscreen = false) => (
    <iframe
      key={`${urls.widget}-${isFullscreen ? 'full' : 'inline'}`}
      className={isFullscreen ? 'meteoblue-frame fullscreen-frame' : 'meteoblue-frame'}
      src={urls.widget}
      title={`Meteoblue Astronomy Seeing für ${location.name}`}
      loading="lazy"
      allow="geolocation"
      sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms"
      referrerPolicy="strict-origin-when-cross-origin"
      onLoad={() => setLoaded(true)}
    />
  );

  return (
    <section className="meteoblue-control" aria-labelledby="meteoblue-title">
      <div className="meteoblue-heading">
        <div>
          <span className="eyebrow">Zusätzliche Kontrollquelle</span>
          <h3 id="meteoblue-title">Meteoblue Astronomy Seeing</h3>
        </div>
        <div className="meteoblue-actions">
          <button type="button" className="secondary compact" onClick={() => setFullscreen(true)}>⛶ Großansicht</button>
          <a className="button-link compact" href={urls.page} target="_blank" rel="noopener noreferrer">Bei Meteoblue öffnen ↗</a>
        </div>
      </div>

      <div className="meteoblue-callout">
        <strong>Meteoblue-Kontrollvorhersage – bitte mit dem Modellkonsens vergleichen.</strong>
        <span>Die automatische App-Gesamtbewertung verwendet weiterhin ausschließlich DWD ICON, ECMWF IFS und NOAA GFS.</span>
      </div>

      <div className="meteoblue-location-note">
        <span>Standort für Meteoblue:</span>
        <strong>{urls.mode === 'fixed' ? location.name : 'automatische Meteoblue-Standorterkennung'}</strong>
        {urls.mode === 'detect' && <small>Bei GPS oder manuell eingegebenen Koordinaten kann Meteoblue einmalig nach der Standortfreigabe fragen.</small>}
      </div>

      <div className={`meteoblue-embed ${loaded ? 'loaded' : ''}`}>
        {!loaded && <div className="meteoblue-loading">Meteoblue-Ansicht wird geladen …</div>}
        {iframe()}
      </div>

      <div className="meteoblue-credit">
        <a href={urls.page} target="_blank" rel="noopener noreferrer">meteoblue</a>
      </div>

      {fullscreen && <div className="meteoblue-modal" role="dialog" aria-modal="true" aria-label="Meteoblue Astronomy Seeing Großansicht">
        <div className="meteoblue-modal-header">
          <div>
            <span className="eyebrow">Meteoblue-Kontrollvorhersage</span>
            <strong>{location.name}</strong>
          </div>
          <button type="button" className="modal-close" aria-label="Großansicht schließen" onClick={() => setFullscreen(false)}>×</button>
        </div>
        <div className="meteoblue-modal-body">{iframe(true)}</div>
      </div>}
    </section>
  );
}
