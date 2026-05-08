/**
 * Per-region (län) economic estimates per quarter / year.
 *
 * Sources & method:
 *   - Population & GRP: SCB Regional Accounts 2023 (BRP per län)
 *   - Tax revenue: Skatteverket allocations + SCB municipality tax bases
 *   - Sector mix: SCB Regional Accounts (kept stable across quarters; share by GVA)
 *   - Quarter signal: each county's growth signal is anchored to national QoQ growth
 *     (QUARTERS[].gdpGrowth) and modulated by the region's structural cycle
 *     (e.g. Norrbotten/Västerbotten boosted by green-steel & Northvolt CAPEX).
 *
 * GRP figures are billions of SEK at 2024 prices, annualised.
 * For quarter snapshots we report the annualised value scaled by a quarterly
 * growth factor (so the slider can show evolution).
 */

import type { QuarterKey } from './quarters';

export interface RegionStatic {
  code: string;
  /** Annual GRP (regional GDP) in bn SEK, 2024 baseline */
  grpBnSEK: number;
  /** Per-capita GRP, in thousand SEK */
  grpPerCapita: number;
  /** Annual state tax revenue raised in this region, bn SEK 2024 */
  taxRevenueBnSEK: number;
  /** Annual public spending allocated to / inside this region, bn SEK 2024 */
  publicSpendBnSEK: number;
  /** Sector composition (% of GVA, sums to ~100) */
  sectors: {
    services: number;
    industry: number;
    construction: number;
    primary: number;
    public: number;
  };
  /** Structural growth bias — added to national growth signal */
  growthBias: number;
}

/** Sector breakdown is rough but realistic for each county — Stockholm
 *  service-heavy, Norrbotten industry-heavy, Jämtland primary-heavy etc. */
export const REGION_STATIC: Record<string, RegionStatic> = {
  SE11: { code: 'SE11', grpBnSEK: 605,  grpPerCapita: 425, taxRevenueBnSEK: 215, publicSpendBnSEK: 250,
          sectors: { services: 64, industry: 18, construction: 8, primary: 3, public: 7 }, growthBias: 0.0 },
  SE12: { code: 'SE12', grpBnSEK: 60,   grpPerCapita: 380, taxRevenueBnSEK: 18,  publicSpendBnSEK: 28,
          sectors: { services: 58, industry: 22, construction: 7, primary: 4, public: 9 }, growthBias: -0.05 },
  SE13: { code: 'SE13', grpBnSEK: 80,   grpPerCapita: 388, taxRevenueBnSEK: 24,  publicSpendBnSEK: 36,
          sectors: { services: 55, industry: 28, construction: 7, primary: 5, public: 5 }, growthBias: -0.05 },
  SE14: { code: 'SE14', grpBnSEK: 130,  grpPerCapita: 380, taxRevenueBnSEK: 42,  publicSpendBnSEK: 56,
          sectors: { services: 60, industry: 22, construction: 8, primary: 4, public: 6 }, growthBias: 0.05 },
  SE15: { code: 'SE15', grpBnSEK: 90,   grpPerCapita: 365, taxRevenueBnSEK: 27,  publicSpendBnSEK: 42,
          sectors: { services: 57, industry: 24, construction: 7, primary: 5, public: 7 }, growthBias: 0.0 },
  SE16: { code: 'SE16', grpBnSEK: 145,  grpPerCapita: 395, taxRevenueBnSEK: 47,  publicSpendBnSEK: 60,
          sectors: { services: 56, industry: 27, construction: 8, primary: 3, public: 6 }, growthBias: 0.05 },
  SE17: { code: 'SE17', grpBnSEK: 815,  grpPerCapita: 464, taxRevenueBnSEK: 295, publicSpendBnSEK: 305,
          sectors: { services: 60, industry: 24, construction: 7, primary: 2, public: 7 }, growthBias: 0.10 },
  SE18: { code: 'SE18', grpBnSEK: 195,  grpPerCapita: 416, taxRevenueBnSEK: 64,  publicSpendBnSEK: 78,
          sectors: { services: 60, industry: 22, construction: 7, primary: 3, public: 8 }, growthBias: 0.05 },
  SE19: { code: 'SE19', grpBnSEK: 22,   grpPerCapita: 360, taxRevenueBnSEK: 6,   publicSpendBnSEK: 12,
          sectors: { services: 64, industry: 12, construction: 8, primary: 8, public: 8 }, growthBias: -0.10 },
  SE20: { code: 'SE20', grpBnSEK: 120,  grpPerCapita: 393, taxRevenueBnSEK: 38,  publicSpendBnSEK: 50,
          sectors: { services: 58, industry: 24, construction: 7, primary: 4, public: 7 }, growthBias: 0.0 },
  SE21: { code: 'SE21', grpBnSEK: 1495, grpPerCapita: 619, taxRevenueBnSEK: 580, publicSpendBnSEK: 470,
          sectors: { services: 78, industry: 9,  construction: 6, primary: 1, public: 6 }, growthBias: 0.20 },
  SE22: { code: 'SE22', grpBnSEK: 200,  grpPerCapita: 494, taxRevenueBnSEK: 70,  publicSpendBnSEK: 78,
          sectors: { services: 70, industry: 14, construction: 7, primary: 2, public: 7 }, growthBias: 0.10 },
  SE23: { code: 'SE23', grpBnSEK: 122,  grpPerCapita: 435, taxRevenueBnSEK: 41,  publicSpendBnSEK: 50,
          sectors: { services: 55, industry: 30, construction: 7, primary: 2, public: 6 }, growthBias: 0.05 },
  SE24: { code: 'SE24', grpBnSEK: 130,  grpPerCapita: 422, taxRevenueBnSEK: 43,  publicSpendBnSEK: 56,
          sectors: { services: 60, industry: 23, construction: 8, primary: 3, public: 6 }, growthBias: 0.0 },
  SE25: { code: 'SE25', grpBnSEK: 110,  grpPerCapita: 390, taxRevenueBnSEK: 35,  publicSpendBnSEK: 50,
          sectors: { services: 55, industry: 27, construction: 8, primary: 4, public: 6 }, growthBias: -0.05 },
  SE26: { code: 'SE26', grpBnSEK: 115,  grpPerCapita: 396, taxRevenueBnSEK: 36,  publicSpendBnSEK: 52,
          sectors: { services: 56, industry: 25, construction: 7, primary: 5, public: 7 }, growthBias: 0.0 },
  SE27: { code: 'SE27', grpBnSEK: 110,  grpPerCapita: 384, taxRevenueBnSEK: 34,  publicSpendBnSEK: 50,
          sectors: { services: 54, industry: 28, construction: 7, primary: 4, public: 7 }, growthBias: 0.0 },
  SE28: { code: 'SE28', grpBnSEK: 50,   grpPerCapita: 379, taxRevenueBnSEK: 14,  publicSpendBnSEK: 26,
          sectors: { services: 56, industry: 18, construction: 8, primary: 11, public: 7 }, growthBias: -0.05 },
  SE29: { code: 'SE29', grpBnSEK: 95,   grpPerCapita: 388, taxRevenueBnSEK: 30,  publicSpendBnSEK: 44,
          sectors: { services: 55, industry: 25, construction: 8, primary: 5, public: 7 }, growthBias: 0.05 },
  SE30: { code: 'SE30', grpBnSEK: 130,  grpPerCapita: 469, taxRevenueBnSEK: 42,  publicSpendBnSEK: 54,
          sectors: { services: 56, industry: 28, construction: 8, primary: 3, public: 5 }, growthBias: 0.20 },
  SE31: { code: 'SE31', grpBnSEK: 145,  grpPerCapita: 580, taxRevenueBnSEK: 48,  publicSpendBnSEK: 58,
          sectors: { services: 50, industry: 35, construction: 7, primary: 3, public: 5 }, growthBias: 0.30 },
};

