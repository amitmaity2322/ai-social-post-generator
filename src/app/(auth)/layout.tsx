import { ReactNode } from "react";

/**
 * Redirecting already-signed-in visitors away from these pages happens in each page instead of
 * here - layouts can't read `searchParams`, and register/page.tsx needs the `?plan=` query param
 * to send an already-logged-in user straight to checkout instead of losing that intent.
 */
export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
