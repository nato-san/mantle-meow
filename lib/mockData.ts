import type { Locale } from "./i18n";

export type LessonTopic = {
  id: string;
  xp: number;
  en: {
    title: string;
    summary: string;
    specialty: string;
  };
  ja: {
    title: string;
    summary: string;
    specialty: string;
  };
};

export const lessons: LessonTopic[] = [
  {
    id: "mantle-basics",
    xp: 45,
    en: {
      title: "Mantle Basics",
      summary: "Mantle connects scalable on-chain infrastructure with liquidity and real-world assets.",
      specialty: "Mantle Guide",
    },
    ja: {
      title: "Mantleの基礎",
      summary: "Mantleは、スケーラブルなオンチェーン基盤と流動性・現実資産をつなぐエコシステムです。",
      specialty: "Mantle案内係",
    },
  },
  {
    id: "rwa",
    xp: 55,
    en: {
      title: "RWA Research",
      summary: "RWA means real-world assets represented or accessed through on-chain systems.",
      specialty: "RWA Researcher",
    },
    ja: {
      title: "RWAリサーチ",
      summary: "RWAは、現実世界の資産をオンチェーン上で表現したり利用したりする考え方です。",
      specialty: "RWAリサーチャー",
    },
  },
  {
    id: "ai-alpha",
    xp: 60,
    en: {
      title: "AI Alpha & Data",
      summary: "AI can turn wallet behavior, market signals, and anomaly detection into useful research insights.",
      specialty: "Alpha Scout",
    },
    ja: {
      title: "AI Alpha & Data",
      summary: "AIはウォレット行動、市場シグナル、異常検知をリサーチインサイトに変換できます。",
      specialty: "アルファ探索猫",
    },
  },
  {
    id: "wallet",
    xp: 50,
    en: {
      title: "Agentic Wallets",
      summary: "Agentic wallets are future wallets where AI agents help plan, explain, and execute user goals.",
      specialty: "Wallet Intern",
    },
    ja: {
      title: "Agentic Wallets",
      summary: "Agentic Walletは、AIエージェントがユーザーの目的を計画・説明・実行支援する未来のウォレットです。",
      specialty: "ウォレット見習い",
    },
  },
];

export const getLessonCopy = (topic: LessonTopic, locale: Locale) => topic[locale];

export type ResearchSignal = {
  id: string;
  topicId: string;
  en: {
    title: string;
    clue: string;
    finding: string;
  };
  ja: {
    title: string;
    clue: string;
    finding: string;
  };
};

export type KnowledgeCategory = "social" | "learning" | "research";

export type KnowledgeTopic = {
  id: string;
  category: Exclude<KnowledgeCategory, "social">;
  xp: number;
  requiredLevel: number;
  keywords: string[];
  en: {
    title: string;
    summary: string;
    specialty: string;
  };
  ja: {
    title: string;
    summary: string;
    specialty: string;
  };
};

