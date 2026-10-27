import { OmitType, PickType } from '@nestjs/swagger'
import { IsInt, IsString, Min, MinLength } from 'class-validator'
import { InferSelectModel } from 'drizzle-orm'
import { campi } from '../../../drizzle/schemas'
import { ApiNonEmptyStringProperty, ApiNumberProperty } from '../../../utils/swagger-decorators'
import { BaseEntity } from '../../base/entities/base.entity'

export class FullCampus extends BaseEntity implements InferSelectModel<typeof campi> {
  @ApiNonEmptyStringProperty({ example: 'IFPB - Campus Picuí' })
  @IsString()
  @MinLength(1)
  nome: string

  @ApiNonEmptyStringProperty({ example: 'Picuí' })
  @IsString()
  @MinLength(1)
  cidade: string

  @ApiNonEmptyStringProperty({ example: 'Paraíba' })
  @IsString()
  @MinLength(1)
  estado: string

  @ApiNumberProperty({ example: 5, minimum: 0 })
  @IsInt()
  @Min(0)
  maximoDeFaltas: number

  @ApiNumberProperty({ example: 30, minimum: 0 })
  @IsInt()
  @Min(0)
  diasDeSuspensao: number
}

export class Campus extends OmitType(FullCampus, []) {}

export class MyCampus extends PickType(FullCampus, ['id', 'nome', 'cidade', 'estado', 'maximoDeFaltas', 'diasDeSuspensao']) {}
