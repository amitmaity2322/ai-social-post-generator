import styles from "./DonutChart.module.css";

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  centerValue: string | number;
  centerLabel: string;
}

const SIZE = 160;
const STROKE = 22;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function DonutChart({ data, centerValue, centerLabel }: DonutChartProps) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0) || 1;
  let offset = 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.chartArea}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.svg}>
          <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="var(--pg-border)"
              strokeWidth={STROKE}
            />
            {data.map((slice) => {
              const fraction = slice.value / total;
              const dash = fraction * CIRCUMFERENCE;
              const strokeDashoffset = -offset;
              offset += dash;

              return (
                <circle
                  key={slice.label}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                  strokeDashoffset={strokeDashoffset}
                >
                  <title>{`${slice.label}: ${slice.value}`}</title>
                </circle>
              );
            })}
          </g>
        </svg>
        <div className={styles.center}>
          <span className={styles.centerValue}>{centerValue}</span>
          <span className={styles.centerLabel}>{centerLabel}</span>
        </div>
      </div>

      <div className={styles.legend}>
        {data.map((slice) => (
          <div key={slice.label} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: slice.color }} />
            <span className={styles.legendLabel}>{slice.label}</span>
            <span className={styles.legendValue}>
              {total > 0 ? Math.round((slice.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
