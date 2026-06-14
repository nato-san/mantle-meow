"use client";

import { Check, Copy, ExternalLink, FileText, Sparkles } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CatPortrait } from "@/components/CatPortrait";
import { CatSpeech } from "@/components/CatSpeech";
import { OwnerBadge } from "@/components/OwnerBadge";
import { PageHeader } from "@/components/PageHeader";
import { useCat } from "@/lib/catStore";

const trimForPost = (text: string, maxLength: number) => {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1)}…` : normalized;
};

const buildSharePost = ({
  locale,
  catName,
  level,
  xp,
  history,
}: {
  locale: "en" | "ja";
  catName: string;
  level: number;
  xp: number;
  history: string[];
}) => {
  const latest =
    history[0] ??
    (locale === "en"
      ? "Started researching Mantle and on-chain signals with my Intern Cat."
      : "Intern CatとMantleのオンチェーンシグナル調査を始めました。");
  const finding = trimForPost(latest, locale === "en" ? 110 : 82);
  const intro = locale === "en" ? `${catName}'s discovery` : `${catName} の発見`;
  const body = locale === "en" ? `${intro}\nLv.${level} / ${xp} XP\n${finding}` : `${intro}\nLv.${level} / ${xp} XP\n${finding}`;
  return trimForPost(`${body}\n\n#INTERNCAT #Mantle #MantleMeow`, 270);
};

export default function DiscoveriesPage() {
  const { t, locale, catName, level, xp, report, history, generateReport } = useCat();
  const [copied, setCopied] = useState(false);
  const sharePost = buildSharePost({ locale, catName, level, xp, history });
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(sharePost)}`;
  const copySharePost = async () => {
    await navigator.clipboard.writeText(sharePost);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <AppShell>
      <PageHeader kicker={t.discoveriesKicker} title={t.discoveriesTitle} body={t.discoveriesBody} />

      <section className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="neon-panel rounded-lg p-4">
          <CatSpeech name={catName} text={t.catSaysDiscoveries} showAvatar={false} />
          <CatPortrait variant="front" className="mx-auto h-60 w-full max-w-xs" showAccessories={false} />
          <div className="mt-4">
            <OwnerBadge />
          </div>
          <div className="mt-4 rounded-lg border border-white/10 bg-ink/70 p-3">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-mint">{t.catMemory}</p>
            <p className="mt-2 text-3xl font-black text-white">{catName}</p>
            <p className="mt-1 font-bold text-white/60">Lv.{level} / {xp} XP</p>
          </div>
        </div>

        <div className="neon-panel rounded-lg p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-white">{t.discoveriesTitle}</h2>
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-coral/15 text-coral">
              <FileText size={22} />
            </div>
          </div>
          <div className="min-h-52 whitespace-pre-line rounded-lg border border-white/10 bg-ink/70 p-4 text-sm leading-7 text-white/78">
            {report}
          </div>

          <div className="mt-4 rounded-lg border border-mint/30 bg-mint/10 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-mint">{locale === "en" ? "X Post Preview" : "X投稿用プレビュー"}</p>
              <p className="text-xs font-black text-white/45">{sharePost.length}/280</p>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-white/78">{sharePost}</p>
            <p className="mt-3 text-xs leading-5 text-white/45">
              {locale === "en"
                ? "If X asks you to log in, copy this text first and post it after signing in."
                : "Xでログインを求められる場合は、先にこの文章をコピーして、ログイン後に貼り付けて投稿できます。"}
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <button
              onClick={generateReport}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-mint px-5 font-black text-ink transition hover:bg-white"
            >
              <Sparkles size={19} />
              {t.generateDiscovery}
            </button>
            <button
              type="button"
              onClick={() => void copySharePost()}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/12 px-4 font-black text-white transition hover:bg-white/10"
            >
              {copied ? <Check size={19} /> : <Copy size={19} />}
              {copied ? (locale === "en" ? "Copied" : "コピー済み") : locale === "en" ? "Copy Post" : "投稿文をコピー"}
            </button>
            <a
              href={shareUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/12 font-black text-white transition hover:bg-white/10"
            >
              <ExternalLink size={19} />
              {t.shareX}
            </a>
          </div>

          <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-mint">{t.dailyCareTitle}</p>
            <p className="mt-2 text-sm leading-6 text-white/62">{t.dailyCareBody}</p>
          </div>

          <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <p className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-white/45">{t.history}</p>
            {history.length === 0 ? (
              <p className="text-sm leading-6 text-white/58">{t.emptyHistory}</p>
            ) : (
              <div className="space-y-2">
                {history.slice(0, 3).map((item, index) => (
                  <p key={`${item}-${index}`} className="text-sm leading-6 text-white/68">
                    {item}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
