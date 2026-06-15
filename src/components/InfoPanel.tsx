export default function InfoPanel() {
  return (
    <section className="panel about-panel">
      <span className="eyebrow">Version 0.8</span>
      <h2>Astro Night Planner</h2>
      <p>Der Astro Night Planner kombiniert astronomische Sichtbarkeit, mehrere Wettermodelle, Mondbedingungen, persönliche Ausrüstung und ein eigenes Horizontprofil. Ziel ist eine nachvollziehbare Empfehlung für geeignete Aufnahmeobjekte am gewählten Standort.</p>

      <h3>Datenquellen und Modelle</h3>
      <p>Die Wetterdaten werden ohne persönlichen API-Schlüssel über Open-Meteo aus DWD ICON, ECMWF IFS und NOAA GFS abgerufen. Die App bildet daraus stündliche Medianwerte und zeigt die Modellstreuung. Meteoblue Astronomy Seeing bleibt eine zusätzliche Kontrollansicht und fließt nicht in die automatische Gesamtbewertung ein.</p>
      <p>Sonnen-, Mond-, Dämmerungs- und Objektpositionen werden lokal mit Astronomy Engine berechnet. Die interaktive Himmelsansicht wird mit Aladin Lite dargestellt.</p>

      <h3>Gesamtbewertung</h3>
      <p>Das Standardprofil „Deep-Sky“ gewichtet Wolken mit 30 %, Transparenz mit 15 %, Seeing mit 10 %, Wind und Böen mit 10 %, Tauabstand mit 10 %, Mond mit 10 %, Objekthöhe mit 10 % und Sichtbarkeitsdauer mit 5 %. Die Gewichte können in den zentralen Einstellungen verändert werden. Die Punktzahl ist eine Planungshilfe und keine Garantie für verwertbare Aufnahmen.</p>

      <h3>Seeing, Jetstream und Tauabstand</h3>
      <p><strong>Seeing</strong> beschreibt die durch atmosphärische Turbulenz verursachte Unruhe und Unschärfe. Die App zeigt derzeit eine Tendenz aus Jetstream und bodennahem Wind, keine exakte Messung in Bogensekunden.</p>
      <p><strong>Jetstream</strong> bezeichnet hier den Höhenwind in ungefähr 250 hPa. Standardmäßig gelten unter 10 m/s als günstig, 10–20 m/s als mäßig und über 20 m/s als ungünstig. Die Anzeige folgt der zentral gewählten Einheit.</p>
      <p><strong>Tauabstand</strong> ist die Differenz zwischen Lufttemperatur und Taupunkt. Über 5 °C wird grün, 2–5 °C gelb und unter 2 °C rot bewertet. Optiken können bereits vor Erreichen des Taupunkts beschlagen.</p>

      <h3>Windbewertung</h3>
      <p>Wind und Böen werden anhand des gewählten Presets oder eigener Grenzwerte bewertet. Die Farben beschreiben ausschließlich die erwartete Aufnahmequalität. Sie sind keine Sicherheitsfreigabe für Montierung, Stativ, Säule, Teleskop oder Dach.</p>

      <h3>Objektkataloge und Lizenzen</h3>
      <p>Enthalten sind der Messier-Katalog, NGC und IC aus OpenNGC, der Sharpless-2-Katalog, der Abell-Katalog planetarischer Nebel sowie fachlich ergänzte Objekte. Katalogdaten können unvollständig sein; insbesondere Größen, Magnituden und Positionswinkel sind nicht für jedes Objekt verfügbar.</p>
      <p>OpenNGC wird unter CC BY-SA 4.0 genutzt. Weitere Quellen und Hinweise stehen in der Datei <code>CATALOG_SOURCES.md</code> des Projekts.</p>

      <h3>Datenschutz und Speicherung</h3>
      <p>In dieser Entwicklungsfassung werden Standorte, Ausrüstung und Einstellungen lokal im Browser gespeichert. Eine spätere Version soll Login, zentrale Datenhaltung und geräteübergreifende Synchronisierung ergänzen. Meteoblue wird als externe Webseite eingebettet; beim Öffnen gelten deren Datenschutzbestimmungen.</p>

      <h3>Projekt und Fehler melden</h3>
      <p><a className="button-link compact" href="https://github.com/deepskybackyard-AC/Astro-Night-Planner" target="_blank" rel="noreferrer">GitHub-Projekt öffnen</a></p>
    </section>
  );
}
