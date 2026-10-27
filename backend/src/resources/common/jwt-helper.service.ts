import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt'
import { JwtPayload } from 'jsonwebtoken'
import { UsersService } from '../users/users.service'

@Injectable()
export class JwtHelperService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async validateUserJwt<T extends JwtPayload>(token: string, audience: string) {
    try {
      const payload = this.jwtService.verify<T>(token, { audience })
      const userID = payload.sub
      if (!userID) throw new UnauthorizedException('Missing user ID in token')

      const user = await this.usersService.getOneWithCredentials(userID)
      if (!user) throw new UnauthorizedException('User not found')

      return { user, payload }
    } catch (error) {
      if (error instanceof TokenExpiredError) throw new UnauthorizedException('Token expired')
      if (error instanceof JsonWebTokenError) throw new UnauthorizedException('Invalid token')
      throw error
    }
  }
}
