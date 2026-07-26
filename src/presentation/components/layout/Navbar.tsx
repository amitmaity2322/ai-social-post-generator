"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Dropdown from "react-bootstrap/Dropdown";
import { authService } from "@/presentation/services/authService";
import { useTheme } from "@/presentation/hooks/useTheme";
import { Avatar } from "@/presentation/components/ui/Avatar";
import type { AuthenticatedUser } from "@/domain/ports/AuthPort";
import styles from "./Navbar.module.css";

interface NavbarProps {
  user: AuthenticatedUser;
  onMenuClick: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/generate": "Generate Post",
  "/history": "History",
  "/settings": "Settings",
};

function resolvePageTitle(pathname: string) {
  const match = Object.keys(PAGE_TITLES).find(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  return match ? PAGE_TITLES[match] : "Dashboard";
}

export function Navbar({ user, onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  async function handleSignOut() {
    await authService.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className={styles.navbar}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <i className="bi-list" aria-hidden="true" />
      </button>

      <h1 className={styles.title}>{resolvePageTitle(pathname)}</h1>

      <div className={styles.search}>
        <i className="bi-search" aria-hidden="true" />
        <input type="text" placeholder="Search anything..." disabled />
        <kbd className={styles.searchKbd}>&#8984;K</kbd>
      </div>

      <div className={styles.actions}>
        <span className={styles.creditsPill} title="AI credits — coming soon">
          <i className="bi-lightning-charge-fill" aria-hidden="true" />
          AI Credits
        </span>
        <button
          type="button"
          className={styles.iconButton}
          disabled
          title="Rewards — coming soon"
          aria-label="Rewards"
        >
          <i className="bi-gift" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          disabled
          title="Notifications — coming soon"
          aria-label="Notifications"
        >
          <i className="bi-bell" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle dark mode"
        >
          <i className={theme === "dark" ? "bi-sun-fill" : "bi-moon-stars"} aria-hidden="true" />
        </button>

        <Dropdown align="end">
          <Dropdown.Toggle as="button" className={styles.userToggle} id="user-menu-toggle">
            <Avatar person={user} size="sm" />
            <span className={styles.userName}>{user.fullName ?? user.email}</span>
            <i className="bi-chevron-down" aria-hidden="true" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} href="/settings">
              <i className="bi-gear me-2" aria-hidden="true" />
              Settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item as="button" onClick={handleSignOut}>
              <i className="bi-box-arrow-right me-2" aria-hidden="true" />
              Sign out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
}
