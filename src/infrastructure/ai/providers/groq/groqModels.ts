export const GROQ_MODELS = {
  LLAMA_3_3_70B_VERSATILE: "llama-3.3-70b-versatile",
  LLAMA_3_1_8B_INSTANT: "llama-3.1-8b-instant",
  GEMMA2_9B_IT: "gemma2-9b-it",
} as const;

/** One of the named constants above, or any other Groq-hosted model id. */
export type GroqModel = (typeof GROQ_MODELS)[keyof typeof GROQ_MODELS] | (string & {});
