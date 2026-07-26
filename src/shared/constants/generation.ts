/**
 * How many independent drafts to generate per platform per request, so the
 * user can review a few options and pick one instead of getting a single
 * take-it-or-leave-it result. Shared between the use case (which fans out
 * this many parallel completions) and the frontend (which seeds this many
 * streaming placeholders before the first chunk arrives).
 */
export const POST_VARIANTS_PER_PLATFORM = 4;
