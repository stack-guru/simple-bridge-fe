import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from "@/components/ui/provider"
import { SolanaProvider } from './provider/SolanaProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <SolanaProvider>
    <Provider>
      <App />
    </Provider>
  </SolanaProvider>
)
