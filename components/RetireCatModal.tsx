"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCat } from "@/lib/catStore";

type RetireCatModalProps = {
  open: boolean;
  onClose: () => void;
};

export function RetireCatModal({ open, onClose }: RetireCatModalProps) {
  const router = useRouter();
  const { t, catName, catImageUrl, retireCurrentCat } = useCat();

  if (!open) return null;

  const handleRetire = () => {
    retireCurrentCat();
    onClose();
    router.push("/create");
  };

  return (
    <div className="fixed inset-0 z-[110] grid place-items-center bg-ink/80 p-4 backdrop-blur-md">
      <section className="neon-panel w-full max-w-xl rounded-lg p-6">
        <div className="grid gap-5 sm:grid-cols-[0.72fr_1.28fr] sm:items-center">
          <div className="relative min-h-72 overflow-hidden rounded-lg border border-mint/25 bg-mint/10">
            <div className="absolute inset-3 rounded-full bg-mint/10 blur-2xl" />
            <Image
              src={catImageUrl}
              alt={catName}
              fill
              className="object-contain object-center p-3 drop-shadow-[0_0_24px_rgba(116,247,199,0.22)]"
              sizes="(max-width: 640px) 80vw, 220px"
              priority
            />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">{t.retirementDangerTitle}</p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-white">{t.retireConfirmTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-white/68">{t.retireConfirmBody}</p>
            <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm font-black text-mint">{catName}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 rounded-lg border border-white/12 px-5 font-black text-white transition hover:bg-white/10"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleRetire}
            className="min-h-12 rounded-lg border border-coral/60 bg-coral/20 px-5 font-black text-white transition hover:bg-coral hover:text-ink"
          >
            {t.retireCat}
          </button>
        </div>
      </section>
    </div>
  );
}
