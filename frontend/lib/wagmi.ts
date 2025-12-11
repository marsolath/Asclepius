import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Asclepius",
  projectId: "asclepius-health-verification", // WalletConnect project ID placeholder
  chains: [sepolia],
  ssr: true,
});

