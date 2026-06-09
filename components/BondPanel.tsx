"use client";

import { HeartHandshake } from "lucide-react";
import { OwnerBadge } from "@/components/OwnerBadge";
import { useCat } from "@/lib/catStore";

export function BondPanel() {
  const { t, catName, owner, level, xp } = useCat();
  const bond = Math.min(100, 35 + level * 12 + Math.floor(xp / 25));

  return (
    <section className="neon-panel rounded-lg p-4">
      <div className="mb-3 flex items-center gap-2 text-mint">
        <HeartHandshake size={20} />
        <h2 className="text-xl font-black text-white">{t.bondTitle}</h2>
      </div>
      <div className="grid gap-3">
        <OwnerBadge />
      </div>
      <p className="mt-3 text-sm leading-6 text-white/68">{t.bondLine.replace("{owner}", owner).replace("{cat}", catName)}</p>
      <div className="mt-3">
        <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-white/45">
          <span>{t.bondMeter}</span>
          <span>{bond}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-mint" style={{ width: `${bond}%` }} />
        </div>
      </div>
    </section>
  );
}
