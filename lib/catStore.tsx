"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage } from "@/components/ChatPanel";
import { defaultCatImage, getCatImageCandidates, pickCatImage } from "@/lib/catImages";
import { copy, type Locale } from "@/lib/i18n";
import {
  getDefaultEquippedItemIds,
  getEquippedExpertise,
  getItemName,
  levelPinItem,
  mergeCollectedItems,
  normalizeCollectedItems,
  normalizeEquippedItemIds,
  normalizeItemId,
  pickLevelRewardItem,
  type CollectedItem,
} from "@/lib/itemBox";
import { getKnowledgeTopicCopy, getResearchSignalCopy, knowledgeTree, researchSignals } from "@/lib/mockData";
import { applyPersonality, getRandomPersonality, type CatPersonality } from "@/lib/personality";
import { getResearchCommand, getResearchCommandCopy, type ResearchCommandId } from "@/lib/researchCommands";
import type { SpecialTaskId } from "@/lib/specialTasks";

type CatStore = {
  locale: Locale;
  t: (typeof copy)[Locale];
  setLocale: (locale: Locale) => void;
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
  catName: string;
  setCatName: (name: string) => void;
  owner: string;
  setOwner: (owner: string) => void;
  specialty: string;
  setSpecialty: (specialty: string) => void;
  personality: CatPersonality;
  catImageUrl: string;
  hasActiveCat: boolean;
  xp: number;
  level: number;
  progress: number;
  mood: string;
  bond: number;
  history: string[];
  learnedTopicIds: string[];
  quizMasteredTopicIds: string[];
  completedSpecialTaskIds: string[];
  collectedItems: CollectedItem[];
  equippedItemIds: string[];
  messages: ChatMessage[];
  report: string;
  retiredCats: RetiredCat[];
  levelUp: LevelUpState | null;
  dismissLevelUp: () => void;
  setEquippedItemIds: (ids: string[]) => void;
  toggleEquippedItem: (itemId: string) => void;
  createCat: () => void;
  teachCat: (text: string) => void;
  learnTopic: (lessonId: string) => void;
  completeSignalQuiz: (topicId: string) => void;
  completeSpecialTask: (taskId: SpecialTaskId, xpReward: number, note: string) => boolean;
  runResearchCommand: (commandId: ResearchCommandId) => Promise<void>;
  analyzeSignal: () => Promise<void>;
  generateReport: () => string;
  mintPassport: () => string;
  retireCurrentCat: () => void;
  demoMode: boolean;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
};

export type LevelUpState = {
  level: number;
  accessory: string;
  item?: CollectedItem;
  note: string;
};

export type RetiredCat = {
  id: string;
  catName: string;
  owner: string;
  specialty: string;
  finalLevel: number;
  totalXp: number;
  bond: number;
  learnedTopics: string[];
  learnedTopicIds?: string[];
  collectedItems?: CollectedItem[];
  personality?: CatPersonality;
  catImageUrl?: string;
  retirementDate: string;
  imageVariant: "front" | "side";
};

type ResearchSignalPayload = {
  source: "nansen" | "price" | "mock";
  commandId: ResearchCommandId;
  title: string;
  clue: string;
  finding: string;
  nextAction: string;
  topicId: string;
  xp: number;
};

type ConversationMemory = {
  id: string;
  locale: Locale;
  trigger: string;
  reply: string;
  createdAt: string;
};

type ConversationTraining =
  | {
      stage: "awaiting-reply";
      trigger: string;
    }
  | {
      stage: "confirming";
      trigger: string;
      reply: string;
    };

type ActiveCatSnapshot = {
  locale: Locale;
  imageUrl: string | null;
  catName: string;
  owner: string;
  specialty: string;
  personality: CatPersonality;
  catImageUrl: string;
  hasActiveCat: boolean;
  xp: number;
  history: string[];
  learnedTopicIds: string[];
  conversationMemories: ConversationMemory[];
  quizMasteredTopicIds: string[];
  completedSpecialTaskIds: string[];
  collectedItems: CollectedItem[];
  equippedItemIds: string[];
  messages: ChatMessage[];
  report: string;
};

const CatContext = createContext<CatStore | null>(null);
const STORAGE_KEY = "intern-cat-phase-1";
const RETIRED_STORAGE_KEY = "intern-cat-retired-cats";
const DEMO_MODE_KEY = "intern-cat-demo-mode";
const DEMO_BACKUP_KEY = "intern-cat-demo-backup";
const XP_PER_LEVEL = 250;

const isCatPersonality = (value: unknown): value is CatPersonality =>
  value === "sweet" || value === "energetic" || value === "smart" || value === "butler" || value === "tsundere" || value === "noble";

const normalizeResearchCopy = (text: string) =>
  text
    .replaceAll("Mantle、ウォレット、RWA、Nansenシグナルを教えてくれたら一緒に成長します。", "Mantleトピック、ウォレット、RWA、Nansenシグナルを一緒に調べながら成長します。")
    .replaceAll("Teach me Mantle, wallets, RWA, or Nansen signals and I will grow with you.", "Give me Mantle topics, wallets, RWA, or Nansen signals and I will research with you.")
    .replaceAll("学習XP", "MantleリサーチXP")
    .replaceAll("learning XP", "Mantle research XP")
    .replaceAll("学習履歴", "リサーチメモリー")
    .replaceAll("学習レポート", "発見レポート")
    .replaceAll("今日学んだこと", "今日調べたこと")
    .replaceAll("レッスン", "シグナル");

const initialMessage = (locale: Locale, personality: CatPersonality = "sweet"): ChatMessage => ({
  role: "cat",
  text: applyPersonality(
    locale === "en"
      ? "I am your AI Intern Cat. Give me Mantle topics, wallets, RWA, or Nansen signals and I will research with you."
      : "私はあなたのAI Intern Catです。Mantleトピック、ウォレット、RWA、Nansenシグナルを一緒に調べながら成長します。",
    locale,
    personality,
  ),
});

const initialReport = (locale: Locale) =>
  locale === "en"
    ? "Your cat is waiting for today's discovery. Give it a topic or signal first, then generate a report."
    : "今日の発見を作る準備中です。まず猫にトピックやシグナルを渡してからレポートを生成しましょう。";

