import { OmitType, PickType } from '@nestjs/swagger'
import { IsBoolean, IsDateString, IsIn, IsInt, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator'
import { InferSelectModel } from 'drizzle-orm'
import { ChamadaStatus, chamadaStatus, Turno } from '../../../drizzle/enums'
import { turnos } from '../../../drizzle/schemas'
import { chamadas } from '../../../drizzle/schemas/chamada.schema'
import {
  ApiBooleanProperty,
  ApiClassProperty,
  ApiDateProperty,
  ApiDateTimeProperty,
  ApiEnumProperty,
  ApiNonEmptyStringProperty,
  ApiNumberProperty,
  ApiUUIDProperty
} from '../../../utils/swagger-decorators'
import { BaseEntity } from '../../base/entities/base.entity'
import { InscricaoComAluno } from '../../inscricoes/entities/inscricao.entity'

export class FullChamada extends BaseEntity implements InferSelectModel<typeof chamadas> {
  @ApiUUIDProperty()
  campusId: string

  @ApiDateProperty()
  @IsDateString({ strict: true })
  data: string

  @ApiNonEmptyStringProperty({ example: 'Lanche da Tarde' })
  @IsString()
  @MinLength(1)
  nome: string

  @ApiNumberProperty({ minimum: 1, example: 50, nullable: true })
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

  @ApiBooleanProperty({ example: false })
  @IsBoolean()
  aberturaAutomatica: boolean

  @ApiBooleanProperty({ example: false })
  @IsBoolean()
  fechamentoAutomatico: boolean

  @ApiBooleanProperty({ example: false })
  @IsBoolean()
  divulgacaoAutomatica: boolean

  @ApiBooleanProperty({ example: false })
  @IsBoolean()
  finalizacaoAutomatica: boolean

  @ApiBooleanProperty({ example: false })
  @IsBoolean()
  encerramentoAutomatico: boolean

  @ApiUUIDProperty({ nullable: true })
  @IsUUID('loose')
  @IsOptional()
  refeicaoId: string | null

  @ApiUUIDProperty({ nullable: true })
  criadoPor: string | null

  @ApiDateTimeProperty({ nullable: true })
  @IsDateString({ strict: true })
  @IsOptional()
  dataHoraAbertura: string | null

  @ApiDateTimeProperty({ nullable: true })
  @IsDateString({ strict: true })
  @IsOptional()
  dataHoraFechamento: string | null

  @ApiDateTimeProperty({ nullable: true })
  @IsDateString({ strict: true })
  @IsOptional()
  dataHoraDivulgacaoResultado: string | null

  @ApiDateTimeProperty({ nullable: true })
  @IsDateString({ strict: true })
  @IsOptional()
  dataHoraFinalizacao: string | null

  @ApiDateTimeProperty({ nullable: true })
  @IsDateString({ strict: true })
  @IsOptional()
  dataHoraEncerramento: string | null

  @ApiDateTimeProperty({ nullable: true })
  dataHoraAberturaReal: string | null

  @ApiDateTimeProperty({ nullable: true })
  dataHoraFechamentoReal: string | null

  @ApiDateTimeProperty({ nullable: true })
  dataHoraDivulgacaoResultadoReal: string | null

  @ApiDateTimeProperty({ nullable: true })
  dataHoraFinalizacaoReal: string | null

  @ApiDateTimeProperty({ nullable: true })
  dataHoraEncerramentoReal: string | null

  @ApiEnumProperty(chamadaStatus, { example: 'pendente' })
  status: ChamadaStatus

  @ApiBooleanProperty()
  estaAberta: boolean

  @ApiBooleanProperty()
  estaFechada: boolean

  @ApiBooleanProperty()
  estaFinalizada: boolean

  @ApiBooleanProperty()
  estaEncerrada: boolean

  @ApiBooleanProperty()
  resultadoDivulgado: boolean

  @ApiBooleanProperty()
  podeInscrever: boolean

  @ApiBooleanProperty()
  podeCancelarInscricao: boolean
}

export class Chamada extends OmitType(FullChamada, []) {}

export class ChamadaAluno extends PickType(FullChamada, [
  'id',
  'refeicaoId',
  'data',
  'nome',
  'vagas',
  'dataHoraAbertura',
  'dataHoraFechamento',
  'dataHoraDivulgacaoResultado',
  'dataHoraFinalizacao',
  'dataHoraEncerramento',
  'dataHoraAberturaReal',
  'dataHoraFechamentoReal',
  'dataHoraDivulgacaoResultadoReal',
  'dataHoraFinalizacaoReal',
  'dataHoraEncerramentoReal',
  'status',
  'estaAberta',
  'estaFechada',
  'estaFinalizada',
  'estaEncerrada',
  'resultadoDivulgado',
  'podeInscrever',
  'podeCancelarInscricao'
]) {}

export class ChamadaComInscricoes {
  @ApiClassProperty(Chamada)
  chamada: Chamada

  @ApiClassProperty(InscricaoComAluno, { isArray: true })
  inscricoes: InscricaoComAluno[]
}
