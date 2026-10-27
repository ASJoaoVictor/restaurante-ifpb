import { pool } from '../src/drizzle/drizzle.module'
import { createDefaultData, resetDatabase } from './utils/database'

export default async () => {
  // Limpa o banco de dados
  await resetDatabase()

  // Cria dados padrão no banco de dados
  await createDefaultData()

  // Encerra a conexão com o banco de dados
  await pool.end()
}
