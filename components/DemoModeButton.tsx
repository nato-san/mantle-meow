"use client";

import { MonitorPlay, RotateCcw } from "lucide-react";
import { useCat } from "@/lib/catStore";

export function DemoModeButton() {
  const { demoMode, enableDemoMode, disableDemoMode } = useCat();

  return (
    <button
      type="button"
      onClick={demoMode ? disableDemoMode : enableDemoMode}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-black transition ${
        demoMode
          ? "border-coral/55 bg-coral/15 text-coral hover:bg-coral hover:text-ink"
          : "border-lilac/45 bg-lilac/10 text-lilac hover:bg-lilac hover:text-ink"
      }`}
      title={demoMode ? "Demo Modeを終了して元のデータに戻す" : "Demo Modeで審査用データを読み込む"}
    >
      {demoMode ? <RotateCcw className="h-4 w-4" /> : <MonitorPlay className="h-4 w-4" />}
      {demoMode ? "DEMO ON" : "DEMO"}
    </button>
  );
}
