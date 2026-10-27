import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import dayjs from 'dayjs'
import { and, eq, InferSelectModel, isNotNull, isNull } from 'drizzle-orm'
import { Job, scheduleJob } from 'node-schedule'
import { DRIZZLE } from '../../drizzle/drizzle.module'
import { DrizzleDB } from '../../drizzle/drizzle.types'
import { chamadas } from '../../drizzle/schemas'
import { ChamadasAcoesService } from './chamadas-acoes.service'

@Injectable()
export class ChamadasAutomacaoService implements OnModuleInit {
  private readonly logger = new Logger(ChamadasAutomacaoService.name)
  private agendamentosChamadas: { id: string; job: Job }[] = []

  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    @Inject(forwardRef(() => ChamadasAcoesService)) private readonly chamadasAcoesService: ChamadasAcoesService
  ) {}

  onModuleInit() {
    void this.agendarAutomacaoChamadas()
  }

  private async agendarAutomacaoChamadas() {
    this.cancelarTodosAgendamentos()
    void this.agendarAberturaChamadas()
    void this.agendarFechamentoChamadas()
    void this.agendarDivulgacaoResultadoChamadas()
    void this.agendarFinalizacaoChamadas()
    void this.agendarEncerramentoChamadas()
  }

  agendarAutomacaoChamada(chamada: InferSelectModel<typeof chamadas>) {
    this.cancelarAgendamentos(chamada)
    void this.agendarAberturaChamada(chamada)
    void this.agendarFechamentoChamada(chamada)
    void this.agendarDivulgacaoResultadoChamada(chamada)
    void this.agendarFinalizacaoChamada(chamada)
    void this.agendarEncerramentoChamada(chamada)
  }

  private agendarAberturaChamada(chamada: InferSelectModel<typeof chamadas>) {
    if (!chamada.aberturaAutomatica) return
    if (!chamada.dataHoraAbertura) return
    if (chamada.dataHoraAberturaReal) return

    this.logger.warn(`Agendando abertura para chamada "${chamada.nome}" ${dayjs(chamada.dataHoraAbertura).fromNow()}`)
    this.scheduleCallAction(chamada.id, chamada.dataHoraAbertura, async () => {
      this.logger.warn(`Chamada aberta: "${chamada.nome}"`)
      await this.chamadasAcoesService.abrirChamada(chamada.id, chamada.campusId)
    })
  }

  private agendarFechamentoChamada(chamada: InferSelectModel<typeof chamadas>) {
    if (!chamada.fechamentoAutomatico) return
    if (!chamada.dataHoraFechamento) return
    if (chamada.dataHoraFechamentoReal) return

    this.logger.warn(
      `Agendando fechamento para chamada "${chamada.nome}" ${dayjs(chamada.dataHoraFechamento).fromNow()}`
    )
    this.scheduleCallAction(chamada.id, chamada.dataHoraFechamento, async () => {
      this.logger.warn(`Chamada fechada: "${chamada.nome}"`)
      await this.chamadasAcoesService.fecharChamada(chamada.id, chamada.campusId)
    })
  }

  private agendarDivulgacaoResultadoChamada(chamada: InferSelectModel<typeof chamadas>) {
    if (!chamada.divulgacaoAutomatica) return
    if (!chamada.dataHoraDivulgacaoResultado) return
    if (chamada.dataHoraDivulgacaoResultadoReal) return

    this.logger.warn(
      `Agendando divulgação de resultado para chamada "${chamada.nome}" ${dayjs(chamada.dataHoraDivulgacaoResultado).fromNow()}`
    )
    this.scheduleCallAction(chamada.id, chamada.dataHoraDivulgacaoResultado, async () => {
      this.logger.warn(`Chamada divulgada: "${chamada.nome}"`)
      await this.chamadasAcoesService.divulgarResultadoChamada(chamada.id, chamada.campusId)
    })
  }

  private agendarFinalizacaoChamada(chamada: InferSelectModel<typeof chamadas>) {
    if (!chamada.finalizacaoAutomatica) return
    if (!chamada.dataHoraFinalizacao) return
    if (chamada.dataHoraFinalizacaoReal) return

    this.logger.warn(
      `Agendando finalização para chamada "${chamada.nome}" ${dayjs(chamada.dataHoraFinalizacao).fromNow()}`
    )
    this.scheduleCallAction(chamada.id, chamada.dataHoraFinalizacao, async () => {
      this.logger.warn(`Chamada finalizada: "${chamada.nome}"`)
      await this.chamadasAcoesService.finalizarChamada(chamada.id, chamada.campusId)
    })
  }

  private agendarEncerramentoChamada(chamada: InferSelectModel<typeof chamadas>) {
    if (!chamada.encerramentoAutomatico) return
    if (!chamada.dataHoraEncerramento) return
    if (chamada.dataHoraEncerramentoReal) return

    this.logger.warn(
      `Agendando encerramento para chamada "${chamada.nome}" ${dayjs(chamada.dataHoraEncerramento).fromNow()}`
    )
    this.scheduleCallAction(chamada.id, chamada.dataHoraEncerramento, async () => {
      this.logger.warn(`Chamada encerrada: "${chamada.nome}"`)
      await this.chamadasAcoesService.encerrarChamada(chamada.id, chamada.campusId)
    })
  }

  private async agendarAberturaChamadas() {
    const chamadasParaAbrir = await this.getChamadasParaAbrir()
    const promises = chamadasParaAbrir.map((chamada) => this.agendarAberturaChamada(chamada))
    await Promise.all(promises)
  }

  private async agendarFechamentoChamadas() {
    const chamadasParaFechar = await this.getChamadasParaFechar()
    const promises = chamadasParaFechar.map((chamada) => this.agendarFechamentoChamada(chamada))
    await Promise.all(promises)
  }

  private async agendarDivulgacaoResultadoChamadas() {
    const chamadasParaDivulgar = await this.getChamadasParaDivulgar()
    const promises = chamadasParaDivulgar.map((chamada) => this.agendarDivulgacaoResultadoChamada(chamada))
    await Promise.all(promises)
  }

  private async agendarFinalizacaoChamadas() {
    const chamadasParaFinalizar = await this.getChamadasParaFinalizar()
    const promises = chamadasParaFinalizar.map((chamada) => this.agendarFinalizacaoChamada(chamada))
    await Promise.all(promises)
  }

  private async agendarEncerramentoChamadas() {
    const chamadasParaEncerrar = await this.getChamadasParaEncerrar()
    const promises = chamadasParaEncerrar.map((chamada) => this.agendarEncerramentoChamada(chamada))
    await Promise.all(promises)
  }

  private scheduleCallAction(id: string, scheduledDateTime: string, actionCallback: () => void) {
    const scheduledTime = new Date(scheduledDateTime)
    const hasTimePassed = scheduledTime.getTime() < new Date().getTime()

    if (hasTimePassed) {
      void actionCallback()
    } else {
      const job = scheduleJob(new Date(scheduledDateTime), actionCallback)
      this.agendamentosChamadas.push({ id, job })
    }
  }

  private cancelarAgendamentos(chamada: InferSelectModel<typeof chamadas>) {
    for (const { id, job } of this.agendamentosChamadas) {
      if (id === chamada.id) {
        this.logger.warn(`Cancelando agendamento para chamada "${chamada.nome}"`)
        job.cancel()
      }
    }

    this.agendamentosChamadas = this.agendamentosChamadas.filter(({ id }) => id !== chamada.id)
  }

  private cancelarTodosAgendamentos() {
    for (const { job } of this.agendamentosChamadas) {
      job.cancel()
    }

    this.agendamentosChamadas.splice(0, this.agendamentosChamadas.length)
  }

  private getChamadasParaAbrir() {
    return this.db
      .select()
      .from(chamadas)
      .where(
        and(
          eq(chamadas.aberturaAutomatica, true), // Abertura automática habilitada
          isNotNull(chamadas.dataHoraAbertura), // Data de abertura definida
          isNull(chamadas.dataHoraAberturaReal) // Abertura real ainda não ocorreu
        )
      )
  }

  private getChamadasParaFechar() {
    return this.db
      .select()
      .from(chamadas)
      .where(
        and(
          eq(chamadas.fechamentoAutomatico, true), // Fechamento automática habilitada
          isNotNull(chamadas.dataHoraFechamento), // Data de fechamento definida
          isNull(chamadas.dataHoraFechamentoReal) // Fechamento real ainda não ocorreu
        )
      )
  }

  private getChamadasParaDivulgar() {
    return this.db
      .select()
      .from(chamadas)
      .where(
        and(
          eq(chamadas.divulgacaoAutomatica, true), // Divulgação automática habilitada
          isNotNull(chamadas.dataHoraDivulgacaoResultado), // Data de divulgação definida
          isNull(chamadas.dataHoraDivulgacaoResultadoReal) // Divulgação real ainda não ocorreu
        )
      )
  }

  private getChamadasParaFinalizar() {
    return this.db
      .select()
      .from(chamadas)
      .where(
        and(
          eq(chamadas.finalizacaoAutomatica, true), // Finalização automática habilitada
          isNotNull(chamadas.dataHoraFinalizacao), // Data de finalização definida
          isNull(chamadas.dataHoraFinalizacaoReal) // Finalização real ainda não ocorreu
        )
      )
  }

  private getChamadasParaEncerrar() {
    return this.db
      .select()
      .from(chamadas)
      .where(
        and(
          eq(chamadas.encerramentoAutomatico, true), // Encerramento automática habilitada
          isNotNull(chamadas.dataHoraEncerramento), // Data de encerramento definida
          isNull(chamadas.dataHoraEncerramentoReal) // Encerramento real ainda não ocorreu
        )
      )
  }
}
