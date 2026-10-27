import { OmitType, PartialType, PickType } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsArray, IsBoolean, IsIn, IsOptional, IsString, IsUUID } from 'class-validator'
import {
  ApiBooleanProperty,
  ApiClassProperty,
  ApiEnumProperty,
  ApiFileProperty,
  ApiNonEmptyStringProperty,
  ApiNumberProperty,
  ApiStringArrayProperty,
  ApiUUIDProperty
} from '../../../utils/swagger-decorators'
import { QueryOptionsDto } from '../../base/dto/query-options.dto'
import { InscricaoAluno, InscricaoComAluno } from '../../inscricoes/entities/inscricao.entity'
import { RefeicaoAluno } from '../../refeicoes/entities/refeicao.entity'
import { User } from '../../users/entities/user.entity'
import { ChamadasService } from '../chamadas.service'
import { Chamada, ChamadaAluno } from '../entities/chamada.entity'

export class CreateChamadaDto extends PickType(Chamada, [
  'data',
  'nome',
  'vagas',
  'turno',
  'priorizarMesmoTurno',
  'aberturaAutomatica',
  'fechamentoAutomatico',
  'divulgacaoAutomatica',
  'finalizacaoAutomatica',
  'encerramentoAutomatico',
  'refeicaoId',
  'dataHoraAbertura',
  'dataHoraFechamento',
  'dataHoraDivulgacaoResultado',
  'dataHoraFinalizacao',
  'dataHoraEncerramento'
]) {}

export class UpdateChamadaDto extends PartialType(CreateChamadaDto) {}

export class ChamadaComInscricaoDto {
  @ApiClassProperty(ChamadaAluno)
  chamada: ChamadaAluno

  @ApiClassProperty(InscricaoAluno, { nullable: true })
  inscricao: InscricaoAluno | null
}

export class ChamadaComTotalInscritosDto extends Chamada {
  @ApiNumberProperty({ minimum: 0, example: 50, nullable: false })
  totalInscritos: number
}

export class ChamadaResultadoAlunoDto extends PickType(User, ['id', 'name']) {
  @ApiBooleanProperty()
  souEu: boolean
}

export class ChamadaResultadoAlunosDto {
  @ApiClassProperty(Chamada)
  chamada: ChamadaAluno

  @ApiClassProperty(ChamadaResultadoAlunoDto, { isArray: true })
  usuarios: ChamadaResultadoAlunoDto[]

  @ApiClassProperty(InscricaoAluno, { nullable: true })
  minhaInscricao: InscricaoAluno | null
}

export class ChamadasDashboardDto {
  @ApiClassProperty(ChamadaComInscricaoDto, { isArray: true })
  chamadasAbertas: ChamadaComInscricaoDto[]

  @ApiClassProperty(ChamadaComInscricaoDto, { isArray: true })
  chamadasFechadas: ChamadaComInscricaoDto[]

  @ApiClassProperty(ChamadaComInscricaoDto, { isArray: true })
  chamadasAnteriores: ChamadaComInscricaoDto[]

  @ApiClassProperty(RefeicaoAluno, { isArray: true })
  refeicoesRestritas: RefeicaoAluno[]
}

export type ChamadaOrderBy = (typeof ChamadasService.orderingFields)[number]

export class ChamadaQueryOptionsDto extends OmitType(QueryOptionsDto, ['orderBy']) {
  @ApiEnumProperty(ChamadasService.orderingFields, { required: false })
  @IsString()
  @IsIn(ChamadasService.orderingFields)
  @IsOptional()
  orderBy?: ChamadaOrderBy
}

export const inscricoesPdfOrderByOptions = ['alfabetica', 'prioridade'] as const
export type InscricoesPdfOrderBy = (typeof inscricoesPdfOrderByOptions)[number]
export const inscricoesPdfFilterOptions = ['presentes', 'ausentes', 'desistentes'] as const
export type InscricoesPdfFilter = (typeof inscricoesPdfFilterOptions)[number]

export class InscricoesPdfQueryDto {
  @ApiBooleanProperty({ required: false, example: false })
  @Transform(({ value }) => {
    if (value === undefined) return false
    if (value === 'true') return true
    if (value === 'false') return false
    return value
  })
  @IsBoolean()
  @IsOptional()
  todos = false

  @ApiEnumProperty(inscricoesPdfOrderByOptions, { required: false, example: 'alfabetica' })
  @IsString()
  @IsIn(inscricoesPdfOrderByOptions)
  @IsOptional()
  orderBy: InscricoesPdfOrderBy = 'alfabetica'

  @ApiEnumProperty(inscricoesPdfFilterOptions, { required: false, example: 'presentes' })
  @IsString()
  @IsIn(inscricoesPdfFilterOptions)
  @IsOptional()
  filter?: InscricoesPdfFilter
}

export class ImportarInscricoesDto {
  @ApiFileProperty()
  file: Express.Multer.File
}

export class ImportarInscricoesResponseDto {
  @ApiStringArrayProperty({ example: ['Erro 1', 'Erro 2'] })
  errors: string[]
}

export class AprovarPendentesResponseDto {
  @ApiNumberProperty({ example: 32 })
  alunosAprovados: number
}

export class MarcarAusenciasResponseDto {
  @ApiNumberProperty({ example: 5 })
  alunosAusentes: number
}

export class ChamadaPresencaDto {
  @ApiClassProperty(Chamada)
  chamada: Chamada

  @ApiClassProperty(InscricaoComAluno, { isArray: true })
  inscricoesAprovadas: InscricaoComAluno[]

  @ApiClassProperty(InscricaoComAluno, { isArray: true })
  outrasInscricoes: InscricaoComAluno[]

  @ApiClassProperty(InscricaoComAluno, { isArray: true })
  listaDeEspera: InscricaoComAluno[]

  @ApiNonEmptyStringProperty({ example: 'key' })
  qrCodeSignaturePublicKey: string
}

export class InserirInscricoesManuaisDto {
  @ApiUUIDProperty({ isArray: true, example: ['00000000-0000-0000-0000-000000000000'] })
  @IsString({ each: true })
  @IsUUID('loose', { each: true })
  @IsArray()
  alunoIds: string[]
}
