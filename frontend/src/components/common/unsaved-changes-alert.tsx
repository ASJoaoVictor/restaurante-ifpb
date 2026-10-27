import { useBlocker } from '@/hooks/use-blocker'
import { useIsMutating } from '@tanstack/react-query'

export function UnsavedChangesAlert() {
  const mutationCount = useIsMutating()
  useBlocker(mutationCount > 0)
  return null
}
