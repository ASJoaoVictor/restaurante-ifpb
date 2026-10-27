import { MeDto } from '@/api/endpoints/api.schemas'
import { PageError } from '@/components/error/page-error'
import { LOGGED_OUT_ME } from '@/contexts/stored-me'
import { createRouter } from '@tanstack/react-router'
import nProgress from 'nprogress'
import { routeTree } from '../utils/router'

export const router = createRouter({
  routeTree,
  defaultErrorComponent: import.meta.env.DEV ? undefined : PageError,
  context: { me: LOGGED_OUT_ME }
})

// NProgress
router.subscribe('onBeforeLoad', ({ pathChanged }) => pathChanged && nProgress.start())
router.subscribe('onLoad', () => nProgress.done())

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }

  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  interface HistoryState {
    [key: `modal.${string}`]: boolean
  }
}

export interface RouteContextType {
  me: MeDto
}
