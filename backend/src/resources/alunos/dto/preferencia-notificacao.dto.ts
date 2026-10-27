import { PickType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsObject, ValidateNested } from 'class-validator'
import { ApiClassProperty } from '../../../utils/swagger-decorators'
import { RefeicaoAluno } from '../../refeicoes/entities/refeicao.entity'
import { PreferenciaNotificacao } from '../entities/preferencia-notificacao.entity'

export class PreferenciaNotificacaoDto extends PickType(PreferenciaNotificacao, [
  'refeicaoId',
  'porEmail',
  'porWhatsApp'
]) {}

export class CreatePreferenciaNotificacaoDto {
  @ApiClassProperty(PreferenciaNotificacaoDto, { isArray: true })
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => PreferenciaNotificacaoDto)
  notificacoes: PreferenciaNotificacaoDto[]
}

export class UpdatePreferenciaNotificacaoDto extends CreatePreferenciaNotificacaoDto {}

export class PreferenciasNotificacoesRefeicao {
  @ApiClassProperty(PreferenciaNotificacao, { isArray: true })
  preferencias: PreferenciaNotificacao[]

  @ApiClassProperty(RefeicaoAluno, { isArray: true })
  refeicoes: RefeicaoAluno[]
}
