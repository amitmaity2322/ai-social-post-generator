"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/presentation/components/ui/Input";
import { Checkbox } from "@/presentation/components/ui/Checkbox";
import { Dropdown } from "@/presentation/components/ui/Dropdown";
import { Button } from "@/presentation/components/ui/Button";
import { useToast } from "@/presentation/hooks/useToast";
import { TONE_OPTIONS } from "@/presentation/components/generator/ToneSelector";
import { changeDefaultTone } from "@/presentation/services/accountService";
import type { Tone } from "@/shared/types/content";

interface SettingsFormProps {
  initialDefaultTone: Tone;
}

export function SettingsForm({ initialDefaultTone }: SettingsFormProps) {
  const [defaultTone, setDefaultTone] = useState<Tone>(initialDefaultTone);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await changeDefaultTone(defaultTone);
      showToast("success", "Settings saved.");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pg-surface p-4" noValidate>
      <Input label="Full name" name="fullName" defaultValue="Jamie Doe" required />
      <Input
        label="Email address"
        name="email"
        type="email"
        defaultValue="jamie@postgen.ai"
        required
      />
      <Dropdown
        label="Default tone"
        name="defaultTone"
        value={defaultTone}
        onChange={(event) => setDefaultTone(event.target.value as Tone)}
        options={TONE_OPTIONS.map(({ value, label }) => ({ value, label }))}
      />
      <div className="mb-3 d-flex flex-column gap-2">
        <Checkbox label="Email me when a generation fails" name="notifyOnFailure" defaultChecked />
        <Checkbox
          label="Auto-suggest hashtags from my recent posts"
          name="autoSuggestHashtags"
          defaultChecked
        />
      </div>
      <Button type="submit" isLoading={isSaving}>
        Save changes
      </Button>
    </form>
  );
}
