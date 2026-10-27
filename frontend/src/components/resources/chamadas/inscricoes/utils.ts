import { ChamadaComInscricoes } from '@/api/endpoints/api.schemas'

/** Helper para contar inscrições válidas antes de um índice */
function countValidInscricoesBeforeIndex(inscricoes: { inscricao: any }[], index: number): number {
  return inscricoes.filter(({ inscricao }, i) => {
    if (i >= index) return false
    if (inscricao.dataHoraCancelamento !== null) return false
    if (inscricao.status === 'rejeitada') return false
    return true
  }).length
}

/** Calcula se o aluno está além das vagas disponíveis */
export function isInscricaoEmLista({ chamada, inscricoes }: ChamadaComInscricoes, index: number) {
  if (chamada.vagas === null) return false

  // Pegar quantas inscrições válidas tem antes dessa
  const inscricoesValidasAntes = countValidInscricoesBeforeIndex(inscricoes, index)

  if (inscricoesValidasAntes >= chamada.vagas) return true
  return false
}

/** Retorna true se é a primeira inscrição da lista que está em lista (útil para renderizar borda) */
export function isPrimeiraInscricaoEmLista({ chamada, inscricoes }: ChamadaComInscricoes, index: number) {
  if (chamada.vagas === null) return false

  // Pegar quantas inscrições válidas tem antes dessa
  const inscricoesValidasAntes = countValidInscricoesBeforeIndex(inscricoes, index)

  return inscricoesValidasAntes === chamada.vagas
}
