"use client";

import { BookOpen, GraduationCap } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getLessonCopy, lessons } from "@/lib/mockData";

type LearningPanelProps = {
  locale: Locale;
  title: string;
  body: string;
  teach: string;
  onLearn: (lessonId: string) => void;
};

export function LearningPanel({ locale, title, body, teach, onLearn }: LearningPanelProps) {
  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/62">{body}</p>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-honey/15 text-honey">
          <GraduationCap size={21} />
        </div>
      </div>

      <div className="grid gap-3">
        {lessons.map((lesson) => {
          const item = getLessonCopy(lesson, locale);
          return (
            <article key={lesson.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-mint">
                    <BookOpen size={16} />
                    <h3 className="font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/60">{item.summary}</p>
                </div>
                <span className="shrink-0 rounded-md bg-mint/12 px-2 py-1 text-xs font-black text-mint">+{lesson.xp} XP</span>
              </div>
              <button
                onClick={() => onLearn(lesson.id)}
                className="mt-3 min-h-10 w-full rounded-lg border border-white/10 font-bold text-white transition hover:border-mint hover:bg-mint hover:text-ink"
              >
                {teach}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
