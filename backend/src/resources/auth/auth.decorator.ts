import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator'
import { ForbiddenException, SetMetadata, UnauthorizedException, UseGuards, applyDecorators } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { UserRole } from '../../drizzle/enums'
import { AuthRoleGuard } from './auth-role.guard'
import { AuthGuard } from './auth.guard'

export function Auth() {
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiException(() => UnauthorizedException)
  )
}

export function AuthRoles(...roles: UserRole[]) {
  return applyDecorators(
    Auth(),
    SetMetadata('roles', roles),
    UseGuards(AuthRoleGuard),
    ApiException(() => ForbiddenException)
  )
}

export function Public() {
  return applyDecorators(SetMetadata('isPublic', true), SetMetadata('swagger/apiSecurity', ['public']))
}
