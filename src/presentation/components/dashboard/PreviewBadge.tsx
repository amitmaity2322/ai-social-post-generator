import styles from "./PreviewBadge.module.css";

/** Marks a widget/section as illustrative sample content rather than data backed by a real feature. */
export function PreviewBadge() {
  return <span className={styles.badge}>Preview</span>;
}
