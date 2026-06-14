"use client";

import { CheckCircle2, Download, ImagePlus, Sparkles, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { CatPortrait } from "@/components/CatPortrait";
import { CatSpeech } from "@/components/CatSpeech";
import { OwnerBadge } from "@/components/OwnerBadge";
import { useCat } from "@/lib/catStore";

export default function CreatePage() {
  const router = useRouter();
  const { t, locale, catName, setCatName, owner, setOwner, specialty, setSpecialty, imageUrl, setImageUrl, hasActiveCat, createCat } = useCat();
  const [showActiveCatModal, setShowActiveCatModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const mobileImportInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
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
    setCreateSuccess(true);
    window.setTimeout(() => router.push("/my-cat"), 650);
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
      <header className="mb-4 lg:mb-3">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-coral">{t.createKicker}</p>
        <h1 className="hero-title mt-2 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-4xl">{t.createTitle}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68 sm:text-base lg:mt-2 lg:text-sm lg:leading-6">{t.createBody}</p>
      </header>

      <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
        <div className="neon-panel rounded-lg p-5 lg:h-full lg:p-4">
          <label className="cyber-card grid min-h-32 cursor-pointer place-items-center rounded-lg border border-mint/35 bg-mint/10 p-4 text-left transition hover:bg-mint/20 lg:min-h-32 lg:p-4">
            <input type="file" accept="image/*" className="sr-only" onChange={handleFile} />
            <span className="flex w-full items-center gap-4">
              <span className="grid h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-mint text-ink lg:h-11 lg:w-11">
                {imageUrl ? (
                  <img src={imageUrl} alt={owner} className="h-full w-full object-cover" />
                ) : (
                  <span className="grid h-full w-full place-items-center">
                    <ImagePlus className="h-8 w-8 lg:h-6 lg:w-6" />
                  </span>
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-xl font-black uppercase text-white lg:text-xl">{t.uploadPhoto}</span>
                <span className="mt-2 block text-sm font-bold text-white/55 lg:mt-1">{t.selectPhoto}</span>
                {imageUrl ? (
                  <span className="mt-3 flex min-w-0 items-center gap-2 rounded-lg border border-mint/35 bg-ink/65 px-3 py-2 text-xs font-black text-mint">
                    <CheckCircle2 size={15} className="shrink-0" />
                    <span className="shrink-0">{locale === "en" ? "Image uploaded" : "画像アップロード完了"}</span>
                    {uploadedFileName ? <span className="truncate text-white/55">{uploadedFileName}</span> : null}
                  </span>
                ) : null}
              </span>
            </span>
          </label>

          <div className="mt-5 grid gap-4 lg:mt-4 lg:gap-3">
            <label>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-white/45">{t.catNameLabel}</span>
              <input
                value={catName}
                onChange={(event) => setCatName(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-white outline-none transition focus:border-mint lg:min-h-10"
              />
            </label>
            <label>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-white/45">{t.ownerLabel}</span>
              <input
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-white outline-none transition focus:border-mint lg:min-h-10"
              />
            </label>
            <label>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-white/45">{t.specialtyLabel}</span>
              <input
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
                className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-white outline-none transition focus:border-mint lg:min-h-10"
              />
            </label>
          </div>

          <section className="mt-5 hidden rounded-lg border border-mint/30 bg-mint/10 p-4 lg:mt-4 lg:block lg:p-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-mint">Save Data</p>
            <p className="mt-2 text-sm leading-6 text-white/58 lg:hidden">
              {locale === "en"
                ? "Back up your active cat, retired cats, items, XP, and memories as a JSON file."
                : "今いる猫、引退猫、アイテム、XP、記憶をJSONファイルとしてバックアップできます。"}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={exportSaveData}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-mint/45 px-4 font-black text-white transition hover:bg-mint hover:text-ink lg:min-h-10"
              >
                <Download size={17} />
                Export Save Data
              </button>
              <button
                type="button"
                onClick={() => importInputRef.current?.click()}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/12 px-4 font-black text-white transition hover:bg-white/10 lg:min-h-10"
              >
                <Upload size={17} />
                Import Save Data
              </button>
            </div>
            <input ref={importInputRef} type="file" accept="application/json,.json" className="sr-only" onChange={importSaveData} />
            {saveMessage ? <p className="mt-3 rounded-lg border border-white/10 bg-ink/70 p-3 text-sm font-bold text-white/68">{saveMessage}</p> : null}
          </section>
        </div>

        <div className="neon-panel relative overflow-hidden rounded-lg p-5 lg:h-full lg:p-4">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(116,247,199,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(116,247,199,0.05)_1px,transparent_1px)] bg-[size:34px_34px]" />
          <div className="relative z-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-mint">{t.catPreview}</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_0.9fr] sm:items-center lg:mt-3 lg:gap-4">
              <div className="grid gap-4">
                <CatSpeech name={catName} text={t.catSaysCreate} showAvatar={false} />
                <CatPortrait variant="front" className="mx-auto h-80 w-full max-w-sm sm:h-96 sm:max-w-md lg:h-72 lg:max-w-sm xl:h-80 xl:max-w-md" showAccessories={false} />
              </div>
              <div className="rounded-lg border border-white/10 bg-ink/70 p-5 lg:p-4">
                <OwnerBadge />
                <p className="mt-5 text-4xl font-black text-white lg:mt-4 lg:text-3xl">{catName}</p>
                <p className="mt-2 text-lg font-bold text-mint">{specialty}</p>
                <p className="mt-5 text-sm leading-7 text-white/65 lg:mt-3 lg:leading-6">{t.noCatHint}</p>
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={createSuccess}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-mint px-5 font-black text-ink transition hover:bg-white disabled:cursor-wait disabled:bg-white lg:mt-4"
                >
                  {createSuccess ? <CheckCircle2 size={19} /> : <Sparkles size={19} />}
                  {createSuccess ? (locale === "en" ? "Your Intern Cat has been created" : "Intern Catを作成しました") : t.createCatButton}
                </button>
                {createSuccess ? (
                  <p className="mt-3 rounded-lg border border-mint/35 bg-mint/10 p-3 text-sm font-bold text-mint">
                    {locale === "en" ? "Moving to My Cat..." : "My Catへ移動します..."}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-mint/30 bg-mint/10 p-4 lg:hidden">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-mint">Save Data</p>
        <p className="mt-2 text-sm leading-6 text-white/58">
          {locale === "en"
            ? "Back up your active cat, retired cats, items, XP, and memories as a JSON file."
            : "今いる猫、引退猫、アイテム、XP、記憶をJSONファイルとしてバックアップできます。"}
        </p>
        <div className="mt-3 grid gap-2">
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
            onClick={() => mobileImportInputRef.current?.click()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/12 px-4 font-black text-white transition hover:bg-white/10"
          >
            <Upload size={17} />
            Import Save Data
          </button>
        </div>
        <input ref={mobileImportInputRef} type="file" accept="application/json,.json" className="sr-only" onChange={importSaveData} />
        {saveMessage ? <p className="mt-3 rounded-lg border border-white/10 bg-ink/70 p-3 text-sm font-bold text-white/68">{saveMessage}</p> : null}
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
