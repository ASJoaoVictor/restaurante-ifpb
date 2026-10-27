import { relations } from 'drizzle-orm'
import { boolean, pgTable, unique, uuid } from 'drizzle-orm/pg-core'
import { alunos } from './aluno.schema'
import { commonSchema } from './common'
import { refeicoes } from './refeicao.schema'

export const preferenciasNotificacoes = pgTable(
  'preferencias_notificacoes',
  {
    ...commonSchema,
    alunoId: uuid('aluno_id')
      .notNull()
      .references(() => alunos.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    refeicaoId: uuid('refeicao_id').references(() => refeicoes.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    porEmail: boolean('por_email').notNull().default(false),
    porWhatsApp: boolean('por_whatsapp').notNull().default(false)
  },
  (table) => [unique('unique_aluno_refeicao').on(table.alunoId, table.refeicaoId).nullsNotDistinct()]
)

export const preferenciasNotificacoesRelations = relations(preferenciasNotificacoes, ({ one }) => ({
  aluno: one(alunos, { fields: [preferenciasNotificacoes.alunoId], references: [alunos.id] }),
  refeicao: one(refeicoes, { fields: [preferenciasNotificacoes.refeicaoId], references: [refeicoes.id] })
}))
