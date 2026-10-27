import { MeDto } from '@/api/endpoints/api.schemas'
import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import useLocalStorageState from 'use-local-storage-state'

// Types
export interface StoredMeContextType {
  me: MeDto | null
  setMe: (me: MeDto) => void
  removeMe: () => void
}

// Constants
export const STORED_AUTH_ME_KEY = 'auth.me'
export const LOGGED_OUT_ME: MeDto = Object.freeze({
  user: null,
  campus: null,
  aluno: null,
  turma: null,
  curso: null
})

// Context
export const StoredMeContext = createContext<StoredMeContextType | null>(null)

// Custom hooks
export function useLocalStorageMe() {
  return useLocalStorageState<MeDto | null>(STORED_AUTH_ME_KEY, {
    defaultValue: null
  })
}

// Provider
export function StoredMeProvider({ children }: PropsWithChildren) {
  const [storedMe, setStoredMe, { removeItem: removeMe }] = useLocalStorageMe()

  const value = useMemo(
    () => ({
      me: storedMe,
      setMe: setStoredMe,
      removeMe
    }),
    [storedMe, setStoredMe, removeMe]
  )

  return <StoredMeContext.Provider value={value}>{children}</StoredMeContext.Provider>
}

// Hook
export function useStoredMe() {
  const context = useContext(StoredMeContext)
  if (!context) {
    throw new Error('useStoredMe must be used within a StoredMeProvider')
  }
  return context
}
