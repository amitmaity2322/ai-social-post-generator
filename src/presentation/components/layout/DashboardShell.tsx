"use client";

import { ReactNode, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { TrialBanner } from "@/presentation/components/subscription/TrialBanner";
import type { AuthenticatedUser } from "@/domain/ports/AuthPort";
import type { SubscriptionSummary } from "@/domain/value-objects/subscriptionStatus";
import styles from "./DashboardShell.module.css";

interface DashboardShellProps {
  children: ReactNode;
  user: AuthenticatedUser;
  subscription: SubscriptionSummary;
  platformsUsed: number;
  platformsAllowed: number;
}

export function DashboardShell({
  children,
  user,
  subscription,
  platformsUsed,
  platformsAllowed,
}: DashboardShellProps) {
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <div className={styles.shell}>
      <div className={styles.desktopSidebar}>
        <Sidebar
          subscription={subscription}
          platformsUsed={platformsUsed}
          platformsAllowed={platformsAllowed}
        />
      </div>

      <Offcanvas
        show={showMobileNav}
        onHide={() => setShowMobileNav(false)}
        className={styles.offcanvas}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <Sidebar
            subscription={subscription}
            platformsUsed={platformsUsed}
            platformsAllowed={platformsAllowed}
            onNavigate={() => setShowMobileNav(false)}
          />
        </Offcanvas.Body>
      </Offcanvas>

      <div className={styles.main}>
        <Navbar user={user} onMenuClick={() => setShowMobileNav(true)} />
        <main className={styles.content}>
          <TrialBanner subscription={subscription} />
          {children}
        </main>
      </div>
    </div>
  );
}
