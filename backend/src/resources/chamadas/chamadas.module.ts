import { Module } from '@nestjs/common'
import { DrizzleModule } from '../../drizzle/drizzle.module'
import { AlunosModule } from '../alunos/alunos.module'
import { NotificacoesModule } from '../notificacoes/notificacoes.module'
import { RefeicoesModule } from '../refeicoes/refeicoes.module'
import { ChamadasAcoesService } from './chamadas-acoes.service'
import { ChamadasAutomacaoService } from './chamadas-automacao.service'
import { ChamadasCsvService } from './chamadas-csv.service'
import { ChamadasImportarAlunosService } from './chamadas-importar-alunos.service'
import { ChamadasController } from './chamadas.controller'
import { ChamadasService } from './chamadas.service'
import { ChamadasReactPdfService } from './pdf-react/chamadas-react-pdf.service'

@Module({
  imports: [DrizzleModule, AlunosModule, NotificacoesModule, RefeicoesModule],
  controllers: [ChamadasController],
  providers: [
    ChamadasService,
    ChamadasAcoesService,
    ChamadasImportarAlunosService,
    ChamadasAutomacaoService,
    ChamadasCsvService,
    ChamadasReactPdfService
  ],
  exports: [ChamadasService, ChamadasAcoesService, ChamadasImportarAlunosService, ChamadasAutomacaoService]
})
export class ChamadasModule {}
