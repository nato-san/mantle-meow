"use client";

import { User } from "lucide-react";
import { useCat } from "@/lib/catStore";

type OwnerBadgeProps = {
  compact?: boolean;
};

export function OwnerBadge({ compact = false }: OwnerBadgeProps) {
  const { imageUrl, owner, t } = useCat();

  return (
    <div className={`flex items-center gap-3 rounded-lg border border-mint/30 bg-ink/70 ${compact ? "p-2" : "p-3"}`}>
      <div className={`${compact ? "h-10 w-10" : "h-14 w-14"} grid shrink-0 place-items-center overflow-hidden rounded-lg border border-mint/45 bg-mint/10`}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={owner} className="h-full w-full object-cover" />
        ) : (
          <User className="text-mint" size={compact ? 20 : 26} />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-white/42">{t.ownerLabel}</p>
        <p className={`${compact ? "text-sm" : "text-lg"} truncate font-black text-white`}>{owner}</p>
      </div>
    </div>
  );
}
