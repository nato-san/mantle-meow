import type { Locale } from "@/lib/i18n";

type LanguageToggleProps = {
  locale: Locale;
  onChange: (locale: Locale) => void;
};

export function LanguageToggle({ locale, onChange }: LanguageToggleProps) {
  return (
    <div className="glass flex items-center gap-1 rounded-lg p-1" aria-label="English ↔ 日本語">
      {(["en", "ja"] as Locale[]).map((item) => (
        <div key={item} className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(item)}
          className={`min-h-9 rounded-md px-3 text-sm font-semibold transition ${
            locale === item ? "bg-white text-ink" : "text-white/65 hover:text-white"
          }`}
        >
          {item === "en" ? "English" : "日本語"}
        </button>
        {item === "en" ? <span className="text-white/35">↔</span> : null}
        </div>
      ))}
    </div>
  );
}
