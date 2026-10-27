import './config/dayjs.config'

import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { AppModule } from './app.module'
import { setupApp } from './config/app.config'
import { env } from './config/env.config'
import { db } from './drizzle/drizzle.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  setupApp(app)

  if (!env.VERCEL) {
    await migrate(db, { migrationsFolder: './src/drizzle/migrations' })
  }

  await app.listen(env.PORT || 3000)
}

void bootstrap()

process.on('uncaughtException', console.error)
