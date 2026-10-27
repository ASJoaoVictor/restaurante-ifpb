import { Inject, Injectable } from '@nestjs/common'
import { and, asc, count, desc, eq, getTableColumns, InferInsertModel, or, SQL, sql } from 'drizzle-orm'
import { PgColumn } from 'drizzle-orm/pg-core'
import { DRIZZLE } from '../../drizzle/drizzle.module'
import { DrizzleDB } from '../../drizzle/drizzle.types'
import { cursos, turmas } from '../../drizzle/schemas'
import { withPagination } from '../../utils/pagination'
import { TurmaQueryOptionsDto } from './dto/turma.dto'
import { MyTurma } from './entities/turma.entity'

@Injectable()
export class TurmasService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  static searchFields: PgColumn[] = [
    turmas.periodo,
    turmas.turma,
    turmas.diasContraturno,
    turmas.turno,
    turmas.createdAt,
    turmas.updatedAt,
    cursos.nome,
    cursos.nomeCurto,
    cursos.numeroCurso
  ]

  static orderingFields = [
    'periodo',
    'turma',
    'diasContraturno',
    'turno',
    'createdAt',
    'updatedAt',
    'curso_nome'
  ] as const

  static orderingFieldsMap: Record<(typeof TurmasService.orderingFields)[number], PgColumn | SQL> = {
    periodo: turmas.periodo,
    turma: turmas.turma,
    diasContraturno: turmas.diasContraturno,
    turno: turmas.turno,
    createdAt: turmas.createdAt,
    updatedAt: turmas.updatedAt,
    curso_nome: cursos.nome
  }

  async getAll(campusId: string) {
    return await this.db
      .select(TurmasService.getColumns())
      .from(turmas)
      .where(eq(turmas.campusId, campusId))
      .innerJoin(cursos, eq(turmas.cursoId, cursos.id))
      .orderBy(asc(turmas.turma))
  }

  async getAllWithPagination(campusId: string, queryOptions: TurmaQueryOptionsDto) {
    const { page, pageSize, orderBy, orderDirection, search } = queryOptions

    const whereConditions = [eq(turmas.campusId, campusId)]

    if (search) {
      const searchCondition = or(
        ...TurmasService.searchFields.map((field) => sql`unaccent(${field}::text) ILIKE unaccent(${`%${search}%`})`)
      )
      whereConditions.push(searchCondition!)
    }

    const query = this.db
      .select(TurmasService.getColumns())
      .from(turmas)
      .where(and(...whereConditions))
      .innerJoin(cursos, eq(turmas.cursoId, cursos.id))

    // Aplicar ordenação
    if (orderBy) {
      const orderFn = orderDirection === 'desc' ? desc : asc
      query.orderBy(orderFn(TurmasService.orderingFieldsMap[orderBy]))
    }

    const countQuery = this.db
      .select({ count: count() })
      .from(turmas)
      .innerJoin(cursos, eq(turmas.cursoId, cursos.id))
      .where(and(...whereConditions))

    return withPagination(query.$dynamic(), countQuery.$dynamic(), page, pageSize)
  }

  async getOne(id: string, campusId: string) {
    const [result] = await this.db
      .select(TurmasService.getColumns())
      .from(turmas)
      .innerJoin(cursos, eq(turmas.cursoId, cursos.id))
      .where(and(eq(turmas.id, id), eq(turmas.campusId, campusId)))

    if (!result) return null
    return result
  }

  async create(campusId: string, data: Omit<InferInsertModel<typeof turmas>, 'campusId'>) {
    const [result] = await this.db
      .insert(turmas)
      .values({ ...data, campusId })
      .returning({ id: turmas.id })

    return this.getOne(result.id, campusId)
  }

  async update(id: string, campusId: string, data: Partial<InferInsertModel<typeof turmas>>) {
    const [result] = await this.db
      .update(turmas)
      .set(data)
      .where(and(eq(turmas.id, id), eq(turmas.campusId, campusId)))
      .returning({ id: turmas.id })

    return this.getOne(result.id, campusId)
  }

  async remove(id: string, campusId: string) {
    const [result] = await this.db
      .delete(turmas)
      .where(and(eq(turmas.id, id), eq(turmas.campusId, campusId)))
      .returning(TurmasService.getFlatColumns())

    if (!result) return null
    return result
  }

  async count(campusId: string) {
    const [{ count: total }] = await this.db
      .select({ count: count() })
      .from(turmas)
      .where(eq(turmas.campusId, campusId))

    return total
  }

  static getColumns() {
    const { ...columns } = getTableColumns(turmas)
    const { ...cursosColumns } = getTableColumns(cursos)
    return {
      ...columns,
      curso: {
        ...cursosColumns
      }
    } as const
  }

  static getFlatColumns() {
    const { ...columns } = getTableColumns(turmas)
    return columns
  }

  static getMyColumns() {
    return {
      id: turmas.id,
      periodo: turmas.periodo,
      turma: turmas.turma,
      diasContraturno: turmas.diasContraturno
    } satisfies Record<keyof MyTurma, unknown>
  }
}
