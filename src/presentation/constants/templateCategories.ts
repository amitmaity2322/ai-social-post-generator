import type { Tone } from "@/shared/types/content";

export interface TemplateCategory {
  label: string;
  icon: string;
  topic: string;
  tone: Tone;
}

/** Each category is a real starting point for Generate - not just decoration - so picking one takes you to Generate with a topic and tone already filled in. */
export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    label: "Business Promotion",
    icon: "bi-megaphone",
    topic: "Promoting our latest business offer",
    tone: "professional",
  },
  {
    label: "Product Launch",
    icon: "bi-rocket-takeoff",
    topic: "Launching our newest product",
    tone: "bold",
  },
  {
    label: "Motivational",
    icon: "bi-emoji-smile",
    topic: "A motivational message for our audience",
    tone: "friendly",
  },
  {
    label: "Sale",
    icon: "bi-tag",
    topic: "Announcing a limited-time sale",
    tone: "bold",
  },
  {
    label: "Announcement",
    icon: "bi-bell",
    topic: "An important company announcement",
    tone: "professional",
  },
  {
    label: "Festival",
    icon: "bi-stars",
    topic: "Celebrating an upcoming festival with our audience",
    tone: "friendly",
  },
  {
    label: "Hiring",
    icon: "bi-people",
    topic: "We're hiring — announcing an open role",
    tone: "professional",
  },
  {
    label: "Tips & Tricks",
    icon: "bi-lightbulb",
    topic: "Sharing a quick tip our audience will love",
    tone: "witty",
  },
];