export const knowledgeTree: KnowledgeTopic[] = [
  {
    id: "mantle-basics",
    category: "learning",
    xp: 10,
    requiredLevel: 1,
    keywords: ["mantle", "マントル", "とは", "ecosystem", "エコシステム"],
    en: {
      title: "Mantle Basics",
      summary: "Understands Mantle as an ecosystem for scalable on-chain applications and liquidity.",
      specialty: "Mantle Guide",
    },
    ja: {
      title: "Mantleの基礎",
      summary: "Mantleを、スケーラブルなオンチェーンアプリと流動性のためのエコシステムとして理解しました。",
      specialty: "Mantle案内係",
    },
  },
  {
    id: "meth",
    category: "learning",
    xp: 10,
    requiredLevel: 1,
    keywords: ["meth", "mETH", "staking", "ステーキング", "liquid staking", "リキッド"],
    en: {
      title: "mETH",
      summary: "Connects mETH with liquid staking and yield opportunities in the Mantle ecosystem.",
      specialty: "mETH Intern",
    },
    ja: {
      title: "mETH",
      summary: "mETHがMantleエコシステム内のリキッドステーキングや利回り機会に関係することを調べました。",
      specialty: "mETH見習い",
    },
  },
  {
    id: "rwa",
    category: "learning",
    xp: 10,
    requiredLevel: 2,
    keywords: ["rwa", "real world asset", "real-world asset", "現実資産", "実物資産"],
    en: {
      title: "RWA",
      summary: "Connects real-world assets with on-chain access, transparency, and new financial products.",
      specialty: "RWA Researcher",
    },
    ja: {
      title: "RWA",
      summary: "現実世界の資産をオンチェーンのアクセス、透明性、新しい金融商品と結びつけて理解しました。",
      specialty: "RWAリサーチャー",
    },
  },
  {
    id: "mantle-ecosystem",
    category: "learning",
    xp: 10,
    requiredLevel: 2,
    keywords: ["defi", "liquidity", "流動性", "dapp", "apps", "プロジェクト"],
    en: {
      title: "Mantle Ecosystem",
      summary: "Starts mapping apps, liquidity, and user activity across Mantle.",
      specialty: "Ecosystem Scout",
    },
    ja: {
      title: "Mantleエコシステム",
      summary: "Mantle上のアプリ、流動性、ユーザー活動のつながりを見始めました。",
      specialty: "エコシステム探索猫",
    },
  },
  {
    id: "nansen",
    category: "research",
    xp: 20,
    requiredLevel: 3,
    keywords: ["nansen", "ナンセン", "signal", "シグナル", "analytics", "分析"],
    en: {
      title: "Nansen Signals",
      summary: "Learns how Nansen-style data can turn wallet behavior into research material.",
      specialty: "Nansen Scout",
    },
    ja: {
      title: "Nansenシグナル",
      summary: "Nansen系データがウォレット行動をリサーチ素材に変えられることを確認しました。",
      specialty: "Nansen探索猫",
    },
  },
  {
    id: "tvl",
    category: "research",
    xp: 20,
    requiredLevel: 3,
    keywords: ["tvl", "total value locked", "預かり資産", "ロック額"],
    en: {
      title: "TVL Research",
      summary: "Uses TVL as a signal for ecosystem traction, liquidity, and market confidence.",
      specialty: "TVL Analyst",
    },
    ja: {
      title: "TVLリサーチ",
      summary: "TVLを、エコシステムの勢い、流動性、市場の信頼を見るシグナルとして調べました。",
      specialty: "TVL分析猫",
    },
  },
  {
    id: "whale-tracking",
    category: "research",
    xp: 20,
    requiredLevel: 4,
    keywords: ["whale", "whales", "クジラ", "大口", "large wallet", "smart money"],
    en: {
      title: "Whale Tracking",
      summary: "Studies large-wallet movement as a clue for momentum and risk.",
      specialty: "Whale Tracker",
    },
    ja: {
      title: "大口ウォレット追跡",
      summary: "大口ウォレットの動きを、勢いやリスクを読む手がかりとして調べました。",
      specialty: "大口追跡猫",
    },
  },
  {
    id: "wallet-analysis",
    category: "research",
    xp: 20,
    requiredLevel: 4,
    keywords: ["wallet analysis", "wallet", "ウォレット分析", "アドレス", "address", "portfolio"],
    en: {
      title: "Wallet Analysis",
      summary: "Connects wallet history, portfolio behavior, and on-chain decisions.",
      specialty: "Wallet Analyst",
    },
    ja: {
      title: "ウォレット分析",
      summary: "ウォレット履歴、ポートフォリオ行動、オンチェーン判断のつながりを調べました。",
      specialty: "ウォレット分析猫",
    },
  },
];

export const getKnowledgeTopicCopy = (topic: KnowledgeTopic, locale: Locale) => topic[locale];

