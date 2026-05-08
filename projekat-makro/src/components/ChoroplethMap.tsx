import { useMemo, useState, useRef } from 'react';
import { COUNTY_SHAPES, SVG_VIEW, SWEDEN_OUTLINE_D } from '../data/county_shapes';
import { allRegionSnapshots, type RegionSnapshot } from '../data/region_data';
import type { QuarterData } from '../data/quarters';

interface Props {
  quarter: QuarterData;
  selectedCode: string;
  onSelect: (code: string) => void;
}

interface HoverInfo {
  code: string;
  name: string;
  number: number;
  snap: RegionSnapshot;
  x: number;
  y: number;
}

/** Map intensity 0..1 to a colour stop along a deep-purple→cyan→amber palette. */
function intensityColor(t: number): string {
  // 0.0 → deep navy/purple ; 0.5 → cyan ; 1.0 → amber
  const stops = [
    { p: 0.0,  c: [27, 17, 60] },     // deep indigo
    { p: 0.25, c: [34, 70, 130] },    // mid blue
    { p: 0.5,  c: [0, 180, 215] },    // cyan
    { p: 0.75, c: [120, 220, 110] },  // green
    { p: 1.0,  c: [255, 200, 70] },   // amber
  ];
  let lo = stops[0];
  let hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].p && t <= stops[i + 1].p) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }
  const span = hi.p - lo.p || 1;
  const k = (t - lo.p) / span;
  const r = Math.round(lo.c[0] + (hi.c[0] - lo.c[0]) * k);
  const g = Math.round(lo.c[1] + (hi.c[1] - lo.c[1]) * k);
  const b = Math.round(lo.c[2] + (hi.c[2] - lo.c[2]) * k);
  return `rgb(${r},${g},${b})`;
}

function fmtBn(v: number): string {
  if (v >= 1000) return (v / 1000).toFixed(2) + ' tn';
  if (v >= 100) return v.toFixed(0) + ' bn';
  return v.toFixed(1) + ' bn';
}

export default function ChoroplethMap({ quarter, selectedCode, onSelect }: Props) {
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const snapshots = useMemo(
    () => allRegionSnapshots(quarter.gdpGrowth, quarter.isProjection),
    [quarter],
  );

  return (
    <div ref={wrapRef} className="choropleth-wrap">
      <svg
        className="choropleth-svg"
        viewBox={`0 0 ${SVG_VIEW.width} ${SVG_VIEW.height}`}
        role="img"
        aria-label="Sweden county choropleth"
      >
        <defs>
          <filter id="cp-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="cp-bg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,229,255,0.08)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0.04)" />
          </linearGradient>
        </defs>

        {/* National outline halo */}
        <path
          d={SWEDEN_OUTLINE_D}
          fill="url(#cp-bg)"
          stroke="rgba(0,229,255,0.55)"
          strokeWidth="1.6"
          strokeLinejoin="round"
          filter="url(#cp-glow)"
        />

        {/* County polygons */}
        {COUNTY_SHAPES.map((c) => {
          const s = snapshots[c.code];
          const fill = intensityColor(s.intensity);
          const isSelected = c.code === selectedCode;
          const isHover = hover?.code === c.code;
          return (
            <g key={c.code}>
              <path
                d={c.d}
                fill={fill}
                fillOpacity={isSelected ? 0.95 : isHover ? 0.85 : 0.75}
                stroke={
                  isSelected
                    ? '#ffffff'
                    : isHover
                      ? 'rgba(255,255,255,0.85)'
                      : 'rgba(255,255,255,0.18)'
                }
                strokeWidth={isSelected ? 1.6 : isHover ? 1.2 : 0.55}
                style={{
                  cursor: 'pointer',
                  transition:
                    'fill 0.4s ease, fill-opacity 0.2s ease, stroke 0.18s ease, stroke-width 0.18s ease',
                  filter: isSelected
                    ? `drop-shadow(0 0 6px ${fill}) drop-shadow(0 0 12px ${fill})`
                    : undefined,
                }}
                onMouseEnter={(e) => {
                  const wrap = wrapRef.current;
                  if (!wrap) return;
                  const rect = wrap.getBoundingClientRect();
                  setHover({
                    code: c.code,
                    name: c.name,
                    number: c.number,
                    snap: s,
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  });
                }}
                onMouseMove={(e) => {
                  const wrap = wrapRef.current;
                  if (!wrap) return;
                  const rect = wrap.getBoundingClientRect();
                  setHover((h) =>
                    h
                      ? { ...h, x: e.clientX - rect.left, y: e.clientY - rect.top }
                      : h,
                  );
                }}
                onMouseLeave={() => setHover(null)}
                onClick={() => onSelect(c.code)}
              />
            </g>
          );
        })}

        {/* County numbers (only show on the bigger cells; auto-skip tiny ones) */}
        {COUNTY_SHAPES.map((c) => {
          const isSelected = c.code === selectedCode;
          const isHover = hover?.code === c.code;
          const fontSize = isSelected || isHover ? 12 : 10;
          return (
            <text
              key={`l-${c.code}`}
              x={c.cx}
              y={c.cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize={fontSize}
              fontWeight="600"
              fill={isSelected ? '#ffffff' : 'rgba(0,15,30,0.7)'}
              stroke={isSelected ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.45)'}
              strokeWidth="0.4"
              paintOrder="stroke fill"
              style={{ pointerEvents: 'none', transition: 'all 0.2s' }}
            >
              {c.number}
            </text>
          );
        })}

        {/* Title overlay */}
        <g transform="translate(8, 22)">
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
            fill="rgba(150,170,200,0.85)"
          >
            {quarter.label.toUpperCase()}
          </text>
        </g>
      </svg>

      {/* Tooltip */}
      {hover && (
        <div
          className="cp-tooltip"
          style={{
            left: hover.x,
            top: hover.y,
          }}
        >
          <div className="cp-tt-header">
            <span className="cp-tt-num">#{hover.number}</span>
            <span className="cp-tt-name">{hover.name}</span>
          </div>
          <div className="cp-tt-row">
            <span>GRP</span>
            <span className="v">{fmtBn(hover.snap.grpBnSEK_q)} SEK</span>
          </div>
          <div className="cp-tt-row">
            <span>Tax revenue</span>
            <span className="v">{fmtBn(hover.snap.taxRevenueBnSEK_q)} SEK</span>
          </div>
          <div className="cp-tt-row">
            <span>Public spend</span>
            <span className="v">{fmtBn(hover.snap.publicSpendBnSEK_q)} SEK</span>
          </div>
          <div className="cp-tt-row">
            <span>Growth</span>
            <span
              className="v"
              style={{
                color: hover.snap.growthQoQ >= 0 ? 'var(--neon-green)' : 'var(--neon-red)',
              }}
            >
              {hover.snap.growthQoQ >= 0 ? '+' : ''}
              {hover.snap.growthQoQ.toFixed(2)}%
            </span>
          </div>
          <div className="cp-tt-foot">click to lock selection</div>
        </div>
      )}

      {/* Legend */}
      <div className="cp-legend">
        <span className="lbl">ACTIVITY</span>
        <span className="cp-legend-bar" />
        <span className="cp-legend-marks">
          <span>low</span>
          <span>high</span>
        </span>
      </div>
    </div>
  );
}
