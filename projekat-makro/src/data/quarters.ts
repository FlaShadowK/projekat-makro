/**
 * Sweden quarterly macro data 2023 → 2025 budget projection.
 * Sources: Eurostat (nama_10_gdp), SCB, IMF WEO Apr 2025, Government.se Budget Bill 2025.
 *
 * All historical values are real QoQ growth (% change vs previous quarter).
 * 2025 is the budget projection (annual figure, marked as projection).
 */

export type QuarterKey =
  | 'Q1-2023'
  | 'Q2-2023'
  | 'Q3-2023'
  | 'Q4-2023'
  | 'Q1-2024'
  | 'Q2-2024'
  | 'Q3-2024'
  | 'Q4-2024'
  | 'Y-2025';

export interface QuarterData {
  key: QuarterKey;
  label: string;
  short: string;
  isProjection: boolean;
  /** Real GDP growth, QoQ %, except Y-2025 which is annual projection */
  gdpGrowth: number;
  /** Inflation (HICP, % YoY) */
  inflation: number;
  /** Unemployment rate, % */
  unemployment: number;
  /** Riksbank policy rate, % */
  policyRate: number;
  /** GDP composition by expenditure method, share of GDP, summing ~100 */
  components: {
    C: number; // household consumption
    I: number; // investment
    G: number; // government
    NX: number; // net exports
  };
  /** Net exports in billion SEK (annualised) */
  netExportsBnSEK: number;
  /** GDP per capita PPS index, EU=100 */
  gdpPerCapitaPPS: number;
}

export const QUARTERS: QuarterData[] = [
  {
    key: 'Q1-2023',
    label: 'Q1 2023',
    short: 'Q1·23',
    isProjection: false,
    gdpGrowth: 0.7,
    inflation: 9.4,
    unemployment: 7.5,
    policyRate: 3.0,
    components: { C: 44.8, I: 25.6, G: 25.4, NX: 4.2 },
    netExportsBnSEK: 11.0,
    gdpPerCapitaPPS: 114,
  },
  {
    key: 'Q2-2023',
    label: 'Q2 2023',
    short: 'Q2·23',
    isProjection: false,
    gdpGrowth: -0.4,
    inflation: 9.7,
    unemployment: 7.6,
    policyRate: 3.5,
    components: { C: 44.0, I: 24.9, G: 25.6, NX: 5.5 },
    netExportsBnSEK: 14.2,
    gdpPerCapitaPPS: 114,
  },
  {
    key: 'Q3-2023',
    label: 'Q3 2023',
    short: 'Q3·23',
    isProjection: false,
    gdpGrowth: 0.2,
    inflation: 6.5,
    unemployment: 7.7,
    policyRate: 4.0,
    components: { C: 43.7, I: 24.5, G: 25.6, NX: 6.2 },
    netExportsBnSEK: 16.0,
    gdpPerCapitaPPS: 114,
  },
  {
    key: 'Q4-2023',
    label: 'Q4 2023',
    short: 'Q4·23',
    isProjection: false,
    gdpGrowth: -0.6,
    inflation: 4.4,
    unemployment: 7.9,
    policyRate: 4.0,
    components: { C: 43.4, I: 23.9, G: 26.0, NX: 6.7 },
    netExportsBnSEK: 4.7,
    gdpPerCapitaPPS: 114,
  },
  {
    key: 'Q1-2024',
    label: 'Q1 2024',
    short: 'Q1·24',
    isProjection: false,
    gdpGrowth: 0.7,
    inflation: 3.9,
    unemployment: 8.0,
    policyRate: 4.0,
    components: { C: 43.6, I: 24.0, G: 26.1, NX: 6.3 },
    netExportsBnSEK: 15.8,
    gdpPerCapitaPPS: 114,
  },
  {
    key: 'Q2-2024',
    label: 'Q2 2024',
    short: 'Q2·24',
    isProjection: false,
    gdpGrowth: 0.2,
    inflation: 2.6,
    unemployment: 8.4,
    policyRate: 3.75,
    components: { C: 43.8, I: 24.2, G: 26.1, NX: 5.9 },
    netExportsBnSEK: 16.1,
    gdpPerCapitaPPS: 114,
  },
  {
    key: 'Q3-2024',
    label: 'Q3 2024',
    short: 'Q3·24',
    isProjection: false,
    gdpGrowth: 0.3,
    inflation: 1.6,
    unemployment: 8.5,
    policyRate: 3.25,
    components: { C: 44.0, I: 24.4, G: 26.1, NX: 5.5 },
    netExportsBnSEK: 17.2,
    gdpPerCapitaPPS: 114,
  },
  {
    key: 'Q4-2024',
    label: 'Q4 2024',
    short: 'Q4·24',
    isProjection: false,
    gdpGrowth: 0.8,
    inflation: 1.5,
    unemployment: 8.5,
    policyRate: 2.5,
    components: { C: 44.3, I: 24.6, G: 26.1, NX: 5.0 },
    netExportsBnSEK: 18.4,
    gdpPerCapitaPPS: 114,
  },
  {
    key: 'Y-2025',
    label: '2025 (Projection)',
    short: '2025·P',
    isProjection: true,
    gdpGrowth: 1.5,
    inflation: 1.9,
    unemployment: 8.1,
    policyRate: 2.0,
    components: { C: 44.6, I: 25.0, G: 26.4, NX: 4.0 },
    netExportsBnSEK: 78.0,
    gdpPerCapitaPPS: 115,
  },
];

export const QUARTER_INDEX_BY_KEY: Record<QuarterKey, number> = QUARTERS.reduce(
  (acc, q, i) => {
    acc[q.key] = i;
    return acc;
  },
  {} as Record<QuarterKey, number>,
);

/** Annual roll-up for the components-detail cards. */
export const ANNUAL_COMPONENTS = {
  '2023': {
    C_growth: -2.5,
    I_growth: -5.0,
    G_share_pp: 25.4,
    NX_bnSEK: 45.9,
  },
  '2024': {
    C_growth: 0.7,
    I_growth: 1.8,
    G_share_pp: 26.1,
    NX_bnSEK: 67.5,
  },
  '2025P': {
    C_growth: 2.4,
    I_growth: 2.6,
    G_share_pp: 26.4,
    NX_bnSEK: 78.0,
  },
} as const;
