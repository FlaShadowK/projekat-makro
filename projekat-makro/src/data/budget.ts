/**
 * Sweden state budget — 2025.
 * Source: Government.se Budget Bill for 2025 (Budgetpropositionen för 2025);
 * IMF WEO 2025; Eurostat gov_10q_ggfa.
 *
 * All values in billion SEK unless stated.
 */

export interface BudgetItem {
  key: string;
  name: string;
  bnSEK: number;
  pctGDP: number;
  tone: 'cyan' | 'defense' | 'green';
  note: string;
}

export const BUDGET_2025: BudgetItem[] = [
  {
    key: 'social',
    name: 'Social Protection',
    bnSEK: 1700,
    pctGDP: 27.5,
    tone: 'cyan',
    note: 'Pensions, family support, unemployment insurance',
  },
  {
    key: 'health',
    name: 'Healthcare',
    bnSEK: 520,
    pctGDP: 8.4,
    tone: 'cyan',
    note: 'Largely funded via regional landsting',
  },
  {
    key: 'education',
    name: 'Education',
    bnSEK: 380,
    pctGDP: 6.1,
    tone: 'cyan',
    note: 'Schools, universities, research grants',
  },
  {
    key: 'defense',
    name: 'Defence',
    bnSEK: 138,
    pctGDP: 2.4,
    tone: 'defense',
    note: 'NATO 2% target — fastest-growing line',
  },
  {
    key: 'infra',
    name: 'Infrastructure & Transport',
    bnSEK: 110,
    pctGDP: 1.8,
    tone: 'cyan',
    note: 'Rail, roads, electrification',
  },
  {
    key: 'green',
    name: 'Green Transition',
    bnSEK: 75,
    pctGDP: 1.2,
    tone: 'green',
    note: 'Decarbonising heavy industry, nuclear & wind',
  },
  {
    key: 'public',
    name: 'Public Order & Justice',
    bnSEK: 70,
    pctGDP: 1.1,
    tone: 'cyan',
    note: 'Police, courts, corrections',
  },
  {
    key: 'other',
    name: 'Other & General Services',
    bnSEK: 145,
    pctGDP: 2.3,
    tone: 'cyan',
    note: 'Foreign aid, administration, debt service',
  },
];

export const BUDGET_HEADLINE = {
  totalRevenuesBnSEK: 3050,
  totalExpendituresBnSEK: 3138,
  /** % of GDP */
  fiscalBalancePctGDP: -0.8,
  fiscalBalanceBnSEK: -88,
  publicDebtPctGDP: 32,
  gdpEstimateBnSEK: 6300,
} as const;

export interface RevenueItem {
  key: string;
  name: string;
  bnSEK: number;
  share: number;
  note: string;
}

export const REVENUE_2025: RevenueItem[] = [
  {
    key: 'income',
    name: 'Income & Corporate Tax',
    bnSEK: 1280,
    share: 42,
    note: 'Progressive personal + corporate income tax',
  },
  {
    key: 'vat',
    name: 'VAT (25 % standard)',
    bnSEK: 700,
    share: 23,
    note: 'One of the highest VAT rates in the EU',
  },
  {
    key: 'social',
    name: 'Social Contributions',
    bnSEK: 720,
    share: 24,
    note: 'Employer + employee payroll contributions',
  },
  {
    key: 'other',
    name: 'Excise & Other',
    bnSEK: 350,
    share: 11,
    note: 'Energy, alcohol, tobacco, financial taxes',
  },
];
