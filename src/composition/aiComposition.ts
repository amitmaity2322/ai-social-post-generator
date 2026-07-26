import type { AIProviderPort } from "@/domain/ports/AIProviderPort";
import { GroqProvider } from "@/infrastructure/ai/providers/groq/GroqProvider";

export function getAIProvider(): AIProviderPort {
  return GroqProvider.getInstance();
}
