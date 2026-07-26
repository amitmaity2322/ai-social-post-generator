import { ReactNode } from "react";
import { LandingNavbar } from "@/presentation/components/marketing/LandingNavbar";
import { LandingFooter } from "@/presentation/components/marketing/LandingFooter";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <LandingNavbar />
      <main className="flex-grow-1">{children}</main>
      <LandingFooter />
    </div>
  );
}
