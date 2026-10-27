import { uuid } from 'drizzle-orm/pg-core'
import { campi } from './campus.schema'
import { commonSchema } from './common'

export const commonCampusSchema = {
  ...commonSchema,
  campusId: uuid('campus_id')
    .notNull()
    .references(() => campi.id, { onDelete: 'cascade', onUpdate: 'cascade' })
} as const
