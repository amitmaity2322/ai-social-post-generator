import type { PlatformStreamState } from "@/presentation/hooks/useGeneratePosts";
import styles from "./VariantTabs.module.css";

interface VariantTabsProps {
  variants: PlatformStreamState[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

function statusIcon(status: PlatformStreamState["status"]) {
  if (status === "complete") return "bi-check-circle-fill";
  if (status === "error") return "bi-exclamation-circle-fill";
  return null;
}

export function VariantTabs({ variants, activeIndex, onSelect }: VariantTabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Suggestions">
      {variants.map((variant, index) => {
        const icon = statusIcon(variant.status);
        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            className={`${styles.tab} ${index === activeIndex ? styles.active : ""} ${
              variant.status === "error" ? styles.errorTab : ""
            }`}
            onClick={() => onSelect(index)}
          >
            {variant.status === "streaming" ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            ) : (
              icon && <i className={icon} aria-hidden="true" />
            )}
            Suggestion {index + 1}
          </button>
        );
      })}
    </div>
  );
}
