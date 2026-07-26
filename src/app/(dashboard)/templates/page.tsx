import Link from "next/link";
import { TEMPLATE_CATEGORIES } from "@/presentation/constants/templateCategories";
import styles from "./page.module.css";

export default function TemplatesPage() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="h4 mb-1">Templates</h2>
        <p className="pg-text-muted mb-0">
          Pick a starting point — we&apos;ll take you to Generate with a topic and tone already
          filled in.
        </p>
      </div>

      <div className={styles.grid}>
        {TEMPLATE_CATEGORIES.map((category) => (
          <Link
            key={category.label}
            href={`/generate?topic=${encodeURIComponent(category.topic)}&tone=${category.tone}`}
            className={`pg-surface ${styles.card}`}
          >
            <span className={styles.icon}>
              <i className={category.icon} aria-hidden="true" />
            </span>
            <div>
              <h3 className={styles.cardLabel}>{category.label}</h3>
              <p className={styles.cardTopic}>{category.topic}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
