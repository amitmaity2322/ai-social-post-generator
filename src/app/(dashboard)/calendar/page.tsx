import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserForLayout } from "@/composition/authComposition";
import { createPostRepository } from "@/composition/postComposition";
import { PLATFORM_META } from "@/presentation/constants/platformMeta";
import styles from "./page.module.css";

interface CalendarPageProps {
  searchParams: Promise<{ month?: string }>;
}

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function parseMonthParam(month?: string): { year: number; monthIndex: number } {
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [year, m] = month.split("-").map(Number);
    return { year: year!, monthIndex: m! - 1 };
  }
  const now = new Date();
  return { year: now.getUTCFullYear(), monthIndex: now.getUTCMonth() };
}

function toMonthParam(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

function addMonths(year: number, monthIndex: number, delta: number) {
  const total = year * 12 + monthIndex + delta;
  return { year: Math.floor(total / 12), monthIndex: ((total % 12) + 12) % 12 };
}

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
  const sessionUser = await getCurrentUserForLayout();
  if (!sessionUser) redirect("/login");

  const { month } = await searchParams;
  const { year, monthIndex } = parseMonthParam(month);

  const monthStart = new Date(Date.UTC(year, monthIndex, 1));
  const monthEnd = new Date(Date.UTC(year, monthIndex + 1, 1));

  const postRepository = await createPostRepository();
  const posts = await postRepository.listByUserInRange(sessionUser.id, monthStart, monthEnd);

  const postsByDay = new Map<number, typeof posts>();
  for (const post of posts) {
    const day = new Date(post.createdAt).getUTCDate();
    const list = postsByDay.get(day) ?? [];
    list.push(post);
    postsByDay.set(day, list);
  }

  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const firstWeekday = monthStart.getUTCDay(); // 0 = Sunday ... 6 = Saturday
  const leadingBlanks = firstWeekday === 0 ? 6 : firstWeekday - 1; // Monday-start offset

  const cells: Array<number | null> = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const monthLabel = monthStart.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const prevMonth = addMonths(year, monthIndex, -1);
  const nextMonth = addMonths(year, monthIndex, 1);

  const today = new Date();
  const isCurrentMonth = today.getUTCFullYear() === year && today.getUTCMonth() === monthIndex;
  const todayDate = today.getUTCDate();

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="h4 mb-1">Calendar</h2>
          <p className="pg-text-muted mb-0">
            A read-only view of the posts you&apos;ve saved, by date.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Link
            href={`/calendar?month=${toMonthParam(prevMonth.year, prevMonth.monthIndex)}`}
            className={styles.navButton}
            aria-label="Previous month"
          >
            <i className="bi-chevron-left" aria-hidden="true" />
          </Link>
          <span className="fw-bold" style={{ minWidth: 130, textAlign: "center" }}>
            {monthLabel}
          </span>
          <Link
            href={`/calendar?month=${toMonthParam(nextMonth.year, nextMonth.monthIndex)}`}
            className={styles.navButton}
            aria-label="Next month"
          >
            <i className="bi-chevron-right" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="pg-surface p-3">
        <div className={styles.weekdayRow}>
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className={styles.weekdayLabel}>
              {label}
            </div>
          ))}
        </div>
        <div className={styles.grid}>
          {cells.map((day, index) => {
            if (day === null) return <div key={`blank-${index}`} className={styles.cellBlank} />;

            const dayPosts = postsByDay.get(day) ?? [];
            const isToday = isCurrentMonth && day === todayDate;

            return (
              <div key={day} className={`${styles.cell} ${isToday ? styles.cellToday : ""}`}>
                <span className={styles.cellDay}>{day}</span>
                <div className={styles.cellPosts}>
                  {dayPosts.slice(0, 3).map((post) => (
                    <span key={post.id} className={styles.postChip} title={post.topic}>
                      <i className={PLATFORM_META[post.platform].icon} aria-hidden="true" />
                    </span>
                  ))}
                  {dayPosts.length > 3 && (
                    <span className={styles.postChipMore}>+{dayPosts.length - 3}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
