"use client";

import { http, createConfig } from "wagmi";
import { injected } from "@wagmi/core";
import { activeMantleChain, mantleMainnet, mantleSepolia } from "@/lib/web3/chains";

export const wagmiConfig = createConfig({
  chains: [mantleSepolia, mantleMainnet],
  connectors: [injected()],
  ssr: true,
  transports: {
    [mantleSepolia.id]: http(mantleSepolia.rpcUrls.default.http[0]),
    [mantleMainnet.id]: http(mantleMainnet.rpcUrls.default.http[0]),
  },
});

export const targetChainId = activeMantleChain.id;
