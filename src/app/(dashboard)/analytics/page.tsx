import { redirect } from "next/navigation";
import { getCurrentUserForLayout } from "@/composition/authComposition";
import { createPostRepository } from "@/composition/postComposition";
import { getDashboardOverview } from "@/application/use-cases/getDashboardOverview";
import { BarChart } from "@/presentation/components/dashboard/BarChart";
import { DonutChart } from "@/presentation/components/dashboard/DonutChart";
import { StatTile } from "@/presentation/components/dashboard/StatTile";
import { PLATFORM_META } from "@/presentation/constants/platformMeta";
import { CHART_COLORS } from "@/presentation/constants/chartColors";
import { PLATFORMS } from "@/domain/value-objects/Platform";

export default async function AnalyticsPage() {
  const sessionUser = await getCurrentUserForLayout();
  if (!sessionUser) redirect("/login");

  const postRepository = await createPostRepository();
  const overview = await getDashboardOverview({ postRepository }, sessionUser.id);

  const donutData = overview.platformDistribution.map((entry, index) => ({
    label: PLATFORM_META[entry.platform].label,
    value: entry.count,
    color: CHART_COLORS[index % CHART_COLORS.length]!,
  }));

  return (
    <div>
      <div className="mb-4">
        <h2 className="h4 mb-1">Analytics</h2>
        <p className="pg-text-muted mb-0">Real numbers from your generated and saved posts.</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-4">
          <StatTile
            label="Total posts"
            value={overview.totalPosts}
            icon="bi-magic"
            tone="primary"
          />
        </div>
        <div className="col-12 col-sm-4">
          <StatTile
            label="Posts this month"
            value={overview.postsThisMonth}
            icon="bi-calendar-check"
            tone="accent"
          />
        </div>
        <div className="col-12 col-sm-4">
          <StatTile
            label="Platforms covered"
            value={`${overview.platformsCovered.length}/${PLATFORMS.length}`}
            icon="bi-grid-fill"
            tone="success"
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <div className="pg-surface p-4 h-100">
            <h3 className="h6 mb-1">Posts generated</h3>
            <p className="pg-text-muted small mb-3">This calendar week</p>
            {overview.weeklyPosts.every((day) => day.count === 0) ? (
              <p className="pg-text-muted mb-0">No posts generated yet this week.</p>
            ) : (
              <BarChart
                data={overview.weeklyPosts.map((d) => ({ label: d.day, value: d.count }))}
              />
            )}
          </div>
        </div>
        <div className="col-12 col-lg-5">
          <div className="pg-surface p-4 h-100">
            <h3 className="h6 mb-1">Platform distribution</h3>
            <p className="pg-text-muted small mb-3">Where your saved posts are going</p>
            {donutData.length === 0 ? (
              <p className="pg-text-muted mb-0">No saved posts yet.</p>
            ) : (
              <DonutChart
                data={donutData}
                centerValue={overview.totalPosts}
                centerLabel="Total posts"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
