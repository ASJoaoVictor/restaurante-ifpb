import { Injectable, NestMiddleware } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { plainToInstance } from 'class-transformer'
import { NextFunction, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { MyUser } from '../resources/users/entities/user.entity'
import { UsersService } from '../resources/users/users.service'

@Injectable()
export class AuthUserMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    req.authUser = await this.getAuthUser(req)
    next()
  }

  private async getAuthUser(req: Request): Promise<MyUser | null> {
    // const token = this.extractTokenFromHeader(req)
    const token = this.extractTokenFromCookies(req)
    const payload = await this.validateToken(token)
    if (!payload) return null
    const user = await this.validateUser(payload.sub!)
    if (!user) return null
    return plainToInstance(MyUser, user)
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    return request.cookies.authorization
  }

  private async validateToken(token?: string) {
    if (!token) return null

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, { audience: 'auth' })
      return payload
    } catch {
      return null
    }
  }

  private async validateUser(id: string): Promise<MyUser | null> {
    // TODO: cache
    const user = await this.usersService.getMyUser(id)
    return user
  }
}
