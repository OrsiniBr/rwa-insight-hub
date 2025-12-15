"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mantle, mantleTestnet, mantleSepoliaTestnet, base } from "viem/chains";

export default getDefaultConfig({
  appName: "Cross-Credit Lending",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [mantle, mantleTestnet, mantleSepoliaTestnet, base],
  ssr: false,
});
