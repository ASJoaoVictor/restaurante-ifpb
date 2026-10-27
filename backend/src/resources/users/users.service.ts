import { Inject, Injectable } from '@nestjs/common'
import { and, asc, count, desc, eq, getTableColumns, InferInsertModel, not, or, SQL, sql } from 'drizzle-orm'
import { PgColumn } from 'drizzle-orm/pg-core'
import { DRIZZLE } from '../../drizzle/drizzle.module'
import { DrizzleDB } from '../../drizzle/drizzle.types'
import { users } from '../../drizzle/schemas'
import { withPagination } from '../../utils/pagination'
import { MyUser } from './entities/user.entity'
import { UserQueryOptionsDto } from './dto/user.dto'

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  static searchFields: PgColumn[] = [users.name, users.phone, users.email, users.roles]

  static orderingFields = ['name', 'email', 'phone', 'roles', 'createdAt', 'updatedAt'] as const

  static orderingFieldsMap: Record<(typeof UsersService.orderingFields)[number], PgColumn | SQL> = {
    name: users.name,
    email: users.email,
    phone: users.phone,
    roles: users.roles,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt
  }

  async getAll(campusId: string) {
    return await this.db
      .select(UsersService.getFlatColumns())
      .from(users)
      .where(eq(users.campusId, campusId))
      .orderBy(asc(users.name))
  }

  async getAllWithPagination(campusId: string, queryOptions: UserQueryOptionsDto) {
    const { page, pageSize, orderBy, orderDirection, search } = queryOptions

    const whereConditions = [eq(users.campusId, campusId), not(users.isAluno)]

    if (search) {
      const searchCondition = or(
        ...UsersService.searchFields.map((field) => sql`unaccent(${field}::text) ILIKE unaccent(${`%${search}%`})`)
      )
      whereConditions.push(searchCondition!)
    }

    const query = this.db
      .select(UsersService.getFlatColumns())
      .from(users)
      .where(and(...whereConditions))

    // Aplicar ordenação
    if (orderBy) {
      const orderFn = orderDirection === 'desc' ? desc : asc
      query.orderBy(orderFn(UsersService.orderingFieldsMap[orderBy]))
    }

    const countQuery = this.db
      .select({ count: count() })
      .from(users)
      .where(and(...whereConditions))

    return withPagination(query.$dynamic(), countQuery.$dynamic(), page, pageSize)
  }

  async getOne(id: string, campusId: string) {
    const [result] = await this.db
      .select(UsersService.getFlatColumns())
      .from(users)
      .where(and(eq(users.id, id), eq(users.campusId, campusId)))

    if (!result) return null
    return result
  }

  async create(campusId: string, data: Omit<InferInsertModel<typeof users>, 'campusId'>) {
    const [result] = await this.db
      .insert(users)
      .values({ ...data, campusId })
      .returning(UsersService.getFlatColumns())

    if (!result) return null
    return result
  }

  async update(id: string, campusId: string, data: Partial<InferInsertModel<typeof users>>) {
    const [result] = await this.db
      .update(users)
      .set(data)
      .where(and(eq(users.id, id), eq(users.campusId, campusId)))
      .returning(UsersService.getFlatColumns())

    if (!result) return null
    return result
  }

  async remove(id: string, campusId: string) {
    const [result] = await this.db
      .delete(users)
      .where(and(eq(users.id, id), eq(users.campusId, campusId)))
      .returning(UsersService.getFlatColumns())

    if (!result) return null
    return result
  }

  async count(campusId: string) {
    const [{ count: total }] = await this.db.select({ count: count() }).from(users).where(eq(users.campusId, campusId))

    return total
  }

  async getOneWithCredentials(id: string) {
    const [result] = await this.db.select().from(users).where(eq(users.id, id))
    if (!result) return null
    return result
  }

  async getMyUser(id: string) {
    const [result] = await this.db.select(UsersService.getMyColumns()).from(users).where(eq(users.id, id))
    if (!result) return null
    return result
  }

  async getOneByEmailWithCredentials(email: string) {
    const [result] = await this.db.select().from(users).where(eq(users.email, email))
    if (!result) return null
    return result
  }

  static getFlatColumns() {
    const { ...columns } = getTableColumns(users)
    return columns
  }

  static getMyColumns() {
    return {
      id: users.id,
      name: users.name,
      email: users.email,
      roles: users.roles,
      phone: users.phone,
      photoUrl: users.photoUrl,
      campusId: users.campusId,
      isAdmin: users.isAdmin,
      isGestor: users.isGestor,
      isColaborador: users.isColaborador,
      isAluno: users.isAluno
    } satisfies Record<keyof MyUser, unknown>
  }
}
