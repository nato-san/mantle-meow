"use client";

import { Send, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { CatPortrait } from "@/components/CatPortrait";
import type { Locale } from "@/lib/i18n";
import type { ResearchCommandId } from "@/lib/researchCommands";

export type ChatMessage = {
  role: "user" | "cat";
  text: string;
  report?: {
    title: string;
    checkedLabel: string;
    checked: string;
    takeLabel: string;
    take: string;
    nextLabel: string;
    next: string;
    nextCommandId?: ResearchCommandId;
    nextCommandLabel?: string;
    xp: string;
  };
};

type ChatPanelProps = {
  locale: Locale;
  title: string;
  placeholder: string;
  send: string;
  quickPrompts: string;
  messages: ChatMessage[];
  onTeach: (text: string) => void;
  onRunCommand?: (commandId: ResearchCommandId) => void;
  showCatAvatars?: boolean;
  showQuickPrompts?: boolean;
  className?: string;
  style?: CSSProperties;
};

const prompts = {
  en: ["What is Mantle?", "Research RWA basics", "How can Nansen signals help?", "Make today's finding"],
  ja: ["Mantleとは？", "RWAの基礎を調べて", "Nansenシグナルは何に使う？", "今日の発見を作って"],
};

export function ChatPanel({
  locale,
  title,
  placeholder,
  send,
  quickPrompts,
  messages,
  onTeach,
  onRunCommand,
  showCatAvatars = true,
  showQuickPrompts = true,
  className = "",
  style,
}: ChatPanelProps) {
  const [draft, setDraft] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const submit = (text = draft) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onTeach(trimmed);
    setDraft("");
  };

  return (
    <section className={`glass flex min-h-0 flex-col overflow-hidden rounded-lg p-4 ${className}`} style={style}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-white">{title}</h2>
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-lilac/15 text-lilac">
          <Sparkles size={20} />
        </div>
      </div>

      <div className="min-h-[260px] flex-1 space-y-3 overflow-y-auto pr-1 lg:min-h-0">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {showCatAvatars && message.role === "cat" ? <CatPortrait variant="front" className="mr-2 mt-auto h-10 w-10 shrink-0" showAccessories={false} /> : null}
            {message.report ? (
              <article className="max-w-[94%] rounded-lg border border-mint/35 bg-ink/88 p-4 text-sm leading-6 text-white shadow-glow">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <h3 className="text-lg font-black text-white">{message.report.title}</h3>
                  <span className="rounded-md bg-mint/15 px-2 py-1 text-xs font-black text-mint">{message.report.xp}</span>
                </div>
                {message.text ? <p className="mt-3 font-bold text-white/82">{message.text}</p> : null}
                <div className="mt-3 grid gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-mint">{message.report.checkedLabel}</p>
                    <p className="mt-1 whitespace-pre-line text-white/82">{message.report.checked}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">{message.report.takeLabel}</p>
                    <p className="mt-1 whitespace-pre-line text-white/86">{message.report.take}</p>
                  </div>
                  <div className="rounded-lg border border-mint/25 bg-mint/10 p-3">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-mint">{message.report.nextLabel}</p>
                    <p className="mt-1 whitespace-pre-line font-bold text-white/88">{message.report.next}</p>
                    {message.report.nextCommandId && message.report.nextCommandLabel && onRunCommand ? (
                      <button
                        type="button"
                        onClick={() => onRunCommand(message.report!.nextCommandId!)}
                        className="mt-3 inline-flex min-h-9 items-center rounded-lg bg-mint px-3 text-sm font-black text-ink transition hover:bg-white"
                      >
                        {message.report.nextCommandLabel}
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            ) : (
              <div
                className={`max-w-[92%] whitespace-pre-line rounded-lg px-4 py-3 text-sm leading-6 ${
                  message.role === "user" ? "bg-mint text-ink" : "border border-white/10 bg-white/7 text-white/82"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4">
        {showQuickPrompts ? (
          <>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-white/45">{quickPrompts}</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {prompts[locale].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => submit(prompt)}
                  className="min-h-8 rounded-lg border border-white/10 px-3 text-xs font-bold text-white/72 transition hover:border-mint hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </>
        ) : null}

        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !isComposing && !event.nativeEvent.isComposing) {
                event.preventDefault();
                submit();
              }
            }}
            placeholder={placeholder}
            className="min-h-11 flex-1 rounded-lg border border-white/10 bg-white/5 px-4 text-white outline-none transition placeholder:text-white/35 focus:border-mint"
          />
          <button
            onClick={() => submit()}
            aria-label={send}
            title={send}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-coral px-4 font-bold text-ink transition hover:bg-white"
          >
            <Send size={18} />
            <span className="hidden sm:inline">{send}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
