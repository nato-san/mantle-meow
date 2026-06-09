import type { Locale } from "@/lib/i18n";

export type ResearchCommandId =
  | "mnt-price"
  | "mantle-health"
  | "ecosystem-discovery"
  | "rwa-report"
  | "whale-activity"
  | "daily-alpha";

export type ResearchCommand = {
  id: ResearchCommandId;
  topicId: string;
  xp: number;
  requiresNansen: boolean;
  category: "market" | "network" | "discovery" | "rwa" | "whale" | "alpha";
  nextCommandId: ResearchCommandId;
  en: {
    label: string;
    description: string;
    action: string;
  };
  ja: {
    label: string;
    description: string;
    action: string;
  };
};

export const researchCommands: ResearchCommand[] = [
  {
    id: "mnt-price",
    topicId: "mantle-basics",
    xp: 15,
    requiresNansen: false,
    category: "market",
    nextCommandId: "mantle-health",
    en: {
      label: "MNT Price",
      description: "Check today's $MNT price and market temperature.",
      action: "Check $MNT price",
    },
    ja: {
      label: "MNT Price",
      description: "今日の$MNT価格と市場の温度感を確認します。",
      action: "$MNT価格をチェックして",
    },
  },
  {
    id: "mantle-health",
    topicId: "tvl",
    xp: 20,
    requiresNansen: true,
    category: "network",
    nextCommandId: "whale-activity",
    en: {
      label: "Mantle Health",
      description: "Read network health from flow, activity, and liquidity clues.",
      action: "Analyze Mantle network health",
    },
    ja: {
      label: "Mantle Health",
      description: "資金の流れ、活動量、流動性からネットワーク状態を読みます。",
      action: "Mantleのネットワーク状態を見て",
    },
  },
  {
    id: "ecosystem-discovery",
    topicId: "mantle-ecosystem",
    xp: 10,
    requiresNansen: true,
    category: "discovery",
    nextCommandId: "rwa-report",
    en: {
      label: "Ecosystem Discovery",
      description: "Find one Mantle ecosystem project or theme worth watching.",
      action: "Find a Mantle ecosystem discovery",
    },
    ja: {
      label: "Ecosystem Discovery",
      description: "Mantleエコシステムで注目したいプロジェクトやテーマを探します。",
      action: "Mantleの注目プロジェクトを探して",
    },
  },
  {
    id: "rwa-report",
    topicId: "rwa",
    xp: 20,
    requiresNansen: true,
    category: "rwa",
    nextCommandId: "ecosystem-discovery",
    en: {
      label: "RWA Report",
      description: "Summarize useful RWA clues for Mantle research.",
      action: "Make a Mantle RWA report",
    },
    ja: {
      label: "RWA Report",
      description: "Mantleリサーチに役立つRWAの手がかりを短く整理します。",
      action: "MantleのRWAレポートを作って",
    },
  },
  {
    id: "whale-activity",
    topicId: "whale-tracking",
    xp: 20,
    requiresNansen: true,
    category: "whale",
    nextCommandId: "daily-alpha",
    en: {
      label: "Whale Activity",
      description: "Look for large-wallet movement and possible risk.",
      action: "Check whale activity",
    },
    ja: {
      label: "Whale Activity",
      description: "大口ウォレットの動きとリスクの手がかりを確認します。",
      action: "大口ウォレットの動きを見て",
    },
  },
  {
    id: "daily-alpha",
    topicId: "ai-alpha",
    xp: 25,
    requiresNansen: true,
    category: "alpha",
    nextCommandId: "mnt-price",
    en: {
      label: "Daily Alpha",
      description: "Generate today's short Mantle alpha report.",
      action: "Generate today's Mantle alpha",
    },
    ja: {
      label: "Daily Alpha",
      description: "今日のMantle向けAlpha Reportを短く作ります。",
      action: "今日のMantle Alpha Reportを作って",
    },
  },
];

export const getResearchCommand = (id: string | null) => researchCommands.find((command) => command.id === id) ?? researchCommands[1];

export const getResearchCommandCopy = (id: ResearchCommandId, locale: Locale) => {
  const command = getResearchCommand(id);
  return command[locale];
};
