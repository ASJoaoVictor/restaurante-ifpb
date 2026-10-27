import { Inject, Injectable } from '@nestjs/common'
import { and, asc, count, desc, eq, getTableColumns, InferInsertModel, or, SQL, sql } from 'drizzle-orm'
import { PgColumn } from 'drizzle-orm/pg-core'
import { DRIZZLE } from '../../drizzle/drizzle.module'
import { DrizzleDB } from '../../drizzle/drizzle.types'
import { alunosRefeicoesRestricao, refeicoes } from '../../drizzle/schemas'
import { withPagination } from '../../utils/pagination'
import { RefeicaoQueryOptionsDto } from './dto/refeicao.dto'

@Injectable()
export class RefeicoesService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  static searchFields: PgColumn[] = [refeicoes.nome, refeicoes.vagas, refeicoes.createdAt, refeicoes.updatedAt]

  static orderingFields = [
    'nome',
    'diaDaSemana',
    'vagas',
    'turno',
    'priorizarMesmoTurno',
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
    'createdAt',
    'updatedAt'
  ] as const

  static orderingFieldsMap: Record<(typeof RefeicoesService.orderingFields)[number], PgColumn | SQL> = {
    nome: refeicoes.nome,
    vagas: refeicoes.vagas,
    turno: refeicoes.turno,
    priorizarMesmoTurno: refeicoes.priorizarMesmoTurno,
    horarioAbertura: refeicoes.horarioAbertura,
    horarioFechamento: refeicoes.horarioFechamento,
    horarioDivulgacaoResultado: refeicoes.horarioDivulgacaoResultado,
    horarioFinalizacao: refeicoes.horarioFinalizacao,
    horarioEncerramento: refeicoes.horarioEncerramento,
    deslocamentoDataAbertura: refeicoes.deslocamentoDataAbertura,
    deslocamentoDataFechamento: refeicoes.deslocamentoDataFechamento,
    deslocamentoDataDivulgacao: refeicoes.deslocamentoDataDivulgacao,
    deslocamentoDataFinalizacao: refeicoes.deslocamentoDataFinalizacao,
    deslocamentoDataEncerramento: refeicoes.deslocamentoDataEncerramento,
    diaDaSemana: refeicoes.diaDaSemana,
    createdAt: refeicoes.createdAt,
    updatedAt: refeicoes.updatedAt
  }

  async getAll(campusId: string) {
    return await this.db
      .select(RefeicoesService.getFlatColumns())
      .from(refeicoes)
      .where(eq(refeicoes.campusId, campusId))
      .orderBy(asc(refeicoes.nome))
  }

  async getAllWithPagination(campusId: string, queryOptions: RefeicaoQueryOptionsDto) {
    const { page, pageSize, orderBy, orderDirection, search } = queryOptions

    const whereConditions = [eq(refeicoes.campusId, campusId)]

    if (search) {
      const searchCondition = or(
        ...RefeicoesService.searchFields.map((field) => sql`unaccent(${field}::text) ILIKE unaccent(${`%${search}%`})`)
      )
      whereConditions.push(searchCondition!)
    }

    const query = this.db
      .select(RefeicoesService.getFlatColumns())
      .from(refeicoes)
      .where(and(...whereConditions))

    if (orderBy) {
      const orderFn = orderDirection === 'desc' ? desc : asc
      query.orderBy(orderFn(RefeicoesService.orderingFieldsMap[orderBy]))
    }

    const countQuery = this.db
      .select({ count: count() })
      .from(refeicoes)
      .where(and(...whereConditions))

    return withPagination(query.$dynamic(), countQuery.$dynamic(), page, pageSize)
  }

  async getOne(id: string, campusId: string) {
    const [result] = await this.db
      .select(RefeicoesService.getFlatColumns())
      .from(refeicoes)
      .where(and(eq(refeicoes.id, id), eq(refeicoes.campusId, campusId)))

    if (!result) return null
    return result
  }

  async create(campusId: string, data: Omit<InferInsertModel<typeof refeicoes>, 'campusId'>) {
    const [result] = await this.db
      .insert(refeicoes)
      .values({ ...data, campusId })
      .returning(RefeicoesService.getFlatColumns())

    if (!result) return null
    return result
  }

  async update(id: string, campusId: string, data: Partial<InferInsertModel<typeof refeicoes>>) {
    const [result] = await this.db
      .update(refeicoes)
      .set(data)
      .where(and(eq(refeicoes.id, id), eq(refeicoes.campusId, campusId)))
      .returning(RefeicoesService.getFlatColumns())

    if (!result) return null
    return result
  }

  async remove(id: string, campusId: string) {
    const [result] = await this.db
      .delete(refeicoes)
      .where(and(eq(refeicoes.id, id), eq(refeicoes.campusId, campusId)))
      .returning(RefeicoesService.getFlatColumns())

    if (!result) return null
    return result
  }

  async count(campusId: string) {
    const [{ count: total }] = await this.db
      .select({ count: count() })
      .from(refeicoes)
      .where(eq(refeicoes.campusId, campusId))

    return total
  }

  async temRestricao(refeicaoId: string | null, alunoId: string) {
    if (!refeicaoId) return false

    const [{ count: qtd }] = await this.db
      .select({ count: count() })
      .from(alunosRefeicoesRestricao)
      .where(and(eq(alunosRefeicoesRestricao.alunoId, alunoId), eq(alunosRefeicoesRestricao.refeicaoId, refeicaoId)))
      .limit(1)

    return qtd > 0
  }

  async refeicoesRestritas(alunoId: string) {
    return await this.db
      .select(RefeicoesService.getAlunoColumns())
      .from(refeicoes)
      .innerJoin(alunosRefeicoesRestricao, eq(alunosRefeicoesRestricao.refeicaoId, refeicoes.id))
      .where(eq(alunosRefeicoesRestricao.alunoId, alunoId))
  }

  static getFlatColumns() {
    const { ...columns } = getTableColumns(refeicoes)
    return columns
  }

  static getAlunoColumns() {
    return {
      id: refeicoes.id,
      nome: refeicoes.nome
    }
  }
}
