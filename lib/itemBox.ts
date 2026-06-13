import type { Locale } from "@/lib/i18n";
import type { ResearchCommandId } from "@/lib/researchCommands";

export type ItemRarity = "normal" | "rare" | "superRare";

export type ItemExpertise = {
  commandId: ResearchCommandId;
  points: number;
};

export type ItemDefinition = {
  id: string;
  rarity: ItemRarity;
  icon: string;
  image?: string;
  expertise: ItemExpertise[];
  en: string;
  ja: string;
};

export type CollectedItem = {
  id: string;
  acquiredLevel: number;
  acquiredAt: string;
};

export const itemDefinitions: ItemDefinition[] = [
  { id: "magnifying-glass", rarity: "normal", icon: "🔎", image: "/items/magnifying-glass.png", expertise: [{ commandId: "ecosystem-discovery", points: 1 }], en: "Magnifying Glass", ja: "虫眼鏡" },
  { id: "book", rarity: "normal", icon: "📘", image: "/items/book.png", expertise: [{ commandId: "daily-alpha", points: 1 }], en: "Book", ja: "本" },
  { id: "pen", rarity: "normal", icon: "🖊️", image: "/items/pen.png", expertise: [{ commandId: "rwa-report", points: 1 }], en: "Pen", ja: "ペン" },
  { id: "mouse", rarity: "normal", icon: "🖱️", image: "/items/mouse.png", expertise: [{ commandId: "whale-activity", points: 1 }], en: "Mouse", ja: "マウス" },
  { id: "memo-pad", rarity: "normal", icon: "📝", image: "/items/memo-pad.png", expertise: [{ commandId: "mantle-health", points: 1 }], en: "Memo Pad", ja: "メモ帳" },
  { id: "clock", rarity: "normal", icon: "🕒", image: "/items/clock.png", expertise: [{ commandId: "mnt-price", points: 1 }], en: "Clock", ja: "時計" },
  { id: "glasses", rarity: "normal", icon: "👓", image: "/items/glasses.png", expertise: [{ commandId: "whale-activity", points: 1 }], en: "Glasses", ja: "メガネ" },
  { id: "mantle-logo-tshirt", rarity: "rare", icon: "👕", image: "/items/mantle-logo-tshirt.png", expertise: [{ commandId: "mantle-health", points: 1 }, { commandId: "daily-alpha", points: 1 }], en: "Mantle Logo T-shirt", ja: "MantleロゴTシャツ" },
  { id: "mantle-logo-socks", rarity: "rare", icon: "🧦", image: "/items/mantle-logo-socks.png", expertise: [{ commandId: "mnt-price", points: 1 }, { commandId: "whale-activity", points: 1 }], en: "Mantle Logo Socks", ja: "Mantleロゴソックス" },
  { id: "mantle-logo-mug", rarity: "rare", icon: "☕", image: "/items/mantle-logo-mug.png", expertise: [{ commandId: "daily-alpha", points: 1 }, { commandId: "ecosystem-discovery", points: 1 }], en: "Mantle Logo Mug", ja: "Mantleロゴマグ" },
  { id: "mantle-logo-tote-bag", rarity: "rare", icon: "🛍️", image: "/items/mantle-logo-tote-bag.png", expertise: [{ commandId: "rwa-report", points: 1 }, { commandId: "ecosystem-discovery", points: 1 }], en: "Mantle Logo Tote Bag", ja: "Mantleロゴトートバッグ" },
  { id: "mantle-logo-umbrella", rarity: "rare", icon: "☂️", image: "/items/mantle-logo-umbrella.png", expertise: [{ commandId: "mantle-health", points: 1 }, { commandId: "rwa-report", points: 1 }], en: "Mantle Logo Umbrella", ja: "Mantleロゴ傘" },
  { id: "intern-cat-plushie", rarity: "superRare", icon: "🧸", image: "/items/intern-cat-plushie.png", expertise: [{ commandId: "daily-alpha", points: 1 }, { commandId: "mantle-health", points: 1 }, { commandId: "ecosystem-discovery", points: 1 }], en: "Intern Cat Plushie", ja: "Intern Catぬいぐるみ" },
  { id: "intern-cat-keychain", rarity: "superRare", icon: "🔑", image: "/items/intern-cat-keychain.png", expertise: [{ commandId: "whale-activity", points: 1 }, { commandId: "mantle-health", points: 1 }, { commandId: "mnt-price", points: 1 }], en: "Intern Cat Keychain", ja: "Intern Catキーホルダー" },
  { id: "intern-cat-pancake", rarity: "superRare", icon: "🥞", image: "/items/intern-cat-pancake.png", expertise: [{ commandId: "rwa-report", points: 1 }, { commandId: "daily-alpha", points: 1 }, { commandId: "mantle-health", points: 1 }], en: "Intern Cat Pancake", ja: "Intern Catパンケーキ" },
];

