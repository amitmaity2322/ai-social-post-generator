import { isUnlimited } from "@/shared/constants/plans";
import styles from "./UsageMeter.module.css";

interface UsageMeterProps {
  icon: string;
  label: string;
  used: number;
  limit: number;
  unit?: string;
}

export function UsageMeter({ icon, label, used, limit, unit }: UsageMeterProps) {
  const unlimited = isUnlimited(limit);
  const rawPct = unlimited || limit <= 0 ? 0 : (used / limit) * 100;
  const pct = unlimited ? 100 : Math.min(100, rawPct);
  const tone = unlimited ? "unlimited" : rawPct >= 100 ? "danger" : rawPct >= 80 ? "warning" : "ok";
  const suffix = unit ? ` ${unit}` : "";

  return (
    <div className={styles.meter}>
      <div className={styles.header}>
        <span className={`${styles.iconWrap} ${styles[tone]}`}>
          <i className={icon} aria-hidden="true" />
        </span>
        <div className={styles.headerText}>
          <span className={styles.label}>{label}</span>
          <span className={styles.value}>
            {used.toLocaleString()}
            {suffix}
            <span className={styles.limit}>
              {" "}
              / {unlimited ? "Unlimited" : `${limit.toLocaleString()}${suffix}`}
            </span>
          </span>
        </div>
      </div>
      <div className={styles.track}>
        <div className={`${styles.fill} ${styles[tone]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
