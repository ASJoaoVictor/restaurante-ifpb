import { pgEnum } from 'drizzle-orm/pg-core'

export const diaDaSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'] as const
export const diaDaSemanaEnum = pgEnum('dias_da_semana', diaDaSemana)
export type DiaDaSemana = (typeof diaDaSemana)[number]

export const turnos = ['manha', 'tarde', 'noite'] as const
export const turno = pgEnum('turnos', turnos)
export type Turno = (typeof turnos)[number]

export const chamadaStatus = ['pendente', 'aberta', 'fechada', 'divulgada', 'finalizada', 'encerrada'] as const
export const chamadaStatusEnum = pgEnum('chamada_status', chamadaStatus)
export type ChamadaStatus = (typeof chamadaStatus)[number]

export const inscricaoStatus = ['pendente', 'aceita', 'rejeitada'] as const
export const inscricaoStatusEnum = pgEnum('inscricao_status', inscricaoStatus)
export type InscricaoStatus = (typeof inscricaoStatus)[number]

export const comprovanteContraturnoStatus = ['pendente', 'aceito', 'rejeitado'] as const
export const comprovanteContraturnoStatusEnum = pgEnum('comprovante_contraturno_status', comprovanteContraturnoStatus)
export type ComprovanteContraturnoStatus = (typeof comprovanteContraturnoStatus)[number]

export const presencaStatus = ['pendente', 'presente', 'ausente', 'desistente'] as const
export const presencaStatusEnum = pgEnum('presenca_status', presencaStatus)
export type PresencaStatus = (typeof presencaStatus)[number]

export const userRoles = ['admin', 'gestor', 'colaborador', 'aluno'] as const
export const userRole = pgEnum('roles', userRoles)
export type UserRole = (typeof userRoles)[number]
