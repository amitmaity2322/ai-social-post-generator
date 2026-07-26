"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/presentation/components/ui/Input";
import { Checkbox } from "@/presentation/components/ui/Checkbox";
import { Button } from "@/presentation/components/ui/Button";
import { authService } from "@/presentation/services/authService";
import { PLAN_LABELS } from "@/shared/constants/plans";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const paidPlan = planParam === "pro" || planParam === "business" ? planParam : null;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsSubmitting(true);
    const { error: signUpError } = await authService.signUp(email, password, fullName);

    if (signUpError) {
      setError(signUpError);
      setIsSubmitting(false);
      return;
    }

    router.push(paidPlan ? `/checkout?plan=${paidPlan}` : "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {paidPlan && (
        <div className="alert alert-info d-flex align-items-center gap-2" role="status">
          <i className="bi-credit-card-fill" aria-hidden="true" />
          <span>
            Signing up for the <strong>{PLAN_LABELS[paidPlan]}</strong> plan — no trial, you&apos;ll
            complete payment on the next step.
          </span>
        </div>
      )}
      <Input
        label="Full name"
        name="fullName"
        placeholder="Jamie Doe"
        required
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
      />
      <Input
        label="Email address"
        type="email"
        name="email"
        placeholder="you@company.com"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="••••••••"
        required
        minLength={8}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Input
        label="Confirm password"
        type="password"
        name="confirmPassword"
        placeholder="••••••••"
        required
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
      />
      <div className="mb-3">
        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          name="terms"
          required
          checked={agreedToTerms}
          onChange={(event) => setAgreedToTerms(event.target.checked)}
        />
      </div>
      <Button type="submit" fullWidth isLoading={isSubmitting}>
        {paidPlan ? `Continue to payment` : "Start my 15-day free trial"}
      </Button>
    </form>
  );
}
