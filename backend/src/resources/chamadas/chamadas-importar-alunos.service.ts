import { Inject, Injectable, Logger, UnprocessableEntityException } from '@nestjs/common'
import { InferInsertModel } from 'drizzle-orm'
import z from 'zod'
import { DRIZZLE } from '../../drizzle/drizzle.module'
import { DrizzleDB } from '../../drizzle/drizzle.types'
import { inscricoes } from '../../drizzle/schemas'
import { sheetToJson } from '../../utils/sheets'
import { AlunosService } from '../alunos/alunos.service'
import { INSCRICAO_REGEX, inscricaoSUAPSchema } from './alunos-importar.schema'
import { removeAccents } from '../../utils/helpers'

@Injectable()
export class ChamadasImportarAlunosService {
  private readonly logger = new Logger(ChamadasImportarAlunosService.name)

  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly alunosService: AlunosService
  ) {}

  // --- IMPORTAÇÃO DE PLANILHA DO SUAP

  /**
   * Importa as inscrições de um arquivo Excel exportado do SUAP para o sistema
   * @param chamadaId ID da chamada
   * @param campusId ID do campus
   * @param file Arquivo Excel com os dados das inscrições
   */
  async importarInscricoesSUAP(chamadaId: string, campusId: string, file: Express.Multer.File) {
    // Extrai dados do arquivo Excel
    const inscricoesJSON = sheetToJson(file.buffer, this.logger)

    // Valida e transforma os dados em formato padronizado
    const parsedInscricoes = this.parseInscricoesSUAP(inscricoesJSON)

    // Processa as inscrições no banco de dados
    const { errors } = await this.processarInscricoesSUAP(parsedInscricoes, chamadaId, campusId)

    return { errors }
  }

  /**
   * Valida e transforma os dados brutos em objetos ParsedInscricaoSUAP
   */
  private parseInscricoesSUAP(dados: unknown[]) {
    if (dados.length === 0) throw new UnprocessableEntityException('Arquivo está vazio')

    try {
      const inscricoesValidadas = z.array(inscricaoSUAPSchema).parse(dados)
      return this.transformarDadosInscricoesSUAP(inscricoesValidadas)
    } catch (err) {
      if (err instanceof z.ZodError) {
        throw new UnprocessableEntityException(this.formatarErrosValidacaoSUAP(err, dados))
      }
      throw err
    }
  }

  /**
   * Transforma dados validados em formato padronizado do sistema
   */
  private transformarDadosInscricoesSUAP(inscricoesValidadas: z.infer<typeof inscricaoSUAPSchema>[]) {
    return inscricoesValidadas.map((aluno) => {
      const inscricaoMatch = INSCRICAO_REGEX.exec(aluno.inscricao)
      if (!inscricaoMatch) throw new Error('Inscrição inválida')
      const [nome, matricula] = inscricaoMatch.slice(1)

      return {
        nome,
        matricula,
        confirmado: aluno.operacao === 'Confirmacao'
      }
    })
  }

  /**
   * Formata erros de validação em mensagem legível
   */
  private formatarErrosValidacaoSUAP(error: z.ZodError, dados: unknown[]) {
    let mensagem = 'Dados de algumas inscrições são inválidas:\n'

    for (const issue of error.issues) {
      const [index, ...caminho] = issue.path
      if (typeof index === 'number') {
        const aluno = dados[index] as any
        mensagem += `• ${aluno.nome}: [${caminho.join('.')}] ${issue.message}\n`
      }
    }

    return mensagem
  }

  /**
   * Processa todos as inscrições, criando ou atualizando no banco
   */
  private async processarInscricoesSUAP(inscricoesSUAP: ParsedInscricaoSUAP[], chamadaId: string, campusId: string) {
    const errors: string[] = []

    for (const inscricao of inscricoesSUAP) {
      try {
        const aluno = await this.alunosService.getOneByMatricula(inscricao.matricula, campusId)
        if (!aluno) throw new Error(`Aluno com matrícula '${inscricao.matricula}' não encontrado`)

        const dadosInsert: InferInsertModel<typeof inscricoes> = {
          chamadaId,
          alunoId: aluno.id,
          suap: true,
          dataHoraCancelamento: inscricao.confirmado ? null : new Date().toISOString(),
          status: 'aceita',
          dataHoraInscricao: new Date(),
          inseridoPeloColaborador: true
        }

        const dadosUpdate: Partial<InferInsertModel<typeof inscricoes>> = {
          chamadaId,
          alunoId: aluno.id,
          suap: true,
          dataHoraCancelamento: inscricao.confirmado ? null : new Date().toISOString(),
          inseridoPeloColaborador: true
        }

        await this.db
          .insert(inscricoes)
          .values(dadosInsert)
          .onConflictDoUpdate({ target: [inscricoes.alunoId, inscricoes.chamadaId], set: dadosUpdate })
          .returning({ id: inscricoes.id })
      } catch (err) {
        this.logger.error(`Erro ao processar inscrição '${inscricao.matricula}'`, err)
        errors.push(err.message)
      }
    }

    return { errors }
  }

  // --- IMPORTAÇÃO DE PLANILHA DO FORMULÁRIO

  /**
   * Importa as inscrições de um arquivo Excel
   * @param chamadaId ID da chamada
   * @param campusId ID do campus
   * @param file Arquivo Excel com os dados das inscrições
   */
  async importarInscricoes(chamadaId: string, campusId: string, file: Express.Multer.File) {
    // Extrai dados do arquivo Excel
    const inscricoesJSON = sheetToJson(file.buffer, this.logger)

    // Valida e transforma os dados em formato padronizado
    const parsedInscricoes = this.parseInscricoes(inscricoesJSON)

    // Processa as inscrições no banco de dados
    const { errors } = await this.processarInscricoes(parsedInscricoes, chamadaId, campusId)

    return { errors }
  }

  /**
   * Valida e transforma os dados brutos em objetos ParsedInscricaoSUAP
   */
  private parseInscricoes(dados: unknown[]) {
    if (dados.length === 0) throw new UnprocessableEntityException('Arquivo está vazio')

    // Encontra o nome da chave da coluna matrícula
    const matriculaKey = Object.keys(dados[0] as object).find((key) => {
      return removeAccents(key).toLowerCase().trim().includes('matricula')
    })

    if (!matriculaKey) throw new UnprocessableEntityException('Coluna "Matrícula" não encontrada')

    return dados.map((item: Record<string, string>) => {
      return {
        matricula: String(item[matriculaKey]).trim()
      }
    })
  }

  /**
   * Processa todos as inscrições, criando ou atualizando no banco
   */
  private async processarInscricoes(inscricoesLista: ParsedInscricao[], chamadaId: string, campusId: string) {
    const errors: string[] = []

    for (const inscricao of inscricoesLista) {
      try {
        const aluno = await this.alunosService.getOneByMatricula(inscricao.matricula, campusId)
        if (!aluno) throw new Error(`Aluno com matrícula '${inscricao.matricula}' não encontrado`)

        const dadosInsert: InferInsertModel<typeof inscricoes> = {
          chamadaId,
          alunoId: aluno.id,
          suap: false,
          status: 'pendente',
          dataHoraInscricao: new Date(),
          inseridoPeloColaborador: true
        }

        const dadosUpdate: Partial<InferInsertModel<typeof inscricoes>> = {
          chamadaId,
          alunoId: aluno.id,
          suap: false,
          inseridoPeloColaborador: true
        }

        await this.db
          .insert(inscricoes)
          .values(dadosInsert)
          .onConflictDoUpdate({ target: [inscricoes.alunoId, inscricoes.chamadaId], set: dadosUpdate })
          .returning({ id: inscricoes.id })
      } catch (err) {
        this.logger.error(`Erro ao processar inscrição '${inscricao.matricula}'`, err)
        errors.push(err.message)
      }
    }

    return { errors }
  }
}

export type ParsedInscricaoSUAP = ReturnType<ChamadasImportarAlunosService['transformarDadosInscricoesSUAP']>[number]
export type ParsedInscricao = ReturnType<ChamadasImportarAlunosService['parseInscricoes']>[number]
