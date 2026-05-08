import { useMemo } from 'react';
import { COUNTY_SHAPES } from '../data/county_shapes';
import { COUNTIES } from '../data/counties';
import { regionSnapshot } from '../data/region_data';
import type { QuarterData } from '../data/quarters';

interface Props {
  code: string;
  quarter: QuarterData;
}

const SECTOR_COLORS: Record<string, string> = {
  services: '#00e5ff',
  industry: '#a855f7',
  construction: '#ffb84d',
  primary: '#39ff9c',
  public: '#ff4d6d',
};

const SECTOR_LABELS: Record<string, string> = {
  services: 'Services',
  industry: 'Industry',
  construction: 'Construction',
  primary: 'Primary',
  public: 'Public sector',
};

function fmtBn(v: number): string {
  if (v >= 1000) return (v / 1000).toFixed(2) + ' tn';
  if (v >= 100) return v.toFixed(0) + ' bn';
  return v.toFixed(1) + ' bn';
}

export default function RegionPanel({ code, quarter }: Props) {
  const meta = COUNTIES.find((c) => c.code === code);
  const shape = COUNTY_SHAPES.find((c) => c.code === code);
  const snap = useMemo(
    () => regionSnapshot(code, quarter.gdpGrowth, quarter.isProjection),
    [code, quarter],
  );

  if (!meta || !shape) return null;

  const fiscalNet = snap.taxRevenueBnSEK_q - snap.publicSpendBnSEK_q;
  const fiscalSign = fiscalNet >= 0 ? '+' : '−';

  return (
    <div className="region-panel">
      <header className="region-head">
        <div className="region-num">#{meta.number}</div>
        <div>
          <h3 className="region-name">{meta.name}</h3>
          <div className="region-cap">
            Capital · {meta.capital} · {meta.pop.toLocaleString()}k people
          </div>
        </div>
      </header>

      <p className="region-blurb">{meta.blurb}.</p>

      <div className="region-kpis">
        <RegionKpi
          label="GRP (annualised)"
          value={fmtBn(snap.grpBnSEK_q)}
          unit="SEK"
        />
        <RegionKpi
          label="GRP / capita"
          value={`${snap.grpPerCapita}`}
          unit="k SEK"
        />
        <RegionKpi
          label="Growth"
          value={`${snap.growthQoQ >= 0 ? '+' : ''}${snap.growthQoQ.toFixed(2)}%`}
          tone={snap.growthQoQ >= 0 ? 'good' : 'bad'}
          unit={quarter.isProjection ? 'YoY' : 'QoQ'}
        />
        <RegionKpi
          label="Activity index"
          value={`${(snap.intensity * 100).toFixed(0)}`}
          unit="/ 100"
        />
      </div>

      <div className="region-fiscal">
        <h4 className="region-sub">Fiscal balance — region only</h4>
        <div className="region-fiscal-row">
          <div>
            <div className="lbl">Tax revenue raised</div>
            <div className="v cyan">{fmtBn(snap.taxRevenueBnSEK_q)} SEK</div>
          </div>
          <div>
            <div className="lbl">Public spend allocated</div>
            <div className="v amber">{fmtBn(snap.publicSpendBnSEK_q)} SEK</div>
          </div>
          <div>
            <div className="lbl">Net contribution</div>
            <div
              className="v"
              style={{ color: fiscalNet >= 0 ? 'var(--neon-green)' : 'var(--neon-red)' }}
            >
              {fiscalSign}
              {fmtBn(Math.abs(fiscalNet))} SEK
            </div>
          </div>
        </div>
      </div>

      <div className="region-sectors">
        <h4 className="region-sub">Sector mix · % of GVA</h4>
        <div className="sector-bar">
          {(['services', 'industry', 'construction', 'primary', 'public'] as const).map((k) => {
            const pct = snap.sectors[k];
            return (
              <div
                key={k}
                className="sector-seg"
                style={{
                  width: `${pct}%`,
                  background: SECTOR_COLORS[k],
                  boxShadow: `inset 0 0 12px rgba(0,0,0,0.25), 0 0 8px ${SECTOR_COLORS[k]}55`,
                }}
                title={`${SECTOR_LABELS[k]}: ${pct}%`}
              />
            );
          })}
        </div>
        <div className="sector-legend">
          {(['services', 'industry', 'construction', 'primary', 'public'] as const).map((k) => (
            <span key={k} className="sector-leg-item">
              <span
                className="dot"
                style={{ background: SECTOR_COLORS[k], boxShadow: `0 0 8px ${SECTOR_COLORS[k]}` }}
              />
              {SECTOR_LABELS[k]}
              <strong>{snap.sectors[k]}%</strong>
            </span>
          ))}
        </div>
      </div>

      <div className="region-mini-card">
        <div>
          <div className="lbl">Population</div>
          <div className="v">{meta.pop.toLocaleString()} k</div>
        </div>
        <div>
          <div className="lbl">Centroid</div>
          <div className="v mono">
            {meta.lat.toFixed(2)}°N · {meta.lon.toFixed(2)}°E
          </div>
        </div>
        <div>
          <div className="lbl">Quarter</div>
          <div className="v">{quarter.label}</div>
        </div>
      </div>
    </div>
  );
}

function RegionKpi({
  label,
  value,
  unit,
  tone,
}: {
  label: string;
  value: string;
  unit?: string;
  tone?: 'good' | 'bad';
}) {
  return (
    <div className="region-kpi">
      <div className="lbl">{label}</div>
      <div
        className="v"
        style={{
          color:
            tone === 'good'
              ? 'var(--neon-green)'
              : tone === 'bad'
                ? 'var(--neon-red)'
                : undefined,
        }}
      >
        {value}
        {unit && <span className="unit"> {unit}</span>}
      </div>
    </div>
  );
}
