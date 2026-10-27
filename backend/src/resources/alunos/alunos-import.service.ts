import { BadRequestException, Inject, Injectable, Logger, UnprocessableEntityException } from '@nestjs/common'
import { and, eq, InferInsertModel, notInArray } from 'drizzle-orm'
import _ from 'lodash'
import z from 'zod'
import { DRIZZLE } from '../../drizzle/drizzle.module'
import { DrizzleDB } from '../../drizzle/drizzle.types'
import { alunos, cursos, turmas, users } from '../../drizzle/schemas'
import { sheetToJson } from '../../utils/sheets'
import { alunoSchema } from './alunos-import.schema'

@Injectable()
export class AlunosImportService {
  private readonly logger = new Logger(AlunosImportService.name)

  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  /**
   * Importa alunos de um arquivo Excel para o sistema
   * @param campusId ID do campus onde os alunos serão cadastrados
   * @param file Arquivo Excel com os dados dos alunos
   * @param excluirAlunosNaoListados Se true, remove alunos que não estão no arquivo atual
   * @returns Estatísticas da importação
   */
  async importarAlunos(campusId: string, file: Express.Multer.File, excluirAlunosNaoListados: boolean) {
    // Extrai dados do arquivo Excel
    const alunosJSON = sheetToJson(file.buffer, this.logger)

    // Valida e transforma os dados em formato padronizado
    const parsedAlunos = this.parseAlunos(alunosJSON)

    // Filtra apenas alunos com situação "Matriculado"
    const alunosMatriculados = this.filtrarAlunosMatriculados(parsedAlunos)

    // Valida se cursos e turmas existem no sistema
    const turmaIds = await this.validarTurmas(alunosMatriculados)

    // Processa os alunos no banco de dados
    const { alunosRemovidos, alunosSemEmailAcademico } = await this.processarAlunos(
      alunosMatriculados,
      turmaIds,
      campusId,
      excluirAlunosNaoListados
    )

    return {
      alunosImportados: alunosMatriculados.length,
      alunosNaoMatriculados: parsedAlunos.length - alunosMatriculados.length,
      alunosRemovidos,
      alunosSemEmailAcademico
    }
  }

  /**
   * Filtra apenas alunos matriculados (situação atual e último período)
   */
  private filtrarAlunosMatriculados(alunos: ParsedAluno[]) {
    return alunos.filter((aluno) => aluno.situacao === 'Matriculado' && aluno.situacaoUltimoPeriodo === 'Matriculado')
  }

