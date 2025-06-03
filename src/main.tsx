import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from "@/components/ui/provider"

createRoot(document.getElementById('root')!).render(
  <Provider>
    <App />
  </Provider>
)
