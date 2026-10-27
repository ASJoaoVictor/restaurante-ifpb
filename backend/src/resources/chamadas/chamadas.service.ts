import { forwardRef, Inject, Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common'
import { and, asc, count, countDistinct, desc, eq, getTableColumns, InferInsertModel, or, SQL, sql } from 'drizzle-orm'
import { PgColumn } from 'drizzle-orm/pg-core'
import { DRIZZLE } from '../../drizzle/drizzle.module'
import { DrizzleDB } from '../../drizzle/drizzle.types'
import { alunos, chamadas, cursos, InscricaoStatus, inscricoes, turmas, users } from '../../drizzle/schemas'
import { withPagination } from '../../utils/pagination'
import { AlunosService } from '../alunos/alunos.service'
import { CursosService } from '../cursos/cursos.service'
import { InscricoesService } from '../inscricoes/inscricoes.service'
import { RefeicoesService } from '../refeicoes/refeicoes.service'
import { TurmasService } from '../turmas/turmas.service'
import { UsersService } from '../users/users.service'
import { ChamadasAutomacaoService } from './chamadas-automacao.service'
import { ChamadaQueryOptionsDto } from './dto/chamada.dto'
import { ChamadaAluno } from './entities/chamada.entity'

@Injectable()
export class ChamadasService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    @Inject(forwardRef(() => ChamadasAutomacaoService))
    private readonly chamadasAutomacaoService: ChamadasAutomacaoService,
    @Inject(forwardRef(() => AlunosService)) private readonly alunosService: AlunosService,
    @Inject(forwardRef(() => RefeicoesService)) private readonly refeicoesService: RefeicoesService
  ) {}

  static searchFields: PgColumn[] = [chamadas.nome, chamadas.criadoPor, chamadas.createdAt, chamadas.updatedAt]

  static orderingFields = [
    'nome',
    'vagas',
    'totalInscritos',
    'status',
    'turno',
    'priorizarMesmoTurno',
    'data',
    'dataHoraAbertura',
    'dataHoraFechamento',
    'dataHoraDivulgacaoResultado',
    'dataHoraFinalizacao',
    'dataHoraEncerramento',
    'createdAt',
    'updatedAt'
  ] as const

  static orderingFieldsMap: Record<(typeof ChamadasService.orderingFields)[number], PgColumn | SQL> = {
    nome: chamadas.nome,
    data: chamadas.data,
    status: ChamadasService.getChamadasOrder(),
    vagas: chamadas.vagas,
    totalInscritos: countDistinct(inscricoes.alunoId),
    turno: chamadas.turno,
    priorizarMesmoTurno: chamadas.priorizarMesmoTurno,
    dataHoraAbertura: sql`coalesce(${chamadas.dataHoraAberturaReal}, ${chamadas.dataHoraAbertura})`,
    dataHoraFechamento: sql`coalesce(${chamadas.dataHoraFechamentoReal}, ${chamadas.dataHoraFechamento})`,
    dataHoraDivulgacaoResultado: sql`coalesce(${chamadas.dataHoraDivulgacaoResultadoReal}, ${chamadas.dataHoraDivulgacaoResultado})`,
    dataHoraFinalizacao: sql`coalesce(${chamadas.dataHoraFinalizacaoReal}, ${chamadas.dataHoraFinalizacao})`,
    dataHoraEncerramento: sql`coalesce(${chamadas.dataHoraEncerramentoReal}, ${chamadas.dataHoraEncerramento})`,
    createdAt: chamadas.createdAt,
    updatedAt: chamadas.updatedAt
  }

  async getAll(campusId: string) {
    return await this.db
      .select(ChamadasService.getFlatColumns())
      .from(chamadas)
      .where(eq(chamadas.campusId, campusId))
      .orderBy(desc(chamadas.createdAt))
  }

  async getAllWithPagination(campusId: string, queryOptions: ChamadaQueryOptionsDto) {
    const { page, pageSize, orderBy, orderDirection, search } = queryOptions
    const whereConditions = [eq(chamadas.campusId, campusId)]

    if (search) {
      const searchCondition = or(
        ...ChamadasService.searchFields.map((field) => sql`unaccent(${field}::text) ILIKE unaccent(${`%${search}%`})`)
      )
      whereConditions.push(searchCondition!)
    }

    const query = this.db
      .select({
        ...ChamadasService.getFlatColumns(),
        totalInscritos: countDistinct(inscricoes.alunoId)
      })
      .from(chamadas)
      .leftJoin(inscricoes, eq(inscricoes.chamadaId, chamadas.id))
      .groupBy(chamadas.id)
      .where(and(...whereConditions))

    if (orderBy) {
      const orderFn = orderDirection === 'desc' ? desc : asc
      query.orderBy(orderFn(ChamadasService.orderingFieldsMap[orderBy]))
    }
    const countQuery = this.db
      .select({ count: count() })
      .from(chamadas)
      .where(and(...whereConditions))

    return withPagination(query.$dynamic(), countQuery.$dynamic(), page, pageSize)
  }

  async getRecent(campusId: string) {
    return await this.db
      .select({
        ...ChamadasService.getFlatColumns(),
        totalInscritos: countDistinct(inscricoes.alunoId)
      })
      .from(chamadas)
      .leftJoin(inscricoes, eq(inscricoes.chamadaId, chamadas.id))
      .where(eq(chamadas.campusId, campusId))
      .groupBy(chamadas.id)
      .limit(5)
      .orderBy(ChamadasService.getChamadasOrder())
  }

  async listaAprovados(chamadaId: string, campusId: string, userId: string) {
    const [chamada] = await this.db
      .select(ChamadasService.getAlunoColumns())
      .from(chamadas)
      .where(and(eq(chamadas.id, chamadaId), eq(chamadas.campusId, campusId)))
      .orderBy(desc(chamadas.createdAt))

    if (!chamada) return null

    if (!chamada.resultadoDivulgado) {
      throw new PreconditionFailedException('O resultado desta chamada ainda não foi divulgado')
    }

    const usuarios = await this.db
      .select({
        id: users.id,
        name: users.name,
        souEu: sql<boolean>`CASE WHEN ${users.id} = ${userId} THEN true ELSE false END`
      })
      .from(inscricoes)
      .innerJoin(alunos, eq(alunos.id, inscricoes.alunoId))
      .innerJoin(users, eq(users.id, alunos.usuarioId))
      .where(and(eq(inscricoes.chamadaId, chamada.id), eq(inscricoes.status, 'aceita')))
      .orderBy(asc(users.name))

    const [minhaInscricao] = await this.db
      .select(InscricoesService.getAlunoColumns())
      .from(inscricoes)
      .innerJoin(alunos, eq(alunos.id, inscricoes.alunoId))
      .where(and(eq(inscricoes.chamadaId, chamada.id), eq(alunos.usuarioId, userId)))
      .orderBy(asc(inscricoes.createdAt))

    return {
      chamada,
      usuarios,
      minhaInscricao: minhaInscricao || null
    }
  }

  async getOne(id: string, campusId: string) {
    const [chamada] = await this.db
      .select(ChamadasService.getFlatColumns())
      .from(chamadas)
      .where(and(eq(chamadas.id, id), eq(chamadas.campusId, campusId)))

    return chamada || null
  }

  async getOneWithInscricoes(chamadaId: string, campusId: string) {
    const [chamada] = await this.db
      .select(ChamadasService.getFlatColumns())
      .from(chamadas)
      .where(and(eq(chamadas.id, chamadaId), eq(chamadas.campusId, campusId)))

    if (!chamada) return null

    const inscricoesAlunos = await this.db
      .select({
        inscricao: InscricoesService.getFlatColumns(),
        aluno: AlunosService.getFlatColumns(),
        usuario: UsersService.getFlatColumns(),
        turma: TurmasService.getFlatColumns(),
        curso: CursosService.getFlatColumns()
      })
      .from(inscricoes)
      .innerJoin(alunos, eq(inscricoes.alunoId, alunos.id))
      .innerJoin(users, eq(users.id, alunos.usuarioId))
      .leftJoin(chamadas, eq(chamadas.id, inscricoes.chamadaId))
      .leftJoin(turmas, eq(turmas.id, alunos.turmaId))
      .leftJoin(cursos, eq(cursos.id, turmas.cursoId))
      .where(eq(inscricoes.chamadaId, chamadaId))
      .orderBy(...ChamadasService.getPriorityOrder())

    return { chamada, inscricoes: inscricoesAlunos }
  }

  async getPresenca(chamadaId: string, campusId: string) {
    const [chamada] = await this.db
      .select(ChamadasService.getFlatColumns())
      .from(chamadas)
      .where(and(eq(chamadas.id, chamadaId), eq(chamadas.campusId, campusId)))

    if (!chamada) return null

    const queryBase = this.db
      .select({
        inscricao: InscricoesService.getFlatColumns(),
        aluno: AlunosService.getFlatColumns(),
        usuario: UsersService.getFlatColumns(),
        turma: TurmasService.getFlatColumns(),
        curso: CursosService.getFlatColumns()
      })
      .from(inscricoes)
      .innerJoin(alunos, eq(inscricoes.alunoId, alunos.id))
      .innerJoin(users, eq(users.id, alunos.usuarioId))
      .leftJoin(turmas, eq(turmas.id, alunos.turmaId))
      .leftJoin(cursos, eq(cursos.id, turmas.cursoId))
      .orderBy(asc(users.name))
      .$dynamic()

    const inscricoesAprovadas = await queryBase.where(
      and(eq(inscricoes.chamadaId, chamadaId), eq(inscricoes.valida, true))
    )

    const outrasInscricoes = await queryBase.where(
      and(eq(inscricoes.chamadaId, chamadaId), eq(inscricoes.valida, false), eq(inscricoes.emListaEspera, false))
    )

    const listaDeEspera = await queryBase.where(
      and(eq(inscricoes.chamadaId, chamadaId), eq(inscricoes.emListaEspera, true))
    )

    return { chamada, inscricoesAprovadas, outrasInscricoes, listaDeEspera }
  }

  async create(campusId: string, data: Omit<InferInsertModel<typeof chamadas>, 'campusId'>, agendar = true) {
    const [result] = await this.db
      .insert(chamadas)
      .values({ ...data, campusId })
      .returning(ChamadasService.getFlatColumns())

    if (agendar) void this.chamadasAutomacaoService.agendarAutomacaoChamada(result)

    if (!result) return null
    return result
  }

  async update(id: string, campusId: string, data: Partial<InferInsertModel<typeof chamadas>>, agendar = true) {
    const [result] = await this.db
      .update(chamadas)
      .set(data)
      .where(and(eq(chamadas.id, id), eq(chamadas.campusId, campusId)))
      .returning(ChamadasService.getFlatColumns())

    if (agendar) void this.chamadasAutomacaoService.agendarAutomacaoChamada(result)

    if (!result) return null
    return result
  }

  async remove(id: string, campusId: string) {
    const [result] = await this.db
      .delete(chamadas)
      .where(and(eq(chamadas.id, id), eq(chamadas.campusId, campusId)))
      .returning(ChamadasService.getFlatColumns())

    if (!result) return null
    return result
  }

  async count(campusId: string) {
    const [{ count: total }] = await this.db
      .select({ count: count() })
      .from(chamadas)
      .where(eq(chamadas.campusId, campusId))

    return total
  }

  async dashboard(userId: string, campusId: string) {
    const aluno = await this.alunosService.getOneByUserId(userId, campusId)
    if (!aluno) throw new NotFoundException('Aluno não encontrado')

    const refeicoesRestritas = await this.refeicoesService.refeicoesRestritas(aluno.id)

    const chamadaQueryBase = this.db
      .select({
        chamada: ChamadasService.getAlunoColumns(),
        inscricao: {
          ...InscricoesService.getAlunoColumns(),

          // Status é pendente enquanto o resultado não for divulgado
          status: sql<InscricaoStatus>`CASE WHEN ${chamadas.resultadoDivulgado} = true THEN ${inscricoes.status} ELSE 'pendente' END`
        }
      })
      .from(chamadas)
      .innerJoin(alunos, eq(alunos.usuarioId, userId)) // Inner join, pois se o aluno não existir, não retorna nada
      .innerJoin(users, eq(users.id, alunos.usuarioId)) // Pega o usuário para poder pegar o campusId dele
      .leftJoin(
        inscricoes, // Pega a inscrição do aluno logado, se houver
        and(
          eq(chamadas.id, inscricoes.chamadaId), // Pega inscrições pelo ID da chamada
          eq(inscricoes.alunoId, aluno.id) // Filtra as inscrições pelo ID do aluno
        )
      )
      .$dynamic()

    const chamadasAbertas = await chamadaQueryBase
      .where(
        and(
          eq(chamadas.campusId, users.campusId), // Filtra chamadas pelo campus do usuário
          eq(chamadas.status, 'aberta') // Pega somente as chamadas abertas
        )
      )
      .orderBy(sql`${chamadas.dataHoraFechamento} ASC NULLS LAST`) // As chamadas mais perto de fechar serão as primeiras

    const chamadasFechadas = await chamadaQueryBase
      .where(
        and(
          eq(chamadas.campusId, users.campusId), // Filtra chamadas pelo campus do usuário
          or(
            // Pega somente as chamadas fechadas (em análise ou divulgadas)
            eq(chamadas.status, 'fechada'),
            eq(chamadas.status, 'divulgada')
          )
        )
      )
      .orderBy(
        sql`${chamadas.dataHoraDivulgacaoResultadoReal} DESC NULLS LAST`, // As chamadas com resultado divulgado serão as primeiras
        desc(chamadas.dataHoraFechamentoReal)
      )

    const chamadasAnteriores = await chamadaQueryBase
      .where(
        and(
          eq(chamadas.campusId, users.campusId), // Filtra chamadas pelo campus do usuário
          eq(chamadas.estaFinalizada, true) // Pega somente as chamadas finalizadas
        )
      )
      .orderBy(desc(chamadas.dataHoraFinalizacaoReal)) // As chamadas mais recentemente finalizadas serão as primeiras
      .limit(12)

    return {
      chamadasAbertas,
      chamadasFechadas,
      chamadasAnteriores,
      refeicoesRestritas
    }
  }

  static getPriorityOrder() {
    return [
      // Inscritos pelo SUAP
      desc(inscricoes.suap),

      // Alunos com necessidades educacionais especiais
      desc(alunos.possuiNEE),

      // Alunos do mesmo turno
      sql`(${chamadas.priorizarMesmoTurno} = true AND ${turmas.turno} = ${chamadas.turno}) DESC NULLS LAST`,

      // Alunos com aula no contraturno
      sql`(${inscricoes.temAulaContraturno} = true AND ${inscricoes.comprovanteContraturnoStatus} = 'aceito') DESC NULLS LAST`,

      // Ordem de inscrição
      asc(inscricoes.dataHoraInscricao),

      // ID da inscrição (para evitar ordenação aleatória em caso de empate)
      asc(inscricoes.id)
    ]
  }

  static getChamadasOrder() {
    return sql`
      CASE ${chamadas.status}
        WHEN 'finalizada' THEN 1
        WHEN 'divulgada' THEN 2
        WHEN 'fechada' THEN 3
        WHEN 'aberta' THEN 4
        WHEN 'pendente' THEN 5
        WHEN 'encerrada' THEN 6
        ELSE 7
      END,
      CASE WHEN ${chamadas.estaFinalizada} = true THEN ${chamadas.data} END DESC,
      CASE WHEN ${chamadas.estaFinalizada} != true THEN ${chamadas.data} END ASC,
      ${chamadas.createdAt}
    `
  }

  static getFlatColumns() {
    const { ...columns } = getTableColumns(chamadas)
    return columns
  }

  static getAlunoColumns() {
    return {
      id: chamadas.id,
      refeicaoId: chamadas.refeicaoId,
      data: chamadas.data,
      nome: chamadas.nome,
      vagas: chamadas.vagas,
      dataHoraAbertura: chamadas.dataHoraAbertura,
      dataHoraFechamento: chamadas.dataHoraFechamento,
      dataHoraDivulgacaoResultado: chamadas.dataHoraDivulgacaoResultado,
      dataHoraFinalizacao: chamadas.dataHoraFinalizacao,
      dataHoraEncerramento: chamadas.dataHoraEncerramento,
      dataHoraAberturaReal: chamadas.dataHoraAberturaReal,
      dataHoraFechamentoReal: chamadas.dataHoraFechamentoReal,
      dataHoraDivulgacaoResultadoReal: chamadas.dataHoraDivulgacaoResultadoReal,
      dataHoraFinalizacaoReal: chamadas.dataHoraFinalizacaoReal,
      dataHoraEncerramentoReal: chamadas.dataHoraEncerramentoReal,
      status: chamadas.status,
      estaAberta: chamadas.estaAberta,
      estaFechada: chamadas.estaFechada,
      resultadoDivulgado: chamadas.resultadoDivulgado,
      estaFinalizada: chamadas.estaFinalizada,
      estaEncerrada: chamadas.estaEncerrada,
      podeInscrever: chamadas.podeInscrever,
      podeCancelarInscricao: chamadas.podeCancelarInscricao
    } satisfies Record<keyof ChamadaAluno, unknown>
  }
}
