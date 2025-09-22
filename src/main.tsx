import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css"
import AppRoutes from './routes/AppRoutes.tsx'
import { ToastProvider } from './components/common/ToastContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  </StrictMode>,
)
