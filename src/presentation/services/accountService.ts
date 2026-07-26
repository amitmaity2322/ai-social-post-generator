import type { SubscriptionPlan } from "@/shared/constants/plans";
import type { Tone, Platform } from "@/shared/types/content";

interface ErrorResponseBody {
  success: false;
  error: { code: string; message: string };
}

export interface BrandKitInput {
  brandVoice: string;
  brandColor: string;
  logoUrl: string;
}

/** The one place in the app allowed to know PATCH /api/account/plan's wire format. */
export async function changePlan(plan: SubscriptionPlan): Promise<void> {
  const response = await fetch("/api/account/plan", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ErrorResponseBody | null;
    throw new Error(body?.error.message ?? `Request failed with status ${response.status}`);
  }
}

/** The one place in the app allowed to know PATCH /api/account/default-tone's wire format. */
export async function changeDefaultTone(defaultTone: Tone): Promise<void> {
  const response = await fetch("/api/account/default-tone", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ defaultTone }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ErrorResponseBody | null;
    throw new Error(body?.error.message ?? `Request failed with status ${response.status}`);
  }
}

/** The one place in the app allowed to know PATCH /api/account/brand-kit's wire format. */
export async function updateBrandKit(input: BrandKitInput): Promise<void> {
  const response = await fetch("/api/account/brand-kit", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ErrorResponseBody | null;
    throw new Error(body?.error.message ?? `Request failed with status ${response.status}`);
  }
}

/** The one place in the app allowed to know PATCH /api/account/integrations's wire format. */
export async function updateConnectedPlatforms(platforms: Platform[]): Promise<void> {
  const response = await fetch("/api/account/integrations", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ platforms }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ErrorResponseBody | null;
    throw new Error(body?.error.message ?? `Request failed with status ${response.status}`);
  }
}
