import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserForLayout } from "@/composition/authComposition";
import { createPostRepository } from "@/composition/postComposition";
import { buttonClassNames } from "@/presentation/components/ui";
import { MediaLibraryCard } from "@/presentation/components/media-library/MediaLibraryCard";
import styles from "./page.module.css";

const GALLERY_LIMIT = 60;

export default async function MediaLibraryPage() {
  const sessionUser = await getCurrentUserForLayout();
  if (!sessionUser) redirect("/login");

  const postRepository = await createPostRepository();
  const posts = await postRepository.listByUser(sessionUser.id, GALLERY_LIMIT);

  return (
    <div>
      <div className="mb-4">
        <h2 className="h4 mb-1">Media Library</h2>
        <p className="pg-text-muted mb-0">
          Every AI-generated image prompt from your saved posts, ready to paste into your image
          generator of choice.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="pg-surface p-5 text-center pg-text-muted">
          <p className="mb-3">No saved posts yet, so there are no image prompts to show.</p>
          <Link href="/generate" className={buttonClassNames({ variant: "primary" })}>
            <i className="bi-magic me-2" aria-hidden="true" />
            Generate a post
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {posts.map((post) => (
            <MediaLibraryCard
              key={post.id}
              platform={post.platform}
              topic={post.topic}
              imagePrompt={post.imagePrompt}
              createdAt={post.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
