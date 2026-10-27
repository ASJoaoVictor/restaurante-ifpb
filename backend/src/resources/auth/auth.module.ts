import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { jwtOptions } from '../../config/jwt.config'
import { DrizzleModule } from '../../drizzle/drizzle.module'
import { CampiModule } from '../campi/campi.module'
import { EmailModule } from '../email/email.module'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [DrizzleModule, UsersModule, JwtModule.register(jwtOptions), EmailModule, CampiModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
