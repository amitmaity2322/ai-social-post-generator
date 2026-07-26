import Link from "next/link";
import { buttonClassNames } from "@/presentation/components/ui";
import styles from "./ComingSoonPage.module.css";

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon: string;
  actionHref?: string;
  actionLabel?: string;
}

export function ComingSoonPage({
  title,
  description,
  icon,
  actionHref = "/dashboard",
  actionLabel = "Back to dashboard",
}: ComingSoonPageProps) {
  return (
    <div className={`pg-surface ${styles.wrap}`}>
      <span className={styles.icon}>
        <i className={icon} aria-hidden="true" />
      </span>
      <h2 className="h5 mb-2">{title}</h2>
      <p className="pg-text-muted mb-0">{description}</p>
      <div>
        <span className={styles.badge}>
          <i className="bi-hourglass-split" aria-hidden="true" />
          Coming soon
        </span>
      </div>
      <div className="mt-4">
        <Link href={actionHref} className={buttonClassNames({ variant: "outline" })}>
          {actionHref === "/dashboard" && <i className="bi-arrow-left me-2" aria-hidden="true" />}
          {actionLabel}
        </Link>
      </div>
    </div>
  );
}
