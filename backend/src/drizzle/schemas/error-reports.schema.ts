import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { commonSchema } from './common'
import { users } from './user.schema'

export const errorReports = pgTable('error_reports', {
  ...commonSchema,
  time: timestamp('time', { withTimezone: true, mode: 'string' }).defaultNow(),
  name: text('name'),
  message: text('message'),
  stack: text('stack'),
  type: text('type'),
  details: text('details'),
  url: text('url'),
  userAgent: text('user_agent'),
  userIP: text('user_ip'),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null', onUpdate: 'cascade' })
})

export const errorReportsRelations = relations(errorReports, ({ one }) => ({
  user: one(users, { fields: [errorReports.userId], references: [users.id] })
}))
