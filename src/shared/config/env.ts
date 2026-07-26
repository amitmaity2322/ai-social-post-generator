import { z } from "zod";

/**
 * Split by subsystem, not one shared blob: a Groq-only request shouldn't fail
 * because MONGODB_URI isn't set, and vice versa. Each getter is parsed lazily
 * and independently - Next.js imports every route module during `next build`
 * to collect its metadata, which would otherwise run validation - and fail
 * the build, or fail an unrelated feature at runtime - before any request
 * ever arrives and before secrets need to exist.
 */
const groqEnvSchema = z.object({
  GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),
  GROQ_MODEL: z.string().default("llama-3.3-70b-versatile"),
});

const mongoEnvSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
});

function parseEnv<T extends z.ZodType>(schema: T, source: Record<string, string | undefined>) {
  const result = schema.safeParse(source);

  if (!result.success) {
    const issues = result.error.issues.map(
      (issue) => `  - ${issue.path.join(".")}: ${issue.message}`,
    );
    throw new Error(`Invalid environment configuration:\n${issues.join("\n")}`);
  }

  return result.data as z.infer<T>;
}

let cachedGroqEnv: z.infer<typeof groqEnvSchema> | undefined;
let cachedMongoEnv: z.infer<typeof mongoEnvSchema> | undefined;
let cachedClientEnv: z.infer<typeof clientEnvSchema> | undefined;

export function getGroqEnv() {
  cachedGroqEnv ??= parseEnv(groqEnvSchema, process.env);
  return cachedGroqEnv;
}

export function getMongoEnv() {
  cachedMongoEnv ??= parseEnv(mongoEnvSchema, process.env);
  return cachedMongoEnv;
}

export function getClientEnv() {
  cachedClientEnv ??= parseEnv(clientEnvSchema, {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });
  return cachedClientEnv;
}
