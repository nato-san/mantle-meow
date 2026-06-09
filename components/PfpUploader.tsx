"use client";

import { ImagePlus, Save } from "lucide-react";
import type { ChangeEvent } from "react";

type PfpUploaderProps = {
  title: string;
  body: string;
  uploadButton: string;
  catNameLabel: string;
  specialtyLabel: string;
  saveCat: string;
  catName: string;
  specialty: string;
  imageUrl: string | null;
  onNameChange: (name: string) => void;
  onSpecialtyChange: (specialty: string) => void;
  onImageChange: (imageUrl: string) => void;
};

export function PfpUploader({
  title,
  body,
  uploadButton,
  catNameLabel,
  specialtyLabel,
  saveCat,
  catName,
  specialty,
  imageUrl,
  onNameChange,
  onSpecialtyChange,
  onImageChange,
}: PfpUploaderProps) {
  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onImageChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="glass rounded-lg p-5 shadow-glow">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative mx-auto h-32 w-32 shrink-0">
          <div className="cat-mask scanline h-full w-full overflow-hidden border border-mint/35 bg-gradient-to-br from-honey/80 via-coral/60 to-mint/40">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Intern Cat preview" className="h-full w-full object-cover mix-blend-luminosity" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/assets/cat-front.png" alt="Default Intern Cat" className="h-full w-full object-contain p-3" />
            )}
          </div>
          <div className="absolute bottom-2 left-1/2 h-3 w-16 -translate-x-1/2 rounded-full bg-white/80" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">{title}</p>
          <p className="mt-2 text-sm leading-6 text-white/68">{body}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-white/55">{catNameLabel}</span>
              <input
                value={catName}
                onChange={(event) => onNameChange(event.target.value)}
                className="mt-1 min-h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-white outline-none transition focus:border-mint"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-white/55">{specialtyLabel}</span>
              <input
                value={specialty}
                onChange={(event) => onSpecialtyChange(event.target.value)}
                className="mt-1 min-h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-white outline-none transition focus:border-mint"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg bg-mint px-4 font-bold text-ink transition hover:bg-white">
              <ImagePlus size={18} />
              {uploadButton}
              <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
            </label>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/12 px-4 font-bold text-white transition hover:bg-white/10">
              <Save size={18} />
              {saveCat}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
