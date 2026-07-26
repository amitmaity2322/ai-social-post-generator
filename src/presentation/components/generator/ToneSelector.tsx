import { ChangeEvent } from "react";
import { Dropdown } from "@/presentation/components/ui/Dropdown";
import type { Tone, ToneOption } from "@/shared/types/content";

export const TONE_OPTIONS: ToneOption[] = [
  { value: "professional", label: "Professional", description: "Polished and authoritative" },
  { value: "casual", label: "Casual", description: "Relaxed and conversational" },
  { value: "witty", label: "Witty", description: "Playful with a bit of humor" },
  { value: "bold", label: "Bold", description: "Confident and direct" },
  { value: "friendly", label: "Friendly", description: "Warm and approachable" },
];

interface ToneSelectorProps {
  value: Tone;
  onChange: (tone: Tone) => void;
}

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    onChange(event.target.value as Tone);
  }

  return (
    <Dropdown
      label="Tone"
      name="tone"
      value={value}
      onChange={handleChange}
      options={TONE_OPTIONS.map(({ value: optionValue, label }) => ({ value: optionValue, label }))}
    />
  );
}
