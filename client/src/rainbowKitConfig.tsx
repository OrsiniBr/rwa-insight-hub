"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {mantleSepoliaTestnet, base } from "viem/chains";

export default getDefaultConfig({
  appName: "Cross-Credit Lending",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [mantleSepoliaTestnet, base],
  ssr: false,
});
