import { forwardRef, Inject, Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common'
import { and, eq, inArray, isNull, ne } from 'drizzle-orm'
import { DRIZZLE } from '../../drizzle/drizzle.module'
import { DrizzleDB } from '../../drizzle/drizzle.types'
import { alunos, chamadas, inscricoes, turmas } from '../../drizzle/schemas'
import { AlunosService } from '../alunos/alunos.service'
import { NotificacoesService } from '../notificacoes/notificacoes.service'
import { MyUser } from '../users/entities/user.entity'
import { ChamadasService } from './chamadas.service'

@Injectable()
export class ChamadasAcoesService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    @Inject(forwardRef(() => ChamadasService)) private readonly chamadasService: ChamadasService,
    @Inject(forwardRef(() => NotificacoesService)) private readonly notificacoesService: NotificacoesService,
    @Inject(forwardRef(() => AlunosService)) private readonly alunosService: AlunosService
  ) {}

  async abrirChamada(id: string, campusId: string) {
    const chamada = await this.chamadasService.getOne(id, campusId)
    if (!chamada) throw new NotFoundException('Chamada não encontrada')
    if (chamada.dataHoraAberturaReal) throw new PreconditionFailedException('Chamada já foi aberta')
    await this.chamadasService.update(
      id,
      campusId,
      { dataHoraAberturaReal: new Date().toISOString(), aberturaAutomatica: false },
      false
    )
    void this.notificacoesService.notificarChamadaAberta(id)
  }

  async fecharChamada(id: string, campusId: string) {
    const chamada = await this.chamadasService.getOne(id, campusId)
    if (!chamada) throw new NotFoundException('Chamada não encontrada')
    if (chamada.dataHoraFechamentoReal) throw new PreconditionFailedException('Chamada já foi fechada')
    await this.chamadasService.update(
      id,
      campusId,
      {
        dataHoraFechamentoReal: new Date().toISOString(),
        fechamentoAutomatico: false,

        // Garante que a etapa de abertura esteja preenchida
        dataHoraAberturaReal: chamada.dataHoraAberturaReal ?? new Date().toISOString()
      },
      false
    )
  }

  async divulgarResultadoChamada(id: string, campusId: string) {
    const chamada = await this.chamadasService.getOne(id, campusId)
    if (!chamada) throw new NotFoundException('Chamada não encontrada')
    // TODO: caso seja automático, aprovar automaticamente
    await this.chamadasService.update(
      id,
      campusId,
      {
        dataHoraDivulgacaoResultadoReal: new Date().toISOString(),
        divulgacaoAutomatica: false,

        // Garante que todas as etapas anteriores estejam preenchidas
        dataHoraAberturaReal: chamada.dataHoraAberturaReal ?? new Date().toISOString(),
        dataHoraFechamentoReal: chamada.dataHoraFechamentoReal ?? new Date().toISOString()
      },
      false
    )
    void this.notificacoesService.notificarResultado(id)
  }

  async finalizarChamada(id: string, campusId: string) {
    const chamada = await this.chamadasService.getOne(id, campusId)
    if (!chamada) throw new NotFoundException('Chamada não encontrada')
    if (chamada.dataHoraFinalizacaoReal) throw new PreconditionFailedException('Chamada já foi finalizada')
    await this.chamadasService.update(
      id,
      campusId,
      {
        dataHoraFinalizacaoReal: new Date().toISOString(),
        finalizacaoAutomatica: false,

        // Garante que todas as etapas anteriores estejam preenchidas
        dataHoraAberturaReal: chamada.dataHoraAberturaReal ?? new Date().toISOString(),
        dataHoraFechamentoReal: chamada.dataHoraFechamentoReal ?? new Date().toISOString(),
        dataHoraDivulgacaoResultadoReal: chamada.dataHoraDivulgacaoResultadoReal ?? new Date().toISOString()
      },
      false
    )
  }

  async encerrarChamada(id: string, campusId: string) {
    const chamada = await this.chamadasService.getOne(id, campusId)
    if (!chamada) throw new NotFoundException('Chamada não encontrada')
    if (chamada.dataHoraEncerramentoReal) throw new PreconditionFailedException('Chamada já foi encerrada')
    await this.chamadasService.update(
      id,
      campusId,
      {
        dataHoraEncerramentoReal: new Date().toISOString(),
        encerramentoAutomatico: false,

        // Garante que todas as etapas anteriores estejam preenchidas
        dataHoraAberturaReal: chamada.dataHoraAberturaReal ?? new Date().toISOString(),
        dataHoraFechamentoReal: chamada.dataHoraFechamentoReal ?? new Date().toISOString(),
        dataHoraDivulgacaoResultadoReal: chamada.dataHoraDivulgacaoResultadoReal ?? new Date().toISOString(),
        dataHoraFinalizacaoReal: chamada.dataHoraFinalizacaoReal ?? new Date().toISOString()
      },
      false
    )

    // Marcar faltas dos alunos que não compareceram
    await this.marcarFaltasAposEncerramento(id, campusId)
  }

  async reabrirChamada(id: string, campusId: string) {
    const chamada = await this.chamadasService.getOne(id, campusId)
    if (!chamada) throw new NotFoundException('Chamada não encontrada')
    if (chamada.status === 'pendente') throw new PreconditionFailedException('Chamada não foi aberta')
    if (chamada.status === 'aberta') throw new PreconditionFailedException('Chamada já está aberta')
    await this.chamadasService.update(
      id,
      campusId,
      {
        dataHoraAberturaReal: new Date().toISOString(),
        dataHoraFechamentoReal: null,
        dataHoraDivulgacaoResultadoReal: null,
        dataHoraFinalizacaoReal: null,
        dataHoraEncerramentoReal: null
      },
      false
    )
    void this.notificacoesService.notificarChamadaAberta(id)
  }

  async desfazerFinalizacaoChamada(id: string, campusId: string) {
    const chamada = await this.chamadasService.getOne(id, campusId)
    if (!chamada) throw new NotFoundException('Chamada não encontrada')
    if (!chamada.dataHoraFinalizacaoReal) throw new PreconditionFailedException('Chamada não está finalizada')
    await this.chamadasService.update(
      id,
      campusId,
      { dataHoraFinalizacaoReal: null, dataHoraEncerramentoReal: null },
      false
    )
  }

  async desfazerAberturaChamada(id: string, campusId: string) {
    const chamada = await this.chamadasService.getOne(id, campusId)
    if (!chamada) throw new NotFoundException('Chamada não encontrada')
    if (!chamada.dataHoraAberturaReal) throw new PreconditionFailedException('Chamada não está aberta')
    await this.chamadasService.update(
      id,
      campusId,
      {
        dataHoraAberturaReal: null,
        dataHoraFechamentoReal: null,
        dataHoraDivulgacaoResultadoReal: null,
        dataHoraFinalizacaoReal: null,
        dataHoraEncerramentoReal: null
      },
      false
    )
  }

  async aprovarPendentes(chamadaId: string, campusId: string) {
    const chamada = await this.chamadasService.getOne(chamadaId, campusId)
    if (!chamada) throw new NotFoundException('Chamada não encontrada') // TODO: lançar erros no método getOne

    let inscricoesNaoRejeitadasQuery = this.db
      .select({ id: inscricoes.id })
      .from(inscricoes)
      .innerJoin(alunos, eq(inscricoes.alunoId, alunos.id))
      .leftJoin(turmas, eq(turmas.id, alunos.turmaId))
      .innerJoin(chamadas, eq(chamadas.id, inscricoes.chamadaId))
      .where(
        and(
          eq(inscricoes.chamadaId, chamadaId),
          ne(inscricoes.status, 'rejeitada'),
          isNull(inscricoes.dataHoraCancelamento)
        )
      )
      .orderBy(...ChamadasService.getPriorityOrder())
      .$dynamic()

    // Se o número de vagas for limitado, aplica o limite na consulta
    if (chamada.vagas !== null) {
      inscricoesNaoRejeitadasQuery = inscricoesNaoRejeitadasQuery.limit(chamada.vagas)
    }

    const inscricoesNaoRejeitadas = await inscricoesNaoRejeitadasQuery

    const { rowCount } = await this.db
      .update(inscricoes)
      .set({ status: 'aceita' })
      .where(
        inArray(
          inscricoes.id,
          inscricoesNaoRejeitadas.map((i) => i.id)
        )
      )

    return { alunosAprovados: rowCount ?? 0 }
  }

  async marcarAusencias(chamadaId: string, campusId: string) {
    const chamada = await this.chamadasService.getOne(chamadaId, campusId)
    if (!chamada) throw new NotFoundException('Chamada não encontrada')

    const { rowCount } = await this.db
      .update(inscricoes)
      .set({ presenca: 'ausente' })
      .where(and(eq(inscricoes.chamadaId, chamadaId), eq(inscricoes.valida, true), eq(inscricoes.presenca, 'pendente')))

    return { alunosAusentes: rowCount! }
  }

  async inserirInscricoesManuais(chamadaId: string, campusId: string, authUser: MyUser, alunosIds: string[]) {
    const chamada = await this.chamadasService.getOne(chamadaId, campusId)

    if (!chamada) throw new NotFoundException('Chamada não encontrada')

    const inserindoPelaListaDeInscricoes = authUser.isColaborador // TODO: verificar de outra forma

    await this.db
      .insert(inscricoes)
      .values(
        alunosIds.map((alunoId) => ({
          alunoId,
          chamadaId: chamada.id,
          dataHoraInscricao: new Date(),
          inseridoPeloGestor: authUser.isGestor,
          inseridoPeloColaborador: authUser.isColaborador,
          status: inserindoPelaListaDeInscricoes ? ('pendente' as const) : ('aceita' as const),
          presenca: 'pendente' as const,
          emListaEspera: inserindoPelaListaDeInscricoes
        }))
      )
      .onConflictDoUpdate({
        target: [inscricoes.alunoId, inscricoes.chamadaId],
        set: {
          status: inserindoPelaListaDeInscricoes ? 'pendente' : 'aceita',
          dataHoraCancelamento: null,
          inseridoPeloGestor: authUser.isGestor,
          inseridoPeloColaborador: authUser.isColaborador,
          presenca: 'pendente',
          emListaEspera: inserindoPelaListaDeInscricoes
        }
      })
  }

  async marcarFaltasAposEncerramento(chamadaId: string, campusId: string) {
    const chamadaComInscricoes = await this.chamadasService.getOneWithInscricoes(chamadaId, campusId)
    if (!chamadaComInscricoes) throw new NotFoundException('Chamada não encontrada')

    const alunosContemplados = chamadaComInscricoes.inscricoes.filter(({ inscricao }) => inscricao.status === 'aceita')
    const alunosAusentes = alunosContemplados.filter(({ inscricao }) => inscricao.presenca === 'ausente')

    alunosAusentes.forEach(async ({ aluno }) => {
      await this.alunosService.definirFaltas(campusId, aluno.id, { faltas: aluno.faltas + 1 })
    })
  }
}
