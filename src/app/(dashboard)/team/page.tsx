import { redirect } from "next/navigation";
import { getCurrentUserForLayout } from "@/composition/authComposition";
import { createTeamRepository } from "@/composition/teamComposition";
import { createUserRepository } from "@/composition/userComposition";
import { listTeamInvites } from "@/application/use-cases/listTeamInvites";
import { getSubscriptionSummary } from "@/domain/value-objects/subscriptionStatus";
import { Avatar } from "@/presentation/components/ui/Avatar";
import { TeamInvitesPanel } from "@/presentation/components/team/TeamInvitesPanel";
import { PLAN_TEAM_MEMBER_LIMITS } from "@/shared/constants/plans";

export default async function TeamPage() {
  const sessionUser = await getCurrentUserForLayout();
  if (!sessionUser) redirect("/login");

  const [teamRepository, userRepository] = await Promise.all([
    createTeamRepository(),
    createUserRepository(),
  ]);
  const [invites, profile] = await Promise.all([
    listTeamInvites({ teamRepository }, sessionUser.id),
    sessionUser.email ? userRepository.findByEmail(sessionUser.email) : null,
  ]);

  const { effectivePlan } = getSubscriptionSummary(profile ?? { plan: "free", trialEndsAt: null });
  const seatLimit = PLAN_TEAM_MEMBER_LIMITS[effectivePlan];

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="mb-4">
        <h2 className="h4 mb-1">Team</h2>
        <p className="pg-text-muted mb-0">
          Invite teammates to your workspace. Shared access to posts is part of a future update —
          invites here are saved for real, but a teammate accepting one doesn&apos;t yet grant them
          access to your saved posts.
        </p>
      </div>

      <div className="pg-surface p-4 mb-4 d-flex align-items-center gap-3">
        <Avatar person={{ fullName: sessionUser.fullName, email: sessionUser.email }} size="md" />
        <div>
          <p className="fw-bold mb-0">{sessionUser.fullName ?? sessionUser.email}</p>
          <span className="pg-text-muted small">Owner</span>
        </div>
      </div>

      <TeamInvitesPanel initialInvites={invites} seatLimit={seatLimit} effectivePlan={effectivePlan} />
    </div>
  );
}
