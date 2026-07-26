interface LoadingProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  fullPage?: boolean;
}

const sizeMap: Record<NonNullable<LoadingProps["size"]>, string> = {
  sm: "1rem",
  md: "1.75rem",
  lg: "2.5rem",
};

export function Loading({ size = "md", label, fullPage = false }: LoadingProps) {
  const spinner = (
    <div className="d-flex flex-column align-items-center gap-2">
      <span
        className="spinner-border text-primary"
        style={{ width: sizeMap[size], height: sizeMap[size] }}
        role="status"
        aria-hidden="true"
      />
      {label && <span className="pg-text-muted small">{label}</span>}
    </div>
  );

  if (!fullPage) return spinner;

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "40vh" }}
      role="status"
      aria-live="polite"
    >
      {spinner}
    </div>
  );
}
