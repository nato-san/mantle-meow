"use client";

import { BookOpen, CheckCircle2, Lock, Microscope, Sparkles, XCircle } from "lucide-react";
import { useState } from "react";
import { useCat } from "@/lib/catStore";
import { getQuizQuestions, type QuizQuestion } from "@/lib/knowledgeQuizzes";
import { getKnowledgeTopicCopy, getLearnedKnowledgeTopics, getNextKnowledgeTopics, type KnowledgeTopic } from "@/lib/mockData";

type KnowledgeTreeProps = {
  compact?: boolean;
  masteredOnly?: boolean;
  showNextUnlocks?: boolean;
  showXpLegend?: boolean;
  interactive?: boolean;
};

const pickRandomQuestions = (questions: QuizQuestion[], count = 3) =>
  [...questions]
    .map((question) => ({ question, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .slice(0, count)
    .map(({ question }) => question);

export function KnowledgeTree({
  compact = false,
  masteredOnly = false,
  showNextUnlocks = true,
  showXpLegend = true,
  interactive = true,
}: KnowledgeTreeProps) {
  const { t, locale, level, learnedTopicIds, quizMasteredTopicIds, completeSignalQuiz } = useCat();
  const [quizSession, setQuizSession] = useState<{ topicId: string; questions: QuizQuestion[] } | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const effectiveLearnedTopicIds = Array.from(new Set([...learnedTopicIds, ...quizMasteredTopicIds]));
  const learned = getLearnedKnowledgeTopics(effectiveLearnedTopicIds);
  const masteredTopics = learned.filter((topic) => quizMasteredTopicIds.includes(topic.id));
  const pendingLearnedTopics = learned.filter((topic) => !quizMasteredTopicIds.includes(topic.id));
  const baseNextTopics = getNextKnowledgeTopics(effectiveLearnedTopicIds, level);
  const nextTopics = [...pendingLearnedTopics, ...baseNextTopics].filter(
    (topic, index, topics) => topics.findIndex((item) => item.id === topic.id) === index,
  );
  const unlockableNextTopicId = nextTopics.find((topic) => topic.requiredLevel <= level)?.id ?? null;
  const unlockedTopic = nextTopics.find((topic) => topic.id === unlockableNextTopicId) ?? null;
  const lockedNextTopics = nextTopics.filter((topic) => topic.id !== unlockableNextTopicId);
  const learnedPreview = [...masteredTopics, ...(unlockedTopic ? [unlockedTopic] : [])];
  const displayTopics = masteredOnly ? masteredTopics : learnedPreview;
  const activeTopicId = quizSession?.topicId ?? null;
  const activeTopic = [...learnedPreview, ...lockedNextTopics].find((topic) => topic.id === activeTopicId) ?? null;
  const activeQuiz = quizSession?.questions ?? [];
  const activeAnsweredCount = activeQuiz.filter((_, index) => answers[`${activeTopicId}-${index}`] !== undefined).length;
  const activeScore = activeQuiz.filter((question, index) => answers[`${activeTopicId}-${index}`] === question.answer).length;
  const activePassed = activeQuiz.length > 0 && activeAnsweredCount === activeQuiz.length && activeScore >= 2;

  const resetQuiz = (topic: KnowledgeTopic) => {
    setQuizSession({ topicId: topic.id, questions: pickRandomQuestions(getQuizQuestions(topic.id, locale)) });
    setAnswers({});
  };

  const answerQuestion = (index: number, answer: boolean) => {
    if (!activeTopicId) return;
    setAnswers((current) => ({ ...current, [`${activeTopicId}-${index}`]: answer }));
  };

  const renderQuizPanel = (topic: KnowledgeTopic) => {
    if (!activeTopic || activeTopic.id !== topic.id) return null;
    const topicCopy = getKnowledgeTopicCopy(activeTopic, locale);

    return (
      <div className="mt-3 rounded-lg border border-mint/35 bg-ink/75 p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-mint">Signal Quiz</p>
            <h3 className="mt-1 text-lg font-black text-white">{topicCopy.title}</h3>
          </div>
          <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs font-black text-white/65">
            {activeAnsweredCount}/3
          </span>
        </div>
        <p className="mt-2 text-sm leading-6 text-white/62">
          {locale === "en"
            ? "Answer three random true/false questions. Get two right to master this signal and earn growth points."
            : "ランダム○×クイズ3問です。2問以上正解すると、このシグナルをMasterして成長ポイントを獲得します。"}
        </p>

        <div className="mt-3 grid gap-2">
          {activeQuiz.map((question, index) => {
            const key = `${activeTopic.id}-${index}`;
            const chosen = answers[key];
            const answered = chosen !== undefined;
            const correct = chosen === question.answer;

            return (
              <div key={`${question.text}-${index}`} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold leading-6 text-white">
                    {index + 1}. {question.text}
                  </p>
                  {answered ? correct ? <CheckCircle2 className="shrink-0 text-mint" size={18} /> : <XCircle className="shrink-0 text-coral" size={18} /> : null}
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={answered}
                    onClick={() => answerQuestion(index, true)}
                    className="min-h-8 rounded-lg border border-mint/35 px-3 text-xs font-black text-mint transition hover:bg-mint hover:text-ink disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {locale === "en" ? "True" : "○"}
                  </button>
                  <button
                    type="button"
                    disabled={answered}
                    onClick={() => answerQuestion(index, false)}
                    className="min-h-8 rounded-lg border border-coral/35 px-3 text-xs font-black text-coral transition hover:bg-coral hover:text-ink disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {locale === "en" ? "False" : "×"}
                  </button>
                </div>
                {answered ? <p className="mt-2 text-xs leading-5 text-white/55">{question.explanation}</p> : null}
              </div>
            );
          })}
        </div>

        {activeAnsweredCount === activeQuiz.length ? (
          <div className={`mt-3 rounded-lg border p-3 ${activePassed ? "border-mint/40 bg-mint/10" : "border-coral/35 bg-coral/10"}`}>
            <p className="font-black text-white">
              {activePassed
                ? locale === "en"
                  ? `Clear! Score ${activeScore}/3`
                  : `クリア！ 正解 ${activeScore}/3`
                : locale === "en"
                  ? `Almost. Score ${activeScore}/3`
                  : `あと少し。正解 ${activeScore}/3`}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {activePassed && !quizMasteredTopicIds.includes(activeTopic.id) ? (
                <button
                  type="button"
                  onClick={() => {
                    completeSignalQuiz(activeTopic.id);
                    setQuizSession(null);
                    setAnswers({});
                  }}
                  className="min-h-9 rounded-lg bg-mint px-3 text-sm font-black text-ink transition hover:bg-white"
                >
                  {locale === "en" ? "Claim +15 Growth" : "+15成長ポイントを受け取る"}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => resetQuiz(activeTopic)}
                className="min-h-9 rounded-lg border border-white/10 px-3 text-sm font-black text-white/72 transition hover:border-mint hover:text-white"
              >
                {locale === "en" ? "Play again" : "もう一度ランダム出題"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <section className="neon-panel rounded-lg p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-mint">{t.knowledgeTree}</p>
          <h2 className="mt-1 text-xl font-black text-white">{t.learnedKnowledge}</h2>
        </div>
        <BookOpen className="text-mint" size={22} />
      </div>

      <div className="mt-3 grid gap-2">
        {displayTopics.length === 0 ? (
          <p className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-white/55">
            {masteredOnly
              ? locale === "en"
                ? "No mastered signal memory yet. Clear quizzes from My Cat to add records here."
                : "まだクリア済みのSignal Memoryはありません。My Catでクイズをクリアすると、ここに記録されます。"
              : t.noKnowledgeYet}
          </p>
        ) : (
          displayTopics.map((topic) => {
            const item = getKnowledgeTopicCopy(topic, locale);
            const mastered = quizMasteredTopicIds.includes(topic.id);
            const isActive = activeTopicId === topic.id;
            return (
              <article key={topic.id} className="rounded-lg border border-mint/35 bg-mint/10 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-white">{item.title}</p>
                  <div className="flex shrink-0 items-center gap-2">
                    {mastered ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-mint px-2 py-1 text-xs font-black text-ink">
                        <CheckCircle2 size={13} />
                        Mastered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-mint/15 px-2 py-1 text-xs font-black text-mint">
                        <Sparkles size={13} />+15
                      </span>
                    )}
                    {interactive ? (
                      <button
                        type="button"
                        onClick={() => resetQuiz(topic)}
                        className="min-h-8 rounded-lg border border-white/10 px-3 text-xs font-black text-white/72 transition hover:border-mint hover:text-white"
                      >
                        Quiz
                      </button>
                    ) : null}
                  </div>
                </div>
                {(!compact || isActive) ? <p className="mt-2 text-sm leading-6 text-white/62">{item.summary}</p> : null}
                {isActive ? renderQuizPanel(topic) : null}
              </article>
            );
          })
        )}
      </div>

      {showNextUnlocks ? (
      <div className="mt-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">{t.nextUnlocks}</p>
        <div className="mt-2 grid gap-2">
          {lockedNextTopics.length === 0 ? (
            <p className="rounded-lg border border-white/10 bg-white/[0.025] p-3 text-sm font-bold text-white/45">
              {locale === "en" ? "Clear the unlocked quiz to reveal the next signal." : "アンロック済みクイズをクリアすると、次のシグナルが表示されます。"}
            </p>
          ) : null}
          {lockedNextTopics.map((topic) => {
            const item = getKnowledgeTopicCopy(topic, locale);
            const levelReady = topic.requiredLevel <= level;
            const ready = false;
            const mastered = quizMasteredTopicIds.includes(topic.id);
            const isActive = activeTopicId === topic.id;
            const Icon = topic.category === "research" ? Microscope : BookOpen;
            return (
              <article key={topic.id} className={`rounded-lg border p-3 ${ready ? "border-mint/35 bg-mint/10" : "border-white/10 bg-white/[0.025]"}`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {ready ? <Icon className="text-mint" size={17} /> : <Lock className="text-white/35" size={17} />}
                    <p className={`text-sm font-black ${ready ? "text-white" : "text-white/45"}`}>{item.title}</p>
                  </div>
                  {ready ? (
                    <div className="flex shrink-0 items-center gap-2">
                      {mastered ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-mint px-2 py-1 text-xs font-black text-ink">
                          <CheckCircle2 size={13} />
                          Mastered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-mint/15 px-2 py-1 text-xs font-black text-mint">
                          <Sparkles size={13} />+15
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => resetQuiz(topic)}
                        className="min-h-8 rounded-lg border border-white/10 px-3 text-xs font-black text-white/72 transition hover:border-mint hover:text-white"
                      >
                        Quiz
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-black text-white/35">
                      {levelReady
                        ? locale === "en"
                          ? "Clear the previous unlock first"
                          : "1つ前をMasterで解除"
                        : t.lockedUntil.replace("{level}", String(topic.requiredLevel))}
                    </span>
                  )}
                </div>
                {ready ? <p className="mt-2 text-sm leading-6 text-white/62">{item.summary}</p> : null}
                {isActive ? renderQuizPanel(topic) : null}
              </article>
            );
          })}
        </div>
      </div>
      ) : null}

      {!compact && showXpLegend ? (
        <div className="mt-4 grid gap-2 text-xs font-bold text-white/62 sm:grid-cols-3">
          <p className="rounded-lg border border-white/10 bg-white/[0.035] p-3">{t.socialXp}</p>
          <p className="rounded-lg border border-white/10 bg-white/[0.035] p-3">{t.learningXp}</p>
          <p className="rounded-lg border border-white/10 bg-white/[0.035] p-3">{t.researchXp}</p>
        </div>
      ) : null}
    </section>
  );
}
