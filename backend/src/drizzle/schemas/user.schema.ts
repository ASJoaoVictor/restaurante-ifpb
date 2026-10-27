import { relations, sql, SQL } from 'drizzle-orm'
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { citext } from '../drizzle.custom-types'
import { alunos } from './aluno.schema'
import { campi } from './campus.schema'
import { commonCampusSchema } from './common-campus'
import { userRole } from '../enums'

export const users = pgTable('users', {
  ...commonCampusSchema,
  name: text('name').notNull(),
  email: citext('email').notNull().unique(),
  roles: userRole()
    .array()
    .notNull()
    .generatedAlwaysAs(
      (): SQL => sql`
        ARRAY_REMOVE(ARRAY[
          CASE WHEN ${users.isAdmin} THEN 'admin'::${userRole} END,
          CASE WHEN ${users.isGestor} THEN 'gestor'::${userRole} END,
          CASE WHEN ${users.isColaborador} THEN 'colaborador'::${userRole} END,
          CASE WHEN ${users.isAluno} THEN 'aluno'::${userRole} END
        ], NULL)
      `
    ),
  phone: text('phone'),
  photoUrl: text('photo_url'),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true, mode: 'string' }),

  // Roles
  isAdmin: boolean('is_admin').notNull().default(false),
  isGestor: boolean('is_gestor').notNull().default(false),
  isColaborador: boolean('is_colaborador').notNull().default(false),
  isAluno: boolean('is_aluno').notNull().default(false)
})

export const usersRelations = relations(users, ({ one }) => ({
  campus: one(campi, { fields: [users.campusId], references: [campi.id] }),
  aluno: one(alunos)
}))
