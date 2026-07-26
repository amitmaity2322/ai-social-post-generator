"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HistoryCard } from "@/presentation/components/posts/HistoryCard";
import { Modal } from "@/presentation/components/ui/Modal";
import { Button, buttonClassNames } from "@/presentation/components/ui";
import { Loading } from "@/presentation/components/ui/Loading";
import { useToast } from "@/presentation/hooks/useToast";
import {
  listPosts,
  deletePostById,
  publishPostById,
} from "@/presentation/services/postGenerationService";
import type { HistoryItem } from "@/shared/types/content";

export default function DraftsPage() {
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const [viewing, setViewing] = useState<HistoryItem | null>(null);
  const [deleting, setDeleting] = useState<HistoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    let cancelled = false;

    listPosts("draft")
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((error) => {
        if (cancelled) return;
        showToast("error", error instanceof Error ? error.message : "Failed to load drafts");
        setItems([]);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePublish(item: HistoryItem) {
    setPublishingId(item.id);
    try {
      await publishPostById(item.id);
      setItems((current) => (current ?? []).filter((post) => post.id !== item.id));
      showToast("success", "Published! It now shows up in your History and dashboard totals.");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to publish draft");
    } finally {
      setPublishingId(null);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;

    setIsDeleting(true);
    try {
      await deletePostById(deleting.id);
      setItems((current) => (current ?? []).filter((item) => item.id !== deleting.id));
      showToast("success", "Draft deleted.");
      setDeleting(null);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to delete draft");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="h4 mb-1">Drafts</h2>
        <p className="pg-text-muted mb-0">
          Posts you&apos;ve saved without publishing yet. Publish when they&apos;re ready.
        </p>
      </div>

      {items === null ? (
        <div className="pg-surface p-5 text-center">
          <Loading />
        </div>
      ) : items.length === 0 ? (
        <div className="pg-surface p-5 text-center pg-text-muted">
          <p className="mb-3">No drafts yet.</p>
          <Link href="/generate" className={buttonClassNames({ variant: "primary" })}>
            <i className="bi-magic me-2" aria-hidden="true" />
            Generate a post
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {items.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              onView={setViewing}
              onDelete={setDeleting}
              onPublish={handlePublish}
              isPublishing={publishingId === item.id}
            />
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
        title="Delete this draft?"
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
          This will permanently remove &quot;{deleting?.topic}&quot; from your drafts.
        </p>
      </Modal>
    </div>
  );
}
