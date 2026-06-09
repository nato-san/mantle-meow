"use client";

import { useCat } from "@/lib/catStore";

const accessories = [
  { level: 1, icon: "ID", key: "accessoryBadge" },
  { level: 2, icon: "Lv", key: "accessoryLevelPin" },
  { level: 3, icon: "AI", key: "accessoryAlphaTag" },
  { level: 5, icon: "NW", key: "accessoryNetworkCrown" },
] as const;

export function AccessoryShelf() {
  const { level, t } = useCat();

  return (
    <section className="neon-panel rounded-lg p-4">
      <h2 className="text-xl font-black text-white">{t.accessoriesTitle}</h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {accessories.map((item) => {
          const unlocked = level >= item.level;
          return (
            <div key={item.key} className={`rounded-lg border p-2 ${unlocked ? "border-mint/45 bg-mint/10" : "border-white/10 bg-white/[0.03] opacity-60"}`}>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-ink text-xs font-black text-mint">{item.icon}</div>
              <p className="mt-2 text-xs font-black text-white">{t[item.key]}</p>
              <p className="mt-1 text-xs font-bold text-white/45">Lv.{item.level}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
