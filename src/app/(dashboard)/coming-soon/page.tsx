import { ComingSoonPage } from "@/presentation/components/layout/ComingSoonPage";

interface ComingSoonRouteProps {
  searchParams: Promise<{ feature?: string }>;
}

export default async function ComingSoonRoute({ searchParams }: ComingSoonRouteProps) {
  const { feature } = await searchParams;
  const title = feature || "This feature";

  return (
    <ComingSoonPage
      title={title}
      description={`${title} isn't available yet, but it's on our roadmap.`}
      icon="bi-stars"
    />
  );
}
