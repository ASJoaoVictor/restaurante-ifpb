import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException
} from '@nestjs/common'
import dayjs from 'dayjs'
import { and, eq, getTableColumns, inArray, InferInsertModel } from 'drizzle-orm'
import { createReadStream } from 'fs'
import { DRIZZLE } from '../../drizzle/drizzle.module'
import { DrizzleDB } from '../../drizzle/drizzle.types'
import { chamadas, inscricoes } from '../../drizzle/schemas'
import { DAYS } from '../../utils/date'
import { AlunosService } from '../alunos/alunos.service'
import { ChamadasService } from '../chamadas/chamadas.service'
import { NotificacoesService } from '../notificacoes/notificacoes.service'
import { RefeicoesService } from '../refeicoes/refeicoes.service'
import { FileStorage } from '../storage/base.storage'
import { TurmasService } from '../turmas/turmas.service'
import { AvaliarDocumentoComprobatorioDto, CreateInscricaoDto, MarcarPresencaDto } from './dto/inscricao.dto'

@Injectable()
export class InscricoesService {
  constructor(
    private readonly fileStorage: FileStorage,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    @Inject(forwardRef(() => TurmasService)) private readonly turmasService: TurmasService,
    @Inject(forwardRef(() => ChamadasService)) private readonly chamadasService: ChamadasService,
    @Inject(forwardRef(() => AlunosService)) private readonly alunosService: AlunosService,
    @Inject(forwardRef(() => NotificacoesService)) private readonly notificacoesService: NotificacoesService,
    @Inject(forwardRef(() => RefeicoesService)) private readonly refeicoesService: RefeicoesService
  ) {}

  private async getInscricaoAluno(chamadaId: string, alunoId: string) {
    const [result] = await this.db
      .select(InscricoesService.getFlatColumns())
      .from(inscricoes)
      .where(and(eq(inscricoes.chamadaId, chamadaId), eq(inscricoes.alunoId, alunoId)))
      .limit(1)

    if (!result) return null
    return result
  }

  async update(id: string, campusId: string, data: Partial<InferInsertModel<typeof inscricoes>>) {
    const [result] = await this.db
      .update(inscricoes)
      .set(data)
      .where(and(eq(inscricoes.id, id), this.whereCampus(campusId)))
      .returning(InscricoesService.getFlatColumns())

    if (!result) return null
    return result
  }

  async remove(id: string, campusId: string) {
    const [result] = await this.db
      .delete(inscricoes)
      .where(and(eq(inscricoes.id, id), this.whereCampus(campusId)))
      .returning(InscricoesService.getFlatColumns())

    if (!result) return null
    return result
  }

  public async createInscricao(chamadaId: string, campusId: string, userId: string, data: CreateInscricaoDto) {
    const chamada = await this.chamadasService.getOne(chamadaId, campusId)
    if (!chamada) throw new NotFoundException('A chamada que você tentou se inscrever foi excluída')

    const aluno = await this.alunosService.getOneByUserId(userId, campusId)
    if (!aluno) throw new NotFoundException('Aluno não encontrado')

    if (AlunosService.isSuspenso(aluno)) {
      throw new BadRequestException(
        `Você está suspenso por faltas até ${dayjs(aluno.suspensoAte).format('DD [de] MMMM')}, e não pode se inscrever em chamadas`
      )
    }

    const temRestricao = await this.refeicoesService.temRestricao(chamada.refeicaoId, aluno.id)
    if (temRestricao) {
      throw new BadRequestException(
        'Você não pode se inscrever nesta chamada porque possui edital de alimentação. Por favor, se inscreva pelo SUAP.'
      )
    }

    const inscricaoExistente = await this.getInscricaoAluno(chamadaId, aluno.id)
    if (inscricaoExistente) throw new BadRequestException('Você já está inscrito nesta chamada')

    if (!chamada.podeInscrever) throw new PreconditionFailedException('Esta chamada não está mais aceitando inscrições')

    // Valida o comprovante
    const turma = await this.turmasService.getOne(aluno.turmaId!, campusId)
    const diaChamada = DAYS[dayjs(chamada.data).day()]
    const temContraturnoComprovado = turma?.diasContraturno.includes(diaChamada)

    const precisaComprovante = data.temAulaContraturno && !temContraturnoComprovado
    if (precisaComprovante && !data.file) {
      throw new BadRequestException('O envio do comprovante é obrigatório')
    }

    // Salva o arquivo do comprovante
    const originalFileName = data.file.originalname
    const bufferOrStream = data.file.buffer || data.file.stream || createReadStream(data.file.path)
    let fileName: string | null = null
    if (precisaComprovante) {
      fileName = await this.fileStorage.saveFile(originalFileName, bufferOrStream)
    }

    // Salva a inscrição
    const [result] = await this.db
      .insert(inscricoes)
      .values({
        chamadaId,
        alunoId: aluno.id,
        dataHoraInscricao: new Date(),
        temAulaContraturno: data.temAulaContraturno,
        documentoComprobatorio: fileName
      })
      .returning(InscricoesService.getFlatColumns())

    if (!result) return null
    return result
  }

