"use client";

import { Sparkles, X } from "lucide-react";
import { CatPortrait } from "@/components/CatPortrait";
import { useCat } from "@/lib/catStore";
import { getItemDefinition, getItemName, getRarityLabel } from "@/lib/itemBox";

export function LevelUpModal() {
  const { t, locale, catName, levelUp, dismissLevelUp } = useCat();

  if (!levelUp) return null;
  const rewardItem = levelUp.item ? getItemDefinition(levelUp.item.id) : null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/78 p-4 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className="absolute h-2 w-2 rounded-full bg-mint shadow-glow"
            style={{
              left: `${8 + ((index * 23) % 86)}%`,
              top: `${10 + ((index * 31) % 78)}%`,
              opacity: 0.35 + (index % 4) * 0.15,
            }}
          />
        ))}
      </div>

      <section className="neon-panel relative w-full max-w-lg overflow-hidden rounded-lg p-6 text-center">
        <button
          type="button"
          onClick={dismissLevelUp}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/65 transition hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mint text-ink shadow-glow">
          <Sparkles size={28} />
        </div>
        <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-coral">{t.levelUpTitle}</p>
        <h2 className="mt-2 text-5xl font-black text-white">Lv.{levelUp.level}</h2>
        <CatPortrait variant="front" className="mx-auto mt-3 h-52 w-52" showAccessories={false} />
        <p className="text-lg font-bold leading-8 text-white/80">{t.levelUpBody.replace("{cat}", catName)}</p>

        <div className="mt-5 rounded-lg border border-mint/35 bg-mint/10 p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-mint">{t.unlockedItem}</p>
          {rewardItem ? (
            <div className="mt-3 flex items-center justify-center gap-3">
              <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-lg border border-white/10 bg-ink text-4xl">
                {rewardItem.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={rewardItem.image} alt={getItemName(rewardItem.id, locale)} className="h-full w-full object-contain p-2" />
                ) : (
                  rewardItem.icon
                )}
              </div>
              <div className="text-left">
                <p className="text-2xl font-black text-white">{getItemName(rewardItem.id, locale)}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-coral">{getRarityLabel(rewardItem.rarity, locale)}</p>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-2xl font-black text-white">{levelUp.accessory}</p>
          )}
        </div>
        <p className="mt-4 text-sm leading-6 text-white/55">{t.autoDiscoveryReady}</p>

        <button
          type="button"
          onClick={dismissLevelUp}
          className="mt-6 min-h-12 w-full rounded-lg bg-mint px-5 font-black text-ink transition hover:bg-white"
        >
          {t.keepGrowing}
        </button>
      </section>
    </div>
  );
}
