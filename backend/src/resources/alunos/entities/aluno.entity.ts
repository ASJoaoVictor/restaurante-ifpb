import { OmitType, PickType } from '@nestjs/swagger'
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength
} from 'class-validator'
import { InferSelectModel } from 'drizzle-orm'
import { alunos } from '../../../drizzle/schemas'
import {
  ApiBooleanProperty,
  ApiClassProperty,
  ApiDateProperty,
  ApiNonEmptyStringProperty,
  ApiNumberProperty,
  ApiStringArrayProperty,
  ApiStringProperty,
  ApiUUIDProperty
} from '../../../utils/swagger-decorators'
import { BaseEntity } from '../../base/entities/base.entity'
import { Curso } from '../../cursos/entities/curso.entity'
import { FlatTurma } from '../../turmas/entities/turma.entity'
import { User } from '../../users/entities/user.entity'

export class FullAluno extends BaseEntity implements InferSelectModel<typeof alunos> {
  @ApiUUIDProperty()
  usuarioId: string

  @ApiNonEmptyStringProperty({ example: '202312040001' })
  @IsString()
  @MinLength(1)
  matricula: string

  @ApiNumberProperty({ minimum: 0 })
  @IsInt()
  @Min(0)
  faltas: number

  @ApiDateProperty({ nullable: true })
  @IsDateString({ strict: true })
  @IsOptional()
  suspensoAte: string | null

  @ApiStringProperty({ nullable: true })
  @IsString()
  @IsOptional()
  observacoes: string | null

  @ApiNonEmptyStringProperty({ example: 'Picuí' })
  @IsString()
  @MinLength(1)
  cidade: string

  @ApiNonEmptyStringProperty({ example: 'PB', minLength: 2, maxLength: 2 })
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  estado: string

  @ApiUUIDProperty({ nullable: true })
  @IsString()
  @IsUUID('loose')
  @IsOptional()
  turmaId: string | null

  @ApiBooleanProperty()
  @IsBoolean()
  possuiNEE: boolean

  @ApiBooleanProperty()
  @IsBoolean()
  boasVindas: boolean

  @ApiBooleanProperty()
  @IsBoolean()
  notificacoesConfiguradas: boolean
}

export class Aluno extends OmitType(FullAluno, []) {
  @ApiClassProperty(User)
  usuario: User

  @ApiClassProperty(Curso, { nullable: true })
  curso: Curso | null

  @ApiClassProperty(FlatTurma, { nullable: true })
  turma: FlatTurma | null

  @ApiStringArrayProperty()
  refeicoesRestritas: string[]
}

export class MyAluno extends PickType(Aluno, [
  'id',
  'matricula',
  'faltas',
  'suspensoAte',
  'boasVindas',
  'notificacoesConfiguradas'
]) {}

export class AlunoDetalhes extends Aluno {
  @ApiNumberProperty()
  inscricoes: number
}