export const researchSignals: ResearchSignal[] = [
  {
    id: "smart-money-mantle",
    topicId: "nansen",
    en: {
      title: "Smart Money Signal",
      clue: "Nansen-style labels show experienced wallets as research clues, not final answers.",
      finding: "Smart Money is useful when I treat it as a question: why are these wallets moving now?",
    },
    ja: {
      title: "Smart Moneyシグナル",
      clue: "Nansen風ラベルは、経験あるウォレットを見るための手がかりで、答えそのものではありません。",
      finding: "Smart Moneyは「なぜ今このウォレットが動いているのか？」を考える入口として使えると分かりました。",
    },
  },
  {
    id: "tvl-shift",
    topicId: "tvl",
    en: {
      title: "TVL Movement",
      clue: "TVL movement can hint at liquidity confidence, but it needs context before I trust it.",
      finding: "TVL is a signal I should compare with activity and incentives before making a finding.",
    },
    ja: {
      title: "TVL変化",
      clue: "TVLの動きは流動性への信頼を読むヒントになりますが、背景と一緒に見る必要があります。",
      finding: "TVLは、活動量やインセンティブと比べてから発見にするべきシグナルだと覚えました。",
    },
  },
  {
    id: "wallet-behavior",
    topicId: "wallet-analysis",
    en: {
      title: "Wallet Behavior",
      clue: "A wallet's repeated actions can reveal habits, confidence, or risk appetite.",
      finding: "Wallet analysis is about patterns over time, not judging one transaction alone.",
    },
    ja: {
      title: "ウォレット行動",
      clue: "ウォレットの繰り返し行動から、習慣・確信・リスク許容度の手がかりが見えます。",
      finding: "ウォレット分析は、ひとつの取引だけで判断せず、時間をかけたパターンを見ることだと分かりました。",
    },
  },
  {
    id: "large-wallet-risk",
    topicId: "whale-tracking",
    en: {
      title: "Large Wallet Movement",
      clue: "Large-wallet activity can be a clue for momentum, but also for crowded risk.",
      finding: "Whale movement is strongest when I explain both the opportunity and the risk.",
    },
    ja: {
      title: "大口ウォレットの動き",
      clue: "大口ウォレットの活動は勢いの手がかりにも、混雑したリスクの手がかりにもなります。",
      finding: "大口の動きは、チャンスとリスクの両方を説明できる時に強い発見になります。",
    },
  },
];

export const getResearchSignalCopy = (signal: ResearchSignal, locale: Locale) => signal[locale];

export const classifyKnowledge = (text: string, currentLevel: number) => {
  const normalized = text.toLowerCase();
  const matchedTopic = knowledgeTree.find((topic) => topic.keywords.some((keyword) => normalized.includes(keyword.toLowerCase())));
  if (!matchedTopic) {
    return {
      category: "social" as const,
      xp: 1,
      topic: null,
      lockedTopic: null,
    };
  }

  if (matchedTopic.requiredLevel > currentLevel) {
    return {
      category: matchedTopic.category,
      xp: matchedTopic.category === "research" ? 5 : 3,
      topic: null,
      lockedTopic: matchedTopic,
    };
  }

  return {
    category: matchedTopic.category,
    xp: matchedTopic.xp,
    topic: matchedTopic,
    lockedTopic: null,
  };
};

export const getLearnedKnowledgeTopics = (learnedTopicIds: string[]) => knowledgeTree.filter((topic) => learnedTopicIds.includes(topic.id));

export const getNextKnowledgeTopics = (learnedTopicIds: string[], currentLevel: number) => {
  const unlearned = knowledgeTree.filter((topic) => !learnedTopicIds.includes(topic.id));
  const available = unlearned.filter((topic) => topic.requiredLevel <= currentLevel);
  if (available.length > 0) return available.slice(0, 3);
  return unlearned.sort((a, b) => a.requiredLevel - b.requiredLevel).slice(0, 3);
};
