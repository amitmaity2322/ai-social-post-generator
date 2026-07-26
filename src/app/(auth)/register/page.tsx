import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserForLayout } from "@/composition/authComposition";
import { AuthCard } from "@/presentation/components/auth/AuthCard";
import { RegisterForm } from "@/presentation/components/auth/RegisterForm";
import { PLAN_LABELS } from "@/shared/constants/plans";

export const metadata: Metadata = {
  title: "Sign up — PostGen AI",
};

interface RegisterPageProps {
  searchParams: Promise<{ plan?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { plan } = await searchParams;
  const paidPlan = plan === "pro" || plan === "business" ? plan : null;

  // An already-signed-in visitor clicking a pricing CTA should still land where they intended -
  // straight to checkout for a paid plan - rather than being bounced to the dashboard and losing
  // that intent (this can happen right after finishing a checkout in the same session, then
  // clicking a different plan's CTA on the pricing page).
  const user = await getCurrentUserForLayout();
  if (user) redirect(paidPlan ? `/checkout?plan=${paidPlan}` : "/dashboard");

  return (
    <AuthCard
      title="Create your account"
      subtitle={
        paidPlan
          ? `Sign up to activate the ${PLAN_LABELS[paidPlan]} plan — no trial, instant access after payment.`
          : "Start your 15-day free trial — full access to every feature, no credit card required."
      }
      footer={
        <>
          Already have an account? <Link href="/login">Log in</Link>
        </>
      }
    >
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthCard>
  );
}
