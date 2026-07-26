import Link from "next/link";
import { redirect } from "next/navigation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { buttonClassNames } from "@/presentation/components/ui";
import { Avatar } from "@/presentation/components/ui/Avatar";
import { HistoryCard } from "@/presentation/components/posts/HistoryCard";
import { StatTile } from "@/presentation/components/dashboard/StatTile";
import { BarChart, type BarChartDatum } from "@/presentation/components/dashboard/BarChart";
import { DonutChart, type DonutSlice } from "@/presentation/components/dashboard/DonutChart";
import { PreviewBadge } from "@/presentation/components/dashboard/PreviewBadge";
import { getCurrentUserForLayout } from "@/composition/authComposition";
import { createUserRepository } from "@/composition/userComposition";
import { createPostRepository } from "@/composition/postComposition";
import { createTeamRepository } from "@/composition/teamComposition";
import { getDashboardOverview } from "@/application/use-cases/getDashboardOverview";
import { getSubscriptionOverview } from "@/application/use-cases/getSubscriptionOverview";
import { getSubscriptionSummary } from "@/domain/value-objects/subscriptionStatus";
import { PLATFORMS, type Platform } from "@/domain/value-objects/Platform";
import { PLATFORM_META } from "@/presentation/constants/platformMeta";
import { CHART_COLORS } from "@/presentation/constants/chartColors";
import { TEMPLATE_CATEGORIES } from "@/presentation/constants/templateCategories";
import { MOCK_HISTORY } from "@/presentation/mock/mockData";
import { PlanStatusCardWithModal } from "@/presentation/components/subscription/PlanStatusCardWithModal";
import { UsageOverviewWithModal } from "@/presentation/components/subscription/UsageOverviewWithModal";
import { isUnlimited } from "@/shared/constants/plans";
import { formatRelativeTime } from "@/shared/utils/formatRelativeTime";
import styles from "./page.module.css";

/** Shown only until the user saves their first real post, so the dashboard doesn't look empty/broken on day one. */
const SAMPLE_STATS = { totalPosts: 24, postsThisWeek: 5, platformsCovered: 4 };
const SAMPLE_WEEKLY: BarChartDatum[] = [
  { label: "Mon", value: 2 },
  { label: "Tue", value: 4 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 5 },
  { label: "Fri", value: 4 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 3 },
];
const SAMPLE_DISTRIBUTION: Array<{ platform: Platform; count: number }> = [
  { platform: "instagram", count: 8 },
  { platform: "linkedin", count: 6 },
  { platform: "facebook", count: 6 },
  { platform: "x", count: 4 },
];

const QUICK_ACTIONS = [
  { label: "Generate Post", icon: "bi-magic", href: "/generate" },
  { label: "AI Rewrite", icon: "bi-pencil-square", href: "/coming-soon?feature=AI+Rewrite" },
  { label: "Hashtag Generator", icon: "bi-hash", href: "/coming-soon?feature=Hashtag+Generator" },
  {
    label: "Caption Generator",
    icon: "bi-chat-quote",
    href: "/coming-soon?feature=Caption+Generator",
  },
  { label: "Duplicate Post", icon: "bi-files", href: "/coming-soon?feature=Duplicate+Post" },
  { label: "Schedule Post", icon: "bi-calendar-plus", href: "/calendar" },
  { label: "Create Template", icon: "bi-file-earmark-plus", href: "/templates" },
  { label: "Brand Voice", icon: "bi-mic", href: "/brand-kit" },
];

const UPCOMING_SCHEDULE: Array<{ platform: Platform; label: string; time: string }> = [
  { platform: "linkedin", label: "LinkedIn Post", time: "10:00 AM" },
  { platform: "instagram", label: "Instagram Post", time: "3:00 PM" },
  { platform: "facebook", label: "Facebook Post", time: "7:00 PM" },
];