export const levelPinItem: ItemDefinition = {
  id: "level-pin-badge",
  rarity: "normal",
  icon: "🏅",
  expertise: [],
  en: "Level Pin Badge",
  ja: "レベルピンバッジ",
};

const itemIdAliases: Record<string, string> = {
  "mantle-logo-tote": "mantle-logo-tote-bag",
};

export const normalizeItemId = (id: string) => itemIdAliases[id] ?? id;

export const getItemDefinition = (id: string) => {
  const normalizedId = normalizeItemId(id);
  return normalizedId === levelPinItem.id ? levelPinItem : itemDefinitions.find((item) => item.id === normalizedId);
};

export const getItemName = (id: string, locale: Locale) => getItemDefinition(id)?.[locale] ?? id;

export const normalizeEquippedItemIds = (ids: unknown, collectedItems: CollectedItem[]) => {
  if (!Array.isArray(ids)) return [];
  const ownedIds = new Set(collectedItems.map((item) => normalizeItemId(item.id)));
  const seen = new Set<string>();
  return ids
    .filter((id): id is string => typeof id === "string")
    .map(normalizeItemId)
    .filter((id) => id !== levelPinItem.id && ownedIds.has(id) && Boolean(getItemDefinition(id)))
    .filter((id) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .slice(0, 3);
};

export const getDefaultEquippedItemIds = (collectedItems: CollectedItem[]) =>
  collectedItems
    .map((item) => normalizeItemId(item.id))
    .filter((id) => id !== levelPinItem.id)
    .filter((id, index, ids) => ids.indexOf(id) === index)
    .slice(0, 3);

export const getRarityLabel = (rarity: ItemRarity, locale: Locale) => {
  if (rarity === "superRare") return locale === "en" ? "Super Rare" : "スーパーレア";
  if (rarity === "rare") return locale === "en" ? "Rare" : "レア";
  return locale === "en" ? "Normal" : "ノーマル";
};

export const normalizeCollectedItems = (items: unknown): CollectedItem[] => {
  if (!Array.isArray(items)) return [];
  return mergeCollectedItems(
    items.filter(
    (item): item is CollectedItem =>
      Boolean(item) &&
      typeof item.id === "string" &&
      typeof item.acquiredLevel === "number" &&
      typeof item.acquiredAt === "string" &&
      Boolean(getItemDefinition(item.id)),
    ),
  );
};

export const mergeCollectedItems = (items: CollectedItem[]) => {
  const seen = new Set<string>();
  const seenLevels = new Set<number>();
  return items
    .map((item) => ({ ...item, id: normalizeItemId(item.id) }))
    .filter((item) => {
      if (seen.has(item.id) || seenLevels.has(item.acquiredLevel)) return false;
      seen.add(item.id);
      seenLevels.add(item.acquiredLevel);
      return true;
    });
};

export const getEquippedExpertise = (equippedItemIds: string[]) =>
  equippedItemIds.reduce<Partial<Record<ResearchCommandId, number>>>((totals, itemId) => {
    const definition = getItemDefinition(itemId);
    definition?.expertise.forEach((expertise) => {
      totals[expertise.commandId] = (totals[expertise.commandId] ?? 0) + expertise.points;
    });
    return totals;
  }, {});

export const getItemInsightBoost = (commandId: ResearchCommandId, points: number, locale: Locale) => {
  const depth = points >= 3 ? (locale === "en" ? "high" : "高") : points >= 1 ? (locale === "en" ? "medium" : "中") : locale === "en" ? "small" : "小";
  const commandHints: Record<ResearchCommandId, { en: string; ja: string }> = {
    "mnt-price": {
      en: "Item focus: compare price direction with network and whale context before judging momentum.",
      ja: "アイテム補正：価格の方向だけでなく、ネットワーク状態と大口行動を合わせて勢いを判断します。",
    },
    "mantle-health": {
      en: "Item focus: read health through activity, liquidity, and whether signals repeat.",
      ja: "アイテム補正：活動量、流動性、シグナルの継続性から健康度を読みます。",
    },
    "ecosystem-discovery": {
      en: "Item focus: look for projects with a reason to return, not just a name mention.",
      ja: "アイテム補正：名前だけでなく、ユーザーが戻る理由があるプロジェクトを重視します。",
    },
    "rwa-report": {
      en: "Item focus: separate RWA narrative from issuer quality, liquidity, and redemption risk.",
      ja: "アイテム補正：RWAの話題性と、発行体・流動性・償還リスクを分けて見ます。",
    },
    "whale-activity": {
      en: "Item focus: treat whale movement as both opportunity and exit-risk evidence.",
      ja: "アイテム補正：大口の動きをチャンスと出口リスクの両面から読みます。",
    },
    "daily-alpha": {
      en: "Item focus: connect market, network, ecosystem, and wallet clues into one short thesis.",
      ja: "アイテム補正：市場、ネットワーク、エコシステム、ウォレットの手がかりを1つの仮説にまとめます。",
    },
  };
  if (points <= 0) {
    return locale === "en"
      ? `Equipment depth: ${depth}. Equip an item with this specialty to unlock a deeper read.`
      : `装備による深掘り：${depth}。この分野が得意なアイテムをセットすると、読みが深くなります。`;
  }

  return locale === "en"
    ? `${commandHints[commandId].en}\nEquipment depth: ${depth} (+${points}).`
    : `${commandHints[commandId].ja}\n装備による深掘り：${depth}（+${points}）`;
};

const rarityWeightsForLevel = (level: number) => {
  if (level >= 10) return { normal: 45, rare: 38, superRare: 17 };
  if (level >= 7) return { normal: 55, rare: 33, superRare: 12 };
  if (level >= 5) return { normal: 65, rare: 27, superRare: 8 };
  return { normal: 78, rare: 20, superRare: 2 };
};

const pickRarity = (level: number): ItemRarity => {
  const weights = rarityWeightsForLevel(level);
  const roll = Math.random() * 100;
  if (roll < weights.superRare) return "superRare";
  if (roll < weights.superRare + weights.rare) return "rare";
  return "normal";
};

export const pickLevelRewardItem = (level: number, collectedItems: CollectedItem[]): CollectedItem | null => {
  if (level < 2) return null;
  if (collectedItems.some((item) => item.acquiredLevel === level)) return null;
  if (level === 2) {
    return collectedItems.some((item) => item.id === levelPinItem.id)
      ? null
      : { id: levelPinItem.id, acquiredLevel: level, acquiredAt: new Date().toISOString() };
  }

  const ownedIds = new Set(collectedItems.map((item) => item.id));
  const preferredRarity = pickRarity(level);
  const preferredPool = itemDefinitions.filter((item) => item.rarity === preferredRarity && !ownedIds.has(item.id));
  const fallbackPool = itemDefinitions.filter((item) => !ownedIds.has(item.id));
  const pool = preferredPool.length > 0 ? preferredPool : fallbackPool;
  if (pool.length === 0) return null;
  const item = pool[Math.floor(Math.random() * pool.length)];
  return { id: item.id, acquiredLevel: level, acquiredAt: new Date().toISOString() };
};
