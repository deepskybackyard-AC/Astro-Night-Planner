import catalogRows from './catalog.generated.json';
import { CURATED_OBJECTS } from './curated';
import type { CatalogName, DeepSkyObject, ObjectType } from '../types';

type CatalogRow = [
  string,
  string,
  string[],
  ObjectType,
  number,
  number,
  number | null,
  number | null,
  number,
  number,
  string,
  string[],
  CatalogName[],
];

export const CATALOGS: CatalogName[] = ['Messier', 'NGC', 'IC', 'Sh2', 'Abell', 'Zusatzkatalog'];
export const CATALOG_LABELS: Record<CatalogName, string> = {
  Messier: 'Messier',
  NGC: 'NGC',
  IC: 'IC',
  Sh2: 'Sharpless 2',
  Abell: 'Abell-PN',
  Zusatzkatalog: 'Weitere',
};

function normalizeDesignation(value: string): string {
  return value
    .toLocaleUpperCase('de')
    .replace(/SHARPLESS\s*2/g, 'SH2')
    .replace(/SH\s*2/g, 'SH2')
    .replace(/[^A-Z0-9]/g, '')
    .replace(/^M0+/, 'M')
    .replace(/^NGC0+/, 'NGC')
    .replace(/^IC0+/, 'IC')
    .replace(/^SH20+/, 'SH2')
    .replace(/^ABELL0+/, 'ABELL');
}

function catalogueKeys(object: DeepSkyObject): string[] {
  return [object.id, object.name, ...object.aliases]
    .map(normalizeDesignation)
    .filter(key => /^(?:M|NGC|IC|SH2|ABELL)\d+[A-Z]*$/.test(key));
}

function inferCatalogs(values: string[]): CatalogName[] {
  const result = new Set<CatalogName>();
  for (const raw of values) {
    const value = normalizeDesignation(raw);
    if (/^M\d+/.test(value)) result.add('Messier');
    if (/^NGC\d+/.test(value)) result.add('NGC');
    if (/^IC\d+/.test(value)) result.add('IC');
    if (/^SH2\d+/.test(value)) result.add('Sh2');
    if (/^ABELL\d+/.test(value)) result.add('Abell');
  }
  if (!result.size) result.add('Zusatzkatalog');
  return [...result];
}

function fromRow(row: CatalogRow): DeepSkyObject {
  return {
    id: row[0],
    name: row[1],
    aliases: row[2],
    type: row[3],
    raHours: row[4],
    decDeg: row[5],
    magnitude: row[6] ?? undefined,
    surfaceBrightness: row[7] ?? undefined,
    majorArcMin: row[8],
    minorArcMin: row[9],
    constellation: row[10],
    recommendedFilters: row[11],
    catalogs: row[12],
  };
}

function mergeObjects(primary: DeepSkyObject, addition: DeepSkyObject, preferAddition = false): DeepSkyObject {
  const pick = <T,>(first: T | undefined, second: T | undefined) => preferAddition ? (second ?? first) : (first ?? second);
  return {
    ...primary,
    name: preferAddition ? addition.name : primary.name,
    aliases: [...new Set([...primary.aliases, addition.name, ...addition.aliases])],
    type: preferAddition ? addition.type : primary.type,
    catalogs: [...new Set([...primary.catalogs, ...addition.catalogs])],
    raHours: preferAddition ? addition.raHours : primary.raHours,
    decDeg: preferAddition ? addition.decDeg : primary.decDeg,
    magnitude: pick(primary.magnitude, addition.magnitude),
    surfaceBrightness: pick(primary.surfaceBrightness, addition.surfaceBrightness),
    majorArcMin: preferAddition && addition.majorArcMin > 0 ? addition.majorArcMin : (primary.majorArcMin || addition.majorArcMin),
    minorArcMin: preferAddition && addition.minorArcMin > 0 ? addition.minorArcMin : (primary.minorArcMin || addition.minorArcMin),
    constellation: preferAddition && addition.constellation !== '–' ? addition.constellation : (primary.constellation !== '–' ? primary.constellation : addition.constellation),
    recommendedFilters: [...new Set(preferAddition ? addition.recommendedFilters : [...primary.recommendedFilters, ...addition.recommendedFilters])],
  };
}

function buildCatalog(): DeepSkyObject[] {
  const result: DeepSkyObject[] = [];
  const keyMap = new Map<string, number>();

  const insert = (object: DeepSkyObject, preferAddition = false) => {
    const keys = catalogueKeys(object);
    const existingIndex = keys.map(key => keyMap.get(key)).find((value): value is number => value != null);
    if (existingIndex != null) {
      result[existingIndex] = mergeObjects(result[existingIndex], object, preferAddition);
      for (const key of catalogueKeys(result[existingIndex])) keyMap.set(key, existingIndex);
      return;
    }
    const index = result.length;
    result.push(object);
    for (const key of keys) keyMap.set(key, index);
  };

  for (const row of catalogRows as CatalogRow[]) insert(fromRow(row));

  for (const curated of CURATED_OBJECTS) {
    const object: DeepSkyObject = {
      ...curated,
      type: curated.type as ObjectType,
      catalogs: inferCatalogs([curated.id, curated.name, ...curated.aliases]),
    };
    insert(object, true);
  }

  return result;
}

export const OBJECTS = buildCatalog();

const typeOrder: ObjectType[] = [
  'Emissionsnebel', 'Reflexionsnebel', 'Planetarischer Nebel', 'Supernovaüberrest',
  'Galaxie', 'Galaxienpaar', 'Galaxiengruppe', 'Kugelsternhaufen', 'Offener Sternhaufen',
  'Sternhaufen mit Nebel', 'Sternassoziation', 'Nebel', 'Dunkelnebel', 'Stern',
  'Doppelstern', 'Nova', 'Sonstiges',
];

const existingTypes = new Set(OBJECTS.map(object => object.type));
export const OBJECT_TYPES = typeOrder.filter(type => existingTypes.has(type));
export const DEFAULT_OBJECT_TYPES = OBJECT_TYPES.filter(type => !['Stern', 'Doppelstern', 'Nova', 'Sonstiges'].includes(type));

export const CATALOG_COUNTS = Object.fromEntries(
  CATALOGS.map(catalog => [catalog, OBJECTS.filter(object => object.catalogs.includes(catalog)).length]),
) as Record<CatalogName, number>;
