import { integer, pgTable, text } from 'drizzle-orm/pg-core'
import { commonCampusSchema } from './common-campus'
import { campi } from './campus.schema'
import { relations } from 'drizzle-orm/relations'

export const cursos = pgTable('cursos', {
  ...commonCampusSchema,
  nome: text('nome').notNull(),
  nomeCurto: text('nome_curto').notNull(),
  numeroCurso: integer('numero_curso').notNull().unique()
})

export const cursosRelations = relations(cursos, ({ one }) => ({
  campus: one(campi, { fields: [cursos.campusId], references: [campi.id] })
}))
