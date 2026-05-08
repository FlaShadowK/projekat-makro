/**
 * Scandi-Scan — Sweden vs nordic neighbours + EU average.
 * Sources: IMF WEO Apr 2025, Eurostat (nama_10_gdp), OECD Economic Surveys 2025.
 */

export interface CountryStats {
  code: string;
  name: string;
  flag: string;
  desc: string;
  isSelf?: boolean;
  /** GDP per capita 2024 (USD nominal, thousand) */
  gdpPerCapita: number;
  /** Public spending, % of GDP 2025 */
  pubSpendingPctGDP: number;
  /** Public debt, % GDP 2025 */
  publicDebtPctGDP: number;
  /** Real GDP growth 2025 projection, % */
  growth2025: number;
  /** Defence spending, % GDP 2025 */
  defencePctGDP: number;
  /** Inflation 2025, % */
  inflation2025: number;
}

/**
 * SVG flag fragments — minimalist nordic crosses.
 * Used as inline backgrounds via CSS gradients.
 */
export const COUNTRIES: CountryStats[] = [
  {
    code: 'SE',
    name: 'Sweden',
    flag: 'linear-gradient(90deg,transparent 38%,#fecc00 38% 48%,transparent 48%),linear-gradient(180deg,transparent 38%,#fecc00 38% 56%,transparent 56%),#006aa7',
    desc: 'Low debt, high spending. Resilient open economy with green-tech edge.',
    isSelf: true,
    gdpPerCapita: 66.2,
    pubSpendingPctGDP: 50,
    publicDebtPctGDP: 32,
    growth2025: 1.5,
    defencePctGDP: 2.4,
    inflation2025: 1.9,
  },
  {
    code: 'DK',
    name: 'Denmark',
    flag: 'linear-gradient(90deg,transparent 33%,#ffffff 33% 43%,transparent 43%),linear-gradient(180deg,transparent 38%,#ffffff 38% 56%,transparent 56%),#c8102e',
    desc: 'Tight fiscal discipline, frequent budget surpluses. Pharma-driven growth.',
    gdpPerCapita: 71.8,
    pubSpendingPctGDP: 49,
    publicDebtPctGDP: 30,
    growth2025: 1.7,
    defencePctGDP: 2.4,
    inflation2025: 1.8,
  },
  {
    code: 'NO',
    name: 'Norway',
    flag: 'linear-gradient(90deg,transparent 33%,#ffffff 33% 43%,transparent 43%),linear-gradient(180deg,transparent 38%,#ffffff 38% 56%,transparent 56%),#ba0c2f',
    desc: 'Backed by USD 1.7T sovereign wealth fund — net creditor, not debtor.',
    gdpPerCapita: 87.0,
    pubSpendingPctGDP: 52,
    publicDebtPctGDP: 40,
    growth2025: 1.2,
    defencePctGDP: 2.2,
    inflation2025: 2.6,
  },
  {
    code: 'FI',
    name: 'Finland',
    flag: 'linear-gradient(90deg,transparent 30%,#003580 30% 40%,transparent 40%),linear-gradient(180deg,transparent 38%,#003580 38% 56%,transparent 56%),#ffffff',
    desc: 'Closest structural twin. Heavier debt load, slower demographics.',
    gdpPerCapita: 56.4,
    pubSpendingPctGDP: 53,
    publicDebtPctGDP: 76,
    growth2025: 1.1,
    defencePctGDP: 2.4,
    inflation2025: 2.0,
  },
  {
    code: 'EU',
    name: 'EU Average',
    flag: 'radial-gradient(circle at 50% 50%,#ffcc00 0 12%,transparent 12%),#003399',
    desc: 'Reference benchmark — 27 member states.',
    gdpPerCapita: 45.0,
    pubSpendingPctGDP: 49,
    publicDebtPctGDP: 82,
    growth2025: 1.4,
    defencePctGDP: 1.9,
    inflation2025: 2.1,
  },
];

/** Metrics + min/max for the radial bar comparison */
export const COMPARE_METRICS: {
  key: keyof Pick<
    CountryStats,
    | 'gdpPerCapita'
    | 'pubSpendingPctGDP'
    | 'publicDebtPctGDP'
    | 'growth2025'
    | 'defencePctGDP'
  >;
  label: string;
  unit: string;
  min: number;
  max: number;
  // false ⇒ lower is better (e.g. debt)
  positive: boolean;
}[] = [
  { key: 'gdpPerCapita', label: 'GDP / capita', unit: 'k$', min: 30, max: 100, positive: true },
  { key: 'growth2025', label: 'Growth 2025', unit: '%', min: 0, max: 3, positive: true },
  { key: 'pubSpendingPctGDP', label: 'Public spending', unit: '% GDP', min: 35, max: 60, positive: true },
  { key: 'publicDebtPctGDP', label: 'Public debt', unit: '% GDP', min: 0, max: 100, positive: false },
  { key: 'defencePctGDP', label: 'Defence', unit: '% GDP', min: 1, max: 3.5, positive: true },
];