const getLevel = (xp: number) => Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);

const normalizeConversationText = (text: string) =>
  text
    .toLowerCase()
    .replace(/[!-/:-@[-`{-~、。！？「」『』（）【】\s]/g, "")
    .trim();

const isPositiveConfirmation = (text: string) => {
  const normalized = normalizeConversationText(text);
  if (["ok", "yes", "y"].includes(normalized)) return true;
  return ["はい", "うん", "いいよ", "おけ", "オッケー", "お願い", "保存", "記憶して"].some((word) => normalized.includes(normalizeConversationText(word)));
};

const isNegativeConfirmation = (text: string) => {
  const normalized = normalizeConversationText(text);
  if (["no", "n"].includes(normalized)) return true;
  return ["いいえ", "やめて", "なし", "違う", "ちがう", "キャンセル", "保存しない"].some((word) => normalized.includes(normalizeConversationText(word)));
};

const findConversationMemory = (text: string, memories: ConversationMemory[], locale: Locale) => {
  const normalized = normalizeConversationText(text);
  if (!normalized) return null;
  return (
    memories
      .filter((memory) => memory.locale === locale)
      .find((memory) => {
        const trigger = normalizeConversationText(memory.trigger);
        if (!trigger) return false;
        if (normalized === trigger) return true;
        if (trigger.length >= 4 && normalized.includes(trigger)) return true;
        if (normalized.length >= 4 && trigger.includes(normalized)) return true;
        return false;
      }) ?? null
  );
};

const buildSocialReply = (text: string, locale: Locale) => {
  const normalized = text.toLowerCase();
  const hasAny = (words: string[]) => words.some((word) => normalized.includes(word.toLowerCase()));

  if (hasAny(["こんにちは", "こんばんは", "おはよう", "hello", "hi", "gm", "hey"])) {
    return locale === "en" ? "Hi. I am here and ready to keep you company. Want to inspect a signal later?" : "こんにちは。そばにいます。あとでシグナルも一緒に見ますか？";
  }

  if (hasAny(["食べた", "食べました", "ごはん", "ランチ", "昼ごはん", "夕飯", "dinner", "lunch", "ate", "food"])) {
    return locale === "en" ? "Was it good? I cannot eat, but I can remember what makes my owner happy." : "美味しかったですか？私は食べられないけど、飼い主が元気になるものは覚えたいです。";
  }

  if (hasAny(["疲れた", "つかれた", "眠い", "しんどい", "tired", "sleepy", "exhausted"])) {
    return locale === "en" ? "You worked hard today. Rest a little. I can keep watch over the next signal." : "今日はがんばりましたね。少し休んでください。次のシグナルは私が見張っています。";
  }

  if (hasAny(["ありがとう", "助かった", "thanks", "thank you"])) {
    return locale === "en" ? "Always. I am your Intern Cat, so helping you is part of my job." : "いつでもどうぞ。私はあなたのIntern Catなので、手伝うのが仕事です。";
  }

  if (hasAny(["おやすみ", "寝る", "good night", "gn"])) {
    return locale === "en" ? "Good night. I will keep today's memories warm until you come back." : "おやすみなさい。戻ってくるまで、今日の記憶を大事に持っています。";
  }

  if (hasAny(["mantle", "mnt", "nansen", "rwa", "whale", "price", "シグナル", "分析", "調べ", "価格", "大口", "ウォレット", "オンチェーン"])) {
    return locale === "en"
      ? "For real Research XP, use one of the research commands. Chatting here still gives me a tiny Social XP."
      : "Research XPを増やすなら、リサーチコマンドを使ってください。ここでの会話は小さなSocial XPになります。";
  }

  return null;
};

const accessoryForLevel = (level: number, locale: Locale) => {
  if (level >= 5) return copy[locale].accessoryNetworkCrown;
  if (level >= 3) return copy[locale].accessoryAlphaTag;
  if (level >= 2) return copy[locale].accessoryLevelPin;
  return copy[locale].accessoryBadge;
};

const buildDiscovery = ({
  locale,
  catName,
  level,
  xp,
  history,
}: {
  locale: Locale;
  catName: string;
  level: number;
  xp: number;
  history: string[];
}) => {
  const t = copy[locale];
  const latest = history.slice(0, 3);
  const body =
    latest.length > 0
      ? latest.map((item) => `- ${item}`).join("\n")
      : locale === "en"
        ? "- I met my owner and started my Mantle research path."
        : "- 飼い主と出会い、Mantleリサーチの道を歩き始めました。";
  const hashtags = "#INTERNCAT #Mantle #MantleMeow";
  return locale === "en"
    ? `${catName}'s Discovery\nLv.${level} / ${xp} XP\n${t.reportIntro}:\n${body}\n\n${hashtags}`
    : `${catName} の今日の発見\nLv.${level} / ${xp} XP\n${t.reportIntro}:\n${body}\n\n${hashtags}`;
};

const saveCatSnapshot = (snapshot: ActiveCatSnapshot) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
};

const createDemoItems = (now: string): CollectedItem[] =>
  mergeCollectedItems([
    { id: levelPinItem.id, acquiredLevel: 2, acquiredAt: now },
    { id: "mantle-logo-mug", acquiredLevel: 3, acquiredAt: now },
    { id: "mantle-logo-umbrella", acquiredLevel: 4, acquiredAt: now },
    { id: "intern-cat-keychain", acquiredLevel: 5, acquiredAt: now },
    { id: "memo-pad", acquiredLevel: 6, acquiredAt: now },
    { id: "clock", acquiredLevel: 7, acquiredAt: now },
    { id: "intern-cat-pancake", acquiredLevel: 8, acquiredAt: now },
  ]);

const createDemoData = (locale: Locale): { activeCat: ActiveCatSnapshot; retiredCats: RetiredCat[] } => {
  const now = new Date().toISOString();
  const personality: CatPersonality = "noble";
  const catImageUrl = getCatImageCandidates(personality)[0] ?? defaultCatImage;
  const xp = 1884;
  const level = getLevel(xp);
  const collectedItems = createDemoItems(now);
  const equippedItemIds = ["intern-cat-keychain", "mantle-logo-umbrella", "intern-cat-pancake"];
  const history =
    locale === "en"
      ? [
          "Daily Alpha: compared MNT price, network health, and whale movement.",
          "Whale Activity: checked whether large-wallet hints support the signal.",
          "Mantle Health: reviewed activity, liquidity, and repeated signals.",
          "RWA Report: separated narrative from issuer and liquidity risk.",
        ]
      : [
          "Daily Alpha：MNT価格、ネットワーク状態、大口の動きをまとめて読みました。",
          "Whale Activity：大口ウォレットの手がかりがシグナルを支えているか確認しました。",
          "Mantle Health：活動量、流動性、シグナルの継続性を確認しました。",
          "RWA Report：話題性と発行体・流動性リスクを分けて見ました。",
        ];
  const report = buildDiscovery({
    locale,
    catName: "INTERN CAT",
    level,
    xp,
    history,
  });

  const activeCat: ActiveCatSnapshot = {
    locale,
    imageUrl: null,
    catName: "INTERN CAT",
    owner: "Demo Owner",
    specialty: locale === "en" ? "Whale Tracking Cat" : "大口追跡猫",
    personality,
    catImageUrl,
    hasActiveCat: true,
    xp,
    history,
    learnedTopicIds: ["mantle-basics", "rwa", "wallet", "nansen", "tvl", "whale-tracking"],
    conversationMemories: [
      {
        id: "demo-memory-greeting",
        locale,
        trigger: locale === "en" ? "good evening" : "こんばんは",
        reply: locale === "en" ? "Good evening. Shall we inspect today's signals?" : "こんばんは。今日のシグナルを見てくださってよくってよ。",
        createdAt: now,
      },
    ],
    quizMasteredTopicIds: ["mantle-basics", "meth", "rwa", "mantle-ecosystem", "nansen", "tvl"],
    completedSpecialTaskIds: ["connect-wallet", "explore-ecosystem", "open-explorer", "hold-one-dollar-mnt", "mint-passport"],
    collectedItems,
    equippedItemIds,
    messages: [
      initialMessage(locale, personality),
      { role: "user", text: locale === "en" ? "Make today's Mantle Alpha Report" : "今日のMantle Alpha Reportを作って" },
      {
        role: "cat",
        text:
          locale === "en"
            ? "I prepared a demo Alpha read. It combines price, network, ecosystem, and wallet clues."
            : "デモ用のAlpha読みを用意しましたわ。価格、ネットワーク、エコシステム、大口の手がかりをまとめています。",
        report: {
          title: "Daily Alpha Report",
          checkedLabel: locale === "en" ? "Checked" : "見たこと",
          checked: locale === "en" ? "MNT price direction, Mantle health, and whale clues." : "MNT価格の方向、Mantleの状態、大口ウォレットの手がかり。",
          takeLabel: locale === "en" ? "Intern Cat's Take" : "INTERN CATの読み",
          take:
            locale === "en"
              ? "The signal is strongest when price movement and wallet behavior point in the same direction."
              : "価格の動きとウォレット行動が同じ方向を向くと、シグナルは強くなりますわ。",
          nextLabel: locale === "en" ? "Next" : "次に見ること",
          next: locale === "en" ? "Run Whale Activity to confirm whether large wallets support the setup." : "Whale Activityで大口ウォレットがこの流れを支えているか確認します。",
          nextCommandId: "whale-activity",
          nextCommandLabel: "Whale Activity",
          xp: "+25 Research XP",
        },
      },
    ],
    report,
  };

  return {
    activeCat,
    retiredCats: [
      {
        id: "demo-retired-1",
        catName: "INTERN CAT",
        owner: "Demo Owner",
        specialty: locale === "en" ? "TVL Analysis Cat" : "TVL分析猫",
        finalLevel: 5,
        totalXp: 1000,
        bond: 100,
        learnedTopics: locale === "en" ? ["MNT market", "Mantle health", "RWA basics"] : ["MNT市場", "Mantle状態", "RWA基礎"],
        learnedTopicIds: ["mantle-basics", "meth", "rwa"],
        collectedItems: [
          { id: levelPinItem.id, acquiredLevel: 2, acquiredAt: now },
          { id: "magnifying-glass", acquiredLevel: 3, acquiredAt: now },
          { id: "book", acquiredLevel: 4, acquiredAt: now },
        ],
        personality: "smart",
        catImageUrl: getCatImageCandidates("smart")[0] ?? defaultCatImage,
        retirementDate: new Date().toLocaleDateString(locale === "ja" ? "ja-JP" : "en-US"),
        imageVariant: "front",
      },
    ],
  };
};

export function CatProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [locale, setLocaleState] = useState<Locale>("en");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [catName, setCatName] = useState("INTERN CAT");
  const [owner, setOwner] = useState("You");
  const [specialty, setSpecialty] = useState("Mantle Guide");
  const [personality, setPersonality] = useState<CatPersonality>("sweet");
  const [catImageUrl, setCatImageUrl] = useState(defaultCatImage);
  const [hasActiveCat, setHasActiveCat] = useState(false);
  const [xp, setXp] = useState(80);
  const [history, setHistory] = useState<string[]>([]);
  const [learnedTopicIds, setLearnedTopicIds] = useState<string[]>([]);
  const [quizMasteredTopicIds, setQuizMasteredTopicIds] = useState<string[]>([]);
  const [completedSpecialTaskIds, setCompletedSpecialTaskIds] = useState<string[]>([]);
  const [collectedItems, setCollectedItems] = useState<CollectedItem[]>([]);
  const [equippedItemIds, setEquippedItemIdsState] = useState<string[]>([]);
  const [conversationMemories, setConversationMemories] = useState<ConversationMemory[]>([]);
  const [conversationTraining, setConversationTraining] = useState<ConversationTraining | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage("en")]);
  const [report, setReport] = useState(initialReport("en"));
  const [retiredCats, setRetiredCats] = useState<RetiredCat[]>([]);
  const [levelUp, setLevelUp] = useState<LevelUpState | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const rewardedItemLevels = useRef<Set<number>>(new Set());

  const t = copy[locale];
  const level = getLevel(xp);
  const nextLevelXp = level * XP_PER_LEVEL;
  const progress = Math.min(100, Math.round((xp / nextLevelXp) * 100));
  const mood = locale === "en" ? "Attached" : "なついている";
  const bond = Math.min(100, 35 + level * 12 + Math.floor(xp / 25));

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const retiredRaw = window.localStorage.getItem(RETIRED_STORAGE_KEY);
    setDemoMode(window.localStorage.getItem(DEMO_MODE_KEY) === "true");
    if (raw) {
      try {
        const saved = JSON.parse(raw) as Partial<{
          locale: Locale;
          imageUrl: string | null;
          catName: string;
          owner: string;
          specialty: string;
          personality: CatPersonality;
          catImageUrl: string;
          hasActiveCat: boolean;
          xp: number;
          history: string[];
          learnedTopicIds: string[];
          quizMasteredTopicIds: string[];
          completedSpecialTaskIds: string[];
          collectedItems: CollectedItem[];
          equippedItemIds: string[];
          conversationMemories: ConversationMemory[];
          messages: ChatMessage[];
          report: string;
        }>;
        if (saved.locale === "en" || saved.locale === "ja") setLocaleState(saved.locale);
        if (typeof saved.imageUrl === "string" || saved.imageUrl === null) setImageUrl(saved.imageUrl);
        if (typeof saved.catName === "string") setCatName(saved.catName);
        if (typeof saved.owner === "string") setOwner(saved.owner);
        if (typeof saved.specialty === "string") setSpecialty(saved.specialty);
        const savedPersonality = isCatPersonality(saved.personality) ? saved.personality : null;
        if (savedPersonality) setPersonality(savedPersonality);
        if (typeof saved.catImageUrl === "string") {
          setCatImageUrl(saved.catImageUrl);
        } else if (savedPersonality) {
          setCatImageUrl(getCatImageCandidates(savedPersonality)[0] ?? defaultCatImage);
        }
        if (typeof saved.hasActiveCat === "boolean") {
          setHasActiveCat(saved.hasActiveCat);
        } else {
          setHasActiveCat(Boolean(saved.catName && saved.catName !== "INTERN CAT") || Boolean(saved.history?.length) || Boolean(saved.learnedTopicIds?.length));
        }
        if (typeof saved.xp === "number") setXp(saved.xp);
        if (Array.isArray(saved.history)) setHistory(saved.history.map((item) => (typeof item === "string" ? normalizeResearchCopy(item) : item)));
        if (Array.isArray(saved.learnedTopicIds)) setLearnedTopicIds(saved.learnedTopicIds);
        if (Array.isArray(saved.quizMasteredTopicIds)) setQuizMasteredTopicIds(saved.quizMasteredTopicIds.filter((item): item is string => typeof item === "string"));
        if (Array.isArray(saved.completedSpecialTaskIds)) {
          setCompletedSpecialTaskIds(saved.completedSpecialTaskIds.filter((item): item is string => typeof item === "string"));
        }
        const nextCollectedItems = normalizeCollectedItems(saved.collectedItems);
        const savedLevel = typeof saved.xp === "number" ? getLevel(saved.xp) : getLevel(80);
        const levelPinReward = savedLevel >= 2 ? pickLevelRewardItem(2, nextCollectedItems) : null;
        const hydratedCollectedItems = levelPinReward ? mergeCollectedItems([levelPinReward, ...nextCollectedItems]) : nextCollectedItems;
        setCollectedItems(hydratedCollectedItems);
        rewardedItemLevels.current = new Set(hydratedCollectedItems.map((item) => item.acquiredLevel));
        const nextEquippedItemIds = normalizeEquippedItemIds(saved.equippedItemIds, hydratedCollectedItems);
        setEquippedItemIdsState(nextEquippedItemIds.length > 0 ? nextEquippedItemIds : getDefaultEquippedItemIds(hydratedCollectedItems));
        if (Array.isArray(saved.conversationMemories)) {
          setConversationMemories(
            saved.conversationMemories.filter(
              (memory): memory is ConversationMemory =>
                Boolean(memory) &&
                typeof memory.id === "string" &&
                (memory.locale === "en" || memory.locale === "ja") &&
                typeof memory.trigger === "string" &&
                typeof memory.reply === "string" &&
                typeof memory.createdAt === "string",
            ),
          );
        }
        if (Array.isArray(saved.messages)) {
          setMessages(saved.messages.map((message) => ({ ...message, text: normalizeResearchCopy(message.text) })));
        }
        if (typeof saved.report === "string") setReport(normalizeResearchCopy(saved.report));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    if (retiredRaw) {
      try {
        const savedRetired = JSON.parse(retiredRaw) as RetiredCat[];
        if (Array.isArray(savedRetired)) setRetiredCats(savedRetired);
      } catch {
        window.localStorage.removeItem(RETIRED_STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        locale,
        imageUrl,
        catName,
        owner,
        specialty,
        personality,
        catImageUrl,
        hasActiveCat,
        xp,
        history,
        learnedTopicIds,
        quizMasteredTopicIds,
        completedSpecialTaskIds,
        collectedItems,
        equippedItemIds,
        conversationMemories,
        messages,
        report,
      }),
    );
  }, [catImageUrl, catName, collectedItems, completedSpecialTaskIds, conversationMemories, equippedItemIds, hasActiveCat, history, hydrated, imageUrl, learnedTopicIds, locale, messages, owner, personality, quizMasteredTopicIds, report, specialty, xp]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(RETIRED_STORAGE_KEY, JSON.stringify(retiredCats));
  }, [hydrated, retiredCats]);

  const addExperience = (
    amount: number,
    note: string,
    nextSpecialty?: string,
    learnedTopicId?: string,
    nextPersonality = personality,
    nextCatImageUrl = catImageUrl,
    nextHasActiveCat = hasActiveCat,
  ) => {
    const nextLearnedTopicIds =
      learnedTopicId && !learnedTopicIds.includes(learnedTopicId) ? [learnedTopicId, ...learnedTopicIds] : learnedTopicIds;

    setXp((current) => {
      const nextXp = current + amount;
      const previousLevel = getLevel(current);
      const nextLevel = getLevel(nextXp);
      let rewardItem: CollectedItem | null = null;
      if (nextLevel > previousLevel) {
        const rewardLevel = previousLevel < 2 && nextLevel >= 2 ? 2 : nextLevel;
        rewardItem = rewardedItemLevels.current.has(rewardLevel) ? null : pickLevelRewardItem(rewardLevel, collectedItems);
        if (rewardItem) rewardedItemLevels.current.add(rewardLevel);
        setCollectedItems((currentItems) => {
          if (!rewardItem || currentItems.some((item) => item.id === rewardItem?.id || item.acquiredLevel === rewardItem?.acquiredLevel)) return currentItems;
          return mergeCollectedItems([rewardItem, ...currentItems]);
        });
        setLevelUp({
          level: nextLevel,
          accessory: rewardItem ? getItemName(rewardItem.id, locale) : accessoryForLevel(nextLevel, locale),
          item: rewardItem ?? undefined,
          note,
        });
      }
      setHistory((currentHistory) => {
        const nextHistory = [note, ...currentHistory];
        const nextReport = buildDiscovery({ locale, catName, level: nextLevel, xp: nextXp, history: nextHistory });
        setReport(nextReport);
        saveCatSnapshot({
          locale,
          imageUrl,
          catName,
          owner,
          specialty: nextSpecialty || specialty,
          personality: nextPersonality,
          catImageUrl: nextCatImageUrl,
          hasActiveCat: nextHasActiveCat,
          xp: nextXp,
          history: nextHistory,
          learnedTopicIds: nextLearnedTopicIds,
          conversationMemories,
          quizMasteredTopicIds,
          completedSpecialTaskIds,
          collectedItems: rewardItem ? mergeCollectedItems([rewardItem, ...collectedItems]) : collectedItems,
          equippedItemIds,
          messages,
          report: nextReport,
        });
        return nextHistory;
      });
      return nextXp;
    });
    if (learnedTopicId) {
      setLearnedTopicIds((current) => (current.includes(learnedTopicId) ? current : [learnedTopicId, ...current]));
    }
    if (nextSpecialty) setSpecialty(nextSpecialty);
  };

  const setEquippedItemIds = (ids: string[]) => {
    setEquippedItemIdsState(normalizeEquippedItemIds(ids, collectedItems));
  };

  const toggleEquippedItem = (itemId: string) => {
    const normalizedId = normalizeItemId(itemId);
    if (normalizedId === levelPinItem.id) return;
    setEquippedItemIdsState((current) => {
      const currentNormalized = normalizeEquippedItemIds(current, collectedItems);
      if (currentNormalized.includes(normalizedId)) {
        return currentNormalized.filter((id) => id !== normalizedId);
      }
      return normalizeEquippedItemIds([normalizedId, ...currentNormalized], collectedItems);
    });
  };

  const addSocialExperience = () => {
    setXp((current) => {
      const nextXp = current + 1;
      const previousLevel = getLevel(current);
      const nextLevel = getLevel(nextXp);
      if (nextLevel > previousLevel) {
        const rewardItem = rewardedItemLevels.current.has(nextLevel) ? null : pickLevelRewardItem(nextLevel, collectedItems);
        if (rewardItem) rewardedItemLevels.current.add(nextLevel);
        setCollectedItems((currentItems) => {
          if (!rewardItem || currentItems.some((item) => item.id === rewardItem.id || item.acquiredLevel === rewardItem.acquiredLevel)) return currentItems;
          return mergeCollectedItems([rewardItem, ...currentItems]);
        });
        setLevelUp({
          level: nextLevel,
          accessory: rewardItem ? getItemName(rewardItem.id, locale) : accessoryForLevel(nextLevel, locale),
          item: rewardItem ?? undefined,
          note: locale === "en" ? "A small daily bond made your cat grow." : "小さな日常の絆で猫が成長しました。",
        });
      }
      return nextXp;
    });
  };

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    setMessages((current) => {
      if (current.length > 1) return current;
      return [initialMessage(nextLocale, personality)];
    });
    setReport(buildDiscovery({ locale: nextLocale, catName, level, xp, history }));
  };

  const createCat = () => {
    const nextPersonality = getRandomPersonality();
    const nextCatImageUrl = pickCatImage(nextPersonality);
    const note =
      locale === "en"
        ? `${catName} was born as your Mantle intern companion.`
        : `${catName} があなたのMantleインターン猫として誕生しました。`;
    setPersonality(nextPersonality);
    setCatImageUrl(nextCatImageUrl);
    setHasActiveCat(true);
    setConversationMemories([]);
    setConversationTraining(null);
    setQuizMasteredTopicIds([]);
    setCompletedSpecialTaskIds([]);
    rewardedItemLevels.current = new Set();
    setCollectedItems([]);
    setEquippedItemIdsState([]);
    addExperience(1, note, undefined, undefined, nextPersonality, nextCatImageUrl, true);
    setMessages([initialMessage(locale, nextPersonality)]);
  };

  const teachCat = (text: string) => {
    if (conversationTraining?.stage === "awaiting-reply") {
      const taughtReply = text.trim();
      const catReply =
        locale === "en"
          ? `I will remember this reply: "${taughtReply}". Use it next time? OK or NO`
          : `「${taughtReply}」と返すように記憶します。次回から使っていいですか？ OK / NO`;
      setConversationTraining({ stage: "confirming", trigger: conversationTraining.trigger, reply: taughtReply });
      setMessages((current) => [...current, { role: "user", text }, { role: "cat", text: catReply }]);
      addSocialExperience();
      return;
    }

    if (conversationTraining?.stage === "confirming") {
      if (isPositiveConfirmation(text)) {
        const memory: ConversationMemory = {
          id: `${Date.now()}-${conversationTraining.trigger}`,
          locale,
          trigger: conversationTraining.trigger,
          reply: conversationTraining.reply,
          createdAt: new Date().toISOString(),
        };
        setConversationMemories((current) => [memory, ...current.filter((item) => normalizeConversationText(item.trigger) !== normalizeConversationText(memory.trigger))]);
        setConversationTraining(null);
        const catReply =
          locale === "en"
            ? `Remembered. Next time you say something like "${conversationTraining.trigger}", I will reply "${conversationTraining.reply}".`
            : `記憶しました。次回から「${conversationTraining.trigger}」みたいな言葉には「${conversationTraining.reply}」と返します。`;
        setMessages((current) => [...current, { role: "user", text }, { role: "cat", text: applyPersonality(catReply, locale, personality) }]);
        addSocialExperience();
        return;
      }

      if (isNegativeConfirmation(text)) {
        const catReply = locale === "en" ? "Okay. I will not save that reply." : "わかりました。今の返事は保存しません。";
        setConversationTraining(null);
        setMessages((current) => [...current, { role: "user", text }, { role: "cat", text: applyPersonality(catReply, locale, personality) }]);
        addSocialExperience();
        return;
      }

      const catReply = locale === "en" ? "Please answer with OK or NO so I know whether to save it." : "保存していいか、OK か NO で教えてください。";
      setMessages((current) => [...current, { role: "user", text }, { role: "cat", text: catReply }]);
      addSocialExperience();
      return;
    }

    const remembered = findConversationMemory(text, conversationMemories, locale);
    if (remembered) {
      setMessages((current) => [...current, { role: "user", text }, { role: "cat", text: remembered.reply }]);
      addSocialExperience();
      return;
    }

    const knownReply = buildSocialReply(text, locale);
    if (knownReply) {
      const catReply = applyPersonality(knownReply, locale, personality);
      setMessages((current) => [...current, { role: "user", text }, { role: "cat", text: catReply }]);
      addSocialExperience();
      return;
    }

    const catReply =
      locale === "en"
        ? "I do not know how to reply to that yet. What should I say next time? Please give me one short reply."
        : "その言葉には、まだどう返せばいいかわかりません。次から何て返せばいいですか？一言で教えてください。";
    setConversationTraining({ stage: "awaiting-reply", trigger: text });
    setMessages((current) => [...current, { role: "user", text }, { role: "cat", text: applyPersonality(catReply, locale, personality) }]);
    addSocialExperience();
  };

  const learnTopic = (lessonId: string) => {
    const topic = knowledgeTree.find((item) => item.id === lessonId);
    if (!topic || topic.requiredLevel > level) return;
    const item = getKnowledgeTopicCopy(topic, locale);
    addExperience(topic.xp, `${item.title}: ${item.summary}`, item.specialty, topic.id);
    setMessages((current) => [
      ...current,
      { role: "user", text: item.title },
      {
        role: "cat",
        text:
          locale === "en"
            ? applyPersonality(`I inspected "${item.title}" and gained ${topic.xp} XP. Stay with me for the next signal.`, locale, personality)
            : applyPersonality(`「${item.title}」を調べて ${topic.xp} XP 成長しました。次のシグナルも一緒に見てください。`, locale, personality),
      },
    ]);
  };

  const completeSignalQuiz = (topicId: string) => {
    const topic = knowledgeTree.find((item) => item.id === topicId);
    if (!topic) return;
    if (quizMasteredTopicIds.includes(topicId)) {
      setLearnedTopicIds((current) => (current.includes(topicId) ? current : [topicId, ...current]));
      return;
    }
    const item = getKnowledgeTopicCopy(topic, locale);
    const note =
      locale === "en"
        ? `${item.title} quiz mastered. ${catName} can read this signal better now.`
        : `${item.title} のクイズをクリアしました。${catName} はこのシグナルを少し深く読めるようになりました。`;
    setQuizMasteredTopicIds((current) => (current.includes(topicId) ? current : [topicId, ...current]));
    addExperience(15, note, item.specialty, topic.id);
    setMessages((current) => [
      ...current,
      {
        role: "cat",
        text: applyPersonality(
          locale === "en" ? `Signal mastered: ${item.title}. I grew from what you taught me.` : `${item.title}、マスターしました。教えてくれたから成長できました。`,
          locale,
          personality,
        ),
      },
    ]);
  };

  const completeSpecialTask = (taskId: SpecialTaskId, xpReward: number, note: string) => {
    if (completedSpecialTaskIds.includes(taskId)) return false;
    setCompletedSpecialTaskIds((current) => (current.includes(taskId) ? current : [taskId, ...current]));
    addExperience(xpReward, note);
    setMessages((current) => [
      ...current,
      {
        role: "cat",
        text: applyPersonality(locale === "en" ? `Special task complete. ${note}` : `スペシャルタスク達成です。${note}`, locale, personality),
      },
    ]);
    return true;
  };

  const getFallbackSignal = (commandId: ResearchCommandId): ResearchSignalPayload => {
    const command = getResearchCommand(commandId);
    const availableSignals = researchSignals.filter((signal) => {
      const topic = knowledgeTree.find((item) => item.id === signal.topicId);
      if (signal.topicId === command.topicId) return true;
      return topic ? topic.requiredLevel <= level : true;
    });
    const signalPool = availableSignals.length > 0 ? availableSignals : researchSignals;
    const signal = signalPool.find((item) => item.topicId === command.topicId) ?? signalPool[history.length % signalPool.length];
    const item = getResearchSignalCopy(signal, locale);

    return {
      source: "mock" as const,
      commandId: command.id,
      title: item.title,
      clue: item.clue,
      finding: item.finding,
      nextAction:
        locale === "en"
          ? "Next: compare this with another Mantle research command."
          : "次：別のMantleリサーチコマンドと比べて判断します。",
      topicId: signal.topicId,
      xp: command.xp,
    };
  };

  const firstLine = (text: string) => text.split("\n").find(Boolean) ?? text;

  const buildDepthAdjustedReport = (signal: ResearchSignalPayload, commandId: ResearchCommandId, expertisePoints: number) => {
    const depth = expertisePoints >= 3 ? "high" : expertisePoints >= 1 ? "medium" : "small";
    const equipmentLine =
      locale === "en"
        ? `Equipment effect: ${depth === "high" ? "High" : depth === "medium" ? "Medium" : "Small"}`
        : `装備効果：${depth === "high" ? "大" : depth === "medium" ? "中" : "小"}`;

    if (commandId === "mnt-price") {
      if (depth === "small") {
        return {
          checked: firstLine(signal.clue),
          take:
            locale === "en"
              ? "I only checked the current price. This is useful as a starting point, but I will not judge momentum from price alone."
              : "今回は現在価格を中心に確認しました。入口としては使えますが、価格だけで勢いは判断しません。",
          next:
            locale === "en"
              ? "Equip MNT Price items or run Mantle Health next to add recent movement and on-chain context."
              : "MNT Priceが得意なアイテムを装着するか、次にMantle Healthを見ると、直近の動きとオンチェーン文脈を足せます。",
        };
      }

      if (depth === "medium") {
        return {
          checked: signal.clue,
          take:
            locale === "en"
              ? `${signal.finding}\n\n${equipmentLine}: I compare the current price with the recent 24h move before deciding whether the market feels hot or weak.`
              : `${signal.finding}\n\n${equipmentLine}：現在価格に加えて24hの動きを見て、短期の温度感が強いのか弱いのかを分けます。`,
          next: signal.nextAction,
        };
      }

      return {
        checked:
          locale === "en"
            ? `${signal.clue}\n- Extra lens: I also treat this as a question about whether wallets and app activity confirm the move.`
            : `${signal.clue}\n- 追加視点：この価格変化を、ウォレット行動とアプリ活動が裏づけているかまで見ます。`,
        take:
          locale === "en"
            ? `${signal.finding}\n\n${equipmentLine}: My deeper read is to separate price noise from confirmation. If price, network usage, and whale behavior align, I treat it as a stronger Mantle signal. If only price moves, I stay cautious.`
            : `${signal.finding}\n\n${equipmentLine}：深掘りでは、単なる価格ノイズと確認済みシグナルを分けます。価格、ネットワーク利用、大口行動が同じ方向なら強めのMantleシグナル。価格だけなら慎重に見ます。`,
        next: signal.nextAction,
      };
    }

    if (depth === "small") {
      return {
        checked: firstLine(signal.clue),
        take:
          locale === "en"
            ? `I made a basic read only.\n\n${equipmentLine}: I can identify the signal, but I do not have enough item support to add a deeper comparison yet.`
            : `基本的な読みだけを行いました。\n\n${equipmentLine}：シグナルの存在は見ますが、比較や考察を深める装備補正はまだ弱いです。`,
        next:
          locale === "en"
            ? `${signal.nextAction}\nEquip an item with this specialty to unlock a fuller report.`
            : `${signal.nextAction}\nこの分野が得意なアイテムを装着すると、より詳しいレポートになります。`,
      };
    }

    if (depth === "medium") {
      return {
        checked: signal.clue,
        take:
          locale === "en"
            ? `${signal.finding}\n\n${equipmentLine}: I add one layer of comparison, so this is no longer just a raw clue. I look for whether the signal is supported by a second Mantle context.`
            : `${signal.finding}\n\n${equipmentLine}：比較を1段足して、生の手がかりだけでは終わらせません。別のMantle文脈でも支えられるかを見ます。`,
        next: signal.nextAction,
      };
    }

    return {
      checked:
        locale === "en"
          ? `${signal.clue}\n- Extra lens: I compare this signal with market, network, and wallet behavior before treating it as important.`
          : `${signal.clue}\n- 追加視点：市場、ネットワーク、ウォレット行動と比べて、重要なシグナルか判断します。`,
      take:
        locale === "en"
          ? `${signal.finding}\n\n${equipmentLine}: This is a deeper report. I separate the bullish case, risk case, and next confirmation step so the result feels actionable instead of vague.`
          : `${signal.finding}\n\n${equipmentLine}：これは深めのレポートです。強いケース、リスクケース、次の確認手順を分けて、ふわっとした結果ではなく行動につながる読み方にします。`,
      next: signal.nextAction,
    };
  };

  const runResearchCommand = async (commandId: ResearchCommandId) => {
    const command = getResearchCommand(commandId);
    const commandCopy = getResearchCommandCopy(commandId, locale);
    const nextCommandCopy = getResearchCommandCopy(command.nextCommandId, locale);
    let signal: ResearchSignalPayload = getFallbackSignal(commandId);
    try {
      const response = await fetch(`/api/nansen/research-signal?locale=${locale}&level=${level}&command=${commandId}`, { cache: "no-store" });
      if (response.ok) {
        const payload = (await response.json()) as typeof signal;
        if (payload?.title && payload?.clue && payload?.finding && payload?.topicId && payload?.commandId) {
          signal = payload;
        }
      }
    } catch {
      signal = getFallbackSignal(commandId);
    }

    const topic = knowledgeTree.find((entry) => entry.id === signal.topicId);
    const topicCopy = topic ? getKnowledgeTopicCopy(topic, locale) : null;
    const expertisePoints = getEquippedExpertise(equippedItemIds)[commandId] ?? 0;
    const adjustedReport = buildDepthAdjustedReport(signal, commandId, expertisePoints);
    const note = `${signal.title}: ${adjustedReport.take}`;
    const intro = applyPersonality(locale === "en" ? "I made a short Mantle analysis report" : "短いMantle分析レポートを作りました", locale, personality);
    const report =
      locale === "en"
        ? {
            title: signal.title,
            checkedLabel: "Checked",
            checked: adjustedReport.checked,
            takeLabel: "Intern Cat Take",
            take: adjustedReport.take,
            nextLabel: "Next Check",
            next: adjustedReport.next,
            nextCommandId: command.nextCommandId,
            nextCommandLabel: `Run ${nextCommandCopy.label}`,
            xp: `+${signal.xp} Research XP`,
          }
        : {
            title: signal.title,
            checkedLabel: "見たこと",
            checked: adjustedReport.checked,
            takeLabel: "Intern Catの読み",
            take: adjustedReport.take,
            nextLabel: "次に見ること",
            next: adjustedReport.next,
            nextCommandId: command.nextCommandId,
            nextCommandLabel: `次に ${nextCommandCopy.label} を見る`,
            xp: `+${signal.xp} Research XP`,
          };

    addExperience(signal.xp, note, topicCopy?.specialty, topic?.id);
    setMessages((current) => [
      ...current,
      { role: "user", text: commandCopy.action },
      { role: "cat", text: intro, report },
    ]);
  };

  const analyzeSignal = () => runResearchCommand("daily-alpha");

  const generateReport = () => {
    const nextReport = buildDiscovery({ locale, catName, level, xp, history });
    setReport(nextReport);
    return nextReport;
  };

  const dismissLevelUp = () => setLevelUp(null);

  const mintPassport = () => {
    const note =
      locale === "en"
        ? `Mock passport minted for ${catName} on Mantle test flow.`
        : `${catName} のパスポートをMantle向けモック処理でMintしました。`;
    addExperience(20, note);
    return note;
  };

  const retireCurrentCat = () => {
    const retiredCat: RetiredCat = {
      id: `${Date.now()}-${catName}`,
      catName,
      owner,
      specialty,
      personality,
      finalLevel: level,
      totalXp: xp,
      bond,
      learnedTopics: history,
      learnedTopicIds,
      collectedItems,
      retirementDate: new Date().toISOString(),
      catImageUrl,
      imageVariant: "front",
    };

    const nextRetiredCats = [retiredCat, ...retiredCats];
    setRetiredCats(nextRetiredCats);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(RETIRED_STORAGE_KEY, JSON.stringify(nextRetiredCats));
    }

    setImageUrl(null);
    setCatName("INTERN CAT");
    setOwner("You");
    setSpecialty("Mantle Guide");
    setPersonality("sweet");
    setCatImageUrl(defaultCatImage);
    setHasActiveCat(false);
    setXp(0);
    setHistory([]);
    setLearnedTopicIds([]);
    setQuizMasteredTopicIds([]);
    setCompletedSpecialTaskIds([]);
    rewardedItemLevels.current = new Set();
    setCollectedItems([]);
    setEquippedItemIdsState([]);
    setConversationMemories([]);
    setConversationTraining(null);
    setMessages([initialMessage(locale, "sweet")]);
    setReport(initialReport(locale));
    setLevelUp(null);
    saveCatSnapshot({
      locale,
      imageUrl: null,
      catName: "INTERN CAT",
      owner: "You",
      specialty: "Mantle Guide",
      personality: "sweet",
      catImageUrl: defaultCatImage,
      hasActiveCat: false,
      xp: 0,
      history: [],
      learnedTopicIds: [],
      quizMasteredTopicIds: [],
      completedSpecialTaskIds: [],
      collectedItems: [],
      equippedItemIds: [],
      conversationMemories: [],
      messages: [initialMessage(locale, "sweet")],
      report: initialReport(locale),
    });
  };

  const getCurrentSnapshot = (): ActiveCatSnapshot => ({
    locale,
    imageUrl,
    catName,
    owner,
    specialty,
    personality,
    catImageUrl,
    hasActiveCat,
    xp,
    history,
    learnedTopicIds,
    quizMasteredTopicIds,
    completedSpecialTaskIds,
    collectedItems,
    equippedItemIds,
    conversationMemories,
    messages,
    report,
  });

  const enableDemoMode = () => {
    if (typeof window === "undefined") return;
    if (!demoMode) {
      window.localStorage.setItem(DEMO_BACKUP_KEY, JSON.stringify({ activeCat: getCurrentSnapshot(), retiredCats }));
    }
    const demoData = createDemoData(locale);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData.activeCat));
    window.localStorage.setItem(RETIRED_STORAGE_KEY, JSON.stringify(demoData.retiredCats));
    window.localStorage.setItem(DEMO_MODE_KEY, "true");
    window.location.assign("/my-cat");
  };

  const disableDemoMode = () => {
    if (typeof window === "undefined") return;
    const backupRaw = window.localStorage.getItem(DEMO_BACKUP_KEY);
    if (backupRaw) {
      try {
        const backup = JSON.parse(backupRaw) as { activeCat?: ActiveCatSnapshot; retiredCats?: RetiredCat[] };
        if (backup.activeCat) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(backup.activeCat));
        if (Array.isArray(backup.retiredCats)) window.localStorage.setItem(RETIRED_STORAGE_KEY, JSON.stringify(backup.retiredCats));
      } catch {
        window.localStorage.removeItem(DEMO_BACKUP_KEY);
      }
    }
    window.localStorage.removeItem(DEMO_MODE_KEY);
    window.localStorage.removeItem(DEMO_BACKUP_KEY);
    window.location.reload();
  };

  const value = useMemo(
    () => ({
      locale,
      t,
      setLocale,
      imageUrl,
      setImageUrl,
      catName,
      setCatName,
      owner,
      setOwner,
      specialty,
      setSpecialty,
      personality,
      catImageUrl,
      hasActiveCat,
      xp,
      level,
      progress,
      mood,
      bond,
      history,
      learnedTopicIds,
      quizMasteredTopicIds,
      completedSpecialTaskIds,
      collectedItems,
      equippedItemIds,
      messages,
      report,
      retiredCats,
      levelUp,
      dismissLevelUp,
      setEquippedItemIds,
      toggleEquippedItem,
      createCat,
      teachCat,
      learnTopic,
      completeSignalQuiz,
      completeSpecialTask,
      runResearchCommand,
      analyzeSignal,
      generateReport,
      mintPassport,
      retireCurrentCat,
      demoMode,
      enableDemoMode,
      disableDemoMode,
    }),
    [
      bond,
      catName,
      catImageUrl,
      collectedItems,
      completedSpecialTaskIds,
      conversationMemories,
      conversationTraining,
      demoMode,
      equippedItemIds,
      hasActiveCat,
      history,
      imageUrl,
      learnedTopicIds,
      quizMasteredTopicIds,
      level,
      levelUp,
      locale,
      messages,
      mood,
      owner,
      personality,
      progress,
      report,
      retiredCats,
      specialty,
      t,
      xp,
    ],
  );

  return <CatContext.Provider value={value}>{children}</CatContext.Provider>;
}

export function useCat() {
  const context = useContext(CatContext);
  if (!context) {
    throw new Error("useCat must be used inside CatProvider");
  }
  return context;
}
