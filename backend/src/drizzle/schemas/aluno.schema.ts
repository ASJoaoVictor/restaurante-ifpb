import { relations } from 'drizzle-orm'
import { boolean, date, integer, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core'
import { commonSchema } from './common'
import { preferenciasNotificacoes } from './preferencia-notificacao.schema'
import { refeicoes } from './refeicao.schema'
import { turmas } from './turma.schema'
import { users } from './user.schema'

export const alunos = pgTable('alunos', {
  ...commonSchema,
  matricula: text('matricula').notNull().unique(),
  faltas: integer('faltas').notNull().default(0),
  suspensoAte: date('suspenso_ate'),
  observacoes: text('observacoes'),
  cidade: text('cidade').notNull(),
  estado: text('estado').notNull(),
  usuarioId: uuid('usuario_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .unique(),
  turmaId: uuid('turma_id').references(() => turmas.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  possuiNEE: boolean('possui_nee').notNull().default(false),

  boasVindas: boolean('boas_vindas').notNull().default(false),
  notificacoesConfiguradas: boolean('notificacoes_configuradas').notNull().default(false)
})

export const alunosRefeicoesRestricao = pgTable(
  'alunos_refeicoes_restricao',
  {
    alunoId: uuid('aluno_id')
      .notNull()
      .references(() => alunos.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    refeicaoId: uuid('refeicao_id')
      .notNull()
      .references(() => refeicoes.id, { onDelete: 'cascade', onUpdate: 'cascade' })
  },
  (table) => [primaryKey({ columns: [table.alunoId, table.refeicaoId] })]
)

export const alunosRelations = relations(alunos, ({ one, many }) => ({
  usuario: one(users, { fields: [alunos.usuarioId], references: [users.id] }),
  preferenciasNotificacoes: many(preferenciasNotificacoes)
}))

export const alunosRefeicoesRestricaoRelations = relations(alunosRefeicoesRestricao, ({ one }) => ({
  aluno: one(alunos, { fields: [alunosRefeicoesRestricao.alunoId], references: [alunos.id] }),
  refeicao: one(refeicoes, { fields: [alunosRefeicoesRestricao.refeicaoId], references: [refeicoes.id] })
}))
