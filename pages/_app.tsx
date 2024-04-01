import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { type Chain } from 'viem'
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { createConfig } from 'wagmi';
import {
  mainnet,
  goerli,
  bsc,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  zkSync,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  phantomWallet,
} from '@rainbow-me/rainbowkit/wallets';


const connectors = connectorsForWallets(
  [
    {
      groupName: 'Suggested',
      wallets: [
        rainbowWallet,
        phantomWallet,
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
      ],
    },
  ],
  { appName: 'RainbowKit App', projectId: 'YOUR_PROJECT_ID' },
);


export const coreDao = {
  id: 1116,
  name: 'CORE',
  nativeCurrency: { name: 'CORE', symbol: 'CORE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.coredao.org/'] },
  },
  blockExplorers: {
    default: { name: 'scancoredao', url: 'https://scan.coredao.org' },
  },
  
} as const satisfies Chain


const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, goerli, bsc, polygon,coreDao, optimism, arbitrum, base, zora,zkSync],
  ssr: true, // If your dApp uses server side rendering (SSR)
}); 




const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {/* Your App */}
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
