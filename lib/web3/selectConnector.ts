"use client";

import type { Connector } from "wagmi";

export const isMobileBrowser = () => {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
};

export const hasInjectedWalletProvider = () => {
  if (typeof window === "undefined") return false;
  return Boolean((window as Window & { ethereum?: unknown }).ethereum);
};

export const selectWalletConnector = (connectors: readonly Connector[]) => {
  const walletConnectConnector = connectors.find((connector) => connector.name.toLowerCase().includes("walletconnect"));
  const injectedConnector = connectors.find((connector) => connector.name.toLowerCase().includes("injected")) ?? connectors[0];

  if (isMobileBrowser() && walletConnectConnector) return walletConnectConnector;
  return injectedConnector ?? walletConnectConnector;
};
