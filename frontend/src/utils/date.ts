import dayjs from 'dayjs'
import capitalize from 'lodash.capitalize'

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

/**
 * Gets the next occurrence of a specific weekday.
 * If the target weekday is later in the current week, returns that date.
 * If the target weekday has already passed this week, returns the same weekday next week.
 *
 * @param weekday - The target weekday (0 = Sunday, 1 = Monday, 2 = Tuesday, ..., 6 = Saturday)
 * @returns A dayjs object representing the next occurrence of the specified weekday
 */
export function nextWeekday(weekday: number) {
  const today = dayjs()
  const target = today.day(weekday) // 0 = Sunday, 1 = Monday, ...
  return target.isAfter(today) ? target : target.add(1, 'week')
}

/**
 * Applies a time string to a base date, preserving the date portion while setting the time.
 *
 * @param baseDate - The base date object to apply the time to
 * @param timeString - The time string in 'HH:mm:ss' format to be applied
 * @returns A new dayjs object with the base date and the specified time
 */
export function applyTimeToDate(baseDate: dayjs.Dayjs, timeString: string) {
  const time = dayjs(timeString, 'HH:mm:ss')
  return baseDate.hour(time.hour()).minute(time.minute())
}

/** Dias da semana em português */
export const DAYS = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'] as const

/**
 * Converts a weekday string to its corresponding integer representation.
 * Returns null if the string does not match any known weekday.
 *
 * @param weekday - The name of the weekday (e.g., "segunda", "terca", etc.)
 * @returns The integer representation of the weekday or null if not found
 */

export function weekdayToInt(weekday: string): number | null {
  const index = DAYS.indexOf(weekday.toLowerCase() as (typeof DAYS)[number])
  return index !== -1 ? index : null
}

export const formatDate = (date: string | null, includeTime = false) => {
  if (!date) return ''

  const dayjsDate = dayjs(date)
  const dateAdverb = timeAdverb(date)
  const parts = [
    dateAdverb ? capitalize(dateAdverb) : dayjsDate.format('dddd, DD [de] MMMM'),
    includeTime ? dayjsDate.format('HH:mm') : null
  ].filter(Boolean)

  return parts.join(', ')
}
