"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, BadgeDollarSign, Brain, Heart, Search, ShieldPlus, Sparkles, Trophy, WalletCards, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BondPanel } from "@/components/BondPanel";
import { CatPortrait } from "@/components/CatPortrait";
import { CatSpeech } from "@/components/CatSpeech";
import { ChatPanel } from "@/components/ChatPanel";
import { EvolutionMilestones } from "@/components/EvolutionMilestones";
import { ItemBox } from "@/components/ItemBox";
import { KnowledgeTree } from "@/components/KnowledgeTree";
import { PageHeader } from "@/components/PageHeader";
import { SpecialTasks } from "@/components/SpecialTasks";
import { StatPill } from "@/components/StatPill";
import { useCat } from "@/lib/catStore";
import { personalityCopy } from "@/lib/personality";
import { researchCommands, type ResearchCommandId } from "@/lib/researchCommands";

export default function MyCatPage() {
  const { t, locale, catName, specialty, personality, xp, level, progress, mood, messages, teachCat, runResearchCommand } = useCat();
  const quickActionsRef = useRef<HTMLElement | null>(null);
  const [chatPanelHeight, setChatPanelHeight] = useState<number | null>(null);
  const stageName = level >= 5 ? t.mentorStage : level >= 3 ? t.alphaStage : level >= 2 ? t.researcherStage : t.rookieStage;
  const commandIcons: Record<ResearchCommandId, typeof Activity> = {
    "mnt-price": BadgeDollarSign,
    "mantle-health": ShieldPlus,
    "ecosystem-discovery": Search,
    "rwa-report": WalletCards,
    "whale-activity": Activity,
    "daily-alpha": Sparkles,
  };

  useEffect(() => {
    const panel = quickActionsRef.current;
    if (!panel) return;

    const updateHeight = () => {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      setChatPanelHeight(isDesktop ? Math.ceil(panel.getBoundingClientRect().height) : null);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(panel);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [locale]);

  return (
    <AppShell>
      <PageHeader kicker={t.myCatKicker} title={t.myCatTitle} body={t.myCatBody} />

      <section className="relative overflow-hidden rounded-lg border border-mint/35 bg-ink p-4 shadow-glow lg:min-h-[640px]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(116,247,199,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(116,247,199,0.06)_1px,transparent_1px)] bg-[size:34px_34px]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink via-ink/82 to-transparent" />

        <div className="relative z-10 grid gap-4 lg:grid-cols-[0.74fr_1.16fr_0.86fr] lg:items-stretch">
          <aside className="order-2 grid gap-3 lg:order-1">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <StatPill icon={Trophy} label={t.level} value={`Lv.${level}`} />
              <StatPill icon={Zap} label={t.totalXp} value={`${xp} XP`} />
              <StatPill icon={Brain} label={t.nextLevel} value={`${progress}%`} />
              <StatPill icon={Heart} label={t.mood} value={mood} />
            </div>
            <BondPanel />
          </aside>

          <section className="order-1 grid gap-3 lg:order-2 lg:h-full lg:grid-rows-[auto_minmax(0,1fr)]">
            <div className="order-2 grid gap-3 sm:grid-cols-[0.42fr_0.58fr] lg:order-1">
              <div className="rounded-lg border border-mint/45 bg-ink/82 px-4 py-3 shadow-glow lg:py-2.5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-mint">{specialty}</p>
                <h2 className="mt-1 text-2xl font-black text-white">{catName}</h2>
              </div>
              <div className="rounded-lg border border-mint/35 bg-ink/70 px-4 py-3 lg:py-2.5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-mint">{t.currentEvolution}</p>
                <p className="mt-1 text-lg font-black text-white">{stageName}</p>
                <p className="mt-1 text-xs font-bold text-white/48">{personalityCopy[locale][personality].label}</p>
              </div>
            </div>

            <div className="order-1 flex min-h-[500px] flex-col rounded-lg border border-mint/30 bg-mint/10 p-3 lg:order-2 lg:min-h-0">
              <div className="relative min-h-[440px] flex-1 overflow-hidden rounded-md">
                <div className="absolute right-3 top-3 z-20 w-[min(80%,330px)] sm:w-[min(46%,330px)] lg:top-2">
                  <CatSpeech name={catName} text={t.catSaysMyCat} showAvatar={false} />
                </div>
                <CatPortrait
                  variant="evolved"
                  className="absolute bottom-[-58px] left-1/2 h-[430px] w-[min(96%,500px)] -translate-x-1/2 lg:bottom-[-72px] lg:h-[500px] lg:w-[min(100%,570px)]"
                  showAccessories={false}
                />
              </div>

              <div className="mt-3">
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-mint" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </section>

          <aside className="order-3 grid gap-4 lg:h-full lg:grid-rows-[minmax(0,1fr)_auto]">
            <ItemBox />
            <EvolutionMilestones />
          </aside>
        </div>
      </section>

      <section className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.65fr)]">
        <ChatPanel
          locale={locale}
          title={`${catName} Chat`}
          placeholder={t.chatPlaceholder}
          send={t.send}
          quickPrompts={t.quickPrompts}
          messages={messages}
          onTeach={teachCat}
          onRunCommand={(commandId) => void runResearchCommand(commandId)}
          showCatAvatars={false}
          showQuickPrompts={false}
          style={chatPanelHeight ? { height: `${chatPanelHeight}px` } : undefined}
        />

        <section ref={quickActionsRef} className="neon-panel flex flex-col rounded-lg p-4">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-white/45">{t.softLessons}</p>
          <div className="mb-3 grid gap-3">
            {researchCommands.map((command) => {
              const Icon = commandIcons[command.id];
              const commandCopy = command[locale];

              return (
                <button
                  key={command.id}
                  type="button"
                  onClick={() => void runResearchCommand(command.id)}
                  className="flex w-full items-start gap-3 rounded-lg border border-mint/35 bg-mint/10 p-3 text-left transition hover:border-mint/65 hover:bg-mint/18"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink text-mint">
                    <Icon size={19} />
                  </span>
                  <span>
                    <span className="block font-black text-white">{commandCopy.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-white/58">{commandCopy.description}</span>
                    <span className="mt-1 block text-xs font-bold text-mint">+{command.xp} Research XP</span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-white/58">{t.nansenCommandHint}</p>
        </section>
      </section>

      <section className="mt-5 grid items-start gap-5 xl:grid-cols-[0.86fr_1.14fr]">
        <SpecialTasks />
        <KnowledgeTree compact />
      </section>
    </AppShell>
  );
}
