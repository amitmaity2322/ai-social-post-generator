import type { GeneratedPost, HistoryItem } from "@/shared/types/content";

export const MOCK_GENERATED_POSTS: GeneratedPost[] = [
  {
    id: "mock-1",
    platform: "instagram",
    tone: "casual",
    topic: "Launching our all-in-one content workflow",
    hook: "Still juggling five apps just to post one update?",
    caption:
      "We just made your content workflow disappear into one click. Type a topic, pick your platforms, and get a full post — caption, hashtags, and all — before your coffee gets cold.",
    hashtags: ["contentcreation", "socialmediatips", "aiwriting", "smallbusiness"],
    cta: "Try it free — link in bio.",
    imagePrompt:
      "A minimalist flat-lay of a phone showing a social feed, soft morning light, pastel gradient background.",
  },
  {
    id: "mock-2",
    platform: "linkedin",
    tone: "professional",
    topic: "Why content creation shouldn't be a marketing bottleneck",
    hook: "Content creation shouldn't be the bottleneck in your marketing.",
    caption:
      "Teams lose hours every week rewriting the same idea for four different platforms. We built PostGen AI to close that gap: one topic in, a fully-tailored set of posts out — matched to each platform's tone and format.",
    hashtags: ["contentmarketing", "productivitytools", "b2bsaas"],
    cta: "See how teams are cutting content time in half.",
    imagePrompt:
      "A clean product screenshot mockup on a gradient purple background, professional SaaS style.",
  },
  {
    id: "mock-3",
    platform: "facebook",
    tone: "friendly",
    topic: "Weekly reminder: consistency beats perfection",
    hook: "Your weekly reminder that consistency beats perfection.",
    caption:
      "You don't need a perfect post today — you need a post. PostGen AI helps you keep showing up with fresh, on-brand content every single week.",
    hashtags: ["smallbusinesstips", "marketingmadeeasy"],
    cta: "Generate this week's posts in under a minute.",
    imagePrompt:
      "A warm, candid photo of a small business owner smiling at a laptop, natural lighting.",
  },
  {
    id: "mock-4",
    platform: "x",
    tone: "bold",
    topic: "Why your hashtags are probably too generic",
    hook: "Hot take: your hashtags are probably too generic.",
    caption:
      "Here's a 30-second fix: swap broad tags for niche ones your actual audience searches for.",
    hashtags: ["growthtips", "socialmedia"],
    cta: "Get tailored hashtags for every post you write.",
    imagePrompt:
      "A bold, high-contrast graphic with a single stat overlaid on a gradient background.",
  },
];

export const MOCK_HISTORY: HistoryItem[] = [
  {
    id: "history-1",
    platform: "instagram",
    topic: "Launching our new pricing plan",
    caption:
      "Big news: our new Starter plan is here, and it's built for teams just getting started with content...",
    createdAt: "2026-07-20T09:15:00.000Z",
    status: "final",
  },
  {
    id: "history-2",
    platform: "linkedin",
    topic: "Hiring a senior product designer",
    caption:
      "We're growing! Looking for a senior product designer who cares about craft as much as we do...",
    createdAt: "2026-07-18T14:30:00.000Z",
    status: "final",
  },
  {
    id: "history-3",
    platform: "x",
    topic: "Weekly product tip: hashtags",
    caption: "Hot take: your hashtags are probably too generic. Here's a 30-second fix...",
    createdAt: "2026-07-16T11:00:00.000Z",
    status: "final",
  },
  {
    id: "history-4",
    platform: "facebook",
    topic: "Customer story: Bloom Cafe",
    caption:
      "Bloom Cafe grew their weekend foot traffic 22% after switching up their post cadence with us...",
    createdAt: "2026-07-12T16:45:00.000Z",
    status: "final",
  },
];
