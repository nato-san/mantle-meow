"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { WagmiProvider } from "wagmi";
import { CatProvider } from "@/lib/catStore";
import { wagmiConfig } from "@/lib/web3/config";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <CatProvider>{children}</CatProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
