import { Module } from '@nestjs/common'
import { DrizzleModule } from '../../drizzle/drizzle.module'
import { AlunosModule } from '../alunos/alunos.module'
import { ChamadasModule } from '../chamadas/chamadas.module'
import { NotificacoesModule } from '../notificacoes/notificacoes.module'
import { RefeicoesModule } from '../refeicoes/refeicoes.module'
import { StorageModule } from '../storage/storage.module'
import { TurmasModule } from '../turmas/turmas.module'
import { InscricoesController } from './inscricoes.controller'
import { InscricoesService } from './inscricoes.service'

@Module({
  imports: [
    DrizzleModule,
    TurmasModule,
    ChamadasModule,
    AlunosModule,
    NotificacoesModule,
    RefeicoesModule,
    StorageModule
  ],
  controllers: [InscricoesController],
  providers: [InscricoesService],
  exports: [InscricoesService]
})
export class InscricoesModule {}