export default async function DashboardPage() {
  const sessionUser = await getCurrentUserForLayout();
  if (!sessionUser) redirect("/login");

  const [userRepository, postRepository, teamRepository] = await Promise.all([
    createUserRepository(),
    createPostRepository(),
    createTeamRepository(),
  ]);

  const [profile, overview, draftsCount] = await Promise.all([
    sessionUser.email ? userRepository.findByEmail(sessionUser.email) : null,
    getDashboardOverview({ postRepository }, sessionUser.id),
    postRepository.countDraftsByUser(sessionUser.id),
  ]);

  const subscriptionOverview = profile
    ? await getSubscriptionOverview({ postRepository, teamRepository }, profile)
    : {
        subscription: getSubscriptionSummary({ plan: "free", trialEndsAt: null }),
        usage: {
          posts: { used: 0, limit: 0 },
          aiCredits: { used: 0, limit: 0 },
          platforms: { used: 0, limit: 0 },
          teamMembers: { used: 1, limit: 1 },
          storageMb: { used: 0, limit: 0 },
        },
        shouldPromptUpgrade: true,
      };

  const fullName = profile?.fullName ?? sessionUser.fullName;
  const firstName = (fullName ?? sessionUser.email ?? "there").trim().split(/\s+/)[0];
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null;

  const isSampleData = overview.totalPosts === 0;

  const heroSubtext = isSampleData
    ? "You haven't generated any posts yet — let's create your first one."
    : `You've created ${overview.postsThisMonth} AI post${overview.postsThisMonth === 1 ? "" : "s"} this month.`;
  const heroSecondLine =
    !isSampleData && overview.postsThisWeek > 0
      ? `You generated ${overview.postsThisWeek} post${overview.postsThisWeek === 1 ? "" : "s"} this week. Keep going!`
      : null;

  const weeklyChartData: BarChartDatum[] = isSampleData
    ? SAMPLE_WEEKLY
    : overview.weeklyPosts.map((day) => ({
        label: day.day,
        value: day.count,
        title: `${day.day} ${day.date}: ${day.count} post${day.count === 1 ? "" : "s"}`,
      }));

  const distributionSource = isSampleData ? SAMPLE_DISTRIBUTION : overview.platformDistribution;
  const donutData: DonutSlice[] = distributionSource.map((entry, index) => ({
    label: PLATFORM_META[entry.platform].label,
    value: entry.count,
    color: CHART_COLORS[index % CHART_COLORS.length]!,
  }));
  const donutTotal = distributionSource.reduce((sum, entry) => sum + entry.count, 0);

  const topPlatform = !isSampleData
    ? [...overview.platformDistribution].sort((a, b) => b.count - a.count)[0]
    : null;
  const topPlatformPct = topPlatform
    ? Math.round((topPlatform.count / overview.totalPosts) * 100)
    : null;

  const activitySource = isSampleData ? MOCK_HISTORY : overview.recentPosts;
  const activityItems = activitySource.slice(0, 4).map((post) => ({
    id: post.id,
    icon: PLATFORM_META[post.platform].icon,
    text: `Generated a ${PLATFORM_META[post.platform].label} post`,
    time: formatRelativeTime(post.createdAt),
  }));

  const recentPosts = isSampleData ? MOCK_HISTORY : overview.recentPosts;

  return (
    <div>
      <div className={`pg-surface ${styles.hero}`}>
        <div className={styles.heroText}>
          <div className="d-flex align-items-center gap-3">
            <Avatar person={{ fullName, email: sessionUser.email }} size="lg" />
            <div>
              <h2 className={styles.heroName}>👋 Welcome back, {firstName}!</h2>
              <p className={styles.heroSubtext}>{heroSubtext}</p>
              {heroSecondLine && <p className={styles.heroSubtext}>{heroSecondLine}</p>}
            </div>
          </div>
          <div className={styles.heroActions}>
            <Link href="/generate" className={buttonClassNames({ variant: "primary" })}>
              <i className="bi-plus-lg me-2" aria-hidden="true" />
              Generate New Post
            </Link>
            <Link href="/analytics" className={buttonClassNames({ variant: "outline" })}>
              <i className="bi-bar-chart-line me-2" aria-hidden="true" />
              View Analytics
            </Link>
          </div>
        </div>
        <div className={styles.heroIllustration}>
          <span className={`${styles.blob} ${styles.blobPrimary}`}>
            <i className="bi-cpu-fill" aria-hidden="true" />
          </span>
          <span className={`${styles.blob} ${styles.blobAccent}`}>
            <i className="bi-graph-up-arrow" aria-hidden="true" />
          </span>
        </div>
      </div>

      {isSampleData && (
        <div className={`pg-surface ${styles.sampleBanner}`}>
          <i className="bi-stars" aria-hidden="true" />
          <span>
            The stats and charts below show sample data so you can see how your dashboard will look.{" "}
            <Link href="/generate">Generate your first post</Link> to replace them with your real
            numbers.
          </span>
        </div>
      )}

      <Row className="g-3 mb-4">
        <Col xs={6} lg={3}>
          <StatTile
            label="Total posts"
            value={isSampleData ? SAMPLE_STATS.totalPosts : overview.totalPosts}
            icon="bi-magic"
            tone="primary"
            sparklineValues={weeklyChartData.map((d) => d.value)}
          />
        </Col>
        <Col xs={6} lg={3}>
          <StatTile
            label="AI credits left"
            value={
              isUnlimited(subscriptionOverview.usage.aiCredits.limit)
                ? "Unlimited"
                : Math.max(
                    0,
                    subscriptionOverview.usage.aiCredits.limit - subscriptionOverview.usage.aiCredits.used,
                  ).toLocaleString()
            }
            icon="bi-lightning-charge-fill"
            tone="accent"
          />
        </Col>
        <Col xs={6} lg={3}>
          <StatTile
            label="Posts this week"
            value={isSampleData ? SAMPLE_STATS.postsThisWeek : overview.postsThisWeek}
            icon="bi-calendar-week"
            tone="success"
            sparklineValues={weeklyChartData.map((d) => d.value)}
          />
        </Col>
        <Col xs={6} lg={3}>
          <StatTile
            label="Saved drafts"
            value={draftsCount}
            icon="bi-file-earmark-post"
            tone="warning"
          />
        </Col>
        <Col xs={6} lg={3}>
          <StatTile
            label="Platforms covered"
            value={`${isSampleData ? SAMPLE_STATS.platformsCovered : overview.platformsCovered.length}/${PLATFORMS.length}`}
            icon="bi-grid-fill"
            tone="primary"
          />
        </Col>
        <Col xs={6} lg={3}>
          <StatTile
            label="Total engagement"
            value="42.3K"
            icon="bi-heart-fill"
            tone="danger"
            isPreview
          />
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col xs={12}>
          <UsageOverviewWithModal overview={subscriptionOverview} />
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col xs={12} lg={5}>
          <div className="pg-surface p-4 h-100">
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Posts generated</h3>
                <p className={styles.sectionSubtitle}>This calendar week</p>
              </div>
            </div>
            <BarChart data={weeklyChartData} />
          </div>
        </Col>
        <Col xs={12} lg={4}>
          <div className="pg-surface p-4 h-100">
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Platform distribution</h3>
                <p className={styles.sectionSubtitle}>Where your posts are going</p>
              </div>
            </div>
            {donutData.length === 0 ? (
              <p className="pg-text-muted mb-0">No saved posts yet.</p>
            ) : (
              <DonutChart data={donutData} centerValue={donutTotal} centerLabel="Total posts" />
            )}
          </div>
        </Col>
        <Col xs={12} lg={3}>
          <div className="pg-surface p-4 h-100">
            <h3 className={styles.sectionTitle}>Quick actions</h3>
            <div className={`${styles.quickActionsList} mt-2`}>
              {QUICK_ACTIONS.map((action) => (
                <Link key={action.label} href={action.href} className={styles.quickActionItem}>
                  <span className={styles.quickActionIcon}>
                    <i className={action.icon} aria-hidden="true" />
                  </span>
                  <span className={styles.quickActionLabel}>{action.label}</span>
                  <i
                    className={`bi-chevron-right ${styles.quickActionChevron}`}
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col xs={12} lg={4}>
          <div className="pg-surface p-4 h-100">
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Recent posts</h3>
              {!isSampleData && (
                <Link href="/history" className="small">
                  View all
                </Link>
              )}
            </div>
            <div className="d-flex flex-column gap-3">
              {recentPosts.slice(0, 3).map((item) => (
                <HistoryCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </Col>
        <Col xs={12} lg={4}>
          <div className="pg-surface p-4 h-100">
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Favourite templates</h3>
              <Link href="/templates" className="small">
                View all
              </Link>
            </div>
            <div className={styles.templatesGrid}>
              {TEMPLATE_CATEGORIES.slice(0, 4).map((category) => (
                <Link
                  key={category.label}
                  href={`/generate?topic=${encodeURIComponent(category.topic)}&tone=${category.tone}`}
                  className={styles.templateCard}
                >
                  <span className={styles.templateCardIcon}>
                    <i className={category.icon} aria-hidden="true" />
                  </span>
                  <span className={styles.templateCardLabel}>{category.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </Col>
        <Col xs={12} lg={4}>
          <div className={`pg-surface ${styles.insightsPanel}`}>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h3 className="h6 mb-0">
                <i className="bi-stars me-2" aria-hidden="true" />
                AI Insights
              </h3>
              <PreviewBadge />
            </div>
            <div className={styles.insightItem}>
              <i className={`bi-graph-up-arrow ${styles.insightIcon}`} aria-hidden="true" />
              <span>
                {topPlatform ? (
                  <>
                    You&apos;ve generated the most posts for{" "}
                    <strong>{PLATFORM_META[topPlatform.platform].label}</strong> ({topPlatformPct}
                    %).
                  </>
                ) : (
                  <>Generate posts for a few platforms to see which one works best for you.</>
                )}
              </span>
            </div>
            <div className={styles.insightItem}>
              <i className={`bi-lightbulb ${styles.insightIcon}`} aria-hidden="true" />
              <span>
                Try a few different tones on the same topic — professional and witty posts often
                land differently with the same audience.
              </span>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="g-3">
        <Col xs={12} lg={4}>
          <div className="pg-surface p-4 h-100">
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Upcoming schedule</h3>
              <PreviewBadge />
            </div>
            {UPCOMING_SCHEDULE.map((item) => (
              <div key={item.label} className={styles.listItem}>
                <span className={styles.listIconWrap}>
                  <i className={PLATFORM_META[item.platform].icon} aria-hidden="true" />
                </span>
                <div className={styles.listBody}>
                  <p className={styles.listTitle}>{item.label}</p>
                  <span className={styles.listMeta}>Scheduled</span>
                </div>
                <span className={styles.listTime}>{item.time}</span>
              </div>
            ))}
            <div className="mt-3">
              <Link href="/calendar" className="small">
                View calendar
              </Link>
            </div>
          </div>
        </Col>
        <Col xs={12} lg={4}>
          <div className="pg-surface p-4 h-100">
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Recent activity</h3>
              {!isSampleData && (
                <Link href="/history" className="small">
                  View all
                </Link>
              )}
            </div>
            {activityItems.length === 0 ? (
              <p className="pg-text-muted mb-0">No activity yet.</p>
            ) : (
              activityItems.map((item) => (
                <div key={item.id} className={styles.listItem}>
                  <span className={styles.listIconWrap}>
                    <i className={item.icon} aria-hidden="true" />
                  </span>
                  <div className={styles.listBody}>
                    <p className={styles.listTitle}>{item.text}</p>
                  </div>
                  <span className={styles.listTime}>
                    <i className="bi-check-circle-fill text-success me-1" aria-hidden="true" />
                    {item.time}
                  </span>
                </div>
              ))
            )}
          </div>
        </Col>
        <Col xs={12} lg={4}>
          <div className="h-100">
            <PlanStatusCardWithModal
              subscription={subscriptionOverview.subscription}
              memberSince={memberSince}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
