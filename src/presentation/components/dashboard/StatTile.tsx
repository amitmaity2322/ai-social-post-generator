import { Sparkline } from "./Sparkline";
import { PreviewBadge } from "./PreviewBadge";
import styles from "./StatTile.module.css";

export type StatTileTone = "primary" | "accent" | "success" | "warning" | "danger";

interface StatTileProps {
  label: string;
  value: string | number;
  icon: string;
  tone: StatTileTone;
  trend?: string;
  sparklineValues?: number[];
  isPreview?: boolean;
}

export function StatTile({
  label,
  value,
  icon,
  tone,
  trend,
  sparklineValues,
  isPreview = false,
}: StatTileProps) {
  return (
    <div className={`pg-surface ${styles.card}`}>
      <div className={styles.top}>
        <span className={`${styles.icon} ${styles[tone]}`}>
          <i className={icon} aria-hidden="true" />
        </span>
        {isPreview ? (
          <PreviewBadge />
        ) : (
          trend && (
            <span className={styles.trend}>
              <i className="bi-arrow-up-short" aria-hidden="true" />
              {trend}
            </span>
          )
        )}
      </div>
      <div>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
      </div>
      {sparklineValues && (
        <div className={styles.sparkline}>
          <Sparkline values={sparklineValues} />
        </div>
      )}
    </div>
  );
}
