import { SQL, sql } from 'drizzle-orm'
import { boolean, date, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { campi } from './campus.schema'
import { refeicoes } from './refeicao.schema'
import { commonCampusSchema } from './common-campus'
import { chamadaStatusEnum, turno } from '../enums'
import { users } from './user.schema'

export const chamadas = pgTable('chamadas', {
  ...commonCampusSchema,
  refeicaoId: uuid('refeicao_id').references(() => refeicoes.id, { onDelete: 'set null', onUpdate: 'cascade' }),
  criadoPor: uuid('criado_por').references(() => users.id, { onDelete: 'set null', onUpdate: 'cascade' }),

  nome: text('nome').notNull(),
  vagas: integer('vagas'),
  turno: turno('turno'),
  priorizarMesmoTurno: boolean('priorizar_mesmo_turno').notNull().default(false),

  dataHoraAbertura: timestamp('data_hora_abertura', { mode: 'string' }),
  dataHoraFechamento: timestamp('data_hora_fechamento', { mode: 'string' }),
  dataHoraDivulgacaoResultado: timestamp('data_hora_divulgacao_resultado', { mode: 'string' }),
  dataHoraFinalizacao: timestamp('data_hora_finalizacao', { mode: 'string' }),
  dataHoraEncerramento: timestamp('data_hora_encerramento', { mode: 'string' }),

  aberturaAutomatica: boolean('abertura_automatica').default(false).notNull(),
  finalizacaoAutomatica: boolean('finalizacao_automatica').default(false).notNull(),
  divulgacaoAutomatica: boolean('divulgacao_automatica').default(false).notNull(),
  fechamentoAutomatico: boolean('fechamento_automatico').default(false).notNull(),
  encerramentoAutomatico: boolean('encerramento_automatico').default(false).notNull(),

  data: date('data', { mode: 'string' }).notNull(),
  dataHoraAberturaReal: timestamp('data_hora_abertura_real', { mode: 'string' }),
  dataHoraFechamentoReal: timestamp('data_hora_fechamento_real', { mode: 'string' }),
  dataHoraDivulgacaoResultadoReal: timestamp('data_hora_divulgacao_resultado_real', { mode: 'string' }),
  dataHoraFinalizacaoReal: timestamp('data_hora_finalizacao_real', { mode: 'string' }),
  dataHoraEncerramentoReal: timestamp('data_hora_encerramento_real', { mode: 'string' }),

  status: chamadaStatusEnum('status')
    .notNull()
    .generatedAlwaysAs(
      (): SQL => sql`
        CASE
          WHEN ${chamadas.dataHoraEncerramentoReal} IS NOT NULL THEN 'encerrada'::${chamadaStatusEnum}
          WHEN ${chamadas.dataHoraFinalizacaoReal} IS NOT NULL THEN 'finalizada'::${chamadaStatusEnum}
          WHEN ${chamadas.dataHoraDivulgacaoResultadoReal} IS NOT NULL THEN 'divulgada'::${chamadaStatusEnum}
          WHEN ${chamadas.dataHoraFechamentoReal} IS NOT NULL THEN 'fechada'::${chamadaStatusEnum}
          WHEN ${chamadas.dataHoraAberturaReal} IS NOT NULL THEN 'aberta'::${chamadaStatusEnum}
          ELSE 'pendente'::${chamadaStatusEnum}
        END
      `
    ),

  estaAberta: boolean('esta_aberta')
    .notNull()
    .generatedAlwaysAs(
      (): SQL => sql`
        ${chamadas.dataHoraAberturaReal} IS NOT NULL
        AND ${chamadas.dataHoraFechamentoReal} IS NULL
        AND ${chamadas.dataHoraDivulgacaoResultadoReal} IS NULL
        AND ${chamadas.dataHoraFinalizacaoReal} IS NULL
        AND ${chamadas.dataHoraEncerramentoReal} IS NULL
      `
    ),

  estaFechada: boolean('esta_fechada')
    .notNull()
    .generatedAlwaysAs((): SQL => sql`${chamadas.dataHoraFechamentoReal} IS NOT NULL`),

  resultadoDivulgado: boolean('resultado_divulgado')
    .notNull()
    .generatedAlwaysAs((): SQL => sql`${chamadas.dataHoraDivulgacaoResultadoReal} IS NOT NULL`),

  estaFinalizada: boolean('esta_finalizada')
    .notNull()
    .generatedAlwaysAs((): SQL => sql`${chamadas.dataHoraFinalizacaoReal} IS NOT NULL`),

  estaEncerrada: boolean('esta_encerrada')
    .notNull()
    .generatedAlwaysAs((): SQL => sql`${chamadas.dataHoraEncerramentoReal} IS NOT NULL`),

  podeInscrever: boolean('pode_inscrever')
    .notNull()
    .generatedAlwaysAs(
      (): SQL => sql`
        ${chamadas.dataHoraAberturaReal} IS NOT NULL
        AND ${chamadas.dataHoraFechamentoReal} IS NULL
        AND ${chamadas.dataHoraDivulgacaoResultadoReal} IS NULL
        AND ${chamadas.dataHoraFinalizacaoReal} IS NULL
        AND ${chamadas.dataHoraEncerramentoReal} IS NULL
      `
    ),

  podeCancelarInscricao: boolean('pode_cancelar_inscricao')
    .notNull()
    .generatedAlwaysAs(
      (): SQL => sql`
        ${chamadas.dataHoraAberturaReal} IS NOT NULL
        AND ${chamadas.dataHoraFinalizacaoReal} IS NULL
        AND ${chamadas.dataHoraEncerramentoReal} IS NULL
      `
    )
})

export const chamadasRelations = relations(chamadas, ({ one }) => ({
  campus: one(campi, { fields: [chamadas.campusId], references: [campi.id] }),
  refeicao: one(refeicoes, { fields: [chamadas.refeicaoId], references: [refeicoes.id] }),
  criadoPor: one(users, { fields: [chamadas.criadoPor], references: [users.id] })
}))
