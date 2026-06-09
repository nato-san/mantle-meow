import type { LucideIcon } from "lucide-react";

type StatPillProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function StatPill({ icon: Icon, label, value }: StatPillProps) {
  return (
    <div className="glass flex min-h-[62px] items-center gap-3 rounded-lg px-3 py-2">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-mint/15 text-mint">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.18em] text-white/45">{label}</p>
        <p className="truncate text-lg font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
