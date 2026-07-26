const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Coarse "10 min ago" / "3 hours ago" / "Yesterday" / "3 days ago" formatting for activity feeds. */
export function formatRelativeTime(isoDate: string, now: number = Date.now()): string {
  const diffMs = now - new Date(isoDate).getTime();
  if (diffMs < MINUTE) return "Just now";
  if (diffMs < HOUR) return `${Math.floor(diffMs / MINUTE)} min ago`;
  if (diffMs < DAY) {
    const hours = Math.floor(diffMs / HOUR);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  const days = Math.floor(diffMs / DAY);
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}
