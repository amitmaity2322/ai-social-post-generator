import Link from "next/link";
import { ReactNode } from "react";
import styles from "./AuthCard.module.css";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Link href="/" className={styles.brand}>
          <i className="bi-stars" aria-hidden="true" />
          PostGen AI
        </Link>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        {children}
        <div className={styles.footer}>{footer}</div>
      </div>
    </div>
  );
}
