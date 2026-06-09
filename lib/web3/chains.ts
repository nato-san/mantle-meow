import { defineChain } from "viem";

export const mantleSepolia = defineChain({
  id: 5003,
  name: "Mantle Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "MNT",
    symbol: "MNT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.sepolia.mantle.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Mantle Sepolia Explorer",
      url: "https://explorer.sepolia.mantle.xyz",
    },
  },
  testnet: true,
});

export const mantleMainnet = defineChain({
  id: 5000,
  name: "Mantle",
  nativeCurrency: {
    decimals: 18,
    name: "MNT",
    symbol: "MNT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.mantle.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Mantle Explorer",
      url: "https://explorer.mantle.xyz",
    },
  },
});

export const activeMantleChain = process.env.NEXT_PUBLIC_MANTLE_CHAIN === "mainnet" ? mantleMainnet : mantleSepolia;

export const explorerUrl = activeMantleChain.blockExplorers.default.url;

export const explorerTxUrl = (hash: string) => `${activeMantleChain.blockExplorers.default.url}/tx/${hash}`;

export const mEthTokenAddress = process.env.NEXT_PUBLIC_METH_TOKEN_ADDRESS?.startsWith("0x")
  ? (process.env.NEXT_PUBLIC_METH_TOKEN_ADDRESS as `0x${string}`)
  : undefined;
