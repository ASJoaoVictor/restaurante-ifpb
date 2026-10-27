import { Module } from '@nestjs/common'
import { DrizzleModule } from '../../drizzle/drizzle.module'
import { EmailModule } from '../email/email.module'
import { NotificacoesService } from './notificacoes.service'

@Module({
  imports: [DrizzleModule, EmailModule],
  providers: [NotificacoesService],
  exports: [NotificacoesService]
})
export class NotificacoesModule {}
