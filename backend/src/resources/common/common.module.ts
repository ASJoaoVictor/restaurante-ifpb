import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { jwtOptions } from '../../config/jwt.config'
import { UsersModule } from '../users/users.module'
import { JwtHelperService } from './jwt-helper.service'

@Module({
  imports: [JwtModule.register(jwtOptions), UsersModule],
  providers: [JwtHelperService],
  exports: [JwtHelperService]
})
export class CommonModule {}
