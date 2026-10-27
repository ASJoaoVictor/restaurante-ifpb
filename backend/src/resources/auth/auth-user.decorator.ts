import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

/** Returns the currently logged in user */
export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest()
  return request.authUser!
})

/** Returns the campus of the currently logged in user */
export const Campus = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest()
  return request.campus!
})
