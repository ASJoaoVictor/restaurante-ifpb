import { Chamada, ChamadaStatus } from '@/api/endpoints/api.schemas'
import { ColorPalette } from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { RiArchiveLine, RiCloseLine, RiDoorOpenLine, RiLockLine, RiMegaphoneLine } from 'react-icons/ri'

export const CHAMADA_STATUS_NOME: Record<ChamadaStatus, string> = {
  pendente: 'Pendente',
  aberta: 'Aberta',
  fechada: 'Em Análise',
  divulgada: 'Resultado Divulgado',
  finalizada: 'Finalizada',
  encerrada: 'Encerrada'
}

export const CHAMADA_STATUS_COLOR: Record<ChamadaStatus, ColorPalette> = {
  pendente: 'gray',
  aberta: 'green',
  fechada: 'orange',
  divulgada: 'purple',
  finalizada: 'yellow',
  encerrada: 'red'
}

export const CHAMADA_ACOES = (
  handleAbrir: () => any,
  handleFechar: () => any,
  handleDivulgar: () => any,
  handleFinalizar: () => any,
  handleEncerrar: () => any
) =>
  ({
    pendente: ['Abrir chamada', RiDoorOpenLine, CHAMADA_STATUS_COLOR.aberta, handleAbrir],
    aberta: ['Fechar chamada', RiLockLine, CHAMADA_STATUS_COLOR.fechada, handleFechar],
    fechada: ['Divulgar resultado', RiMegaphoneLine, CHAMADA_STATUS_COLOR.divulgada, handleDivulgar],
    divulgada: ['Finalizar chamada', RiCloseLine, CHAMADA_STATUS_COLOR.finalizada, handleFinalizar],
    finalizada: ['Encerrar chamada', RiArchiveLine, CHAMADA_STATUS_COLOR.encerrada, handleEncerrar],
    encerrada: ['Chamada encerrada', RiArchiveLine, CHAMADA_STATUS_COLOR.encerrada, null]
  }) satisfies Record<ChamadaStatus, [string, IconType, string, (() => any) | null]>

export const CHAMADA_PROXIMO_STATUS_NOMES = {
  pendente: 'Abertura',
  aberta: 'Fechamento',
  fechada: 'Divulgação',
  divulgada: 'Finalização',
  finalizada: 'Encerramento',
  encerrada: null
} as const

export const CHAMADA_PROXIMO_STATUS_DATA_HORA = {
  pendente: (c: Chamada) => c.dataHoraAbertura,
  aberta: (c: Chamada) => c.dataHoraFechamento,
  fechada: (c: Chamada) => c.dataHoraDivulgacaoResultado,
  divulgada: (c: Chamada) => c.dataHoraFinalizacao,
  finalizada: (c: Chamada) => c.dataHoraEncerramento,
  encerrada: () => null
}

export const CHAMADA_PROXIMO_STATUS_AUTOMACAO = {
  pendente: (c: Chamada) => c.aberturaAutomatica,
  aberta: (c: Chamada) => c.fechamentoAutomatico,
  fechada: (c: Chamada) => c.divulgacaoAutomatica,
  divulgada: (c: Chamada) => c.finalizacaoAutomatica,
  finalizada: (c: Chamada) => c.encerramentoAutomatico,
  encerrada: () => null
}
