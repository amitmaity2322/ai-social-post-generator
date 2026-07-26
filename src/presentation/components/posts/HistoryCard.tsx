import { Button } from "@/presentation/components/ui/Button";
import { PLATFORM_META } from "@/presentation/constants/platformMeta";
import type { HistoryItem } from "@/shared/types/content";
import styles from "./HistoryCard.module.css";

interface HistoryCardProps {
  item: HistoryItem;
  onView?: (item: HistoryItem) => void;
  onDelete?: (item: HistoryItem) => void;
  onPublish?: (item: HistoryItem) => void;
  isPublishing?: boolean;
}

export function HistoryCard({
  item,
  onView,
  onDelete,
  onPublish,
  isPublishing = false,
}: HistoryCardProps) {
  const meta = PLATFORM_META[item.platform];
  const createdAt = new Date(item.createdAt);

  return (
    <div className={`pg-surface ${styles.card}`}>
      <div className={styles.iconWrap}>
        <i className={meta.icon} aria-hidden="true" />
      </div>
      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={styles.platform}>
            {meta.label}
            {item.status === "draft" && <span className={styles.draftBadge}>Draft</span>}
          </span>
          <span className={styles.date}>{createdAt.toLocaleDateString()}</span>
        </div>
        <h3 className={styles.topic}>{item.topic}</h3>
        <p className={styles.snippet}>{item.caption}</p>
      </div>
      <div className={styles.actions}>
        {onView && (
          <Button variant="ghost" size="sm" leftIcon="bi-eye" onClick={() => onView(item)}>
            View
          </Button>
        )}
        {onPublish && (
          <Button
            variant="secondary"
            size="sm"
            leftIcon="bi-send-check"
            isLoading={isPublishing}
            onClick={() => onPublish(item)}
          >
            Publish
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" leftIcon="bi-trash" onClick={() => onDelete(item)}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
