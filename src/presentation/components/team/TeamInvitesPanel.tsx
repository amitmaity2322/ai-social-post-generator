"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Input } from "@/presentation/components/ui/Input";
import { Dropdown } from "@/presentation/components/ui/Dropdown";
import { Button } from "@/presentation/components/ui/Button";
import { PlanBadge } from "@/presentation/components/subscription/PlanBadge";
import { useToast } from "@/presentation/hooks/useToast";
import { createInvite, revokeInvite } from "@/presentation/services/teamService";
import type { TeamInviteItem, TeamInviteRole } from "@/shared/types/team";
import type { SubscriptionPlan } from "@/shared/constants/plans";
import styles from "./TeamInvitesPanel.module.css";

const ROLE_OPTIONS = [
  { value: "member", label: "Member" },
  { value: "admin", label: "Admin" },
];

interface TeamInvitesPanelProps {
  initialInvites: TeamInviteItem[];
  seatLimit: number;
  effectivePlan: SubscriptionPlan;
}

export function TeamInvitesPanel({ initialInvites, seatLimit, effectivePlan }: TeamInvitesPanelProps) {
  const [invites, setInvites] = useState(initialInvites);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamInviteRole>("member");
  const [isInviting, setIsInviting] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const seatsUsed = 1 + invites.length; // owner counts as a seat
  const atSeatLimit = seatsUsed >= seatLimit;
  const upgradeBadgePlan = effectivePlan === "free" ? "pro" : "business";

  async function handleInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || atSeatLimit) return;

    setIsInviting(true);
    try {
      const invite = await createInvite(email.trim(), role);
      setInvites((current) => [invite, ...current]);
      setEmail("");
      showToast("success", `Invite sent to ${invite.email}.`);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to send invite");
    } finally {
      setIsInviting(false);
    }
  }

  async function handleRevoke(invite: TeamInviteItem) {
    setRevokingId(invite.id);
    try {
      await revokeInvite(invite.id);
      setInvites((current) => current.filter((item) => item.id !== invite.id));
      showToast("success", "Invite revoked.");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to revoke invite");
    } finally {
      setRevokingId(null);
    }
  }

  return (
    <>
      <div className="pg-surface p-4 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="h6 mb-0">Invite a teammate</h3>
          <span className="pg-text-muted small">
            {seatsUsed} / {seatLimit} seats used
          </span>
        </div>

        {atSeatLimit ? (
          <div className={styles.limitNotice}>
            <PlanBadge plan={upgradeBadgePlan} locked />
            <span>
              You&apos;ve used all {seatLimit} seats on your plan.{" "}
              <Link href="/subscription">Upgrade</Link> to invite more teammates.
            </span>
          </div>
        ) : (
          <form onSubmit={handleInvite} className={styles.form} noValidate>
            <div className={styles.emailField}>
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="teammate@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mb-0"
              />
            </div>
            <div className={styles.roleField}>
              <Dropdown
                label="Role"
                name="role"
                value={role}
                onChange={(event) => setRole(event.target.value as TeamInviteRole)}
                options={ROLE_OPTIONS}
                className="mb-0"
              />
            </div>
            <Button type="submit" isLoading={isInviting} leftIcon="bi-person-plus">
              Send invite
            </Button>
          </form>
        )}
      </div>

      <div className="pg-surface p-4">
        <h3 className="h6 mb-3">Pending invites</h3>
        {invites.length === 0 ? (
          <p className="pg-text-muted mb-0">No pending invites yet.</p>
        ) : (
          invites.map((invite) => (
            <div key={invite.id} className={styles.inviteRow}>
              <span className={styles.inviteAvatar}>
                <i className="bi-envelope" aria-hidden="true" />
              </span>
              <div className={styles.inviteBody}>
                <p className={styles.inviteEmail}>{invite.email}</p>
                <span className={styles.inviteMeta}>
                  Invited {new Date(invite.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span className={styles.roleBadge}>{invite.role}</span>
              <Button
                variant="ghost"
                size="sm"
                leftIcon="bi-x-lg"
                isLoading={revokingId === invite.id}
                onClick={() => handleRevoke(invite)}
              >
                Revoke
              </Button>
            </div>
          ))
        )}
      </div>
    </>
  );
}
