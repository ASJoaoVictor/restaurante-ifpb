import { Module, OnApplicationShutdown } from '@nestjs/common'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '../config/env.config'
import { DrizzleDB } from './drizzle.types'
import * as schema from './schemas'

export const DRIZZLE = Symbol('drizzle-connection')
const databaseURL = env.DATABASE_URL
export const pool = new Pool({ connectionString: databaseURL })
export const db = drizzle(pool, { schema, casing: 'snake_case' }) as DrizzleDB

@Module({
  providers: [{ provide: DRIZZLE, useFactory: () => db }],
  exports: [DRIZZLE]
})
export class DrizzleModule implements OnApplicationShutdown {
  async onApplicationShutdown() {
    await pool.end()
  }
}
