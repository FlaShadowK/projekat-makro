import { useMemo, useState } from 'react';
import {
  COUNTIES,
  MAP_VIEW,
  SWEDEN_OUTLINE_LATLON,
  heatFor,
  projectLatLon,
  type County,
} from '../data/counties';
import type { QuarterData } from '../data/quarters';

interface Props {
  quarter: QuarterData;
}

interface Tip {
  county: County;
  heat: number;
  x: number;
  y: number;
}

/** Map heat (0..1) to a hue along red→amber→green */
function heatColor(h: number): string {
  // Cooler→hotter: red (#ff4d6d) → amber (#ffb84d) → green (#39ff9c)
  if (h < 0.5) {
    const t = h / 0.5;
    return mix('#ff4d6d', '#ffb84d', t);
  }
  const t = (h - 0.5) / 0.5;
  return mix('#ffb84d', '#39ff9c', t);
}

function mix(a: string, b: string, t: number): string {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 255;
  const ag = (ah >> 8) & 255;
  const ab = ah & 255;
  const br = (bh >> 16) & 255;
  const bg = (bh >> 8) & 255;
  const bb = bh & 255;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}

export default function SwedenMap({ quarter }: Props) {
  const [tip, setTip] = useState<Tip | null>(null);

  const outlinePath = useMemo(() => {
    const pts = SWEDEN_OUTLINE_LATLON.map(([lat, lon]) =>
      projectLatLon(lat, lon),
    );
    return (
      'M' +
      pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L') +
      ' Z'
    );
  }, []);

  const nodes = useMemo(
    () =>
      COUNTIES.map((c) => {
        const [x, y] = projectLatLon(c.lat, c.lon);
        const heat = heatFor(c.baseHeat, quarter.gdpGrowth, quarter.isProjection);
        // Population-scaled radius — sqrt for visual balance
        const r = 6 + Math.sqrt(c.pop) * 0.45;
        return { c, x, y, heat, r, color: heatColor(heat) };
      }),
    [quarter],
  );

  return (
    <div className="map-wrap">
      <svg
        className="map-svg"
        viewBox={`0 0 ${MAP_VIEW.width} ${MAP_VIEW.height}`}
        role="img"
        aria-label="Map of Sweden showing regional economic activity"
      >
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="outlineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,229,255,0.12)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0.06)" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background grid lines */}
        <g opacity="0.18" stroke="rgba(120,200,255,0.4)" strokeWidth="0.5">
          {[100, 200, 300, 400, 500, 600].map((y) => (
            <line key={y} x1="0" y1={y} x2={MAP_VIEW.width} y2={y} />
          ))}
          {[80, 160, 240, 320].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2={MAP_VIEW.height} />
          ))}
        </g>

        {/* Sweden outline */}
        <path
          d={outlinePath}
          fill="url(#outlineFill)"
          stroke="rgba(0,229,255,0.55)"
          strokeWidth="1.4"
          strokeLinejoin="round"
          filter="url(#softGlow)"
        />
        <path
          d={outlinePath}
          fill="none"
          stroke="rgba(0,229,255,0.9)"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* Connection lines from Stockholm to other regions (subtle) */}
        <g opacity="0.18" stroke="rgba(0,229,255,0.5)" strokeWidth="0.5">
          {(() => {
            const sthlm = nodes.find((n) => n.c.code === 'SE21');
            if (!sthlm) return null;
            return nodes
              .filter((n) => n.c.code !== 'SE21')
              .map((n) => (
                <line
                  key={n.c.code}
                  x1={sthlm.x}
                  y1={sthlm.y}
                  x2={n.x}
                  y2={n.y}
                />
              ));
          })()}
        </g>

        {/* County nodes */}
        {nodes.map((n) => (
          <g
            key={n.c.code}
            transform={`translate(${n.x},${n.y})`}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setTip({ county: n.c, heat: n.heat, x: n.x, y: n.y })}
            onMouseLeave={() => setTip(null)}
          >
            {/* Outer glow */}
            <circle
              r={n.r * 1.7}
              fill={n.color}
              opacity={0.18 + n.heat * 0.18}
            />
            {/* Main node */}
            <circle
              r={n.r}
              fill={n.color}
              opacity={0.5 + n.heat * 0.4}
              stroke={n.color}
              strokeWidth="1.2"
              style={{
                filter: `drop-shadow(0 0 ${4 + n.heat * 8}px ${n.color})`,
              }}
            />
            {/* Inner highlight */}
            <circle r={n.r * 0.55} fill="url(#nodeGlow)" />
            {/* Number */}
            <text
              y={1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={Math.min(11, n.r * 0.95)}
              fontFamily="JetBrains Mono, monospace"
              fontWeight="600"
              fill="#06080f"
              style={{ pointerEvents: 'none' }}
            >
              {n.c.number}
            </text>
            {/* Hover ring */}
            {tip?.county.code === n.c.code && (
              <circle
                r={n.r * 1.45}
                fill="none"
                stroke={n.color}
                strokeWidth="1"
                opacity="0.85"
              />
            )}
          </g>
        ))}

        {/* Title overlay inside SVG (top-right) */}
        <g transform={`translate(${MAP_VIEW.width - 8}, 18)`} textAnchor="end">
          <text
            fontFamily="JetBrains Mono, monospace"
            fontSize="11"
            letterSpacing="2"
            fill="rgba(0,229,255,0.85)"
          >
            SWEDEN · 21 LÄN
          </text>
          <text
            y={16}
            fontFamily="JetBrains Mono, monospace"
            fontSize="10"
            letterSpacing="1.5"
            fill="rgba(150,170,200,0.75)"
          >
            {quarter.label.toUpperCase()}
          </text>
        </g>
      </svg>

      {/* HTML tooltip overlay (positioned via percent of SVG box) */}
      {tip && (
        <div
          className="map-tooltip"
          style={{
            left: `${(tip.x / MAP_VIEW.width) * 100}%`,
            top: `${(tip.y / MAP_VIEW.height) * 100}%`,
          }}
        >
          <div className="name">
            {tip.county.number}. {tip.county.name}
          </div>
          <div className="row">
            <span>Capital</span>
            <span className="v">{tip.county.capital}</span>
          </div>
          <div className="row">
            <span>Population</span>
            <span className="v">{tip.county.pop.toLocaleString()}k</span>
          </div>
          <div className="row">
            <span>Activity</span>
            <span className="v">{(tip.heat * 100).toFixed(0)} / 100</span>
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 11,
              color: 'var(--text-dim)',
              lineHeight: 1.4,
              fontFamily: 'inherit',
            }}
          >
            {tip.county.blurb}
          </div>
        </div>
      )}

      <div className="map-legend">
        <span>Low</span>
        <span className="legend-bar" />
        <span>High</span>
      </div>
    </div>
  );
}
