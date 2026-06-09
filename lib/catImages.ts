import type { CatPersonality } from "@/lib/personality";

export const defaultCatImage = "/assets/cat-front.png";

export const catImageCandidates: Record<CatPersonality, string[]> = {
  sweet: ["/cats/sweet/front-1.png", "/cats/sweet/front-2.png", "/cats/sweet/front-3.png", "/cats/sweet/front-4.png"],
  energetic: [
    "/cats/energetic/front-1.png",
    "/cats/energetic/front-2.png",
    "/cats/energetic/front-3.png",
    "/cats/energetic/front-4.png",
    "/cats/energetic/front-5.png",
  ],
  smart: [
    "/cats/smart/front-1.png",
    "/cats/smart/front-2.png",
    "/cats/smart/front-3.png",
    "/cats/smart/front-4.png",
    "/cats/smart/front-5.png",
    "/cats/smart/front-6.png",
  ],
  butler: ["/cats/butler/front-1.png", "/cats/butler/front-2.png", "/cats/butler/front-3.png", "/cats/butler/front-4.png"],
  tsundere: ["/cats/tsundere/front-1.png", "/cats/tsundere/front-2.png", "/cats/tsundere/front-3.png"],
  noble: ["/cats/noble/front-1.png", "/cats/noble/front-2.png"],
};

export const getCatImageCandidates = (personality: CatPersonality) => {
  const candidates = catImageCandidates[personality];
  return candidates.length > 0 ? candidates : [defaultCatImage];
};

export const pickCatImage = (personality: CatPersonality) => {
  const candidates = getCatImageCandidates(personality);
  return candidates[Math.floor(Math.random() * candidates.length)] ?? defaultCatImage;
};
