import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import {RainbowKitProvider, getDefaultWallets, Chain} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const moonRiverChain: Chain = {
    id: 1285,
    name: 'Moonriver',
    network: 'moonriver',
    iconUrl: 'https://moonriver.moonscan.io/images/svg/brands/main.svg?v=22.7.1.0',
    iconBackground: '#fff',
    nativeCurrency: {
        decimals: 18,
        name: 'Moonriver',
        symbol: 'MOVR',
    },
    rpcUrls: {
        default: 'https://rpc.api.moonriver.moonbeam.network',
    },
    blockExplorers: {
        default: { name: 'MoonScan', url: 'https://moonriver.moonscan.io/' },
    },
    testnet: false,
};

const moonBaseChain: Chain = {
    id: 1287,
    name: 'Moonbase Alpha',
    network: 'moonbase',
    iconUrl: 'https://moonbase.moonscan.io/images/svg/brands/main.svg?v=22.7.1.0',
    iconBackground: '#fff',
    nativeCurrency: {
        decimals: 18,
        name: 'Dev token',
        symbol: 'DEV',
    },
    rpcUrls: {
        default: 'https://rpc.api.moonbase.moonbeam.network',
    },
    blockExplorers: {
        default: { name: 'MoonScan', url: 'https://moonbase.moonscan.io/' },
    },
    testnet: true,
};

const { chains, provider, webSocketProvider } = configureChains(
  [
    moonBaseChain,
    // chain.goerli,
    // moonRiverChain,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
      ? [moonBaseChain]
      : []),
  ],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      apiKey: '_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC',
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider showRecentTransactions={true} chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
