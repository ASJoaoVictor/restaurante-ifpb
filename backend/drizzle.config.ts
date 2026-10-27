import { defineConfig } from 'drizzle-kit'

// eslint-disable-next-line no-restricted-properties
const databaseURL = process.env.DATABASE_URL

if (!databaseURL) {
  throw new Error('Error: DATABASE_URL environment variable is not defined')
}

export default defineConfig({
  schema: './src/drizzle/schemas',
  out: './src/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: databaseURL },
  casing: 'snake_case'
})
