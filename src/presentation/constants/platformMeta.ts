import type { Platform } from "@/shared/types/content";

export const PLATFORM_META: Record<Platform, { label: string; icon: string }> = {
  instagram: { label: "Instagram", icon: "bi-instagram" },
  facebook: { label: "Facebook", icon: "bi-facebook" },
  linkedin: { label: "LinkedIn", icon: "bi-linkedin" },
  x: { label: "X", icon: "bi-twitter-x" },
  tiktok: { label: "TikTok", icon: "bi-tiktok" },
  youtube: { label: "YouTube", icon: "bi-youtube" },
  pinterest: { label: "Pinterest", icon: "bi-pinterest" },
  threads: { label: "Threads", icon: "bi-threads" },
  snapchat: { label: "Snapchat", icon: "bi-snapchat" },
  reddit: { label: "Reddit", icon: "bi-reddit" },
  bluesky: { label: "Bluesky", icon: "bi-bluesky" },
  whatsapp: { label: "WhatsApp", icon: "bi-whatsapp" },
};
