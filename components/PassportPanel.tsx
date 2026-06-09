import { BadgeCheck, Clock, Network } from "lucide-react";

type PassportPanelProps = {
  title: string;
  historyLabel: string;
  emptyHistory: string;
  architecture: string;
  mantleWallet: string;
  nansenApi: string;
  nameLabel: string;
  levelLabel: string;
  specialtyLabel: string;
  xpLabel: string;
  catName: string;
  level: number;
  specialty: string;
  totalXp: number;
  history: string[];
};

export function PassportPanel({
  title,
  historyLabel,
  emptyHistory,
  architecture,
  mantleWallet,
  nansenApi,
  nameLabel,
  levelLabel,
  specialtyLabel,
  xpLabel,
  catName,
  level,
  specialty,
  totalXp,
  history,
}: PassportPanelProps) {
  return (
    <section className="glass rounded-lg p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-white">{title}</h2>
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-mint/15 text-mint">
          <BadgeCheck size={20} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-white/[0.04] p-3">
          <p className="text-white/42">{nameLabel}</p>
          <p className="mt-1 font-bold text-white">{catName}</p>
        </div>
        <div className="rounded-lg bg-white/[0.04] p-3">
          <p className="text-white/42">{levelLabel}</p>
          <p className="mt-1 font-bold text-white">{level}</p>
        </div>
        <div className="rounded-lg bg-white/[0.04] p-3">
          <p className="text-white/42">{specialtyLabel}</p>
          <p className="mt-1 font-bold text-white">{specialty}</p>
        </div>
        <div className="rounded-lg bg-white/[0.04] p-3">
          <p className="text-white/42">{xpLabel}</p>
          <p className="mt-1 font-bold text-white">{totalXp}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center gap-2 text-white/75">
          <Clock size={16} />
          <h3 className="font-bold">{historyLabel}</h3>
        </div>
        <div className="space-y-2">
          {history.length === 0 ? (
            <p className="rounded-lg border border-white/10 p-3 text-sm text-white/52">{emptyHistory}</p>
          ) : (
            history.slice(0, 5).map((item, index) => (
              <p key={`${item}-${index}`} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-white/68">
                {item}
              </p>
            ))
          )}
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-3 flex items-center gap-2 text-lilac">
          <Network size={17} />
          <h3 className="font-bold text-white">{architecture}</h3>
        </div>
        <p className="text-sm leading-6 text-white/60">{mantleWallet}</p>
        <p className="mt-2 text-sm leading-6 text-white/60">{nansenApi}</p>
      </div>
    </section>
  );
}
