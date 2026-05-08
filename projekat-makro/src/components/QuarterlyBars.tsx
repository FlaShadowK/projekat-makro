import { QUARTERS } from '../data/quarters';

interface Props {
  activeIndex: number;
  onSelect?: (i: number) => void;
}

const MIN = -1.0;
const MAX = 1.6;
const RANGE = MAX - MIN;

export default function QuarterlyBars({ activeIndex, onSelect }: Props) {
  // Position of the zero baseline as % from top
  const zeroPct = ((MAX - 0) / RANGE) * 100;

  return (
    <div>
      <div className="bars" style={{ position: 'relative' }}>
        <div className="bar-baseline" style={{ top: `${zeroPct}%` }} />
        {QUARTERS.map((q, i) => {
          const v = q.gdpGrowth;
          const isActive = i === activeIndex;
          const positive = v >= 0;
          // Bar height & top from zero baseline
          const heightPct = (Math.abs(v) / RANGE) * 100;
          const topPct = positive ? zeroPct - heightPct : zeroPct;
          const cls =
            'bar' +
            (q.isProjection ? ' proj' : positive ? '' : ' neg');
          return (
            <div
              key={q.key}
              className={'bar-col' + (isActive ? ' active' : '')}
              onClick={() => onSelect?.(i)}
              style={{ cursor: onSelect ? 'pointer' : 'default' }}
            >
              <div className="stack">
                <div
                  className={cls}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    top: `${topPct}%`,
                    height: `${heightPct}%`,
                  }}
                />
                <div
                  className="vlabel"
                  style={{
                    top: positive
                      ? `calc(${topPct}% - 18px)`
                      : `calc(${topPct + heightPct}% + 4px)`,
                  }}
                >
                  {v >= 0 ? '+' : ''}
                  {v.toFixed(1)}%
                </div>
              </div>
              <span className="qlabel">{q.short}</span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 10,
          fontFamily: 'var(--mono)',
          fontSize: 10,
          letterSpacing: '0.14em',
          color: 'var(--text-dim)',
        }}
      >
        <span>REAL GDP GROWTH (QoQ %, ANNUAL FOR 2025·P)</span>
        <span style={{ color: 'var(--neon-magenta)' }}>■ PROJECTION</span>
      </div>
    </div>
  );
}
