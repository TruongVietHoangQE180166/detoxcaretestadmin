import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css"
import AppRoutes from './routes/AppRoutes.tsx'
import { ToastProvider } from './components/common/ToastContext.tsx'
import { useUserStore } from './store/userStore.ts'

// Initialize user store with data from sessionStorage
const initializeAuth = () => {
  const accessToken = sessionStorage.getItem("accessToken");
  const userId = sessionStorage.getItem("userId");
  const userName = sessionStorage.getItem("userName");  // This is stored as username from the API
  const email = sessionStorage.getItem("email");
  const role = sessionStorage.getItem("role");

  // Only initialize if we have all required data
  if (accessToken && userId && userName && email && role) {
    useUserStore.getState().setUser({
      userId,
      username: userName,  // Using the stored userName value
      email,
      role,
      status: "", // Will be fetched when needed
      accessToken,
    });
  }
};

const Main = () => {
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)