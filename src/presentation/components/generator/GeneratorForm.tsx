"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/presentation/components/ui/Input";
import { Textarea } from "@/presentation/components/ui/Textarea";
import { Button } from "@/presentation/components/ui/Button";
import { PlatformSelector } from "./PlatformSelector";
import { ToneSelector, TONE_OPTIONS } from "./ToneSelector";
import { POST_VARIANTS_PER_PLATFORM } from "@/shared/constants/generation";
import type { GenerateRequest, Platform, Tone } from "@/shared/types/content";

interface GeneratorFormProps {
  isGenerating: boolean;
  onGenerate: (values: GenerateRequest) => void;
  allowedPlatforms: Platform[];
  /** Falls back to "professional" - overridden by a `?tone=` query param (e.g. from a Templates pick). */
  initialTone?: Tone;
}

const DEFAULT_PLATFORMS: Platform[] = ["instagram", "linkedin"];
const VALID_TONES = new Set(TONE_OPTIONS.map((option) => option.value));

function isValidTone(value: string | null): value is Tone {
  return value !== null && VALID_TONES.has(value as Tone);
}

export function GeneratorForm({
  isGenerating,
  onGenerate,
  allowedPlatforms,
  initialTone,
}: GeneratorFormProps) {
  const searchParams = useSearchParams();
  const queryTopic = searchParams.get("topic");
  const queryTone = searchParams.get("tone");

  const [topic, setTopic] = useState(queryTopic ?? "");
  const [details, setDetails] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>(() =>
    DEFAULT_PLATFORMS.filter((platform) => allowedPlatforms.includes(platform)),
  );
  const [tone, setTone] = useState<Tone>(() =>
    isValidTone(queryTone) ? queryTone : (initialTone ?? "professional"),
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!topic.trim() || platforms.length === 0) return;
    onGenerate({ topic, details, platforms, tone });
  }

  return (
    <form onSubmit={handleSubmit} className="pg-surface p-4" noValidate>
      <Input
        label="Topic"
        name="topic"
        placeholder="e.g. Launching our new pricing plan"
        value={topic}
        onChange={(event) => setTopic(event.target.value)}
        required
      />
      <Textarea
        label="Additional details"
        name="details"
        placeholder="Key points, offers, or context to include (optional)"
        value={details}
        onChange={(event) => setDetails(event.target.value)}
      />
      <PlatformSelector
        selected={platforms}
        onChange={setPlatforms}
        allowedPlatforms={allowedPlatforms}
      />
      <ToneSelector value={tone} onChange={setTone} />
      <Button
        type="submit"
        fullWidth
        isLoading={isGenerating}
        leftIcon={isGenerating ? undefined : "bi-magic"}
      >
        {isGenerating ? "Generating..." : "Generate posts"}
      </Button>
      <p className="pg-text-muted small text-center mt-2 mb-0">
        You&apos;ll get {POST_VARIANTS_PER_PLATFORM} suggestions per platform to choose from.
      </p>
    </form>
  );
}
