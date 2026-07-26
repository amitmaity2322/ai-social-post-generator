import { redirect } from "next/navigation";
import { getCurrentUserForLayout } from "@/composition/authComposition";
import { createUserRepository } from "@/composition/userComposition";
import { createPostRepository } from "@/composition/postComposition";
import { createTeamRepository } from "@/composition/teamComposition";
import { getSubscriptionOverview } from "@/application/use-cases/getSubscriptionOverview";
import { SubscriptionManager } from "@/presentation/components/subscription/SubscriptionManager";

export default async function SubscriptionPage() {
  const sessionUser = await getCurrentUserForLayout();
  if (!sessionUser) redirect("/login");

  const userRepository = await createUserRepository();
  const profile = sessionUser.email ? await userRepository.findByEmail(sessionUser.email) : null;
  if (!profile) redirect("/login");

  const [postRepository, teamRepository] = await Promise.all([
    createPostRepository(),
    createTeamRepository(),
  ]);

  const overview = await getSubscriptionOverview({ postRepository, teamRepository }, profile);

  const memberSince = new Date(profile.createdAt).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div style={{ maxWidth: 880 }}>
      <div className="mb-4">
        <h2 className="h4 mb-1">Subscription</h2>
        <p className="pg-text-muted mb-0">
          Manage your plan, track usage, and upgrade whenever you&apos;re ready.
        </p>
      </div>

      <SubscriptionManager overview={overview} memberSince={memberSince} />
    </div>
  );
}
