import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { createPrivateKey, sign } from 'crypto'
import dayjs from 'dayjs'
import { and, asc, count, desc, eq, getTableColumns, inArray, or, SQL, sql } from 'drizzle-orm'
import { PgColumn, PgTransaction } from 'drizzle-orm/pg-core'
import { env } from '../../config/env.config'
import { DRIZZLE } from '../../drizzle/drizzle.module'
import { DrizzleDB } from '../../drizzle/drizzle.types'
import {
  alunos,
  alunosRefeicoesRestricao,
  campi,
  cursos,
  inscricoes,
  refeicoes,
  turmas,
  users
} from '../../drizzle/schemas'
import { preferenciasNotificacoes } from '../../drizzle/schemas/preferencia-notificacao.schema'
import { withPagination } from '../../utils/pagination'
import { NotificacoesService } from '../notificacoes/notificacoes.service'
import { RefeicoesService } from '../refeicoes/refeicoes.service'
import { AlunoQueryOptionsDto, ControleDeFaltasAlunoDto, CreateAlunoDto, UpdateAlunoDto } from './dto/aluno.dto'
import { CreatePreferenciaNotificacaoDto } from './dto/preferencia-notificacao.dto'
import { Aluno, MyAluno } from './entities/aluno.entity'

@Injectable()
export class AlunosService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    @Inject(forwardRef(() => NotificacoesService)) private readonly notificacoesService: NotificacoesService
  ) {}

  static searchFields: PgColumn[] = [
    users.name,
    users.phone,
    users.email,
    alunos.matricula,
    alunos.createdAt,
    alunos.updatedAt,
    turmas.periodo,
    turmas.turma,
    turmas.diasContraturno,
    turmas.turno,
    cursos.nome,
    cursos.nomeCurto,
    cursos.numeroCurso
  ]

  static orderingFields = [
    'usuario_name',
    'matricula',
    'faltas',
    'usuario_email',
    'usuario_phone',
    'curso_nomeCurto',
    'cidade',
    'estado',
    'createdAt',
    'updatedAt'
  ] as const

  static orderingFieldsMap: Record<(typeof AlunosService.orderingFields)[number], PgColumn | SQL> = {
    usuario_name: users.name,
    usuario_email: users.email,
    usuario_phone: users.phone,
    matricula: alunos.matricula,
    faltas: alunos.faltas,
    cidade: alunos.cidade,
    estado: alunos.estado,
    createdAt: alunos.createdAt,
    updatedAt: alunos.updatedAt,
    curso_nomeCurto: cursos.nomeCurto
  }

  async getAll(campusId: string) {
    return await this.db
      .select(AlunosService.getColumns())
      .from(alunos)
      .innerJoin(users, eq(alunos.usuarioId, users.id))
      .where(eq(users.campusId, campusId))
      .orderBy(asc(users.name))
  }

  async getAllWithPagination(campusId: string, queryOptions: AlunoQueryOptionsDto) {
    const { page, pageSize, orderBy, orderDirection, search } = queryOptions

    const whereConditions = [eq(users.campusId, campusId)]

    // Aplicar pesquisa textual
    if (search) {
      const searchCondition = or(
        ...AlunosService.searchFields.map((field) => sql`unaccent(${field}::text) ILIKE unaccent(${`%${search}%`})`)
      )
      whereConditions.push(searchCondition!)
    }

    const query = this.db
      .select({
        ...AlunosService.getColumns(),
        refeicoesRestritas: sql<string[]>`(
          SELECT COALESCE(ARRAY_AGG(CAST(${alunosRefeicoesRestricao.refeicaoId} AS TEXT)), '{}'::TEXT[])
          FROM ${alunosRefeicoesRestricao}
          WHERE ${alunosRefeicoesRestricao.alunoId} = ${alunos.id}
        )`
      })
      .from(alunos)
      .innerJoin(users, eq(alunos.usuarioId, users.id))
      .leftJoin(turmas, eq(alunos.turmaId, turmas.id))
      .leftJoin(cursos, eq(turmas.cursoId, cursos.id))
      .where(and(...whereConditions))

    if (orderBy) {
      const orderFn = orderDirection === 'desc' ? desc : asc
      query.orderBy(orderFn(AlunosService.orderingFieldsMap[orderBy]))
    }

    const countQuery = this.db
      .select({ count: count() })
      .from(alunos)
      .innerJoin(users, eq(alunos.usuarioId, users.id))
      .leftJoin(turmas, eq(alunos.turmaId, turmas.id))
      .leftJoin(cursos, eq(turmas.cursoId, cursos.id))
      .where(and(...whereConditions))

    return withPagination(query.$dynamic(), countQuery.$dynamic(), page, pageSize)
  }

  async getOne(id: string, campusId: string) {
    const [result] = await this.db
      .select({
        ...AlunosService.getColumns(),
        refeicoesRestritas: sql<string[]>`(
          SELECT COALESCE(ARRAY_AGG(CAST(${alunosRefeicoesRestricao.refeicaoId} AS TEXT)), '{}'::TEXT[])
          FROM ${alunosRefeicoesRestricao}
          WHERE ${alunosRefeicoesRestricao.alunoId} = ${alunos.id}
        )`
      })
      .from(alunos)
      .innerJoin(users, eq(alunos.usuarioId, users.id))
      .leftJoin(turmas, eq(alunos.turmaId, turmas.id))
      .leftJoin(cursos, eq(turmas.cursoId, cursos.id))
      .where(and(eq(alunos.id, id), eq(users.campusId, campusId)))

    if (!result) return null
    return result
  }

  async getDetalhes(id: string, campusId: string) {
    const [result] = await this.db
      .select({
        ...AlunosService.getColumns(),
        refeicoesRestritas: sql<string[]>`(
          SELECT COALESCE(ARRAY_AGG(CAST(${alunosRefeicoesRestricao.refeicaoId} AS TEXT)), '{}'::TEXT[])
          FROM ${alunosRefeicoesRestricao}
          WHERE ${alunosRefeicoesRestricao.alunoId} = ${alunos.id}
        )`,
        inscricoes: count(inscricoes.id)
      })
      .from(alunos)
      .innerJoin(users, eq(alunos.usuarioId, users.id))
      .leftJoin(turmas, eq(alunos.turmaId, turmas.id))
      .leftJoin(cursos, eq(turmas.cursoId, cursos.id))
      .leftJoin(inscricoes, eq(inscricoes.alunoId, alunos.id))
      .where(and(eq(alunos.id, id), eq(users.campusId, campusId)))
      .groupBy(alunos.id, users.id, turmas.id, cursos.id)

    if (!result) return null
    return result
  }

  async create(campusId: string, { usuario, refeicoesRestritas, ...data }: CreateAlunoDto) {
    const result = await this.db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({ ...usuario, campusId })
        .returning({ id: users.id })

      const [result] = await tx
        .insert(alunos)
        .values({ ...data, usuarioId: user.id })
        .returning({ id: alunos.id })

      await this.definirRefeicoesRestritas(tx, result.id, refeicoesRestritas)

      return result
    })

    return this.getOne(result.id, campusId)
  }

  async update(id: string, campusId: string, { usuario, refeicoesRestritas, ...data }: UpdateAlunoDto) {
    await this.db.transaction(async (tx) => {
      if (usuario) {
        const [{ usuarioId }] = await tx.select({ usuarioId: alunos.usuarioId }).from(alunos).where(eq(alunos.id, id))
        await tx.update(users).set(usuario).where(eq(users.id, usuarioId))
      }

      await tx
        .update(alunos)
        .set(data)
        .where(and(eq(alunos.id, id), this.whereCampus(campusId)))

      if (refeicoesRestritas) {
        await this.definirRefeicoesRestritas(tx, id, refeicoesRestritas)
      }
    })

    return this.getOne(id, campusId)
  }

  async remove(id: string, campusId: string) {
    const original = await this.getOne(id, campusId)
    if (!original) return null

    await this.db.delete(alunos).where(and(eq(alunos.id, id)))
    await this.db.delete(users).where(eq(users.id, original.usuarioId))

    return original
  }

  async count(campusId: string) {
    const [{ count: total }] = await this.db
      .select({ count: count() })
      .from(alunos)
      .innerJoin(users, eq(alunos.usuarioId, users.id))
      .where(eq(users.campusId, campusId))

    return total
  }

  async getOneByUserId(userId: string, campusId: string) {
    const [result] = await this.db
      .select(AlunosService.getColumns())
      .from(alunos)
      .innerJoin(users, eq(alunos.usuarioId, users.id))
      .leftJoin(turmas, eq(alunos.turmaId, turmas.id))
      .leftJoin(cursos, eq(turmas.cursoId, cursos.id))
      .where(and(eq(users.id, userId), eq(users.campusId, campusId)))

    if (!result) return null
    return result
  }

  async getOneByMatricula(matricula: string, campusId: string) {
    const [result] = await this.db
      .select(AlunosService.getColumns())
      .from(alunos)
      .innerJoin(users, eq(alunos.usuarioId, users.id))
      .leftJoin(turmas, eq(alunos.turmaId, turmas.id))
      .leftJoin(cursos, eq(turmas.cursoId, cursos.id))
      .where(and(eq(alunos.matricula, matricula), eq(users.campusId, campusId)))

    if (!result) return null
    return result
  }

  async getQRCode(userId: string, campusId: string) {
    const [aluno] = await this.db
      .select({ id: alunos.id })
      .from(alunos)
      .innerJoin(users, eq(alunos.usuarioId, users.id))
      .where(and(eq(users.id, userId), eq(users.campusId, campusId)))

    if (!aluno) {
      throw new NotFoundException(`Aluno with user id '${userId}' not found`)
    }

    const { id } = aluno
    const signature = this.signQRCode(id)
    return { version: 1, id, signature }
  }

  signQRCode(id: string): string {
    if (!env.QR_CODE_PRIVATE_KEY) return ''
    const text = Buffer.from(id)
    const rawPrivateKey = Buffer.from(env.QR_CODE_PRIVATE_KEY, 'base64')
    const privateKey = createPrivateKey({ key: rawPrivateKey, format: 'der', type: 'pkcs8' })
    const signature = sign(null, text, privateKey)
    return signature.toString('base64')
  }

  async definirFaltas(campusId: string, alunoId: string, data: ControleDeFaltasAlunoDto) {
    const [campus] = await this.db.select().from(campi).where(eq(campi.id, campusId)).limit(1)

    const aluno = await this.getOne(alunoId, campus.id)
    if (!aluno) throw new NotFoundException(`Aluno with id '${alunoId}' not found`)

    if (AlunosService.isSuspenso(aluno)) {
      throw new BadRequestException('Não é permitido definir faltas para um aluno suspenso')
    }

    const suspenso = data.faltas >= campus.maximoDeFaltas
    const faltas = suspenso ? 0 : data.faltas
    const suspensoAte = suspenso ? dayjs().add(campus.diasDeSuspensao, 'day').format('YYYY-MM-DD') : undefined

    await this.db
      .update(alunos)
      .set({ faltas, suspensoAte })
      .where(and(eq(alunos.id, alunoId), this.whereCampus(campus.id)))

    if (suspensoAte) {
      void this.notificacoesService.notificarSuspensao(alunoId)
    } else {
      void this.notificacoesService.notificarFalta(alunoId)
    }

    return this.getOne(alunoId, campus.id)
  }

  async removerSuspensao(campusId: string, alunoId: string) {
    const aluno = await this.getOne(alunoId, campusId)
    if (!aluno) throw new NotFoundException(`Aluno with id '${alunoId}' not found`)

    await this.db
      .update(alunos)
      .set({ suspensoAte: null })
      .where(and(eq(alunos.id, alunoId), this.whereCampus(campusId)))

    return this.getOne(alunoId, campusId)
  }

  async markWelcomeSeen(userId: string, campusId: string) {
    const aluno = await this.getOneByUserId(userId, campusId)
    if (!aluno) throw new NotFoundException(`Aluno with user id '${userId}' not found`)
    await this.db.update(alunos).set({ boasVindas: true }).where(eq(alunos.id, aluno.id))
  }

  async getPreferenciasNotificacoes(userId: string, campusId: string) {
    const aluno = await this.getOneByUserId(userId, campusId)
    if (!aluno) throw new NotFoundException(`Aluno with user id '${userId}' not found`)

    const preferenciasResult = await this.db
      .select()
      .from(preferenciasNotificacoes)
      .where(eq(preferenciasNotificacoes.alunoId, aluno.id))

    const refeicoesResult = await this.db
      .select(RefeicoesService.getAlunoColumns())
      .from(refeicoes)
      .where(eq(refeicoes.campusId, campusId))

    return {
      preferencias: preferenciasResult,
      refeicoes: refeicoesResult
    }
  }

  async configurarNotificacoes(userId: string, campusId: string, data: CreatePreferenciaNotificacaoDto) {
    const aluno = await this.getOneByUserId(userId, campusId)
    if (!aluno) throw new NotFoundException(`Aluno with user id '${userId}' not found`)

    const preferencias = data.notificacoes.map((pref) => ({ ...pref, alunoId: aluno.id }))

    for (const refeicao of preferencias) {
      await this.db
        .insert(preferenciasNotificacoes)
        .values(refeicao)
        .onConflictDoUpdate({
          target: [preferenciasNotificacoes.alunoId, preferenciasNotificacoes.refeicaoId],
          set: refeicao
        })
    }

    await this.db.update(alunos).set({ notificacoesConfiguradas: true }).where(eq(alunos.id, aluno.id))
  }

  async definirRefeicoesRestritas(tx: PgTransaction<any, any, any>, alunoId: string, refeicoesRestritas: string[]) {
    await tx.delete(alunosRefeicoesRestricao).where(eq(alunosRefeicoesRestricao.alunoId, alunoId))
    if (refeicoesRestritas.length === 0) return
    await tx.insert(alunosRefeicoesRestricao).values(refeicoesRestritas.map((refeicaoId) => ({ alunoId, refeicaoId })))
  }

  whereCampus(campusId: string) {
    return inArray(alunos.usuarioId, this.db.select({ id: users.id }).from(users).where(eq(users.campusId, campusId)))
  }

  static getColumns() {
    const { ...columns } = getTableColumns(alunos)
    const { ...usersColumns } = getTableColumns(users)
    const { ...turmasColumns } = getTableColumns(turmas)
    const { ...cursosColumns } = getTableColumns(cursos)
    return {
      ...columns,
      usuario: { ...usersColumns },
      turma: { ...turmasColumns },
      curso: { ...cursosColumns }
    }
  }

  static getFlatColumns() {
    const { ...columns } = getTableColumns(alunos)
    return columns
  }

  static getMyColumns() {
    return {
      id: alunos.id,
      matricula: alunos.matricula,
      faltas: alunos.faltas,
      suspensoAte: alunos.suspensoAte,
      boasVindas: alunos.boasVindas,
      notificacoesConfiguradas: alunos.notificacoesConfiguradas
    } satisfies Record<keyof MyAluno, unknown>
  }

  static isSuspenso(aluno: Pick<Aluno, 'suspensoAte'>) {
    return aluno.suspensoAte && dayjs().isSameOrBefore(aluno.suspensoAte, 'day')
  }
}
