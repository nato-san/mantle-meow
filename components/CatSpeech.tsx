"use client";

import { CatPortrait } from "@/components/CatPortrait";
import { useCat } from "@/lib/catStore";
import { applyPersonality } from "@/lib/personality";

type CatSpeechProps = {
  text: string;
  name: string;
  showAvatar?: boolean;
};

export function CatSpeech({ text, name, showAvatar = true }: CatSpeechProps) {
  const { locale, personality } = useCat();
  const voicedText = applyPersonality(text, locale, personality);

  return (
    <div className="flex items-end gap-3">
      {showAvatar ? <CatPortrait variant="front" className="h-24 w-24 shrink-0" showAccessories={false} /> : null}
      <div className="relative rounded-[28px] border border-mint/45 bg-ink/85 p-4 shadow-glow">
        <div
          className={`absolute h-5 w-5 rotate-45 border-mint/45 bg-ink/85 ${
            showAvatar
              ? "-left-2 bottom-6 border-b border-l"
              : "left-8 -bottom-2 border-b border-r"
          }`}
        />
        <p className="text-xs font-black uppercase tracking-[0.16em] text-mint">{name}</p>
        <p className="mt-2 text-sm leading-7 text-white/78">{voicedText}</p>
      </div>
    </div>
  );
}
