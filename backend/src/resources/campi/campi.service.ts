import { Inject, Injectable } from '@nestjs/common'
import { asc, count, eq, getTableColumns, InferInsertModel } from 'drizzle-orm'
import { DRIZZLE } from '../../drizzle/drizzle.module'
import { DrizzleDB } from '../../drizzle/drizzle.types'
import { campi } from '../../drizzle/schemas'
import { MyCampus } from './entities/campus.entity'

@Injectable()
export class CampiService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async getAll() {
    return await this.db.select(CampiService.getFlatColumns()).from(campi).orderBy(asc(campi.nome))
  }

  async getOne(id: string) {
    const [result] = await this.db.select(CampiService.getFlatColumns()).from(campi).where(eq(campi.id, id))
    if (!result) return null
    return result
  }

  async create(data: InferInsertModel<typeof campi>) {
    const [result] = await this.db.insert(campi).values(data).returning(CampiService.getFlatColumns())
    if (!result) return null
    return result
  }

  async update(id: string, data: Partial<InferInsertModel<typeof campi>>) {
    const [result] = await this.db.update(campi).set(data).where(eq(campi.id, id)).returning(CampiService.getFlatColumns())
    if (!result) return null
    return result
  }

  async remove(id: string) {
    const [result] = await this.db.delete(campi).where(eq(campi.id, id)).returning(CampiService.getFlatColumns())
    if (!result) return null
    return result
  }

  async count() {
    const [{ count: total }] = await this.db.select({ count: count() }).from(campi)
    return total
  }

  async getMyCampus(id: string) {
    const [result] = await this.db.select(CampiService.getMyColumns()).from(campi).where(eq(campi.id, id))
    if (!result) return null
    return result
  }

  static getFlatColumns() {
    const { ...columns } = getTableColumns(campi)
    return columns
  }

  static getMyColumns() {
    return {
      id: campi.id,
      nome: campi.nome,
      cidade: campi.cidade,
      estado: campi.estado,
      maximoDeFaltas: campi.maximoDeFaltas,
      diasDeSuspensao: campi.diasDeSuspensao
    } satisfies Record<keyof MyCampus, unknown>
  }
}
