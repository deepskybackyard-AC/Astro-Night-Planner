export function zonedDateParts(date: Date, timeZone: string): Record<string, number> {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hourCycle: 'h23',
  });
  const parts = formatter.formatToParts(date);
  const out: Record<string, number> = {};
  for (const p of parts) if (p.type !== 'literal') out[p.type] = Number(p.value);
  return out;
}

export function zonedLocalToUtc(
  dateKey: string,
  timeZone: string,
  hour = 12,
  minute = 0,
): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  const target = Date.UTC(year, month - 1, day, hour, minute, 0);
  let guess = new Date(target);
  for (let i = 0; i < 3; i += 1) {
    const parts = zonedDateParts(guess, timeZone);
    const represented = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    guess = new Date(guess.getTime() + (target - represented));
  }
  return guess;
}

export function dateKeyInZone(date: Date, timeZone: string): string {
  const p = zonedDateParts(date, timeZone);
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
}

export function addDaysToDateKey(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days, 12));
  return date.toISOString().slice(0, 10);
}

export function formatTime(date: Date | undefined, timeZone: string): string {
  if (!date || Number.isNaN(date.getTime())) return '–';
  return new Intl.DateTimeFormat('de-DE', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDateLabel(dateKey: string, timeZone: string): string {
  const date = zonedLocalToUtc(dateKey, timeZone, 12);
  return new Intl.DateTimeFormat('de-DE', {
    timeZone,
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  }).format(date);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function mean(values: number[]): number {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}
