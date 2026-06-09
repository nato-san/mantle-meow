"use client";

import { CheckCircle2, PackageOpen, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useCat } from "@/lib/catStore";
import {
  getItemDefinition,
  getItemName,
  getRarityLabel,
  levelPinItem,
  normalizeItemId,
  type CollectedItem,
  type ItemDefinition,
  type ItemRarity,
} from "@/lib/itemBox";
import { getResearchCommandCopy } from "@/lib/researchCommands";

const rarityOrder: ItemRarity[] = ["normal", "rare", "superRare"];

function ItemArtwork({ definition, label, className = "h-11 w-11" }: { definition: ItemDefinition; label: string; className?: string }) {
  return (
    <div className={`grid place-items-center overflow-hidden rounded-lg bg-ink text-2xl ${className}`}>
      {definition.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={definition.image} alt={label} className="h-full w-full object-contain p-1.5" />
      ) : (
        definition.icon
      )}
    </div>
  );
}

export function ItemBox() {
  const { t, locale, level, collectedItems, equippedItemIds, toggleEquippedItem } = useCat();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  const ownedItems = useMemo(
    () =>
      collectedItems
        .map((item) => ({ ...item, id: normalizeItemId(item.id) }))
        .filter((item, index, items) => items.findIndex((entry) => entry.id === item.id) === index)
        .map((item) => ({ item, definition: getItemDefinition(item.id) }))
        .filter((entry): entry is { item: CollectedItem; definition: ItemDefinition } => Boolean(entry.definition)),
    [collectedItems],
  );

  const levelPin = ownedItems.find(({ item }) => item.id === levelPinItem.id)?.item ?? (level >= 2 ? { id: levelPinItem.id, acquiredLevel: 2, acquiredAt: "" } : null);
  const displayedItems = equippedItemIds
    .map((id) => ownedItems.find(({ item }) => item.id === normalizeItemId(id))?.item)
    .filter((item): item is CollectedItem => Boolean(item))
    .slice(0, 3);
  const selectedSet = new Set(displayedItems.map((item) => item.id));
  const hasItems = ownedItems.length > 0 || Boolean(levelPin);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    if (!isPickerOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsPickerOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isPickerOpen]);

  const renderItemCard = (item: CollectedItem, fixed = false) => {
    const definition = getItemDefinition(item.id);
    if (!definition) return null;
    const isLevelPin = item.id === levelPinItem.id;
    const rarityClass =
      definition.rarity === "superRare"
        ? "border-coral/65 bg-coral/12 text-coral"
        : definition.rarity === "rare"
          ? "border-mint/65 bg-mint/12 text-mint"
          : "border-white/10 bg-white/[0.04] text-white/72";

    return (
      <article key={`${item.id}-${fixed ? "fixed" : "equipped"}`} className={`min-h-[154px] rounded-lg border p-3 ${rarityClass}`}>
        <div className="flex items-start justify-between gap-2">
          <ItemArtwork definition={definition} label={getItemName(item.id, locale)} />
          <span className="inline-flex items-center gap-1 rounded-md bg-ink/70 px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em]">
            <Sparkles size={11} />
            {isLevelPin ? (locale === "en" ? "Fixed" : "固定") : getRarityLabel(definition.rarity, locale)}
          </span>
        </div>
        <p className="mt-3 text-sm font-black text-white">{getItemName(item.id, locale)}</p>
        {isLevelPin ? <p className="mt-1 text-lg font-black text-mint">Lv.{level}</p> : null}
        <p className="mt-1 text-xs font-bold text-white/45">{t.itemAcquiredLevel.replace("{level}", String(item.acquiredLevel))}</p>
      </article>
    );
  };

  return (
    <section className="neon-panel rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-mint">{t.itemBoxKicker}</p>
          <h2 className="mt-1 text-xl font-black text-white">{t.itemBoxTitle}</h2>
          <p className="mt-1 text-xs leading-5 text-white/50">{t.itemBoxBody}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-mint/35 bg-mint/10 text-mint transition hover:bg-mint/20"
          aria-label={locale === "en" ? "Open item box" : "アイテムボックスを開く"}
        >
          <PackageOpen size={22} />
        </button>
      </div>

      <div
        className="mt-3 grid cursor-pointer grid-cols-2 gap-2"
        onClick={() => setIsPickerOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") setIsPickerOpen(true);
        }}
      >
        {!hasItems ? (
          <p className="col-span-2 rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-white/55">{t.itemBoxEmpty}</p>
        ) : (
          <>
            {levelPin ? renderItemCard(levelPin, true) : null}
            {displayedItems.map((item) => renderItemCard(item))}
          </>
        )}
      </div>

      {isPickerOpen && portalRoot
        ? createPortal(
        <div
          className="fixed inset-0 z-[9999] overflow-y-auto bg-ink/86 px-4 py-6 backdrop-blur-md sm:py-8"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsPickerOpen(false)}
        >
          <div
            className="mx-auto w-full max-w-4xl rounded-lg border border-mint/45 bg-ink-2 p-4 shadow-[0_0_50px_rgba(137,246,198,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Item Box</p>
                <h3 className="mt-1 text-2xl font-black text-white">{locale === "en" ? "Select Display Items" : "表示アイテムを選択"}</h3>
                <p className="mt-1 text-sm leading-6 text-white/55">
                  {locale === "en"
                    ? "The Level Pin stays fixed. Choose up to 3 collected items to display."
                    : "レベルピンは固定表示です。所持アイテムから最大3つまで表示できます。"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/10"
                aria-label={locale === "en" ? "Close" : "閉じる"}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 rounded-lg border border-mint/25 bg-mint/8 p-3 text-sm font-bold text-mint">
              {locale === "en" ? `Selected ${selectedSet.size}/3` : `選択中 ${selectedSet.size}/3`}
            </div>

            <div className="mt-4 space-y-4">
              {rarityOrder.map((rarity) => {
                const entries = ownedItems.filter(({ item, definition }) => item.id !== levelPinItem.id && definition.rarity === rarity);
                if (entries.length === 0) return null;
                return (
                  <div key={rarity} className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-mint">{getRarityLabel(rarity, locale)}</p>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      {entries.map(({ item, definition }) => {
                        const selected = selectedSet.has(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleEquippedItem(item.id)}
                            className={`rounded-lg border p-3 text-left transition ${
                              selected ? "border-mint bg-mint/14" : "border-white/10 bg-ink hover:border-mint/45 hover:bg-mint/8"
                            }`}
                          >
                            <div className="flex gap-3">
                              <ItemArtwork definition={definition} label={getItemName(item.id, locale)} className="h-14 w-14" />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="font-black text-white">{getItemName(item.id, locale)}</p>
                                  {selected ? <CheckCircle2 className="shrink-0 text-mint" size={18} /> : null}
                                </div>
                                <p className="mt-1 text-xs font-bold text-white/45">{t.itemAcquiredLevel.replace("{level}", String(item.acquiredLevel))}</p>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {definition.expertise.map((expertise) => (
                                    <span key={`${item.id}-${expertise.commandId}`} className="rounded-md border border-mint/25 bg-mint/8 px-2 py-1 text-[11px] font-black text-mint">
                                      {getResearchCommandCopy(expertise.commandId, locale).label} +{expertise.points}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>,
          portalRoot,
        )
        : null}
    </section>
  );
}
