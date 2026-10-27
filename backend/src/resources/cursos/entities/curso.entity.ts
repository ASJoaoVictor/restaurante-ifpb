import { OmitType, PickType } from '@nestjs/swagger'
import { IsInt, IsString, Min, MinLength } from 'class-validator'
import { InferSelectModel } from 'drizzle-orm'
import { cursos } from '../../../drizzle/schemas/curso.schema'
import { ApiNonEmptyStringProperty, ApiNumberProperty, ApiUUIDProperty } from '../../../utils/swagger-decorators'
import { BaseEntity } from '../../base/entities/base.entity'

export class FullCurso extends BaseEntity implements InferSelectModel<typeof cursos> {
  @ApiUUIDProperty()
  campusId: string

  @ApiNonEmptyStringProperty({ example: 'Tecnologia em Sistemas para Internet' })
  @IsString()
  @MinLength(1)
  nome: string

  @ApiNonEmptyStringProperty({ example: 'TSI' })
  @IsString()
  @MinLength(1)
  nomeCurto: string

  @ApiNumberProperty({ example: 586, minimum: 0 })
  @IsInt()
  @Min(0)
  numeroCurso: number
}

export class Curso extends OmitType(FullCurso, []) {}

export class MyCurso extends PickType(Curso, ['id', 'nome', 'nomeCurto', 'numeroCurso']) {}
