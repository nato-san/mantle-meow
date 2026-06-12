"use client";

import { http, createConfig } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { activeMantleChain, mantleMainnet, mantleSepolia } from "@/lib/web3/chains";

export const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
export const hasWalletConnectProjectId = Boolean(walletConnectProjectId);

export const wagmiConfig = createConfig({
  chains: [mantleSepolia, mantleMainnet],
  connectors: [
    injected(),
    ...(walletConnectProjectId
      ? [
          walletConnect({
            projectId: walletConnectProjectId,
            metadata: {
              name: "Mantle Meow",
              description: "Mantle-native AI research companion",
              url: "https://mantle-meow.vercel.app",
              icons: ["https://mantle-meow.vercel.app/assets/mantle-logo.png"],
            },
            showQrModal: true,
          }),
        ]
      : []),
  ],
  ssr: true,
  transports: {
    [mantleSepolia.id]: http(mantleSepolia.rpcUrls.default.http[0]),
    [mantleMainnet.id]: http(mantleMainnet.rpcUrls.default.http[0]),
  },
});

export const targetChainId = activeMantleChain.id;