  public async cancelarInscricao(chamadaId: string, campusId: string, userId: string) {
    const chamada = await this.chamadasService.getOne(chamadaId, campusId)
    if (!chamada) throw new NotFoundException('Esta chamada foi excluída')

    const aluno = await this.alunosService.getOneByUserId(userId, campusId)
    if (!aluno) throw new NotFoundException('Você não está cadastrado como aluno')

    const inscricaoExistente = await this.getInscricaoAluno(chamadaId, aluno.id)
    if (!inscricaoExistente) throw new BadRequestException('Você não está inscrito nesta chamada')

    if (!chamada.podeCancelarInscricao) {
      throw new PreconditionFailedException('Esta chamada não está aceitando cancelamentos')
    }

    const [result] = await this.db
      .update(inscricoes)
      .set({ dataHoraCancelamento: new Date().toISOString() })
      .where(and(eq(inscricoes.id, inscricaoExistente.id), eq(inscricoes.chamadaId, chamadaId)))
      .returning(InscricoesService.getFlatColumns())

    if (!result) return null
    return result
  }

  async verificarPresenca(chamadaId: string, alunoId: string, campusId: string) {
    const chamada = await this.chamadasService.getOne(chamadaId, campusId)
    if (!chamada) throw new NotFoundException(`Chamada with id '${chamadaId}' not found`)

    const aluno = await this.alunosService.getOne(alunoId, campusId)
    if (!aluno) throw new NotFoundException('O aluno com este QR code não existe')

    const inscricao = await this.getInscricaoAluno(chamadaId, alunoId)

    return { aluno, inscricao }
  }

  async marcarPresenca(inscricaoId: string, campusId: string, data: MarcarPresencaDto) {
    const result = this.update(inscricaoId, campusId, { presenca: data.presenca })
    if (!result) return null
    return result
  }

  async presencaForaDaListaColaborador(chamadaId: string, campusId: string, alunoId: string) {
    await this.db.insert(inscricoes).values({
      alunoId,
      chamadaId,
      dataHoraInscricao: new Date(),
      inseridoPeloColaborador: true,
      status: 'aceita',
      emListaEspera: true
    })
  }

  async avaliarDocumentoComprobatorio(inscricaoId: string, campusId: string, data: AvaliarDocumentoComprobatorioDto) {
    const result = await this.update(inscricaoId, campusId, data)
    if (!result) throw new NotFoundException(`Inscrição with id '${inscricaoId}' not found`)
    if (data.comprovanteContraturnoStatus === 'rejeitado') {
      void this.notificacoesService.notificarComprovanteRejeitado(inscricaoId)
    }
  }

  whereCampus(campusId: string) {
    return inArray(
      inscricoes.chamadaId,
      this.db.select({ id: chamadas.id }).from(chamadas).where(eq(chamadas.campusId, campusId))
    )
  }

  static getFlatColumns() {
    const { ...columns } = getTableColumns(inscricoes)
    return columns
  }

  static getAlunoColumns() {
    const { inseridoPeloGestor, inseridoPeloColaborador, ...columns } = getTableColumns(inscricoes)
    return columns
  }
}
