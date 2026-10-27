import { OmitType, PartialType, PickType } from '@nestjs/swagger'
import { User } from '../entities/user.entity'
import { UsersService } from '../users.service'
import { QueryOptionsDto } from '../../base/dto/query-options.dto'
import { ApiEnumProperty } from '../../../utils/swagger-decorators'
import { IsIn, IsOptional, IsString } from 'class-validator'

export class CreateUserDto extends PickType(User, ['name', 'email', 'phone', 'isAdmin', 'isGestor', 'isColaborador']) {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export type UserOrderBy = (typeof UsersService.orderingFields)[number]

export class UserQueryOptionsDto extends OmitType(QueryOptionsDto, ['orderBy']) {
  @ApiEnumProperty(UsersService.orderingFields, { required: false })
  @IsString()
  @IsIn(UsersService.orderingFields)
  @IsOptional()
  orderBy?: UserOrderBy
}
