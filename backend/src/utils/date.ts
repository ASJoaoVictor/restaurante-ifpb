import dayjs from 'dayjs'

/** Dias da semana em português */
export const DAYS = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'] as const

/**
 * Retorna um advérbio de tempo de acordo com a data
 * Exemplo: "hoje", "amanhã", "ontem"
 * @param date Data a ser verificada
 */
export function timeAdverb(date?: dayjs.ConfigType) {
  return dayjs(date).calendar(dayjs(), {
    sameDay: '[hoje]',
    nextDay: '[amanhã]',
    nextWeek: () => null,
    lastDay: '[ontem]',
    lastWeek: () => null,
    sameElse: () => null
  })
}
