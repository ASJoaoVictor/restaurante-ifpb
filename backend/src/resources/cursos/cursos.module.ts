import { Module } from '@nestjs/common'
import { DrizzleModule } from '../../drizzle/drizzle.module'
import { CursosController } from './cursos.controller'
import { CursosService } from './cursos.service'

@Module({
  imports: [DrizzleModule],
  controllers: [CursosController],
  providers: [CursosService],
  exports: [CursosService]
})
export class CursosModule {}
