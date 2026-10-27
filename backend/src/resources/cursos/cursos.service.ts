import { Inject, Injectable } from '@nestjs/common'
import { and, asc, count, desc, eq, getTableColumns, InferInsertModel, or, SQL, sql } from 'drizzle-orm'
import { PgColumn } from 'drizzle-orm/pg-core'
import { DRIZZLE } from '../../drizzle/drizzle.module'
import { DrizzleDB } from '../../drizzle/drizzle.types'
import { cursos } from '../../drizzle/schemas'
import { withPagination } from '../../utils/pagination'
import { CursoQueryOptionsDto } from './dto/curso.dto'
import { MyCurso } from './entities/curso.entity'

@Injectable()
export class CursosService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  static searchFields: PgColumn[] = [
    cursos.nome,
    cursos.nomeCurto,
    cursos.numeroCurso,
    cursos.createdAt,
    cursos.updatedAt
  ]

  static orderingFields = ['nome', 'nomeCurto', 'numeroCurso', 'createdAt', 'updatedAt'] as const

  static orderingFieldsMap: Record<(typeof CursosService.orderingFields)[number], PgColumn | SQL> = {
    nome: cursos.nome,
    nomeCurto: cursos.nomeCurto,
    numeroCurso: cursos.numeroCurso,
    createdAt: cursos.createdAt,
    updatedAt: cursos.updatedAt
  }

  async getAll(campusId: string) {
    return await this.db
      .select(CursosService.getFlatColumns())
      .from(cursos)
      .where(eq(cursos.campusId, campusId))
      .orderBy(asc(cursos.nome))
  }

  async getAllWithPagination(campusId: string, queryOptions: CursoQueryOptionsDto) {
    const { page, pageSize, orderBy, orderDirection, search } = queryOptions

    // Condições
    const whereConditions = [eq(cursos.campusId, campusId)]

    // Aplicar pesquisa textual
    if (search) {
      const searchCondition = or(
        ...CursosService.searchFields.map((field) => sql`unaccent(${field}::text) ILIKE unaccent(${`%${search}%`})`)
      )
      whereConditions.push(searchCondition!)
    }

    // Query principal
    const query = this.db
      .select(CursosService.getFlatColumns())
      .from(cursos)
      .where(and(...whereConditions))

    // Aplicar ordenação
    if (orderBy) {
      const orderFn = orderDirection === 'desc' ? desc : asc
      query.orderBy(orderFn(CursosService.orderingFieldsMap[orderBy]))
    }

    // Query de contagem
    const countQuery = this.db
      .select({ count: count() })
      .from(cursos)
      .where(and(...whereConditions))

    return withPagination(query.$dynamic(), countQuery.$dynamic(), page, pageSize)
  }

  async getOne(id: string, campusId: string) {
    const [result] = await this.db
      .select(CursosService.getFlatColumns())
      .from(cursos)
      .where(and(eq(cursos.id, id), eq(cursos.campusId, campusId)))

    if (!result) return null
    return result
  }

  async create(campusId: string, data: Omit<InferInsertModel<typeof cursos>, 'campusId'>) {
    const [result] = await this.db
      .insert(cursos)
      .values({ ...data, campusId })
      .returning(CursosService.getFlatColumns())

    if (!result) return null
    return result
  }

  async update(id: string, campusId: string, data: Partial<InferInsertModel<typeof cursos>>) {
    const [result] = await this.db
      .update(cursos)
      .set(data)
      .where(and(eq(cursos.id, id), eq(cursos.campusId, campusId)))
      .returning(CursosService.getFlatColumns())

    if (!result) return null
    return result
  }

  async remove(id: string, campusId: string) {
    const [result] = await this.db
      .delete(cursos)
      .where(and(eq(cursos.id, id), eq(cursos.campusId, campusId)))
      .returning(CursosService.getFlatColumns())

    if (!result) return null
    return result
  }

  async count(campusId: string) {
    const [{ count: total }] = await this.db
      .select({ count: count() })
      .from(cursos)
      .where(eq(cursos.campusId, campusId))

    return total
  }

  static getFlatColumns() {
    const { ...columns } = getTableColumns(cursos)
    return columns
  }

  static getMyColumns() {
    return {
      id: cursos.id,
      nome: cursos.nome,
      nomeCurto: cursos.nomeCurto,
      numeroCurso: cursos.numeroCurso
    } satisfies Record<keyof MyCurso, unknown>
  }
}
