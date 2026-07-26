"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/presentation/components/ui/Input";
import { Checkbox } from "@/presentation/components/ui/Checkbox";
import { Button } from "@/presentation/components/ui/Button";
import { authService } from "@/presentation/services/authService";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: signInError } = await authService.signIn(email, password);

    if (signInError) {
      setError(signInError);
      setIsSubmitting(false);
      return;
    }

    // Server Components (the dashboard layout's session check) can be
    // stale in the Router Cache from before sign-in; refresh forces a
    // fresh server render so it sees the new session cookie.
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
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
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <div className="d-flex align-items-center justify-content-between mb-3">
        <Checkbox label="Remember me" name="rememberMe" />
        <a href="#" className="small">
          Forgot password?
        </a>
      </div>
      <Button type="submit" fullWidth isLoading={isSubmitting}>
        Log in
      </Button>
    </form>
  );
}
