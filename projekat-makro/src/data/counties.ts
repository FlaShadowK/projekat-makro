/**
 * Swedish counties (län) — with simplified geography for the dashboard map.
 * Coordinates are approximate centroid lat/lon; population in thousands (SCB 2024).
 *
 * baseHeat captures each county's structural economic momentum (0..1) — Stockholm,
 * Västra Götaland, Norrbotten (green-steel) and Västerbotten (Northvolt) lead.
 * Each quarter then applies a multiplier in the map component to derive the
 * final colour intensity.
 */

export interface County {
  code: string;
  name: string;
  capital: string;
  number: number;
  pop: number;
  lat: number;
  lon: number;
  /** Headline industries / one-line description */
  blurb: string;
  /** Structural baseline activity, 0..1 */
  baseHeat: number;
}

export const COUNTIES: County[] = [
  { code: 'SE11', name: 'Skåne',           capital: 'Malmö',       number: 1,  pop: 1425, lat: 55.9, lon: 13.6, blurb: 'Logistics & life-sciences gateway to the EU',     baseHeat: 0.62 },
  { code: 'SE12', name: 'Blekinge',        capital: 'Karlskrona',  number: 2,  pop: 159,  lat: 56.2, lon: 15.6, blurb: 'Naval & telecom hub',                              baseHeat: 0.42 },
  { code: 'SE13', name: 'Kronoberg',       capital: 'Växjö',       number: 3,  pop: 207,  lat: 56.9, lon: 14.8, blurb: 'Furniture & forest industries',                     baseHeat: 0.40 },
  { code: 'SE14', name: 'Halland',         capital: 'Halmstad',    number: 4,  pop: 343,  lat: 56.7, lon: 12.9, blurb: 'Coastal manufacturing',                             baseHeat: 0.50 },
  { code: 'SE15', name: 'Kalmar',          capital: 'Kalmar',      number: 5,  pop: 247,  lat: 56.9, lon: 16.4, blurb: 'Maritime & energy',                                 baseHeat: 0.42 },
  { code: 'SE16', name: 'Jönköping',       capital: 'Jönköping',   number: 6,  pop: 367,  lat: 57.8, lon: 14.2, blurb: 'Logistics core of southern SE',                     baseHeat: 0.55 },
  { code: 'SE17', name: 'Västra Götaland', capital: 'Göteborg',    number: 7,  pop: 1757, lat: 58.1, lon: 12.4, blurb: 'Volvo, Scania trucks, AstraZeneca',                 baseHeat: 0.78 },
  { code: 'SE18', name: 'Östergötland',    capital: 'Linköping',   number: 8,  pop: 469,  lat: 58.4, lon: 15.6, blurb: 'Aerospace (Saab) & defence',                        baseHeat: 0.60 },
  { code: 'SE19', name: 'Gotland',         capital: 'Visby',       number: 9,  pop: 61,   lat: 57.6, lon: 18.3, blurb: 'Tourism & limestone',                               baseHeat: 0.32 },
  { code: 'SE20', name: 'Södermanland',    capital: 'Nyköping',    number: 10, pop: 305,  lat: 58.9, lon: 16.8, blurb: 'Engineering corridor',                              baseHeat: 0.50 },
  { code: 'SE21', name: 'Stockholm',       capital: 'Stockholm',   number: 11, pop: 2415, lat: 59.3, lon: 18.1, blurb: 'Capital — finance, fintech, unicorns',              baseHeat: 0.95 },
  { code: 'SE22', name: 'Uppsala',         capital: 'Uppsala',     number: 12, pop: 405,  lat: 59.9, lon: 17.6, blurb: 'Pharma & university research',                      baseHeat: 0.65 },
  { code: 'SE23', name: 'Västmanland',     capital: 'Västerås',    number: 13, pop: 280,  lat: 59.6, lon: 16.5, blurb: 'ABB power grid & robotics',                         baseHeat: 0.55 },
  { code: 'SE24', name: 'Örebro',          capital: 'Örebro',      number: 14, pop: 308,  lat: 59.3, lon: 15.2, blurb: 'Logistics & food',                                  baseHeat: 0.50 },
  { code: 'SE25', name: 'Värmland',        capital: 'Karlstad',    number: 15, pop: 282,  lat: 59.6, lon: 13.5, blurb: 'Pulp & paper',                                      baseHeat: 0.45 },
  { code: 'SE26', name: 'Dalarna',         capital: 'Falun',       number: 16, pop: 290,  lat: 60.6, lon: 15.3, blurb: 'Mining & tourism',                                  baseHeat: 0.45 },
  { code: 'SE27', name: 'Gävleborg',       capital: 'Gävle',       number: 17, pop: 287,  lat: 61.3, lon: 16.5, blurb: 'Steel & forestry',                                  baseHeat: 0.48 },
  { code: 'SE28', name: 'Jämtland',        capital: 'Östersund',   number: 18, pop: 132,  lat: 63.2, lon: 14.6, blurb: 'Hydropower & winter tourism',                       baseHeat: 0.38 },
  { code: 'SE29', name: 'Västernorrland',  capital: 'Härnösand',   number: 19, pop: 245,  lat: 62.9, lon: 17.5, blurb: 'Forestry & data centres',                           baseHeat: 0.45 },
  { code: 'SE30', name: 'Västerbotten',    capital: 'Umeå',        number: 20, pop: 277,  lat: 64.4, lon: 19.6, blurb: 'Northvolt batteries & green hub',                   baseHeat: 0.72 },
  { code: 'SE31', name: 'Norrbotten',      capital: 'Luleå',       number: 21, pop: 250,  lat: 66.2, lon: 21.0, blurb: 'Green steel (HYBRIT/SSAB) & iron ore',              baseHeat: 0.85 },
];

