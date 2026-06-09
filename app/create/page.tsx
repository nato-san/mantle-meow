"use client";

import { Download, ImagePlus, Sparkles, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { CatPortrait } from "@/components/CatPortrait";
import { CatSpeech } from "@/components/CatSpeech";
import { OwnerBadge } from "@/components/OwnerBadge";
import { PageHeader } from "@/components/PageHeader";
import { useCat } from "@/lib/catStore";

export default function CreatePage() {
  const router = useRouter();
  const { t, locale, catName, setCatName, owner, setOwner, specialty, setSpecialty, setImageUrl, hasActiveCat, createCat } = useCat();
  const [showActiveCatModal, setShowActiveCatModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    if (hasActiveCat) {
      setShowActiveCatModal(true);
      return;
    }
    createCat();
    router.push("/my-cat");
  };

  const exportSaveData = () => {
    if (typeof window === "undefined") return;
    const payload = {
      app: "INTERN CAT",
      version: 1,
      exportedAt: new Date().toISOString(),
      activeCat: JSON.parse(window.localStorage.getItem("intern-cat-phase-1") ?? "null"),
      retiredCats: JSON.parse(window.localStorage.getItem("intern-cat-retired-cats") ?? "[]"),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `intern-cat-save-${date}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setSaveMessage(locale === "en" ? "Save data exported." : "セーブデータを書き出しました。");
  };

  const importSaveData = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result)) as { activeCat?: unknown; retiredCats?: unknown };
        if (!payload || !("activeCat" in payload) || !("retiredCats" in payload)) {
          throw new Error("Invalid save file");
        }

        window.localStorage.setItem("intern-cat-phase-1", JSON.stringify(payload.activeCat ?? null));
        window.localStorage.setItem("intern-cat-retired-cats", JSON.stringify(Array.isArray(payload.retiredCats) ? payload.retiredCats : []));
        setSaveMessage(locale === "en" ? "Save data imported. Reloading..." : "セーブデータを読み込みました。再読み込みします。");
        window.setTimeout(() => window.location.reload(), 500);
      } catch {
        setSaveMessage(locale === "en" ? "This file could not be imported." : "このファイルは読み込めませんでした。");
      }
    };
    reader.readAsText(file);
  };

  return (
    <AppShell>
      <PageHeader kicker={t.createKicker} title={t.createTitle} body={t.createBody} />

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="neon-panel rounded-lg p-5">
          <label className="cyber-card grid min-h-64 cursor-pointer place-items-center rounded-lg border border-mint/35 bg-mint/10 p-6 text-center transition hover:bg-mint/20">
            <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
            <span className="grid h-16 w-16 place-items-center rounded-lg bg-mint text-ink">
              <ImagePlus size={34} />
            </span>
            <span className="mt-4 text-2xl font-black uppercase text-white">{t.uploadPhoto}</span>
            <span className="mt-2 text-sm font-bold text-white/55">{t.selectPhoto}</span>
          </label>

          <div className="mt-5 grid gap-4">
            <label>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-white/45">{t.catNameLabel}</span>
              <input
                value={catName}
                onChange={(event) => setCatName(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-white outline-none transition focus:border-mint"
              />
            </label>
            <label>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-white/45">{t.ownerLabel}</span>
              <input
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-white outline-none transition focus:border-mint"
              />
            </label>
            <label>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-white/45">{t.specialtyLabel}</span>
              <input
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-white outline-none transition focus:border-mint"
              />
            </label>
          </div>

          <section className="mt-5 rounded-lg border border-mint/30 bg-mint/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-mint">Save Data</p>
            <p className="mt-2 text-sm leading-6 text-white/58">
              {locale === "en"
                ? "Back up your active cat, retired cats, items, XP, and memories as a JSON file."
                : "今いる猫、引退猫、アイテム、XP、記憶をJSONファイルとしてバックアップできます。"}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={exportSaveData}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-mint/45 px-4 font-black text-white transition hover:bg-mint hover:text-ink"
              >
                <Download size={17} />
                Export Save Data
              </button>
              <button
                type="button"
                onClick={() => importInputRef.current?.click()}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/12 px-4 font-black text-white transition hover:bg-white/10"
              >
                <Upload size={17} />
                Import Save Data
              </button>
            </div>
            <input ref={importInputRef} type="file" accept="application/json,.json" className="sr-only" onChange={importSaveData} />
            {saveMessage ? <p className="mt-3 rounded-lg border border-white/10 bg-ink/70 p-3 text-sm font-bold text-white/68">{saveMessage}</p> : null}
          </section>
        </div>

        <div className="neon-panel relative overflow-hidden rounded-lg p-5">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(116,247,199,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(116,247,199,0.05)_1px,transparent_1px)] bg-[size:34px_34px]" />
          <div className="relative z-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-mint">{t.catPreview}</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_0.9fr] sm:items-center">
              <CatPortrait variant="front" className="mx-auto h-80 w-full max-w-sm" showAccessories={false} />
              <div className="rounded-lg border border-white/10 bg-ink/70 p-5">
                <OwnerBadge />
                <p className="mt-5 text-4xl font-black text-white">{catName}</p>
                <p className="mt-2 text-lg font-bold text-mint">{specialty}</p>
                <p className="mt-5 text-sm leading-7 text-white/65">{t.noCatHint}</p>
                <div className="mt-5">
                  <CatSpeech name={catName} text={t.catSaysCreate} showAvatar={false} />
                </div>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-mint px-5 font-black text-ink transition hover:bg-white"
                >
                  <Sparkles size={19} />
                  {t.createCatButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showActiveCatModal ? (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-ink/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true">
          <section className="neon-panel w-full max-w-md rounded-lg p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">INTERN CAT</p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-white">{t.activeCatExistsTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-white/68">{t.activeCatExistsBody}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setShowActiveCatModal(false)}
                className="min-h-12 rounded-lg border border-white/12 px-5 font-black text-white transition hover:bg-white/10"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => router.push("/my-cat")}
                className="min-h-12 rounded-lg bg-mint px-5 font-black text-ink transition hover:bg-white"
              >
                {t.goToMyCat}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </AppShell>
  );
}
