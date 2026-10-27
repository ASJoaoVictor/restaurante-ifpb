import '@fontsource-variable/dm-sans/wght-italic.css'
import '@fontsource-variable/dm-sans/wght.css'
import './styles/global.css'
import './styles/nprogress.css'

import './config/dayjs'

import { Provider as ChakraProvider } from '@/components/ui/provider'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { setUseWhatChange } from '@simbathesailor/use-what-changed'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ModalProvider } from 'react-modal-hook'
import { reportError } from './components/error/report-error'
import { Toaster } from './components/ui/toaster'
import { ToasterTop } from './components/ui/toaster-top'
import { router } from './config/router'
import { LOGGED_OUT_ME, StoredMeProvider, useStoredMe } from './contexts/stored-me'

// Automatically report unhandled errors and promise rejections
window.addEventListener('error', (e) => reportError(e.error, 'unhandled-browser-error'))
window.addEventListener('unhandledrejection', (e) => reportError(e.reason, 'unhandled-browser-error'))

// Enable useWhatChanged (React Hooks debugger) in development
setUseWhatChange(import.meta.env.DEV)

// Create a QueryClient instance for React Query
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <StoredMeProvider>
        <ChakraProvider defaultTheme="light" forcedTheme="light">
          <ModalProvider>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <InnerApp />
              <Toaster />
              <ToasterTop />
            </GoogleOAuthProvider>
          </ModalProvider>
        </ChakraProvider>
      </StoredMeProvider>
    </QueryClientProvider>
  </StrictMode>
)

function InnerApp() {
  const storedMe = useStoredMe()
  const me = storedMe.me || LOGGED_OUT_ME
  return <RouterProvider router={router} context={{ me }} />
}
