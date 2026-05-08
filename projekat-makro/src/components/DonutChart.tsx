import { useMemo } from 'react';
import type { QuarterData } from '../data/quarters';

interface Slice {
  key: 'C' | 'I' | 'G' | 'NX';
  label: string;
  value: number;
  color: string;
  cssVar: string;
}

interface Props {
  quarter: QuarterData;
}

const SIZE = 240;
const RADIUS = 92;
const INNER = 60;
const CENTER = SIZE / 2;

function polar(angle: number, r: number): [number, number] {
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)];
}

function arcPath(start: number, end: number): string {
  const [sxOuter, syOuter] = polar(start, RADIUS);
  const [exOuter, eyOuter] = polar(end, RADIUS);
  const [sxInner, syInner] = polar(end, INNER);
  const [exInner, eyInner] = polar(start, INNER);
  const largeArc = end - start > Math.PI ? 1 : 0;
  return [
    `M ${sxOuter.toFixed(2)} ${syOuter.toFixed(2)}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${exOuter.toFixed(2)} ${eyOuter.toFixed(2)}`,
    `L ${sxInner.toFixed(2)} ${syInner.toFixed(2)}`,
    `A ${INNER} ${INNER} 0 ${largeArc} 0 ${exInner.toFixed(2)} ${eyInner.toFixed(2)}`,
    'Z',
  ].join(' ');
}

export default function DonutChart({ quarter }: Props) {
  const slices: Slice[] = useMemo(() => {
    const c = quarter.components;
    return [
      { key: 'C',  label: 'Consumption',  value: c.C,  color: '#00e5ff', cssVar: '--c-color' },
      { key: 'I',  label: 'Investment',   value: c.I,  color: '#a855f7', cssVar: '--i-color' },
      { key: 'G',  label: 'Government',   value: c.G,  color: '#39ff9c', cssVar: '--g-color' },
      { key: 'NX', label: 'Net Exports',  value: c.NX, color: '#ffb84d', cssVar: '--nx-color' },
    ];
  }, [quarter]);

  const total = slices.reduce((a, s) => a + s.value, 0);
  let acc = -Math.PI / 2; // start at 12 o'clock

  return (
    <div className="donut-wrap">
      <svg
        className="donut-svg"
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label="GDP components by expenditure method"
      >
        <defs>
          {slices.map((s) => (
            <filter
              key={s.key}
              id={`glow-${s.key}`}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          ))}
        </defs>

        {/* Background ring */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={(RADIUS + INNER) / 2}
          fill="none"
          stroke="rgba(120,200,255,0.05)"
          strokeWidth={RADIUS - INNER}
        />

        {slices.map((s) => {
          const angle = (s.value / total) * Math.PI * 2;
          const start = acc;
          const end = acc + angle;
          acc = end;
          return (
            <g key={s.key}>
              <path
                d={arcPath(start, end)}
                fill={s.color}
                opacity="0.18"
                filter={`url(#glow-${s.key})`}
              />
              <path
                d={arcPath(start, end)}
                fill={s.color}
                opacity="0.85"
                stroke={s.color}
                strokeWidth="0.5"
              />
            </g>
          );
        })}

        {/* Center text */}
        <text
          x={CENTER}
          y={CENTER - 4}
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize="28"
          fontWeight="600"
          fill="#ffffff"
          style={{ filter: 'drop-shadow(0 0 14px rgba(0,229,255,0.4))' }}
        >
          {total.toFixed(1)}%
        </text>
        <text
          x={CENTER}
          y={CENTER + 16}
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize="9"
          letterSpacing="2"
          fill="rgba(150,170,200,0.85)"
        >
          GDP COMPOSITION
        </text>
      </svg>

      <div className="donut-legend">
        {slices.map((s) => (
          <div key={s.key} className="donut-legend-item">
            <span className="dot" style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }} />
            <div className="info">
              <span className="label">{s.label}</span>
              <span className="v">{s.value.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
