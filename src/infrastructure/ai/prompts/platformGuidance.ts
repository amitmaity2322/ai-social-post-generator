import type { Platform } from "@/domain/value-objects/Platform";
import type { Tone } from "@/domain/value-objects/Tone";

export const PLATFORM_GUIDANCE: Record<Platform, string> = {
  instagram:
    "Instagram: visual-first and engaging, 1-3 short paragraphs, emoji used sparingly, discoverable hashtags.",
  facebook:
    "Facebook: conversational and community-oriented, encourages comments and shares, slightly longer form.",
  linkedin: "LinkedIn: professional, thought-leadership tone, minimal emoji, insight-driven.",
  x: "X (Twitter): concise and punchy, caption under 280 characters, high-impact phrasing.",
  tiktok:
    "TikTok: written as a short-form video script/caption - hook in the first line, casual and trend-aware, built to be read aloud over a video.",
  youtube:
    "YouTube: video title-and-description style - a compelling title-like hook, then a longer, SEO-aware description with context and a subscribe/watch prompt.",
  pinterest:
    "Pinterest: a pin description - keyword-rich and search-friendly, describes the idea/outcome clearly so it surfaces well in search and boards.",
  threads:
    "Threads: casual and conversational like a text to a friend, short, opinion-forward, built to spark replies.",
  snapchat:
    "Snapchat: written as a quick, casual caption for a Snap - very short, playful, speaks directly to a close-friends audience.",
  reddit:
    "Reddit: written for a specific subreddit audience - honest and low-hype, no marketing-speak, leads with genuine context/value or it gets downvoted.",
  bluesky:
    "Bluesky: short-form and conversational like X, but the community leans skeptical of overt marketing - keep it authentic and low-hype.",
  whatsapp:
    "WhatsApp: a short broadcast-list/status message - direct and personal in tone as if messaging a customer one-to-one, no hashtags, gets to the point in the first line.",
};

export const TONE_GUIDANCE: Record<Tone, string> = {
  professional: "Polished, authoritative, business-appropriate language.",
  casual: "Relaxed, conversational, everyday language.",
  witty: "Playful and clever, light humor without being unprofessional.",
  bold: "Confident, direct, high-energy language.",
  friendly: "Warm, approachable, encouraging language.",
};
