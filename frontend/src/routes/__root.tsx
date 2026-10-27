import { NotFound } from '@/components/layout/notfound'
import { Setup } from '@/components/setup'
import { RouteContextType } from '@/config/router'
import { AuthProvider } from '@/contexts/auth'
import { HeadContent, Outlet, createRootRouteWithContext } from '@tanstack/react-router'

export const Route = createRootRouteWithContext<RouteContextType>()({
  component: RootComponent,
  notFoundComponent: () => <NotFound />
})

function RootComponent() {
  return (
    <AuthProvider>
      <HeadContent />
      <Outlet />
      <Setup />
      {/* FIXME: Desativado por causa que estava impedindo sair da tela de login */}
      {/* <UnsavedChangesAlert /> */}
    </AuthProvider>
  )
}
