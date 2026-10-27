import { Module } from '@nestjs/common'
import { DrizzleModule } from '../../drizzle/drizzle.module'
import { RefeicoesService } from './refeicoes.service'
import { RefeicoesController } from './refeicoes.controller'

@Module({
  imports: [DrizzleModule],
  controllers: [RefeicoesController],
  providers: [RefeicoesService],
  exports: [RefeicoesService]
})
export class RefeicoesModule {}
