"use client";

import { Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { useCat } from "@/lib/catStore";
import { activeMantleChain } from "@/lib/web3/chains";

const shortAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

export function WalletButton() {
  const { t, locale } = useCat();
  const { address, chainId, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const wrongNetwork = isConnected && chainId !== activeMantleChain.id;
  const injectedConnector = connectors[0];

  if (!isConnected) {
    return (
      <button
        type="button"
        onClick={() => injectedConnector && connect({ connector: injectedConnector })}
        disabled={!injectedConnector || isPending}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-mint/55 bg-mint/10 px-4 text-sm font-black text-white transition hover:bg-mint hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Wallet size={17} />
        {isPending ? (locale === "en" ? "Connecting..." : "接続中...") : t.connectWallet}
      </button>
    );
  }

  if (wrongNetwork) {
    return (
      <button
        type="button"
        onClick={() => switchChain({ chainId: activeMantleChain.id })}
        disabled={isSwitching}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-coral/60 bg-coral/15 px-4 text-sm font-black text-white transition hover:bg-coral hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSwitching ? (locale === "en" ? "Switching..." : "切替中...") : locale === "en" ? "Switch to Mantle Sepolia" : "Mantle Sepoliaへ切替"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => disconnect()}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-mint/45 bg-mint/10 px-4 text-sm font-black text-white transition hover:bg-white/10"
      title={locale === "en" ? "Disconnect wallet" : "ウォレット接続を解除"}
    >
      <Wallet size={17} />
      {address ? shortAddress(address) : t.connectWallet}
    </button>
  );
}
