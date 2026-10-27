import { useBlocker as useTanstackBlocker } from '@tanstack/react-router'

export function useBlocker(condition: boolean) {
  return useTanstackBlocker({
    enableBeforeUnload: condition,
    shouldBlockFn: () => {
      if (!condition) return false
      const shouldLeave = confirm('Tem certeza que deseja sair? As alterações não salvas serão perdidas.')
      return !shouldLeave
    }
  })
}
