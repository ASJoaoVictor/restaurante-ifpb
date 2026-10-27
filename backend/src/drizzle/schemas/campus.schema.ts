import { relations } from 'drizzle-orm'
import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { refeicoes } from './refeicao.schema'
import { chamadas } from './chamada.schema'
import { commonSchema } from './common'
import { cursos } from './curso.schema'
import { turmas } from './turma.schema'
import { users } from './user.schema'

export const campi = pgTable('campi', {
  ...commonSchema,
  nome: text('nome').notNull(),
  cidade: text('cidade').notNull(),
  estado: text('estado').notNull(),
  maximoDeFaltas: integer('maximo_de_faltas').notNull().default(5),
  diasDeSuspensao: integer('dias_de_suspensao').notNull().default(30)
})

export const campiRelations = relations(campi, ({ many }) => ({
  refeicoes: many(refeicoes),
  chamadas: many(chamadas),
  cursos: many(cursos),
  turmas: many(turmas),
  usuarios: many(users)
}))
