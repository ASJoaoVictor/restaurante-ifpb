import { customType } from 'drizzle-orm/pg-core'

/** Case insensitive text */
export const citext = customType<{ data: string }>({
  dataType() {
    return 'citext'
  }
})

/** Binary data */
export const bytea = customType<{ data: Buffer }>({
  dataType() {
    return 'bytea'
  }
})
