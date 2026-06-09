"use client";

import { FileText, Share2 } from "lucide-react";

type DailyReportProps = {
  title: string;
  reportButton: string;
  shareX: string;
  report: string;
  onGenerate: () => void;
};

export function DailyReport({ title, reportButton, shareX, report, onGenerate }: DailyReportProps) {
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(report)}`;

  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-white">{title}</h2>
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-coral/15 text-coral">
          <FileText size={20} />
        </div>
      </div>

      <div className="min-h-36 whitespace-pre-line rounded-lg border border-white/10 bg-ink/60 p-4 text-sm leading-7 text-white/75">
        {report}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button onClick={onGenerate} className="min-h-11 rounded-lg bg-white font-bold text-ink transition hover:bg-mint">
          {reportButton}
        </button>
        <a
          href={shareUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/12 font-bold text-white transition hover:bg-white/10"
        >
          <Share2 size={18} />
          {shareX}
        </a>
      </div>
    </section>
  );
}
