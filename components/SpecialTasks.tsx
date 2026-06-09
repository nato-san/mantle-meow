"use client";

import { CheckCircle2, ChevronDown, ExternalLink, Lock, Sparkles, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { useCat } from "@/lib/catStore";
import { specialTasks, type SpecialTask, type SpecialTaskId } from "@/lib/specialTasks";
import { activeMantleChain, explorerUrl, mEthTokenAddress } from "@/lib/web3/chains";

const asUsd = (value: number | null) =>
  value === null
    ? "-"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: value >= 1 ? 2 : 4,
      }).format(value);

export function SpecialTasks() {
  const router = useRouter();
  const { locale, level, completedSpecialTaskIds, completeSpecialTask } = useCat();
  const { address, isConnected } = useAccount();
  const [openLevelIds, setOpenLevelIds] = useState<number[]>([Math.min(Math.max(level, 1), 3)]);
  const [openTaskId, setOpenTaskId] = useState<SpecialTaskId | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [mntPriceUsd, setMntPriceUsd] = useState<number | null>(null);

  const { data: mntBalance } = useBalance({
    address,
    chainId: activeMantleChain.id,
    query: { enabled: Boolean(address) },
  });
  const { data: mEthBalance } = useReadContract({
    address: mEthTokenAddress,
    abi: [
      {
        type: "function",
        name: "balanceOf",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "balance", type: "uint256" }],
      },
    ],
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: activeMantleChain.id,
    query: { enabled: Boolean(address && mEthTokenAddress) },
  });

  useEffect(() => {
    let active = true;
    const loadPrice = async () => {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=mantle&vs_currencies=usd", { cache: "no-store" });
        const payload = (await response.json()) as { mantle?: { usd?: number } };
        if (active && typeof payload.mantle?.usd === "number") setMntPriceUsd(payload.mantle.usd);
      } catch {
        if (active) setMntPriceUsd(null);
      }
    };
    void loadPrice();
    return () => {
      active = false;
    };
  }, []);

  const mntAmount = useMemo(() => {
    if (!mntBalance) return null;
    return Number(formatUnits(mntBalance.value, mntBalance.decimals));
  }, [mntBalance]);
  const mntValueUsd = mntAmount !== null && mntPriceUsd !== null ? mntAmount * mntPriceUsd : null;
  const hasMeth = typeof mEthBalance === "bigint" ? mEthBalance > BigInt(0) : false;

  const complete = (task: SpecialTask) => {
    const text = task[locale];
    const note =
      locale === "en"
        ? `${text.title} cleared. ${task.xp} bonus XP gained.`
        : `${text.title}をクリアしました。ボーナス${task.xp} XPを獲得しました。`;
    const didComplete = completeSpecialTask(task.id, task.xp, note);
    setStatusMessage(
      didComplete
        ? locale === "en"
          ? "Task complete."
          : "タスク達成です。"
        : locale === "en"
          ? "This task is already complete."
          : "このタスクはクリア済みです。",
    );
  };

  const handleAction = async (task: SpecialTask) => {
    setStatusMessage("");
    if (completedSpecialTaskIds.includes(task.id)) return;

    if (task.action.type === "wallet-check") {
      if (!isConnected) {
        setStatusMessage(locale === "en" ? "Connect your wallet from the header first." : "先にヘッダーからウォレットを接続してください。");
        return;
      }
      complete(task);
      return;
    }

    if (task.action.type === "external") {
      const url = task.action.url === "explorer" ? explorerUrl : task.action.url;
      window.open(url, "_blank", "noreferrer");
      complete(task);
      return;
    }

    if (task.action.type === "balance-mnt") {
      if (!isConnected) {
        setStatusMessage(locale === "en" ? "Connect your wallet first." : "先にウォレットを接続してください。");
        return;
      }
      if (mntValueUsd === null) {
        setStatusMessage(locale === "en" ? "Price or balance is still loading. Try again in a moment." : "価格か残高を読み込み中です。少し待ってもう一度押してください。");
        return;
      }
      if (mntValueUsd < 1) {
        setStatusMessage(
          locale === "en"
            ? `Current MNT value is about ${asUsd(mntValueUsd)}. Reach $1 to clear.`
            : `現在のMNT価値は約${asUsd(mntValueUsd)}です。1ドル以上でクリアできます。`,
        );
        return;
      }
      complete(task);
      return;
    }

    if (task.action.type === "mint-link") {
      setStatusMessage(locale === "en" ? "Mint on the Passport page. This task clears automatically after mint success." : "PassportページでMintしてください。Mint成功後に自動でクリアされます。");
      router.push("/passport");
      return;
    }

    if (task.action.type === "balance-meth") {
      if (!isConnected) {
        setStatusMessage(locale === "en" ? "Connect your wallet first." : "先にウォレットを接続してください。");
        return;
      }
      if (!mEthTokenAddress) {
        setStatusMessage(
          locale === "en"
            ? "mETH token address is not configured yet. Add NEXT_PUBLIC_METH_TOKEN_ADDRESS when you are ready."
            : "mETHのトークンアドレスが未設定です。準備できたら NEXT_PUBLIC_METH_TOKEN_ADDRESS を追加してください。",
        );
        return;
      }
      if (!hasMeth) {
        setStatusMessage(locale === "en" ? "No mETH found in this wallet yet." : "このウォレットにはまだmETHが見つかりません。");
        return;
      }
      complete(task);
    }
  };

  const groupedTasks = [1, 2, 3].map((taskLevel) => ({
    level: taskLevel,
    tasks: specialTasks.filter((task) => task.level === taskLevel),
  }));

  const toggleLevel = (taskLevel: number) => {
    setOpenLevelIds((current) => (current.includes(taskLevel) ? current.filter((id) => id !== taskLevel) : [...current, taskLevel]));
  };

  return (
    <section className="neon-panel rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-mint">Special Tasks</p>
          <p className="mt-1 text-sm font-bold text-white/58">
            {locale === "en" ? "One-time on-chain steps that help your cat grow." : "1回だけ挑戦できる、オンチェーン成長タスクです。"}
          </p>
        </div>
        <Sparkles className="shrink-0 text-mint" size={22} />
      </div>

      <div className="grid gap-3">
        {groupedTasks.map((group) => (
          <div key={group.level} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
            <button type="button" onClick={() => toggleLevel(group.level)} className="flex w-full items-center justify-between gap-3 text-left">
              <span>
                <span className="block font-black text-white">Level {group.level}</span>
                <span className="mt-1 block text-xs font-black text-mint">+{group.tasks[0]?.xp ?? 0} XP / task</span>
              </span>
              <ChevronDown className={`shrink-0 text-white/45 transition ${openLevelIds.includes(group.level) ? "rotate-180" : ""}`} size={18} />
            </button>

            {openLevelIds.includes(group.level) ? (
            <div className="mt-3 grid gap-2">
              {group.tasks.map((task) => {
                const text = task[locale];
                const isLocked = level < task.level;
                const isDone = completedSpecialTaskIds.includes(task.id);
                const isOpen = openTaskId === task.id;

                return (
                  <div key={task.id} className="rounded-lg border border-mint/25 bg-ink/55">
                    <button
                      type="button"
                      onClick={() => setOpenTaskId(isOpen ? null : task.id)}
                      className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left"
                    >
                      <span>
                        <span className="block font-black text-white">{text.title}</span>
                        <span className="mt-1 block text-xs font-bold text-white/45">{text.description}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        {isDone ? <CheckCircle2 className="text-mint" size={18} /> : isLocked ? <Lock className="text-white/35" size={18} /> : null}
                        <ChevronDown className={`text-white/45 transition ${isOpen ? "rotate-180" : ""}`} size={18} />
                      </span>
                    </button>

                    {isOpen ? (
                      <div className="border-t border-white/10 px-3 pb-3 pt-2">
                        <button
                          type="button"
                          onClick={() => void handleAction(task)}
                          disabled={isLocked || isDone}
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-mint px-4 text-sm font-black text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-55"
                        >
                          {task.action.type === "external" ? <ExternalLink size={16} /> : <Wallet size={16} />}
                          {isDone ? (locale === "en" ? "Completed" : "クリア済み") : isLocked ? (locale === "en" ? "Locked" : "未解放") : text.button}
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            ) : null}
          </div>
        ))}
      </div>

      {statusMessage ? <p className="mt-3 rounded-lg border border-mint/30 bg-mint/10 p-3 text-sm font-bold text-white/72">{statusMessage}</p> : null}
    </section>
  );
}
