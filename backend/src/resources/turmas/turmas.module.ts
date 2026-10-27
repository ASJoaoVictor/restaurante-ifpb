import { Module } from '@nestjs/common'
import { TurmasController } from './turmas.controller'
import { TurmasService } from './turmas.service'
import { DrizzleModule } from '../../drizzle/drizzle.module'

@Module({
  imports: [DrizzleModule],
  controllers: [TurmasController],
  providers: [TurmasService],
  exports: [TurmasService]
})
export class TurmasModule {}
