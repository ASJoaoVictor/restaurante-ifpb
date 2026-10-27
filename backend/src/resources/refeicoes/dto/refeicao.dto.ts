import { OmitType, PartialType, PickType } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString } from 'class-validator'
import { ApiEnumProperty } from '../../../utils/swagger-decorators'
import { QueryOptionsDto } from '../../base/dto/query-options.dto'
import { Refeicao } from '../entities/refeicao.entity'
import { RefeicoesService } from '../refeicoes.service'

export class CreateRefeicaoDto extends PickType(Refeicao, [
  'nome',
  'diaDaSemana',
  'horarioAbertura',
  'horarioFechamento',
  'horarioDivulgacaoResultado',
  'horarioFinalizacao',
  'horarioEncerramento',
  'deslocamentoDataAbertura',
  'deslocamentoDataFechamento',
  'deslocamentoDataDivulgacao',
  'deslocamentoDataFinalizacao',
  'deslocamentoDataEncerramento',
  'vagas',
  'turno',
  'priorizarMesmoTurno',
  'aberturaAutomatica',
  'fechamentoAutomatico',
  'divulgacaoAutomatica',
  'finalizacaoAutomatica',
  'encerramentoAutomatico'
]) {}

export class UpdateRefeicaoDto extends PartialType(CreateRefeicaoDto) {}

export type RefeicaoOrderBy = (typeof RefeicoesService.orderingFields)[number]

export class RefeicaoQueryOptionsDto extends OmitType(QueryOptionsDto, ['orderBy']) {
  @ApiEnumProperty(RefeicoesService.orderingFields, { required: false })
  @IsString()
  @IsIn(RefeicoesService.orderingFields)
  @IsOptional()
  orderBy?: RefeicaoOrderBy
}
