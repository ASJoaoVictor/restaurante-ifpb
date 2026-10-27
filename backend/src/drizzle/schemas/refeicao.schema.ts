import { boolean, integer, pgTable, text, time } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { campi } from './campus.schema'
import { commonCampusSchema } from './common-campus'
import { diaDaSemanaEnum, turno } from '../enums'

export const refeicoes = pgTable('refeicoes', {
  ...commonCampusSchema,
  nome: text('nome').notNull(),
  diaDaSemana: diaDaSemanaEnum('dia_da_semana'),
  vagas: integer('vagas'),
  turno: turno('turno'),
  priorizarMesmoTurno: boolean('priorizar_mesmo_turno').notNull().default(false),

  horarioAbertura: time('horario_abertura'),
  horarioFechamento: time('horario_fechamento'),
  horarioDivulgacaoResultado: time('horario_divulgacao_resultado'),
  horarioFinalizacao: time('horario_finalizacao'),
  horarioEncerramento: time('horario_encerramento'),

  deslocamentoDataAbertura: integer('deslocamento_data_abertura').notNull().default(0),
  deslocamentoDataFechamento: integer('deslocamento_data_fechamento').notNull().default(0),
  deslocamentoDataDivulgacao: integer('deslocamento_data_divulgacao').notNull().default(0),
  deslocamentoDataFinalizacao: integer('deslocamento_data_finalizacao').notNull().default(0),
  deslocamentoDataEncerramento: integer('deslocamento_data_encerramento').notNull().default(0),

  aberturaAutomatica: boolean('abertura_automatica').notNull().default(false),
  fechamentoAutomatico: boolean('fechamento_automatico').notNull().default(false),
  divulgacaoAutomatica: boolean('divulgacao_automatica').notNull().default(false),
  finalizacaoAutomatica: boolean('finalizacao_automatica').notNull().default(false),
  encerramentoAutomatico: boolean('encerramento_automatico').notNull().default(false)
})

export const refeicoesRelations = relations(refeicoes, ({ one }) => ({
  campus: one(campi, { fields: [refeicoes.campusId], references: [campi.id] })
}))
