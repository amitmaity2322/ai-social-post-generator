"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/presentation/components/ui/Input";
import { Textarea } from "@/presentation/components/ui/Textarea";
import { Button } from "@/presentation/components/ui/Button";
import { useToast } from "@/presentation/hooks/useToast";
import { updateBrandKit, type BrandKitInput } from "@/presentation/services/accountService";
import styles from "./BrandKitForm.module.css";

interface BrandKitFormProps {
  initial: BrandKitInput;
}

export function BrandKitForm({ initial }: BrandKitFormProps) {
  const [brandVoice, setBrandVoice] = useState(initial.brandVoice);
  const [brandColor, setBrandColor] = useState(initial.brandColor);
  const [logoUrl, setLogoUrl] = useState(initial.logoUrl);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateBrandKit({ brandVoice, brandColor, logoUrl });
      showToast("success", "Brand kit saved. New posts will reflect it.");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to save brand kit");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pg-surface p-4" noValidate>
      <Textarea
        label="Brand voice"
        name="brandVoice"
        placeholder="e.g. Confident and witty, never corporate-sounding, always mention sustainability when relevant."
        helperText="Included in every post you generate from now on."
        value={brandVoice}
        onChange={(event) => setBrandVoice(event.target.value)}
        maxLength={500}
      />

      <label className="form-label fw-semibold small mb-2 d-block">Brand color</label>
      <div className={`${styles.colorRow} mb-3`}>
        <input
          type="color"
          className={styles.colorSwatch}
          value={brandColor}
          onChange={(event) => setBrandColor(event.target.value)}
          aria-label="Brand color"
        />
        <Input
          name="brandColor"
          value={brandColor}
          onChange={(event) => setBrandColor(event.target.value)}
          className="mb-0"
        />
      </div>

      {logoUrl && (
        <div className={styles.logoPreview}>
          {/* eslint-disable-next-line @next/next/no-img-element -- external, arbitrary user-supplied URL; not eligible for next/image optimization */}
          <img src={logoUrl} alt="Logo preview" className={styles.logoImage} />
          <span className="pg-text-muted small">Logo preview</span>
        </div>
      )}

      <Input
        label="Logo URL"
        name="logoUrl"
        type="url"
        placeholder="https://example.com/logo.png"
        helperText="A link to your logo image (optional)."
        value={logoUrl}
        onChange={(event) => setLogoUrl(event.target.value)}
      />

      <Button type="submit" isLoading={isSaving}>
        Save brand kit
      </Button>
    </form>
  );
}
