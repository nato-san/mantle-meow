import type { Locale } from "@/lib/i18n";

export type CatPersonality = "sweet" | "energetic" | "smart" | "butler" | "tsundere" | "noble";

export const catPersonalities: CatPersonality[] = ["sweet", "energetic", "smart", "butler", "tsundere", "noble"];

export const personalityCopy = {
  en: {
    sweet: {
      label: "Cute Meow",
    },
    energetic: {
      label: "Energetic",
    },
    smart: {
      label: "Brainy",
    },
    butler: {
      label: "Butler Cat",
    },
    tsundere: {
      label: "Tsundere",
    },
    noble: {
      label: "Noble Cat",
    },
  },
  ja: {
    sweet: {
      label: "かわいいにゃ",
    },
    energetic: {
      label: "元気っこ",
    },
    smart: {
      label: "インテリ",
    },
    butler: {
      label: "執事猫",
    },
    tsundere: {
      label: "ツンデレ",
    },
    noble: {
      label: "高飛車",
    },
  },
} satisfies Record<Locale, Record<CatPersonality, { label: string }>>;

const casualizeJapanese = (text: string) =>
  text
    .replace(/ください$/u, "ちょうだい")
    .replace(/してください$/u, "して")
    .replace(/お願いします$/u, "お願い")
    .replace(/おねがいします$/u, "お願い")
    .replace(/ました$/u, "た")
    .replace(/します$/u, "する")
    .replace(/です$/u, "");

export function applyPersonality(text: string, locale: Locale, personality: CatPersonality) {
  const cleanText = text.trim().replace(/[。.!！\s]+$/u, "");

  if (locale === "ja") {
    if (cleanText.includes("よろしく")) {
      if (personality === "sweet") return "よろしくおねがいしますにゃ〜";
      if (personality === "energetic") return "よろしくだぜ！";
      if (personality === "smart") return "よろしくたのみますよ。";
      if (personality === "butler") return "承知しました、ご主人さま。";
      if (personality === "noble") return "よろしくしてくださってよくってよ。";
      return "べ、別に楽しみってわけじゃないけど、よろしく。";
    }

    if (cleanText.includes("会いたかった") || cleanText.includes("待って")) {
      if (personality === "sweet") return "会えてうれしいにゃ〜";
      if (personality === "energetic") return "来てくれてうれしいぜ！今日もいくぞ！";
      if (personality === "smart") return "来てくれて助かります。今日の観測を始めましょう。";
      if (personality === "butler") return "お待ちしておりました、ご主人さま。";
      if (personality === "noble") return "来てくださってよくってよ。さあ、今日の観測を始めますわ。";
      return "べ、別に待ってたわけじゃないけど...来てくれてよかった。";
    }

    const casualText = casualizeJapanese(cleanText);
    if (personality === "sweet") return `${casualText}にゃ〜`;
    if (personality === "energetic") return `${casualText}だぜ！`;
    if (personality === "smart") return `${casualText}ですね。記録しておきます。`;
    if (personality === "butler") return `承知しました。${casualText}でございます。`;
    if (personality === "noble") return `${casualText}ですわ。よく見ていてくださる？`;
    return `べ、別に${casualText}ってだけだからね。`;
  }

  const lowerText = cleanText.toLowerCase();
  if (lowerText.includes("missed") || lowerText.includes("waiting")) {
    if (personality === "sweet") return "Meow, I am happy you came back.";
    if (personality === "energetic") return "You are back! Let's check today's signals!";
    if (personality === "smart") return "Good timing. I am ready to inspect today's signals.";
    if (personality === "butler") return "Welcome back, my dear mentor. I was ready for your return.";
    if (personality === "noble") return "You may return to me now. Let us begin today's observation.";
    return "I-it's not like I was waiting... but I am glad you came back.";
  }

  if (personality === "sweet") return `Meow, ${cleanText}.`;
  if (personality === "energetic") return `${cleanText}! Let's go!`;
  if (personality === "smart") return `${cleanText}. I will keep that in mind.`;
  if (personality === "butler") return `Certainly, my dear mentor. ${cleanText}.`;
  if (personality === "noble") return `${cleanText}. You may be pleased with my observation.`;
  return `I-it's not a big deal, but ${cleanText}.`;
}

export function getRandomPersonality() {
  return catPersonalities[Math.floor(Math.random() * catPersonalities.length)];
}
