import { relations } from 'drizzle-orm'
import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { campi } from './campus.schema'
import { commonCampusSchema } from './common-campus'
import { cursos } from './curso.schema'
import { diaDaSemanaEnum, turno } from '../enums'

export const turmas = pgTable('turmas', {
  ...commonCampusSchema,
  periodo: integer('periodo').notNull(),
  turma: text('turma').notNull(),
  diasContraturno: diaDaSemanaEnum('dias_contraturno').array().notNull().default([]),
  turno: turno('turno'),
  cursoId: uuid('curso_id')
    .notNull()
    .references(() => cursos.id, { onDelete: 'cascade', onUpdate: 'cascade' })
})

export const turmasRelations = relations(turmas, ({ one }) => ({
  campus: one(campi, { fields: [turmas.campusId], references: [campi.id] }),
  curso: one(cursos, { fields: [turmas.cursoId], references: [cursos.id] })
}))
