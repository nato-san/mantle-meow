"use client";

import { BadgeCheck, CheckCircle2, Network } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { CatPortrait } from "@/components/CatPortrait";
import { CatSpeech } from "@/components/CatSpeech";
import { EvolutionMilestones } from "@/components/EvolutionMilestones";
import { ItemBox } from "@/components/ItemBox";
import { KnowledgeTree } from "@/components/KnowledgeTree";
import { MintPassportPanel } from "@/components/MintPassportPanel";
import { PageHeader } from "@/components/PageHeader";
import { RetireCatModal } from "@/components/RetireCatModal";
import { useCat } from "@/lib/catStore";
import { personalityCopy } from "@/lib/personality";
import { specialTasks } from "@/lib/specialTasks";

function MobileFold({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="rounded-lg border border-mint/30 bg-ink/78 p-3 shadow-glow lg:hidden [&_.neon-panel]:border-white/10 [&_.neon-panel]:bg-transparent [&_.neon-panel]:shadow-none" open={defaultOpen}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-black uppercase tracking-[0.14em] text-mint [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span className="grid h-8 w-8 place-items-center rounded-md border border-mint/25 text-lg leading-none text-white/60">+</span>
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

export default function PassportPage() {
  const { t, locale, catName, owner, level, xp, specialty, personality, completedSpecialTaskIds } = useCat();
  const [retireOpen, setRetireOpen] = useState(false);
  const completedTasks = specialTasks.filter((task) => completedSpecialTaskIds.includes(task.id));

  const onChainMemory = (
    <section className="neon-panel rounded-lg p-4">
      <div className="mb-4 flex items-center gap-2 text-mint">
        <CheckCircle2 size={20} />
        <h2 className="text-2xl font-black text-white">{locale === "en" ? "On-chain Memory" : "オンチェーンメモリー"}</h2>
      </div>
      {completedTasks.length === 0 ? (
        <p className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-white/58">
          {locale === "en"
            ? "No special task has been recorded yet. Clear on-chain tasks from My Cat to add memories here."
            : "まだスペシャルタスクの記録はありません。My Catでオンチェーン活動タスクをクリアすると、ここに記録されます。"}
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {completedTasks.map((task) => {
            const text = task[locale];

            return (
              <article key={task.id} className="rounded-lg border border-mint/25 bg-mint/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-mint">Level {task.level}</p>
                    <h3 className="mt-1 font-black text-white">{text.title}</h3>
                  </div>
                  <CheckCircle2 className="shrink-0 text-mint" size={20} />
                </div>
                <p className="mt-2 text-sm leading-6 text-white/62">{text.description}</p>
                <p className="mt-3 inline-flex rounded-md border border-mint/35 bg-ink/70 px-2 py-1 text-xs font-black text-mint">+{task.xp} Bonus XP</p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );

  const futureReady = (
    <section className="neon-panel rounded-lg p-4">
      <div className="mb-4 flex items-center gap-2 text-mint">
        <Network size={20} />
        <h2 className="text-2xl font-black text-white">{t.futureReady}</h2>
      </div>
      <div className="grid gap-3">
        <p className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-white/68">{t.mantleFuture}</p>
        <p className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-white/68">{t.nansenFuture}</p>
      </div>
    </section>
  );

  const retirementPanel = (
    <section className="rounded-lg border border-coral/35 bg-coral/10 p-4">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-coral">{t.retirementDangerTitle}</p>
      <p className="mt-2 text-sm leading-6 text-white/62">{t.retirementDangerBody}</p>
      <button
        type="button"
        onClick={() => setRetireOpen(true)}
        className="mt-4 min-h-11 w-full rounded-lg border border-coral/55 px-5 font-black text-white transition hover:bg-coral hover:text-ink"
      >
        {t.retireCat}
      </button>
    </section>
  );

  return (
    <AppShell>
      <PageHeader kicker={t.passportKicker} title={t.passportTitle} body={t.passportBody} />

      <section className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="neon-panel rounded-lg p-4">
          <div className="relative overflow-hidden rounded-lg border border-mint/35 bg-ink/80 p-4">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(116,247,199,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(116,247,199,0.07)_1px,transparent_1px)] bg-[size:30px_30px]" />
            <div className="relative z-10">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-mint">{t.passportTitle}</p>
                <BadgeCheck className="text-mint" size={28} />
              </div>
              <div className="mb-4">
                <CatSpeech name={catName} text={t.catSaysPassport} showAvatar={false} />
              </div>
              <CatPortrait variant="front" className="mx-auto h-56 w-full max-w-xs" showAccessories={false} />
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-white/[0.05] p-3">
                  <p className="text-white/42">{t.passportName}</p>
                  <p className="mt-1 font-black text-white">{catName}</p>
                </div>
                <div className="rounded-lg bg-white/[0.05] p-3">
                  <p className="text-white/42">{t.ownerLabel}</p>
                  <p className="mt-1 font-black text-white">{owner}</p>
                </div>
                <div className="rounded-lg bg-white/[0.05] p-3">
                  <p className="text-white/42">{t.passportLevel}</p>
                  <p className="mt-1 font-black text-white">{level}</p>
                </div>
                <div className="rounded-lg bg-white/[0.05] p-3">
                  <p className="text-white/42">{t.passportXp}</p>
                  <p className="mt-1 font-black text-white">{xp}</p>
                </div>
                <div className="col-span-2 rounded-lg bg-white/[0.05] p-3">
                  <p className="text-white/42">{t.passportSpecialty}</p>
                  <p className="mt-1 font-black text-white">{specialty}</p>
                </div>
                <div className="col-span-2 rounded-lg bg-white/[0.05] p-3">
                  <p className="text-white/42">{t.personalityLabel}</p>
                  <p className="mt-1 font-black text-white">{personalityCopy[locale][personality].label}</p>
                </div>
              </div>
            </div>
          </div>

          <MintPassportPanel />
          <div className="mt-4 hidden lg:block">{retirementPanel}</div>
        </div>

        <div className="grid gap-3 lg:hidden">
          <MobileFold title={t.evolutionTitle}>
            <EvolutionMilestones />
          </MobileFold>
          <MobileFold title={t.itemBoxTitle}>
            <ItemBox />
          </MobileFold>
          <MobileFold title={t.learnedKnowledge}>
            <KnowledgeTree masteredOnly showNextUnlocks={false} showXpLegend={false} interactive={false} />
          </MobileFold>
          <MobileFold title={locale === "en" ? "On-chain Memory" : "オンチェーンメモリー"}>{onChainMemory}</MobileFold>
          <MobileFold title={t.futureReady}>{futureReady}</MobileFold>
          {retirementPanel}
        </div>

        <div className="hidden gap-4 lg:grid">
          <EvolutionMilestones />
          <ItemBox />
          <KnowledgeTree masteredOnly showNextUnlocks={false} showXpLegend={false} interactive={false} />
          {onChainMemory}
          {futureReady}
        </div>
      </section>
      <RetireCatModal open={retireOpen} onClose={() => setRetireOpen(false)} />
    </AppShell>
  );
}
