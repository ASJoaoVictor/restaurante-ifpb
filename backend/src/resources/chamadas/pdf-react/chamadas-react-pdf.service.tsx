import { Injectable } from '@nestjs/common'
import { renderToStream } from '@react-pdf/renderer'
import React from 'react'
import { Readable } from 'stream'
import { PresencaStatus } from '../../../drizzle/enums'
import { sanitizeFilename } from '../../../utils/formatters'
import { InscricaoComAluno } from '../../inscricoes/entities/inscricao.entity'
import { ChamadasService } from '../chamadas.service'
import { InscricoesPdfFilter, InscricoesPdfQueryDto } from '../dto/chamada.dto'
import { Chamada } from '../entities/chamada.entity'
import { InscricoesPdfDocument, InscricoesPdfRow } from './inscricoes-pdf.document'

@Injectable()
export class ChamadasReactPdfService {
  constructor(private readonly chamadasService: ChamadasService) {}

  async gerarListaInscricoes(
    chamadaId: string,
    campusId: string,
    options: InscricoesPdfQueryDto
  ): Promise<{ data: Readable; filename: string } | null> {
    const result = await this.chamadasService.getOneWithInscricoes(chamadaId, campusId)
    if (!result) return null

    const contemplados = result.inscricoes.filter(({ inscricao }) => inscricao.valida)
    const inscricoes = this.filterAndSort(result.inscricoes, contemplados, options)
    const rows = inscricoes.map((inscricao) => this.toRow(inscricao, result.chamada))
    const data = (await renderToStream(
      <InscricoesPdfDocument
        chamada={result.chamada}
        rows={rows}
        title={this.getTitle(options)}
        totalContemplados={contemplados.length}
      />
    )) as Readable

    return {
      data,
      filename: sanitizeFilename(`${this.getFilenamePrefix(options)} - ${result.chamada.nome}.pdf`)
    }
  }

  private filterAndSort(todas: InscricaoComAluno[], contemplados: InscricaoComAluno[], options: InscricoesPdfQueryDto) {
    const presencaPorFiltro: Record<InscricoesPdfFilter, PresencaStatus> = {
      ausentes: 'ausente',
      desistentes: 'desistente',
      presentes: 'presente'
    } as const
    const filtroPresenca = options.filter ? presencaPorFiltro[options.filter] : undefined
    const filtradas = filtroPresenca
      ? todas.filter(({ inscricao }) => inscricao.presenca === filtroPresenca)
      : options.todos
        ? todas
        : contemplados
    const inscricoes = [...filtradas]

    if (options.orderBy === 'alfabetica') {
      inscricoes.sort((a, b) => {
        const byName = a.usuario.name.localeCompare(b.usuario.name, 'pt-BR', { sensitivity: 'base' })
        return byName || a.inscricao.id.localeCompare(b.inscricao.id)
      })
    }

    return inscricoes
  }

  private toRow(inscricao: InscricaoComAluno, chamada: Chamada): InscricoesPdfRow {
    return {
      badges: this.getBadges(inscricao, chamada),
      id: inscricao.inscricao.id,
      name: inscricao.usuario.name
    }
  }

  private getBadges({ aluno, inscricao, turma }: InscricaoComAluno, chamada: Chamada) {
    const badges: string[] = []
    if (aluno.faltas) badges.push(`${aluno.faltas} ${aluno.faltas === 1 ? 'falta' : 'faltas'}`)
    if (inscricao.suap) badges.push('SUAP')
    if (aluno.possuiNEE) badges.push('NEE*')
    if (inscricao.temAulaContraturno && inscricao.comprovanteContraturnoStatus === 'aceito') {
      badges.push('Aula no contraturno')
    }
    if (chamada.priorizarMesmoTurno && chamada.turno && turma?.turno === chamada.turno) {
      badges.push('Prioridade por turno')
    }
    return badges
  }

  private getTitle({ todos, orderBy, filter }: InscricoesPdfQueryDto) {
    let lista = todos ? 'TODAS AS INSCRIÇÕES' : 'LISTA DE CONTEMPLADOS'
    if (filter) lista = `LISTA DE ALUNOS ${filter.toUpperCase()}`
    const ordenacao = orderBy === 'prioridade' ? 'ORDEM DE PRIORIDADE' : 'ORDEM ALFABÉTICA'
    return `${lista} EM ${ordenacao}`
  }

  private getFilenamePrefix({ todos, filter }: InscricoesPdfQueryDto): string {
    if (filter) return `Lista de ${filter}`
    return todos ? 'Lista de inscritos' : 'Lista de contemplados'
  }
}