  /**
   * Valida e transforma os dados brutos em objetos ParsedAluno
   */
  private parseAlunos(dados: unknown[]): ParsedAluno[] {
    try {
      const alunosValidados = z.array(alunoSchema).parse(dados)
      return this.transformarDadosAlunos(alunosValidados)
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw new UnprocessableEntityException(this.formatarErrosValidacao(err, dados))
      }
      throw err
    }
  }

  /**
   * Transforma dados validados em formato padronizado do sistema
   */
  private transformarDadosAlunos(alunosValidados: z.infer<typeof alunoSchema>[]) {
    return alunosValidados.map((aluno) => {
      // Separa cidade e estado do campo "Cidade - UF"
      const [cidade, estado] = (aluno['Cidade do endereço'] || '').split(' - ')

      return {
        matricula: aluno['Matrícula'],
        nome: aluno.Nome,
        curso: aluno.Curso,
        situacao: aluno['Situação'],
        situacaoUltimoPeriodo: aluno['Situação no último período'],
        cidade: cidade || '',
        estado: estado || '',
        emailAcademico: aluno['E-mail acadêmico'],
        periodoAtual: aluno['Período atual'],
        telefone: aluno.Telefone,
        turmaUltimoPeriodo: aluno['Turma do último período']
      }
    })
  }

  /**
   * Formata erros de validação em mensagem legível
   */
  private formatarErrosValidacao(error: z.ZodError, dados: unknown[]) {
    let mensagem = 'Dados de alguns alunos são inválidos:\n'

    for (const issue of error.issues) {
      const [index, ...caminho] = issue.path
      if (typeof index === 'number') {
        const aluno = dados[index] as any
        mensagem += `• ${aluno.Nome}: [${caminho.join('.')}] ${issue.message}\n`
      }
    }

    return mensagem
  }

  /**
   * Valida se todos os cursos dos alunos existem no sistema
   * @returns Mapa de número do curso -> ID do curso
   */
  private async validarCursos(alunos: ParsedAluno[]) {
    const numerosCursosUnicos = [...new Set(alunos.map((aluno) => aluno.curso))]
    const cursosMap = new Map<number, string>()
    const cursosFaltando = []

    // Verifica se cada curso existe no banco
    for (const numeroCurso of numerosCursosUnicos) {
      const curso = await this.buscarCursoPorNumero(numeroCurso)

      if (!curso) {
        cursosFaltando.push(numeroCurso)
      } else {
        cursosMap.set(numeroCurso, curso.id)
      }
    }

    if (cursosFaltando.length > 0) {
      this.lancarErroCursosFaltando(cursosFaltando)
    }

    return cursosMap
  }

  private async buscarCursoPorNumero(numeroCurso: number) {
    const [curso] = await this.db
      .select({ id: cursos.id })
      .from(cursos)
      .where(eq(cursos.numeroCurso, numeroCurso))
      .limit(1)

    return curso
  }

  private lancarErroCursosFaltando(cursosFaltando: number[]) {
    const listaCursos = cursosFaltando.map((c) => `• ${c}`).join('\n')
    throw new BadRequestException(
      `Alguns cursos não estão cadastrados no sistema. Cadastre os cursos com os seguintes números manualmente:\n${listaCursos}`
    )
  }

  /**
   * Valida se todas as turmas dos alunos existem no sistema
   * @returns Mapa de chave da turma -> ID da turma
   */
  private async validarTurmas(alunos: ParsedAluno[]) {
    const cursosMap = await this.validarCursos(alunos)

    // Remove duplicatas baseado na chave única da turma
    const turmasUnicas = _.uniqBy(alunos, this.criarChaveTurma)
    const turmasMap = new Map<string, string>()
    const turmasFaltando: Array<{ curso: number; periodoAtual: number; turmaUltimoPeriodo: string }> = []

    for (const aluno of turmasUnicas) {
      const turma = await this.buscarTurma(aluno, cursosMap)

      if (!turma) {
        turmasFaltando.push({
          curso: aluno.curso,
          periodoAtual: aluno.periodoAtual,
          turmaUltimoPeriodo: aluno.turmaUltimoPeriodo || ''
        })
      } else {
        turmasMap.set(this.criarChaveTurma(aluno), turma.id)
      }
    }

    if (turmasFaltando.length > 0) {
      this.lancarErroTurmasFaltando(turmasFaltando)
    }

    return turmasMap
  }

  private async buscarTurma(aluno: ParsedAluno, cursosMap: Map<number, string>) {
    const [turma] = await this.db
      .select({ id: turmas.id })
      .from(turmas)
      .where(
        and(
          eq(turmas.cursoId, cursosMap.get(aluno.curso)!),
          eq(turmas.periodo, aluno.periodoAtual),
          eq(turmas.turma, aluno.turmaUltimoPeriodo || '')
        )
      )
      .limit(1)

    return turma
  }

  private lancarErroTurmasFaltando(
    turmasFaltando: Array<{ curso: number; periodoAtual: number; turmaUltimoPeriodo: string }>
  ) {
    const listaTurmas = turmasFaltando
      .map(({ curso, periodoAtual, turmaUltimoPeriodo }) => {
        return `• Curso: ${curso}, Período: ${periodoAtual}, Turma: ${turmaUltimoPeriodo || '(vazio)'}`
      })
      .sort()
      .join('\n')

    throw new BadRequestException(
      `Algumas turmas não estão cadastradas no sistema. Cadastre as turmas com os seguintes dados manualmente:\n${listaTurmas}`
    )
  }

  /**
   * Processa todos os alunos matriculados: cria/atualiza usuários e alunos
   * Opcionalmente remove alunos que não estão mais na lista
   */
  private async processarAlunos(
    alunosMatriculados: ParsedAluno[],
    turmaIds: Map<string, string>,
    campusId: string,
    excluirAlunosNaoListados: boolean
  ) {
    return await this.db.transaction(async (tx) => {
      const usuariosProcessados: string[] = []
      const alunosSemEmail: ParsedAluno[] = []

      // Processa cada aluno individualmente
      for (const aluno of alunosMatriculados) {
        // Alunos sem email acadêmico são ignorados mas contabilizados
        if (!aluno.emailAcademico) {
          alunosSemEmail.push(aluno)
          continue
        }

        // Cria ou atualiza usuário e aluno
        const usuarioId = await this.criarOuAtualizarUsuario(tx, aluno, campusId)
        await this.criarOuAtualizarAluno(tx, aluno, usuarioId, turmaIds)
        usuariosProcessados.push(usuarioId)
      }

      // Remove alunos antigos se solicitado
      const alunosRemovidos = excluirAlunosNaoListados
        ? await this.removerAlunosAntigos(tx, campusId, usuariosProcessados)
        : 0

      return {
        alunosRemovidos,
        alunosSemEmailAcademico: alunosSemEmail.length
      }
    })
  }

  /**
   * Cria ou atualiza usuário no sistema
   * @returns ID do usuário criado/atualizado
   */
  private async criarOuAtualizarUsuario(tx: Transaction, aluno: ParsedAluno, campusId: string) {
    const dadosUsuario: InferInsertModel<typeof users> = {
      campusId,
      email: aluno.emailAcademico!,
      name: aluno.nome,
      phone: aluno.telefone
    }

    const [{ id }] = await tx
      .insert(users)
      .values(dadosUsuario)
      .onConflictDoUpdate({ target: users.email, set: dadosUsuario })
      .returning({ id: users.id })

    return id
  }

  /**
   * Cria ou atualiza dados do aluno vinculado ao usuário
   */
  private async criarOuAtualizarAluno(
    tx: Transaction,
    aluno: ParsedAluno,
    usuarioId: string,
    turmaIds: Map<string, string>
  ) {
    // Busca ID da turma ou define como null se não encontrar
    const turmaId = turmaIds.get(this.criarChaveTurma(aluno)) || null

    const dadosAluno: InferInsertModel<typeof alunos> = {
      usuarioId,
      matricula: aluno.matricula,
      cidade: aluno.cidade,
      estado: aluno.estado,
      turmaId
    }

    await tx
      .insert(alunos)
      .values(dadosAluno)
      .onConflictDoUpdate({ target: [alunos.usuarioId], set: dadosAluno })
  }

  /**
   * Remove usuários/alunos que não estão mais na lista importada
   * @returns Quantidade de alunos removidos
   */
  private async removerAlunosAntigos(tx: Transaction, campusId: string, usuariosProcessados: string[]) {
    // Remove apenas usuários do tipo 'aluno' do campus que não foram processados
    const result = await tx
      .delete(users)
      .where(and(eq(users.campusId, campusId), eq(users.isAluno, true), notInArray(users.id, usuariosProcessados)))

    return result.rowCount || 0
  }

  /**
   * Cria chave única para identificar uma turma
   * Formato: "numeroCurso-periodo-turma"
   */
  private criarChaveTurma(aluno: ParsedAluno) {
    return [aluno.curso, aluno.periodoAtual, aluno.turmaUltimoPeriodo].join('-')
  }
}

export type ParsedAluno = ReturnType<AlunosImportService['transformarDadosAlunos']>[number]
type Transaction = Parameters<Parameters<AlunosImportService['db']['transaction']>[0]>[0]
