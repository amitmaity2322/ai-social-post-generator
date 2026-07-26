import { PLATFORM_META } from "@/presentation/constants/platformMeta";
import type { Platform } from "@/shared/types/content";

interface StreamingPostPreviewProps {
  platform: Platform;
  rawText: string;
}

export function StreamingPostPreview({ platform, rawText }: StreamingPostPreviewProps) {
  const meta = PLATFORM_META[platform];

  return (
    <div className="pg-surface p-4">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="d-inline-flex align-items-center gap-2 fw-bold">
          <i className={meta.icon} aria-hidden="true" />
          {meta.label}
        </span>
        <span
          className="spinner-border spinner-border-sm text-primary"
          role="status"
          aria-hidden="true"
        />
      </div>
      <p className="mb-0 pg-text-muted" style={{ whiteSpace: "pre-line" }}>
        {rawText || "Generating..."}
      </p>
    </div>
  );
}
