import { useMemo, useState } from 'react';
import { COMPARE_METRICS, COUNTRIES, type CountryStats } from '../data/nordic';

const COLORS: Record<string, string> = {
  SE: '#00e5ff',
  DK: '#ff4d6d',
  NO: '#a855f7',
  FI: '#39ff9c',
  EU: '#ffb84d',
};

export default function ScandiScan() {
  const [active, setActive] = useState<string[]>(['SE', 'DK', 'NO', 'FI', 'EU']);

  const toggle = (code: string) => {
    setActive((cur) =>
      cur.includes(code) ? cur.filter((c) => c !== code) : [...cur, code],
    );
  };

  return (
    <div className="row row-2">
      <div className="panel">
        <h3 className="panel-title">Multi-Metric Radar</h3>
        <p className="panel-subtitle">
          Five-axis comparison across the Nordic region. Each axis is normalised
          to its peer-group min/max — outer = best.
        </p>
        <RadarChart active={active} />
        <div
          style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            marginTop: 14,
            justifyContent: 'center',
          }}
        >
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => toggle(c.code)}
              style={{
                background: active.includes(c.code)
                  ? `${COLORS[c.code]}22`
                  : 'transparent',
                border: `1px solid ${
                  active.includes(c.code) ? COLORS[c.code] : 'var(--border)'
                }`,
                color: active.includes(c.code)
                  ? COLORS[c.code]
                  : 'var(--text-dim)',
                padding: '6px 12px',
                borderRadius: 6,
                fontFamily: 'var(--mono)',
                fontSize: 11,
                letterSpacing: '0.12em',
                cursor: 'pointer',
                transition: 'all 0.18s',
                textShadow: active.includes(c.code)
                  ? `0 0 8px ${COLORS[c.code]}`
                  : 'none',
              }}
            >
              {c.code} · {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <h3 className="panel-title">Country Cards · 2025</h3>
        <p className="panel-subtitle">
          The nordic model is shared, but fiscal positions diverge. Sweden
          balances low debt with rising defence spending.
        </p>
        <div className="scandi-grid">
          {COUNTRIES.map((c) => (
            <CountryCard key={c.code} country={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CountryCard({ country: c }: { country: CountryStats }) {
  return (
    <div className={'country-card' + (c.isSelf ? ' is-self' : '')}>
      <div
        className="flag"
        style={{ background: c.flag, backgroundSize: 'cover' }}
      />
      <h3>
        {c.name}{' '}
        {c.isSelf && (
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '0.14em',
              color: 'var(--neon-cyan)',
              padding: '2px 6px',
              border: '1px solid var(--neon-cyan)',
              borderRadius: 3,
              marginLeft: 6,
              textShadow: '0 0 6px rgba(0,229,255,0.6)',
            }}
          >
            FOCUS
          </span>
        )}
      </h3>
      <div className="desc">{c.desc}</div>
      <div className="stats">
        <div className="stat">
          <span className="lbl">GDP/cap</span>
          <span className="v">${c.gdpPerCapita.toFixed(1)}k</span>
        </div>
        <div className="stat">
          <span className="lbl">Growth ’25</span>
          <span className="v">{c.growth2025.toFixed(1)}%</span>
        </div>
        <div className="stat">
          <span className="lbl">Pub spending</span>
          <span className="v">{c.pubSpendingPctGDP}% GDP</span>
        </div>
        <div className="stat">
          <span className="lbl">Public debt</span>
          <span className="v">{c.publicDebtPctGDP}% GDP</span>
        </div>
        <div className="stat">
          <span className="lbl">Defence</span>
          <span className="v">{c.defencePctGDP}% GDP</span>
        </div>
        <div className="stat">
          <span className="lbl">CPI ’25</span>
          <span className="v">{c.inflation2025.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

function RadarChart({ active }: { active: string[] }) {
  const SIZE = 380;
  const C = SIZE / 2;
  const R = SIZE / 2 - 40;

  const axes = useMemo(() => {
    return COMPARE_METRICS.map((m, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / COMPARE_METRICS.length;
      return {
        ...m,
        angle,
        x: C + Math.cos(angle) * R,
        y: C + Math.sin(angle) * R,
      };
    });
  }, [C, R]);

  const polygons = useMemo(() => {
    return COUNTRIES.filter((c) => active.includes(c.code)).map((c) => {
      const pts = axes.map((a) => {
        const raw = c[a.key as keyof CountryStats] as number;
        let norm = (raw - a.min) / (a.max - a.min);
        if (!a.positive) norm = 1 - norm;
        norm = Math.max(0, Math.min(1, norm));
        const x = C + Math.cos(a.angle) * R * norm;
        const y = C + Math.sin(a.angle) * R * norm;
        return [x, y] as const;
      });
      return { code: c.code, pts, color: COLORS[c.code] };
    });
  }, [active, axes, C, R]);

  return (
    <svg
      width="100%"
      height="auto"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{ display: 'block', margin: '0 auto' }}
      aria-label="Radar comparison of nordic economies"
    >
      {/* Concentric grid */}
      {[0.25, 0.5, 0.75, 1.0].map((s) => (
        <polygon
          key={s}
          points={axes
            .map((a) => {
              const x = C + Math.cos(a.angle) * R * s;
              const y = C + Math.sin(a.angle) * R * s;
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(' ')}
          fill="none"
          stroke="rgba(120,200,255,0.12)"
          strokeWidth="0.7"
        />
      ))}

      {/* Axes */}
      {axes.map((a) => (
        <line
          key={a.key}
          x1={C}
          y1={C}
          x2={a.x}
          y2={a.y}
          stroke="rgba(120,200,255,0.18)"
          strokeWidth="0.5"
        />
      ))}

      {/* Country polygons */}
      {polygons.map((p) => (
        <g key={p.code}>
          <polygon
            points={p.pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}
            fill={p.color}
            opacity="0.12"
          />
          <polygon
            points={p.pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}
            fill="none"
            stroke={p.color}
            strokeWidth="1.6"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 6px ${p.color})` }}
          />
          {p.pts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill={p.color} />
          ))}
        </g>
      ))}

      {/* Axis labels */}
      {axes.map((a) => {
        const lx = C + Math.cos(a.angle) * (R + 22);
        const ly = C + Math.sin(a.angle) * (R + 22);
        const anchor =
          Math.cos(a.angle) > 0.3 ? 'start' : Math.cos(a.angle) < -0.3 ? 'end' : 'middle';
        return (
          <g key={`label-${a.key}`}>
            <text
              x={lx}
              y={ly}
              textAnchor={anchor}
              fontFamily="JetBrains Mono, monospace"
              fontSize="10"
              letterSpacing="1"
              fill="rgba(150,170,200,0.85)"
              dominantBaseline="middle"
            >
              {a.label.toUpperCase()}
            </text>
            <text
              x={lx}
              y={ly + 12}
              textAnchor={anchor}
              fontFamily="JetBrains Mono, monospace"
              fontSize="9"
              fill="rgba(0,229,255,0.7)"
              dominantBaseline="middle"
            >
              {a.unit}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