/**
 * Bounding box used to project lat/lon to SVG.
 */
export const MAP_VIEW = {
  width: 400,
  height: 700,
  minLon: 10.5,
  maxLon: 24.5,
  minLat: 55.0,
  maxLat: 69.5,
} as const;

export function projectLatLon(lat: number, lon: number): [number, number] {
  const x = ((lon - MAP_VIEW.minLon) / (MAP_VIEW.maxLon - MAP_VIEW.minLon)) *
    MAP_VIEW.width;
  const y = ((MAP_VIEW.maxLat - lat) / (MAP_VIEW.maxLat - MAP_VIEW.minLat)) *
    MAP_VIEW.height;
  return [x, y];
}

/**
 * Rough Sweden outline — clockwise from south coast.
 * Not cartographically precise; styled as a stencil for the dashboard.
 */
export const SWEDEN_OUTLINE_LATLON: Array<[number, number]> = [
  [55.4, 12.9],
  [55.4, 14.5],
  [55.7, 14.7],
  [56.2, 16.2],
  [57.0, 16.8],
  [58.0, 17.3],
  [58.7, 17.6],
  [59.0, 18.3],
  [59.4, 18.6],
  [60.5, 17.5],
  [61.7, 17.4],
  [62.5, 17.9],
  [63.5, 19.6],
  [64.7, 21.1],
  [65.7, 22.3],
  [66.6, 23.7],
  [67.5, 23.6],
  [68.4, 23.4],
  [69.05, 21.1],
  [68.6, 19.7],
  [68.5, 18.0],
  [67.9, 16.4],
  [67.1, 15.4],
  [66.3, 14.7],
  [65.0, 13.0],
  [63.6, 12.0],
  [62.3, 12.0],
  [61.5, 12.3],
  [60.4, 11.8],
  [59.5, 11.6],
  [58.9, 11.2],
  [58.3, 11.3],
  [57.5, 11.8],
  [56.5, 12.5],
  [55.7, 12.7],
  [55.4, 12.9],
];

/**
 * Mix structural base heat with the quarter's growth signal.
 * growth in QoQ % space is roughly [-0.7..+0.9]; projection year is +1.5.
 * Output clamped 0..1.
 */
export function heatFor(base: number, growth: number, isProjection: boolean): number {
  // Map growth into roughly -0.25..+0.35
  let mod = Math.max(-0.25, Math.min(0.35, growth * 0.4));
  if (isProjection) mod += 0.12;
  return Math.max(0.05, Math.min(1, base + mod));
}
