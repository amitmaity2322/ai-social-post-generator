"use client";

import { useEffect, useState } from "react";
import { HistoryCard } from "@/presentation/components/posts/HistoryCard";
import { Modal } from "@/presentation/components/ui/Modal";
import { Button } from "@/presentation/components/ui/Button";
import { Loading } from "@/presentation/components/ui/Loading";
import { useToast } from "@/presentation/hooks/useToast";
import { listPosts, deletePostById } from "@/presentation/services/postGenerationService";
import type { HistoryItem } from "@/shared/types/content";

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const [viewing, setViewing] = useState<HistoryItem | null>(null);
  const [deleting, setDeleting] = useState<HistoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    let cancelled = false;

    listPosts()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((error) => {
        if (cancelled) return;
        showToast("error", error instanceof Error ? error.message : "Failed to load history");
        setItems([]);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function confirmDelete() {
    if (!deleting) return;

    setIsDeleting(true);
    try {
      await deletePostById(deleting.id);
      setItems((current) => (current ?? []).filter((item) => item.id !== deleting.id));
      showToast("success", "Post removed from history.");
      setDeleting(null);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="h4 mb-1">History</h2>
        <p className="pg-text-muted mb-0">Everything you&apos;ve saved, in one place.</p>
      </div>

      {items === null ? (
        <div className="pg-surface p-5 text-center">
          <Loading />
        </div>
      ) : items.length === 0 ? (
        <div className="pg-surface p-5 text-center pg-text-muted">No saved posts yet.</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {items.map((item) => (
            <HistoryCard key={item.id} item={item} onView={setViewing} onDelete={setDeleting} />
          ))}
        </div>
      )}

      <Modal show={!!viewing} onClose={() => setViewing(null)} title={viewing?.topic ?? ""}>
        <p className="pg-text-muted small mb-2">
          {viewing ? new Date(viewing.createdAt).toLocaleString() : ""}
        </p>
        <p className="mb-0">{viewing?.caption}</p>
      </Modal>

      <Modal
        show={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete this post?"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleting(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting}>
              Delete
            </Button>
          </>
        }
      >
        <p className="mb-0">
          This will permanently remove &quot;{deleting?.topic}&quot; from your history.
        </p>
      </Modal>
    </div>
  );
}
