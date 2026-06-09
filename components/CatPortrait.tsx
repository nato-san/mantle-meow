"use client";

import Image from "next/image";
import { useCat } from "@/lib/catStore";
import { defaultCatImage } from "@/lib/catImages";

type CatPortraitProps = {
  variant?: "closeup" | "front" | "side" | "back" | "evolved";
  className?: string;
  showAccessories?: boolean;
};

const imageMap = {
  closeup: "/assets/cat-closeup.png",
  front: "/assets/cat-front.png",
  side: "/assets/cat-side.png",
  back: "/assets/cat-back.png",
};

export function CatPortrait({ variant = "front", className = "", showAccessories = false }: CatPortraitProps) {
  const { catName, level, catImageUrl } = useCat();
  const evolvedVariant = "front";
  const resolvedVariant = variant === "evolved" ? evolvedVariant : variant;
  const src = resolvedVariant === "front" ? catImageUrl || defaultCatImage : imageMap[resolvedVariant];
  const isFront = resolvedVariant === "front";

  return (
    <div className={`relative ${className}`}>
      {showAccessories ? <div className="absolute inset-[8%] rounded-full bg-mint/10 blur-2xl" /> : null}
      <Image src={src} alt={catName} fill className="object-contain drop-shadow-[0_0_28px_rgba(116,247,199,0.25)]" />

      {showAccessories && level >= 2 && isFront ? (
        <div className="absolute left-[57%] top-[52%] rounded-full border border-mint/75 bg-ink/90 px-2 py-1 text-[10px] font-black text-mint shadow-glow">
          Lv.{level}
        </div>
      ) : null}

      {showAccessories && level >= 3 && isFront ? (
        <div className="absolute left-[35%] top-[56%] -rotate-12 rounded-full border border-coral/75 bg-coral/25 px-3 py-1 text-[10px] font-black text-white">
          AI
        </div>
      ) : null}

      {showAccessories && level >= 5 ? (
        <div className="absolute bottom-[16%] left-1/2 h-1 w-[38%] -translate-x-1/2 rounded-full bg-mint/55 shadow-glow" />
      ) : null}
    </div>
  );
}
