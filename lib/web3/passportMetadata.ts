import type { Locale } from "@/lib/i18n";
import type { CatPersonality } from "@/lib/personality";
import { personalityCopy } from "@/lib/personality";

type PassportMetadataInput = {
  locale: Locale;
  catName: string;
  level: number;
  xp: number;
  bond: number;
  personality: CatPersonality;
  mood: string;
  specialty: string;
  history: string[];
};

const encodeBase64 = (value: string) => {
  if (typeof window === "undefined") return "";
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
};

export function buildPassportMetadata(input: PassportMetadataInput) {
  const researchMemories = input.history.slice(0, 10);
  const metadata = {
    name: `${input.catName} Passport`,
    description: "INTERN CAT Passport minted on Mantle. This is a hackathon MVP metadata payload.",
    image: "ipfs://placeholder/intern-cat-passport.png",
    attributes: [
      { trait_type: "Cat Name", value: input.catName },
      { trait_type: "Level", value: input.level },
      { trait_type: "XP", value: input.xp },
      { trait_type: "Bond", value: input.bond },
      { trait_type: "Personality", value: personalityCopy[input.locale][input.personality].label },
      { trait_type: "Mood", value: input.mood },
      { trait_type: "Specialty", value: input.specialty },
      { trait_type: "Research Memories", value: researchMemories.length > 0 ? researchMemories.join(" | ") : "No findings yet" },
    ],
  };

  return {
    metadata,
    tokenUri: `data:application/json;base64,${encodeBase64(JSON.stringify(metadata))}`,
  };
}
