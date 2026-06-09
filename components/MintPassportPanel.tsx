"use client";

import { ExternalLink, Sparkles, Wallet } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useAccount, useChainId, useConnect, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useCat } from "@/lib/catStore";
import { personalityCopy } from "@/lib/personality";
import { activeMantleChain, explorerTxUrl } from "@/lib/web3/chains";
import { internCatPassportAbi, internCatPassportAddress } from "@/lib/web3/passportContract";
import { buildPassportMetadata } from "@/lib/web3/passportMetadata";

const shortAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

export function MintPassportPanel() {
  const { t, locale, catName, level, xp, bond, personality, mood, specialty, history, completeSpecialTask } = useCat();
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const wrongNetwork = isConnected && chainId !== activeMantleChain.id;
  const injectedConnector = connectors[0];

  useEffect(() => {
    if (!isSuccess || !hash) return;
    completeSpecialTask(
      "mint-passport",
      100,
      locale === "en" ? "Cat Passport NFT minted on Mantle Sepolia. 100 bonus XP gained." : "Mantle Sepoliaで猫のPassport NFTをMintしました。ボーナス100 XPを獲得しました。",
    );
  }, [completeSpecialTask, hash, isSuccess, locale]);

  const { metadata, tokenUri } = useMemo(
    () =>
      buildPassportMetadata({
        locale,
        catName,
        level,
        xp,
        bond,
        personality,
        mood,
        specialty,
        history,
      }),
    [bond, catName, history, level, locale, mood, personality, specialty, xp],
  );

  const handleMint = () => {
    if (!address || !internCatPassportAddress) return;
    writeContract({
      address: internCatPassportAddress,
      abi: internCatPassportAbi,
      functionName: "mintPassport",
      args: [address, tokenUri],
      chainId: activeMantleChain.id,
    });
  };

  return (
    <section className="mt-4 rounded-lg border border-mint/35 bg-mint/10 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-mint">Mantle NFT Mint</p>
          <h2 className="mt-1 text-xl font-black text-white">{t.mintPassport}</h2>
        </div>
        <Sparkles className="text-mint" size={24} />
      </div>

      <div className="grid gap-2 text-sm">
        <p className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-white/68">
          {locale === "en" ? "Network" : "ネットワーク"}: <span className="font-black text-white">{activeMantleChain.name}</span>
        </p>
        <p className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-white/68">
          {locale === "en" ? "Wallet" : "ウォレット"}:{" "}
          <span className="font-black text-white">{address ? shortAddress(address) : locale === "en" ? "Not connected" : "未接続"}</span>
        </p>
        <p className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-white/68">
          {locale === "en" ? "Metadata" : "メタデータ"}:{" "}
          <span className="font-black text-white">
            {metadata.name} / Lv.{level} / {personalityCopy[locale][personality].label}
          </span>
        </p>
      </div>

      {!internCatPassportAddress ? (
        <p className="mt-3 rounded-lg border border-coral/35 bg-coral/10 p-3 text-sm leading-6 text-coral">
          {locale === "en"
            ? "Contract address is not set yet. Deploy InternCatPassport and set NEXT_PUBLIC_INTERN_CAT_PASSPORT_ADDRESS."
            : "コントラクトアドレスが未設定です。InternCatPassportをデプロイして NEXT_PUBLIC_INTERN_CAT_PASSPORT_ADDRESS に設定してください。"}
        </p>
      ) : null}

      {!isConnected ? (
        <button
          type="button"
          onClick={() => injectedConnector && connect({ connector: injectedConnector })}
          disabled={!injectedConnector || isConnecting}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-mint px-5 font-black text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Wallet size={18} />
          {isConnecting ? (locale === "en" ? "Connecting..." : "接続中...") : t.connectWallet}
        </button>
      ) : wrongNetwork ? (
        <button
          type="button"
          onClick={() => switchChain({ chainId: activeMantleChain.id })}
          disabled={isSwitching}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-coral/55 bg-coral/15 px-5 font-black text-white transition hover:bg-coral hover:text-ink disabled:opacity-60"
        >
          {isSwitching ? (locale === "en" ? "Switching..." : "切替中...") : locale === "en" ? "Switch to Mantle Sepolia" : "Mantle Sepoliaへ切替"}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleMint}
          disabled={!isConnected || !internCatPassportAddress || isPending || isConfirming}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-mint px-5 font-black text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Wallet size={18} />
          {isPending
            ? locale === "en"
              ? "Confirm in wallet..."
              : "ウォレットで確認中..."
            : isConfirming
              ? locale === "en"
                ? "Minting..."
                : "Mint中..."
              : t.mintPassport}
        </button>
      )}

      {isSuccess && hash ? (
        <a
          href={explorerTxUrl(hash)}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-mint/45 bg-ink/70 p-3 text-sm font-black text-mint transition hover:bg-white/10"
        >
          {locale === "en" ? "Mint success. View transaction" : "Mint成功。トランザクションを見る"}
          <ExternalLink size={16} />
        </a>
      ) : null}

      {error ? <p className="mt-3 rounded-lg border border-coral/35 bg-coral/10 p-3 text-sm text-coral">{error.message}</p> : null}
    </section>
  );
}
