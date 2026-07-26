import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUserForLayout } from "@/composition/authComposition";
import { isSubscriptionPlan, type SubscriptionPlan } from "@/shared/constants/plans";
import { CheckoutForm } from "@/presentation/components/subscription/CheckoutForm";
import styles from "./page.module.css";

interface CheckoutPageProps {
  searchParams: Promise<{ plan?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const user = await getCurrentUserForLayout();
  if (!user) redirect("/login");

  const { plan } = await searchParams;
  if (!plan || !isSubscriptionPlan(plan) || plan === "free") {
    redirect("/subscription");
  }

  return (
    <div className={`pg-grid-bg ${styles.page}`}>
      <div className={styles.container}>
        <Link href="/dashboard" className={styles.brand}>
          <i className="bi-stars" aria-hidden="true" />
          PostGen AI
        </Link>
        <div className={styles.heading}>
          <h1 className={styles.title}>Complete your upgrade</h1>
          <p className={styles.subtitle}>
            No trial for paid plans — your plan activates the moment payment succeeds.
          </p>
        </div>
        <CheckoutForm plan={plan as Extract<SubscriptionPlan, "pro" | "business">} />
      </div>
    </div>
  );
}
