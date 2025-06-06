import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from "@/components/ui/provider"
import { SolanaProvider } from './provider/SolanaProvider.tsx'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  polygon,
  polygonAmoy
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'Bridge-Fe',
  projectId: '809c21f7485230c40994531fdd5957cc',
  chains: [polygon, polygonAmoy],
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <SolanaProvider>
          <Provider>
            <App />
          </Provider>
        </SolanaProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
)
