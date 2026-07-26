import styles from "./BarChart.module.css";

export interface BarChartDatum {
  label: string;
  value: number;
  title?: string;
}

interface BarChartProps {
  data: BarChartDatum[];
  color?: string;
}

export function BarChart({ data, color = "var(--pg-primary)" }: BarChartProps) {
  const maxValue = Math.max(1, ...data.map((datum) => datum.value));

  return (
    <div className={styles.bars}>
      {data.map((datum) => (
        <div key={datum.label} className={styles.barColumn}>
          <div className={styles.barTrack}>
            <div
              className={styles.bar}
              style={{ height: `${(datum.value / maxValue) * 100}%`, background: color }}
              title={datum.title ?? `${datum.label}: ${datum.value}`}
            />
          </div>
          <span className={styles.barLabel}>{datum.label}</span>
        </div>
      ))}
    </div>
  );
}
