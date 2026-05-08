import { QUARTERS, type QuarterData } from '../data/quarters';

interface Props {
  index: number;
  onChange: (n: number) => void;
}

export default function TimeSlider({ index, onChange }: Props) {
  const current: QuarterData = QUARTERS[index];
  const max = QUARTERS.length - 1;
  const pct = (index / max) * 100;
  const isProj = current.isProjection;

  return (
    <div className="slider-wrap">
      <div className="slider-head">
        <div>
          <div className="eyebrow">Timeline</div>
          <div className="current-quarter">
            {isProj ? (
              <span className="proj">{current.label}</span>
            ) : (
              current.label
            )}
          </div>
        </div>
        <div className="hero-stats" style={{ marginTop: 0, gap: 26 }}>
          <div className="hero-stat">
            <span className="num" style={{ color: current.gdpGrowth >= 0 ? 'var(--neon-green)' : 'var(--neon-red)' }}>
              {current.gdpGrowth >= 0 ? '+' : ''}
              {current.gdpGrowth.toFixed(1)}%
            </span>
            <span className="label">{isProj ? 'GDP YoY (proj.)' : 'GDP QoQ'}</span>
          </div>
          <div className="hero-stat">
            <span className="num">{current.inflation.toFixed(1)}%</span>
            <span className="label">HICP Inflation</span>
          </div>
          <div className="hero-stat">
            <span className="num">{current.policyRate.toFixed(2)}%</span>
            <span className="label">Riksbank Rate</span>
          </div>
        </div>
      </div>

      <div className="slider-track">
        <div
          className={'slider-fill' + (isProj ? ' is-projection' : '')}
          style={{ width: `${pct}%` }}
        />
        <div
          className={'slider-thumb' + (isProj ? ' proj' : '')}
          style={{ left: `${pct}%` }}
        />
        <input
          className="slider-input"
          type="range"
          min={0}
          max={max}
          step={1}
          value={index}
          aria-label="Timeline quarter selector"
          onChange={(e) => onChange(Number(e.currentTarget.value))}
        />
      </div>

      <div className="slider-ticks">
        {QUARTERS.map((q, i) => (
          <button
            key={q.key}
            type="button"
            className={
              'tick' +
              (i === index ? ' active' : '') +
              (q.isProjection ? ' proj' : '')
            }
            onClick={() => onChange(i)}
          >
            {q.short}
          </button>
        ))}
      </div>
    </div>
  );
}
