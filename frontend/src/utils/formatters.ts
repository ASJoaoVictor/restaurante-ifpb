import { Curso, FlatTurma, TurmaDiasContraturnoItem } from '@/api/endpoints/api.schemas'
import dayjs from 'dayjs'
import { DAYS } from './date'

/**
 * Formata um valor booleano para 'Sim' ou 'Não' em português
 * @param value - O valor booleano a ser formatado
 * @returns 'Sim' se verdadeiro, 'Não' se falso
 */
export function formatYesNo(value: boolean): string {
  return value ? 'Sim' : 'Não'
}

/**
 * Formata um dia da semana para exibição em português
 * @param dia - O dia da semana do contraturno
 * @param short - Se deve retornar o nome abreviado do dia (padrão: false)
 * @returns O nome do dia da semana em português (completo ou abreviado)
 */
export function formatDia(dia: TurmaDiasContraturnoItem, short = false) {
  const weekdays = short ? dayjs.weekdaysShort() : dayjs.weekdays()
  return weekdays[DAYS.indexOf(dia)]
}

export function formatHoraMin(tempo?: string | null) {
  if (!tempo) return null
  return dayjs(tempo, 'HH:mm').format('HH:mm')
}

/**
 * Formata a exibição de uma turma com informações do curso
 * @param turma - Os dados da turma (formato flat)
 * @param curso - Os dados do curso
 * @returns String formatada no padrão "[período]º [nome curto do curso] - [turma]" ou "(Sem turma)" se dados inválidos
 * @example
 * formatTurma({ periodo: 3, turma: 'A' }, { nomeCurto: 'ADS' })
 * // retorna "3º ADS - A"
 */
export function formatTurma(turma: Pick<FlatTurma, 'periodo' | 'turma'>, curso: Pick<Curso, 'nomeCurto'>) {
  if (!turma || !curso) return '(Sem turma)'

  let turmaNome = turma.turma

  // Se não houver nome na turma, retorna CURSO - P[período]
  // Ex: ADS - P3
  if (turmaNome === '') return `${curso.nomeCurto} - P${turma.periodo}`

  // Substitui turmas do tipo "1D", "2D", etc por "G1", "G2", etc.
  turmaNome = turmaNome.replace(/^([0-9])D$/, 'G$1')

  return `${turma.periodo}º ${curso.nomeCurto} - ${turmaNome}`
}

export function getSaudacao(): string {
  const hours = new Date().getHours()
  if (hours <= 4) return 'Boa noite'
  if (hours >= 18) return 'Boa noite'
  if (hours >= 12) return 'Boa tarde'
  return 'Bom dia'
}

export function getNome(nome?: string): string {
  if (!nome) return ''

  const partes = nome.trim().split(/\s+/)
  const limite = partes[1]?.length <= 2 ? 3 : 2

  return partes.slice(0, limite).join(' ')
}
