import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserForLayout } from "@/composition/authComposition";
import { AuthCard } from "@/presentation/components/auth/AuthCard";
import { LoginForm } from "@/presentation/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in — PostGen AI",
};

export default async function LoginPage() {
  const user = await getCurrentUserForLayout();
  if (user) redirect("/dashboard");

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to generate and manage your social posts."
      footer={
        <>
          New here?{" "}
          <Link href="/register">Start your 15-day free trial</Link> — full access, no card
          required.
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
