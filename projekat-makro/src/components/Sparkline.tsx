interface Props {
  data: number[];
  color: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

/**
 * Lightweight inline sparkline used inside the KPI cards.
 * Last point is highlighted; soft area fill behind line.
 */
export default function Sparkline({
  data,
  color,
  width = 200,
  height = 60,
  fill = true,
}: Props) {
  if (data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / Math.max(data.length - 1, 1);
  const pts = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 6) - 3;
    return [x, y] as const;
  });
  const linePath =
    'M ' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L ');
  const areaPath =
    linePath +
    ` L ${width.toFixed(1)},${height.toFixed(1)} L 0,${height.toFixed(1)} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg
      className="kpi-spark"
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && (
        <path d={areaPath} fill={`url(#spark-${color.replace('#', '')})`} />
      )}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={last[0]} cy={last[1]} r="2.4" fill={color} />
      <circle
        cx={last[0]}
        cy={last[1]}
        r="5"
        fill={color}
        opacity="0.25"
      />
    </svg>
  );
}
