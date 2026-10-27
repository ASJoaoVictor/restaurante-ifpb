import { UserRolesItem } from '@/api/endpoints/api.schemas'
import { RouteContextType } from '@/config/router'
import { redirect } from '@tanstack/router-core'

export function checkLogin(context: RouteContextType) {
  if (!context.me.user) throw redirect({ to: '/login', replace: true })
}

export function checkLogout(context: RouteContextType) {
  if (context.me.user) throw redirect({ to: '/', replace: true })
}

export function checkRole(context: RouteContextType, allowedRoles: UserRolesItem[]) {
  checkLogin(context)

  const isAllowed = allowedRoles.some((allowedRole) => {
    return context.me.user?.roles.includes(allowedRole)
  })

  if (!isAllowed) throw redirect({ to: '/403', replace: true })
}
