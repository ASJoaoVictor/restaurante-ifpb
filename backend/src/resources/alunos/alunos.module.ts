import { Module } from '@nestjs/common'
import { DrizzleModule } from '../../drizzle/drizzle.module'
import { CampiModule } from '../campi/campi.module'
import { NotificacoesModule } from '../notificacoes/notificacoes.module'
import { AlunosImportService } from './alunos-import.service'
import { AlunosController } from './alunos.controller'
import { AlunosService } from './alunos.service'

@Module({
  imports: [DrizzleModule, CampiModule, NotificacoesModule],
  controllers: [AlunosController],
  providers: [AlunosService, AlunosImportService],
  exports: [AlunosService, AlunosImportService]
})
export class AlunosModule {}
