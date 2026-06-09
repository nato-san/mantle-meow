"use client";

import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { defaultCatImage } from "@/lib/catImages";
import { useCat } from "@/lib/catStore";
import { getItemDefinition, getRarityLabel } from "@/lib/itemBox";

export default function RetirementBoothPage() {
  const { t, retiredCats, locale } = useCat();
  const dateFormatter = new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const rarityGroups = [
    { id: "normal", label: getRarityLabel("normal", locale) },
    { id: "rare", label: getRarityLabel("rare", locale) },
    { id: "superRare", label: getRarityLabel("superRare", locale) },
  ] as const;

  return (
    <AppShell>
      <PageHeader kicker={t.retirementBoothKicker} title={t.retirementBoothTitle} body={t.retirementBoothBody} />

      {retiredCats.length === 0 ? (
        <section className="neon-panel rounded-lg p-8 text-center">
          <div className="relative mx-auto h-56 w-56 opacity-70">
            <Image src="/assets/cat-front.png" alt="" fill className="object-contain" />
          </div>
          <p className="mt-5 text-lg font-bold leading-8 text-white/68">{t.noRetiredCats}</p>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {retiredCats.map((cat) => (
            <article key={cat.id} className="neon-panel rounded-lg p-4">
              <div className="relative min-h-64 overflow-hidden rounded-lg border border-mint/25 bg-mint/10">
                <Image src={cat.catImageUrl ?? defaultCatImage} alt={cat.catName} fill className="object-contain p-4" />
              </div>
              <div className="mt-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-mint">{t.retirementDate}</p>
                <p className="mt-1 text-sm font-bold text-white/58">{dateFormatter.format(new Date(cat.retirementDate))}</p>
                <h2 className="mt-3 text-3xl font-black text-white">{cat.catName}</h2>
                <p className="mt-1 text-lg font-bold text-mint">{cat.specialty}</p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-lg bg-white/[0.05] p-3">
                  <p className="text-white/42">{t.finalLevel}</p>
                  <p className="mt-1 font-black text-white">Lv.{cat.finalLevel}</p>
                </div>
                <div className="rounded-lg bg-white/[0.05] p-3">
                  <p className="text-white/42">{t.passportXp}</p>
                  <p className="mt-1 font-black text-white">{cat.totalXp}</p>
                </div>
                <div className="rounded-lg bg-white/[0.05] p-3">
                  <p className="text-white/42">{t.bondMeter}</p>
                  <p className="mt-1 font-black text-white">{cat.bond}%</p>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">{locale === "en" ? "Collected Items" : "獲得アイテム"}</p>
                {!cat.collectedItems || cat.collectedItems.length === 0 ? (
                  <p className="mt-2 text-sm text-white/55">
                    {locale === "en" ? "No item records were saved for this retired cat." : "この引退猫にはアイテム記録が保存されていません。"}
                  </p>
                ) : (
                  <div className="mt-3 grid gap-3">
                    {rarityGroups.map((group) => {
                      const items = cat.collectedItems
                        ?.map((item) => ({ item, definition: getItemDefinition(item.id) }))
                        .filter((entry) => entry.definition?.rarity === group.id);

                      if (!items || items.length === 0) return null;

                      return (
                        <div key={`${cat.id}-${group.id}`} className="rounded-lg border border-white/10 bg-ink/45 p-2">
                          <p className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-mint">{group.label}</p>
                          <div className="flex flex-wrap gap-2">
                            {items.map(({ item, definition }) => {
                              if (!definition) return null;
                              const tooltip =
                                locale === "en"
                                  ? `${definition.en} / acquired at Lv.${item.acquiredLevel}`
                                  : `${definition.ja} / Lv.${item.acquiredLevel}で取得`;

                              return (
                                <div
                                  key={`${cat.id}-${item.id}`}
                                  title={tooltip}
                                  aria-label={tooltip}
                                  className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-lg border border-mint/25 bg-ink text-xl transition hover:border-mint hover:shadow-glow"
                                >
                                  {definition.image ? <Image src={definition.image} alt="" fill className="object-contain p-1.5" /> : definition.icon}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </AppShell>
  );
}
