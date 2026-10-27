import { OmitType, PickType } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsIn, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator'
import { InferSelectModel } from 'drizzle-orm'
import { UserRole } from '../../../drizzle/enums'
import { userRoles, users } from '../../../drizzle/schemas'
import {
  ApiBooleanProperty,
  ApiDateProperty,
  ApiEmailProperty,
  ApiEnumProperty,
  ApiNonEmptyStringProperty,
  ApiPhoneProperty,
  ApiURLProperty,
  ApiUUIDProperty
} from '../../../utils/swagger-decorators'
import { BaseEntity } from '../../base/entities/base.entity'

export class FullUser extends BaseEntity implements InferSelectModel<typeof users> {
  @ApiUUIDProperty()
  campusId: string

  @ApiNonEmptyStringProperty({ example: 'Joe' })
  @IsString()
  @MinLength(1)
  name: string

  @ApiEmailProperty({ example: 'user@email.com' })
  @IsString()
  @MinLength(1)
  @IsEmail()
  email: string

  @ApiEnumProperty(userRoles, { isArray: true, example: userRoles[0] })
  @IsString()
  @IsIn(userRoles)
  roles: UserRole[]

  @ApiPhoneProperty({ nullable: true })
  @IsString()
  @MinLength(1)
  @IsPhoneNumber('BR')
  @IsOptional()
  phone: string | null

  @ApiURLProperty({ example: 'https://example.com/photo.jpg', nullable: true })
  photoUrl: string | null

  @ApiDateProperty({ nullable: true })
  lastLoginAt: string | null

  @ApiBooleanProperty()
  @IsBoolean()
  isAdmin: boolean

  @ApiBooleanProperty()
  @IsBoolean()
  isGestor: boolean

  @ApiBooleanProperty()
  @IsBoolean()
  isColaborador: boolean

  @ApiBooleanProperty()
  isAluno: boolean
}

export class User extends OmitType(FullUser, []) {}

export class MyUser extends PickType(User, [
  'id',
  'campusId',
  'name',
  'email',
  'phone',
  'photoUrl',
  'roles',
  'isAdmin',
  'isGestor',
  'isColaborador',
  'isAluno'
]) {}
