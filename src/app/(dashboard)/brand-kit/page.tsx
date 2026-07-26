import { redirect } from "next/navigation";
import { getCurrentUserForLayout } from "@/composition/authComposition";
import { createUserRepository } from "@/composition/userComposition";
import { BrandKitForm } from "@/presentation/components/settings/BrandKitForm";

export default async function BrandKitPage() {
  const sessionUser = await getCurrentUserForLayout();
  if (!sessionUser) redirect("/login");

  const userRepository = await createUserRepository();
  const profile = sessionUser.email ? await userRepository.findByEmail(sessionUser.email) : null;

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="mb-4">
        <h2 className="h4 mb-1">Brand Kit</h2>
        <p className="pg-text-muted mb-0">
          Define your brand voice and colors. Your brand voice is automatically included every time
          you generate a post.
        </p>
      </div>

      <BrandKitForm
        initial={{
          brandVoice: profile?.brandVoice ?? "",
          brandColor: profile?.brandColor ?? "#6d28d9",
          logoUrl: profile?.logoUrl ?? "",
        }}
      />
    </div>
  );
}
