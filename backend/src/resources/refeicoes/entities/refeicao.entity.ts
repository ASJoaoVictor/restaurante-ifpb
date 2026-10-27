import { OmitType, PickType } from '@nestjs/swagger'
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator'
import { InferSelectModel } from 'drizzle-orm'
import { DiaDaSemana, Turno } from '../../../drizzle/enums'
import { diaDaSemana, refeicoes, turnos } from '../../../drizzle/schemas'
import {
  ApiBooleanProperty,
  ApiEnumProperty,
  ApiNonEmptyStringProperty,
  ApiNumberProperty,
  ApiTimeProperty,
  ApiUUIDProperty
} from '../../../utils/swagger-decorators'
import { BaseEntity } from '../../base/entities/base.entity'

export class FullRefeicao extends BaseEntity implements InferSelectModel<typeof refeicoes> {
  @ApiUUIDProperty()
  campusId: string

  @ApiNonEmptyStringProperty({ example: 'Lanche 3ª feira' })
  @IsString()
  @MinLength(1)
  nome: string

  @ApiEnumProperty(diaDaSemana, { example: diaDaSemana[1], nullable: true })
  @IsString()
  @IsIn(diaDaSemana)
  @IsOptional()
  diaDaSemana: DiaDaSemana | null

  @ApiTimeProperty({ example: '15:30:00', nullable: true })
  @IsOptional()
  horarioAbertura: string | null

  @ApiTimeProperty({ example: '16:00:00', nullable: true })
  @IsOptional()
  horarioFechamento: string | null

  @ApiTimeProperty({ example: '16:30:00', nullable: true })
  @IsOptional()
  horarioDivulgacaoResultado: string | null

  @ApiTimeProperty({ example: '12:00:00', nullable: true })
  @IsOptional()
  horarioFinalizacao: string | null

  @ApiTimeProperty({ example: '17:00:00', nullable: true })
  @IsOptional()
  horarioEncerramento: string | null

  @ApiNumberProperty({ example: -1 })
  @IsInt()
  deslocamentoDataAbertura: number

  @ApiNumberProperty({ example: -1 })
  @IsInt()
  deslocamentoDataFechamento: number

  @ApiNumberProperty({ example: -1 })
  @IsInt()
  deslocamentoDataDivulgacao: number

  @ApiNumberProperty({ example: 0 })
  @IsInt()
  deslocamentoDataFinalizacao: number

  @ApiNumberProperty({ example: 0 })
  @IsInt()
  deslocamentoDataEncerramento: number

  @ApiNumberProperty({ example: 60, minimum: 1, nullable: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  vagas: number | null

  @ApiEnumProperty(turnos, { nullable: true })
  @IsString()
  @IsIn(turnos)
  @IsOptional()
  turno: Turno | null

  @ApiBooleanProperty()
  @IsBoolean()
  priorizarMesmoTurno: boolean

  @ApiBooleanProperty({ example: true })
  @IsBoolean()
  aberturaAutomatica: boolean

  @ApiBooleanProperty({ example: true })
  @IsBoolean()
  fechamentoAutomatico: boolean

  @ApiBooleanProperty({ example: true })
  @IsBoolean()
  divulgacaoAutomatica: boolean

  @ApiBooleanProperty({ example: true })
  @IsBoolean()
  finalizacaoAutomatica: boolean

  @ApiBooleanProperty({ example: true })
  @IsBoolean()
  encerramentoAutomatico: boolean
}

export class Refeicao extends OmitType(FullRefeicao, []) {}

export class RefeicaoAluno extends PickType(FullRefeicao, ['id', 'nome']) {}
