export const TURNOS = {
  manha: 'Manhã',
  tarde: 'Tarde',
  noite: 'Noite'
} as const

export const TURNOS_ARRAY = Object.entries(TURNOS).map(([value, label]) => ({ label, value }))
