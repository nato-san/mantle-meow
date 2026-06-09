"use client";

import { Lock, Sparkles } from "lucide-react";
import { useCat } from "@/lib/catStore";

const milestones = [
  { level: 1, key: "milestone1" },
  { level: 2, key: "milestone2" },
  { level: 3, key: "milestone3" },
  { level: 5, key: "milestone5" },
] as const;

export function EvolutionMilestones() {
  const { level, t } = useCat();

  return (
    <section className="neon-panel rounded-lg p-4">
      <h2 className="text-xl font-black text-white">{t.evolutionTitle}</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {milestones.map((item) => {
          const unlocked = level >= item.level;
          return (
            <div key={item.key} className={`rounded-lg border p-3 ${unlocked ? "border-mint/45 bg-mint/10" : "border-white/10 bg-white/[0.03]"}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-black text-white">Lv.{item.level}</span>
                {unlocked ? <Sparkles className="text-mint" size={18} /> : <Lock className="text-white/35" size={18} />}
              </div>
              <p className={`text-sm font-black ${unlocked ? "text-white" : "text-white/45"}`}>{t[item.key]}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
