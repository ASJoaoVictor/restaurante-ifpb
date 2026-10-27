import { MeDto } from '@/api/endpoints/api.schemas'
import { getAuthMeQueryKey, useAuthMe } from '@/api/endpoints/authentication'
import { assert } from '@/components/error/assertion-error'
import { toaster } from '@/components/ui/toaster'
import { QueryObserverBaseResult } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { createContext, PropsWithChildren, useContext, useEffect, useMemo } from 'react'
import { LOGGED_OUT_ME, useLocalStorageMe } from './stored-me'

// Types
export interface AuthContextType {
  me: MeDto
  removeStoredMe: () => void
  refresh: QueryObserverBaseResult['refetch']
}

// Context
export const AuthContext = createContext<AuthContextType | null>(null)

// Custom hooks
function useAuthData() {
  return useAuthMe({
    query: {
      queryKey: getAuthMeQueryKey(),
      refetchOnWindowFocus: false
    }
  })
}

function useSessionExpiration(data: MeDto | undefined, storedMe: MeDto | null) {
  const router = useRouter()

  useEffect(() => {
    if (!storedMe || !data || data.user) return // If data is undefined, data is loading

    setTimeout(() => {
      void router.invalidate()
      toaster.error({
        id: 'expired-login',
        title: 'Login expirado',
        description: 'Por favor, faça login novamente.'
      })
    })
  }, [data, router, storedMe])
}

function useMeSynchronization(data: MeDto | undefined, setStoredMe: (me: MeDto) => void, removeStoredMe: () => void) {
  const router = useRouter()

  useEffect(() => {
    if (!data) return // If data is undefined, data is loading

    if (data.user === null) {
      // Logged out user
      removeStoredMe()
      void router.invalidate()
    } else {
      setStoredMe(data)
    }
  }, [data, removeStoredMe, router, setStoredMe])
}

// Provider
export function AuthProvider({ children }: PropsWithChildren) {
  const { data, refetch } = useAuthData()
  const [storedMe, setStoredMe, { removeItem: removeStoredMe }] = useLocalStorageMe()

  const me = data || storedMe || LOGGED_OUT_ME

  assert(me, 'Variável "me" não deve ser nula')

  useSessionExpiration(data, storedMe)
  useMeSynchronization(data, setStoredMe, removeStoredMe)

  const value = useMemo(() => ({ me, removeStoredMe, refresh: refetch }), [me, removeStoredMe, refetch])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
