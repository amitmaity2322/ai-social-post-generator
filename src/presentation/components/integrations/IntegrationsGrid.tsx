"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/presentation/hooks/useToast";
import { updateConnectedPlatforms } from "@/presentation/services/accountService";
import { PLATFORM_META } from "@/presentation/constants/platformMeta";
import { PlanBadge } from "@/presentation/components/subscription/PlanBadge";
import type { Platform } from "@/shared/types/content";
import styles from "./IntegrationsGrid.module.css";

interface IntegrationsGridProps {
  allPlatforms: Platform[];
  allowedPlatforms: Platform[];
  initialConnected: Platform[];
}

export function IntegrationsGrid({ allPlatforms, allowedPlatforms, initialConnected }: IntegrationsGridProps) {
  const [connected, setConnected] = useState<Set<Platform>>(new Set(initialConnected));
  const [pendingPlatform, setPendingPlatform] = useState<Platform | null>(null);
  const { showToast } = useToast();
  const allowedSet = new Set(allowedPlatforms);
  const isFullyUnlocked = allowedPlatforms.length >= allPlatforms.length;

  async function handleToggle(platform: Platform) {
    if (!allowedSet.has(platform)) return;
    const wasConnected = connected.has(platform);
    const next = new Set(connected);
    if (wasConnected) next.delete(platform);
    else next.add(platform);

    setPendingPlatform(platform);
    setConnected(next);

    try {
      await updateConnectedPlatforms(Array.from(next));
      showToast(
        "success",
        wasConnected
          ? `Marked ${PLATFORM_META[platform].label} as not connected.`
          : `Marked ${PLATFORM_META[platform].label} as connected.`,
      );
    } catch (error) {
      setConnected(connected); // roll back on failure
      showToast("error", error instanceof Error ? error.message : "Failed to update connection");
    } finally {
      setPendingPlatform(null);
    }
  }

  return (
    <div className={styles.grid}>
      {!isFullyUnlocked && (
        <p className={styles.upgradeHint}>
          Locked platforms need a higher plan. <Link href="/subscription">Upgrade</Link> to unlock
          them.
        </p>
      )}
      {allPlatforms.map((platform, index) => {
        const meta = PLATFORM_META[platform];
        const isConnected = connected.has(platform);
        const isPending = pendingPlatform === platform;
        const isLocked = !allowedSet.has(platform);
        const lockedBadgePlan = index < 8 ? "pro" : "business";

        return (
          <div
            key={platform}
            className={[`pg-surface ${styles.card}`, isLocked ? styles.cardLocked : ""]
              .filter(Boolean)
              .join(" ")}
          >
            <span className={styles.icon}>
              <i className={meta.icon} aria-hidden="true" />
            </span>
            <div className={styles.body}>
              <p className={styles.label}>{meta.label}</p>
              {isLocked ? (
                <PlanBadge plan={lockedBadgePlan} locked />
              ) : (
                <span className={isConnected ? styles.statusConnected : styles.status}>
                  {isConnected ? "Connected" : "Not connected"}
                </span>
              )}
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isConnected}
              aria-label={`Toggle ${meta.label} connection`}
              disabled={isPending || isLocked}
              title={isLocked ? "Upgrade your plan to unlock this platform" : undefined}
              onClick={() => handleToggle(platform)}
              className={[styles.toggle, isConnected ? styles.toggleOn : ""]
                .filter(Boolean)
                .join(" ")}
            >
              <span className={styles.toggleKnob} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
