import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { User } from '../users/entities/user.entity'
import { UserRole } from '../../drizzle/enums'

@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublicHandler = this.reflector.get<boolean>('isPublic', context.getHandler())
    const isPublicClass = this.reflector.get<boolean>('isPublic', context.getClass())
    if (isPublicHandler || isPublicClass) return true
    
    const handlerRoles = this.reflector.get<UserRole[]>('roles', context.getHandler()) ?? []
    const classRoles = this.reflector.get<UserRole[]>('roles', context.getClass()) ?? []
    const roles = [...handlerRoles, ...classRoles]
    const request = context.switchToHttp().getRequest()
    const user: User = request.authUser
    return this.matchRoles(roles, user.roles)
  }

  matchRoles(roles: UserRole[], userRoles: UserRole[]) {
    return roles.some((role) => userRoles.includes(role))
  }
}
