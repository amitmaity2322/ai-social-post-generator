"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/presentation/services/authService";
import { getPlanDisplayName, type SubscriptionSummary } from "@/domain/value-objects/subscriptionStatus";
import styles from "./Sidebar.module.css";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const MAIN_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
  { href: "/generate", label: "Generate Post", icon: "bi-magic" },
  { href: "/templates", label: "Templates", icon: "bi-file-earmark-richtext" },
  { href: "/history", label: "History", icon: "bi-clock-history" },
  { href: "/drafts", label: "Drafts", icon: "bi-file-earmark-post" },
  { href: "/calendar", label: "Calendar", icon: "bi-calendar3" },
  { href: "/analytics", label: "Analytics", icon: "bi-bar-chart-line" },
  { href: "/media-library", label: "Media Library", icon: "bi-images" },
  { href: "/brand-kit", label: "Brand Kit", icon: "bi-palette" },
  { href: "/team", label: "Team", icon: "bi-people" },
  { href: "/integrations", label: "Integrations", icon: "bi-plug" },
];

const ACCOUNT_NAV_ITEMS: NavItem[] = [
  { href: "/settings", label: "Settings", icon: "bi-gear" },
  { href: "/subscription", label: "Subscription", icon: "bi-credit-card" },
  { href: "/help-support", label: "Help & Support", icon: "bi-question-circle" },
];

interface SidebarProps {
  subscription: SubscriptionSummary;
  platformsUsed: number;
  platformsAllowed: number;
  onNavigate?: () => void;
}

export function Sidebar({ subscription, platformsUsed, platformsAllowed, onNavigate }: SidebarProps) {
  const { billedPlan, status } = subscription;
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await authService.signOut();
    router.push("/");
    router.refresh();
  }

  function renderNavItem(item: NavItem) {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          onClick={onNavigate}
          className={[styles.navLink, isActive ? styles.navLinkActive : ""]
            .filter(Boolean)
            .join(" ")}
          aria-current={isActive ? "page" : undefined}
        >
          <i className={item.icon} aria-hidden="true" />
          <span>{item.label}</span>
        </Link>
      </li>
    );
  }

  const usagePct =
    platformsAllowed > 0 ? Math.min(100, (platformsUsed / platformsAllowed) * 100) : 0;
  const showUpgradeButton = status !== "active" || billedPlan !== "business";

  return (
    <nav className={styles.sidebar} aria-label="Primary">
      <Link href="/dashboard" className={styles.brand}>
        <i className="bi-stars" aria-hidden="true" />
        <span>PostGen AI</span>
      </Link>

      <div className={styles.scrollArea}>
        <ul className={styles.navList}>{MAIN_NAV_ITEMS.map(renderNavItem)}</ul>

        <div className={styles.sectionLabel}>Account</div>
        <ul className={styles.navList}>
          {ACCOUNT_NAV_ITEMS.map(renderNavItem)}
          <li>
            <button type="button" onClick={handleSignOut} className={styles.navLink}>
              <i className="bi-box-arrow-right" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>

      <div className={styles.planCard}>
        <div className={styles.planCardHeader}>
          <span className={styles.planName}>{getPlanDisplayName(subscription)}</span>
        </div>
        <p className={styles.planUsageLabel}>
          {platformsUsed} / {platformsAllowed} platforms used
        </p>
        <div className={styles.planProgressTrack}>
          <div className={styles.planProgressFill} style={{ width: `${usagePct}%` }} />
        </div>
        {showUpgradeButton && (
          <Link href="/subscription" onClick={onNavigate} className={styles.upgradeButton}>
            <i className="bi-rocket-takeoff me-2" aria-hidden="true" />
            {status === "expired" ? "Upgrade to Pro/Business" : "Upgrade plan"}
          </Link>
        )}
      </div>
    </nav>
  );
}
