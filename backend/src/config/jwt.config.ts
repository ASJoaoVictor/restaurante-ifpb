import { JwtModuleOptions } from '@nestjs/jwt'
import { env } from './env.config'

export const jwtConstants = {
  secret: env.JWT_SECRET || Math.random().toString()
}

export const jwtOptions: JwtModuleOptions = {
  global: true,
  secret: jwtConstants.secret,
  signOptions: { expiresIn: '0' } // Requires explicit expiration time
}
