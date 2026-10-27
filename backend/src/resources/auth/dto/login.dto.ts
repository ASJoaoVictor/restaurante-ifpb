import { OmitType } from '@nestjs/swagger'
import { IsJWT, IsString } from 'class-validator'
import { ApiClassProperty, ApiJWTProperty } from '../../../utils/swagger-decorators'
import { MyCampus } from '../../campi/entities/campus.entity'
import { MyUser } from '../../users/entities/user.entity'
import { MeDto } from './me.dto'

export class LoginDto {
  @ApiJWTProperty()
  @IsString()
  @IsJWT()
  token: string
}

export class LoginResponseDto extends OmitType(MeDto, ['user', 'campus']) {
  @ApiClassProperty(MyUser)
  user: MyUser

  @ApiClassProperty(MyCampus)
  campus: MyCampus
}
