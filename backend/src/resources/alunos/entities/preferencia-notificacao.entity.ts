import { OmitType } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator'
import { InferSelectModel } from 'drizzle-orm'
import { preferenciasNotificacoes } from '../../../drizzle/schemas/preferencia-notificacao.schema'
import { ApiBooleanProperty, ApiUUIDProperty } from '../../../utils/swagger-decorators'
import { BaseEntity } from '../../base/entities/base.entity'

export class FullPreferenciaNotificacao
  extends BaseEntity
  implements InferSelectModel<typeof preferenciasNotificacoes>
{
  @ApiUUIDProperty()
  alunoId: string

  @ApiUUIDProperty({ nullable: true })
  @IsString()
  @IsUUID('loose')
  @IsOptional()
  refeicaoId: string | null

  @ApiBooleanProperty()
  @IsBoolean()
  porEmail: boolean

  @ApiBooleanProperty()
  @IsBoolean()
  porWhatsApp: boolean
}

export class PreferenciaNotificacao extends OmitType(FullPreferenciaNotificacao, []) {}
