import { useState } from 'react';
import './App.css';
import {
  ANNUAL_COMPONENTS,
  QUARTERS,
} from './data/quarters';
import { BUDGET_2025, BUDGET_HEADLINE, REVENUE_2025 } from './data/budget';
import { FIKA_STATS } from './data/fika';
import TimeSlider from './components/TimeSlider';
import SwedenMap from './components/SwedenMap';
import DonutChart from './components/DonutChart';
import QuarterlyBars from './components/QuarterlyBars';
import Sparkline from './components/Sparkline';
import ScandiScan from './components/ScandiScan';

function App() {
  const [qIndex, setQIndex] = useState(7); // default to Q4 2024 (most recent actual)
  const q = QUARTERS[qIndex];

  // Series for sparklines (historical only)
  const histGdp = QUARTERS.filter((x) => !x.isProjection).map((x) => x.gdpGrowth);
  const histInf = QUARTERS.filter((x) => !x.isProjection).map((x) => x.inflation);
  const histRate = QUARTERS.filter((x) => !x.isProjection).map((x) => x.policyRate);
  const histUemp = QUARTERS.filter((x) => !x.isProjection).map((x) => x.unemployment);

  // Annual rollup keyed by which year the slider is in
  const yearKey =
    q.key === 'Y-2025'
      ? '2025P'
      : q.key.endsWith('2024')
        ? '2024'
        : '2023';
  const annual = ANNUAL_COMPONENTS[yearKey];

  // Budget bar maxima
  const maxBudget = Math.max(...BUDGET_2025.map((b) => b.bnSEK));

  return (
    <div className="app">
      {/* ============== HERO ============== */}
      <header className="hero">
        <div className="hero-row">
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="eyebrow">PROJECT · NORDIC PULSE</div>
            <h1 className="hero-title">Sweden 2023 → 2025</h1>
            <p className="hero-sub">
              An interactive macroeconomic dashboard tracking Sweden's GDP,
              budget composition, and fiscal trajectory through the post-Riksbank-tightening cycle —
              from the 2023 stagnation, through the 2024 recovery, and into the 2025 budget projection.
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="num">2.4%</span>
                <span className="label">Defence · % GDP 2025</span>
              </div>
              <div className="hero-stat">
                <span className="num" style={{ color: 'var(--neon-green)' }}>
                  +67.5B
                </span>
                <span className="label">Net Exports 2024 · SEK</span>
              </div>
              <div className="hero-stat">
                <span className="num" style={{ color: 'var(--neon-purple)' }}>
                  32%
                </span>
                <span className="label">Public Debt · % GDP</span>
              </div>
              <div className="hero-stat">
                <span className="num" style={{ color: 'var(--neon-amber)' }}>
                  114
                </span>
                <span className="label">PPS Index · EU=100</span>
              </div>
            </div>
          </div>
          <div className="hero-flag" aria-label="Flag of Sweden" />
        </div>
      </header>

      {/* ============== KPI STRIP ============== */}
      <section className="kpi-grid">
        <KpiCard
          label="GDP Growth (QoQ)"
          value={`${q.gdpGrowth >= 0 ? '+' : ''}${q.gdpGrowth.toFixed(1)}`}
          unit="%"
          deltaUp={q.gdpGrowth >= 0}
          delta={q.isProjection ? 'annual projection' : 'real, seasonally adj.'}
          spark={<Sparkline data={histGdp} color="#00e5ff" />}
        />
        <KpiCard
          label="HICP Inflation"
          value={q.inflation.toFixed(1)}
          unit="%"
          deltaUp={q.inflation < 4}
          delta={q.inflation < 2 ? 'below target' : q.inflation < 4 ? 'cooling' : 'elevated'}
          spark={<Sparkline data={histInf} color="#a855f7" />}
        />
        <KpiCard
          label="Riksbank Rate"
          value={q.policyRate.toFixed(2)}
          unit="%"
          deltaUp={q.policyRate < 3.5}
          delta={q.policyRate < 3 ? 'easing' : q.policyRate < 4 ? 'plateau' : 'tightening'}
          spark={<Sparkline data={histRate} color="#ffb84d" />}
        />
        <KpiCard
          label="Unemployment"
          value={q.unemployment.toFixed(1)}
          unit="%"
          deltaUp={q.unemployment < 8}
          delta="labour market lag"
          spark={<Sparkline data={histUemp} color="#39ff9c" />}
        />
      </section>

      {/* ============== TIMELINE ============== */}
      <TimeSlider index={qIndex} onChange={setQIndex} />

      {/* ============== MAP + DONUT ============== */}
      <div className="row row-2 mt-24">
        <div
          className={'panel' + (q.isProjection ? ' is-projection' : '')}
          style={{ minHeight: 600 }}
        >
          <h3 className="panel-title">Regional Activity Map</h3>
          <p className="panel-subtitle">
            21 Swedish counties (län). Node size = population · colour = relative
            economic activity for the selected period.
          </p>
          <SwedenMap quarter={q} />
        </div>

        <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 className="panel-title">GDP — Expenditure Method</h3>
          <p className="panel-subtitle">
            <code style={{
              fontFamily: 'var(--mono)',
              color: 'var(--text-bright)',
              padding: '2px 6px',
              borderRadius: 4,
              background: 'rgba(0,229,255,0.08)',
              border: '1px solid var(--border)',
            }}>
              GDP = C + I + G + (X − M)
            </code>
          </p>
          <DonutChart quarter={q} />

          <div
            style={{
              marginTop: 18,
              padding: 14,
              borderRadius: 10,
              background: 'rgba(5,8,15,0.4)',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                letterSpacing: '0.2em',
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              Net Exports (Annualised)
            </div>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 22,
                color: q.netExportsBnSEK > 0 ? 'var(--neon-green)' : 'var(--neon-red)',
                fontWeight: 600,
              }}
            >
              {q.netExportsBnSEK >= 0 ? '+' : ''}
              {q.netExportsBnSEK.toFixed(1)} <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>bn SEK</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============== QUARTERLY GDP BARS ============== */}
      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">02 · TIMELINE</div>
            <h2>Real GDP — All Quarters</h2>
          </div>
          <span className="tag">CLICK A BAR TO JUMP</span>
        </div>
        <div className="panel">
          <QuarterlyBars activeIndex={qIndex} onSelect={setQIndex} />
        </div>
      </section>

      {/* ============== COMPONENTS DETAIL ============== */}
      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">03 · COMPONENTS</div>
            <h2>Annual Drivers — {yearKey === '2025P' ? '2025 Projection' : yearKey}</h2>
          </div>
          <span className="tag">EXPENDITURE METHOD</span>
        </div>
        <div className="comp-grid">
          <CompCard
            kind="c"
            symbol="C"
            label="Consumption"
            value={`${annual.C_growth >= 0 ? '+' : ''}${annual.C_growth.toFixed(1)}%`}
            up={annual.C_growth >= 0}
            desc="Households shrank in 2023 as Riksbank rate hikes squeezed mortgages. Real wage gains of ~3.5% in 2024 brought spending back on-line."
          />
          <CompCard
            kind="i"
            symbol="I"
            label="Investment"
            value={`${annual.I_growth >= 0 ? '+' : ''}${annual.I_growth.toFixed(1)}%`}
            up={annual.I_growth >= 0}
            desc="Construction collapsed under expensive credit. Green-tech and infrastructure CAPEX is now leading the rebound."
          />
          <CompCard
            kind="g"
            symbol="G"
            label="Government"
            value={`${annual.G_share_pp.toFixed(1)}%`}
            up
            desc="Government share rose into the slowdown — defence buildouts post-NATO accession plus cyclical fiscal support."
          />
          <CompCard
            kind="nx"
            symbol="NX"
            label="Net Exports"
            value={`+${annual.NX_bnSEK.toFixed(1)}B SEK`}
            up
            desc="A weak krona made Swedish steel, vehicles, and pharma dramatically cheaper abroad — the brightest spot of the cycle."
          />
        </div>
      </section>

      {/* ============== BUDGET 2025 ============== */}
      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">04 · FISCAL</div>
            <h2>Budget 2025 — Projected Allocations</h2>
          </div>
          <span className="tag">PROJECTION · BUDGETPROPOSITIONEN</span>
        </div>
        <div className="budget-grid">
          <div className="panel is-projection">
            <h3 className="panel-title">Expenditure Breakdown</h3>
            <p className="panel-subtitle">
              Total: {BUDGET_HEADLINE.totalExpendituresBnSEK.toLocaleString()} bn SEK ·
              ~{(
                (BUDGET_HEADLINE.totalExpendituresBnSEK /
                  BUDGET_HEADLINE.gdpEstimateBnSEK) *
                100
              ).toFixed(0)}% of GDP
            </p>
            <div className="budget-bars">
              {BUDGET_2025.map((b) => (
                <div className="bbar" key={b.key}>
                  <span className="name">{b.name}</span>
                  <div className="track" title={b.note}>
                    <div
                      className={
                        'fill' +
                        (b.tone === 'defense'
                          ? ' defense'
                          : b.tone === 'green'
                            ? ' green'
                            : '')
                      }
                      style={{ width: `${(b.bnSEK / maxBudget) * 100}%` }}
                    />
                  </div>
                  <span className="v">{b.bnSEK} bn</span>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 14,
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: 'var(--text-dim)',
                letterSpacing: '0.1em',
              }}
            >
              <span style={{ color: 'var(--neon-red)' }}>■ DEFENCE</span> · the
              fastest-growing line ·{' '}
              <span style={{ color: 'var(--neon-green)' }}>■ GREEN</span>{' '}
              transition CAPEX
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="panel is-projection">
              <h3 className="panel-title">Revenue Mix</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                {REVENUE_2025.map((r) => (
                  <div
                    key={r.key}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 60px 70px',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--text)' }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{r.note}</div>
                    </div>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 3,
                        background: 'rgba(5,8,15,0.5)',
                        border: '1px solid var(--border)',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: `${r.share * 2.3}%`,
                          background:
                            'linear-gradient(90deg,var(--neon-cyan),var(--neon-purple))',
                          boxShadow: '0 0 8px rgba(0,229,255,0.45)',
                          borderRadius: 3,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: 13,
                        color: 'var(--text-bright)',
                        textAlign: 'right',
                      }}
                    >
                      {r.share}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel is-projection">
              <h3 className="panel-title">Fiscal Position</h3>
              <div className="fiscal-grid">
                <div className="fiscal-stat">
                  <div className="lbl">Balance</div>
                  <div className="v bad">
                    {BUDGET_HEADLINE.fiscalBalancePctGDP}% GDP
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 11,
                      color: 'var(--text-dim)',
                      marginTop: 2,
                    }}
                  >
                    ≈ {BUDGET_HEADLINE.fiscalBalanceBnSEK} bn SEK deficit
                  </div>
                </div>
                <div className="fiscal-stat">
                  <div className="lbl">Public Debt</div>
                  <div className="v good">
                    {BUDGET_HEADLINE.publicDebtPctGDP}% GDP
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 11,
                      color: 'var(--text-dim)',
                      marginTop: 2,
                    }}
                  >
                    vs ~82% EU average
                  </div>
                </div>
                <div className="fiscal-stat">
                  <div className="lbl">Total Revenues</div>
                  <div className="v">
                    {BUDGET_HEADLINE.totalRevenuesBnSEK.toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 11,
                      color: 'var(--text-dim)',
                      marginTop: 2,
                    }}
                  >
                    bn SEK
                  </div>
                </div>
                <div className="fiscal-stat">
                  <div className="lbl">Total Expenditures</div>
                  <div className="v">
                    {BUDGET_HEADLINE.totalExpendituresBnSEK.toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 11,
                      color: 'var(--text-dim)',
                      marginTop: 2,
                    }}
                  >
                    bn SEK
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== SCANDI-SCAN ============== */}
      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">05 · NORDIC SCAN</div>
            <h2>Sweden vs The North</h2>
          </div>
          <span className="tag">IMF · EUROSTAT 2025</span>
        </div>
        <ScandiScan />
      </section>

      {/* ============== FIKA ============== */}
      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">06 · CULTURE × ECONOMY</div>
            <h2>Fika — Soft Power, Hard Numbers</h2>
          </div>
          <span className="tag">CASE STUDY</span>
        </div>
        <div className="panel">
          <p
            style={{
              color: 'var(--text-dim)',
              fontSize: 14,
              maxWidth: 720,
              lineHeight: 1.6,
            }}
          >
            Fika — the institutionalised Swedish coffee break — is one of the
            quietest contributors to nordic productivity. Below: stats from
            Statistics Sweden, Karolinska Institute, and Stockholm Business
            School (2021–2024) showing how a 15-minute pause moves an economy.
          </p>
          <div className="fika-grid">
            {FIKA_STATS.map((s, i) => (
              <div key={i} className="fika-stat">
                <div className={`num ${s.tone}`}>{s.num}</div>
                <div className="lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="footer">
        <div className="sources">
          SOURCES · EUROSTAT · SCB · IMF WEO · GOVERNMENT.SE · OECD · KAROLINSKA
        </div>
        <div>
          NORDIC PULSE · Frontend dashboard · React · No backend required
        </div>
      </footer>
    </div>
  );
}

/* ============================================================
   Local sub-components
   ============================================================ */

function KpiCard({
  label,
  value,
  unit,
  deltaUp,
  delta,
  spark,
}: {
  label: string;
  value: string;
  unit?: string;
  deltaUp?: boolean;
  delta?: string;
  spark?: React.ReactNode;
}) {
  return (
    <div className="kpi">
      {spark}
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">
        {value}
        {unit && <span className="unit">{unit}</span>}
      </div>
      {delta && (
        <div className={'kpi-delta ' + (deltaUp ? 'up' : 'down')}>
          {deltaUp ? '▲' : '▼'} {delta}
        </div>
      )}
    </div>
  );
}

function CompCard({
  kind,
  symbol,
  label,
  value,
  up,
  desc,
}: {
  kind: 'c' | 'i' | 'g' | 'nx';
  symbol: string;
  label: string;
  value: string;
  up: boolean;
  desc: string;
}) {
  return (
    <div className={'comp-card ' + kind}>
      <div className="symbol">{symbol}</div>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      <div className={'delta ' + (up ? 'up' : 'down')}>
        {up ? '▲ improving' : '▼ contracting'}
      </div>
      <div className="desc">{desc}</div>
    </div>
  );
}

export default App;
