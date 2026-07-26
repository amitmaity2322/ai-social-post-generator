/**
 * Scrolls so the target section's top edge lines up exactly under any fixed/sticky header,
 * measuring the header's actual rendered height at call time rather than a guessed CSS offset -
 * a hardcoded value drifts out of sync whenever the header's real height changes (padding
 * tweaks, responsive breakpoints, font scaling) and leaves a stray gap above the section.
 */
export function scrollToSection(id: string): void {
  if (typeof document === "undefined") return;

  const target = document.getElementById(id);
  if (!target) return;

  const header = document.querySelector<HTMLElement>("[data-landing-header]");
  const headerOffset = header?.getBoundingClientRect().height ?? 0;
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

  window.scrollTo({ top, behavior: "smooth" });
}
