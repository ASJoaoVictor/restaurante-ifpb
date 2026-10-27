import { OmitType, PickType } from '@nestjs/swagger'
import { IsArray, IsIn, IsInt, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator'
import { InferSelectModel } from 'drizzle-orm'
import { DiaDaSemana, Turno } from '../../../drizzle/enums'
import { diaDaSemana, turmas, turnos } from '../../../drizzle/schemas'
import {
  ApiClassProperty,
  ApiEnumProperty,
  ApiNonEmptyStringProperty,
  ApiNumberProperty,
  ApiUUIDProperty
} from '../../../utils/swagger-decorators'
import { BaseEntity } from '../../base/entities/base.entity'
import { Curso } from '../../cursos/entities/curso.entity'

export class FullTurma extends BaseEntity implements InferSelectModel<typeof turmas> {
  @ApiUUIDProperty()
  campusId: string

  @ApiNumberProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  periodo: number

  @ApiNonEmptyStringProperty({ example: 'G1' })
  @IsString()
  turma: string

  @ApiEnumProperty(diaDaSemana, { isArray: true, example: [diaDaSemana[2]] })
  @IsString({ each: true })
  @IsIn(diaDaSemana, { each: true })
  @IsArray()
  diasContraturno: DiaDaSemana[]

  @ApiUUIDProperty()
  @IsString()
  @IsUUID('loose')
  cursoId: string

  @ApiEnumProperty(turnos, { nullable: true })
  @IsString()
  @IsIn(turnos)
  @IsOptional()
  turno: Turno | null
}

export class Turma extends OmitType(FullTurma, []) {
  @ApiClassProperty(Curso)
  curso: Curso
}

export class FlatTurma extends OmitType(FullTurma, []) {}

export class MyTurma extends PickType(Turma, ['id', 'periodo', 'turma', 'diasContraturno'] as const) {}
