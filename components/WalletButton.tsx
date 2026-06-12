"use client";

import { Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { useCat } from "@/lib/catStore";
import { activeMantleChain } from "@/lib/web3/chains";
import { hasWalletConnectProjectId } from "@/lib/web3/config";
import { hasInjectedWalletProvider, isMobileBrowser, selectWalletConnector } from "@/lib/web3/selectConnector";

const shortAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

export function WalletButton() {
  const { t, locale } = useCat();
  const { address, chainId, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const wrongNetwork = isConnected && chainId !== activeMantleChain.id;
  const connector = selectWalletConnector(connectors);
  const needsMobileWalletConnect = isMobileBrowser() && !hasWalletConnectProjectId && !hasInjectedWalletProvider();

  if (!isConnected) {
    return (
      <button
        type="button"
        onClick={() => connector && !needsMobileWalletConnect && connect({ connector })}
        disabled={!connector || isPending || needsMobileWalletConnect}
        title={
          needsMobileWalletConnect
            ? locale === "en"
              ? "Mobile wallet connection requires WalletConnect setup."
              : "スマホのウォレット接続にはWalletConnect設定が必要です。"
            : undefined
        }
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-mint/55 bg-mint/10 px-4 text-sm font-black text-white transition hover:bg-mint hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Wallet size={17} />
        {needsMobileWalletConnect
          ? locale === "en"
            ? "Wallet setup"
            : "接続設定"
          : isPending
            ? locale === "en"
              ? "Connecting..."
              : "接続中..."
            : t.connectWallet}
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
