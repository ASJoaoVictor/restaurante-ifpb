import { sql } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db } from '../../src/drizzle/drizzle.module'
import { campi, users } from '../../src/drizzle/schemas'

/** Limpa o banco de dados */
export async function resetDatabase() {
  await db.execute(sql`
    DROP SCHEMA IF EXISTS public, drizzle CASCADE;
    CREATE SCHEMA public;
  `)

  await migrate(db, { migrationsFolder: './src/drizzle/migrations' })
}

/** Cria dados padrão no banco de dados */
export async function createDefaultData() {
  await createDefaultCampus()
  await createAdminUser()
}

/** Cria um campus padrão no banco de dados */
export async function createDefaultCampus() {
  await db.insert(campi).values({
    id: '00000000-0000-0000-0000-000000000000',
    nome: 'Campus Teste',
    cidade: 'Teste',
    estado: 'TT'
  })
}

/** Cria um usuário admin padrão no banco de dados */
export async function createAdminUser() {
  await db.insert(users).values({
    campusId: '00000000-0000-0000-0000-000000000000',
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Admin',
    email: 'admin@admin.com',
    phone: '(00) 00000-0000',
    isAdmin: true
  })
}
