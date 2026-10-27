import { DialogOpenChangeDetails } from '@chakra-ui/react'
import { useLocation, useNavigate, useRouter } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'

export function useBackButtonClosableModal(id: string, initialState: boolean = false) {
  const [open, setOpen] = useState(initialState)
  const navigate = useNavigate()
  const location = useLocation()
  const router = useRouter()

  const onOpenChange = useCallback(
    (details: DialogOpenChangeDetails) => {
      if (details.open) {
        void navigate({ state: { ...location.state, [`modal.${id}`]: true } })
      } else if (location.state[`modal.${id}`]) {
        router.history.back()
      }
      setOpen(details.open)
    },
    [id, location.state, navigate, router.history]
  )

  const setOpenState = useCallback(
    (state: boolean) => {
      onOpenChange({ open: state })
    },
    [onOpenChange]
  )

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      setOpen(!!event.state[`modal.${id}`])
    }

    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
    }
  }, [id])

  return { open, onOpenChange, setOpen: setOpenState }
}