/**
 * Compute per-region snapshot for the selected quarter.
 *
 * Approach: take the national QoQ growth, add the structural growth bias for
 * that region, and apply it as a small multiplicative adjustment on top of the
 * 2024 baseline. For 2025 (projection) we apply the annualised projection
 * growth (~1.5%) plus bias.
 *
 * Returns numbers consistent across the slider so the choropleth and detail
 * panel both pull from the same source of truth.
 */
export interface RegionSnapshot extends RegionStatic {
  growthQoQ: number; // % QoQ for that region in this period
  grpBnSEK_q: number; // GRP in this quarter (annualised) bn SEK
  taxRevenueBnSEK_q: number;
  publicSpendBnSEK_q: number;
  /** Activity intensity 0..1 used for the choropleth color */
  intensity: number;
}

export function regionSnapshot(
  code: string,
  nationalGrowth: number,
  isProjection: boolean,
): RegionSnapshot {
  const r = REGION_STATIC[code];
  const growth = nationalGrowth + r.growthBias;
  // annual scaling factor (small). For a quarter, just keep value close to baseline.
  const factor = isProjection
    ? 1 + growth / 100 // annual growth
    : 1 + growth / 400; // quarter ≈ growth/4 cumulative (kept small for legibility)
  const grp = r.grpBnSEK * factor;
  const tax = r.taxRevenueBnSEK * factor;
  const spend = r.publicSpendBnSEK * (1 + (isProjection ? 0.015 : 0.005));
  // Intensity: blend of growth signal and structural per-capita strength
  const growthNorm = (growth + 0.5) / 2.0; // map [-0.5..1.5] -> [0..1]
  const wealthNorm = Math.min(1, Math.max(0, (r.grpPerCapita - 320) / 320));
  let intensity = 0.55 * growthNorm + 0.45 * wealthNorm;
  if (isProjection) intensity = Math.min(1, intensity + 0.08);
  intensity = Math.max(0.05, Math.min(1, intensity));
  return {
    ...r,
    growthQoQ: growth,
    grpBnSEK_q: grp,
    taxRevenueBnSEK_q: tax,
    publicSpendBnSEK_q: spend,
    intensity,
  };
}

/** Snapshots for all regions in one go. */
export function allRegionSnapshots(
  nationalGrowth: number,
  isProjection: boolean,
): Record<string, RegionSnapshot> {
  const out: Record<string, RegionSnapshot> = {};
  for (const code of Object.keys(REGION_STATIC)) {
    out[code] = regionSnapshot(code, nationalGrowth, isProjection);
  }
  return out;
}

/** All available quarter keys, re-exported for convenience. */
export type { QuarterKey };
