import sanitize from 'sanitize-filename'
import { v4 as uuidv4 } from 'uuid'
import { Curso } from '../resources/cursos/entities/curso.entity'
import { FlatTurma } from '../resources/turmas/entities/turma.entity'

/**
 * Formata a exibição de uma turma com informações do curso
 * @param turma - Os dados da turma (formato flat)
 * @param curso - Os dados do curso
 * @returns String formatada no padrão "[período]º [nome curto do curso] - [turma]" ou "(Sem turma)" se dados inválidos
 * @example
 * formatTurma({ periodo: 3, turma: 'A' }, { nomeCurto: 'ADS' })
 * // retorna "3º ADS - A"
 */
export function formatTurma(
  turma: Pick<FlatTurma, 'periodo' | 'turma'> | null,
  curso: Pick<Curso, 'nomeCurto'> | null
) {
  if (!turma || !curso) return '(Sem turma)'

  let turmaNome = turma.turma

  // Se não houver nome na turma, retorna CURSO - P[período]
  // Ex: ADS - P3
  if (turmaNome === '') return `${curso.nomeCurto} - P${turma.periodo}`

  // Substitui turmas do tipo "1D", "2D", etc por "G1", "G2", etc.
  turmaNome = turmaNome.replace(/^([0-9])D$/, 'G$1')

  return `${turma.periodo}º ${curso.nomeCurto} - ${turmaNome}`
}

export function sanitizeFilename(filename: string): string {
  return sanitize(filename, { replacement: '-' }).trim() || uuidv4()
}
