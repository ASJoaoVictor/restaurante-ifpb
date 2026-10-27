import { Injectable } from '@nestjs/common'
import dayjs from 'dayjs'
import { InscricaoStatus, PresencaStatus } from '../../drizzle/enums'
import { createCsv, type CsvCell } from '../../utils/csv'
import { formatTurma, sanitizeFilename } from '../../utils/formatters'
import { yesNo } from '../../utils/helpers'
import { InscricaoComAluno } from '../inscricoes/entities/inscricao.entity'
import { ChamadasService } from './chamadas.service'

const HEADERS = [
  'Posição',
  'Nome',
  'Turma',
  'Curso',
  'Status',
  'Inserido pelo SUAP',
  'Cancelado',
  'Presença',
  'Data/hora inscrição',
  'Adicionado pelo gestor?',
  'Adicionado pelo colaborador?'
] as const

type CsvHeader = (typeof HEADERS)[number]

const STATUS_LABELS: Record<InscricaoStatus, string> = {
  pendente: 'Pendente',
  aceita: 'Aceita',
  rejeitada: 'Rejeitada'
}

const PRESENCA_LABELS: Record<PresencaStatus, string> = {
  pendente: 'Pendente',
  presente: 'Presente',
  ausente: 'Ausente',
  desistente: 'Desistente'
}

@Injectable()
export class ChamadasCsvService {
  constructor(private readonly chamadasService: ChamadasService) {}

  async gerarListaInscricoes(chamadaId: string, campusId: string): Promise<{ data: Buffer; filename: string } | null> {
    const result = await this.chamadasService.getOneWithInscricoes(chamadaId, campusId)
    if (!result) return null

    const rows = result.inscricoes.map((item, index) => {
      const row = this.getRow(item, index + 1)
      return HEADERS.map((header) => row[header])
    })
    const filename = sanitizeFilename(`${result.chamada.data} - ${result.chamada.nome}.csv`)

    return { data: createCsv(HEADERS, rows), filename }
  }

  private getRow({ inscricao, turma, curso, usuario }: InscricaoComAluno, posicao: number): Record<CsvHeader, CsvCell> {
    return {
      'Adicionado pelo colaborador?': yesNo(inscricao.inseridoPeloColaborador),
      'Adicionado pelo gestor?': yesNo(inscricao.inseridoPeloGestor),
      Cancelado: yesNo(Boolean(inscricao.dataHoraCancelamento)),
      Curso: curso?.nome ?? '(Sem curso)',
      'Data/hora inscrição': dayjs(inscricao.dataHoraInscricao).format('HH:mm DD/MM/YYYY'),
      'Inserido pelo SUAP': yesNo(inscricao.suap),
      Nome: usuario.name,
      Posição: posicao,
      Presença: PRESENCA_LABELS[inscricao.presenca],
      Status: STATUS_LABELS[inscricao.status],
      Turma: formatTurma(turma, curso)
    }
  }
}
